# IAM/RBAC Integration — Inspected Predecessor and Handoff

| Field | Value |
|---|---|
| Stable ID / class / version / state | `IE-HO-IAM-UI-001` / supporting source inventory/handoff / `0.3` / Draft Analyze-repair successor |
| Authority / owner / author | INFORMATIVE / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Main `4e5244430ea89ffe878819e1279f6e05c60d610a` / 2026-10-07 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective date | Project Reviewer SPEC REVIEW PASS at e227cb1d; DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d on 2026-10-07 via human conversation / formal applicable PG2/PG3/PG4 and execution readiness NOT-RUN / NOT-APPLICABLE |
| Upstream / downstream | [Spec](spec.md), [decisions](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md) / reviewed design and execution packet |
| Change / retention / trigger | [Issue #46](https://github.com/devphuclam/IDEAEngineering/issues/46); retain in Git; re-inspect after source, UI lineage or interface changes |
| Supersession / evidence | No accepted technical predecessor replaced / source inspection, supplied exact-head human design disposition and authorized documentation repair; runtime NOT-RUN |

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

Documentation checks and read-only Analyze successor are complete as recorded in section 7;
publish the authorized repair to Draft/Open PR #47, without treating it as execution approval.
Then T001–T007 must establish explicit applicable gate authority and an exact approved execution
envelope before any T008+ fixture/test/production/migration edit or runtime/setup execution.
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
