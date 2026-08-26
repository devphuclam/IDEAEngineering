---

description: "Dependency-ordered implementation tasks for the Azure DevOps Collaboration Adapter"
---

# Tasks: Azure DevOps Collaboration Adapter

**Input**: Design artifacts in `specs/002-azure-devops-adapter/`

**Work Item**: [GitHub Issue #9](https://github.com/devphuclam/CodespaceTemplate/issues/9)

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md` are complete. Implementation runs on branch `002-azure-devops-adapter` or an
equivalent isolated non-Agent-branded branch/worktree.

**Tests**: Tests are mandatory. Within each phase, write the listed tests first, confirm the focused
test fails for the expected missing behavior, then implement the corresponding production task.

## Format: `[ID] [P?] [Story] Description`

- **[P]** means the task can run concurrently because it has no unmet dependency and does not edit
  a file used by another concurrent task.
- **[US#]** maps a task to one independently testable user story.
- Every task names its exact repository path.

## Phase 1: Setup and Test Surfaces

**Purpose**: Establish scripts, fixtures, safe examples, and ignored state before changing adapter
contracts.

- [X] T001 Add exact `test:github:compatibility`, `test:azure:offline`, separately gated `test:azure:live`, and `test:baseline` scripts without adding an Azure SDK runtime dependency in `tools/agent-workspace/package.json`; do not change `tools/agent-workspace/package-lock.json` unless package metadata requires it (FR-030, FR-032, FR-033, FR-036, SC-008, SC-012)
- [X] T002 [P] Create deterministic placeholder-only Azure Organization, Project, Repository, process, Area Node, Work Item, permission, policy, comment, pagination, throttling, Git, and PR fixtures in `tools/agent-workspace/test/fixtures/azure/fixtures.ts` (FR-013, FR-030, FR-035, SC-003, SC-013)
- [X] T003 [P] Commit the non-secret explicit GitHub default with `runtimeProfile: null` in `agent-workspace.config.json` and add the Azure provider example with Entra-first auth, disabled PAT fallback, exact live allowlist variable names, process fingerprint fields, and `minimumHumanApprovals: 0` in `config/agent-workspace.azure.example.json` (FR-001, FR-002, FR-009, FR-023, FR-028, FR-037)
- [X] T004 [P] Ignore `.workspace/validation/` ledgers and disposable provider mirrors without ignoring shared configuration or committed test fixtures in `.gitignore` (FR-009, FR-017, FR-034)

**Checkpoint**: Test commands, safe fixtures, example configuration, and ignored runtime state are
ready.

---

## Phase 2: Provider-Neutral and Read-Only Foundation

**Purpose**: Migrate fake/GitHub adapters first and implement every shared Azure read-only primitive
needed by bootstrap. This phase blocks all user stories.

### Tests first

- [X] T005 [P] Add provider-port contract tests for opaque revisions, stable operation IDs, authoritative `applied`, durable `duplicate`, explicit `conflict`, classified preparation `not-applicable`, structured PR refs, complete policy snapshots, readiness, and provider selection in `tools/agent-workspace/test/contract/provider-ports.ts` (FR-013, FR-022, FR-027)
- [X] T006 [P] Add mutation tests for canonical payload hashing, keyed same-process serialization, atomic-provider stale rejection, append-provider losing history, duplicate receipts, and the shared `MAX_STALE_REREADS = 4` retry budget in `tools/agent-workspace/test/unit/mutations.test.ts` (FR-013, FR-014, FR-018)
- [X] T007 [P] Add policy-domain tests proving local verification and provider policy remain separate and incomplete, missing, pending, failed, blocked, stale, unexecuted, or unavailable requirements cannot pass in `tools/agent-workspace/test/unit/policy.test.ts` (FR-022, FR-023, FR-035)
- [X] T008 [P] Add GitHub revision tests for canonical Issue/comment hashes, the immutable-Repository-ID/target queue-key vector, exact normalized/sorted queue-label projection, malformed/duplicate/mismatched recognized labels, unknown-label exclusion, append-reread-reconcile races, deterministic earliest valid winner, operation-ID/hash mismatch, and non-authoritative losing receipts in `tools/agent-workspace/test/unit/github/revisions.test.ts` (FR-013, SC-003)
- [X] T009 [P] Add GitHub policy tests for active effective Rulesets, classic protection, reviews, conversations, check runs, commit statuses, exact head SHA, source applications, zero template approvals, and stricter provider rules in `tools/agent-workspace/test/unit/github/policies.test.ts` (FR-022, FR-023)
- [X] T010 [P] Add a revised-port GitHub compatibility contract covering claims, checkpoints, immutable evidence, PRs, revisions, normal-enqueue coordination-Issue create/reuse/create-race failure and queue recovery after local loss, read-only `not-applicable` preparation, shared runtime readiness, policy, and existing black-box behavior in `tools/agent-workspace/test/contract/github-provider-compatibility.ts` (FR-027, FR-036)
- [X] T011 [P] Add provider-configuration tests for the committed explicit GitHub default, omitted/null versus `local-agent-v1` runtime behavior, exact refs/IDs, built-in/custom process profiles, secret-bearing rejection, PAT approval syntax, live gates, and no implicit remote-derived fallback in `tools/agent-workspace/test/unit/config/provider.test.ts` (FR-001, FR-002, FR-009, FR-012, FR-028, FR-037)
- [X] T012 [P] Add Azure HTTP tests for endpoint-local API versions, URI encoding, pagination, malformed responses, `Retry-After`, bounded jitter, unknown mutation delivery, and redacted classifications in `tools/agent-workspace/test/unit/azure/http.test.ts` (FR-035)
- [X] T013 [P] Add auth tests proving Entra is attempted first, PAT is considered only for approved acquisition-unavailable fallback, and no credential reaches arguments, files, output, or evidence in `tools/agent-workspace/test/unit/azure/auth.test.ts` (FR-008, FR-009, FR-037, SC-016)
- [X] T014 [P] Add strict decoder tests for Project, Repository, process, Work Item, comments, security namespaces, permission batches, Git refs/PRs, policy inventories, and policy evaluations in `tools/agent-workspace/test/unit/azure/models.test.ts` (FR-007, FR-035)
- [X] T015 [P] Add Queue Manifest serializer/parser tests for deterministic HTML-escaped JSON, byte-preserving managed-slice replacement, exact markers, schema/version checks, and corrupt/duplicate block rejection in `tools/agent-workspace/test/unit/azure/queue-manifest.test.ts` (FR-006, FR-016)
- [X] T016 [P] Add process tests for complete Agile/Scrum/Basic mappings, deterministic `observedProcessFingerprint`, complete custom overrides, and fail-closed drift/unmapped states in `tools/agent-workspace/test/unit/azure/process-mapping.test.ts` (FR-012, SC-014)
- [X] T017 [P] Add permission tests for namespace/action discovery, exact CSS/Git tokens and bits including exact-source-ref `ForcePush` before validation branch deletion, `alwaysAllowAdministrators: false`, operation-by-operation outcomes, capability reads, zero write probes, and fail-closed drift/denial/unavailability in `tools/agent-workspace/test/unit/azure/permissions.test.ts` (FR-007, FR-034)

### Foundation implementation

- [X] T018 Implement `ProviderRevision`, stable operation identity, canonical hashing, authoritative mutation dispositions, keyed same-process serialization, the shared `MAX_STALE_REREADS = 4` retry budget, and atomic/append reconciliation rules in `tools/agent-workspace/src/domain/mutations.ts` (FR-013, FR-014, FR-018)
- [X] T019 [P] Implement provider-neutral pull-request, inventory-source, policy-requirement, candidate-revision, completeness, and strict aggregate-outcome types in `tools/agent-workspace/src/domain/policy.ts` (FR-022, FR-023)
- [X] T020 [P] Implement the configured local-command runner with no provider-policy interpretation in `tools/agent-workspace/src/adapters/local/verification.ts` (FR-020, FR-022)
- [X] T021 Replace GitHub-shaped ports with revisioned Work Item/claim/evidence/queue, structured source-host, policy, preparation, permission-result, verification, readiness, and recovery contracts in `tools/agent-workspace/src/adapters/ports.ts` after T018-T020 (FR-001, FR-027)
- [X] T022 Migrate neutral fakes to the revised contracts and add deterministic clock, ID, HTTP, Git, token, revision, and policy seams in `tools/agent-workspace/src/adapters/fakes/index.ts` after T021 (FR-027, FR-030)
- [X] T023 Implement GitHub canonical revision projection, proposal append, deterministic reconciliation, and authoritative receipt lookup in `tools/agent-workspace/src/adapters/github/revisions.ts` after T018 and T021 (FR-013)
- [X] T024 Implement a coordination-Issue-backed GitHub `CanonicalQueueStore` with exact queue-label discovery, normal-enqueue create/reuse/create-race failure, immutable-stream recovery, sequence/lease/completion projection, and `MAX_STALE_REREADS = 4` enforcement in `tools/agent-workspace/src/adapters/github/queue.ts`; implement read-only `not-applicable` preparation in `tools/agent-workspace/src/adapters/github/preparation.ts`; and migrate GitHub Work Item, claim, and evidence operations to stable IDs, expected opaque revisions, append-reread-reconcile outcomes, and immutable receipt references in `tools/agent-workspace/src/adapters/github/work-items.ts`, `tools/agent-workspace/src/adapters/github/claims.ts`, and `tools/agent-workspace/src/adapters/github/evidence.ts` after T023 (FR-013, FR-014, FR-016, FR-017, FR-018, FR-027)
- [X] T025 [P] Implement GitHub effective Rulesets/classic-protection inventory and exact-head review/check-run/status evaluation in `tools/agent-workspace/src/adapters/github/policies.ts` after T019 and T021 (FR-022, FR-023)
- [X] T026 Update GitHub source-host behavior to structured refs, target-head checks, idempotent PR lookup, complete policy delegation, stricter approvals, and direct-target rejection in `tools/agent-workspace/src/adapters/github/source-host.ts` after T025 (FR-021, FR-022, FR-027)
- [X] T027 Implement strict non-secret configuration loading, the committed GitHub default, explicit provider selection, omitted/null versus selected runtime behavior, target/ref validation, custom mapping validation, auth assertions, live gates, and secret scans in `tools/agent-workspace/src/config/provider.ts` (FR-001, FR-002, FR-009, FR-012, FR-028, FR-037)
- [X] T028 [P] Implement untrusted Azure wire DTO validation for all fixtures covered by T014 in `tools/agent-workspace/src/adapters/azure/models.ts` (FR-035)
- [X] T029 Implement injected Azure HTTP transport, endpoint-local versions, pagination, throttling, response validation, unknown-delivery reconciliation hooks, and redacted errors in `tools/agent-workspace/src/adapters/azure/http.ts` after T028 (FR-009, FR-035)
- [X] T030 Implement opaque `SecretString`, Entra CLI acquisition, explicit per-developer PAT fallback, attribution lookup, and ephemeral Git auth environment preparation in `tools/agent-workspace/src/adapters/azure/auth.ts` after T012-T013 (FR-008, FR-009, FR-037)
- [X] T031 [P] Implement the strict Queue Manifest managed-slice serializer/parser required before bootstrap in `tools/agent-workspace/src/adapters/azure/blocks.ts` after T015 (FR-006, FR-016)
- [X] T032 [P] Implement built-in process profiles, metadata discovery, deterministic `observedProcessFingerprint`, complete custom override validation, and fail-closed state resolution in `tools/agent-workspace/src/adapters/azure/process-mapping.ts` after T016 (FR-012)
- [X] T033 Implement security-namespace discovery and effective permission batch evaluation with exact operation matrix, cleanup-specific exact-source-ref `ForcePush`, capability reads, no write probes, and no credential fallback in `tools/agent-workspace/src/adapters/azure/permissions.ts` after T017, T028, and T029 (FR-007, FR-034)
- [X] T034 Implement read-only Organization/Project/Repository/Area Node/target resolution, canonical queue key, remote audit inputs, and policy visibility inputs in `tools/agent-workspace/src/adapters/azure/target.ts` after T027-T033 (FR-002, FR-005, FR-007)
- [X] T035 Build provider-selected base `CliContext`, stable operation-ID journal, provider-neutral output/errors, GitHub queue/preparation/runtime wiring, and Azure read-only wiring in `tools/agent-workspace/src/cli/context.ts`, `tools/agent-workspace/src/cli/output.ts`, and `tools/agent-workspace/src/cli/index.ts` after T021-T034 (FR-027, FR-035)
- [X] T036 Run the focused suites declared by T005-T017 from `tools/agent-workspace/package.json`, fix foundation regressions, and confirm the existing GitHub black-box files under `tools/agent-workspace/test/blackbox/` still pass before enabling Azure mutations (FR-013, FR-022, FR-027, SC-003, SC-016)

**Checkpoint**: Fake and GitHub adapters satisfy revised provider-neutral contracts; Azure target,
auth, transport, Queue Manifest, process, permissions, and policy visibility are read-only and ready
for user stories.

---

## Phase 3: User Story 1 - Adopt Azure DevOps as the Company Project Home (Priority: P1) - MVP

**Goal**: Preview and explicitly apply queue-only provider preparation, then perform one-way
Azure Repos adoption without mutating administrator-owned settings or candidate Work Items.

**Independent Test**: From placeholder-safe configuration and fake Azure transport, preview emits no
mutation; three identical applies reuse one queue Work Item and touch only its title, Queue Manifest
slice, and two reserved tags; adoption leaves Azure as the only push-capable remote.

### Tests first

- [X] T037 [P] [US1] Add preparation contract tests for read-only preview, exact plan digest, queue-only field/tag allowlist, candidate preservation, permission failures, duplicate queue records, and three idempotent applies in `tools/agent-workspace/test/contract/azure-preparation.ts` (FR-005, FR-006, FR-007, SC-006)
- [X] T038 [P] [US1] Add remote-adoption tests for exact Azure Repository identity, preview/apply drift, Azure-only `origin`, fetch-only `template-upstream`, failing GitHub push URL, and no mirror in `tools/agent-workspace/test/unit/azure/adoption.test.ts` (FR-003, FR-004, SC-011)
- [X] T039 [US1] Add a prepare/adopt black-box journey that reports administrator gaps, performs only allowlisted queue mutation, repeats safely, and rejects every personal GitHub push path in `tools/agent-workspace/test/blackbox/test_azure_prepare_adopt.ts` (FR-003 through FR-007)

### Implementation

- [X] T040 [US1] Implement readiness, queue discovery, exact preview digest, queue-only apply, idempotent reuse, candidate protection, and duplicate-record failure in `tools/agent-workspace/src/adapters/azure/bootstrap.ts` after T031-T034 and T037 (FR-005, FR-006, FR-007)
- [X] T041 [P] [US1] Implement remote-role inspection and one-way preview/apply adoption that makes Azure `origin` the sole push target and disables template-upstream push in `tools/agent-workspace/src/adapters/azure/repos.ts` after T034 and T038 (FR-003, FR-004)
- [X] T042 [US1] Implement `workspace provider prepare` and `workspace provider adopt` parsing, preview/apply digests, operation IDs, and stable JSON results in `tools/agent-workspace/src/cli/provider.ts` after T040-T041 (FR-005, FR-006)
- [X] T043 [P] [US1] Refactor offline/live `workspace doctor` output to report configuration, environment, auth, exact permission/capability results, target, process fingerprint, remotes, queue, policy visibility, and network independently in `tools/agent-workspace/src/cli/doctor.ts` after T033-T034 (FR-007, FR-029, FR-035)
- [X] T044 [US1] Wire Azure preparation/adoption/doctor routes into `tools/agent-workspace/src/cli/context.ts` and `tools/agent-workspace/src/cli/index.ts` after T042-T043 without remote inference or silent provider fallback (FR-001, FR-003, FR-027)
- [X] T045 [US1] Run `tools/agent-workspace/test/contract/azure-preparation.ts`, `tools/agent-workspace/test/unit/azure/adoption.test.ts`, and `tools/agent-workspace/test/blackbox/test_azure_prepare_adopt.ts`; confirm the independent US1 result and zero out-of-allowlist mutation

**Checkpoint**: User Story 1 is independently usable as the provider onboarding MVP.

---

## Phase 4: User Story 2 - Coordinate Two People and Their Agents Through Azure Boards (Priority: P1)

**Goal**: Store canonical Change Scope and claim/Run state in Azure Boards with one winner,
revision-safe transitions, immutable evidence, and recoverable pending publication.

**Independent Test**: Two fake identities in separate contexts contend for one Work Item; exactly one
wins and receives a sandbox, while both can inspect canonical owner/scope/evidence after local loss.

### Tests first

- [X] T046 [P] [US2] Extend managed-block tests for Coordination State and Change Scope canonical JSON, human-byte preservation, exact marker/schema validation, and corrupt/duplicate/mixed-version failure in `tools/agent-workspace/test/unit/azure/blocks.test.ts` (FR-010, FR-011)
- [X] T047 [P] [US2] Add Work Item tests for `/rev` as first patch op, managed-slice-only updates, human field/tag preservation, coarse state projection, relation decoding, and stale classification in `tools/agent-workspace/test/contract/azure-work-items.ts` (FR-010, FR-012, FR-013)
- [X] T048 [P] [US2] Extend shared claim tests to 100 concurrent acquires, exactly one winner/no loser sandbox, same-operation duplicates, keyed local serialization, renew/handoff/release/expiry/retry, and changed-precondition conflicts in `tools/agent-workspace/test/contract/claims.ts` (FR-013, FR-015, SC-003)
- [X] T049 [P] [US2] Add pending-publication crash tests before PATCH, after PATCH, after publisher lease, after comment POST, and before clear, asserting one receipt and no overtaking mutation in `tools/agent-workspace/test/contract/azure-publication.ts` (FR-014)
- [X] T050 [P] [US2] Add evidence tests for credential/header/URL/PAT/prompt/transcript/session/full-source redaction, attribution, provider revision, and immutable history in `tools/agent-workspace/test/unit/azure/evidence.test.ts` (FR-009, FR-024, FR-025, SC-009)
- [X] T051 [US2] Add a two-context Boards black-box journey for distinct Work Items, one-winner contention, owner/scope visibility, checkpoint, handoff, mapping enforcement, and discrepancy reporting in `tools/agent-workspace/test/blackbox/test_azure_boards_collaboration.ts` (FR-010 through FR-015, SC-002, SC-010)

### Implementation

- [X] T052 [US2] Extend `tools/agent-workspace/src/adapters/azure/blocks.ts` with Coordination State and Change Scope serializers/parsers without weakening the foundational Queue Manifest parser (FR-010, FR-011)
- [X] T053 [US2] Implement revisioned Work Item read/query, relation validation, `/rev`-guarded managed-slice updates, state projection, and per-Work-Item serialization in `tools/agent-workspace/src/adapters/azure/boards.ts` after T047 and T052 (FR-010, FR-012, FR-013)
- [X] T054 [US2] Implement immutable comment lookup/append, publisher lease, pending-publication reconciliation, exactly-once receipts, and append-only evidence reads in `tools/agent-workspace/src/adapters/azure/evidence.ts` after T049-T050 and T053 (FR-014, FR-024)
- [X] T055 [US2] Implement acquire, renew, checkpoint, handoff, release, expiry, retry, and outcome transitions over Boards state with stable operation identity and no loser authority in `tools/agent-workspace/src/adapters/azure/claims.ts` after T048 and T053-T054 (FR-013, FR-014, FR-015)
- [X] T056 [P] [US2] Extend evidence construction/redaction for provider revision, PR/policy/queue refs, blocker classification, and provider-governed retention in `tools/agent-workspace/src/domain/evidence.ts` and `tools/agent-workspace/src/domain/redaction.ts` after T050 (FR-024, FR-025, FR-026)
- [X] T057 [US2] Migrate claim/start/checkpoint/handoff/release/retry commands to expected revisions, operation journaling, pending-publication repair, and post-win sandbox creation in `tools/agent-workspace/src/cli/claim.ts`, `tools/agent-workspace/src/cli/start.ts`, `tools/agent-workspace/src/cli/checkpoint.ts`, `tools/agent-workspace/src/cli/handoff.ts`, `tools/agent-workspace/src/cli/release.ts`, and `tools/agent-workspace/src/cli/retry.ts` after T055 (FR-013 through FR-015)
- [X] T058 [US2] Make `workspace status` read canonical blocks/receipts first, expose owner/scope/checkpoint/handoff/blockers, and label local mirrors stale/missing in `tools/agent-workspace/src/cli/status.ts` after T054-T057 (FR-010, FR-017, FR-024)
- [X] T059 [US2] Wire Azure Boards Work Item, claim, and evidence adapters into `tools/agent-workspace/src/cli/context.ts` after T053-T058 while retaining GitHub compatibility (FR-027)
- [X] T060 [US2] Run the focused US2 unit/contract/black-box files under `tools/agent-workspace/test/` and confirm one canonical owner, one receipt per operation, and no loser sandbox

**Checkpoint**: User Story 2 is independently testable with two contexts and disposable local state.

---

## Phase 5: User Story 3 - Share One Durable Integration Queue Across Environments (Priority: P1)

**Goal**: Use one provider-canonical queue record with deterministic ordering, semantic decisions,
one integration lease, bounded retries, compaction, and provider-only recovery.

**Independent Test**: Two fake clones mutate one queue concurrently, lose all `.workspace/` state,
reconstruct the same active order/history, and process one eligible candidate at a time.

### Tests first

- [X] T061 [P] [US3] Add queue-domain tests for path versus semantic overlap, immutable sequences, lowest eligible selection, dependency decisions, lease expiry, and target/policy drift invalidation in `tools/agent-workspace/test/unit/queue.test.ts` (FR-018, FR-019, FR-020)
- [X] T062 [P] [US3] Extend canonical queue contracts with 100 paired stale races, duplicate operation/candidate handling, exact `MAX_STALE_REREADS = 4` / five-total-attempt enforcement, one lease, changed-precondition conflicts, and same-key local serialization in `tools/agent-workspace/test/contract/queue.ts` (FR-016, FR-018, SC-013)
- [X] T063 [P] [US3] Add provider-only recovery, pending-completion repair, and 10,000-completion compaction tests with one linked summary per candidate in `tools/agent-workspace/test/contract/azure-queue-recovery.ts` (FR-016, FR-017, SC-004, SC-015)
- [X] T064 [US3] Add a two-clone queue black-box journey for canonical refresh, lost cache, overlap decisions, one-at-a-time lease, latest target, and final-entry removal in `tools/agent-workspace/test/blackbox/test_azure_canonical_queue.ts` (FR-016 through FR-020)

### Implementation

- [X] T065 [US3] Refactor `tools/agent-workspace/src/domain/queue.ts` around canonical manifests, immutable sequence allocation, eligibility, semantic decision refs, integration leases, drift, and completion dispositions after T061 (FR-018, FR-019, FR-020)
- [X] T066 [US3] Implement queue-key discovery, exactly-one-record validation, revisioned enqueue/decision/lease/finalize operations, keyed serialization, exact `MAX_STALE_REREADS = 4` enforcement, and pending completion state in `tools/agent-workspace/src/adapters/azure/queue.ts` after T062-T063 and T065 (FR-016, FR-018)
- [X] T067 [US3] Implement provider-first queue/candidate/completion reconstruction and atomic disposable-index rebuild, with provider writes limited to reported pending-publication reconciliation, in `tools/agent-workspace/src/cli/recovery.ts` after T063 and T066 (FR-017)
- [X] T068 [P] [US3] Update ignored local mirrors to cache queue key, provider revision, and observation time atomically without overriding canonical records in `tools/agent-workspace/src/adapters/local/state-files.ts` after T065 (FR-017)
- [X] T069 [US3] Publish compact immutable queue completion summaries linked to candidate evidence through the existing outbox protocol in `tools/agent-workspace/src/adapters/azure/evidence.ts` and `tools/agent-workspace/src/adapters/azure/queue.ts` after T054 and T066 (FR-016, FR-024)
- [X] T070 [US3] Add queue sequence, decisions, lease, canonical freshness, and recovery details to `tools/agent-workspace/src/cli/status.ts` after T067-T069 without turning path overlap into a semantic block (FR-017, FR-019)
- [X] T071 [US3] Wire `workspace recover [work-item]` routing and stable repair reporting in `tools/agent-workspace/src/cli/index.ts` and `tools/agent-workspace/src/cli/output.ts` after T067 (FR-017, FR-035)
- [X] T072 [US3] Run the focused US3 unit/contract/black-box files under `tools/agent-workspace/test/` and confirm recovery succeeds with `.workspace/` deleted and the active manifest remains bounded

**Checkpoint**: User Story 3 is provider-canonical and recoverable without local cache.

---

## Phase 6: User Story 4 - Enforce Azure Repos Review and Policy Gates (Priority: P1)

**Goal**: Push checkpoint branches, create/read PRs, evaluate all effective Azure policy separately
from local verification, and integrate one candidate without target push or bypass.

**Independent Test**: A fake candidate passes only when exact local commands and every effective
provider requirement pass on the current commits; any stricter/pending/missing result stays visible
and blocked.

### Tests first

- [X] T073 [P] [US4] Add Azure Repos tests for ephemeral auth environment, source/target validation, idempotent PR lookup, structured refs, target drift, remote roles, and absence of direct-target/bypass operations in `tools/agent-workspace/test/unit/azure/repos.test.ts` (FR-004, FR-021)
- [X] T074 [P] [US4] Add Azure policy tests for target inventory, PR evaluations, status mapping, missing/unknown failure, zero effective policies with complete inventory, author self-review, and stricter-company precedence in `tools/agent-workspace/test/unit/azure/policies.test.ts` (FR-022, FR-023, SC-005)
- [X] T075 [P] [US4] Add Integration Coordinator contracts for queue lease, exact target, local verification, idempotent PR, provider policy, commit rechecks, no-bypass completion, post-merge verification, and finalization-before-next in `tools/agent-workspace/test/contract/integration.ts` (FR-020 through FR-023)
- [X] T076 [US4] Add a black-box matrix proving failed, pending, blocked, unexecuted, unavailable, stale, and stricter-provider outcomes remain visible while only a fully passing candidate completes in `tools/agent-workspace/test/blackbox/test_azure_repos_policy.ts` (FR-022, FR-023, SC-005)

### Implementation

- [X] T077 [US4] Complete checkpoint push, target-head read, idempotent PR create/read, Work Item association, expected-commit completion, and source/target guards in `tools/agent-workspace/src/adapters/azure/repos.ts` after T041 and T073 (FR-004, FR-021)
- [X] T078 [P] [US4] Implement target-specific Azure policy inventory, PR artifact evaluation decoding, completeness, strict aggregate outcomes, and diagnostic-only votes/statuses in `tools/agent-workspace/src/adapters/azure/policies.ts` after T074 (FR-022, FR-023)
- [X] T079 [US4] Implement the provider-neutral Integration Coordinator for ordered leases, target snapshots, separate local/provider gates, rechecks, completion, post-merge verification, and finalization in `tools/agent-workspace/src/domain/integration.ts` after T065-T069 and T075-T078 (FR-020, FR-022)
- [X] T080 [US4] Refactor `workspace integrate <work-item>` to call the coordinator, expose separate evidence, release/block invalid attempts, and offer no bypass/direct-target option in `tools/agent-workspace/src/cli/integrate.ts` after T079 (FR-020 through FR-023)
- [X] T081 [US4] Persist attributable checkpoint, PR, verification, policy, queue, target, integration, blocker, and next-action evidence before queue completion in `tools/agent-workspace/src/domain/evidence.ts` and `tools/agent-workspace/src/adapters/azure/evidence.ts` after T056, T069, and T079 (FR-024, FR-025)
- [X] T082 [US4] Add a defense-in-depth protected-target ref guard at local sandbox entry points in `tools/agent-workspace/src/adapters/local/runner.ts` after T073; do not concurrently edit `tools/agent-workspace/src/adapters/azure/repos.ts` (FR-021)
- [X] T083 [US4] Wire Azure source host, policy adapter, verification runner, and Integration Coordinator into `tools/agent-workspace/src/cli/context.ts` after T077-T082 (FR-022, FR-027)
- [X] T084 [US4] Run the focused US4 tests under `tools/agent-workspace/test/` and inspect generated Git/REST requests to confirm no direct-target push or policy bypass exists

**Checkpoint**: User Story 4 enforces provider policy and local verification as separate gates.

---

## Phase 7: User Story 5 - Prepare and Validate Before Azure Access Exists (Priority: P2)

**Goal**: Provide an optional Local Agent Runner profile, complete network-denied offline evidence,
and exact-allowlist live phases with crash-safe ledger recovery and closed cleanup.

**Independent Test**: Without Azure credentials/network, the complete offline pilot passes as
simulated evidence. Missing live gates return `not-run` before mutation. Crash injection converges
or blocks without touching pre-existing artifacts.

### Tests first

- [X] T085 [P] [US5] Add readiness tests for omitted/null `not-selected`, Node >=24, Git/worktrees, lockfile, Codex handoff, Linux Dev Container, WSL2, optional Azure CLI, and explicit native-Windows unsupported output in `tools/agent-workspace/test/unit/runtime-readiness.test.ts`; add clean-environment evidence-shape assertions in `tools/agent-workspace/test/baseline/runtime-baselines.test.ts` (FR-028, FR-029, SC-012)
- [X] T086 [P] [US5] Add the currently supported live-gate baseline tests for missing prerequisites, exact canonical target comparison, and phase-specific `not-run` in `tools/agent-workspace/test/live/live-gates.test.ts`; the full per-gate/provider-artifact/ForcePush matrix remains T125 (FR-032, FR-033, FR-034, SC-008)
- [X] T087 [P] [US5] Add the currently supported ledger tests for atomic write-ahead ordering, provider acceptance before acknowledgement, marker reconstruction, duplicate/ambiguous markers, path-safe run IDs, and provider revision observations in `tools/agent-workspace/test/unit/validation-ledger.test.ts`; the full cleanup/ForcePush drift matrix remains T125 (FR-034, SC-008)
- [X] T088 [P] [US5] Add repository/output/evidence secret-scan tests and non-secret marker/ledger assertions over adversarial fixtures in `tools/agent-workspace/test/unit/secret-scan.test.ts` (FR-009, FR-025, SC-009, SC-016)
- [X] T089 [US5] Add the network-denied two-identity offline pilot covering prepare, GitHub compatibility, Azure claims, handoff, recovery, semantic decisions, queue, verification, policy, integration, and simulated labels in `tools/agent-workspace/test/blackbox/test_azure_offline_pilot.ts` (FR-030, FR-031, FR-036, SC-007)

### Implementation

- [X] T090 [US5] Implement shared deterministic fake Azure state with revisions, comments, permissions, policies, PRs, marker discovery, fake tokens/Git, injected time/IDs, and production-network denial in `tools/agent-workspace/src/adapters/fakes/azure.ts` after T086-T089 (FR-030)
- [X] T091 [P] [US5] Implement shared `not-selected`/`local-agent-v1` capability inspection with identical Linux Dev Container/WSL2 requirements and native-Windows rejection in `tools/agent-workspace/src/adapters/local/runtime-readiness.ts` after T085 (FR-028, FR-029)
- [X] T092 [P] [US5] Add stable machine-readable Linux/WSL2 runtime inspection in `tools/agent-workspace/scripts/runtime-doctor.sh` after T085 (FR-028, FR-029)
- [X] T093 [P] [US5] Add the optional application-neutral Node 24 profile with no credential, Stack Profile, deployment tool, or Managed Runner in `.devcontainer/agent-workspace/devcontainer.json`, `.devcontainer/agent-workspace/Dockerfile`, and `.devcontainer/agent-workspace/.dockerignore` after T085 (FR-028, FR-036)
- [X] T094 [US5] Wire fake transport and network denial into `test:azure:offline` while keeping default Core/package verification Azure-free in `tools/agent-workspace/package.json` after T089-T090 (FR-030, FR-031, FR-036)
- [X] T095 [US5] Implement the live-ledger foundation with atomic write-ahead intents, deterministic provider markers, exact-target discovery, idempotent reconciliation, provider revision observations, handoff, and the supported cleanup allowlist in `tools/agent-workspace/src/validation/ledger.ts` after T087; full source-branch/ForcePush cleanup remains T124/T125 (FR-034)
- [X] T096 [US5] Implement the separately reported readiness, Boards foundation, read-only Repos/policy inventory, recovery-first gating, two-identity gating, and Work Item cleanup foundation in `tools/agent-workspace/test/live/live_azure.ts` after T086, T090, and T095; full PR/branch/queue cleanup remains T124/T125 (FR-032, FR-033, FR-034)
- [X] T097 [US5] Document supported environments, exact permission probes/live variables, Entra/PAT boundary, offline/live evidence, ledger recovery, cleanup allowlist, and provider retention in `docs/agents/azure-devops-platform-adapter.md` after T091-T096 (FR-026, FR-028 through FR-037)
- [X] T098 [US5] Run `test:azure:offline` and the no-credential `test:azure:live` path from `tools/agent-workspace/package.json`; retain separate implementation status and verification outcomes, record an actual offline PASS only when the scenario executes successfully, classify environment/tool-policy interruption as `blocked`, classify pre-execution missing runtime/access as `not-run`, and require the live path to remain structured `not-run` with zero provider mutation (FR-030, FR-031, FR-033, FR-036, SC-007, SC-008, SC-012)

**Checkpoint**: User Story 5's offline harness and live gates are implemented; supported-environment
execution remains explicitly tracked as `passed`, `blocked`, or `not-run` in T104, T105, and T114,
while company-access and cohort outcomes remain gated in T106-T109.

### Verification outcome ownership

The `[X]` marker records implementation or an attempted verification task; it is not a PASS result.
T098 owns the Phase 7 offline/no-credential harness execution and its independent outcomes. T103
owns the available verification matrix and per-command outcome capture. T113 owns executable
verification surfaces and convergence classification. T104, T105, and final-gate T114 own clean
supported-environment evidence. Every result must be one of `passed`, `blocked`, `not-run`, or
`failed`; only an executed successful check may be `passed`.

---

## Phase 8: Cross-Cutting Documentation and Verification

**Purpose**: Document the combined feature, record available verification outcomes, preserve
provider neutrality, and keep unsupported or unavailable environment evidence honest before
implementation handoff. Docker-backed Linux proof is recorded in T104; WSL2 parity and the
remaining clean/live handoff evidence remain gated by T105-T109 and T114.

- [X] T099 [P] Update the explicit GitHub default, omitted/null versus selected runtime, doctor, preparation, adoption, claims, recovery, status, integration, offline/live validation, and `--recover` usage in `tools/agent-workspace/README.md` (FR-001, FR-004, FR-017, FR-028, FR-032, FR-033)
- [X] T100 [P] Update the company-adoption boundary, administrator-owned settings, observed process fingerprint, policy precedence, and Azure-ready versus live-validated language in `docs/platform-adapters/azure.md` (FR-007, FR-012, FR-023, FR-026, FR-028, FR-035)
- [X] T101 [P] Update GitHub revision/policy/coordination-Issue queue compatibility, read-only `not-applicable` preparation, and remove the old stricter-approval mismatch behavior from `docs/agents/github-platform-adapter.md` (FR-013, FR-016, FR-022, FR-023, FR-027)
- [X] T102 Run the clean-checkout Core verifier at `scripts/verify-template` without Azure CLI, credentials, or optional-package installation and fix any provider-neutral regression (FR-001, FR-036, SC-012)
- [X] T103 Run `typecheck`, unit, provider-contract, `test:github:compatibility`, existing black-box, `test:azure:offline`, `test:baseline`, and secret-scan scripts declared in `tools/agent-workspace/package.json`; record each result independently as `passed`, `blocked`, `not-run`, or `failed`, never relabel a blocked/not-run result as PASS, and defer supported-environment validation to T104, T105, and T114 (FR-030 through FR-036, SC-007, SC-008, SC-012)
- [ ] T104 Run the complete clean-checkout matrix from T102-T103, including `npm run test:baseline`, inside the `.devcontainer/agent-workspace/devcontainer.json` profile built from `.devcontainer/agent-workspace/Dockerfile` with `.devcontainer/agent-workspace/.dockerignore`, and attach exact command/outcome evidence to Work Item #9; the 2026-08-18 Docker run is partial evidence from the current workspace with 5 black-box SKIP outcomes and live evidence `not-run`, so it cannot be called clean-checkout or offline-complete PASS (FR-028, FR-033, SC-012)
- [X] T105 Run the complete clean-checkout matrix from T102-T103, including `npm run test:baseline`, in WSL2 using `tools/agent-workspace/scripts/runtime-doctor.sh`; the 2026-08-19 isolated WSL2 checkout passed runtime doctor, typecheck, unit/contract, GitHub compatibility, black-box (32 passed/5 skipped/0 failed), Azure offline, baseline, runtime, secret scan, live gates, gated no-credential Azure live, and `scripts/verify-template`; exact Work Item #9 attachment remains an external handoff action, and native Windows cannot substitute (FR-028, FR-033, SC-012)
- [X] T106 Execute every implemented command in `specs/002-azure-devops-adapter/quickstart.md`, verify local links/paths, and confirm the no-credential live path returns structured `not-run` (SC-007, SC-008)
- [ ] T107 If exact company live configuration is available, run only the allowlisted readiness, Boards, Repos/policy, two-identity, recovery, and cleanup phases in `tools/agent-workspace/test/live/live_azure.ts`; record each phase independently, including exact-source-ref cleanup permission evidence; otherwise record every unavailable phase as `not-run` on Work Item #9 (SC-002, SC-008)
- [ ] T108 If company access is available, facilitate and time 10 first-time maintainers using `specs/002-azure-devops-adapter/quickstart.md`; attach individual redacted elapsed outcomes and the aggregate at-least-9-of-10 preparation result to Work Item #9, otherwise record SC-001 as `not-run` (SC-001)
- [ ] T109 If company access is available, facilitate and time 10 pilot reviewers using the prepared status/evidence view; attach individual redacted elapsed outcomes and the aggregate at-least-9-of-10 inspection result to Work Item #9, otherwise record SC-010 as `not-run` (SC-010)
- [X] T110 Inspect `.gitignore`, `agent-workspace.config.json`, `config/agent-workspace.azure.example.json`, `tools/agent-workspace/test/`, generated output, and the final diff for credentials, real tenant targets, Agent session material, stale terminology, and out-of-scope Azure infrastructure/Managed Runner/pipeline work before handoff (FR-009, FR-025, FR-036)

---

## Dependencies and Execution Order

### Phase dependencies

- **Phase 1** has no dependency.
- **Phase 2** depends on Phase 1 and blocks every user story. In particular, Queue Manifest parsing,
  process fingerprinting, exact permission probes, GitHub revisions, and GitHub policy mapping must
  exist before bootstrap.
- **US1 (Phase 3)** depends only on Phase 2 and is the onboarding MVP.
- **US2 (Phase 4)** depends only on Phase 2 for independent fake-provider testing; combined Azure
  usage normally follows US1 preparation.
- **US3 (Phase 5)** depends on Phase 2 and can test with fake candidate records; production
  end-to-end use additionally consumes US2 records/evidence.
- **US4 (Phase 6)** depends on US3 queue semantics and consumes US2 evidence; Azure Repos adoption
  from US1 must be complete for a real target.
- **US5 (Phase 7)** runtime/gate/ledger work may begin after Phase 2, but its complete offline/live
  pilots depend on US1-US4.
- **Phase 8** depends on every implemented story selected for handoff.
- **Phase 9** depends on Phase 8 and owns the provider-runtime, GitHub compatibility, and executable
  verification-surface convergence recorded by T111-T113.
- **Phase 10** depends on Phase 9 and records the Docker profile, smoke harness, reproducibility,
  and exact runtime-path convergence in T115-T119.
- **Phase 11** depends on Phase 10 and records the gated live foundation, secret scan, smoke
  assertions, and exact evidence paths in T120-T123.
- **Phase 12** depends on the Phase 11 live foundation; T124 and T125 remain separate implementation
  gates and do not infer live PASS from offline evidence.
- **Final convergence** is T114 after T104-T109 outcomes and T115-T126 are either complete or
  independently recorded. `blocked` and `not-run` never satisfy the PASS condition.

### Critical technical order

1. Tests T005-T017 fail for expected missing behavior.
2. Domain mutation/policy types T018-T019 precede ports T021.
3. GitHub migration T023-T026 precedes Azure selection in T035.
4. Azure models/transport/auth/Queue Manifest/process/permissions T027-T034 precede bootstrap T040.
5. Boards state/evidence T052-T055 precede queue completion evidence T069.
6. Queue T065-T069 precedes Integration Coordinator T079.
7. Ledger T095 precedes live harness T096.
8. Full verification T102-T110 runs only after focused story checkpoints pass; T108-T109 are
   separately live-gated measured pilots and remain `not-run` until company access exists.
9. Phase 9 T111-T113 precedes Phase 10 T115-T119; Phase 10 precedes Phase 11 T120-T123.
10. Phase 11 precedes the remaining live/offline convergence gates T124-T126.
11. Final-gate T114 runs only after the outcomes for T104-T109 and T115-T126 are recorded.

### Safe parallel opportunities for two people/Agents

- T002-T004 edit separate setup files.
- T005-T017 are separate test files and can be partitioned by provider.
- After T021, GitHub work T023-T026 can proceed alongside Azure read-only work T027-T034 when each
  Agent owns disjoint files.
- After Phase 2, US1 preparation and US2 test authoring can proceed concurrently; coordinate before
  either edits `tools/agent-workspace/src/cli/context.ts`.
- In US4, T077 and T078 are parallel, but T082 intentionally edits only `local/runner.ts`; no task
  is marked parallel while sharing `azure/repos.ts`.
- T091-T093 are parallel runtime-profile files; T095 remains separate validation-ledger ownership.

## Implementation Strategy

### MVP first

1. Complete Phase 1 and Phase 2.
2. Complete US1 and run T045.
3. Stop and review provider preparation/adoption behavior before beginning live Azure mutation.

### Incremental delivery

1. Foundation: provider-neutral + GitHub compatibility + Azure read-only primitives.
2. US1: safe provider onboarding.
3. US2: canonical claims/runs/evidence.
4. US3: canonical queue/recovery.
5. US4: PR/policy integration.
6. US5: offline/runtime/live validation.
7. Cross-cutting baselines and handoff.

## Notes

- `[P]` never authorizes concurrent edits to the same file.
- Reuse stable operation IDs when retrying the same mutation; never turn a retry into a new command.
- A GitHub proposal comment is not authority until reconciliation selects it.
- GitHub's coordination-Issue queue and `not-applicable` preparation implementation are required
  compatibility surfaces, not optional Azure-only behavior.
- `minimum_human_approvals: 0` adds no template approval gate and never weakens provider policy.
- Bootstrap configuration cannot widen its queue-only mutation allowlist.
- Readiness uses no write probe and permission failure never triggers credential fallback; validation
  branch deletion requires a separate exact-source-ref `ForcePush` probe.
- A missing Azure account or second identity is a valid `not-run` result, never PASS.
- No task expands Azure infrastructure, Managed Runner, application pipeline, deployment, process
  mutation, policy bypass, protected-target push, or credential persistence.

---

## Phase 9: Convergence

- [X] T111 Complete the provider-selected CLI context migration in `tools/agent-workspace/src/cli/context.ts`, `tools/agent-workspace/src/cli/provider-runtime.ts`, and the lifecycle commands: load the explicit provider configuration, construct provider-neutral GitHub and Azure ports, resolve GitHub identity lazily, use the configured remote only, remove provider-selected command dependence on `Legacy*` ports, and preserve provider-neutral structured errors without remote-derived fallback (closes the observed gap in T035, T044, T059, and T083; FR-001, FR-002, FR-027, FR-035)
- [X] T112 Add a CLI-context contract/black-box test that exercises explicit GitHub and Azure provider selection, omitted/null runtime behavior, a GitHub remote with Azure selected, and an Azure-configured workspace without a GitHub remote; assert that provider selection comes only from configuration and that no `gh` or provider mutation is attempted during context construction (FR-001, FR-002, FR-027, FR-032)
- [X] T113 Make every verification script declared in `tools/agent-workspace/package.json` executable and independently classified: create or wire the baseline, Azure offline pilot, and Azure live harness surfaces; ensure the no-credential live path returns structured `not-run` without provider mutation; run the available matrix, retain exact `passed`/`blocked`/`not-run`/`failed` outcomes, and defer clean supported-environment PASS evidence to T104, T105, and final-gate T114 (closes the observed execution gap across T001, T085, T089, T096, T098, and T103; FR-030 through FR-036, SC-008, SC-012)

T114 retains its historical ID for existing handoff references and is executed as the final
convergence gate after T115-T126; it is listed in Phase 13 below to keep delivery order honest.

## Handoff notes (2026-08-18)

- The provider-neutral Azure adapter, offline fake transport, bootstrap/readiness, Boards claims/evidence,
  canonical queue/recovery, Azure Repos/policy seams, runtime readiness, validation ledger, provider-first
  Azure CLI lifecycle, explicit provider selection, documentation, and verification matrix are implemented
  and locally verified.
- T104 remains partial: the Docker-backed Linux Dev Container profile has been built and exercised,
  but the current workspace run is not a separate clean checkout and has no external Work Item #9
  evidence attachment. The profile uses a pinned Node 24 base plus a dated Debian snapshot with
  versioned local-runner packages, runs as the non-root `node` user, and sets the Git safe-directory
  in `postCreateCommand`; it does not install Azure CLI, GitHub CLI, credentials, or provider services.
- T105 remains gated `not-run` until a separate WSL2 clean-checkout run is available. T106 remains open
  because the full quickstart/link audit has not been independently completed. T107-T109 remain
  `not-run` until the company Azure target, approved identities, and measured company cohorts exist.
  No live Azure mutation is claimed.
- T106's Docker partial evidence includes the runtime doctor (`Linux`, Node 24+, Git repository, and
  lockfile all detected), provider-neutral CLI execution, and the no-credential live path. The doctor
  reports Git and Node as available, while GitHub CLI/auth/protection are capability-blocked because
  `gh` is not installed; Azure account and mutation commands remain `not-run` until the configured
  company target exists.
- T111 is implemented: provider-selected lifecycle commands use provider-neutral ports for both Azure
  DevOps and GitHub; the original GitHub/Azure legacy fields remain only as a compatibility shell for
  generated projects or tests that construct a context without provider ports. GitHub identity is lazy,
  and the configured remote is the only remote used for provider discovery.
- Verification rerun on 2026-08-18 inside the Docker-backed Dev Container: `npm ci --ignore-scripts`
  passed with 0 vulnerabilities; `typecheck` passed; unit/contract passed 276/276; GitHub compatibility
  passed 24/24; the complete black-box command passed 32, skipped 5, and failed 0; Azure offline passed
  1/1; baseline passed 1/1; runtime passed 4/4; secret scan 3/3; live gates 2/2; no-credential Azure
  live passed as a harness test while its provider evidence remained structured `not-run`; and
  `verify-template` passed. The five black-box skips are availability/auth scenarios, not assertion
  failures. The earlier native-Windows `spawn EPERM` result remains classified as host environment
  evidence and is not used as Docker PASS evidence.
- T114 remains open until the staged migration and the separately gated WSL2/live/clean-environment
  evidence are handed off; this does not weaken the offline adapter or live-gate safety boundary.

---

## Phase 10: Convergence

- [X] T115 Reclassify T104 unless a separate clean-checkout Docker run and redacted Work Item #9 evidence are available; record the Docker-backed result from `.devcontainer/agent-workspace/devcontainer.json`, `.devcontainer/agent-workspace/Dockerfile`, `.devcontainer/agent-workspace/.dockerignore`, and `tests/devcontainer-smoke.test.sh` independently from SKIP, `not-run`, and live-gated outcomes, and do not call the feature offline-complete until the clean Linux/WSL2 criteria are satisfied (FR-028, SC-012; partial)
- [X] T116 Extend `tests/devcontainer-smoke.test.sh` and its generated-project coverage to exercise `.devcontainer/agent-workspace/devcontainer.json` in addition to the Core profile; assert the pinned runtime, `tools/agent-workspace/scripts/runtime-doctor.sh`, package installation, and Core verifier without requiring Azure or GitHub credentials (FR-028, FR-029, SC-012; partial)
- [X] T117 Make `.devcontainer/agent-workspace/Dockerfile` reproducible beyond its base-image digest by pinning or snapshotting the Debian package source and installed tool versions, retain `.devcontainer/agent-workspace/.dockerignore` as the minimal build context, and document the reproducibility boundary in `specs/002-azure-devops-adapter/quickstart.md` (FR-028, FR-036; partial)
- [X] T118 Remove the unused `AGENT_WORKSPACE_RUNTIME` container environment setting from `.devcontainer/agent-workspace/devcontainer.json`, or replace it with a documented non-authoritative hint while keeping `runtimeProfile` in `agent-workspace.config.json` as the only runtime selection source (FR-028, FR-029; partial)
- [X] T119 Update the runtime-profile task and plan traceability to name `.devcontainer/agent-workspace/devcontainer.json`, `.devcontainer/agent-workspace/Dockerfile`, and `.devcontainer/agent-workspace/.dockerignore` at their exact repository paths, then record the resulting Docker evidence in the Phase 10 handoff notes (FR-028, FR-029, SC-012; partial)

## Phase 10 handoff notes (2026-08-18)

- T115 is complete: T104 is now visibly partial/gated rather than falsely complete. The Docker-backed
  run is retained as evidence, but its current-workspace mount, five black-box skips, live `not-run`
  evidence, and missing Work Item #9 attachment are not relabeled as clean-checkout PASS.
- T116 is implemented: the smoke harness accepts `DEVCONTAINER_CONFIG`, forwards the selected profile,
  runs the Core verifier, runtime doctor, and package installation for the Agent Workspace profile, and
  the generated-project smoke preserves and invokes that profile after a committed archive is made.
  The shell self-tests pass; the full host-driven generated smoke is `not-run` on this workstation
  because a host Bash/WSL2 executable is unavailable. Equivalent direct `devcontainer up/exec` checks
  passed in Docker without Azure or GitHub credentials.
- T117 is complete: the Dockerfile uses the pinned base digest, Debian snapshot
  `20260803T000000Z`, and version-pinned bash, ca-certificates, and Git packages. The image rebuilt
  successfully and the post-create hook completed as `node`.
- T118 and T119 are complete: runtime selection remains config-driven, the unused container variable
  was removed, and all three Agent Workspace container paths are now named in the task/plan traceability.
- T105-T109 and T114 remain open for separate WSL2 evidence, company Azure access, measured cohorts,
  and final convergence. No live Azure mutation or credential-bearing evidence is claimed.

## Phase 11: Convergence

- [X] T120 [US5] Replace the hard-coded live-phase placeholder in `tools/agent-workspace/test/live/live_azure.ts` with a gated, provider-neutral live-runner foundation that validates the actual runtime, constructs approved Azure transport/adapters only after the exact target/identity/permission/capability/network/policy gates pass, records Boards marker/revision evidence, performs recovery-first ledger handling, and keeps unsupported provider-artifact phases `not-run`; never emit credentials or mutate Azure before the gate (FR-028, FR-032, FR-033, FR-034, SC-008; foundation complete, full PR/branch/queue pilot remains T124)
- [X] T121 [P] [US5] Extend the tracked secret scan in `scripts/verify-template` and `tests/verify-template.test.sh` to detect literal assignments in `tools/agent-workspace/src/config/*.ts` while ignoring TypeScript type annotations (FR-009, FR-037, SC-016)
- [X] T122 [P] [US5] Make the Agent Workspace smoke harness in `tests/devcontainer-smoke.test.sh` assert the runtime-doctor contract fields for Linux, Dev Container, Node 24+, Git repository, and lockfile in addition to the exit status (FR-028, FR-029, SC-012)
- [X] T123 [P] [US5] Add exact repository paths to the remaining convergence and validation task descriptions in `specs/002-azure-devops-adapter/tasks.md`, including the live harness, verifier, smoke/profile files, and evidence handoff paths, without creating duplicate implementation tasks for T104-T114 (SC-012)

## Phase 11 handoff notes

- T120 is implemented at `tools/agent-workspace/test/live/live_azure.ts`: it validates the
  non-secret config and exact resolved target read-only, selects an approved ephemeral credential,
  constructs the Azure adapters only after the gate, writes ledger intents before the validation Work
  Item mutation, records marker/revision evidence, supports marker-only recovery, and closes only the
  run-owned Work Item when its revision/state preconditions hold. The current no-access run remains
  `not-run`; no Azure PASS is claimed.
- T121 is implemented at `scripts/verify-template` with a red/green regression in
  `tests/verify-template.test.sh`; TypeScript source assignments in `tools/agent-workspace/src/config/`
  are scanned across one-line, multiline, and object-property forms while type annotations remain safe.
- T122 is implemented at `tests/devcontainer-smoke.test.sh`; the selected Agent Workspace profile
  must emit Linux, Dev Container, Node 24+, Git repository, and lockfile markers in addition to an
  exit code of zero. T123 names the exact paths for these checks and the evidence handoff.
- T120 now verifies actual runtime readiness rather than trusting an environment flag, requires
  non-empty read-only capability evidence and readable policy visibility, rejects stale Work Item
  revisions, absorbs duplicate claims, and performs recovery before any new mutation. The no-access
  live path remains `not-run`.

## Phase 12: Remaining Live Pilot Convergence

- [ ] T124 [US5] Complete the approved live pilot beyond the Boards foundation: create or adopt only a run-marked validation source branch, exercise Azure Repos pull-request creation/read/policy evaluation with exact head evidence, publish/remove the canonical queue entry, and implement the full cleanup allowlist (queue removal, Work Item close, PR abandon, source-branch delete only after exact-source-ref `ForcePush` plus head/marker rechecks) in `tools/agent-workspace/test/live/live_azure.ts`, `tools/agent-workspace/src/adapters/azure/repos.ts`, `tools/agent-workspace/src/adapters/azure/policies.ts`, `tools/agent-workspace/src/adapters/azure/queue.ts`, and `tools/agent-workspace/src/validation/ledger.ts`; keep each unavailable operation `not-run` until the approved target exists (FR-022, FR-034, SC-008)
- [X] T125 [P] [US5] Add offline contract coverage for recovery-first execution, lost-ledger marker reconstruction, non-empty capability probes, policy-visibility fail-closed behavior, stale Work Item rejection, duplicate claim receipts, and cleanup ownership drift in `tools/agent-workspace/test/live/live-gates.test.ts`, `tools/agent-workspace/test/unit/validation-ledger.test.ts`, and `tools/agent-workspace/test/blackbox/test_azure_offline_pilot.ts` (FR-030, FR-031, FR-033, FR-034, SC-007, SC-008)

## Phase 12 handoff notes (2026-08-19)

- T125 is implemented and verified: the offline contract suite now asserts recovery before retry,
  marker-based reconstruction after local ledger loss, non-empty passing capability reads,
  fail-closed policy visibility, stale Work Item rejection, durable duplicate claim receipts after
  a fresh store, and cleanup ownership drift. Targeted live-gate/ledger tests pass 10/10 and the
  Azure offline pilot passes without production network access.
- T106 is complete as a classified quickstart audit. Local links and referenced paths all resolve;
  Dev Container `up`/`exec`, runtime doctor, `npm ci`, typecheck, unit/contract, GitHub compatibility,
  black-box, Azure offline, baseline, runtime, secret-scan, live-gates, Core verifier, no-credential
  live, and recovery-mode live commands were executed. The no-credential live and recovery paths
  returned structured `not-run`. Credential/login, provider apply/adopt, lifecycle mutations, and
  company-pilot commands remain deliberately `not-run` because no approved Azure target or Work Item
  was supplied. Default GitHub `doctor` encountered a provider 403/quota blocker and is recorded as
  `blocked`, not PASS; GitHub adoption preview is not-applicable under the default provider.
- T105 is now locally verified in an isolated WSL2 checkout. Ubuntu-24.04 has Node 24.16.0
  installed under `/usr/local/lib/node-v24.16.0` with `/usr/local/bin/node` and npm symlinks;
  `runtime-doctor.sh` reports `platform: Linux`, `wsl2: true`, `nodeMajor: 24`,
  `node24OrNewer: true`, `gitRepository: true`, and `lockfile: true`. The complete matrix passed:
  typecheck; unit/contract 276/276; GitHub compatibility 24/24; black-box 32 passed, 5 skipped,
  0 failed (GitHub-auth scenarios only); Azure offline 1/1; baseline 1/1; runtime 4/4; secret
  scan 3/3; live gates 2/2; gated no-credential Azure live 1/1 with provider phases `not-run`;
  and `scripts/verify-template` (`Core Workspace contract verified`). The skipped and `not-run`
  outcomes remain classified honestly, and Work Item #9 attachment is still an external handoff
  action. The runtime detector also now honors an explicitly simulated platform, preventing WSL
  environment variables from making a native-Windows test report `blocked` instead of `unsupported`.

## Phase 13: Final Convergence Handoff

**Purpose**: Run the final clean-environment and evidence handoff only after all convergence additions
and gated outcomes are independently recorded.

- [ ] T114 Re-run convergence only after the implementation under `tools/agent-workspace/src/`, verification under `tools/agent-workspace/test/`, Core checks at `scripts/verify-template`, runtime checks under `.devcontainer/agent-workspace/`, and evidence in `specs/002-azure-devops-adapter/quickstart.md` are either implemented or explicitly recorded with independent outcomes; verify the provider-neutral Core path, GitHub compatibility, offline Azure simulation, baseline evidence, and separately gated live phases from a clean environment before handoff to Work Item #9; `blocked` and `not-run` are not PASS (SC-007, SC-008, SC-012)

## Phase 14: Convergence

- [X] T126 [US4] Close the remaining T124 live-pilot gap by extending the provider-neutral source-host/ledger seams and the gated `tools/agent-workspace/test/live/live_azure.ts` flow to create/read/evaluate/complete a run-marked Azure Repos pull request against an exact target head, publish/remove its canonical queue entry, record every provider artifact before mutation, recover after local-ledger loss, and clean up only owned Work Item/queue/PR/source-branch artifacts after marker, revision/head, and exact-source-ref `ForcePush` rechecks; keep each phase `not-run` without the approved target and identities (FR-021, FR-022, FR-034, SC-008; implementation complete, live execution remains gated)

## Phase 14 handoff notes (2026-08-19)

- T126 is implemented in `tools/agent-workspace/src/validation/live-pilot.ts`,
  `tools/agent-workspace/src/adapters/azure/repos.ts`, and the gated
  `tools/agent-workspace/test/live/live_azure.ts`. The offline Azure pilot now creates and
  reads a marker-bearing PR, evaluates its exact source head, completes it only after a
  passing policy snapshot, finalizes the canonical queue entry, and conditionally deletes
  only the run-owned source branch after an exact-source-ref ForcePush/read recheck.
- The live runner reconstructs Work Item, source-branch, PR, and active queue markers after
  local ledger loss; ambiguity or revision/head drift remains a manual-recovery blocker.
- Verification: `npm run typecheck`, the focused 278-test unit/contract invocation, and
  `npm run test:azure:offline` pass. `npm run test:azure:live` returns structured `not-run`
  with no Azure configuration, identity, target, or credential; no live Azure PASS is claimed.

## Phase 15: Convergence

- [X] T127 [US4] CRITICAL: Make live-pilot Run Evidence truthful, lifecycle-valid, and provider-recoverable in `tools/agent-workspace/src/validation/live-pilot.ts`, `tools/agent-workspace/src/domain/types.ts`, `tools/agent-workspace/src/domain/redaction.ts`, `tools/agent-workspace/src/adapters/azure/evidence.ts`, and `tools/agent-workspace/test/live/live_azure.ts`: use a real Agent Checkpoint identity instead of a commit SHA, record only valid Run transitions, never report canonical queue PASS before successful finalization, reconcile interrupted evidence publication from deterministic provider records, require provider acceptance before marking retained evidence cleaned, and make integrated/rejected queue summaries resolve to the candidate Work Item's durable evidence (Constitution III; FR-014, FR-016 through FR-018, FR-024, FR-034, SC-008, SC-015; contradicts)
- [X] T128 [US4] CRITICAL: Harden Azure Repos pull-request identity, completion, and cleanup in `tools/agent-workspace/src/adapters/azure/repos.ts`, `tools/agent-workspace/src/adapters/azure/models.ts`, and `tools/agent-workspace/src/validation/live-pilot.ts`: match an existing PR by Repository + source ref + target ref + candidate Work Item, bind the completion mutation to both evaluated source and target commits, verify the completed PR and observed post-merge target before publishing integration, and block abandonment when the current PR source commit differs from the ledger-accepted head; add focused fake-transport regressions for every guard (US4/AC1; FR-020 through FR-022, FR-034; plan: Integration Coordinator sequence; partial)
- [X] T129 [US5] Correct Validation Ledger precondition/result semantics and Work Item cleanup journaling in `tools/agent-workspace/src/validation/ledger.ts` and `tools/agent-workspace/test/live/live_azure.ts`: retain `expectedRevisionOrHead` as the pre-mutation CAS input, compare recovered provider state only with the accepted `observedRevisionOrHead`, let exact deterministic markers reconcile an accepted revision-changing mutation without false drift, and record/accept/acknowledge a dedicated write-ahead intent around run-owned Work Item closure (FR-017, FR-034, SC-008, SC-013; partial)
- [X] T130 [P] [US4] [US5] Extend `tools/agent-workspace/test/unit/validation-ledger.test.ts`, `tools/agent-workspace/test/unit/azure/repos.test.ts`, `tools/agent-workspace/test/unit/live-pilot.test.ts`, `tools/agent-workspace/test/blackbox/test_azure_offline_pilot.ts`, and the network-denied fake Azure transport with crash/race injection immediately before provider contact, after acceptance but before acknowledgement, around evidence publication and queue finalization, between PR head reads and completion, after merge before target verification, and around Work Item close; assert idempotent convergence or an explicit ownership/revision blocker, preserve exact evidence links, and keep every no-access live phase `not-run` (SC-008, SC-013, SC-015; plan: validation sequence; missing)

## Phase 15 handoff notes (2026-08-20)

- T127 now publishes a real deterministic Agent Checkpoint, validates every recorded lifecycle
  transition, separates pre-finalization evidence from queue-finalized PASS evidence, and recovers
  immutable evidence comments by exact provider marker and comment version. Cleanup requires the
  retained checkpoint/evidence to be provider-visible, and queue completion links to the exact
  candidate Work Item's provider-accepted evidence comment.
- T128 now keys pull-request idempotency by Repository + source + target + candidate Work Item,
  sends both source and target commit CAS values to Azure completion, re-reads the completed PR and
  post-merge target before integration evidence, and refuses PR abandonment after source-head drift.
- T129 preserves the write-ahead CAS precondition separately from the observed provider result.
  Recovery accepts revision-changing mutations only through exact provider markers and a journaled
  CAS chain. Work Item closure now writes its stable operation marker atomically with the state
  change, so a post-acceptance crash can be recovered without a duplicate close mutation.
- T130 covers pre-contact network denial, provider acceptance before local acknowledgement,
  evidence outbox/publication crashes, queue-finalization races, source/target races around PR
  completion, post-merge target drift, Work Item close recovery, exact evidence links, and lost
  local evidence-ledger reconstruction.
- Verification: `npm run typecheck`; unit/contract 298/298; black-box 35 passed, 4 intentionally
  skipped, 0 failed; GitHub compatibility 24/24; Azure offline 3/3; baseline 1/1; runtime 4/4;
  secret scan 3/3; live gates 3/3; and `scripts/verify-template` all pass. Both normal and recovery
  Azure live commands return structured `not-run` for every provider phase without approved Azure
  configuration, identity, target, permissions, network, policy visibility, or credentials; no live
  Azure PASS is claimed.
