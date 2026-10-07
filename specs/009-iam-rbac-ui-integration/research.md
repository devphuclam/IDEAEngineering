# IAM UI Planning Decisions and Source Evidence

| Field | Value |
|---|---|
| ID / class / version / state | IE-RES-IAM-UI-PLAN-001 / first-party planning research / 0.2 metadata successor / Draft; technical decisions unchanged |
| Authority / owner / author | INFORMATIVE / Project user / Codex, CODEX_ONLY |
| Baseline / date / review | Main 4e524443; accepted spec e227cb1d / 2026-10-07 Asia/Ho_Chi_Minh / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d through human conversation; formal readiness NOT-RUN |
| Change / downstream | Issue #46 / [plan](plan.md), [data model](data-model.md), [contracts](contracts/permission-delegation.md) |
| Classification / effective / retention / supersession / trigger | INTERNAL / NOT-APPLICABLE / Git / historical results unchanged / owner, role, wire or tooling change |
| Method / limit | Historical method: first-party source/doc inspection and two bounded research workers, no external research/import/execution; later exact-source human written-design acceptance recorded separately in current handoff |

| ID | Source fact | Proposed decision / rationale / alternative rejected |
|---|---|---|
| R01 | [IdentityController](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java) has commands, not context/directory reads. | Minimal authorized queries, not fabricated Organization/profile in Web. |
| R02 | [RoleAssignmentAdministration](../../apps/server/src/main/java/com/idea/ddm/identity/RoleAssignmentAdministration.java) pins AA@1/@2. | Add AA@3 and Super@2 separately; keep legacy exact AA allowlist unchanged. Reject seed edits/automatic retargeting. |
| R03 | Bootstrap repeats ALREADY_INITIALIZED; only Super@1 exists there. [DOC-06](../../docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md#53-account-bootstrap-and-future-login-migration) describes governed adoption, no executable successor command. | Q15 confirmed narrow console DESIGN, same current Super Actor/Org, reauth, separate assignment/evidence. No bootstrap reset, startup grant or name bypass. No execution approval implied. |
| R04 | CONTEXT/ADR distinguish delegation from personally exercisable actions; V3 says Super grants AA without CRUD. REQ-IAM-002/005 retains the exact Account Administrator owner profile. | Declared delegable action envelope, not target-permissions subset of personal actions. Initial Custom ceiling is participant project.read plus supported scoped inspection/catalogue/history reads; account/Project mutations and delegation are excluded. Candidate cannot widen that envelope or authorize itself. |
| R05 | V2 uniqueness includes revoked rows; V3 protects role/assignment DML; evaluator selects a direct Org path. | One-live-association successor constraint, narrow owner functions and one all-path evaluator. Reject blanket SQL grants/second role model. |
| R06 | Setup uses row.next(); reset already exact-target. | New issuance requires exact Login Identity; legacy omitted-target synthetic call only if exactly one eligible login, otherwise refuse. No cardinality-one assumption. |
| R07 | Synthetic delivery defaults off; retained digest cannot recover plaintext. | Separate manual-handoff configuration/qualification, no-store/transient display. Reissue is an explicit successor rule, not same-op plaintext recovery. |
| R08 | [IdentityTransactions](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityTransactions.java) uses a shared security-write lock; legacy internal role service defaults eligibility to no-op. | All new HTTP mutations inject real current session eligibility. Coordinate new security writers in same UoW; no IAM command re-entry or lock framework. |
| R09 | Recovery currently counts only Super@1. | Effective supported-version count, disabled/expired/revoked exclusions and last recovery protection. No Custom Role substitutes for protected Super. |
| R10 | Core's PA wording is narrower than D09/D11; exact delegation is SPEC-OPEN-03. | Controlled owner successors, exact historical approval pins unchanged; no claim of PG4 execution. |
| R11 | Group qualification needs a real supported action, not fake Checkout. | Project Governance project.read is bounded participant identity/context query; Group Custom Role can grant it. Membership alone grants none. No extra business-role seed. |

Foundations: stable identity/principal/scope, immutable versions/provenance, owner state and
transaction fate. Additive later: registered owner actions, supported scopes/delivery adapters.
Domain payloads, arbitrary conditions, nesting, broker and generic policy language are deferred.

All design questions above have a selected candidate accepted in the exact written-design review
recorded above; environment/cache/hash/admitted-tool and target checks remain
execution-preflight obligations, not permission to install. SPEC-OPEN-03/06 are not wholly closed.
Runtime tests, verifier, production/rollout and formal independent gate acceptance remain NOT-RUN.
