# IAM/RBAC Integration — Inspected Predecessor and Handoff

| Field | Value |
|---|---|
| Stable ID / class / version / state | `IE-HO-IAM-UI-001` / supporting source inventory/handoff / `0.15` / Draft Account + Project/Group + Assignment + Custom Role engineering milestone record; PG2/PG3/PG4 PASS |
| Authority / owner / author | INFORMATIVE / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Main `4e5244430ea89ffe878819e1279f6e05c60d610a` / 2026-10-08 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective date | Project Reviewer SPEC REVIEW PASS at e227cb1d; DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d on 2026-10-07 via human conversation; accepted task/Analyze at aaa5596a, explicit PG2/PG3 PASS for 5b2fb9f; human-authorized HTTPS execution closes PG4 action / readiness section 11, engineering results sections 16–20; independent US4 implementation acceptance NOT-RUN / 2026-10-07 for readiness only |
| Upstream / downstream | [Spec](spec.md), [decisions](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md) / reviewed design and execution packet |
| Change / retention / trigger | [Issue #46](https://github.com/devphuclam/IDEAEngineering/issues/46); retain in Git; re-inspect after source, UI lineage or interface changes |
| Supersession / evidence | No accepted technical predecessor replaced; historical sections retained / sections 8–11 readiness lineage, sections 12–14 foundation predecessors, sections 15–16 historical Account MVP, section 17 T034 closure, sections 18–19 historical Project/Group and Assignment milestones, section 20 current Custom Role milestone; whole 009 qualification NOT-RUN |

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

### Historical preparation next step (superseded by section 20)

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
base remains `4e5244430ea89ffe878819e1279f6e05c60d610a`; primary main was
`876689d38aa511363f459dd8be0256485e815fda` at initial inspection. The primary user's package.json remains
outside this publication with SHA-256 `BF29C4DC757894DE0CD5CE5A63B29795DA7765D97591A4EED4ABD92F8A09C4AE`.
The eventual documentation publication commit is a successor, not the inspected source.

Post-publication preservation inspection found primary main had independently advanced to
`615ebd0fe64ecfd2e09e0f29b19998b529442e76` (only apps/web/package.json changed from 876689d),
with untracked tools/contract-exporter also present. Neither was authored, staged or removed by
this readiness task. The user's package.json bytes still match the hash above. Migration tree
and Server POM are unchanged; no primary successor was substituted for inspected source aaa5596a.

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

## 9. Authorized readiness successor — 2026-10-07

Historical disposition at 4e20db2; the later Backend-first gate is recorded in section 10.

Section 8 is the frozen read-only predecessor, not the current execution state. The human next
authorized exactly four blocker repairs at `5b2fb9fbeec9e2edc23532de7b2a81d84289a664`, and
explicitly confirmed **PG2 = PASS, PG3 = PASS**. Spec/design/Q14/Q15 and the 93-task package were
not reopened. The controlled current packet is [execution-envelope.md](execution-envelope.md),
with exact source, inventory, commands, actual results, remaining blocker and retained log hashes.

| Frontier | Actual disposition |
|---|---|
| B01 — applicable gates | PG2/PG3 PASS by explicit human decision; PG4 conditional on the actual readiness matrix, not author inference from prior design review |
| B02 — new PostgreSQL target | CLOSED: operator created only `idea_ddm_iam_ui_20261007_46`; separate existing roles authenticate; owner/least-privilege catalog checks PASS; public 0 tables, no migration/bootstrap/company rows; retain DB, no DROP |
| B03 — offline package | CLOSED: exact Linux Node 24.21.0 admitted with full LICENSE; unchanged locked Linux cache; actual effective graph proved JSR305 selected in predecessor Boot tooling, then the authorized minimal exclusion removed it without application-graph changes. Actual Web + offline predecessor executable package PASS; 57 nested hashes, notices and V1–V10 bytes PASS |
| B04 — trusted HTTPS/browser | PARTIAL: fresh SAN localhost/127.0.0.1 certificate identity frozen; Chrome 154.0.8037.98 and cached Playwright/core 1.62.1 pins PASS. CurrentUser import awaits Windows confirmation; trusted actual Chrome probe NOT-RUN; no TLS bypass or listener started |

Published build/fixture source is `4c98f2266dd159c7609afcab4c95eb4479ae0384`; Linux Node intake
at `04b8b98a46bf62a5669e38450423505451536902` precedes execution; package oracle at
`94ff88e546c5fc09061f40187848f0ba8d9069bb`. Later evidence publication is a successor, not the
executed application SHA. No application Java/test/migration, feature API, permission, schema, dependency
version, architecture, deployment or primary-user source change; only the necessary build-tool
JSR305 exclusion and environment-readiness utilities/configuration were added.

T001–T006 are COMPLETE; **T007 / PG4 remain BLOCKED only on B04**. Do not start T008+ yet.
Once the exact certificate import, published normal-trust browser probe and bounded cleanup
are PASS, record the conditional explicit PG4 disposition and mark T007 complete. Next is
**T008 named synthetic fixtures → T009 real eligible-context RED → T010 minimum GREEN**,
using this envelope; do not create another specification/framework or implicit live Q15 adoption.

Actual predecessor Web/Maven/package readiness is PASS, not IAM UI qualification. Product test
suites, actual 009 browser/owner/HTTP/PostgreSQL behavior, verifier, deployment, merge and timer
actions remain NOT-RUN. Raw private-log access remains limited. PR #47 Draft/Open; Issue #46 OPEN.

Publication checks: 52 local file links in the four changed handoff/envelope/plan/task documents
resolve; 93 unique task IDs remain, exactly six T001–T006 checked; whitespace/scope checks PASS.
Accepted spec/data/operation/permission/Web contracts, application Java/tests, Web manifests and
V1–V10 have no delta from 5b2fb9f. `.specify/extensions.yml` remains absent, so no implementation
post-hook is registered. Primary main independently advanced to
`59515d2f39291ba991694e35c05d5f29cc1cec5c` with a separate contract-exporter commit; no such
changes were reset, staged or substituted into this execution. Its package.json retains
SHA-256 `BF29C4DC757894DE0CD5CE5A63B29795DA7765D97591A4EED4ABD92F8A09C4AE`.

## 10. Current Backend-first execution gate — 2026-10-07

Historical disposition at d13dd7b; subsequent actual HTTPS/action closure is section 11.

The human's subsequent **“Pass luôn có sao đâu”**, in reply to separating Backend readiness
from the unexecuted browser prerequisite, authorizes development to proceed. The controlled
disposition is **PG4 = PASS-WITH-ACTIONS / T007 = COMPLETE**, not a fabricated test PASS.
PG2/PG3 retain the earlier explicit PASS decisions. Current action `IAM-46-A01` and its owner,
due condition, certificate expiry, risk and escalation are authoritative in
[envelope section 5](execution-envelope.md#5-human-backend-first-gate-disposition--2026-10-07).

HTTPS/Chrome remains **NOT-RUN**; Windows import was canceled and the certificate remains
untrusted. Complete the normal-trust environment check before actual Web/HTTPS qualification
and before whole-feature acceptance. No product security requirement, accepted design,
browser test or TLS verification method is removed; no deploy/merge authority is added.

Seven readiness tasks T001–T007 are now complete by recorded evidence plus human gate decision.
**Next authorized task: T008 named synthetic fixtures, then T009 real eligible-context RED.**
T008–T093 remain NOT-STARTED in this documentation-only publication. No test/build/DB mutation,
trust retry, listener, timer, verifier, deployment or merge performed in this successor.

## 11. Current readiness PASS — 2026-10-07

The human requested the published HTTPS/browser check and confirmed the exact CurrentUser
certificate import. The unchanged 4c98f226 harness ran at publication head d13dd7b. Actual
headed Chrome `154.0.8037.98` with cached Playwright/core `1.62.1` and approved Windows Node
`24.19.0` returned HTTP 200 / exact expected body on **both localhost and 127.0.0.1** using
normal trust/endpoint verification. **HTTPS environment PASS 2/2**, no TLS bypass or download.

The exact owned fixture and SSH forwarding processes were terminated; no 18446 listener remains
on either host. Postflight tool/cache/source/TLS hashes and empty DB privilege split remain PASS.
The socket-inspection representation diagnostic is disclosed, not a hidden application repair.
Full exact source, commands, actual kernel endpoint, log hashes, cleanup and limits are in
[envelope section 6](execution-envelope.md#6-trusted-https-execution-and-action-closure--2026-10-07).

**PG2 = PASS; PG3 = PASS; PG4 = PASS. IAM-46-A01 CLOSED. T001–T007 COMPLETE.**
The originally conditional human readiness authority is now satisfied by actual environment
results, not by converting NOT-RUN into PASS. T008 remains the next authorized task, followed
by T009 RED before T010 GREEN. T008–T093 are still NOT-STARTED here.

This is not actual IDEA Web/identity acceptance, a new product baseline, PG5, deployment or merge.
No application/test/migration/dependency source changed; no feature suite/Maven/package rerun
was needed for this environment-only check. Verifier NOT-RUN; PR #47 Draft/Open; Issue #46 OPEN.

## 12. Foundational identity and owner transaction execution — 2026-10-07

Engineering disposition: **T008–T012 COMPLETE, focused foundation PASS**. Independent review of
this implementation is NOT-RUN. Current exact executed application/test source is
`91667fa0d00d25945f54a43d026b8d9dda5ed056`; later status-only publication does not change it.
Readiness gates from section 11 remain PASS. No new requirement, product route, Permission,
dependency, schema migration, live adoption or UI behavior was added in this unit.

### 12.1 Published seam, source and command

[Named fixture](../../apps/server/src/test/java/com/idea/ddm/iam/IamIntegrationFixtures.java)
creates no implicit authority. [Real HTTP fixture](../../apps/server/src/test/java/com/idea/ddm/identity/IamSessionFixture.java)
signs in using the existing session/CSRF contract and captures the Server principal on the
existing protected session route; forged caller ActorId query/header is ignored. The password
and cookie stay in private memory, not retained logs. Only the isolated ephemeral loopback HTTP
fixture overrides cookie Secure; no production cookie/TLS change or HTTPS/Web claim.

The existing read-only `OwnerSessionEligibility` port was already correct. T009/T010 therefore
qualify previously implemented behavior GREEN, not sabotage it for RED. The new public
`IdentityTransactions.executeOwner` seam derives Actor/Organization from that port, coordinates
under lock 73003002 and calls owner-specific authority/state checks both before mutation and
before commit. Mutation and required owner outcome/authorization/Audit use the same JDBC
transaction; final accepted activity refresh shares its fate. SQL/commit errors do not claim
confirmed rollback or authorize blind retry. Legacy mutation logic is unchanged; the new port
does not implement a second evaluator or generic owner evidence framework.

Published [runner and contract](../../tests/iam-ui-46/README.md) freezes source/hash before each
execution. Byte-preserving command-local Git archive, local raw manifest check, archive transfer
identity and remote raw check all precede Maven. Final source exports **102/102 PASS** both
locally and remotely. Both final runs use archive SHA-256
`1e5e540e2e204fbd10ebfda2300dc3e6a9b4c750b6189c29812c26274d5f6666` and manifest SHA-256
`0a23d78c45db290432ce55936526b631ca969c0d639b1d3942227fc015b7f748`.

Exact commands (each after transfer/preflight, not on an uncommitted worktree):

```bash
bash /home/phuclam/idea-iam-ui-20261007-46/run-transaction-green-03/source/tests/iam-ui-46/run-owner-tests.sh 91667fa0d00d25945f54a43d026b8d9dda5ed056 0a23d78c45db290432ce55936526b631ca969c0d639b1d3942227fc015b7f748 transaction-green-03 IdentityTransactionsTest 11 PASS
bash /home/phuclam/idea-iam-ui-20261007-46/run-owner-qualification-03/source/tests/iam-ui-46/run-owner-tests.sh 91667fa0d00d25945f54a43d026b8d9dda5ed056 0a23d78c45db290432ce55936526b631ca969c0d639b1d3942227fc015b7f748 owner-qualification-03 OwnerSessionEligibilityTest 10 PASS
```

Installed JDK 25.0.4.1+1 / Maven 3.9.16, exact 82 toolchain and 544 resolved-input pins pass
pre/postflight. Only offline direct resources/testResources/compile/testCompile/Surefire goals;
no clean, lifecycle Web exec, package, Node, download or installation. PostgreSQL database is
only `idea_ddm_iam_ui_20261007_46`, separate real `idea_ddm_migrator` / `idea_ddm_app` roles,
fresh source-marked `iam_ui_<UUIDhex>` schema per class/run. No public-schema migration.

### 12.2 Truthful execution lineage

| Run | Exact source | Actual result / retained interpretation |
|---|---|---|
| export diagnostic | 6601c508dc090618e0d3d46fb8b49b946b96be1a | Three Git CRLF warning lines contaminated the first manifest generation; stopped at local raw check. No transfer/Maven/DB. Preserved local export; not runtime RED. |
| owner-qualification-01 | 98df712c24987d60688cbe963737f96de0f248ae | 1/1 PASS, 3.732s; exact Server-derived Actor/Org, read-only app transaction. |
| owner-qualification-02 | bf005bf80947f98e9db363bbfa817121ec463b21 | 10/10 PASS, 5.935s; no production eligibility change. |
| transaction-red-01 | 8b54b7cb29745ccaa381dc52ed98e9698ec8cfe2 | Compile diagnostic: fixture extraction left a stale clock identifier. Tests NOT-RUN; no schema created; not genuine RED. |
| transaction-red-02 | d5b670eb479eb14d93015cf81bb341a706bbece6 | Genuine executed RED: 1 test / 1 error, `UnsupportedOperationException: Owner transaction seam not yet implemented`. Existing F03 logic not sabotaged. |
| transaction-green-01 | 29804c2b9275dbccf26f1a24c85556f061ccfd6b | 1/1 PASS, 3.747s after minimum new owner transaction implementation. |
| transaction-green-02 | 747361d7f075385716f2ac93fec9ebaea3541293 | 10 tests: 7 PASS / 3 FAIL, 0 error/skip, 26.42s. Two lock-observation assertions used a cached transaction statistics snapshot; expected-owner-state test incorrectly changed the caller's security version and correctly got IAM refusal first. Preserved failed run; no production defect inferred. |
| transaction-green-03 | 91667fa0d00d25945f54a43d026b8d9dda5ed056 | **11/11 PASS**, 0 failure/error/skip, 7.077s. Separate autocommit lock observer, separate owner-state target, added affected legacy lifecycle regression; production bytes unchanged from green-02. |
| owner-qualification-03 | 91667fa0d00d25945f54a43d026b8d9dda5ed056 | **10/10 PASS**, 0 failure/error/skip, 5.959s on the same final source after shared-fixture/UoW changes. |

Eligibility covers real principal/forged Actor refusal, no-session raw Actor refusal, revoked,
stale security version, disabled Account/Actor, half-open idle 2h and absolute 8h boundaries,
different runtime instance and required caller-owned transaction. The runtime case uses a second
SessionService instance, not a claim of full process restart/recovery qualification.

Owner tests cover ACCEPTED mutation + one owner outcome + two authorization rows + Audit;
no-assignment refusal; expiry during work; suppressed required outcome/authorization/Audit;
deferred commit failure including activity rollback; real PostgreSQL wait then security-version
change/assignment revocation; final expected-state refusal. Existing authenticated account
create/disable/re-enable retains Actor/Account/Login IDs, PENDING semantics, zero implicit roles,
history and accepted evidence. This one affected regression is not the complete F03 83-test suite.

T012 supplies shared current-owner callbacks; new Project membership/delegation semantics are
still T016–T019 and owner-story work, not qualified by legacy AA fixture authority. No actual
new RBAC/Project/Group/API/UI/adoption behavior, full foundation T024 or whole-feature acceptance
is inferred. Next is **T013 schema/privilege RED → T014 additive successor**.

### 12.3 Database cleanup and retained log identity

| Run | Exact owned schema | Raw Maven log SHA-256 |
|---|---|---|
| owner-qualification-01 | iam_ui_f7871d152b6a4a878ce8923c0cd283a4 | daca393b989037a10a1f74f9c1a783c896add070d8c90650c13dcb4c956912dc |
| owner-qualification-02 | iam_ui_3357bf2a78b6404b9eabd8dd5b669600 | 62cccd830e63e5e48a8a2a2bf80fb3bf8979c698b3d19d6cd01b3339cc737f73 |
| transaction-red-02 | iam_ui_69acca16092c4453b840d31df786db14 | 7f401aac071598784d096cbb041671541a6a9b21234ec39aaa1f0e888dfc09d4 |
| transaction-green-01 | iam_ui_8a6bf5d9c48b44bcac62bf2718e497f4 | 5de3207030fc11471f98840e0b7521d5402de25d508553bbec09cfac610f9b3b |
| transaction-green-02 | iam_ui_82ad1bc9f89449c0bf20756d3b1c0190 | d5ae87f0c20f3d3c61b3eb7191f9802773e7cb6567f46e3c687df508271314c3 |
| transaction-green-03 | iam_ui_c87242f831894b2fa9b232a5e7a55879 | a473a08804a1413b3a7307e7f3333bd68f0cc38460a2a182032c7465ac5a27b8 |
| owner-qualification-03 | iam_ui_95ea5e00c3424e44a3d062791908119e | 14fe401399cbeec555beab25f647b27aae171b43a8687b36b35a5d5f6ffb9488 |

Private logs are `/home/phuclam/idea-iam-ui-20261007-46/run-<label>/maven-private.log`, mode 600.
The compile diagnostic log is SHA-256
`91a9ee631992902b9d435594c97795169ac619209a3cb1ceb1152a2b2595f6c3`.
Hashes identify retained files; raw-host independent inspection via GitHub remains unavailable.
No password/cookie/proof is reproduced here.

Every created schema above was dropped only after the owned Boot/test JVM exited and the exact
DB/schema owner/source marker was rechecked. All postflights report **exact schema remainder 0,
public tables 0, database retained**, source/tool hashes unchanged. Final source pre/postflight
log SHA-256 is byte-identical
`b82d566744985309932caa20a3b29ad35211ea7a7da0d112c84e8a5942cbe9a4`.
Prior failed exports/runs/logs remain retained; no broad cleanup, preview/company data or DB drop.

PR #47 stays Draft/Open, Issue #46 OPEN. No timer action, verifier, merge or deployment.

## 13. Schema successor and named story fixture execution — 2026-10-07

**Engineering disposition: T013–T015 COMPLETE; T001–T015 now 15/93 complete.** Section 12 is
the retained predecessor checkpoint. Exact final executed source:
`64ee5bb731ea6d95b85ed514a7840a1d0f4eaeb2`. **37/37 PASS**, 0 failure/error/skip across three
separately owned runs on that same source. Independent implementation review/whole-feature
acceptance NOT-RUN. This is partial foundation, not completed IAM/RBAC UI integration.

### 13.1 Schema and first-party implementation

[V11](../../database/migrations/V11__iam_rbac_ui_successor.sql) adds Project, Project Membership,
Business Group, Group Membership, product-owned permission registry, stable Role Definition,
sealed exact Role Version profile and separate candidate/permission staging. Structural profiles
extend the existing exact role model and original permission table; they are not a mirror evaluator.
Profile digests use declared v1 content and C-collation sorted permission codes, independent of
database locale. Existing `identity_role_version` content/triggers are not updated or bypassed.
Late permission insertion into a sealed version refuses; incomplete unsealed versions cannot commit.

Existing assignment is extended with typed Organization/Project scope, exact Actor/Group principal,
half-open period fields, version and attributable end metadata. `revoked_at` remains canonical;
legacy `effective_from` is exactly `assigned_at`, and unknown historical revoker is not fabricated.
One-unended-tuple indexes allow a new-ID explicit regrant without deleting or resurrecting the old
revoked row. Composite FKs retain Actor/Org and Group/Project/Org boundaries; exact sealed profiles
reject unsupported scope/principal shape. These are storage invariants, **not** delegation/owner
authorization or current Project Membership qualification; those remain T016–T019/story work.

The exact accepted **25 Permission / 8 built-in role-version manifest** is seeded without
assignments, bootstrap/adoption or old-content updates. Legacy Super@1 / AA@1 / AA@2 retain exact
IDs/content. AA@3 / Super@2 / PRA@1 / PA@1 / Audit Reader@1 are non-granting successor definitions.
Their new owner actions are not claimed executable/qualified merely because registry rows exist.
Candidate staging is distinct from immutable activated content; actual prepare/activate lifecycle
and narrow protected owner-write functions still require their planned behavior tests/implementation.
No blanket UPDATE/DELETE/TRUNCATE grant to app, PUBLIC executable guard, new role/credential,
database or dependency. Validation guards are invoker triggers with fixed schema-qualified SQL and
trusted search_path; they are not SECURITY DEFINER product authorization shortcuts.

[IamTestFixture](../../apps/server/src/test/java/com/idea/ddm/iam/IamTestFixture.java) supplies a
named `SignedInActor`, read-only eligibility and owner transaction helpers across test packages.
It wraps the same actual HTTP fixture and existing Server session contract; no raw ActorContext
constructor, UUID-array indexing, password/cookie/proof in fixture records or implicit grants.
The final accepted owner test exercises this named bridge. This is test infrastructure only.

### 13.2 Executed RED/GREEN and retained diagnostics

The machine-readable [20-run ledger](evidence/foundation-runs.tsv) freezes every schema RED/GREEN,
qualification and final affected rerun: exact SHA, test counts/failure/error/skip, owned schema,
raw input count, manifest/archive and private Maven-log hashes. Published runner commands are
fully determined by its label/source/manifest/test/count and RED/PASS disposition; no uncommitted
source or dynamic repair inside execution.

| Vertical behavior | Executed RED source / witness | GREEN source / count |
|---|---|---|
| Project/Group relational foundation | 8014b4e43d32200758ae3d1cc21d5e237abde8a8: missing 4 tables, 1 failure | 2c811d357e22bc39eff1e4afaa561b3ce06a804d: 1/1 |
| Separate role profile / candidate staging | 9b366fd9189afa5cb64f0cf30e6a51c17bdf4be4: missing 5 tables, 1 failure of 2 | 329fe9b66cf27f0c6cd33e4241e052b493a20d9c: 2/2 |
| Exact successor role content without grants | a422df9e614f0466b87dad69fc7904c185747b92: missing successor content, 1 failure of 3 | 48b7c3d2d58488c5a6c8cf2831bfa5662ab34e16: 4/4, also sealed-content case |
| No permission addition after activation | 82bcfadfcbc9b741b2bcd261ccf7a8335ee0706e: insert wrongly succeeded, 1 failure of 4 | 48b7c3d2d58488c5a6c8cf2831bfa5662ab34e16: 4/4 |
| Typed exact assignment / retained revocation | ded9a86efb4313c9bd060728bd00dc91c6217b73: missing 8 structural columns, 1 failure of 5 | 80372d8dce44080b6ba633b774ec6238d49a8514: 5/5 |
| Reject Org-only role at Project scope | 5e08fae31b00e58d416c0a3702a64225e7900771: invalid assignment insert succeeded, 1 failure of 6 | 03b0581cee9d6a5f25827cd08933d2eb53c3ae6a: 6/6 |
| Required membership-end reason | 2bc84416eaaba1c6ca777035e2818529a32e1d2a: NULL reason passed SQL CHECK, 1 failure of 15 | 5b70e9bf0731739df045a9018ade18bb5f53ec71: 15/15, both membership tables |
| Explicit Custom management scope | 2e8e4304cdcd88c2a3438028420aff643c1bfc20: NULL kind passed SQL CHECK, 1 failure of 16 | 6c054a15676a7ffa1bf7d77a7ce80ccc149f3003: 16/16 |

`schema-green-03` at 471e65d0bcd9b4f62404a80861f3321b3fba525e was **2 PASS / 1 FAIL**, not
GREEN. PostgreSQL default locale ordered `account.read` versus `account.re-enable` differently
from the oracle. Exact sets were present, but canonical ordering was not explicit. Successor
82bcfad pins C-collation in both content projection and digest. Failed log/archive retained;
the later 4/4 run independently demonstrates the content fix. It is not a rights/tooling failure.

Broader schema qualification was 14/14 at 02d5b1d05f9be38c8e17964f63e76e65025415d0 before the
two NULL-boundary additions. Later 16/16 and final exact-source rerun supersede that limited set
without rewriting it. V11 evolved only on unpublished-to-product owned test schemas through
these controlled source commits; each prior SQL blob/log/checksum remains retained in Git/evidence.
V1–V10 never changed. No installed company/preview/review database was upgraded or reused.

### 13.3 Final exact-source commands and results

All three commands below ran at source `64ee5bb731ea6d95b85ed514a7840a1d0f4eaeb2`, with raw
local/remote inputs **105/105 PASS**, identical transferred archive SHA-256
`f92458d94d03ac96eaffee35e65363cdb6d2d9e5fcbd88cf20f3b34042cdb238` and manifest SHA-256
`24596c17a2179bf7126b9210dfbfdb4d651a24f63b526ad6c0cac56d6b4fc885`.

```bash
bash /home/phuclam/idea-iam-ui-20261007-46/run-transaction-qualification-01/source/tests/iam-ui-46/run-owner-tests.sh 64ee5bb731ea6d95b85ed514a7840a1d0f4eaeb2 24596c17a2179bf7126b9210dfbfdb4d651a24f63b526ad6c0cac56d6b4fc885 transaction-qualification-01 IdentityTransactionsTest 11 PASS
bash /home/phuclam/idea-iam-ui-20261007-46/run-schema-qualification-02/source/tests/iam-ui-46/run-owner-tests.sh 64ee5bb731ea6d95b85ed514a7840a1d0f4eaeb2 24596c17a2179bf7126b9210dfbfdb4d651a24f63b526ad6c0cac56d6b4fc885 schema-qualification-02 IamSchemaPrivilegeTest 16 PASS
bash /home/phuclam/idea-iam-ui-20261007-46/run-owner-qualification-04/source/tests/iam-ui-46/run-owner-tests.sh 64ee5bb731ea6d95b85ed514a7840a1d0f4eaeb2 24596c17a2179bf7126b9210dfbfdb4d651a24f63b526ad6c0cac56d6b4fc885 owner-qualification-04 OwnerSessionEligibilityTest 10 PASS
```

| Actual run | PASS / duration | Exact schema (now removed) | Private raw Maven log SHA-256 |
|---|---|---|---|
| transaction-qualification-01 | 11/11, 7.165s | iam_ui_b674d8942199480a98a8d357c508bacc | e5851715a5a14a3c4fb14eabfbaee487c03c8b93211c8bbf42bfe60c07b87cb2 |
| schema-qualification-02 | 16/16, 2.425s | iam_ui_c05ed11855fd4ff587aa5467ba112cb3 | f0c1027122499fac0defbaa8fbb1968870d2597f8e099f8dfcdc979c06aa3bea |
| owner-qualification-04 | 10/10, 6.031s | iam_ui_c37ceb868c3043aaa3c30c61641ac6c8 | 3ad2bbaef15146e16f36a8cf3d91aa066dd98b05df517446121d22c72372f1cd |

Schema oracle includes actual app UPDATE/DELETE/TRUNCATE and SET ROLE refusal SQLSTATE 42501;
migrator ownership; raw accepted V1–V10 SHA-256; unchanged predecessor Flyway checksums; V11
upgrade/history and repeat **0**; exact non-granting content; immutable/sealed profiles;
unsealed commit refusal; scoped FK and duplicate-unended refusal; revoked history and new-ID
regrant; NULL required-field edges. These storage tests do not claim product administration
authorization, a fresh public-schema successor run or actual Custom-role activation workflow.

Final owner and eligibility suites use a fresh full V1–V11 schema each, repeat all prior focused
behavior after migration and exercise the named story fixture. One legacy account lifecycle
regression remains one test, **not** all F03/PH1 regression. Full foundation T024 and later T089
affected regression are still incomplete, as are T016–T093.

Every run used the existing named DB/real separate roles, admitted offline direct goals and
unchanged 82 toolchain / 544 resolved input pins. Owned JVMs exited before exact marker/owner
cleanup; all created run schemas removed, exact remainder 0, **public tables 0, DB retained**.
Final source pre/postflight logs have identical SHA-256
`867aceb623851ced8251097625e3806fda1943fad8293eeae37b76e32c99f866`.
Mode-600 raw logs and all previous failed roots/exports are retained, no broad cleanup or secret
disclosure. Log hashes identify files, not independent raw-log inspection through GitHub.

**Next authorized unit: T016 Project-owned read-state RED → T017 read-only facts → T018/T019
single evaluator**, then remaining foundation/client tasks before owner stories. No new approval
or spec/Q14/Q15 reopening is required merely to continue these already-authorized tasks. New
scope/tool/graph/target drift still STOP. No actual UI/domain acceptance, live adoption, company
data, preview/deploy, timer, verifier or merge. PR #47 remains Draft/Open; Issue #46 OPEN.

## 14. Project read facts and one all-path evaluator — 2026-10-07

Current partial implementation status: **T001–T019 COMPLETE (19/93)**; T020–T093 incomplete.
PG2/PG3/PG4 remain PASS. Final exact executed application/test/runner source:
`ee48c94a2ea91343f96080baa681a998d71b57ee`. This section supersedes the current next-step
status of §13, not its historical source/counts/evidence. Final focused result **70/70 PASS**:
22 Access Policy + 11 Project facts + 11 owner transaction + 10 IAM eligibility + 16 schema.
No failures, errors or skips. Independent implementation acceptance remains NOT-RUN.

### 14.1 Implemented seams and preserved boundaries

[ProjectGovernanceQueries](../../apps/server/src/main/java/com/idea/ddm/project/ProjectGovernanceQueries.java)
returns current Project identity/version and named Project/Group membership facts on the caller's
connection. One statement filters exact Organization, Project, Actor, canonical termination and
half-open periods. Current Group paths require matching current Project Membership. Missing or
wrong-Organization Project is non-disclosing; absent facts are not an authorized product query.
No second evaluator, mutation, IAM re-entry, activity refresh, transaction ownership or security
lock acquisition. The 11-case read-only app suite qualifies this internal read port, not UI-P01–P13.

[AuthorizationDecisionService](../../apps/server/src/main/java/com/idea/ddm/access/AuthorizationDecisionService.java)
is the one current Access Policy evaluator. It derives eligible Actor/Organization from the
existing actual IAM/session port, resolves every applicable exact assignment/version, and returns
an immutable positive-union decision/path list. Paths retain exact assignment, role version/code/
number, assigned scope, and applicable Group/Project Membership identities. No role-name/admin
bypass, implicit account/Project rights or general deny. Permission/principal/scope profiles are
read from sealed registered content. RBAC_GRANTED is eligibility to attempt the owner action,
**not** owner business success or a reusable client capability.

Organization inheritance applies only to declared descendant actions. Project assignments cannot
become Organization or another Project authority. PA administration does not require personal
membership; participant action and every Group-derived path do. Group paths are initial business
content only. The independent literal oracle checks all **8 built-in versions × 25 Permissions ×
2 action scopes (400 evaluations)** without replacing exact-version content with role names.
Synthetic participant-role/assignment rows are prerequisites, not implemented Custom activation,
delegation, assignment APIs or adoption. Source/test factories never grant product authority by
persona label or disclose credentials.

Multi-owner advisory evaluation requires caller-owned REPEATABLE READ/SERIALIZABLE state, or a
READ COMMITTED owner transaction already holding installation lock 73003002. The evaluator only
checks the held lock; it does not acquire it or change transaction isolation. The existing owner
UoW holds that lock and revalidates current IAM/owner state before commit. A snapshot remains
advisory: a concurrent revocation may remain visible as the old snapshot, but the next request
refuses and no decision may be presented as durable command authority.

The historical [IdentityAccessPolicy adapter](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityAccessPolicy.java)
retains existing Account/Actor checks; HTTP callers still use actual session eligibility. Its grant
resolution now delegates to the same exact model, respecting successor intervals instead of a
parallel LIMIT-1 policy. Its retained evidence shape still projects the first deterministic path;
historical decisions are not rewritten into new all-path records. The compatibility port is an
internal Server read after IAM eligibility, not a new authentication/HTTP boundary. Legacy time
recheck uses current PostgreSQL `clock_timestamp()`, not frozen transaction-start time. No API,
wire response, cookie, CSRF, account lifecycle, permission content, dependency or V1–V11 migration
change in this successor. Existing account create/disable/re-enable/atomicity regression is rerun.

### 14.2 Vertical RED → GREEN

| Behavior | Exact RED / observed witness | Minimum GREEN |
|---|---|---|
| Project-owned current facts | b314bf54ac73c444332cf384831d9faaa35ffe5e: executed unimplemented new port, 1 error | 0ec7a386dbfeebadfba6f1df6f1347f4f232fef9, 1/1; later a232742 11/11 |
| All direct positive grant paths | 6b60a4aa0b3e896a304f04d7aedfee8dcd10c4e5: executed unimplemented new evaluator, 1 error | 598170a11b2dcf27bb2d57d36410c8cd775c3fc8, 1/1 |
| Declared Org→Project administration | 767cec0e4ba94f9b9af1b2991471602d692fb656: expected child grant absent, 1 fail / 2 | 7d747b4f67385b8ace7e3caf39e5f2e7a683c31f, 2/2 |
| Direct + two matching Group paths | a45e04db97099e0a899ceedc6cb070abfcacde82: participant/group grant absent, 1 fail / 3 | 4b38ee198d9a596e2c94d6cae9bcb1b1fde36423, 3/3 |
| Consistent multi-owner read state | f2e4b0164e9a6075082f0679d5b61bfcbf09fb9f: uncoordinated READ COMMITTED incorrectly accepted, 1 fail / 4 | 62ef63affc0949c2cdb51a3be000b8a0892d43d5, 4/4 |
| Single model for old Identity callers | b07194e3fb64ab7a9be1cd250376b71a1516425c: old adapter created account through future assignment, 1 fail / 18 | 936da113327e96a4c765afbf9eaaf31db0e98ca8, 18/18 |
| Current recheck time | 40b5b3b9f522ab2c1e2e77fac9643ee8fffa661c: frozen transaction time missed currently effective grant, 1 fail / 19 | 9e00a07115895ce587fe696860b66c9184bd70c6, 19/19 |

The two initial errors are executed tests of new intentionally unimplemented public seams, not
compiler or sabotaged predecessor behavior. Matrix/negative cases that already passed were
qualified truthfully (17/17 at c7334bb); no manufactured RED. Local patch application ordering
needed one correction before source publication; it changed no files/execution input. All failed
attempts/source/exports/logs remain retained. No tool/dependency/hash/target or design drift.

### 14.3 Final exact-source reruns and cleanup

All five executions below use source `ee48c94a2ea91343f96080baa681a998d71b57ee`, raw local/remote
inputs **111/111 PASS**, manifest SHA-256
`d98e4e1818f76e9d704cb7aec3399a184cf58db5c6f3210e47fcc178fe845f38`, byte-preserving archive
SHA-256 `206e94f4a093ad319826e8c79dc7182addd639b8e2e6aa6328c1cdfb54aa080e` (identical after
transfer). No uncommitted source, dynamic execution repair, lifecycle build, install or download.

| Label / selector / count | Duration | Exact removed schema | Private Maven-log SHA-256 |
|---|---|---|---|
| authorization-qualification-02 / AuthorizationDecisionTest / 22 PASS | 12.11s | iam_ui_ca15eef03c7d4b09b58d958b72db977f | 37c9c3cb3948e2c7339f9503a722495008e16a7dca18e97ceaa5e497642983ac |
| project-read-qualification-02 / ProjectAuthorizationReadTest / 11 PASS | 6.605s | iam_ui_dc6783cc51ac473a90c6451687bca8b9 | eff94bd163f5039b25b5e3e4d1b89917882c0ee6ff069f9956bfa8ce79db44ca |
| transaction-qualification-02 / IdentityTransactionsTest / 11 PASS | 7.183s | iam_ui_6fd89ee806d5420b8db7e0e1bc2340af | 5634248580646eb31ad3fbdaa6abf9f4f97d6d575235a5a630c1dae75a9f438b |
| owner-qualification-05 / OwnerSessionEligibilityTest / 10 PASS | 6.092s | iam_ui_39f47949bfee436ea9f999d1c06a4471 | 9c1408a55d67bec9b3b19dc0100dbe497b0777197802bfa46ccebd90afbc0e75 |
| schema-qualification-03 / IamSchemaPrivilegeTest / 16 PASS | 2.416s | iam_ui_0ad8f3b80eca493998402c0e866a1756 | 07f2060f6b415ade0a35c70d5da27ab30ed3a0f719d27d3e6650693de314c57d |

Exact command for each row is:

```bash
bash /home/phuclam/idea-iam-ui-20261007-46/run-<label>/source/tests/iam-ui-46/run-owner-tests.sh ee48c94a2ea91343f96080baa681a998d71b57ee d98e4e1818f76e9d704cb7aec3399a184cf58db5c6f3210e47fcc178fe845f38 <label> <selector> <count> PASS
```

The [41-run ledger](evidence/foundation-runs.tsv) retains the prior 20 rows unchanged and these
21 successors, with every exact source/hash/count/schema. Read-only Project period/termination,
scope, no-side-effect/unavailable cases and evaluator profile/union/period/current security-state,
Group/direct membership, immutable path, unavailable/anonymous/idle/absolute cases all pass.
The per-role matrix uses declared literal expected sets, not database-returned permission sets as
its oracle. RBAC-only evaluator never attempts an owner business mutation. Existing owner/UoW,
real eligibility and unchanged schema suites remain PASS on the same final source.

Every test used only `idea_ddm_iam_ui_20261007_46`, separate real migrator/app roles and fresh
source-marked owned schema. JVM exit preceded exact marker/owner cleanup; zero exact remainder,
public still **0 tables**, DB retained, no DROP DATABASE. The same admitted 82 tools / 544 selected
inputs rehash PASS before/after; final source pre/postflight log SHA-256 is identical:
`1382583efc8f17dd38368f6bad0b063d0686f12756e8b9374f5561788bde4ee4`.
Mode-600 private raw logs are retained; hashes do not mean independent raw-log access via GitHub.
No company data, live adoption, preview, deployment, timer, verifier or merge.

**Next authorized: T020 shared HTTP/error contract → T021–T023 actual Web adapter/state → T024
full foundation qualification**, then synthetic Q15/account slices in task order. T024 is not
complete from these backend-only results. No actual UI/owner API/whole 009 acceptance is claimed;
PR #47 remains Draft/Open, Issue #46 OPEN. No new approval needed merely to continue authorized tasks.

## 15. Shared HTTP and Web state checkpoint — 2026-10-07

**Current engineering state: T001–T023 complete (23/93).** Exact final source is
`2f4424e2d8d815e14d41fd305048d4a9bf672036`: actual HTTP/PostgreSQL **9/9 PASS**, Web adapter/state
**14/14 PASS**, existing TypeScript **no-emit PASS**. T024 remains incomplete; the 70/70 backend
foundation tests in section 14 were not rerun on this successor. No actual Account screen,
directory API, Project/Group administration, assignment API, Q15 adoption or whole 009 acceptance
is claimed. New shared mapping is opt-in for reviewed successor adapters; existing Identity
contracts and security-filter refusals retain their status/empty-body behavior.

### 15.1 Scope and observed RED → GREEN

`IamWebConfiguration` wires the qualified existing eligibility/UoW/Project-read/evaluator beans
and supplies bounded reason/server-generated correlation responses only to `@Boundary` adapters.
Unexpected exceptions do not expose SQL, cause, request fields or diagnostic text. The synthetic
HTTP adapter exists exclusively in test source: there is no new product route or Swagger operation.
It enters through real ordinary HTTP sign-in/session/CSRF and real separate PostgreSQL roles.

| Behavior | Executed RED witness | Minimum GREEN |
|---|---|---|
| Bounded input refusal | d62905f: expected 400, actual 500, 1 fail | 1c5dbaa: 1/1 |
| Unexpected SQL failure redaction | da37e92: expected 503, actual 500, 1 fail / 3 | 20be1be: 3/3 |
| Broken JSON is input refusal | 1d47080: expected 400, actual 503, 1 fail / 8 | 948139a: 8/8 |
| Existing foundation bean wiring | 218f156: missing IdentityTransactions bean, 1 error / 9 | fd580a6: 9/9 |
| Initial UI state | 30ea5d5: public state seam unimplemented, 1 fail | 2b02fac: 1/1 |
| Existing session adapter | e4805c1: public client seam unimplemented, 1 fail / 2 | 8b64af5: 2/2 |
| Session + fresh-CSRF sign-in | 7f2913b: public sign-in seam unimplemented, 1 fail / 3 | 351026f: 3/3 |
| Logout and uncertain response | bc7a501: logout unimplemented and unexpected status mislabeled, 2 fails / 10 | f3bb2b3: 10/10 |
| Distinct settled view states | 944ccf3: public state transition unimplemented, 1 fail / 14 | 2f4424e: 14/14 |

HTTP attempt `http-contract-red-03` at `8cd4a17` unexpectedly passed 7/7. This is retained as
**UNEXPECTED GREEN, not genuine RED**. Existing mappings were already correct, and the old
22-character UUID sentinel did not deterministically force UUID parsing failure. Final source
uses `not-a-uuid`; final 9/9 verifies safe 400 for invalid UUID and broken JSON independently.
Two Web runner preflight failures at 0cf452c/948139a (JSON root-key handling and DefinitelyTyped
archive prefix) ran **zero Web tests**; they are runner defects, not product RED. Their owned
targets/source are preserved. No existing behavior was sabotaged to manufacture RED.

The Web client calls only existing relative session/CSRF/login/logout routes with ordinary
same-origin credentials, no-store and no redirect. Each mutation obtains fresh CSRF; no token
cache, JWT/storage bearer, client-authored ActorId, default Organization or synthetic grants.
It copies only accepted redacted response fields. A missing/malformed/unexpected submitted
mutation response is **unresolved**, not proof of rollback/success and not an automatic retry.
Read unavailability, refusal, stale state, authorized empty and loading are distinct. Credentials
are temporary request arguments, not retained client fields; actual input-control clearing and
unmount behavior await the actual Account/recipient story. This adapter is not yet wired to App.

Web tests mock only the external fetch boundary and use synthetic literals, not server secrets.
They are **not actual browser/HTTPS qualification**; real-client evidence remains pending in
the approved story sequence. The readiness certificate/browser checks are not Account UI PASS.

### 15.2 Exact final execution and retained evidence

Local raw inputs **126/126 PASS**, remote raw inputs **126/126 PASS** for the HTTP run. Shared
manifest SHA-256 `98dbb7004d313b403da3eea58d7631154fd470b7a37ac29298b863d56a0224ed`;
byte-preserving archive SHA-256 `6defa315c2196e1441575c55d37aad5a31b7d6876270131acb0b6830b494f924`
identical after transfer. Source was committed/pushed before execution, with no dynamic repair.

| Check | Exact command / retained private evidence | Result |
|---|---|---|
| HTTP / PostgreSQL | `bash /home/phuclam/idea-iam-ui-20261007-46/run-http-contract-qualification-01/source/tests/iam-ui-46/run-owner-tests.sh 2f4424e2d8d815e14d41fd305048d4a9bf672036 98dbb7004d313b403da3eea58d7631154fd470b7a37ac29298b863d56a0224ed http-contract-qualification-01 IamHttpContractTest 9 PASS` | 9/9, 0 failures/errors/skips; 5.420s |
| Web + typecheck | `pwsh -NoProfile -File C:/Users/TD-999/.codex/iam-ui-46/export-web-green-2f4424e-05/source/tests/iam-ui-46/run-web-tests.ps1 -SourceRoot C:/Users/TD-999/.codex/iam-ui-46/export-web-green-2f4424e-05/source -SourceSha 2f4424e2d8d815e14d41fd305048d4a9bf672036 -Oracle PASS -ExpectedCount 14` | 14/14, 0 failures/pending; TypeScript no-emit PASS |

HTTP Maven-log SHA-256: `bfadfc15de85bfe24a78fc05e741fc2dbedefd56fa1fb5204ed4a847b7ea7bfa`.
HTTP controlled-source pre/postflight log hashes identical:
`2d8811ea354c91cb292a15400bec134dfc1d80d729f5db7e57308fdad1a9fd3d`.
Private Web-log SHA-256: `b1623657a0701093abe0baff22ed4ccd1fb945bf8596cd6d01fd6311f8832d1d`;
private Web-result SHA-256: `121c2d760e5771b8a751d482645295faf4afc6f2a6cc9ed000407503e2b5b4ee`.
The [51-row HTTP/backend ledger](evidence/foundation-runs.tsv) preserves the previous 41 rows
unchanged. The [Web ledger](evidence/web-foundation-runs.tsv) retains all 12 attempts, including
the two NOT-RUN preflight failures, genuine REDs and final GREEN. Hashes are file identities,
not proof of independent access to private raw logs via GitHub.

HTTP used only DB `idea_ddm_iam_ui_20261007_46`, fresh schema
`iam_ui_8df22dcf611c4473a46d1f8da09d7292` and existing separate migrator/app roles. Owned JVM exited
before source-marker/owner-checked exact cleanup: zero exact remainder, public **0 tables**, DB
retained. The admitted 82 tools/544 selected inputs rehash unchanged; no new dependency/graph,
POM or migration. V1–V11 unchanged in this checkpoint. Web used admitted Windows Node 24.19.0,
44 exact locked cached packages/44 archive integrity checks and 1,255 byte-matched members copied
to a fresh owned export. Original/shared/projected input and Node postflight PASS; no install,
download, npm lifecycle build, shared-cache write, live data or browser-secret evidence.

### 15.3 Delivery priority and next task

The many small publication/export/runner cycles caused disproportionate delivery overhead;
they must not be mistaken for visible UI progress. The user requested a usable account flow
and challenged this delay. Close the current foundations with only necessary affected T024
regression, qualify the accepted separate synthetic Q15 prerequisite, then prioritize **US1
Account UI MVP** before Project/Group/Custom/inspection. This follows the existing accepted plan,
does not waive security evidence or reopen product design, and adds no framework/research loop.
PR #47 remains Draft/Open; Issue #46 remains OPEN. Independent implementation review, actual
Account UI/browser qualification, deployment, verifier and merge remain NOT-RUN. No timer action.

## 16. Account UI MVP fast-delivery milestone — 2026-10-07

**Engineering milestone: Account MVP usable; not whole-US1/whole-feature acceptance.**
PG2/PG3/PG4 remain PASS. T001–T033 and T035–T042 complete (**41/93**). T034 is explicitly
partial for outcome-insert-specific and different-purpose reissue tests; T043–T093 remain open.
Sections 1–15 retain their original inspected/historical checkpoint facts; this section supersedes
their current/next-step status, not their execution evidence. Issue #46 OPEN; PR #47 Draft/Open.
Independent implementation review, persistent deployment, verifier and merge **NOT-RUN**.

### 16.1 User-visible vertical flow and retained presentation

The existing authored UI is retained from admin `9160ec27dec2b80b96c36adf94460864fd265099`
and login `8811521b831f597275d7b86ff0f50245f0a4510b`: BrandShowcase/LoginForm/Topbar,
SessionLanding, admin rail/three-pane composition, styles and first-party logos. `App.tsx`
owns readable real session/hash-route composition; no replacement mock app or second router.
Two logos moved into Vite-imported `src/assets` so anonymous login uses the already-approved
`/assets/**` surface, not a broader Server public-resource permission.

Actual flow:
eligible recorded context → authorized account list/detail → create **PENDING** →
explicit exact-login setup proof → intentional masked private handoff → anonymous recipient
proof + CSRF redemption → fresh sign-in → disable/old-session refusal → reset **while DISABLED** →
still DISABLED → separate re-enable → fresh sign-in using new credential; stable Actor/Account IDs.
No automatic Project/Group membership or Role Assignment. Super-only is not an implicit Account
Administrator. Browser AA@3 is a synthetic test prerequisite, not an implemented grant UI.

List/detail queries use current session/IAM and the shared evaluator, bounded scope/page/filter,
redacted exact Login Identity metadata and no unauthorized global counts/verifiers/proofs.
Manual delivery is a separate opt-in setting (default off), not enabled by the synthetic flag.
Additive V12 records exact-login/purpose supersession; V1–V11 stay immutable. Reissue changes only
the matching unconsumed proof set in the issuance transaction. Required Audit failure preserves
the prior proof and rolls back new issuance. Recipient proof is one-use/15-minute, never an AA role.
Password/proof are temporary intentional controls, cleared on submission/unmount/handoff removal;
no URL/storage/auto-clipboard/log/HAR/trace/screenshot secret retention.

Network loss after a real Server **201** is **unresolved**, not success/rollback. Mutation controls
stay disabled; Chrome observes exactly one POST, no automatic retry. Ordinary-user refusal,
reload/current Server authority, invalidated session and logout unmount are actual Web behaviors.
Other Project/Group/assignment/Custom/inspection navigation is visibly disabled, not fake usable UI.

### 16.2 Minimum GREEN, executed RED and affected regression

The [20-run backend ledger](evidence/account-mvp-runs.tsv) records exact source, manifest/archive,
schema, counts and private-log hashes, including failed attempts. These are separate executed
sources, **not one same-source suite total**.

| Boundary | Genuine RED / retained failure | Qualified GREEN / exact source |
|---|---|---|
| T024 foundation regression | Historical REDs remain in §§12–15 | Five foundation suites 70/70 rerun at `2f4424e2d8d815e14d41fd305048d4a9bf672036` |
| Q15 successor | 7a0e2bc: 1 error, unimplemented seam; 92b90d8: 1/6 fail, sole effective Super@2 recovery | Positive 1/1 at 687692e; expanded negative 8/8 at `dc68571da7fcd82974e809d72b853431e99b338e` |
| Account HTTP/context/directory | a9b3461: 6/6 fail, missing actual adapters | 6/6 at `4c74daec202791613259924288a61205db0a9e35` |
| Exact-login setup reissue | 7e4bb87: 3/3 fail, old proof not superseded | 3/3 at 4c74dae: exact login, sibling isolation, forced Audit rollback |
| No implicit product access | Already-correct create behavior, no manufactured RED | AccountIsolationTest 1/1 at `232e2198350c63a28257b0ebf9e8aa139dd91347` |
| Legacy Identity | 20 tests PASS; first runner postflight mistakenly counted another parallel browser schema | 20/20 at 232e219; independent exact 20-schema cleanup PASS, not original runner PASS |
| Legacy HTTP/session/credential | 232e219: 1/83 fail, successor history assertion still expected V1–V10 | 83/83 at `de30be700c2552433608db9c8950d4691f7ac475`; expected V1–V12 only in scoped successor fixture |
| Web Account/recipient/state | ad4d6a3: 6/20 fail, missing client operations | Final 28/28 + TypeScript no-emit at 4c74dae |
| Packaged actual Web/browser | Earlier fixture/harness failures below, not broad product failures | Headed trusted Chrome 10/10 at `b50272136295a9f2fed7142ba6442e44c6738d17` |

Q15 negatives include exact Actor/Organization/version, revoked/disabled/stale state, real/dummy
BCrypt and shared HTTP/console throttle, block deadline preservation, success-clear/Audit rollback,
unknown-login no durable rows, headless refusal and last effective Super@2 preservation.
Actual packaged PTY below qualifies **ADOPTED → ALREADY_ADOPTED** separately: same immutable
Super@1/bootstrap, one Super@2 assignment, zero console-created HTTP sessions; no live adoption.

New HTTP 6/6 + existing 83/83 together cover current account context/read boundaries, malformed/
wrong-scope/ordinary/stale refusals, lifecycle stable IDs, exact reset L1/L2, disabled reset, one-use,
controlled-time 15-minute expiry, CSRF, session invalidation and legacy atomicity. Old qualified
cases were reused, not rewritten merely to inflate new test counts. The three reissue tests do
**not** independently establish outcome-insert-specific fault or different-purpose isolation;
T034 retains those obligations. No claim of final whole-feature recovery/race/browser matrix.

Web final private log SHA-256:
`cbf37a496f5294a16400556c546a8fceef802343d102348bdea2f01e95c641fb`;
result JSON SHA-256:
`ecd8de8c1857eda6546f49566f9301eaf83971010b65114885c8edec38d0f246`.
Windows Node 24.19.0, 44 exact locked cached packages/archives and 1,255 byte-matched members;
original/projected/shared inputs and Node postflight unchanged, no npm install or new package.

Retained Web intermediate failures: b19d97b tests passed 20/20 but typecheck failed on a first-party
event type; not full PASS. 74ee732 had 1/24 failure from an overbroad SSR privacy assertion matching
a legitimate option value, not retained proof text. a44079f passed 24/24 + typecheck; dc68571 passed
28/28 + typecheck after authored presentation reuse. Final 4c74dae additionally qualified imported
brand assets and actual browser integration.

### 16.3 Exact final package, Chrome cases and command identity

Final exported/package/browser test source: **`b50272136295a9f2fed7142ba6442e44c6738d17`**.
Final application/Web source: **`4c74daec202791613259924288a61205db0a9e35`**.
The delta 4c74dae → b502721 changes only the browser harness/README/input manifest, not application,
Web, migrations or dependencies. No production Java/migration delta after dc68571; no Server source
delta from de30be7 to 4c74dae. Application/test inputs were committed and pinned before their
executions; FAST DELIVERY batches the remote push into this coherent milestone, not each microtask.

Owned root: `/home/phuclam/idea-iam-ui-20261007-46/run-account-qualification-14`.
Local/remote raw inputs **166/166 PASS**.
Manifest SHA-256: `0ae194f1ef5e9f482ce387a4b4c8cb0fa763b404917baa9f9e05367d7af77237`.
Byte-preserving Git archive/identical transferred archive SHA-256:
`6d3ff8681a5059f621712472ada3ea2e76806ec6254c55ba9e96ade24f4fecf7`.
Final JAR SHA-256: **`0382a2c13bc8de8d73f22b9a25c7644640846e48cb20bb93c335f2dfffee78e5`**.
Offline package and executable manifest/loader PASS; actual Web present, exact **57 nested runtime
JAR hashes**, **0 JSR305 providers**, **0 build-tool payload**, **3/3 retained notices** and
**V1–V12 byte/hash** oracle PASS. No dependency/POM/version change.

Published runner commands used:
```text
bash tests/iam-ui-46/account-browser.sh b50272136295a9f2fed7142ba6442e44c6738d17 0ae194f1ef5e9f482ce387a4b4c8cb0fa763b404917baa9f9e05367d7af77237 account-qualification-14 build
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> account-qualification-14 start
<approved Windows Node> <exact export>/tests/iam-ui-46/account-browser.mjs <same SHA> <same manifest> account-qualification-14
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> account-qualification-14 verify
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> account-qualification-14 stop
```
Build runs the admitted Linux Node 24.21.0 Web builder and pinned offline direct Maven goals
resources/testResources/compile/testCompile/jar/Boot-repackage, not the nested online lifecycle.
Backend ledger rows use the published `run-owner-tests.sh <SHA> <manifest> <label> <selector>
<count> <oracle>`. Web uses `run-web-tests.ps1 -SourceRoot <exact export> -SourceSha 4c74dae...
-Oracle PASS -ExpectedCount 28`. Source/command/target remain attributable, no dynamic uncommitted
execution repair. Full owned paths/pins are in [runner instructions](../../tests/iam-ui-46/README.md)
and [execution envelope](execution-envelope.md).

| Actual headed Chrome / packaged boundary | Result |
|---|---|
| Q15 real packaged console initial/repeat via PTY | PASS |
| W01 authored anonymous brand assets, real session/server Actor, admin navigation, cookie attributes | PASS |
| W02 actual PENDING create/detail/exact target | PASS |
| W03 private reissue; old proof refusal; recipient redemption/input clearing | PASS |
| W04 disable invalidates old session and credential sign-in | PASS |
| W05 DISABLED reset cannot enable; separate re-enable; stable IDs; new-password fresh sign-in | PASS |
| W06 ordinary refusal/direct route; reload from current Server | PASS |
| W07 real committed 201 response loss; unresolved UI; disabled fields/button; exactly one POST | PASS |
| W08 labelled keyboard focus, 780px responsive/no page overflow, bounded private/URL/storage/console checks | PASS |
| W09 logout/protected UI unmount | PASS |

Installed Chrome **154.0.8037.98**, Playwright/playwright-core **1.62.1**, approved Windows Node
**24.19.0** with unchanged binary hashes. Actual normal-trust HTTPS `https://localhost:18446/`
over owned loopback SSH forward; Server bound only `127.0.0.1:18446`, no TLS bypass.
Existing trusted test certificate SHA-256
`6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`,
SAN localhost/127.0.0.1, valid 2026-10-07T05:19:50Z → 2026-10-14T05:19:50Z. No trust-store change.

Browser safe-log SHA-256: `c783f11c90d72cc16e9ae31c78fe5bff31538b2720bec8dc74bac125452e3791`.
Private offline Maven log: `ce46f6b06ebd5ce62e3ece939a33f1d68bf41dea618d6884a9cb3b9df939132b`.
Private Web build log: `d38a609cb7b4c01026158ffa7eebcb4b29c682a955efcbb82b24cfc887bc4cbf`.
Source final-check log: `8139a9d69e0feaea6eb206be988db58e78ed4e4e865e5cd5e790decfeb39468c`.
Retained hashes identify files, **not independent access to private raw logs through GitHub**.
No credential/cookie/CSRF/proof values are retained in the browser evidence.

### 16.4 Retained engineering failures, cleanup and remaining work

All earlier owned attempt directories/evidence remain retained, not reused or rewritten as PASS:
root04/232e219 package passed but startup lacked TLS alias (browser NOT-RUN);
root07/f5d64ac actual Q15 passed, W01 found inaccessible anonymous brand assets (fixed by import);
root09/4c74dae reached W01–W06 but response-loss proxy used Node's distinct TLS trust context;
root12/fcfbab1 and root13/d47d680 used actual Chrome response interception and stopped at the
harness's inappropriate Playwright fieldset-disabled predicate. Root13 diagnostic retained
only **HTTP 201 / intercepts 1 / UI UNRESOLVED / AssertionError**, no private diagnostics.
Final harness tests native fieldset.disabled **and** effective login/button disabled state.
It does not weaken the unresolved/result/no-retry oracle.

Only DB `idea_ddm_iam_ui_20261007_46`, existing real `idea_ddm_migrator` owner and
`idea_ddm_app` runtime. Final exact schema `iam_ui_2d717ded6c7343388afd983690d14eab`.
Database oracle PASS: no Project/Group membership or implicit roles on newly created Accounts,
preserved bootstrap/Super@1, one Super@2, zero console sessions. Final controlled source/82 tools/
544 selected inputs/package rehash PASS. Owned JVM stopped **before** exact marker/owner-guarded
schema cleanup; final exact remainder **0**, public tables **0**, private fixture JSON removed,
owned Windows SSH forward stopped, both qualification listeners absent. **Database retained**.
Earlier schema cleanups likewise checked exact ownership/source, not a broad DROP DATABASE.
Preview 18444, company/Vault/production data and other DBs untouched.

Account MVP checkpoint may now receive implementation review. Do not wait for microtask approvals
or rerun full readiness merely to continue authorized work. Next bounded work: close the explicit
remaining T034 targeted reissue coverage, then T043–T054 Project/Group vertical slice; later
assignment/Custom/inspector/final recovery remain separate accepted tasks. No new requirement,
framework, speculative work, timer action, deployment, verifier, merge or whole-feature PASS.

## 17. T034 Account reissue coverage closure — 2026-10-08

The Project Reviewer accepted the published Account MVP at `06004b5d9e6a3f2f1fa38276657357b216310fd8`
through the human conversation, then authorized closing the two explicit T034 obligations before
Project/Group. Historical section 16 remains unchanged. T034 and US1 are now engineering-complete;
this does not complete 009 or grant live deployment/merge authority.

`CredentialProofReissueTest` adds outcome-insert-specific rollback and different-purpose history
isolation to the existing exact-login, sibling-login and Audit rollback cases. It uses real HTTP
and the existing qualified issuance implementation. Already-correct product behavior was not
altered to manufacture RED. An initial first-party test queried the wrong purpose table and
failed 1/5 at `8e621feb7ac8fb4f6988163ab36806310a8a5400`; that failure remains retained.

Corrected exact test source **`15a98ca0281330283614db8e784011afd8532c62`**:
**5/5 PASS**, zero failure/error/skip, owned `account-qualification-16`, schema
`iam_ui_c1987fafa263468cb957102c139cce9e`. Log SHA-256
`27c87c8f6e9e753ede897067bfc33de1002535cb8aef3e02668fd6df11ba7e33`.
Local/remote raw inputs 166/166; manifest
`ad1b609f867a3c26a0979f5c74ddd72c406d78ff7633e581e6076a5bdd9506dc`;
identical archive `ad843fb60a146e8140de21299abd5359ba99d7463786bee8f74f9ae9a38f1eff`.
Affected successor requalification is also 5/5 at `818ccbd`, ledger below.

The different-purpose fixture retains FIRST_SETUP metadata while testing RESET issuance on an
ACTIVE Account. It proves RESET does not supersede FIRST_SETUP history; it does **not** claim
the retained FIRST_SETUP proof remains redeemable on an ACTIVE Account. Required outcome failure
rolls back both new issuance and matching-proof supersession. Private browser handoff/response-loss
evidence remains section 16, not newly claimed from these five tests.

## 18. Project/Group usable vertical slice — 2026-10-08

### 18.1 Scope, usable flow and implementation trace

**T043–T054 / US2 engineering-complete; current tasks 54/93.** This coherent FAST DELIVERY
milestone implements only the accepted UI-P01–P13 contracts. It is not whole-feature PASS,
independent US2 implementation acceptance, deployment or general Assignment UI completion.

The authored Login/Admin/Project shell is preserved. Actual `App.tsx#projects` uses Server
context, authorized Project list/detail/actions, explicit reason/version/scope commands and
real reads. Usable flow: **create Project → create Group → assign Project Membership →
assign Group Membership → inspect/end/rejoin history**, including rename, permitted filters/pages,
ordinary/scoped refusal, stale version, unavailable reads and same-ID response-loss resolution.
Project creation creates no membership or Role Assignment. Admin authority remains separate
from engineering participation; Group target must be a currently eligible member of its Project.
Assignment/Custom Role/Inspector screens remain unavailable.

| Accepted obligation / task | Source and executed qualification |
|---|---|
| Org creation, no implicit participation; scope-filtered reads; UI-P01–P13, T043/T045/T048/T049/T051 | `ProjectGovernanceAdministration`, `ProjectGovernanceQueries`, `ProjectGovernanceController`; actual HTTP 6/6, P01/P04; participant UI-P13 returns only ID/name and requires permission + membership |
| Explicit Project/Group membership, history, no nesting/same-Org constraints, T044/T050 | `ProjectParticipationAdministration`; HTTP 6/6 + owner 3/3 + data 3/3; browser P02/P03 and DB postflight |
| Atomic owner outcome/authorization evidence/Audit; version/concurrent/replay/refusal, T047 | Shared `IdentityTransactions` lock 73003002 and the same `AuthorizationDecisionService`; atomicity 3/3, owner 3/3 and HTTP retry tests; no second evaluator |
| Target eligibility at authoritative commit | Genuine RED at 82a3116; target-check callback before commit in e9e814a; controlled-clock Project membership expiry rolls back Group assignment, versions and accepted evidence |
| Protected owner storage | Additive V13 outcome/evidence and V14 four narrow owner functions; direct protected mutations/TEMP refused with 42501; exact function owner/fixed qualified search path inspected and actual app function invocation qualified |
| Actual authored Project UI, T046/T052 | `ProjectAdministrationPage`, `ProjectsView`, ordinary same-origin `iamClient`; Project Web 8 + affected Account/Web 28 = 36/36 and TypeScript PASS; headed browser P01–P08 |
| Consolidated affected qualification and evidence, T053/T054 | Distinct exact-source runs below, ledger, final packaged browser/DB/postflight, affected Account 12/12 |

V1–V12 bytes are unchanged; V13/V14 are additive in fresh UUID test schemas only. V14 ports
use fixed schema-qualified SQL and SECURITY DEFINER with fixed pg_catalog/schema search_path,
no PUBLIC execution and no blanket app UPDATE/DELETE/TRUNCATE. Migrator/app separation was
not weakened. Core v0's single operating Organization invariant remains: these tests reject
invalid Org/Actor/Group tuples and inspect the actual constraints, not claim multi-tenant runtime.

### 18.2 Genuine RED and retained engineering failures

- Create route: `38e952d` HTTP expected 201, observed 404 (1 failure/1); minimal owner/query/adapter
  GREEN `80ecc4b` 1/1. Membership route: `551a686` 1 failure/2; `f29aee2` GREEN 2/2.
- Expanded negatives: `eef2a3a` 2 failures/6: wrong-scope request incorrectly became 503 because
  evidence used the requested unknown Organization FK, plus a first-party raw JSON ordering
  assertion. `0b83c4c` retains originating Organization/requested scope separately and compares
  parsed JSON; HTTP 6/6. No wire taxonomy or authority requirement changed.
- Web adapter RED at `aea1681`, followed by minimal actual Project integration at `18ad91b`;
  initial targeted Web 4/4, successor Project tests 8/8 plus all affected Web 36/36.
- **Commit-target expiry RED** `82a3116d20aff38d7460fb61c744f3b3ab70f441`, 1 failure/3:
  admission-time Project membership was insufficient when it expired before Group commit.
  Log `34a8adc3580d049a52924052a17cdf40d8ff09c0ccf7cc0d36fc862a278007be`.
  `e9e814a` adds exact target recheck at commit; GREEN 3/3 at `4732918`, and final 3/3 at
  `818ccbd`. This is a product repair, not an evidence-only change.
- Earlier runner/export diagnostics (unavailable unzip; orchestration CRLF) stopped before
  applicable Maven/schema execution. JDK jar and raw LF transport reused admitted tooling.
- Browser fixture initially referenced package-private password utility from outside Identity:
  compile stopped before tests. Fixture moved into Identity; its renamed source was then added
  to the manifest. The intermediate 179-file owner run covered owner inputs but not that unused
  browser fixture; final source/export has all 180 controlled inputs.
- Data test oracles initially tried a second operating Organization, app TEMP and migrator
  SET ROLE app. Actual baseline correctly refused these. Corrected tests respect those
  restrictions; no privilege relaxation, second Organization or schema-rule weakening.
- Historical Project browser root22 stopped before Chrome because installed Chrome drifted.
  Root26 at `691fc2d` passed P01–P03, then a harness list-count assertion ran before the scoped
  asynchronous list was ready. Safe log `933b0c0b5a1a6fa699c592378994f45eb3f07318772b6034bd246b8f93840e95`.
  `1d3fbd4` waits for the exact permitted Project row before asserting list count/non-disclosure;
  no product or oracle weakening. Previous roots/logs remain retained and cleaned, not reused.

### 18.3 Consolidated milestone results and exact-source lineage

[Run ledger](evidence/project-group-runs.tsv) retains source, class/count/result, schema, raw-input
count, manifest/archive and private-log hash for predecessor RED/engineering failures and GREEN.
Counts below are **distinct source executions**, not a single same-source aggregate.

| Qualification | Exact executed source | Result |
|---|---|---|
| Project actual HTTP contracts | `5f1fca9f6c650381b1e47d7eb426776730367d1a` | 6/6, 0 failure/error/skip; log 83d429db… |
| Project data/relationship/privilege | `f25a3a0de0bc3036368f5ecee318926ef21e97d5` | 3/3; log 9a1b47a6… |
| Project atomicity/concurrency | `818ccbdd6b8c15cb8e81ca4bbb2b5ecb0cda7286` | 3/3; log fa777e92… |
| Project owner/expiry/history/refused replay | Same `818ccbd` | 3/3; log ff23cc56… |
| Affected Account directory/credential/lifecycle | Same `818ccbd` | 6/6; log 645e5f94… |
| Affected reissue/outcome/purpose | Same `818ccbd` | 5/5; log b91d0efd… |
| Affected zero implicit membership/roles | Same `818ccbd` | 1/1; log 63cba4a4… |
| Complete affected Web + TypeScript | `e9e814a6fcf617b90862d35b7e84e711f1c2a51a` | 36/36 (28 prior + 8 Project); TypeScript PASS |
| Final offline package/content/actual headed Chrome | `1d3fbd4d35650ec2c561032ae605e440a639473c` | Package PASS, browser 8/8, fixture DB oracle PASS |

Latest application/Web source is **e9e814a6fcf617b90862d35b7e84e711f1c2a51a**.
From that commit through the final browser source, only test fixture/data oracles, browser/runner,
input manifest and execution record changed; production Java, Web, dependencies and migrations
are byte-identical. Repaired application is what the final package actually built. Further
publication changes only status/evidence/handoff/runner README documentation and the README's
input-manifest hash; no application/test/runner behavior changes. Executed raw manifest identities
remain those recorded above, not retrospectively replaced by the publication manifest.

Web exact manifest `6799687e5f95e2b8fa45188a99fbd88c47d5e3816aafb2298a0854f8c3f1a624`;
archive `e85cb05d0672bec3d442732d08ab4c73d5d9196367fcbdb869ee0ff25d8abfed`;
180 raw inputs. Retained safe Web log
`ee3094c7f9762bc53b8d11175dea08eba60d2baaa5e870387f8b38a6fab6fa43`;
JSON result `7b73d7ba6203d06090d82bd2f269ce12a7cdd2a0c1482a0f23ff6c3dbe8176fa`.
44 cached Windows packages/1,255 members and original/projected inputs checked before/after;
no install/download. Full legacy 103 regression is retained from section 16 and was not
rerun after each microtask. Applicable Account regression here is 12/12, not a new 103 claim.

### 18.4 Final actual package and browser

Owned root: `/home/phuclam/idea-iam-ui-20261007-46/run-project-qualification-27`.
Exact source/package/browser: **1d3fbd4d35650ec2c561032ae605e440a639473c**.
Local/remote raw 180/180 PASS; manifest
`98013f5adae745c779e1809caf650ca1b2f9c8f157198d22fb987f50e8d2cc77`;
identical transferred archive
`371e81e088fb7441d1c841afb290a1a973c43f3510e57fac405898965fa86537`.
JAR SHA-256 **`1f45b1eac8a57fc0a17f9f2194fb9851ef7b519ee83cee64b559ad82b7179592`**.
Executable loader/manifest/actual Web, 57 exact nested JAR hashes, 0 JSR305 providers,
0 build-tool payload, 3/3 notices and immutable controlled V1–V14 bytes: PASS.

Exact published commands:
```text
bash tests/iam-ui-46/account-browser.sh 1d3fbd4d35650ec2c561032ae605e440a639473c 98013f5adae745c779e1809caf650ca1b2f9c8f157198d22fb987f50e8d2cc77 project-qualification-27 build
pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical transferred JAR> -RepositoryRoot <raw verified export>
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> project-qualification-27 start
<admitted Windows Node> <raw verified export>/tests/iam-ui-46/project-browser.mjs <same SHA> <same manifest> project-qualification-27
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> project-qualification-27 verify
bash tests/iam-ui-46/account-browser.sh <same SHA> <same manifest> project-qualification-27 stop
```
Backend ledger uses `run-owner-tests.sh <source> <manifest> <label> <selector> <count> PASS|RED`.
Web used `run-web-tests.ps1 -SourceRoot <verified export> -SourceSha e9e814a… -Oracle PASS -ExpectedCount 36`.
Only admitted absolute Node, direct offline Maven goals, cached tools/dependencies; no lifecycle
exec/clean, new dependency, package/browser download or Python execution.

| Actual browser oracle | Result |
|---|---|
| P01 actual current context, Org create, no implicit participation | PASS |
| P02 Group target prerequisite and explicit Project → Group membership | PASS |
| P03 ended history, rejoin new association, Group eligibility and explicit Group end | PASS |
| P04 Project-only scope cannot create/list hidden Project; ordinary direct route refuses | PASS |
| P05 exact-version stale write refuses, no false success | PASS |
| P06 real committed 201 response loss, locked controls, same OperationId resolution once | PASS |
| P07 confirmed write + unavailable refresh stays unavailable, not replaced by success | PASS |
| P08 labelled keyboard, 780px no page overflow, cookie/private boundaries, logout/reload | PASS |

Human-approved installed Chrome **155.0.8059.39** / SHA-256
`d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c`,
recorded before execution in [envelope section 7](execution-envelope.md#7-projectgroup-browser-tooling-successor--2026-10-08).
Playwright/core 1.62.1; Windows Node 24.19.0. Actual same-origin packaged Web via
normally trusted `https://localhost:18446/`; one Server listener `127.0.0.1:18446`,
owned Windows loopback SSH forwarding. Same section 16 certificate/validity, no TLS bypass
or trust-store modification. This does not requalify historical Chrome 154 runs as Chrome 155.

Safe browser log `07fc9ba884f17e51787cea82666e500262eadf0d259be4c03e0506c89ed4f884`;
private package log `fe61d2b4825e65577e64f502ff5a9e4ec48bab9adf82cf73807cc89c91e05683`;
Web build `7b17bc17fd76f8be4bf6f7c3dad4ab076bc1d7d4d306512ad544e9216966f275`;
raw source pre/final check `bd37e527464046e6c245b2a4f160f4ff70a7abf6937ac1a5f6448f1fdf48cc5a`.
Raw private log access limitation remains: hash identifies a retained file, not independent
GitHub access. No password, cookie, proof, CSRF, HAR, screenshot or private diagnostic in evidence.

### 18.5 Postflight, limits and next unit

Final schema `iam_ui_8c2ef21cd8b2467da45aed4a2da93a2b`. Actual fixture DB oracle PASS:
creator Project membership 0, implicit assignments 0, retained Project association history 2
with one ended, Group ended history 1, accepted owner results each have required Audit and no
duplicate operation result. Source/tools/package postflight unchanged, 82 toolchain + 544
resolved inputs rechecked. Owned JVM was terminated before exact source-marker/owner-guarded
schema removal; exact remainder 0, all owned IAM UUID schemas 0, public tables 0.
Private fixture JSON removed; both qualification listeners/owned SSH forward stopped.
**Database retained**, no DROP DATABASE; failed roots/logs preserved.

Final Windows Node/approved Chrome executable rehashes also match their admitted pins.
Publication checks: 84 local document links, 32 unique operation IDs, 93 task IDs / 54 complete,
historical V1–V12 unchanged, application/Web/migration/dependency lineage unchanged after e9e814a,
test fixture/classes absent from executable payload, repository tracked-file hygiene and diff
whitespace PASS. No implementation extension hooks configured. These are author/configuration
checks, not runtime or independent-review acceptance. The untracked local Vitest cache is not
part of the publication; no unrelated user file is adopted or deleted.

Only `idea_ddm_iam_ui_20261007_46`, existing separate migrator/app identities, synthetic data.
Preview 18444, other databases, company/Vault/production data untouched. No live Q15 adoption.
No persistent Project/Group deployment: do not interpret the closed test URL as a running preview.

Next authorized vertical slice: **US3 T055–T064 role catalogue/independent assignment wizard**.
Custom Role/Inspector/final cross-screen accessibility remain later tasks. The browser cases
above qualify this slice, not full US6 accessibility/recovery or whole-feature PG5.
PR #47 stays Draft/Open, Issue #46 stays open. Verifier, deployment, merge and timer action
remain NOT-RUN / not performed. No accepted spec/design/Q14/Q15 or architecture reopened.

## 19. Role Assignment UI usable vertical slice — 2026-10-08

**US3 T055–T064 engineering COMPLETE; 64/93 tasks.** Human FAST DELIVERY authority begins at
`45da65c9b92231dda5214318df515afa2cddb2fc`; this is author qualification, not independent
implementation acceptance or whole-feature PG5. No Custom Role publication/Inspector was opened.
The original RBAC header/tabs/table/drawer and visual tokens are retained, with actual Server data
and the approved Scope → Actor within Group filter OR explicitly labelled Group principal → exact
Role/version → Server delegation preview/consequences/reason/confirm flow. No Department scope,
mock authority, bootstrap shortcut or role-name authorization.

### 19.1 Implemented boundaries and trace

| Requirement / operation | Source and qualification |
|---|---|
| Exact catalogue and qualified availability, UI-R01 | `RoleCatalogueQueries` / `RoleCatalogueController`; bounded scope-authorized reads, exact IDs/code/version, per-Permission IMPLEMENTED/DESIGN; unqualified content not selectable |
| Independent Actor/Project Group grants, UI-R05–R07 | `RoleAssignmentAdministration` / controller; Org/Project scope, Group confined to its Project, same applicable permission path AND delegation envelope; preview is advisory; target ActorId never establishes caller identity |
| End/replace/regrant history, UI-R08/R09 | Canonical `revoked_at`, expected row version, immutable before/result envelope, new successor ID; atomic end + insert + Access Policy outcome + request/commit authorization evidence + Audit |
| Commit-time current authority / recovery | Existing shared IAM security-write lock/UoW and evaluator; authority recheck, self-elevation refusal, distinct eligible Actors across supported Super@1/@2; no last-recovery removal |
| Browser multi-role/scope/retry | `AssignmentWizard`, authored `RbacView`, ordinary same-origin client, actual `#rbac` route; separate assignment IDs and exact code/version, stale/refused/unavailable/unresolved states; no automatic retry/new OperationId |

Trace: FR-014–019/021/029, REQ-AUTH-001/003/004/006/010, IF-RBAC-ADMIN; catalogue FR-019–021
and REQ-AUTH-002/009/010; existing Q14 administration versus participation remains unchanged.
V15 is additive: immutable `assignment_owner_operation` / `assignment_authorization_evidence`
and a fixed-schema, app-executable narrow `role_assignment_end` port. Raw assignment DML still
returns SQLSTATE 42501. V1–V14, legacy role contents, dependency graph and auth/session contracts
are unchanged. This is not blanket UPDATE/DELETE authority or a generic operation framework.

Ordinary granting selects only complete qualified role content. AA@1/@2/@3, PA@1 and legacy
Super@1 are qualified; PRA@1, Audit Reader@1 and ordinary Super@2 granting remain non-selectable
while their complete content includes unimplemented Audit/Custom actions. Existing separately
adopted Super@2 authority still evaluates exact supported assignment actions: catalogue
assignability and an existing assignment's effective permission are different questions.
Group/business qualification uses an exact sealed `project.read` prerequisite role seeded only
by the migrator fixture. This does **not** implement Custom Role publication or claim a production
business-role catalogue is populated; that is US4. Administrative roles remain Actor-only.

### 19.2 Targeted RED/GREEN and retained failures

Exact-source PostgreSQL rows/hashes are in [assignment-runs.tsv](evidence/assignment-runs.tsv).
All use the approved database, separate app/migrator and fresh source-marked UUID schemas.

- Catalogue tracer `f8aeabf…`: real HTTP 404, 1/1 failed; `d386c63…`: 1/1 GREEN.
- Grant tracer `5625058…`: real HTTP 404, 2 tests/1 failure. Early GREEN attempts exposed a
  preview DTO missing-value defect and PRA self-grant defect; final successor `680ae3a…`: 8/8.
- `39d0802…` has 10 tests/2 genuine failures: highest Org authority incorrectly evaluated at
  Project scope, and ordinary existing/missing AssignmentId disclosure. `456aabd…`: 10/10 GREEN.
- Web first config attempt discovered no tests and is **NOT an executed RED**. Corrected
  `540e0bd…` ran six client tracers, 6/6 failed; `2c1bea4…` ran them 6/6 GREEN + TypeScript.
  Safe RED log `7413cdf76ad6e35d433b4e66b5af76db8f5c5710a1a88d97bb3e14e6505cbc65`;
  RED JSON `343bde1183f71057f0a24f246ee3d3588c3448cbd777cbfc9261d0edc417d39e`.
- Recovery initial qualification had cross-test preexisting holders; isolated fixture repair
  produced 3/3 GREEN. Atomicity/recovery oracles already implemented correctly are qualification
  GREEN, not fabricated pre-implementation RED. T056/T058 behavior obligations are qualified;
  task wording's historical RED intent is not a claim every case initially failed.
- Affected Project concurrency initially returned CSRF 403 while two threads initialized a
  fresh post-login token. Explicit ordinary CSRF initialization before racing owner commands
  repairs the **test**, not Server CSRF. Retained failed run -19; exact successor -23: 3/3 PASS.
- Runner -10 expected seven Account tests but executed six, all PASS; the command still stopped
  for count mismatch. Correct six-test successor -16 is PASS, not a retrospective runner PASS.
- Browser -04 stopped at ambiguous select labels; named controls and independent target/catalogue
  request lifetimes were corrected. -15 stopped at a harness `isDisabled()` option false negative:
  the native DOM `option.disabled=true` and Server `selectable=false` were verified; native property
  oracle replaces that assertion. -22 passed R01–R08/DB oracle but stopped at immediate focus
  observation; successor waits for the rendered title focus without weakening the focus condition.
  Failed logs/roots are retained, not rewritten: safe log hashes -04
  `73f114e4244b80a46f239e060032eedb1dbadd6b8a0e531d868b3e4a8e8da421`, -15
  `899ba113fbe5a61b71ed3b944b6f52cbe653337fdb1f7275cf1680f4b13552af`, -22
  `6fbae69e87989fac0be6304b9e2cf178e29b178468d618486a0f5f436715a5fe`.

### 19.3 Consolidated qualification and exact lineage

| Executed source | Actual checks | Result |
|---|---|---|
| `b38849831618d7229b6dcf66d6bc95ab5dc65861` | Assignment HTTP 10, atomicity 4, recovery 3; fresh roots -07/-08/-09 | 17/17 PASS; failures/errors/skips 0 |
| `0c92f7597ff1dc924a3a40a431d05c4fa3277157` | Affected Account 6 + proof reissue 5 + Project HTTP 6, roots -16/-17/-18 | 17/17 PASS |
| `7ff2e3085a5f5624423083f9059ea0473eca626e` | Affected Project atomicity 3 + evaluator 22, roots -23/-24 | 25/25 PASS |
| `0c92f7597ff1dc924a3a40a431d05c4fa3277157` | Complete affected Web (36 prior + 8 assignment), TypeScript | 44/44 PASS + typecheck PASS |
| `6687439cd6c26ee2612effadba69b4e647b3cf42` | Offline package/content, actual headed Chrome, fixture DB/postflight | PASS; Chrome 9/9 |

No single same-source backend total is implied. Affected regression is 42 tests across the
recorded pins, not a rerun of historical legacy 103. Production Java/migrations/dependencies
are identical from b388498 through final package source; production Web is identical from
0c92f759 through final package source. Later changes are test fixture/CSRF initialization,
browser observation/runner manifest only. Publication changes status/contracts/evidence/README
and its manifest hash only; no post-qualification implementation change.

Web raw manifest `acd483f1797d9cbc4e988cf791de7da2060c1959a7ca30e9792f8bead9a429e4`;
archive `cb08e9a3349f9d3e53066749cf3c52d39feb9ab6342838cbda35de5e6b609a8c`;
194 inputs, 44 cached packages/archives, 1,255 original/projected members unchanged. Safe log
`be153e478917da5dcea7b01ad8899235f04484a316c21ee36e45b6be5d4eae92`; result JSON
`c6ecd47a0d1e5d2e454f0d2d4b7736670d277b821785d6f8b493d6bedde63485`.

Final fresh owned package root `/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-25`;
local/remote raw 194/194 PASS. Manifest
`e99f5a2a25aec13359a5e6b0afedeb494851dd0c20ec76419ef25f20e6449cc5`; identical transfer archive
`231d336b8550b20356911958da47ccda74189574034fe81b0ef4685909914329`.
**JAR SHA-256 `86fc24cf3b4acacc46346b47b54d4a5987d48d95f2c494f68de54cbeb11ff433`.**
Executable manifest/loader/actual Web, 57 exact runtime JARs, 0 JSR305 providers/build-tool payload,
3/3 notices and V1–V15 raw migration projection PASS. Test-only fixture classes are not product routes.

Published command family (actual source/manifest above, admitted absolute tool paths):
```text
bash tests/iam-ui-46/run-owner-tests.sh <source> <manifest> assignment-qualification-NN <exact class> <actual count> PASS
pwsh tests/iam-ui-46/run-web-tests.ps1 -SourceRoot <raw export> -SourceSha 0c92f759… -Oracle PASS -ExpectedCount 44
bash tests/iam-ui-46/account-browser.sh 6687439cd6c26ee2612effadba69b4e647b3cf42 e99f5a2a25aec13359a5e6b0afedeb494851dd0c20ec76419ef25f20e6449cc5 assignment-qualification-25 build
pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical transferred JAR> -RepositoryRoot <raw export>
bash tests/iam-ui-46/account-browser.sh <same source> <same manifest> assignment-qualification-25 start
<admitted Windows Node> <raw export>/tests/iam-ui-46/assignment-browser.mjs <same source> <same manifest> assignment-qualification-25
bash tests/iam-ui-46/account-browser.sh <same source> <same manifest> assignment-qualification-25 verify
bash tests/iam-ui-46/account-browser.sh <same source> <same manifest> assignment-qualification-25 stop
```

### 19.4 Actual browser and postflight

| Browser case | Result |
|---|---|
| R01 authored RBAC, actual catalogue/context, ordinary private session | PASS |
| R02 explicit Org, exact Actor/code/version, independent multiple assignments | PASS |
| R03 atomic replacement/new ID, separate end, other-role/history retained | PASS |
| R04 stale predecessor version refuses without false success | PASS |
| R05 Project-scoped Actor filtered within Group versus explicit Group principal | PASS |
| R06 DESIGN roles disabled; ordinary direct route fails closed | PASS |
| R07 actual committed 201 response loss, locked intent, same-OperationId resolution | PASS |
| R08 unavailable read is not an empty/successful assignment list | PASS |
| R09 title focus/Tab/Shift-Tab/Escape, 780px no page overflow, private boundaries, logout/reload | PASS |

Actual headed Chrome 155.0.8059.39, admitted Playwright/core 1.62.1, Windows Node 24.19.0;
unchanged approved hashes, current normally trusted section 6 certificate/SAN/validity. Actual
same-origin Web from repaired package via loopback `https://localhost:18446/`; no TLS bypass,
trust change, JWT or localStorage auth. Probe target is synthetic; preview18444 unchanged.
Safe final browser log `680e9d38d780d2fda9f5a4b3e745ff93d22d7ebcec040ac74f86b69ba209da84`;
private package log `c0abf1f823f58c30026c21191d867449e84f03022b14b19aff54fac760fa7d71`;
Web build `953b1181971b66cc8414c1b7197c1826c910e4ea2a2e126dbadb3e68da74fac6`;
raw source final check `1bbc8bb6face3e132fc22dc2d9125c23969450f88e88e916e5cdee2f107855a3`.
Raw host-log access limitation remains: recorded hash is not independent GitHub log access.
No password/cookie/CSRF/proof/HAR/screenshot/private fixture bytes are published.

Fixture schema `iam_ui_89c8074916e84b6ca34f41b40d312d10`: 7 ACCEPTED + 1 stale REFUSED,
16 request/commit evidence rows + 8 Audit rows; two independent live AA roles, one Group
principal; no retry duplicate or implicit membership. Existing direct admin has zero personal
Project Membership. JVM PID226120 stopped before exact source/owner-guarded schema cleanup;
SSH forward PID30328 owned and stopped; both listeners absent. Exact schema remainder 0,
public tables 0; private fixture removed, database and historical failure logs retained.
82 toolchain + 544 resolved inputs/source/package rechecked; final Node/Chrome hashes unchanged.

Publication checks: 80 relative documentation links resolve; 32 unique operation IDs and
64/93 task markers agree. The final JAR hash matches and excludes assignment browser/test
fixture classes. The tracked-secret detector remains **NOT-PASS** (six credential-assignment
matches), not an automated PASS. Manual inspection found no retained working credential:
`TransferClientBoundaryTest` and `GatewayHttpQualification` generate/read private test TLS
material; `account-browser.sh` reads the existing owner-only TLS/database credential files;
credential redemption tests submit a fixed synthetic string only to an in-memory HTTP double;
Project and Assignment Web tests deliberately inject dummy `password` fields to qualify
redaction. The new US3 match is `assignmentWizard.test.tsx`'s dummy redaction input. No detector
rule was weakened or finding erased; these are manual author dispositions, not verifier or
independent secret-review acceptance.

PR #47 stays Draft/Open and Issue #46 stays open. T065–T093, Custom Role publication,
Inspector/history/general resolution and full US6/whole-feature qualification remain later work.
No persistent deployment, live adoption, verifier, merge, timer action or company/Vault data.

## 20. Custom Role UI usable vertical slice — 2026-10-08

**US4 T065–T074 engineering COMPLETE; 74/93 tasks.** Human FAST DELIVERY authorization starts
from accepted predecessor `febe59dee53fbee060a18692a7d15ce3b4f50b7e`. This is author engineering
qualification, not Project Reviewer implementation acceptance, full US6 or whole-feature PG5.
Original RBAC presentation is preserved; its Custom Role link opens the actual `#custom-role`
route. No mock authority, built-in edit, new Permission, policy engine or Inspector implementation.

### 20.1 Objective, behavior and trace

Qualify a real eligible Server session/PRA delegation preparing a candidate, observing the
supported ceiling/diff, validating current content and activating a complete immutable version.
Then explicitly assign v1, activate v2 while preserving that assignment, and separately replace
it with a new assignment ID. Scope is Organization/Project management; a Group is a supported
business principal in its Project, never a new management scope.

| Requirement / operation | Source and exercised oracle |
|---|---|
| FR-019/020; UI-R01–R04; REQ-AUTH-002/004/006/009/010; IF-RBAC-ADMIN | Existing sole UI-R01 catalogue; `RoleDefinitionCandidateService`, activation service/controller and real Web route. Nonempty supported profile, exact management scope, code/version/base/digest, registered qualified Permission content only |
| FR-018/020; T066/T069/T070 | V16 separates draft content from authority; V17 exposes a fixed-schema narrow activation function. Raw app DML and late insertion into sealed permission content refuse 42501; activation inserts complete immutable content once |
| FR-020/021/029; T068/T072/T073; SC-005/006 | Existing v1 content/result and assignment remain unchanged after v2; explicit US3 replacement retains predecessor history/new successor ID. Stale candidate/base, unsupported/self-authorizing content and wrong delegation refuse |
| FR-023/025/028; T068/T073 | Current ordinary session/CSRF plus existing evaluator/IAM UoW; request/commit recheck, atomic candidate/version + owner result + authorization evidence + Audit; required-write/deferred commit faults cannot leave partial success |
| FR-026/027/029; T067/T072/T073 | Exact input/Actor-bound same-OperationId resolution, concurrent arbitration, changed-input refusal and different-Actor non-disclosure. Actual response loss leaves a locked unresolved intent, not an automatic new request |

The current Custom ceiling is `project.read`, `role.catalogue.read`, `access.inspect`, `audit.read`.
Only the first three have qualified applicable implementation; `audit.read` remains DESIGN and
disabled. `project.read` is Project-supported business content, optionally Actor + Project Group;
administrative read/inspection profiles are Actor-only. Project management cannot manufacture
Organization support. A candidate cannot supply assignment/delegation/definition mutation rights.
Prepared draft content grants nothing. The public workflow does not expose arbitrary conditions.

Complete qualified Custom content becomes selectable by exact roleVersionId/code/version.
Legacy AA/PA/Super contents and existing assignments are untouched. Full PRA@1/Audit Reader@1/
ordinary Super@2 grant selection remains unqualified while `audit.read` is DESIGN; the browser
fixture's preexisting PRA/PA/AA assignments are explicit migrator-owned prerequisites, not proof
of general role seeding/adoption or live administrative assignment. No DESIGN role is unlocked.

V16/V17 are additive. V1–V15 bytes, POM/runtime graph, authentication/session/CSRF and existing
UI-R01/R05–R09 adapter ownership are unchanged. SQL ports do not grant blanket app UPDATE/DELETE.
Future candidate edits are new proposals, not mutation of an activated Role Definition version.

### 20.2 Targeted RED/GREEN and retained failures

Exact PostgreSQL source/schema/count/hash identities are in [custom-role-runs.tsv](evidence/custom-role-runs.tsv).
Every row uses `idea_ddm_iam_ui_20261007_46`, separate app/migrator and fresh marked schemas.

- Candidate tracer `10dc0ab…`: real HTTP 404, 1/1 failed; `822df5e…`: 1/1 GREEN.
- Validation/activation tracer `b4a17eb…`: real HTTP 404, two tests/one failure;
  `0459355…`: 2/2 GREEN. No fabricated RED for preexisting protected-role SQL invariants.
- Web configuration `3b470af…` selected no tests: **NOT-RUN**, not RED. Correct selection
  `c78c97c…` ran five failing client tracers; `f45e333…` ran them 5/5 GREEN + TypeScript.
  RED log `3f2a1a3bf8fe7538f7ae46673eb7f957de3e0fd8f7d455c15bce2eb4a5d04ff4`;
  GREEN log `17ab4757981637f8d05a545794442afb7b1ac593ad5288838d6c2369b0a07120`.
- Qualification -01 stopped on the runner's one-class allowlist before Maven; **NOT-RUN**.
  Tests run in separate fresh roots afterward; no weakening of schema/cleanup guards.
- Contract -02: six tests/one fixture error, because a Project prerequisite referenced an
  unseeded Actor before real sign-in. Repair seeded that Actor through the existing session
  fixture first; -05 returned 6/6. This is not a product authorization repair.
- Schema -11: 16 tests/one stale test expectation (12 versus actual 17 migrations). The
  test now expects the additive current chain while retaining predecessor checksum checks;
  -16 returned 16/16. No migration bytes were edited to satisfy the assertion.
- Internal two-axis review found missing initial-refusal security evidence and a lost selected
  successor intent after catalogue paging. `68292b5…` is executed RED: atomicity 6 tests/2
  failures; Web 8 tests/1 failure. `2a572ba…` is GREEN. Initial denial now retains one REQUEST
  decision and required REFUSED security Audit, **no owner result/candidate**; suppressed Audit
  returns 503 and rolls back both. Revoked authority waiting for the IAM lock cannot activate.
  A selected base missing from the current page now refuses locally, never falls back to New.
  RED Web log `b2ee14291886d9c39213593d451955ca923e778661b3dd3e5a9e0983c1e67cb8`;
  result JSON `559bdba3c28cfd54e8d510a3c16daed40bb0d6e32d496e9c21ba48c7de0ecdeb`.
- Standards review also found a confirmed activation message overwriting a failed catalogue
  refresh. The UI now independently states confirmed activation + unavailable refresh and
  forbids a new activation; actual Chrome C07 forces that read failure and verifies the message.
- Browser -17/-18 passed C01–C03, then stopped inside C04. Failure diagnostics were initially
  too coarse. The observation was narrowed and its preserved-assignment read moved from a
  separate Node-side request context/noncanonical URL into the actual normally trusted browser
  using same-origin fetch. These failed attempts are **not** Chrome transfer/qualification PASS;
  no exact raw exception/root-cause claim is made. No application/TLS behavior changed to make
  the observation pass. Final -19 passes all cases with the same application/test source.
  Safe failed logs -17 `83dd067d8032ac44e89bfd690be4ee67d7cf650c70381620fe3fd2c73dedbb18`,
  -18 `cd85e10b1c8cad9682419ff8a1018f8a226871d1643301d71b418e9326f64bde`.

### 20.3 Consolidated result and exact source lineage

| Exact executed source | Qualification | Actual result |
|---|---|---|
| `31a49b9113163ad44a3cc40dfa6480d3abe55d12` | Affected assignment HTTP10 + atomicity4 + recovery3, roots -08/-09/-10 | 17/17 PASS; zero failure/error/skip |
| `2a572ba39757b7bd2632de119cc2d508fc7b3bed` | Custom HTTP6 + atomicity6 + immutability3, roots -14/-12/-15 | 15/15 PASS; zero failure/error/skip |
| `2a572ba39757b7bd2632de119cc2d508fc7b3bed` | Affected schema/privilege/checksum/repeat, root -16 | 16/16 PASS; zero failure/error/skip |
| `2a572ba39757b7bd2632de119cc2d508fc7b3bed` | Consolidated Web (44 predecessor + 8 Custom), TypeScript | 52/52 PASS; typecheck PASS |
| `f223e3ee348847490927b5d484a8b996e4fda173` | Offline executable package/content, actual headed Chrome, fixture PostgreSQL oracle/postflight | PASS; Chrome 9/9 |

No single same-source grand total or new historical 103-test run is implied. The assignment
17-test source precedes a repair confined to Custom owner authorization/UI and a stale schema
test count. Existing assignment implementation did not change; actual explicit assignment/
replacement was also exercised in the final browser. From application/test `2a572ba…` through
final package/browser `f223e3e…`, **only** `custom-role-browser.mjs` and `inputs.sha256` changed.
Publication after the final package changes records/task status/operation availability/README
and their controlled manifest hashes only, not production Java/Web/tests/migrations/dependencies.

Web raw 207/207, 44 existing package/archive projections, 1,255 members before/after unchanged.
Safe Web log `601ec25f7ecb6330f0f5f94700d9126a878694c689c36250e83db6796c5077e7`;
result JSON `701e9691dcf3d1c75b313e0a921c8c31e7c71b950cc197d44576257e8fabec84`.

Final fresh root `/home/phuclam/idea-iam-ui-20261007-46/run-custom-role-qualification-19`:
raw inputs 207/207 locally and after extraction; byte-identical transfer archive
`b5b02a508a15cab967c4f91da3621b5670d33a66d9ceab11f31773f6b20087e4`;
manifest `2f099fdbd3b6fde1db9096c10cb29644359d08a24920631c43849198bd8bcf40`.
**Final JAR SHA-256 `136087d4ed84411779af6d98a43f1ffc6a032207208e99c2b6925d158273abcd`.**
Manifest/loader/actual Web, 57 exact nested runtime hashes, zero JSR305/provider/build-tool
payload, notices3/3 and V1–V17 raw migration projection PASS. Test fixtures remain excluded
from the application; no test F04/product route or Swagger operation added.

Commands use admitted absolute JDK25.0.4.1+1/Maven3.9.16/Node24.21.0 paths, offline direct goals
only, as [published command packet](../../tests/iam-ui-46/README.md#custom-role-consolidated-milestone).
Browser: installed headed Chrome155.0.8059.39, Playwright/core1.62.1, Windows Node24.19.0,
existing normally trusted SAN localhost + 127.0.0.1 certificate/validity from section 6. Final
Node/Chrome/certificate hashes match the admitted pins. No npm/Maven/download/install or TLS
bypass/trust change. Synthetic same-origin Web is served by the actual package on loopback18446;
no persistent preview18444/deployment change.

### 20.4 Actual browser, internal review and limits

| Case | Actual result |
|---|---|
| C01 original RBAC link, actual ceiling, DESIGN disabled, private ordinary session/cookie | PASS |
| C02 real candidate → diff/validate → sealed immutable v1 | PASS |
| C03 separate exact v1 Actor assignment via actual US3 wizard | PASS |
| C04 committed activation response loss → same-ID resolution; assignment remains v1 | PASS |
| C05 explicit replacement/new ID, original version/assignment history retained | PASS |
| C06 obsolete base refuses, no false activation | PASS |
| C07 exact Project management; confirmed activation + failed catalogue refresh truthfully separated | PASS |
| C08 bad CSRF/ordinary authority/unavailable reads fail closed | PASS |
| C09 keyboard/780px page width/private DOM-storage-cookie boundaries/logout/reload | PASS |

Fixture schema `iam_ui_2b546918073f41cc86c585a151482d1b`: six accepted Custom mutations + one
stale business REFUSED, fourteen request/commit decisions and seven Audit rows; two Custom
definitions/three sealed versions. Two explicit assignment transitions, no implicit assignment,
zero retry duplicates; v1 history preserved. This does not claim all US5/US6 functionality.
Safe browser log `f8a5d5a417b383cce8ff2a80bde18d3b93a08933e2f22d7bd4fc5770c2f82949`;
private package log `469bf9a0b943b9c3576199e20a819027c0cde4c2a419bed3b911182be8681c86`;
Web build `c83da4cf0f577039d1e8254a8a7f62a3db6f11b7a0159be012b1c6827fdc49ee`;
raw source final check `ec9d2951528d414c276a3b8570cacf3e842422d0f53fdb2a237c622ced55bade`.

Owned JVM323676 stopped before source/owner-marked schema cleanup; owned SSH forward31920
stopped. Independent final DB read reports zero `iam_ui_<UUID>` schemas and zero public tables;
both18446 listeners absent, private fixture removed, DB/failed roots/logs retained. No company/
production account, other DB, Vault, preview or live console adoption touched. All 82 toolchain
and 544 resolved-input rows and original controlled inputs/package rechecked unchanged.

Internal author review is separate from external acceptance:

- **Standards:** two documented findings (initial refusal evidence, refresh-status overwrite)
  repaired; RED/GREEN and final Chrome C07 retained. One non-blocking heuristic remains: similar
  CSRF/payload helpers in `CustomRoleContractTest` and the named qualification fixture. No new
  standard is inferred from that duplication; no unrelated refactor undertaken.
- **Spec:** two source findings (vanished selected base, initial refusal evidence) repaired and
  source-rechecked at 2a572ba by the internal spec worker. Its partial-delivery finding (T073/
  T074 recording) is fulfilled by this milestone publication. No scope creep reported. Reviewers
  performed read-only source reviews; they did not independently execute the tests above.

Tracked-secret detector remains **NOT-PASS**: seven credential-assignment matches. The six
historical matches retain section19's manual dispositions; the new `customRoleEditor.test.tsx`
match injects dummy `password: "discard"` solely into an HTTP double to test DTO redaction.
No retained working credential identified; detector unchanged, not relabelled automated PASS.
No password/session cookie/CSRF/private proof/HAR/screenshot/private fixture bytes published.
Private raw-log hashes are retained identities, **not** independent GitHub raw-log access.

Publication checks: 119 relative feature-document links resolve; 32 unique operation IDs and
74/93 task markers agree; diff whitespace check PASS. One first author-accounting command used
an overly narrow status regex and stopped (it omitted existing qualified status suffixes);
counting exact unique operation IDs corrected the check, not the contract. Final package
explicitly contains zero Custom browser/contract/atomicity/immutability test-fixture classes.
No extension hooks are registered (`.specify/extensions.yml` absent). No complete feature claim
is made from completion of this requested slice.

### Current next step and stop boundary

Custom Role UI is usable for this qualified profile. **T075–T093 remain open**: Access Inspector/
history/general resolution, final cross-screen accessibility/recovery and whole-feature integration.
US5 T075 is the next planned slice, not executed under this bounded US4 request. PR #47 stays
Draft/Open, Issue #46 open. Independent US4/whole-feature acceptance, verifier, deployment and
merge NOT-RUN; no timer/Tracker action. No spec/design/Q14/Q15/architecture reopening.
