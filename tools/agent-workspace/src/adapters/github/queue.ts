// GitHub coordination-Issue-backed canonical queue (contracts/github-adapter.md).
// The recognized immutable queue proposal comments are the sole source for
// queue sequence, active entries, lease, and completion summaries. Local
// mirrors are disposable. A stale operation rereads and reconciles under the
// shared MAX_STALE_REREADS budget; exhaustion returns an explicit conflict.
// The first normal enqueue may create the deterministic Issue/label pair; a
// concurrent duplicate create blocks for administrator remediation.

import {
  MAX_STALE_REREADS,
  type AcquireIntegration,
  type ConflictDecision,
  type EnqueueCandidate,
  type FinalizeCandidate,
  type IntegrationLease,
  type IntegrationTarget,
  type MutationCommand,
  type MutationResult,
  type QueueCompletionSummary,
  type QueueDecision,
  type QueueManifest,
  type RenewIntegrationLease,
  type ReleaseIntegrationLease,
  type Revisioned,
} from '../../domain/types.ts';
import { canonicalJson, payloadHash, retryBudget } from '../../domain/mutations.ts';
import {
  OPERATION_RECEIPT_MARKER,
  QUEUE_COMPLETION_MARKER,
  QUEUE_DISCOVERY_LABEL,
  QUEUE_PROPOSAL_MARKER,
  githubQueueKey,
  parseOperationReceipt,
  parseProposal,
  projectQueueLabels,
  queueKeyTag,
  serializeProposal,
  streamRevision,
  type WireComment,
} from './revisions.ts';
import type { CanonicalQueueStore } from '../ports.ts';

export interface GithubIssueStore {
  readIssue(issueNumber: number): Promise<{ number: number; labels: string[]; title: string; body: string }>;
  listComments(issueNumber: number): Promise<WireComment[]>;
  addComment(issueNumber: number, body: string): Promise<WireComment>;
  createIssue(input: { title: string; body: string; labels: string[] }): Promise<{ number: number }>;
  findIssues(labels: string[]): Promise<Array<{ number: number; labels: string[] }>>;
}

export class GithubQueueStoreError extends Error {
  constructor(message: string) {
    super(`github queue: ${message}`);
    this.name = 'GithubQueueStoreError';
  }
}

export interface GithubQueueStoreOptions {
  repositoryId: string;
  targetRef: string;
  repositoryName: string;
}

interface QueueProjection {
  manifest: QueueManifest;
  completions: QueueCompletionSummary[];
  revision: string;
  fresh: boolean;
}

const EMPTY_MANIFEST = (options: GithubQueueStoreOptions): QueueManifest => ({
  schema: 'agent-workspace/queue-manifest',
  version: 1,
  queueKey: githubQueueKey(options.repositoryId, options.targetRef),
  organizationUrl: 'github',
  projectId: 'github',
  repositoryId: options.repositoryId,
  targetRef: options.targetRef,
  nextEnqueueSequence: 1,
  entries: [],
  lease: null,
  lastOperation: null,
  pendingPublication: null,
});

export class GithubCanonicalQueueStore implements CanonicalQueueStore {
  private readonly issueStore: GithubIssueStore;
  private readonly options: GithubQueueStoreOptions;
  private readonly now: () => string;
  private issueNumber: number | undefined;

  constructor(
    issueStore: GithubIssueStore,
    options: GithubQueueStoreOptions,
    now: () => string = () => new Date().toISOString(),
  ) {
    this.issueStore = issueStore;
    this.options = options;
    this.now = now;
  }

  private get queueKey(): string {
    return githubQueueKey(this.options.repositoryId, this.options.targetRef);
  }

  private get labels(): string[] {
    return projectQueueLabels([QUEUE_DISCOVERY_LABEL, queueKeyTag(this.queueKey)], this.queueKey);
  }

  private get queueTitle(): string {
    return `Agent Workspace Integration Queue - ${this.options.repositoryName}/${this.options.targetRef}`;
  }

  async read(target: IntegrationTarget): Promise<Revisioned<QueueManifest>> {
    void target;
    const projection = await this.readProjection(false);
    return { value: projection.manifest, revision: projection.revision, observedAt: this.now() };
  }

  async enqueue(command: MutationCommand<EnqueueCandidate>): Promise<MutationResult<QueueManifest>> {
    return this.mutate('enqueue', command, (manifest) => {
      const existing = manifest.entries.find(
        (entry) =>
          entry.candidateWorkItemId === command.input.candidateWorkItemId && entry.runId === command.input.runId,
      );
      if (existing) {
        return { manifest, disposition: 'duplicate', reason: 'candidate tuple already queued', value: manifest };
      }
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
      return { manifest, disposition: 'applied', value: manifest };
    }, true);
  }

  async recordDecision(command: MutationCommand<QueueDecision>): Promise<MutationResult<QueueManifest>> {
    return this.mutate('decision', command, (manifest) => {
      const entry = manifest.entries.find((candidate) => candidate.sequence === command.input.entrySequence);
      if (!entry) {
        return { manifest, disposition: 'conflict', reason: 'entry no longer active', value: manifest };
      }
      if (entry.decisions.some((decision) => decision.runId === command.input.decision.runId)) {
        return { manifest, disposition: 'duplicate', reason: 'decision already recorded', value: manifest };
      }
      entry.decisions.push(command.input.decision);
      return { manifest, disposition: 'applied', value: manifest };
    });
  }

  async acquireNext(command: MutationCommand<AcquireIntegration>): Promise<MutationResult<IntegrationLease>> {
    const lease = await this.mutate<IntegrationLease, AcquireIntegration>(
      'lease-acquire',
      command,
      (manifest) => {
        if (manifest.lease && Date.parse(manifest.lease.expiresAt) > Date.parse(this.now())) {
          return { manifest, disposition: 'conflict', reason: 'another integration lease is active', value: undefined };
        }
        const candidate = manifest.entries
          .filter((entry) => entry.state === 'queued')
          .sort((a, b) => a.sequence - b.sequence)[0];
        if (!candidate) {
          return { manifest, disposition: 'conflict', reason: 'no eligible queue entry', value: undefined };
        }
        const leaseSeconds = command.input.leaseSeconds ?? 300;
        const acquiredAt = this.now();
        const value: IntegrationLease = {
          operationId: command.operationId,
          entrySequence: candidate.sequence,
          candidateWorkItemId: candidate.candidateWorkItemId,
          runId: candidate.runId,
          acquiredAt,
          expiresAt: new Date(Date.parse(acquiredAt) + leaseSeconds * 1000).toISOString(),
          targetCommit: command.input.targetCommit,
        };
        candidate.state = 'preparing';
        manifest.lease = value;
        return { manifest, disposition: 'applied', value };
      },
    );
    return lease;
  }

  async renewLease(command: MutationCommand<RenewIntegrationLease>): Promise<MutationResult<IntegrationLease>> {
    return this.mutate<IntegrationLease, RenewIntegrationLease>('lease-renew', command, (manifest) => {
      if (!manifest.lease || manifest.lease.operationId !== command.operationId) {
        return { manifest, disposition: 'conflict', reason: 'lease is not owned by this operation', value: undefined };
      }
      const leaseSeconds = command.input.leaseSeconds ?? 300;
      const value: IntegrationLease = {
        ...manifest.lease,
        expiresAt: new Date(Date.parse(this.now()) + leaseSeconds * 1000).toISOString(),
      };
      manifest.lease = value;
      return { manifest, disposition: 'applied', value };
    });
  }

  async releaseLease(command: MutationCommand<ReleaseIntegrationLease>): Promise<MutationResult<QueueManifest>> {
    return this.mutate<QueueManifest, ReleaseIntegrationLease>('lease-release', command, (manifest) => {
      if (!manifest.lease || manifest.lease.operationId !== command.operationId) {
        return { manifest, disposition: 'conflict', reason: 'lease is not owned by this operation', value: manifest };
      }
      const entry = manifest.entries.find((candidate) => candidate.sequence === command.input.entrySequence);
      if (entry && entry.state === 'preparing') {
        entry.state = command.input.reason === 'drift' ? 'blocked' : 'queued';
      }
      manifest.lease = null;
      return { manifest, disposition: 'applied', value: manifest };
    });
  }

  async finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>> {
    return this.mutate<QueueManifest, FinalizeCandidate>('finalize', command, (manifest) => {
      const index = manifest.entries.findIndex((entry) => entry.sequence === command.input.entrySequence);
      if (index < 0) {
        return { manifest, disposition: 'conflict', reason: 'entry no longer active', value: manifest };
      }
      manifest.entries.splice(index, 1);
      manifest.lease = null;
      return { manifest, disposition: 'applied', value: manifest };
    });
  }

  async reconcilePending(target: IntegrationTarget): Promise<{ operationId: string; published: boolean; receiptRef?: string; reason?: string }> {
    void target;
    return { operationId: 'none', published: true };
  }

  async completionHistory(target: IntegrationTarget): Promise<QueueCompletionSummary[]> {
    void target;
    return (await this.readProjection(false)).completions;
  }

  private async readProjection(createIfMissing: boolean): Promise<QueueProjection> {
    const issueNumber = await this.resolveIssue(createIfMissing);
    const comments = await this.issueStore.listComments(issueNumber);
    return projectQueueStream(comments, this.options);
  }

  private async resolveIssue(createIfMissing: boolean): Promise<number> {
    if (this.issueNumber !== undefined) return this.issueNumber;
    const labels = [QUEUE_DISCOVERY_LABEL, queueKeyTag(this.queueKey)];
    const matches = await this.issueStore.findIssues(labels);
    if (matches.length > 1) {
      throw new GithubQueueStoreError(
        'multiple coordination Issues match the exact queue label pair; administrator remediation required',
      );
    }
    if (matches.length === 1) {
      this.issueNumber = matches[0].number;
      return this.issueNumber;
    }
    if (!createIfMissing) {
      throw new GithubQueueStoreError('coordination Issue does not exist; the first normal enqueue creates it');
    }
    const created = await this.issueStore.createIssue({
      title: this.queueTitle,
      body: `Queue coordination for ${this.options.repositoryName}/${this.options.targetRef}. Created deterministically by the first normal enqueue.`,
      labels,
    });
    const afterCreate = await this.issueStore.findIssues(labels);
    if (afterCreate.length !== 1 || afterCreate[0].number !== created.number) {
      throw new GithubQueueStoreError(
        'coordination Issue create raced with another writer; administrator remediation required',
      );
    }
    this.issueNumber = created.number;
    return this.issueNumber;
  }

  private async mutate<T, I>(
    kind: string,
    command: MutationCommand<I>,
    apply: (manifest: QueueManifest) => {
      manifest: QueueManifest;
      disposition: 'applied' | 'duplicate' | 'conflict';
      value?: T;
      reason?: string;
    },
    createIfMissing = false,
  ): Promise<MutationResult<T>> {
    const budget = retryBudget(MAX_STALE_REREADS);
    const hash = payloadHash(command.input);
    for (;;) {
      const projection = await this.readProjection(createIfMissing);
      const { manifest, revision } = projection;
      if (manifest.lastOperation?.operationId === command.operationId) {
        return { operationId: command.operationId, disposition: 'duplicate', revision, reason: 'operation already applied' };
      }
      const receipt = await this.findReceipt(command.operationId);
      if (receipt) {
        if (receipt.payloadHash !== hash) {
          return { operationId: command.operationId, disposition: 'conflict', revision, reason: 'receipt payload hash mismatch' };
        }
        return {
          operationId: command.operationId,
          disposition: 'duplicate',
          revision,
          reason: 'durable matching receipt',
          receiptRef: receipt.operationId,
        };
      }
if (!projection.fresh && command.expectedRevision !== revision) {
          if (budget.exhausted()) {
            return { operationId: command.operationId, disposition: 'conflict', revision, reason: 'stale retry budget exhausted' };
          }
          budget.consume();
          continue;
        }
      const result = apply(manifest);
      if (result.disposition !== 'applied') {
        return {
          operationId: command.operationId,
          disposition: result.disposition,
          revision,
          reason: result.reason,
          value: result.value,
        };
      }
      const proposalBody = serializeProposal(QUEUE_PROPOSAL_MARKER, command.operationId, {
        kind,
        input: JSON.parse(canonicalJson(command.input)) as unknown,
        payloadHash: hash,
      });
      await this.issueStore.addComment(this.issueNumber ?? (await this.resolveIssue(createIfMissing)), proposalBody);

      const reread = await this.readProjection(createIfMissing);
      const rereadReceipt = await this.findReceipt(command.operationId);
      if (rereadReceipt) {
        if (rereadReceipt.payloadHash !== hash) {
          return { operationId: command.operationId, disposition: 'conflict', revision: reread.revision, reason: 'receipt payload hash mismatch' };
        }
        return {
          operationId: command.operationId,
          disposition: 'duplicate',
          revision: reread.revision,
          reason: 'durable matching receipt',
          receiptRef: rereadReceipt.operationId,
        };
      }
      const proposal = reread.manifest.lastOperation;
      if (proposal && proposal.operationId === command.operationId && proposal.kind === kind) {
        return {
          operationId: command.operationId,
          disposition: 'applied',
          revision: reread.revision,
          value: result.value,
        };
      }
      if (budget.exhausted()) {
        return { operationId: command.operationId, disposition: 'conflict', revision: reread.revision, reason: 'append reconciliation lost' };
      }
      budget.consume();
    }
  }

  private async findReceipt(
    operationId: string,
  ): Promise<{ operationId: string; payloadHash: string } | undefined> {
    const issueNumber = this.issueNumber ?? (await this.resolveIssue(false));
    const comments = await this.issueStore.listComments(issueNumber);
    for (const comment of comments) {
      if (!comment.body.startsWith(OPERATION_RECEIPT_MARKER)) continue;
      try {
        const receipt = parseOperationReceipt(comment.body);
        if (receipt.operationId === operationId) {
          return { operationId: receipt.operationId, payloadHash: receipt.payloadHash };
        }
      } catch {
        // Corrupt receipts are reported as blocked evidence elsewhere.
      }
    }
    return undefined;
  }
}

export function projectQueueStream(
  comments: WireComment[],
  options: GithubQueueStoreOptions,
): QueueProjection {
  const manifest = EMPTY_MANIFEST(options);
  const completions: QueueCompletionSummary[] = [];

  for (const comment of comments) {
    if (comment.body.startsWith(QUEUE_COMPLETION_MARKER)) {
      try {
        const envelope = parseProposal(QUEUE_COMPLETION_MARKER, comment.body);
        const payload = envelope.payload as Record<string, unknown>;
        completions.push({
          operationId: envelope.operationId,
          sequence: Number(payload.sequence),
          candidateWorkItemId: String(payload.candidateWorkItemId),
          runId: String(payload.runId),
          outcome: payload.outcome === 'rejected' ? 'rejected' : 'integrated',
          at: String(payload.at),
          pullRequestRef: typeof payload.pullRequestRef === 'string' ? payload.pullRequestRef : undefined,
          evidenceRef: typeof payload.evidenceRef === 'string' ? payload.evidenceRef : undefined,
          blocker: payload.blocker === null || payload.blocker === undefined ? undefined : (payload.blocker as QueueCompletionSummary['blocker']),
        });
      } catch {
        // Corrupt completion markers are reported as blocked evidence, never as authority.
      }
      continue;
    }
    if (comment.body.startsWith(QUEUE_PROPOSAL_MARKER)) {
      let envelope;
      try {
        envelope = parseProposal(QUEUE_PROPOSAL_MARKER, comment.body);
      } catch {
        continue;
      }
      const payload = envelope.payload as Record<string, unknown>;
      const kind = String(payload.kind);
      const input = (payload.input ?? {}) as Record<string, unknown>;
      if (kind === 'enqueue') {
        manifest.entries.push({
          sequence: manifest.nextEnqueueSequence,
          candidateWorkItemId: String(input.candidateWorkItemId),
          runId: String(input.runId),
          state: 'queued',
          enqueuedAt: String(input.enqueuedAt ?? comment.createdAt),
          dependencies: Array.isArray(input.dependencies) ? input.dependencies.map(String) : [],
          decisions: Array.isArray(input.decisions) ? (input.decisions as ConflictDecision[]) : [],
        });
        manifest.nextEnqueueSequence += 1;
      } else {
        applyQueueMutation(manifest, kind, input);
      }
      manifest.lastOperation = {
        operationId: envelope.operationId,
        kind,
        outcome: 'applied',
        at: comment.createdAt,
      };
    }
  }
  return { manifest, completions, revision: streamRevision(comments), fresh: comments.length === 0 };
}

function applyQueueMutation(manifest: QueueManifest, kind: string, input: Record<string, unknown>): void {
  const entrySequence = Number(input.entrySequence);
  const entry = manifest.entries.find((candidate) => candidate.sequence === entrySequence);
  if (kind === 'decision') {
    if (!entry) return;
    const decision = input.decision as ConflictDecision;
    if (!entry.decisions.some((candidate) => candidate.runId === decision.runId)) {
      entry.decisions.push(decision);
    }
    return;
  }
  if (kind === 'lease-acquire') {
    if (manifest.lease && Date.parse(manifest.lease.expiresAt) > Date.parse(String(input.acquiredAt ?? new Date().toISOString()))) {
      return;
    }
    if (!entry) return;
    const acquiredAt = String(input.acquiredAt ?? new Date().toISOString());
    const leaseSeconds = Number(input.leaseSeconds ?? 300);
    manifest.lease = {
      operationId: String(input.operationId),
      entrySequence,
      candidateWorkItemId: entry.candidateWorkItemId,
      runId: entry.runId,
      acquiredAt,
      expiresAt: new Date(Date.parse(acquiredAt) + leaseSeconds * 1000).toISOString(),
      targetCommit: String(input.targetCommit ?? ''),
    };
    entry.state = 'preparing';
    return;
  }
  if (kind === 'lease-renew') {
    if (!manifest.lease || manifest.lease.operationId !== String(input.operationId)) return;
    const leaseSeconds = Number(input.leaseSeconds ?? 300);
    manifest.lease = {
      ...manifest.lease,
      expiresAt: new Date(Date.parse(String(input.renewedAt ?? new Date().toISOString())) + leaseSeconds * 1000).toISOString(),
    };
    return;
  }
  if (kind === 'lease-release') {
    if (!manifest.lease || manifest.lease.operationId !== String(input.operationId)) return;
    if (entry && entry.state === 'preparing') {
      entry.state = input.reason === 'drift' ? 'blocked' : 'queued';
    }
    manifest.lease = null;
    return;
  }
  if (kind === 'finalize') {
    if (!entry) return;
    manifest.entries.splice(manifest.entries.indexOf(entry), 1);
    manifest.lease = null;
    return;
  }
}