---
description: "Dependency-ordered PH1 delivery tasks for F01–F05"
---

# Tasks: PH1 Foundation and Single-Vault Custody

**Input**: [spec](spec.md), [plan](plan.md), [data model](data-model.md),
[boundary contract](contracts/ph1-boundaries.md) and [validation guide](quickstart.md).
**Scope**: The 72 planned hours in F01-A/B, F02, F03-A/B, F04 and F05-A/B. Hours are card
estimates, never actual effort. Each card needs its own executed evidence before completion.
**Tests**: Required by SC-001–006 and repository TDD workflow. Write the relevant failing test
before its behavior and retain red/green results. A Windows result cannot stand in for an Ubuntu
result or vice versa.

Before implementing or reviewing PH1 tasks, read the [worker handoff](worker-handoff.md) for
execution boundaries and CHK009/CHK010 evidence expectations. This task list remains the execution source.

## Phase 1: Setup — F01-A prerequisites

**Goal**: Start from the approved PG4 scope without importing unqualified dependencies.

- [X] T001 Record source commit, F01-A Work Item link and approved PH1 boundary in `specs/005-ph1-foundation-custody/evidence/F01-A-source-and-scope.md`.
- [X] T002 Record F01 direct dependency source, version, license and intended internal use in `docs/research/2026-09-28-ph1-f01-dependency-intake.md`. The first Windows NuGet restore preceded exact transitive evidence, and direct Web LICENSE/NOTICE files were checked after initial `npm ci`. The Project Reviewer closed this F01-A internal build/test prerequisite by one-time timing exceptions on 2026-09-28, documented in the linked NuGet audit and Web section of the intake. This does not make the before-first-use rule retrospectively true, qualify every resolved package, authorize new imports, or clear commercial distribution. Retain the residual risks and T013/T036 follow-up.
- [X] T003 Create build-only scaffolds in `apps/server/pom.xml`, `apps/server/mvnw`, `apps/server/.mvn/wrapper/maven-wrapper.properties`, `apps/web/package.json`, `apps/web/package-lock.json`, `apps/desktop/IdeaDesktop.csproj`, `apps/workspace/IdeaWorkspace.csproj`, `apps/desktop/tests/IdeaDesktop.Tests.csproj` and `apps/workspace/tests/IdeaWorkspace.Tests.csproj`; document their ownership in `apps/README.md`. Do not add application behavior yet.

## Phase 2: Shared foundation — F01-A/B

**Goal**: Give all four projects reproducible build and configuration boundaries before behavior.

- [X] T004 Add non-secret development configuration names and validation rules to `config/idea-core-v0.server.env.example`; keep filled values ignored by `.gitignore`.
- [X] T005 Add one reproducible command per platform and explain required Ubuntu/Windows tools in `apps/README.md` and `deploy/development/README.md`.

## Phase 3: User Story 1 — Buildable application foundation (F01-A/B, P1) 🎯 MVP

**Goal**: Four minimal buildable projects and retained basic-check results from one commit.
**Independent test**: Follow [quickstart](quickstart.md) from clean checkouts on Ubuntu and
Windows; record four project results and a secret/lockfile review.

- [X] T006 [P] [US1] Write a minimal Server context/health test in `apps/server/src/test/java/com/idea/ddm/ServerSmokeTest.java`. Its post-implementation pass is retained; the Project Reviewer accepted an explicit exception for the missing original red-run evidence on 2026-09-28. This does not assert that an intended red run was observed.
- [X] T007 [P] [US1] Write a Web entry-point test in `apps/web/src/App.test.tsx`. Its post-implementation pass is retained under the same 2026-09-28 red-evidence exception.
- [X] T008 [P] [US1] Write Desktop and Workspace startup checks in `apps/desktop/tests/DesktopSmokeTests.cs` and `apps/workspace/tests/WorkspaceSmokeTests.cs`. Both post-implementation passes are retained under the same 2026-09-28 red-evidence exception.
- [X] T009 [US1] Create the selected Java 25 Spring Boot/Modulith Maven build and minimal health entry point in `apps/server/pom.xml` and `apps/server/src/main/java/com/idea/ddm/IdeaServerApplication.java`; implementation and individual Server build result are recorded in [F01-A build results](evidence/F01-A-build-results.md).
- [X] T010 [P] [US1] Implement the minimal React/TypeScript/Vite entry point in `apps/web/src/App.tsx` using the qualified build scaffold and resolved lockfile from T003.
- [X] T011 [P] [US1] Implement the narrow WPF/WebView2 shell in `apps/desktop/App.xaml.cs` and the .NET 10 Workspace startup boundary in `apps/workspace/WorkspaceHost.cs`.
- [X] T012 [US1] Run all four builds/basic checks on their qualified platforms, record command, tool versions, commit and actual result in [F01-A build results](evidence/F01-A-build-results.md). All checks passed from clean platform-specific archives of the same committed source revision; scope limits are recorded with each result.
- [X] T013 [US1] Add and run a repeatable tracked-secret detection check in `tests/ph1/check-no-secrets.ps1`; repeat builds from clean source, inspect lockfiles against intake, and record F01-B evidence in `specs/005-ph1-foundation-custody/evidence/F01-B-reproducibility.md`. Project Reviewer accepted and closed F01-B; the published Execution Register records completion. Wider license review remains T036.

## Phase 4: User Story 2 — Controlled data baseline (F02, P1)

**Goal**: A fresh dev database is created from ordered changes; health and bounded failure
results are distinguishable. This is not operational restore evidence.
**Independent test**: Fresh migration, repeat validation, one bounded rollback/failure case and
healthy/unavailable database probes.

- [X] T014 [US2] Write failing migration/health integration checks in `apps/server/src/test/java/com/idea/ddm/DataBaselineTest.java`.
- [X] T015 [US2] Add versioned schema for the PH1 identities and metadata in `database/migrations/V1__ph1_foundation.sql` and package that source through `apps/server/pom.xml`; use only the separate migration role.
- [X] T016 [US2] Implement separate application and database health outcomes in `apps/server/src/main/java/com/idea/ddm/health/DataHealthController.java`.
- [X] T017 [US2] Run fresh migration, repeat validation and bounded rollback/failure procedure; retain actual SQL/version/health results in `specs/005-ph1-foundation-custody/evidence/F02-data-results.md`. Executed evidence is `PASS`; Project Reviewer accepted and closed F02 on 2026-09-30, published in Execution Register revision 26.

## Phase 5: User Story 3 — Controlled native account and session (F03-A/B, P1)

**Goal**: Bootstrap one administrator without public registration and reject invalidated sessions.
**Independent test**: Bootstrap once, repeat without a new privilege, then sign in, sign out,
disable/revoke and retry a protected call.

**F03-A/F03-B execution split (Project Reviewer approved 2026-09-30; Work Item #22):**

- F03-A: one-time local Super Administrator bootstrap; separate explicit, audited Account
  Administrator assignment; create/disable/re-enable account services. Test the Server service
  boundary on real PostgreSQL, including exact role-version/scope, refusal, preserved identity
  and atomic failure. The test-only trusted Actor context is not HTTP authentication evidence.
- F03-B: verified HTTP login/session-derived Actor context, sign-out/revocation, CSRF, expiry and
  old-session refusal after re-enable, plus protected first credential setup and temporary
  failed-login block under spec v0.4's synthetic development profile. Work Item #24 owns this
  continuation. The Project Reviewer approved real HTTP/real PostgreSQL and accelerated timing
  tests on 2026-09-30; HTTP/session work remains unchecked until actually executed.
- T018/T021/T022 span both cards: record partial F03-A evidence without checking their markers
  as though F03-B were done. T019 may close independently after its actual bootstrap evidence.
- Preserve reviewed V1/V2. V2 supplies bootstrap organization/role/assignment state; add
  `database/migrations/V3__account_administration.sql` for the account-administration permission
  subset, Organization-linked accounts and required authorization/change evidence.
- The approved seed is only the F03 account-administration subset, not the full open permission
  catalogue. No document, Approval or Release authority is granted by account creation.

**F03-A acceptance:** Project Reviewer accepted the agreed whole-card scope on 2026-09-30
after a no-blocker check of reviewed head `79373e95502474e64dd2a72604c2d9629daa9e36`.
Tracker records COMPLETED / PASS in local Execution Register revision 28, 2.25 actual hours,
0 remaining; see [F03 evidence](evidence/F03-identity-results.md) sections 13–14.
Integration/publication are separate. F03-B and its shared unchecked task markers remain open.

- [X] T037 [US3] Implement F03-A account-administration services in `apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java`, with failing/green PostgreSQL tests in `apps/server/src/test/java/com/idea/ddm/identity/IdentityFlowTest.java`; retain scoped results in `evidence/F03-identity-results.md`. Technical checkpoint executed from `acb772e99b96c13a10dc7ad905d6eb7daec0493a`: 20 identity + 2 Server smoke tests PASS. The explicit bounded Super self-assignment clarification is in spec Session 2026-09-30 / FR-013. T037 is the service part of T021, not extra roadmap scope/hours; marking it implemented does not accept or close F03-A/Issue #22, provision a live account, or complete F03-B.

- [ ] T018 [US3] Retain existing first/repeated bootstrap coverage in `apps/server/src/test/java/com/idea/ddm/identity/IdentityFlowTest.java` and write session eligibility/denial coverage one slice at a time in `apps/server/src/test/java/com/idea/ddm/identity/HttpSessionFlowTest.java`; include re-enabling an account, refusing its old invalidated session and accepting fresh sign-in. T039/T042 refine the remaining F03-B work, not extra card hours.
- [X] T019 [US3] Implement one-time local administrator bootstrap and Actor/account persistence in `apps/server/src/main/java/com/idea/ddm/identity/AdministratorBootstrap.java`. Source `89eab7129a72844e45807f13baedfbee39a9ac92` additionally passed fresh public V1/V2/V3 and the real interactive packaged operator + unchanged repeat on 2026-09-30 in dedicated `idea_ddm_f03a_20260930_c91e7a42`; see [F03 evidence](evidence/F03-identity-results.md) sections 11–12. This closes the technical bootstrap task, not whole-card acceptance, Issue #22 or F03-B.
- [ ] T020 [US3] Implement native login/session ownership and protected-request Actor derivation in `apps/server/src/main/java/com/idea/ddm/identity/SessionService.java`; expose commit-time eligibility validation coordinated with security-state changes for the F04 owner command, and never revive invalidated sessions when re-enabling an account.
- [ ] T021 [US3] Implement authorized native-account creation, sign-out, disablement and revocation refusal paths in `apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java`.
- [ ] T022 [US3] Run the F03-A/B scenarios and retain actual results without credentials in `specs/005-ph1-foundation-custody/evidence/F03-identity-results.md`.

**F03-B task refinement:** T038–T045 refine the unchecked parts of T018/T020/T021/T022,
not new roadmap cards/hours. Execute in vertical test/implementation pairs; never write the
whole imagined test suite before its first behavior. T039's initial red test uses only current
qualified build dependencies and may run while T038 is prepared; green HTTP Security code
requires T038. No client credential or time-control shortcut is allowed.

- [X] T038 [P] [US3] Complete exact pre-use HTTP Security dependency/license intake in `docs/research/2026-09-30-ph1-f03b-http-security-intake.md`; pin newly resolved components before importing them in `apps/server/pom.xml` and preserve the Log4j2/no-Logback graph. v0.2 admission preceded first resolution; v0.3 retains matching five-JAR hashes and actual logging graph. Wider T036/commercial clearance remains open.
- [X] T039 [P] [US3] Write and run the first failing real-HTTP anonymous-session refusal in `apps/server/src/test/java/com/idea/ddm/identity/HttpSessionFlowTest.java` through `apps/server/scripts/run-f03b-postgresql-checks.sh`, then extend one behavior at a time for sign-in/out, CSRF, server-derived Actor and fixation protection. Separate roles and test-owned UUID schemas were used; 8 HTTP tests and 22 affected regression checks passed without skips. This closes the initial test slices, not T040–T044 or whole F03-B acceptance; checkpoint evidence is retained in `evidence/F03-identity-results.md`.
- [ ] T040 [US3] After T038 and the relevant red test, implement ordinary Spring HTTP session configuration in `apps/server/src/main/java/com/idea/ddm/identity/IdentityHttpSecurity.java`, `SessionService.java` and `IdentityController.java`, plus needed session fields in `database/migrations/V4__native_http_sessions.sql`. Preserve V1–V3; carry a verified session reference in ActorContext for account-version, per-session revocation and commit-time checks. Never trust client ActorId or resurrect persisted sessions on restart.
- [ ] T041 [US3] In separate red/green slices implement target-bound one-use credential proof, password validation and race-safe temporary login blocking in `apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java`, `NativePasswordVerifier.java` and `database/migrations/V5__first_credential_setup.sql`, followed by additive reset/throttling migrations. Apply spec's exact profile: proof 15 minutes; minimum 15 Unicode characters, maximum 72 UTF-8 bytes without truncation; 5 failed sign-ins within 15 minutes starts a 15-minute login block. Approved v2 has separate setup/reset permissions; preserve v1 and its pinned assignments and support only exact seeded role versions. Implement v2/first setup, redemption, reset/invalidation, then throttling. Proof-authorized redemption and material state/outcome/Audit must be atomic. Reset accepts ACTIVE/DISABLED existing-credential targets, never changes enablement or actor.disabled_at; re-enable remains separate at the new expected version. First setup has §18 evidence; reset implementation/execution is refined in T045/§20. Full T041 remains open for temporary failed-login blocking and wider applicable qualification.
- [ ] T042 [US3] Extend `apps/server/src/test/java/com/idea/ddm/identity/HttpSessionFlowTest.java` through the actual HTTP contract to prove idle 2 hours/absolute 8 hours, logout/account disable/reset revocation, old-session refusal after re-enable, password/proof/block boundaries and atomic failure. Use controlled test time, no hour-long sleeps, host-clock changes or public clock route. Expose the same verified eligibility seam for F04; do not claim its owner race has already run.
- [ ] T043 [US3] Record browser HTTPS/cookie/CSRF and native Desktop binding/protected-custody qualification in `specs/005-ph1-foundation-custody/evidence/F03-identity-results.md`, mapped to `apps/web/src/App.tsx`, `apps/desktop/App.xaml.cs` and the HTTP contract. Actual client paths need their own agreed test seam before test/code changes. A loopback Java HTTP harness cannot mark Web TLS or Desktop custody PASS; any required unqualified client path remains open.
- [ ] T044 [US3] Run scoped HTTP/PostgreSQL checks and affected F03-A/health/migration regressions; retain red/green command, exact source snapshot/hash, roles/database/schema, default and accelerated timing values, sanitized output and limits in `specs/005-ph1-foundation-custody/evidence/F03-identity-results.md`. Initial repaired HTTP has GPT Web PASS WITH NOTES at `3fdf9f5` (§16–17); first-setup source `0d740bd` ran 47 tests and reviewed head `153d0258108cfe1fdc490d42d57f64aa9098e82f` has GPT Web PASS WITH NOTES (§18–19). Reset successor `976bd031913edb3e4554af6e23744a1dd55d8527` ran 57 tests (35 HTTP, 20 unchanged F03-A, 2 health), 0 failures/errors/skips (§20). External reset review is pending. Throttling, wider F03-B scenarios and affected migration/data regression remain owed; fresh public V4–V6 is NOT-RUN. Keep F03-B IN_PROGRESS; verifier NOT-RUN.
- [X] T045 [US3] Implement and execute the bounded reset refinement of T041/T042 in `apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java`, `IdentityController.java`, additive `database/migrations/V6__credential_reset.sql` and `HttpSessionFlowTest.java`. Exact v2 reset permission; target/login/version-bound one-use 15-minute proof; ACTIVE/DISABLED credential replacement without enablement change; atomic version/session/proof/history/IAM/Audit fate; stale/purpose/expiry/refusal/concurrency/fault tests and unchanged F03-A regression. Source `976bd031913edb3e4554af6e23744a1dd55d8527` ran 57 checks PASS; §20 retains source/log hashes, internal Standards/Spec review and limits. This closes implementation/execution of the reset slice, not external review, T041–T044, whole-card acceptance, Issue #24 or F03-B completion.

## Phase 6: User Story 4 — Attributable owner outcome (F04, P1)

**Goal**: Sample owner result, required Audit and outbox record have one relational fate;
Audit records the decision without making it.
**Independent test**: Allowed, refused, forced-failure and same-OperationId retry scenarios.

- [ ] T023 [US4] Write failing allowed/refused/failure/idempotency tests in `apps/server/src/test/java/com/idea/ddm/operation/OwnerOutcomeTest.java`; use controlled synchronization to commit account disablement or session revocation after request admission but before owner commit, then prove no successful business-state change commits.
- [ ] T024 [US4] Implement append-only Audit storage in `apps/server/src/main/java/com/idea/ddm/audit/AuditEvidenceRepository.java`.
- [ ] T025 [US4] Implement sample owner command, required outbox and atomic transaction in `apps/server/src/main/java/com/idea/ddm/operation/SampleOwnerCommandService.java`; coordinate commit-time eligibility with IAM security-state changes so a session invalidated before owner commit cannot produce a successful change.
- [ ] T026 [US4] Run success, refusal, forced-failure and retry tests; retain operation and Audit correlation in `specs/005-ph1-foundation-custody/evidence/F04-outcome-results.md`.

## Phase 7: User Story 5 — Direct single-Vault transfer (F05-A/B, P1)

**Goal**: Client bytes go directly to one Gateway; Server accepts custody only after matching
verified Receipt. Distinct IDs leave a future multi-Vault seam, not a second-Vault result.
**Independent test**: Both P05 fixtures match byte count and SHA-256; wrong/expired Grant,
mismatch, interruption, lost response and duplicate/changed-input attempt produce no false
accepted custody.

**F05-A path gate:** The Gateway boundary is selected, but its exact runtime/toolchain is still
`NOT-RUN`. T027 must settle and record that qualification before Gateway code. Then replace the
directory-only references in T029, T031 and T033 with exact test/source paths in this file and
rerun read-only `$speckit-analyze` for F05. No `.java`, `.cs` or `.ts` Gateway source path is
assumed in advance. This gate does not block F01-A through F04.

- [ ] T027 [US5] Qualify exact Gateway runtime, toolchain, Adapter, transport security and package intake in `docs/research/2026-09-28-ph1-f05-gateway-qualification.md`; record exact source/test paths there, refine T029/T031/T033 in `specs/005-ph1-foundation-custody/tasks.md`, and rerun read-only `$speckit-analyze` before Gateway implementation.
- [ ] T028 [US5] Write failing wrong/expired/replayed Grant, mismatched Receipt, same-operation status and custody tests in `apps/server/src/test/java/com/idea/ddm/custody/CustodyBoundaryTest.java`.
- [ ] T029 [US5] Write runtime-neutral candidate, size/digest mismatch, interruption, lost-response and repeated/changed-input cases in `tests/ph1/transfer-smoke/gateway-cases.json`; after T027 qualifies the runtime, bind these cases to its failing test harness and record the exact harness path in `apps/gateway/README.md`.
- [ ] T030 [US5] Implement exact short-lived Grant issuance and same-OperationId lookup in `apps/server/src/main/java/com/idea/ddm/custody/TransferGrantService.java`.
- [ ] T031 [US5] Implement Gateway candidate handling through one private filesystem Adapter under `apps/gateway/`; record the qualified entrypoint, source filenames and commands in `apps/gateway/README.md` and `specs/005-ph1-foundation-custody/evidence/F05-A-gateway-files.md`.
- [ ] T032 [US5] Implement authenticated Receipt validation and Artifact/Vault/Location metadata acceptance in `apps/server/src/main/java/com/idea/ddm/custody/ReceiptAcceptanceService.java`.
- [ ] T033 [US5] Add a client transfer harness using Grant-directed Client→Gateway bytes in `tests/ph1/transfer-smoke/` without routing file bytes through `apps/server/`.
- [ ] T034 [US5] Run 1 KiB/64 MiB, refusal, mismatch, interruption, lost-response and duplicate/changed-input scenarios; retain manifest comparison, transfer route, receipt and metadata evidence in `specs/005-ph1-foundation-custody/evidence/F05-B-transfer-results.md`.

## Phase 8: Cross-cutting review

- [ ] T035 Review implementation against FR-001–014, SC-001–006 and [PH1 contract](contracts/ph1-boundaries.md); record residual `NOT-RUN`/`BLOCKED` claims in `specs/005-ph1-foundation-custody/evidence/PH1-coverage-review.md`.
- [ ] T036 Review exact dependency/license evidence and clean-room provenance before integration in `specs/005-ph1-foundation-custody/evidence/PH1-license-review.md`.

## Dependencies and execution order

| Delivery card | Tasks | Requires |
|---|---|---|
| F01-A | T001–T012 | PG4 PASS; T002 records the one-time exceptions for late NuGet and direct Web legal-file evidence in past internal build/test. Intake still precedes every new import. |
| F01-B | T013 | F01-A actual build evidence |
| F02 | T014–T017 | F01 build foundation |
| F03-A | T019/T037; accepted A portions of T018/T021/T022 | F02 baseline; F03-A reviewed/accepted service and interactive-bootstrap evidence |
| F03-B | Remaining T018/T020/T021/T022; refinement T038–T044 | F03-A acceptance; qualified exact HTTP Security intake before new dependency use; approved real HTTP/PostgreSQL test seam |
| F04 | T023–T026 | F03 Actor/session and F02 database |
| F05-A/B | T027–T034 | F04 outcome/Audit and F02 data baseline; T027 qualification and exact-path task refinement before Gateway implementation |
| PH1 review | T035–T036 | Targeted story evidence |

Only tasks marked `[P]` use disjoint files and can be prepared in parallel after their stated
prerequisites; the single current developer may execute them sequentially. Within each story,
tests must fail for the intended missing behavior before implementation and pass afterward.
Do not run a PH1 task as proof of a later Core v0 feature.

## Implementation strategy

The first demonstrable increment is **F01-A**, then F01-B. Finish and review each card's actual
evidence before advancing the Tracker. Continue F02→F03→F04→F05 in dependency order. Product
requirements, architecture and Tech baseline remain under their controlled owners; changes to
them are not made by editing this task list.
