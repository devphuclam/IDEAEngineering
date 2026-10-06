# API contract specification: primary-source practice and an IDEA document package

API means application programming interface; HTTP means Hypertext Transfer Protocol.

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-API-CONTRACT-001` |
| Class / version / status | `RESEARCH-NOTE` / `0.1` / `Draft` |
| Artifact role / product normativity | Research input for API documentation design / `INFORMATIVE`; creates no product obligation or architecture decision |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named accountable owner `UNKNOWN` / Codex, acting as Principal Product Author |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority; named accountable parties `UNKNOWN`; review and acceptance `NOT-RUN` |
| Applicability / source baseline | IDEA Engineering, current internal PH1 context; repository `main` source `9dab479db929bce88f101cdcbeee91dec50bc25a` |
| Evidence date / effective date | `2026-10-06`, UTC+07:00 (`Asia/Ho_Chi_Minh`) / `NOT-APPLICABLE`; no adopted policy effective date |
| Classification / retention | `INTERNAL`; retain in Git with any successor contract-documentation decision |
| Upstream trace | User research request; [`IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md); [instance catalogue](../product/instances/idea-engineering/README.md); primary sources below |
| Downstream trace | [Lean API reading package](../product/instances/idea-engineering/api/README.md); approved authoring scope under [Work Item #40](https://github.com/devphuclam/IDEAEngineering/issues/40), not product-contract acceptance |
| Change / predecessor / supersession | Initial record plus user-approved lean authoring scope; predecessor, supersedes and superseded-by `NOT-APPLICABLE`; product-scope impact `NONE` |
| Review trigger | Contract package adoption, governing source change, HTTP surface change, or proposed compatibility/security behavior change |
| Evidence status | `PRIMARY-SOURCE-CHECKED`; repository/source inspection only; runtime, schema/tool validation, independent review and acceptance `NOT-RUN` |

Control tailoring: the research envelope combines related fields but retains identity, authority,
baseline, evidence, review and change states. `STD-INFO-001`, ISO/IEC/IEEE 15289:2019,
`STANDARD-GUIDED`, informs information-item control through the local authoring standard. The
external API sources are references, not additions to the standards register or conformity claims.
Findings distinguish `DIRECT-SPECIFICATION-FACT`, `DIRECT-ORGANIZATION-GUIDANCE`,
`REPOSITORY-OBSERVATION` and `ENGINEERING-RECOMMENDATION`.

## 1. Question and actual IDEA baseline

The question is how professional API contracts describe an interface understandably and precisely,
and which documentation structure fits IDEA. Research is reference-only: no source import,
dependency, implementation, endpoint, authorization policy, version upgrade or product decision
is authorized by this note.

`REPOSITORY-OBSERVATION`: DOC-04@0.15, DOC-05@0.26 and DOC-06@0.18 are within the exact source
approval recorded by [`IE-CHG-PDA-APPROVAL-004`](../product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md).
Their retained Draft headers do not establish that their requirements are unapproved. The record
distinguishes whole-source review from clean PG3 gate use, which is bounded to PH1 F01–F05; it
does not record a clean whole-Core-v0 PG3 PASS. Some catalogue statements still describe the earlier
approval state; the attributable approval record supplies the later disposition.

[DOC-05's semantic catalogue](../product/instances/idea-engineering/DOC-05-architecture-description.md#6-semantic-interface-catalogue)
contains 17 `IF-*` interfaces across Core. That is design meaning, not 17 deployed HTTP services.
The [Server development OpenAPI](../../apps/server/src/main/resources/dev-access/openapi.json)
declares `3.0.3`, document version `dev-access-0.1`, and 11 paths: two health and nine identity
paths. The [Gateway HTTP adapter](../../apps/gateway/src/main/java/com/idea/ddm/gateway/GatewayApplication.java)
has two HTTPS POST routes, `/transfer/range` and `/transfer/status`. Server grant, renewal and
receipt routes in [the F05 boundary test](../../apps/server/src/test/java/com/idea/ddm/identity/TransferClientBoundaryTest.java)
are registered under `/qualification/f05/`; they are qualification fixtures, not supported
product routes. These observations establish a documentation starting point, not future public
integration scope or a new runtime qualification result.

## 2. Primary-source register

All sources were accessed on `2026-10-06`. OpenAPI Specification (OAS) and Request for Comments (RFC)
editions below are fixed publications. IETF is the Internet Engineering Task Force; JSON is
JavaScript Object Notation; AIP is Google's API Improvement Proposal series. Long-running
operation (LRO) denotes an asynchronous operation with an observable completion outcome.
Google and Microsoft guidance is living organizational policy, with source snapshots pinned where
available. A page's old “Updated” field is not treated as its latest revision when its changelog
contains later entries.

| ID | Owning source / pinned context | Evidence use and limitation |
|---|---|---|
| `API-S01` | OpenAPI Initiative, [OAS 3.0.3](https://spec.openapis.org/oas/v3.0.3.html), 2020-02-20 | HTTP description specification; matches the current Server declaration, not an upgrade recommendation |
| `API-S02` | IETF, [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), June 2022, `STD 97` | HTTP semantics; not a domain model or a complete application retry policy |
| `API-S03` | IETF, [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html), December 2017, [Internet Standard / STD 90](https://www.rfc-editor.org/info/rfc8259/) | JSON interchange; not a schema or business validation language |
| `API-S04` | IETF, [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), July 2023, [Proposed Standard](https://www.rfc-editor.org/info/rfc9457/), obsoletes RFC 7807 | Optional problem-detail format; adopting it is separate from documenting existing errors |
| `API-S05` | Google, [AIP-121](https://google.aip.dev/121), Approved; created 2019-01-26, latest listed change 2024-07-08 | Resource-oriented design; Google remote-procedure-call (RPC)/resource conventions |
| `API-S06` | Google, [AIP-123](https://google.aip.dev/123), Approved; created 2019-05-12, latest listed change 2025-01-09 | Resource-type identity/naming; its naming scheme is not an IDEA decision |
| `API-S07` | Google, [AIP-158](https://google.aip.dev/158), Approved; created 2019-02-18, latest listed change 2025-07-08 | Pagination and behavioral compatibility |
| `API-S08` | Google, [AIP-180](https://google.aip.dev/180), Approved; created 2019-07-23, latest listed change 2025-10-21 | Source, wire and semantic compatibility; chiefly protobuf/JSON consumer context |
| `API-S09` | Google, [AIP-185](https://google.aip.dev/185), Approved; created/Updated 2024-10-22 | Google API versioning; does not prescribe IDEA release numbering |
| `API-S10` | Microsoft, [Azure REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/Guidelines.md), source snapshot below; latest listed history 2025-03-28 | Azure data-plane guidance, versioning and LRO patterns; not universal HTTP rules |
| `API-S11` | Microsoft, [Considerations for Service Design](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/ConsiderationsForServiceDesign.md), same snapshot | Early API definition, scenarios and error compatibility; Azure-specific details need tailoring |
| `API-S12` | Microsoft, [root Guidelines notice](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/Guidelines.md), same snapshot | Explicitly deprecated; routes readers to current Azure or Graph guidance |

The Google source snapshot is [`23e176e7333ea3bc6b085f9950a5da03d2bbfc72`](https://github.com/aip-dev/google.aip.dev/commit/23e176e7333ea3bc6b085f9950a5da03d2bbfc72),
committer date `2026-08-17T22:25:32Z`; the five AIPs are under `aip/general/0121.md`, `0123.md`,
`0158.md`, `0180.md`, `0185.md`. Microsoft `vNext` resolved to
[`a7022a299442a8352431874e63ec4dff548a1b81`](https://github.com/microsoft/api-guidelines/commit/a7022a299442a8352431874e63ec4dff548a1b81),
committer date `2026-08-05T00:06:13Z`. Commit dates identify snapshots, not the publication date
of every paragraph. Only short paraphrases and links are retained; no upstream implementation,
samples or substantial source text are imported.

## 3. Findings and IDEA interpretation

**API-C01 — different authorities solve different problems.** `DIRECT-SPECIFICATION-FACT`:
RFC 9110/8259 define HTTP/JSON behavior; OAS defines an HTTP interface description. RFC 9457
is an IETF Standards Track error-format specification. `DIRECT-ORGANIZATION-GUIDANCE`:
Google AIPs and Azure guidelines prescribe their organizations' patterns. Microsoft's root
guidelines are deprecated, so that old document is not the current generic authority.
`ENGINEERING-RECOMMENDATION`: record a tailored IDEA profile with explicit source applicability,
rather than declaring the product “compliant with all API standards.”
([S01](https://spec.openapis.org/oas/v3.0.3.html), [S02](https://www.rfc-editor.org/rfc/rfc9110.html),
[S04](https://www.rfc-editor.org/rfc/rfc9457.html), [S12](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/Guidelines.md)).

**API-C02 — meaning precedes HTTP mapping.** `DIRECT-ORGANIZATION-GUIDANCE`: Google AIP-121
starts with resources, relationships, schemas and methods and warns against equating an API with
the storage schema. AIP-123 gives resources explicit type identity. Azure starts with understandable
abstractions and primary scenarios, then an early API definition/OpenAPI description.
`ENGINEERING-RECOMMENDATION`: use existing IDEA domain/owner/interface identities to explain an
operation's purpose, authority, preconditions, state changes and failure outcome before its route.
This does not adopt Google resource names or expose every internal seam.
([S05](https://google.aip.dev/121), [S06](https://google.aip.dev/123),
[S11](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/ConsiderationsForServiceDesign.md#start-with-your-api-definition)).

**API-C03 — OpenAPI is a machine-readable HTTP projection.** `DIRECT-SPECIFICATION-FACT`:
OAS describes paths, operations, parameters, request content, responses, schemas and security
schemes; prose/external documentation can carry additional explanation. OAS 3.0.3's Schema Object
is an extended JSON Schema subset, not unrestricted Draft 2020-12. Its `openapi` version and
`info.version` document version are separate. `ENGINEERING-RECOMMENDATION`: retain 3.0.3 for the
initial package and identify schema dialects; validation or a Swagger screen alone cannot establish
domain invariants or runtime conformance.
([S01](https://spec.openapis.org/oas/v3.0.3.html#schema-object)).

**API-C04 — retry and concurrency are observable contracts.** `DIRECT-SPECIFICATION-FACT`:
HTTP idempotency concerns repeated intended effects, not identical responses; automatic retries
of non-idempotent requests need additional knowledge. `If-Match` uses strong entity-tag comparison
and prevents application when its precondition fails. Range/206 semantics concern representations,
not every custom chunk-upload protocol. `ENGINEERING-RECOMMENDATION`: specify each operation's
duplicate identity/scope, replay result, current authorization, uncertain outcome and concurrency
guard. A POST body UUID named `operationId` is distinct from the symbolic OpenAPI `operationId`.
[ADR-0014](../adr/0014-retain-owner-committed-event-foundation.md)'s terminal refusal and result-reader
policy are sample-only; do not generalize them to all owners.
([S02 §§9.2.2, 13.1.1, 14](https://www.rfc-editor.org/rfc/rfc9110.html)).

**API-C05 — errors need stable meaning without leaking authority.** `DIRECT-SPECIFICATION-FACT`:
RFC 9457 defines `application/problem+json`, problem-type identity and extensible details;
the optional body status agrees with the generated HTTP status. Clients should not parse human
`detail` text. `DIRECT-ORGANIZATION-GUIDANCE`: Azure treats HTTP/top-level error codes as
compatibility-relevant. `ENGINEERING-RECOMMENDATION`: first describe actual empty identity refusals,
Gateway refusals and framework parsing errors separately. Adding Problem Details, changing status
or exposing a reason is a proposed behavior change, not a documentation correction.
([S04](https://www.rfc-editor.org/rfc/rfc9457.html#section-3),
[S11](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/ConsiderationsForServiceDesign.md#errors),
[identity adapter](../../apps/server/src/main/java/com/idea/ddm/identity/IdentityController.java)).

**API-C06 — async acceptance differs from completion.** `DIRECT-ORGANIZATION-GUIDANCE`:
Azure LRO patterns define initiation, a status-monitor location, polling, terminal result/error,
retry delay and retention; initiation status varies by pattern. Its exact headers, thresholds and
retention durations are Azure conventions. `ENGINEERING-RECOMMENDATION`: where IDEA has an approved
async operation, explain what receipt/progress means and who authoritatively finishes it. Existing
transfer status is not automatically an Azure LRO; no speculative job API follows.
([S10](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/Guidelines.md#long-running-operations--jobs)).

**API-C07 — compatibility includes behavior.** `DIRECT-ORGANIZATION-GUIDANCE`: AIP-180
distinguishes source, wire and semantic compatibility and explicitly allows more tailored needs
when one team controls its consumers. AIP-158 shows why adding finite pagination later can break
an unchanged client; page tokens are continuation, not authorization. Google AIP-185 describes
major URI/channel versions and interface-based date versions carried in a header or query parameter;
Azure prescribes its own date-valued `api-version` query parameter.
`ENGINEERING-RECOMMENDATION`: decide compatibility for IDEA's actual update/deployment relationship;
keep API path version, document revision and signed wire-envelope version distinct. No universal
version scheme or pagination shape is established by these references.
([S07](https://google.aip.dev/158), [S08](https://google.aip.dev/180), [S09](https://google.aip.dev/185),
[S10](https://github.com/microsoft/api-guidelines/blob/a7022a299442a8352431874e63ec4dff548a1b81/azure/Guidelines.md#api-versioning)).

**API-C08 — representation validity is only one validation layer.** `DIRECT-SPECIFICATION-FACT`:
JSON defines syntax/interchange types, recommends unique object names and specifies UTF-8 for
exchange outside a closed ecosystem. It does not define business identity, null/absent meaning
or cross-field invariants. `ENGINEERING-RECOMMENDATION`: record those meanings, ranges/units,
unknown-field behavior and binary-envelope boundaries in the applicable schema/profile; do not
pretend JSON validation qualifies signed frames or owner transactions.
([S03 §§4, 8.1](https://www.rfc-editor.org/rfc/rfc8259.html)).

## 4. Proposed understandable package

This is `ENGINEERING-RECOMMENDATION`, awaiting design discussion. Five coordinated parts can
share files where small; there is no proposed ninth Core Product Document.

| Part | Reader question / minimum content | Authority and maintenance |
|---|---|---|
| Domain and operation catalogue | What does this operation mean? Stable operation/interface ID, owner/caller, purpose, exact identities, inputs/outputs, authorization, invariant, precondition, commit boundary, refusal, retry/recovery, support state and typed `REQ-*`/`IF-*` trace | Refines DOC-05/06; preserves their authority; separates implemented, approved design, qualification fixture and deferred entries |
| Shared protocol profile | How are common HTTP/representation rules applied? Existing session/CSRF boundary, media types, schemas, identifiers, correlation, empty/error bodies, version axes, concurrency, retry, limits and exceptions | One selected shared rule per concept with owner-specific exceptions; records current behavior before proposing changes |
| OpenAPI per HTTP surface | How can a client call it? Server and Gateway routes, parameters/headers, content, schemas, outcomes, security and links to semantic operation IDs | Machine-readable projection; reuse the current Server 3.0.3 source; fixtures and non-HTTP seams remain explicitly distinguished |
| Human flow guide | In what order do calls happen, and what does success/failure mean? A few actual scenarios with prerequisites, request/response examples, progress, refusal and recovery | Recommended English controlled source plus Vietnamese explanatory guide using the same IDs; language choice pending; no duplicated requirement authority |
| Schema, examples, change and validation evidence | What proves the description remains accurate? Dialect-pinned schemas, positive/negative examples, baseline diff, compatibility disposition and bounded HTTP/semantic qualification evidence | Reuse authorized local tooling and retained evidence; record exact baseline and result; tool selection is a later decision |

For comprehension, begin a flow with purpose, caller/owner and the meaningful end state, then show
calls. Link wire fields to controlled concepts instead of repeating whole domain definitions.
Distinguish read-only queries, authoritative commands, progress and final acceptance. Examples
use synthetic identities and never convey credentials or implementation paths as user concepts.

## 5. Proposed quality acceptance criteria

These are review criteria for a future package, not newly approved product requirements:

1. **Coverage and honesty:** every supported route maps to one semantic operation and source;
   fixtures/deferred/non-HTTP seams are identifiable; unresolved meanings are `UNKNOWN` with an owner.
2. **Precision:** each operation specifies identities, presence/null rules, units/limits,
   authorization, expected state, success/refusal and the authoritative commit boundary.
3. **Consistency:** route/verb/header/body/status descriptions agree across OpenAPI, prose,
   examples and actual adapter behavior; exceptions are visible rather than silently normalized.
4. **Recovery:** duplicate, stale, concurrent, timeout, lost-response and technical-failure cases
   identify the permitted next action; each promised invariant has a traceable verification oracle.
5. **Compatibility:** a baseline diff classifies schema, wire and semantic effects, including
   defaults/errors; accepted changes identify affected consumers and migration/deprecation decisions.
6. **Verification:** applicable parser/schema/example checks and contract qualification retain
   configuration, method, expected result, evidence and actual disposition. A source check or old
   test result does not become current runtime `PASS`.
7. **Readability and control:** a reviewer can follow one supported flow without source-code
   archaeology; identities, versions, owners and typed traces resolve; translations cite one authority.

## 6. Approved authoring scope and deferred decisions

After the recommendation, the user approved a lean v0.1: a Core v0 operation-family catalogue,
the existing Identity/Session boundary as the detailed example, and a Vietnamese flow guide over
English technical source. Work Item #40 records that documentation-only scope. The five conceptual
parts above share three authored files and the existing unchanged OpenAPI asset; no separate
framework, generator or new schema/validation dependency is introduced.

The initial package describes existing errors and owner-specific retry behavior without changing
them. Future consumer compatibility guarantees, pagination, long-running-operation shapes and
new wire semantics are deferred until an approved operation actually needs them. Future
authentication and public integration remain outside this scope. These are not prerequisites
for documenting the present adapter, and this note does not authorize product implementation.

Document current approved/qualified behavior first. Any actual semantic change follows the
repository's governing requirement/architecture and delivery workflow; this note cannot approve
it by calling it a standard. Research/source inspection completed; runtime tests, independent
review and Product Decision Authority acceptance of the new package remain `NOT-RUN`.
