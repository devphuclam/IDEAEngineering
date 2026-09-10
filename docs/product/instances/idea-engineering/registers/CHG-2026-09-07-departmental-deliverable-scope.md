# IDEA Engineering Departmental Deliverable Scope Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-DEPT-SCOPE-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviewed and confirmed this scope direction |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed product direction, management-context PDF and bounded `VENDOR-PUBLIC` reference behavior; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with affected Feature/Spec/Core source versions |

## Problem and decision

Correction point 13 listed outputs from multiple departments, including CAD/PDF/software,
instructions, checklists, hours, costs, purchasing/fabrication status, progress and product
completion. Read literally, that list could turn every departmental responsibility into a Core v0
feature and make IDEA appear authoritative for timekeeping, costing, procurement, manufacturing or
project management. The project user accepted the following correction.

1. CAD/PDF/software/instructions/checklists, Product Structure outputs, Release Records and other
   engineering evidence are governed through the existing document, structure, workflow and Release
   capabilities when they belong to an engineering handoff.
2. Department ownership or handoff responsibility is attributable context; it does not create a new
   data authority or a new Feature by itself.
3. Hours, cost estimates, purchasing/fabrication status, progress and completion may be retained as
   versioned metadata or controlled document content. In Core v0 they are Operational Reference Data.
4. Storing or changing Operational Reference Data does not by itself calculate a value, create an
   ERP/MRP, purchase, fabrication, manufacturing or project transaction, mark a product/project
   complete, or advance Workflow/Release.
5. A future approved Feature or named external integration contract may assign IDEA additional
   authority. That decision must define the source owner, data direction, permission, version,
   failure/retry behavior and Audit before implementation.

This resolves correction point 13 at the design/specification level. It adds no new Feature ID or
requirement ID: FTR-012 and REQ-GOV-003 already own versioned metadata/configuration. It does not
claim implementation, successful testing, integration with an operational system or Product
Decision Authority approval of Feature/Spec/Tech.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [CONTEXT.md](../../../../../CONTEXT.md) | Adds Departmental Deliverable and Operational Reference Data terms. |
| [DOC-01](../DOC-01-product-vision-and-scope.md) | Draft 0.3 → 0.4; clarifies product outcome and deferred operational capabilities. |
| [DOC-03](../DOC-03-business-requirements.md) | Draft 0.3 → 0.4; adds BS-010 and BR-029 for a controlled departmental handoff. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.8 → 0.9; clarifies REQ-GOV-003 and DH-01…04 trace while retaining 74 requirement IDs. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.8 → 0.9; records ownership/custody, DATA-REL-024, exchange and onboarding boundaries. |
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.10 → 0.11; clarifies FTR-012 and the operational capabilities outside Core v0 while retaining 14 Feature IDs. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.12 → 0.13; adds explanatory scope and DH-01…04 while retaining 74 requirement IDs. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.9 → 0.10; adds `IE-VVP-DEPARTMENTAL-HANDOFF-001@0.1`; all four cases remain `NOT-RUN` and the 15 objective IDs are retained. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record successor versions, predecessor preservation, hashes and review/test limits. |
| DOC-02/05/07/08, GOV, Tech, accepted ADRs and prototype | Unchanged. Architecture already separates controlled owner modules from external integrations. DOC-07/Tech remain held for the consolidated refresh after correction points 12–15. |
| Human/Word/PDF originals | Unchanged; submitted editorial copies and the management-context PDF are not overwritten or silently regenerated. |
| Spec Kit and implementation | No feature-lifecycle or production-code change; no `specs/` or runtime file is edited. |

## Evidence and architecture boundary

The management-context PDF supplies the departmental-output list but is not the approved Feature or
Spec authority. Public reference evidence `VP-03` shows broad document/product surfaces and `VP-13`
shows ERP/MRP/file exchange. `COV-DDM-013` already records the integration area as deferred because
no internal consumer, authoritative direction or contract is approved. Those sources do not prove
that the reference product lacks timekeeping, costing, procurement or project functionality; they
also do not justify adding those functions to IDEA Core v0.

No new ADR is created. The change clarifies scope within the existing controlled-data, metadata,
Product Structure, Lifecycle and integration boundaries. A future decision making IDEA authoritative
for an operational process would introduce a real ownership/integration tradeoff and should be
evaluated as a separate Feature, Tech decision and—if architecturally material—ADR.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-departmental-deliverable-scope-decision.zip)
contains the exact ten files below with their repository-relative paths. Archive SHA-256:
`bfd080f9b241d7cf4f1512d19a8b003af6b61fefc80998b6b19750b177a7465b`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| CONTEXT.md | Pre-change domain glossary | f63d1cb86eaedfb14ca34517fe52a82e46517f756989b7df691e3fb3c8129ec9 |
| docs/product/instances/idea-engineering/DOC-01-product-vision-and-scope.md | DOC-01@0.3 | b65059d8a810d746b18ff2eaa75360743aba52e9b5bca5966340e9fd94cd3607 |
| docs/product/instances/idea-engineering/DOC-03-business-requirements.md | DOC-03@0.3 | 46019399f52ba32dc00a2446910bf968bff1c81020eaf4a61ba78c75e6642040 |
| docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md | DOC-04@0.8 | 02d91fe6678170914ddf680948b22e5ac9f5ea326e22993c58c8212b2a14e975 |
| docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md | DOC-06@0.8 | 9f23d3b65802fce29756aed84ab1354005f9ec847d5328598f11934dfe2c731a |
| docs/product/instances/idea-engineering/decision-briefs/FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.10 | 89ecf7274567eae86e87cb287d282895a7902c5aeef82e2f91387ba388dce6e8 |
| docs/product/instances/idea-engineering/decision-briefs/SPEC-001-product-specification.md | SPEC-001@0.12 | 731f4f840321476f30b74d7966029e306a9f0899705f190a1f40e3fb03269450 |
| docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md | VVP@0.9 | 6eec6c6b1df176f9e10d1ad17cdde86c92d7667d96ba1846501e339dd44b8f8e |
| docs/product/instances/idea-engineering/README.md | Pre-change instance catalogue | bd687f93ed04bc1a06c0856958dc45a8b57f152c8691efedc9d290e0fd6000bd |
| docs/product/instances/idea-engineering/decision-briefs/VERSION-HISTORY.md | Pre-change version/source ledger | 7ec9781c354cac287bb24b034ac24cd3948f42eecbc7d1d915eec73e9f76ba82 |

## Verification scope

Before handoff, check the 14 FTR, 74 REQ and 15 VVP identity sets; DH-01…04 agreement across Spec,
DOC-04, DOC-06 and VVP; BR-029/REQ-GOV-003 trace; local Markdown links; tables/headings; archive
entries and hashes; and the absence of reference-product names in DOC-01…08. These are document
checks only. Every product procedure remains `NOT-RUN` until executed against an approved build and
environment.
