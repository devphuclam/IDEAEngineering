import type {
  AgentCheckpoint,
  EnqueueCandidate,
  IntegrationTarget,
  MutationCommand,
  PolicySnapshot,
  PullRequestRef,
  RunEvidence,
  VerificationResult,
} from './types.ts';
import { aggregateOutcome, snapshotIsPassable } from './policy.ts';
import type { CanonicalQueueStore, EvidenceStore, LocalVerificationRunner, PolicyAdapter, SourceHostAdapter } from '../adapters/ports.ts';

export interface IntegrationRequest {
  candidateWorkItemId: string;
  runId: string;
  checkpoint: AgentCheckpoint;
  dependencies: string[];
  decisions: EnqueueCandidate['decisions'];
  worktreePath: string;
  verificationCommands: string[];
  title: string;
}

export interface IntegrationOutcome {
  operationId: string;
  state: 'queued' | 'blocked' | 'integrated' | 'rejected';
  queuePosition?: number;
  targetCommit?: string;
  pullRequest?: PullRequestRef;
  verification: VerificationResult[];
  policy?: PolicySnapshot;
  nextAction?: string;
}

export interface IntegrationCoordinatorOptions {
  queue: CanonicalQueueStore;
  sourceHost: SourceHostAdapter;
  policies: PolicyAdapter;
  verification: LocalVerificationRunner;
  evidence?: EvidenceStore;
  clock?: () => string;
}

export class IntegrationCoordinator {
  private readonly options: IntegrationCoordinatorOptions;
  private readonly clock: () => string;

  constructor(options: IntegrationCoordinatorOptions) {
    this.options = options;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  async integrate(request: IntegrationRequest, target: IntegrationTarget): Promise<IntegrationOutcome> {
    const operationId = `integrate-${request.runId}`;
    let queue = await this.options.queue.read(target);
    const existing = queue.value.entries.find((entry) => entry.candidateWorkItemId === request.candidateWorkItemId && entry.runId === request.runId);
    if (!existing) {
      const enqueue: MutationCommand<EnqueueCandidate> = { operationId: `${operationId}:enqueue`, expectedRevision: queue.revision, actor: request.checkpoint.runId, requestedAt: this.clock(), input: { candidateWorkItemId: request.candidateWorkItemId, runId: request.runId, dependencies: request.dependencies, decisions: request.decisions } };
      const enqueued = await this.options.queue.enqueue(enqueue);
      if (enqueued.disposition === 'conflict') return { operationId, state: 'blocked', verification: [], nextAction: enqueued.reason };
      queue = await this.options.queue.read(target);
    }
    const position = queue.value.entries.findIndex((entry) => entry.candidateWorkItemId === request.candidateWorkItemId && entry.runId === request.runId);
    if (queue.value.entries.find((entry) => entry.candidateWorkItemId === request.candidateWorkItemId && entry.runId === request.runId)?.state === 'blocked') return { operationId, state: 'blocked', queuePosition: position + 1, verification: [], nextAction: 'resolve queue dependency or semantic decision' };
    const targetCommit = await this.options.sourceHost.targetHead(target.targetRef);
    const acquireCommand: MutationCommand<{ entrySequence: number; leaseSeconds?: number; targetCommit: string }> = { operationId: `${operationId}:lease`, expectedRevision: queue.revision, actor: request.runId, requestedAt: this.clock(), input: { entrySequence: queue.value.entries[position]?.sequence ?? 0, leaseSeconds: 300, targetCommit } };
    const lease = await this.options.queue.acquireNext(acquireCommand);
    if (lease.disposition !== 'applied' || !lease.value) return { operationId, state: 'queued', queuePosition: position + 1, targetCommit, verification: [], nextAction: lease.reason ?? 'waiting for an eligible queue lease' };
    const verification = await this.options.verification.run(request.verificationCommands, request.worktreePath);
    if (verification.length === 0 || verification.some((result) => result.outcome !== 'passed')) {
      await this.release(target, lease.value.entrySequence, lease.value.operationId, request.runId, 'verification');
      return { operationId, state: 'rejected', queuePosition: position + 1, targetCommit, verification, nextAction: 'fix local verification before integration' };
    }
    const pullRequest = await this.options.sourceHost.ensurePullRequest({ repositoryId: target.repositoryId, sourceRef: toHeadRef(request.checkpoint.branch), targetRef: toHeadRef(target.targetRef), title: request.title, workItemId: request.candidateWorkItemId });
    const policy = await this.options.policies.evaluatePullRequest({ ...pullRequest, sourceCommit: request.checkpoint.commit, targetCommit });
    if (!snapshotIsPassable(policy)) {
      await this.release(target, lease.value.entrySequence, lease.value.operationId, request.runId, 'policy');
      return { operationId, state: 'blocked', queuePosition: position + 1, targetCommit, pullRequest, verification, policy, nextAction: 'resolve every provider policy requirement and re-run integration' };
    }
    const currentTarget = await this.options.sourceHost.targetHead(target.targetRef);
    if (currentTarget !== targetCommit) {
      await this.release(target, lease.value.entrySequence, lease.value.operationId, request.runId, 'drift');
      return { operationId, state: 'blocked', queuePosition: position + 1, targetCommit: currentTarget, pullRequest, verification, policy, nextAction: 'target changed; refresh the integration attempt' };
    }
    const completion = await this.options.sourceHost.completePullRequest(pullRequest, targetCommit);
    const afterVerification = await this.options.verification.run(request.verificationCommands, request.worktreePath);
    if (afterVerification.length === 0 || afterVerification.some((result) => result.outcome !== 'passed')) {
      await this.release(target, lease.value.entrySequence, lease.value.operationId, request.runId, 'post-merge-verification');
      return { operationId, state: 'rejected', queuePosition: position + 1, targetCommit: completion.targetCommit, pullRequest: completion.pullRequestRef, verification: afterVerification, policy, nextAction: 'post-merge verification did not pass' };
    }
    const refreshed = await this.options.queue.read(target);
    const finalized = await this.options.queue.finalize({ operationId: `${operationId}:finalize`, expectedRevision: refreshed.revision, actor: request.runId, requestedAt: this.clock(), input: { entrySequence: lease.value.entrySequence, outcome: 'integrated', pullRequestRef: pullRequest.url, evidenceRef: `run:${request.runId}`, blocker: null } });
    if (finalized.disposition !== 'applied') return { operationId, state: 'blocked', targetCommit: completion.targetCommit, pullRequest: completion.pullRequestRef, verification: afterVerification, policy, nextAction: finalized.reason ?? 'queue finalization must be repaired' };
    return { operationId, state: 'integrated', queuePosition: position + 1, targetCommit: completion.targetCommit, pullRequest: completion.pullRequestRef, verification: afterVerification, policy };
  }

  private async release(target: IntegrationTarget, entrySequence: number, leaseOperationId: string, actor: string, reason: string): Promise<void> {
    const current = await this.options.queue.read(target);
    await this.options.queue.releaseLease({ operationId: leaseOperationId, expectedRevision: current.revision, actor, requestedAt: this.clock(), input: { operationId: leaseOperationId, entrySequence, reason } });
  }
}

function toHeadRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : `refs/heads/${ref}`;
}
