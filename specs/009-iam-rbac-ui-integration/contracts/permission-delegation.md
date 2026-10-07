# Exact Candidate Permission and Delegation Catalogue

| Field | Value |
|---|---|
| ID / class / version / state | IE-IF-IAM-UI-POLICY-001 / supported administration profile / 0.2 metadata successor / Draft DESIGN; technical contract v0.1 unchanged |
| Authority / owner / author | INFORMATIVE refinement of DOC-06/REQ-AUTH-001…010 / Access Policy; named accountable owner UNKNOWN before approval / Codex |
| Baseline / reviewer / effective | Accepted spec e227cb1d; main 4e524443 / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d through human conversation; formal Product Decision Authority gates/runtime NOT-RUN / NOT-APPLICABLE |
| Date / classification / retention | 2026-10-07 Asia/Ho_Chi_Minh / INTERNAL / Git and immutable referenced versions |
| Change / upstream / downstream | Issue #46 / [Core data owner](../../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md), [change record](../../../docs/product/instances/idea-engineering/registers/CHG-2026-10-07-iam-rbac-ui-integration-baseline.md) / [operations](operations.md), [data model](../data-model.md), future tests |
| Supersession / trigger / evidence | Old role/Permission semantics not replaced / code, version, principal, scope or delegation change / proposed exact values; no seed execution |

## 1. Registry

O = Operating Organization; P = Project. Direct administrative paths do not require the
administrator's personal Project Membership. Any Group-derived path requires current matching
Project + Group Membership. A participant action also requires Project Membership even with
a direct/Org assignment. Org inheritance covers only the declared descendant action/resource.

| Code | Owner / meaning | Supported scope / applicability | Source state |
|---|---|---|---|
| account.read | IAM: redacted directory/detail/login-state read | O; direct administration | DESIGN |
| account.create | IAM: PENDING Actor/Account/native login creation | O; direct administration | IMPLEMENTED predecessor |
| account.disable | IAM: eligibility disable | O; direct administration | IMPLEMENTED |
| account.re-enable | IAM: separate enablement | O; direct administration | IMPLEMENTED |
| account.credential.setup.issue | IAM: first-credential proof | O; direct administration | IMPLEMENTED synthetic-delivery subset |
| account.credential.reset.issue | IAM: exact-login reset proof | O; direct administration | IMPLEMENTED synthetic-delivery subset |
| project.create | Project Governance: create Project | O only; direct administration | DESIGN |
| project.admin.read | Project Governance: administrative Project/Group/roster queries | O/P; direct administration | DESIGN |
| project.update | Project Governance: Project display-name update | O/P; direct administration | DESIGN |
| project.membership.assign | Project Governance: add explicit participation | O/P; direct administration | DESIGN |
| project.membership.remove | Project Governance: end selected participation | O/P; direct administration | DESIGN |
| project.group.create | Project Governance: create Project-scoped Group | O/P; direct administration | DESIGN |
| project.group.update | Project Governance: Group display-name update | O/P; direct administration | DESIGN |
| project.group.membership.assign | Project Governance: direct eligible member to Group | O/P; direct administration; target active Project Member | DESIGN |
| project.group.membership.remove | Project Governance: end selected Group membership | O/P; direct administration | DESIGN |
| project.read | Project Governance: participant's bounded Project identity/context | O/P; participant membership required | DESIGN actual owner query, not document read |
| role.catalogue.read | Access Policy: supported catalogue/version/diff | O/P; redacted authorized administration | DESIGN |
| role.definition.prepare | Access Policy: prepare/validate permitted Custom candidate | O/P; declared delegation envelope | DESIGN |
| role.definition.activate | Access Policy: seal immutable permitted Custom successor | O/P; current envelope + expected base | DESIGN |
| role.assignment.manage.business | Access Policy: preview/grant/end/replace business role | O/P; exact delegation/principal/scope | DESIGN |
| role.assignment.manage.administration | Access Policy: AA/PA/Audit Reader or permitted administrative Custom assignments | O/P; exact profile below | DESIGN |
| role.assignment.manage.highest | Access Policy: exact Super/PRA assignment changes | O-authorized effective protected Super; Super targets O, PRA targets declared O/P inside same Org | DESIGN |
| access.inspect | Access Policy: safely redacted assignment/path explanation | O/P; authorized read scope | DESIGN |
| audit.read | Audit owner: bounded attributable administration history | O/P; authorized read scope | DESIGN; no export/mutation |
| role.assign.account-administrator | Access Policy: legacy exact AA@1/@2 grant | O; direct Actor; legacy profile unchanged | IMPLEMENTED INTERNAL |

This is 25 exact codes: 6 predecessor codes and 19 DESIGN codes. Redemption authenticates with
target-bound proof, not an issuance Permission. Session/context is ordinary eligible-self access,
not an added role. DESIGN availability is not assignable/executable until the owner action is
implemented and qualified. Document/Checkout/Approval/Release and Product Configuration remain
DESIGN outside this registry; administrators cannot create codes.

## 2. Exact built-in version manifest

| Exact role | Declared content / support |
|---|---|
| super-administrator@1 | Existing role.assign.account-administrator only; existing seed ID/content unchanged. Legacy AA@1/@2 target map unchanged. |
| account-administrator@1 | Existing account.create, account.disable, account.re-enable only. |
| account-administrator@2 | account.create, account.disable, account.re-enable, account.credential.setup.issue, account.credential.reset.issue; no directory read added. |
| account-administrator@3 | Exact @2 actions + account.read; O, Actor only. DESIGN successor. |
| super-administrator@2 | role.catalogue.read, role.assignment.manage.administration, role.assignment.manage.highest, access.inspect, audit.read; O, Actor only. No account CRUD, Project administration, Custom activation or content action. |
| privileged-role-administrator@1 | role.catalogue.read, role.definition.prepare, role.definition.activate, role.assignment.manage.business, role.assignment.manage.administration, access.inspect, audit.read; O/P, Actor only. |
| project-administrator@1 | project.create, project.admin.read, project.update, project.membership.assign, project.membership.remove, project.group.create, project.group.update, project.group.membership.assign, project.group.membership.remove, role.catalogue.read, role.assignment.manage.business, access.inspect; O/P, Actor only. project.create never applies from P. |
| audit-reader@1 | audit.read; O/P, Actor only; no mutation, credentials or general access-inspection authority. |

New identities are code + exact version; migration publication pins their immutable UUIDs/digests
before execution. Never select any version by role name. Product Configuration Administrator is
not seeded executable here. No extra business built-in needed: a supported Custom Role containing
project.read can serve actual Group participant access.

## 3. Delegation profile

Granting requires an applicable administration Permission AND a separately declared delegation
envelope. This envelope is not the caller's personally exercisable action set. Scope authority
cannot be assembled by mixing a narrow grant permission with an unrelated broad assignment.

| Grantor's exact supported authority | Manageable targets and ceiling |
|---|---|
| Legacy Super@1 | Existing direct AA@1/@2 at O only; retain existing bounded self-assignment. No new-version grant via legacy map. |
| Super@2 | Exact Super@1/@2 and PRA@1 via highest action; AA@1/@2/@3, PA@1, Audit Reader@1 via administration action. Same Org, declared supported scope, Actor only. No arbitrary Custom privilege or implicit CRUD. |
| PRA@1 | Exact AA@1/@2/@3, PA@1, Audit Reader@1 and permitted nonprivileged administrative Custom roles; business Custom roles. No Super/PRA or equivalent delegation/activation-power Custom. Target scope contained by grantor. |
| PA@1 | Business Custom roles composed only of supported participant actions (initially project.read), at covered scope; Actor or matching Project Group. No administrative role or system-wide definition mutation. |

O assignment may cover an explicit P or O target only where declared; P assignment may manage
only that P. AA is O-only. A Project Group may receive a business role only at its own P, not O
or a different Project. Initial administrative built-ins/administrative Custom content are Actor
only; this is profile validation, not a universal Group prohibition in the data model.

The initial PRA Custom composition ceiling is exactly project.read, audit.read,
role.catalogue.read and access.inspect, where their target classification/scope is compatible.
Account actions remain confined to supported exact AA versions under REQ-IAM-002/005; Project
mutations remain the supported PA profile in this increment. Catalogue visibility does not make
every registered code Custom-composable. All account.*, Project-administration mutation/read
codes, role.definition.prepare/activate, role.assignment.manage.* and legacy role.assign.* are
outside this ceiling: composition cannot create another delegate or broaden its own authority.
Later composition support requires a reviewed owner/profile extension, not a replacement model.
Any administrative action in a Custom Role classifies it administrative; Group grant is refused.
In this initial ceiling, audit.read, role.catalogue.read and access.inspect are administrative
read content; only project.read-only content is business/Group-assignable. Mixed incompatible
scope sets fail validation.
Activation checks the caller's current preexisting delegation, never the candidate.
Project creation remains the exact supported Organization-scoped PA action required by
REQ-AUTH-011, not a way to invent a Custom creator profile. Definitions prepared at Project
scope retain that management scope and cannot be activated/assigned as Organization-wide
definitions; a broader administrator does not silently expand their declared applicability.

No delegate may add/revoke/replace its own administrative assignments to broaden itself or turn
Group membership into indirect administrative self-grant. The only ordinary self-assignment
exception remains exact Super→AA: legacy Super@1 → AA@1/@2 via its existing Permission is
unchanged; proposed Super@2 → AA@1/@2/@3 uses its separately held administration Permission and
a new assignment. The latter is a reviewed successor candidate, not a legacy allowlist expansion.
Do not generalize this to
Super/PRA/PA ordinary self-elevation. The separately approved Q15 console adoption is the sole
additional bounded transition: same current Super Actor/Org receives exact Super@2, as specified
in operations section 5; it is not ordinary self-grant authority. Removing one's own path still
checks recovery/current authority.

Intervals are supported; initial condition field accepts null only. Unsupported predicates/scripts
refuse rather than silently ignore. Additional condition types reopen this profile for review.
The initial highest-role profile uses unbounded recovery assignments; no finite-only last path.

## 4. Evaluation and safe explanation

Resolve current IAM eligibility, all direct/Group paths, exact role content, supported scope,
interval and action-specific membership. Union every applicable positive grant. No applicable
grant blocks; no general deny. Record path evidence without rewriting historic one-path decisions.
Inspection is authorized/redacted, all contributing visible paths, not a second evaluator.
RBAC_GRANTED never means a future document owner business gate passed.

## 5. Review/verification obligations

FR-010–023/029 and D09/D10/D11/Q15 trace REQ-AUTH-001…010, candidate REQ-AUTH-011…014 and
IF-PROJECT-ACCESS-ADMIN / IF-RBAC-ADMIN / IF-AUTHORIZATION-DECISION. Qualify old-version immutability,
no automatic authority, multi-role/multi-path, Group mode, scope containment, equivalent Custom
privilege, self-broadening, expiration and last recovery. Actual results NOT-RUN.
