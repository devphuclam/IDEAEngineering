// Shared domain types (canonical terms from contracts/adapters.md and data-model.md).

export type WorkItemId = string;
export type RunId = string;
export type SandboxId = string;
export type CheckpointId = string;

export type WorkItemState =
  | 'open'
  | 'claimed'
  | 'in-progress'
  | 'ready-for-integration'
  | 'integrated'
  | 'blocked';

export type RunState =
  | 'requested'
  | 'claimed'
  | 'preparing'
  | 'running'
  | 'verifying'
  | 'ready-for-integration'
  | 'integrated'
  | 'failed'
  | 'cancelled'
  | 'expired';

export type CheckOutcome = 'passed' | 'failed' | 'blocked' | 'unexecuted';

export type BlockerClassification =
  | 'capability'
  | 'credential'
  | 'quota'
  | 'region'
  | 'network'
  | 'conflict'
  | 'other';

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
  workItemId: WorkItemId;
  claimToken: string;
  claimant: string;
  runId: RunId;
  acquiredAt: string; // ISO 8601
  leaseExpiresAt: string; // ISO 8601
  kind: 'acquire' | 'renew' | 'handoff' | 'release' | 'expire';
  previousOwner?: string;
}

export interface ClaimState {
  workItemId: WorkItemId;
  claimToken: string;
  claimant: string;
  runId: RunId;
  acquiredAt: string;
  leaseExpiresAt: string;
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
  outcome: CheckOutcome; // never misreports blocked/unexecuted as passed
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
  /** Deterministic non-secret provider marker used by validation recovery. */
  providerMarker?: string;
  providerRevision?: string;
  branch?: string;
  pullRequestRef?: string;
  targetCommit?: string;
  policyOutcome?: PolicyVerdict;
  queueDecision?: 'queued' | 'blocked' | 'integrated' | 'rejected';
  integrationResult?: 'integrated' | 'rejected' | 'pending';
  blocker?: BlockerClassification | null;
  retention?: {
    days: number;
    expiresAt: string;
  };
  nextAction?: string;
  unresolvedRisks?: string[];
  retryOf?: RunId;
  ownerHistory?: Array<{ from: string; to: string; at: string }>;
  actions?: Array<{
    action: string;
    actor: string;
    at: string;
    outcome: 'succeeded' | 'failed' | 'blocked' | 'unexecuted';
  }>;
}

export interface RunContext {
  runId: RunId;
  workItemId: WorkItemId;
  owner: string;
  sandboxId: SandboxId;
  branch: string;
  worktreePath: string;
  changeScope: ChangeScope;
  state?: RunState;
  retryOf?: RunId;
}

export interface HandoffRecord {
  previousOwner: string;
  replacementOwner: string;
  checkpoint: AgentCheckpoint;
  unresolvedRisks: string[];
  nextAction: string;
  recordedAt: string;
}

export interface ConflictDecision {
  runId: RunId;
  decision: 'approved-dependency' | 'approved-serialized' | 'human' | 'rejected';
  decidedBy: string;
  decidedAt: string;
  note?: string;
}

export interface QueuePosition {
  runId: RunId;
  position: number;
  dependencies: WorkItemId[];
}

export interface IntegrationResult {
  runId: RunId;
  state: 'queued' | 'incorporating' | 'incorporated' | 'rejected';
  verification: VerificationResult[];
  blocker?: BlockerClassification | null;
  pullRequestUrl?: string;
}

// ---- Revisioned provider-neutral mutation contracts (contracts/provider-ports.md) ----

export type ProviderRevision = string;
export type OperationId = string;

export interface Revisioned<T> {
  value: T;
  revision: ProviderRevision;
  observedAt: string;
}

export interface MutationCommand<T> {
  operationId: OperationId;
  expectedRevision: ProviderRevision;
  actor: string;
  requestedAt: string;
  input: T;
}

export type MutationDisposition = 'applied' | 'duplicate' | 'conflict';

export interface MutationResult<T> {
  operationId: OperationId;
  disposition: MutationDisposition;
  revision: ProviderRevision;
  value?: T;
  receiptRef?: string;
  reason?: string;
}

export interface OperationReceipt {
  operationId: OperationId;
  kind: string;
  payloadHash: string;
  disposition: MutationDisposition;
  outcome: string;
  actor: string;
  occurredAt: string;
  publishedAt: string;
  workItemId?: WorkItemId;
  references: string[];
  blocker?: BlockerClassification | null;
  nextAction?: string;
}

export interface PublicationResult {
  operationId: OperationId;
  published: boolean;
  receiptRef?: string;
  reason?: string;
}

export interface EvidencePublicationRef {
  operationId: OperationId;
  workItemId: WorkItemId;
  runId: RunId;
  providerRef: string;
  observedRevisionOrHead: string;
  evidence: RunEvidence;
}

export interface WorkItemStateTransition {
  workItemId: WorkItemId;
  from: WorkItemState;
  to: WorkItemState;
}

export interface ClaimRelease {
  workItemId: WorkItemId;
  claimToken: string;
  reason?: string;
}

// ---- Coordination State and managed blocks (contracts/canonical-records.md) ----

export type ManagedBlockKind = 'coordination-state' | 'change-scope' | 'queue-manifest';

export interface CoordinationClaim {
  claimToken: string;
  claimant: string;
  runId: RunId;
  acquiredAt: string;
  leaseExpiresAt: string;
  previousOwner?: string;
}

export interface CoordinationRun {
  runId: RunId;
  state: RunState;
  sandboxId?: SandboxId;
  branch?: string;
  checkpointId?: CheckpointId;
  startedAt: string;
}

export interface PendingPublication {
  receipt: {
    operationId: OperationId;
    kind: string;
    payloadHash: string;
    outcome: string;
    actor: string;
    occurredAt: string;
  };
  publisher?: {
    publisherId: string;
    leaseExpiresAt: string;
  };
  evidence?: RunEvidence;
  completion?: QueueCompletionSummary;
}

export interface CoordinationState {
  schema: 'agent-workspace/coordination-state';
  version: 1;
  workItemId: WorkItemId;
  claim: CoordinationClaim | null;
  run: CoordinationRun | null;
  lastAppliedOperation: {
    operationId: OperationId;
    kind: string;
    outcome: string;
    at: string;
  } | null;
  pendingPublication: PendingPublication | null;
}

export interface ChangeScopeBlock {
  schema: 'agent-workspace/change-scope';
  version: 1;
  paths: string[];
  semanticSeams: string[];
  prerequisites: WorkItemId[];
  integrationTarget: string;
}

export interface RevisionedWorkItem {
  item: WorkItem;
  coordination: CoordinationState;
  changeScope: ChangeScopeBlock;
}

// ---- Canonical queue (contracts/canonical-records.md) ----

export interface IntegrationTarget {
  repositoryId: string;
  targetRef: string;
}

export type QueueEntryState = 'queued' | 'blocked' | 'preparing' | 'incorporating';

export interface QueueEntry {
  sequence: number;
  candidateWorkItemId: WorkItemId;
  runId: RunId;
  state: QueueEntryState;
  enqueuedAt: string;
  dependencies: WorkItemId[];
  decisions: ConflictDecision[];
  latestTargetCommit?: string;
}

export interface IntegrationLease {
  operationId: OperationId;
  entrySequence: number;
  candidateWorkItemId: WorkItemId;
  runId: RunId;
  acquiredAt: string;
  expiresAt: string;
  targetCommit: string;
}

export interface QueueManifest {
  schema: 'agent-workspace/queue-manifest';
  version: 1;
  queueKey: string;
  organizationUrl: string;
  projectId: string;
  repositoryId: string;
  targetRef: string;
  nextEnqueueSequence: number;
  entries: QueueEntry[];
  lease: IntegrationLease | null;
  lastOperation: {
    operationId: OperationId;
    kind: string;
    outcome: string;
    at: string;
  } | null;
  pendingPublication: PendingPublication | null;
}

export interface EnqueueCandidate {
  candidateWorkItemId: WorkItemId;
  runId: RunId;
  dependencies: WorkItemId[];
  decisions: ConflictDecision[];
}

export interface QueueDecision {
  entrySequence: number;
  candidateWorkItemId: WorkItemId;
  decision: ConflictDecision;
}

export interface AcquireIntegration {
  entrySequence: number;
  leaseSeconds?: number;
  targetCommit: string;
}

export interface RenewIntegrationLease {
  operationId: OperationId;
  entrySequence: number;
  leaseSeconds?: number;
}

export interface ReleaseIntegrationLease {
  operationId: OperationId;
  entrySequence: number;
  reason: string;
}

export interface FinalizeCandidate {
  entrySequence: number;
  outcome: 'integrated' | 'rejected';
  pullRequestRef?: string;
  evidenceRef?: string;
  blocker?: BlockerClassification | null;
}

export interface QueueCompletionSummary {
  operationId: OperationId;
  sequence: number;
  candidateWorkItemId: WorkItemId;
  runId: RunId;
  outcome: 'integrated' | 'rejected';
  at: string;
  pullRequestRef?: string;
  evidenceRef?: string;
  blocker?: BlockerClassification | null;
}

// ---- Policy (contracts/provider-ports.md) ----

export type PolicyVerdict = 'passed' | 'failed' | 'blocked' | 'unexecuted' | 'pending' | 'unavailable';

export interface PolicyRequirement {
  id: string;
  name: string;
  source: string;
  kind: 'provider' | 'local';
  verdict: PolicyVerdict;
  detail?: string;
  appliedToCommit?: string;
}

export interface PolicyInventory {
  target: IntegrationTarget;
  observedAt: string;
  sources: Array<{
    name: string;
    outcome: 'read' | 'denied' | 'unavailable';
    detail?: string;
  }>;
  effectiveBlocking: PolicyRequirement[];
}

export interface PolicySnapshot {
  target: IntegrationTarget;
  pullRequestRef?: PullRequestRef;
  headCommit: string;
  observedAt: string;
  inventory: PolicyInventory;
  evaluations: PolicyRequirement[];
  aggregate: PolicyVerdict;
}

// ---- Source host (contracts/provider-ports.md) ----

export interface RemoteCheckpoint {
  branch: string;
  commit: string;
  pushUrl: string;
}

export interface PullRequestRequest {
  repositoryId: string;
  sourceRef: string;
  targetRef: string;
  title: string;
  description?: string;
  workItemId?: WorkItemId;
}

export interface PullRequestRef {
  repositoryId: string;
  sourceRef: string;
  targetRef: string;
  pullRequestId: string;
  url: string;
  sourceCommit?: string;
  targetCommit?: string;
  mergeCommit?: string;
  mergeStatus?: string;
  workItemIds?: WorkItemId[];
  title?: string;
  description?: string;
  status?: string;
}

export interface RemoteBranchRef {
  sourceRef: string;
  headCommit: string;
}

export interface PullRequestCompletion {
  pullRequestRef: PullRequestRef;
  merged: boolean;
  targetCommit: string;
}

export interface RemoteRoleSnapshot {
  roles: Array<{ name: string; push: boolean; fetch: boolean; url: string }>;
}

export interface AdoptionRequest {
  repositoryId: string;
  originRoleName: string;
  templateUpstreamRoleName: string;
  templateUpstreamUrl: string;
  companyOriginUrl?: string;
}

export interface AdoptionPlan {
  request: AdoptionRequest;
  actions: Array<{ kind: string; detail: string }>;
  digest: string;
}

// ---- Preparation and readiness (contracts/provider-ports.md) ----

export interface PermissionProbeResult {
  operation: string;
  namespaceId: string;
  token: string;
  permissionName: string;
  permissionBit: number;
  effective: 'allowed' | 'denied' | 'unknown' | 'unavailable';
  capabilityReads: Array<{ name: string; outcome: 'passed' | 'denied' | 'unavailable' }>;
  observedAt: string;
  nextAction?: string;
}

export interface ProcessMappingReport {
  profile: string;
  workItemType: string;
  observedProcessFingerprint: string;
  stateMap: Record<string, string>;
  drift?: string;
}

export interface PolicyVisibilityReport {
  inventorySources: Array<{ name: string; outcome: 'read' | 'denied' | 'unavailable' }>;
  effectiveBlockingCount: number;
}

export interface ReadinessReport {
  provider: 'github' | 'azure-devops';
  observedAt: string;
  configuration: { outcome: 'passed' | 'failed' | 'unavailable'; detail?: string };
  runtime: { outcome: 'not-selected' | 'passed' | 'unsupported' | 'unavailable'; detail?: string };
  authentication: { outcome: 'passed' | 'failed' | 'unavailable'; detail?: string };
  target: { outcome: 'passed' | 'failed' | 'unavailable'; detail?: string };
  permissions: PermissionProbeResult[];
  processMapping?: ProcessMappingReport;
  remoteRoles: RemoteRoleSnapshot;
  policyVisibility: PolicyVisibilityReport;
  queue: { outcome: 'passed' | 'failed' | 'unavailable'; detail?: string };
  network: { outcome: 'passed' | 'failed' | 'unavailable'; detail?: string };
}

export interface PreparationPlan {
  applicability: 'applicable' | 'not-applicable';
  digest: string;
  actions: Array<{ kind: string; detail: string }>;
  queue?: {
    queueKey: string;
    workItemType: string;
    title: string;
    fields: string[];
    tags: string[];
  };
}

export interface PreparationResult {
  queueWorkItemId: WorkItemId;
  queueKey: string;
  appliedAt: string;
}

export interface PreparationNotApplicableResult {
  disposition: 'not-applicable';
  classification: 'capability';
  reason: string;
  nextAction?: string;
}

export type PreparationApplyResult =
  | MutationResult<PreparationResult>
  | PreparationNotApplicableResult;

export type RuntimeReadinessState = 'not-selected' | 'ready' | 'unsupported' | 'blocked';

export interface RuntimeReadinessReport {
  state: RuntimeReadinessState;
  detail: string;
  checks: Array<{ name: string; outcome: 'passed' | 'failed' | 'unsupported' | 'not-run'; detail?: string }>;
}

// ---- Domain policy/queue decision helpers ----

export const MAX_STALE_REREADS = 4;

export interface ProcessOverride {
  open: string;
  claimed: string;
  'in-progress': string;
  'ready-for-integration': string;
  integrated: string;
  blocked: string;
}
