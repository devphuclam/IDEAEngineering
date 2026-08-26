# Feature Specification: Shared Agent Workspace

**Feature Branch**: `001-shared-agent-workspace`

**Created**: 2026-08-13

**Status**: Draft

**Input**: Approved Shared Agent Workspace design and ADR-0001: coordinate shared Agent work through isolated runs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Claim and start isolated Agent work (Priority: P1)

As a member of a two-person development team, I want to claim a Work Item and start my Agent
work in an isolated sandbox so that another person or Agent cannot overwrite my mutable files.

**Why this priority**: Isolated execution is the minimum capability required for two people to
work concurrently. Without it, the team remains dependent on a shared checkout or shared Agent
session and cannot safely parallelize work.

**Independent Test**: Two people use separate development environments to claim different Work
Items and start work. Each receives a distinct sandbox, branch, and run context, and neither run
can write into the other run's mutable checkout.

**Acceptance Scenarios**:

1. **Given** two available Work Items and two team members, **When** each member claims one Work
   Item and starts an Agent Run, **Then** each run receives one distinct Agent Sandbox and an
   attributable run context.
2. **Given** an active claim for a Work Item, **When** a second member tries to start work on that
   same Work Item, **Then** the second start is rejected with an actionable conflict and no second
   active sandbox is created.
3. **Given** a start request with an unavailable required capability, **When** the request is
   processed, **Then** it fails with the missing capability identified and does not silently use
   an unapproved substitute.

### User Story 2 - Transfer control and recover Agent work (Priority: P1)

As the owner of an active Agent Run, I want to create a durable checkpoint and hand control to
another person so that work can continue after a handoff, failure, or sandbox loss without
sharing credentials or relying on uncommitted files.

**Why this priority**: A team workflow is not dependable if only the original operator can
continue a run. Explicit single-owner control and durable recovery make the workflow safe for
retries, interruptions, and shared responsibility.

**Independent Test**: An owner checkpoints an active run, transfers ownership, and the new owner
resumes from the checkpoint. A separate retry starts a new run linked to the earlier run, while
the earlier evidence remains inspectable.

**Acceptance Scenarios**:

1. **Given** an active run with a valid checkpoint, **When** the owner transfers control to a
   named replacement owner, **Then** the transfer records the old owner, new owner, checkpoint,
   unresolved risks, and next action before the new owner can control the run.
2. **Given** an owner is not the active Run Owner, **When** that person sends a control instruction,
   **Then** the instruction is rejected and the active owner remains unchanged.
3. **Given** a sandbox is destroyed after a valid checkpoint, **When** a replacement run is
   started, **Then** the replacement can recover from that checkpoint and the original run,
   branch, and evidence remain preserved.
4. **Given** a run must be retried, **When** the retry is requested, **Then** a new Agent Run is
   created and linked to the earlier attempt without reactivating or overwriting it.

### User Story 3 - Integrate overlapping Agent changes safely (Priority: P1)

As a team member integrating multiple Agent changes, I want overlap, dependencies, and verification
evidence to be visible so that related features can change common files without a merge race or
an automatic semantic choice that nobody approved.

**Why this priority**: Two features can legitimately touch the same file. The team needs semantic
coordination and ordered integration, not a misleading file lock or an assumption that the first
push wins.

**Independent Test**: Two candidate changes declare their expected paths and semantic seams. An
independent path overlap produces a warning, semantic overlap requires an explicit dependency or
decision, and the integration flow processes candidates one at a time against the latest target
with verification evidence.

**Acceptance Scenarios**:

1. **Given** two changes overlap in paths but declare independent semantic seams, **When** both
   are evaluated, **Then** the overlap is visible as a warning without falsely blocking safe work.
2. **Given** two changes overlap in the same behavior, **When** either change is prepared for
   integration, **Then** unsafe parallel integration is blocked until an explicit dependency or
   serialized integration decision is recorded.
3. **Given** two candidate changes are ready for integration, **When** the integration process
   runs, **Then** it incorporates them one at a time against the latest integration target and
   reruns the required verification after each incorporation.
4. **Given** a semantic conflict, **When** the conflict is encountered, **Then** the system
   requires a responsible Work Item or human decision and never silently selects one side.

### User Story 4 - Inspect trustworthy run state and evidence (Priority: P2)

As a team member or reviewer, I want to inspect run state, ownership, checkpoints, and verification
evidence so that I can understand what happened without reading a private Agent transcript or
trusting an unsupported success claim.

**Why this priority**: Durable, attributable evidence enables review, debugging, handoff, and
recovery while keeping personal conversations and credentials outside the shared record.

**Independent Test**: A reviewer inspects a completed, failed, blocked, and retried run and can
distinguish their owners, state transitions, checkpoints, verification outcomes, and integration
results without access to the original sandbox.

**Acceptance Scenarios**:

1. **Given** a run with completed verification, **When** a reviewer inspects its evidence, **Then**
   the Work Item, run, owner, branch, checkpoint, commands, outcomes, and integration result are
   attributable and distinguishable.
2. **Given** a verification check was blocked or not executed, **When** the run evidence is
   recorded, **Then** it remains marked blocked or unexecuted and is never represented as passed.
3. **Given** an evidence record contains sensitive operational data, **When** it is persisted,
   **Then** credentials, personal session material, unnecessary prompts, and full source snapshots
   are excluded or redacted according to the retention policy.

### Edge Cases

- A claim expires after an Agent Runner crash or missed renewal; the Work Item becomes claimable
  again, but the expired run, branch, and evidence are not deleted.
- A duplicate command is delivered more than once; processing remains idempotent and does not
  create a second active sandbox, pull request, or state transition.
- A Work Item has no valid checkpoint when a sandbox disappears; recovery reports the missing
  prerequisite instead of claiming that the work is recoverable.
- A source host, runner, capability, credential, quota, region, or network boundary is unavailable;
  the operation stops with a classified diagnostic and no silent fallback occurs.
- A branch name includes an Agent, AI, Codex, or personal identity marker; the operation rejects it
  and requests a descriptive Work Item-oriented name.
- A caller attempts to mutate the protected integration target directly; the operation rejects the
  mutation and directs the caller through the review and integration flow.
- Managed execution is requested without an approved organization workload credential; managed
  execution remains disabled while the local workflow remains available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workspace MUST use a Work Item as the canonical record for requested work,
  dependencies, expected Change Scope, and intended integration target.
- **FR-002**: The workspace MUST allow at most one active Work Claim and Agent Run for a Work Item
  and MUST resolve competing claims deterministically using concurrency-safe state changes.
- **FR-003**: Starting an Agent Run MUST assign exactly one Agent Sandbox, an attributable run
  context, and a descriptive branch without sharing a mutable checkout with another active run.
- **FR-004**: A Work Claim MUST be renewable and time-bounded. Expiry MUST release the Work Item
  for a new attempt without deleting the expired run, branch, checkpoint, or evidence.
- **FR-005**: An active Agent Run MUST have exactly one Run Owner. Only that owner MAY issue control
  instructions until an explicit Agent Handoff completes.
- **FR-006**: An Agent Handoff MUST record the previous owner, replacement owner, checkpoint,
  unresolved risks, and next action before transferring control.
- **FR-007**: An Agent Checkpoint MUST capture enough durable repository and verification state for
  a later run to recover without relying on uncommitted sandbox files.
- **FR-008**: A retry MUST create a new linked Agent Run and MUST NOT reactivate or overwrite the
  earlier run.
- **FR-009**: Each Work Item MUST declare expected paths or patterns, semantic seams, prerequisites,
  and the intended integration target before an Agent Run starts.
- **FR-010**: The workspace MUST distinguish path overlap from semantic overlap. Path overlap MAY
  warn; semantic overlap MUST require an explicit dependency or serialized integration decision.
- **FR-011**: The Integration Queue MUST order candidate changes by dependency, incorporate them one
  at a time against the latest target, and require verification after each incorporation.
- **FR-012**: Semantic conflicts MUST require a responsible Work Item or human decision. The
  integration flow MUST NOT automatically choose one conflicting side.
- **FR-013**: Run Evidence MUST identify the Work Item, Agent Run, Run Owner, timestamps, state
  transitions, checkpoint, verification outcomes, integration result, and blocker classification.
- **FR-014**: Run Evidence MUST distinguish passed, failed, blocked, and unexecuted checks and MUST
  never report an unexecuted or blocked check as passed.
- **FR-015**: The workspace MUST exclude or redact credentials, personal Agent sessions, unnecessary
  prompts, complete transcripts, and full source snapshots from default durable evidence.
- **FR-016**: Work Item, source-host, runner, Agent Driver, claim, evidence, and execution concerns
  MUST remain replaceable through explicit provider or runner boundaries.
- **FR-017**: The local workflow MUST remain usable without Azure accounts, Azure tooling, managed
  execution, organization workload credentials, or a live cloud connection.
- **FR-018**: Managed execution MUST remain disabled until the organization approves the required
  identity, credential, subscription, network, region, budget, and retention boundaries.
- **FR-019**: The workspace MUST report missing capabilities, rejected credentials, unsupported
  regions, quota limits, and network restrictions as actionable failures without silent fallback.
- **FR-020**: Source-host operations MUST protect the integration target with the repository review
  and required-check workflow; Agent branches MUST use descriptive Work Item-oriented names without
  Agent, AI, Codex, or personal identity markers.
- **FR-021**: The initial local workflow MUST support two people using separate identities, Agent
  sessions, development environments, and Agent Sandboxes against one Generated Project.
- **FR-022**: The review policy MUST support `minimum_human_approvals: 0` and author self-review
  intent while still requiring the configured checks and integration evidence.

### Key Entities

- **Work Item**: The provider-neutral unit of planned work, including dependencies, Change Scope,
  and integration intent.
- **Work Claim**: A renewable, time-bounded exclusive reservation of a Work Item by one active run.
- **Agent Run**: One attributable execution attempt linked to a Work Item, owner, sandbox, and
  lifecycle history.
- **Agent Sandbox**: The isolated execution environment owned by one Agent Run.
- **Run Owner**: The single human or automation identity allowed to control an active Agent Run.
- **Agent Handoff**: The durable transfer of Run Owner responsibility between named identities.
- **Agent Checkpoint**: A recovery boundary containing repository state, verification evidence,
  unresolved risks, and next action.
- **Change Scope**: The expected paths, semantic seams, prerequisites, and integration target for
  a Work Item.
- **Integration Candidate**: A checkpointed change awaiting dependency-aware incorporation.
- **Integration Queue**: The ordered flow that serializes candidate incorporation and verification.
- **Run Evidence**: The attributable record of state, commands, outcomes, blockers, and recovery
  references, excluding unnecessary sensitive content.
- **AI Workload Credential**: An organization-approved non-personal credential for managed Agent
  execution, separate from a developer's interactive identity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Two team members can claim different Work Items and begin independent Agent work in
  separate sandboxes without either run writing to the other's mutable files in 100% of tested
  onboarding scenarios.
- **SC-002**: Across 100 concurrent claim attempts for one Work Item, exactly one attempt succeeds
  and no attempt creates a second active run or sandbox.
- **SC-003**: In at least 95% of handoff tests with a valid checkpoint, a replacement owner can
  resume the run within 5 minutes without losing the checkpoint or prior verification evidence.
- **SC-004**: In 100% of tested semantic-overlap cases, integration is blocked or serialized until
  an explicit dependency or responsible decision exists; no conflict is resolved by silent side
  selection.
- **SC-005**: In 100% of tested missing-capability and missing-managed-credential cases, the system
  provides a classified actionable failure while the Azure-free local workflow remains usable.
- **SC-006**: At least 95% of reviewers in an onboarding pilot can identify the current owner,
  checkpoint, verification state, and next action for a run without opening the original sandbox.
- **SC-007**: During the initial two-person pilot, at least 90% of Work Items reach an integration
  decision with attributable evidence for claim, implementation state, verification outcome, and
  final disposition.

## Assumptions

- The initial delivery is an Azure-free local workflow. Each person uses a separate development
  environment, source-host identity, Agent session, and sandbox.
- A Work Item provider and source host are available through adapters; the first configured path
  may use GitHub while preserving provider-neutral Work Item concepts.
- The Core Workspace remains usable before the company supplies an Azure organization, tenant,
  subscription, network policy, or approved AI Workload Credential.
- The team accepts one active controller per Agent Run. Inspection, comments, and handoff requests
  do not grant concurrent control.
- The initial managed profile allows at most two active Agent Runs and one active integration
  operation, starts with no prewarmed managed sessions, and requests a checkpoint before normal
  idle termination.
- Operational evidence uses a default 30-day retention period unless an approved organization
  policy changes it.
- Protected-branch and required-check policy is configured by the selected source-host adapter.
- Product-specific application code, Stack Profiles, databases, API contracts, OpenAPI, Swagger UI,
  and deployment behavior are outside this feature.

## Out of Scope

- A shared writable Codespace, shared filesystem, shared branch, or simultaneously controlled Agent
  session.
- A custom dashboard as a prerequisite for the first usable delivery.
- Automatic migration from the current source host to Azure Repos, Azure Boards, or Azure Pipelines.
- Managed Azure deployment before company approval of identities, workload credentials, regions,
  networking, budgets, retention, and subscription boundaries.
- Uploading personal ChatGPT, Codex, Git, source-host, or Azure credentials to managed execution.
- Automatic fallback to an unapproved runner, credential, region, package, or network path.
