# PH2 Controlled Product Data — semantic API contract v0.2

| Control field | Value |
|---|---|
| Stable ID / class | `IE-API-CPD-001` / supporting operation contract |
| Version / status / normativity | `0.2` / `Draft` / `INFORMATIVE`; source-derived semantics, no new requirement |
| Repository instruction state | `NOT-APPLICABLE` |
| Owner / author | Controlled Product Data owner role / Codex; named domain contact UNKNOWN |
| Reviewer / acceptance | Project Reviewer / Product Decision Authority; v0.2 acceptance NOT-RUN |
| Baseline / date | Main `1fb3f7756ad566c527c1247040054f5e9c719953` / 2026-10-06, Asia/Ho_Chi_Minh |
| Classification / retention | INTERNAL / preserve editions and exact source lineage in Git |
| Upstream | DOC-04@0.15, DOC-05@0.26, DOC-06@0.18, DOC-07@0.17; source ledger below |
| Downstream | [Handoff](handoff/README.md), [Vietnamese flow](cpd-guide.vi.md), [synthetic examples](cpd-examples.json), [OpenAPI decision boundary](cpd-openapi.json) |
| Change / worker mode | [Issue #44](https://github.com/devphuclam/IDEAEngineering/issues/44) / CODEX_ONLY |
| Effective date / supersession | NOT-APPLICABLE until accepted / first CPD detail edition; does not supersede Identity v0.1 |
| Review trigger | PH2 scope, product decisions, wire selection, permission seeds or implementation changes |
| Evidence | Authority/source inspection; CPD runtime qualification and verifier NOT-RUN; no standards-conformity claim |

## 1. Scope, source ledger and readiness

CPD means Controlled Product Data. API means application programming interface. HTTP means
Hypertext Transfer Protocol; JSON means JavaScript Object Notation. This edition refines CPD-1
and CPD-2 in the [Core catalogue](README.md), not the whole PH2 feature or implementation.

| Source at pinned main | Controlling sections | Exact Git blob |
|---|---|---|
| [DOC-04](../DOC-04-software-requirements-specification.md) | §2.1 identity/intake; §2.4 authority/configuration; §6.2 open decisions | `6cbe519ceec26a94d02ad9c4a1932a71fdf065ce` |
| [DOC-05](../DOC-05-architecture-description.md) | §5 owners; §6 IF-PRODUCT-QUERY/COMMAND and custody; §7 registration/publication; §8 identity | `6bd408ee2a611de47af2cce8dd81abae08d61107` |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | §1 owners; §2 identity/version; §3 relationships; §4 exchange; §5.1–5.2 onboarding | `e17ae8e97cc4c5a13ee293774cadc373cc29a64f` |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | §3 controlled-document core and PH2 milestones; [Appendix A §4.3](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md#43-ph2--quản-lý-tài-liệu-lõi-96-giờ) C01–C05 | `bd21cf25edaba2733befd878472662fa727d2a2a` |

Terminology comes from [CONTEXT](../../../../../CONTEXT.md); immutable publication and governing
Project boundaries come from [ADR-0005](../../../../adr/0005-use-immutable-generations-and-atomic-change-sets.md)
and [ADR-0011](../../../../adr/0011-one-governing-project-per-logical-document.md).
The [reported approval](../registers/CHG-2026-09-25-pg2-pg3-approval.md) does not establish clean
whole-Core PG3 or PH2 execution permission. Roadmap dates are plans, not implementation evidence.

Every operation below is **DESIGN**, not IMPLEMENTED. Production Server mappings at the pinned
baseline expose identity, health and development documentation, not these CPD operations.
Existing Artifact/Grant/Receipt services, schema names or F04 synthetic commands do not constitute
an implemented CPD adapter. No HTTP method, URL, schema or status code has sufficient CPD authority
in this source set. The OpenAPI file therefore has `paths: {}`, not invented routes.

## 2. Detailed semantic operation catalogue

IDs below are local document indexes, not wire operationId values or Permission codes.

| Index / family | Operation | Interface | Main trace | Planning / status |
|---|---|---|---|---|
| CPD-1.1 | Inspect Store Existing candidate and duplicates | IF-PRODUCT-COMMAND; custody/format dependency | REQ-ID-005/006; REQ-FMT-001; DOC-06 §5.2 inspect | C02 / DESIGN |
| CPD-1.2 | Preview metadata/number/identity mapping | IF-PRODUCT-COMMAND | REQ-ID-005/006; REQ-GOV-003/004; DOC-06 §5.1–5.2 | C01→C02 / DESIGN |
| CPD-1.3 | Confirm New registration | IF-PRODUCT-COMMAND | REQ-ID-001/003/006; REQ-GOV-001…004 | C03 / DESIGN |
| CPD-1.4 | Confirm Store Existing identity disposition | IF-PRODUCT-COMMAND | REQ-ID-001/005/006/007; DOC-06 §5.2 | C02 / DESIGN |
| CPD-1.D1 | Verified-candidate first publication (necessary boundary, not new standalone API) | IF-PRODUCT-COMMAND; IF-ARTIFACT-CUSTODY; IF-ARTIFACT-TRANSFER | REQ-ID-003/004; REQ-WS-009/012/016; DOC-06 §5.2 | C02/C03 with PH3 Check-in boundary / DESIGN |
| CPD-2.1 | Resolve exact Logical Document and current head observation | IF-PRODUCT-QUERY | REQ-ID-001/002/003; REQ-GOV-001/002 | C03→C04/C05 / DESIGN |
| CPD-2.2 | Resolve exact Revision / Version / Generation | IF-PRODUCT-QUERY; custody only for bytes | REQ-ID-002; DOC-06 DATA-REL-002…004 | C03/C05 / DESIGN |
| CPD-2.3 | Read authorized retained history | IF-PRODUCT-QUERY | REQ-ID-001/002; REQ-GOV-001/002; REQ-IAM-006 | C03/C04 / DESIGN |
| CPD-2.4 | Browse authorized Folder/Placement and resolve target | IF-PRODUCT-QUERY | REQ-ID-007; REQ-AUTH-003/007; DOC-06 DATA-REL-017/018 | C04/C05 / DESIGN |

Information Model validation/number allocation, current access evaluation and exact Artifact
custody are dependencies, not separately redesigned APIs. Duplicate inspection is not a general
Discovery search contract. Full DSC-1 search remains SPEC-OPEN-02; no advanced/saved search,
generic CRUD, Rename/Create Copy, revision creation, workflow/release, placement mutation or
Workspace binding protocol is introduced here.

## 3. Shared authority, data and failure contract

All operation cards inherit this section, including its explicit UNKNOWNs.

**Authority.** Server/IAM establishes current Actor and Operating Organization from eligible
session proof. Controlled Product Data requests current Access Policy evaluation and enforces
its own gates, with commit-time revalidation for mutations (REQ-GOV-002, REQ-AUTH-008).
Exactly one Governing Project owns modification/review/release authority. Project membership,
Account Administrator/Super Administrator, Document Class or Folder placement alone grants no
product action. Exact CPD Permission codes/role seed remain SPEC-OPEN-03, not inferred from IAM.
Query results and duplicate candidates are permission-filtered; counts, reasons and identifiers
cannot reveal protected data (IF-PRODUCT-QUERY; REQ-AUTH-007).

**Semantic request/response, not wire DTOs.** Cards name information needed by the operation.
Required/optional JSON properties, types, lengths, defaults, nullability, enum encodings,
identifier serialization and serialization of policy pins remain UNKNOWN. ActorContext is
Server-established, not a client field. Organization supplied as a selector, if later chosen,
cannot override authenticated scope.

**Identity/state.** DocumentId is stable and not derived from path/name/number/digest.
RevisionId/RevisionCode, Version within Revision and GenerationId are different coordinates.
No separate Version Sequence. A registration may be Start with no Generation/Working Head;
first successful Check-in creates Revision A, Version 1, immutable Generation and Working Head,
moving to In Work under seeded policy. Changed Check-in increments once; No Change does not;
new Business Revision resets Version to 1. Later transitions are explanatory dependencies, not
implemented by this contract. Source approval text, file times and usernames are provenance,
not approval, release or stable Actor authority.

**Atomicity.** Material accepted owner mutation, Owner Command Outcome, required Audit and
applicable outbox share the authoritative relational unit of work. Private verified bytes are
outside that database transaction. Storage receipt is not publication; failed publication
exposes no valid partial baseline. Refusal stays attributable; exact per-operation durable
refusal/outbox contract is UNKNOWN, not copied from the F04 synthetic seam.

**Failure vocabulary.** Invalid metadata/schema, number conflict, ineligible session, missing
grant, wrong Organization/Project, ambiguous selection, stale expected state, missing/unverified
content, unavailable authority and storage/commit uncertainty are semantic conditions, not new
wire error codes. Field-level correction is supported by DOC-06 mapping feedback. Exact HTTP
status/body, error precedence and absent-versus-unauthorized concealment are UNKNOWN.
No generic “technical failure” may be reported as business success.

**Concurrency/retry.** Owner revalidates expected state and current permissions; number uniqueness
and allocation retry follow versioned policy. Material command carries OperationId/correlation
per IF-PRODUCT-COMMAND. DOC-06 §5.2 disallows duplicate outcome for a retried intake operation.
Detailed intake changed-input matching, canonicalization, retention and result-query wire/access
policy remain UNKNOWN; do not import F04 origin-Actor-only semantics or F05 wire encodings.
REQ-WS-012's identical-input/changed-input rule governs Check-in specifically.
Lost response is not proof of rollback: resolve the same logical operation through the future
governed status/resume surface; do not retry as a fresh success with a new identity. Read-only
queries can be repeated after reauthorization, but a later head/history observation may differ.

## 4. Operation cards

### CPD-1.1 — Inspect Store Existing candidate

- **Authority / input:** Eligible Actor and applicable access; authorized persisted source file,
  selected Document Class/schema, metadata/path/name and candidate content digest. Format/profile
  readability and size validation belong to their declared capability, not an assumed parser.
- **Output:** Inspection findings and permitted duplicate candidates with metadata, path/name and
  digest evidence. Same digest suggests reusable bytes, never identical Logical Document.
  Match ranking/equality/normalization rules and preview identity lifetime are UNKNOWN (U02).
- **State / atomicity:** Non-authoritative inspection; no controlled record or published
  Generation committed. Source bytes are unchanged; inspection result/Audit per DOC-06 §5.2.
- **Error / concurrency:** Unreadable/unsupported/invalid source, lost access or unavailable
  evidence prevents a trustworthy preview. Results are a point-in-time observation, not a lock
  on all possible duplicates. No unauthorized candidate or count disclosure.
- **Idempotency / retry:** Inspection may be repeated; same file may yield changed candidate
  results. No durable inspection-cache/replay guarantee is selected. HTTP details UNKNOWN.

### CPD-1.2 — Preview mapping and identity choice

- **Authority / input:** Applicable Actor, class/schema and numbering-policy version, proposed
  metadata/business number/relations and inspection findings. Existing legacy revision labels
  may be recorded as provenance, not mapped into trusted historical versions automatically.
- **Output:** Validated mapping with each required field/relation resolved or visibly unresolved;
  field/relation/number conflicts and choices create/link/cancel. This is a preview, not an
  allocation or registration success. Exact choice payload and mapping token are UNKNOWN.
- **State / atomicity:** No published baseline; invalid metadata blocks registration/publish.
  Governed definitions retain exact version interpretation (REQ-GOV-003/005).
- **Error / concurrency:** Required field absent, invalid format, incompatible/changed definition
  or number conflict returns correction findings; active policy at later commit is revalidated.
  Number allocation is unique within configured scope and separately idempotent (REQ-GOV-004).
- **Idempotency / retry:** Correct input then preview again; no frozen preview validity is
  promised. Normalization/equality, numbering cancellation/gaps and policy-change handling U02/U03.

### CPD-1.3 — Confirm New registration

- **Authority / input:** Current authorized Actor, Governing Project, selected class/metadata
  definitions, validated metadata/number choice, explicit new-identity confirmation and
  OperationId/correlation/expected state. Exact role codes and wire precondition token UNKNOWN.
- **Output:** Attributable registration result with one stable DocumentId and governing identity;
  may be Start without published content. Do not fabricate Revision/Generation/head in a
  registration response. Placement association details require the approved placement model.
- **State / atomicity:** Registration creates the same Logical Document model as Store Existing.
  Any material committed records/outcome/Audit/applicable outbox agree; no partial accepted
  registration. Number allocation versus registration transaction coordination remains U03/U04.
- **Error / concurrency:** Lost authority, invalid metadata/number, policy/expected-state conflict
  refuses without a successful partial owner result. Number collisions cannot yield duplicates.
- **Idempotency / retry:** OperationId identifies material command; no new DocumentId from the
  same completed logical operation. Exact binding, changed-input and status wire remain U05.
  First publication is CPD-1.D1, not implicit in an empty New registration.

### CPD-1.4 — Confirm Store Existing identity disposition

- **Authority / input:** Actor, validated mapping/inspection and explicit create/link/cancel
  choice; exact existing target if link is selected; OperationId and current expected context.
  Target access is revalidated, not derived from seeing its duplicate warning.
- **Output:** Explicit selected disposition. Create registers a new identity using the shared
  model; link refers to the chosen existing identity without silently overwriting/merging it;
  cancel creates no accepted document. Exact kind of link, pin/placement request and whether
  confirmation combines registration with publication remain U01/U04.
- **State / atomicity:** Same-name/path/digest cannot auto-merge identities. Physical Artifact
  deduplication is independent. Source is never modified/deleted. Private verified progress may
  remain for policy-controlled reconciliation, not as a public Generation.
- **Error / concurrency:** Stale target/preview, number/metadata conflicts, lost scope or
  unverified bytes block the affected commit. Confirmation revalidates current authority and
  business gates; candidate listing alone is not a concurrency guarantee.
- **Idempotency / retry:** Same OperationId cannot produce duplicate intake result (DOC-06 §5.2).
  After interrupted transfer preserve verified progress; after uncertain commit resolve original
  operation. Cancellation/pending states and changed-input comparison are U04/U05.

### CPD-1.D1 — First publication boundary

- **Authority / input:** Server-established eligible Actor, current authorization/policy and
  owner validation, exact privately verified Artifact identity/digest/content role, metadata
  definition/values, required exact structure/provenance and declared operation/expected state.
  Workspace/Reservation integration is a PH3 dependency; not waived or redesigned for PH2.
- **Output:** One complete exact initial baseline: DocumentId, Revision A, Version 1,
  GenerationId/manifest and Working Head, plus owner/evidence correlation.
- **State / atomicity:** Start→In Work only after success. DOC-06 §5.2 describes combined
  registration/first publish; DOC-04 permits prior identity-only registration. Any path must
  expose no empty/partial Generation. Shared relational commit contains required owner records,
  manifest, outcome, Audit/outbox; it does not atomically write external bytes.
- **Error / concurrency:** Missing/mismatched digest, unavailable custody, stale context, lost
  eligibility or any required write failure prevents valid publication. Unused bytes stay
  private. Expected-head/Reservation checks apply where the Check-in boundary requires them.
- **Idempotency / retry:** REQ-WS-012: same OperationId and identical declared inputs resolves/
  resumes same Check-in; changed input refused; no duplicate Generation/Change Set. Query and
  input fingerprint wire UNKNOWN. Successful custody alone never counts as CPD success.

### CPD-2.1 — Resolve document and current head

- **Authority / input:** Current eligible Actor, stable DocumentId and requested view; owning
  Organization/Project authorization. Name/path/business number alone is not exact identity.
- **Output:** Authorized identity/current state plus at most one exact Working Head; distinguish
  registered/no-head from published. Governing Project, business number and selected metadata
  retain their separate meanings. Output field set and absent-head encoding UNKNOWN.
- **State / atomicity:** Read-only owner view. Working Head is current at an observation, not a
  Released Baseline or a promise it will still be current at the next command.
- **Error / concurrency:** Missing/inaccessible context fails without data leakage. Any later
  command uses an exact expected pin; projection lag is identified, never hidden as authority.
  Single-query consistency token/isolation and stale response markers remain U06/U07.
- **Idempotency / retry:** Repeating query writes no product state but may observe a new head.
  Access checked anew. Cache/conditional request semantics and HTTP taxonomy UNKNOWN.

### CPD-2.2 — Resolve exact Revision / Version / Generation

- **Authority / input:** Authorized DocumentId and selected Revision/Version coordinate or
  GenerationId. Every supplied pin must relate to the same document/Revision (DATA-REL-002/003).
  An incomplete selector is not license to fall back to latest.
- **Output:** Exact immutable Generation manifest with RevisionId/code, Version within Revision,
  metadata definition/values, exact Artifact references and applicable structure/provenance.
  A Revision with several Generations needs an explicit selection; selector shape U06.
- **State / atomicity:** Read-only resolution. Later head changes never rewrite historical pins.
  Bytes, if requested, resolve through Artifact Custody to exact retained identity/digest;
  physical path/provider key is not exposed. Derivative preview is not source authority.
- **Error / concurrency:** Mismatched document/Revision/Generation, missing/corrupt bytes,
  unavailable custody or denied access cannot return an alternative Generation as success.
  Exact error/status and metadata-only degraded result handling U07/U08.
- **Idempotency / retry:** Retained immutable content stays pinned; eligibility/location
  availability may change. Retry preserves exact selector and reauthorizes, not “latest.”

### CPD-2.3 — Read retained history

- **Authority / input:** Authorized stable DocumentId, requested history scope; retained
  Revision/Generation and attributable history are resolved under current read authority.
- **Output:** Distinct revision identities/codes and ordered Version/Generation relationships,
  exact retained pins and permitted attribution; no separate Version Sequence. History of
  same document survives rename/login changes. Ordering across Revisions, paging/cursors,
  filters, exposed Audit fields and total-count rules remain U07.
- **State / atomicity:** Read-only; no rewriting past manifest or treating file timestamp as
  authoritative publication time. Audit query scope is separately authorized.
- **Error / concurrency:** Hidden objects/entries/counts remain hidden. New commits may extend
  history; cross-page snapshot consistency is not decided. Missing required retained data is
  a visible bounded failure, not reconstructed fictitious history.
- **Idempotency / retry:** Repeat after current authorization; collection may grow. No stable
  page token, cache guarantee or new audit-export API is declared.

### CPD-2.4 — Authorized placement navigation

- **Authority / input:** Eligible Actor, FolderId/PlacementId and requested navigation scope,
  or selected placement target. Logical hierarchy is not a filesystem path or access boundary.
- **Output:** Authorized hierarchy/placements and target DocumentId; an exact historical link
  retains selected Revision/Generation. Navigation alias is placement metadata, not controlled
  Product Definition title. Same document may have explicit additional links.
- **State / atomicity:** Read-only. One governed primary placement and additional explicit
  links per DATA-REL-017. Move/unlink cannot create a new identity/Generation or delete content;
  mutation interfaces themselves are out of scope.
- **Error / concurrency:** Placement visibility cannot grant target content access. Wrong
  Organization or denied target does not disclose protected details. Cross-Project use follows
  ADR-0011's exact authorized Released reference, not consuming-Project membership alone.
  Non-historical link resolution/default and hierarchy visibility/redaction rules remain U01/U07.
- **Idempotency / retry:** Reauthorize each navigation; hierarchy can change between reads.
  Historical exact pins remain exact. Listing/paging/cursor and HTTP surface UNKNOWN.

## 5. Decision register — wire authoring gate, not new architecture

All UNKNOWNs have a role owner and resolution trigger. Principal Product Author prepares;
Project Reviewer checks; Product Decision Authority decides when the answer changes product
semantics. Ordinary technical adapter refinement still follows the scoped Work Item review.

| ID | Unresolved details | Owner / resolution action / trigger |
|---|---|---|
| U01 | Meaning of intake “link”: placement versus another governed relation; exact target and history pins; default navigation resolution | CPD owner; reconcile REQ-ID-005/007 and DATA-REL-017; before confirmation/navigation wire is frozen |
| U02 | Duplicate match equality/normalization/ranking, schema/metadata seeds, format/size prerequisites, preview validity | Information Model + CPD + Format owners; SPEC-OPEN-03/04/05; before C01/C02 acceptance and input schema |
| U03 | Number scope, allocation API, policy pins, cancellation/gaps and coordination with registration | Information Model + CPD owners; SPEC-OPEN-03 and REQ-GOV-004; before registration commit contract |
| U04 | Identity-only registration versus combined registration/first publication exposure; cancellation state/retention; PH2/PH3 Workspace dependency | CPD owner + delivery reviewer; reconcile DOC-04/DOC-06/DOC-07 without weakening atomicity; before product operation sequencing is selected |
| U05 | Intake operation binding/canonicalization/changed-input rules, result-access/status/resume surface and retention | CPD owner; refine IF-PRODUCT-COMMAND + DOC-06 §5.2; before idempotency implementation/test plan |
| U06 | Exact selectors, expected-state encoding and representation of no-head registration; request/response types/bounds | CPD/API owner; select adapter and wire contracts from identity model; before CPD OpenAPI paths |
| U07 | Safe error/status precedence, filtered counts/ordering/paging, history consistency, projection lag and navigation visibility | CPD + Access Policy + Discovery owners; SPEC-OPEN-02 for find/browse; before query wire/review |
| U08 | Exact content retrieval surface, degradation behavior and custody handoff without provider-path leakage | CPD + Artifact Custody owners; retain IF-ARTIFACT-CUSTODY/TRANSFER; before client byte integration |
| U09 | Product Permission catalogue, scoped role/configuration seed and commit-time evidence protocol | Access Policy + CPD owners; SPEC-OPEN-03, REQ-GOV-002; before executable CPD qualification |

No unresolved choice here blocks publishing a truthful Draft semantic contract. It blocks claims
that the affected wire details or executable feature are already decided.

## 6. Verification and handoff

Planned oracles, **not executed results**:

| Scenario | Oracle / trace |
|---|---|
| Same name, path or digest | Visible authorized duplicate preview; explicit create/link/cancel; no identity merge (REQ-ID-005) |
| New and Store Existing | Same controlled model and authority; unmodified existing source (REQ-ID-006; DOC-06 §5.2) |
| Registration without content | No empty published Generation; review/released Reference/Release ineligible (REQ-ID-003) |
| First publish fault / lost response | No partial baseline; same operation resolved without duplicate (REQ-ID-004; DOC-06 §5.2) |
| Number race / authorization change | Unique scoped allocation; current permission and owner gates enforced (REQ-GOV-002/004) |
| Exact history after later head | Same retained manifest/pins; no latest substitution (REQ-ID-001/002; IF-PRODUCT-QUERY) |
| Placement across scope | No access from placement alone; history pin stable; no count/detail leakage (REQ-ID-007; REQ-AUTH-003/007) |

Document checks: local links/anchors, cited REQ/IF existence, JSON syntax, empty CPD wire path
boundary and allowed-file diff. Runtime tests/verifier NOT-RUN. Formal OpenAPI schema-validator
execution NOT-RUN unless an existing admitted validator is actually used; JSON parsing alone is
not full OpenAPI conformance. No external sources/packages are imported.

Receiving teams get semantic discussion material, not implementation-ready DTOs for unknown
operations. Use the existing [handoff template](handoff/template.md); pin source revision and
explicit decision-register items. Identity/Session v0.1 and external-sharing restrictions remain.
