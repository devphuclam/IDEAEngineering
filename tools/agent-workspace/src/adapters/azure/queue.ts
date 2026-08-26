import type {
  AcquireIntegration,
  EnqueueCandidate,
  FinalizeCandidate,
  IntegrationLease,
  IntegrationTarget,
  MutationCommand,
  MutationResult,
  OperationReceipt,
  ProviderRevision,
  QueueCompletionSummary,
  QueueDecision,
  QueueManifest,
  ReleaseIntegrationLease,
  RenewIntegrationLease,
  Revisioned,
} from '../../domain/types.ts';
import type { CanonicalQueueStore } from '../ports.ts';
import { createKeyedSerializer, payloadHash, MAX_STALE_REREADS } from '../../domain/mutations.ts';
import { parseQueueManifest, replaceManagedBlock } from './blocks.ts';
import { appendComment, listComments, patchWorkItem, queryWorkItems, readWorkItem, testRevision } from './api.ts';
import type { AzureHttpClient } from './http.ts';
import { queueCompletionBody, operationReceiptBody, parseOperationReceipt, parseMarker, OPERATION_RECEIPT_MARKER, QUEUE_COMPLETION_MARKER } from '../../domain/records.ts';
import { workItemTags } from './boards.ts';
import type { AzureBoardsOptions } from './boards.ts';

export interface AzureQueueOptions extends AzureBoardsOptions {
  organizationUrl: string;
  projectId: string;
  repositoryId: string;
  targetRef: string;
  queueKey: string;
  queueWorkItemId?: string;
}

export class AzureQueueError extends Error {
  constructor(message: string) {
    super(`azure queue: ${message}`);
    this.name = 'AzureQueueError';
  }
}

export class AzureCanonicalQueueStore implements CanonicalQueueStore {
  private readonly client: AzureHttpClient;
  private readonly options: AzureQueueOptions;
  private readonly serialized = createKeyedSerializer();
  private readonly clock: () => string;

  constructor(options: AzureQueueOptions) {
    this.client = options.client;
    this.options = options;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  async read(target: IntegrationTarget): Promise<Revisioned<QueueManifest>> {
    this.assertTarget(target);
    const queueId = await this.discoverQueueId();
    const snapshot = await readWorkItem(this.client, this.options, queueId);
    const description = String(snapshot.wire.fields['System.Description'] ?? '');
    const manifest = parseQueueManifest(description).value;
    this.assertManifest(manifest);
    return { value: manifest, revision: snapshot.revision, observedAt: snapshot.observedAt };
  }

  async enqueue(command: MutationCommand<EnqueueCandidate>): Promise<MutationResult<QueueManifest>> {
    return this.mutate(command, 'enqueue', (manifest) => {
      const existing = manifest.entries.find((entry) => entry.candidateWorkItemId === command.input.candidateWorkItemId && entry.runId === command.input.runId);
      if (existing) return { kind: 'duplicate', reason: 'candidate/run already exists', manifest };
      manifest.entries.push({
        sequence: manifest.nextEnqueueSequence,
        candidateWorkItemId: command.input.candidateWorkItemId,
        runId: command.input.runId,
        state: 'queued',
        enqueuedAt: command.requestedAt,
        dependencies: [...command.input.dependencies],
        decisions: [...command.input.decisions],
      });
      manifest.nextEnqueueSequence += 1;
      return { kind: 'applied', manifest };
    });
  }

  async recordDecision(command: MutationCommand<QueueDecision>): Promise<MutationResult<QueueManifest>> {
    return this.mutate(command, 'queue-decision', (manifest) => {
      const entry = manifest.entries.find((candidate) => candidate.sequence === command.input.entrySequence);
      if (!entry) return { kind: 'conflict', reason: 'queue entry no longer exists', manifest };
      if (entry.decisions.some((decision) => decision.runId === command.input.decision.runId && decision.decision === command.input.decision.decision)) return { kind: 'duplicate', reason: 'decision already exists', manifest };
      entry.decisions.push(command.input.decision);
      return { kind: 'applied', manifest };
    });
  }

  async acquireNext(command: MutationCommand<AcquireIntegration>): Promise<MutationResult<IntegrationLease>> {
    const target = { repositoryId: this.options.repositoryId, targetRef: this.options.targetRef };
    return this.serialized(this.options.queueKey, async () => {
      const current = await this.read(target);
      if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale queue revision' };
      if (current.value.pendingPublication) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'pending queue publication requires reconciliation' };
      if (current.value.lease && Date.parse(current.value.lease.expiresAt) > Date.parse(this.clock())) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'another integration lease is active' };
      const candidate = current.value.entries.filter((entry) => entry.state === 'queued' && this.eligible(entry, current.value)).sort((a, b) => a.sequence - b.sequence)[0];
      if (!candidate) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'no eligible queue entry' };
      const acquiredAt = this.clock();
      const lease: IntegrationLease = { operationId: command.operationId, entrySequence: candidate.sequence, candidateWorkItemId: candidate.candidateWorkItemId, runId: candidate.runId, acquiredAt, expiresAt: new Date(Date.parse(acquiredAt) + (command.input.leaseSeconds ?? 300) * 1000).toISOString(), targetCommit: command.input.targetCommit };
      const manifest = structuredClone(current.value) as QueueManifest;
      const entry = manifest.entries.find((item) => item.sequence === candidate.sequence)!;
      entry.state = 'preparing';
      entry.latestTargetCommit = command.input.targetCommit;
      manifest.lease = lease;
      manifest.lastOperation = { operationId: command.operationId, kind: 'acquire-integration', outcome: 'applied', at: command.requestedAt };
      const saved = await this.save(command, current.revision, manifest, 'acquire-integration');
      return { ...saved, value: lease };
    });
  }

  async renewLease(command: MutationCommand<RenewIntegrationLease>): Promise<MutationResult<IntegrationLease>> {
    const current = await this.read(this.target());
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale queue revision' };
    if (current.value.pendingPublication) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'pending queue publication requires reconciliation' };
    if (!current.value.lease || current.value.lease.operationId !== command.input.operationId || current.value.lease.entrySequence !== command.input.entrySequence) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'integration lease is not owned by operation' };
    const manifest = structuredClone(current.value) as QueueManifest;
    const lease = manifest.lease;
    if (!lease) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'integration lease disappeared' };
    manifest.lease = { ...lease, expiresAt: new Date(Date.parse(this.clock()) + (command.input.leaseSeconds ?? 300) * 1000).toISOString() };
    const saved = await this.save(command, current.revision, manifest, 'renew-integration');
    return { ...saved, value: manifest.lease } as MutationResult<IntegrationLease>;
  }

  async releaseLease(command: MutationCommand<ReleaseIntegrationLease>): Promise<MutationResult<QueueManifest>> {
    const current = await this.read(this.target());
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale queue revision' };
    if (current.value.pendingPublication) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'pending queue publication requires reconciliation' };
    if (!current.value.lease || current.value.lease.operationId !== command.input.operationId) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'integration lease is not owned by operation' };
    const manifest = structuredClone(current.value) as QueueManifest;
    const entry = manifest.entries.find((item) => item.sequence === command.input.entrySequence);
    if (entry) entry.state = command.input.reason === 'drift' || command.input.reason === 'policy' ? 'blocked' : 'queued';
    manifest.lease = null;
    const saved = await this.save(command, current.revision, manifest, 'release-integration');
    return saved;
  }

  async finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>> {
    const current = await this.read(this.target());
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale queue revision' };
    if (current.value.pendingPublication) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'pending queue publication requires reconciliation' };
    const entry = current.value.entries.find((item) => item.sequence === command.input.entrySequence);
    if (!entry || !current.value.lease || current.value.lease.entrySequence !== entry.sequence) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'queue entry or lease no longer active' };
    const manifest = structuredClone(current.value) as QueueManifest;
    manifest.entries = manifest.entries.filter((item) => item.sequence !== command.input.entrySequence);
    manifest.lease = null;
    const summary: QueueCompletionSummary = { operationId: command.operationId, sequence: entry.sequence, candidateWorkItemId: entry.candidateWorkItemId, runId: entry.runId, outcome: command.input.outcome, at: this.clock(), pullRequestRef: command.input.pullRequestRef, evidenceRef: command.input.evidenceRef, blocker: command.input.blocker };
    return this.save(command, current.revision, manifest, 'finalize', summary);
  }

  async reconcilePending(target: IntegrationTarget): Promise<{ operationId: string; published: boolean; receiptRef?: string; reason?: string }> {
    const current = await this.read(target);
    if (!current.value.pendingPublication) return { operationId: 'none', published: true };
    const pendingPublication = current.value.pendingPublication;
    const pending = pendingPublication.receipt;
    const queueId = await this.discoverQueueId();
    const existing = (await this.receipts(queueId, pending.operationId)).find((receipt) => receipt.payloadHash === pending.payloadHash);
    let receiptRef = existing ? 'operation:' + existing.operationId : undefined;
    if (!existing) {
      const receipt: OperationReceipt = {
        operationId: pending.operationId,
        kind: pending.kind,
        payloadHash: pending.payloadHash,
        disposition: 'applied',
        outcome: pending.outcome,
        actor: pending.actor,
        occurredAt: pending.occurredAt,
        publishedAt: this.clock(),
        workItemId: queueId,
        references: [],
      };
      const appended = await appendComment(this.client, this.options, queueId, operationReceiptBody(receipt));
      receiptRef = 'comment:' + appended.id;
    }
    if (pendingPublication.completion) {
      const comments = await listComments(this.client, this.options, queueId);
      const marker = QUEUE_COMPLETION_MARKER + ' ' + pendingPublication.completion.operationId;
      if (!comments.comments.some((comment) => comment.text.includes(marker))) {
        await appendComment(this.client, this.options, queueId, queueCompletionBody(pendingPublication.completion));
      }
    }
    const refreshed = await readWorkItem(this.client, this.options, queueId);
    const description = String(refreshed.wire.fields['System.Description'] ?? '');
    const manifest = parseQueueManifest(description).value;
    if (manifest.pendingPublication?.receipt.operationId !== pending.operationId) return { operationId: pending.operationId, published: false, receiptRef, reason: 'pending queue publication changed during recovery' };
    manifest.pendingPublication = null;
    const cleared = replaceManagedBlock(description, 'queue-manifest', manifest).description;
    await patchWorkItem(this.client, this.options, queueId, [testRevision(refreshed.revision), { op: 'replace', path: '/fields/System.Description', value: cleared }]);
    return { operationId: pending.operationId, published: true, receiptRef };
  }

  async completionHistory(target: IntegrationTarget): Promise<QueueCompletionSummary[]> {
    this.assertTarget(target);
    const queueId = await this.discoverQueueId();
    const comments = await listComments(this.client, this.options, queueId);
    const results: QueueCompletionSummary[] = [];
    for (const comment of comments.comments) {
      if (!comment.text.startsWith(QUEUE_COMPLETION_MARKER)) continue;
      try {
        const marker = parseMarker(QUEUE_COMPLETION_MARKER, comment.text);
        if (marker.payload.schema !== 'agent-workspace/queue-completion' || marker.payload.version !== 1) continue;
        results.push(marker.payload as unknown as QueueCompletionSummary);
      } catch {
        // Corrupt summaries remain visible but are never projected as history.
      }
    }
    return results;
  }

  private async mutate<T extends EnqueueCandidate | QueueDecision>(command: MutationCommand<T>, kind: string, transition: (manifest: QueueManifest) => { kind: 'applied' | 'duplicate' | 'conflict'; manifest: QueueManifest; reason?: string }): Promise<MutationResult<QueueManifest>> {
    return this.serialized(this.options.queueKey, async () => {
      const hash = payloadHash(command.input);
      let expectedRevision = command.expectedRevision;
      for (let reread = 0; reread <= MAX_STALE_REREADS; reread += 1) {
        const current = await this.read(this.target());
        if (current.value.pendingPublication) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'pending queue publication requires reconciliation' };
        const receipts = await this.receipts(await this.discoverQueueId(), command.operationId);
        const receipt = receipts.find((item) => item.operationId === command.operationId);
        if (receipt) return { operationId: command.operationId, disposition: receipt.payloadHash === hash ? 'duplicate' : 'conflict', revision: current.revision, receiptRef: `operation:${receipt.operationId}`, reason: receipt.payloadHash === hash ? 'durable operation receipt' : 'operation ID payload hash mismatch' };
        if (current.revision !== expectedRevision) {
          if (reread === MAX_STALE_REREADS) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: `stale queue revision after ${MAX_STALE_REREADS} reread budget` };
          expectedRevision = current.revision;
          continue;
        }
        const next = transition(structuredClone(current.value) as QueueManifest);
        if (next.kind !== 'applied') return { operationId: command.operationId, disposition: next.kind, revision: current.revision, value: next.manifest, reason: next.reason };
        try {
          const saved = await this.save(command, current.revision, next.manifest, kind);
          if (saved.disposition === 'conflict' && /revision|412|conflict/i.test(saved.reason ?? '') && reread < MAX_STALE_REREADS) {
            expectedRevision = saved.revision;
            continue;
          }
          return saved;
        } catch (error) {
          if (error instanceof Error && /revision|412|conflict/i.test(error.message) && reread < MAX_STALE_REREADS) {
            expectedRevision = (await this.read(this.target())).revision;
            continue;
          }
          throw error;
        }
      }
      return { operationId: command.operationId, disposition: 'conflict', revision: expectedRevision, reason: `stale queue revision after ${MAX_STALE_REREADS} reread budget` };
    });
  }

  private async save<T>(command: MutationCommand<T>, expectedRevision: ProviderRevision, manifest: QueueManifest, kind: string, completion?: QueueCompletionSummary): Promise<MutationResult<QueueManifest>> {
    const queueId = await this.discoverQueueId();
    const snapshot = await readWorkItem(this.client, this.options, queueId);
    if (snapshot.revision !== expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: snapshot.revision, reason: 'queue revision changed before write' };
    const receipt: OperationReceipt = { operationId: command.operationId, kind, payloadHash: payloadHash(command.input), disposition: 'applied', outcome: 'applied', actor: command.actor, occurredAt: command.requestedAt, publishedAt: this.clock(), workItemId: queueId, references: [] };
    const pendingManifest = structuredClone(manifest) as QueueManifest;
    pendingManifest.lastOperation = { operationId: command.operationId, kind, outcome: 'applied', at: command.requestedAt };
    pendingManifest.pendingPublication = { receipt: { operationId: receipt.operationId, kind: receipt.kind, payloadHash: receipt.payloadHash, outcome: receipt.outcome, actor: receipt.actor, occurredAt: receipt.occurredAt }, publisher: { publisherId: 'azure-queue-publisher', leaseExpiresAt: new Date(Date.parse(this.clock()) + 60_000).toISOString() }, ...(completion ? { completion } : {}) };
    const description = String(snapshot.wire.fields['System.Description'] ?? '');
    const nextDescription = replaceManagedBlock(description, 'queue-manifest', pendingManifest).description;
    await patchWorkItem(this.client, this.options, queueId, [testRevision(expectedRevision), { op: 'replace', path: '/fields/System.Description', value: nextDescription }]);
    const comment = await appendComment(this.client, this.options, queueId, operationReceiptBody(receipt));
    if (completion) await appendComment(this.client, this.options, queueId, queueCompletionBody(completion));
    const refreshed = await readWorkItem(this.client, this.options, queueId);
    const refreshedDescription = String(refreshed.wire.fields['System.Description'] ?? '');
    const refreshedManifest = parseQueueManifest(refreshedDescription).value;
    if (refreshedManifest.pendingPublication?.receipt.operationId !== command.operationId) return { operationId: command.operationId, disposition: 'conflict', revision: refreshed.revision, reason: 'pending queue publication changed before acknowledgement' };
    refreshedManifest.pendingPublication = null;
    const cleared = replaceManagedBlock(refreshedDescription, 'queue-manifest', refreshedManifest).description;
    const final = await patchWorkItem(this.client, this.options, queueId, [testRevision(refreshed.revision), { op: 'replace', path: '/fields/System.Description', value: cleared }]);
    return { operationId: command.operationId, disposition: 'applied', revision: final.revision, value: refreshedManifest, receiptRef: 'comment:' + comment.id };
  }

  private async receipts(queueId: string, operationId?: string): Promise<OperationReceipt[]> {
    const comments = await listComments(this.client, this.options, queueId);
    const result: OperationReceipt[] = [];
    for (const comment of comments.comments) {
      if (!comment.text.startsWith(OPERATION_RECEIPT_MARKER)) continue;
      try {
        const receipt = parseOperationReceipt(comment.text);
        if (!operationId || receipt.operationId === operationId) result.push(receipt);
      } catch {
        // Corrupt operation history is not authoritative.
      }
    }
    return result;
  }

  private async discoverQueueId(): Promise<string> {
    if (this.options.queueWorkItemId) return this.options.queueWorkItemId;
    const ids = await queryWorkItems(this.client, this.options, `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = @project AND [System.Tags] CONTAINS 'agent-workspace:integration-queue'`);
    const matches: string[] = [];
    for (const id of ids) {
      try {
        const item = await readWorkItem(this.client, this.options, id);
        if (!workItemTags(item).includes('agent-workspace:integration-queue')) continue;
        const description = String(item.wire.fields['System.Description'] ?? '');
        const manifest = parseQueueManifest(description).value;
        if (manifest.queueKey === this.options.queueKey && manifest.repositoryId === this.options.repositoryId && manifest.targetRef === this.options.targetRef) matches.push(id);
      } catch {
        // Invalid records are not valid candidates, but do not silently elect one.
      }
    }
    if (matches.length !== 1) throw new AzureQueueError(matches.length === 0 ? 'no valid coordination Work Item found; run provider prepare first' : `expected exactly one queue Work Item, found ${matches.length}`);
    return matches[0];
  }

  private eligible(entry: QueueManifest['entries'][number], manifest: QueueManifest): boolean {
    if (entry.decisions.some((decision) => decision.decision === 'rejected' || (decision.decision === 'human' && decision.decidedBy === 'unresolved'))) return false;
    return !entry.dependencies.some((dependency) =>
      manifest.entries.some((candidate) => candidate.candidateWorkItemId === dependency),
    );
  }

  private target(): IntegrationTarget { return { repositoryId: this.options.repositoryId, targetRef: this.options.targetRef }; }

  private assertTarget(target: IntegrationTarget): void {
    if (target.repositoryId !== this.options.repositoryId || target.targetRef !== this.options.targetRef) throw new AzureQueueError('queue store is bound to a different integration target');
  }

  private assertManifest(manifest: QueueManifest): void {
    if (manifest.queueKey !== this.options.queueKey || manifest.organizationUrl !== this.options.organizationUrl || manifest.projectId !== this.options.projectId || manifest.repositoryId !== this.options.repositoryId || manifest.targetRef !== this.options.targetRef) throw new AzureQueueError('canonical queue identity does not match configuration');
  }
}
