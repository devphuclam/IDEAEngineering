# Tasks: Backend development access

Input: [spec](spec.md), [plan](plan.md), [research](research.md), [launcher contract](contracts/launcher.md).
TDD launcher seam approved by user on 2026-10-01; Swagger HTTP/browser seam approved 2026-10-02
in [contracts/swagger.md](contracts/swagger.md). Tasks are engineering status, not tracker effort.

## Phase 1: Setup

- [x] T001 Create isolated branch/worktree and claim Issue #26; preserve existing main/F03-B changes in specs/006-backend-dev-access/spec.md.
- [x] T002 Record user scope/lifecycle decisions and artifact/runtime/TLS prerequisites in specs/006-backend-dev-access/research.md.
- [x] T003 Record the approved launcher seam and read-only spec-quality check in specs/006-backend-dev-access/contracts/launcher.md and checklists/requirements.md.

## Phase 2: Foundation

- [x] T004 Run read-only cross-artifact analysis for specs/006-backend-dev-access/{spec,plan,tasks}.md before implementation (2026-10-01: 12 FR + 5 SC covered, 18 tasks, no critical/high findings; US2 intake gate remains explicit).

## Phase 3: US1 — existing Backend access

Goal: open/control a real, persistent isolated preview before adding Swagger.
Independent qualification: real HTTPS/process/database + synthetic sign-in + safe stop/start.

- [x] T005 [US1] Write one failing public-launcher prerequisite/error test at a time in tests/backend-dev-access/launcher-contract.test.ps1 (FR-001/007/008).
- [x] T006 [US1] Implement CMD/PowerShell manual entry points in IDEA-Dev.cmd and tools/backend-dev-access/launcher.ps1 (FR-001/002/003/007).
- [x] T007 [US1] TDD the owned runtime status/start/stop boundary in deploy/development/preview/backend.sh; PID + process start ticks + exact working directory/JAR/Java identity; no broad signals (FR-004/005).
- [x] T008 [US1] Add bounded interactive provisioning in deploy/development/preview/setup.sh: new-only idea_ddm_preview_20261001_26, distinct roles, protected runtime config, packaged migration and console bootstrap (FR-006/008/011).
- [x] T009 [US1] Install inspected helpers and complete user-operated privileged provisioning; retain exact hashes/results in specs/006-backend-dev-access/evidence/launcher-results.md (FR-006/008; focused external code review still pending T017).
- [x] T010 [US1] Execute actual trusted HTTPS/PG start/status/sign-in/stop/start/fresh-sign-in and ownership/SSH/TLS/port refusals; retain outcomes in specs/006-backend-dev-access/evidence/launcher-results.md (FR-003/004/005/007/008, SC-001/002/003/005). Successor controller deployed and qualified 2026-10-02; negative untrusted TLS, Ubuntu occupied port and malformed/foreign/reused-time local profile PASS; original human sign-in/persistence evidence retained.
- [x] T011 [US1] Give the developer actual addresses and commands in specs/006-backend-dev-access/quickstart.md; clearly distinguish Swagger NOT_INSTALLED (FR-012).

## Phase 4: US2 — development Swagger

Blocked until exact source/dependency/tooling admission. This does not block independent US1.

- [ ] T012 [US2] Record exact Swagger/transitive artifact graph, embedded licenses/notices/checksums and separate build-tool authority in docs/research/2026-10-01-backend-dev-swagger-intake.md (FR-011).
- [ ] T013 [US2] Agree documentation/Try out seam, then add one failing test at a time in tests/backend-dev-access/swagger-qualification.mjs and apps/server/src/test/java/com/idea/ddm/DevelopmentApiDocumentationTest.java (FR-009/010).
- [ ] T014 [US2] Add admitted development-only OpenAPI/Swagger integration in apps/server/pom.xml and apps/server/src/main/java/com/idea/ddm/devaccess/DevelopmentApiDocumentation.java; ordinary session/CSRF and explicit filter login/logout contract, disabled by default (FR-009/010).
- [ ] T015 [US2] Qualify actual browser Try out allowed/refused requests and packaging on exact admitted source/artifact; record specs/006-backend-dev-access/evidence/swagger-results.md (SC-004/005).
- [ ] T016 [US2] Update specs/006-backend-dev-access/quickstart.md with working documentation link and capability limits (FR-012).

## Phase 5: Review/handoff

- [ ] T017 Focused source/link/secret checks and review; retain scoped dispositions in specs/006-backend-dev-access/evidence/launcher-results.md. No verifier or automatic acceptance.
- [ ] T018 Converge against specs/006-backend-dev-access/spec.md and provide reviewed branch/PR handoff; integration, main publication and human acceptance separate.

## Dependencies and implementation strategy

T001–T004 -> US1, one RED -> minimal GREEN behavior per cycle; T009 is needed only before actual
runtime qualification T010, not before local prerequisite tests. Deliver US1 before T012–T016.
US2 may be independently tested on a controlled instance, but must pass its own intake/seam gate.
Do not bulk-author imagined tests or new business APIs. No new V1–V7 migration, existing F03-B task
rewrite, credential-delivery bypass or database cleanup. No parallel branch edits; read-only intake
and environment research can occur independently without shared writes.

Coverage: FR-001 T005/T006; 002 T006; 003 T006/T010; 004 T007/T010; 005 T007/T010;
006 T008/T009; 007 T005/T006/T010; 008 T005/T008/T009/T010; 009 T013/T014/T015;
010 T013/T014; 011 T008/T012; 012 T011/T016. SC-001/002/003/005 T010; SC-004 T015.
