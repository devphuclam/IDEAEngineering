# IAM/RBAC Integration — Inspected Predecessor and Handoff

| Field | Value |
|---|---|
| Stable ID / class / version / state | `IE-HO-IAM-UI-001` / supporting source inventory/handoff / `0.1` / Draft |
| Authority / owner / author | INFORMATIVE / Project user / Codex, CODEX_ONLY |
| Baseline / date / classification | Main `4e5244430ea89ffe878819e1279f6e05c60d610a` / 2026-10-07 Asia/Ho_Chi_Minh / INTERNAL |
| Reviewer / acceptance / effective date | Project Reviewer / applicable Product Decision Authority; NOT-RUN / NOT-APPLICABLE |
| Upstream / downstream | [Spec](spec.md), [decisions](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md) / reviewed design and execution packet |
| Change / retention / trigger | [Issue #46](https://github.com/devphuclam/IDEAEngineering/issues/46); retain in Git; re-inspect after source, UI lineage or interface changes |
| Supersession / evidence | No accepted predecessor replaced / read-only source inspection, no new execution/approval |

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

Grilling/shared understanding: confirmed, including Q14. Written spec: review pending. Preparation checks are document/source checks only, not independent acceptance. `$speckit-plan`, reviewer checklist, tasks and analyze have not run at this stage. New runtime/browser/PostgreSQL tests and verifier: NOT-RUN.

After written-spec review, use this same feature directory for `$speckit-plan` and Matt Pocock `codebase-design`. Produce exact Permission/delegation catalogue and operation contracts before tasks, then read-only analyze. Do not create another generic framework or a competing spec.

First proposed implementation slice after readiness: actual session + authorized account directory/detail + account UI using qualified commands. Project/Group, assignment/delegation, Custom Role and access inspection follow in testable vertical slices. This is ordering, not execution approval.

No Delivery Card/timer, application/database/migration/dependency/deployment mutation, Work Item closure or merge occurs in this preparation step.
