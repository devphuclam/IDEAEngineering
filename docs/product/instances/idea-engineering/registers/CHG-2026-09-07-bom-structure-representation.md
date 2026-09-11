# IDEA Engineering BOM, Structure and File-Boundary Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-BOM-STRUCTURE-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed product direction plus bounded `VENDOR-PUBLIC` reference behavior; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with affected Feature/Spec/Core source versions |

## Problem and decision

Correction point 12 identified an ambiguous statement that equated “BOM/Parts list” with Excel and
PDF files. That wording could let file storage be mistaken for management of Product Structure,
occurrences, quantities, positions and exact component versions. The project user accepted the
recommendation to correct the model as follows.

1. Product Structure is authoritative managed data. Each published structure is retained as an
   immutable Structure Snapshot with stable occurrences and exact Generation pins.
2. A BOM is a governed query/view of one exact Structure Snapshot under one versioned BOM View
   Profile. The profile identifies the view's purpose, fields, filters, ordering and output rules.
3. Excel, PDF, CSV and similar exports are non-authoritative BOM Representations. Each output pins
   the exact snapshot/profile, output digest and producer provenance; a later source/profile leaves
   it historical and identifies it as `Needs update`.
4. An uploaded Excel/CSV or structured payload is a non-authoritative BOM Import Candidate. It must
   pass validation and an explicit add/change/remove preview against an exact base snapshot before
   confirmation can atomically create a new Structure Snapshot and owning Generation.
5. A parts list governed as an independent Logical Document retains its own exact Generation and an
   explicit relationship to the Structure Snapshot it describes. It is not silently interchangeable
   with a generated BOM Representation.
6. Release and reproduction pin the exact snapshot, profile and required representation/document;
   they never resolve a floating “latest BOM”.

This resolves correction point 12 at the design/specification level. It does not claim that the
behavior is implemented, tested, approved by the Product Decision Authority or identical to any
reference product's internal design.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [CONTEXT.md](../../../../../CONTEXT.md) | Adds BOM, BOM View Profile, BOM Representation and BOM Import Candidate domain terms. |
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.9 → 0.10; clarifies FTR-007/FTR-010 without adding a Feature ID. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.11 → 0.12; adds REQ-STR-004…006 and BM-01…06, increasing the requirement set from 71 to 74. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.7 → 0.8; records separately verifiable BOM view, output/document and import-candidate obligations. |
| [DOC-05](../DOC-05-architecture-description.md) | Draft 0.7 → 0.8; Product Structure owns the BOM boundary and `IF-STRUCTURE-BOM`. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.7 → 0.8; adds concepts and `DATA-REL-020…023`, exchange and migration mappings. |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | Draft 0.4 → 0.5; adds UX-JRN-012, BOM workspace/import-preview contracts and the explicit prototype gap. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.8 → 0.9; adds procedure set `IE-VVP-BOM-BOUNDARY-001@0.1`, BM-01…06. All results remain `NOT-RUN`. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record successor versions, predecessor preservation, hashes and review/test limits. |
| [DDM evidence finding](../../../knowledge/2026-09-07-ddm-bom-structure-representation-evidence.md) | `IE-KNW-DDM-006`; keeps public observations, inferences and runtime unknowns outside Core DOC-01…08. |
| DOC-01/02/03/07, GOV, Tech, accepted ADRs and prototype | Unchanged. DOC-07/Tech source drift is intentionally reconciled once after correction points 12–15, not repeatedly after each point. |
| Human/Word/PDF originals | Unchanged; submitted editorial copies are not overwritten or silently regenerated. |
| Spec Kit and implementation | No feature-lifecycle or production-code change; no `specs/` or runtime file is edited. |

## Evidence and decision boundary

Public evidence demonstrates Product Structure/BOM screens, quantity/position editing and Excel/Web
export. It does not prove occurrence keys, immutable snapshots, atomic BOM editing, exact export pins
or CAD/Web consistency. The IDEA rules above are selected safety and traceability requirements, not
claims about a reference product's private schema or transaction protocol.

No new ADR is created: immutable Structure Snapshots and exact Release pins are already accepted
architecture decisions, while this change removes terminology ambiguity and adds verifiable
requirements within those decisions. A future choice that transfers Product Structure authority to
files or an external system would be a separate material architecture decision.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-bom-structure-representation-decision.zip)
contains the exact eleven files below with their repository-relative paths. Archive SHA-256:
`cdf549eb250bf9da4b4ed524a0a958a0d94838f8cfdcf90bbada15bf028c77ac`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| CONTEXT.md | Pre-change domain glossary | 40719bce2066e5b8ed40881475f5809621cb9f16e337323c260efc0e863f5f09 |
| docs/product/knowledge/README.md | Pre-change knowledge index | 74379f949ebe7324e4706c78223d49abe9f292dbb54ebb29b849ae7d5b6f08db |
| FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.9 | f4634571c158368f92ac85c3796d6b11fbbf3f94e89fd78fb92ff8ba36801172 |
| SPEC-001-product-specification.md | SPEC-001@0.11 | 65132473594971c4d71fd3c643cd592ce3d9d0adeefa2e31f8d4a71a532bdcb8 |
| DOC-04-software-requirements-specification.md | DOC-04@0.7 | 0d3b0c266d0a1f1dc36c38d513ebf35918850eddcad556cf1580470352abcdeb |
| DOC-05-architecture-description.md | DOC-05@0.7 | c1ecfdb1d521fbd4220c62b39a9a10073d42cbb1eb9e1f10153ad1f703eb1740 |
| DOC-06-data-integration-and-migration-specification.md | DOC-06@0.7 | 8c855f6460258a4d637c5899f45d57c768d3709dca77cca6addf8440ab2a95e8 |
| DOC-08-ui-ux-and-interaction-specification.md | DOC-08@0.4 | e756f112b0df25df4297c907eaa96b462a29ebdade6fd1e7a98f3dd143a1cb1e |
| VVP-core-v0-verification-validation-plan.md | VVP@0.8 | f933b1b35a2c2f3d261eb5aa269c59140edaebc4732cc31dd5c64d87eee0133a |
| docs/product/instances/idea-engineering/README.md | Pre-change instance catalogue | d5777379e7e9f0bfdcd39ba6c94c6dc9b6f857a59823f9fa2d4c4fe203dd4852 |
| VERSION-HISTORY.md | Pre-change version/source ledger | 4e79f624d777db4ba6262b96e02e7165b34baa4b24010884d688496eb6f504ef |

## Verification scope

Before handoff, check the 14 FTR, 74 REQ and 15 VVP identity sets; BM-01…06 agreement across Spec,
DOC-04/05/06/08 and VVP; local Markdown links; tables/headings; archive entries and hashes; and the
absence of reference-product names in DOC-01…08. These are document checks only. Every product
procedure remains `NOT-RUN` until executed against an approved build and environment.
