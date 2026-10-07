# Candidate IAM, Project and RBAC Data Model

| Field | Value |
|---|---|
| ID / class / version / state | IE-DATA-IAM-UI-001 / implementation data design / 0.2 metadata successor / Draft; technical design unchanged |
| Authority / owner / author | INFORMATIVE candidate refining DOC-06 / Project user / Codex, CODEX_ONLY |
| Baseline / review / date | Accepted spec e227cb1d; main 4e524443 / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d through human conversation; formal readiness/runtime NOT-RUN / 2026-10-07 Asia/Ho_Chi_Minh |
| Change / source / downstream | Issue #46 / [DOC-06](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md), [research](research.md) / [operations](contracts/operations.md), future qualification |
| Effective / classification / retention / supersession / trigger | NOT-APPLICABLE / INTERNAL / Git / V1–V10 unchanged / schema, role, scope, retention or retry change |

## 1. Ownership/cardinality

| Entity / owner | Candidate fields/invariants |
|---|---|
| Actor / Account / Login Identity — IAM | Existing stable IDs, Org, eligibility/security version; Account has 0..* logins. Queries select no verifier/proof/session secrets. |
| Project — Project Governance | projectId, organizationId, displayName, version, createdBy/at; exactly one Org, no creator membership/grant. No Project delete/archive feature. |
| Project Membership — Project Governance | membershipId, projectId, actorId, effectiveFrom/Until, endedAt/By, reason, version; same Org, one unended association per Actor/Project; retain history. |
| Business Group — Project Governance | groupId, projectId, organizationId, displayName, version, createdBy/at; Project-scoped profile; name not identity, no nesting. |
| Group Membership — Project Governance | membershipId, groupId, actorId, interval, endedAt/By, reason, version; direct Actor and active matching Project Membership at insertion/evaluation. |
| Permission — Access Policy | code, owner/action/resource kind, supported scope/principal/applicability profile; product-registered executable actions, no administrator-created codes. |
| Role Definition / Version — Access Policy | Stable definitionId/code/builtIn and managementScope; separate candidate staging with baseVersionId, scope/principal support and content digest; activation appends complete immutable exact versionId/number. Project-managed Custom definition cannot be silently broadened to Organization-wide applicability. |
| Role Assignment — Access Policy | Preserve assignmentId; exactly one Actor/Group principal, exact versionId, Org + typed Org/Project scope, interval, assigner/reason/time, row version; existing revoked_at remains canonical termination, with attributable end metadata. API endedAt is its projection, not an independent eligibility flag. Profile controls assignability, no universal Group ban. |
| Outcome/decision/Audit — owners | Distinct IAM/Project Governance/Access Policy outcomes and immutable authorization/Audit evidence; never record Project state as IAM ownership. |
| New operation resolution — owner | OperationId, original Actor/Org, kind, bounded non-secret request digest, safe result/correlation; unique terminal result. No cross-owner generic operation framework. |

Effective intervals are half-open: now >= from and now < until; null until means no scheduled end.
Unended identity is distinct from current eligibility. Removing Project Membership makes related
Group paths ineligible, not deleted; direct assignments remain but retain their own membership
gate. Rejoining restores only still-unended/period-eligible associations, explicitly previewed.

## 2. Additive compatibility

Check next migration number against current main at implementation; V11 is a candidate, not
created here. Preserve every V1–V10 byte/checksum, old versionId/permission set and assignment.
Extend the existing role/assignment model, no separately evaluated mirror. Backfill only structural
definition/scope references, not grants. Every legacy revoked_at remains terminated; no null new
field restores it. All new end/replacement paths populate canonical revoked_at so predecessor and
successor callers agree. New definition/permission seeds confer no authority.

Replace whole-history tuple uniqueness by one-unended-association uniqueness in an additive
migration. Expired unended tuple is explicitly ended before regrant. Regrant has a new ID;
replacement ends old + inserts successor atomically. Duplicate tuple refuses unless resolving
the same committed OperationId. Foreign-key pair checks prevent cross-Org/Project relations.
Activated roles/built-ins, original assigner/provenance and Audit cannot be rewritten.
Mutable draft candidate/lifecycle rows are separate from protected role_definition_version and
permission content. Activation inserts a complete sealed version and permission set once; it does
not UPDATE an existing version. Existing immutable triggers remain: SECURITY DEFINER is not a
way to bypass them. Later permission-row insertion into a sealed version must also be denied.

## 3. Protected writes and concurrency

Migrator owns objects. Keep app direct protected UPDATE/DELETE/TRUNCATE denied. Narrow owner
functions allow exact assignment end/replacement and role draft/activation writes, on the same
JDBC connection as evidence. If SECURITY DEFINER is used: fixed trusted search_path,
schema-qualified objects, no dynamic target tables, no PUBLIC execute; checks/evidence/row-count
failure abort together. Functions are trusted Server storage interfaces, not client authorization.
No database credential is supplied to UI or treated as a product Actor.

All IAM/Project/Access Policy security writers share existing installation security-write
coordination. New HTTP commands inject actual session eligibility, not the legacy internal no-op.
No Access Policy query re-enters an IAM mutation. Queries use consistent read state but remain
advisory; current eligibility, assignments/delegation, applicable membership and target version
are rechecked before owner commit.

Mutation + owner outcome + authorization evidence + required Audit share transaction fate.
Outbox is used only where a defined owner committed-event contract applies; no broker or generic
fictional event obligation is added. Intentional refusals are attributable; confirmed rollback
creates no fake successful result; uncertain commit outcome is not labelled rollback.

## 4. Credential/recovery state

FIRST_SETUP pins exact Account/Login Identity/security version, PENDING and no credential.
RESET pins exact credentialed login, ACTIVE/DISABLED, preserves disabled state. One-use/15-minute
and session invalidation retained. New manual flow always supplies loginIdentityId; legacy synthetic
omitted FIRST_SETUP target succeeds only with exactly one eligible login. Credential material
never enters request digests, outcomes, Audit or replay storage.

Proposed explicit proof reissue records supersession of previous unconsumed matching-purpose
proofs; this is successor design, not current behavior. Account-wide security transitions stale
other proofs as qualified. No proof retrieval from a digest.

Count currently effective supported Super@1/@2 recovery Actors under the same lock. Future,
expired, revoked or disabled paths do not count. Refuse last-recovery disable/end/replacement;
the only unbounded recovery grant cannot be replaced by a finite grant.
Console adoption adds separate Super@2 to same eligible existing Actor/Org; old grant and
bootstrap marker remain unchanged. No adoption grant is migration data.

## 5. Migration/rollback validation — actual NOT-RUN

Qualify predecessor upgrade/fresh isolated migration, exact legacy seeds/history, same-Org
constraints, period edges, concurrent tuple/regrant/replacement, immutable content, app DML/SET ROLE
refusal and required-evidence failure. Separate migrator/app; only approved UUID-owned schemas or
separately approved new DB, no company/preview/retained-review cleanup.

Once new data exists, old Server may not evaluate it; rollback must fail closed and use an approved
compatible package/forward repair, never drop data. Exact backup/deploy/recovery execution is
separate readiness work; this plan claims none.
