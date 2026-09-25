# Tasks: Technical Pilot Implementation Readiness

**Input**: Design documents from `specs/004-technical-pilot-readiness/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), reviewer-owned
[readiness checklist](checklists/readiness.md)

**Scope**: Execute PH0 Spec Kit WorkPackages `P01`–`P07` only. `WorkPackage:P01`–`P03` are
not the superseded `DeliveryCard:P01`–`P03`; the current management cards are `PLN01`–`PLN03`,
then `P04`–`P07`. These tasks produce readiness evidence and a `PG4`
decision; they do not create production application code.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: May proceed in parallel after its stated prerequisites because it writes a different file.
- **[US#]**: Maps to the user story in [spec.md](spec.md).
- **[SETUP]**: Cross-cutting setup work that establishes PH0 records before a user story result.
- **[HANDOFF]**: Cross-artifact review or handoff work after the story outputs exist.
- Every task names its output path and its PH0 work-package trace.

## Phase 1: Setup (Shared Readiness Records)

**Purpose**: Establish one evidence ledger and one trace index before any PH0 result is claimed.

- [x] T001 [SETUP] Create `specs/004-technical-pilot-readiness/readiness-register.md` from `contracts/decision-and-evidence-register.md`, with control envelope, P01–P07 rows initialized to `NOT-RUN`, result ownership and evidence-link columns (FR-014).
- [x] T002 [P] [SETUP] Create `specs/004-technical-pilot-readiness/trace-matrix.md` with columns for work package, local `FR-*`, approved product `REQ-*`, architecture source, VVP source, output and evidence status; do not populate an unverified product trace as `PASS` (FR-005, FR-014).
- [x] T003 [SETUP] Add links to the manifest, registers, contracts, checklist and quickstart in `specs/004-technical-pilot-readiness/README.md`, stating that DOC-04 remains the product-requirement authority (FR-014).

**Checkpoint**: The increment has one navigable ledger and trace surface; T001–T003 are complete,
but readiness results remain `NOT-RUN` until their review or execution evidence is recorded.

---

## Phase 2: User Story 1 — Work from one unambiguous baseline (Priority: P1)

**Goal**: Complete P01 by pinning and reviewing the approved predecessor and successor Draft as
separate baselines.

**Independent Test**: A reviewer can reproduce every primary source pin and explain the authority of
`f269a044...`, the historical use of `aabf02ff...` and the `NOT-RUN` successor disposition.

- [x] T004 [US1] Recompute current-source SHA-256 values and reconcile every entry and discrepancy in `specs/004-technical-pilot-readiness/baseline-manifest.md` against `IE-CHG-PDA-APPROVAL-001` and the current Git baseline (`P01`, FR-001, FR-002, FR-003).
- [x] T005 [US1] Reconcile the P01/P07 wording correction and Appendix A@0.5 → 0.6 history against `IE-CHG-PH0-CORR-001`, then preserve the exact P01-reviewed planning input (`IE-PLAN-DEC2026-003@0.2`, Appendix A@0.9 and Kanban@0.5 at `303b7225...`) separately from its `@0.1` predecessor; verify `f269a044...` remains the approved product baseline and `aabf02ff...` remains plan history without changing Feature, Spec or Tech (`BL-DISC-003`).
- [x] T006 [US1] Record the reviewer, date, exact manifest hash, discrepancy dispositions and P01 result in `specs/004-technical-pilot-readiness/readiness-register.md`; a missing review remains `NOT-RUN` and a source conflict remains `BLOCKED` (FR-014, SC-001). Evidence: Project Reviewer `PASS` on 2026-09-22 for `IE-INC-READY-001-BL-001@0.2`; reproducible evidence file `evidence/P01-BASELINE-001-reviewed-manifest.json`, SHA-256 `28F33DE52C0B4C69888EBAE3F28006C1620F90EEFDF8C4ED696016A15D1F3594`.

**Checkpoint**: P01 has attributable evidence or an explicit blocker. No successor approval is inferred.

---

## Phase 3: User Story 2 — Agree what the Technical Pilot must prove (Priority: P1)

**Goal**: Complete P02 with one traceable canonical scenario and explicit mandatory, deferred and
prohibited-claim boundaries.

**Independent Test**: A reviewer can walk from authenticated access to exact historical release
retrieval, see the safe outcome of each material failure and identify every deferred product area.

- [x] T007 [US2] Create `specs/004-technical-pilot-readiness/canonical-scenario.md` with actors, preconditions and ordered steps for native account/RBAC, Logical Document identity, Workspace, Checkout, Reference, changed/`NoChange` Check-in, Review, Release, Audit and exact package retrieval (`P02`, FR-004). Evidence: [canonical-scenario.md](canonical-scenario.md); later P02 review result is recorded under T011.
- [x] T008 [US2] Add normal, denied, stale, wrong-workspace, interrupted, lost-response/idempotent-retry and recovery paths to `specs/004-technical-pilot-readiness/canonical-scenario.md`, preserving local work and separating successful byte transfer from successful Check-in (FR-004, SC-005). Evidence: scenario sections 5–6; execution remains `NOT-RUN`.
- [x] T009 [US2] Populate `specs/004-technical-pilot-readiness/trace-matrix.md` for every scenario step using existing `REQ-*`, DOC-05/DOC-06 and VVP sources; leave unresolved trace as `BLOCKED` instead of creating substitute product behavior (FR-005, SC-002). Evidence: [trace-matrix.md](trace-matrix.md); application verification rows remain `NOT-RUN` despite the later documentary trace review under T011.
- [x] T010 [US2] Add mandatory scope, deferred product scope, and prohibited Technical Pilot claims to `specs/004-technical-pilot-readiness/canonical-scenario.md`, including later format breadth, company SSO, graphical workflow design, full Core v0, rollout, SLA and commercial claims (FR-006, SC-003). Evidence: scenario section 7; later scope review result is recorded under T011.
- [x] T011 [US2] Record the P02 review result, exact scenario/trace hashes and any scope blocker in `specs/004-technical-pilot-readiness/readiness-register.md` (FR-014). Evidence: [P02/T011 guided review](evidence/P02-T011-GUIDED-REVIEW-20260925.md), `COMPLETE / PASS` for documentary scope only; all 13 checks accepted on 2026-09-25. Runtime verification remains `NOT-RUN`.

**Checkpoint**: P02 is independently reviewable; deferred requirements remain visible and owned.

---

## Phase 4: User Story 3 — Expose every unresolved prerequisite (Priority: P1)

**Goal**: Complete P03 by converting all material unknowns into owned decisions or explicit blockers.

**Independent Test**: Any register row reveals the question, recommendation, authority, due condition,
closure evidence, affected work and gate effect without consulting chat history.

- [x] T012 [US3] Add D0 and all known product/technology qualification decisions to `specs/004-technical-pilot-readiness/readiness-register.md`, including exact Vault successor disposition, Artifact Gateway runtime/toolchain, Format Worker qualification and durability-policy values (`P03`, FR-007–FR-008). Evidence: readiness register §5; authority dispositions remain `OPEN`.
- [x] T013 [US3] Add environment, company-approval, test-identity, Vault-location, dataset, license and reviewer dependencies to `specs/004-technical-pilot-readiness/readiness-register.md` using the exact owner/due/closure/gate fields in `contracts/decision-and-evidence-register.md` (FR-007). Evidence: D1–D5 in readiness register §5.
- [x] T014 [US3] Review every candidate external dependency or adapted source against `docs/agents/external-source-intake.md` and record exact source/version/license/commercial-use state or `REFERENCE-ONLY`/`BLOCKED` in `specs/004-technical-pilot-readiness/readiness-register.md` (FR-013, SC-006). Evidence: D5 and environment-profile §2; no candidate is included or marked approved.
- [x] T015 [US3] Reconcile duplicate, contradictory or unowned rows in `specs/004-technical-pilot-readiness/readiness-register.md`; route behavior changes back to Feature/Spec/Tech authority and retain implementation values in PH0 (FR-007, Research §4). Evidence: one D0–D5 row per unresolved decision; no behavior change introduced.
- [ ] T016 [US3] Record the P03 review result and the exact set of `BLOCKS_PG4`, `BLOCKS_LATER_MILESTONE`, `DEFERRED_SCOPE` and `NONE` items in `specs/004-technical-pilot-readiness/readiness-register.md` (FR-014, SC-004).

**Checkpoint**: No material prerequisite is hidden in prose or assigned to an unnamed “team”.

---

## Phase 5: User Story 4 — Make the first coding increment testable and recoverable (Priority: P2)

**Goal**: Complete P04–P06 without installing software or starting production implementation.

**Independent Test**: An authorized engineer can understand the permitted environment, fixtures,
failure matrix and recovery/review procedures, while every unavailable prerequisite remains visible.

- [x] T017 [P] [US4] Create `specs/004-technical-pilot-readiness/environment-profile.md` with permitted developer/server classes, tool/version and license state, configuration/secret owners, repeatable future build/test entry points, migration controls and prohibited workstation actions (`P04`, FR-009). Evidence: [environment-profile.md](environment-profile.md); P04 environment result is recorded as `PASS` in [the readiness register](readiness-register.md).
- [x] T018 [P] [US4] Create `specs/004-technical-pilot-readiness/test-data-and-verification.md` with authorized synthetic fixtures, two identity profiles, document states, representative resumable-transfer Artifact generation/digest rules, candidate Vault locations and retention/disposal (`P05`, FR-010). Evidence: [test-data-and-verification.md](test-data-and-verification.md); server fixture provisioning and Project Reviewer P05 preparation result are recorded in [P05 evidence](evidence/P05-SERVER-FIXTURES-20260924.md). Application verification remains `NOT-RUN`.
- [x] T019 [US4] Add the normal, denied, stale, interruption, retry and recovery matrix plus exact expected evidence to `specs/004-technical-pilot-readiness/test-data-and-verification.md`; distinguish two identities from two independent humans and logical locations from failure domains (FR-010, SC-005). Evidence: verification matrix in test-data-and-verification.md; no runtime result claimed.
- [x] T020 [P] [US4] Create `specs/004-technical-pilot-readiness/recovery-and-security-plan.md` covering application/schema rollback, local Workspace preservation, metadata/Artifact reconciliation, coordinated backup/restore, session/key handling, trust boundaries, abuse cases and review competence (`P06`, FR-011–FR-012). Evidence: [recovery-and-security-plan.md](recovery-and-security-plan.md); the later guided review result is `PASS`, while runtime checks remain `NOT-RUN`.
- [x] T021 [US4] Cross-check `environment-profile.md`, `test-data-and-verification.md` and `recovery-and-security-plan.md` against the open-decision rows; record missing host, license, data, location or reviewer evidence as `BLOCKED`/`NOT-RUN` in `specs/004-technical-pilot-readiness/readiness-register.md` (SC-004, SC-007). Evidence: [T021 author-side cross-check](readiness-register.md#7-t021-author-side-cross-check); no readiness result or decision was closed.
- [x] T022 [US4] Record separate P04, P05 and P06 results, exact artifact hashes, reviewers and evidence links in `specs/004-technical-pilot-readiness/readiness-register.md` (FR-014). Evidence: [readiness register T022 review](readiness-register.md#9-review-handoff-preparation); P06 reviewer disposition and Execution Register revision 18.

**Checkpoint**: The next increment is either operationally reviewable or honestly blocked; no setup
command has been used to bypass company approval.

---

## Phase 6: User Story 5 — Record an honest PG4 decision (Priority: P1)

**Goal**: Complete P07 and authorize only the exact next increment if the gate passes.

**Independent Test**: The gate authority can decide from the retained package alone and the outcome
cannot be interpreted as approval of full Core v0, rollout, an SLA or commercial readiness.

- [ ] T023 [US5] Recompute all PH0 source hashes, freeze the reviewed manifest/commit and update `specs/004-technical-pilot-readiness/baseline-manifest.md` plus `readiness-register.md` before the gate review (`P07`, FR-015).
- [ ] T024 [US5] Execute the documentary checks in `specs/004-technical-pilot-readiness/quickstart.md` and record actual `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN` results with command/evidence links in `specs/004-technical-pilot-readiness/readiness-register.md` (FR-014–FR-015).
- [ ] T025 [US5] Prepare `specs/004-technical-pilot-readiness/pg4-review-package.md` using [contracts/pg4-review-package.md](contracts/pg4-review-package.md), summarizing P01–P06 results and P07 review preparation, open blockers, residual risks, exact proposed PH1 scope and all prohibited inferences without duplicating source authority (FR-015, FR-017, SC-008).
- [ ] T026 [US5] After T011/T016 review and T023–T025 preparation, have the applicable gate authority complete `specs/004-technical-pilot-readiness/pg4-gate-record.md` according to `contracts/pg4-gate-record.md`, including its Tracker-readable summary; separate execution state from the four permitted outcomes, retain complete conditional-action fields, approved PG2/PG3 evidence and the exact authorization boundary; an undecided gate has outcome `NOT-APPLICABLE` (FR-015–FR-017, SC-008).
- [ ] T027 [US5] If and only if T026 records an attributable `PASS` or valid `PASS-WITH-ACTIONS`, with approved PG2/PG3 baselines and authorization conditions met, create the next Spec Kit feature directory for the exact PH1 increment and link it from `specs/004-technical-pilot-readiness/pg4-gate-record.md`; otherwise record that production implementation remains unauthorized (FR-016, SC-009).

**Checkpoint**: PH0 ends with an attributable result. No task in this file implements product code.

---

## Phase 7: Cross-Artifact Consistency and Handoff

**Purpose**: Ensure the PH0 package remains a coherent, reproducible set after execution.

- [x] T028 [HANDOFF] Run `$speckit-analyze` over `specs/004-technical-pilot-readiness/spec.md`, `plan.md` and `tasks.md`; emit its report to the review conversation only, with no file writes or remediation inside the read-only analysis (FR-014, FR-015).
- [x] T029 [HANDOFF] Outside `$speckit-analyze`, save each emitted report and its reviewed source hashes in a new versioned `specs/004-technical-pilot-readiness/analysis-findings*.md` record without rewriting prior analysis evidence; obtain explicit approval for remediation, resolve accepted findings in their owning files and record rejected/deferred findings with rationale; changed source hashes require re-analysis and gate-impact review before any prior authorization is reused (FR-014, FR-015).
- [x] T030 [HANDOFF] Re-run `git diff --check`, placeholder scans, relative-link checks and source-hash reconciliation from `specs/004-technical-pilot-readiness/quickstart.md`; append only actual outcomes to `readiness-register.md` (FR-014, FR-015).
- [ ] T031 [HANDOFF] Have the project reviewer evaluate all unchecked items in `specs/004-technical-pilot-readiness/checklists/readiness.md`; checklist approval is requirements-quality evidence only and cannot replace P01–P07 execution or the `PG4` decision (FR-014).
- [ ] T032 [HANDOFF] Update `specs/004-technical-pilot-readiness/README.md` with final status, exact gate record, remaining blockers and the authorized next action, preserving `NOT-RUN` where no evidence exists (FR-015–FR-016, SC-008–SC-009).

---

## Effort and Roadmap Trace

The current DOC-07 PH0 allocation belongs to **Delivery Cards**, not to the identically named
Spec Kit WorkPackages. `DeliveryCard:P01`–`P03` were superseded by completed planning cards
`PLN01`–`PLN03`; do not count the older Spec Kit `P01`–`P03` rows as another 12 hours.

| Current Delivery Card | Related tasks in this package | Baseline hours | Accounting boundary |
|---|---|---:|---|
| `PLN01`–`PLN03` | No one-to-one mapping to Spec Kit `P01`–`P03` | 12 h | Completed management WBS, Gantt and Kanban setup; actual effort is recorded in the Execution Register. |
| `P04` | T017, T021–T022 (environment portion) | 4 h | Current environment preparation card. |
| `P05` | T018–T019, T021–T022 (dataset portion) | 4 h | Current fixture preparation card. |
| `P06` | T020–T022 (recovery/security portion) | 8 h | Current documentary recovery/security card. |
| `P07` | T011 (complete), T016, T023–T027, T031–T032 (remaining decision, gate and handoff portions) | 4 h | Only effort actually recorded after starting P07 is charged to it; earlier work is not backfilled without the project user's explicit retrospective confirmation. |
| **PH0 total** |  | **32 h** | Planned baseline unchanged. |

`WorkPackage:P01` (T004–T006), `WorkPackage:P02` (T007–T011), and `WorkPackage:P03`
(T012–T016) remain valid internal Spec Kit identities and evidence groupings. Their earlier
authoring effort has no separate current Delivery Card or verified actual-effort entry. The
T011/T016 reviewer actions are shown as P07 substeps in the current Kanban rendition;
T011 now has a documentary `PASS`, while T016 remains open. This does not change their WorkPackage
identity or imply a P07/PG4 result.
T001–T003 and T028–T032 are cross-artifact quality/handoff tasks included in the applicable
current cards, not additive hours. The eight-hour PH0 operational buffer is controlled schedule
capacity, not a task or permission to skip authority, review or correctness conditions.

## Dependencies & Execution Order

### Phase Dependencies

- Setup must complete before any story writes result evidence.
- US1/P01 must complete before US2 and US3 can claim their exact baseline.
- US2 and US3 may prepare distinct source records in parallel after US1, but one primary developer
  is planned, so the operating sequence remains US1 → US2 → US3.
- US4 depends on the scenario and open-decision register from US2/US3.
- DeliveryCard P07 may start after its current management-card predecessors to record T011/T016
  review effort and prepare PG4. The T026 gate decision depends on T011/T016 dispositions,
  P01–P06 results and T023–T025 preparation; P07 closes only after a recorded gate outcome.
  This separates the card's start condition from the gate's decision condition.
- Cross-artifact analysis runs after the complete draft package and before final handoff.

### User Story Dependencies

- **US1**: Depends only on Setup; first independently reviewable checkpoint.
- **US2**: Depends on the exact baseline from US1.
- **US3**: Depends on US1 and uses US2 scope to classify effects.
- **US4**: Depends on US2/US3; its three main files can be drafted in parallel.
- **US5**: Depends on US1–US4; it is independently decidable from their retained outputs.

### Parallel Opportunities

- T002 and T003 can proceed after T001 without editing the same file.
- T013 and T014 can research distinct dependency classes after T012.
- T017, T018 and T020 write separate PH0 records after P03 identifies owners and constraints.
- T028 is read-only and must not run concurrently with edits that change the analyzed baseline.

## Incremental Delivery Strategy

1. **Baseline checkpoint**: Complete Setup + US1. This is the smallest useful PH0 slice, but not a
   `PG4` package.
2. **Scope checkpoint**: Complete US2 and review the canonical scenario before preparing resources.
3. **Dependency checkpoint**: Complete US3; escalate authority and infrastructure blockers early.
4. **Operational checkpoint**: Complete US4 and reconcile environment, data, recovery and security.
5. **Gate checkpoint**: Complete US5 and cross-artifact analysis. Start no production code unless the
   exact gate record records an attributable `PASS` or valid `PASS-WITH-ACTIONS`, approved PG2/PG3
   baselines and all authorization conditions are met.

## Notes

- Every `[x]` in this file means the named task and its evidence are complete; it does not imply a
  Product Decision Authority approval or product verification result.
- Reviewer-owned checklists are not marked by the implementation agent.
- Update controlled product/planning documents only through their required authoring/change process.
- Stop and return to the applicable Feature/Spec/Tech authority if a readiness task would change
  approved product behavior or the selected Tech Stack.
