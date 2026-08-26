---

description: "Task list for Shared Agent Workspace feature implementation"

---

# Tasks: Shared Agent Workspace

**Input**: Design documents from `/specs/001-shared-agent-workspace/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Spec.md mandates an Independent Test per user story and quickstart.md defines validation scenarios; test tasks are therefore included and must be written first (fail) before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Package root: `tools/agent-workspace/` (independently installable; per plan.md)
- Source: `tools/agent-workspace/src/` | Tests: `tools/agent-workspace/test/`
- Runtime: Node.js 24 LTS + TypeScript erasable syntax + `node:test`; no runtime dependencies (per research.md §1)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic package structure

- [x] T001 Create `tools/agent-workspace/` package skeleton: `package.json` (bin `workspace`, engines node >=24, scripts test/typecheck), `package-lock.json`, `README.md`, `.gitignore`
- [x] T002 [P] Configure `tools/agent-workspace/tsconfig.json` with module nodenext, erasableSyntaxOnly, allowImportingTsExtensions, rewriteRelativeImportExtensions, verbatimModuleSyntax, strict (per research.md §1)
- [x] T003 [P] Scaffold test harness: `tools/agent-workspace/test/unit/`, `test/contract/`, `test/blackbox/` directories and npm scripts (`npm test`, `npm run typecheck`, `npm run test:blackbox`)
- [x] T004 [P] Create placeholder `tools/agent-workspace/Dockerfile` (optional container image definition, unused in V1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain and adapter infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create shared domain types in `tools/agent-workspace/src/domain/types.ts` per `contracts/adapters.md` (WorkItem, ClaimRecord, RunContext, AgentCheckpoint, VerificationResult, RunEvidence, ChangeScope, RunState, CheckOutcome, BlockerClassification)
- [x] T006 [P] Implement classified errors in `tools/agent-workspace/src/errors.ts` per `contracts/cli.md` (errorCode + classification: capability/credential/quota/network/conflict/usage; exit codes 0/1/2)
- [x] T007 [P] Implement evidence redaction rules in `tools/agent-workspace/src/domain/redaction.ts` per FR-015 (strip credentials, prompts, transcripts, full source snapshots)
- [x] T008 Implement run lifecycle state machine in `tools/agent-workspace/src/domain/lifecycle.ts` per `data-model.md` (requested -> claimed -> preparing -> running -> verifying -> ready-for-integration -> integrated|failed|cancelled|expired) with idempotent transitions
- [x] T009 Implement deterministic claim reconciliation in `tools/agent-workspace/src/domain/claims.ts` per research.md §2 (first valid unexpired record wins; acquire/renew/release/expire; conflict on duplicate)
- [x] T010 [P] Implement state-file reader/writer in `tools/agent-workspace/src/adapters/local/state-files.ts` per `contracts/state-files.md` (run context, claim mirror, checkpoint, evidence mirror; atomic temp-file replace; serialized writes)
- [x] T011 [P] Create fake adapters in `tools/agent-workspace/src/adapters/fakes/` (in-memory WorkItemAdapter, ClaimStore, RunnerAdapter, SourceHostAdapter, IntegrationQueue, EvidenceStore) for unit/contract tests
- [x] T012 Create contract test suite in `tools/agent-workspace/test/contract/` running the same behavior suite against every adapter (fakes first, then GitHub + local)
- [x] T013 [P] Implement gh CLI wrapper in `tools/agent-workspace/src/adapters/github/gh.ts` per research.md §2 (spawn gh, serialize content-creating writes with >=1s spacing, classify 403/429 as quota failures)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Claim and start isolated Agent work (Priority: P1) MVP

**Goal**: Claim a Work Item and start Agent work in an isolated sandbox with an attributable run context and descriptive branch.

**Independent Test**: Two people claim different Work Items and start; each receives a distinct sandbox, branch, and run context; a second claim on the same Work Item is rejected with an actionable conflict and no second sandbox.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US1] Contract test for ClaimStore acquire/renew/conflict behavior in `tools/agent-workspace/test/contract/claims.ts`
- [x] T015 [P] [US1] Black-box test for two-person claim+start scenario in `tools/agent-workspace/test/blackbox/test_claim_start.ts` (spawns CLI against a temporary repository)

### Implementation for User Story 1

- [x] T016 [US1] Implement WorkItemAdapter in `tools/agent-workspace/src/adapters/github/work-items.ts` (read Work Item, dependencies, Change Scope via gh)
- [x] T017 [US1] Implement ClaimStore GitHub adapter in `tools/agent-workspace/src/adapters/github/claims.ts` (append-only records, oldest-valid-wins, release/expire)
- [x] T018 [US1] Implement RunnerAdapter in `tools/agent-workspace/src/adapters/local/runner.ts` (git worktree add `.worktrees/<run-id>` -b `feature/<work-item-slug>`, serialized git ops, worktree remove/prune, no shared mutable checkout)
- [x] T019 [US1] Implement AgentDriver in `tools/agent-workspace/src/adapters/local/codex-driver.ts` (prints the folder to open in Codex Desktop; never scrapes or injects per research.md §6)
- [x] T020 [US1] Implement `workspace claim` command in `tools/agent-workspace/src/cli/claim.ts` (--lease option, conflict errors, JSON output per `contracts/cli.md`)
- [x] T021 [US1] Implement `workspace start` command in `tools/agent-workspace/src/cli/start.ts` (requires active claim, creates run context file, prints worktree path and owner)
- [x] T022 [US1] Implement `workspace doctor` command in `tools/agent-workspace/src/cli/doctor.ts` (checks git/gh/node/auth/remote/protection; classified diagnostics per FR-019, no silent fallback)
- [x] T023 [US1] Implement CLI dispatch in `tools/agent-workspace/src/cli/index.ts` (command routing, --json flag, exit codes 0/1/2)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (quickstart.md Scenario 1)

---

## Phase 4: User Story 2 - Transfer control and recover Agent work (Priority: P1)

**Goal**: Create durable checkpoints, hand control to another person, release claims, and retry runs with linkage, without sharing credentials or relying on uncommitted files.

**Independent Test**: An owner checkpoints an active run, transfers ownership, and the new owner resumes from the checkpoint; a retry starts a new linked run while the earlier evidence remains inspectable; non-owner control instructions are rejected.

### Tests for User Story 2

- [x] T024 [P] [US2] Black-box test for checkpoint recovery after sandbox loss and retry linkage in `tools/agent-workspace/test/blackbox/test_checkpoint_recovery.ts` (quickstart.md Scenario 3; assert recovery completes within 300s per SC-003)
- [x] T025 [P] [US2] Black-box test for handoff control transfer and non-owner rejection in `tools/agent-workspace/test/blackbox/test_handoff.ts` (quickstart.md Scenario 4)

### Implementation for User Story 2

- [x] T026 [US2] Implement checkpoint logic in `tools/agent-workspace/src/domain/checkpoint.ts` (validate state, capture verification evidence + unresolved work + next action, requires pushed branch per FR-007)
- [x] T027 [US2] Implement handoff logic in `tools/agent-workspace/src/domain/handoff.ts` (record previous owner, replacement owner, checkpoint, unresolved risks, next action; enforce single-owner control per FR-005/006)
- [x] T028 [US2] Implement `workspace checkpoint` command in `tools/agent-workspace/src/cli/checkpoint.ts` (idempotent; classified failure when state not recoverable; renews the claim lease as heartbeat per FR-004, research.md §2)
- [x] T029 [US2] Implement `workspace handoff` command in `tools/agent-workspace/src/cli/handoff.ts` (--to <identity>)
- [x] T030 [US2] Implement `workspace release` command in `tools/agent-workspace/src/cli/release.ts` (release claim; preserve run, branch, and evidence per FR-004)
- [x] T031 [US2] Implement retry linkage in `tools/agent-workspace/src/domain/lifecycle.ts` (new run linked to earlier attempt; never reactivate or overwrite earlier run per FR-008)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (quickstart.md Scenarios 2, 3, 4)

---

## Phase 5: User Story 3 - Integrate overlapping Agent changes safely (Priority: P1)

**Goal**: Make overlap, dependencies, and verification evidence visible; serialize candidate incorporation with rerun verification; never auto-resolve semantic conflicts.

**Independent Test**: Path overlap produces a warning, semantic overlap blocks until an explicit dependency or decision, candidates incorporate one at a time against the latest target with verification rerun, and semantic conflicts require a responsible Work Item or human decision.

### Tests for User Story 3

- [x] T032 [P] [US3] Contract test for IntegrationQueue in `tools/agent-workspace/test/contract/queue.ts` (dependency order, one-at-a-time, verification rerun per FR-011)
- [x] T033 [P] [US3] Black-box test for overlap warning + semantic block + conflict decision in `tools/agent-workspace/test/blackbox/test_integration.ts` (quickstart.md Scenario 5)

### Implementation for User Story 3

- [x] T034 [US3] Implement overlap classification in `tools/agent-workspace/src/domain/overlap.ts` (path overlap vs semantic seam overlap per FR-010)
- [x] T035 [US3] Implement integration queue in `tools/agent-workspace/src/domain/queue.ts` (dependency-ordered; incorporate one at a time against latest target; require verification after each incorporation)
- [x] T036 [US3] Implement SourceHostAdapter in `tools/agent-workspace/src/adapters/github/source-host.ts` (create branch, push checkpoint, open PR via gh; required checks via REST; read protection policy and assert `required_approving_review_count: 0` with checks enforced per FR-022; never push directly to protected integration target per FR-020)
- [x] T037 [US3] Implement `workspace integrate` command in `tools/agent-workspace/src/cli/integrate.ts` (queue position, state, verification output per `contracts/cli.md`)
- [x] T038 [US3] Implement semantic conflict handling in `tools/agent-workspace/src/domain/queue.ts` (require responsible Work Item or human decision; never select one side automatically per FR-012)

**Checkpoint**: At this point, User Stories 1-3 should all be independently functional (quickstart.md Scenario 5)

---

## Phase 6: User Story 4 - Inspect trustworthy run state and evidence (Priority: P2)

**Goal**: Inspect run state, ownership, checkpoints, verification outcomes, and integration results without access to the original sandbox; blocked/unexecuted checks are never shown as passed; sensitive data is redacted.

**Independent Test**: A reviewer inspects completed, failed, blocked, and retried runs and can distinguish owners, transitions, checkpoints, verification outcomes, and integration results; evidence contains no credentials, prompts, transcripts, or source snapshots.

### Tests for User Story 4

- [x] T039 [P] [US4] Black-box test for status inspection + blocked/unexecuted-not-passed + redaction in `tools/agent-workspace/test/blackbox/test_status_evidence.ts` (quickstart.md Scenario 6)

### Implementation for User Story 4

- [x] T040 [US4] Implement EvidenceStore in `tools/agent-workspace/src/adapters/github/evidence.ts` (append attributable evidence records; redact before persist per FR-015)
- [x] T041 [US4] Implement run evidence recording in `tools/agent-workspace/src/domain/evidence.ts` (state transitions, timestamps, checkpoint refs, verification outcomes, integration result, blocker classification per FR-013)
- [x] T042 [US4] Implement `workspace status` command in `tools/agent-workspace/src/cli/status.ts` (--json; owner, checkpoints, verification, integration result; blocked/unexecuted distinguishable per FR-014)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T043 [P] Run quickstart.md validation scenarios 1-6 end-to-end in `tools/agent-workspace/` (two-person pilot against temporary repositories)
- [x] T044 [P] Verify `./scripts/verify-template` passes from a clean checkout without `tools/agent-workspace` installed (Core Workspace independence per plan.md)
- [x] T045 Update `tools/agent-workspace/README.md` with two-person onboarding steps and CLI reference (doctor/claim/start/status/checkpoint/handoff/release/integrate)
- [x] T046 [P] Add managed-execution stub adapter in `tools/agent-workspace/src/adapters/managed/` that stays disabled until an approved AI Workload Credential exists (FR-018)
- [x] T047 [P] Add unit tests for lifecycle, claims, overlap, queue, and redaction edge cases in `tools/agent-workspace/test/unit/` (lease expiry, idempotent duplicates, retry linkage; blocked-as-passed prevention asserted at domain level only - black-box path owned by T039; SC-002 100-concurrent claim resolution simulated on in-memory fakes, real concurrency out of V1 scope; network-failure maps to `network` classification with no silent fallback per FR-019)
- [x] T048 Final cleanup: prune test worktrees (`git worktree prune`), confirm `.worktrees/` stays git-ignored, verify 30-day evidence retention default per data-model.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (US1 -> US2 -> US3 -> US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories (MVP)
- **User Story 2 (P1)**: Depends on US1 claim/start (checkpoint and handoff operate on an active run) - independently testable once US1 exists
- **User Story 3 (P1)**: Depends on US2 checkpoints (Integration Candidates are checkpointed changes) - independently testable once US2 exists
- **User Story 4 (P2)**: Depends on US1-US3 producing evidence (status inspects attributable records) - independently testable once any story produces evidence

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain logic before CLI commands
- CLI commands before integration/black-box wiring
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for a user story marked [P] can run in parallel
- Domain tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel once their dependencies exist (US2 after US1, US3 after US2, US4 after US1)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for ClaimStore acquire/renew/conflict behavior in tools/agent-workspace/test/contract/claims.ts"
Task: "Black-box test for two-person claim+start scenario in tools/agent-workspace/test/blackbox/test_claim_start.ts"

# Launch CLI command implementations together (depend only on domain + adapters):
Task: "Implement workspace claim command in tools/agent-workspace/src/cli/claim.ts"
Task: "Implement workspace start command in tools/agent-workspace/src/cli/start.ts"
Task: "Implement workspace doctor command in tools/agent-workspace/src/cli/doctor.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (claim/start/doctor + worktree sandbox)
4. **STOP and VALIDATE**: quickstart.md Scenario 1 (two people, isolated sandboxes, duplicate-claim rejection)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational - Foundation ready
2. Add User Story 1 - Test independently - Demo (MVP!)
3. Add User Story 2 - Test independently (checkpoint recovery, handoff)
4. Add User Story 3 - Test independently (integration queue)
5. Add User Story 4 - Test independently (status/evidence)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (claim/start/doctor)
   - Developer B: prepares contract tests + fakes for US2/US3
   - Developer C: black-box test scaffolding
3. Stories complete and integrate independently in dependency order

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- GitHub content-creating writes must stay serialized with >=1s spacing (research.md §2); git operations are single-process and serialized (research.md §4)

## Phase 8: Convergence

- [x] T049 [US1] Close the GitHub claim race by appending then re-reading and reconciling claim records before reporting success or creating a sandbox; make renew/release/expire token-aware, preserve deterministic oldest-valid-wins behavior, make retries idempotent, and add a 100-attempt concurrency test asserting exactly one winner and no second sandbox per FR-002, SC-002, and `src/adapters/github/claims.ts` (partial/contradicts)
- [x] T050 [US2] Implement authoritative handoff transfer using serialized provider writes plus reconciliation so the replacement owner becomes the active Run Owner, can checkpoint/release/retry, the previous owner is rejected, and duplicate handoffs are idempotent while preserving checkpoint, risks, and next action per FR-005/FR-006, US2 acceptance criteria, and `src/cli/handoff.ts` (missing)
- [x] T051 [US2] Make checkpoint creation resolve `HEAD` inside the assigned run sandbox, verify the commit belongs to the run branch, push it through `SourceHostAdapter`, confirm the remote ref before persistence, and record a durable redacted checkpoint/evidence record with idempotent retry behavior per FR-007, US2 acceptance criteria, `contracts/cli.md`, and `src/cli/checkpoint.ts` (partial)
- [x] T052 [US2] Implement the end-to-end retry/recovery flow with an explicit CLI entry point or documented recovery command path that creates a new linked Agent Run, restores from the latest pushed checkpoint, preserves the earlier run/branch/evidence, and allows the replacement owner to resume per FR-008, SC-003, T031, and `src/domain/lifecycle.ts` (missing)
- [x] T053 [US3] Replace the in-memory integration candidate placeholder with a durable candidate registry and queue discovery that enumerates checkpointed runs for the target, orders dependencies, distinguishes path and semantic overlap, warns or blocks accordingly, and requires an explicit dependency or responsible decision before semantic incorporation per FR-010/FR-012, US3 acceptance criteria, `contracts/adapters.md`, and `src/cli/integrate.ts` (missing)
- [x] T054 [US3] Wire the SourceHostAdapter into real integration: push checkpoint branches, open and inspect pull requests, validate protected-target policy and configured required checks, execute each configured verification command exactly, incorporate one candidate at a time against the latest target, rerun checks, refuse direct target mutation, and persist the integration result per FR-011/FR-020/FR-022, `contracts/cli.md`, and `src/cli/integrate.ts` (partial)
- [x] T055 [US1] [US2] [US3] [US4] Wire `EvidenceStore`, lifecycle transitions, and `AgentDriver.prepare` into the CLI context and every state-changing command (`claim`, `start`, `checkpoint`, `handoff`, `release`, retry, and `integrate`); persist attributable redacted evidence for timestamps, owner changes, checkpoints, verification, integration, blockers, and next action to the canonical Work Item and local mirror per FR-013/FR-014/FR-015, `contracts/state-files.md`, and `src/cli/context.ts` (missing)
- [x] T056 [US4] Make `workspace status` honor its optional Work Item argument, enumerate active and historical/released/expired/retried runs from canonical evidence, report real lifecycle state and owner/checkpoint/verification/integration/blocker/next-action data without opening the original sandbox, and never present blocked or unexecuted checks as passed per FR-013/FR-014, US4 acceptance criteria, `contracts/cli.md`, and `src/cli/status.ts` (partial)
- [x] T057 [US1] [US2] [US3] [US4] Add a deterministic adapter-level and black-box acceptance harness for the scenarios claimed by T012 and T024/T025/T033/T039, including checkpoint loss, handoff control transfer, overlap decisions, and evidence inspection; execute live GitHub cases only behind an explicit environment gate and correct the verification record so skipped cases are not represented as passed per the plan Testing section, SC-001–SC-006, and the current T043 result (partial)
- [x] T058 [US1] [US4] Normalize adapter and CLI failures through classified `WorkspaceError` results, distinguish capability/credential/network/quota/region/protection failures in `doctor` and command JSON output, preserve the Azure-free local path, and remove broad error swallowing per FR-017/FR-019, SC-005, `contracts/cli.md`, `src/cli/context.ts`, and `src/cli/doctor.ts` (partial)
- [x] T059 [US4] Harden evidence redaction across every free-text field, including verification commands and evidence references, add adversarial tests for credentials, sessions, prompts, transcripts, and source snapshots, and implement or explicitly configure the 30-day operational-mirror retention policy per FR-015, the data-model retention rule, `src/domain/redaction.ts`, and T048 (partial)
- [x] T060 [US1] Make branch naming collision-safe by incorporating Work Item/run identity into the descriptive branch, retain the prohibition on Agent/AI/Codex/personal markers, and verify existing worktree metadata before treating a create request as idempotent so separate Work Items cannot reuse another run's sandbox per FR-003/FR-020, T018, `src/cli/start.ts`, and `src/adapters/local/runner.ts` (partial)
