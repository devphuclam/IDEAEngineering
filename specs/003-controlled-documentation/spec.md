# Feature Specification: Controlled Product Documentation

**Feature Branch**: `codex/controlled-documentation-baseline`

**Created**: 2026-08-27

**Status**: Draft

**Input**: Establish a controlled, standards-guided documentation system for `DOC-01` through
`DOC-08` and their supporting registers before production implementation for the internal IDEA
Engineering product. Use the DDM Reference Baseline as the default behavioral target, use the Aras
Quality Benchmark only through classified supporting evidence, and keep the eight core documents
free of competitor names or comparison narrative. Sync the templates with the approved MVP, pilot,
evidence, governance, internal-value, coverage-register, validation-sampling, and product-locale
decisions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define the internal product through eight authoritative documents (Priority: P1)

As a Product Decision Authority or Principal Product Author, I want one clearly bounded document set
from vision through UI/UX so that the company knows what must be decided before code and does not use
implementation or reference-product behavior as the accidental source of truth.

**Why this priority**: The eight-document set is the primary internal product-definition baseline.
Without clear ownership and content boundaries, later requirements, architecture, design, and
delivery work will conflict or duplicate one another, and commercial assumptions could be introduced
into an internal product.

**Independent Test**: Give an author a representative set of vision, feasibility, business,
software, architecture, data/integration, roadmap, and interaction information. The author can
place every item in one authoritative core document, add cross-references where needed, and
identify the first gate at which each document must be reviewed.

**Acceptance Scenarios**:

1. **Given** a new product initiative, **When** an author consults the controlled document
   catalogue, **Then** the author can identify the purpose, owner, inputs, outputs, authority
   boundary, and applicable gates for all eight core documents.
2. **Given** information relevant to more than one document, **When** the author records it,
   **Then** one document owns the authoritative statement and the other documents reference it
   without creating a competing source of truth.
3. **Given** DDM, icVault, or another reference observation, **When** the author considers it for a
   core document, **Then** it is recorded as classified Reference-Coverage Evidence and may support
   a Reference-Backed Product Hypothesis, but it is not presented as Internal Operational Need
   Validation or an IDEA requirement without the required decision and trace.
4. **Given** a product question that available evidence cannot answer, **When** the document is
   prepared for review, **Then** the gap remains explicitly identified as `UNKNOWN` or `BLOCKED`
   with an owner or resolution path rather than being filled by assumption.
5. **Given** the product is intended for the company's internal engineering work, **When** an author
   defines value or scope, **Then** the document uses internal operational outcomes and excludes
   pricing, revenue, customer acquisition, market-share, and market-fit objectives.
6. **Given** an author specifies localized product behavior in `DOC-04` or `DOC-08`, **When** the
   author records language and interaction obligations, **Then** the controlled English source is
   kept distinct from the supported product UI locales `en`, `vi`, and `ja`, with locale parity,
   resource-catalogue, fallback, review-status, Unicode, and Japanese-input considerations visible.

---

### User Story 2 - Review and baseline documentation at product gates (Priority: P1)

As a reviewer or gate authority, I want every controlled document and supporting record to expose
its identity, status, scope, evidence, approval, and unresolved actions so that I can issue an
honest gate disposition without reconstructing context from chat history or source code.

**Why this priority**: Documentation-first delivery only works when reviewers can determine which
exact baseline they reviewed and when missing evidence prevents a pass.

**Independent Test**: Assemble a sample PG2 or PG3 review package. A reviewer can identify every
applicable artifact and version, detect missing prerequisites, record exactly one permitted gate
outcome, and distinguish completed evidence from blocked or unexecuted work.

**Acceptance Scenarios**:

1. **Given** a complete gate package, **When** the responsible authority reviews it, **Then** the
   decision records the gate, exact artifact baselines, reviewer, approver, date, rationale, and
   one outcome from `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`.
2. **Given** a `PASS-WITH-ACTIONS` decision, **When** it is recorded, **Then** every action has an
   owner, affected baseline, due condition or date, expiry, and escalation path.
3. **Given** a required independent reviewer is unavailable for a material PG2, PG3, PG5, or PG6
   baseline, **When** the gate is assessed, **Then** the limitation is visible and the gate is not
   self-certified as passed.
4. **Given** evidence was not produced or a check was not run, **When** the review package is
   examined, **Then** the item is reported as missing, blocked, failed, or not run and never as
   passed.
5. **Given** a reviewer uses the Documentation Validation Pack, **When** a sample is selected and
   executed, **Then** the prescribed population, strata, minimum counts, selection rationale,
   reviewer independence, result status, and retained evidence are recorded; an unavailable human
   population or reviewer produces `BLOCKED` or `NOT-RUN`, never an unqualified pass.

---

### User Story 3 - Trace and change the product definition safely (Priority: P1)

As an analyst, architect, designer, delivery lead, or verifier, I want to navigate from evidence
and stakeholder needs to requirements, designs, changes, verification, and release so that every
obligation is justified and every material change has a visible impact.

**Why this priority**: Traceability is the control that keeps eight documents and multiple
supporting records coherent over time rather than turning them into disconnected reports.

**Independent Test**: Seed a sample increment with a stakeholder need, requirement, architecture
or interaction response, change, verification result, and release reference. A reviewer can
traverse the chain in both directions, while an intentionally broken or orphaned link is detected
and blocks the applicable gate.

**Acceptance Scenarios**:

1. **Given** an approved requirement, **When** a reviewer follows its trace links upstream and
   downstream, **Then** the reviewer reaches an identified stakeholder need or approved product
   decision, its acceptance and verification method, affected design, change, evidence, and
   release disposition where those lifecycle stages exist.
2. **Given** a proposed material baseline change, **When** impact analysis is performed, **Then**
   affected requirements, architecture, data, interfaces, UI/UX, risks, tests, roadmap,
   operations, and releases are each addressed or explicitly marked not applicable with rationale.
3. **Given** a broken, stale, orphaned, or unjustified circular trace link, **When** the package is
   prepared for a gate, **Then** the defect is visible and the affected gate cannot pass until the
   link is repaired or an authorized disposition is recorded.
4. **Given** an accepted ADR or canonical term conflicts with a draft document, **When** the
   conflict is found, **Then** the draft is corrected or a controlled change is opened; the draft
   does not silently override `CONTEXT.md` or the accepted ADR.

---

### User Story 4 - Keep supporting evidence outside the eight core documents (Priority: P2)

As a document owner, I want reusable governance, provenance, risk, verification, configuration,
change, release, and operations records so that the eight core documents stay decision-focused
without losing auditability or copying the same evidence into every file.

**Why this priority**: Supporting records carry cross-cutting evidence and change history. Keeping
them explicit prevents bloated documents and makes review evidence reusable across gates.

**Independent Test**: For a sample requirement and release, store its standards decision,
provenance, risk, change, verification, configuration, release, and operational references in the
appropriate supporting records. Each core document contains only the links and conclusions it
owns.

**Acceptance Scenarios**:

1. **Given** a risk affects multiple core documents, **When** it is recorded, **Then** one risk
   record owns the risk, treatment, owner, status, and residual disposition while affected
   documents reference it.
2. **Given** a standards edition or policy changes, **When** its impact is reviewed, **Then** the
   applicability, tailoring, affected baselines, and change decision are recorded without silently
   rewriting every dependent document.
3. **Given** proprietary or licensed evidence supports a finding, **When** the finding enters the
   product repository, **Then** the supporting provenance record identifies the authorized source
   and evidence class without copying restricted source material.

---

### User Story 5 - Share controlled renditions without losing source identity (Priority: P3)

As a stakeholder who consumes DOCX or PDF, I want each rendition to identify its authoritative
source baseline so that comments and approvals cannot be applied to an ambiguous or stale copy.

**Why this priority**: Renditions improve accessibility for reviewers, but Markdown remains the
controlled editable source and must not diverge silently.

**Independent Test**: Produce two renditions from different source baselines. A reviewer can tell
which source version created each rendition, detect that the older copy is superseded, and follow
the reference back to the authoritative item.

**Acceptance Scenarios**:

1. **Given** an approved Markdown baseline, **When** a DOCX or PDF rendition is produced, **Then**
   it identifies the source document ID, source version or immutable baseline, rendition date, and
   rendition status.
2. **Given** a rendition and its source have diverged, **When** the rendition is reviewed, **Then**
   it is visibly stale or superseded and cannot silently become the editable authority.

---

### User Story 6 - Bound internal MVP and pilot evidence (Priority: P2)

As a Principal Product Author or gate reviewer, I want the documentation baseline to distinguish
product direction, internal need validation, technical pilot verification, and internal pilot
acceptance so that a one-person technical exercise cannot be mistaken for company-wide adoption
evidence.

**Why this priority**: IDEA Engineering is an internal product. The documentation must support
useful progress with limited staffing while keeping claims, authority, pilot scope, and rollout
readiness honest.

**Independent Test**: Prepare a sample MVP and pilot package using the Canonical Demo Dataset, a
sanitized Representative Pilot Project, two separately provisioned identities operated by one
person, and a reference-product evidence record. A reviewer can distinguish which claims are
reference-backed, technically verified, internally validated, independently reviewed, or still
`UNKNOWN`/`BLOCKED`.

**Acceptance Scenarios**:

1. **Given** controlled reference evidence supports the product direction, **When** it is recorded,
   **Then** the package may accept a Reference-Backed Product Hypothesis while leaving Internal
   Operational Need Validation visibly `UNKNOWN` or `BLOCKED`.
2. **Given** one person operates two separately provisioned identities in an approved non-production
   environment, **When** the MVP Release Spine is executed, **Then** the result is labeled
   Single-Actor Functional Acceptance and cannot be represented as representative-user acceptance or
   independent review.
3. **Given** a technical pilot has passed its functional checks, **When** no Internal Adoption
   Authority or representative internal-user evidence exists, **Then** Internal Pilot Acceptance
   and operational rollout remain unavailable.
4. **Given** a pilot project contains sanitized or production-derived company data, **When** its
   evidence is retained, **Then** it stays in a company-approved storage boundary with classification,
   owner, access, retention, and handling records and is not automatically committed to Git.

### Edge Cases

- An information item appears to belong in two core documents; the authority map must identify one
  owner and require references from the other document.
- Existing accepted architecture or ADR content predates the new templates; it remains authoritative
  until a controlled adoption or migration decision references or supersedes it.
- A stakeholder asks for a requirement solely because a reference product displays a feature; the
  observation remains Reference-Coverage Evidence and may support a Reference-Backed Product
  Hypothesis, but it does not by itself establish Internal Operational Need Validation or a complete
  requirement.
- A one-person technical pilot uses two identities; the result may verify authorization and workflow
  behavior but remains limited functional evidence, not independent user acceptance.
- A Technical Pilot Verification has passed but no Internal Adoption Authority is named; technical
  evidence may be retained, while Internal Pilot Acceptance and operational rollout remain blocked.
- The product is internal rather than commercial; templates must not introduce pricing, revenue,
  customer acquisition, market-share, or market-fit objectives.
- A conditional standard applies to Web but not native Desktop, or to a Web-rendered region inside
  Desktop; the document must record the surface boundary instead of applying one profile universally.
- A new standards edition is published after a document is approved; version watch opens an impact
  review and does not silently replace the baselined edition.
- A gate package contains every document but lacks an accountable approver, lawful access needed for
  clause-level use, or required evidence; completeness by file count does not produce a pass.
- A document contains a template prompt, unresolved placeholder, unsupported claim, broken link, or
  duplicated authoritative rule; it cannot enter an approved baseline.
- A prototype is used before PG2; it must remain explicitly throwaway and cannot be cited as proof
  that requirements, architecture, security, accessibility, or quality gates passed.
- An automated accessibility or documentation check reports a high score while manual or
  assistive-technology evidence is absent; the missing evidence remains visible and no conformance
  claim is made.
- A material reference behavior has DDM evidence but no documented quality-benchmark comparison;
  the coverage record remains incomplete and cannot be silently treated as `ADOPT` until the
  required comparison or an explicit `UNKNOWN`/`BLOCKED` disposition is recorded.
- The available reviewer or user population is smaller than the Validation Pack minimum, or a
  proposed approver authored or owns the material decision; the result is recorded as `BLOCKED` or
  `NOT-RUN` rather than being described as independent or representative.
- A product locale is supported in the interface but has no reviewed resource entry, fallback rule,
  or Japanese input/search scenario; the locale profile remains incomplete and cannot be claimed as
  functionally equivalent.

## Requirements *(mandatory)*

### Functional Requirements

#### Controlled set and authority

- **FR-001**: The documentation baseline MUST define exactly these eight core product documents
  for the internal IDEA Engineering product:
  `DOC-01 Product Vision and Scope`, `DOC-02 Feasibility and Options Assessment`,
  `DOC-03 Business Requirements`, `DOC-04 Software Requirements Specification`,
  `DOC-05 Architecture Description`, `DOC-06 Data, Integration, and Migration Specification`,
  `DOC-07 MVP Roadmap and Delivery Plan`, and `DOC-08 UI/UX and Interaction Specification`.
- **FR-002**: The baseline MUST provide one catalogue that states each core document's purpose,
  accountable role, required inputs, owned decisions or information, required outputs, downstream
  consumers, first required gate, later review gates, and explicit non-ownership boundaries.
- **FR-003**: The baseline MUST provide controlled support for governance and standards (`GOV`),
  clean-room provenance (`CLR`), risk (`RSK`), verification planning and evidence (`VVP`, `VEV`),
  configuration and change (`CMP`, `CHG`), release (`REL`), and operations (`OPS`).
- **FR-004**: Existing accepted sources for domain language, standards, clean-room provenance,
  architecture, and ADRs MUST be referenced or adopted through controlled change and MUST NOT be
  duplicated into a competing authority merely to fit the new document names.
- **FR-005**: The baseline MUST provide a single navigation entry point from which an author or
  reviewer can find every core document, supporting record type, gate expectation, and authority
  rule.

#### Common document control

- **FR-006**: Every controlled template MUST require a stable document or record ID, title, owner,
  status, version, applicable baseline, effective date, authors, reviewers, approvers, source links,
  downstream links, evidence class or claim status where applicable, change history, access
  classification, and retention rule where applicable.
- **FR-007**: The documentation baseline MUST define one controlled status vocabulary and allowed
  transitions for drafts, reviews, approvals, supersession, and retirement; document status MUST
  remain distinct from gate outcome.
- **FR-008**: Every template MUST distinguish authored content from instructions or examples so
  that template guidance, prompts, and sample values cannot be mistaken for approved product facts.
- **FR-009**: An approved baseline MUST contain no unresolved template placeholder. Genuine gaps
  MUST instead be represented as identified assumptions, risks, `UNKNOWN`, `BLOCKED`, conditional
  actions, or deferred decisions with an owner and resolution path where applicable.
- **FR-010**: Every material baseline change MUST link to a `CHG` record or traceable Work Item with
  impact analysis, reviewer, approver, effective baseline, and change history.
- **FR-011**: Markdown under version control MUST remain the authoritative editable source unless
  a specific information item has an approved alternative controlled format.
- **FR-012**: Every DOCX or PDF rendition MUST identify the exact source document ID and source
  baseline, rendition date, and rendition status, and MUST NOT silently become a competing editable
  authority.

#### Core-document content contracts

- **FR-013**: `DOC-01` MUST cover internal product purpose, the Problem Hypothesis and its evidence
  class, Internal Operational Value, stakeholders, intended outcomes, system boundary, product
  trajectory, in-scope and out-of-scope areas, non-goals, assumptions, constraints, success
  measures, and open decisions without inventing detailed requirements. A Reference-Backed Product
  Hypothesis MAY support product direction, but Internal Operational Need Validation MUST remain
  explicit when it is not available.
- **FR-014**: `DOC-02` MUST cover feasibility questions, available evidence, candidate options,
  evaluation criteria, constraints, dependencies, risks, unknowns, prototype boundaries, findings,
  recommendation, and decision status. It MUST assess the current internal process, buy-and-
  configure, adapt-or-integrate, and independently build options without treating the build
  direction as feasibility evidence; a prototype MUST be identified as throwaway unless it later
  enters a separately approved production baseline.
- **FR-015**: `DOC-03` MUST cover internal stakeholder and business needs, actors, Internal
  Operational Value, operational scenarios, business processes and rules, priorities, constraints,
  assumptions, acceptance intent, and traceable sources without prescribing implementation. It MUST
  distinguish Reference-Backed Product Hypothesis, Internal Operational Need Validation, Technical
  Pilot Verification, and Internal Pilot Acceptance.
- **FR-016**: `DOC-04` MUST contain uniquely identified functional, interface, data, quality,
  security, privacy, operational, support, and retirement requirements as applicable. Every
  approved requirement MUST state its owning scope, stakeholder need or approved product-decision
  source, rationale, acceptance criterion, verification method, priority, and lifecycle status.
- **FR-017**: Quality requirements in `DOC-04` MUST identify the relevant stimulus, operating
  condition, expected and failure responses, metric or threshold where meaningful, and required
  evidence; an unknown threshold MUST remain a visible decision gap rather than an invented value.
- **FR-018**: `DOC-05` MUST describe the system of interest, stakeholders and concerns, context and
  boundaries, selected viewpoints and views, major responsibilities and ownership, interfaces,
  quality scenarios, risks and treatments, accepted decisions and ADRs, constraints, and
  verification implications.
- **FR-019**: `DOC-06` MUST describe authoritative data concepts and ownership, identities and
  lifecycle, relationships and integrity rules, classification and retention, interfaces and
  exchange semantics, migration scope and mapping, validation, failure behavior, idempotency,
  reconciliation, security, privacy, and verification obligations as applicable.
- **FR-020**: `DOC-07` MUST organize delivery into bounded increments linked to approved
  requirements and risks, and MUST record objectives, dependencies, owners, gate prerequisites,
  exit evidence, acceptance, migration or rollback implications, and deferred scope without
  changing requirements or architecture by roadmap assertion. It MUST represent the MVP Release
  Spine and the vertical-slice order from controlled identity through safe workspace publish,
  engineering release, one deep format profile, and internal pilot/UX hardening.
- **FR-021**: `DOC-08` MUST cover users and context of use, accessibility needs, journeys,
  information architecture, task flows, interaction states, interaction rationale, measurable
  usability objectives, surface-specific accessibility profiles, component interaction and
  semantic contracts, evaluation strategy, traceability, deviations, and residual risk.
- **FR-022**: `DOC-08` MUST apply the registered human-centred design, usability, interaction, and
  cross-surface accessibility sources; it MUST add the registered WCAG profile to Web or
  Web-rendered surfaces and the registered WAI-ARIA profile only where custom Web semantics are
  needed.
- **FR-023**: `DOC-08` MUST NOT treat WCAG as sufficient coverage for native Desktop, MUST prefer
  native Web semantics before WAI-ARIA, and MUST activate EN 301 549 only after an approved
  applicability decision identifies the exact external scope and edition.

#### Evidence, traceability, and gates

- **FR-024**: Research evidence, findings, inferences, unknowns, boundaries, blocked work, IDEA
  decisions, and IDEA requirements MUST preserve the evidence classes and permitted-transfer rules
  defined by the clean-room baseline.
- **FR-025**: Reference-product observations, tutorials, public claims, or authorized runtime
  findings MUST be recorded as Reference-Coverage Evidence. They MAY support a Reference-Backed
  Product Hypothesis and product-direction decision, but MUST NOT be represented as Internal
  Operational Need Validation or become an IDEA requirement without a separately identified IDEA
  stakeholder need or approved product decision, rationale, acceptance criterion, verification
  method, and approval.
- **FR-026**: The documentation baseline MUST support a bidirectional trace from evidence or
  stakeholder need through requirement, architecture/interface/ADR, change, implementation
  revision when one exists, verification result, and release baseline.
- **FR-027**: Traceability views MUST derive from authoritative items and MUST NOT become a second
  source for requirement, design, test, or release content.
- **FR-028**: Broken, orphaned, stale, or unjustified circular trace links affecting a gate MUST be
  visible and MUST prevent that gate from passing until repaired or formally dispositioned.
- **FR-029**: The documentation baseline MUST define the required core documents and supporting
  evidence for PG0 through PG7 and MUST keep the gate outcomes limited to `PASS`,
  `PASS-WITH-ACTIONS`, `FAIL`, and `BLOCKED`.
- **FR-030**: A `PASS-WITH-ACTIONS` outcome MUST require an owner, affected baseline, due condition
  or date, expiry, and escalation path for every action.
- **FR-031**: Material PG2, PG3, PG5, and PG6 baselines MUST require an appropriately independent
  reviewer or approver; when that role is unavailable, the limitation MUST be recorded and the
  gate MUST NOT be self-certified.
- **FR-032**: Production implementation for an increment MUST remain unauthorized until its
  affected requirements baseline has passed PG2, architecture and design baseline has passed PG3,
  and increment readiness has passed PG4 or passed with actions that do not invalidate readiness.

#### Standards and claims

- **FR-033**: Every standards or policy reference MUST identify its controlled source or exact
   selected edition, project classification (`STANDARD`, `STANDARD-GUIDED`, `STANDARD-GUIDED,
   CONDITIONAL`, `REFERENCE/WATCH`, or `PROJECT-CONVENTION`), applicability or tailoring disposition
   (`APPLY`, `TAILOR`, `NOT-APPLICABLE`, or `BLOCKED`), affected information items, evidence
   expectation, owner, and review trigger where applicable.
- **FR-034**: The templates MUST paraphrase public scope information and link to lawfully accessed
  sources; they MUST NOT reproduce protected normative text or restricted competitor material.
- **FR-035**: The baseline MUST NOT claim ISO conformity or certification, WCAG or EN 301 549
  conformance, legal compliance, vendor parity, security, performance, or recovery capability
  merely because a document cites a source or states an intention.
- **FR-036**: Any external conformity or capability claim MUST require an approved scope, exact
  controlled baseline, applicability mapping, objective evidence, deviations and residual risks,
  and the applicable authorized assessment or decision.
- **FR-037**: The documentation baseline MUST distinguish the Canonical Demo Dataset, Technical
  Pilot Verification, Single-Actor Functional Acceptance, Internal Operational Need Validation,
  Internal Pilot Acceptance, and operational rollout authorization. Passing one status MUST NOT be
  represented as passing another.
- **FR-038**: A Technical Pilot Verification MAY proceed in a non-production or explicitly approved
  internal environment without an Internal Adoption Authority. Internal Pilot Acceptance and
  operational rollout MUST require representative internal-user evidence and an attributable
  Internal Adoption Authority disposition.
- **FR-039**: If one human operates multiple separately provisioned identities, the resulting
  evidence MUST be labeled Single-Actor Functional Acceptance and MUST NOT be represented as
  independent review, representative-user acceptance, or company-wide authorization.
- **FR-040**: The baseline MUST define the Internal Pilot Evidence Boundary: repository-safe
  synthetic evidence may be committed to version control, while sanitized or production-derived
  company data remains in an approved storage boundary with classification, owner, access,
  retention, and handling records.
- **FR-041**: The baseline MUST capture the MVP Release Spine and MVP Success Metric Set, including
  exact Released Baseline reproduction, rejection of stale or unauthorized publication, preservation
  of rejected local work, complete required audit and exact-pin evidence, and consistent restore
  evidence; efficiency and adoption claims require separate measurement.
- **FR-042**: The MVP format boundary MUST distinguish the Generic Controlled-File Baseline from
  one DOC-02-selected deep CAD Format Capability Profile, with later profiles addable without
  changing Controlled Product Data ownership or invariants.
- **FR-043**: The baseline MUST state that IDEA Engineering is an internal company product and
  MUST express business value as internal operational control, engineering-data integrity, release
  risk reduction, quality, maintainability, and measured efficiency. It MUST NOT introduce pricing,
  revenue, customer acquisition, market-share, or market-fit objectives.
- **FR-044**: The baseline MUST provide a GOV-owned Material Coverage Inventory and Behavioral Coverage
  Register (implemented as a register, sub-register, or governed section rather than a tenth supporting
  class). The inventory is a closed, versioned list of stable material-area IDs with an owner, inclusion
  criterion, exclusion rationale where applicable, and an explicit as-of baseline/date. A material
  behavior/product area is one that can affect an approved requirement, gate, risk, release, or
  user-visible capability. The Behavioral Coverage Register MUST contain exactly one coverage record
  for every inventory entry at that as-of baseline; new or changed areas enter through a `CHG` record
  and a new inventory baseline. Each record MUST identify the behavior/material area,
  DDM target version/edition/configuration, DDM evidence and limitations, a proactive applicable
  quality-benchmark comparison and evidenced advantage or limitation (or an explicit
  `NO-STRONGER-PATTERN` result when no applicable improvement is evidenced), affected stakeholders and
  risks, the disposition (`ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, or `UNKNOWN`), decision
  owner, rationale, owning IDEA requirement or decision, delivery increment, verification/evidence,
  and visibility of every omitted evidenced DDM behavior as `DEFER` or `EXCLUDE`; unresolved source
  or access gaps MUST remain `UNKNOWN` or `BLOCKED`.
- **FR-045**: The baseline MUST distinguish the English controlled-document source language and
  field vocabulary from the supported product UI locales `en`, `vi`, and `ja`. `DOC-04` and `DOC-08`
  templates MUST capture functional parity across Desktop, Web, and Web-rendered regions using the
  same cross-locale task suite plus reviewed catalogue/input/search scenarios, the Localized Resource
  Catalogue with English fallback, Vietnamese/Japanese review status, persisted
  locale preference, preservation of user-authored Unicode without runtime auto-translation as an
  authority, and Japanese IME, normalization, width, search, font-fallback, and line-breaking
  scenarios; localized DOCX/PDF renditions remain optional and do not replace the English source.
- **FR-046**: The baseline MUST define and retain a Documentation Validation Pack with a
  criterion-based, stratified sampling protocol. Placement items MUST be selected from authored and
  supporting information items using the class/authority map, not convenience. The minimum pack MUST enumerate all 17 classes for
  structural checks; at least 20 placement items spanning all eight core and nine supporting
  classes; at least 8 requirements spanning functional, interface, data, quality, security/privacy,
  operational, accessibility, and localization concerns; 6 reference-coverage cases (including
  evidenced, ambiguous, unknown, stronger-benchmark, no-stronger-pattern, and restricted-evidence
  cases); 4 gate outcomes; 3 surface profiles, each exercised in `en`, `vi`, and `ja` (9
  locale-surface cells); 4 rendition states; and 6 distinct pilot/claim statuses. `DOC-04` and
  `DOC-08` MUST declare the same 3-by-3 surface/locale matrix; a full review of one template therefore
  has 9 locale-surface cells, and a pack claiming both templates fully reviewed MUST retain 18 cells.
  Each selected item MUST have a stable ID, stratum, selection rationale, expected result, executed
  result, evidence link, date, environment, and owner. A convenience sample MUST NOT be used to claim
  universal coverage.
- **FR-047**: The baseline MUST define independence and representativeness criteria for human
  review and acceptance. An independent reviewer MUST neither author nor own the material decision
  under review and MUST record relevant competence or a Specialist Review Gap. The Product Decision
  Authority may decide scope, specification, or technology but does not by that role alone provide
  specialist competence. When the minimum population is available, a human walkthrough MUST include
  at least two participants (the Product Decision Authority and one intended document consumer);
  the Principal Product Author may assist with usability but cannot count as independent approval.
  If the required reviewer, competence, or participant population is unavailable, the outcome MUST
  be `BLOCKED` or `NOT-RUN`; single-actor multi-identity evidence remains `Single-Actor Functional
  Acceptance`.
- **FR-048**: The common control envelope and authored-content/instruction delimiter MUST be applied
  explicitly to every one of the eight core and nine supporting templates. Indexed `DOC-02`
  feasibility instances and `DOC-07` increment records MUST each carry independent instance identity,
  source baseline, status, version, owner, gate, and trace fields; their indexes MUST NOT become a
  second authority for the underlying decision or roadmap content.

### Key Entities

- **Core Product Document**: One of `DOC-01` through `DOC-08`, with a defined authority boundary,
  owner, lifecycle, gate role, inputs, outputs, and controlled baseline.
- **Supporting Record**: A governed `GOV`, `CLR`, `RSK`, `VVP`, `VEV`, `CMP`, `CHG`, `REL`, or
  `OPS` item that carries cross-cutting evidence without replacing core-document authority.
- **Controlled Information Item**: A versioned document or record with stable identity, ownership,
  status, approval, links, history, classification, and retention information.
- **Evidence Reference**: A link to an authorized source and evidence class, including its scope,
  provenance, and limitations without copying restricted material.
- **Reference-Coverage Evidence**: Lawfully available or authorized evidence of an externally
  observable reference-product capability or behavior; it can guide coverage and support a
  Reference-Backed Product Hypothesis but cannot alone validate an internal need.
- **Reference-Backed Product Hypothesis**: An approved product-direction hypothesis supported by
  controlled reference evidence; it justifies continued documentation and feasibility work but is
  not representative internal-user validation.
- **Internal Operational Need Validation**: Controlled evidence from representative company roles,
  workflows, or approved internal records confirming an internal problem, priority, context, and
  desired outcome.
- **Internal Operational Value**: Evidenced benefit to the company through engineering-data
  integrity, release-risk reduction, protected work, traceability, recoverability, maintainability,
  or measured workflow efficiency.
- **Stakeholder Need**: An identified internal stakeholder problem or desired outcome that can justify
  one or more requirements after review.
- **Requirement**: A uniquely identified, stakeholder-backed or decision-backed, verifiable
  obligation with rationale, acceptance, verification method, state, and trace links.
- **Trace Link**: A typed, directional relationship between authoritative information items; a
  trace view reports these links but does not own the linked content.
- **Baseline**: An identified set of exact controlled information-item versions approved for a
  named lifecycle purpose or gate.
- **Gate Decision**: One attributable PG0–PG7 disposition with exact input baselines, rationale,
  outcome, actions, and approval evidence.
- **Change Record**: The controlled identity for a proposed or approved baseline change, including
  its scope, impact analysis, review, approval, and effective baseline.
- **Rendition**: A non-authoritative DOCX or PDF representation tied to one exact authoritative
  source baseline.
- **MVP Release Spine**: The mandatory end-to-end proof from New or Store Existing through controlled
  workspace publish, exact Generation and structure, review, approval, release, export, and
  reproduction, including negative paths.
- **MVP Success Metric Set**: The initial correctness, safety, traceability, local-work preservation,
  exact-pin, and restore outcomes required for the MVP; efficiency and adoption are later measures.
- **Technical Pilot Verification**: A bounded non-production or approved internal execution of the
  MVP Release Spine that may use Test Personas and does not authorize operational rollout.
- **Single-Actor Functional Acceptance**: Limited functional evidence produced when one human operates
  multiple separately provisioned identities; it is not independent review or representative-user
  acceptance.
- **Internal Pilot Acceptance**: The attributable decision allowing a controlled internal pilot after
  representative internal-user evidence, readiness evidence, and Internal Adoption Authority
  disposition are available.
- **Internal Adoption Authority**: The named company role that authorizes Internal Pilot Acceptance
  or broader operational rollout; it is not required merely to run a Technical Pilot Verification.
- **Internal Pilot Evidence Boundary**: The separation between repository-safe synthetic evidence and
  sanitized or production-derived company data held in an approved storage boundary.
- **Behavioral Coverage Record**: A GOV-owned record for one material reference behavior or product
  area containing DDM evidence, the proactive quality-benchmark comparison, disposition, decision
  ownership, affected risks, requirement/decision trace, increment, and verification status. It is a
  register record, not a tenth supporting class and not a core-document authority.
- **Material Coverage Inventory**: The GOV-owned, versioned as-of list of stable material behavior or
  product-area IDs that defines the denominator for Behavioral Coverage Register completeness, including
  inclusion criteria, explicit exclusions, owner, effective baseline/date, and `CHG` history.
- **Documentation Validation Pack**: The controlled set of stratified sample definitions, minimum
  populations, expected outcomes, executed results, reviewer assessments, and retained evidence used
  to validate this documentation baseline.
- **Locale Profile**: A DOC-04/DOC-08 record keyed by one supported product locale and one surface.
  The required Cartesian matrix is `en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop (9
  locale-surface cells per core template), and each record captures the English source boundary,
  resource-catalogue/fallback state, review status, Unicode/input/search cases, and parity evidence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 core document templates and all 9 supporting record classes have a documented
  purpose, authority boundary, accountable role, inputs, outputs, and gate mapping, with no missing
  catalogue entry.
- **SC-002**: In a controlled review sample, 100% of approved documents contain every applicable
  common control field and contain zero unresolved template prompts or sample values.
- **SC-003**: In the Validation Pack's criterion-selected set of at least 20 representative
   information items (including every class, a shared-fact case, and a non-ownership case), internal
   pilot authors place at least 90% in the correct authoritative core document or supporting record
   without maintainer assistance; every cross-document use points back to that authority.
- **SC-004**: In the sample baseline, 100% of approved requirements have a unique identity, an
  eligible source need or decision, rationale, acceptance criterion, verification method, and
  upstream/downstream trace appropriate to their lifecycle state.
- **SC-005**: A reviewer can traverse any sampled requirement from its origin to all existing
  downstream design, change, verification, and release references, and back again, in under 5
  minutes, with zero broken or orphaned links in a passing gate package.
- **SC-006**: In 100% of seeded reference-evidence cases, the evidence class and scope remain
  visible; the case may support a Reference-Backed Product Hypothesis, but no reference observation
  is represented as Internal Operational Need Validation or an IDEA requirement without the
  independent requirement-translation evidence required by this specification.
- **SC-007**: In 100% of gate-decision tests, the reviewer can identify the exact input baselines
  and one permitted outcome; all conditional actions include owner, affected baseline, due
  condition or date, expiry, and escalation path.
- **SC-008**: A reviewer can determine the applicable HCD and accessibility profile for native
  Desktop, Web, and Web-rendered Desktop regions from `DOC-08` in under 10 minutes, without
  treating a conditional or watched source as universally applicable.
- **SC-009**: In 100% of rendition checks, each DOCX or PDF identifies its exact source document
  and baseline, and a superseded rendition is distinguishable from the current source without
  opening repository history.
- **SC-010**: At least 90% of pilot gate reviewers can locate the required decision, evidence,
  owner, open risk, and next action for a sample increment within 10 minutes without consulting
  private chat transcripts or production source code.
- **SC-011**: In 100% of core-document template checks, the internal-product boundary is explicit
  and no template contains pricing, revenue, customer acquisition, market-share, market-fit, or
  external buyer objectives.
- **SC-012**: In 100% of pilot-evidence checks, Canonical Demo Dataset results, Technical Pilot
  Verification, Single-Actor Functional Acceptance, Internal Operational Need Validation, Internal
  Pilot Acceptance, and rollout authorization are distinguishable; no lower status is labeled as a
  higher one.
- **SC-013**: In 100% of MVP-scope checks, the template identifies the MVP Release Spine, the
  Generic Controlled-File Baseline, the one selected deep CAD profile boundary, and the MVP Success
  Metric Set without promising unsupported format breadth or efficiency gains.
- **SC-014**: In 100% of pilot-data checks, repository content contains only approved synthetic or
  metadata evidence, while sanitized or production-derived company data has a recorded approved
  storage boundary, classification, owner, access, retention, and handling disposition.
- **SC-015**: In a structured reviewer walkthrough, at least 90% of participants correctly explain
   whether each sampled claim is reference-backed, internally validated, technically verified,
   independently reviewed, or rollout-authorized without consulting private chat or source code.
- **SC-016**: In a seeded Behavioral Coverage Register review using the GOV-owned Material Coverage
   Inventory as the exact denominator at its recorded as-of baseline/date, 100% of inventory entries
   have one matching coverage record containing the required DDM evidence, target/configuration,
   proactive benchmark comparison (or explicit `NO-STRONGER-PATTERN` result), affected stakeholder/
   risk, disposition, owner/rationale, IDEA trace, increment, and verification fields; every omitted
   evidenced behavior is visibly `DEFER` or `EXCLUDE`, and no case is silently marked `ADOPT` without
   the required comparison.
- **SC-017**: In 100% of the retained `DOC-04` and `DOC-08` locale-profile matrices, the English
    controlled source is distinguished from `en`, `vi`, and `ja` product locales across all 9
    locale-surface cells (3 locales × Desktop/Web/Web-rendered Desktop), the resource catalogue and
    English fallback are identified, review status and persisted preference are recorded, user-authored
    Unicode is preserved, and the same cross-locale task suite plus Japanese
    IME/normalization/width/search/font/line-breaking scenarios are either evidenced or explicitly
    `UNKNOWN`/`BLOCKED`.
- **SC-018**: In every retained Documentation Validation Pack, all required strata and minimum sample
   counts are enumerated, each item has a selection rationale and stable ID, and 100% of executed
   checks have an attributable result (`PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED`, or `NOT-RUN`)
   with exact baseline, environment, date, owner, and evidence link; no convenience sample is used
   to generalize beyond its stated scope.
- **SC-019**: In 100% of sampled human review/acceptance records, independence, competence or a
   Specialist Review Gap, representativeness, and author/owner separation are explicitly assessed;
   when the minimum two-person population is available it is used, and when it is unavailable the
   record is `BLOCKED` or `NOT-RUN` rather than an unqualified pass.

## Assumptions

- This feature creates the controlled templates, catalogue, guidance, trace contract, and
  supporting-record model. Populating all eight documents with a complete approved IDEA product
  baseline is subsequent product-definition work performed through PG1–PG3.
- IDEA Engineering is an internal company product with one current Operating Organization. The
  initial technical group and representative internal project remain open decisions; the templates
  must not imply company-wide rollout or a commercial product model.
- Controlled reference evidence is sufficient to accept a Reference-Backed Product Hypothesis for
  product direction, documentation, and feasibility work. Internal Operational Need Validation,
  representative user acceptance, and measured Internal Operational Value remain `UNKNOWN` or
  `BLOCKED` until internal evidence exists.
- A Technical Pilot Verification may proceed in a non-production or explicitly approved internal
  environment without an Internal Adoption Authority. Internal Pilot Acceptance and operational
  rollout require representative internal-user evidence and an attributable Internal Adoption
  Authority disposition.
- One human may operate two separately provisioned identities for bounded functional verification;
  the result is Single-Actor Functional Acceptance and is not independent review or representative
  user acceptance.
- The MVP Release Spine, Generic Controlled-File Baseline, one DOC-02-selected deep CAD profile,
  and MVP Success Metric Set are product-scope inputs to the templates, not implementation promises.
- Pilot data derived from company projects remains in an approved storage boundary with its own
  classification, owner, access, retention, and handling controls; it is not automatically committed
  to version control.
- Repository Markdown and field names remain in English to match the current controlled baseline;
  product UI behavior is separately specified for `en`, `vi`, and `ja`; approved localized renditions
  may be added later without changing source authority.
- The GOV-owned Material Coverage Inventory and Behavioral Coverage Register do not increase the
  supporting-class count beyond nine. The inventory closes the material-area denominator at an explicit
  as-of baseline/date; every inventory entry receives one coverage record and a proactive benchmark
  comparison before a default `ADOPT` disposition. Inaccessible or insufficient evidence remains
  `UNKNOWN`/`BLOCKED`.
- The initial Documentation Validation Pack uses criterion-based stratified sampling with the
  minimum populations and cases defined in FR-046. Human participation is attempted when available;
  missing reviewers, competence, or representative participants are recorded as `BLOCKED`/`NOT-RUN`.
- Product Decision Authority assignment can cover scope, specification, and technology decisions;
  specialist review gaps and author/owner conflicts remain visible and cannot be cured by assigning
  multiple logical roles to one person.
- The accepted constitution, `CONTEXT.md`, standards register, clean-room register, product
  architecture, design-lesson register, and accepted ADRs remain authoritative within their
  current scope and are linked rather than copied.
- Logical roles may initially be held by a small number of people, but required independent review
  cannot be simulated by relabeling the principal author.
- The registered standards are guidance or proposed project bases according to their recorded
  classifications. Lawful access and clause-level tailoring remain separate PG0 obligations.
- DDM, Aras, and icVault research may generate questions, classified reference evidence, evidence-
  bounded findings, risks, and design lessons; the feature does not authorize acquisition, reverse
  engineering, redistribution, or unscoped parity claims. Aras names and comparisons remain outside
  DOC-01 through DOC-08.
- No commercial customer, pricing, revenue, market-fit, EU procurement, regulatory, certification,
  or formal conformity scope is currently baselined; future applicability enters through controlled
  change.

## Out of Scope

- Writing production application code, choosing a technology stack, or treating a prototype as
  the production baseline.
- Fully authoring and approving the substantive IDEA contents of all eight core documents in this
  feature.
- Conducting Internal Pilot Acceptance, authorizing operational rollout, or claiming company-wide
  adoption; this feature only creates the documentation controls that record those later decisions.
- Validating Internal Operational Need or measured efficiency through reference-product evidence
  alone.
- Replacing canonical domain language, accepted ADRs, the product architecture, the standards
  register, or the clean-room register without their own controlled change decisions.
- Copying DDM/icVault source, schemas, binaries, licensed documentation, UI assets, or proprietary
  implementation details into IDEA documents.
- Declaring formal ISO conformity or certification, WCAG/EN 301 549 conformance, legal compliance,
  or vendor parity.
- Introducing commercial product objectives, customer segmentation, pricing, revenue, or market-fit
  claims into the internal product-definition system.
- Deciding the production stack, deployment topology, identity provider, database, object store,
  supported format list, PLM module sequence, C2, or Interoperability Fabric D.
- Treating the Behavioral Coverage Register as a tenth supporting class, or using a Validation Pack
  result to claim product parity, formal conformity, representative adoption, or production readiness.
