# Adapter Ports: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace | **Package**: `tools/agent-workspace/`

Provider-neutral TypeScript port interfaces (the design's replaceable boundaries). Implementations
live in adapters; domain logic lives against these ports. Contract tests run every adapter
against the same behavior suite.

```ts
// Shared domain types (canonical terms from CONTEXT.md)

export type WorkItemId = string;
export type RunId = string;
export type SandboxId = string;
export type CheckpointId = string;

export type WorkItemState =
  | 'open' | 'claimed' | 'in-progress' | 'ready-for-integration'
  | 'integrated' | 'blocked';

export type RunState =
  | 'requested' | 'claimed' | 'preparing' | 'running' | 'verifying'
  | 'ready-for-integration'
  | 'integrated' | 'failed' | 'cancelled' | 'expired';

export type CheckOutcome = 'passed' | 'failed' | 'blocked' | 'unexecuted';

export type BlockerClassification =
  | 'capability' | 'credential' | 'quota' | 'region' | 'network' | 'conflict' | 'other';

export interface ChangeScope {
  paths: string[];
  semanticSeams: string[];
  prerequisites: WorkItemId[];
  integrationTarget: string;
}

export interface WorkItem {
  id: WorkItemId;
  title: string;
  description?: string;
  dependencies: WorkItemId[];
  changeScope: ChangeScope;
}

export interface ClaimRecord {
  claimToken: string;
  claimant: string;
  runId: RunId;
  acquiredAt: string;      // ISO 8601
  leaseExpiresAt: string;  // ISO 8601
  kind: 'acquire' | 'renew' | 'handoff' | 'release' | 'expire';
  previousOwner?: string;
}

export interface AgentCheckpoint {
  checkpointId: CheckpointId;
  runId: RunId;
  branch: string;
  commit: string;
  verification: VerificationResult[];
  unresolvedWork: string[];
  nextAction: string;
  createdAt: string;
}

export interface VerificationResult {
  command: string;
  outcome: CheckOutcome;   // never misreports blocked/unexecuted as passed
  evidenceRef?: string;
}

export interface RunEvidence {
  runId: RunId;
  workItemId: WorkItemId;
  owner: string;
  timestamps: string[];
  stateTransitions: Array<{ from: RunState; to: RunState; at: string }>;
  checkpointRefs: CheckpointId[];
  verification: VerificationResult[];
  integrationResult?: 'integrated' | 'rejected' | 'pending';
  blocker?: BlockerClassification;
  retention?: { days: number; expiresAt: string };
  nextAction?: string;
  unresolvedRisks?: string[];
  retryOf?: RunId;
  ownerHistory?: Array<{ from: string; to: string; at: string }>;
  actions?: Array<{ action: string; actor: string; at: string; outcome: CheckOutcome }>;
}
```

## Ports

```ts
export interface WorkItemAdapter {
  read(workItemId: WorkItemId): Promise<WorkItem>;
  appendEvidence(workItemId: WorkItemId, evidence: RunEvidence): Promise<void>;
  setState(workItemId: WorkItemId, state: WorkItemState): Promise<void>;
}

export interface ClaimStore {
  acquire(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  renew(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  handoff(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  release(workItemId: WorkItemId, claimToken?: string): Promise<void>;
  expire(workItemId: WorkItemId, claimToken?: string): Promise<void>;
  // Deterministic winner: first valid unexpired record; rejects with conflict otherwise.
  active(workItemId: WorkItemId): Promise<ClaimRecord | undefined>;
}

export interface RunnerAdapter {
  create(runId: RunId, branch: string, from?: string): Promise<SandboxId>;
  destroy(sandboxId: SandboxId): Promise<void>;
  // Local: isolated git worktree. Managed: disabled until approved credential exists.
}

export interface AgentDriver {
  prepare(sandboxId: SandboxId, runContext: RunContext): Promise<void>;
  // Codex Desktop: tells the owner which folder to open. Never scrapes or injects.
}

export interface EvidenceStore {
  persist(evidence: RunEvidence): Promise<void>;
  read(runId: RunId): Promise<RunEvidence>;
  list(workItemId: WorkItemId): Promise<RunEvidence[]>;
  // Redacts credentials, prompts, transcripts, and source snapshots before persistence.
}

export interface SourceHostAdapter {
  createBranch(name: string, from: string): Promise<void>;
  pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath?: string): Promise<void>;
  openPullRequest(workItemId: WorkItemId, branch: string, integrationTarget?: string): Promise<string>;
  requiredChecks(integrationTarget: string): Promise<string[]>;
  recordCheckpoint?(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void>;
  readCheckpoints?(workItemId: WorkItemId): Promise<AgentCheckpoint[]>;
  remoteCommit?(checkpoint: AgentCheckpoint): Promise<boolean>;
  mergePullRequest?(branch: string, integrationTarget: string): Promise<void>;
  // Never pushes directly to the protected integration target (FR-020).
}

export interface IntegrationQueue {
  enqueue(runId: RunId, checkpoint: AgentCheckpoint): Promise<QueuePosition>;
  incorporateNext(): Promise<IntegrationResult>;
  // Dependency-ordered; one at a time; verification rerun after each incorporation.
  semanticConflict(runId: RunId): Promise<ConflictDecision>;
  // Never resolves a semantic conflict by automatic side selection (FR-012).
}
```

## Run context

```ts
export interface RunContext {
  runId: RunId;
  workItemId: WorkItemId;
  owner: string;
  sandboxId: SandboxId;
  branch: string;
  worktreePath: string;
  changeScope: ChangeScope;
}
```

## GitHub adapter mapping

| Port | Implementation |
|---|---|
| `WorkItemAdapter` | Issue read/write via `gh` CLI; evidence appended as structured comments. |
| `ClaimStore` | Append-only claim records on the Issue; oldest valid wins (see `research.md` §2). |
| `RunnerAdapter` | `git worktree add .worktrees/<run-id> -b feature/<slug>`; serialized git ops. |
| `AgentDriver` | Instructs the owner to open the worktree folder in Codex Desktop. |
| `EvidenceStore` | Issue comment records + local `.workspace/runs/<run-id>/run/evidence.json`; redaction before write. |
| `SourceHostAdapter` | `gh pr create`; branch protection read via REST; never pushes to the integration target. |
| `IntegrationQueue` | Ordered PR-merge flow; required checks gate each incorporation. |

Managed execution (Container Apps Dynamic Sessions, Service Bus, Table/Blob Storage, Entra ID)
maps the same ports in a later phase and stays disabled without an approved AI Workload
Credential (FR-018).
