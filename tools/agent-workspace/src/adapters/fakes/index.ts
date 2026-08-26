// In-memory fake adapters for unit and contract tests.
// All ports from contracts/adapters.md with the same behavior contracts.

import type {
  AgentCheckpoint,
  ClaimRecord,
  ClaimState,
  ConflictDecision,
  IntegrationResult,
  QueuePosition,
  RunContext,
  RunEvidence,
  SandboxId,
  VerificationResult,
  WorkItem,
  WorkItemId,
  WorkItemState,
} from '../../domain/types.ts';
import { acquire, handoff, reconcile, renew } from '../../domain/claims.ts';
import { redactEvidence } from '../../domain/redaction.ts';
import type {
  AgentDriver,
  LegacyClaimStore,
  LegacyEvidenceStore,
  LegacyIntegrationQueue,
  RunnerAdapter,
  LegacySourceHostAdapter,
  LegacyWorkItemAdapter,
} from '../ports.ts';

export class FakeWorkItemAdapter implements LegacyWorkItemAdapter {
  readonly items = new Map<WorkItemId, WorkItem>();
  readonly states = new Map<WorkItemId, WorkItemState>();
  readonly evidenceLog: Array<{ workItemId: WorkItemId; evidence: RunEvidence }> = [];

  async read(workItemId: WorkItemId): Promise<WorkItem> {
    const item = this.items.get(workItemId);
    if (!item) throw new Error(`work item ${workItemId} not found`);
    return item;
  }

  async appendEvidence(workItemId: WorkItemId, evidence: RunEvidence): Promise<void> {
    this.evidenceLog.push({ workItemId, evidence });
  }

  async setState(workItemId: WorkItemId, state: WorkItemState): Promise<void> {
    this.states.set(workItemId, state);
  }

  async listOpen(): Promise<WorkItem[]> {
    return [...this.items.values()];
  }
}

export class FakeClaimStore implements LegacyClaimStore {
  readonly recordsByItem = new Map<WorkItemId, ClaimRecord[]>();
  now: () => string = () => new Date().toISOString();

  private list(workItemId: WorkItemId): ClaimRecord[] {
    let list = this.recordsByItem.get(workItemId);
    if (!list) {
      list = [];
      this.recordsByItem.set(workItemId, list);
    }
    return list;
  }

  async acquire(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const list = this.list(claim.workItemId);
    const outcome = acquire(list, claim, this.now());
    if (outcome.winner && !list.some((r) => r.claimToken === claim.claimToken)) {
      list.push(claim);
    }
    return outcome;
  }

  async renew(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const list = this.list(claim.workItemId);
    const outcome = renew(list, claim, this.now());
    if (outcome.winner) {
      list.push(claim);
    }
    return outcome;
  }

  async handoff(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const list = this.list(claim.workItemId);
    const outcome = handoff(list, claim, this.now());
    if (outcome.winner) list.push(claim);
    return outcome;
  }

  async release(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const list = this.list(workItemId);
    const active = reconcile(list, this.now()).active;
    if (active && (!claimToken || active.claimToken === claimToken)) {
      list.push({ ...active, kind: 'release' });
    }
  }

  async expire(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const list = this.list(workItemId);
    const active = reconcile(list, this.now()).active;
    if (active && (!claimToken || active.claimToken === claimToken)) {
      list.push({ ...active, kind: 'expire' });
    }
  }

  async active(workItemId: WorkItemId): Promise<ClaimState | undefined> {
    return reconcile(this.list(workItemId), this.now()).active;
  }

  async records(workItemId: WorkItemId): Promise<ClaimRecord[]> {
    return [...this.list(workItemId)];
  }
}

export class FakeRunnerAdapter implements RunnerAdapter {
  readonly sandboxes: SandboxId[] = [];

  async create(runId: string, branch: string, from?: string): Promise<SandboxId> {
    const sandboxId = `sandbox-${runId}`;
    if (!this.sandboxes.includes(sandboxId)) this.sandboxes.push(sandboxId);
    void branch;
    void from;
    return sandboxId;
  }

  async destroy(sandboxId: SandboxId): Promise<void> {
    const index = this.sandboxes.indexOf(sandboxId);
    if (index >= 0) this.sandboxes.splice(index, 1);
  }
}

export class FakeAgentDriver implements AgentDriver {
  readonly instructions: string[] = [];

  async prepare(sandboxId: SandboxId, runContext: RunContext): Promise<void> {
    this.instructions.push(`open folder ${runContext.worktreePath} (sandbox ${sandboxId}) in Codex Desktop`);
  }
}

export class FakeEvidenceStore implements LegacyEvidenceStore {
  readonly evidence = new Map<string, RunEvidence[]>();

  async persist(evidence: RunEvidence): Promise<void> {
    const entries = this.evidence.get(evidence.runId) ?? [];
    entries.push(redactEvidence(evidence));
    this.evidence.set(evidence.runId, entries);
  }

  async read(runId: string): Promise<RunEvidence> {
    const records = this.evidence.get(runId);
    const record = records?.at(-1);
    if (!record) throw new Error(`no evidence for run ${runId}`);
    return record;
  }

  async list(workItemId: string): Promise<RunEvidence[]> {
    return [...this.evidence.values()].flat().filter((record) => record.workItemId === workItemId);
  }
}

export class FakeSourceHostAdapter implements LegacySourceHostAdapter {
  readonly branches: string[] = [];
  readonly pullRequests: string[] = [];
  readonly protection = new Map<
    string,
    { requiredApprovingReviews: number; checks: string[] }
  >();
  checkpoint: AgentCheckpoint | undefined;
  readonly checkpoints = new Map<WorkItemId, AgentCheckpoint>();

  async createBranch(name: string, from: string): Promise<void> {
    this.branches.push(name);
    void from;
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath?: string): Promise<void> {
    this.checkpoint = checkpoint;
    void worktreePath;
  }

  async openPullRequest(workItemId: WorkItemId, branch: string, integrationTarget?: string): Promise<string> {
    const url = `https://github.com/fake/repo/pull/${this.pullRequests.length + 1}`;
    this.pullRequests.push(`${workItemId}:${branch}`);
    void integrationTarget;
    return url;
  }

  async requiredChecks(integrationTarget: string): Promise<string[]> {
    return this.protection.get(integrationTarget)?.checks ?? [];
  }

  async recordCheckpoint(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void> {
    this.checkpoint = checkpoint;
    this.checkpoints.set(workItemId, checkpoint);
  }

  async readCheckpoints(workItemId: WorkItemId): Promise<AgentCheckpoint[]> {
    const checkpoint = this.checkpoints.get(workItemId) ?? this.checkpoint;
    return checkpoint ? [checkpoint] : [];
  }

  async remoteCommit(checkpoint: AgentCheckpoint): Promise<boolean> {
    return this.checkpoint?.commit === checkpoint.commit;
  }

  async mergePullRequest(branch: string, integrationTarget: string): Promise<void> {
    void branch;
    void integrationTarget;
  }
}

export class FakeIntegrationQueue implements LegacyIntegrationQueue {
  readonly entries: Array<{
    runId: string;
    checkpoint: AgentCheckpoint;
    dependencies: string[];
  }> = [];
  decisions = new Map<string, ConflictDecision>();
  verificationForNext: VerificationResult[] = [{ command: 'npm test', outcome: 'passed' }];

  async enqueue(runId: string, checkpoint: AgentCheckpoint, dependencies: string[] = []): Promise<QueuePosition> {
    const position = this.entries.length + 1;
    this.entries.push({ runId, checkpoint, dependencies });
    return { runId, position, dependencies };
  }

  async incorporateNext(): Promise<IntegrationResult> {
    const next = this.entries.shift();
    if (!next) {
      return { runId: '', state: 'rejected', verification: [] };
    }
    const decision = this.decisions.get(next.runId);
    if (decision && decision.decision === 'rejected') {
      return { runId: next.runId, state: 'rejected', verification: [] };
    }
    return {
      runId: next.runId,
      state: 'incorporated',
      verification: this.verificationForNext,
    };
  }

  async semanticConflict(runId: string): Promise<ConflictDecision> {
    const existing = this.decisions.get(runId);
    if (existing) return existing;
    const pending: ConflictDecision = {
      runId,
      decision: 'human',
      decidedBy: 'unresolved',
      decidedAt: new Date().toISOString(),
    };
    this.decisions.set(runId, pending);
    return pending;
  }
}
