# Tasks: Native Account and Scoped RBAC UI Integration

**Input**: Design documents from `/specs/009-iam-rbac-ui-integration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`.

**Status**: Draft task decomposition only. No task is authorized or executed by this file. Runtime,
database, browser, build and verifier results remain `NOT-RUN` until the separate execution gate.

**Organization**: Tasks are grouped by the six user stories in `spec.md`. The sequence follows the
accepted plan: account/session, Project/Group, effective evaluator and assignments, Custom Role,
safe explanation, then browser/accessibility/recovery. Q15 console adoption is a separate US6 slice
and is never part of bootstrap or migration seeding.

## Phase 1: Setup (Shared Planning and Execution Envelope)

**Purpose**: Establish the exact implementation boundary without changing the accepted runtime graph.

- [ ] T001 Read `specs/009-iam-rbac-ui-integration/plan.md`, `research.md`, `data-model.md`, `contracts/operations.md`, `contracts/permission-delegation.md`, `contracts/web-flow.md`, and `quickstart.md`; record the selected owner seams and all `DESIGN`/`IMPLEMENTED` boundaries in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [ ] T002 [P] Confirm the exact Java 25, Spring Boot 4.1.1, JDBC/PostgreSQL, React 19.3.0, TypeScript 7.0.2, Vite 8.3.1, Node 24.19.0 and browser/tooling sources already admitted for this increment; record any missing/hash-drift artifact as a STOP in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [ ] T003 [P] Create the implementation branch/worktree and preserve the primary checkout's user-owned `apps/web/package.json` change; record branch, base SHA and worktree in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [ ] T004 [P] Define the approved synthetic Organization, Actor, Account, Login Identity, Project, Group and role fixtures in `apps/server/src/test/java/com/idea/ddm/iam/IamIntegrationFixtures.java`; do not use company identities or credentials.
- [ ] T005 Confirm the current migration number and V1–V10 checksums before adding any migration under `database/migrations/`; record the selected next version and rollback/forward-repair boundary in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared identity, ownership, transaction, schema and client seams required by every story.

**Checkpoint**: No user-story implementation starts until these foundations are reviewed and the execution-readiness gate is explicitly cleared.

- [ ] T006 Add RED tests for real server-established `ActorContext` and current session eligibility at `apps/server/src/test/java/com/idea/ddm/identity/OwnerSessionEligibilityTest.java`; include revoked, stale security version, disabled account, idle/absolute expiry and runtime-instance cases.
- [ ] T007 Implement the read-only current eligibility/context port in `apps/server/src/main/java/com/idea/ddm/identity/OwnerSessionEligibility.java`; preserve lock `73003002`, never accept client-supplied `ActorId`, and never re-enter IAM mutation from an Access Policy query.
- [ ] T008 Add RED tests for owner commit coordination and atomic owner outcome/authorization evidence/Audit fate in `apps/server/src/test/java/com/idea/ddm/identity/IdentityTransactionsTest.java`; include forced evidence failure and concurrent security-write cases.
- [ ] T009 Extend the existing JDBC transaction seam in `apps/server/src/main/java/com/idea/ddm/identity/IdentityTransactions.java` so new owner modules revalidate session/account, delegation, membership and expected state under the shared security-write coordination before commit.
- [ ] T010 Add the additive successor schema and privilege RED tests in `apps/server/src/test/java/com/idea/ddm/iam/IamSchemaPrivilegeTest.java` and the next migration file under `database/migrations/V11__iam_rbac_ui_successor.sql` (or the exact next unused version); preserve V1–V10 bytes/checksums, keep migrator ownership, deny runtime blanket `UPDATE/DELETE/TRUNCATE`, and use separate candidate staging for mutable drafts.
- [ ] T011 Implement the additive IAM/Project/Group/assignment schema in `database/migrations/V11__iam_rbac_ui_successor.sql` (or the exact next unused migration path recorded by T005); preserve legacy `revoked_at` as canonical termination, map every predecessor revoked row without resurrection, enforce same-Organization/same-Project relationships, and keep activated role/version content immutable.
- [ ] T012 Add named identity/session and owner-command fixture helpers in `apps/server/src/test/java/com/idea/ddm/iam/IamTestFixture.java`; expose zero raw UUID-array indexing to story tests and keep password/proof/session secrets out of retained evidence.
- [ ] T013 Add the Web API adapter foundation in `apps/server/src/main/java/com/idea/ddm/iam/IamWebConfiguration.java` and `apps/web/src/api/iamClient.ts`; reuse same-origin HttpOnly Secure SameSite session + CSRF, never JWT/localStorage bearer or client-authoritative ActorId.
- [ ] T014 Add shared error, correlation and safe-response mapping tests in `apps/server/src/test/java/com/idea/ddm/iam/IamHttpContractTest.java`; preserve accepted Identity empty-body/error mappings and use bounded 400/401/403/404/409/503 semantics for new DESIGN adapters only.
- [ ] T015 Publish an execution-readiness record in `specs/009-iam-rbac-ui-integration/integration-readiness.md` covering exact source SHA, tool/cache/license hashes, separate migrator/app roles, approved test database/schema, trusted HTTPS and STOP/cleanup rules; do not run runtime commands from this task.

## Phase 3: User Story 1 — Manage an actual IDEA Account (Priority: P1) 🎯 MVP

**Goal**: Connect the existing presentation to real native Actor/Account/Login Identity state while preserving PENDING, proof privacy and independent account authority.

**Independent Test**: A real eligible Account Administrator can read authorized account data, create PENDING accounts, disable/re-enable and issue/redeem exact setup/reset proofs; ordinary, wrong-scope and stale sessions are refused; no Project/Group/Role Assignment is created implicitly.

- [ ] T016 [P] [US1] Add RED HTTP contract tests for `UI-I01`–`UI-I06` in `apps/server/src/test/java/com/idea/ddm/identity/IdentityAccountUiContractTest.java`; cover current context, redacted directory/detail, create/disable/re-enable, exact `loginIdentityId` proof targeting, one-use/expiry and sibling-login reset semantics.
- [ ] T017 [P] [US1] Add RED database tests for zero implicit Project Membership, Group Membership and Role Assignment after account creation in `apps/server/src/test/java/com/idea/ddm/identity/AccountIsolationTest.java`.
- [ ] T018 [P] [US1] Add RED Web tests in `apps/web/src/features/accountAdministration/accountAdministration.test.tsx` for loading, authorized empty, refusal, stale conflict, unavailable and unresolved states; never render password, proof or server credential material.
- [ ] T019 [US1] Implement authorized redacted directory/context projections in `apps/server/src/main/java/com/idea/ddm/identity/IdentityDirectoryQueries.java`; preserve Actor/Account/Login Identity separation, Account 0..* Login Identities, security-version redaction and scope filtering.
- [ ] T020 [US1] Implement the Account Administration owner adapter in `apps/server/src/main/java/com/idea/ddm/identity/IdentityAccountAdministration.java`; reuse qualified create/disable/re-enable operations, require exact expected security version/reason, and keep owner outcome/evidence/Audit atomic.
- [ ] T021 [US1] Implement manual setup/reset proof issuance and redemption adapters in `apps/server/src/main/java/com/idea/ddm/identity/CredentialProofController.java` and `apps/server/src/main/java/com/idea/ddm/identity/CredentialProofDelivery.java`; require exact target login, keep setup/reset permissions separate, use no-store transient handoff, and never promise plaintext recovery after response loss.
- [ ] T022 [US1] Implement the Account Administration UI in `apps/web/src/features/accountAdministration/AccountAdministrationPage.tsx`; show truthful PENDING/ACTIVE/DISABLED state, separate account versus credential actions, and refuse to infer Project or product access.
- [ ] T023 [US1] Add targeted UI/API validation for `apps/web/src/features/accountAdministration/AccountAdministrationPage.tsx` and `apps/server/src/test/java/com/idea/ddm/identity/IdentityAccountUiContractTest.java`; verify session invalidation after disable/reset, same-identity re-enable, proof privacy and no implicit access.
- [ ] T024 [US1] Record the US1 evidence and exact executed source in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; preserve raw-log limitations and mark only the actually qualified operations `IMPLEMENTED`.

## Phase 4: User Story 2 — Establish Project and Group participation (Priority: P1)

**Goal**: Add Project Governance-owned Project, Project Membership, Business Group and Group Membership state with explicit administrative versus engineering participation boundaries.

**Independent Test**: An Organization-scoped Project Administrator can create a Project without implicit creator membership/grants, administer covered Projects/Groups without personal membership, and add only an active same-Project member to a Group; Project-only and cross-scope attempts refuse.

- [ ] T025 [P] [US2] Add RED owner tests for `UI-P01`–`UI-P13` in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceContractTest.java`; cover Org create, Project-only refusal, Project/Group version conflicts, direct membership history, Group target membership and cross-Organization rejection.
- [ ] T026 [P] [US2] Add RED migration/relationship tests in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceDataTest.java`; enforce `Actor/Project` and `Actor/Group` same-Organization relationships, no nesting, one unended association and retained ended history.
- [ ] T027 [P] [US2] Add RED Web tests in `apps/web/src/features/projectAdministration/projectAdministration.test.tsx` for Scope → person-in-Group-filter versus explicit Group-principal mode, membership-independent administration and truthful refusal states.
- [ ] T028 [US2] Implement Project Governance entities and JDBC owner queries in `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java`; preserve Project/Group identity, display name limits (nonblank, <=200 characters, no control characters) and stable version fields.
- [ ] T029 [US2] Implement Project/Group owner commands in `apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceAdministration.java`; require Org-scoped `project.create`, prevent Project-only creation, increment the exact parent/association version, and create no implicit creator membership/assignment.
- [ ] T030 [US2] Implement Project Membership and Group Membership commands in `apps/server/src/main/java/com/idea/ddm/project/ProjectParticipationAdministration.java`; require active same-Project member for Group targets, retain ended rows, and keep direct administration separate from participation.
- [ ] T031 [US2] Implement Project Administration UI in `apps/web/src/features/projectAdministration/ProjectAdministrationPage.tsx`; show fixed permitted Scope, membership/history state and Group mode explicitly without Department-derived authority or local role arrays.
- [ ] T032 [US2] Add owner transaction, expected-version and refusal evidence in `apps/server/src/test/java/com/idea/ddm/project/ProjectGovernanceAtomicityTest.java`; force outcome/Audit failure and concurrent membership/Group updates to prove zero partial success.
- [ ] T033 [US2] Record independent US2 evidence and source trace in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; do not mark Product Configuration, Document or Workflow operations implemented.

## Phase 5: User Story 3 — Grant several independent scoped roles (Priority: P1)

**Goal**: Provide one authoritative evaluator and role-assignment administration for multiple independent Actor/Group assignments with exact role version, principal, scope, interval and delegation limits.

**Independent Test**: One Actor can hold AA, PA and PRA assignments independently; direct Actor and Group paths union positively; end/replace affects only the selected path; wrong scope, unsupported role/principal, self-broadening, expired interval and last-recovery removal refuse atomically.

- [ ] T034 [P] [US3] Add RED evaluator tests in `apps/server/src/test/java/com/idea/ddm/access/AuthorizationDecisionTest.java`; cover all applicable direct/Group paths, positive union, current IAM eligibility, half-open intervals and owner business-gate separation.
- [ ] T035 [P] [US3] Add RED assignment contract tests for `UI-R05`–`UI-R09` in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentContractTest.java`; cover exact version pinning, scope containment, operation replay, changed-input refusal, different-Actor non-disclosure and concurrency.
- [ ] T036 [P] [US3] Add RED last-recovery and protected-DML tests in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentRecoveryTest.java`; count distinct eligible Actors across supported Super versions and retain SQLSTATE `42501` raw mutation refusals.
- [ ] T037 [US3] Implement the single Access Policy evaluator in `apps/server/src/main/java/com/idea/ddm/access/AuthorizationDecisionService.java`; resolve all applicable IAM/Project/Group paths through read-only eligibility, preserve immutable provenance and fail closed on unavailable evidence.
- [ ] T038 [US3] Implement role catalogue/version queries in `apps/server/src/main/java/com/idea/ddm/access/RoleCatalogueQueries.java`; keep Super@1, AA@1 and AA@2 immutable, expose DESIGN versions as non-selectable until qualified, and never select by role name alone.
- [ ] T039 [US3] Implement assignment preview/grant/end/replace owner commands in `apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentAdministration.java`; require exact principal/scope/delegation envelope, new ID on regrant, canonical `revoked_at` termination and atomic predecessor/successor transition.
- [ ] T040 [US3] Implement assignment and access-inspection adapters in `apps/server/src/main/java/com/idea/ddm/access/RoleAssignmentController.java`; use real session eligibility, no client ActorId authority, redacted non-disclosing errors and operation-specific replay only.
- [ ] T041 [US3] Implement the assignment wizard in `apps/web/src/features/accessAdministration/AssignmentWizard.tsx`; enforce Scope → person within Group filter or explicit Group principal → exact Role/version → consequence/reason/confirm, with independent multi-role display.
- [ ] T042 [US3] Add concurrent, stale-state, revoke-before-commit and forced-evidence failure tests in `apps/server/src/test/java/com/idea/ddm/access/RoleAssignmentAtomicityTest.java`; prove no duplicate Audit/event or partial authority.
- [ ] T043 [US3] Record US3 multi-role/scope/delegation evidence in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; explicitly distinguish direct administration from technical Project membership.

## Phase 6: User Story 4 — Evolve a supported Custom Role (Priority: P2)

**Goal**: Compose only registered, supported Custom permissions, validate/activate immutable successors and preserve every predecessor assignment.

**Independent Test**: A permitted role administrator prepares and validates a candidate, activation appends a sealed successor, invalid/stale/self-authorizing candidates refuse, and existing assignments remain pinned until explicit replacement.

- [ ] T044 [P] [US4] Add RED candidate/activation contract tests for `UI-R01`–`UI-R04` in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleContractTest.java`; cover supported Custom ceiling (`project.read`, scoped read/inspection only initially), built-in immutability and stale base.
- [ ] T045 [P] [US4] Add RED protected-version tests in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleImmutabilityTest.java`; prove draft staging is separate, activation inserts a complete sealed version, and no `UPDATE/DELETE` or late permission insertion mutates active content.
- [ ] T046 [US4] Implement candidate staging and validation in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionCandidateService.java`; enforce nonempty principal/scope support sets, exact management scope, registered Permission codes and no candidate-defined delegation ceiling.
- [ ] T047 [US4] Implement immutable successor activation in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionActivationService.java`; require expected active base, append complete content once, pin digest/version and leave predecessor assignments unchanged.
- [ ] T048 [US4] Implement Custom Role candidate/activation adapters in `apps/server/src/main/java/com/idea/ddm/access/RoleDefinitionController.java`; keep all unsupported/product-domain operations `DESIGN` and refuse arbitrary conditions/scripts.
- [ ] T049 [US4] Implement Custom Role UI in `apps/web/src/features/accessAdministration/CustomRoleEditor.tsx`; show permission difference, management scope, principal support, successor state and explicit replacement boundary.
- [ ] T050 [US4] Add Custom Role replacement/replay/evidence-failure tests in `apps/server/src/test/java/com/idea/ddm/access/CustomRoleAtomicityTest.java`; preserve old assignment IDs/content and distinguish confirmed rollback from uncertain commit outcome.
- [ ] T051 [US4] Record US4 immutable-role evidence and exact source trace in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; do not claim a generic policy engine or product Permission invention.

## Phase 7: User Story 5 — Explain current access safely (Priority: P2)

**Goal**: Provide redacted, authorized explanation of current contributing paths while keeping owner business gates and immutable provenance separate.

**Independent Test**: An authorized inspector sees all applicable direct/Group paths and role/version/scope pins; unauthorized or cross-scope inspection discloses nothing; RBAC eligibility is clearly separate from owner refusal.

- [ ] T052 [P] [US5] Add RED access-inspection/history/operation-resolution tests for `UI-R10`, `UI-A01` and `UI-O01` in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionContractTest.java`; cover originator/current eligibility, independent authorized inspector policy, different-Actor non-disclosure and no duplicate Audit/event.
- [ ] T053 [P] [US5] Add RED privacy tests in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionPrivacyTest.java`; prove no credentials, proofs, cookies, CSRF values or unauthorized target metadata appear in responses, logs or UI state.
- [ ] T054 [US5] Implement redacted all-path access inspection and administration history queries in `apps/server/src/main/java/com/idea/ddm/access/AccessInspectionQueries.java`; use current authorization, immutable provenance and owner-specific query policies, never a second evaluator.
- [ ] T055 [US5] Implement safe access/history/operation-resolution adapters in `apps/server/src/main/java/com/idea/ddm/access/AccessInspectionController.java`; keep legacy Identity retry semantics unchanged and distinguish committed, refused, rollback-confirmed and uncertain outcomes.
- [ ] T056 [US5] Implement the Effective Access Inspector UI in `apps/web/src/features/accessInspection/AccessInspectionPage.tsx`; show contributing paths, owner-gate distinction, redaction and non-disclosing refusal without impersonation.
- [ ] T057 [US5] Add operation-resolution and Audit atomicity regression tests in `apps/server/src/test/java/com/idea/ddm/access/AccessInspectionAtomicityTest.java`; prove read-only inspection never mutates assignments or owner state.
- [ ] T058 [US5] Record US5 explanation/privacy evidence in `specs/009-iam-rbac-ui-integration/integration-readiness.md`; preserve raw-log limitations and `NOT-RUN` verifier status until actual qualification.

## Phase 8: User Story 6 — Complete administration honestly and accessibly (Priority: P2)

**Goal**: Qualify complete Web administration interaction, refusal/recovery states, keyboard/focus behavior and the separate Q15 adoption seam.

- [ ] T059 [P] [US6] Add RED browser contract tests in `apps/web/src/features/iamIntegration/iamIntegration.browser.test.ts`; use actual same-origin packaged Web + trusted HTTPS, HttpOnly Secure SameSite cookie, CSRF, reload and invalidated-session behavior; do not use a test-only static server or TLS bypass.
- [ ] T060 [P] [US6] Add RED accessibility requirements/interaction tests in `apps/web/src/features/iamIntegration/iamIntegration.accessibility.test.ts`; cover visible focus, logical keyboard order, dialog focus/Escape, current-screen errors, no color-only status and no clickable-div actions.
- [ ] T061 [P] [US6] Add RED refusal/network/privacy tests in `apps/web/src/features/iamIntegration/iamIntegration.failure.test.ts`; cover unauthorized/expired/stale/unavailable/unresolved outcomes, no localStorage bearer, no client ActorId and no retained password/proof/cookie/CSRF evidence.
- [ ] T062 [US6] Implement shared IAM Web state/adapters in `apps/web/src/features/iamIntegration/iamIntegrationState.ts`; model loading, authorized empty, refusal, stale, unavailable and unresolved states without mock/dev authority.
- [ ] T063 [US6] Integrate the existing presentation into real Account, Project, Group, Assignment and Inspector routes in `apps/web/src/app/routes.tsx` and `apps/web/src/features/iamIntegration/IamAdministrationShell.tsx`; keep DESIGN-only operations disabled and preserve truthful server errors.

### Separate Q15 console-adoption slice (not bootstrap, migration seed or HTTP)

- [ ] T064 [US6] Add RED console-adoption tests in `apps/server/src/test/java/com/idea/ddm/access/SuperSuccessorAdoptionTest.java`; cover same Actor/Organization ACTIVE account, real Login Identity reauthentication, exact Super@2 assignment, OperationId/reason/outcome/evidence/Audit and old Super@1/bootstrap marker preservation.
- [ ] T065 [US6] Implement the local interactive adoption command in `apps/server/src/main/java/com/idea/ddm/identity/SuperSuccessorAdoptionCommand.java`; require named operator authorization, exact target/version and no password arguments/environment/logs; never expose an HTTP route or startup callback.
- [ ] T066 [US6] Implement the adoption owner transaction in `apps/server/src/main/java/com/idea/ddm/access/SuperSuccessorAdoptionService.java`; recheck current Super@1/security state under lock, reuse qualified exact-login throttle fate, append Super@2 assignment/evidence/Audit atomically and resolve repeat as `ALREADY_ADOPTED`.
- [ ] T067 [US6] Add adoption negative/recovery tests in `apps/server/src/test/java/com/idea/ddm/access/SuperSuccessorAdoptionNegativeTest.java`; cover wrong Actor/Organization, stale/revoked/disabled/blocked/failed reauthentication, evidence failure, no duplicate grant and last-effective-recovery protection.
- [ ] T068 [US6] Add actual browser/keyboard/recovery qualification evidence and console adoption evidence to `specs/009-iam-rbac-ui-integration/integration-readiness.md`; retain exact source/tool/target hashes and keep Desktop/company identity outside this feature.

## Phase 9: Polish and Cross-Cutting Concerns

**Purpose**: Close traceability, regression, privacy and handoff work after the desired stories are qualified.

- [ ] T069 [P] Reconcile operation/permission/role/requirement crosswalks in `specs/009-iam-rbac-ui-integration/contracts/operations.md`, `contracts/permission-delegation.md`, `spec.md` and `quickstart.md`; ensure every implemented operation has a source, owner, test and evidence section.
- [ ] T070 [P] Add affected F03/health/session and data-privilege regression coverage in `apps/server/src/test/java/com/idea/ddm/identity` and `apps/server/src/test/java/com/idea/ddm/access`; preserve accepted F01–F05 behavior and raw evidence limits.
- [ ] T071 [P] Update implementation/handoff status in `docs/product/instances/idea-engineering/api/README.md`, `docs/product/instances/idea-engineering/api/handoff/README.md`, and `docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md`; distinguish DESIGN, IMPLEMENTED, qualified and accepted.
- [ ] T072 [P] Run the documentation-only checks from `specs/009-iam-rbac-ui-integration/quickstart.md`, including local links, IDs, `git diff --check` and no unresolved template markers; do not label runtime checks PASS from these results.
- [ ] T073 Run the focused Server/Web/PostgreSQL qualification commands from `quickstart.md` only after the execution-readiness gate; retain exact source SHA, tool hashes, DB/schema boundaries, result counts and cleanup disposition in `specs/009-iam-rbac-ui-integration/integration-readiness.md`.
- [ ] T074 Run the read-only `speckit-analyze` workflow against `specs/009-iam-rbac-ui-integration/spec.md`, `plan.md`, `tasks.md`, `contracts/` and `integration-readiness.md` after these tasks are reviewed; resolve genuine cross-artifact contradictions before any implementation task is authorized.
- [ ] T075 Prepare the reviewer package and merge/issue record in `specs/009-iam-rbac-ui-integration/integration-readiness.md` and `docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md` only after all required story evidence and external review are complete; do not close Issue #46, mark the feature complete, merge or run the verifier from this task list alone.

## Dependencies and Execution Order

### Phase dependencies

- **Setup (Phase 1)**: T001–T005; documentation and environment-boundary preparation only.
- **Foundational (Phase 2)**: T006–T015; blocks all user stories and requires the separate execution-readiness gate.
- **US1 (Phase 3)**: T016–T024; MVP and first executable vertical slice.
- **US2 (Phase 4)**: T025–T033; depends on US1 fixtures/session and foundational owner seams.
- **US3 (Phase 5)**: T034–T043; depends on US2 Project/Group state and US1 eligibility.
- **US4 (Phase 6)**: T044–T051; depends on US3 delegation/evaluator and protected schema.
- **US5 (Phase 7)**: T052–T058; depends on US3 evaluator and US4 immutable role paths.
- **US6 (Phase 8)**: T059–T068; UI integration can begin after US1–US5 contracts, while Q15 remains a separate explicitly gated console slice.
- **Polish (Phase 9)**: T069–T075; depends on the desired story slices and external review.

### User story dependencies

- **US1 (P1)**: Foundation only; MVP account/session slice.
- **US2 (P1)**: Foundation + US1 stable Actor/Organization fixtures and eligible session.
- **US3 (P1)**: Foundation + US1 eligibility + US2 Project/Group and membership state.
- **US4 (P2)**: US3 evaluator, delegation envelope and immutable role storage.
- **US5 (P2)**: US3 all-path evaluator and US4 role/version provenance.
- **US6 (P2)**: US1–US5 server contracts for honest Web states; Q15 also requires explicit console execution approval and does not depend on HTTP route creation.

### Parallel opportunities

- T002–T004 can run in parallel after T001; T006/T008/T010/T012/T014 are separate RED/design-preflight tracks after foundational ownership is agreed.
- T016–T018 can run in parallel before US1 implementation; T019–T022 should then proceed through the IAM owner seam before T023/T024.
- T025–T027 can run in parallel before US2 owner implementation; T028–T031 are separable by query, command and Web surface; T032 is after owner commands.
- T034–T036 can run in parallel before evaluator/assignment implementation; T037–T041 are sequential owner-to-adapter-to-UI work.
- T044/T045 can run in parallel; T046–T049 follow the candidate storage seam; T050 is after activation/replacement paths.
- T052/T053 can run in parallel; T054–T056 follow the evaluator; T057 follows query implementation.
- T059–T061 can run in parallel after the real Web packaging seam is available; T064 and T065 can be designed in parallel, but T066 depends on both and T067 follows it.
- T069–T072 are documentation/regression preparation tracks; T073–T075 are final gates and remain sequential.

## Implementation Strategy

### MVP first (US1 only)

1. Complete T001–T015 and pass the separate execution-readiness gate.
2. Execute US1 RED tests, then implement the smallest real Account/Session vertical slice.
3. Validate US1 independently against PostgreSQL and actual same-origin Web/HTTPS.
4. Stop for focused external review before starting Project/Group work.

### Incremental delivery

1. Add US2 Project/Group participation while keeping US1 regressions green.
2. Add US3 evaluator and independent assignment paths; qualify wrong scope, Group mode and recovery.
3. Add US4 immutable Custom Role successors, then US5 safe explanation.
4. Add US6 browser/accessibility/recovery qualification; execute Q15 only through its separate approved console seam.
5. Complete traceability/regression/handoff, then seek whole-feature review and integration separately.

### Notes

- Every task uses `- [ ] T###`, optional `[P]`, and a required `[US#]` label for user-story tasks.
- No task checkbox is pre-completed; a checked task never substitutes for evidence or external acceptance.
- `verify-template`, deployment, company identity, Desktop/Workspace, Product Configuration, Document/Checkout/Approval/Release and F04/F05 work remain outside this feature.
