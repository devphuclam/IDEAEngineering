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
| Current Core source versions | DOC-01 at `Draft 0.5`; DOC-02 at `Draft 0.2`; DOC-03 at `Draft 0.6`; DOC-04/06 at `Draft 0.11`; DOC-05 at `Draft 0.10`; DOC-07 at `Draft 0.5`; DOC-08 at `Draft 0.7`; GOV at `Draft 0.3`; VVP at `Draft 0.11`; CHG records at their catalogue versions |
| First approved version | `Approved 1.0` only after the applicable controlled decision |

## December 2026 roadmap package

[DOC-07 section 3.2](DOC-07-mvp-roadmap-and-delivery-plan.md#32-december-2026-schedule-and-task-appendix)
now contains the conditional 7 September–31 December 2026 plan: **56 tasks / 676 work hours +
80 contingency hours = 756 hours**, with 11 proposed Saturdays and external prerequisites still
to confirm.

- [Appendix A — task details, outputs, hours and dependencies](planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
- [Interactive Gantt — unchanged captured schedule view](planning/idea-roadmap-december-2026.html)
- [Change record — retained predecessor, source hashes and review limitations](registers/CHG-2026-09-05-roadmap-task-integration.md)

The appendix belongs to DOC-07, not a ninth Core Product Document or a competing Spec Kit execution
plan. The Gantt is a rendition of the same schedule, not a separate planning authority. This update
does not authorize coding or change any Feature/Spec/Tech decision or product-gate state.

FEATURE-001@0.12 refers to DOC-07@0.5 and the requirement source that was current when that brief
was written. It is now stale after the source re-baseline. Existing Word/Human copies remain the
submitted editorial versions and are not silently regenerated from this Markdown update. A new
decision packet must identify its exact source versions.

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
| [`FEATURE-001`](decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Feature scope and priority | DOC-01, DOC-02, DOC-03, DOC-04, DOC-07 and governed reference coverage | `Draft 0.12`; 14 feature IDs retained; **stale** because it does not yet pin DOC-03@0.6/DOC-04@0.11; boss decision `NOT-RUN` |
| [`SPEC-001`](decision-briefs/SPEC-001-product-specification.md) | Required behavior and acceptance | DOC-04, requirement-bearing DOC-06/08 content, VVP | `Draft 0.14`; 74 requirement IDs and seven open points retained; **stale** after DOC-04@0.11, DOC-06@0.11 and DOC-08@0.7; boss decision `NOT-RUN` |
| [`TECH-001`](decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Architecture and technology selection | DOC-02, DOC-04/05/06/08, accepted ADRs, confirmed context and official technology sources | `Draft 0.8`; **stale** after the architecture/data/UI source revisions; boss decision `NOT-RUN`; no selected production stack |

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
not an initial prerequisite. File volumes are unmeasured. RTO ≤4 working hours and RPO ≤1 hour are
preliminary evaluation objectives, not a tested SLA or rollout acceptance.

The project user previously accepted Feature 0.3 and Spec 0.4 in internal review:
[RVW-FEATURE-SPEC-20260903-001](decision-briefs/VERSION-HISTORY.md#5-ghi-nhận-review-nội-bộ-ngày-03-09-2026).
That result remains attached to those exact versions. It does not automatically apply to Feature
0.12, Spec 0.14 or Tech 0.8. The Version-model point was separately confirmed on 04-09-2026, but the
complete successor briefs still require review.

The [version history](decision-briefs/VERSION-HISTORY.md) records current identities, prior source
snapshots and review inputs. The current source hashes and verified predecessor set for this cleanup
are in [IE-CHG-SOURCE-RECON-001](registers/CHG-2026-09-09-cross-document-reconciliation.md); earlier
archives, including [the pre-Tech-context set](history/2026-09-03-before-tech-context.zip), remain retained.
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

## Authorization and configuration-data clarification — 7 September 2026

[SPEC-001 section 8.4](decision-briefs/SPEC-001-product-specification.md#84-thay-đổi-quyền-mà-không-sửa-code)
and [VVP section 1.5](registers/VVP-core-v0-verification-validation-plan.md#15-authorization-and-policy-import-acceptance-detail)
now separate Identity account/session eligibility from IDEA product authorization. Access Policy
evaluates Actor, role/group, resource scope/state and action; the owning Server module enforces the
decision under an exact activated policy version.

Ordinary access is assigned through groups/roles so personnel changes use Membership rather than
per-document edits. A direct grant to one Actor is an explicit scoped, justified, time-bounded and
audited exception, not the normal administration path.

Authorized forms/API can change policy without owner-module code edits. JSON is optional seed or
import/export transport and creates only a candidate; validation, preview and separate authorized
activation are required before authority changes. ASP.NET Core Identity and PostgreSQL remain Tech
proposals awaiting the boss's decision. AC-01…05 are planned checks and remain `NOT-RUN`. See
[IE-CHG-AUTH-DATA-001](registers/CHG-2026-09-07-authorization-data-boundary.md) for the accepted
direction, predecessor archive and exact source impact.

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
| FEATURE-001@0.12 and SPEC-001@0.14 | Current Core/VVP pins are recorded. Full review and boss decisions remain `NOT-RUN`. |
| TECH-001@0.8 | Current item/folder, BOM/file and departmental-output sources are recorded; technology proposal remains unchanged. |
| DOC-07@0.5 | Current brief/Core/VVP/GOV references are recorded; schedule, 56 tasks and 756 hours remain unchanged. |
| Existing Word/Human copies | Retain the submitted/editorial versions; they were not overwritten or silently regenerated. |

On 10-09-2026, the controlled sources were re-baselined for requirement and architecture quality.
DOC-04 is now the sole normative SRS; DOC-05 is the sole architecture description. The accepted
administration model was made consistent across DOC-03/04/05/06/08, and maintained Mermaid views
were added for system context, deployment, Module ownership, lifecycle, Checkout/Check-in,
review/Release, authorization and core data identities. This work retains 14 Feature IDs and 74
requirement IDs, adds no product permission and records no verification result. The three decision
briefs, VVP and roadmap source pins remain stale until a later controlled refresh; no prior review is
inherited.

## Core instance catalogue

| Class | Stable Document ID | Instance | Current state |
|---|---|---|---|
| `DOC-01` | `IE-PROD-VISION-001` | [Product Vision and Scope](DOC-01-product-vision-and-scope.md) | `Draft 0.5`; scope unchanged; current downstream source pin recorded |
| `DOC-02` | `IE-PROD-FEAS-001` | [Feasibility and Options Assessment](DOC-02-feasibility-and-options-assessment.md) | `Draft 0.2` |
| `DOC-03` | `IE-PROD-BREQ-001` | [Business Requirements](DOC-03-business-requirements.md) | `Draft 0.6`; Account/PDM administration and group/workflow-role responsibilities clarified |
| `DOC-04` | `IE-PROD-SREQ-001` | [Software Requirements Specification](DOC-04-software-requirements-specification.md) | `Draft 0.11`; sole normative SRS; 74 requirements retained; requirement record contract and administration boundary clarified |
| `DOC-05` | `IE-PROD-ARCH-001` | [Architecture Description](DOC-05-architecture-description.md) | `Draft 0.10`; sole architecture description; responsibility boundaries corrected and maintained architecture views added |
| `DOC-06` | `IE-PROD-DATA-001` | [Data, Integration and Migration Specification](DOC-06-data-integration-and-migration-specification.md) | `Draft 0.11`; data ownership and relationship views aligned with the administration boundary |
| `DOC-07` | `IE-PROD-ROADMAP-001` | [MVP Roadmap and Delivery Plan](DOC-07-mvp-roadmap-and-delivery-plan.md) | `Draft 0.5`; references synchronized; conditional December schedule, 56-task appendix and Gantt unchanged |
| `DOC-08` | `IE-PROD-UX-001` | [UI/UX and Interaction Specification](DOC-08-ui-ux-and-interaction-specification.md) | `Draft 0.7`; Workbench and Administration prototypes linked; account/group work separated from PDM policy/workflow work |

## Supporting instance catalogue

| Class | Stable Record ID | Instance | Current state |
|---|---|---|---|
| `GOV` | `IE-GOV-COVERAGE-001` | [Material and Behavioral Coverage Register](registers/GOV-material-and-behavioral-coverage.md) | `Draft 0.3`; 16/16 public-baseline areas have explicit dispositions, not implementation coverage; target-runtime evidence remains `BLOCKED` |
| `VVP` | `IE-VVP-CORE-001` | [Core v0 Verification and Validation Plan](registers/VVP-core-v0-verification-validation-plan.md) | `Draft 0.11`; 15 objectives retained; **stale** after the source re-baseline and requires account/group/policy separation coverage; execution `NOT-RUN` |
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

The [technology research note](../../../research/2026-09-03-idea-tech-stack-primary-sources.md)
supports the proposal with official sources and their limitations. Source research is not a
compatibility test, license approval or an IDEA product decision.

## Authoring and decision sequence

1. Review DOC-03@0.6, DOC-04@0.11, DOC-05@0.10, DOC-06@0.11 and DOC-08@0.7; keep unresolved inputs explicit.
2. Refresh the three concise decision briefs and VVP against those exact sources, then record
   Feature → Spec → Tech decisions against the versions actually presented to the boss.
3. Obtain the required company deployment, security, operational and specialist dispositions;
   qualify the proposed stack, account boundary, file/format behavior and recovery design.
4. Update DOC-07 and the required GOV, CLR, RSK, VVP, VEV, CMP and CHG records for `PG4` readiness.
5. Start production implementation only after the approved requirements, architecture and increment
   readiness satisfy the applicable gates.

No item in this directory currently records a boss approval or a product-gate `PASS`.
