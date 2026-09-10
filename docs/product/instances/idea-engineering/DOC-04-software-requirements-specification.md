# IDEA Engineering Core v0 Software Requirements Specification

> **Instance state**: controlled `Draft 0.11`. This SRS translates the proposed Core v0 Feature
> baseline into testable product obligations. It does not select a technology stack, authorize
> implementation or record a Product Decision Authority approval.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Document ID | `IE-PROD-SREQ-001` |
| Document Class | `DOC-04` |
| Title | IDEA Engineering Core v0 Software Requirements Specification |
| Owner | `Principal Product Author`; named person attribution is `BLOCKED` before `Proposed` |
| Document Status | `Draft` |
| Document Version | `0.11` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; Feature input `FEATURE-001@0.12` is `STALE` and its decision remains `NOT-RUN` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity not recorded |
| Reviewers | Project user performs internal document review; required independent requirements, security, HCD and operations qualification remains `BLOCKED` until assigned |
| Approvers | Product Decision Authority for Spec; identity, decision and date are `UNKNOWN` |
| Source Links | [DOC-01](DOC-01-product-vision-and-scope.md), [DOC-03](DOC-03-business-requirements.md), [FEATURE-001](decision-briefs/FEATURE-001-feature-definition-and-scope.md), [domain language](../../../../CONTEXT.md), [architecture input](../../../architecture/idea-product-lifecycle-architecture.md) |
| Downstream Links | [DOC-05](DOC-05-architecture-description.md), [DOC-06](DOC-06-data-integration-and-migration-specification.md), [DOC-07](DOC-07-mvp-roadmap-and-delivery-plan.md), [DOC-08](DOC-08-ui-ux-and-interaction-specification.md), [VVP](registers/VVP-core-v0-verification-validation-plan.md), [SPEC-001](decision-briefs/SPEC-001-product-specification.md) |
| Evidence / Claim Status | Requirements are `Draft`; verification results are `NOT-RUN`; Feature decision is `NOT-RUN` |
| Change History | 0.11: establish DOC-04 as the sole normative product SRS, add the requirement-writing/conformance contract and owned open-decision register, and clarify the accepted separation of Account Administration, Business Group membership, PDM Administration, Workflow Roles and Access Policy; 74 requirement IDs retained and no product permission is added. 0.10: reconcile current Feature and VVP pins; [IE-CHG-SOURCE-RECON-001](registers/CHG-2026-09-09-cross-document-reconciliation.md). 0.9 kept departmental deliverables inside existing document/structure/evidence behavior while treating hours, cost, purchasing, manufacturing and project values as non-authoritative reference data; 74 requirement IDs retained. 0.8 clarified BOM/file boundaries and added REQ-STR-004…006. 0.7 separated item identity from folder/path. 0.6 separated Identity from product authorization. 0.5 clarified configurable workflows. 0.4 clarified CAD Representation. 0.3 resolved Version semantics. 0.2 added REQ-IAM-001…007. |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the requirements baseline; exact organizational period is `UNKNOWN`, owned by Product Decision Authority and reviewed before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with seven explicit open decisions and qualification gaps |

<!-- AUTHOR CONTENT START -->

## 1. Requirements baseline and scope

| Baseline field | Recorded value |
|---|---|
| Requirements baseline | `IE-SPEC-CORE-V0-001`, Draft 0.11 |
| In-scope capability | `FTR-001`…`FTR-014`: controlled intake, identity/version, Workspace, Checkout/Reference, Check-in/conflict recovery, Product Structure, review/approval, Release Package, configurable policy/audit, native IDEA accounts/admin, formats and `en`/`vi`/`ja` UI |
| Out-of-scope or deferred capability | Advanced/saved search administration, full graphical Workflow Designer, ERP/MRP/general external integration, timekeeping, cost calculation, purchasing, manufacturing execution, project schedule management, Multi-site Replication, automated Purge suite, full ECR/ECO, bulk legacy migration and additional deep CAD profiles |
| Governing DOC-03 decision | `BN-001`…`BN-011`, `BS-001`…`BS-010`, `BR-001`…`BR-029` in DOC-03@0.6; all remain Draft pending Feature decision |
| First approval gate | `PG2`; cannot run before the Product Decision Authority records the Feature decision |

Requirements use `Must`, `Should before rollout`, or `Deferred`. All ledger entries below are Draft.
A material change preserves the old ID/version through CHG; IDs are never reassigned to a different
meaning. This SRS follows the project's tailored ISO/IEC/IEEE 29148:2018 profile recorded in the
[standards register](../../../governance/standards-register.md).

## 2. Requirement record contract

DOC-04 is the only normative product-requirement source. FEATURE-001, SPEC-001, prototypes, DOC-06,
DOC-08 and the VVP may explain, refine or verify a requirement, but cannot create or alter an
obligation without a controlled change to the applicable `REQ-*` row.

Each ledger row shall meet the following contract before it can be proposed for approval:

1. The `REQ-*` identity is unique and stable.
2. The Obligation states one independently verifiable behavior, invariant or atomic outcome using
   `shall`. Several conditions may remain in one row only when separating them would destroy that
   atomic outcome; otherwise the row must be split through a controlled change.
3. Source/rationale identifies the business need, rule, risk or approved decision that justifies the
   obligation. A competitor observation by itself is not sufficient.
4. Acceptance and verification define observable evidence and a failure case. They do not silently
   add product behavior.
5. Priority/status exposes unresolved values as `UNKNOWN` or `BLOCKED`; a placeholder is never
   treated as an approved threshold.
6. Trace links the obligation to Feature scope and its owning design/evidence artifacts. Exact test
   cases, datasets and configurations are owned by the VVP.

Normative terms have their ordinary requirements meaning: `shall` is mandatory; `shall not` is a
prohibition; `may` expresses a permitted option; explanatory text and examples are non-normative
unless referenced by a `REQ-*` obligation. Domain terms such as Logical Document, Generation,
Business Group and Workflow Role use the controlled definitions in [CONTEXT.md](../../../../CONTEXT.md).

### 2.1 Identity, intake and version requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-ID-001` | The system shall assign every Logical Document one stable `DocumentId` that is not derived from file name, path, Business Number, Revision or Generation and does not change across later versions. | `BN-001`, `BR-001` | Rename, move, Check-in and Create Revision retain the same `DocumentId`; verify by lifecycle scenario and persisted-identity comparison. | `Must / Draft` | `FTR-002`; DOC-06 identity model |
| `REQ-ID-002` | The system shall represent Business Revision, Version within Revision and immutable Generation as distinct concepts. Version shall begin at `1` in each Revision, increment exactly once for a changed Check-in that creates a Generation, remain unchanged for No Change and reset to `1` for a new Revision. The system shall not store or display a separate Version Sequence with the same meaning. | `BN-001`, `BR-002`, `BR-003` | State/model, Audit and UI tests cover initial Check-in, changed Check-in, No Change and Create Revision; each shows the expected Revision, Version and Generation with no Version Sequence field. | `Must / Draft` | `FTR-002`; DOC-06; DOC-08 |
| `REQ-ID-003` | A newly registered Logical Document may begin in `Start` with no Generation or Working Head and shall not be eligible for review, Reference as released data or Release until its first successful publish. | `BS-001`, `BS-002`; architecture invariant | Negative lifecycle tests refuse ineligible actions; no empty Generation exists. | `Must / Draft` | `FTR-001`, `FTR-002`; `BS-001/002` |
| `REQ-ID-004` | The first successful Check-in shall atomically create Revision `A`, Version `1`, its initial immutable Generation and Working Head under the seeded policy; failure shall expose none of them as a valid published baseline. | `BR-002`, accepted seeded policy | Fault injection before commit yields no partial baseline; success yields one complete manifest. | `Must / Draft` | `FTR-001`, `FTR-002`; DOC-06 |
| `REQ-ID-005` | `Store Existing` shall inspect metadata, path/name and content digest for duplicate candidates, show them before confirmation and never silently merge Logical Document identities. | `BN-001`, `BS-001` | Dataset containing same-name, same-path and same-digest cases produces warnings and an explicit create/link/cancel outcome; verify by scenario tests. | `Must / Draft` | `FTR-001`; DOC-06 migration section |
| `REQ-ID-006` | `New` and `Store Existing` shall create the same Logical Document/Generation model and follow the same access, audit, lifecycle and release rules. | `BS-001`, `BS-002` | Contract tests compare both intake paths after first publish; no intake-specific identity model exists. | `Must / Draft` | `FTR-001`; DOC-06 |
| `REQ-ID-007` | The system shall identify Document Folders and Document Placements independently of physical Artifact and Workspace paths. Moving a placement or adding/removing a link shall not create or change a Logical Document, Business Revision, Version or Generation; a historical placement link shall pin its selected Revision and Generation. | `BN-001`, `BR-001`; confirmed item/folder direction | Move/link/unlink tests preserve `DocumentId` and history, create no duplicate Artifact/Generation and keep an exact historical link stable after the Working Head advances. | `Must / Draft` | `FTR-002`; DOC-06/08; `IF-01…03` |
| `REQ-ID-008` | Rename shall retain the Logical Document's `DocumentId`. A navigation-only alias change shall be audited without creating a Generation; a controlled Product Definition name/title change shall publish only through Checkout/Check-in and shall create a Generation under the normal changed-content rules. | `BN-001`, `BR-001`; confirmed Rename distinction | Alias and controlled-name cases retain one `DocumentId`; only the controlled change increments Version/Generation, while prior history remains resolvable. | `Must / Draft` | `FTR-002`; DOC-06/08; `IF-04/05` |
| `REQ-ID-009` | `Create Copy`/`Save-As` shall create a new Logical Document with a new `DocumentId`, record the exact source relationship and actor, and shall not inherit a source Reservation, Approval Decision or Released state implicitly. | `BN-001`; confirmed Copy distinction | Copy from In Work and Released sources leaves each source unchanged, creates one new identity with provenance and no inherited edit/approval/release authority. | `Must / Draft` | `FTR-001`, `FTR-002`; DOC-06/08; `IF-06` |

### 2.2 Workspace, Checkout, Reference and Check-in requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-WS-001` | Before materialization, the system shall show the requested root and known related documents and require the user to confirm an exact per-document `Checkout` or `Reference` scope; no hidden parent/child cascade is allowed. | `BN-002`, `BR-004`, `BR-005` | Scope walkthrough and contract test show every document/mode; changing scope requires reconfirmation. | `Must / Draft` | `FTR-003`; DOC-08 journey `UX-JRN-002` |
| `REQ-WS-002` | Checkout shall create one Reservation per Logical Document bound to Organization, actor, Workspace, expected Generation and configurable lease information. | `BN-002`, `BR-004` | Two-actor/two-workspace tests show no inherited or implicitly reusable Reservation. | `Must / Draft` | `FTR-003`; DOC-06 relationship `DATA-REL-006` |
| `REQ-WS-003` | Reference shall materialize one exact Generation without publish entitlement and shall remain visibly distinguishable from Checkout. | `BN-002`, `BR-005` | Reference file opens; publish attempt is refused; UI and Workspace Manifest show `Reference`. | `Must / Draft` | `FTR-003`, `FTR-004`; DOC-08 |
| `REQ-WS-004` | The Managed Workspace shall materialize the exact Generation and verify its digest before reporting it ready; external files shall open through the approved operating-system application association. | `BN-002`, `BR-020` | A digest mismatch prevents Ready/Open and produces recovery guidance; process observation shows no IDEA code loaded inside the design tool. | `Must / Draft` | `FTR-004`, `FTR-013`; DOC-06/08 |
| `REQ-WS-005` | Before Check-in, the system shall perform a full file scan and report at least `Unchanged`, `Modified under Checkout`, `Modified without Checkout`, `Missing`, `Out of date` and `Unresolved` states in user-facing language. | `BS-004`, `BR-009` | Canonical dataset produces each state and a correct permitted next action; verify by state-table tests and walkthrough. | `Must / Draft` | `FTR-005`, `FTR-006`; DOC-08 |
| `REQ-WS-006` | The user shall confirm the exact Check-in scope before publication; unreserved changed dependencies shall be excluded or block the operation according to approved policy and shall never be silently published. | `BR-006`, `BR-007`, `BR-010` | Modified-without-Checkout scenario cannot publish that item; scope change requires reconfirmation. | `Must / Draft` | `FTR-005`, `FTR-006` |
| `REQ-WS-007` | A confirmed multi-document Check-in shall be atomic: all valid changed entries publish in one Change Set or none publish. | `BN-003`, `BR-007` | Fault injection on every item and transaction step yields either one complete Change Set or no new public Generation. | `Must / Draft` | `FTR-005`; quality scenario `QRS-002` |
| `REQ-WS-008` | Semantic equality with the current Working Head shall return `No Change`, create no Generation, record the outcome and end Checkout for the confirmed scope. | `BN-003`, `BR-008` | Unchanged artifact, normalized metadata and structure produce no Generation/Version increment and no remaining Reservation in scope. | `Must / Draft` | `FTR-005` |
| `REQ-WS-009` | A successful changed Check-in shall create exactly one Generation per changed Logical Document, update the Working Head and end Checkout for the confirmed scope only. | `BN-003`, `BR-008` | State-transition and manifest tests show one increment, exact Change Set membership and no remaining in-scope Reservation. | `Must / Draft` | `FTR-005`; DOC-06 |
| `REQ-WS-010` | Check-in shall reject stale expected Generation, non-owner, wrong-Workspace, expired/ineligible Reservation, unauthorized or invalid-scope requests without changing authoritative Product Definition or deleting/overwriting local work. | `BN-004`, `BR-006`, `BR-009` | Negative suite accepts zero invalid publishes; before/after digests show every rejected local candidate remains available. | `Must / Draft` | `FTR-006`; quality scenario `QRS-003` |
| `REQ-WS-011` | A conflict response shall identify the affected document, permitted owner information, expected/current Generation, whether local work remains safe, and the valid refresh/reapply, Save As, retry or governed recovery actions. | `BN-004`, `BR-009`, `BR-010` | Each conflict class satisfies the response checklist; no action claims binary auto-merge. | `Must / Draft` | `FTR-006`; DOC-08 conflict panel |
| `REQ-WS-012` | Retrying a terminal or in-progress Check-in with the same `OperationId` shall return/resume the same logical operation and shall not create duplicate Generations or Change Sets. | `BR-006`, reliability requirement | Repeated and interrupted calls with one OperationId create at most one terminal result. | `Must / Draft` | `FTR-005`; DOC-05 reliability design |
| `REQ-WS-013` | Reservation lease duration, renewal and recovery rules shall be configurable; recovery shall require authorization, reason and Audit and shall never bypass expected-Generation validation. | `BR-004`, `BR-009`; threshold not yet set | Policy tests exercise configured expiry/renew/recovery; exact duration remains `UNKNOWN` until pilot workload evidence. | `Must / Draft`; duration `BLOCKED` | `FTR-003`, `FTR-006`; `BREQ-GAP-005` |

### 2.3 Product Structure, review and Release requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-STR-001` | Every published Product Structure shall create an immutable Structure Snapshot containing stable occurrence/dependency identities and exact Generation pins needed for reproduction. | `BN-005`, `BN-007`, `BR-011` | Snapshot resolution returns the same members/digests after Working Heads advance. | `Must / Draft` | `FTR-007`; DOC-06 relationships |
| `REQ-STR-002` | A later child Generation or Revision shall not mutate an earlier parent Structure Snapshot or Release Record; adopting it requires an explicit new parent change and review. | `BR-011`, `BR-015` | Advance child, resolve old parent, then create new parent baseline; old result remains identical. | `Must / Draft` | `FTR-007`, `FTR-009` |
| `REQ-STR-003` | Required unresolved, missing, unauthorized or externally controlled dependencies shall remain visible and block Release unless an authorized, exact and time-bounded Release Exception exists. | `BS-006`, `BR-014` | Negative release tests refuse each unresolved class; exception records exact dependency, owner, reason, risk, evidence, approver and review condition. | `Must / Draft` | `FTR-007`, `FTR-009` |
| `REQ-STR-004` | A BOM shall be a governed query/view of one exact Structure Snapshot under one identified, versioned BOM View Profile. It shall preserve occurrence identity, exact component Generation, quantity, position and applicable profile-defined fields; an Excel, PDF or CSV file shall not become Product Structure authority merely by being stored. | `BN-005`, `BR-011`; confirmed BOM/structure boundary | Resolve two named profiles over one snapshot and the same profile after child Working Heads advance; each result retains the pinned occurrence/component data, while storing an unrelated spreadsheet creates no authoritative BOM rows. | `Must / Draft` | `FTR-007`; DOC-05/06/08; `BM-01` |
| `REQ-STR-005` | A BOM Representation shall pin the exact Structure Snapshot and BOM View Profile versions, output digest and producer provenance. When its source/profile advances it shall remain historical and be identified as `Needs update`. If a parts list is an independent controlled Logical Document instead, its exact Generation and relationship to the Structure Snapshot shall be explicit; neither path may resolve a floating latest source. | `BN-007`, `BS-007`; exact-release and derived-data safety | Export Excel/PDF, advance structure/profile, and reconcile an independent parts-list document: prior output remains reproducible, becomes `Needs update`, and Release pins the exact selected snapshot plus representation/document Generation. | `Must / Draft` | `FTR-007`, `FTR-010`; `REQ-LC-008`; DOC-06/08; `BM-02/03/06` |
| `REQ-STR-006` | An uploaded Excel/CSV or structured BOM payload shall remain a non-authoritative BOM Import Candidate until schema/reference validation, an exact base-snapshot check, a visible add/change/remove preview and explicit user confirmation succeed. Acceptance shall atomically create the resulting Structure Snapshot and owning Generation or change neither. | `BR-011`; import and partial-update risk | Valid candidate produces the previewed snapshot/Generation once; malformed, unresolved, unauthorized, stale-base and fault-injected candidates leave the prior authoritative structure unchanged with an attributable result. | `Must / Draft` | `FTR-007`; DOC-05/06/08; `BM-04/05` |
| `REQ-LC-001` | The system shall retain multiple versioned Workflow Definitions, allow one active default version to be assigned per Document Class, and pin the exact selected definition and Approval Policy versions when creating each Workflow Instance. Activating a later version shall not reinterpret a running instance or retained history. | `BN-005`, `BN-006`, `BR-012` | Configure two workflows for different Document Classes, start instances, activate a later version and prove each instance/history resolves under its pinned version without owner-module code changes. | `Must / Draft` | `FTR-008`, `FTR-011` |
| `REQ-LC-002` | Submit for review shall pin one exact Generation and complete review scope; later content change shall invalidate the pending review rather than inherit prior decisions. | `BR-012`, `BR-015` | Content change after submission blocks decision/release until Withdraw or Reject returns the item to In Work and it is resubmitted. | `Must / Draft` | `FTR-008` |
| `REQ-LC-003` | The seeded Approval Policy shall require one eligible independent approver; author/editor cannot approve or release the affected Revision, while the independent approver may release it. Required decision count, eligible role/group and decision rule shall be versioned configuration rather than hard-coded behavior. | `BR-013` | Role/separation tests refuse self-approval and accept the configured independent path; a valid alternative policy activates without code change and does not alter an existing instance. | `Must / Draft` | `FTR-008`, `FTR-009` |
| `REQ-LC-004` | Approval and rejection shall record actor, time, exact Generation/scope, policy version and decision reason; rejection reason is mandatory and retained. | `BN-005`, `BR-013` | Evidence ledger contains all fields; missing reason or eligibility refuses the decision. | `Must / Draft` | `FTR-008`, `FTR-011` |
| `REQ-LC-005` | If every required eligible actor cannot be resolved, or a Workflow Definition lacks a required transition, assignment or decision rule, activation or the affected submission, approval or Release shall fail closed and identify the missing role/rule without weakening policy. | `BR-013` | Missing-approver and invalid-definition scenarios produce a blocked result and no implicit assignment, skipped transition or decision. | `Must / Draft` | `FTR-008`, `FTR-009` |
| `REQ-LC-006` | Release shall show and require confirmation of one exact scope and shall revalidate every required Generation, Structure Snapshot, approval, access and exception at commit. | `BN-005`, `BN-007`, `BR-014` | Scope-preview test matches committed membership; any stale/ineligible item rejects the entire confirmed scope. | `Must / Draft` | `FTR-009`; DOC-08 journey `UX-JRN-005` |
| `REQ-LC-007` | A successful Release shall atomically record applicable lifecycle transitions and one immutable Release Record; it shall never silently cascade through an unconfirmed dependency tree. | `BR-014`, `BR-015` | Fault injection yields either no Release Record or one complete record with exact pins. | `Must / Draft` | `FTR-009`; quality scenario `QRS-004` |
| `REQ-LC-008` | The system shall create a Controlled Release Package containing the Release Record manifest, governed metadata, exact Structure Snapshot, selected BOM View Profile and required BOM Representation or independently controlled parts-list Generation, applicable Artifacts, digests and provenance. | `BN-007`, `BS-007` | Package-to-record reconciliation is complete; every retained Generation and representation digest matches, and no BOM member/output is resolved from a floating latest source. | `Must / Draft` | `FTR-010`; `REQ-STR-004/005`; DOC-06 export |
| `REQ-LC-009` | Create Revision shall preserve the released Revision and Release Record, create the next Revision with a new Workflow Instance and Version 1 baseline, and may reuse immutable content by digest without sharing mutable state. | `BR-002`, lifecycle rule | Lifecycle test proves predecessor immutability, successor identity and exact reused digest. | `Must / Draft` | `FTR-002`, `FTR-008`, `FTR-009` |

### 2.4 Policy, authorization, metadata and Audit requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-GOV-001` | Every authoritative identity, policy, configuration, state and Audit record shall belong to exactly one Organization; cross-Organization access/resolution shall fail closed. | `BN-006`, security boundary | Isolation tests attempt every resource path across two Organizations and accept zero cross-scope results. | `Must / Draft` | `FTR-011`; DOC-05/06 |
| `REQ-GOV-002` | For every protected product operation, the system shall evaluate the active versioned Access Policy from the eligible Actor, effective Business Group membership or approved direct exception, resource class/scope/state and requested action, then have the authoritative resource owner enforce and explain the result. Authentication claims and Workflow Role names alone do not grant product authority. Ordinary authority uses governed Business Groups; a direct Actor grant is an explicit scoped, justified, time-bounded and audited exception. | `BN-006`, `BN-011`, `BR-016`, `BR-017`; accepted authorization/data boundary | Add/remove a person from a Business Group without changing code or individual documents; run one cross-path authorization matrix through each resource owner. Refuse an ineligible account, incomplete direct grant, role-name-only claim and direct-store attempt. | `Must / Draft` | `FTR-011`; DOC-05 interfaces; AC-01…05 |
| `REQ-GOV-003` | Metadata schema, classification, validation and numbering rules shall have stable versioned definitions; governed values shall identify the exact definition used. A configured field or stored document value for hours, cost, purchasing/fabrication status, progress or completion shall remain Operational Reference Data unless a separately approved capability and authority contract says otherwise. Its presence alone shall not calculate a value, record an external business transaction or advance Workflow/Release. | `BN-006`, `BR-018`, `BR-029`; departmental-output scope decision | Activate a later schema/policy and retain the prior interpretation; store representative operational values and a related document, then prove they remain queryable context without creating a purchase/cost result, manufacturing/project completion or lifecycle transition. Migration is explicit. | `Must / Draft` | `FTR-012`; DOC-06; `DH-01…04` |
| `REQ-GOV-004` | Business Number allocation shall be unique within its configured scope, idempotent for retry and distinct from `DocumentId`; cancellation/gap behavior shall be policy-controlled. | `BN-006`, metadata/numbering risk | Concurrent allocation and retry tests produce no duplicate and one stable result per operation. | `Must / Draft` | `FTR-012`; DOC-06 |
| `REQ-GOV-005` | Material policy changes shall create a new definition version and affect only permitted future operations/instances unless an authorized, previewed and audited migration succeeds. Candidate imports shall be schema- and meaning-validated, compared with the active version and refused without changing authority when invalid, stale or unauthorized. | `BR-018`, `BS-008`; policy-import safety | Activate a valid new policy and retain the predecessor; old workflows/releases resolve unchanged. Invalid/stale/unauthorized import or migration is refused and the active policy remains identical. | `Must / Draft` | `FTR-008`, `FTR-011`, `FTR-012`; AC-01…05 |
| `REQ-AUD-001` | Check-in, conflict/recovery, authorization, workflow, approval, Release, export and destructive outcomes shall append attributable Audit Evidence with actor, time, correlation/operation identity, target, source/policy pins and result. | `BN-005`…`BN-007`, `BR-022` | Evidence completeness reconciliation reaches 100% for the approved scenario set; missing evidence fails the applicable gate. | `Must / Draft` | `FTR-011`; VVP |
| `REQ-AUD-002` | Audit Evidence shall be append-only in the product model and shall not be editable or deletable through ordinary administration. | `BR-022` | Mutation/deletion attempts are denied and themselves audited; retention/cryptographic erasure remains separately governed. | `Must / Draft` | `FTR-011`; DOC-05/06 |

### 2.5 Format and external-application requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-FMT-001` | Every enabled format shall satisfy the Generic Controlled-File Baseline: controlled identity, immutable content/digest, open through allowed OS association, change detection, access, audit and recovery. | `BN-008`, `BR-019`, `BR-020` | One conformance suite passes for each exact enabled extension/application version; unsupported capability is not inferred. | `Must / Draft` | `FTR-013`; DOC-06 capability matrix |
| `REQ-FMT-002` | Each deeper format behavior shall be declared in a versioned Format Capability Profile as `None`, `Manual`, `Application-assisted`, `Parser` or approved standalone-converter capability, with exact application, Adapter and tool provenance plus declared execution prerequisites. | `BN-008`, `BR-019`; confirmed product direction | Capability query and evidence match the exact configured application/Adapter/tool path; no semantic output or automatic conversion is accepted when it was not declared and qualified. | `Must / Draft` | `FTR-013`; DOC-06 |
| `REQ-FMT-003` | Core v0 shall use IRONCAD as the first deep CAD profile while permitting later profiles through the same interface without changing Logical Document, Generation, Reservation or Release semantics. | Feature direction | IRONCAD profile tests run against an exact version; a test adapter demonstrates the same interface without owner-module changes. | `Must / Draft`; exact version `BLOCKED` | `FTR-013`; DOC-02/05/06 |
| `REQ-FMT-004` | Core v0 shall not require IDEA code to execute inside Office or CAD. Parse/preview/conversion shall run through an isolated external Adapter/worker that may invoke a qualified export interface of the installed application or an approved standalone converter. Any future in-application add-in is a separate governed capability. Processing failure shall preserve the original Artifact and authoritative product state. | `BR-020`; product boundary; bounded CAD-conversion decision | Inspect the configured execution path and force application/export/converter timeout and failure: no undeclared in-process component is required, and the original digest and authoritative state remain unchanged. | `Must / Draft` | `FTR-004`, `FTR-013`; DOC-05 |
| `REQ-FMT-005` | Preview and neutral representations shall be non-authoritative derivatives tied to one exact source Generation, source Artifact digest and producer application/Adapter/tool versions. A representation is `Current` only for that source Generation; otherwise it is `Needs update` and shall not be presented as current. Manual upload and automatic generation shall use the same identity/provenance rules. Release shall block for a missing, failed or mismatched representation only when the applicable versioned Release Policy makes that representation required; otherwise it shall warn without changing the source. | `BN-008`; derived-data safety; confirmed product direction | Generate and manually upload representations for an exact Generation, then advance the source, fail regeneration and exercise required/optional policy: provenance remains traceable, old output becomes `Needs update`, required mismatch blocks Release, optional mismatch warns, and the source Artifact remains authoritative. | `Must / Draft` | `FTR-013`; DOC-06; VVP-008 |

### 2.6 Interaction, accessibility and localization requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-UX-001` | Web, Desktop and Web-rendered Desktop shall use the same product terms and state meanings for identity, Checkout, Check-in, review and Release. | `BN-009`, `BR-021` | Cross-surface scenario matrix shows no semantic difference; verify through contract and walkthrough. | `Must / Draft` | `FTR-014`; DOC-08 |
| `REQ-UX-002` | Every selected item view shall show the current state, current edit entitlement, next permitted action and reason when an action is unavailable. | Prototype decisions; actionable conflict need | Canonical states each expose one understandable next action or blocking reason; user walkthrough result retained. | `Must / Draft` | `FTR-003`…`FTR-009`; DOC-08 |
| `REQ-UX-003` | At the canonical desktop viewport of 1440×900, the selected item's identity, main command, next action and overview shall be usable without page-level vertical scrolling; long same-type collections may scroll within their own panel. | Accepted UI direction | Browser viewport capture and task walkthrough meet the rule; production minimum viewport remains subject to environment validation. | `Must / Draft` for canonical demo | `FTR-014`; DOC-08 |
| `REQ-UX-004` | Detailed files, relationships, Audit and other long secondary content shall open in a modal/drawer or dedicated same-type view rather than expanding unrelated page sections. | Accepted UI direction | Long-data scenarios preserve the main workspace position and focus returns to the invoking control. | `Must / Draft` | `FTR-007`, `FTR-011`; DOC-08 |
| `REQ-UX-005` | Document families shall use distinguishable icons with accessible text labels; color shall not be the only carrier of type, state, readiness or error. | Prototype review; accessibility intent | Icon/state recognition walkthrough plus automated/manual semantic inspection. | `Must / Draft` | `FTR-013`, `FTR-014`; DOC-08 |
| `REQ-UX-006` | All interactive functions shall be keyboard reachable with visible focus, meaningful accessible names and focus management for dialogs/drawers; errors shall identify the field/action and recovery. | HCD/accessibility direction | Keyboard-only and assistive-technology procedures on each applicable surface; specialist result `NOT-RUN`. | `Should before rollout / Draft`; reviewer `BLOCKED` | `FTR-014`; DOC-08/VVP |
| `REQ-LOC-001` | Product-controlled UI resources shall support `en`, `vi` and `ja`; locale preference shall persist per user and English shall be the fallback for a missing resource. | `BN-009`, `BR-021` | All nine locale/surface cells execute the same task suite and fallback scenario. | `Must / Draft` | `FTR-014`; locale matrix |
| `REQ-LOC-002` | Product identities, policy/action/state codes and authorization meaning shall be locale-neutral; changing locale shall not change behavior or authority. | `BR-021` | Repeat the same commands under all locales and compare persisted codes/results. | `Must / Draft` | `FTR-014`; DOC-06/08 |
| `REQ-LOC-003` | User-authored Unicode shall be preserved without automatic translation; Japanese input shall cover IME composition, normalization, width, font fallback, line breaking and search round-trip. | `BN-009`, `BR-021` | Round-trip fixture comparison and reviewed display/input scenarios for each applicable cell. | `Must / Draft`; language review `BLOCKED` | `FTR-014`; DOC-08/VVP |

### 2.7 Security, operations and recovery requirements

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-SEC-001` | Web, Desktop, Workspace and format-processing packages/configuration shall contain no database credential or permanent object-storage credential. | Least privilege; architecture quality input | Package/configuration scan and direct-store denial tests find zero such credentials/access paths. | `Must / Draft` | `FTR-011`; DOC-05 |
| `REQ-SEC-002` | Artifact transfer shall use authenticated, scoped and short-lived authorization limited to the permitted object/operation; exact duration is a Tech policy value. | Least privilege | Expired, wrong-object and replay attempts are denied and audited. | `Must / Draft` | `FTR-004`, `FTR-011`; DOC-05/06 |
| `REQ-SEC-003` | Desktop-to-Workspace communication shall be authenticated and protected per user session; another local user/session shall not command or read it. | Workspace isolation | Cross-user/session tests accept zero unauthorized operations. | `Must / Draft` | `FTR-004`, `FTR-011`; DOC-05 |
| `REQ-SEC-004` | Untrusted format processing shall be isolated with input/output scope and configurable time, memory, CPU and output limits; failure shall not modify source content or product state. | File-processing risk | Malformed/oversized fixture tests terminate within configured limits and preserve source digest/state. | `Must / Draft`; thresholds `UNKNOWN` | `FTR-013`; DOC-05/06 |
| `REQ-OPS-001` | Staging uploads and unreferenced private candidates shall remain invisible to authoritative reads and be reconciled after expiry or interruption. | Atomic publish/recovery | Crash/fault scenarios expose no candidate as a Generation; reconciliation records its outcome. | `Must / Draft` | `FTR-005`; DOC-05/06 |
| `REQ-OPS-002` | Notifications and projections shall be produced only from committed outcomes and shall not determine whether Check-in, Approval or Release succeeded. | Reliability/authority separation | Faulted notification/projection delivery cannot roll back or fabricate the authoritative result; replay repairs it. | `Must / Draft` | `FTR-008`, `FTR-011`; DOC-05 |
| `REQ-OPS-003` | Backup scope shall include metadata, Artifacts, Product Structure, active policy/configuration and required cryptographic material at one consistent recovery point. | `BN-007`, `BS-007` | Backup manifest accounts for every in-scope object/class; completion alone is not a restore PASS. | `Must / Draft` | `FTR-010`; DOC-06/VVP |
| `REQ-OPS-004` | A restore drill shall resolve and digest-check every retained Generation in the approved baseline and report every missing, corrupt or mismatched item; only an exact result may pass. | `BN-007`, `BS-007` | Canonical restore comparison has zero unresolved/mismatched items for PASS. | `Must / Draft` | `FTR-010`; `MSM-001`, `MSM-005` |
| `REQ-OPS-005` | Capacity, latency, availability, RPO and RTO shall be measured against an approved workload/environment before operational rollout; no production threshold is inferred from the prototype. | `BREQ-GAP-005` | Requirement cannot become `Approved` for rollout until owner, workload, percentile/threshold and evidence method are recorded. | `Must before rollout / BLOCKED` | DOC-07; owner Operations authority `UNKNOWN` |

### 2.8 Native accounts and administration

Source: confirmed TECH-CTX-003/004 and DOC-03@0.6 BN-011/BS-009/BR-017/BR-025…028. These seven
obligations are Draft proposals under existing FTR-011, not an approved stack choice. Other/company
login is deferred; secure policy values and eligible security review remain prerequisites for live
use.

| Requirement ID | Obligation | Source / rationale | Acceptance and verification | Priority / status | Trace |
|---|---|---|---|---|---|
| `REQ-IAM-001` | The system shall support native IDEA-account sign-in and sign-out without a company identity provider; protected operations require an active account and eligible session. | BN-011; BR-025 | Provision an account and use the allowed Web/Desktop flows with no company provider; incorrect credentials and signed-out sessions cannot perform protected operations. | `Must / Draft` | `FTR-011`; DOC-06/08; `VVP-015` |
| `REQ-IAM-002` | Within a delegated Administration Scope, only an explicitly authorized Account Administrator shall manage Actors, IDEA Accounts, Login Identities, Business Groups and explicit Business Group Membership; open self-registration is unavailable. | BN-011; BR-017/026; TECH-CTX-004 | Authorized create/update/suspend and membership changes succeed with attributable Audit. Unauthenticated, ordinary-user and out-of-scope administration, including direct API calls, is refused. Creating or activating an account without a membership grants no product access. | `Must / Draft` | `FTR-011`; DOC-05/06/08; `VVP-015` |
| `REQ-IAM-003` | Account activation, password change and administrator-assisted reset shall protect credentials, use one-use expiring setup/reset proof and retain an attributable outcome without exposing an existing password. | BS-009; BR-027 | Expired/reused/wrong-account proof fails; no existing password is retrievable through administration or logs; change/reset revokes affected prior sessions as specified by REQ-IAM-004. Delivery channel, policy and token duration require security approval before live use. | `Must / Draft` | `FTR-011`; DOC-06/08; `VVP-015` |
| `REQ-IAM-004` | After suspension or session revocation commits, the system shall refuse subsequent protected requests made with affected prior sessions, including previously issued cookies/tokens; commands shall revalidate eligibility before commit. Session loss shall preserve local candidates and retained Actor history. | BS-009; BR-027; REQ-GOV-002 | Test old cookie/token, Check-in/Release races and transfer/resume after revocation; new requests fail, in-flight work follows declared revalidation/cancellation checkpoints, no invalid command commits and no local candidate is deleted. Re-enabling requires a fresh eligible session. | `Must / Draft` | `FTR-011`; DOC-06/08; `VVP-015` |
| `REQ-IAM-005` | Account-administration permission shall authorize only the account, group and membership operations inside its delegated scope; it shall not authorize Access Policy or Workflow definition/activation, controlled-document access, Approval, Release or Audit alteration. | BR-017/026; existing BR-013/016 | An Account Administrator can complete REQ-IAM-002 tasks but is refused PDM-policy changes, content access and product decisions unless a separate active Access Policy independently grants the exact action. Reset abuse remains a security-review scenario, not proof of immunity to impersonation. | `Must / Draft` | `FTR-011`; DOC-05/06/08; `VVP-015` |
| `REQ-IAM-006` | The system shall retain stable organization-scoped Actor/account identities independently of mutable login names or authentication methods; suspension/rename shall not rewrite retained ownership, Approval or Audit. Any later login linking shall require explicit verified association, never name/email equality alone. | BR-028; TECH-CTX-003 | Rename/suspend an account and resolve previous records to the same Actor; duplicate identifiers cannot silently merge actors. Future provider linking is deferred and must preserve this contract when introduced. | `Must / Draft` | `FTR-011`; DOC-06/08; `VVP-015` |
| `REQ-IAM-007` | Initial account administration shall be established through a controlled one-time bootstrap of a named administrator, without shared hard-coded credentials or a reusable public setup path. Removal of the last effective account-recovery path shall require an authorized replacement or governed recovery arrangement. | BR-028; Bootstrap Custodian boundary | After bootstrap, repeating setup cannot create privileges; removal of the last recovery-capable administrator without replacement is refused and audited. Account bootstrap does not bypass Access Policy adoption or grant document/approval permissions. | `Must / Draft` | `FTR-011`; DOC-06/08; `VVP-015` |

## 3. Requirement-domain coverage

| Domain | Requirement coverage | Current disposition |
|---|---|---|
| Functional | `REQ-ID-*`, `REQ-WS-*`, `REQ-STR-*`, `REQ-LC-*`, `REQ-IAM-*` | Complete Draft set; execution `NOT-RUN` |
| Interface | `REQ-WS-004`, `REQ-FMT-004`, `REQ-UX-001`, `REQ-SEC-002/003` | Detailed interface realization belongs to DOC-05/06 |
| Data | `REQ-ID-*`, `REQ-STR-*`, `REQ-GOV-003/004`, `REQ-AUD-*` | Data ownership/details in DOC-06 |
| Quality | `REQ-WS-007/010/012`, `REQ-LC-007/008`, `REQ-OPS-*`, quality scenarios below | Performance/operations thresholds partially `BLOCKED` |
| Security and privacy | `REQ-GOV-001/002`, `REQ-AUD-*`, `REQ-SEC-*`, `REQ-IAM-*` | Security reviewer and organization policy `BLOCKED` |
| Operational/support | `REQ-OPS-*`, Reservation/format recovery requirements | Deployment/support owner `UNKNOWN` |
| Accessibility/human factors | `REQ-UX-*` | HCD/accessibility specialist evidence `BLOCKED` |
| Localization | `REQ-LOC-*` and nine-cell matrix | Vietnamese/Japanese review evidence `BLOCKED` |

## 4. Quality, security and recovery scenarios

| Scenario ID | Stimulus / condition | Expected response / metric | Failure and recovery response | Verification configuration | Status |
|---|---|---|---|---|---|
| `QRS-001` Exact version semantics | Changed or unchanged Product Definition is Check-in. | Changed: exactly one new Generation/Version; unchanged: none. Published Generations never mutate. | Failure exposes no partial Generation and preserves prior Working Head/local work. | Canonical identity/change fixtures | `NOT-RUN` |
| `QRS-002` Atomic multi-document publish | Failure is injected at each staging, validation, materialization and transaction step. | Exactly one complete Change Set or no public change. | Same OperationId resumes/returns same result; reconciliation removes private candidates. | Multi-document canonical scope | `NOT-RUN` |
| `QRS-003` Conflict safety | Stale head, wrong owner, wrong Workspace, expired lease or modified Reference attempts publication. | Zero invalid publish accepted; conflict response contains required context/actions. | Every local candidate remains recoverable with matching pre/post digest. | Two actors, two Workspaces, binary fixtures | `NOT-RUN` |
| `QRS-004` Controlled Release | Scope contains stale, unauthorized, unresolved, missing-approval or excluded-required entry. | Zero invalid Release accepted; valid scope creates exactly one immutable Release Record. | Whole scope remains unreleased and shows blocking entries. | Canonical Release Spine | `NOT-RUN` |
| `QRS-005` Organization isolation | Actor in Organization A attempts each access path to B. | Zero cross-Organization reads/commands/transfer/preview/export results. | Denial is explainable and audited without leaking restricted details. | Two-Organization security matrix | `NOT-RUN` |
| `QRS-006` Exact restore | Restore one approved release/recovery point. | Every identity, structure link and Artifact digest matches; zero unresolved items for PASS. | Mismatch is visible and result remains FAIL/BLOCKED. | Approved backup/restore environment | `NOT-RUN` |
| `QRS-007` Localized interaction | Same task runs in `en`, `vi`, `ja` on each applicable surface. | Same command/state/authority result; text fits and user Unicode round-trips. | Missing resource uses English fallback and is logged for correction. | Nine locale/surface cells | `NOT-RUN` |
| `QRS-008` Untrusted format input | Malformed, oversized or slow input is processed. | Worker respects configured resource/output limits and returns bounded failure. | Original Artifact and product state remain unchanged; event is audited. | Isolated exact adapter/tool environment | `NOT-RUN`; thresholds `UNKNOWN` |
| `QRS-009` Account eligibility | Provision, activate, recover, rename or suspend an account; replay an affected old session. | Correct account-only authority; zero invalid protected requests after revocation commit; retained Actor/history unchanged. | Refuse safely, preserve local candidates and require fresh eligible login/recovery. | Account/session and product-permission matrix, including concurrency and transfer checkpoints | `NOT-RUN` |
| `QRS-010` Item identity under organization changes | Move/link/unlink/Rename/Create Copy operations are executed before and after later Generations exist. | Zero unintended identity replacement, duplicate Generation, inherited Approval/Release or path-derived lookup; exact historical links remain exact. | Failed operations leave the prior document, placement and source/copy relationships consistent and auditable. | Canonical folder/divider, alias, controlled-name and copy fixtures | `NOT-RUN` |

### 4.1 Confirmed context and preliminary recovery objectives

TECH-CTX-001…008 supplies Windows clients, approximately 50–100 total intended users at one site,
native accounts first, temporary user-held bootstrap/possible operations during development and an
uncertain hundreds-of-MB-to-GB related-document estimate. Normal Account Administration belongs to
named System Management personnel. These are not concurrent-load, maximum-file or capacity
requirements. Exact measurements and supported versions remain open.

For severe server failure requiring backup restoration, evaluate RTO ≤ four working hours and RPO ≤
one hour. Both are user-confirmed planning objectives, not a validated SLA or a waiver of ordinary
Check-in durability. REQ-OPS-005 remains BLOCKED for rollout until the workload, recovery scope,
business calendar/start clock, owner, thresholds and measurement method are approved and tested.
The usable recovery point must cover database, Artifacts, configuration and keys together; restore
session/account-security state must be reconciled before reopening access. VVP-013/014 owns the
measurement procedure; no performance or restore result is asserted here.

## 5. Locale and source-language requirements

The controlled requirement source and field vocabulary are English. Product UI supports nine
locale/surface cells; availability of a cell is a requirement, while linguistic and assistive review
remain separate evidence.

| Cell ID | Locale | Surface | Resource catalogue / fallback | Review status | Persisted preference | Unicode / Japanese scenarios | Parity evidence / status |
|---|---|---|---|---|---|---|---|
| `en-desktop` | `en` | Desktop | Versioned catalogue / English | English source review required | Required | Unicode round-trip | `NOT-RUN` |
| `en-web` | `en` | Web | Versioned catalogue / English | English source review required | Required | Unicode round-trip | `NOT-RUN` |
| `en-web-rendered-desktop` | `en` | Web-rendered Desktop | Versioned catalogue / English | English source review required | Required | Unicode round-trip | `NOT-RUN` |
| `vi-desktop` | `vi` | Desktop | Versioned catalogue / English | Vietnamese reviewer `BLOCKED` | Required | Vietnamese/Unicode round-trip | `NOT-RUN` |
| `vi-web` | `vi` | Web | Versioned catalogue / English | Vietnamese reviewer `BLOCKED` | Required | Vietnamese/Unicode round-trip | `NOT-RUN` |
| `vi-web-rendered-desktop` | `vi` | Web-rendered Desktop | Versioned catalogue / English | Vietnamese reviewer `BLOCKED` | Required | Vietnamese/Unicode round-trip | `NOT-RUN` |
| `ja-desktop` | `ja` | Desktop | Versioned catalogue / English | Japanese reviewer `BLOCKED` | Required | IME, normalization, width, search, font fallback, line breaking | `NOT-RUN` |
| `ja-web` | `ja` | Web | Versioned catalogue / English | Japanese reviewer `BLOCKED` | Required | IME, normalization, width, search, font fallback, line breaking | `NOT-RUN` |
| `ja-web-rendered-desktop` | `ja` | Web-rendered Desktop | Versioned catalogue / English | Japanese reviewer `BLOCKED` | Required | IME, normalization, width, search, font fallback, line breaking | `NOT-RUN` |

## 6. Requirement quality and open-decision control

### 6.1 Requirement quality review

The following is a source-quality check, not product verification and not approval. It makes the
remaining work visible instead of presenting a long ledger as automatically complete.

| Quality check | Method / criterion | Current result | Required disposition |
|---|---|---|---|
| Identity and completeness | Parse ledger rows; require unique `REQ-*` ID plus obligation, source/rationale, acceptance/verification, priority/status and trace columns. | `STRUCTURAL PASS`: 74 rows, 74 unique IDs, no malformed ledger row found on 10-09-2026. | Rerun after every material SRS edit. |
| Normative statement | Each row contains at least one `shall`/`shall not` obligation under the contract in section 2. | `STRUCTURAL PASS`: all 74 rows contain normative wording. | Requirements reviewer confirms meaning, not only syntax. |
| Atomicity | A row should express one independently verifiable behavior or one inseparable atomic outcome. A simple multiple-`shall` scan is a review heuristic, not a defect verdict. | `REVIEW REQUIRED`: 37 rows contain more than one `shall`; many represent one transaction/invariant, but no qualified reviewer has confirmed every grouping. | At PG2, split any independently changeable/testable clause while preserving stable predecessor trace. |
| Source sufficiency | Each obligation is justified by a business need/rule, accepted IDEA decision or approved risk/control. Competitor observation alone is insufficient. | Source fields are populated; formal source challenge and Feature approval are `NOT-RUN`. | Requirements reviewer and Product Decision Authority confirm or reject the cited basis. |
| Measurability and open values | Numeric/environment/policy values needed for acceptance are approved or explicitly `UNKNOWN`/`BLOCKED`. | `BLOCKED`: workload/capacity, lease and transfer limits, format/tool versions, security policy, supported environment and representative-review inputs remain open. | Resolve the applicable `SPEC-OPEN-02…08` item or retain an owner and gate trigger; do not invent a value. |
| Verification trace | Every approved obligation has a current VVP procedure/configuration and later a result tied to the exact baseline. | `STALE / NOT-RUN`: VVP@0.11 predates this source clarification; no product test result exists. | Refresh VVP without changing the obligation, then execute only after the applicable gate. |

Accordingly, DOC-04@0.11 is a stronger controlled Draft, but it is **not yet ready to be called an
Approved Spec**. The blockers above are part of the Spec, not footnotes that may be ignored.

### 6.2 Open-decision register

`SPEC-OPEN-01` is resolved for this Draft: Version is the user-facing sequence inside a Business
Revision, while Generation identifies the exact immutable system snapshot. The resolution and its
predecessor evidence are retained in
[IE-CHG-VERSION-001](registers/CHG-2026-09-04-version-model-clarification.md). The following seven
items remain open; recording an owner and deadline does not count as resolving them.

| Open ID | Decision or evidence still required | Affected requirements | Preparation / decision authority | Must be resolved by | Status |
|---|---|---|---|---|---|
| `SPEC-OPEN-02` | Define the Core v0 find/browse contract: searchable fields, scope, permission-filtered results, ordering/paging and measurable acceptance. Advanced or saved search must not enter scope implicitly. | Discovery behavior used by `REQ-UX-002/003`; a new stable REQ ID is required if the accepted behavior creates an independent obligation. | Principal Product Author prepares from real tasks; project user reviews; Product Decision Authority decides scope. | Before Spec approval for find/browse. | `OPEN` |
| `SPEC-OPEN-03` | Approve seeded business configuration: Document Classes, required metadata, equality/normalization, numbering, Business Groups, Workflow Roles, Access Policy, Workflow/Approval definitions, Reservation lease/renewal/recovery and related defaults. | `REQ-ID-004`; `REQ-WS-008/013`; `REQ-LC-001/003/005`; `REQ-GOV-002…005`; `REQ-IAM-002/005` | Principal Product Author and applicable PDM/Account administrators prepare their separate parts; Product Decision Authority decides the business configuration. | Before approving or accepting a requirement whose expected result depends on the seeded values. | `OPEN` |
| `SPEC-OPEN-04` | Pin the enabled format list, exact Office/IRONCAD versions, IRONCAD automatic path, sample corpus, licensing, host prerequisites, size/resource limits and expected fidelity. Automatic and manual Representation paths already share the same source-Generation contract. | `REQ-FMT-001…005`; `REQ-SEC-004` | Principal Product Author and design/format specialist prepare; Product Decision Authority decides supported scope. | Before claiming support for a format or executing `VVP-008`. | `PARTIALLY CLARIFIED` |
| `SPEC-OPEN-05` | Supply a measurable workload and operating profile: concurrent use, file/repository size and growth, latency/availability targets, worker/transfer limits, recovery clock and support coverage. The current 50–100 users, MB-to-GB working sets and RTO/RPO values are planning inputs only. | `REQ-OPS-003…005`; `REQ-SEC-002/004`; `REQ-WS-013` | Operations owner and Principal Product Author prepare; Product Decision Authority approves the applicable service targets. | Before operational rollout or any performance/recovery PASS claim. | `PARTIALLY CLARIFIED` |
| `SPEC-OPEN-06` | Pin the supported Windows, browser, CAD/Office, display/IME, network and server environment plus password, MFA if required, session and recovery-channel policy. Native IDEA login is initial scope; company login remains deferred. | `REQ-IAM-001/003/004/007`; `REQ-LOC-*`; `REQ-UX-003/006`; `REQ-SEC-*` | Principal Product Author works with System Management/Technical Support and a security reviewer; Product Decision Authority decides Spec/Tech aspects in scope. | Before real-account/data testing and final support commitment. | `PARTIALLY CLARIFIED` |
| `SPEC-OPEN-07` | Assign the representative project/users and the eligible independent approver, plus competent reviewers for requirements, architecture, security, data, format, HCD/accessibility, language and operations where the gate requires them. | Acceptance evidence for all requirement families; especially `REQ-LC-*`, `REQ-UX-*`, `REQ-LOC-*`, `REQ-IAM-*` | Product Decision Authority assigns or delegates named participants; self-review remains identified as non-independent. | Before the affected PG2/PG3 review or representative acceptance claim. | `OPEN / BLOCKED` |
| `SPEC-OPEN-08` | Approve access classification, retention/Audit periods, hold and disposal rules, coordinated backup set and custody/recovery of required cryptographic material. | `REQ-GOV-001/002`; `REQ-AUD-*`; `REQ-OPS-003/004`; `REQ-IAM-003/004` | Security, Quality and Operations authorities prepare; company authority/Product Decision Authority approves the applicable policy. | Before related policy approval, live retention/disposal or backup/restore acceptance. | `OPEN` |

The detailed Spec brief may summarize these items for management, but DOC-04 owns their IDs,
meaning, status and requirement impact. A later brief cannot close or change an item without a
controlled DOC-04 revision and CHG trace.

## 7. Standards applicability and trace

| Standard/policy source | Exact edition/source | Classification | Applicability | Tailoring rationale | Evidence expectation | Owner / review trigger |
|---|---|---|---|---|---|---|
| Requirements engineering | ISO/IEC/IEEE 29148:2018 | `STANDARD` | `TAILOR` | Use stable obligations, source, rationale, acceptance and verification trace for this internal product. | Requirement-ledger review and change trace | Requirements reviewer `BLOCKED`; before PG2 |
| Quality model | ISO/IEC 25010:2023 and ISO/IEC 25030:2019 | `STANDARD` | `TAILOR` | Select quality characteristics and measurable requirements justified by Core v0. | Quality scenarios and VVP evidence | Quality reviewer `BLOCKED`; before PG2/PG3 |
| Human-centred design | ISO 9241-210:2019, ISO 9241-11:2018, ISO 9241-110:2020 | `STANDARD-GUIDED` | `TAILOR` | Apply context/task/usability and interaction principles to the three surface profiles. | DOC-08 rationale and task evaluation | HCD reviewer `BLOCKED`; before PG3 |
| Accessibility | ISO 9241-171:2025; WCAG 2.2 for applicable Web/rendered regions; WAI-ARIA 1.2 only when native semantics are insufficient | `STANDARD-GUIDED` / conditional | `BLOCKED` | Exact applicability, lawful source and specialist review are not complete. | Manual keyboard/assistive evidence by surface | Accessibility reviewer `BLOCKED`; before claim |
| Security controls | ISO/IEC 27002:2022 and ISO/IEC 27034-1:2011 + Cor 1:2014 | `STANDARD-GUIDED` | `TAILOR` | Select application controls by product risk; no certification claim. | Threat/risk trace and security tests | Security reviewer `BLOCKED`; before PG3/PG4 |
| Test process/documentation | ISO/IEC/IEEE 29119-1:2022, 29119-2:2021, 29119-3:2021, 29119-4:2021 | `STANDARD-GUIDED` | `TAILOR` | Use risk-based procedures and retained evidence for the exact baseline. | VVP/VEV records | Verification reviewer `BLOCKED`; before PG5 |
| Configuration management | ISO 10007:2017 | `STANDARD-GUIDED` | `TAILOR` | Control requirement, policy, data and release baselines through stable identities and change records. | CMP/CHG/REL evidence | Configuration authority `UNKNOWN`; before PG4 |
| Project convention | IDEA Engineering Constitution and CONTEXT.md | `PROJECT-CONVENTION` | `APPLY` | Repository terminology/evidence boundaries are mandatory and do not assert external conformity. | Consistency analysis | Product Decision Authority; on baseline change |

## 8. Baseline approval and change

| Gate / lifecycle item | Required evidence | Result |
|---|---|---|
| Feature prerequisite | Product Decision Authority decision on an updated Feature brief that pins DOC-03@0.6 and DOC-04@0.11 | `NOT-RUN`; `FEATURE-001@0.12` is stale and blocks Spec approval |
| PG2 requirements review | Complete ledger, source/rationale, acceptance, VVP and applicable independent/specialist review | `NOT-RUN` |
| Material change | CHG/Work Item with impact across DOC-03/05/06/07/08, risks, tests, operations and release | Prior decisions remain in their CHG records; [IE-CHG-SPEC-ARCH-QUALITY-001](registers/CHG-2026-09-10-spec-architecture-quality-baseline.md) records this SRS/architecture re-baseline and its predecessor sources |
| Supersession | Prior source and any rendition remain traceable and marked stale/superseded | DOC-04@0.1 retained in the CHG source archive; no previous approval inherited |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-03 needs/rules and an up-to-date Feature decision | All requirement families trace to Draft sources; `FEATURE-001@0.12` is stale and the Feature decision is `NOT-RUN` |
| `DOWNSTREAM` | DOC-05 architecture, DOC-06 data, DOC-07 increment and DOC-08 interaction | DOC-05/06/08 Drafts authored and linked; cross-document review `NOT-RUN` |
| `CHANGE` | CHG/Work Item with complete material impact | Prior decisions remain traceable; [IE-CHG-SPEC-ARCH-QUALITY-001](registers/CHG-2026-09-10-spec-architecture-quality-baseline.md) records this successor source and identifies the stale VVP |
| `VERIFICATION` | VVP procedure and future VEV result | `IE-VVP-CORE-001@0.11` authored; all results `NOT-RUN` |
| `RELEASE` | Future REL manifest, exact requirement version and approved claim boundary | `NOT APPLICABLE` to this Draft |
| `RENDITION` | Source-pinned DOCX/PDF identity/status | No rendition generated |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-04 class template](../../definition/DOC-04-software-requirements-specification.md)
- [Core document catalogue](../../definition/README.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Validation contract](../../../../specs/003-controlled-documentation/contracts/validation.md)
- [Project domain language](../../../../CONTEXT.md)
