# Feature Specification: Azure DevOps Collaboration Adapter

**Feature Branch**: `002-azure-devops-adapter`

**Work Item**: [GitHub Issue #9](https://github.com/devphuclam/CodespaceTemplate/issues/9)

**Created**: 2026-08-14

**Status**: Implementation in progress — offline foundation complete; live pilot convergence remains open

**Input**: User description: "Build an Azure DevOps Platform Adapter and harden multi-Agent collaboration. Keep Core provider-neutral; support Azure Boards, Azure Repos, pull-request policies, a provider-canonical Integration Queue, explicit bootstrap, and an optional runtime profile. Permit offline validation before an Azure account is available; gate live validation on real configuration without storing credentials in the repository."

## Clarifications

### Session 2026-08-14

- Q: Where should the canonical Integration Queue be stored so every environment can reconstruct
  the same order and decisions? → A: Use one dedicated coordination Work Item per Repository and
  integration target. It owns the queue manifest and candidate links; each candidate Work Item
  continues to own its claim, Change Scope, and Run Evidence.
- Q: How should an Azure Boards Work Item store current claim/run state and historical Run
  Evidence without custom fields? → A: Keep current state in a validated Coordination State block
  in the Description, keep Change Scope in its own structured block, append checkpoint, handoff,
  and Run Evidence comments without rewriting prior comments, and use tags only for discovery.
- Q: How should concurrent claim or Integration Queue updates determine which change is valid? →
  A: Use the provider's current revision as an optimistic concurrency condition. A duplicate
  returns its recorded outcome, a losing claim reports a conflict, and a stale queue operation
  rereads and retries at most four times after its initial attempt when its preconditions still
  hold; it then returns an explicit conflict.
- Q: What may provider bootstrap change automatically when a maintainer explicitly applies it? →
  A: Provider preparation is queue-only: it may create or reuse the single required Integration
  Queue Coordination Work Item under the exact fixed allowlist below. Repository policies,
  required checks, permissions, process configuration, and candidate Work Items are read-only.
- Q: When an authorized maintainer runs provider preparation with apply, what exact Azure Boards
  mutations may bootstrap perform? → A: Use a queue-only fixed allowlist. For the configured
  Repository and target, apply may create or reuse one Integration Queue Coordination Work Item of
  the configured existing Work Item Type and may set only `System.Title`, the managed Queue
  Manifest slice in `System.Description`, and the reserved
  `agent-workspace:integration-queue` and `agent-workspace:queue-key:<digest>` tags. It MUST NOT
  mutate a candidate Work Item during provider preparation.
- Q: Which non-mutating strategy should readiness use to determine the current identity's
  permissions for each operation? → A: Use Azure DevOps effective permission batch evaluation with
  `alwaysAllowAdministrators: false` over the exact security namespace, token, and permission bit,
  then combine it with read-only capability calls for target, process, repository, policy, and
  service visibility. Do not use write probes. A denied, unknown, malformed, or unavailable result
  fails closed for that operation and does not trigger credential fallback.
- Q: How should the GitHub compatibility adapter implement provider revisions and mutation
  conflicts without an atomic Azure-style revision test? → A: Use an immutable comment stream and
  deterministic append-reread-reconcile protocol. Derive the opaque revision from canonical Issue
  state and recognized operation-receipt comment IDs and payload hashes. Append a proposal carrying
  the expected revision and stable operation ID, reread, and mark it applied only when its original
  preconditions still hold and it wins deterministic reconciliation. A losing proposal remains
  non-authoritative history, returns conflict, and never grants claim, Run, or sandbox control.
- Q: How should the GitHub compatibility adapter determine whether a pull request satisfies
  repository policy? → A: Read every active effective rule for the exact target branch together
  with applicable classic branch protection, then evaluate pull-request review and merge state plus
  required check runs and commit statuses on the exact head SHA. Honor stricter provider approval
  requirements; `minimum_human_approvals: 0` adds no template-specific approval gate. An incomplete,
  unreadable, missing, pending, or failing required observation fails closed, and GitHub remains the
  final merge enforcer.
- Q: How should live validation recover and clean up if the process crashes or its local ledger is
  lost after Azure DevOps accepts a mutation? → A: Use an atomic write-ahead local ledger together
  with deterministic provider markers containing the Validation Run identity and artifact key.
  Recovery searches only the exact allowlisted target for those markers, reconciles pending intents,
  and never adopts an unmarked or pre-existing artifact. Cleanup may remove the Run-owned queue
  entry, close a Run-created Work Item, abandon a Run-created pull request, and delete a Run-created
  source branch only while its ownership marker and expected revision or head still match. Immutable
  comments and pre-existing coordination records remain; uncertain ownership fails closed for manual
  recovery, and the ledger remains until cleanup completes or an explicit handoff is recorded.
- Q: How should provider-neutral Work Item states map to Agile, Scrum, Basic, inherited, or custom
  Azure Boards processes? → A: Use versioned built-in mappings for Agile, Scrum, and Basic;
  inherited or custom processes require an explicit complete override, and every unmapped state
  fails closed rather than using best-effort inference.
- Q: How should the personal GitHub remote be handled after a Generated Project adopts Azure
  Repos? → A: Azure Repos becomes the only push-capable remote; retain the personal template as a
  fetch-only `template-upstream` remote whose push path is disabled.
- Q: How should the Integration Queue retain active and completed candidates without allowing its
  coordination Work Item to grow without bound? → A: Keep only pending and in-progress candidates
  in the active manifest. On completion, remove the entry from that manifest and append a compact
  immutable summary comment linked to the full evidence on the candidate Work Item.
- Q: Which identity should a Local Agent Runner use for live Azure DevOps validation? → A: Prefer
  the developer's user-delegated Microsoft Entra session, with automatic fallback to that
  developer's PAT only when the company has approved PAT use and the fallback is explicitly enabled
  in runtime configuration. The PAT comes from an approved secret source and is never persisted.
- Q: How should live validation prove that its Azure DevOps Repository is an approved test scope
  before mutation? → A: Require an explicit live-mode runtime flag and an exact allowlist match for
  Organization, Project, Repository, and fully qualified target ref. No provider-side
  non-production marker is required.
- Q: Which local environments must the Agent Workspace runtime profile support in V1? → A: Linux
  Dev Container and WSL2 are the supported execution environments. A host such as Dev Box is
  supported only when it runs one of those environments; direct native Windows parity is outside
  the V1 contract.
- Q: What happens when the optional runtime profile is omitted? → A: Omitted or `null` means that
  no Local Agent Runner profile is selected. Provider configuration, Core verification, and offline
  provider-neutral inspection remain usable; `workspace doctor` reports `runtime-profile:
  not-selected`, while commands requiring Local Agent Runner capabilities or live validation return
  `not-run` until `local-agent-v1` is explicitly selected in a supported environment.
- Q: How does the existing GitHub adapter provide canonical queue and preparation behavior after
  provider selection becomes explicit? → A: GitHub uses one coordination Issue per repository and
  target, discovered by the reserved queue labels and reconciled exclusively from recognized
  immutable proposal/receipt comments. The first normal enqueue may create/reuse that Issue and
  fails closed on create-race duplicates; GitHub preparation is read-only `not-applicable` rather
  than a bootstrap mutation; shared Local Agent Runner readiness is provider-neutral.
- Q: Which permission is required before a live validation run may delete its own source branch?
  → A: The cleanup phase must separately probe Git `ForcePush` on the exact validation source-ref
  token, combine it with a read-only ref capability check, and fail closed. That permission never
  authorizes deletion outside a matching Run marker and expected head.
- Q: How does an existing GitHub Generated Project remain usable when provider selection becomes
  explicit? → A: The template commits a non-secret root configuration selecting `github` with
  `runtimeProfile: null`. Azure adoption changes the selected provider deliberately; no command
  infers GitHub from a remote or silently falls back to it.
- Q: How are the timed first-maintainer and reviewer criteria sampled? → A: Use ten first-time
  maintainers and ten pilot reviewers with approved access; at least nine in each cohort must meet
  the stated time limit. Missing company access leaves the corresponding live pilot explicitly
  `not-run`, never passed.

### Session 2026-08-18

- Q: Should implementation completion and verification outcome be recorded independently? → A:
  Yes. Implementation may be complete while verification has the separate outcome `passed`,
  `blocked`, `not-run`, or `failed`. Only an actually executed and successful check is `passed`;
  an attempted check prevented by an environment or tool policy is `blocked`; a check prevented
  before execution by a missing runtime, access, or live gate is `not-run`. Neither `blocked` nor
  `not-run` may be reported as `passed`.
- Q: Should the mapping from `minimum_human_approvals` to
  `reviewIntent.minimumHumanApprovals` be mandatory? → A: Yes. The snake_case name is the
  provider-neutral policy concept and the camelCase name is its required JSON/API serialization;
  providers MUST NOT rename or reinterpret the value, and zero MUST NOT weaken stricter provider
  policy.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Adopt Azure DevOps as the company project home (Priority: P1)

As a Generated Project maintainer, I want to select an existing company Azure DevOps Organization,
Project, and Repository as the project's canonical collaboration platform so that company source
code and work records do not depend on a personal GitHub account.

**Why this priority**: The template is personally owned, but company projects need an approved
company-controlled home. The adapter is not useful until that ownership boundary is explicit and
repeatable.

**Independent Test**: Starting from a fresh Generated Project and non-secret company-provided
settings, a maintainer can prepare the project for Azure DevOps, inspect every proposed platform
change, repeat the setup safely, and verify that Azure DevOps is canonical while the personal
GitHub template remains provenance only.

**Acceptance Scenarios**:

1. **Given** a Generated Project created from the personal GitHub template and approved Azure
   DevOps settings, **When** the maintainer selects and prepares the Azure DevOps adapter, **Then**
   Azure Boards and Azure Repos become the canonical work and source surfaces without creating an
   ongoing mirror to personal GitHub.
2. **Given** the adapter has already been prepared, **When** the maintainer repeats preparation
   with the same settings, **Then** no duplicate metadata, policy, or work-tracking artifact is
   created and no existing company setting is weakened or deleted.
3. **Given** a required Organization, Project, Repository, identity, or permission is unavailable,
   **When** preparation is requested, **Then** it stops with the missing prerequisite identified
   and makes no partial or out-of-scope change.
4. **Given** a maintainer only requests a readiness check, **When** the check runs, **Then** it
   reports current capabilities without creating or changing Azure DevOps resources.
5. **Given** a required repository policy, permission, or check is absent, **When** bootstrap is
   applied, **Then** it reports the administrator action required and does not create or modify that
   administrator-owned configuration.
6. **Given** Azure Repos adoption has completed, **When** remote configuration is inspected or a
   push to the personal template is attempted, **Then** Azure Repos is the only push-capable target
   and the fetch-only `template-upstream` remote refuses the push.

---

### User Story 2 - Coordinate two people and their Agents through Azure Boards (Priority: P1)

As one of two developers using a separate company identity and Agent session, I want claims,
Change Scopes, Run ownership, handoffs, and evidence to be durable in Azure Boards so that both
people can coordinate without sharing an account, Agent session, or mutable checkout.

**Why this priority**: Multi-Agent collaboration is only safe when both participants see the same
attributable state and competing work cannot create two active owners for one Work Item.

**Independent Test**: Two people use separate identities and clones against one project. They can
claim different Work Items concurrently, a competing claim on the same Work Item produces exactly
one winner, and either person can inspect the canonical scope, owner, state, handoff, and evidence.

**Acceptance Scenarios**:

1. **Given** two available Work Items, **When** two named developers claim one item each from
   separate environments, **Then** both claims succeed and each Work Item identifies exactly one
   active Run Owner and isolated Agent Run.
2. **Given** one available Work Item, **When** two valid identities attempt to claim it
   concurrently, **Then** exactly one claim succeeds and the other receives an actionable conflict.
3. **Given** a Work Item with a valid normalized Change Scope, **When** either participant reads it,
   **Then** the expected paths, semantic seams, prerequisites, and integration target have the same
   meaning regardless of the participant's local state.
4. **Given** an active run with a valid checkpoint, **When** its owner hands it to the other
   developer, **Then** the previous owner, new owner, checkpoint, risks, and next action become
   durable before control transfers.
5. **Given** the company project uses an approved process other than the recommended default,
   **When** Work Item state is read or changed, **Then** the matching versioned built-in mapping or
   explicit complete override is honored, and the operation fails if any required state is unmapped.
6. **Given** a Work Item tag or comment conflicts with its validated Coordination State block,
   **When** claim authority or Run ownership is evaluated, **Then** the Coordination State block
   remains authoritative and the discrepancy is reported for reconciliation.

---

### User Story 3 - Share one durable Integration Queue across environments (Priority: P1)

As an integrator, I want all clones and Agent Sandboxes to observe one provider-canonical
Integration Queue so that integration order, dependency decisions, and semantic-conflict
resolutions cannot diverge between local machines.

**Why this priority**: A local-only queue can show different decisions to different developers and
cannot safely coordinate changes that overlap in the same behavior.

**Independent Test**: Two independent clones enqueue related candidates, delete their local
workspace state, reconstruct the queue from the provider, and incorporate candidates one at a time
in the same recorded order without losing dependency or conflict decisions.

**Acceptance Scenarios**:

1. **Given** a candidate accepted into the Integration Queue from one clone, **When** another clone
   refreshes its state, **Then** it observes the same candidate, dependency order, decision status,
   and evidence reference.
2. **Given** all local queue state has been deleted, **When** a participant reconstructs workspace
   state from Azure DevOps, **Then** no canonical queue entry, decision, or completed integration
   record is lost.
3. **Given** two candidates overlap only in paths but have independent semantic seams, **When** they
   are evaluated, **Then** the overlap is visible without incorrectly blocking safe parallel work.
4. **Given** two candidates overlap in behavior, **When** either is prepared for integration,
   **Then** integration waits for a recorded dependency or responsible decision and never silently
   chooses one side.
5. **Given** multiple ready candidates, **When** integration proceeds, **Then** each candidate is
   evaluated against the latest target and the required verification outcome is recorded before
   the next candidate begins.
6. **Given** a queue update based on a stale provider revision, **When** another participant has
   already changed the queue, **Then** the stale update cannot overwrite that change and may retry
   only after rereading and confirming that its original preconditions still hold.
7. **Given** a candidate reaches a final integration disposition, **When** its queue transition is
   recorded, **Then** it leaves the active manifest, a compact completion summary is appended to
   the coordination Work Item, and the summary links to full evidence on the candidate Work Item.

---

### User Story 4 - Enforce Azure Repos review and policy gates (Priority: P1)

As a maintainer or reviewer, I want Agent changes to use Azure Repos branches and pull requests and
to respect the project's effective policies so that required checks cannot be bypassed even when
the author is allowed to satisfy the human review intent.

**Why this priority**: The agreed review intent permits solo work, but it does not permit direct
integration, skipped validation, or weakening stricter company policy.

**Independent Test**: A candidate with passing policies can reach an integration decision; a
candidate with a failed, pending, unavailable, or stricter company policy is blocked with the
effective requirement and next action visible.

**Acceptance Scenarios**:

1. **Given** a candidate branch and pull request whose required checks pass, **When** the configured
   review intent and all effective company policies are satisfied, **Then** the candidate may
   proceed through the Integration Queue.
2. **Given** the project policy sets `minimum_human_approvals: 0`, **When** the author completes the
   documented self-review intent, **Then** lack of an independent approval does not add a template
   requirement, while any stricter Azure DevOps policy still applies.
3. **Given** a required check is failed, pending, blocked, or unexecuted, **When** integration is
   requested, **Then** integration is refused and the check is never represented as passed.
4. **Given** the effective repository policy cannot be inspected, **When** integration is
   requested, **Then** the operation fails closed instead of assuming that the target is safe.
5. **Given** an Agent attempts to update the integration target directly, **When** the mutation is
   detected, **Then** it is rejected and the Agent is directed to the pull-request and queue flow.

---

### User Story 5 - Prepare and validate the workspace before Azure access exists (Priority: P2)

As a template maintainer or developer waiting for company access, I want an optional Agent
Workspace runtime profile and an offline validation path so that I can prepare and verify the
collaboration contract without pretending that live Azure behavior has been tested.

**Why this priority**: Azure access is not currently available. Product-neutral development and
meaningful contract validation must continue, while live claims remain evidence-based.

**Independent Test**: On a clean Linux Dev Container and a clean WSL2 environment with no Azure
account or credentials, a developer can enable the optional runtime profile, run the complete
offline collaboration scenario, and receive an explicit result that distinguishes offline evidence
from live validation. Live validation only starts in a separately approved test scope when all
required inputs and access are present.

**Acceptance Scenarios**:

1. **Given** a Generated Project that has not selected an application Stack Profile, **When** the
   developer enables the Agent Workspace runtime profile, **Then** collaboration prerequisites are
   prepared and verified without selecting an application language, framework, database, or cloud
   deployment target.
2. **Given** no Azure account, credentials, or network access, **When** offline validation runs,
   **Then** it exercises provider-neutral collaboration behavior without contacting Azure DevOps
   and clearly labels the result as offline evidence.
3. **Given** one or more live settings or permissions are absent, **When** live validation is
   requested, **Then** it is reported as not run with the missing prerequisites listed and is never
   reported as passed.
4. **Given** complete approved settings and access to a dedicated test scope, **When** live
   validation runs, **Then** it records attributable Azure Boards and Azure Repos evidence and
   cleans up only artifacts created by that validation run.
5. **Given** authentication material or sensitive operational content is encountered, **When**
   output or Run Evidence is persisted, **Then** sensitive values are excluded or redacted before
   they can enter source control or shared evidence.
6. **Given** the developer's Entra session is unavailable and approved PAT fallback is explicitly
   enabled, **When** live validation authenticates, **Then** it uses only that developer's scoped
   PAT from an approved secret source, reports the non-secret authentication mode, and never
   persists or logs the token.
7. **Given** the live-mode flag is absent or the configured Organization, Project, or Repository
   differs from the exact runtime allowlist, **When** live validation is requested, **Then** it is
   reported as not run before any provider mutation occurs.
8. **Given** a Linux Dev Container or WSL2 environment, **When** the runtime profile readiness and
   offline checks run, **Then** the environment is evaluated against the same V1 collaboration
   contract.
9. **Given** direct native Windows execution without Linux Dev Container or WSL2, **When** runtime
   profile readiness is requested, **Then** it reports that the host is outside V1 support and
   directs the developer to a supported environment without claiming parity.

### Edge Cases

- The Azure DevOps Organization exists, but the named Project or Repository does not exist or is
  not visible to the current identity.
- The current identity can read Work Items but cannot update claims, create branches, open pull
  requests, inspect policies, or configure approved bootstrap metadata.
- Authentication expires between a successful readiness check and a state-changing operation.
- A live-validation process crashes before or after receiving a provider response, or its local
  ledger is lost; recovery must reconcile write-ahead intents with exact provider markers and must
  not claim or clean up an artifact whose ownership or revision can no longer be proven.
- Microsoft Entra authentication is unavailable while PAT fallback is disabled, unapproved,
  missing, expired, or insufficiently scoped; live validation must stop as not run or failed rather
  than request, generate, or discover another credential.
- A human or tool removes, duplicates, or corrupts a managed Coordination State or Change Scope
  block; the operation must stop with recovery guidance rather than infer authority from tags or
  unstructured comments.
- The project uses Scrum, Basic, inherited, or custom Work Item states that have no configured
  provider-neutral mapping, or a previously valid custom mapping no longer covers the current
  observed process fingerprint; affected state transitions must fail without best-effort inference.
- Two claim or queue updates arrive with stale revisions or are retried after an uncertain network
  outcome; a duplicate operation must return its recorded outcome, a competing claim must fail,
  and no stale operation may overwrite newer canonical state.
- Bootstrap succeeds for some proposed metadata and then loses connectivity; the rerun must report
  and reconcile only its own incomplete work without deleting unrelated configuration.
- A branch policy is stricter than the template's review intent, changes while a candidate is
  queued, or depends on a check that has not produced a result.
- A local cache is stale, corrupted, or deleted while another participant advances the canonical
  queue.
- A completion summary has a missing or invalid candidate-evidence link; queue recovery must report
  the broken history reference rather than presenting the integration record as complete.
- Two features modify the same file but different behavior, or different files that implement the
  same behavior; path overlap alone must not be treated as the semantic decision.
- A Generated Project still has a personal GitHub remote after company adoption; company bootstrap
  must convert it to fetch-only `template-upstream` and refuse adoption if it cannot
  disable that remote's push path.
- Live validation is accidentally pointed at a production repository or an unapproved project;
  an absent live-mode flag or any exact allowlist mismatch must refuse the run before creating
  artifacts, regardless of repository naming or interactive confirmation.
- Evidence retention on Azure DevOps differs from the template's historical 30-day expectation;
  the workspace must report actual provider policy and must not promise deletion it cannot enforce.
- A Dev Box or other host lacks a usable Linux Dev Container and WSL2 environment; runtime profile
  readiness must classify it as unsupported for V1 rather than treating the host name as proof of
  compatibility.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A Generated Project MUST be able to select the Azure DevOps Platform Adapter without
  making Azure DevOps a dependency of the Core Workspace.
- **FR-002**: Adapter selection MUST require explicit, non-secret Organization, Project,
  Repository, work-tracking process, and integration-target settings; real company values MUST NOT
  be committed to the Development Workspace Template.
- **FR-003**: Once selected for a company Generated Project, Azure Boards and Azure Repos MUST be
  the canonical work-tracking and source-host surfaces unless the company approves a different
  arrangement.
- **FR-004**: Adoption from the personal GitHub template MUST be one-way: the template remains
  provenance and a future release source, while company code MUST NOT require an ongoing personal
  GitHub mirror. Azure Repos MUST become the only push-capable remote. The personal template MAY
  remain as `template-upstream` for fetching Template Releases only, and its push path MUST be
  disabled before adoption is reported complete.
- **FR-005**: Provider preparation MUST be an explicit operation separate from readiness checks,
  MUST default to a non-mutating preview, and MUST show the intended scope, required permissions,
  and proposed changes before an authorized maintainer explicitly selects apply.
- **FR-006**: Provider preparation MUST be repeatable and non-destructive: repeating it with the
  same settings MUST NOT create duplicates, delete unrelated resources, weaken existing policies,
  or modify a different Organization, Project, or Repository. Apply MUST use a compiled queue-only
  allowlist: for each configured Repository and integration target it MAY create or reuse exactly
  one Integration Queue Coordination Work Item of the configured existing Work Item Type and MAY
  set only `System.Title`, the exact managed Queue Manifest slice in `System.Description`, and the
  reserved `agent-workspace:integration-queue` and
  `agent-workspace:queue-key:<digest>` tags. Preparation MUST NOT mutate candidate Work Items, and
  no configuration value may widen this allowlist.
- **FR-007**: A readiness check MUST be read-only and MUST distinguish missing configuration,
  authentication, permissions, capabilities, policy visibility, and network access. Bootstrap MUST
  also treat repository policies, required checks, permissions, and Work Item process configuration
  as read-only audit targets and report required administrator action instead of changing them.
  For each required operation, readiness MUST evaluate the current caller's effective permission
  with Azure DevOps permission batch evaluation using `alwaysAllowAdministrators: false` and the
  exact security namespace, resource token, and permission bit, then combine that result with the
  corresponding read-only capability call. The phase-specific operation set includes Work Item
  read, queue Work Item create/update, comment read/append, Git read, source-branch push,
  pull-request read/create/complete, and policy read; validation source-branch deletion is probed
  only for a cleanup phase that may perform it. No readiness path may attempt a write probe; denied,
  unknown,
  malformed, or unavailable results MUST fail closed for the affected operation without switching
  credentials.
- **FR-008**: Each human participant MUST use a separate approved Microsoft Entra identity; shared
  human accounts, shared PATs, and shared personal credentials MUST NOT be required or encouraged.
- **FR-009**: Authentication material MUST remain outside committed configuration, Run Evidence,
  Agent transcripts intended for sharing, and generated setup output. Tokens MUST be treated as
  opaque values and MUST NOT be decoded, persisted, or logged.
- **FR-010**: Azure Boards Work Items MUST be the canonical records for requested work,
  dependencies, Change Scope, claim state, Agent Run references, handoffs, blockers, and outcome.
  Each item MUST preserve human-authored content outside separate managed blocks, and its validated
  Coordination State block MUST be the authority for the current claim, Run Owner, lease, Agent
  Run state, and latest checkpoint reference. Tags MAY support discovery but MUST NOT establish
  claim or ownership authority.
- **FR-011**: Change Scope MUST be stored as a validated normalized JSON block in the Work Item
  description and MUST include expected paths or patterns, semantic seams, prerequisites, and the
  intended integration target.
- **FR-012**: Provider-neutral Work Item states MUST use a versioned mapping profile for the
  selected Azure DevOps process. The adapter MUST provide built-in profiles for standard Agile,
  Scrum, and Basic processes. An inherited or custom process MUST provide an explicit complete
  override for every required provider-neutral state. Bootstrap MUST display the selected profile,
  observed process fingerprint, and resolved mapping, and any missing or stale mapping MUST fail
  closed without best-effort inference. Agile remains the recommended default only when the
  company mandates no other process.
- **FR-013**: At most one active Work Claim and Agent Run MAY exist for a Work Item, including when
  valid requests arrive concurrently from separate environments. Every state mutation MUST carry
  a stable operation identity and the provider revision on which its preconditions were evaluated;
  a stale mutation MUST NOT become authoritative. An adapter with atomic conditional mutation MUST
  reject a stale write before state change. The GitHub compatibility adapter, which has no
  Azure-style atomic revision test, MUST derive its opaque revision from canonical Issue state plus
  recognized immutable operation-receipt comment IDs and payload hashes, append a proposal carrying
  that revision and operation identity, then reread and deterministically reconcile. Only a proposal
  whose original preconditions still hold and that wins reconciliation MAY become authoritative;
  a losing proposal remains non-authoritative history, returns `conflict`, and MUST NOT create or
  transfer an active claim, Run, or Agent Sandbox.
- **FR-014**: Claim, renewal, expiry, release, checkpoint, retry, handoff, and outcome transitions
  MUST update the current Coordination State block, append an attributable historical comment, and
  remain safe to retry. Repeating the same operation identity MUST return its recorded outcome
  without creating duplicate active state or appending or rewriting an evidence comment. This
  duplicate-result rule is shared with FR-013; this requirement additionally governs transition
  publication and evidence history.
- **FR-015**: An active Agent Run MUST have exactly one Run Owner and one isolated Agent Sandbox;
  concurrent observation MUST NOT grant concurrent control.
- **FR-016**: Each Repository and integration target MUST have exactly one dedicated coordination
  Work Item that canonically owns the active Integration Queue manifest, ordering, dependency
  decisions, semantic-conflict decisions, and links to candidate Work Items and pull requests. The
  active manifest MUST contain only pending and in-progress candidates. A final disposition MUST
  remove its entry from the active manifest and append one compact immutable completion summary
  linked to the full evidence on the candidate Work Item. Candidate Work Items MUST continue to
  own their claims, Change Scopes, and complete Run Evidence.
- **FR-017**: Local queue and run indexes MUST be disposable recovery aids. A participant MUST be
  able to reconstruct active coordination state and completed history from the active manifest,
  completion summaries, and linked candidate evidence after local files are absent or stale.
- **FR-018**: Concurrent or repeated queue operations MUST preserve one consistent canonical order
  and MUST NOT duplicate candidates, decisions, or completed integration records. A stale queue
  mutation MUST reread current canonical state and re-evaluate its preconditions; it MAY retry a
  maximum of four times after the initial attempt only while those preconditions remain valid and
  MUST otherwise return an explicit conflict. Last-write-wins behavior MUST NOT be used.
- **FR-019**: Path overlap MUST be reported separately from semantic overlap. Semantic overlap MUST
  require a recorded dependency, serialization decision, or responsible human decision.
- **FR-020**: Integration candidates MUST be processed one at a time against the latest integration
  target, with current policy and verification evidence evaluated before the next candidate begins.
- **FR-021**: Candidate changes MUST use descriptive Work Item-oriented branches and Azure Repos
  pull requests; direct Agent mutation of the protected integration target MUST be rejected.
- **FR-022**: Integration MUST require all effective repository policies and required checks of the
  selected provider to be observable and satisfied. For Azure Repos, the adapter MUST inspect the
  effective policies on the exact target and candidate. For GitHub compatibility, the adapter MUST
  enumerate every active effective rule for the exact target branch and inspect applicable classic
  branch protection, then evaluate pull-request review and merge state and both required check runs
  and commit statuses on the exact candidate head SHA, including any required source application.
  If a policy inventory source cannot be read and the provider cannot prove that it is inapplicable,
  the policy outcome MUST be unavailable rather than silently downgraded. Failed, pending, blocked,
  unexecuted, missing, stale, or unavailable required results MUST NOT be treated as passing. The
  provider's merge operation remains the final enforcement point and MUST NOT be bypassed.
- **FR-023**: The template review intent MUST support `minimum_human_approvals: 0` and author
  self-review. A value of zero adds no template-specific approval requirement; it MUST NOT weaken
  or replace any stricter approval or reviewer policy imposed by the company or selected provider.
  In provider configuration, the provider-neutral concept MUST serialize as
  `reviewIntent.minimumHumanApprovals`; providers MUST NOT rename or reinterpret this mapping.
- **FR-024**: Run Evidence MUST be appended to the candidate Work Item as attributable comments
  that identify the Work Item, Agent Run, Run Owner, branch, checkpoint, pull request, verification
  outcomes, policy outcome, queue decision, integration result, timestamps, and blocker
  classifications. The adapter MUST NOT edit or delete a previously published evidence comment.
- **FR-025**: Durable evidence MUST exclude or redact credentials, personal Agent session material,
  unnecessary prompts, complete transcripts, and full source snapshots before publication.
- **FR-026**: Evidence documentation MUST state the actual retention and deletion behavior of the
  selected provider and MUST NOT claim a retention deadline that the workspace cannot enforce.
- **FR-027**: Work Item, source-host, queue, policy, evidence, and runtime concerns MUST remain
  replaceable so the provider-neutral Core contract and existing GitHub path do not depend on Azure
  DevOps-specific behavior.
- **FR-028**: The Agent Workspace runtime profile MUST be optional, reproducible, and independent
  from application Stack Profiles, application dependencies, and deployment choices. V1 MUST
  support execution in the repository's Linux Dev Container and in WSL2. Dev Box or another host
  MAY qualify only by running one of those supported environments; direct native Windows parity is
  not part of the V1 contract. Omitted or `null` `runtimeProfile` MUST mean that no Local Agent
  Runner profile is selected: Core verification, provider configuration, and offline
  provider-neutral inspection remain available, while Local Agent Runner-dependent and live
  commands report `not-run` rather than selecting an implicit runtime.
- **FR-029**: When `local-agent-v1` is selected, the runtime profile MUST provide one documented
  readiness result for every required collaboration capability and MUST fail explicitly when a
  prerequisite is unavailable. Readiness MUST identify the supported execution environment and
  MUST classify direct native Windows execution as unsupported rather than partially passing it.
- **FR-030**: Offline validation MUST exercise the provider-neutral claim, handoff, recovery,
  overlap, queue, policy, and evidence contracts without Azure credentials or live Azure DevOps
  access.
- **FR-031**: Offline validation results MUST be labeled as simulated evidence and MUST NOT be used
  to claim that live Azure behavior or permissions passed.
- **FR-032**: Live Azure validation MUST remain gated until all required settings, approved named
  identity permissions, network access, an explicit live-mode runtime flag, and an exact allowlist
  match for Organization, Project, Repository, and fully qualified target ref are present.
  Repository naming conventions,
  interactive confirmation, and provider-side markers MUST NOT substitute for the exact allowlist.
- **FR-033**: A gated or skipped live check MUST be reported as not run with its missing
  prerequisites; it MUST never be reported as passed. Implementation completion and verification
  outcome MUST remain separate: `passed` requires an executed successful check, `blocked` means an
  attempted check was prevented by an environment or tool policy, `not-run` means execution was
  prevented before start by a missing prerequisite or gate, and neither `blocked` nor `not-run`
  may be represented as `passed`.
- **FR-034**: Live validation MUST maintain an atomic write-ahead local ledger: before each provider
  mutation it records a stable Validation Run identity, artifact key, exact allowlisted target,
  intended operation, and expected provider revision or head; after the response it records the
  resulting provider identity and revision. Every validation-created Work Item, queue entry, source
  branch, and pull request MUST carry a provider-appropriate deterministic marker for that Run and
  artifact key. Recovery after interruption or local-ledger loss MUST search only the exact
  allowlisted target for reserved validation markers, reconcile pending intents idempotently, and
  MUST NOT adopt an unmarked or pre-existing artifact. Cleanup is limited to removing the Run-owned
  queue entry with a conditional update, closing rather than deleting a Run-created Work Item,
  abandoning a Run-created pull request, and deleting a Run-created source branch only when its
  marker and expected revision or head still match and its cleanup-specific source-ref `ForcePush`
  permission and read capability have passed. It MUST NOT delete immutable comments or a
  pre-existing queue coordination record, nor delete or overwrite pre-existing Work Items, branches,
  pull requests, policies, repositories, projects, or organizations. Uncertain ownership or revision
  drift MUST stop cleanup with an actionable manual-recovery outcome. The ledger MUST remain until
  cleanup completes or an explicit attributable handoff is recorded.
- **FR-035**: Missing capabilities, authentication failures, permission denials, policy conflicts,
  rate limits, stale state, and network restrictions MUST produce actionable classified outcomes
  without silent fallback to a personal host or weaker policy.
- **FR-036**: Core verification and offline collaboration MUST remain usable without an Azure
  subscription, Azure DevOps Organization, company account, live credentials, managed Agent Runner,
  or cloud connection.
- **FR-037**: A Local Agent Runner MUST prefer the current developer's user-delegated Microsoft
  Entra session for live Azure DevOps operations. It MAY automatically fall back to that
  developer's PAT only when company policy approves PAT use and a non-secret runtime setting
  explicitly enables fallback. The PAT MUST be narrowly scoped, supplied by an approved secret
  source, attributed to that developer, and excluded from persistence and logs. The selected
  authentication mode MUST be reported without exposing credential material; no other fallback is
  permitted.

### Key Entities

- **Platform Adapter Selection**: The Generated Project decision that identifies Azure DevOps as
  the canonical source and Work Item provider while leaving Core replaceable.
- **Provider Configuration**: Non-secret references to the selected Organization, Project,
  Repository, work-tracking process, integration target, expected policy, remote roles, and any
  live-validation allowlist; it contains no authentication material. The provider-neutral policy
  concept `minimum_human_approvals` serializes as the required JSON/API field
  `reviewIntent.minimumHumanApprovals`.
- **Template Upstream**: The optional fetch-only remote that references the personal Development
  Workspace Template for intentional release adoption. It has no usable push path and is never a
  company-code destination.
- **Provider Preparation Plan**: The reviewable preview of the exact Organization, Project,
  Repository, integration target, required permissions, configured existing Work Item Type, and
  the queue-only mutations an authorized maintainer may apply explicitly and repeat safely. The
  plan may propose only one queue coordination record plus its title, managed Queue Manifest slice,
  and reserved discovery/key tags. Candidate Work Items and administrator-owned settings appear
  only as read-only findings or later collaboration records, never as preparation mutations.
- **Permission Probe Result**: The read-only result for one stable operation name. It records the
  security namespace, resource token, permission bit, effective allow/deny/unavailable outcome,
  corresponding capability-read outcome, observation time, classification, and administrator next
  action without storing credentials or raw authorization headers.
- **Azure Boards Work Item Record**: The provider representation of a Work Item and its lifecycle.
  It preserves human-authored content and contains separate managed Change Scope and Coordination
  State blocks plus append-only evidence comments.
- **Change Scope Block**: The normalized JSON description of expected paths, semantic seams,
  prerequisites, and integration target stored in the Work Item description.
- **Coordination State Block**: The validated machine-managed description block that represents the
  current claim, Run Owner, lease, Agent Run state, and latest checkpoint reference. It is the
  authority for current control decisions when tags or comments disagree.
- **Mutation Identity and Revision**: The stable identity of one requested state change and the
  provider revision against which its preconditions were evaluated. Together they distinguish a
  safe duplicate from a stale or competing mutation. Azure uses the Work Item revision as an
  atomic condition. GitHub compatibility uses a deterministic hash of canonical Issue state and
  recognized immutable receipt comment IDs/payload hashes, followed by append-reread-reconcile;
  an appended losing proposal is historical evidence and never authoritative state.
- **State Mapping Profile**: A versioned complete mapping between provider-neutral lifecycle states
  and one observed Azure Boards process metadata fingerprint. Standard Agile, Scrum, and Basic
  profiles are built in; inherited and custom processes supply an explicit complete override.
- **Run Evidence Comment**: An attributable historical record appended for a checkpoint, handoff,
  retry, verification, policy, queue, blocker, or integration outcome. Previously published
  evidence comments are not rewritten by the adapter.
- **Integration Queue Coordination Work Item**: The single provider record for one Repository and
  integration target that owns the bounded active manifest, ordering and conflict decisions,
  append-only completion summaries, and links to candidate Work Items and pull requests.
- **Canonical Queue Entry**: One pending or in-progress candidate's durable entry in the active
  manifest, including its dependency order, responsible decisions, evidence references, linked
  Work Item, and pull request. Its final disposition becomes a completion summary rather than
  remaining in the active manifest.
- **Queue Completion Summary**: The compact immutable comment appended when a candidate leaves the
  active manifest. It records the final disposition and links to the candidate Work Item that owns
  the complete integration evidence.
- **Repository Policy Snapshot**: The provider, exact target, candidate revision or head SHA,
  effective review rules, required checks and statuses, source restrictions, observation time,
  completeness, and normalized outcome observed at an integration decision point. A snapshot is
  unavailable when a potentially applicable policy inventory or required result cannot be read.
  Local verification evidence remains separate and cannot substitute for provider policy.
- **Runtime Profile**: The optional, application-neutral environment capability set required to
  operate and validate the Agent Workspace in a supported Linux Dev Container or WSL2 environment.
- **Validation Run**: An attributable offline or live acceptance attempt whose stable identity,
  mode, prerequisites, exact target identity, allowlist decision, write-ahead intents, deterministic
  artifact markers, provider identities and revisions, outcomes, cleanup status, and any explicit
  recovery handoff are recorded. Its local ledger is durable and atomic but contains no credential;
  provider markers permit reconstruction after local cache loss.
- **Local Authentication Context**: The named developer identity, non-secret authentication mode,
  and authorization outcome used by one Local Agent Runner. Credential material is never part of
  this entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 9 of 10 first-time pilot maintainers with approved settings and permissions
  can select and prepare the Azure DevOps adapter in 20 minutes or less without placing a secret
  or company value in the template repository.
- **SC-002**: Two participants using separate identities and clones observe the same canonical
  claim, Run Owner, handoff, queue position, and integration decision within 30 seconds in at least
  99% of connected pilot observations.
- **SC-003**: Across 100 concurrent valid claim attempts for one Work Item, exactly one attempt
  succeeds and no test creates a second active claim or Agent Run.
- **SC-004**: In 100% of recovery tests, canonical queue state and completed decisions can be
  reconstructed after local coordination files are deleted or replaced with stale copies.
- **SC-005**: In 100% of tested semantic-conflict, failed-check, unavailable-policy, and stricter
  company-policy cases, integration is blocked until the responsible dependency, decision, or
  effective requirement is satisfied.
- **SC-006**: Three consecutive preparation runs with identical settings produce no duplicate
  artifacts, no policy weakening, and no changes outside the named test Project and Repository.
- **SC-007**: The complete offline acceptance scenario runs without an Azure account or live Azure
  DevOps connection and labels 100% of its results as offline rather than live evidence.
- **SC-008**: In 100% of missing-prerequisite live-validation cases, the result is reported as not
  run rather than passed. In 100% of absent-flag or allowlist-mismatch cases, zero provider artifact
  is created; an authorized matching live pilot records attributable Work Item, pull-request,
  policy, queue, and cleanup evidence. At every injected interruption point before and after a
  provider response, recovery either reconciles and cleans only Run-owned artifacts or reports an
  ownership/revision blocker without mutating pre-existing artifacts.
- **SC-009**: Automated and manual inspection of committed examples, generated setup output, and
  persisted test evidence finds zero credentials, tokens, secrets, or personal Agent session data.
- **SC-010**: At least 9 of 10 pilot reviewers can identify the current owner, Change Scope,
  candidate pull request, required-check state, queue decision, and next action within 5 minutes
  without access to another participant's sandbox or Agent transcript.
- **SC-011**: In all adoption tests, company source commits and active Work Items are written only
  to the selected Azure DevOps project; the personal GitHub template receives no company-code
  update or automatic back-sync, and every attempted push through `template-upstream` is refused.
- **SC-012**: The existing Core verification and complete offline collaboration scenario succeed
  in 100% of tested Linux Dev Container and WSL2 baseline environments where Azure settings and
  credentials are absent; direct native Windows is reported as unsupported rather than passed.
- **SC-013**: Across 100 paired stale-revision queue-update tests, no accepted decision is lost, no
  candidate or evidence record is duplicated, and every invalidated operation returns an explicit
  conflict instead of overwriting newer state.
- **SC-014**: In 100% of mapping contract tests, each supported standard process resolves every
  required provider-neutral state, while each incomplete or stale inherited/custom mapping is
  rejected before any Work Item state changes.
- **SC-015**: After 10,000 simulated completed integrations, the active manifest contains no
  completed entry, every completion has exactly one queue-level summary, and every summary resolves
  to the candidate Work Item that owns its full evidence.
- **SC-016**: In 100% of live-authentication tests, Entra is attempted first; PAT is used only when
  approved fallback is explicitly enabled, and inspection of logs, evidence, generated output, and
  committed files reveals no token material.

## Assumptions

- The company will provide a named Microsoft Entra account and access to an existing Azure DevOps
  Organization. The Organization URL, Project, Repository, process, and permissions are unknown
  today and remain runtime inputs rather than committed defaults.
- The recommended organization layout begins with one Azure DevOps Project for the group and one
  or more repositories. A Generated Project selects the repository it owns; additional Projects
  are created only for genuine policy or isolation boundaries.
- The recommended Work Item process is Agile when the company has no mandated process. Company
  Scrum or Basic processes use their matching versioned built-in profile; inherited or custom
  processes take precedence only through an explicit complete mapping override.
- Company source code is not permitted in the personal GitHub account unless the company gives
  explicit approval. The personal GitHub repository remains the reusable template source only.
- Template adoption into Azure Repos is a one-time seed or import followed by Azure-only company
  development. Later Template Releases are adopted intentionally through migration changes, not a
  bidirectional mirror. The personal template may remain configured only as the fetch-only
  `template-upstream` remote; Azure Repos is the sole push target.
- Each developer uses Codex Desktop with a separate Linux Dev Container or WSL2 environment and
  operates a Local Agent Runner under that person's identities. A company-approved Dev Box or
  equivalent host satisfies V1 only when it provides one of those supported execution environments.
- Local live validation prefers each developer's user-delegated Microsoft Entra session. A
  developer-specific PAT fallback is permitted only when company policy approves it and runtime
  configuration explicitly opts in; shared PATs and repository-stored tokens remain prohibited.
- Azure Boards and Azure Repos are the initial company adapter scope. Azure Pipelines may provide
  an existing required build result, but defining an application pipeline is not part of this
  feature.
- The template review policy remains `minimum_human_approvals: 0`; the author may satisfy review
  intent, while stricter company policy is authoritative and cannot be bypassed.
- Change Scope is stored in the Work Item description as normalized JSON. Custom Azure DevOps
  fields are deferred until the company approves process customization.
- Each Repository and integration target uses one dedicated Integration Queue Coordination Work
  Item. This central record serializes queue changes without taking ownership of candidate claims,
  Change Scopes, or Run Evidence.
- Provider comments or history may persist beyond a requested evidence-retention interval. Data is
  minimized and redacted before publication; this feature does not promise deletion the provider
  cannot enforce.
- The Shared Agent Workspace behavior defined by feature `001-shared-agent-workspace` remains the
  provider-neutral baseline and is not re-specified differently here.

## Dependencies

- The provider-neutral Work Item, Work Claim, Agent Run, Agent Handoff, Agent Checkpoint, Change
  Scope, Integration Queue, and Run Evidence contracts from `001-shared-agent-workspace`.
- An existing Azure DevOps Organization, Project, Repository, named user identities, and delegated
  permissions are required only for preparation and live validation.
- A project-owned required-check source is required before live integration can pass when the
  effective repository policy demands it.
- Company administrators remain responsible for approving identity, process customization,
  repository policy, retention, and test-scope boundaries.

## Out of Scope

- Creating or deleting an Azure DevOps Organization, company Project, production Repository, or
  Microsoft Entra tenant.
- Azure subscription provisioning, Azure infrastructure, application deployment, resource groups,
  managed identities for workloads, or infrastructure-as-code.
- A Managed Agent Runner, shared service account, shared personal credential, uploaded ChatGPT or
  Codex session, or centrally hosted Agent Control Plane.
- Creating an application-specific Azure Pipeline, selecting an application Stack Profile, or
  adding application language, framework, database, OpenAPI, or Swagger UI tooling.
- A shared writable Codespace, filesystem, branch, worktree, or simultaneously controlled Agent
  session.
- Bidirectional GitHub/Azure mirroring, automatic template overwrites, or automatic synchronization
  of project-owned code with later Template Releases.
- Automatic modification of Azure DevOps inherited/custom processes or creation of custom Work
  Item fields without separate company approval.
- Automatic creation, modification, deletion, or weakening of repository policies, required
  checks, permissions, process configuration, repositories, or administrator-owned metadata.
- A custom collaboration dashboard when Azure Boards, Azure Repos, and existing workspace status
  surfaces provide the required evidence.
- Claiming live Azure success from offline simulations, mocked provider behavior, missing policy
  visibility, or an unexecuted check.
- Direct native Windows runtime parity or a separate native Windows setup and acceptance-test path.
