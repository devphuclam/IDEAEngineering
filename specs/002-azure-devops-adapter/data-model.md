# Data Model: Azure DevOps Collaboration Adapter

**Feature**: 002-azure-devops-adapter | **Baseline**: feature 001 Shared Agent Workspace

Feature 001 remains the source of truth for Work Item, Agent Run, Agent Sandbox, Checkpoint,
Handoff, Change Scope, and Run Evidence meanings. This document adds the revisioned provider
records needed for Azure DevOps and sharpens the provider-neutral contracts where feature 001's
implementation is currently GitHub-shaped.

## Provider-neutral additions

### Revisioned snapshot

```ts
type ProviderRevision = string;
type OperationId = string;

interface Revisioned<T> {
  value: T;
  revision: ProviderRevision;
  observedAt: string;
}
```

The revision is opaque to domain code. Azure Boards serializes its integer Work Item `rev` as a
string. GitHub compatibility hashes canonical Issue state and the recognized immutable
proposal/receipt stream; it does not pretend that comment append is an atomic revision test.

### Mutation command and result

```ts
interface MutationCommand<T> {
  operationId: OperationId;
  expectedRevision: ProviderRevision;
  actor: string;
  requestedAt: string;
  input: T;
}

interface MutationResult<T> {
  operationId: OperationId;
  disposition: 'applied' | 'duplicate' | 'conflict';
  revision: ProviderRevision;
  value?: T;
  receiptRef?: string;
  historicalRef?: string;
  reason?: string;
}
```

An adapter may return `duplicate` only when it can identify the durable authoritative receipt for
the same operation ID and payload hash. A revision mismatch alone is not proof of duplication.
`applied` means authoritative under the provider's reconciliation model. An append-only adapter may
return a `historicalRef` for a losing proposal, but that proposal returns `conflict` and controls no
current state.

### Pull request and policy records

```ts
interface PullRequestRef {
  repositoryId: string;
  pullRequestId: string;
  url: string;
  sourceRef: string;
  targetRef: string;
  sourceCommit: string;
  targetCommit: string;
  title?: string;
  description?: string;
  status?: string;
}

interface RemoteBranchRef {
  sourceRef: string;
  headCommit: string;
}

interface PolicyRequirement {
  requirementId: string;
  kind: 'approval' | 'conversation' | 'check' | 'status' | 'merge-state' | 'deployment' | 'other';
  source: string;
  displayName: string;
  blocking: boolean;
  applicable: boolean;
  outcome: 'passed' | 'pending' | 'failed' | 'blocked' | 'unavailable';
  providerStatus: string;
  requiredApplication?: string;
}

interface PolicySnapshot {
  provider: 'github' | 'azure-devops';
  pullRequest: PullRequestRef;
  targetRef: string;
  candidateRevision: string;
  inventorySources: Array<{
    source: string;
    outcome: 'complete' | 'inapplicable' | 'unavailable';
  }>;
  observedAt: string;
  requirements: PolicyRequirement[];
  outcome: 'passed' | 'pending' | 'failed' | 'blocked' | 'unavailable';
}
```

Local verification continues to use `VerificationResult[]`. It is never stored in
`PolicySnapshot` as though it were a provider policy.

## Entity overview

| Entity | Canonical storage | Purpose |
|---|---|---|
| Provider Configuration | Generated Project non-secret config | Select provider, target, process profile, runtime profile, review intent, auth fallback policy |
| Resolved Provider Target | In-memory command context | Canonical IDs and refs resolved read-only from configured names |
| Local Authentication Context | In-memory only | Named identity, selected non-secret auth mode, authorization outcome |
| Permission Probe Result | Readiness output/evidence | Exact operation, namespace/token/action bit, effective result, capability-read result |
| Coordination State Block | Candidate Work Item Description | Current claim, Run Owner, lease, run state, checkpoint, mutation publication state |
| Change Scope Block | Candidate Work Item Description | Normalized paths/patterns, semantic seams, prerequisites, integration target |
| Operation Receipt / Run Evidence | Candidate Work Item comments | Immutable attributable history and idempotency receipt |
| Queue Manifest | Queue coordination Work Item Description | Active candidates, order, decisions, single integration lease |
| Queue Completion Summary | Queue coordination Work Item comments | Compact immutable final disposition linked to candidate evidence |
| State Mapping Resolution | In-memory + preparation output | Selected profile, observed process metadata, deterministic fingerprint, resolved states |
| Repository Policy Snapshot | In-memory + Run Evidence | Effective PR policy outcomes at an integration decision point |
| Local Mirrors | ignored `.workspace/` files | Disposable performance/recovery aids only |
| Validation Run | test output + attributable live artifacts | Explicit offline/live mode, gates, target, artifacts, outcomes, cleanup |
| Validation Ledger Entry | ignored atomic `.workspace/validation/` ledger + provider marker | Write-ahead intent, provider reconciliation identity, ownership/revision-safe cleanup |

## Provider Configuration

The schema is defined normatively in
[`contracts/provider-configuration.md`](contracts/provider-configuration.md). Its sensitive-value
rule is structural: configuration may name a secret source, but may not contain a token, password,
Authorization header, private key, or credential-bearing URL.

`runtimeProfile` is either omitted/`null` (`not-selected`) or `local-agent-v1`. A not-selected
profile does not invalidate provider configuration or offline provider-neutral commands; it does
prevent Local Agent Runner-dependent and live commands from proceeding past a `not-run` result.

### Resolved Provider Target

```json
{
  "provider": "azure-devops",
  "organizationUrl": "https://dev.azure.com/example",
  "project": { "configuredName": "Project", "id": "uuid", "resolvedName": "Project" },
  "repository": { "configuredName": "Repo", "id": "uuid", "resolvedName": "Repo" },
  "integrationTarget": "refs/heads/main",
  "queueKey": "sha256:<hex>"
}
```

`queueKey` hashes the canonical Organization URL, Project ID, Repository ID, and target ref. It is
an identity key, not a credential. Live allowlists compare the resolved tuple before mutation.

## Permission Probe Result

```json
{
  "operation": "queue-work-item.update",
  "namespaceId": "83e28ad4-2d72-4ceb-97b0-c7726d5502c3",
  "token": "vstfs:///Classification/Node/<area-node-id>",
  "permissionName": "WORK_ITEM_WRITE",
  "permissionBit": 32,
  "effective": "allowed",
  "capabilityReads": [
    { "name": "work-item-type.visible", "outcome": "passed" }
  ],
  "observedAt": "2026-08-14T00:00:00.000Z",
  "nextAction": null
}
```

The numeric example is illustrative; the adapter obtains and validates the current exact bit from
the named security namespace before batch evaluation. Denied, unknown, malformed, unavailable, or
capability-read failure blocks only the corresponding operation and never triggers a write probe or
credential fallback. Tokens and results are non-secret; Authorization material is excluded.

`validation-source-branch.delete` is a separate operation with the exact Repository/source-ref
token, permission name `ForcePush`, and a capability read that rechecks the Run marker and expected
source head. It is requested only for a conditional cleanup action, never inferred from a normal
source-branch push result.

## Managed Description block envelope

Managed blocks use visible ASCII markers and escaped JSON inside `<pre>`:

```html
AGENT-WORKSPACE:COORDINATION-STATE:V1:BEGIN
<pre>{&quot;schema&quot;:&quot;agent-workspace/coordination-state&quot;,...}</pre>
AGENT-WORKSPACE:COORDINATION-STATE:V1:END
```

Equivalent marker names are `CHANGE-SCOPE` and `QUEUE-MANIFEST`. Serializer rules:

1. JSON keys have a deterministic order; arrays that are semantic sets are sorted and deduplicated.
2. JSON is HTML-escaped on write and decoded before parsing.
3. Exactly one BEGIN/END pair is required for a managed block; marker order and schema/version must
   match.
4. Bytes outside the replaced managed slice are preserved.
5. Unknown schema versions, duplicate blocks, malformed JSON, and invalid invariants fail closed.

## Coordination State Block

```json
{
  "schema": "agent-workspace/coordination-state",
  "version": 1,
  "workItemId": "123",
  "claim": {
    "claimToken": "claim-...",
    "claimant": "identity-id",
    "runId": "run-...",
    "acquiredAt": "2026-08-14T00:00:00.000Z",
    "leaseExpiresAt": "2026-08-14T01:00:00.000Z"
  },
  "run": {
    "runId": "run-...",
    "state": "running",
    "owner": "identity-id",
    "branch": "feature/work-item-123-run-...",
    "latestCheckpointRef": "cp-...",
    "retryOf": null
  },
  "lastAppliedOperation": {
    "operationId": "op-...",
    "kind": "claim",
    "outcome": "applied",
    "actor": "identity-id",
    "occurredAt": "2026-08-14T00:00:00.000Z",
    "payloadHash": "sha256:<hex>"
  },
  "pendingPublication": {
    "receipt": {
      "operationId": "op-...",
      "kind": "claim",
      "outcome": "applied",
      "actor": "identity-id",
      "occurredAt": "2026-08-14T00:00:00.000Z",
      "payloadHash": "sha256:<hex>"
    },
    "publisher": null
  }
}
```

`claim`, `run`, and `pendingPublication` may be `null` where lifecycle rules allow. A publisher is
`{ "publisherId", "leaseExpiresAt" }`. A different operation cannot change current state while a
pending publication exists; it must first reconcile that receipt.

### Invariants

- At most one unexpired claim and one active run exist.
- An active claim and active run have the same `runId` and owner identity.
- A terminal run has no active claim.
- Lease, lifecycle, checkpoint, retry, and handoff rules remain those of feature 001.
- `lastAppliedOperation.payloadHash` must match the normalized command payload for a duplicate.
- Tags and comments cannot override current claim/run fields in this block.

## Change Scope Block

```json
{
  "schema": "agent-workspace/change-scope",
  "version": 1,
  "paths": ["src/example/**"],
  "semanticSeams": ["example-service"],
  "prerequisites": ["120", "121"],
  "integrationTarget": "refs/heads/main"
}
```

`paths` contains at least one normalized path/pattern; `semanticSeams` is present and may be empty
when no semantic seam is known; prerequisite IDs are unique; the target exactly matches the
resolved Repository target. A tag or unstructured comment cannot substitute for this block.

## Operation receipt and publication protocol

An immutable comment contains a visible marker plus redacted JSON:

```text
AGENT-WORKSPACE:OPERATION-RECEIPT:V1 op-...
```

The payload identifies operation ID, operation kind, normalized payload hash, actor, state outcome,
provider revision after application, Work Item/Run/checkpoint/PR references as applicable, and
timestamps. It never contains credential material or a full source snapshot.

### State machine

```text
requested -> state-applied/publication-pending -> published
                    |                               |
                    +---- retry repairs ------------+
```

1. Read the revisioned block and search receipts for the operation ID.
2. If a matching published receipt exists, return `duplicate` with its outcome.
3. If a matching pending receipt exists, acquire/observe its publisher lease, publish or find the
   comment, clear pending state with `/rev`, and return `duplicate`.
4. If another receipt is pending, repair it before evaluating a new command.
5. Validate domain preconditions, then PATCH `/rev` + current state + last operation + pending
   receipt atomically.
6. Acquire the publisher lease under `/rev`, search once more, append only if absent, then clear
   pending under `/rev`.

A crash after PATCH leaves repairable pending state. A crash after comment POST leaves a marker
that the next publisher finds before appending. A publisher lease prevents simultaneous appenders.

### GitHub compatibility projection

GitHub uses immutable proposal and resolution-receipt comments rather than Azure's managed-block
`/rev` transaction. Its opaque revision hashes canonical Issue state, the normalized/sorted exact
queue-label pair when applicable, and ordered recognized comment IDs and payload hashes. The only
recognized queue labels are `agent-workspace:integration-queue` and one
`agent-workspace:queue-key:sha256:<lowercase-hex>`; unknown labels and ordinary human comments do
not affect authority, while malformed/duplicate/mismatched recognized labels or markers fail
closed. After proposal append, every contender rereads and deterministically selects the earliest
valid proposal whose original revision and preconditions still hold. Only that proposal's receipt
is authoritative; later/losing proposals and any racing non-winning receipt are historical
evidence. This provider-specific projection preserves the same provider-neutral `applied |
duplicate | conflict` result contract.

For a GitHub coordination Issue,
`queueKey = sha256("github\\n" + canonicalRepositoryId + "\\n" + targetRef)`, where
`canonicalRepositoryId` is the immutable GitHub REST Repository numeric ID serialized as decimal.
The normal enqueue operation may create that deterministic record and must reread discovery; more
than one valid record, including a create race, is a blocked administrator-remediation result.

## State Mapping Resolution

```json
{
  "profile": "scrum@1",
  "process": {
    "typeId": "uuid",
    "parentProcessTypeId": "uuid",
    "customizationType": "System",
    "name": "Scrum"
  },
  "workItemType": {
    "referenceName": "Microsoft.VSTS.WorkItemTypes.ProductBacklogItem",
    "name": "Product Backlog Item"
  },
  "observedProcessFingerprint": "sha256:<hex>",
  "states": {
    "open": "New",
    "claimed": "Approved",
    "in-progress": "Committed",
    "ready-for-integration": "Committed",
    "integrated": "Done",
    "blocked": "Committed"
  }
}
```

The fingerprint covers process IDs/customization plus canonicalized Work Item Type state metadata.
Built-in profiles require an observed System process and every mapped state. Inherited/custom
processes require an explicit complete override and expected fingerprint. The Boards State is a
coarse projection; Coordination State remains authoritative.

## Queue Manifest

```json
{
  "schema": "agent-workspace/queue-manifest",
  "version": 1,
  "queueKey": "sha256:<hex>",
  "repositoryId": "uuid",
  "integrationTarget": "refs/heads/main",
  "nextEnqueueSequence": 43,
  "entries": [
    {
      "candidateWorkItemId": "123",
      "runId": "run-...",
      "enqueueSequence": 42,
      "status": "queued",
      "prerequisites": ["120"],
      "decisionRefs": [],
      "evidenceRefs": ["comment:17"],
      "pullRequest": null
    }
  ],
  "activeIntegration": null,
  "lastAppliedOperation": null,
  "pendingPublication": null
}
```

Allowed active statuses are `queued | blocked | preparing | incorporating`. Final statuses never
remain in `entries`. `activeIntegration` contains exactly one candidate/run, integration operation
ID, owner lease, and target commit observed for that attempt.

### Queue invariants

- `queueKey`, Repository ID, and target ref are immutable.
- Enqueue sequence is unique and strictly increasing; a duplicate operation or candidate/run does
  not allocate a new sequence.
- Selection chooses the lowest-sequence eligible candidate; prerequisites and semantic decisions
  determine eligibility.
- At most one non-expired integration lease exists.
- Starting/finalizing an attempt uses the queue Work Item revision and stable operation ID.
- A target-head or policy change invalidates the attempt and returns it to a visible non-final state.
- Finalization removes the entry and installs a pending completion summary in one PATCH.

## Queue Completion Summary

The immutable queue comment records queue key, candidate Work Item, run, enqueue sequence, final
disposition, PR, target commit, policy snapshot reference, verification evidence reference,
decision references, blocker classification, and candidate evidence link. It is compact; full Run
Evidence remains on the candidate Work Item.

## Repository Policy Snapshot

Every snapshot identifies provider, Repository, target ref, pull request, exact candidate
revision/head SHA, inventory sources and completeness, normalized requirements, observation time,
and overall outcome.

- Azure joins branch policy configurations with PR policy evaluations including explicit
  `notApplicable` entries. PR statuses/reviewer votes remain diagnostic when policy evaluations are
  the effective gate.
- GitHub joins active effective branch rules, applicable classic protection, PR review/conversation
  and merge state, and required check runs plus commit statuses on the exact head SHA. Required
  application/source identity is preserved.

Every enabled, blocking, applicable requirement must be observable. Overall outcome is the
strictest requirement: `unavailable/blocked`, then `failed`, then `pending`, then `passed`. Zero
effective blocking policies is valid only when all potentially applicable inventory sources are
complete or proven inapplicable. The separate configured local verification gate still applies.

## Validation Run

```json
{
  "validationRunId": "validation-...",
  "mode": "live",
  "phase": "boards-roundtrip",
  "target": {
    "organizationUrl": "https://dev.azure.com/example",
    "projectId": "uuid",
    "repositoryId": "uuid",
    "targetRef": "refs/heads/agent-workspace-validation"
  },
  "allowlistOutcome": "matched",
  "gates": [{ "name": "permissions.work-item-write", "outcome": "passed" }],
  "authMode": "entra-user",
  "ledgerPath": ".workspace/validation/validation-.../ledger.json",
  "outcomes": [{ "name": "description-roundtrip", "outcome": "passed" }],
  "cleanup": { "outcome": "pending", "artifacts": [] },
  "handoff": null
}
```

Live mode records the exact resolved target and allowlist decision. Missing gates use
`outcome: "not-run"`; they are not collapsed into passed. Offline mode instead uses `target: null`,
`authMode: "fake"`, and an explicit network-denied gate. No Validation Run contains credentials.

## Validation Ledger Entry

```json
{
  "artifactKey": "boards-roundtrip.work-item",
  "intentSequence": 1,
  "operation": "work-item.create",
  "state": "intent-recorded",
  "target": {
    "projectId": "uuid",
    "repositoryId": "uuid",
    "targetRef": "refs/heads/agent-workspace-validation"
  },
  "expectedRevisionOrHead": null,
  "marker": "agent-workspace:validation:validation-...:boards-roundtrip.work-item",
  "providerRef": null,
  "observedRevisionOrHead": null,
  "cleanupOperation": "work-item.close",
  "cleanupPrerequisites": [],
  "cleanupOutcome": "pending"
}
```

The harness atomically persists the intent before provider contact, then advances the same entry
after provider acknowledgement or marker-based discovery. Recovery scans only the exact allowlisted
target and reserved marker prefix, reconstructs missing provider references, and never adopts an
unmarked/pre-existing artifact. Cleanup may remove a Run-owned queue entry, close a Run-created
Work Item, abandon a Run-created pull request, or delete a Run-created source branch. It first
revalidates marker and expected revision/head; drift or uncertain ownership is blocked for manual
recovery. Source-branch deletion also records a passed exact-ref `ForcePush` permission/capability
prerequisite; it is not implied by checkpoint push. Comments and a pre-existing queue coordination
Work Item are never deleted. The ledger is retained until cleanup completes or an attributable
handoff is recorded.
