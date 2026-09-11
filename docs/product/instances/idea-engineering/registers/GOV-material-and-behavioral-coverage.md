# IDEA Engineering Material and Behavioral Coverage Register

> **Supporting-record state**: controlled `Draft 0.3`. This GOV record closes the coverage
> denominator for the fixed vendor-public reference baseline dated 2026-08-26. It records what IDEA
> proposes to adapt, defer, exclude or investigate. It does not turn competitor behavior into an IDEA
> requirement and does not prove target-runtime parity.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-GOV-COVERAGE-001` |
| Supporting Class | `GOV` — Material Coverage Inventory and Behavioral Coverage Register |
| Title | IDEA Engineering Material and Behavioral Coverage Register |
| Owner | `Principal Product Author`; named person attribution is `BLOCKED` before `Proposed` |
| Record Status | `Draft` |
| Record Version | `0.3` |
| Change History | 0.3: clarify the IDEA Version/Generation disposition and remove Version Sequence; [IE-CHG-VERSION-001](CHG-2026-09-04-version-model-clarification.md). Reference inventory and vendor evidence are unchanged. |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Inventory Baseline | `IE-COV-DDM-PUBLIC-2026-08-26-001`; exactly 16 material areas |
| Evidence Baseline | [DDM Vendor-Public Capability Baseline](../../../knowledge/ddm-vendor-public-baseline.md), as of 2026-08-26 |
| Target Version / Edition / Configuration | `UNKNOWN`: no installed target package or complete authorized target audit has been supplied |
| Authors / Reviewers | Principal Product Author (assistant prepares) / project user (internal document review); formal attribution and required independent/specialist qualification remain open |
| Decision Authority | Product Decision Authority for Feature, Spec and Tech; no row is boss-approved in this version |
| Downstream Links | [DOC-01](../DOC-01-product-vision-and-scope.md), [DOC-02](../DOC-02-feasibility-and-options-assessment.md), [DOC-03](../DOC-03-business-requirements.md), [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md), [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the governed source and decision baseline; exact organizational period is `UNKNOWN`, owned by Product Decision Authority and reviewed before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit evidence/comparison gaps |

## 1. Reading and change rule

`PUBLIC-2026-08-26` below means public vendor material admitted to the evidence baseline as of
2026-08-26. It does not identify or validate a target installation. The 16 rows `MAT-DDM-001` through
`MAT-DDM-016` are the closed denominator corresponding one-for-one to `VP-01` through `VP-16` in the
source baseline.

Each material row has exactly one coverage row at this baseline. Changing an inclusion, splitting or
combining an area, or adding later source material requires a CHG record, impact review and successor
inventory baseline. Disposition has the following meaning:

- `ADAPT`: preserve the objective but define IDEA semantics and stronger controls independently.
- `ADAPT-ARAS`: adapt the objective and explicitly use a stronger documented Aras pattern as one
  design input; the linked research limitations still apply.
- `DEFER`: retain the long-term capability trace but exclude it from Core v0.
- `EXCLUDE`: intentionally reject the referenced implementation-specific or unsafe pattern.
- `UNKNOWN` or `BLOCKED`: evidence, authority or comparison is insufficient for a decision.

## 2. Material Coverage Inventory

| Inventory ID | Source proposition | Material behavior / product area | Inclusion criterion | Explicit exclusion rationale | As-of baseline/date | Owner | Review trigger | CHG history |
|---|---|---|---|---|---|---|---|---|
| `MAT-DDM-001` | `VP-01` | Deployment and support matrix | Public baseline contains a distinct deployability/compatibility proposition. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Target environment or edition supplied | Initial inventory |
| `MAT-DDM-002` | `VP-02` | Release matrix and product-version evidence | Public baseline names product releases and enhancement evidence. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | New fixed public baseline or target edition supplied | Initial inventory |
| `MAT-DDM-003` | `VP-03` | Product surfaces and broad capability matrix | Public baseline groups material CAD, Office, Web and platform capabilities. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Feature baseline changes | Initial inventory |
| `MAT-DDM-004` | `VP-04` | Store, load and file-version workflow | Directly affects intake, workspace and controlled publication. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Workspace/Check-in Spec changes | Initial inventory |
| `MAT-DDM-005` | `VP-05` | Business revision versus file version | Directly affects identity and lifecycle semantics. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Identity/revision policy changes | Initial inventory |
| `MAT-DDM-006` | `VP-06` | Reserve, Reference and modification rights | Directly affects concurrency, workspace scope and local-work safety. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Reservation/Checkout policy changes | Initial inventory |
| `MAT-DDM-007` | `VP-07` | Product structure and BOM | Directly affects exact assembly/dependency reproduction. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Structure/release policy changes | Initial inventory |
| `MAT-DDM-008` | `VP-08` | Search and saved search | Material discovery capability in the public baseline. | `NOT APPLICABLE` — included although deferred from Core v0 | `PUBLIC-2026-08-26` | Principal Product Author | Post-core discovery increment | Initial inventory |
| `MAT-DDM-009` | `VP-09` | Workflow, approval and change order | Directly affects review, approval, release and later change management. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Workflow/approval Spec changes | Initial inventory |
| `MAT-DDM-010` | `VP-10` | Administration, access, metadata and numbering | Directly affects configurable governance. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Policy/configuration design changes | Initial inventory |
| `MAT-DDM-011` | `VP-11` | Browser client and preview surfaces | Material user surface and authority-boundary concern. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | UI/architecture boundary changes | Initial inventory |
| `MAT-DDM-012` | `VP-12` | Authentication and MFA | Material identity/security boundary. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Organization identity constraints supplied | Initial inventory |
| `MAT-DDM-013` | `VP-13` | ERP/MRP and file-based exchange | Material downstream integration capability. | `NOT APPLICABLE` — included although deferred from Core v0 | `PUBLIC-2026-08-26` | Principal Product Author | Concrete internal consumer named | Initial inventory |
| `MAT-DDM-014` | `VP-14` | Server components, internal interfaces and reporting | Material topology/API evidence and implementation-copy risk. | `NOT APPLICABLE` — included | `PUBLIC-2026-08-26` | Principal Product Author | Supported external-contract need supplied | Initial inventory |
| `MAT-DDM-015` | `VP-15` | Replication and multisite operation | Material availability and distributed-consistency capability. | `NOT APPLICABLE` — included although deferred from Core v0 | `PUBLIC-2026-08-26` | Principal Product Author | Approved multisite need/topology supplied | Initial inventory |
| `MAT-DDM-016` | `VP-16` | Maintenance, backup, recovery and purge | Material operational, retention and recoverability capability. | `NOT APPLICABLE` — included; Core v0 only takes the bounded recovery obligation | `PUBLIC-2026-08-26` | Principal Product Author | Retention/operations requirements supplied | Initial inventory |

## 3. Behavioral Coverage Register

Evidence shorthand:

- `REF`: [DDM vendor-public baseline](../../../knowledge/ddm-vendor-public-baseline.md).
- `LESSONS`: [accepted IDEA design lessons](../../../knowledge/idea-design-lessons.md).
- `VER/LIFE`: [Aras version and lifecycle research](../../../../research/2026-08-27-aras-innovator-version-lifecycle-model.md).
- `CONFLICT`: [Aras Checkout/Check-in conflict research](../../../../research/2026-08-29-aras-checkout-checkin-conflict-model.md) and [DDM conflict research](../../../../research/2026-08-31-ddm-checkout-checkin-conflict-model.md).
- `WF`: [workflow and approval policy research](../../../../research/2026-08-27-ddm-first-workflow-approval-policy.md).
- `CONFIG`: [Aras configuration-governance research](../../../../research/2026-08-27-aras-configuration-governance.md).
- `STRUCT/RET`: [PLM retention and structure-release research](../../../../research/2026-08-27-plm-retention-and-structure-release-patterns.md).
- `AUTH`: [authentication build-versus-provider research](../../../../research/2026-08-27-authentication-build-vs-provider.md).

For every row, target version/edition/configuration is `PUBLIC-2026-08-26 / target configuration
UNKNOWN`. Resolving that global gap is owned by the Product Decision Authority with the Principal
Product Author; the trigger is access to a lawful, exact target package/configuration before any
parity claim.

| Inventory / Coverage ID | Evidence and limitation | Proactive quality-benchmark comparison | Advantage / limitation and stakeholder risk | Disposition | Owner / rationale | IDEA trace / increment | Verification / result |
|---|---|---|---|---|---|---|---|
| `MAT-DDM-001` / `COV-DDM-001` | `REF VP-01`; published compatibility is not the target topology or installed edition. | `UNKNOWN`: no approved IDEA deployment constraints or comparable operational baseline. | A support matrix aids planning, but copying its Windows/SQL choices could pre-empt Tech without need evidence. | `UNKNOWN` | Product Decision Authority; obtain network, hosting, client, support and data constraints before Tech. | TECH-001; DOC-05/06 | Environment qualification `NOT-RUN` |
| `MAT-DDM-002` / `COV-DDM-002` | `REF VP-02`; public release history does not prove target runtime or feature completeness. | `UNKNOWN`: release-number comparison is not a behavioral quality comparison. | Useful for source dating only; creates overclaim risk if treated as parity. | `UNKNOWN` | Principal Product Author; pin exact source/target evidence before using a version claim. | GOV/CLR evidence only | Target audit `NOT-RUN` |
| `MAT-DDM-003` / `COV-DDM-003` | `REF VP-03`; marketed breadth does not prove implementation, entitlement or enforcement. | `LESSONS DL-023/DL-032`: one end-to-end Release Spine gives stronger early safety evidence than disconnected shallow feature demos. | Staging reduces breadth in Core v0 but exposes identity, conflict and release risk earlier. | `ADAPT` | Product Decision Authority; preserve all omitted areas in this register while prioritizing Core v0. | DOC-01/03; FEATURE-001; `IE-INC-FEATURE-001` | Feature decision `NOT-RUN` |
| `MAT-DDM-004` / `COV-DDM-004` | `REF VP-04`; Store/Load/File Version are visible, while adapter contract, atomicity and failure handling remain unknown. | `CONFLICT` plus IDEA quality scenarios: explicit Workspace Manifest, expected Generation, atomic Check-in and preserved local work are stronger safety controls. | Keeps the familiar objective but replaces ambiguous save/publication semantics; deeper tool behavior still needs evidence. | `ADAPT-ARAS` | Principal Product Author; implement Store Existing first and New on the same identity model. | `BN-002`…`BN-004`; `BS-001`…`BS-004`; Core v0 safe-workspace slice | Spec/VVP `NOT-RUN` |
| `MAT-DDM-005` / `COV-DDM-005` | `REF VP-05`; public material distinguishes Issue/Revision and File Version but leaves reset/no-op/immutability rules open. | `VER/LIFE`: stable configuration identity, version chain and configurable lifecycle reinforce separation. IDEA uses Business Revision, one Version within Revision and an immutable Generation ID. | Clearer identity/history reduces ambiguity, but exact business revision scheme remains configurable and unapproved. | `ADAPT-ARAS` | Principal Product Author; preserve the three distinct concepts and require policy-version evidence. | `BN-001`; `BR-001`…`BR-003`; controlled-identity slice | Model/invariant tests `NOT-RUN` |
| `MAT-DDM-006` / `COV-DDM-006` | `REF VP-06`; public Reserve/Reference flows do not establish owner key, lease, crash or stale protocol. | `CONFLICT`: mature lock/check-out patterns inform explicit ownership; IDEA strengthens with per-document owner/workspace entitlement, expected Generation and safe local recovery. | Prevents silent overwrite and hidden cascade; lease duration/renewal and recovery authority still require Spec/Tech. | `ADAPT-ARAS` | Principal Product Author; use explicit Checkout/Reference language and server-enforced Check-in conditions. | `BN-002`…`BN-004`; `BR-004`…`BR-010`; safe-workspace slice | Two-user/two-workspace suite `NOT-RUN` |
| `MAT-DDM-007` / `COV-DDM-007` | `REF VP-07`; structure/BOM is visible, while occurrence identity and exact snapshot behavior remain unknown. | `STRUCT/RET`: explicit collectors, eligibility rules and exact baselines are stronger than an implicit cascade or dynamic latest. | Exact snapshots support reproduction; collector breadth and required/excluded dependency rules still need Spec. | `ADAPT` | Principal Product Author; require preview/confirmation and exact immutable Structure Snapshot. | `BN-005`, `BN-007`; `BR-011`, `BR-014`, `BR-015`; engineering-release slice | Structure/release tests `NOT-RUN` |
| `MAT-DDM-008` / `COV-DDM-008` | `REF VP-08`; search/saved-search UI is evidenced, while visibility, ACL, indexing and performance remain unknown. | `UNKNOWN`: no approved search benchmark, corpus or internal discovery need. | Valuable long term, but early implementation could distract from authoritative identity/release; basic find/browse remains necessary. | `DEFER` | Product Decision Authority; define corpus, permissions and measurable search need after safe publish. | DOC-07 deferred scope; later discovery increment | Search benchmark `NOT-RUN` |
| `MAT-DDM-009` / `COV-DDM-009` | `REF VP-09`; workflow/decisions are visible, while definition versioning, quorum, races and transactionality remain unknown. | `WF` and `CONFIG`: separate reusable definition from instance; IDEA pins exact definition/policy version and prevents later edits from reinterpreting retained decisions. | Safer audit/release semantics; Core v0 seeds one configurable release flow and defers the full graphical designer/ECR-ECO breadth. | `ADAPT-ARAS` | Principal Product Author; specify independent-approver default and fail-closed eligibility. | `BN-005`, `BN-006`; `BR-012`…`BR-015`; engineering-release slice | Workflow/approval suite `NOT-RUN` |
| `MAT-DDM-010` / `COV-DDM-010` | `REF VP-10`; admin surfaces are evidenced, but ACL precedence, schema migration and numbering concurrency remain unknown. | `CONFIG`: configuration-as-data and package promotion are useful; IDEA strengthens material policies with stable identity, immutable activated versions and historical pins. | Flexible company configuration without hard-coded roles; activation, migration and rollback controls require detailed design. | `ADAPT-ARAS` | Principal Product Author; distinguish harmless preferences from governed policy definitions. | `BN-006`, `BN-008`, `BN-009`; `BR-016`…`BR-019`; Spec/Tech | Policy replacement/history tests `NOT-RUN` |
| `MAT-DDM-011` / `COV-DDM-011` | `REF VP-11`; browser/preview surfaces do not prove renderer, authorization or backend authority. | IDEA architecture quality benchmark: Web/Desktop are interaction surfaces; server/resource owners retain authority and format workers remain isolated. | Supports multiple surfaces without duplicating business authority; preview safety and parity still need format-specific evidence. | `ADAPT` | Principal Product Author; preserve one authoritative contract across Web, Desktop, transfer and preview. | DOC-05/06/08; TECH-001 | Cross-surface authorization/behavior `NOT-RUN` |
| `MAT-DDM-012` / `COV-DDM-012` | `REF VP-12`; public domain-auth/MFA claims leave provider, token, session and service-auth semantics unknown. | `AUTH` benchmark remains reference evidence, not an implementation mandate. IDEA uses maintained native-account mechanisms first and keeps product authorization separate; company login is future integration per TECH-CTX-003/004. | Uses maintained credential mechanisms without waiting for company identity integration; account administration, revocation and recovery still need explicit requirements and security evidence. | `ADAPT` | Product Decision Authority; evaluate native-account candidate and security policy; later provider integration requires protocol/linking evidence. | `BN-006`, `BN-011`; `BR-016`…`BR-018`, `BR-025`…`BR-028`; REQ-IAM-*; TECH-001 | Authentication/authorization matrices `NOT-RUN` |
| `MAT-DDM-013` / `COV-DDM-013` | `REF VP-13`; ERP/MRP/file exchange is visible, while contract, retry, idempotency and failure audit remain unknown. | `UNKNOWN`: no approved internal consumer, authoritative data direction or contract benchmark. | Premature integration risks duplicate or ambiguous authority. | `DEFER` | Product Decision Authority; name consumer, owner, data contract and recovery need before inclusion. | DOC-07 deferred scope; future DOC-06 increment | Contract/consumer evidence `NOT-RUN` |
| `MAT-DDM-014` / `COV-DDM-014` | `REF VP-14`; named internal components/WCF/reporting do not establish a supported public API or business authority. | IDEA architecture benchmark: stable external contracts are separate from internal module interfaces and direct database reporting. | Excluding implementation copying protects clean-room design and authority boundaries; a supported external API remains a later need. | `EXCLUDE` | Principal Product Author; exclude internal component/schema copying, defer only the supported external-contract capability. | Architecture boundary; CLR; future DOC-06 if consumer exists | Boundary review `NOT-RUN` |
| `MAT-DDM-015` / `COV-DDM-015` | `REF VP-15`; replication/multisite claims do not prove ordering, consistency, failover or partition recovery. | `UNKNOWN`: no approved multisite topology, conflict model, lag target or external benchmark for IDEA. | Could support distributed sites, but adds major consistency/operations risk before a demonstrated need. | `DEFER` | Product Decision Authority/Operations authority `UNKNOWN`; activate only with an approved site/topology/recovery requirement. | DOC-07 deferred scope; future distributed-operations increment | Multisite qualification `NOT-RUN` |
| `MAT-DDM-016` / `COV-DDM-016` | `REF VP-16`; maintenance/purge UI does not establish backup completeness, safe purge, legal hold, RPO/RTO or restore correctness. | `STRUCT/RET`: mature PLM patterns protect versions/baselines and expose purge conflicts; IDEA adds reversible Trash and digest-reference safety as future policy, while Core v0 requires bounded exact restore evidence. | Recovery proof is essential to Core v0; automated purge/operations breadth is unsafe before retention and authority are known. | `ADAPT-ARAS` | Principal Product Author; include exact release reproduction/restore, defer purge suite until policy and operational evidence exist. | `BN-007`; `BS-007`; Core v0 recovery plus later operations increment | Restore drill `NOT-RUN`; purge `DEFER` |

## 4. Governance decisions and open gaps

| Decision / gap ID | Statement | Authority / evidence | Impacted baseline | Owner and resolution trigger | Status |
|---|---|---|---|---|---|
| `COV-DEC-001` | The coverage denominator is exactly `VP-01`…`VP-16` at the 2026-08-26 vendor-public baseline. | Stakeholder decision and admitted REF baseline | `IE-COV-DDM-PUBLIC-2026-08-26-001` | Principal Product Author; change only through CHG when a successor baseline is requested | `DRAFT DECISION` |
| `COV-DEC-002` | Core v0 prioritizes one complete Release Spine; deferred rows remain long-term trace. | DOC-01/03/07 and `LESSONS DL-023/DL-032` | Feature baseline | Product Decision Authority; decide through FEATURE-001 | `NOT-RUN` |
| `COV-GAP-001` | Exact target product version, edition, modules, configuration and lawful audit scope are unknown. | Public sources cannot establish installed target behavior. | All `COV-DDM-*` rows | Product Decision Authority; obtain and freeze exact target evidence before parity claim | `BLOCKED` |
| `COV-GAP-002` | Deployment, release-version, search, integration and multisite rows lack an applicable proactive benchmark/internal context. | Rows 001/002/008/013/015 | Feature/Tech and later increments | Principal Product Author; commission bounded comparison when the capability is activated | `UNKNOWN` |
| `COV-GAP-003` | Named reviewer and Product Decision Authority attribution are absent. | Project role decision only | Register and FEATURE-001 | Product Decision Authority; record identities and exact review decision before `Proposed/Approved` | `BLOCKED` |
| `COV-GAP-004` | No coverage behavior has been verified against an IDEA implementation. | No production implementation exists. | All rows | Future Verification Authority; execute after approved Spec/Tech and implementation | `NOT-RUN` |

## 5. Completeness and review readiness

| Check | Expected | Current result |
|---|---|---|
| Closed inventory count | 16 material rows (`MAT-DDM-001`…`MAT-DDM-016`) | 16 recorded |
| Coverage count | One row per inventory ID (`COV-DDM-001`…`COV-DDM-016`) | 16 recorded |
| Silent omission | Zero inventory rows without a disposition | Zero |
| Target parity evidence | Exact target version/configuration plus executed comparison | `BLOCKED`; no parity claim |
| Feature decision | Product Decision Authority disposition on exact source manifest | `NOT-RUN` |
| Independent/specialist review | Attributable competence and independence where applicable | `BLOCKED` until assigned |

An administrative count does not prove that a disposition is correct. The Feature decision may accept
scope and deferral while comparisons, target-package evidence and later verification remain visibly
open.

## 6. Typed trace and rendition controls

| Link type | Target and purpose | Result |
|---|---|---|
| `SOURCE-EVIDENCE` | REF plus linked research records, each retaining its edition/configuration limits | Linked at the fixed public baseline |
| `SOURCE-DECISION` | DOC-01/03 scope and Product Decision Authority Feature disposition | Draft sources linked; boss decision `NOT-RUN` |
| `DOWNSTREAM` | FEATURE-001, DOC-04/05/06/08 requirements/design and DOC-07 increments | Feature path and Core Drafts linked; review/decisions remain `NOT-RUN` |
| `CHANGE` | CHG record and successor inventory when denominator/evidence/disposition materially changes | [IE-CHG-TECH-001](CHG-2026-09-03-tech-context-and-proposal.md); native-account disposition changed without changing the public denominator |
| `VERIFICATION` | VVP/VEV result per activated IDEA behavior | All `NOT-RUN` |
| `RENDITION` | Source-pinned DOCX/PDF identity, version, baseline and stale status | No rendition generated |

## Contract references

- [GOV class template](../../../definition/registers/GOV-governance-and-standards.md)
- [Supporting-record catalogue](../../../definition/registers/README.md)
- [Coverage and evidence contract](../../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package contract](../../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Project domain language](../../../../../CONTEXT.md)
