import type {
  ChangeScopeBlock,
  CoordinationState,
  MutationCommand,
  MutationResult,
  ProviderRevision,
  Revisioned,
  RevisionedWorkItem,
  WorkItem,
  WorkItemId,
  WorkItemState,
  WorkItemStateTransition,
  RunState,
} from '../../domain/types.ts';
import type { WorkItemAdapter as WorkItemPort } from '../ports.ts';
import type { AzureHttpClient } from './http.ts';
import { decodeCoordinationState, parseChangeScope, parseCoordinationState, replaceManagedBlock } from './blocks.ts';
import { createWorkItem, listComments, patchWorkItem, queryWorkItems, readWorkItem, testRevision, type AzureApiOptions, type AzureWorkItemSnapshot } from './api.ts';
import { payloadHash } from '../../domain/mutations.ts';

export class AzureBoardsError extends Error {
  constructor(message: string) {
    super(`azure boards: ${message}`);
    this.name = 'AzureBoardsError';
  }
}

export interface AzureBoardsOptions extends AzureApiOptions {
  client: AzureHttpClient;
  projectId?: string;
  organizationUrl?: string;
  integrationTarget?: string;
  defaultDescription?: string;
  stateMap?: Partial<Record<WorkItemState, string>>;
}

const EMPTY_COORDINATION = (workItemId: string): CoordinationState => ({
  schema: 'agent-workspace/coordination-state',
  version: 1,
  workItemId,
  claim: null,
  run: null,
  lastAppliedOperation: null,
  pendingPublication: null,
});

function emptyScope(target: string): ChangeScopeBlock {
  return {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: ['**/*'],
    semanticSeams: [],
    prerequisites: [],
    integrationTarget: target || 'refs/heads/main',
  };
}

function relationWorkItemId(url: string): string | undefined {
  const match = url.match(/(?:workItems|workitems)\/(\d+)(?:$|[/?])/i);
  return match?.[1];
}

function fieldString(fields: Record<string, string>, name: string): string {
  const value = fields[name];
  return typeof value === 'string' ? value : '';
}

function runStateFor(workItemState: WorkItemState): RunState {
  switch (workItemState) {
    case 'open': return 'requested';
    case 'claimed': return 'claimed';
    case 'in-progress': return 'running';
    case 'ready-for-integration': return 'ready-for-integration';
    case 'integrated': return 'integrated';
    case 'blocked': return 'failed';
  }
}

export class AzureWorkItemAdapter implements WorkItemPort {
  readonly client: AzureHttpClient;
  readonly options: AzureBoardsOptions;
  private readonly defaultTarget: string;

  constructor(options: AzureBoardsOptions) {
    this.client = options.client;
    this.options = options;
    this.defaultTarget = options.integrationTarget ?? 'refs/heads/main';
  }

  async read(workItemId: WorkItemId): Promise<Revisioned<RevisionedWorkItem>> {
    const snapshot = await readWorkItem(this.client, this.options, workItemId);
    return this.toRevisioned(snapshot);
  }

  async listOpen(): Promise<Array<Revisioned<RevisionedWorkItem>>> {
    const ids = await queryWorkItems(
      this.client,
      this.options,
      `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = @project AND [System.State] <> 'Closed' ORDER BY [System.Id]`,
    );
    return Promise.all(ids.map((id) => this.read(id)));
  }

  async projectState(command: MutationCommand<WorkItemStateTransition>): Promise<MutationResult<WorkItemState>> {
    const current = await this.read(command.input.workItemId);
    const previousOperation = current.value.coordination.lastAppliedOperation;
    if (previousOperation?.operationId === command.operationId) {
      if (previousOperation.kind !== 'work-item-state' || previousOperation.outcome !== command.input.to) {
        return {
          operationId: command.operationId,
          disposition: 'conflict',
          revision: current.revision,
          reason: 'operation ID was already used for a different Work Item state projection',
        };
      }
      return {
        operationId: command.operationId,
        disposition: 'duplicate',
        revision: current.revision,
        value: command.input.to,
        receiptRef: `work-item:${command.input.workItemId}:operation:${command.operationId}`,
      };
    }
    if (current.revision !== command.expectedRevision) {
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale Work Item revision' };
    }
    const description = current.value.item.description ?? '';
    const nextCoordination = structuredClone(current.value.coordination);
    if (nextCoordination.run) nextCoordination.run = { ...nextCoordination.run, state: runStateFor(command.input.to) };
    nextCoordination.lastAppliedOperation = {
      operationId: command.operationId,
      kind: 'work-item-state',
      outcome: command.input.to,
      at: command.requestedAt,
    };
    const nextDescription = replaceManagedBlock(description, 'coordination-state', nextCoordination).description;
    const operations: unknown[] = [
      testRevision(command.expectedRevision),
      { op: 'test', path: '/fields/System.State', value: this.options.stateMap?.[command.input.from] ?? command.input.from },
      { op: 'replace', path: '/fields/System.State', value: this.options.stateMap?.[command.input.to] ?? command.input.to },
    ];
    if (nextDescription !== description) operations.push({ op: 'replace', path: '/fields/System.Description', value: nextDescription });
    const result = await patchWorkItem(this.client, this.options, command.input.workItemId, operations);
    return {
      operationId: command.operationId,
      disposition: 'applied',
      revision: result.revision,
      value: command.input.to,
      receiptRef: `work-item:${command.input.workItemId}:operation:${command.operationId}`,
    };
  }

  async raw(workItemId: string): Promise<AzureWorkItemSnapshot> {
    return readWorkItem(this.client, this.options, workItemId);
  }

  async updateManaged(
    command: MutationCommand<{ workItemId: string; coordination?: CoordinationState; changeScope?: ChangeScopeBlock; state?: string }>,
  ): Promise<MutationResult<RevisionedWorkItem>> {
    const current = await readWorkItem(this.client, this.options, command.input.workItemId);
    if (current.revision !== command.expectedRevision) {
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale Work Item revision' };
    }
    const description = fieldString(current.wire.fields, 'System.Description');
    let nextDescription = description;
    if (command.input.coordination) {
      nextDescription = replaceManagedBlock(nextDescription, 'coordination-state', command.input.coordination).description;
    }
    if (command.input.changeScope) {
      nextDescription = replaceManagedBlock(nextDescription, 'change-scope', command.input.changeScope).description;
    }
    const operations: unknown[] = [testRevision(command.expectedRevision)];
    if (nextDescription !== description) operations.push({ op: 'replace', path: '/fields/System.Description', value: nextDescription });
    if (command.input.state) operations.push({ op: 'replace', path: '/fields/System.State', value: command.input.state });
    const result = await patchWorkItem(this.client, this.options, command.input.workItemId, operations);
    const projected = this.toRevisioned(result).value;
    return { operationId: command.operationId, disposition: 'applied', revision: result.revision, value: projected };
  }

  async createQueueWorkItem(workItemType: string, title: string, description: string, tags: string[]): Promise<AzureWorkItemSnapshot> {
    return createWorkItem(this.client, this.options, workItemType, [
      { op: 'add', path: '/fields/System.Title', value: title },
      { op: 'add', path: '/fields/System.Description', value: description },
      { op: 'add', path: '/fields/System.Tags', value: tags.join('; ') },
    ]);
  }

  async comments(workItemId: string) {
    return listComments(this.client, this.options, workItemId);
  }

  private toRevisioned(snapshot: AzureWorkItemSnapshot): Revisioned<RevisionedWorkItem> {
    const fields = snapshot.wire.fields;
    const description = fieldString(fields, 'System.Description');
    let coordination: CoordinationState;
    try {
      coordination = parseCoordinationState(description).value;
    } catch (error) {
      if (!(error instanceof Error) || !/no coordination-state block/.test(error.message)) throw error;
      coordination = EMPTY_COORDINATION(String(snapshot.wire.id));
    }
    let changeScope: ChangeScopeBlock;
    try {
      changeScope = parseChangeScope(description).value;
    } catch (error) {
      if (!(error instanceof Error) || !/no change-scope block/.test(error.message)) throw error;
      changeScope = emptyScope(this.defaultTarget);
    }
    if (coordination.workItemId !== String(snapshot.wire.id)) throw new AzureBoardsError('coordination Work Item ID does not match provider ID');
    const dependencies = (snapshot.wire.relations ?? [])
      .filter((relation) => relation.rel.toLowerCase().includes('dependency'))
      .map((relation) => relationWorkItemId(relation.url))
      .filter((id): id is string => Boolean(id));
    const item: WorkItem = {
      id: String(snapshot.wire.id),
      title: fieldString(fields, 'System.Title'),
      description,
      dependencies,
      changeScope,
    };
    return {
      value: { item, coordination, changeScope },
      revision: snapshot.revision,
      observedAt: snapshot.observedAt,
    };
  }
}

export function workItemDescription(snapshot: AzureWorkItemSnapshot): string {
  return fieldString(snapshot.wire.fields, 'System.Description');
}

export function workItemTags(snapshot: AzureWorkItemSnapshot): string[] {
  return fieldString(snapshot.wire.fields, 'System.Tags').split(';').map((tag) => tag.trim()).filter(Boolean);
}

export function workItemPayloadHash(snapshot: AzureWorkItemSnapshot): string {
  return payloadHash({ id: snapshot.wire.id, rev: snapshot.wire.rev, fields: snapshot.wire.fields, relations: snapshot.wire.relations ?? [] });
}

export { decodeCoordinationState };
