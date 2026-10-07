# Candidate Administration Operation Contracts

| Field | Value |
|---|---|
| ID / class / version / state | IE-IF-IAM-UI-OPS-001 / owner + HTTP + console design / 0.3 status successor / Draft partial IMPLEMENTED; accepted technical semantics unchanged |
| Authority / owner / author | INFORMATIVE refinement / IAM, Project Governance, Access Policy and Audit; named owners UNKNOWN before approval / Codex |
| Baseline / reviewer / effective | Main 4e524443; spec accepted e227cb1d / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d through human conversation; explicit PG2/PG3/PG4 PASS; Account/console engineering evidence in handoff section 16, independent implementation review NOT-RUN / NOT-APPLICABLE |
| Date / classification / retention | 2026-10-07 Asia/Ho_Chi_Minh / INTERNAL / Git |
| Change / upstream / downstream | Issue #46 / [permissions](permission-delegation.md), [data](../data-model.md), accepted [Identity contract](../../../docs/product/instances/idea-engineering/api/identity-session.md) / [Web flow](web-flow.md), future tasks/tests |
| Supersession / trigger / evidence | Existing Identity contract unchanged unless explicitly stated as successor / wire, target, retry or authority change / Account/console qualified in handoff section 16; remaining families DESIGN |

## 1. Common wire and authority

Account rows explicitly marked IMPLEMENTED are qualified adapters in this branch, not a deployed estate. Other new HTTP paths remain proposed DESIGN, not available routes; see [handoff section 16](../integration-readiness.md#16-account-ui-mvp-fast-delivery-milestone--2026-10-07). JSON UUID identifiers,
UTC ISO-8601 instants and integer expectedVersion are used. No client ActorId establishes caller
authority; a targetActorId is permitted as an explicit admin target, checked against scope.
Ordinary eligible session + existing CSRF protects every mutation; recipient redemption still
uses proof and CSRF, not an administrator session. Existing login/logout/session routes are unchanged.

Scope is {kind: ORGANIZATION, organizationId} or
{kind: PROJECT, organizationId, projectId}; no wildcard/Folder/Department/resource-scope authoring
in this profile. Principal is {kind: ACTOR, actorId} or {kind: PROJECT_GROUP, groupId}; exactly
one target, resolved by the owner. Interval is {effectiveFrom, effectiveUntil}; omitted/from-null
means commit time, until-null means unbounded, otherwise until must exceed from. Assignment
condition is null only; unsupported non-null input refuses. Existing Identity DTOs are exempt
from these new candidate-field names and retain their accepted contract.

Reasons are nonblank, <=500 characters and no control characters. Display names
are nonblank, <=200 characters and no controls. Lists use offset >=0, limit 1..100 (default 50),
ascending stable resource-ID sorting, optional literal display-name/normalized-login filter, no query
language. New collection results are {items, offset, limit, hasMore}; no unauthorized global count.
Permissions authorize BEFORE protected rows/filter metadata are disclosed; missing
authorization is not an empty successful list. Current account login normalization stays unchanged.

New-command refusal transport: 400 invalid shape/input; 401 ineligible session; 403 authority/CSRF;
404 absent or undisclosable exact target; 409 stale/duplicate/unsupported state; 503 unavailable.
Safe body {reasonCode, correlationId} excludes secrets/resource details not already authorized.
Reason codes are bounded owner categories, not raw SQL/exceptions. Existing adapter empty-body
status/error mapping is preserved; do not retrofit all Identity errors in this increment.

Query results are current/advisory. Preview returns exact target/principal/role/version/scope,
expected state and consequences; commit re-evaluates, never trusts a client capability snapshot.
No generic opaque preview token needed. Snapshot version conflicts require fresh review, not blind retry.

## 2. Operation catalogue

Path prefix I = /api/v1/identity; A = /api/v1/administration; P = /api/v1/projects.
Q = authorized read, C = new owner command contract in section 3, L = existing Identity retry
semantics preserved in section 4. Every DESIGN row needs real implementation + qualification.

| ID / status | Adapter | Request → response / state | Exact authority / retry profile |
|---|---|---|---|
| UI-I01 IMPLEMENTED | GET A/context | Current eligible self → Actor/Account/Org IDs, recorded display names and bounded action/scope availability | Eligible self; Q; no fabricated profile, password or permission token |
| UI-I02 IMPLEMENTED | GET A/accounts; GET A/accounts/{id} | O, bounded filter/page; exact Account → redacted status/securityVersion + exact login IDs/status | account.read at O; Q |
| UI-I03 IMPLEMENTED | POST I/accounts | Existing operationId/O/displayName/login → 201 stable IDs/PENDING/version | account.create; L; no implicit grants |
| UI-I04 IMPLEMENTED | POST I/accounts/{id}/disable or /re-enable | Existing operationId/O/expectedSecurityVersion/reason → 200 stable IDs/current state | Matching account action; L; no identity replacement |
| UI-I05 IMPLEMENTED manual successor | POST I/accounts/{id}/credential-proofs | operationId/O/purpose/loginIdentityId/expectedSecurityVersion/reason → transient proof/expiresAt | Separate setup/reset permission; section 4; no-store |
| UI-I06 IMPLEMENTED including recipient UI | POST I/credentials | Existing operationId/accountId/purpose/proof/password → 204 | Exact proof authority + CSRF; section 4 |
| UI-P01 DESIGN | GET A/projects; GET A/projects/{id} | O/page or exact Project → Project ID/name/version | project.admin.read; Q, admin not required to be member |
| UI-P02 DESIGN | POST A/projects | operationId/O/name/reason → 201 Project/version | project.create at O; C; zero creator membership/grant |
| UI-P03 DESIGN | POST A/projects/{id}/update | operationId/scope/name/expectedVersion/reason → 200 Project/version | project.update; C |
| UI-P04 DESIGN | GET A/projects/{id}/members | Scope/page → retained direct membership state, redacted eligible targets | project.admin.read; Q |
| UI-P05 DESIGN | POST A/projects/{id}/members | operationId/scope/targetActorId/expectedProjectVersion/interval/reason → 201 membership/version | project.membership.assign; C; same Org/eligible Actor |
| UI-P06 DESIGN | POST A/project-memberships/{id}/end | operationId/scope/expectedVersion/reason → 200 ended association | project.membership.remove; C; retained history |
| UI-P07 DESIGN | GET A/projects/{id}/groups; GET A/groups/{id} | Scope/page or exact Group → Group ID/Project/name/version | project.admin.read; Q |
| UI-P08 DESIGN | POST A/projects/{id}/groups | operationId/scope/name/expectedProjectVersion/reason → 201 Group/version | project.group.create; C |
| UI-P09 DESIGN | POST A/groups/{id}/update | operationId/scope/name/expectedVersion/reason → 200 Group/version | project.group.update; C |
| UI-P10 DESIGN | GET A/groups/{id}/members | Scope/page → direct membership IDs/version/eligibility | project.admin.read; Q |
| UI-P11 DESIGN | POST A/groups/{id}/members | operationId/scope/targetActorId/expectedGroupVersion/interval/reason → 201 association/version | project.group.membership.assign; C; current same-Project membership |
| UI-P12 DESIGN | POST A/group-memberships/{id}/end | operationId/scope/expectedVersion/reason → 200 ended association | project.group.membership.remove; C |
| UI-P13 DESIGN | GET P/{id} | Exact Project → bounded participant Project ID/name | project.read + Project Membership; Q; no roster or document access implied |
| UI-R01 DESIGN | GET A/permissions; GET A/roles; GET A/roles/{id}/versions/{version} | scope/page/exact version → supported code/role content/profile/state | role.catalogue.read; Q; DESIGN not selectable |
| UI-R02 DESIGN | POST A/roles/candidates | operationId/scope/definitionId or new name/baseVersionId/permissionCodes/support/reason → 201 candidate ID/version/diff | role.definition.prepare + delegable-content envelope; C |
| UI-R03 DESIGN | POST A/roles/candidates/{id}/validate | candidate expectedVersion → nonauthoritative validation/diff | role.definition.prepare + current envelope; preview only, no activation |
| UI-R04 DESIGN | POST A/roles/candidates/{id}/activate | operationId/scope/expectedVersion/baseVersionId/reason → 201 immutable exact role version | role.definition.activate + current envelope; C; old assignments untouched |
| UI-R05 DESIGN | GET A/assignments; GET A/assignments/{id} | scope/target/page → exact assignment/history/state | access.inspect; Q; redact cross-scope facts |
| UI-R06 DESIGN | POST A/assignments/preview | principal/scope/roleVersionId/interval, optional old assignment/version → exact diff/eligibility/consequences | Corresponding business/admin/highest grant permission + envelope; no mutation |
| UI-R07 DESIGN | POST A/assignments | operationId/principal/roleVersionId/scope/interval/reason → 201 new assignment | Corresponding grant permission + exact envelope; C |
| UI-R08 DESIGN | POST A/assignments/{id}/end | operationId/scope/expectedVersion/reason → 200 ended assignment | Corresponding grant permission; C, last recovery check |
| UI-R09 DESIGN | POST A/assignments/{id}/replace | operationId/scope/expectedVersion/newRoleVersionId/interval/reason → 200 old/new IDs | Corresponding grant permission; C; atomic end + new grant |
| UI-R10 DESIGN | POST A/access-inspections | targetActorId/permissionCode/scope/resourceId → redacted eligibility + all contributing paths + RBAC result | access.inspect; query/no owner mutation; owner gates distinguished |
| UI-A01 DESIGN | GET A/history | scope/target/page → attributable administration change/outcome and safe before/after | audit.read; Q; no generic Audit export |
| UI-O01 DESIGN | GET A/operations/{operationId} | Original operation → safe retained terminal metadata/result or unresolved | Current eligible originator + current relevant read authority, or independently scoped authorized inspector; no secret result |
| UI-C01 IMPLEMENTED; synthetic qualification only | Local console adoption only | Exact old Super assignment/new Super@2, O, same Actor, OperationId/reason/reauth → separate assignment | Section 5; not HTTP/product bypass |

Candidate resource scopes/role values are identifiers resolved by owners, never trusted client
claims. Nullable interval/condition fields have the exact profile in the permission contract.

| Owner operation family | Operation IDs | Governing trace / acceptance |
|---|---|---|
| IAM context/directory/account | UI-I01…I04 | REQ-IAM-001/002/004…006; IF-ACCOUNT-SESSION / IF-DIRECTORY-ADMIN; FR-001…005/030; V01 |
| IAM private credential handoff/redemption | UI-I05/I06 | REQ-IAM-003/004/005; IF-DIRECTORY-ADMIN / IF-ACCOUNT-SESSION; FR-006…009; V02 |
| Project Governance | UI-P01…P13 | REQ-AUTH-003/005/009 and candidate 011…013; IF-PROJECT-ACCESS-ADMIN; FR-010…013; V03/V04 |
| Role catalogue/custom publication | UI-R01…R04 | REQ-AUTH-002/009/010; REQ-GOV-005; IF-RBAC-ADMIN; FR-019…021; V05 |
| Exact independent assignment administration | UI-R05…R09 | REQ-AUTH-001/003/004/006/010; IF-RBAC-ADMIN; FR-014…019/021/029; V04/V07/V09 |
| Safe explanation/history/resolution | UI-R10/UI-A01/UI-O01 | REQ-AUTH-006…008; REQ-AUD-001/002; IF-AUTHORIZATION-DECISION + respective owner queries; FR-022…025; V06/V07 |
| Narrow console successor adoption | UI-C01 | Candidate REQ-AUTH-014; IF-RBAC-ADMIN + IAM reauthentication; Q15/D13; FR-019/029/030; V09 |

Custom candidate support is {scopeKinds, principalKinds}: nonempty sets from ORGANIZATION/PROJECT
and ACTOR/PROJECT_GROUP, intersected with each declared Permission and the definition's
managementScope. scope in R02 fixes managementScope; new definition name and existing definitionId
are mutually exclusive, and baseVersionId is required only for a successor of that definition.
No content-edit endpoint is proposed: changing a draft proposal uses a new candidate/OperationId;
activation seals the selected content once. Candidates cannot declare their own delegation ceiling.

Expected-version requests pin the exact mutated association/resource. New membership insertion
also checks and increments its named Project/Group aggregate version; insertion of a Group
increments the Project version. Ending a membership increments that association and its parent
aggregate in the same transaction. Name changes increment the named Project/Group only.
Assignment end/replace pins the predecessor assignment version; replacement retains its final
version and gives the new assignment a new ID/version 1. Candidate activation checks the draft
row plus unchanged expected active base; competing activation refuses stale state. Queries return
those versions, but page/reload is not a frozen multi-command snapshot.

## 3. New command transaction / concurrency / replay

Project/Access Policy new commands retain owner-specific operation result and bounded normalized
non-secret input digest. Normalize parsed fields explicitly: UUIDs/integers/UTC instants and
trimmed display-name/reason; role permission set sorted by exact code; distinguish omitted versus
specified interval consistently. An omitted/null effectiveFrom is the request intent
NOW_AT_FIRST_COMMIT, not a newly evaluated timestamp on each replay; the assigned timestamp is
fixed in the original result. No generic arbitrary JSON canonicalization framework.

One OperationId is bound to original Actor/Org, command kind and exact input. Under owner/security
coordination: same committed ID + same input resolves retained result without duplicate state,
owner outcome, Audit or event; changed input refuses 409. Different Actor cannot execute that ID
or learn its result through replay. Authorized result-query policy is separate from immutable
operation provenance. Concurrent same-ID attempts arbitrate once; a proven rollback without
terminal result is not completed. Resolve current eligibility/read authority before returning replay.

Owner checks expected version and current authorization before state/evidence commit. Required
outcome/decision/Audit failure rolls back everything. Business REFUSED is retained safely; initial
authorization refusal is security evidence, not successful owner mutation. Read projections do
not turn failed/uncertain execution into success.

Response loss → unresolved UI → authorized lookup/same-ID unchanged-input resolution for these
new commands only. Absent record alone is not proof of rollback while execution may be in flight;
no new-ID automatic retry. Explicit refresh/review or bounded same-ID resolution retains identity.
No automatic cross-owner retry/compensation engine.

## 4. Existing Identity compatibility and proof delivery

Existing create/disable/re-enable operationId is attribution, not a canonical-success promise.
Resolve retained outcome metadata and current authorized account state; do not claim same-ID
replay is safe or use a new UUID blindly. Status/conflict/error and login/session semantics remain
the accepted Identity v0.1 contract. Manual-delivery/targeting is qualified for the Account MVP; exact evidence and the remaining T034 fault/purpose coverage are separated in handoff section 16. This is not deployment or independent implementation acceptance.

New manual issuance is separately configuration-enabled and qualified, never activated by the
synthetic-delivery test flag. Require exact loginIdentityId for both purposes. FIRST_SETUP:
PENDING, exact credentialless login, expected security version. RESET: exact credentialed login,
ACTIVE or DISABLED. Existing synthetic omitted FIRST_SETUP selector may proceed only with one
eligible login; zero/ambiguous refuses. No credential cardinality restriction added.

Retain only proof digest, target/purpose/version/expiry/operation and lifecycle metadata.
Plain proof appears once in the intentional private handoff display with Cache-Control: no-store;
it never appears in URL/DOM text outside that control/storage/console/evidence. Password remains
only in intended recipient control/submission, cleared after submit/unmount; no admin password view.

Lost issuance response cannot recover plaintext. Lookup returns metadata only. Explicit reissue
uses a new OperationId and atomically supersedes prior unconsumed matching-purpose proofs for that
exact target, with reason/Audit; this invalidation is implemented successor behavior qualified for exact-login setup reissue/Audit rollback. Explicit outcome-insert and different-purpose coverage remains T034, not an implied PASS.
Client confirms the consequence; no speculative proof regeneration or automatic retry.

Redemption remains one-use and 15-minute; invalid/reused/expired/stale proof gives bounded refusal.
Reset changes only pinned credential, increments account security version, revokes old Account
sessions and leaves DISABLED/Actor disabled unchanged. Re-enable is separate and does not change
credential. Lost redemption response is uncertain; no blind resubmission/new proof claim.

## 5. Q15 console adoption contract

Local interactive console, never HTTP/startup/bootstrap reuse. Require exact reviewed supported
Super@2 and target estate, current same-Org effective Super@1, ACTIVE Account and native Login
Identity reauthentication. Verify existing credential using existing matching/throttle policy,
not the new-password setup minimum and not a fabricated ordinary HTTP session. No password args,
logs, environment export or Git. A named operator/data-boundary authorization and exact build
preflight are required for any actual live execution.

Read-only preview shows old assignment, same Actor/Org, exact new role/version, consequences and
reason. Commit rechecks account/security version/current Super/old assignment under shared
security-write lock. Access Policy writes separate immutable Super@2 assignment, owner result,
authorization/adoption evidence and Audit atomically. No broad grant management through this
special console transition, no old-row retarget, no automatic other Actor upgrade.

Same approved transition already committed → resolve ALREADY_ADOPTED with same assignment, no
second grant/outcome/Audit. If source authority disappears, target differs, version unsupported,
current state stale or evidence fails, refuse/rollback. Credential failure keeps generic refusal
and qualified password work; console cannot become an unthrottled guessing route.
Bootstrap marker and old Super@1 assignment remain intact.

Console reauthentication shares the qualified exact-known-login failure state with HTTP sign-in,
not a console-local counter. A wrong credential commits the bounded failure-state update before
returning generic refusal, with zero adoption grant/outcome; that security transaction is not
rolled back by a subsequent adoption refusal. Active block performs equivalent password work
without incrementing failures or extending blocked_until; unknown login creates no durable row.
Successful eligible reauthentication clears current failure state in the same transaction fate
as adoption or authorized ALREADY_ADOPTED resolution. Required adoption-evidence failure rolls
that clear back too. No HTTP session is created; no credential failure weakens current eligibility.
