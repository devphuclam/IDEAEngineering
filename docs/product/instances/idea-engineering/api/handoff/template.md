# Operation contract and handoff template

`IE-API-HANDOFF-TPL-001`, v0.1, Draft, INFORMATIVE; inherits the [hub control envelope](README.md).
Copy only sections relevant to the actual interface. Unresolved facts are UNKNOWN, not invented.
This template does not create new API routes, roles or acceptance gates.

## Operation

| Field | To populate |
|---|---|
| Stable document / operation identity | Document ID, contract version, semantic IF and operation identity |
| Authority and status | Requirements/decisions; DESIGN / HTTP / INTERNAL / QUALIFICATION / DEFERRED; review record |
| Provider / consumers | Owning domain, responsible contacts and intended clients |
| Purpose and non-goals | Observable effect and explicit exclusions |
| Surface | Exact method/path or module/event interface; UNKNOWN when not selected |
| Input | Field/type/required/default/bounds/units; example with synthetic values |
| Output | Exact response/event fields and meaning; example |
| Security | Authentication, permission/version/scope, Actor authority, CSRF and disclosure rules |
| Preconditions / state effect | Eligible state, transitions, stable identity and invariants |
| Atomicity / concurrency | Required companions, transaction fate and contention behavior |
| Failure | Status/reason, what may already have committed and recovery action |
| Retry / lost response | Operation identity, replay guarantees, uncertainty and prohibited assumptions |
| Compatibility | Consumer impact; breaking/additive assessment and approved migration if needed |
| Verification | Test/oracle, exact executed source/artifact, result, evidence and limitations |
| Open decisions | UNKNOWN item, owner, resolution point and review trigger |

For an HTTP contract, link or author the matching OpenAPI description when its wire details are
settled. It must agree with the semantic contract; an example is not a complete schema.
For events/internal seams, use the actual governed envelope/module contract, not an invented HTTP adapter.

## Frozen release and receipt

| Field | To populate |
|---|---|
| Package identity | Document versions, immutable Git revision, included paths; artifact hashes if distributed |
| Application baseline | Source SHA / deployed artifact SHA separately; UNKNOWN if not delivered |
| Scope / audience | Included/excluded domains; internal/external classification and sharing authorization |
| Provider / recipient | Named contacts and teams; recipient-specific date |
| Environment | Approved endpoint/access instructions separately controlled; no credentials |
| Qualification | Exact checks/results/evidence; NOT-RUN checks and accepted limits |
| Acceptance | Authority, date and review record; distinguish document acceptance from tested implementation |
| Recipient acknowledgement | Received revision; questions/exceptions; document agreement versus integration outcome |
| Change handling | Impact, proposed successor, affected consumers and review/change record |

An unfilled template is not a completed handoff. Never include passwords, session cookies,
CSRF values, credential proofs, private keys or private diagnostic logs.
