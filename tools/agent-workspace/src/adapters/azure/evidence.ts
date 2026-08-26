import type {
  EvidencePublicationRef,
  MutationCommand,
  MutationResult,
  OperationReceipt,
  PublicationResult,
  RunEvidence,
  RunId,
} from '../../domain/types.ts';
import type { EvidenceStore } from '../ports.ts';
import { createKeyedSerializer, payloadHash } from '../../domain/mutations.ts';
import { redactEvidence } from '../../domain/redaction.ts';
import { evidenceBody, operationReceiptBody, parseMarker, parseOperationReceipt, OPERATION_RECEIPT_MARKER, EVIDENCE_MARKER } from '../../domain/records.ts';
import { parseCoordinationState, replaceManagedBlock } from './blocks.ts';
import { appendComment, listComments, queryWorkItems, readWorkItem, testRevision } from './api.ts';
import type { AzureHttpClient } from './http.ts';
import type { AzureBoardsOptions, AzureWorkItemAdapter } from './boards.ts';

export interface AzureEvidenceOptions extends AzureBoardsOptions {
  publisherId?: string;
  clock?: () => string;
}

export class AzureEvidenceStore implements EvidenceStore {
  private readonly client: AzureHttpClient;
  private readonly options: AzureBoardsOptions;
  private readonly publisherId: string;
  private readonly clock: () => string;
  private readonly serialized = createKeyedSerializer();
  private readonly boards?: AzureWorkItemAdapter;

  constructor(options: AzureEvidenceOptions, boards?: AzureWorkItemAdapter) {
    this.client = options.client;
    this.options = options;
    this.boards = boards;
    this.publisherId = options.publisherId ?? `publisher-${Math.random().toString(36).slice(2)}`;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  async reconcilePending(workItemId: string): Promise<PublicationResult> {
    return this.serialized(workItemId, async () => {
      const snapshot = await readWorkItem(this.client, this.options, workItemId);
      const description = String(snapshot.wire.fields['System.Description'] ?? '');
      let coordination;
      try {
        coordination = parseCoordinationState(description).value;
      } catch {
        return { operationId: 'none', published: true };
      }
      const pendingPublication = coordination.pendingPublication;
      if (!pendingPublication) return { operationId: 'none', published: true };
      const pending = pendingPublication.receipt;
      const comments = await listComments(this.client, this.options, workItemId);
      const matching = comments.comments.find((comment) => comment.text.includes(`${OPERATION_RECEIPT_MARKER} ${pending.operationId}`));
      let receiptRef = matching ? `comment:${matching.id}` : undefined;
      if (!matching) {
        const receipt: OperationReceipt = {
          operationId: pending.operationId,
          kind: pending.kind,
          payloadHash: pending.payloadHash,
          disposition: 'applied',
          outcome: pending.outcome,
          actor: pending.actor,
          occurredAt: pending.occurredAt,
          publishedAt: this.clock(),
          workItemId,
          references: [],
        };
        const body = pendingPublication.evidence
          ? `${evidenceBody(redactEvidence(pendingPublication.evidence), pending.operationId)}\n\n${operationReceiptBody(receipt)}`
          : operationReceiptBody(receipt);
        const appended = await appendComment(this.client, this.options, workItemId, body);
        receiptRef = `comment:${appended.id}`;
      } else if (pendingPublication.evidence) {
        const evidenceMarker = `${EVIDENCE_MARKER} ${pending.operationId}`;
        if (!comments.comments.some((comment) => comment.text.includes(evidenceMarker))) {
          await appendComment(this.client, this.options, workItemId, evidenceBody(redactEvidence(pendingPublication.evidence), pending.operationId));
        }
      }
      const refreshed = await readWorkItem(this.client, this.options, workItemId);
      const refreshedDescription = String(refreshed.wire.fields['System.Description'] ?? '');
      const refreshedCoordination = parseCoordinationState(refreshedDescription).value;
      refreshedCoordination.pendingPublication = null;
      const nextDescription = replaceManagedBlock(refreshedDescription, 'coordination-state', refreshedCoordination).description;
      await this.client.patch(
        `/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(workItemId)}`,
        [testRevision(refreshed.revision), { op: 'replace', path: '/fields/System.Description', value: nextDescription }],
        {},
        '7.1',
      );
      return { operationId: pending.operationId, published: true, receiptRef };
    });
  }

 async publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>> {
    await this.reconcilePending(command.input.workItemId);
    return this.serialized(command.input.workItemId, async () => {
      const redacted = redactEvidence(command.input);
      const expectedHash = payloadHash(command.input);
      const comments = await listComments(this.client, this.options, command.input.workItemId);
      for (const comment of comments.comments) {
        if (!comment.text.includes(`${OPERATION_RECEIPT_MARKER} ${command.operationId}`)) continue;
        try {
          const receipt = parseOperationReceipt(comment.text);
          if (receipt.payloadHash !== expectedHash) return { operationId: command.operationId, disposition: 'conflict', revision: command.expectedRevision, reason: 'operation ID payload hash mismatch' };
          const current = await readWorkItem(this.client, this.options, command.input.workItemId);
          return { operationId: command.operationId, disposition: 'duplicate', revision: current.revision, receiptRef: `comment:${comment.id}`, value: redacted };
        } catch {
          return { operationId: command.operationId, disposition: 'conflict', revision: command.expectedRevision, reason: 'corrupt operation receipt' };
        }
      }
      const snapshot = await readWorkItem(this.client, this.options, command.input.workItemId);
      if (snapshot.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: snapshot.revision, reason: 'stale Work Item revision' };
      let coordination;
      try {
        coordination = parseCoordinationState(String(snapshot.wire.fields['System.Description'] ?? '')).value;
      } catch {
        return { operationId: command.operationId, disposition: 'conflict', revision: snapshot.revision, reason: 'Coordination State block is required before evidence publication' };
      }
      const receipt: OperationReceipt = {
        operationId: command.operationId,
        kind: 'run-evidence',
        payloadHash: expectedHash,
        disposition: 'applied',
        outcome: redacted.integrationResult ?? 'pending',
        actor: redacted.owner,
        occurredAt: command.requestedAt,
        publishedAt: this.clock(),
        workItemId: redacted.workItemId,
        references: redacted.checkpointRefs,
        blocker: redacted.blocker,
        nextAction: redacted.nextAction,
      };
      coordination.lastAppliedOperation = { operationId: command.operationId, kind: 'run-evidence', outcome: receipt.outcome, at: command.requestedAt };
      coordination.pendingPublication = {
        receipt: {
          operationId: receipt.operationId,
          kind: receipt.kind,
          payloadHash: receipt.payloadHash,
          outcome: receipt.outcome,
          actor: receipt.actor,
          occurredAt: receipt.occurredAt,
        },
        publisher: { publisherId: this.publisherId, leaseExpiresAt: new Date(Date.parse(this.clock()) + 60_000).toISOString() },
        evidence: redacted,
      };
      const description = String(snapshot.wire.fields['System.Description'] ?? '');
      const nextDescription = replaceManagedBlock(description, 'coordination-state', coordination).description;
      const patched = await this.client.patch(
        `/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(command.input.workItemId)}`,
        [testRevision(command.expectedRevision), { op: 'replace', path: '/fields/System.Description', value: nextDescription }],
        {},
        '7.1',
      );
      void patched;
      const appended = await appendComment(this.client, this.options, command.input.workItemId, `${evidenceBody(redacted, command.operationId)}\n\n${operationReceiptBody(receipt)}`);
      const after = await readWorkItem(this.client, this.options, command.input.workItemId);
      const afterDescription = String(after.wire.fields['System.Description'] ?? '');
      const afterCoordination = parseCoordinationState(afterDescription).value;
      afterCoordination.pendingPublication = null;
      const cleared = replaceManagedBlock(afterDescription, 'coordination-state', afterCoordination).description;
      await this.client.patch(
        `/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(command.input.workItemId)}`,
        [testRevision(after.revision), { op: 'replace', path: '/fields/System.Description', value: cleared }],
        {},
        '7.1',
      );
      const final = await readWorkItem(this.client, this.options, command.input.workItemId);
      return { operationId: command.operationId, disposition: 'applied', revision: final.revision, receiptRef: `comment:${appended.id}`, value: redacted };
    });
  }

  async read(runId: RunId): Promise<RunEvidence> {
    const matches = await this.findEvidence(runId);
    const last = matches.at(-1);
    if (!last) throw new Error(`no evidence for run ${runId}`);
    return last;
  }

  async list(workItemId: string): Promise<RunEvidence[]> {
    const comments = await listComments(this.client, this.options, workItemId);
    const results: RunEvidence[] = [];
    for (const comment of comments.comments) {
      const parsed = parseEvidenceComment(comment.text);
      if (parsed) results.push(parsed.evidence);
    }
    return results;
  }

  async findPublications(workItemId: string, providerMarker: string): Promise<EvidencePublicationRef[]> {
    const comments = await listComments(this.client, this.options, workItemId);
    const matches: EvidencePublicationRef[] = [];
    for (const comment of comments.comments) {
      const parsed = parseEvidenceComment(comment.text);
      if (!parsed || parsed.evidence.workItemId !== workItemId || parsed.evidence.providerMarker !== providerMarker) continue;
      matches.push({
        operationId: parsed.operationId,
        workItemId,
        runId: parsed.evidence.runId,
        providerRef: `comment:${comment.id}`,
        observedRevisionOrHead: `comment:${comment.id}:version:${comment.version}`,
        evidence: parsed.evidence,
      });
    }
    return matches;
  }

  private async findEvidence(runId: string): Promise<RunEvidence[]> {
    const ids = await queryWorkItems(
      this.client,
      this.options,
      `SELECT [System.Id] FROM WorkItems`,
    );
    const matches: RunEvidence[] = [];
    for (const workItemId of ids) {
      const records = await this.list(workItemId);
      matches.push(...records.filter((record) => record.runId === runId));
    }
    return matches;
  }
}

function parseEvidenceComment(body: string): { operationId: string; evidence: RunEvidence } | undefined {
  if (!body.includes(EVIDENCE_MARKER)) return undefined;
  try {
    const parsed = parseMarker(EVIDENCE_MARKER, body);
    if (parsed.payload.schema !== 'agent-workspace/run-evidence' || parsed.payload.version !== 1) return undefined;
    const evidence = parsed.payload.evidence;
    if (typeof evidence !== 'object' || evidence === null || Array.isArray(evidence)) return undefined;
    const candidate = evidence as unknown as RunEvidence;
    if (typeof candidate.runId !== 'string' || typeof candidate.workItemId !== 'string') return undefined;
    return { operationId: parsed.operationId, evidence: candidate };
  } catch {
    // Corrupt immutable comments stay visible to humans but never become recovery authority.
    return undefined;
  }
}
