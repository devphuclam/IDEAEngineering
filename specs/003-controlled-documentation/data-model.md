# Phase 1 Data Model: Controlled Product Documentation

**Feature**: `003-controlled-documentation`
**Boundary**: Information-item model for the documentation baseline; this is not the product
runtime data model and does not choose a database or API.

## 1. Model boundary and authority

The model separates three layers:

```text
Reference/evidence and stakeholder input
        ↓
Supporting records (provenance, governance, risk, V&V, change, release, operations)
        ↓
Eight Core Product Document classes (approved IDEA product definition)
        ↓
Feature/increment artifacts and later implementation evidence
```

One controlled item owns each authoritative statement. Other items store a typed trace link and a
short conclusion, not a duplicate rule. `CONTEXT.md`, the constitution, accepted ADRs, the standards
register, and the clean-room register remain higher-authority sources in their existing scopes.

## 2. The eight Core Product Document classes

`DOC-01` through `DOC-08` are classes, not filenames, Git branches, or document instances. The
planned repository placement for their eventual Markdown templates is `docs/product/definition/`.
The accountable person for each instance must be named in its control envelope; the role column
below identifies the current role boundary, not a substitute for that assignment.

| Class | Name | Owns | Accountable role boundary | First gate | Later gates | Does not own |
|---|---|---|---|---|---|---|
| `DOC-01` | Product Vision and Scope | Internal purpose, Problem Hypothesis, evidence class, Internal Operational Value, stakeholders, boundary, trajectory, non-goals and success measures | Product Decision Authority; Principal Product Author prepares | PG1 | PG2, PG3, PG7 as changed | Detailed software requirements, architecture choices, implementation schedule |
| `DOC-02` | Feasibility and Options Assessment | Feasibility questions, current-process baseline, buy/configure, adapt/integrate and independent-build options, evidence, risks, prototype boundaries and recommendation | Product Decision Authority; Principal Product Author prepares | PG1 | PG2 and PG4 when an increment option is selected | Requirement authority, architecture baseline, production feasibility claims from an unapproved prototype |
| `DOC-03` | Business Requirements | Internal stakeholder needs, actors, operational scenarios, business processes/rules, priorities, constraints and acceptance intent | Product Decision Authority; Principal Product Author prepares | PG1 | PG2, PG3, PG7 as needs evolve | Software design, technology selection, external customer or commercial objectives |
| `DOC-04` | Software Requirements Specification | Uniquely identified functional, interface, data, quality, security, privacy, operational, support and retirement requirements | Product Decision Authority approves; Principal Product Author prepares; specialist review where applicable | PG2 | PG3, PG4, PG5, PG7 | Architecture solution, implementation code, unsupported conformity claims |
| `DOC-05` | Architecture Description | System context/boundaries, viewpoints/views, responsibilities, interfaces, quality scenarios, risks, ADR links and verification implications | Product Decision Authority approves; Principal Product Author coordinates; architecture specialist review where available | PG3 | PG4, PG5, PG7 | Business need authority, vendor implementation copying, unapproved technology commitments |
| `DOC-06` | Data, Integration, and Migration Specification | Data concepts/ownership, identity, lifecycle, relationships, integrity, classification, retention, exchange semantics, migration mapping, reconciliation and failure obligations | Product Decision Authority approves; Principal Product Author coordinates; data/integration specialist review where available | PG2 | PG3, PG4, PG5, PG7 | Runtime schema implementation, direct external-system authority, bulk migration approval without evidence |
| `DOC-07` | MVP Roadmap and Delivery Plan | Bounded increments, MVP Release Spine, dependencies, owners, gate prerequisites, exit evidence, acceptance, rollback/migration implications and deferred scope | Product Decision Authority; Principal Product Author maintains | PG1 | PG2, PG3, PG4, PG7 | Changing requirements or architecture by schedule assertion, commercial release promises |
| `DOC-08` | UI/UX and Interaction Specification | Users/context, journeys, information architecture, task flows, interaction states/rationale, usability objectives, surface-specific accessibility profiles, component contracts and evaluation strategy | Product Decision Authority approves; Principal Product Author prepares; HCD/accessibility review where available | PG1 | PG2, PG3, PG4, PG5, PG7 | Business rules owned by DOC-03, software requirements owned by DOC-04, universal WCAG or conformity claims |

The class-to-instance rule is hybrid: `DOC-01`, `DOC-03`, `DOC-04`, `DOC-05`, `DOC-06`, and `DOC-08`
maintain living product baselines; `DOC-02` owns indexed feasibility assessments; `DOC-07` owns a
living roadmap plus increment delivery records. This is an authority decision, not permission to
create competing copies.

## 3. Supporting record classes

Supporting records are planned under `docs/product/definition/registers/`. Existing accepted
governance and research files remain authoritative where they already own a subject; these templates
provide controlled links and record shapes rather than silently replacing those files.

| Class | Record purpose | Typical owner | Core-document relationship |
|---|---|---|---|
| `GOV` | Governance, standards applicability, roles, gate model and tailoring decisions; owns the Behavioral Coverage Register as a register/sub-register | Life-cycle and Quality Authority / Product Decision Authority | Supplies gate, standards and coverage conclusions; does not own product requirements |
| `CLR` | Clean-room provenance, source hash, evidence class, transfer permission and limitations | Clean-room/provenance owner | Supplies admissible evidence references; never transfers restricted implementation |
| `RSK` | Risk, treatment, owner, status, residual risk and escalation | Risk owner designated for the concern | One risk record may be linked by many core documents |
| `VVP` | Verification and validation strategy, procedures, environments and evidence expectations | Verification lead / Principal Product Author | Defines how requirements and claims will be checked |
| `VEV` | Executed verification result, configuration, procedure, outcome and retained evidence | Verifier | Records actual evidence; cannot rewrite the requirement or gate |
| `CMP` | Configuration items, baselines, status accounting, version watch and controlled source | Configuration manager / Principal Product Author | Identifies exact document and rendition baselines |
| `CHG` | Material change identity, impact analysis, review, approval and effective baseline | Change owner | Connects changes to affected DOCs, requirements, risks, tests and releases |
| `REL` | Release baseline, manifest, hashes, provenance, known issues, residual risk and recovery evidence | Release authority | Pins a releasable set of exact controlled items |
| `OPS` | Operations, support, incident, recovery, retention and retirement records | Platform/operator role when assigned | Feeds operational evidence and learning back to DOC-01/03/04/07 |

There are exactly nine supporting record classes in this increment. Traceability is a cross-cutting
view over these records, not a tenth competing source class.

### 3.1 GOV-owned Material Coverage Inventory and Behavioral Coverage Register

The Material Coverage Inventory and Behavioral Coverage Register are GOV-owned register/sub-register
shapes. They are records within `GOV`, not a tenth supporting class and not a core-document authority.
The inventory is the closed denominator for a named as-of baseline; it contains one stable entry for
each material behavior/product area and records why an area is included or explicitly excluded. The
Behavioral Coverage Register contains exactly one record for every inventory entry at that baseline.
Changes to the inventory require a `CHG` record and a new effective inventory baseline.

#### Material Coverage Inventory fields

| Field | Rule |
|---|---|
| Inventory ID / material-area ID | Stable identity; never reused after retirement |
| As-of baseline/date | Exact effective baseline and date that close the completeness denominator |
| Inclusion criterion | Why the area can affect an approved requirement, gate, risk, release, or user-visible capability |
| Exclusion rationale | Required for an explicitly excluded candidate; must name the reviewing authority |
| Owner and review status | Accountable GOV role/person, current status, and next review trigger |
| Change history | `CHG`/Work Item links for additions, removals, scope changes and supersession |

#### Behavioral Coverage Register fields

One record covers one inventory entry:

| Field | Rule |
|---|---|
| Coverage ID / material area | Stable identity and concise boundary |
| Inventory linkage | Material Coverage Inventory ID and exact as-of baseline/date |
| DDM target and evidence | Version/edition/configuration, evidence IDs, scope, limitations and lawful-access basis |
| Quality-benchmark comparison | Applicable comparison, evidenced advantage/limitation, affected stakeholders and risks |
| Disposition | Exactly one of `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, `UNKNOWN`; unresolved access/evidence may be `BLOCKED` |
| Decision and ownership | Decision owner, rationale, approving authority and effective baseline |
| IDEA trace | Owning IDEA requirement or product decision, delivery increment and downstream links |
| Verification | Planned/executed evidence, exact configuration/baseline and result |
| Omission visibility | Every omitted evidenced DDM behavior is explicitly `DEFER` or `EXCLUDE`; no silent omission |

The default `ADOPT` candidate is not complete until the applicable proactive benchmark comparison is
recorded. A material adaptation records the DDM limitation, proposed improvement, impact and approval.
Reference names and comparison details remain in this supporting record or linked research, never in
the eight core templates.

## 4. Common controlled information-item envelope

Every core-document instance and supporting-record instance inherits these conceptual fields:

| Field | Rule |
|---|---|
| Stable ID | Unique semantic identity independent of class code, path, filename or Git commit |
| Class/type | Exactly one of the eight core classes or nine supporting classes |
| Title | Human-readable title; must not be used as identity |
| Owner | Named accountable role/person; an unassigned required owner leaves the applicable gate blocked |
| Status | Controlled document/record lifecycle status, separate from gate outcome |
| Version | `major.minor` content version; Git commit is supporting evidence, not this value |
| Applicable baseline | Exact product, gate, increment or policy baseline to which the item applies |
| Effective date | Date/time from which the approved item is authoritative |
| Authors | Attributable preparation identities |
| Reviewers | Review identities and competence/independence note where applicable |
| Approvers | Attributable approval identities and authority basis |
| Source links | Upstream evidence, stakeholder need or product decision links |
| Downstream links | Requirements, design, changes, verification and release links that exist |
| Evidence class / claim status | Required whenever the item contains a research claim, pilot result or capability claim |
| Change history | Links to `CHG`/Work Items and prior versions, including impact disposition |
| Access classification | Repository or approved-storage classification |
| Retention rule | Applicable retention/hold/purge rule, or explicit `NOT APPLICABLE` |

An approved item is a `Complete Controlled Draft` before approval: every required section contains
evidence-backed content or an explicit `UNKNOWN`, `BLOCKED`, or `NOT APPLICABLE` disposition with an
owner and resolution action. Blank template prompts and sample values are not product content.

## 5. Evidence, claim and trace entities

### 5.1 Evidence Reference

Fields: `evidence_id`, authorized source URI/path, source artifact hash or exact controlled edition,
observation/publication date, evidence class, target version/configuration, scope, limitations,
lawful-access basis, permitted transfer, sanitizer/handling record, and linked finding.

Allowed evidence classes follow the clean-room baseline: `TARGET-RUNTIME FACT`, `TARGET-STATIC FACT`,
`VENDOR-PUBLIC`, `INFERENCE`, `UNKNOWN`, `BOUNDARY`, `BLOCKED`, `IDEA DECISION`, and `IDEA REQUIREMENT`.
Reference-product observations are additionally labeled `Reference-Coverage Evidence` in the product
translation layer. A `Reference-Backed Product Hypothesis` is a product-direction claim, not internal
need validation.

### 5.2 Product and requirement entities

- **Stakeholder Need**: internal problem or desired outcome, with role/context, evidence, priority,
  acceptance intent and owner.
- **Product Decision**: approved choice or disposition, with alternatives, rationale, authority,
  effective baseline and change history.
- **Requirement**: stable ID, owning DOC, source need/decision, rationale, stimulus/condition,
  expected and failure response, metric where meaningful, acceptance criterion, verification method,
  priority, lifecycle status and trace links.
- **Design Reference**: architecture, interface, interaction or ADR response linked from a
  requirement; it is not allowed to silently override the requirement.
- **Change Record**: stable ID, change proposal, scope, impact analysis, affected baselines,
  reviewers, approver, effective baseline, rollback/recovery and supersession history.
- **Verification Result**: exact configuration, environment, procedure, timestamp, result,
  evidence link, deviations, residual risk and outcome (`PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN` as
  applicable to verification). Missing or blocked work is never a pass.
- **Release Baseline**: immutable set of exact item versions, hashes/provenance, verification
  summary, known issues, residual risk, rollback/recovery and release authorization.

### 5.3 Gate and pilot entities

- **Gate Decision**: gate (`PG0`–`PG7`), exact input baselines, reviewer/approver roles, rationale,
  actions, date and one outcome: `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`.
- **Rendition**: non-authoritative DOCX/PDF with source stable ID, source document version or
  immutable baseline, rendition date, producer/tool identity where applicable, and rendition status.
- **Pilot Evidence Record**: dataset/project identity, environment, identities/personas, scope,
  data classification/storage, test spine, evidence class, result, limitations and authority.
- **Standards Applicability Record**: standard ID and exact edition, classification, surface/scope,
  `APPLY`/`TAILOR`/`NOT-APPLICABLE`/`BLOCKED` disposition, evidence expectation, owner, approver and
  review trigger. Classification is exactly `STANDARD`, `STANDARD-GUIDED`, `STANDARD-GUIDED,
  CONDITIONAL`, `REFERENCE/WATCH`, or `PROJECT-CONVENTION`.

Pilot claim statuses must remain distinct: `Canonical Demo Dataset`, `Technical Pilot Verification`,
`Single-Actor Functional Acceptance`, `Internal Operational Need Validation`, `Internal Pilot
Acceptance`, and operational rollout authorization. A lower status cannot be relabeled as a higher
one.

### 5.4 Locale Profile

Fields: `locale_profile_id`, owning requirement (`DOC-04` or `DOC-08`), English source baseline,
supported product locale (`en`, `vi`, or `ja`), surface (`Desktop`, `Web`, or `Web-rendered Desktop`),
and a stable `locale_surface_cell_id` derived from the locale/surface pair. Each core template declares
the complete Cartesian matrix of 3 locales × 3 surfaces (9 cells); a profile is one cell, not one
locale-only or surface-only sample. The record also carries the Localized Resource Catalogue reference,
English fallback, Vietnamese/Japanese `Locale Review Status`, persisted preference behavior,
Unicode-preservation rule, Japanese IME/normalization/width/search/font-fallback/line-breaking
scenarios, parity evidence, deviations and residual risk. Localized renditions are optional
representations and cannot replace the English source.

### 5.5 Documentation Validation Pack

Fields: `pack_id`, source baseline, sampling date, selector/owner, stratum, sample item ID, selection
rationale, expected result, executed result, exact configuration/environment, evidence link, reviewer
identity, competence/independence assessment, representativeness assessment, disposition and next
action. Minimum strata are 17 class rows, 20 placement items, 8 cross-domain requirements, 6 reference
cases, 4 gate outcomes, 3 surface profiles plus 9 locale-surface cells, 4 rendition states and 6
pilot/claim statuses. The 9 cells are the full `en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop
matrix for one core-template review; a pack claiming both `DOC-04` and `DOC-08` fully reviewed retains
18 cells. The pack is criterion-based and stratified; a convenience sample cannot generalize beyond
its stated scope.

### 5.6 Reviewer/acceptance assessment

Fields: participant identity and role, author/owner conflict check, competence or `Specialist Review
Gap`, intended-user context, population available/required, independence result, representativeness
result, outcome (`PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED`, or `NOT-RUN`) and evidence link. The
minimum two-person walkthrough uses the Product Decision Authority and one intended document
consumer when available; the Principal Product Author cannot count as the independent approver.

## 6. Relationships and cardinality

```text
Evidence Reference 1 ── * Finding/Design Lesson
Finding/Design Lesson 1 ── * Product Decision or Stakeholder Need
Product Decision/Need 1 ── * Requirement
Requirement 1 ── * Design Reference / ADR / Interface
Any controlled item 1 ── * Change Record links
Requirement/Design 1 ── * Verification Result
Verification Results * ── 1 Release Baseline
Release Baseline 1 ── * Rendition
Core Document Class 1 ── * Controlled Document Instance
Supporting Record Class 1 ── * Supporting Record Instance
Core/Supporting item * ── * Gate Decision (through exact input links)
Pilot Evidence Record * ── * Requirements, Risks and Gate Decisions
Material Coverage Inventory 1 ── * Behavioral Coverage Record
Behavioral Coverage Record 1 ── * Evidence / Product Decisions / Requirements / Verification Results
Documentation Validation Pack 1 ── * Sampling Records / Reviewer Assessments
Locale Profile * ── * Requirements / Surface Profiles / Verification Results
```

The arrows describe trace references, not database ownership. A trace view may materialize these
links, but it never becomes a second authority for the linked content.

## 7. Lifecycle, status and version rules

### 7.1 Document status

The controlled document status vocabulary is:

```text
Draft ──→ Proposed ──→ Approved ──→ Superseded
  ↑          │            │             │
  └──────────┘            └─────────────┴──→ Retired
```

- `Draft` is editable preparation; it may return from `Proposed` when review finds a material gap.
- `Proposed` is complete enough for review but not authoritative product baseline.
- `Approved` is the current authoritative version for its scope after the applicable decision.
- `Superseded` identifies an older approved version replaced by a newer approved version.
- `Retired` is terminal for the item after retention and dependency checks; it is not deletion.

The exact transition event, actor eligibility and gate evidence are recorded in `CMP`, `CHG` and the
applicable `Gate Decision`. Document status is never replaced by `PASS`, `FAIL` or `BLOCKED`.

### 7.2 Document version, product Generation and Business Revision

| Concept | Increment rule | Not interchangeable with |
|---|---|---|
| Document Version | `0.x` for Draft/Proposed; `1.0` first Approved; major for material authority/contract change; minor for compatible content | Git commit, product Generation, Business Revision |
| Product Generation | Increase only when changed Product Definition is published inside a Business Revision | Document Version, save count |
| Business Revision | New governed business milestone from the applicable Revision Policy, normally based on a released predecessor | Generation, document status |
| Git commit | Immutable repository evidence for the source snapshot | Document Version or approval by itself |

`Start` and `In Work` are product workflow states for a Business Revision, not document statuses. A
new document template cannot infer a product release merely because its Markdown commit exists.

## 8. Integrity invariants

1. The catalogue contains exactly eight core classes and exactly nine supporting classes.
2. Every instance has one stable ID and one class/type; class code and instance ID remain distinct.
3. Every approved instance has the common control envelope and no unresolved template prompt/sample.
4. One authoritative owner exists for each statement; cross-document copies are references.
5. Every requirement has an eligible source, rationale, acceptance criterion, verification method and
   lifecycle-appropriate trace.
6. Every material change has a `CHG`/Work Item and impact coverage for requirements, architecture,
   data, interfaces, UI/UX, risks, tests, roadmap, operations and releases or explicit N/A rationale.
7. Reference-Coverage Evidence cannot alone become Internal Operational Need Validation or an IDEA
   requirement.
8. Aras evidence and comparison remain in supporting research/coverage/ADR/governance records; core
   DOC content uses IDEA product language only.
9. A missing independent reviewer, Internal Adoption Authority or required evidence leaves the
   applicable gate/pilot disposition `BLOCKED`; it is not silently self-certified.
10. Repository content may contain approved synthetic evidence and metadata; sanitized or
    production-derived company data remains in an approved storage boundary.
11. Every rendition points to one exact source baseline and becomes stale/superseded when that source
    changes.
12. Standards claims require exact edition, applicability, objective evidence and authorized scope;
    citation alone never proves conformity.
13. The Material Coverage Inventory and Behavioral Coverage Register are owned by `GOV`; they do not
    change the exact nine supporting-class count. The inventory is the closed denominator at an explicit
    as-of baseline, and every inventory entry has one coverage record with a proactive benchmark
    comparison before `ADOPT`.
14. Locale obligations distinguish English controlled source from `en`/`vi`/`ja` product profiles;
    missing catalogue, review, Unicode or Japanese scenarios remain `UNKNOWN`/`BLOCKED`.
15. Validation Pack samples are stratified and retain selection rationale and execution metadata;
    missing reviewer, competence or minimum population cannot yield an unqualified pass.

## 9. Deferred modeling decisions

The following are intentionally not runtime fields or fixed values in this feature: production
database/schema, API protocol, identity provider, deployment topology, exact format list, deep CAD
profile, retention/RPO/RTO thresholds, named pilot participants, and the full PLM module sequence.
Later requirements and architecture work may extend the model through controlled change without
changing the eight-class authority boundary or the invariants above.
