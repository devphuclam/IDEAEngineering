import type {
  ClaimRecord,
  CoordinationState,
  ClaimRelease,
  ClaimState,
  HandoffRecord,
  MutationCommand,
  MutationResult,
  OperationReceipt,
  PublicationResult,
  Revisioned,
  WorkItemId,
} from '../../domain/types.ts';
import type { ClaimStore } from '../ports.ts';
import { createKeyedSerializer, payloadHash } from '../../domain/mutations.ts';
import { parseCoordinationState, replaceManagedBlock } from './blocks.ts';
import { appendComment, listComments, queryWorkItems, readWorkItem, testRevision } from './api.ts';
import type { AzureHttpClient } from './http.ts';
import { RedactedAzureError } from './http.ts';
import { operationReceiptBody, parseOperationReceipt, OPERATION_RECEIPT_MARKER } from '../../domain/records.ts';
import type { AzureBoardsOptions } from './boards.ts';

function emptyCoordination(workItemId: string): CoordinationState {
  return { schema: 'agent-workspace/coordination-state', version: 1, workItemId, claim: null, run: null, lastAppliedOperation: null, pendingPublication: null };
}
export interface AzureClaimsOptions extends AzureBoardsOptions {
  clock?: () => string;
  publisherId?: string;
}

export class AzureClaimStore implements ClaimStore {
  private readonly client: AzureHttpClient;
  private readonly options: AzureBoardsOptions;
  private readonly clock: () => string;
  private readonly publisherId: string;
  private readonly serialized = createKeyedSerializer();
  private readonly runToWorkItem = new Map<string, WorkItemId>();

  constructor(options: AzureClaimsOptions) {
    this.client = options.client;
    this.options = options;
    this.clock = options.clock ?? (() => new Date().toISOString());
    this.publisherId = options.publisherId ?? 'azure-claim-publisher';
  }

  async acquire(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    return this.serialized(command.input.workItemId, () => this.mutate(command, 'acquire', (coordination) => {
      const now = Date.parse(this.clock());
      const active = coordination.claim;
      if (active && Date.parse(active.leaseExpiresAt) > now) {
        if (active.claimToken === command.input.claimToken && active.claimant === command.input.claimant) return { kind: 'duplicate', state: this.toState(command.input.workItemId, active), reason: 'claim already owns the Work Item' };
        return { kind: 'conflict', reason: `Work Item is claimed by ${active.claimant}` };
      }
      const claim = {
        claimToken: command.input.claimToken,
        claimant: command.input.claimant,
        runId: command.input.runId,
        acquiredAt: command.input.acquiredAt,
        leaseExpiresAt: command.input.leaseExpiresAt,
      };
      coordination.claim = claim;
      coordination.run = { runId: command.input.runId, state: 'claimed', startedAt: command.input.acquiredAt };
      this.runToWorkItem.set(command.input.runId, command.input.workItemId);
      return { kind: 'applied', state: this.toState(command.input.workItemId, claim) };
    })) as Promise<MutationResult<ClaimState>>;
  }

  async renew(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    return this.serialized(command.input.workItemId, () => this.mutate(command, 'renew', (coordination) => {
      const claim = coordination.claim;
      if (!claim || claim.claimToken !== command.input.claimToken || claim.claimant !== command.input.claimant) return { kind: 'conflict', reason: 'claim is not owned by the caller' };
      coordination.claim = { ...claim, leaseExpiresAt: command.input.leaseExpiresAt };
      return { kind: 'applied', state: this.toState(command.input.workItemId, coordination.claim) };
    })) as Promise<MutationResult<ClaimState>>;
  }

  async handoff(command: MutationCommand<HandoffRecord>): Promise<MutationResult<ClaimState>> {
    const workItemId = this.runToWorkItem.get(command.input.checkpoint.runId) ?? await this.findWorkItemForRun(command.input.checkpoint.runId);
    if (!workItemId) return { operationId: command.operationId, disposition: 'conflict', revision: 'unknown', reason: 'run is not associated with a Work Item in this context' };
    return this.serialized(workItemId, () => this.mutate({ ...command, input: { ...command.input, workItemId } } as MutationCommand<HandoffRecord & { workItemId: string }>, 'handoff', (coordination) => {
      const claim = coordination.claim;
      if (!claim || claim.runId !== command.input.checkpoint.runId || claim.claimant !== command.input.previousOwner) return { kind: 'conflict', reason: 'active claim is not owned by previous owner' };
      coordination.claim = { ...claim, claimant: command.input.replacementOwner, previousOwner: command.input.previousOwner };
      return { kind: 'applied', state: this.toState(workItemId, coordination.claim) };
    })) as Promise<MutationResult<ClaimState>>;
  }

  async release(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    return this.serialized(command.input.workItemId, () => this.mutate(command, 'release', (coordination) => {
      if (!coordination.claim || coordination.claim.claimToken !== command.input.claimToken) return { kind: 'conflict', reason: 'claim token is not active' };
      coordination.claim = null;
      coordination.run = null;
      return { kind: 'applied', state: undefined };
    }));
  }

  async expire(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    return this.serialized(command.input.workItemId, () => this.mutate(command, 'expire', (coordination) => {
      if (!coordination.claim || coordination.claim.claimToken !== command.input.claimToken) return { kind: 'conflict', reason: 'claim token is not active' };
      if (Date.parse(coordination.claim.leaseExpiresAt) > Date.parse(this.clock())) return { kind: 'conflict', reason: 'claim has not expired' };
      coordination.claim = null;
      coordination.run = null;
      return { kind: 'applied', state: undefined };
    }));
  }

  async active(workItemId: WorkItemId): Promise<Revisioned<ClaimState | undefined>> {
    const snapshot = await readWorkItem(this.client, this.options, workItemId);
    const description = String(snapshot.wire.fields['System.Description'] ?? '');
    let coordination: CoordinationState;
    try {
      coordination = parseCoordinationState(description).value;
    } catch (error) {
      if (!(error instanceof Error) || !/no coordination-state block/.test(error.message)) throw error;
      coordination = emptyCoordination(workItemId);
    }
    const claim = coordination.claim && Date.parse(coordination.claim.leaseExpiresAt) > Date.parse(this.clock()) ? this.toState(workItemId, coordination.claim) : undefined;
    if (claim) this.runToWorkItem.set(claim.runId, workItemId);
    return { value: claim, revision: snapshot.revision, observedAt: snapshot.observedAt };
  }

  async records(workItemId: WorkItemId, operationId?: string): Promise<OperationReceipt[]> {
    const comments = await listComments(this.client, this.options, workItemId);
    const receipts: OperationReceipt[] = [];
    for (const comment of comments.comments) {
      if (!comment.text.startsWith(OPERATION_RECEIPT_MARKER)) continue;
      try {
        const receipt = parseOperationReceipt(comment.text);
        if (!operationId || receipt.operationId === operationId) receipts.push(receipt);
      } catch {
        // Corrupt receipts are not authoritative and are intentionally excluded.
      }
    }
    return receipts;
  }

  async reconcilePending(workItemId: WorkItemId): Promise<PublicationResult> {
    return this.serialized(workItemId, () => this.reconcilePendingLocked(workItemId));
  }

  private async mutate<T extends ClaimRecord | ClaimRelease | HandoffRecord & { workItemId?: string }>(
    command: MutationCommand<T>,
    kind: string,
    transition: (coordination: ReturnType<typeof parseCoordinationState>['value']) => { kind: 'applied' | 'duplicate' | 'conflict'; state?: ClaimState; reason?: string },
  ): Promise<MutationResult<ClaimState | undefined>> {
    const workItemId = 'workItemId' in command.input ? String(command.input.workItemId) : this.runToWorkItem.get((command.input as HandoffRecord).checkpoint.runId);
    if (!workItemId) return { operationId: command.operationId, disposition: 'conflict', revision: 'unknown', reason: 'missing Work Item identity' };
    const snapshot = await readWorkItem(this.client, this.options, workItemId);
    const description = String(snapshot.wire.fields['System.Description'] ?? '');
    let coordination: CoordinationState;
    try {
      coordination = parseCoordinationState(description).value;
    } catch (error) {
      if (!(error instanceof Error) || !/no coordination-state block/.test(error.message)) throw error;
      coordination = emptyCoordination(workItemId);
    }
    const expectedHash = payloadHash(command.input);
    if (coordination.pendingPublication) {
      const repaired = await this.reconcilePendingLocked(workItemId);
      const fresh = await readWorkItem(this.client, this.options, workItemId);
      const recoveredReceipt = (await this.records(workItemId, command.operationId))[0];
      if (recoveredReceipt) {
        return {
          operationId: command.operationId,
          disposition: recoveredReceipt.payloadHash === expectedHash ? 'duplicate' : 'conflict',
          revision: fresh.revision,
          receiptRef: `operation:${recoveredReceipt.operationId}`,
          reason: recoveredReceipt.payloadHash === expectedHash ? 'durable operation receipt after pending recovery' : 'operation ID payload hash mismatch',
        };
      }
      return {
        operationId: command.operationId,
        disposition: 'conflict',
        revision: fresh.revision,
        reason: repaired.published
          ? 'pending claim publication was recovered; retry against the new Work Item revision'
          : repaired.reason ?? 'pending claim publication requires recovery',
      };
    }
    const existing = await this.records(workItemId, command.operationId);
    if (existing.length > 0) {
      const receipt = existing[0];
      return { operationId: command.operationId, disposition: receipt.payloadHash === expectedHash ? 'duplicate' : 'conflict', revision: snapshot.revision, receiptRef: `operation:${receipt.operationId}`, reason: receipt.payloadHash === expectedHash ? 'durable operation receipt' : 'operation ID payload hash mismatch' };
    }
    if (snapshot.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: snapshot.revision, reason: 'stale Work Item revision' };
    const outcome = transition(coordination);
    if (outcome.kind !== 'applied') return { operationId: command.operationId, disposition: outcome.kind, revision: snapshot.revision, value: outcome.state, reason: outcome.reason };
    const receipt: OperationReceipt = {
      operationId: command.operationId,
      kind,
      payloadHash: expectedHash,
      disposition: 'applied',
      outcome: 'applied',
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      workItemId,
      references: [],
    };
    coordination.lastAppliedOperation = { operationId: command.operationId, kind, outcome: 'applied', at: command.requestedAt };
    coordination.pendingPublication = { receipt: { operationId: receipt.operationId, kind, payloadHash: receipt.payloadHash, outcome: 'applied', actor: receipt.actor, occurredAt: receipt.occurredAt }, publisher: { publisherId: this.publisherId, leaseExpiresAt: new Date(Date.parse(this.clock()) + 60_000).toISOString() } };
    const nextDescription = replaceManagedBlock(description, 'coordination-state', coordination).description;
    let patched: unknown;
    try {
      patched = await this.client.patch(`/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(workItemId)}`, [testRevision(command.expectedRevision), { op: 'replace', path: '/fields/System.Description', value: nextDescription }], {}, '7.1');
    } catch (error) {
      if (error instanceof RedactedAzureError && error.classification === 'conflict') {
        const fresh = await readWorkItem(this.client, this.options, workItemId);
        return { operationId: command.operationId, disposition: 'conflict', revision: fresh.revision, reason: 'Work Item changed before claim publication' };
      }
      throw error;
    }
    const appended = await appendComment(this.client, this.options, workItemId, operationReceiptBody(receipt));
    const after = await readWorkItem(this.client, this.options, workItemId);
    const afterDescription = String(after.wire.fields['System.Description'] ?? '');
    const afterCoordination = parseCoordinationState(afterDescription).value;
    afterCoordination.pendingPublication = null;
    const cleared = replaceManagedBlock(afterDescription, 'coordination-state', afterCoordination).description;
    try {
      await this.client.patch(`/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(workItemId)}`, [testRevision(after.revision), { op: 'replace', path: '/fields/System.Description', value: cleared }], {}, '7.1');
    } catch (error) {
      if (error instanceof RedactedAzureError && error.classification === 'conflict') {
        const fresh = await readWorkItem(this.client, this.options, workItemId);
        return { operationId: command.operationId, disposition: 'conflict', revision: fresh.revision, reason: 'Work Item changed while clearing publication state' };
      }
      throw error;
    }
    const final = await readWorkItem(this.client, this.options, workItemId);
    void patched;
    return { operationId: command.operationId, disposition: 'applied', revision: final.revision, value: outcome.state, receiptRef: `comment:${appended.id}` };
  }

  private async reconcilePendingLocked(workItemId: WorkItemId): Promise<PublicationResult> {
    const snapshot = await readWorkItem(this.client, this.options, workItemId);
    const description = String(snapshot.wire.fields['System.Description'] ?? '');
    let coordination: CoordinationState;
    try {
      coordination = parseCoordinationState(description).value;
    } catch (error) {
      if (error instanceof Error && /no coordination-state block/.test(error.message)) return { operationId: 'none', published: true };
      throw error;
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
      const appended = await appendComment(this.client, this.options, workItemId, operationReceiptBody(receipt));
      receiptRef = `comment:${appended.id}`;
    }
    const refreshed = await readWorkItem(this.client, this.options, workItemId);
    const refreshedDescription = String(refreshed.wire.fields['System.Description'] ?? '');
    const refreshedCoordination = parseCoordinationState(refreshedDescription).value;
    if (refreshedCoordination.pendingPublication?.receipt.operationId !== pending.operationId) {
      return { operationId: pending.operationId, published: false, receiptRef, reason: 'pending claim publication changed during recovery' };
    }
    refreshedCoordination.pendingPublication = null;
    const cleared = replaceManagedBlock(refreshedDescription, 'coordination-state', refreshedCoordination).description;
    try {
      await this.client.patch(
        `/${encodeURIComponent(this.options.projectName)}/_apis/wit/workitems/${encodeURIComponent(workItemId)}`,
        [testRevision(refreshed.revision), { op: 'replace', path: '/fields/System.Description', value: cleared }],
        {},
        '7.1',
      );
    } catch (error) {
      if (error instanceof RedactedAzureError && error.classification === 'conflict') {
        return { operationId: pending.operationId, published: false, receiptRef, reason: 'Work Item changed while clearing claim publication state' };
      }
      throw error;
    }
    return { operationId: pending.operationId, published: true, receiptRef };
  }

  private toState(workItemId: string, claim: { claimToken: string; claimant: string; runId: string; acquiredAt: string; leaseExpiresAt: string; previousOwner?: string }): ClaimState {
    return { workItemId, claimToken: claim.claimToken, claimant: claim.claimant, runId: claim.runId, acquiredAt: claim.acquiredAt, leaseExpiresAt: claim.leaseExpiresAt };
  }

  private async findWorkItemForRun(runId: string): Promise<string | undefined> {
    const ids = await queryWorkItems(this.client, this.options, `SELECT [System.Id] FROM WorkItems WHERE [System.State] <> 'Closed'`);
    for (const workItemId of ids) {
      try {
        const snapshot = await readWorkItem(this.client, this.options, workItemId);
        const description = String(snapshot.wire.fields['System.Description'] ?? '');
        const coordination = parseCoordinationState(description).value;
        if (coordination.claim?.runId === runId || coordination.run?.runId === runId) {
          this.runToWorkItem.set(runId, workItemId);
          return workItemId;
        }
      } catch {
        // Invalid or unrelated Work Items are not claim authority.
      }
    }
    return undefined;
  }
}
