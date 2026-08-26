# Data Model: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace | **Source**: `spec.md` (FR-001..FR-022, Key Entities)

Entity names follow the canonical glossary in `CONTEXT.md`. Fields are the provider-neutral core;
provider-specific serialization is adapter-owned.

## Entities

### Work Item

The provider-neutral unit of planned work and the canonical record for requested work.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Required; unique in the workspace; stable across runs. |
| `title` | string | Required; human-readable. |
| `description` | string | Optional; acceptance criteria and context. |
| `dependencies` | WorkItemId[] | Optional; prerequisite Work Items (FR-001). |
| `changeScope` | ChangeScope | Required before an Agent Run starts (FR-009). |
| `status` | enum | `open` \| `claimed` \| `in-progress` \| `ready-for-integration` \| `integrated` \| `blocked`; derived from claims/runs/evidence, never duplicated as a second source of truth. |

### Change Scope

Declared by the Work Item before a run starts (FR-009).

| Field | Type | Rules |
|---|---|---|
| `paths` | string[] | Expected repository paths or path patterns. |
| `semanticSeams` | string[] | Modules/domain concepts expected to change. |
| `prerequisites` | WorkItemId[] | Parent/prerequisite Work Items. |
| `integrationTarget` | string | Intended integration target (default `main` or an agreed parent branch). |

Overlap rules (FR-010): path overlap → warning only; semantic-seam overlap with no recorded
dependency → blocks parallel execution until a dependency or serialized decision exists.

### Work Claim

A renewable, time-bounded exclusive reservation connecting one Work Item to at most one active
Agent Run (FR-002, FR-004).

| Field | Type | Rules |
|---|---|---|
| `workItemId` | string | Required; at most one active claim per Work Item. |
| `claimToken` | string | Required; unique per claim; makes duplicate delivery idempotent. |
| `claimant` | string | Required; the Run Owner identity. |
| `runId` | AgentRunId | Required; the run the claim reserves for. |
| `acquiredAt` | timestamp | Required. |
| `leaseExpiresAt` | timestamp | Required; renewable via heartbeat records. |
| `state` | enum | `active` \| `expired` \| `released`; expired/released never delete the run, branch, or evidence. |
| `history` | ClaimRecord[] | Append-only records (acquire, renew, release, expire) — attributable. |

Concurrency rule (FR-002, SC-002): competing claims resolve deterministically; the first valid
unexpired claim wins, a losing claim is rejected with an actionable conflict, and no second
active sandbox is created.

### Agent Run

One attributable execution attempt of an Agent against a claimed Work Item (FR-002, FR-003,
FR-008).

| Field | Type | Rules |
|---|---|---|
| `runId` | string | Required; unique; kept through handoff; a retry is a NEW run id. |
| `workItemId` | string | Required. |
| `owner` | RunOwner | Required; exactly one owner at all times (FR-005). |
| `sandboxId` | string | Required; exactly one sandbox per run (FR-003). |
| `branch` | string | Required; descriptive Work Item-oriented name; no Agent/AI/Codex/personal markers (FR-020). |
| `state` | enum | See lifecycle below. |
| `retryOf` | AgentRunId \| null | Set for retries; links to the earlier attempt without reactivating it (FR-008). |
| `checkpoints` | AgentCheckpoint[] | Recovery boundaries; ordered. |
| `evidence` | RunEvidence[] | Durable, attributable records. |

### Lifecycle (Agent Run states)

```text
requested -> claimed -> preparing -> running -> verifying -> ready-for-integration
     |          |           |          |          |                 |
     +----------+-----------+----------+----------+-----------------+
                           terminal: integrated | failed | cancelled | expired
```

- A retry is a new run linked via `retryOf`; it starts from the latest valid checkpoint or an
  agreed base and never reactivates or overwrites the earlier run (FR-008).
- Every transition is idempotent: duplicate commands cannot create a second sandbox, pull
  request, or state transition.

### Agent Sandbox

The isolated execution environment owned by exactly one Agent Run (FR-003).

| Field | Type | Rules |
|---|---|---|
| `sandboxId` | string | Required; unique. |
| `runId` | AgentRunId | Required; one-to-one with the run. |
| `worktreePath` | string | Local runner: `.worktrees/<run-id>` inside the owner's clone. |
| local run mirror | path | Durable local context/evidence mirror: `.workspace/runs/<run-id>/run/`, separate from the mutable worktree. |
| `host` | enum | `local` \| `managed`; managed stays disabled until approval (FR-018). |
| `state` | enum | `creating` \| `ready` \| `destroyed` |

Sandboxes are disposable (ADR-0001); recovery relies on checkpoints and evidence, never
uncommitted sandbox files (FR-007).

### Run Owner

The single human or automation identity allowed to issue control instructions to an active run
(FR-005).

| Field | Type | Rules |
|---|---|---|
| `identity` | string | Required; named human or automation identity. |
| `kind` | enum | `human` \| `managed-credential`; managed requires an approved AI Workload Credential. |

Ownership is never concurrent; it changes only through an explicit Agent Handoff.

### Agent Handoff

The durable transfer of Run Owner responsibility (FR-006).

| Field | Type | Rules |
|---|---|---|
| `previousOwner` | RunOwner | Required; recorded. |
| `replacementOwner` | RunOwner | Required; recorded. |
| `checkpoint` | AgentCheckpoint | Required; a valid checkpoint must exist before transfer. |
| `unresolvedRisks` | string[] | Required; recorded before control transfers. |
| `nextAction` | string | Required; recorded before control transfers. |
| `recordedAt` | timestamp | Required. |

Rejection rule: a non-owner sending a control instruction is rejected; the active owner remains
unchanged.

### Agent Checkpoint

A durable recovery boundary (FR-007).

| Field | Type | Rules |
|---|---|---|
| `runId` | AgentRunId | Required. |
| `checkpointId` | string | Required; unique. |
| `branch` | string | Required. |
| `commit` | sha | Required; pushed, never sandbox-local. |
| `verification` | VerificationResult[] | Required; passed/failed/blocked/unexecuted — never misreported. |
| `unresolvedWork` | string[] | Required. |
| `nextAction` | string | Required. |
| `createdAt` | timestamp | Required. |

A missing checkpoint when a sandbox disappears reports the missing prerequisite instead of
claiming recoverability.

### Integration Candidate & Integration Queue

A checkpointed change awaiting dependency-aware incorporation (FR-011, FR-012).

| Field | Type | Rules |
|---|---|---|
| `runId` | AgentRunId | Required; the producing run. |
| `checkpoint` | AgentCheckpoint | Required. |
| `dependencies` | WorkItemId[] | Ordering input. |
| `semanticOverlaps` | OverlapDecision[] | Explicit dependency or serialized-integration decisions. |
| `state` | enum | `queued` \| `incorporating` \| `incorporated` \| `rejected` |

Queue rules: order candidates by dependency; incorporate one at a time against the latest
integration target; rerun required verification after each incorporation; semantic conflicts
require a responsible Work Item or human decision — never automatic `ours`/`theirs` selection.

### Run Evidence

The attributable record of a run's work state and outcomes (FR-013..FR-015).

| Field | Type | Rules |
|---|---|---|
| `runId` | AgentRunId | Required. |
| `workItemId` | string | Required. |
| `owner` | RunOwner | Required. |
| `timestamps` | timestamp[] | Required; state transitions. |
| `stateTransitions` | StateChange[] | Required. |
| `checkpointRefs` | CheckpointId[] | Required where applicable. |
| `verification` | VerificationResult[] | Required; distinguishes passed/failed/blocked/unexecuted. |
| `integrationResult` | enum \| null | `integrated` \| `rejected` \| `pending`. |
| `blocker` | BlockerClassification \| null | `capability` \| `credential` \| `quota` \| `region` \| `network` \| `conflict` \| `other`. |
| `retention` | duration | Default 30 days for operational logs. |

Redaction rules (FR-015): credentials, personal Agent sessions, unnecessary prompts, complete
transcripts, and full source snapshots are excluded or redacted before persistence.

### AI Workload Credential

An organization-approved non-personal credential for managed Agent execution (FR-018).

| Field | Type | Rules |
|---|---|---|
| `id` | string | Required. |
| `owner` | string | Required; organization-approved; never a personal ChatGPT/Codex session. |
| `rotationOwner` | string | Required. |
| `approved` | boolean | Managed execution disabled until `true`. |

## Verification result classification

`VerificationResult` = `{ command, outcome: passed | failed | blocked | unexecuted, evidenceRef }`.
An unexecuted or blocked check is never represented as passed (FR-014).
