// Integration queue (T035/T038, FR-011/FR-012): dependency-ordered, one
// candidate at a time against the latest target, verification rerun after
// each incorporation; semantic conflicts require a responsible Work Item or
// human decision — never automatic side selection.

import type {
  AgentCheckpoint,
  ConflictDecision,
  IntegrationResult,
  QueuePosition,
  RunId,
  VerificationResult,
  WorkItemId,
} from './types.ts';
import { conflictError } from '../errors.ts';

export interface QueuedCandidate {
  runId: RunId;
  workItemId?: WorkItemId;
  /** Immutable provider-neutral enqueue order. Local mirrors must not recalculate it. */
  enqueueSequence: number;
  checkpoint: AgentCheckpoint;
  dependencies: WorkItemId[];
  semanticOverlaps: ConflictDecision[];
  state?: 'queued' | 'blocked' | 'preparing' | 'incorporating';
  latestTargetCommit?: string;
  driftReason?: string;
}

export interface QueueLease {
  runId: RunId;
  operationId: string;
  targetCommit: string;
  acquiredAt: string;
  expiresAt: string;
}

export class IntegrationQueue {
  private readonly candidates: QueuedCandidate[] = [];
  private readonly decisions = new Map<RunId, ConflictDecision>();
  private nextSequence = 1;
  private lease: QueueLease | undefined;

  enqueue(
    runId: RunId,
    checkpoint: AgentCheckpoint,
    dependencies: WorkItemId[],
    workItemId?: WorkItemId,
  ): QueuePosition {
    const existing = this.candidates.find((candidate) => candidate.runId === runId || (workItemId && candidate.workItemId === workItemId));
    if (existing) {
      return {
        runId,
        position: this.candidates.indexOf(existing) + 1,
        dependencies: existing.dependencies,
      };
    }
    const position = this.candidates.length + 1;
    this.candidates.push({ runId, workItemId, enqueueSequence: this.nextSequence++, checkpoint, dependencies: [...dependencies], semanticOverlaps: [], state: 'queued' });
    return { runId, position, dependencies };
  }

  recordDecision(decision: ConflictDecision): void {
    if (decision.decision === 'human' && decision.decidedBy === 'unresolved') {
      throw conflictError(
        'semantic conflict requires a responsible Work Item or human decision; ' +
          'the integration flow never selects one side automatically (FR-012)',
      );
    }
    this.decisions.set(decision.runId, decision);
    const candidate = this.candidates.find((entry) => entry.runId === decision.runId);
    if (candidate && !candidate.semanticOverlaps.some((existing) => existing.runId === decision.runId && existing.decision === decision.decision && existing.decidedBy === decision.decidedBy)) {
      candidate.semanticOverlaps.push({ ...decision });
    }
  }

  /** Acquire the single local integration lease used by coordinator adapters. */
  acquireLease(runId: RunId, operationId: string, targetCommit: string, now = new Date().toISOString(), leaseSeconds = 300): QueueLease {
    if (this.lease && Date.parse(this.lease.expiresAt) > Date.parse(now) && this.lease.runId !== runId) {
      throw conflictError(`integration lease is already held by ${this.lease.runId}`);
    }
    const candidate = this.candidates.find((entry) => entry.runId === runId);
    if (!candidate) throw conflictError(`cannot lease unknown queue candidate ${runId}`);
    if (!this.nextIncorporable([]) || this.nextIncorporable([])?.runId !== runId) throw conflictError(`queue candidate ${runId} is not the lowest eligible candidate`);
    this.lease = { runId, operationId, targetCommit, acquiredAt: now, expiresAt: new Date(Date.parse(now) + leaseSeconds * 1000).toISOString() };
    candidate.state = 'preparing';
    candidate.latestTargetCommit = targetCommit;
    return { ...this.lease };
  }

  renewLease(operationId: string, now = new Date().toISOString(), leaseSeconds = 300): QueueLease {
    if (!this.lease || this.lease.operationId !== operationId) throw conflictError('integration lease is not owned by the operation');
    this.lease = { ...this.lease, expiresAt: new Date(Date.parse(now) + leaseSeconds * 1000).toISOString() };
    return { ...this.lease };
  }

  releaseLease(operationId: string, reason: string): void {
    if (!this.lease || this.lease.operationId !== operationId) throw conflictError('integration lease is not owned by the operation');
    const candidate = this.candidates.find((entry) => entry.runId === this.lease?.runId);
    if (candidate) {
      candidate.state = reason === 'drift' || reason === 'policy' ? 'blocked' : 'queued';
      if (reason === 'drift' || reason === 'policy') candidate.driftReason = reason;
    }
    this.lease = undefined;
  }

  invalidate(runId: RunId, reason: string): void {
    const candidate = this.candidates.find((entry) => entry.runId === runId);
    if (!candidate) throw conflictError(`cannot invalidate unknown queue candidate ${runId}`);
    candidate.state = 'blocked';
    candidate.driftReason = reason;
    if (this.lease?.runId === runId) this.lease = undefined;
  }

  leaseSnapshot(): QueueLease | undefined { return this.lease ? { ...this.lease } : undefined; }

  /**
   * Next candidate in dependency order: a candidate whose dependencies are
   * not yet incorporated is skipped until its dependencies clear.
   */
  nextIncorporable(incorporated: WorkItemId[]): QueuedCandidate | undefined {
    const available = this.candidates
      .filter((c) => (c.state ?? 'queued') === 'queued')
      .filter((c) => !c.dependencies.some((d) => !incorporated.includes(d)))
      .filter((c) => !c.semanticOverlaps.some((decision) => decision.decision === 'rejected' || (decision.decision === 'human' && decision.decidedBy === 'unresolved')))
      .sort((left, right) => left.enqueueSequence - right.enqueueSequence);
    return available[0];
  }

  incorporateNext(
    verificationAfter: VerificationResult[],
    incorporated: WorkItemId[],
    workItemIdOf: (runId: RunId) => WorkItemId | undefined,
  ): IntegrationResult {
    const next = this.nextIncorporable(incorporated);
    if (!next) {
      return { runId: '', state: 'rejected', verification: [], blocker: 'conflict' };
    }
    const decision = this.decisions.get(next.runId);
    if (decision && decision.decision === 'rejected') {
      this.candidates.splice(this.candidates.indexOf(next), 1);
      return {
        runId: next.runId,
        state: 'rejected',
        verification: [],
        blocker: 'conflict',
      };
    }
    if (verificationAfter.some((check) => check.outcome !== 'passed')) {
      next.state = 'blocked';
      if (this.lease?.runId === next.runId) this.lease = undefined;
      return {
        runId: next.runId,
        state: 'rejected',
        verification: verificationAfter,
        blocker: verificationAfter.some((check) => check.outcome === 'blocked' || check.outcome === 'unexecuted')
          ? 'capability'
          : 'conflict',
      };
    }
    if (this.lease && this.lease.runId !== next.runId && Date.parse(this.lease.expiresAt) > Date.now()) {
      return { runId: next.runId, state: 'rejected', verification: [], blocker: 'conflict' };
    }
    next.state = 'incorporating';
    this.candidates.splice(this.candidates.indexOf(next), 1);
    if (this.lease?.runId === next.runId) this.lease = undefined;
    return {
      runId: next.runId,
      state: 'incorporated',
      verification: verificationAfter,
    };
  }

  snapshot(): QueuedCandidate[] {
    return this.candidates.map((candidate) => ({
      ...candidate,
      enqueueSequence: candidate.enqueueSequence ?? this.candidates.indexOf(candidate) + 1,
      dependencies: [...candidate.dependencies],
      semanticOverlaps: [...candidate.semanticOverlaps],
    }));
  }

  restore(candidates: QueuedCandidate[]): void {
    this.candidates.length = 0;
    this.lease = undefined;
    this.nextSequence = 1;
    for (const candidate of candidates) {
      this.candidates.push({
        ...candidate,
        enqueueSequence: candidate.enqueueSequence ?? this.nextSequence,
        dependencies: [...candidate.dependencies],
        semanticOverlaps: [...candidate.semanticOverlaps],
      });
      this.nextSequence = Math.max(this.nextSequence, (candidate.enqueueSequence ?? this.nextSequence) + 1);
    }
  }

  queuePositions(): Array<{ runId: RunId; position: number }> {
    return [...this.candidates]
      .sort((left, right) => left.enqueueSequence - right.enqueueSequence)
      .map((c, index) => ({ runId: c.runId, position: index + 1 }));
  }

  candidatesList(): readonly QueuedCandidate[] {
    return this.candidates;
  }
}
