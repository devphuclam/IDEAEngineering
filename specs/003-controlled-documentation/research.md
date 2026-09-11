# Phase 0 Research: Controlled Product Documentation

**Feature**: `003-controlled-documentation`
**Date**: 2026-08-28
**Scope**: Establish the controlled documentation system for exactly eight core document classes
(`DOC-01` through `DOC-08`) and nine supporting record classes before production implementation.

This research resolves the design questions needed to plan the documentation increment. It does not
select a production programming language, framework, deployment topology, database, object store,
or supported-format list. Those choices remain later gated decisions.

## 1. Decisions

### R-001 — Model eight document classes, not eight uncontrolled files

**Decision**: Treat `DOC-01` through `DOC-08` as controlled information-item classes. Each class
has a defined authority boundary; each concrete instance has its own stable ID, `major.minor`
version, document status, applicable baseline, and change history. The initial implementation may
keep six living product baselines while `DOC-02` owns indexed feasibility records and `DOC-07` owns
the living roadmap and increment records.

**Rationale**: This preserves one navigable product authority without duplicating facts or forcing
every increment to recreate a complete eight-document bundle.

**Alternatives considered**:

- Eight fixed files with no instance identity — rejected because approvals, supersession, and
  adoption of existing material could not be tracked safely.
- One monolithic product document — rejected because authority boundaries, gate ownership, and
  reviewer navigation would be obscured.
- A separate document set for every increment — rejected because it duplicates living product
  decisions and creates competing sources of truth.

**Evidence**: [ADR-0008](../../docs/adr/0008-treat-core-product-documents-as-controlled-classes.md),
[`CONTEXT.md` product-development documentation](../../CONTEXT.md#product-development-documentation),
FR-001, FR-002, FR-004.

### R-002 — Keep Markdown authoritative and renditions traceable

**Decision**: Markdown under version control is the authoritative editable source. DOCX and PDF are
non-authoritative renditions. Every rendition records the source document ID, exact source baseline,
rendition date, and rendition status; a stale rendition cannot become the editable authority.

**Rationale**: Reviewers need accessible shareable formats while the repository needs deterministic
diffs, review history, and a single source of truth.

**Alternatives considered**:

- Make DOCX the authority — rejected because binary review and traceability are weaker in this
  repository.
- Treat PDF as a release authority — rejected because PDF is a presentation rendition, not an
  editable product-definition source.
- Allow each format to be edited independently — rejected because it creates silent divergence.

**Evidence**: Constitution Additional Constraints (Markdown/rendition rule), FR-011, FR-012,
SC-009.

### R-003 — Use one common control envelope and separate status from gate outcome

**Decision**: Every controlled template requires stable identity, title, owner, status, version,
applicable baseline, effective date, authors, reviewers, approvers, source/downstream links,
evidence class or claim status where applicable, change history, access classification, and
retention rule where applicable. Document status is `Draft`, `Proposed`, `Approved`, `Superseded`,
or `Retired`; gate outcome is separately one of `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`.

**Rationale**: A document's lifecycle and a gate's decision answer different questions. Keeping them
separate prevents a reviewed draft or a blocked gate from being misrepresented as an approved
baseline.

**Alternatives considered**:

- Use gate outcomes as document statuses — rejected because status accounting and review decisions
  would be conflated.
- Use free-text statuses — rejected because transition validation and reporting would be unstable.
- Use a single mutable `latest` pointer — rejected because exact baselines would be unreproducible.

**Evidence**: `CONTEXT.md` definitions for Document Status, Document Version, Baseline and Gate
Decision; FR-006, FR-007, FR-029, FR-030.

### R-004 — Preserve the evidence-to-product boundary

**Decision**: Keep evidence class distinct from product disposition and requirement status. DDM and
other reference observations are `Reference-Coverage Evidence`; they may support a
`Reference-Backed Product Hypothesis`, but they do not alone establish `Internal Operational Need
Validation` or an IDEA requirement. Every transferred conclusion retains source identity, hash or
controlled source, scope, limitations, and permitted transfer.

**Rationale**: The product objective is DDM behavioral coverage with reviewed improvements, not a
license to copy implementation or to claim an internal need from a competitor observation.

**Alternatives considered**:

- Treat “DDM has it” as an automatic requirement — rejected because stakeholder rationale,
  acceptance, verification, and approval would be missing.
- Put all vendor comparison in the eight core documents — rejected because it would pollute the
  IDEA product definition and violate the clean-room boundary.
- Treat lack of public evidence as absence — rejected because absence is `UNKNOWN`, not proof.

**Evidence**: [clean-room transfer register](../../docs/governance/clean-room-transfer-register.md),
[design-lesson register](../../docs/product/knowledge/idea-design-lessons.md),
[ADR-0009](../../docs/adr/0009-use-ddm-baseline-and-aras-quality-benchmark.md), FR-024–FR-025,
FR-034–FR-036.

### R-005 — Use the registered standards as guidance with explicit applicability

**Decision**: Map the documentation system to the registered life-cycle, information-item,
requirements, architecture, quality, HCD, accessibility, configuration, security, and testing
sources. Record exact editions and classifications in the standards register. Use cross-surface
HCD/accessibility guidance for `DOC-08`; apply WCAG only to Web or Web-rendered surfaces, use
WAI-ARIA only for custom Web semantics where native semantics are insufficient, and keep EN 301 549
conditional on a future approved scope. Do not claim conformity merely by citing a source.

**Rationale**: This gives the eight documents a stable, auditable content basis without turning
catalogue metadata into an unsupported compliance claim.

**Alternatives considered**:

- Apply WCAG universally to native Desktop — rejected because WCAG is not sufficient coverage for
  native Desktop.
- Baseline every watched or draft edition — rejected because a watch item is not an approved
  applicability decision.
- Copy normative text into templates — rejected by licensing and clean-room controls.

**Evidence**: [standards register](../../docs/governance/standards-register.md),
[DOC-08 primary-source check](../../docs/superpowers/research/2026-08-27-doc-08-hcd-accessibility-standards-primary-source-check.md),
FR-021–FR-023, FR-033–FR-036.

### R-006 — Route decisions through PG0–PG7 and keep missing authority visible

**Decision**: The catalogue and gate package map core documents and supporting records to PG0–PG7.
Gate outcomes remain limited to `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, and `BLOCKED`. A material PG2,
PG3, PG5, or PG6 baseline requires an appropriately independent reviewer or approver; if that role
is unavailable, the limitation remains visible and the gate cannot self-certify as passed.

**Rationale**: The project is intentionally documentation-first and currently has a single primary
author. The process must support progress without manufacturing independent evidence.

**Alternatives considered**:

- Allow a complete file count to imply a pass — rejected because completeness is not approval or
  evidence.
- Treat the author's own review as independent — rejected by the constitution and the single-actor
  evidence rule.
- Add ad-hoc gate states — rejected because downstream automation and reporting need a closed
  vocabulary.

**Evidence**: Constitution Development Workflow, FR-029–FR-032, FR-037–FR-039, SC-007 and SC-012.

### R-007 — Bound the MVP and pilot claims

**Decision**: Templates carry the MVP Release Spine, Generic Controlled-File Baseline, one
DOC-02-selected deep CAD Format Capability Profile, and MVP Success Metric Set. A Technical Pilot
Verification may run in an approved non-production boundary without an Internal Adoption Authority.
One human operating multiple identities is labeled `Single-Actor Functional Acceptance`; it is not
independent review or representative-user acceptance. Internal Pilot Acceptance and rollout require
representative internal-user evidence plus an attributable Internal Adoption Authority. Synthetic
evidence may be repository-safe; sanitized or production-derived company data remains in approved
storage with classification and handling records.

**Rationale**: The internal product can make useful technical progress while keeping claims bounded
by actual evidence and authority.

**Alternatives considered**:

- Call a two-identity exercise “two-person acceptance” — rejected because one human is still one
  actor.
- Require adoption authority before every technical test — rejected because it would block bounded
  feasibility work unnecessarily.
- Commit sanitized pilot data to Git by default — rejected because repository safety and data
  handling need a separate boundary.

**Evidence**: `CONTEXT.md` MVP/pilot terms, DL-023–DL-038 in the design-lesson register,
FR-037–FR-043, SC-012–SC-015.

### R-008 — Treat this increment as a documentation-only design boundary

**Decision**: This plan produces specifications, templates/contracts, registers, and validation
guidance. It does not select or implement application code, external APIs, database schemas,
deployment, identity providers, or format adapters. Runtime/API contracts are therefore not
required; the `contracts/` directory contains document information-item contracts for authors and
reviewers.

**Rationale**: The constitution requires approved documentation and gates before production code.
Keeping implementation choices open prevents a plan artifact from silently becoming an architecture
decision.

**Alternatives considered**:

- Design an application API now — rejected because no approved implementation boundary exists.
- Invent a database model for the final product — rejected because DOC-06 and architecture are
  later gated artifacts.
- Skip contracts entirely — rejected because authors still need explicit, testable document and
  gate contracts even without a runtime API.

**Evidence**: Constitution Principle II and Additional Constraints, spec Assumptions/Out of Scope,
FR-008–FR-012, FR-026–FR-032.

### R-009 — Make the GOV-owned coverage register the mandatory reference-translation record

**Decision**: Use a GOV-owned Material Coverage Inventory plus one Behavioral Coverage Register (as a
register, sub-register or governed section) for every material DDM behavior/product area. The inventory
is a versioned, closed list of stable material-area IDs with inclusion criteria, explicit exclusions,
owner and an exact as-of baseline/date. Each inventory entry has exactly one coverage record at that
baseline. Each record captures the DDM target and evidence limits, a proactive applicable quality-
benchmark comparison, affected stakeholders and risks, one controlled disposition, decision owner/
rationale, IDEA requirement/decision trace, increment and verification. An evidenced DDM behavior is a
default `ADOPT` candidate only after the comparison is recorded; omitted evidenced behavior remains
visible as `DEFER` or `EXCLUDE`, while insufficient evidence remains `UNKNOWN`/`BLOCKED`. Inventory
changes require a `CHG` record and successor baseline.

**Rationale**: The constitution requires DDM coverage to be explicit and Aras-informed without
turning the benchmark into a second parity target or adding a tenth supporting class.

**Alternatives considered**:

- Put comparison rows in each core DOC — rejected because it duplicates authority and violates the
  core-document no-competitor-narrative boundary.
- Add a tenth supporting class — rejected because the supporting-class boundary is exactly nine;
  the register is a GOV-owned view/record instead.
- Default every row to `ADOPT` without comparison — rejected because it would bypass the proactive
  quality-benchmark requirement and hide material improvements or limitations.

**Evidence**: Constitution Principle I and Additional Constraints, `CONTEXT.md` Behavioral Coverage
Disposition, `docs/product/knowledge/README.md`, FR-044 and SC-016.

### R-010 — Separate the English source boundary from product locale obligations

**Decision**: Keep repository Markdown and field vocabulary in English while requiring `DOC-04` and
`DOC-08` Locale Profiles for the complete 3-by-3 matrix of `en`, `vi`, and `ja` across Desktop, Web and
Web-rendered regions (9 locale-surface cells per core template). Each profile records resource
catalogue/fallback, Vietnamese/Japanese review status, persisted preference, Unicode preservation, and
Japanese IME/normalization/width/search/font-fallback/line-breaking scenarios. Localized DOCX/PDF
renditions remain optional and never replace the English authority.

**Rationale**: This preserves maintainable controlled source documents while carrying the approved
three-locale product requirement and the cross-surface parity obligations into the requirements and
interaction templates.

**Alternatives considered**:

- Treat English source as the only locale — rejected because product UI support is explicitly
  `en`/`vi`/`ja`.
- Auto-translate authored content at runtime — rejected because user-authored Unicode and authority
  must be preserved, and translation output is not a product decision.
- Create a separate core document for every locale — rejected because it would create competing
  authorities; locale is a profile/obligation linked from DOC-04/DOC-08.

**Evidence**: `CONTEXT.md` Supported Product Locale and Locale Review Status, architecture decision
Q-IC-002, FR-045 and SC-017.

### R-011 — Use a retained stratified Validation Pack with explicit human-review limits

**Decision**: Define a criterion-based, stratified Validation Pack with fixed minimum strata/counts
for class structure, placement, requirements, reference coverage, gate outcomes, three surface
profiles plus their nine locale-surface cells, renditions and pilot/claim statuses. Every sample records
selection rationale and exact execution metadata. Human walkthroughs use the Product Decision Authority
plus an intended document consumer when available; independence, competence or a Specialist Review Gap,
and author/owner separation are recorded. Missing population or reviewer makes the result
`BLOCKED`/`NOT-RUN`.

**Rationale**: Fixed sampling makes SC-003 and the new validation criteria reproducible, while the
explicit independence rule prevents a single author from manufacturing representative or independent
evidence.

**Alternatives considered**:

- Use an informal convenience sample — rejected because it cannot support the stated percentages or
  class coverage.
- Treat a single author with two identities as independent — rejected by the constitution and the
  Single-Actor Functional Acceptance rule.
- Claim pass when participants are unavailable — rejected because missing evidence must remain
  visible and truthful.

**Evidence**: Constitution Principles III–V, FR-046–FR-047 and SC-018–SC-019.

## 2. Resolved planning context

| Field | Resolved value |
|---|---|
| Product boundary | Internal company IDEA Engineering product; no commercial customer, pricing, revenue, market-share or market-fit objective |
| Core document scope | Exactly eight classes: DOC-01 through DOC-08 |
| Supporting scope | Nine classes: GOV, CLR, RSK, VVP, VEV, CMP, CHG, REL, OPS |
| Authoritative source | Git-tracked Markdown; DOCX/PDF are traceable renditions |
| Evidence policy | Reference-Coverage Evidence is separate from Reference-Backed Product Hypothesis, Internal Operational Need Validation, Technical Pilot Verification and Internal Pilot Acceptance |
| Standards policy | Exact registered source/edition and applicability classification; no inferred conformity |
| Gate model | PG0–PG7; outcomes PASS, PASS-WITH-ACTIONS, FAIL, BLOCKED |
| MVP boundary | MVP Release Spine, Generic Controlled-File Baseline, one deep CAD profile, MVP Success Metric Set |
| Implementation status | Documentation-only; no production code or runtime API in this increment |
| Future repository placement | `docs/product/definition/` for the eight core document classes and `docs/product/definition/registers/` for supporting templates, subject to controlled adoption tasks |
| Coverage ownership | GOV-owned Behavioral Coverage Register/sub-register; exactly nine supporting classes remain |
| Product language boundary | English controlled source/fields; product UI locales `en`, `vi`, `ja` with Locale Profiles in DOC-04/DOC-08 |
| Validation method | Retained criterion-based stratified Validation Pack; missing human population/reviewer is `BLOCKED`/`NOT-RUN` |

## 3. Deferred decisions (explicit, non-blocking for this plan)

These are intentionally deferred by the feature specification and must remain visible in later
plans or gate records; none is silently filled by an assumption here:

- named initial technical group, representative pilot project, internal participants, and Internal
  Adoption Authority;
- production technology stack, deployment topology, identity provider, database, object store,
  search engine, and transport;
- exact DDM target version/edition/configuration and authorized runtime evidence;
- enabled generic formats and the single deep CAD profile;
- remaining product-specific release, retention, numbering, reservation and PLM policy detail;
- performance, capacity, availability, RPO/RTO and retention thresholds;
- formal external/regulatory/conformity scope;
- C2 identity and any future Interoperability Fabric contract.

## 4. Research traceability

| Design output | Primary requirements/criteria |
|---|---|
| Eight-class catalogue and authority map | FR-001–FR-005, FR-013–FR-023, SC-001 and SC-003 |
| Common control/status/version contract | FR-006–FR-012, FR-029–FR-032, SC-002, SC-007 and SC-009 |
| Evidence and clean-room contract | FR-024–FR-025, FR-033–FR-036, FR-040, SC-006 and SC-014 |
| Gate and pilot contract | FR-029–FR-032, FR-037–FR-041, SC-007, SC-010 and SC-012–SC-015 |
| Data model and trace links | FR-026–FR-028, SC-004 and SC-005 |
| Validation quickstart | FR-008–FR-012, FR-028–FR-036, SC-002, SC-005, SC-008–SC-011 |
| Coverage, locale and sampling contracts | FR-044–FR-048, SC-016–SC-019 |

Phase 0 has no unresolved technical question that blocks Phase 1 design. The deferred items above
are runtime or later-gate inputs, not missing decisions for the documentation contracts.
