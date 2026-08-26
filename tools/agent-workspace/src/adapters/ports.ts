// Provider-neutral port contracts per contracts/provider-ports.md.
// Domain logic lives against these ports; contract tests run every adapter
// against the same behavior suite. No provider wire type, credential, or
// provider-specific error crosses these boundaries.

import type {
  AcquireIntegration,
  AdoptionPlan,
  AdoptionRequest,
  AgentCheckpoint,
  ClaimRelease,
  ClaimState,
  EnqueueCandidate,
  EvidencePublicationRef,
  FinalizeCandidate,
  HandoffRecord,
  IntegrationLease,
  IntegrationTarget,
  MutationCommand,
  MutationResult,
  OperationId,
  OperationReceipt,
  PolicyInventory,
  PolicySnapshot,
  PreparationApplyResult,
  PreparationNotApplicableResult,
  PreparationPlan,
  PublicationResult,
  PullRequestCompletion,
  PullRequestRef,
  PullRequestRequest,
  QueueCompletionSummary,
  QueueDecision,
  QueueManifest,
  ReadinessReport,
  RemoteCheckpoint,
  RemoteBranchRef,
  RemoteRoleSnapshot,
  RenewIntegrationLease,
  ReleaseIntegrationLease,
  Revisioned,
  RevisionedWorkItem,
  RunContext,
  RunEvidence,
  RunId,
  RuntimeReadinessReport,
  SandboxId,
  VerificationResult,
  WorkItemId,
  WorkItemState,
  WorkItemStateTransition,
} from '../domain/types.ts';

export type {
  AcquireIntegration,
  AdoptionPlan,
  AdoptionRequest,
  ClaimRelease,
  EnqueueCandidate,
  FinalizeCandidate,
  IntegrationLease,
  IntegrationTarget,
  MutationCommand,
  MutationResult,
  OperationId,
  OperationReceipt,
  PolicyInventory,
  PolicySnapshot,
  PreparationApplyResult,
  PreparationNotApplicableResult,
  PreparationPlan,
  ProviderRevision,
  PublicationResult,
  PullRequestCompletion,
  PullRequestRef,
  PullRequestRequest,
  QueueCompletionSummary,
  QueueDecision,
  QueueManifest,
  ReadinessReport,
  RemoteCheckpoint,
  RemoteBranchRef,
  RemoteRoleSnapshot,
  RenewIntegrationLease,
  ReleaseIntegrationLease,
  Revisioned,
  RevisionedWorkItem,
  RuntimeReadinessReport,
} from '../domain/types.ts';

export { MAX_STALE_REREADS, payloadHash } from '../domain/mutations.ts';

export interface ClaimStore {
  acquire(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>>;
  renew(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>>;
  handoff(command: MutationCommand<HandoffRecord>): Promise<MutationResult<ClaimState>>;
  release(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>>;
  expire(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>>;
  active(workItemId: WorkItemId): Promise<Revisioned<ClaimState | undefined>>;
  records(workItemId: WorkItemId, operationId?: OperationId): Promise<OperationReceipt[]>;
  reconcilePending(workItemId: WorkItemId): Promise<PublicationResult>;
}

export interface WorkItemAdapter {
  read(workItemId: WorkItemId): Promise<Revisioned<RevisionedWorkItem>>;
  listOpen(): Promise<Array<Revisioned<RevisionedWorkItem>>>;
  projectState(
    command: MutationCommand<WorkItemStateTransition>,
  ): Promise<MutationResult<WorkItemState>>;
}

export interface EvidenceStore {
  reconcilePending(workItemId: WorkItemId): Promise<PublicationResult>;
  publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>>;
  read(runId: RunId): Promise<RunEvidence>;
  list(workItemId: WorkItemId): Promise<RunEvidence[]>;
  /** Optional validation capability for rebuilding a lost local ledger from immutable provider records. */
  findPublications?(workItemId: WorkItemId, providerMarker: string): Promise<EvidencePublicationRef[]>;
}

export interface CanonicalQueueStore {
  read(target: IntegrationTarget): Promise<Revisioned<QueueManifest>>;
  enqueue(command: MutationCommand<EnqueueCandidate>): Promise<MutationResult<QueueManifest>>;
  recordDecision(command: MutationCommand<QueueDecision>): Promise<MutationResult<QueueManifest>>;
  acquireNext(
    command: MutationCommand<AcquireIntegration>,
  ): Promise<MutationResult<IntegrationLease>>;
  renewLease(command: MutationCommand<RenewIntegrationLease>): Promise<MutationResult<IntegrationLease>>;
  releaseLease(command: MutationCommand<ReleaseIntegrationLease>): Promise<MutationResult<QueueManifest>>;
  finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>>;
  reconcilePending(target: IntegrationTarget): Promise<PublicationResult>;
  completionHistory(target: IntegrationTarget): Promise<QueueCompletionSummary[]>;
}

export interface SourceHostAdapter {
  targetHead(targetRef: string): Promise<string>;
  createSourceBranch?(sourceRef: string, fromCommit: string): Promise<RemoteBranchRef>;
  sourceHead?(sourceRef: string): Promise<string | undefined>;
  listSourceBranches?(prefix: string): Promise<RemoteBranchRef[]>;
  deleteSourceBranch?(sourceRef: string, expectedHead: string): Promise<void>;
  pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath: string): Promise<RemoteCheckpoint>;
  recordCheckpoint?(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void>;
  readCheckpoints?(workItemId: WorkItemId): Promise<AgentCheckpoint[]>;
  remoteCommit?(checkpoint: AgentCheckpoint): Promise<boolean>;
  ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef>;
  listPullRequests?(sourceRef?: string): Promise<PullRequestRef[]>;
  readPullRequest(ref: PullRequestRef): Promise<PullRequestRef>;
  /** Cleanup guard; adapters must fail closed on a pre/post source-head mismatch. */
  abandonPullRequest?(ref: PullRequestRef, expectedSourceCommit?: string): Promise<PullRequestRef>;
  completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion>;
  remoteRoles(): Promise<RemoteRoleSnapshot>;
  previewAdoption(request: AdoptionRequest): Promise<AdoptionPlan>;
  applyAdoption(command: MutationCommand<AdoptionPlan>): Promise<MutationResult<RemoteRoleSnapshot>>;
}

export interface LocalVerificationRunner {
  run(commands: string[], cwd: string): Promise<VerificationResult[]>;
}

export interface PolicyAdapter {
  inspectTarget(target: IntegrationTarget): Promise<PolicyInventory>;
  evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot>;
}

export interface ProviderPreparationAdapter {
  readiness(): Promise<ReadinessReport>;
  preview(): Promise<PreparationPlan>;
  apply(command: MutationCommand<PreparationPlan>): Promise<PreparationApplyResult>;
}

export interface RuntimeReadinessAdapter {
  inspect(): Promise<RuntimeReadinessReport>;
}

export interface RunnerAdapter {
  create(runId: RunId, branch: string, from?: string, protectedTarget?: string): Promise<SandboxId>;
  destroy(sandboxId: SandboxId): Promise<void>;
}

export interface AgentDriver {
  prepare(sandboxId: SandboxId, runContext: RunContext): Promise<void>;
}

export interface CliContext {
  cwd: string;
  provider: 'github' | 'azure-devops';
  owner: string;
  workItems: WorkItemAdapter;
  claims: ClaimStore;
  evidence: EvidenceStore;
  queue: CanonicalQueueStore;
  sourceHost: SourceHostAdapter;
  policies: PolicyAdapter;
  verification: LocalVerificationRunner;
  preparation: ProviderPreparationAdapter;
  runtime: RuntimeReadinessAdapter;
  runner: RunnerAdapter;
  driver: AgentDriver;
}

import type { ClaimRecord } from '../domain/types.ts';

// ---- Legacy (feature-001) port shapes --------------------------------
// Retained only for the staged migration: existing GitHub adapters, fake
// adapters, and CLI files implement these until they are migrated to the
// revised contracts above. New code must not depend on these interfaces.

export interface LegacyWorkItemAdapter {
  read(workItemId: WorkItemId): Promise<DomainWorkItem>;
  appendEvidence(workItemId: WorkItemId, evidence: RunEvidence): Promise<void>;
  setState(workItemId: WorkItemId, state: WorkItemState): Promise<void>;
  listOpen?(): Promise<DomainWorkItem[]>;
}

export interface LegacyClaimStore {
  acquire(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  renew(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  handoff(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }>;
  release(workItemId: WorkItemId, claimToken?: string): Promise<void>;
  expire(workItemId: WorkItemId, claimToken?: string): Promise<void>;
  active(workItemId: WorkItemId): Promise<DomainClaimState | undefined>;
  records(workItemId: WorkItemId): Promise<ClaimRecord[]>;
}

export interface LegacyEvidenceStore {
  persist(evidence: RunEvidence): Promise<void>;
  read(runId: RunId): Promise<RunEvidence>;
  list(workItemId: WorkItemId): Promise<RunEvidence[]>;
}

export interface LegacySourceHostAdapter {
  createBranch(name: string, from: string): Promise<void>;
  pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath?: string): Promise<void>;
  openPullRequest(workItemId: WorkItemId, branch: string, integrationTarget?: string): Promise<string>;
  requiredChecks(integrationTarget: string): Promise<string[]>;
  recordCheckpoint?(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void>;
  readCheckpoints?(workItemId: WorkItemId): Promise<AgentCheckpoint[]>;
  remoteCommit?(checkpoint: AgentCheckpoint): Promise<boolean>;
  mergePullRequest?(branch: string, integrationTarget: string): Promise<void>;
}

export interface LegacyIntegrationQueue {
  enqueue(runId: RunId, checkpoint: AgentCheckpoint, dependencies?: WorkItemId[]): Promise<DomainQueuePosition>;
  incorporateNext(): Promise<DomainIntegrationResult>;
  semanticConflict(runId: RunId): Promise<DomainConflictDecision>;
}

import type {
  ClaimState as DomainClaimState,
  ConflictDecision as DomainConflictDecision,
  IntegrationResult as DomainIntegrationResult,
  QueuePosition as DomainQueuePosition,
  WorkItem as DomainWorkItem,
} from '../domain/types.ts';
