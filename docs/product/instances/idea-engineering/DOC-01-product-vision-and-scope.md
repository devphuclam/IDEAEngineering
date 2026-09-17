# IDEA Engineering Product Vision and Scope

> **Instance state**: controlled `Draft 0.7`. This document defines the internal-first product
> purpose, current scope boundary and long-term trajectory. It does not approve detailed
> requirements, architecture, technology, implementation or commercial release.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Document ID | `IE-PROD-VISION-001` |
| Document Class | `DOC-01` |
| Title | IDEA Engineering Product Vision and Scope |
| Owner | `Principal Product Author`; named person attribution is `BLOCKED` before `Proposed` |
| Document Status | `Draft` |
| Document Version | `0.7` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors | `Principal Product Author`; named identity not yet recorded |
| Reviewers | Project user performs internal document review; formal attribution and any required independent/specialist qualification remain to be recorded |
| Approvers | `Product Decision Authority` for Feature; identity, decision and date are `UNKNOWN` |
| Source Links | [Product-knowledge index](../../knowledge/README.md), [accepted design lessons](../../knowledge/idea-design-lessons.md), [product architecture baseline](../../../architecture/idea-product-lifecycle-architecture.md), [project domain language](../../../../CONTEXT.md), [internal-first commercial direction](registers/CHG-2026-09-17-internal-first-commercial-direction.md) |
| Downstream Links | [DOC-02](DOC-02-feasibility-and-options-assessment.md), [DOC-03](DOC-03-business-requirements.md), [DOC-07](DOC-07-mvp-roadmap-and-delivery-plan.md), [FEATURE-001](decision-briefs/FEATURE-001-feature-definition-and-scope.md), [coverage register](registers/GOV-material-and-behavioral-coverage.md), [future commercial readiness register](registers/GOV-future-commercial-readiness.md) |
| Evidence / Claim Status | Accepted scope decisions plus `Reference-Backed Product Hypothesis`; internal operational validation remains `BLOCKED` |
| Change History | 0.7: record the internal-first product purpose and a several-years-away commercial trajectory without adding a current commercial Feature, requirement, task or release commitment; [IE-CHG-COMMERCIAL-DIR-001](registers/CHG-2026-09-17-internal-first-commercial-direction.md). 0.6 separated administration responsibilities. Earlier history remains in controlled change records. |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the product-definition baseline; exact organizational period is `UNKNOWN`, owned by Product Decision Authority and reviewed before `Approved` |
| Content State | `COMPLETE CONTROLLED DRAFT` with explicit unresolved actions |

<!-- AUTHOR CONTENT START -->

## 1. Internal purpose

IDEA Engineering is intended to give the company one controlled way to identify, change, review,
release and reproduce engineering documents and product structures. The initial problem hypothesis is
that ordinary file locations and application-local histories do not, by themselves, provide a stable
product identity, a trustworthy released baseline or sufficient evidence of who approved what.

This is an internal engineering-control initiative for the next several years. It has no current
sales, pricing, external-buyer, market-share or customer-acquisition objective. The long-term
direction permits a separately approved commercial successor, so current work avoids unnecessary
company-specific or license-related dead ends without building commercial operations now.

### 1.1 Problem hypothesis and evidence class

| Field | Recorded value |
|---|---|
| Problem hypothesis | Engineering work needs stable identity, controlled local editing, immutable publication, exact structure, accountable approval and repeatable release recovery across Office and CAD files. |
| Evidence class | `Reference-Backed Product Hypothesis` plus accepted `IDEA DECISION`; not yet an internally measured problem statement |
| Evidence references | Product-knowledge baseline and accepted design lessons linked in the control envelope; evidence limitations remain attached to the source records |
| Internal need status | `BLOCKED`: no representative internal project, user population, current-process measurement or Internal Adoption Authority has been assigned. Owner: Product Decision Authority. Action: nominate a pilot boundary and participants. Trigger: before any claim of internal need validation or pilot acceptance. |

### 1.2 Intended internal outcome

The intended outcome is a controlled engineering release whose exact document identities,
Generations, metadata, structure, approvals and file digests can be demonstrated and reproduced. Core
v0 must also protect local work when publication is rejected because the server state has advanced or
the user lacks the right reservation, workspace or approval authority. A department may supply CAD,
PDF, software, instructions, checklists or other governed evidence through this release spine. Values
such as hours, cost, purchasing status, fabrication status or project progress remain operational
context unless a later approved capability gives IDEA explicit authority for that business process.

## 2. Stakeholders and operating context

| Stakeholder / role | Context and need | Decision or evidence link | Owner / review status |
|---|---|---|---|
| Design Engineer | Stores or creates engineering documents, works through normal Office/CAD applications, and needs safe Checkout, Reference, Check-in and recovery. | `BN-001`…`BN-004` in DOC-03 | Representative population `BLOCKED`; Product Decision Authority to nominate before pilot |
| Reviewer / Approver | Must inspect and decide against one exact document and structure baseline. | `BN-005`, `BS-005` in DOC-03 | Seeded role accepted; independent eligible person not assigned |
| Product Configuration Administrator | Configures metadata, numbering, lifecycle and format policies without changing product code for ordinary policy variation. | `BN-006`, `BN-008` in DOC-03 | Role accepted as a separate responsibility; representative owner `UNKNOWN`, assign before PG3 |
| Project Administrator | Adds eligible people to one assigned Project, manages its direct Groups and assigns only approved Project roles. | `BN-006`, `BN-011`, `BS-011` in DOC-03 | Initial holder and delegation limits require controlled configuration before pilot |
| Privileged Role Administrator | Maintains permitted Role Definitions and privileged Role Assignments under explicit Scope and delegation limits. | `BN-006`, `BR-030` in DOC-03 | Security review and production holder `BLOCKED` before live administration |
| Quality / Audit | Needs attributable history and evidence that a released baseline can be explained and reproduced. | `BN-005`…`BN-007` in DOC-03 | Role hypothesis; specialist review `BLOCKED` until assigned |
| Security / Operations | Needs controlled access, backup, restore and operational boundaries. | DOC-04/05/06 and `TECH-CTX-006/008` | User may operate initially; long-term owner, support coverage and validated thresholds remain open before PG3/PG4 |
| Account Administrator | Issues and maintains IDEA accounts and Login Identities; cannot add Project/Group membership or product roles by implication. | `BN-011`, `BR-025…030` in DOC-03 | Project user may perform this role during development; normal company holder is System Management; detailed security policy requires review |
| Principal Product Author | Prepares the eight Core Product Documents and three decision briefs, maintains trace and records unresolved gaps honestly. | Instance README and DOC-07 | Assigned organizational role; named attribution pending |
| Internal Document Reviewer | Project user reviews the assistant-authored documents for clarity and product fit; this does not establish specialist qualification or satisfy a required independent approval. | Instance README | User-assigned role; formal attribution pending |
| Product Decision Authority | Decides exactly three axes in order: Feature, Spec and Tech. | DOC-07 decision plan | Organizational role accepted; named decision record pending |

The initial operating boundary is one internal organization and one controlled product context. A
single person may exercise separately provisioned demo identities, but this cannot be reported as
independent review or representative internal acceptance.

The user confirmed approximately 50–100 intended users at one site, Windows engineering PCs,
administrator-issued IDEA accounts first, and a server that may be proposed to the company. These
are planning inputs, not measured concurrency, validated demand or deployment permission. Other
company login methods remain a later integration. See the [confirmed context and change record](registers/CHG-2026-09-03-tech-context-and-proposal.md)
for the exact inputs and their limits.

## 3. Scope boundary and trajectory

### 3.1 Included scope

Core v0 is the first bounded production implementation target of the MVP Release Spine. It includes:

1. `Store Existing` first, followed by `New` on the same Logical Document identity model.
2. Stable document identity, metadata and numbering, distinct Business Revision and Version, and
   immutable published Generation.
3. A Managed Workspace with explicit per-document `Checkout` or `Reference` intent.
4. Check-in as an atomic confirmed Change Set with expected/current Generation validation.
5. Safe stale-conflict handling that preserves local work and presents valid recovery actions.
6. Immutable Structure Snapshots that pin exact dependencies for reproduction.
7. Submit, review, approve, reject, withdraw and release against exact pinned evidence.
8. An immutable Release Record and Controlled Release Package that can reproduce the released
   baseline.
9. Administrator-issued IDEA accounts and configurable, versioned RBAC, audit, metadata, numbering,
   lifecycle and format policies; Account, Project, Role and Product Configuration administration
   remain separate assignments, and none grants product Approval or Release authority by implication.
10. A Generic Controlled-File Baseline plus Office/PDF handling and IRONCAD as the first deep CAD
    Capability Profile, subject to DOC-02/DOC-06 evidence.
11. User-interface resources for English, Vietnamese and Japanese, with English fallback.

The exact feature baseline is enumerated as `FTR-001`…`FTR-014` in FEATURE-001 and traced to the
business needs in DOC-03. Inclusion here is a scope decision, not evidence that the feature has been
implemented or verified.

### 3.2 Explicit exclusions and deferred scope

| Item | Disposition | Rationale | Owner / review trigger |
|---|---|---|---|
| Advanced search and saved-query administration | `DEFER` | Not necessary to prove controlled identity and one complete Release Spine. | Principal Product Author; revisit after safe publish is verified |
| Full graphical workflow designer | `DEFER` | Core v0 needs seeded, configurable workflow behavior; a complete designer is a later breadth increment. | Product Decision Authority; revisit after the seeded release workflow |
| ERP/MRP, watched-folder exchange and general external API | `DEFER` | No approved consumer or versioned integration contract exists. | Product Decision Authority; revisit when a concrete internal consumer is named |
| Timekeeping, cost calculation, purchasing, manufacturing execution and project schedule management | `DEFER` | Departmental values may be retained as governed metadata or document content, but the first Release Spine does not calculate or execute these processes. | Product Decision Authority; activate only through a separately approved Feature or named external integration contract |
| Multisite replication and offline command replay | `DEFER` | Topology, consistency and recovery needs are not established. | Operations/Product Decision Authority; revisit on an approved multisite need |
| Automated purge and broad operations suite | `DEFER` | Retention, legal hold, RPO/RTO and recovery policy remain unresolved. | Quality/Operations authority; revisit before operational rollout |
| Full ECR/ECO process | `DEFER` | A lightweight controlled change record is sufficient for the first Release Spine. | Product Decision Authority; revisit in the PLM change-management increment |
| Additional deep CAD profiles | `DEFER` | One deep profile first proves the adapter boundary and evidence method. | Principal Product Author; revisit after the IRONCAD profile result |
| Bulk legacy migration | `DEFER` | Core v0 proves Store Existing and reconciliation on a bounded dataset, not enterprise migration. | Data/Migration authority; revisit when source systems and volumes are known |
| Code running inside design applications | `EXCLUDE` | External tools remain outside the IDEA trust and execution boundary. | Architecture owner; reopen only through an approved architecture change |
| Commercial operation and sales capability | `DEFER` | Internal operation is the only current purpose. A future commercial offering is a long-term direction, not a Core v0 requirement. | Commercial Decision Authority and Product Decision Authority; reopen only through the Commercial Readiness Gate and an approved successor |

Every reference capability in the fixed inventory receives a visible coverage disposition even when
it is not in Core v0. Deferral therefore narrows the first increment; it does not silently erase the
long-term PDM-to-PLM direction.

### 3.3 Boundary and dependency map

The user works through IDEA Web or IDEA Desktop. Local files are materialized by a per-user Managed
Workspace and are opened by applications installed on Windows. IDEA Server remains the authority for
identity, expected Generation, access, Check-in, workflow, audit and release. Format processing is an
isolated capability and does not decide product state. Storage, native-account implementation and
deployment choices remain Tech decisions and are not selected by this vision. Integration with the
company's existing account system is not a prerequisite for initial use.

DOC-01 supplies scope to DOC-03. DOC-03 supplies business needs to DOC-04. DOC-05/DOC-06/DOC-08
describe approved design consequences later. DOC-07 sequences the work and three boss-facing briefs
request decisions without becoming a second source of product truth.

### 3.4 Internal-first commercial trajectory

The first operating horizon remains one company-controlled internal product. Commercialization has
no target date and is expected to be several years away. It does not add customer onboarding,
billing, subscription, online activation, public SaaS or commercial support to Core v0.

During the internal years, the product applies only safeguards that are costly to retrofit: clean-room
development, third-party provenance, company-neutral configuration, explicit Organization and
Project ownership, portable data, controlled migrations, no hidden telemetry and evidence-bound
claims. The complete split between current safeguards, deferred work and the future gate is owned by
[`IE-GOV-COMMERCIAL-001`](registers/GOV-future-commercial-readiness.md).

This Draft does not authorize an external pilot, offer, installation, customer-data receipt or sale.
Those activities require the Commercial Readiness Gate, named legal, commercial and
security/operations authorities, and acceptance of the exact offering and evidence. This is a
governance constraint, not a claim that the current architecture already supports multiple customers
or jurisdictions.

## 4. Product direction and success measures

### 4.1 Product direction

The direction is to establish a dependable PDM foundation first and extend it toward PLM through
controlled increments. New formats, policies and later lifecycle modules must be addable without
changing the meaning of existing released records or rewriting the core identity model. Breadth is
secondary to proving one complete, safe engineering release with its important failure paths. The
product is built for internal use first while preserving a governed route to a future commercial
offering; commercial readiness is evaluated later and is not inferred from internal success.

### 4.2 Success measures

| Measure ID | Internal outcome | Baseline / target | Evidence method | Status |
|---|---|---|---|---|
| `MSM-001` | Reproduce one exact released baseline with matching identities, structure and digests. | Future approved Canonical Demo Dataset and Release Record; target is exact match. | Automated manifest/digest comparison plus controlled walkthrough. | `NOT-RUN` |
| `MSM-002` | Accept no stale, unauthorized, wrong-workspace or wrong-scope publish/release in the approved negative-path set. | Future approved Spec/VVP set; target is zero accepted invalid operations. | Repeatable negative-path tests. | `NOT-RUN` |
| `MSM-003` | Preserve recoverable local work after every tested conflict and interrupted Check-in. | Future approved workspace/recovery scenarios; target is no tested local-work loss. | Before/after file and digest evidence plus recovery execution. | `NOT-RUN` |
| `MSM-004` | Supply complete actor, policy, source-pin and audit evidence for each accepted publish, approval and release. | Future approved audit completeness rules; target is 100% within the test scope. | Evidence-ledger reconciliation. | `NOT-RUN` |
| `MSM-005` | Restore the tested metadata and Artifact baseline consistently. | Future approved backup/restore scope; target is exact resolution and digest match. | Controlled restore drill. | `NOT-RUN` |

Measured latency, capacity, availability and time savings remain `UNKNOWN`. The user accepted
preliminary severe-server-failure recovery objectives of RTO ≤4 working hours and RPO ≤1 hour;
these are design/evaluation targets, not a verified SLA. DOC-04 and VVP define the qualification
boundary. Principal Product Author and the applicable operations authority must establish the
working-hour clock, support coverage, representative restore scope and evidence before any
operational commitment or rollout claim.

## 5. Assumptions, risks and decisions

| Record type | ID | Statement / impact | Disposition |
|---|---|---|---|
| Decision | `VSN-DEC-001` | The boss decides Feature, then Spec, then Tech; DOC-01…08 remain internal detailed authority. | Accepted planning rule; decision briefs must pin exact source versions |
| Decision | `VSN-DEC-002` | Core v0 proves a vertical Release Spine rather than many shallow features. | Accepted scope direction; subject to Feature decision |
| Decision | `VSN-DEC-003` | IDEA remains internal for the next several years but avoids preventable barriers to a separately approved future commercial offering. | Accepted drafting direction; current Feature/Spec/Tech and roadmap scope unchanged |
| Assumption | `VSN-ASM-001` | The initial product context is one internal organization on Windows with externally installed Office/CAD tools. | Validate during Spec/Tech; material change enters through CHG |
| Risk | `VSN-RSK-001` | Reference behavior may be mistaken for validated internal need. | Keep `Reference-Backed Product Hypothesis`; representative need validation remains `BLOCKED` |
| Risk | `VSN-RSK-002` | One-person preparation may be mistaken for independent approval or user acceptance. | Keep self-review, specialist review and representative acceptance as separate statuses |
| Risk | `VSN-RSK-003` | Broad format or PLM promises could exceed evidence and delay the safe core. | Generic baseline plus one deep profile; all omitted areas remain in coverage register |
| Risk | `VSN-RSK-004` | Reference-product material, third-party code/assets or unsupported claims could prevent lawful distribution later. | Clean-room provenance, dependency/license inventory and evidence-bound claims; Legal Review required before external use |
| Gap | `VSN-GAP-001` | Named internal pilot, representative users and Internal Adoption Authority are absent. | Owner Product Decision Authority; nominate before internal need validation/pilot acceptance |
| Gap | `VSN-GAP-002` | Organizational retention period and validated operational thresholds remain open; the preliminary RTO/RPO objectives are not measured results. | Owners Product Decision Authority/Operations; resolve before Approved/PG4 as applicable |
| Gap | `VSN-GAP-003` | Commercial, Legal and external Security/Operations authorities have not accepted a future offering, and no commercial gate has run. | Track in `IE-GOV-COMMERCIAL-001`; remains `BLOCKED` until the external trigger is approached |

## 6. Trace and review readiness

| Trace item | Required link | Result |
|---|---|---|
| Authority owner | Product Decision Authority and Principal Product Author roles | Roles recorded; attributable identities `BLOCKED` before `Proposed` |
| First gate | `PG1` package at `IDEA-C1-ANALYSIS-DESIGN-001` | Source set being authored; outcome `NOT-RUN` |
| Later impact | DOC-02 through DOC-08, coverage, decision briefs and future CHG/VEV/REL | Core/brief Drafts and initial GOV/VVP records authored; reviews and decisions remain `NOT-RUN` |
| Review outcome | Project-user internal review of this exact version and Product Decision Authority disposition | `NOT-RUN`; earlier brief reviews do not transfer to this successor |

## Internal-company value boundary

| Value dimension | Required evidence or measure | Status |
|---|---|---|
| Engineering-data integrity and control | Stable identity, exact baseline and invalid-operation evidence within an approved test scope | `NOT-RUN`; reference-backed hypothesis only |
| Release-risk reduction and quality | Internal risk baseline plus Release Spine negative-path results | Baseline `BLOCKED` pending representative project |
| Maintainability and evidenced efficiency | Approved scope, measured current state, metric and owner | `UNKNOWN`; establish during Spec/pilot planning |
| Commercial objectives | Pricing, revenue, acquisition, market share, market fit or external buyer objective | `DEFERRED`; no current target, requirement or claim. Future direction is tracked separately. |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | Product knowledge, accepted design lessons and stakeholder scope decisions | Linked; internal representative need evidence `BLOCKED` |
| `DOWNSTREAM` | DOC-02, DOC-03, DOC-07, FEATURE-001 and coverage record | Current Draft sources linked; `FEATURE-001@0.12` contains the clarified Version model and later accepted scope clarifications; boss decision `NOT-RUN` |
| `CHANGE` | CHG/Work Item, impact analysis and successor baseline | [IE-CHG-COMMERCIAL-DIR-001](registers/CHG-2026-09-17-internal-first-commercial-direction.md) records the internal-first long-term direction without changing current Feature/Spec/Tech or delivery scope; earlier changes remain linked in their records |
| `VERIFICATION` | Future VVP procedures and VEV results against exact configurations | `NOT-RUN` |
| `RELEASE` | Future REL manifest and DOC-07 increment consuming this version | `NOT APPLICABLE` to this draft |
| `RENDITION` | Source-pinned DOCX/PDF identity and status | No rendition generated |

<!-- AUTHOR CONTENT END -->

## Contract references

- [DOC-01 class template](../../definition/DOC-01-product-vision-and-scope.md)
- [Core document catalogue](../../definition/README.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Project domain language](../../../../CONTEXT.md)
