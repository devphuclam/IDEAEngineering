# IDEA Engineering Product-Definition Instance Set

This directory contains the controlled working instances for the internal IDEA Engineering product.
The instruction-only class templates remain under [`docs/product/definition`](../../definition/README.md)
and are not edited as product content.

## Baseline

| Field | Value |
|---|---|
| Baseline ID | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Purpose | Analysis and design through `PG4`; no production implementation authorization |
| Product boundary | Internal IDEA Engineering `C1` product |
| Principal author | `Principal Product Author` — assistant prepares the documents; accountable attribution must be recorded before `Proposed` |
| Internal document reviewer | Project user; this assignment does not establish required independent/specialist qualification |
| Product decision authority | The boss, acting as `Product Decision Authority`, decides Feature, Spec and Tech |
| Editable authority | English Markdown source under version control |
| Boss-facing language | Vietnamese decision briefs, with common technical terms retained |
| Current Core source versions | DOC-01 at `Draft 0.6`; DOC-02 at `Draft 0.2`; DOC-03 at `Draft 0.7`; DOC-04 at `Draft 0.14`; DOC-05 at `Draft 0.21`; DOC-06 at `Draft 0.17`; DOC-07 at `Draft 0.12`; DOC-08 at `Draft 0.13`; GOV at `Draft 0.3`; VVP at `Draft 0.17`; CHG records at their catalogue versions |
| Product decision status | Feature, Spec and Tech `APPROVED` by the Product Decision Authority on 17-09-2026 against the exact management-review predecessor baseline recorded in [`IE-CHG-PDA-APPROVAL-001`](registers/CHG-2026-09-17-product-decision-authority-approval.md). The later multi-location Vault/control–data-plane successor Draft is internally selected but its exact PDA approval is `NOT-RUN`. |
| First approved version | Successor `Approved 1.0` management renditions are pending controlled publication; the approval decision itself is already pinned to the exact reviewed sources and hashes |

## Architecture diagram package

DOC-05@0.21 and DOC-06@0.17 contain the maintained architecture and data views, including the new
control-plane/data-plane and multi-location Vault semantics. The
[current Vault successor gallery](evidence/IE-VEV-VAULT-XFER-001/index.html) contains 40 maintained
controlled views and three Vietnamese Word figures, including new exact-read-failover and verified
replica sequences. Its source/render/open and focused author review are recorded in
[IE-VEV-VAULT-XFER-001](registers/VEV-2026-09-17-vault-transfer-diagram-review.md).
The [predecessor architecture gallery](evidence/IE-VEV-ARCH-CORR-005/index.html) provides historical SVG and PNG
renditions from the source hashes recorded by
[IE-VEV-ARCH-CORR-005](registers/VEV-2026-09-14-module-authority-view-legibility.md).
That predecessor changes only the presentation of `ARCH-VIEW-MOD-001`: a scoped C4 Component
Diagram replaces both the overlapping edge graph and the rejected responsibility-matrix draft while
preserving the same Module ownership and boundary rules. The prior [VEV-004](registers/VEV-2026-09-14-post-pull-architecture-view-correction.md),
[VEV-003](registers/VEV-2026-09-12-architecture-consistency-correction-003.md),
[VEV-002](registers/VEV-2026-09-12-architecture-consistency-correction-002.md) and
[VEV-001](registers/VEV-2026-09-12-architecture-consistency-correction.md) correction audits
remain historical records; VEV-003's claimed exact Markdown hashes do not reproduce from the
committed starting baseline and are not substituted for current source evidence. Seven earlier
expanded render packages are retained in the
[superseded-render archive](evidence/README.md#archived-render-packages), including the repair note
that distinguishes mechanically XML-repaired legacy files from their original historical render manifest. Rendering
does not establish runtime behavior or independently qualified architecture/HCD acceptance.

The separate [Core v0 technology view set](technology/IDEA-core-v0-technology-architecture-views.md)
contains eight focused views (`TECH-D01…D08`) for the selected Engineering stack, runtime/protocol,
deployment, dependencies, delivery pipeline and controlled reopen decisions. Its
[predecessor correction verification](registers/VEV-2026-09-15-technology-architecture-view-correction.md)
records 8/8 render and standalone-open checks plus focused TECH-D07/D08 review. The
[initial verification](registers/VEV-2026-09-15-technology-architecture-view-set.md) remains the
predecessor. Version 0.3 adds the multi-location Vault architecture; its current images are in the
combined Vault successor gallery above. These are Draft decision views, not a replacement for DOC-05 or proof that the system
has been implemented.

## December 2026 roadmap package

[DOC-07 section 3.2](DOC-07-mvp-roadmap-and-delivery-plan.md#32-december-2026-schedule-and-task-appendix)
retains the conditional 7 September–31 December 2026 plan: **56 tasks / 676 work hours +
80 contingency hours = 756 hours**, with 11 proposed Saturdays and external prerequisites still
to confirm. This schedule predates the multi-location Vault/Gateway successor and is **stale for
execution**. Successor task and hour re-estimation remains `NOT-RUN`; the retained figures are not
an updated delivery commitment.

- [Appendix A — task details, outputs, hours and dependencies](planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
- [Interactive Gantt — unchanged captured schedule view](planning/idea-roadmap-december-2026.html)
- [Change record — retained predecessor, source hashes and review limitations](registers/CHG-2026-09-05-roadmap-task-integration.md)

The appendix belongs to DOC-07, not a ninth Core Product Document or a competing Spec Kit execution
plan. The Gantt is a rendition of the same schedule, not a separate planning authority. This update
does not authorize coding or change any Feature/Spec/Tech decision or product-gate state.

FEATURE-001@0.12 refers to DOC-07@0.5 and the requirement source that was current when that brief
was written. It remains a stale working brief after the source re-baseline. The final management
review therefore pinned the current Core sources separately, and the Product Decision Authority
approved that exact baseline on 17-09-2026. Existing Word/Human copies remain the submitted
editorial versions and are not silently regenerated. Successor `Approved 1.0` renditions must cite
[`IE-CHG-PDA-APPROVAL-001`](registers/CHG-2026-09-17-product-decision-authority-approval.md).

## Document authority and reading model

The eight Core Product Documents are the controlled internal sources. They do not all carry the
same authority:

- `DOC-03` records the business needs and rules that justify product behavior.
- `DOC-04` is the **only normative Software Requirements Specification (SRS)** for IDEA Engineering.
  A product obligation is not created or changed by repeating it in a brief, prototype, roadmap or
  Spec Kit file.
- `DOC-05` is the **only normative architecture description** for the candidate design. ADRs record
  accepted architecture decisions; TECH-001 presents those decisions for management review.
- `DOC-06` and `DOC-08` refine the data/interface and interaction contracts. If either appears to
  add a product obligation, that obligation must first receive a stable `REQ-*` identity in DOC-04.
- DOC-01/02/07 and the registers provide scope, feasibility, planning and evidence control.

The Product Decision Authority is not expected to read all eight documents. Three Vietnamese briefs
present the Feature, Spec and Tech decisions and pin the exact controlled sources they summarize.
They are decision views, not parallel requirement or architecture sources.

| Boss-facing brief | Decision axis | Detailed source set | Current state |
|---|---|---|---|
| [`FEATURE-001`](decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Feature scope and priority | DOC-01, DOC-02, DOC-03, DOC-04, DOC-07 and governed reference coverage | Working brief `Draft 0.12` remains source-pin stale; the 14-group Feature decision is `APPROVED` against the exact 17-09 management-review baseline; `Approved 1.0` rendition pending |
| [`SPEC-001`](decision-briefs/SPEC-001-product-specification.md) | Required behavior and acceptance | DOC-04, requirement-bearing DOC-06/08 content, VVP | Working brief `Draft 0.14` remains stale; the Spec decision is `APPROVED` against normative DOC-04@0.13 with 87 requirement rows, not against the older 74-requirement summary; `Approved 1.0` rendition pending |
| [`TECH-001`](decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Architecture and technology selection | DOC-02, DOC-04/05/06/08, accepted ADRs, confirmed context, [`IE-KNW-TECH-DEC-001`](../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md), technology views and official sources | `Draft 0.15` is the successor working brief. The exact reviewed Tech baseline was `0.14` and is `APPROVED`; 0.15 keeps that Tech Stack but adds the multi-location Vault/control–data-plane architecture, whose exact PDA approval is `NOT-RUN`. Q-15 remains `PARTIAL / NO WINNER`, exact Format Worker and Artifact Gateway runtime/toolchain remain `NOT-RUN`, and PG3 remains `NOT-RUN`. |

A brief becomes `Stale` when a pinned source changes. A boss decision must identify the exact brief
and source baseline; the author then records its consequences in the affected Core Product
Documents.

The Spec Kit feature at [`specs/003-controlled-documentation`](../../../../specs/003-controlled-documentation/)
controls how this eight-document set is created, reviewed and maintained. It is a delivery artifact
for the documentation system, **not** the IDEA Engineering product SRS and not an additional source
of product behavior.

## Current context, review and retained versions

The user's Tech-context confirmation “Duyệt” on 2026-09-03 accepts the planning inputs recorded in
[IE-CHG-TECH-001](registers/CHG-2026-09-03-tech-context-and-proposal.md), not a stack or implementation
decision. The proposal now reflects Windows engineering PCs, approximately 50–100 intended users
at one site, administrator-issued IDEA accounts first, temporary user-held bootstrap capability
during development, normal Account Administration by named System Management personnel,
and possible user-led operations without an assumed DevOps team. Company login is a future method,
not an initial prerequisite. The design envelope now permits an individual multi-GB Artifact and a
future Project corpus of hundreds of TB, but real size distribution, growth, concurrency and initial
allocation remain unmeasured. RTO ≤4 working hours and RPO ≤1 hour are preliminary evaluation
objectives, not a tested SLA or rollout acceptance.

The project user previously accepted Feature 0.3 and Spec 0.4 in internal review:
[RVW-FEATURE-SPEC-20260903-001](decision-briefs/VERSION-HISTORY.md#5-ghi-nhận-review-nội-bộ-ngày-03-09-2026).
That result remains attached to those exact versions. It does not automatically apply to Feature
0.12, Spec 0.14 or Tech 0.14. The Version-model point was separately confirmed on 04-09-2026.
Those historical review results do not replace the later Product Decision Authority decision. The
current Feature, Spec and Tech axes were approved on 17-09-2026 against the exact baseline and
hashes recorded in
[`IE-CHG-PDA-APPROVAL-001`](registers/CHG-2026-09-17-product-decision-authority-approval.md).
The working briefs remain at their pre-decision versions until controlled `Approved 1.0`
renditions are published.

The [version history](decision-briefs/VERSION-HISTORY.md) records current identities, prior source
snapshots and review inputs. The 09-09 source hashes and predecessor set remain in
[IE-CHG-SOURCE-RECON-001](registers/CHG-2026-09-09-cross-document-reconciliation.md); the Tech 0.8
predecessor and 0.9 recommendation change are in
[IE-CHG-TECH-DEC-001](registers/CHG-2026-09-13-technology-decision-recommendation.md). The Linux-first
successor and DOC-05 candidate-row/DOC-07 routing change are in
[IE-CHG-TECH-LINUX-001](registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md). The
focused rationale/dependency correction is in
[IE-CHG-TECH-LINUX-002](registers/CHG-2026-09-13-linux-server-technology-rationale-refinement.md); earlier
archives, including [the pre-Tech-context set](history/2026-09-03-before-tech-context.zip), remain retained.
The historical six-candidate Client/UI re-evaluation and Flutter qualification challenger are recorded in
[IE-CHG-TECH-CLIENT-001](registers/CHG-2026-09-14-client-ui-stack-re-evaluation.md); the provisional
control, Q-08/Q-10 and FFI-first correction is in
[IE-CHG-TECH-CLIENT-002](registers/CHG-2026-09-14-client-ui-stack-review-correction.md).
The current Engineering baseline, exact Q-15 boundary and eight Client reopen triggers are in
[IE-CHG-TECH-BASELINE-001](registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md).
No retained historical brief was overwritten. Earlier Spec 0.3 acceptance remains withdrawn.

`SPEC-OPEN-01` is recorded as resolved: Versions within each Revision are numbered `1, 2, 3…`,
while Generation is the exact immutable snapshot; there is no additional Version Sequence field.
The seven records `SPEC-OPEN-02…08` remain open. A complete draft does not imply that these gaps,
product tests or gates have passed.

## Staged-release clarification — 7 September 2026

[SPEC-001 section 8.1](decision-briefs/SPEC-001-product-specification.md#81-phát-hành-cụm-bơm-trước-tủ-điện-tiếp-tục-thiết-kế)
now explains releasing the completed pump while the cabinet and whole-machine records remain
In Work. [VVP section 1.2](registers/VVP-core-v0-verification-validation-plan.md#12-staged-release-acceptance-detail)
owns six planned procedures under the existing VVP-005/006 objectives. They distinguish an unrelated
sibling from a required dependency, check commit-time eligibility and rollback, and reproduce the
original package after later edits. All results remain `NOT-RUN`.

The user confirmed the scenario direction and requested this documentation update. It created no
new FTR/REQ IDs and, at that update point, left DOC-04@0.3 and all other Core document contents unchanged. See
[IE-CHG-STAGED-RELEASE-001](registers/CHG-2026-09-07-staged-release-scenario.md) for the predecessor
archive and exact scope.

## CAD Representation clarification — 7 September 2026

[SPEC-001 section 8.2](decision-briefs/SPEC-001-product-specification.md#82-tạo-pdf-từ-cad-và-giữ-đúng-bản-nguồn)
and [VVP section 1.3](registers/VVP-core-v0-verification-validation-plan.md#13-cad-representation-acceptance-detail)
now define automatic and manual PDF/neutral-file paths through the same Representation boundary.
The output pins the exact source Generation and digest, records producer versions, becomes
`Needs update` after source advance, and affects Release only through a versioned policy.

Core v0 does not assume a universal CAD renderer or require an in-application add-in. The exact
IRONCAD version, export path, converter, license, execution host, corpus and limits remain part of
`SPEC-OPEN-04` and VVP-008 qualification. Public reference-product evidence and its limits are kept
in [IE-KNW-DDM-004](../../knowledge/2026-09-07-ddm-cad-neutral-representation-evidence.md). See
[IE-CHG-CAD-REP-001](registers/CHG-2026-09-07-cad-neutral-representation.md) for the accepted design
direction, predecessor archive and exact source impact.

## Workflow configuration clarification — 7 September 2026

[SPEC-001 section 8.3](decision-briefs/SPEC-001-product-specification.md#83-cấu-hình-workflow-mà-không-làm-sai-lịch-sử)
and [VVP section 1.4](registers/VVP-core-v0-verification-validation-plan.md#14-workflow-configuration-acceptance-detail)
now define multiple versioned workflows, one active default assignment per Document Class, pinned
runtime instances, the seeded `Start → In Work → Under Review → Released` path and fail-closed
handling for invalid configuration or missing roles.

Core v0 may use validated configuration data/forms; a graphical drag-and-drop designer remains
deferred. WF-01…06 are planned checks and remain `NOT-RUN`. See
[IE-CHG-WORKFLOW-001](registers/CHG-2026-09-07-workflow-configuration.md) for the accepted direction,
predecessor archive and exact source impact.

## Authorization and configuration-data clarification — 7–10 September 2026

[SPEC-001 section 8.4](decision-briefs/SPEC-001-product-specification.md#84-thay-đổi-quyền-mà-không-sửa-code)
records the earlier management explanation and is now stale. Current [VVP section 1.5](registers/VVP-core-v0-verification-validation-plan.md#15-project-access-rbac-and-governed-policy-acceptance-detail)
checks one RBAC model: Security Principal + Role Definition + Authorization Scope = Role Assignment.
Identity and Accounts establishes account/session eligibility, Project Governance owns Project and
direct Group membership, Access Policy evaluates applicable Role Assignments, and the owning Server
Module enforces its business gates.

Group assignment is the normal personnel path. A direct Actor Role Assignment is also supported,
visible and audited; it is not a second grant type. QLHT Account Administration creates/maintains
accounts only. Project and privileged-role administrators operate under separate constrained Role
Assignments.

Authorized forms/API can change policy without owner-module code edits. JSON is optional seed or
import/export transport and creates only a candidate; validation, preview and separate authorized
activation are required before authority changes. The earlier ASP.NET Core Identity proposal is
superseded for the current Server recommendation by Spring Security ordinary server-side sessions in
`TECH-001@0.14`; Spring Session JDBC is conditional rather than a default dependency;
PostgreSQL remains recommended. At the time of this clarification, neither proposal had Product
Decision Authority approval. The current Feature, Spec and Tech decision baseline is now approved
under [IE-CHG-PDA-APPROVAL-001](registers/CHG-2026-09-17-product-decision-authority-approval.md);
AC-01…05 remain `NOT-RUN`. See
[IE-CHG-AUTH-DATA-001](registers/CHG-2026-09-07-authorization-data-boundary.md) for the accepted
direction, predecessor archive and exact source impact. The later
[IE-CHG-RBAC-ARCH-001](registers/CHG-2026-09-10-rbac-and-diagram-governance.md) supersedes its role/
group-assignment shape while retaining the identity-versus-product-authority boundary.

## Item, folder and copy-identity clarification — 7 September 2026

[SPEC-001 section 8.5](decision-briefs/SPEC-001-product-specification.md#85-giữ-đúng-tài-liệu-khi-đổi-tên-chuyển-folder-hoặc-tạo-bản-sao)
and [VVP section 1.6](registers/VVP-core-v0-verification-validation-plan.md#16-item-name-folder-and-copy-identity-acceptance-detail)
separate a stable Logical Document from its visible name, logical Folder/Placement and physical
Artifact/Workspace paths. Move, add/remove link and navigation-alias Rename change organization only;
a controlled name/title change uses normal Checkout/Check-in; Create Copy/Save-As creates a new
`DocumentId` with source provenance and no inherited Reservation, Approval or Released state.

This is the accepted IDEA behavior for correction point 11 and follows the externally observable
reference-product distinctions while leaving its database keys and internal persistence semantics
explicitly unclaimed. IF-01…06 are planned checks and remain `NOT-RUN`. See
[IE-CHG-ITEM-FOLDER-001](registers/CHG-2026-09-07-item-folder-identity.md) for the decision, predecessor
archive and exact source impact, and [IE-KNW-DDM-005](../../knowledge/2026-09-07-ddm-item-name-folder-identity-evidence.md)
for the bounded evidence finding.

## BOM, Product Structure and file-boundary clarification — 7 September 2026

[SPEC-001 section 8.6](decision-briefs/SPEC-001-product-specification.md#86-bom-là-dữ-liệu-cấu-trúc-không-phải-chỉ-là-file-excelpdf)
and [VVP section 1.7](registers/VVP-core-v0-verification-validation-plan.md#17-product-structure-bom-and-file-boundary-acceptance-detail)
define BOM as a governed view of one exact Structure Snapshot under a versioned BOM View Profile.
Excel/PDF/CSV outputs are pinned, non-authoritative BOM Representations. An uploaded Excel/CSV file
is only a BOM Import Candidate until validation, visible difference preview and atomic acceptance.
An independently controlled parts list keeps its own Logical Document/Generation identity and an
exact relationship to the Structure Snapshot it describes.

This is the accepted IDEA direction for correction point 12. Public evidence shows the reference
product's Product Structure/BOM editing, quantity/position and export surfaces, but does not prove
its internal occurrence, snapshot, transaction or staleness rules. BM-01…06 are planned checks and
remain `NOT-RUN`. See [IE-CHG-BOM-STRUCTURE-001](registers/CHG-2026-09-07-bom-structure-representation.md)
for the decision/predecessor archive and [IE-KNW-DDM-006](../../knowledge/2026-09-07-ddm-bom-structure-representation-evidence.md)
for the bounded evidence finding.

## Departmental deliverable scope clarification — 7 September 2026

[SPEC-001 section 8.7](decision-briefs/SPEC-001-product-specification.md#87-đầu-ra-phòng-ban-không-tự-trở-thành-tính-năng-của-pdm)
and [VVP section 1.8](registers/VVP-core-v0-verification-validation-plan.md#18-departmental-handoff-and-operational-reference-data-acceptance-detail)
now distinguish controlled engineering deliverables from operational reference values. CAD/PDF,
software, instructions, checklists, Product Structure outputs and Release evidence use the existing
document/structure/lifecycle controls. Hours, estimated cost, purchasing/fabrication state, progress
and completion may be retained as attributable context, but do not create calculations, transactions,
completion or lifecycle transitions in Core v0.

This is the accepted IDEA direction for correction point 13. It retains 14 FTR, 74 REQ and 15 VVP
objective IDs; DH-01…04 are planned checks and remain `NOT-RUN`. Future operational authority requires
a separately approved Feature or named integration contract. See
[IE-CHG-DEPT-SCOPE-001](registers/CHG-2026-09-07-departmental-deliverable-scope.md) for the decision,
predecessor archive, source impact and evidence limits.

The controlled Markdown sources were reconciled on 09-09-2026. This changed source pins and document
versions only; it did not change product behavior, the roadmap schedule or any review/decision state:

| Retained source | Reconciled state |
|---|---|
| FEATURE-001@0.12 and SPEC-001@0.14 | Historical 09-09 reconciliation state: current Core/VVP pins were recorded and the management decision was then `NOT-RUN`. The current Product Decision Authority approval is recorded separately in `IE-CHG-PDA-APPROVAL-001`; `SPEC-001@0.14` is not the current normative 87-requirement SRS. |
| TECH-001@0.8 | Historical source-reconciliation baseline; superseded by `TECH-001@0.9`, Linux-first `@0.10`, rationale-refined `@0.11`, Client/UI challenger `@0.12`, reviewer-corrected `@0.13`, approved Engineering selection `@0.14`, then multi-location Vault successor Draft `@0.15`. |
| DOC-07@0.5 | Historical source-reconciliation baseline; superseded through current `DOC-07@0.12`. The old 56-task/756-hour appendix and Gantt predate the Gateway/Vault successor and are marked stale for execution; successor re-estimation is `NOT-RUN`. |
| Existing Word/Human copies | Retain the submitted/editorial versions; they were not overwritten or silently regenerated. |

On 10-09-2026, the controlled sources were re-baselined for requirement and architecture quality.
DOC-04 is now the sole normative SRS; DOC-05 is the sole architecture description. The accepted
administration model was made consistent across DOC-03/04/05/06/08, and maintained Mermaid views
were added for system context, deployment, Module ownership, lifecycle, Checkout/Check-in,
review/Release, authorization and core data identities. This work retains 14 Feature IDs and 74
requirement IDs, adds no product permission and records no verification result. The three decision
briefs, VVP and roadmap source pins remain stale until a later controlled refresh; no prior review is
inherited.

The same date, internal design discussion then replaced the earlier Group/Project Role/Permission
Set chain with one RBAC model: `Security Principal + Role Definition + Authorization Scope = Role
Assignment`. Ten requirements `REQ-AUTH-001…010`, two Project/RBAC architecture views, a matching
data model, separate Account/Project/Role/Product Configuration administration journeys, 14 planned
PA/RBAC procedures and an architecture-diagram review policy now carry that design. This raises the
current SRS from 74 to 84 requirement IDs and the VVP from 15 to 16 objectives. The project user's
confirmation at that time was internal design review only. Product Decision Authority approval is
now recorded separately in `IE-CHG-PDA-APPROVAL-001`; specialist review, implementation and every
procedure result remain `NOT-RUN` unless a later controlled record states otherwise.

Later on 10-09-2026, Q26–Q32 closed the remaining structural direction for Reservation expiry and
recovery, modified Reference files, logical all-or-none multi-document Check-in, resumable multi-GB
transfer, provider-neutral Artifact storage, product-owned Permission codes and request-time Scope
inheritance. The approved predecessor DOC-04@0.13 has 87 requirement IDs and VVP@0.16 has 17
objectives plus WS-01…08 and ST-01…04.
The exact lease values, real workload/sizing, selected storage technology and executed IDEA evidence
remain open. The public DDM/Aras comparison, initial read-only audit and later authorized test-fixture
experiment are evidence with explicit limits, not copied product requirements or proof that IDEA
already works. See
[IE-CHG-WS-SCALE-001](registers/CHG-2026-09-10-workspace-transfer-storage-decisions.md).

On 17-09-2026, management feedback selected a successor architecture direction in which business
control remains on the Server while large Artifact bytes move directly between Workspace and a
scoped Artifact Gateway. One logical Artifact may have several verified Vault locations, with
policy-governed replication/repair separate from backup. DOC-04@0.14 now has 90 requirement IDs;
DOC-05@0.21, DOC-06@0.17, DOC-08@0.13 and VVP@0.17 carry the matching contracts and planned checks.
This successor does not inherit the PDA approval of the exact predecessor baseline automatically;
its topology, thresholds, runtime/provider qualification and exact PDA approval remain `NOT-RUN`.

## Core instance catalogue

| Class | Stable Document ID | Instance | Current state |
|---|---|---|---|
| `DOC-01` | `IE-PROD-VISION-001` | [Product Vision and Scope](DOC-01-product-vision-and-scope.md) | `Draft 0.6`; scope unchanged; administration responsibilities separated |
| `DOC-02` | `IE-PROD-FEAS-001` | [Feasibility and Options Assessment](DOC-02-feasibility-and-options-assessment.md) | `Draft 0.2` |
| `DOC-03` | `IE-PROD-BREQ-001` | [Business Requirements](DOC-03-business-requirements.md) | `Draft 0.7`; principal–role–scope RBAC and separate administrator responsibilities defined |
| `DOC-04` | `IE-PROD-SREQ-001` | [Software Requirements Specification](DOC-04-software-requirements-specification.md) | `Draft 0.14`; sole normative SRS; 90 requirements including `REQ-WS-016`, `REQ-OPS-007/008`, `QRS-013/014`; exact successor PDA approval and verification `NOT-RUN` |
| `DOC-05` | `IE-PROD-ARCH-001` | [Architecture Description](DOC-05-architecture-description.md) | `Draft 0.21`; separates authoritative control from scoped direct Artifact data transfer and models multiple Vault locations, Transfer Grant/Receipt and policy-governed replication; exact topology/qualification `NOT-RUN` |
| `DOC-06` | `IE-PROD-DATA-001` | [Data, Integration and Migration Specification](DOC-06-data-integration-and-migration-specification.md) | `Draft 0.17`; adds Vault Endpoint, Transfer Grant/Receipt, Replication Task and versioned Storage/Durability Policy while keeping logical Artifact identity separate from physical locations |
| `DOC-07` | `IE-PROD-ROADMAP-001` | [MVP Roadmap and Delivery Plan](DOC-07-mvp-roadmap-and-delivery-plan.md) | `Draft 0.12`; marks the predecessor 56-task/756-hour Appendix and Gantt stale for execution because Gateway/Vault work is absent; successor re-estimation `NOT-RUN`; Q-15 unchanged |
| `DOC-08` | `IE-PROD-UX-001` | [UI/UX and Interaction Specification](DOC-08-ui-ux-and-interaction-specification.md) | `Draft 0.13`; separates selecting location, transferring, verifying, policy-required protection and final Check-in; transfer/replication completion alone is not success and storage secrets remain hidden |

## Supporting instance catalogue

| Class | Stable Record ID | Instance | Current state |
|---|---|---|---|
| `GOV` | `IE-GOV-COVERAGE-001` | [Material and Behavioral Coverage Register](registers/GOV-material-and-behavioral-coverage.md) | `Draft 0.3`; 16/16 public-baseline areas have explicit dispositions, not implementation coverage; target-runtime evidence remains `BLOCKED` |
| `VVP` | `IE-VVP-CORE-001` | [Core v0 Verification and Validation Plan](registers/VVP-core-v0-verification-validation-plan.md) | `Draft 0.17`; 17 objectives plus PA-01…04, RBAC-01…10, WS-01…08 and ST-01…07; direct-transfer, grant/receipt, failover, replication/repair and replica-versus-backup procedures remain `NOT-RUN` |
| `VEV` | `IE-VEV-ARCH-VIEW-001` | [Architecture View Source and Temporary Rendition Review](registers/VEV-2026-09-10-architecture-view-review.md) | `Draft 0.1`; 23/23 Mermaid views parsed/rendered and internally inspected; qualified architecture/HCD review and controlled-rendition acceptance `BLOCKED` |
| `VEV` | `IE-VEV-ARCH-CORR-001` | [Architecture Consistency Correction Audit](registers/VEV-2026-09-12-architecture-consistency-correction.md) | `Draft 0.1`; predecessor historical source/rendition audit for 30 maintained views; retained unchanged |
| `VEV` | `IE-VEV-ARCH-CORR-002` | [Architecture Consistency Correction Audit — Predecessor](registers/VEV-2026-09-12-architecture-consistency-correction-002.md) | `Draft 0.1`; predecessor focused source/rendition audit for the DOC-05@0.15/DOC-06@0.15 baseline; retained unchanged |
| `CHG` | `IE-CHG-TECH-001` | [Tech Context and Proposal Change Record](registers/CHG-2026-09-03-tech-context-and-proposal.md) | `Draft 0.1`; context source, material impact, retained versions and pending review |
| `CHG` | `IE-CHG-VERSION-001` | [Version Model Clarification Change Record](registers/CHG-2026-09-04-version-model-clarification.md) | `Draft 0.1`; closes SPEC-OPEN-01 for internal drafting; boss decision remains `NOT-RUN` |
| `CHG` | `IE-CHG-ROADMAP-001` | [Roadmap and Task Integration](registers/CHG-2026-09-05-roadmap-task-integration.md) | `Draft 0.1`; DOC-07@0.4 and schedule@0.1; planning only |
| `CHG` | `IE-CHG-STAGED-RELEASE-001` | [Staged Release Scenario](registers/CHG-2026-09-07-staged-release-scenario.md) | `Draft 0.1`; Spec@0.7 / VVP@0.4; acceptance clarification, no runtime results |
| `CHG` | `IE-CHG-CAD-REP-001` | [CAD Neutral Representation](registers/CHG-2026-09-07-cad-neutral-representation.md) | `Draft 0.1`; Feature@0.6 / Spec@0.8 / Tech@0.5 and Core/VVP alignment; no runtime results |
| `CHG` | `IE-CHG-WORKFLOW-001` | [Workflow Configuration](registers/CHG-2026-09-07-workflow-configuration.md) | `Draft 0.1`; Feature@0.7 / Spec@0.9 / Tech@0.6 and Core/VVP alignment; no runtime results |
| `CHG` | `IE-CHG-AUTH-DATA-001` | [Authorization and Data Boundary](registers/CHG-2026-09-07-authorization-data-boundary.md) | `Draft 0.1`; Feature@0.8 / Spec@0.10 / Tech@0.7 and Core/VVP alignment; no runtime results |
| `CHG` | `IE-CHG-ITEM-FOLDER-001` | [Item, Folder and Copy Identity](registers/CHG-2026-09-07-item-folder-identity.md) | `Draft 0.1`; Feature@0.9 / Spec@0.11 and Core/VVP alignment; Tech unchanged; no runtime results |
| `CHG` | `IE-CHG-BOM-STRUCTURE-001` | [BOM, Structure and File Boundary](registers/CHG-2026-09-07-bom-structure-representation.md) | `Draft 0.1`; Feature@0.10 / Spec@0.12 and Core/VVP alignment; Tech/DOC-07 held for consolidated refresh; no runtime results |
| `CHG` | `IE-CHG-DEPT-SCOPE-001` | [Departmental Deliverable Scope](registers/CHG-2026-09-07-departmental-deliverable-scope.md) | `Draft 0.1`; Feature@0.11 / Spec@0.13 and Core/VVP alignment; operational values remain non-authoritative; no runtime results |
| `CHG` | `IE-CHG-SOURCE-RECON-001` | [Cross-document Source Reconciliation](registers/CHG-2026-09-09-cross-document-reconciliation.md) | `Draft 0.1`; current Markdown sources synchronized; no Feature/Spec/Tech choice, schedule or gate state changed |
| `CHG` | `IE-CHG-ARTIFACT-CLEANUP-001` | [Obsolete Presentation Artifact Cleanup](registers/CHG-2026-09-09-obsolete-artifact-cleanup.md) | `Draft 0.2`; obsolete UI/report/rendition copies removed from active directories, with the superseded validation correction replaced by a Markdown resolution note; product content unchanged |
| `CHG` | `IE-CHG-SPEC-ARCH-QUALITY-001` | [Spec and Architecture Quality Re-baseline](registers/CHG-2026-09-10-spec-architecture-quality-baseline.md) | `Draft 0.1`; establishes source authority, clarifies administration ownership and adds maintained architecture/data views; decision briefs/VVP pins stale; no product result or approval |
| `CHG` | `IE-CHG-RBAC-ARCH-001` | [RBAC and Diagram Governance](registers/CHG-2026-09-10-rbac-and-diagram-governance.md) | `Draft 0.1`; records internally confirmed RBAC/admin boundaries, diagram policy and cross-document impact; no product result or Product Decision Authority approval |
| `CHG` | `IE-CHG-WS-SCALE-001` | [Workspace, Transfer and Storage Re-baseline](registers/CHG-2026-09-10-workspace-transfer-storage-decisions.md) | `Draft 0.2`; records Q26–Q32, bounded DDM/Aras evidence, controlled Aras runtime experiment and cross-document impact; no IDEA product result or Product Decision Authority approval |
| `CHG` | `IE-CHG-ARCH-CORR-001` | [Architecture Consistency Correction](registers/CHG-2026-09-12-architecture-consistency-correction.md) | `Draft 0.1`; records user-confirmed architecture correction, non-duplicate view guard and Reservation `Ended` guard; no Tech choice, product result or approval |
| `CHG` | `IE-CHG-ARCH-CORR-002` | [Architecture Consistency Correction — Successor](registers/CHG-2026-09-12-architecture-consistency-correction-002.md) | `Draft 0.1`; closes remaining coordinator/UoW, account, authorization-refusal, IAM-query and Representation-acceptance gaps; no requirement/Tech choice, product result or approval |
| `CHG` | `IE-CHG-ARCH-CORR-003` | [Architecture Consistency Correction — Final Micro Correction](registers/CHG-2026-09-12-architecture-consistency-correction-003.md) | `Draft 0.1`; aligns CPD/owner-specific Artifact pins, owner refusal outcomes, rollback vocabulary and BOM export owner-UoW retention; no requirement/Tech choice, product result or approval |
| `VEV` | `IE-VEV-ARCH-CORR-003` | [Architecture Consistency Correction Audit — Final Micro Correction](registers/VEV-2026-09-12-architecture-consistency-correction-003.md) | `Draft 0.1`; focused 30-view source/rendition audit for DOC-05/06@0.16; qualified review and controlled-rendition acceptance remain `BLOCKED` |
| `VEV` | `IE-VEV-ARCH-CORR-004` | [Post-pull Architecture View Correction](registers/VEV-2026-09-14-post-pull-architecture-view-correction.md) | `Draft 0.1`; predecessor 30-view source/rendition baseline for DOC-05@0.19 and DOC-06@0.16; qualified review and controlled-rendition acceptance remain `BLOCKED` |
| `VEV` | `IE-VEV-ARCH-CORR-005` | [Module Authority View Legibility Correction](registers/VEV-2026-09-14-module-authority-view-legibility.md) | `Draft 0.1`; predecessor 30-view source/rendition baseline for DOC-05@0.20 and DOC-06@0.16; successor source/rendition evidence is `IE-VEV-VAULT-XFER-001`; qualified review and controlled-rendition acceptance remain `BLOCKED` |
| `VEV` | `IE-VEV-TECH-Q15-001` | [Q-15 Client/UI Architecture Vertical Slice Qualification](registers/VEV-2026-09-14-q15-client-ui-architecture-qualification.md) | `Draft 0.1`; two runnable candidates and bounded evidence recorded at source `5556f60`; Q-15 `PARTIAL`, direct Dart FFI harness lane `PASS`, overall winner `NO WINNER`, recommendation and Product Scope unchanged |
| `VEV` | `IE-VEV-TECH-Q15-002` | [Q-15 Client/UI Architecture Vertical Slice Qualification — Phase 2](registers/VEV-2026-09-15-q15-client-ui-architecture-qualification-phase2.md) | `Draft 0.1`; successor evidence at source `3ae5f22`; Option A installed flow and production Web `PASS`, Option B Windows/FFI fault/Web JS/Wasm lanes `PASS` within bounded harness; native shim cost recorded; Q-15 remains `PARTIAL`, `NO WINNER`, recommendation and Product Scope unchanged |
| `VEV` | `IE-VEV-TECH-Q15-003` | [Q-15 Client/UI Architecture Vertical Slice Qualification — Phase 3](registers/VEV-2026-09-15-q15-client-ui-architecture-qualification-phase3.md) | `Draft 0.1`; native immediate/pending/cancellation hardening and 100-cycle reconnect evidence at source `47fa6d0`; Flutter Windows/Web and Release comparison remain `BLOCKED`; Q-15 remains `PARTIAL`, `NO WINNER`, recommendation, Matrix/TECH-001 and Product Scope unchanged |
| `VEV` | `IE-VEV-TECH-VIEW-001` | [Core v0 Technology Architecture View Set — predecessor](registers/VEV-2026-09-15-technology-architecture-view-set.md) | `Draft 0.1`; initial eight-view render/open evidence retained; superseded for current view-source verification by `IE-VEV-TECH-VIEW-002` |
| `VEV` | `IE-VEV-TECH-VIEW-002` | [Technology Architecture View Correction](registers/VEV-2026-09-15-technology-architecture-view-correction.md) | `Draft 0.1`; corrected view source rendered/opened 8/8 `PASS`; focused TECH-D07/D08 visual checks `PASS`; Worker toolchain qualification and independent architecture review remain `NOT-RUN`; Product Decision Authority Tech approval is recorded separately in `IE-CHG-PDA-APPROVAL-001` |
| `CHG` | `IE-CHG-DOC-REVIEW-001` | [Post-pull Document and Diagram Review Corrections](registers/CHG-2026-09-14-post-pull-document-review-corrections.md) | `Draft 0.2`; retains the 0.1 review corrections and adds the legibility-only `ARCH-VIEW-MOD-001` C4 Component rendition; no product decision or gate change |
| `STD` | `IE-STD-TECH-STACK-001` | [Technology Stack Documentation Standard](../../../agents/technology-stack-documentation-standard.md) | `Draft 0.1`; repository instruction state `Effective`; reusable process standard, product normativity `INFORMATIVE`, conformity not claimed |
| `KNW` | `IE-KNW-TECH-DEC-001` | [Core v0 Technology Decision Matrix](../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md) | `Draft 0.6`; Engineering selected the Linux-first Java/Spring/PostgreSQL Server and Option A Client baseline; Flutter is an evaluated alternative behind eight triggers; Q-01…Q-14 `NOT-RUN`, Q-15 `PARTIAL / NO WINNER`; informative only |
| `CHG` | `IE-CHG-TECH-BASELINE-001` | [Core v0 Technology Stack Engineering Baseline](registers/CHG-2026-09-15-core-v0-technology-stack-baseline.md) | `Draft 0.2`; preserves matrix@0.6, TECH@0.14 and DOC-07@0.11 while clarifying selected Worker boundary/profile contract versus condition-driven deployment/use and unqualified concrete profile/toolchain; this historical record left PDA approval and PG3/PG4 `NOT-RUN`; PDA approval is now recorded in `IE-CHG-PDA-APPROVAL-001`, while PG3/PG4 remain `NOT-RUN` |
| `CHG` | `IE-CHG-TECH-VIEW-CORR-001` | [Technology Architecture View Semantic Correction](registers/CHG-2026-09-15-technology-architecture-view-correction.md) | `Draft 0.1`; corrects TECH-D07 Worker build ownership, TECH-D08 unbiased successor decisions and Format Worker wording; technology baseline, Q-15 and Product Scope unchanged |
| `CHG` | `IE-CHG-TECH-DEC-001` | [Core v0 Technology Recommendation Change Record](registers/CHG-2026-09-13-technology-decision-recommendation.md) | `Draft 0.1`; records TECH-001@0.8 → 0.9 and the new matrix; no product scope, requirement, architecture semantic or gate change |
| `CHG` | `IE-CHG-TECH-LINUX-001` | [Linux-first Server Runtime Re-evaluation](registers/CHG-2026-09-13-linux-first-server-runtime-re-evaluation.md) | `Draft 0.1`; records Tech context, predecessor hashes, matrix `0.1 → 0.2`, TECH `0.9 → 0.10`, DOC-05 candidate rows and DOC-07 routing; no Product Scope or gate change |
| `CHG` | `IE-CHG-TECH-LINUX-002` | [Linux Server Technology Rationale Refinement](registers/CHG-2026-09-13-linux-server-technology-rationale-refinement.md) | `Draft 0.1`; records matrix `0.2 → 0.3`, TECH `0.10 → 0.11`, DOC-05 architecture-first wording and explicit dependency/session corrections; no Product Scope, architecture semantic or gate change |
| `CHG` | `IE-CHG-TECH-CLIENT-001` | [Client/UI Stack Technology Re-evaluation](registers/CHG-2026-09-14-client-ui-stack-re-evaluation.md) | `Draft 0.1`; records research@0.2, matrix@0.4, TECH@0.12 and DOC-07@0.9 routing; Flutter remains Q-15 challenger; no Product Scope, Server, architecture semantic or gate change |
| `CHG` | `IE-CHG-TECH-CLIENT-002` | [Client/UI Stack Review Correction](registers/CHG-2026-09-14-client-ui-stack-review-correction.md) | `Draft 0.1`; records research@0.3, matrix@0.5, TECH@0.13 and DOC-07@0.10 routing; corrects provisional control, Q-08/Q-10, Flutter FFI-first IPC and verifier provenance; no Product Scope, Server, architecture semantic or gate change |
| `CHG` | `IE-CHG-PDA-APPROVAL-001` | [Feature Spec and Tech Product Decision Authority Approval](registers/CHG-2026-09-17-product-decision-authority-approval.md) | `Draft 0.1` record; Feature, Spec and Tech decisions `APPROVED` on 17-09-2026 against commit `f269a04` and the exact management-review hashes; verification, Q-15, PG3 and PG4 states unchanged |
| `CHG` | `IE-CHG-VAULT-XFER-001` | [Multi-location Vault Transfer Architecture](registers/CHG-2026-09-17-multi-location-vault-transfer-architecture.md) | `Draft 0.1`; internal direction selected after management feedback; separates control/data planes, introduces scoped Gateway transfer and multiple Artifact locations; exact successor PDA approval, thresholds, topology and qualification `NOT-RUN` |
| `VEV` | `IE-VEV-VAULT-XFER-001` | [Multi-location Vault Source, Rendition and Diagram Review](registers/VEV-2026-09-17-vault-transfer-diagram-review.md) | `Draft 0.1`; current 40 controlled + 3 management views, including two new storage sequences; exact hashes, render/open checks and focused author QA; independent review and runtime qualification remain `NOT-RUN` |

The [Core v0 Technology Decision Matrix](../../knowledge/2026-09-13-core-v0-technology-decision-matrix.md)
is the informative Engineering selection presented to management through
[`TECH-001@0.15`](decision-briefs/TECH-001-technology-and-architecture-proposal.md). The matrix did
not approve itself; the separate Product Decision Authority disposition is now recorded by
[`IE-CHG-PDA-APPROVAL-001`](registers/CHG-2026-09-17-product-decision-authority-approval.md).
That decision approves the selected Tech baseline while preserving all qualification and gate
states. The focused
[Linux-first first-party support check](../../../research/2026-09-13-linux-first-server-platform-support-check.md),
fresh [Client/UI Flutter challenger research](../../../research/2026-09-14-flutter-client-ui-stack-evidence.md),
earlier [technology research note](../../../research/2026-09-03-idea-tech-stack-primary-sources.md),
[RBAC/architecture-diagram source analysis](../../../research/2026-09-10-microsoft-rbac-and-architecture-diagram-standards.md) and
[workspace/transfer comparison](../../../research/2026-09-10-ddm-aras-checkout-reference-checkin-comparison.md), including the
[controlled Aras runtime experiment](../../../research/2026-09-10-aras-runtime-workspace-experiment.md),
and the [multi-location Vault provenance note](../../../research/2026-09-17-vault-transfer-and-multi-location-provenance.md)
support the proposals with official sources and their limitations. Source research is not a
compatibility test, security proof, license approval or an IDEA product decision.

## Authoring and decision sequence

1. Preserve the approved 17-09-2026 Feature, Spec and Tech baseline and publish controlled
   `Approved 1.0` management renditions without changing the approved content.
2. Resolve the remaining named Spec inputs, including the exact Permission/Role/delegation seed
   under `SPEC-OPEN-03`, through controlled successor decisions where they change an approved
   obligation or baseline.
3. Obtain the required company deployment, security, operational and specialist dispositions;
   qualify the proposed stack, account boundary, file/format behavior and recovery design.
4. Update DOC-07 and the required GOV, CLR, RSK, VVP, VEV, CMP and CHG records for `PG4` readiness.
5. Start production implementation only after the approved requirements, architecture and increment
   readiness satisfy the applicable gates.

The Product Decision Authority approval is recorded in
[`IE-CHG-PDA-APPROVAL-001`](registers/CHG-2026-09-17-product-decision-authority-approval.md).
No product gate is changed to `PASS` by that approval.
