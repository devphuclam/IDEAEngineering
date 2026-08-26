# Provider-neutral Port Contract

## Purpose

The domain and CLI select one provider stack through configuration. They do not inspect Azure or
GitHub wire objects. Every provider mutation has a stable operation ID, an opaque expected
revision, and a classified result.

The declarations below are contract sketches; implementation may split files differently but may
not weaken their behavior.

## Common mutation types

```ts
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

export interface MutationResult<T> {
  operationId: OperationId;
  disposition: 'applied' | 'duplicate' | 'conflict';
  revision: ProviderRevision;
  value?: T;
  receiptRef?: string;
  reason?: string;
}
```

Rules:

- `duplicate` requires a durable matching operation receipt and normalized payload hash.
- `conflict` means the original preconditions no longer hold or the bounded stale-retry budget was
  exhausted; it is not silently retried as a new operation.
- A provider revision is opaque outside the adapter.
- All state-mutating command paths expose or persist the operation ID before contacting a provider.
- `applied` means the operation is authoritative under the adapter's reconciliation model, not
  merely that a provider-side proposal or comment was created.
- An atomic provider rejects a stale conditional write before state change. An append-only provider
  may retain a stale proposal as immutable history, but it returns `conflict` and that proposal
  never controls a claim, Run, sandbox, queue lease, or integration decision.
- Same-process mutations are serialized by canonical record key. Cross-process correctness still
  comes from provider revision/reconciliation semantics, never from the local lock.
- A stale queue operation performs at most four reread/re-evaluate retries after its initial
  attempt under the same operation ID; exhaustion returns `conflict` as defined in
  [`canonical-records.md`](canonical-records.md).

## Work Item and claim ports

```ts
export interface RevisionedWorkItem {
  item: WorkItem;
  coordination: CoordinationState;
  changeScope: ChangeScope;
}

export interface WorkItemAdapter {
  read(workItemId: WorkItemId): Promise<Revisioned<RevisionedWorkItem>>;
  listOpen(): Promise<Array<Revisioned<RevisionedWorkItem>>>;
  projectState(command: MutationCommand<WorkItemStateTransition>): Promise<MutationResult<WorkItemState>>;
}

export interface ClaimStore {
  acquire(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>>;
  renew(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>>;
  handoff(command: MutationCommand<HandoffRecord>): Promise<MutationResult<ClaimState>>;
  release(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>>;
  expire(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>>;
  active(workItemId: WorkItemId): Promise<Revisioned<ClaimState | undefined>>;
  records(workItemId: WorkItemId, operationId?: OperationId): Promise<OperationReceipt[]>;
}
```

The current Coordination State block is authoritative. `records()` supplies history and
idempotency receipts but cannot override current ownership.

## Evidence publication port

```ts
export interface EvidenceStore {
  reconcilePending(workItemId: WorkItemId): Promise<PublicationResult>;
  publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>>;
  read(runId: RunId): Promise<RunEvidence>;
  list(workItemId: WorkItemId): Promise<RunEvidence[]>;
}
```

`reconcilePending()` is safe to call before every new mutation. Previously published provider
comments are never edited or deleted by the adapter.

## Canonical queue port

```ts
export interface CanonicalQueueStore {
  read(target: IntegrationTarget): Promise<Revisioned<QueueManifest>>;
  enqueue(command: MutationCommand<EnqueueCandidate>): Promise<MutationResult<QueueManifest>>;
  recordDecision(command: MutationCommand<QueueDecision>): Promise<MutationResult<QueueManifest>>;
  acquireNext(command: MutationCommand<AcquireIntegration>): Promise<MutationResult<IntegrationLease>>;
  renewLease(command: MutationCommand<RenewIntegrationLease>): Promise<MutationResult<IntegrationLease>>;
  releaseLease(command: MutationCommand<ReleaseIntegrationLease>): Promise<MutationResult<QueueManifest>>;
  finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>>;
  reconcilePending(target: IntegrationTarget): Promise<PublicationResult>;
  completionHistory(target: IntegrationTarget): Promise<QueueCompletionSummary[]>;
}
```

The domain Integration Coordinator, not the store, runs verification, evaluates policy, or merges
pull requests. The store owns canonical sequence, revision, lease, active-entry compaction, and
completion-summary publication.

## Source host port

```ts
export interface SourceHostAdapter {
  targetHead(targetRef: string): Promise<string>;
  createSourceBranch?(sourceRef: string, fromCommit: string): Promise<RemoteBranchRef>;
  sourceHead?(sourceRef: string): Promise<string | undefined>;
  listSourceBranches?(prefix: string): Promise<RemoteBranchRef[]>;
  deleteSourceBranch?(sourceRef: string, expectedHead: string): Promise<void>;
  pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath: string): Promise<RemoteCheckpoint>;
  ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef>;
  listPullRequests?(sourceRef?: string): Promise<PullRequestRef[]>;
  readPullRequest(ref: PullRequestRef): Promise<PullRequestRef>;
  abandonPullRequest?(ref: PullRequestRef): Promise<PullRequestRef>;
  completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion>;
  remoteRoles(): Promise<RemoteRoleSnapshot>;
  previewAdoption(request: AdoptionRequest): Promise<AdoptionPlan>;
  applyAdoption(command: MutationCommand<AdoptionPlan>): Promise<MutationResult<RemoteRoleSnapshot>>;
}
```

- The optional branch and abandonment seams are required by the gated validation pilot; generated
  providers may omit them until they implement the corresponding cleanup contract.
- A validation branch is created from an exact target head and deleted only with a conditional
  expected-head update. `listSourceBranches` and `listPullRequests` are read-only recovery scans;
  they must filter to the exact allowlisted repository and deterministic Run marker.
- A checkpoint source ref equal to the integration target is rejected before Git execution.
- `ensurePullRequest` is idempotent for Repository + source ref + target ref + Work Item.
- `completePullRequest` never requests policy bypass and fails if the target commit no longer
  matches the evaluated attempt.
- Adoption is one-way: Azure `origin` is the only push-capable remote; optional
  `template-upstream` is fetch-only.

## Verification and provider policy ports

```ts
export interface LocalVerificationRunner {
  run(commands: string[], cwd: string): Promise<VerificationResult[]>;
}

export interface PolicyAdapter {
  inspectTarget(target: IntegrationTarget): Promise<PolicyInventory>;
  evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot>;
}
```

The Integration Coordinator requires both:

1. every configured local verification result is `passed`; and
2. the provider policy snapshot is observable and `passed`.

An empty list of effective blocking provider policies is observable and may be `passed`; it does
not remove the separate local verification requirement. Pending, failed, blocked, unexecuted, or
unavailable evidence cannot pass. A snapshot is unavailable when a potentially applicable policy
inventory source or required result cannot be read. Every snapshot identifies the exact candidate
revision/head and must be recomputed after target or candidate drift.

## Preparation and readiness ports

```ts
export interface ProviderPreparationAdapter {
  readiness(): Promise<ReadinessReport>;
  preview(): Promise<PreparationPlan>;
  apply(command: MutationCommand<PreparationPlan>): Promise<PreparationApplyResult>;
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

export interface RuntimeReadinessAdapter {
  inspect(): Promise<RuntimeReadinessReport>;
}
```

`readiness()` and `preview()` are non-mutating. `PreparationPlan` carries
`applicability: 'applicable' | 'not-applicable'`. `apply()` rejects any proposed action outside the
compiled adapter allowlist. Readiness reports configuration, runtime, authentication, target,
one `PermissionProbeResult` per operation, process mapping, remote roles, and policy visibility
separately. It never tests a permission by attempting the corresponding write. A provider with no
bootstrap capability reports `not-applicable` from preview/readiness and returns
`PreparationNotApplicableResult` from `apply()` before provider contact rather than manufacturing a
queue mutation.

`RuntimeReadinessAdapter.inspect()` reports one of `not-selected`, `ready`, `unsupported`, or
`blocked`. `not-selected` is valid when `runtimeProfile` is omitted or `null`: offline
provider-neutral commands remain available, while Local Agent Runner-dependent and live operations
must return `not-run` before authentication or mutation.

## Provider-selected CLI context

```ts
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
  runner: RunnerAdapter;       // Local Agent Runner in V1
  driver: AgentDriver;         // Codex Desktop in V1
}
```

The shared context contains no `gh`, `az`, Azure DTO, token, PAT, or provider-specific error field.
Provider diagnostics use stable classifications and may include non-secret provider detail.

## Compatibility requirement

The existing GitHub adapter and fake adapters must migrate to every listed port before Azure becomes
selectable. GitHub supplies a coordination-Issue-backed `CanonicalQueueStore`, read-only
`not-applicable` preparation behavior, and the shared provider-neutral runtime readiness result in
addition to its immutable append-reread-reconcile revision contract and complete effective policy
snapshot as specified in [`github-adapter.md`](github-adapter.md). Existing GitHub black-box
behavior remains covered. `managed/index.ts` remains disabled and is not expanded by this feature.
