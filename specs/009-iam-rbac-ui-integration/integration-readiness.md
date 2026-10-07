# IAM/RBAC Integration — Inspected Predecessor and Handoff

| Field | Value |
|---|---|
| Stable ID / class / version / state | `IE-HO-IAM-UI-001` / supporting source inventory/handoff / `0.4` / Draft execution-readiness record; execution BLOCKED |
| Authority / owner / author | INFORMATIVE / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Main `4e5244430ea89ffe878819e1279f6e05c60d610a` / 2026-10-07 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective date | Project Reviewer SPEC REVIEW PASS at e227cb1d; DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d on 2026-10-07 via human conversation; 93-task/zero-finding Analyze accepted for readiness at aaa5596a / formal applicable PG2/PG3/PG4 not explicitly disposed; execution BLOCKED in section 8 / NOT-APPLICABLE |
| Upstream / downstream | [Spec](spec.md), [decisions](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md) / reviewed design and execution packet |
| Change / retention / trigger | [Issue #46](https://github.com/devphuclam/IDEAEngineering/issues/46); retain in Git; re-inspect after source, UI lineage or interface changes |
| Supersession / evidence | No accepted technical predecessor replaced; historical sections retained / exact-source read-only readiness observations in section 8; runtime qualification NOT-RUN |

## 1. Exact lineage and ownership

- Integrated main: `4e5244430ea89ffe878819e1279f6e05c60d610a`.
- Primary checkout: `876689d38aa511363f459dd8be0256485e815fda`; additional commit is the planning Excel documentation, not changed identity runtime.
- Login UI: `feat/f03b-login-session-ui` at `8811521b831f597275d7b86ff0f50245f0a4510b`.
- Admin UI: `feat/f04-admin-iam-ui` at `9160ec27dec2b80b96c36adf94460864fd265099`.
- UI merge base: `b0289f1f3e414421475ca4c2730b8318ed08ceba`.

Prefixes 007/008 exist on the UI branches; successor 009 avoids identity collision. The branch labelled F04 is presentation lineage, not authority to reopen accepted F04.

This preparation owns worktree `iam-rbac-ui-spec`, branch `codex/iam-rbac-ui-integration-spec`. The primary checkout's user changes to `apps/web/package.json` are untouched and must not be reset or automatically included.

## 2. Implemented versus missing

| Capability | Inspected source | Actual scope / dependency |
|---|---|---|
| Native sign-in, eligible session, logout/CSRF | [SessionService](../../apps/server/src/main/java/com/idea/ddm/identity/SessionService.java) and security boundaries | Implemented predecessor; retain qualified ordinary sessions. |
| Account create/disable/re-enable | [IdentityController](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java), [IdentityAdministration](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAdministration.java) | Implemented commands; authorized directory/detail/state reads missing. |
| Organization/capability display | Session result contains ActorId/AccountId | Query context missing; invented Organization/profile fallback prohibited. |
| Setup/reset proof | [CredentialSetupService](../../apps/server/src/main/java/com/idea/ddm/identity/CredentialSetupService.java), [CredentialResetService](../../apps/server/src/main/java/com/idea/ddm/identity/CredentialResetService.java) | Qualified services; HTTP delivery synthetic-only/default off, live handoff not qualified. Recipient-facing UI needed. |
| Account Administrator grant | [RoleAssignmentAdministration](../../apps/server/src/main/java/com/idea/ddm/identity/RoleAssignmentAdministration.java) | INTERNAL exact AA v1/v2, direct Actor/Organization only; not general HTTP administration. |
| Project/Group/membership | Governing Project Governance design | No Project/Group tables/services in V1–V10. New owner/query/command design required. |
| Role catalogue/custom/revoke/replace | [V2](../../database/migrations/V2__identity_administration.sql), [V3](../../database/migrations/V3__account_administration.sql), [V5](../../database/migrations/V5__first_credential_setup.sql) | Limited immutable seeds, not full RBAC/version administration. |
| Effective-access explanation | [IdentityAccessPolicy](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAccessPolicy.java) | F03 direct-Actor/Org subset selects one assignment; Group/scope/all-path resolution missing. |
| Administration history inspection | Retained outcome/authorization/Audit | Authorized scoped read projections/redaction missing. |

These facts describe source, not newly executed qualification. No missing capability is given an invented endpoint.

## 3. Design obligations before implementation

| ID | Observed fact | Required design/qualification |
|---|---|---|
| R01 | AA grant requires ACTIVE; create returns PENDING. | Sequence credential activation before assignment; no optimistic ACTIVE user or unapproved eligibility broadening. |
| R02 | First setup uses `row.next()` among eligible credentialless identities; no one-login invariant. | Freeze deterministic target/refusal semantics before actual handoff. RESET exact targeting is already qualified. |
| R03 | Synthetic delivery flag does not qualify live delivery; digest cannot recover plaintext. | Pin private temporary display/clearing/redaction and uncertain issuance/reissue. |
| R04 | V2 uniqueness includes revoked historical assignments. | Explicit regrant/replacement history/concurrency. A revoked_at column is not an implemented revoke command. |
| R05 | App cannot UPDATE/DELETE assignments or mutate role definitions/permissions. | Narrow owner-controlled write path and least-privilege regression, not blanket database grants. |
| R06 | Last recovery check counts only Super@1. | Qualify all supported effective successors without rewriting bootstrap/old versions or bypassing recovery. |
| R07 | Current evaluator selects first direct assignment. | Extend owner evaluator/safe explanation to every applicable path, not a client snapshot or second role model. |
| R08 | UI branches contain fallback devMode, local roles/profile/security success and Department-derived membership. | Selective presentation reuse; replace fabricated identity/authority and false success, retain honest refusal/error and accessibility. |
| R09 | Org-scoped PA creation and administrative membership distinction refine narrower Core wording. | Incorporate the confirmed choices through owning Core/interface review before execution. |

These are engineering/design dependencies, not requests to reopen confirmed user intent.

## 4. Confirmed semantic responsibility profile

This matrix is not a seed or an implemented wire contract. Exact action codes, versions, delegation/read limits and DTOs belong to the next reviewed contract stage.

| Action family | Authority and scope | Exclusion |
|---|---|---|
| Account read/create/disable/re-enable | AA with declared action in supported scope | No membership/role/content authority |
| Setup / reset issuance | AA version declaring each separate permission | Super-only gains neither; redemption uses proof authority |
| Project creation | Organization-scoped PA with explicit create permission | Project-only PA cannot create elsewhere; no creator auto-membership |
| Project/Group/membership administration | PA assignment covers requested scope/action | Personal membership not needed for administration; participation gates retained |
| Supported business assignment | Permitted PA or PRA, within role/principal/scope limits | No administrative-role delegation by PA or self-broadening |
| AA / PA / Audit Reader assignment | PRA or effective Super with declared administration permission | Exact version/scope and delegated limits apply |
| Super / PRA assignment | Effective Super with declared permission | Direct Actor initial profile; last recovery protection |
| Custom Role validation/activation | PRA within currently effective permission/delegation limits | No built-in edit/candidate self-authorization |
| Scoped access/evidence inspection | Inspector with declared read authority | Not all authenticated users; no credentials/unauthorized details |

Product Configuration operations remain DESIGN. Group business-grant qualification requires an actually supported owner action in the reviewed catalogue, not a fake engineering permission made executable for a demo.

## 5. Handoff and next stage

### Preparation verification

| Check | Actual result / limit |
|---|---|
| Relative links in spec, inventory, change record and author checklist | PASS: 25 local links resolve; existence check only, not runtime or external URL qualification |
| Requirement/success-criterion identity | PASS: 30 FR and 9 SC definitions, each unique and sequential |
| Template/clarification marker scan | PASS: no unresolved spec template or NEEDS CLARIFICATION marker |
| Spec Kit active-feature resolution | PASS: PathsOnly resolves spec/plan/tasks to feature 009; this does not generate a plan or tasks |
| Source/authority cross-check | PASS: two bounded read-only factual checks found no actionable contradiction; not human acceptance or independent product-gate review |
| Whitespace/scope inspection | PASS: documentation-only candidate; git diff --check passes |
| Primary checkout preservation | PASS: main remains 876689d; user package.json change remains outside this worktree |
| Application/build/browser/PostgreSQL tests; verifier | NOT-RUN: no implementation/environment change in this preparation |

Historical preparation at e227cb1d retained the table above. Project Reviewer subsequently reported SPEC REVIEW PASS for that exact head on 2026-10-07 and accepted planning, not implementation.

Historical planning successor at 0a1de666: [plan](plan.md), [research](research.md), [data](data-model.md),
[exact Permission/delegation](contracts/permission-delegation.md), [operations](contracts/operations.md),
[Web interaction](contracts/web-flow.md), [validation design](quickstart.md) and
[reviewer-owned checklist](checklists/design-review.md). Q15 console adoption design is confirmed
for inclusion, not execution. D09/D10/D11 are recorded in Draft owning Core successors;
written design acceptance was pending when that packet was authored; the later exact-source
disposition is recorded below. Formal applicable gates and runtime readiness are not inferred.
New runtime/browser/PostgreSQL tests/verifier NOT-RUN.

### Planning-successor author checks — 2026-10-07

These checks concern document quality, not independent design approval or implementation.

| Check | Actual result / limit |
|---|---|
| Changed publication scope | PASS: 21 Markdown documents only; no application/test/SQL/dependency/runtime/tooling file changed |
| Local Markdown targets | PASS: 442 relative local file links resolve, zero missing; remote URL and runtime qualification not tested |
| Accepted spec semantics | PASS: all 30 FR and 9 SC definition texts match e227cb1d ignoring line endings; only metadata/trace pointers updated |
| Candidate identities | PASS: 25 unique Permission codes, 8 exact built-in versions, 32 unique operation IDs; 20 reviewer criteria all unchecked |
| Core identity/version alignment | PASS: DOC-03@0.8, DOC-04@0.16 with 94 unique requirement IDs, DOC-05@0.27, DOC-06@0.19, DOC-08@0.14; historical approval records untouched |
| Active-feature/template/hook checks | PASS: PathsOnly resolves 009; no unresolved case-sensitive authoring marker; no extension hooks registered |
| Task decomposition | PASS: `tasks.md` has 75 sequential tasks (`T001`–`T075`), all checklist-format valid with repository paths; US1–US6 counts are 9/9/10/8/7/10; Q15 is a separate US6 console slice |
| Bounded factual review | Two read-only research workers identified and author repaired compatibility clarifications: exact AA/PA composition limits, Q15 exception, predecessor source pins, canonical revoked state, separate immutable-version staging and console throttle fate. This is not human acceptance. |
| Whitespace/preservation | PASS: git diff --check; primary user package.json remains BF29C4DC757894DE0CD5CE5A63B29795DA7765D97591A4EED4ABD92F8A09C4AE and outside publication |
| Runtime tests/browser/DB/build/verifier; Analyze | NOT-RUN / not started in this documentation stage; task decomposition is planning only |

## 6. Exact human design disposition and authorized Analyze repair

Project Reviewer reported DESIGN REVIEW PASS on 2026-10-07 for exact source
`0a1de66627fccc4597ac753f6c642d1d8d5f7d1d`, including CHK001–CHK020 **20/20 written
requirements/contract-quality criteria PASS**. Authority is the review supplied through human
conversation; no GitHub submitted review/comment is claimed. This is not runtime, security
qualification or formal PG2/PG3/PG4 PASS. Accepted spec source remains
`e227cb1df60e70a1294628b4f153ad50d8f034c6`.

Author Analyze of task predecessor `16f98e5c6a7c5919bcb29cf74e850215911594e7` identified
eight findings. The user approved the proposed documentation-only repair, including renumbering
with a preserved old-ID crosswalk; no production/test/schema/runtime changes were authorized.

| Finding | Authorized successor repair / trace |
|---|---|
| C1 — gate after code; Analyze at end | T006 read-only Analyze and T007 explicit gate precede every source/runtime task, including T008 fixture Java; plan/quickstart aligned. |
| I1 — Project needs later evaluator | T016–T019 provide Project-owned read facts and one foundational evaluator; Project APIs never use temporary/parallel RBAC. T055/T059 also explicitly qualify the existing UI-R01 catalogue adapter before the wizard, not as later Custom Role wiring. |
| I2 — absolute password/proof display ban | T032–T033 retain only approved temporary credential/private handoff controls; clear after submit/unmount, never persist/log/URL/evidence. |
| U1 — missing Project HTTP task | T045 real HTTP RED and T051 exact UI-P01–P13 adapter; T053 actual HTTP/Web qualification. No route invented. |
| U2 — missing recipient/reissue work | T033–T034 RED, T037–T039 implementation plan and T041 qualification explicitly cover exact login/purpose supersession, rollback, lost response and recipient proof authority. |
| I3 — shared state/routes too late | T021–T023 foundational client state; actual routing in each US1–US5 slice; T086 final integration is not first wiring. |
| D1 — duplicate inspection adapter | T061 covers assignment UI-R05–R09 only; T079 alone covers UI-R10/UI-A01/UI-O01. |
| I4 — stale review/task metadata | Exact design source/disposition recorded; original author checks and acceptance boundaries retained; tasks generated, not implemented. |

The [repaired worklist](tasks.md) has 93 unchecked tasks, with all 75 predecessor IDs mapped.
US1–US6 counts are 13/12/10/10/8/10; US6 includes five separately bounded prerequisite Q15
tasks and five final browser/recovery tasks. The approved plan's visible owner-story sequence is
unchanged; shared authority/client prerequisites are ordered before their first caller.

### Current next step

Documentation checks and read-only Analyze successor are complete as recorded in section 7.
The authorized exact-source T001–T007 preflight is now recorded in section 8: T002 is partial,
T007 is BLOCKED. Resolve only its named authority/environment/build-path conditions; do not reopen
the accepted spec/design/Q14/Q15. No T008+ fixture/test/production/migration edit or runtime/setup
execution is permitted by this publication.
After that: foundation/Q15 synthetic qualification → actual Account/Session/private credentials
MVP → Project/Group → assignment → Custom Role → inspection → final browser/recovery.
No competing specification or implementation workflow is generated.

No Delivery Card/timer, application/database/migration/dependency/deployment mutation, Work Item closure or merge occurs in this preparation step.

## 7. Documentation-only successor checks and author Analyze — 2026-10-07

This is the separately authorized publication record after the read-only Analyze pass; Analyze
itself did not edit files. Subject: documentation worktree successor based on
`16f98e5c6a7c5919bcb29cf74e850215911594e7`, with the exact analyzed input hashes below.
No new independent Project Reviewer acceptance, formal gate PASS or runtime result is claimed.

| Check | Actual result / limit |
|---|---|
| Publication scope | PASS: 13 existing Markdown files only; no application, test implementation, SQL, dependency, runtime/tooling, deployment or historical approval file changed. |
| Task structure | PASS: T001–T093 unique/sequential/unchecked, repository paths and US1–US6 labels; 13/12/10/10/8/10 story tasks. Every one of 75 old IDs mapped; no old execution inferred. |
| Semantic preservation | PASS: 30 FR + 9 SC definition texts match accepted e227cb1d; technical bodies of operation/permission/Web contracts and data model match accepted 0a1de666, ignoring line endings. |
| Catalogue identities | PASS: 32 unique operation rows, 25 Permission rows and 8 exact role versions retained. |
| Relative links | PASS: 255 local file links across 14 Markdown documents (feature including retained author checklist, plus change record/catalogue) resolve; no external URL/runtime qualification. |
| Whitespace/markers | PASS: git diff --check; no unresolved authoring placeholder. Literal historical statements saying no NEEDS CLARIFICATION marker are not open markers. |
| Active feature/hooks | PASS: prerequisite resolves 009 with spec/plan/tasks; .specify/extensions.yml absent, before/after task/Analyze hooks not registered. |
| Primary user file | PASS: apps/web/package.json outside this worktree remains SHA-256 BF29C4DC757894DE0CD5CE5A63B29795DA7765D97591A4EED4ABD92F8A09C4AE. |
| Analyze detection passes | No remaining actionable findings: CRITICAL/HIGH/MEDIUM/LOW = 0/0/0/0; ambiguity/duplicate conflict = 0/0. Requirement coverage 39/39 planned, not implemented. Constitution I–VI no conflict found; formal execution gate still required. |
| Runtime/build/browser/PostgreSQL tests and verifier | NOT-RUN; no task completion, deployment, timer action, issue closure or merge. |

The first documentation-check command stopped on a PowerShell regex argument-precedence error;
the corrected read-only command completed all listed checks. This was a check-script defect,
not product failure, and the initial attempt is not reported as PASS. A follow-up dependency
inspection made existing UI-R01 catalogue HTTP ownership explicit before the US3 wizard; final
read-only Analyze inspected that clarified candidate without adding a route/requirement.

| Analyzed input (raw worktree bytes) | SHA-256 |
|---|---|
| specs/009-iam-rbac-ui-integration/spec.md | EEC8ECDCC53A2659A6B6104AE5EA42F24CBC8709A26D7EDCC9CEEB67D3593C3D |
| specs/009-iam-rbac-ui-integration/plan.md | 73B0D46F1385C7386B587BF36D4D55534C4F63BC3E9EBD3FC1D16DCEC7CC70D8 |
| specs/009-iam-rbac-ui-integration/tasks.md | 6633478A97B3353D94640A3460EC7059317D671B57E1E45CAFC87688132A313A |

### Planned acceptance coverage from the read-only analysis

| Requirement / criterion | Has planned task? | Representative task IDs |
|---|---|---|
| FR-001 | Yes | T009, T021, T040, T083, T085 |
| FR-002 | Yes | T009, T010, T035 |
| FR-003 | Yes | T035, T045, T048, T059, T075, T079 |
| FR-004 | Yes | T030, T031, T036 |
| FR-005 | Yes | T030, T036, T041, T089 |
| FR-006 | Yes | T030, T033, T037, T039 |
| FR-007 | Yes | T032, T033, T037, T039, T085 |
| FR-008 | Yes | T030, T037, T041 |
| FR-009 | Yes | T030, T033, T038, T041 |
| FR-010 | Yes | T043, T045, T049, T051 |
| FR-011 | Yes | T016, T018, T019, T043, T045 |
| FR-012 | Yes | T043, T044, T050 |
| FR-013 | Yes | T016, T018, T043, T044, T050 |
| FR-014 | Yes | T055, T057, T062 |
| FR-015 | Yes | T055, T060, T062, T064 |
| FR-016 | Yes | T018, T058, T060, T063, T075 |
| FR-017 | Yes | T055, T057, T059, T060, T062 |
| FR-018 | Yes | T018, T019, T055, T056, T060, T069 |
| FR-019 | Yes | T013, T014, T025, T027, T029, T059, T066, T070 |
| FR-020 | Yes | T065, T067, T069, T070, T071 |
| FR-021 | Yes | T055, T058, T060, T068, T072 |
| FR-022 | Yes | T018, T019, T075, T078, T080 |
| FR-023 | Yes | T009, T012, T027, T047, T058, T077 |
| FR-024 | Yes | T011, T012, T027, T034, T038, T047, T058, T068 |
| FR-025 | Yes | T020, T021, T032, T034, T041, T055, T068, T075, T079, T085 |
| FR-026 | Yes | T057, T067, T084, T087 |
| FR-027 | Yes | T039, T040, T057, T062, T067, T084, T086 |
| FR-028 | Yes | T021, T022, T023, T040, T052, T072, T080, T085 |
| FR-029 | Yes | T013, T014, T025, T026, T027, T056, T058 |
| FR-030 | Yes | T018, T030, T034, T037, T041, T089 |
| SC-001 | Yes | T030, T031, T033, T034, T041, T042 |
| SC-002 | Yes | T043, T045, T047, T049, T053, T054 |
| SC-003 | Yes | T055, T060, T062, T063, T075, T080 |
| SC-004 | Yes | T055, T057, T060, T062, T063 |
| SC-005 | Yes | T013, T014, T018, T026, T056, T058, T065, T066, T069 |
| SC-006 | Yes | T065, T068, T070, T073, T074 |
| SC-007 | Yes | T011, T012, T027, T034, T047, T058, T068, T077, T085 |
| SC-008 | Yes | T057, T067, T084, T087 |
| SC-009 | Yes | T007, T024, T029, T042, T054, T064, T074, T082, T087, T088, T090, T091, T092, T093 |

Shared preparation, fixture and handoff tasks additionally trace the applicable story acceptance
and Constitution I–VI; no unmapped task was found. No remaining documentation remediation is
proposed in this pass. The next eligible action is exact execution-readiness preparation and
explicit applicable gate disposition, not starting implementation from this author report.

## 8. Exact-source execution readiness — 2026-10-07

**Disposition: BLOCKED — T008+ NOT-STARTED.** The user authorized read-only T001–T007 at
`aaa5596a0ccb7bebf3c8a67e161afde0cd9bb55a`, not a build, setup, deployment or product-gate
self-certification. This is the observed preflight, not a runtime PASS or new design review.
No spec/plan/contract, Java/test source, migration, dependency, tooling or deployment file changed.

### 8.1 Source, ownership and task disposition

PR #47 was OPEN/Draft, base main, head exactly `aaa5596a0ccb7bebf3c8a67e161afde0cd9bb55a`
both before inspection and before publication; Issue #46 was OPEN. Reused clean owned worktree
`C:/Users/TD-999/.codex/worktrees/iam-rbac-ui-spec/IDEAEngineering`, branch
`codex/iam-rbac-ui-integration-spec`; no additional branch/worktree created. Integrated source
base remains `4e5244430ea89ffe878819e1279f6e05c60d610a`; primary main remains
`876689d38aa511363f459dd8be0256485e815fda`. The primary user's modified package.json remains
outside this publication with SHA-256 `BF29C4DC757894DE0CD5CE5A63B29795DA7765D97591A4EED4ABD92F8A09C4AE`.
The eventual documentation publication commit is a successor, not the inspected source.

T001 re-read the plan/research/data/three contracts/quickstart. Selected seams are unchanged:
IAM establishes eligible current Actor/Account/Organization; Project Governance owns Project/Group
and participation facts; one Access Policy evaluator owns exact-version/scoped assignments;
existing JDBC/security-write coordination owns atomic commit fate; actual same-origin Web consumes
those interfaces. Sections 2/4 and the contracts retain the IMPLEMENTED predecessor versus DESIGN
boundaries. Q14/Q15 and immutable legacy roles are not reopened.

| Task | Actual disposition |
|---|---|
| T001, T003 | COMPLETE: selected owner seams, exact lineage and primary preservation recorded. |
| T004 | COMPLETE: committed migration baseline compared with primary main; next unused version V11. No migration/history execution. |
| T005 | COMPLETE: proposal-only synthetic/target manifest and guards below; no provisioning. |
| T006 | COMPLETE: read-only Analyze reinspection of the exact source; 93 unique tasks, 30 FR + 9 SC, 39/39 planned coverage; no new actionable CRITICAL/HIGH/MEDIUM/LOW finding. Input hashes match section 7. No spec/design remediation proposed. |
| T002 | PARTIAL: existing tools/cache pinned and available as below; full Server package and increment runner/target envelope not cleared. |
| T007 | BLOCKED: applicable gate/target/execution conditions in 8.5 unresolved. |

Requirements checklist remains 16/16 marked; reviewer-owned design checklist retains its historical
unchecked markers and the human 20/20 accepted written-design disposition from section 6. It was
not edited or misrepresented as implementation evidence. Prerequisite resolution selects 009;
`.specify/extensions.yml` absent, so no Analyze/implementation hooks registered.

### 8.2 Actual tooling/cache observations

SSH used the existing owned key/known-host verification, BatchMode and an 8-second connect timeout
to `phuclam@192.168.137.33` (ideaddmserver). No private-key contents were read or recorded. Remote
commands only inspected versions, hashes, filesystem metadata, listeners and PostgreSQL catalogs.

| Input / actual source | Observed result and execution limit |
|---|---|
| Temurin JDK 25.0.4.1+1-LTS, `/opt/idea/tools/jdk-25.0.4.1+1` | Version matches; java SHA-256 `7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3`; javac `86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e`. |
| Maven 3.9.16, `/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn` | Version inspected with command-local JAVA_HOME; launcher `f9381d0cb98abaaf9592dae421eddc497e84ed9bfb723b84c111d1350863c3a2`. No Maven goal executed. |
| Installed JDK/Maven/psql envelope | 82/82 hashes match [retained toolchain](../../tests/ph1/f05-qualification/https-loopback/toolchain.tsv), including installed Maven-core JARs and JDK security/cacerts. Missing/drift = 0/0. This reuses provenance, not the expired F05 execution exception. |
| Boot 4.1.1, JDBC PostgreSQL 42.7.13, existing compile/runtime/test and direct resources/compiler/Surefire inputs | 403 unique retained file paths from [resolved inputs](../../docs/research/inventories/f05a-t028-t030-resolved-inputs.tsv) plus non-core [current-use coordinates](../../docs/research/inventories/ph1-current-use-dispositions-20261006.tsv) exist and hash-match; missing/drift = 0/0. Core-provided rows are checked at actual distribution paths, not invented .m2 copies. Not a new effective-model/plugin resolution or full lifecycle/package PASS. |
| Approved Windows Node 24.19.0, `C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` | v24.19.0; `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`; project [admission](../../docs/research/2026-10-05-node24190-project-admission.md) retained. Unrelated Node from PATH not selected. |
| React 19.3.0 / TypeScript 7.0.2 / Vite 8.3.1 / Vitest 5.0.2 and Windows transitive packages | 44 installed packages at primary apps/web/node_modules match this source's lockfile; 44 corresponding cached archive SHA-512 identities PASS; remaining 44 lock rows are optional other-platform packages, not missing Windows prerequisites. No npm install/ci. Active worktree has no node_modules; isolated cache reuse still needs the execution/setup envelope, not writes to the primary checkout. |
| Web legal/native retained evidence | 46/46 actual hashes in [local legal-file inventory](../../docs/research/inventories/ph1-web-local-legal-files-20261006.tsv) PASS; NOT_APPLICABLE rows are not missing licenses. Windows Rolldown, TypeScript and LightningCSS binaries match the three hashes in [native correspondence](../../docs/research/2026-10-06-t036-native-correspondence.md). T036's accepted residual limit is retained, not reopened. |
| Chrome, `C:/Program Files/Google/Chrome/Application/chrome.exe` | Actual 154.0.8037.98; SHA-256 `6849d2982038de9f9489a7b3858f3b785b7fec06a842c93c517281d21995c8ca`. Historical qualification was 154.0.8037.92; new actual browser must be frozen in this increment's future command packet. No browser launched/qualified here. |
| Codex-cached Playwright + playwright-core 1.62.1 | Both version/manifests/LICENSE/NOTICE/third-party hashes match [retained intake](../../docs/research/2026-10-01-t043-browser-tool-intake.md). Use existing headed Chrome, no Chromium download or new @playwright/test dependency. Exact 009 harness/commands are not yet published/admitted. |
| Ubuntu Web lifecycle | node is absent from PATH; discovered `/opt/idea/tools/node-v24.21.0-linux-x64/bin/node` is NOT the selected 24.19.0 input and was not executed. Historical Linux node_modules exists; its existence does not admit another Node version. |
| PostgreSQL / psql | Server and psql 18.6; psql SHA-256 `a200e38c89b111d3abdf26927b186fdd423bef3d84f157af0f4b65db6f8e6c94`. Real app and migrator authenticate separately; catalog findings below. |

Retained known-term components remain subject to [T036 current-use obligations](../../docs/research/2026-10-06-t036-current-use-rights.md)
and [accepted bounded closure](../../docs/research/2026-10-06-t036-bounded-closure.md).
Custom/reciprocal/notice classifications alone create no new BLOCKED-LEGAL finding. Node's
project-wide admission stands. Work-item-specific tooling exceptions are not silently extended.
JSR305's historical missing-grant finding remains distinct from known-term obligations.

Controlled raw-worktree inputs before these two Markdown edits:

| Input | SHA-256 |
|---|---|
| apps/server/pom.xml | `32c4432479955693644a8677b1ed8d209e5b6a823294a11725e8f9afb48d349d` |
| apps/server/scripts/build-web-static.mjs | `859634a3151e52e354fe57d7335ea73b047a40104debc0e61acd09213c11239d` |
| apps/web/package.json / package-lock.json | `1cfdf0ea44133085361810266726f190b4013ff930938f2547d3819fd93af80d` / `350e5d24057c55d6acef6fb6a71b73948e2711d9279c12e2fe52071b815f611b` |
| Resolved Java inputs / current-use inventory | `8c206ecf70d5807630568047aeabfa06d0a8d1a53e540b33f502dbd4e10c57af` / `a1939f7cace4f31635ba46af87189e75c2a4f28ab09045e82a2f58ace12661ad` |
| Web legal inventory / retained toolchain | `28485244f4bc6d14556775ea133d4f9e9b00249d0afcad7140307cd3ba13a1a4` / `9de1ec4ca37990ca8cfe8ca2f84450c0c5c53201f8aa8b92b81f6d7396bf29a1` |

### 8.3 Migration baseline and live read-only database facts

Committed Git blob bytes for all ten migrations match primary main `876689d` exactly. These are
source SHA-256 checksums, not newly verified Flyway applied-history CRCs. Next unused path is
`database/migrations/V11__iam_rbac_ui_successor.sql`; it does not exist and was not created.

| Migration | Committed-byte SHA-256 |
|---|---|
| V1__ph1_foundation.sql | `1a15298354951ac975201d6a0b12691d69d957386aebc3083c7ebe9890de56d4` |
| V2__identity_administration.sql | `55b48840b5455f0aa66a18d4ec1b4c9a2f077cdb70a1ad4c22ded2181e13ff91` |
| V3__account_administration.sql | `a17f1ccbcba5da62031bf28eb335c2ddc9e721058e35ed7496b902e73d5e0946` |
| V4__native_http_sessions.sql | `be43f6d2800b90f09a235fb58ff95e78e2980052f61581969dd6b01698333221` |
| V5__first_credential_setup.sql | `38d6d292e4c5622e25515b3a149144814de511ae2ee440bc715ad63e8a4edf1e` |
| V6__credential_reset.sql | `1c5f9ae4e222ca0d7921d489594101a00e525b1051a3154a1588aca86405e421` |
| V7__bounded_login_failures.sql | `36a1fb5d6b9b42589d7b03d6538b50a602baf0195a2c2a50883c49fd7562a540` |
| V8__owner_committed_event_foundation.sql | `1ecd0ef59327bcfff1a9d3eb87aa4a1f67221564d4c58a4e9df64cac9d0d5272` |
| V9__exact_transfer_grant_scope.sql | `1479e8ebd18969ec6102b92b81a3192e8392fa966bb369bfad7c43a8740144ed` |
| V10__retained_receipt_evidence.sql | `0e5a26a03bc1b52065305a8f774da85d0c1728f5540a59389a2e9cc7881ae19b` |

Catalog-only probes used existing dedicated test DB `idea_ddm_f05a_20261005_t028`,
127.0.0.1:5432 on Ubuntu, with `PGOPTIONS=-c default_transaction_read_only=on` and psql
`-X -v ON_ERROR_STOP=1`. This is an availability witness, NOT authorization to reuse/migrate/clean
that retained DB for 009. Its public has zero base tables and no Flyway history; no applied-history
qualification can be inferred. No identity/business rows queried.

Both actual current_user values match `idea_ddm_app` and `idea_ddm_migrator`; each lacks
SUPERUSER/CREATEDB/CREATEROLE/REPLICATION/BYPASSRLS. DB owner is migrator; app database CREATE=false,
public CREATE=false, membership in migrator=false. Migrator database/public CREATE=true;
public schema owner is pg_database_owner. No SET ROLE, DDL/DML privilege probes or migrations run.
Existing credential file mode 600/owner phuclam was checked and used only remotely with tracing off;
no credential bytes, JDBC URL/password or reusable secret recorded.

Once successor data exists, old Server rollback must fail closed; choose a compatible package or
approved forward repair. Never drop data or rewrite V1–V10 to enable rollback. This preflight
qualifies no backup/recovery/deploy behavior.

### 8.4 Proposal-only target/fixture/command manifest

The following names are proposed for explicit authorization, NOT provisioned/approved targets.

| Boundary | Exact proposal / current observation |
|---|---|
| Remote owned root | `/home/phuclam/idea-iam-ui-20261007-46`, observed absent. Each later exported build/run has a fresh source/attempt child, not a retained F03/F04/F05 root. |
| Windows owned build/browser root | `C:/Users/TD-999/.codex/iam-ui-46`; create only after approved setup. Export committed source byte-preserving and verify hashes; never build from the primary dirty package.json. |
| Dedicated DB | `idea_ddm_iam_ui_20261007_46`, observed absent. Proposed template0/owner idea_ddm_migrator, runtime idea_ddm_app, no new roles/credentials. Creation requires separately authorized operator setup; existing roles cannot CREATE DATABASE. |
| Per-run schema | `iam_ui_<32 lowercase UUID hex>`, inside that DB only, with run ownership marker `IDEA_IAM_UI_RUN:<executed SHA>:<schema>`. Later test runner must be published/hash-pinned, not invented as already executable. public migration cases require their own bounded empty-public witness; default tests do not clean public. |
| Synthetic identities/data | `iamtest-super`, `iamtest-aa-v1/v2/v3`, `iamtest-pa-org/pa-project`, `iamtest-pra`, `iamtest-audit`, `iamtest-linh`, ordinary/PENDING/DISABLED and multi-login targets, all with per-run suffixes and fresh UUIDs; synthetic Org A, two Projects/Groups, isolated Org B negative targets. A second fixture Org is only cross-scope refusal data, not multi-Organization product support. |
| Fixture authority | Existing bootstrap/legacy definitions unchanged; prerequisite grants are attributable synthetic fixtures, not role API completion. Q15 is a separate synthetic console qualification, never live preview/company adoption. No company usernames, credentials, files, Vault or production identities. Test credentials ephemeral/private, no Git/log/storage disclosure. |
| Same-origin browser target | Proposed `https://localhost:18446/` via loopback-only owned test Server/SSH forwarding; no 18444 preview reuse. Windows 18446 and relevant Ubuntu ports had no listener at inspection; no tunnel/listener created. No wildcard/LAN binding. |
| Trusted TLS | Existing CurrentUser/Root T043 certificate fingerprint `71d16c7626e9ed97c84ec6167fe8e88cb753bff5135ee547fb221eb0828d3de2`, SAN localhost + 127.0.0.1, expires 2026-10-08 03:58:09Z (10:58:09 Asia/Ho_Chi_Minh). Store presence is not a successful HTTPS handshake. No feature keystore/trust approval/running target exists. Prefer fresh feature-only short-lived certificate, fingerprint-reviewed CurrentUser trust through explicit setup approval; no system store/cacerts changes or TLS bypass. |
| Test runner | Existing JUnit/Surefire for real owner/HTTP/PostgreSQL; existing Vitest for applicable non-browser tests; existing Playwright 1.62.1 + actual headed Chrome for DOM/browser/keyboard. No jsdom, testing-library, @playwright/test or accessibility framework imported. Any scenario needing a different runner requires prior source/rights admission, not install-on-failure. |

Future first owner RED command template, **NOT-RUN / NOT-AUTHORIZED** here, from the approved
owned exported `apps/server` only: existing Maven above, command-local JDK, `-o -B`, explicit
`-s` and `-gs` the exported [empty controlled settings](../../tests/ph1/f05-qualification/server-grant/settings.xml),
`-Dmaven.repo.local=/home/phuclam/.m2/repository`,
`-Dtest=OwnerSessionEligibilityTest -DfailIfNoTests=true -DargLine=-Djava.net.preferIPv4Stack=true`,
then direct goals in order:

    org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources
    org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources
    org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile
    org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile
    org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test

This avoids incidental generate-resources/exec/repackage for focused owner tests; it is not full
Web/package qualification. The test does not exist before T009, and the safe DB/schema runner
must be published before that run. No `clean`, ordinary lifecycle `test/package`, wrapper download
or plugin auto-resolution is authorized by this template.

Full same-origin package path is unresolved. Current Server POM binds generate-resources to
exec-maven-plugin 3.6.3/Node and declares Boot Maven Plugin without the F05 JSR305 exclusion.
Cached plugin POM inspection confirms buildpack-platform; the retained Q02 path reaches
tomlj → jsr305:3.0.2, and that unadmitted JAR remains in global cache. Do not execute the unfiltered
plugin graph. Prefer actual Web build with the approved Windows Node/cache, transfer hash-verified
generated resources to the owned Linux build, and explicitly select an already-qualified
JSR305-free packaging graph. This is a build-path proposal, not an authorized POM edit or claim
that the Server graph has been qualified. No framework/version change or new external dependency
is proposed. Exact package commands/selected closure need review before build.

STOP/cleanup guards for the proposed envelope:

- Source/tool/package/graph/hash drift, unexpected download/target/permission, expired/untrusted TLS
  or company/preview data stops execution; never repair with Internet installs or TLS bypass.
- Before schema cleanup, validate connected DB exactly, exact UUID schema, run marker and ownership;
  drop only that run-owned schema after its JVM has terminated. No broad prefix cleanup, public,
  retained F05 DB or database DROP. Retain the new DB for review until explicit disposal authority.
- Stop only the exact PID started by the owned runner, validating its root/run identity; no Ubuntu
  restart, broad process kill, service/firewall edits or preview stop/redeploy.
- Private secrets/cert keys stay outside Git, mode 600 where applicable; do not print environment
  files, passwords, proof, cookies, CSRF, HAR or reusable session values. Retain sanitized commands,
  source/tool hashes, exact target/result/cleanup and private-log hashes; raw-log access limit remains.
- Confirmed rollback is not uncertain outcome. Ordinary future authorized TDD defects are repaired
  within that approved scope; no migration-history rewrite or silent gate widening.

### 8.5 Gate disposition and smallest remaining decisions

| Gate | Current disposition / responsible authority |
|---|---|
| PG2, affected requirement-bearing Core successor | BLOCKED for implementation: accepted spec and Q14/Q15 decisions retained, but no explicit applicable PG2 disposition for this exact successor supplied. Product Decision Authority/named approver must record it; author cannot infer it. |
| PG3, affected design/data/interaction successor | BLOCKED for implementation: exact design REVIEW PASS retained; formal applicable PG3 disposition not explicitly supplied. Named independent reviewer/approver records the existing accepted baseline, not a fresh design loop. |
| PG4 / T007 | BLOCKED: named bounded increment authority, owned DB/TLS/setup and full build/runner execution envelope still need explicit disposition. Current human instruction authorizes this read-only preflight only. |
| Future verification/acceptance | NOT-RUN; no PG5, live adoption, deployment, merge or company/commercial/production readiness inferred. |

| Blocker | Minimal resolution / owner |
|---|---|
| B01 — explicit applicable gates/execution authority | Project user routes the accepted `aaa5596a` requirements/design/task packet and this exact preflight to the named PG2/PG3/PG4 authorities for bounded disposition; no re-grill/re-spec. |
| B02 — named DB/setup target absent | Project user/operator explicitly approves creation of `idea_ddm_iam_ui_20261007_46` and owned roots/schemas with the existing roles; provision through controlled operator setup, then catalog/role preflight. No sudo/password request or DB creation occurred here. |
| B03 — full offline Server/Web packaging path | Engineering presents exact Windows-Web/Linux-Java package recipe and selected JSR305-free cached plugin closure (or another explicitly approved existing-tool path), retaining notices. Do not execute current lifecycle with unselected Node/JSR305, alter POM or download replacements during readiness. |
| B04 — actual HTTPS/browser target envelope | Project user approves feature-only TLS setup/trust/loopback target and current Chrome 154.0.8037.98 plus existing Playwright runner reuse; publish exact harness/cert fingerprint before execution. Existing certificate expiry/trust presence is not browser qualification. |

No actual incompatible known-term license or required Windows-package/hash drift was found in this
preflight. Missing admission/target/full-build proof is not reclassified as a license prohibition.
After these conditions are resolved and explicitly disposed PASS (or valid PASS-WITH-ACTIONS),
T008 is the first permitted implementation task, followed by T009 RED before T010 GREEN.
**At this publication no T008+ task is permitted to start.**

Preflight limits: initial diagnostic commands exposed missing command-local JAVA_HOME, an absent
public Flyway table, overbroad archive/core-path expectations and PowerShell-to-SSH CRLF/command
length defects. Corrected read-only checks produced the counts above; no initial failed command
is called PASS. Optional other-platform archives/core-provided Maven paths were not turned into
false missing-dependency blockers. No changes/downloads made to repair the diagnostics.

Application/Maven goals/npm build/test, actual browser/HTTPS, migration/DB writes, certificates,
listener/setup, verifier, deployment, timer actions, merge and issue closure: **NOT-RUN**.
