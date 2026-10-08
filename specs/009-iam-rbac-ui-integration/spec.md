# Feature Specification: Native Account and Scoped RBAC UI Integration

**Feature Branch**: `codex/iam-rbac-ui-integration-spec`

**Created**: 2026-10-07

**Status**: Approved bounded feature closure — written spec/design and PG2/PG3/PG4 accepted; historical independent S1/F1/F2 findings and repair retained. Human Project user accepted all manual steps and authorized integration on 2026-10-08; feature COMPLETED / ACCEPTED / PASS, successor PG5 PASS, 93/93 tasks. No production deployment or release claim.

**Input**: User-confirmed native account, Project/Group and RBAC journeys: explicit scopes, two principal modes, independent multiple roles, immutable role versions, constrained delegation and separation of administration from engineering participation.

## Control envelope

| Field | Value |
|---|---|
| Stable ID / class / version | `IE-SPEC-IAM-UI-001` / Spec Kit delivery specification / `0.5` human-acceptance status successor; 30 FR/9 SC unchanged |
| Product normativity | INFORMATIVE relative to the Core baseline; FRs are candidate delivery obligations. DOC-04 remains the sole product SRS; no Core obligation or gate is independently approved here. |
| Owner / author / worker mode | Project user / Codex, Primary Implementation Worker / `CODEX_ONLY` |
| Reviewer / acceptance authority | Historical SPEC/DESIGN and explicit PG2/PG3/PG4 PASS retained; human Project user accepted the manual review and explicitly authorized push/merge at c379c6a on 2026-10-08 / successor PG5 PASS, readiness section23; not an author-issued or GitHub submitted approval |
| Applicable baseline | Integrated main `4e5244430ea89ffe878819e1279f6e05c60d610a`; accepted PH1 and API predecessors retained |
| Date / effective date | Created 2026-10-07; closure 2026-10-08, `Asia/Ho_Chi_Minh` / 2026-10-08 for bounded feature acceptance |
| Classification / retention | `INTERNAL`; retain specification and supersession history in Git |
| Upstream / change | [Decision and impact record](../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md), [Work Item #46](https://github.com/devphuclam/IDEAEngineering/issues/46) |
| Downstream | [Reviewed written plan](plan.md), [Permission/delegation catalogue](contracts/permission-delegation.md), [operations](contracts/operations.md), [reviewer checklist](checklists/design-review.md), [tasks](tasks.md) and [handoff](integration-readiness.md); engineering execution sections16–22, separate human acceptance section23 |
| Supersession | Does not supersede PH1, accepted ADR-0012 or existing API contracts. UI branches are presentation lineage. |
| Review trigger / evidence | Scope, permission, role-version, delegation, credential channel or owner-interface change / source inspection and user decisions only; runtime tests and verifier `NOT-RUN` |
| Standards tailoring | `IE-STD-AUTH-001`: clarity/trace guided by STD-REQ-001, record identity by STD-INFO-001, acceptance design by STD-TEST-001…004. No conformity claim. |

## Overview and scope

Give users an actual attributable interface for native IDEA Accounts, Project/Group administration and scoped Role Assignments. Reuse the reviewed visual intent: account table/detail inspection, Project/Group navigation, and RBAC assignment/catalogue/effective-access views. Do not redesign merely to integrate.

The existing account/session implementation is a predecessor to reuse, not proof that the complete feature exists. The [source inventory](integration-readiness.md) identifies missing capabilities and design obligations.

The assignment journey is **Scope → person within a Group → exact Role/version → review and confirm**. A separate visibly labelled Group-principal mode assigns a Role to the Group itself, never copied direct grants to its members.

In scope: real native session UI, authorized directory reads, account create/disable/re-enable and credential setup/reset, Project creation/administration, scoped Groups/direct memberships, supported Permission/Role catalogue, Custom Role successors, independent direct/Group assignments, constrained grant/revoke/replacement, and authorized effective-access explanation.

Out of scope: company identity integration, automatic email, new password/session policy, multi-Organization switching, nested Groups, general explicit deny, arbitrary scripts, bulk assignment transactions, just-in-time privilege, new approval quorum, general policy import/export, Product Configuration/Workflow implementation, Audit export tooling, Document/Checkout/Approval/Release implementation, Desktop/Workspace binding, Gateway changes, deployment and company rollout. DESIGN-only actions cannot be presented as usable functionality.

## User Scenarios & Testing *(mandatory)*

These are planned acceptance scenarios, not executed results. TDD and real-client qualification will be planned after written-spec review. Seeded prerequisites do not count as another story's implementation.

### User Story 1 — Manage an actual IDEA Account (Priority: P1)

An Account Administrator finds and provisions an actual account without accidentally granting product access. A recipient privately receives setup/reset proof and establishes a credential.

**Why this priority**: First useful UI over existing qualified behavior; removes simulated live authentication/security success.

**Independent Test**: Create/setup/sign in/disable/re-enable a controlled account through eligible and ordinary identities. Inspect stable identity and refusal without requiring Project/Role administration implementation.

**Acceptance Scenarios**:

1. **Given** an eligible scoped Account Administrator, **when** account creation is confirmed, **then** an actual PENDING account exists without password, membership or Role Assignment.
2. **Given** an eligible setup target, **when** the authorized administrator issues proof and the recipient redeems it privately, **then** the intended credential is established once; the administrator never receives the password.
3. **Given** a DISABLED account with a credential, **when** its exact Login Identity is reset, **then** that credential changes and old account sessions are invalidated, but account/Actor remain disabled until separate re-enable.
4. **Given** multiple Login Identities, **when** one reset is redeemed, **then** only the pinned credential changes; sibling credentials and stable identities remain.
5. **Given** ordinary, wrong-scope or stale-version requests, **when** administration is attempted through the UI or directly, **then** it is refused with no partial success.
6. **Given** backend failure during sign-in/logout, **when** the UI processes it, **then** no simulated identity/success is substituted and the error is visible on the current screen.

---

### User Story 2 — Establish Project and Group participation (Priority: P1)

A scoped Project Administrator creates a Project when authorized, then explicitly manages Project Members, Groups and direct Group Memberships. Administration does not itself make the administrator an engineering participant.

**Why this priority**: Establishes the actual scopes/memberships used by the assignment journey.

**Independent Test**: With controlled existing accounts and assignments, create two Projects and manage the permitted scope; prove cross-Project refusal without controlled-document operations.

**Acceptance Scenarios**:

1. **Given** an Organization-scoped Project Administrator with explicit create permission, **when** a Project is created, **then** Project Governance retains its identity/outcome without implicit creator membership or assignment.
2. **Given** only Project-scoped Project Administrator authority, **when** another Project is created/administered outside scope, **then** the operation is refused.
3. **Given** an authorized administrator who is not personally a Project Member, **when** permitted Project/Group administration is performed, **then** scoped administrative authority can authorize it without granting engineering participation/content access.
4. **Given** an active Project Member, **when** added directly to a Group in the same Project, **then** membership is retained separately from account/role state; nonmember, nested Group and cross-Project membership are refused.
5. **Given** Group-derived access, **when** the relevant Project/Group Membership ceases to apply, **then** that path stops authorizing the next protected request and unrelated memberships/assignments remain.

---

### User Story 3 — Grant several independent scoped roles (Priority: P1)

An authorized grantor selects scope, a person using a real Group filter, exact Role/version, and confirms. Alternatively the grantor explicitly chooses a Group principal.

**Why this priority**: Makes the intended permission flow functional without a hidden administrator rank/global bypass.

**Independent Test**: With controlled scopes/principals, give Linh several independent assignments and an allowed Group-derived path; inspect and revoke individual paths.

**Acceptance Scenarios**:

1. **Given** eligible Linh and an authorized grantor, **when** Account Administrator, Project Administrator and Privileged Role Administrator are granted through separate permitted operations, **then** three independent assignments retain exact role/version/scope, assigner and reason.
2. **Given** person mode with a Group filter, **when** a direct assignment is confirmed, **then** it belongs to the Actor; leaving the filtering Group does not remove it, although other eligibility gates still apply.
3. **Given** Group mode, **when** a supported business role is granted, **then** one Group assignment exists and eligible members derive authority through membership; no per-person grants are copied.
4. **Given** PRA, **when** permitted Account Administrator/Project Administrator/Audit Reader assignments are changed within delegated limits, **then** they succeed; Super/PRA changes, self-broadening and cross-scope grants are refused.
5. **Given** effective Super with explicit assignment-administration permission, **when** a permitted Super/PRA assignment is changed, **then** ordinary authority/recovery checks apply, not a bootstrap-Actor or role-name bypass.
6. **Given** another direct/Group path granting the same action, **when** one assignment is revoked, **then** only that assignment ceases to apply and the remaining path is still explained.

---

### User Story 4 — Evolve a supported Custom Role (Priority: P2)

A constrained role administrator composes registered supported permissions, validates/activates a candidate, and later creates an immutable successor without changing existing users' authority.

**Why this priority**: Enables controlled configuration without a second permission system or owner-module rewrite.

**Independent Test**: Compose/assign a Custom Role, activate a successor and verify original assignments remain pinned until authorized replacement.

**Acceptance Scenarios**:

1. **Given** a constrained role administrator, **when** supported permitted actions are composed, **then** validation/activation use current effective authority; the candidate cannot authorize itself.
2. **Given** an active Custom Role, **when** its permission content changes, **then** an immutable successor is created and existing assignments keep the old version.
3. **Given** an authorized explicit replacement preview and matching current state, **when** confirmed, **then** transition/evidence commit together and predecessor history remains attributable.
4. **Given** built-ins, unknown permissions/conditions or a Custom Role disguising prohibited privileged authority, **when** configuration/assignment is attempted, **then** it is refused without changing authority.

---

### User Story 5 — Explain current access safely (Priority: P2)

An authorized inspector sees why an Actor has or lacks a supported action in a selected scope, including direct/Group paths and eligibility prerequisites.

**Why this priority**: Makes overlapping grants understandable and supports responsible administration.

**Independent Test**: Inspect seeded direct/Group assignments before/after removing one path. No actual engineering command is required.

**Acceptance Scenarios**:

1. **Given** contributing assignments, **when** access is inspected, **then** the explanation identifies exact memberships, assignments, role versions, scope and eligibility for every applicable path, not just a merged label.
2. **Given** disablement, stale session, expired/revoked assignment or inactive membership, **when** evaluated, **then** affected paths are ineligible; cached UI facts cannot authorize a mutation.
3. **Given** unauthorized scope, **when** inspection is requested, **then** protected details are not disclosed and refusal is not rendered as an empty successful result.
4. **Given** DESIGN-only engineering permissions, **when** displayed, **then** their state is explicit and no implemented Checkout/Approval/Release ability is claimed.

---

### User Story 6 — Complete administration honestly and accessibly (Priority: P2)

A user operates the existing layout, reviews consequences and receives truthful outcomes during stale-state conflicts, revocation, lost response or evidence failure.

**Why this priority**: An actual security UI must expose refusal and allow users to operate its confirmation surfaces.

**Independent Test**: Keyboard-only permitted/refused flows and injected failure/response loss use actual owner results rather than local success arrays.

**Acceptance Scenarios**:

1. **Given** table and drawer/modal controls, **when** operated by keyboard, **then** controls have accessible names/visible focus, modal focus is contained, Escape closes cancellable surfaces and focus returns to the invoking control.
2. **Given** security-affecting action, **when** confirmed, **then** target/scope/version/consequence are clear and success appears only after an authoritative result.
3. **Given** concurrent state or authority removal before commit, **when** execution completes, **then** stale/unauthorized state cannot commit and refresh does not blindly retry.
4. **Given** response loss after dispatch, **when** the UI resumes, **then** it shows unresolved outcome and follows the reviewed operation-specific resolution/retry contract, not a new blind command.
5. **Given** required outcome/Audit persistence or commit failure, **when** the command runs, **then** no partial authoritative success survives and the UI reports no invented success.

### Edge Cases

- PENDING create result is not ACTIVE or an eligible role recipient: activation and assignment are distinct steps.
- Multiple credentialless logins cannot be selected arbitrarily under an undocumented one-login/account invariant. Exact first-setup selection/refusal needs a reviewed contract.
- Reset of DISABLED is not re-enable; re-enable does not change a password. One-use proof retains existing 15-minute/security-transition rules.
- Several roles do not erase delegation limits; Super needs separate applicable ordinary assignments for account/Project work.
- Accepted bounded Super self-assignment of Account Administrator through already-held assignment permission remains supported; this is not arbitrary self-grant or permission obtained from the candidate itself.
- One revoked assignment can leave another grant path effective. Display names cannot identify an assignment.
- Organization-scoped inheritance applies only to actions/resources covered by the Role and conditions, not a wildcard grant.
- Group name/Department do not establish membership; nested Groups remain unsupported.
- Regrant after revocation needs reviewed historical-state/concurrency semantics; existing schema does not establish that behavior.
- Supported Super successors must retain last-effective-recovery protection without implicitly upgrading bootstrap assignments.
- Lost proof response cannot retrieve plaintext from its digest; issuance/reissue cannot pretend to recover the same secret.
- Custom Role labels cannot hide equivalent privilege or candidate self-authorization.
- Uncertain outcome is neither success nor proven rollback.

## Requirements *(mandatory)*

Local FR identities are delivery acceptance obligations, not new Core REQ identities. Confirmed refinements require incorporation into their owning Core/interface baseline before implementation.

### Functional Requirements

- **FR-001**: Live sign-in/session MUST use native IDEA authentication without simulated authority after failure.
- **FR-002**: Current Actor/Organization context MUST come from Server-established identity, not client-selected authority or hard-coded fallback scope.
- **FR-003**: Directory/principal/Project/Group/Role/history reads MUST disclose only authorized data and actually recorded fields.
- **FR-004**: Account creation MUST retain separate Actor/Account/Login Identity and PENDING state without implicit credential, membership or assignment.
- **FR-005**: Disable/re-enable MUST preserve stable identity/history and qualified security-version/session invalidation semantics.
- **FR-006**: Setup/reset issuance MUST require separate supported permissions; redemption MUST use valid target-bound proof authority rather than an administrator role.
- **FR-007**: Manual proof delivery MUST retain one-use 15-minute expiry and keep password/proof out of URL, persistent storage, logs and retained evidence. Temporary credential controls/private handoff display are allowed, then cleared.
- **FR-008**: First-setup MUST use a reviewed exact Login Identity selection/refusal rule for ambiguous targets instead of assuming account cardinality one.
- **FR-009**: Reset MUST change only the selected credential, invalidate old account sessions and preserve disabled account/Actor state until separate re-enable.
- **FR-010**: Project creation MUST require explicit create permission in an effective Organization-scoped Project Administrator assignment without implicit creator membership/assignment.
- **FR-011**: Project/Group administration MUST evaluate scoped administrative authority independently of personal Project participation; engineering/Group-derived access MUST retain applicable membership gates.
- **FR-012**: Project Membership MUST be an explicit attributable operation that grants no product permission by itself.
- **FR-013**: Project Group Membership MUST connect a direct eligible Project Member to a Group in that Project and reject nested/cross-Project membership.
- **FR-014**: The Scope → person/Group → exact Role/version → confirm wizard MUST distinguish person-filter and Group-principal modes and preview the actual assignment.
- **FR-015**: An Actor MUST retain multiple independent assignments, each pinning exact role/version/scope, assigning Actor and reason.
- **FR-016**: Membership/assignment changes MUST affect the next protected request while retaining unrelated access paths/history.
- **FR-017**: Organization-wide assignment MUST be an explicit broader choice supported by the Role and grantor authority, never default scope fallback.
- **FR-018**: Assignment administration MUST enforce confirmed role/principal/scope delegation limits and refuse delegate self-broadening, including equivalent privileged Custom Roles. Accepted bounded Super self-assignment of Account Administrator through already-held assignment permission remains supported; no arbitrary self-grant is implied.
- **FR-019**: Old built-in role content/assignments MUST remain unchanged; extra authority MUST use explicitly supported successors and separate authorized assignments.
- **FR-020**: Custom Role composition MUST accept registered supported permissions within current limits; active content changes MUST create immutable successors without candidate self-authorization.
- **FR-021**: Assignment replacement MUST be separately previewed, confirmed and audited without rewriting predecessor history.
- **FR-022**: Server-owned effective-access inspection MUST show all applicable contributing paths and distinguish RBAC eligibility from final owner authorization.
- **FR-023**: Protected mutations MUST revalidate current session/account, assignments/delegation, relevant membership and expected owner state before authoritative commit.
- **FR-024**: Material administration changes MUST share transaction fate with required owner outcome, authorization evidence and Audit; required persistence failure cannot leave partial success.
- **FR-025**: UI MUST distinguish success, refusal, stale conflict and uncertain response using reviewed operation-specific resolution/retry semantics.
- **FR-026**: Actionable controls and inspection/confirmation surfaces MUST support keyboard operation, accessible naming, visible focus and correct modal focus containment/restoration.
- **FR-027**: Security-affecting confirmation MUST identify target, scope/version and consequence, including removal/replacement of only the selected grant.
- **FR-028**: Live UI MUST NOT claim unimplemented engineering actions or derive authority from account type, Department, role name or local arrays.
- **FR-029**: Recovery protection MUST cover explicitly supported effective Super versions and refuse removal/disablement of the last effective recovery path.
- **FR-030**: Integration MUST retain accepted authentication, credential/session/account and old-role behavior unless a separately approved successor expressly changes its contract.

### Upstream and acceptance trace

| Delivery requirements | Governing authority / decision record IDs | Acceptance |
|---|---|---|
| FR-001–005, FR-030 | REQ-IAM-001/002/004/006; IF-ACCOUNT-SESSION, IF-DIRECTORY-ADMIN; D01/D03 | US1, US6 |
| FR-006–009 | REQ-IAM-003/004/005; DATA-REL-014/015; D04 | US1.2–4, login/proof edges |
| FR-010–013 | REQ-AUTH-003/005/009; candidate Core REQ-AUTH-011…013; DATA-REL-016/025; IF-PROJECT-ACCESS-ADMIN; D09/D11 | US2 |
| FR-014–017 | REQ-AUTH-001/003…006; DATA-REL-027/032; D02/D05/D06/D08 | US3.1–3/6, US5 |
| FR-018–021, FR-029 | REQ-AUTH-002/009/010, REQ-GOV-005; IF-RBAC-ADMIN; D07/D10/D12 | US3.4–5, US4, recovery/regrant |
| FR-022–025 | REQ-AUTH-006…008, REQ-IAM-004, REQ-AUD-001/002; IF-AUTHORIZATION-DECISION; D03 | US5, US6.3–5 |
| FR-026–028 | REQ-UX-003/004/006; UX-JRN-009/010/014/015; D02/D03 | US6.1–2, US5.4 |

D01–D12 are owned by the linked change record. The later Q15/D13 adoption plan traces candidate
Core REQ-AUTH-014 and existing FR-019/029/030; it adds no delivery FR or implementation result.
Verification methods: positive/negative controlled flow, state/history inspection, concurrent-state/forced-failure qualification and actual keyboard/browser inspection. Actual results are NOT-RUN.

### Key Entities *(include if feature involves data)*

- **Actor / IDEA Account / Login Identity**: stable accountability, eligibility and explicit sign-in identity are separate; account cardinality may exceed one login.
- **Actor Context**: current Server-established request identity, not trusted client authority.
- **Operating Organization / Project**: governance and engineering scopes with covered descendant applicability, not copied grants.
- **Project Membership / Business Group / Group Membership**: separate participation and direct membership relationships; a Group is a principal, not a Department.
- **Permission / Role Definition / Role version**: supported owner action and protected/custom grouping with immutable activated content.
- **Role Assignment**: one principal, exact Role version and scope, assigner/reason, applicability and historical state.
- **Authorization Decision / Owner Command Outcome / Audit Evidence**: current authority, separate owner result and attributable evidence.
- **Credential proof**: one-use expiring authority for exact target/security state, not a reusable credential or role grant.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All US1 account journeys retain stable identities, create zero unintended memberships/assignments and expose zero passwords through administration/evidence.
- **SC-002**: All US2 scope cases pass, including Org-authorized creation and Project-only/cross-Project refusal, with zero implicit creator engineering participation.
- **SC-003**: The US3 fixture retains at least three independent administrative assignments for one Actor; removing one leaves every unaffected assignment intact and explains remaining access.
- **SC-004**: Every person/Group mode case produces the intended principal association with zero copied user grants or Department-derived authority.
- **SC-005**: Every planned built-in mutation, unsupported permission, self-broadening, cross-scope and last-recovery negative case produces zero unauthorized authority change.
- **SC-006**: Custom Role activation changes zero predecessor assignments; every explicit replacement retains attributable before/after history.
- **SC-007**: Every planned stale-state, commit-time revocation and required-evidence failure leaves zero partial authoritative success; every response-loss case is displayed without invented success/rollback.
- **SC-008**: Every actionable control/surface in these accepted journeys is keyboard operable and every tested refusal/error is visible in the current screen.
- **SC-009**: Every completed slice links its accepted contract, exact executed revision and actual result; no DESIGN-only action is represented as implemented.

## Assumptions

- One Operating Organization, native accounts and the qualified session policy are reused; no multi-tenant/company-identity increment.
- Each assignment is one confirmed operation. Multi-role does not imply atomic multi-role batching.
- Group implementation starts with Project-scoped Groups. Other combinations require a supported contract, not inference.
- Exact new Permission codes, role/version identities, delegation representation, routes/DTOs, concurrent-state tokens, historical regrant/replacement and retry semantics belong to the next reviewed design/contract stage. None are invented as implemented here.
- Existing UI branches remain untouched. Reuse is selective; mock security behavior is not accepted implementation. An explicitly isolated mock preview may remain; live failure cannot enable it.
- Company data/accounts, new tooling authority, environment mutation and rollout require their applicable separate readiness decisions.

## Historical written-spec publication disposition

Conversational decisions including Q14 are confirmed. Project Reviewer reported written-spec PASS at exact e227cb1df60e70a1294628b4f153ad50d8f034c6 on 2026-10-07 and authorized planning only. The original 30 FR/9 SC semantics are unchanged. Q15 separately authorizes preparing a narrow console adoption design, recorded as D13, not running it. Successor Core/design review remains pending; SPEC-OPEN-03/06 are only partially clarified.

Current next step: review the Core/interface successors, plan and exact contracts with the reviewer-owned checklist → speckit-tasks → read-only speckit-analyze → explicitly authorized TDD vertical slices → standards/spec review and convergence.

No plan/tasks are fabricated before their lifecycle stage. Publication of this Draft does not authorize implementation, runtime testing, product-gate approval, timer action, merge or deployment.

## Current execution and reviewer handoff — 2026-10-08

Design, Tasks and read-only Analyze were subsequently accepted at the recorded exact sources;
explicit PG2/PG3/PG4 and FAST DELIVERY authority enabled bounded implementation. The historical
next-step paragraph above is not the current gate. Engineering qualification now covers the
supported Account/Project/Group/Assignment/Custom Role/Inspector profile; human acceptance now
closes T093, **93/93 tasks**.
See [section 22](integration-readiness.md#22-independent-review-repair-successor--2026-10-08)
and the [closure matrix](evidence/feature-009-closure-matrix.md) for actual source/test/evidence,
the real independently authorized history/ordinary three-role/confirmation repairs, retained
failed runs and unchanged automated secret detector NOT-PASS with separately reported human PASS.
Human acceptance and explicit push/merge authority are recorded in
[section23](integration-readiness.md#23-human-acceptance-and-controlled-integration--2026-10-08):
**COMPLETED / ACCEPTED / PASS**, successor **PG5 PASS**, not another spec/planning cycle or
author self-certification. Next action is authorized controlled integration, not deployment,
live adoption, PG6 release or Tracker/timer mutation.
