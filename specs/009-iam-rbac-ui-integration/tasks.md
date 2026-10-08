# Tasks: Native Account and Scoped RBAC UI Integration

**Input**: Design documents from `/specs/009-iam-rbac-ui-integration/`.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

**Control**: IE-TASK-IAM-UI-001 / Spec Kit delivery decomposition / 1.6 / Draft independent-review repair successor; Issue #46; Codex, CODEX_ONLY; 2026-10-08 Asia/Ho_Chi_Minh; INTERNAL, retained in Git. Project Reviewer accepted written design at `0a1de66627fccc4597ac753f6c642d1d8d5f7d1d`; the authorized 93-task/Analyze repair is retained at `aaa5596a0ccb7bebf3c8a67e161afde0cd9bb55a`. Historical readiness and implementation executions are retained separately in the handoff.

**Status**: T001–T092 engineering complete (**92/93**); T093 external acceptance pending. PG2/PG3/PG4 PASS; predecessor independent PG5 recommendation FAIL at `73b5d95` (S1/F1/F2), successor PG5 not yet dispositioned. [Current section 22](integration-readiness.md#22-independent-review-repair-successor--2026-10-08) records the authorized three-finding repair: terminal scope/replay, independently authorized administration history + AA/PA/PRA ordinary grant, exact confirmation diff/interval. Affected Server 171 PASS across two exact sources, Web 62/62 + TypeScript, actual headed Chrome 8/8 Inspector + 9/9 Assignment, package/DB oracle PASS. Historical sections 16–21 are unchanged. Detector automated NOT-PASS/exit1/nine synthetic/generated/private-read matches; user's manual PASS report is separately recorded. Verifier NOT-RUN. Original shell retained; PR #47 Draft/Open, Issue #46 open, no deployment/merge/Tracker change.

**Organization**: Shared evaluator/read ports and client state are foundational, before any owner uses them. Visible feature slices remain account/session → Project/Group → assignments → Custom Role → inspection → final browser/recovery. Q15 synthetic console qualification is the accepted plan's separate prerequisite sub-slice of US6, not bootstrap/migration seeding or live-estate authorization. No new requirement, route, permission or framework is introduced by decomposition.

**TDD rule**: After the explicit gate, write and execute each focused RED before its minimum GREEN; do not wait for all test files in a phase before beginning the first vertical test/implementation pair. Later negative/race tests likewise precede their repairs. Existing already-correct behavior is qualified truthfully, never sabotaged to manufacture RED. Every run pins exact source/commands/targets and retains failed/positive evidence. Missing tooling/runner/rights or scope drift STOP; no install/download implied.

## Phase 1: Setup and explicit execution gate (documentation only)

**Purpose/goal**: Prepare authority, exact inputs and safe targets before creating any implementation or test source.

**Independent checkpoint**: Read-only preparation/Analyze first; the later explicit human authorization permits only bounded readiness DB/tool/build/TLS preparation before PG4. The [envelope](execution-envelope.md) records that successor authority; no T008+ fixture/test/product/migration work before final gate PASS.

- [X] T001 Read `specs/009-iam-rbac-ui-integration/plan.md`, `research.md`, `data-model.md`, `contracts/operations.md`, `contracts/permission-delegation.md`, `contracts/web-flow.md`, and `quickstart.md`; record the selected owner seams and all `DESIGN`/`IMPLEMENTED` boundaries in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T002 Confirm the exact Java 25, Spring Boot 4.1.1, JDBC/PostgreSQL, React 19.3.0, TypeScript 7.0.2, Vite 8.3.1, scoped Linux Node 24.21.0 for offline Web build and approved Windows Node 24.19.0 for browser harness, and browser/tooling sources admitted for this increment; record any missing/hash-drift artifact as a STOP in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T003 Record the owned branch/worktree, base SHA and primary checkout preservation in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; inspect an existing suitable worktree first, keep the user-owned `apps/web/package.json` outside this publication.
- [X] T004 Confirm the current migration number and V1–V10 checksums before adding any migration under `database/migrations/`; record the selected next version and rollback/forward-repair boundary in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T005 Publish the synthetic fixture/target manifest in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; define synthetic identities, exact schema/database boundaries, TLS/browser target and cleanup guards without creating Java fixtures, database objects, certificates or listeners.
- [X] T006 Run read-only `speckit-analyze` against `specs/009-iam-rbac-ui-integration/spec.md`, `plan.md`, `tasks.md` and their contract/readiness references; resolve blocking contradictions through an authorized documentation repair before seeking execution approval.
- [X] T007 Publish and obtain the explicit execution-readiness disposition in `specs/009-iam-rbac-ui-integration/integration-readiness.md`: applicable PG2/PG3/PG4 authority, exact controlled source/tool/cache/license hashes, admitted test runner, separate app/migrator, named owned targets, permitted command templates and STOP/cleanup rules. Written design PASS is not a formal gate PASS. PG4 PASS now follows the originally conditional human authority plus actual trusted Chrome HTTPS/cleanup PASS in `execution-envelope.md` section 6. Each later RED/GREEN run freezes its exact source/command inside that envelope.

## Phase 2: Foundational — one shared authoritative seam

**Purpose/goal**: Implement shared eligible context, UoW, protected schema, owner read ports, evaluator and actual Web state after the Phase 1 gate.

**Independent checkpoint**: Foundation tests use real separate PostgreSQL roles; synthetic prerequisite state is not qualification of Project HTTP, assignment administration or live adoption.

- [X] T008 Define named synthetic fixture identities and relationships in `apps/server/src/test/java/com/idea/ddm/iam/IamIntegrationFixtures.java` from the approved manifest; no company identity/credential and no implicit production grants.
- [X] T009 Write and run RED tests for real server-established `ActorContext` and current session eligibility at `apps/server/src/test/java/com/idea/ddm/identity/OwnerSessionEligibilityTest.java`; include revoked, stale security version, disabled account, idle/absolute expiry and runtime-instance cases. Existing correct behavior qualified GREEN under the TDD rule; no manufactured defect.
- [X] T010 Implement the read-only current eligibility/context port in `apps/server/src/main/java/com/idea/ddm/identity/OwnerSessionEligibility.java`; preserve lock `73003002`, never accept client-supplied `ActorId`, and never re-enter IAM mutation from an Access Policy query. Existing port retained unchanged and newly qualified.
- [X] T011 Write and run RED tests for owner commit coordination and atomic owner outcome/authorization evidence/Audit fate in `apps/server/src/test/java/com/idea/ddm/identity/IdentityTransactionsTest.java`; include forced evidence failure and concurrent security-write cases.
- [X] T012 Extend the existing JDBC transaction seam in `apps/server/src/main/java/com/idea/ddm/identity/IdentityTransactions.java` so new owner modules revalidate session/account, delegation, membership and expected state under the shared security-write coordination before commit. Shared owner callbacks are qualified here; new domain/profile implementation and qualification remain later tasks.
- [X] T013 Write and run additive schema/privilege RED tests in `apps/server/src/test/java/com/idea/ddm/iam/IamSchemaPrivilegeTest.java` before creating the successor migration; assert V1–V10 immutable, migrator ownership, SQLSTATE 42501 direct protected DML/SET ROLE refusals, canonical legacy revocation and separate draft staging.
- [X] T014 Implement the additive IAM/Project/Group/assignment schema in `database/migrations/V11__iam_rbac_ui_successor.sql` (or the exact next unused migration path recorded by T004); preserve legacy `revoked_at` as canonical termination, map every predecessor revoked row without resurrection, enforce same-Organization/same-Project relationships, and keep activated role/version content immutable. Structural schema qualified only in owned test schemas; protected owner-write interfaces accompany later actual owner behaviors, not blanket DML grants or an implemented HTTP workflow.
- [X] T015 Add named identity/session and owner-command fixture helpers in `apps/server/src/test/java/com/idea/ddm/iam/IamTestFixture.java`; expose zero raw UUID-array indexing to story tests and keep password/proof/session secrets out of retained evidence.
- [X] T016 Write and run shared owner-read/evaluator seam RED tests in `apps/server/src/test/java/com/idea/ddm/project/ProjectAuthorizationReadTest.java`; use named synthetic Project/Group/membership prerequisite fixtures to prove same-Org/Project boundaries, active periods and no mutation/re-entry; fixtures do not qualify UI-P01–P13.
- [X] T017 Implement Project Governance's minimal read-only authorization state in `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java`; expose current Project/Group/membership facts to the single evaluator, not a second evaluator or caller-owned membership model. Authorized directory/participant projections follow in US2.
- [X] T018 Write and run RED evaluator tests in `apps/server/src/test/java/com/idea/ddm/access/AuthorizationDecisionTest.java`; cover all applicable direct/Group paths, positive union, current IAM eligibility, half-open intervals and owner business-gate separation. Include legacy exact AA profiles, admin-without-membership versus engineering/Group gates, every declared permission applicability profile and unavailable-state refusal.
- [X] T019 Implement the single Access Policy evaluator in `apps/server/src/main/java/com/idea/ddm/access/AuthorizationDecisionService.java`; resolve all applicable IAM/Project/Group paths through read-only eligibility, preserve immutable provenance and fail closed on unavailable evidence. Every later Project/Access Policy owner uses this same evaluator; assignment-management APIs are not required to seed controlled test-only prerequisites.
- [X] T020 Write and run RED shared error, correlation and safe-response mapping tests in `apps/server/src/test/java/com/idea/ddm/iam/IamHttpContractTest.java`; preserve accepted Identity empty-body/error mappings and use bounded 400/401/403/404/409/503 semantics for new DESIGN adapters only. Exact-source 9/9 PASS; test-only mapping routes are not product operations.
- [X] T021 Write and run Web adapter/state RED tests in `apps/web/src/features/iamIntegration/iamIntegrationState.test.ts`; qualify loading, authorized empty, refusal, stale, unavailable and unresolved separately, real session/CSRF sourcing and no mock/dev authority, secret retention or automatic retry. Exact-source 14/14 PASS through the external fetch boundary, not actual browser qualification.
- [X] T022 Add the Web API adapter foundation in `apps/server/src/main/java/com/idea/ddm/iam/IamWebConfiguration.java` and `apps/web/src/api/iamClient.ts`; reuse same-origin HttpOnly Secure SameSite session + CSRF, never JWT/localStorage bearer or client-authoritative ActorId.
- [X] T023 Implement shared IAM Web state/adapters in `apps/web/src/features/iamIntegration/iamIntegrationState.ts`; model loading, authorized empty, refusal, stale, unavailable and unresolved states without mock/dev authority. This shared state exists before the account screen; it is not deferred to final browser qualification.
- [X] T024 Run focused foundational GREEN/affected regression on the exact source and approved targets from `specs/009-iam-rbac-ui-integration/quickstart.md`; record real results/cleanup in `integration-readiness.md` before owner stories use these seams, without claiming another story implemented.

## Phase 2b: US6 prerequisite — separate Q15 synthetic console slice (Priority: P2)

**Purpose/goal**: Qualify the accepted plan's synthetic successor adoption before live administrative journeys; this prerequisite sub-slice is separate from final US6 browser work.

**Independent checkpoint**: Same eligible Super@1 Actor/Organization reauthenticates into a separate Super@2 assignment; wrong/stale/blocked/evidence-failure cases refuse without bootstrap or existing grant rewrite.

- [X] T025 [US6] Write and run RED console-adoption tests in `apps/server/src/test/java/com/idea/ddm/access/SuperSuccessorAdoptionTest.java`; cover same Actor/Organization ACTIVE account, real Login Identity reauthentication, exact Super@2 assignment, OperationId/reason/outcome/evidence/Audit and old Super@1/bootstrap marker preservation.
- [X] T026 [US6] Write and run RED adoption negative/recovery tests in `apps/server/src/test/java/com/idea/ddm/access/SuperSuccessorAdoptionNegativeTest.java`; cover wrong Actor/Organization, stale/revoked/disabled/blocked/failed reauthentication, evidence failure, no duplicate grant and last-effective-recovery protection.
- [X] T027 [US6] Implement the adoption owner transaction in `apps/server/src/main/java/com/idea/ddm/access/SuperSuccessorAdoptionService.java`; recheck current Super@1/security state under lock, reuse qualified exact-login throttle fate, append Super@2 assignment/evidence/Audit atomically and resolve repeat as `ALREADY_ADOPTED`.
- [X] T028 [US6] Implement the local interactive adoption command in `apps/server/src/main/java/com/idea/ddm/identity/SuperSuccessorAdoptionCommand.java`; require named operator authorization, exact target/version and no password arguments/environment/logs; never expose an HTTP route or startup callback.
- [X] T029 [US6] Execute the bounded synthetic Q15 console qualification and record exact source/commands/results in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; verify shared known-login throttle and successful clear/adoption atomic fate, no HTTP session, bootstrap marker/old grants unchanged. No live estate adoption without separate exact-target operator authorization.

## Phase 3: User Story 1 — Manage an actual IDEA Account (Priority: P1) — MVP

**Purpose/goal**: Connect authorized account reads/commands and intentional private credential handoff/redemption to actual Web.

**Independent checkpoint**: Eligible AA creates PENDING, recipient establishes credential, disable/reset invalidates old sessions, re-enable preserves identity; ordinary/wrong-scope/stale refuses and no implicit membership/grant.

- [X] T030 [P] [US1] Write and run RED HTTP contract tests for `UI-I01`–`UI-I06` in `apps/server/src/test/java/com/idea/ddm/identity/IdentityAccountUiContractTest.java`; cover current context, redacted directory/detail, create/disable/re-enable, exact `loginIdentityId` proof targeting, one-use/expiry and sibling-login reset semantics. Coverage combines new 6/6 with affected existing 83/83 HTTP regression; do not duplicate or manufacture RED for already-qualified semantics.
- [X] T031 [P] [US1] Write and run RED database tests for zero implicit Project Membership, Group Membership and Role Assignment after account creation in `apps/server/src/test/java/com/idea/ddm/identity/AccountIsolationTest.java`. Already-correct create behavior qualified 1/1 GREEN; no manufactured RED.
- [X] T032 [P] [US1] Write and run RED Web states/privacy tests in `apps/web/src/features/accountAdministration/accountAdministration.test.tsx`: loading, authorized empty, refusal, stale, unavailable and unresolved. Password is allowed only in recipient credential control/submission; proof only in intentional private handoff/redemption controls. Clear after submit/unmount; never URL, storage, logs, diagnostic text or retained evidence. No administrative password view or Server verifier disclosure.
- [X] T033 [P] [US1] Write and run recipient/private-handoff RED tests in `apps/web/src/features/credentials/credentialRedemption.test.tsx`; manual proof entry (never URL), proof + existing CSRF authority without AA role, exact target/purpose, one-use/15-minute expiry, disabled-reset preservation, visible refusal/unresolved response and clearing/no-secret-retention on submit/unmount.
- [X] T034 [P] [US1] Write and run explicit reissue RED tests in `apps/server/src/test/java/com/idea/ddm/identity/CredentialProofReissueTest.java`: same exact Login Identity/purpose prior unconsumed proof superseded only on commit; other login/purpose unchanged; forced outcome/Audit failure rolls back supersession and new issuance; lost response never enables plaintext recovery/automatic retry. **COMPLETE**: existing exact-login/sibling/Audit coverage plus explicit outcome-insert rollback and different-purpose isolation qualified 5/5 at 15a98ca, then affected regression 5/5 at 818ccbd. Initial wrong-table test oracle retained as failure, not product RED; no already-correct implementation was changed to manufacture RED. Lost-response/private handoff browser evidence remains in section 16.
- [X] T035 [US1] Implement authorized redacted directory/context projections in `apps/server/src/main/java/com/idea/ddm/identity/IdentityDirectoryQueries.java`; preserve Actor/Account/Login Identity separation, Account 0..* Login Identities, security-version redaction and scope filtering.
- [X] T036 [US1] Implement the Account Administration owner adapter in `apps/server/src/main/java/com/idea/ddm/identity/IdentityAccountAdministration.java`; reuse qualified create/disable/re-enable operations, require exact expected security version/reason, and keep owner outcome/evidence/Audit atomic.
- [X] T037 [US1] Extend existing `apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java` and implement `CredentialProofDelivery.java` in that same directory for reviewed manual issuance/redemption; do not duplicate existing credential routes in another controller. Separate configuration from synthetic delivery, require exact loginIdentityId/purpose/security version, no-store transient handoff and no plaintext recovery after response loss; preserve existing Identity status/retry contracts.
- [X] T038 [US1] Implement explicit matching-purpose/exact-login supersession in `apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java` and `CredentialResetService.java` through the existing coordinated transaction/evidence seam; new OperationId/reason/Audit, one-use/15-minute expiry, no broad account-cardinality assumption and no credential/proof in digest or replay storage.
- [X] T039 [US1] Implement private `CredentialProofHandoff.tsx` and recipient `CredentialRedemptionPage.tsx` under `apps/web/src/features/credentials/`, with the approved flow wired in `apps/web/src/App.tsx`; intentional temporary controls only, no automatic clipboard/storage/URL, clear after submit/unmount, proof authority + CSRF not AA, password never delivered to administrator.
- [X] T040 [US1] Implement the Account Administration UI in `apps/web/src/features/accountAdministration/AccountAdministrationPage.tsx`; show truthful PENDING/ACTIVE/DISABLED state, separate account versus credential actions, and refuse to infer Project or product access. Wire this actual screen and session flow in `apps/web/src/App.tsx` now, using the foundational shared state; no dependence on final US6 routing.
- [X] T041 [US1] Execute exact-source focused Server/PostgreSQL HTTP and actual same-origin Web/HTTPS qualification for `apps/web/src/features/accountAdministration/AccountAdministrationPage.tsx`, `apps/web/src/features/credentials/CredentialRedemptionPage.tsx` and `apps/server/src/test/java/com/idea/ddm/identity/IdentityAccountUiContractTest.java`; include reissue atomicity, session invalidation, stable identity, disabled/sibling-login behavior and secret clearing. Fixture grants are not product assignment APIs.
- [X] T042 [US1] Record the US1 evidence and exact executed source in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; preserve raw-log limitations and mark only the actually qualified operations `IMPLEMENTED`.

## Phase 4: User Story 2 — Establish Project and Group participation (Priority: P1)

**Purpose/goal**: Implement Project-owned queries/commands, actual HTTP adapters and Web using the already-qualified shared evaluator.

**Independent checkpoint**: Org PA creates without membership/grants, administration does not require personal membership, Group insertion requires eligible same-Project member; Project-only/cross-Org/Project and stale cases refuse.

- [X] T043 [P] [US2] Write and run RED owner tests for `UI-P01`–`UI-P13` in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceContractTest.java`; cover Org create, Project-only refusal, Project/Group version conflicts, direct membership history, Group target membership and cross-Organization rejection.
- [X] T044 [P] [US2] Write and run RED migration/relationship tests in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceDataTest.java`; enforce `Actor/Project` and `Actor/Group` same-Organization relationships, no nesting, one unended association and retained ended history.
- [X] T045 [P] [US2] Write and run real HTTP RED contract tests for UI-P01–P13 in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceHttpContractTest.java`; use only the accepted `contracts/operations.md` routes/DTOs, real session/CSRF, current scope/membership authorization, redaction, expected versions, 400/401/403/404/409/503 and operation-specific replay/refusal. Owner tests are not HTTP adapter evidence.
- [X] T046 [P] [US2] Write and run RED Project/Group Web tests in `apps/web/src/features/projectAdministration/projectAdministration.test.tsx`; cover Org versus Project-only create, membership-independent administration, explicit participation/history, Group target prerequisite, actual refusal/stale/unavailable/unresolved states. Principal/Role assignment wizard tests belong to US3.
- [X] T047 [US2] Write and run RED owner transaction, expected-version and refusal tests in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceAtomicityTest.java`; force outcome/Audit failure and concurrent membership/Group updates to prove zero partial success.
- [X] T048 [US2] Extend `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java` with authorized UI-P01/P04/P07/P10/P13 projections over its foundational read facts; preserve exact IDs/versions, display names nonblank, <=200 characters, no control characters, offset >=0/limit 1..100/default 50/stable-ID ordering, no unauthorized count/roster and no second evaluator.
- [X] T049 [US2] Implement Project/Group owner commands in `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceAdministration.java`; require Org-scoped `project.create`, prevent Project-only creation, increment the exact parent/association version, and create no implicit creator membership/assignment.
- [X] T050 [US2] Implement Project Membership and Group Membership commands in `apps/server/src/main/java/com/idea/ddm/project/ProjectParticipationAdministration.java`; require active same-Project member for Group targets, retain ended rows, and keep direct administration separate from participation.
- [X] T051 [US2] Implement UI-P01–P13 in `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceController.java`, matching only the approved operations contract; inject Server current context, ordinary session/CSRF, shared evaluator/UoW, expected versions and non-disclosing errors. Participant query retains membership gate; no new route or permission invented.
- [X] T052 [US2] Implement Project Administration UI in `apps/web/src/features/projectAdministration/ProjectAdministrationPage.tsx`; show fixed permitted Scope, membership/history state and Group mode explicitly without Department-derived authority or local role arrays. Wire these actual screens in `apps/web/src/App.tsx` within this slice.
- [X] T053 [US2] Execute focused real HTTP/PostgreSQL and actual Web qualification for `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceHttpContractTest.java` and `apps/web/src/features/projectAdministration/ProjectAdministrationPage.tsx`; retain source, replay/race/atomic-failure results and approved cleanup, plus affected US1 regressions in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T054 [US2] Record independent US2 evidence and source trace in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; do not mark Product Configuration, Document or Workflow operations implemented.

## Phase 5: User Story 3 — Grant several independent scoped roles (Priority: P1)

**Purpose/goal**: Implement assignment administration and wizard, not another evaluator.

**Independent checkpoint**: One Actor holds AA/PA/PRA separately; Actor versus Group mode, exact version/scope and positive union work; end/replace affects one path and unsafe delegation/recovery attempts refuse atomically.

- [X] T055 [P] [US3] Write and run RED HTTP catalogue/assignment contract tests for `UI-R01` and `UI-R05`–`UI-R09` in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentContractTest.java`; cover authorized catalogue reads needed before the wizard, exact version pinning, scope containment, operation replay, changed-input refusal, different-Actor non-disclosure and concurrency.
- [X] T056 [P] [US3] Write and run RED last-recovery and protected-DML tests in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentRecoveryTest.java`; count distinct eligible Actors across supported Super versions and retain SQLSTATE `42501` raw mutation refusals.
- [X] T057 [P] [US3] Write and run RED wizard tests in `apps/web/src/features/accessAdministration/assignmentWizard.test.tsx`; Scope → person within Group filter OR visibly explicit Group principal → exact Role/version → consequence/reason/confirm; verify independent multi-role paths, explicit Org breadth, no copied grants or Department authority.
- [X] T058 [US3] Write and run RED concurrent, stale-state, revoke-before-commit and forced-evidence failure tests in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentAtomicityTest.java`; prove no duplicate Audit/event or partial authority.
- [X] T059 [US3] Implement role catalogue/version queries in `apps/server/src/main/java/com/idea/ddm/access/RoleCatalogueQueries.java` and their sole `UI-R01` HTTP adapter in `apps/server/src/main/java/com/idea/ddm/access/RoleCatalogueController.java` before the assignment wizard; keep Super@1, AA@1 and AA@2 immutable, expose DESIGN versions as non-selectable until qualified, and never select by role name alone. Match the accepted catalogue route/DTO/authorization contract; no second mapping in the Custom Role controller.
- [X] T060 [US3] Implement assignment preview/grant/end/replace owner commands in `apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentAdministration.java`; require exact principal/scope/delegation envelope, new ID on regrant, canonical `revoked_at` termination and atomic predecessor/successor transition.
- [X] T061 [US3] Implement only UI-R05–R09 assignment adapters in `apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentController.java`; real current session/CSRF, shared evaluator/UoW, safe errors and reviewed operation-specific replay. UI-R10/UI-A01/UI-O01 adapters have the single US5 owner, not duplicate mappings here.
- [X] T062 [US3] Implement the assignment wizard in `apps/web/src/features/accessAdministration/AssignmentWizard.tsx`; enforce Scope → person within Group filter or explicit Group principal → exact Role/version → consequence/reason/confirm, with independent multi-role display. Wire the wizard and assignment views in `apps/web/src/App.tsx` in this slice, not at final US6.
- [X] T063 [US3] Execute exact-source assignment HTTP/PostgreSQL and actual Web qualification of `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentContractTest.java`, `RoleAssignmentAtomicityTest.java` and `apps/web/src/features/accessAdministration/AssignmentWizard.tsx`; retain current-path/delegation/recovery/retry oracles and affected owner regressions in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T064 [US3] Record US3 multi-role/scope/delegation evidence in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; explicitly distinguish direct administration from technical Project membership.

## Phase 6: User Story 4 — Evolve a supported Custom Role (Priority: P2)

**Purpose/goal**: Prepare/validate candidate and activate immutable successors without retargeting assignments.

**Independent checkpoint**: Supported scope/principal/permission ceiling enforced; stale/unsupported/self-authorizing candidate refuses; activation preserves predecessor and explicit replacement history.

- [X] T065 [P] [US4] Write and run RED candidate/activation contract tests for `UI-R01`–`UI-R04` in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleContractTest.java`; cover supported Custom ceiling (`project.read`, scoped read/inspection only initially), built-in immutability and stale base.
- [X] T066 [P] [US4] Write and run RED protected-version tests in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleImmutabilityTest.java`; prove draft staging is separate, activation inserts a complete sealed version, and no `UPDATE/DELETE` or late permission insertion mutates active content.
- [X] T067 [P] [US4] Write and run RED Custom Role UI tests in `apps/web/src/features/accessAdministration/customRoleEditor.test.tsx`; supported permission ceiling/support sets, candidate diff/validation, immutable activation, stale/refusal/unresolved response, no automatic assignment replacement.
- [X] T068 [US4] Write and run RED Custom Role replacement/replay/evidence-failure tests in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleAtomicityTest.java`; preserve old assignment IDs/content and distinguish confirmed rollback from uncertain commit outcome.
- [X] T069 [US4] Implement candidate staging and validation in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionCandidateService.java`; enforce nonempty principal/scope support sets, exact management scope, registered Permission codes and no candidate-defined delegation ceiling.
- [X] T070 [US4] Implement immutable successor activation in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionActivationService.java`; require expected active base, append complete content once, pin digest/version and leave predecessor assignments unchanged.
- [X] T071 [US4] Implement only `UI-R02`–`UI-R04` Custom Role candidate/validation/activation adapters in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionController.java`; retain the qualified `UI-R01` catalogue adapter from US3, keep all unsupported/product-domain operations `DESIGN` and refuse arbitrary conditions/scripts.
- [X] T072 [US4] Implement Custom Role UI in `apps/web/src/features/accessAdministration/CustomRoleEditor.tsx`; show permission difference, management scope, principal support, successor state and explicit replacement boundary. Wire this actual screen in `apps/web/src/App.tsx` within US4.
- [X] T073 [US4] Execute focused exact-source Custom Role HTTP/PostgreSQL and actual Web qualification for `apps/server/src/test/java/com/idea/ddm/access/CustomRoleContractTest.java` and `apps/web/src/features/accessAdministration/CustomRoleEditor.tsx`; include immutable-content/raw-DML and assignment preservation/replacement regression, record in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T074 [US4] Record US4 immutable-role evidence and exact source trace in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; do not claim a generic policy engine or product Permission invention.

## Phase 7: User Story 5 — Explain current access safely (Priority: P2)

**Purpose/goal**: Add the single access/history/operation-resolution query adapters and actual inspector UI.

**Independent checkpoint**: Authorized current inspector sees all paths, original provenance and safe outcome; another Actor/cross-scope request discloses nothing; owner gates remain separate from RBAC.

- [X] T075 [P] [US5] Write and run RED access-inspection/history/operation-resolution tests for `UI-R10`, `UI-A01` and `UI-O01` in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionContractTest.java`; cover originator/current eligibility, independent authorized inspector policy, different-Actor non-disclosure and no duplicate Audit/event.
- [X] T076 [P] [US5] Write and run RED privacy tests in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionPrivacyTest.java`; prove no credentials, proofs, cookies, CSRF values or unauthorized target metadata appear in responses, logs or UI state. This is read inspection, not a ban on US1's intentional temporary private proof control.
- [X] T077 [US5] Write and run RED operation-resolution and Audit atomicity regression tests in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionAtomicityTest.java`; prove read-only inspection never mutates assignments or owner state.
- [X] T078 [US5] Implement redacted all-path access inspection and administration history queries in `apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java`; use current authorization, immutable provenance and owner-specific query policies, never a second evaluator.
- [X] T079 [US5] Implement safe access/history/operation-resolution adapters in `apps/server/src/main/java/com/idea/ddm/access/AccessInspectionController.java`; keep legacy Identity retry semantics unchanged and distinguish committed, refused, rollback-confirmed and uncertain outcomes. This is the sole UI-R10/UI-A01/UI-O01 adapter task; assignment mutation remains UI-R05–R09 in US3.
- [X] T080 [US5] Implement the Effective Access Inspector UI in `apps/web/src/features/accessInspection/AccessInspectionPage.tsx`; show contributing paths, owner-gate distinction, redaction and non-disclosing refusal without impersonation. Wire this screen in `apps/web/src/App.tsx` during US5.
- [X] T081 [US5] Execute focused exact-source authorized query HTTP/PostgreSQL and actual Web checks for `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionContractTest.java` and `apps/web/src/features/accessInspection/AccessInspectionPage.tsx`; retain all-path/redaction/no-mutation/replay evidence in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [X] T082 [US5] Record US5 explanation/privacy evidence in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; preserve raw-log limitations and `NOT-RUN` verifier status until actual qualification.

## Phase 8: User Story 6 — final browser/accessibility/recovery qualification (Priority: P2)

**Purpose/goal**: Qualify integrated screens and recovery; do not postpone first actual client wiring until here.

**Independent checkpoint**: Actual trusted browser/keyboard, visible fail-closed errors and response loss; no fabricated context, persisted proof/bearer, accidental live adoption or unqualified DESIGN actions.

- [X] T083 [P] [US6] Write and run RED browser contract tests in `apps/web/src/features/iamIntegration/iamIntegration.browser.test.ts`; use actual same-origin packaged Web + trusted HTTPS, HttpOnly Secure SameSite cookie, CSRF, reload and invalidated-session behavior; do not use a test-only static server or TLS bypass.
- [X] T084 [P] [US6] Write and run RED accessibility requirements/interaction tests in `apps/web/src/features/iamIntegration/iamIntegration.accessibility.test.ts`; cover visible focus, logical keyboard order, dialog focus/Escape, current-screen errors, no color-only status and no clickable-div actions.
- [X] T085 [P] [US6] Write and run RED refusal/network/privacy tests in `apps/web/src/features/iamIntegration/iamIntegration.failure.test.ts`; cover unauthorized/expired/stale/unavailable/unresolved outcomes, no localStorage bearer, no client ActorId and no retained password/proof/cookie/CSRF evidence.
- [X] T086 [US6] Complete cross-screen shell/navigation/recovery integration in `apps/web/src/App.tsx` and `apps/web/src/features/iamIntegration/IamAdministrationShell.tsx`; each owner screen is already wired/qualified in US1–US5. Preserve foundational shared state, DESIGN-disabled actions and truthful errors; no new authentication or generic routing framework. Existing `AdminApp.tsx` is the qualified shell; no delegate-only replacement file was added for the plan's proposed filename.
- [X] T087 [US6] Execute and record final actual browser/keyboard/recovery qualification in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; link earlier separately qualified Q15 evidence rather than executing live adoption as browser setup; retain exact source/tools/target/results and keep Desktop/company identity outside scope.

## Phase 9: Polish and cross-cutting review

**Purpose/goal**: Close traceability, affected regression and handoff; integration remains a separate authorized action.

**Independent checkpoint**: Each completed operation has exact contract/source/test/execution evidence, independent disposition and truthful limits.

- [X] T088 Reconcile operation/permission/role/requirement crosswalks in `specs/009-iam-rbac-ui-integration/contracts/operations.md`, `contracts/permission-delegation.md`, `spec.md` and `quickstart.md`; ensure every implemented operation has a source, owner, test and evidence section.
- [X] T089 Add affected F03/health/session and data-privilege regression coverage in `apps/server/src/test/java/com/idea/ddm/identity` and `apps/server/src/test/java/com/idea/ddm/access`; preserve accepted F01–F05 behavior and raw evidence limits.
- [X] T090 Update implementation/handoff status in `docs/product/instances/idea-engineering/api/README.md`, `docs/product/instances/idea-engineering/api/handoff/README.md`, and `docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md`; distinguish DESIGN, IMPLEMENTED, qualified and accepted.
- [X] T091 Run the documentation-only checks from `specs/009-iam-rbac-ui-integration/quickstart.md`, including local links, IDs, `git diff --check` and no unresolved template markers; do not label runtime checks PASS from these results.
- [X] T092 Run the focused Server/Web/PostgreSQL qualification commands from `quickstart.md` only after the execution-readiness gate; retain exact source SHA, tool hashes, DB/schema boundaries, result counts and cleanup disposition in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [ ] T093 Prepare the reviewer package and merge/issue record in `specs/009-iam-rbac-ui-integration/integration-readiness.md` and `docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md` only after all required story evidence and external review are complete; do not close Issue #46, mark the feature complete, merge or run the verifier from this task list alone.

## Dependencies and execution order

- Phase 1 has only document/read-only preparation. Its Analyze and explicit gate precede every production/test/migration edit and every runtime/setup command in Phase 2 or any story; written spec/design PASS alone never clears PG2/PG3/PG4.
- Foundations: approved named fixtures → real eligibility and shared UoW → schema RED/GREEN → Project-owned read facts → single evaluator RED/GREEN → HTTP/Web shared state RED/GREEN → focused foundation qualification. No service uses an unevaluated privileged profile or a temporary parallel evaluator.
- Q15: foundations and supported immutable seed manifest → synthetic reauthentication/adoption RED/GREEN → separate evidence. Live estate adoption still needs its own exact-target operator approval. Fixture prerequisite assignments are not general role-grant implementation.
- US1 (P1): foundations plus separately qualified synthetic adoption where used; account HTTP and recipient/reissue tests → owner/adapters → real account/recipient routes → independent PostgreSQL/actual Web qualification. A fixture AA grant is a test prerequisite, not completion of US3.
- US2 (P1): foundations + US1 stable eligible context; Project queries/commands depend on the foundational evaluator/read seams, never on unfinished US3 assignment APIs. HTTP adapters and actual routes are part of US2.
- US3 (P1): foundations + US1 eligibility + US2 Project/Group state. Reuse the same evaluator; qualify UI-R01 catalogue reads before the wizard; assignment adapters cover UI-R05–R09 only. Scope/person-filter/Group-principal tests live here.
- US4 (P2): US3 delegation + protected immutable schema; candidate/activation and explicit replacement qualify together without changing predecessor assignments.
- US5 (P2): US3 all-path evaluator/assignment state + US4 version provenance. This is the single UI-R10/UI-A01/UI-O01 adapter owner; earlier slices display unresolved outcomes truthfully, not pretend the later resolution UI exists. Legacy Identity retry is never upgraded by this task sequence.
- US6 final: actual owner routes/state already integrated in US1–US5; browser/accessibility/recovery verifies and repairs only genuine gaps. Earlier Q15 results are linked, not repeated automatically.
- Polish: crosswalk, affected regressions and evidence after the desired slices; merge, issue closure, deployment, verifier and timer remain separate human-authorized actions.

### Parallel opportunities and examples

Only tasks marked [P] with distinct files and common already-qualified prerequisites may be authored in parallel. Run qualifications only under approved target/resource isolation; [P] is not delegated-worker authority. Shared readiness edits, migration, evaluator, routes, evidence and owner transactions are sequential.

For each story the marked separate RED files are independent authoring examples: US1 HTTP/isolation/Web/recipient/reissue; US2 owner/data/HTTP/Web; US3 assignment/recovery/wizard; US4 contract/immutability/Web; US5 query/privacy. US6 final browser/keyboard/network failure files may be prepared independently after the actual Web prerequisite exists; their shared-browser runs are serial unless separate target isolation is approved.

## Implementation strategy

**MVP**: complete document preparation and explicit gate, qualify shared foundations and separately bounded synthetic Q15 prerequisites, then the real US1 Account/Session/private credential vertical slice. Actual same-origin Server/Web/HTTPS/PG evidence and focused review precede Project/Group work. No mock-only MVP.

**Incremental delivery**: US2 Project/Group → US3 independent grants → US4 immutable custom → US5 safe explanation → US6 final real browser/recovery, retaining affected regressions and exact results at each slice. Q15 live adoption is never an implicit setup step.

## Historical task-ID crosswalk

Predecessor is `16f98e5c6a7c5919bcb29cf74e850215911594e7`, 75 tasks, all unchecked. Renumbering does not imply execution or rewrite that commit. Splits/moves below preserve all predecessor obligations; additive rows make missing tests/adapters/qualification explicit, not new product scope.

| Old ID | Successor ID(s) | Disposition |
|---|---|---|
| T001 | T001 | Retained, ordered and clarified |
| T002 | T002 | Retained, ordered and clarified |
| T003 | T003 | Retained, ordered and clarified |
| T004 | T008 | Fixture source after gate; separate prior document manifest |
| T005 | T004 | Retained, ordered and clarified |
| T006 | T009 | Retained, ordered and clarified |
| T007 | T010 | Retained, ordered and clarified |
| T008 | T011 | Retained, ordered and clarified |
| T009 | T012 | Retained, ordered and clarified |
| T010 | T013 | Retained, ordered and clarified |
| T011 | T014 | Retained, ordered and clarified |
| T012 | T015 | Retained, ordered and clarified |
| T013 | T022 | Retained, ordered and clarified |
| T014 | T020 | Retained, ordered and clarified |
| T015 | T007 | Explicit gate before all source/runtime work |
| T016 | T030 | Retained, ordered and clarified |
| T017 | T031 | Retained, ordered and clarified |
| T018 | T032 | Intentional temporary credential/proof controls retained |
| T019 | T035 | Retained, ordered and clarified |
| T020 | T036 | Retained, ordered and clarified |
| T021 | T037 | Extend existing credential route owner, no duplicate controller |
| T022 | T040 | Retained, ordered and clarified |
| T023 | T041 | Retained, ordered and clarified |
| T024 | T042 | Retained, ordered and clarified |
| T025 | T043 | Retained, ordered and clarified |
| T026 | T044 | Retained, ordered and clarified |
| T027 | T046 | Project UI tests; assignment modes move to US3 |
| T028 | T017, T048 | Split minimal shared authorization reads / authorized US2 projection |
| T029 | T049 | Retained, ordered and clarified |
| T030 | T050 | Retained, ordered and clarified |
| T031 | T052 | Retained, ordered and clarified |
| T032 | T047 | Atomicity RED before owner GREEN |
| T033 | T054 | Retained, ordered and clarified |
| T034 | T018 | Evaluator RED moved to foundation |
| T035 | T055 | Retained, ordered and clarified |
| T036 | T056 | Retained, ordered and clarified |
| T037 | T019 | Single shared evaluator moved to foundation |
| T038 | T059 | Retained, ordered and clarified |
| T039 | T060 | Retained, ordered and clarified |
| T040 | T061 | Assignment adapters UI-R05–R09 only |
| T041 | T062 | Retained, ordered and clarified |
| T042 | T058 | Atomicity RED before owner GREEN |
| T043 | T064 | Retained, ordered and clarified |
| T044 | T065 | Retained, ordered and clarified |
| T045 | T066 | Retained, ordered and clarified |
| T046 | T069 | Retained, ordered and clarified |
| T047 | T070 | Retained, ordered and clarified |
| T048 | T071 | Retained, ordered and clarified |
| T049 | T072 | Retained, ordered and clarified |
| T050 | T068 | Atomicity RED before owner GREEN |
| T051 | T074 | Retained, ordered and clarified |
| T052 | T075 | Retained, ordered and clarified |
| T053 | T076 | Retained, ordered and clarified |
| T054 | T078 | Retained, ordered and clarified |
| T055 | T079 | Sole inspection/history/resolution adapters |
| T056 | T080 | Retained, ordered and clarified |
| T057 | T077 | Query regression RED before GREEN |
| T058 | T082 | Retained, ordered and clarified |
| T059 | T083 | Retained, ordered and clarified |
| T060 | T084 | Retained, ordered and clarified |
| T061 | T085 | Retained, ordered and clarified |
| T062 | T023 | Shared Web state before first account slice |
| T063 | T086 | Final integration, not first routing |
| T064 | T025 | Separate prerequisite Q15 RED |
| T065 | T028 | Console follows qualified owner service |
| T066 | T027 | Separate prerequisite Q15 owner GREEN |
| T067 | T026 | Q15 negatives before GREEN |
| T068 | T029, T087 | Split synthetic Q15 / final browser evidence |
| T069 | T088 | Retained, ordered and clarified |
| T070 | T089 | Retained, ordered and clarified |
| T071 | T090 | Retained, ordered and clarified |
| T072 | T091 | Retained, ordered and clarified |
| T073 | T092 | Retained, ordered and clarified |
| T074 | T006 | Read-only Analyze moved before execution gate |
| T075 | T093 | Retained, ordered and clarified |

Additive tasks: T005, T016, T021, T024, T033, T034, T038, T039, T045, T051, T053, T057, T063, T067, T073, T081. At the frozen decomposition source `aaa5596a`, all 93 tasks were planned/unchecked; 16 additive tasks plus explicit splits, no requirement additions. Current preparation completion is recorded above without rewriting that historical state.
