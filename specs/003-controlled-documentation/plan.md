# Implementation Plan: Controlled Product Documentation

**Feature ID**: `003-controlled-documentation`
**Branch**: `codex/controlled-documentation-baseline`
**Date**: 2026-08-28
**Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-controlled-documentation/spec.md`.

## Scope statement

This increment establishes the documentation system for exactly eight Core Product Document
classes — `DOC-01` through `DOC-08` — plus nine supporting record classes. It creates the catalogue,
templates/contracts, control fields, GOV-owned Material Coverage Inventory and Behavioral Coverage
Register, locale profiles, stratified
Validation Pack, trace model and validation guidance needed before production implementation. It does
not write application code or decide the production technology stack.

## Summary

Create a controlled, standards-guided documentation baseline for the internal IDEA Engineering
product. The plan gives each of the eight DOC classes one authority boundary, defines reusable
supporting records (`GOV`, `CLR`, `RSK`, `VVP`, `VEV`, `CMP`, `CHG`, `REL`, `OPS`), and makes every
document identity, status, version, evidence link, gate decision and rendition traceable. GOV owns a
closed, as-of Material Coverage Inventory plus a Behavioral Coverage Register for material DDM behaviors
and proactive quality-benchmark comparisons; DOC-04/DOC-08 carry explicit 3-by-3 `en`/`vi`/`ja` ×
surface Locale Profiles. Markdown remains the editable authority;
DOCX/PDF are source-pinned renditions. DDM is the default behavioral coverage target and Aras is a
supporting quality benchmark only; neither permits copied implementation material or competitor
narrative in the eight core documents.

## Technical Context

**Language/Version**: Not applicable to product runtime. The deliverable is repository-controlled
Markdown using the existing Spec Kit integration and its PowerShell verification scripts.

**Primary Dependencies**: `CONTEXT.md`, the project constitution, accepted ADRs, the standards
register, the clean-room transfer register, product knowledge/design lessons, and the local Spec Kit
scripts. No application runtime package or external service is introduced by this increment.

**Storage**: Git-tracked Markdown is the authoritative editable source. DOCX/PDF renditions point to
an exact Markdown baseline. Sanitized or production-derived pilot evidence stays in an approved
company storage boundary; only approved synthetic evidence and metadata may enter the repository.

**Testing**: Static heading/ID/link/placeholder checks, checklist re-validation, `git diff --check`,
catalogue placement exercises, the retained criterion-based stratified Documentation Validation Pack,
coverage-register reviews, locale-profile checks, trace walkthroughs, gate-package reviews, rendition
identity checks, and claim-status comprehension walkthroughs. No production application test suite is
in scope.

**Target Platform**: Repository review on the supported engineering workstations and Git host;
later DOCX/PDF consumers. No deployed runtime target is selected here.

**Project Type**: Controlled product-definition documentation and governance baseline.

**Performance Goals**: Meet the measurable documentation outcomes in the spec: at least 90% correct
placement of a 20-item sample (SC-003), under 5 minutes for sampled bidirectional trace traversal
(SC-005), under 10 minutes to locate a surface accessibility profile or gate decision (SC-008,
SC-010), at least 90% correct claim classification in a reviewer walkthrough (SC-015), complete
coverage-register fields and disposition accounting (SC-016), complete `en`/`vi`/`ja` locale-profile
checks (SC-017), and retained stratified sample/result metadata with truthful status (SC-018–SC-019).

**Constraints**: Exactly eight core classes and nine supporting classes; internal-company product
boundary; no commercial objectives; no Aras name/comparison in DOC-01…DOC-08; GOV-owned coverage
register is not a tenth class; English controlled source is distinct from product UI locales `en`,
`vi`, `ja`; no raw proprietary or licensed evidence; no unsupported ISO/WCAG/EN 301 549 or
vendor-parity claims; `UNKNOWN` and `BLOCKED` remain visible; production implementation waits for PG2,
PG3 and PG4; technology, topology, identity provider, database, object store and format list remain
open.

**Scale/Scope**: Eight core document classes, nine supporting record classes, 48 functional
  requirements, 19 success criteria, PG0–PG7 gate coverage, the minimum stratified Validation Pack
  (17 class rows, 20 placement items, 8 requirements, 6 reference cases, 4 gate outcomes, 3 surface
  profiles plus 9 locale-surface cells per core-template matrix, 4 rendition states and 6 pilot/claim
  statuses), one MVP Release Spine, one Generic
Controlled-File Baseline and one later deep CAD capability profile.

## Constitution Check

*Gate: must pass before Phase 0 research and be re-checked after Phase 1 design.*

| Constitutional principle | Gate evaluation | Status |
|---|---|---|
| I. DDM baseline, Aras-informed improvement and clean-room definition | The plan records DDM as the default behavioral target, requires a GOV-owned coverage register with proactive benchmark comparison and explicit dispositions, keeps comparison evidence in supporting records, preserves evidence classes, and keeps all eight core documents in IDEA language. | **PASS** |
| II. Controlled documentation before implementation | The increment produces documentation/design artifacts only. Production code is explicitly out of scope and blocked until the required gates. | **PASS** |
| III. End-to-end traceability and controlled change | Common fields, typed links, exact baselines, `CHG` impact records and rendition identity are designed before implementation. | **PASS** |
| IV. Measurable quality, verification and truthful claims | Success criteria, fixed Validation Pack strata, locale evidence, coverage-register fields, standards applicability and truthful `PASS`/`BLOCKED`/`NOT-RUN` handling are testable. | **PASS** |
| V. Secure, least-privilege and recoverable delivery | Pilot-data boundary, classification/retention fields, lawful-access limits, rollback/recovery evidence and fail-closed gate rules are included. | **PASS** |

**Pre-Phase 0 result**: PASS — no constitutional violation or unresolved clarify question blocks
research.
**Post-Phase 1 result**: PASS after `data-model.md`, contracts and `quickstart.md` were updated with
the coverage-register, locale and Validation Pack controls; final task/checklist reconciliation remains
part of the polish phase.

## Design decisions carried into Phase 1

1. **Eight classes, not eight competing files**: `DOC-01`…`DOC-08` are information-item classes;
   instances have separate stable IDs, versions and statuses. `DOC-02` and `DOC-07` may own indexed
   records while the other classes maintain living baselines.
2. **One authority per statement**: the catalogue assigns ownership; other documents link rather
   than duplicate.
3. **Common control envelope**: identity, owner, status, version, baseline, dates, roles, links,
   evidence/claim status, change, classification and retention are mandatory where applicable.
4. **Evidence is not need**: reference observations remain `Reference-Coverage Evidence`; a
   `Reference-Backed Product Hypothesis` does not replace internal need validation or requirement
   translation.
5. **Gate and pilot statuses stay separate**: document status, gate outcome, verification outcome,
   technical pilot, single-actor acceptance, internal pilot acceptance and rollout authorization are
   distinct records.
6. **No runtime API contract**: this increment has no external runtime interface. The contracts
   directory defines author/reviewer information-item contracts only.
7. **GOV-owned coverage translation**: a closed Material Coverage Inventory at an explicit as-of
   baseline/date defines the denominator, and every inventory entry is represented in a Behavioral
   Coverage Register with proactive benchmark comparison before `ADOPT`; the register is not a tenth
   supporting class and reference names remain outside core DOCs.
8. **English source versus product locales**: controlled Markdown/field vocabulary stays English;
   `DOC-04`/`DOC-08` Locale Profiles cover `en`, `vi`, `ja`, cross-surface parity, fallback, review,
   Unicode and Japanese input/search concerns.
9. **Retained Validation Pack**: criterion-based stratified sampling and explicit independence/
   representativeness records make percentage and comprehension criteria reproducible; missing human
   population or reviewer is `BLOCKED`/`NOT-RUN`.

## Project Structure

### Documentation (this feature)

```text
specs/003-controlled-documentation/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── validation-results.md
├── contracts/
│   ├── README.md
│   ├── document-catalogue.md
│   ├── control-fields-and-status.md
│   ├── evidence-and-trace.md
│   ├── gate-package.md
│   ├── rendition.md
│   └── validation.md
├── checklists/
│   ├── requirements.md
│   └── controlled-documentation.md
└── tasks.md                         # Generated by $speckit-tasks
```

### Planned product-definition source layout

The later template-authoring tasks will place the authoritative eight class templates under
`docs/product/definition/` and supporting record templates under
`docs/product/definition/registers/`:

```text
docs/product/definition/
├── README.md                                      # catalogue and authority map
├── DOC-01-product-vision-and-scope.md
├── DOC-02-feasibility-and-options-assessment.md
├── DOC-03-business-requirements.md
├── DOC-04-software-requirements-specification.md
├── DOC-05-architecture-description.md
├── DOC-06-data-integration-and-migration-specification.md
├── DOC-07-mvp-roadmap-and-delivery-plan.md
├── DOC-08-ui-ux-and-interaction-specification.md
└── registers/
    ├── GOV-governance-and-standards.md
    ├── CLR-clean-room-provenance.md
    ├── RSK-risk-register.md
    ├── VVP-verification-validation-plan.md
    ├── VEV-verification-evidence.md
    ├── CMP-configuration-management.md
    ├── CHG-change-records.md
    ├── REL-release-baselines.md
    └── OPS-operations-and-retirement.md
```

These are planned repository paths, not an authorization to populate or approve all eight
substantive product baselines in this feature. Existing accepted sources remain authoritative until
an explicit adoption/migration decision.

**Structure Decision**: Keep the design artifacts in the feature directory and use a separate,
discoverable product-definition directory for the future eight templates and nine register templates.
The `contracts/` files are document contracts, not API or database contracts. No production source
tree is added by this increment; future application paths remain a later architecture decision.

## Phase 0 — Research outputs

`research.md` resolves the planning questions for authority, format, control fields, evidence,
standards, gates, pilot claims and the documentation-only boundary. It records alternatives and
points to the constitution, `CONTEXT.md`, ADRs, standards register, clean-room register and accepted
design lessons. Runtime choices and named pilot assignments remain explicitly deferred rather than
invented.

## Phase 1 — Design outputs

1. `data-model.md` defines the eight-class catalogue model, nine supporting records, the GOV-owned
    Material Coverage Inventory, coverage record, Locale Profile and Validation Pack entities, common fields, evidence/claim
   entities, trace relationships, status/version rules and integrity invariants.
2. `contracts/document-catalogue.md` defines the exact class catalogue and authority boundaries.
3. `contracts/control-fields-and-status.md` defines the control envelope and lifecycle vocabulary.
4. `contracts/evidence-and-trace.md` defines the clean-room transfer and bidirectional trace.
5. `contracts/gate-package.md` defines PG0–PG7, independence/representativeness and pilot disposition
   rules.
6. `contracts/rendition.md` defines DOCX/PDF source identity and staleness handling.
7. `contracts/validation.md`, `quickstart.md` and `validation-results.md` define
   executable/document-review validation and retained results.

## Delivery sequence

1. Baseline the eight-class catalogue and nine supporting-record boundary, including the GOV-owned
   coverage-register boundary.
2. Define common identity, status, version, rendition, classification and retention fields.
3. Define evidence classes, requirement translation, typed trace links and clean-room transfer rules.
4. Define PG0–PG7 package expectations, independence/representativeness, and separate pilot/claim
   statuses.
5. Author the data model and document contracts.
6. Run the retained stratified Validation Pack, coverage-register, locale-profile, static structure,
   checklist, link and reviewer-walkthrough checks against the design artifacts.
7. Generate dependency-ordered tasks for the future template-authoring work; do not implement
   production application code before PG2/PG3/PG4.

## Requirement coverage

| Spec scope | Planned artifact/owner |
|---|---|
| FR-001–FR-005, FR-013–FR-023 | Eight-class catalogue, `document-catalogue.md`, `data-model.md`; eventual DOC-01…DOC-08 templates |
| FR-006–FR-012 | `control-fields-and-status.md`, `rendition.md`, common envelope in `data-model.md` |
| FR-024–FR-028 | `evidence-and-trace.md`, clean-room links, typed trace model and validation contract |
| FR-029–FR-032 | `gate-package.md` and gate decision entity |
| FR-033–FR-036 | Standards applicability and claims sections in `research.md`, `data-model.md` and contracts |
| FR-037–FR-043 | Pilot/claim model, MVP boundary, internal-data boundary and internal-only constraints |
| FR-044 | GOV-owned Behavioral Coverage Register contract in `document-catalogue.md`, `evidence-and-trace.md`, `data-model.md`, and GOV tasks |
| FR-045 | Locale/source-language boundary in `evidence-and-trace.md`, `data-model.md`, DOC-04/DOC-08 tasks and validation |
| FR-046–FR-047 | Stratified Validation Pack, reviewer independence and representativeness in `gate-package.md`, `validation.md`, `quickstart.md`, and retained results |
| FR-048 | Common envelope and indexed DOC-02/DOC-07 instance rules in the control contract and all template tasks |
| SC-001–SC-005 | Catalogue, common envelope, placement and trace checks |
| SC-006–SC-010 | Evidence, gate, accessibility, rendition and reviewer-navigation checks |
| SC-011–SC-015 | Internal boundary, pilot-status, MVP-scope, data-boundary and claim-comprehension checks |
| SC-016–SC-019 | Coverage-register completeness, locale profiles, Validation Pack integrity, and independence/representativeness evidence |

## Complexity Tracking

No constitutional violations require justification. The apparent multiplicity of eight core classes
and nine supporting classes is the feature's explicit authority boundary, not accidental project
complexity. The hybrid living-baseline/indexed-record model is required by ADR-0008 to avoid both
duplicated authority and eight ever-growing files. The coverage register, Locale Profiles and
Validation Pack are additive record shapes; they do not expand the eight/nine authority boundary.

## Phase 1 constitution re-check

After the design artifacts are generated, re-check that:

- no contract introduces a production stack, API, database or deployment decision;
- core-document paths and templates retain IDEA-only language;
- evidence, reference hypotheses, internal validation, technical verification and pilot acceptance
  remain distinct;
- all missing authority/evidence stays `UNKNOWN` or `BLOCKED`;
- the eight-class and nine-class counts remain exact; and
- the Material Coverage Inventory is closed at an explicit as-of baseline/date, every inventory entry
  has one GOV-owned coverage record with a proactive benchmark comparison before `ADOPT`, and core
  DOCs contain no competitor narrative;
- English source language remains distinct from the complete 9-cell `en`/`vi`/`ja` × surface product
  locale matrices;
- the Validation Pack records stratified selection, exact minimums, independence/representativeness,
  and truthful `BLOCKED`/`NOT-RUN` results; and
- validation commands report only checks actually executed.

Task generation has completed: `tasks.md` is the current dependency-ordered task graph. Once the
retained static, coverage, locale and reviewer checks are reconciled, the feature is ready for the
template-authoring work and the next implementation lifecycle gate; this plan still authorizes no
production application code.
