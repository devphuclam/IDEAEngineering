---
description: "Dependency-ordered documentation-authoring tasks for the eight-class controlled product-definition baseline"
---

# Tasks: Controlled Product Documentation

**Input**: Design documents from `specs/003-controlled-documentation/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`,
`data-model.md`, `contracts/`, `quickstart.md`, and the project constitution.

**Tests**: No production application test suite is requested for this documentation-only increment.
Static checks, catalogue exercises, the retained stratified Documentation Validation Pack,
coverage-register and locale-profile reviews, trace walkthroughs, gate-package reviews, rendition
checks, and claim-comprehension reviews are included because they are the validation evidence defined
by the specification and plan.

**Organization**: Tasks are grouped by user story in priority order so each documentation outcome
can be reviewed independently. The story order is P1 (`US1`–`US3`), P2 (`US4`, `US6`), then P3
(`US5`).

## Format: `- [ ] [TaskID] [P?] [Story?] Description`

- **`[P]`**: The task can run in parallel after its stated phase dependencies because it owns a
  different file or has no dependency on an unfinished task.
- **`[Story]`**: The user story served by the task (`US1`–`US6`). Setup, foundational, and polish
  tasks intentionally have no story label.
- Every task names the exact repository path it creates or updates.

## Path Conventions

- Feature lifecycle artifacts: `specs/003-controlled-documentation/`
- Authoritative product-definition templates: `docs/product/definition/`
- Supporting record templates: `docs/product/definition/registers/`
- This increment adds no runtime source tree, API contract, database schema, or deployment config.

---

## Phase 1: Setup (Shared Documentation Structure)

**Purpose**: Establish the discoverable documentation tree and the single authority entry point.

- [x] T001 Create `docs/product/definition/README.md` with an instruction-only scope scaffold (not product content), navigation skeleton, and rows for exactly eight core document classes and nine supporting-record classes, linked to the feature contracts in `specs/003-controlled-documentation/contracts/`; no unresolved prompt may survive into `Proposed` or `Approved` status (FR-001–FR-005, FR-009, SC-001, SC-002).
- [x] T002 Create `docs/product/definition/registers/README.md` as the supporting-record index, naming `GOV`, `CLR`, `RSK`, `VVP`, `VEV`, `CMP`, `CHG`, `REL`, and `OPS` with their owners and core-document consumers (FR-003, Key Entities).
- [x] T003 Add the shared authoring rules to `docs/product/definition/README.md`: apply the common control envelope and authored-content versus instruction/example delimiter to all eight core and nine supporting templates, include evidence/claim fields, Markdown authority, the internal-only/no-competitor-narrative boundary, and explicit indexed `DOC-02`/`DOC-07` instance identity rules (FR-006–FR-012, FR-024–FR-025, FR-043, FR-048).
- [x] T004 Record the documentation-only boundary and the PG2/PG3/PG4 implementation prerequisite in `specs/003-controlled-documentation/quickstart.md`, including the explicit decision to leave runtime stack, API, database, identity-provider, deployment, and format choices open (Plan §Technical Context, FR-032, Out of Scope).

---

## Phase 2: Foundational (Blocking Supporting-Record Contracts)

**Purpose**: Author the shared control, evidence, governance, and release record shapes that every
core document relies on. No user-story template work begins until this phase is complete.

**⚠️ CRITICAL**: These tasks establish information-item contracts; they do not implement an
application runtime.

- [x] T005 [P] Author `docs/product/definition/registers/GOV-governance-and-standards.md` with role/authority fields, the GOV-owned Material Coverage Inventory and Behavioral Coverage Register/sub-register (not a tenth class), closed as-of baseline/date and inclusion/exclusion fields, one-record-per-inventory-entry linkage, DDM target/evidence and proactive benchmark comparison fields, dispositions (`ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, `UNKNOWN`), explicit `NO-STRONGER-PATTERN` comparison result, standards classifications (`STANDARD`, `STANDARD-GUIDED`, `STANDARD-GUIDED, CONDITIONAL`, `REFERENCE/WATCH`, `PROJECT-CONVENTION`), applicability (`APPLY`, `TAILOR`, `NOT-APPLICABLE`, `BLOCKED`), gate vocabulary, and visible `UNKNOWN`/`BLOCKED` resolution rules based on `contracts/gate-package.md` and `contracts/control-fields-and-status.md` (FR-006–FR-009, FR-029, FR-033, FR-044, SC-016).
- [x] T006 [P] Author `docs/product/definition/registers/CMP-configuration-management.md` with stable ID/class/path identity, controlled document statuses and transitions, `major.minor` versioning, Product Generation/Business Revision/Git distinction, exact baselines, rendition accounting, and change-history fields (FR-006–FR-012, SC-002, SC-009).
- [x] T007 [P] Author `docs/product/definition/registers/CLR-clean-room-provenance.md` with source URI/hash or edition, evidence class, lawful-access basis, scope, limitations, permitted transfer, sanitization/handling record, and repository boundary (FR-024–FR-025, FR-034, FR-040, SC-006, SC-014).
- [x] T008 [P] Author `docs/product/definition/registers/RSK-risk-register.md` with risk identity, affected baseline, treatment, owner, status, residual disposition, escalation, and links to requirements, changes, gates, and releases (FR-010, FR-018, FR-020, FR-030, FR-041).
- [x] T009 [P] Author `docs/product/definition/registers/VVP-verification-validation-plan.md` with requirement/claim verification methods, exact configuration and environment, procedure, expected evidence, Validation Pack strata/counts, independence/representativeness expectations, and `PASS`/`FAIL`/`BLOCKED`/`NOT-RUN` handling (FR-016–FR-017, FR-026, FR-031, FR-046–FR-047, SC-004–SC-007, SC-018–SC-019).
- [x] T010 [P] Author `docs/product/definition/registers/VEV-verification-evidence.md` with executed-result identity, exact configuration, environment, timestamp, procedure link, outcome, Validation Pack sample/stratum and selection rationale where applicable, reviewer independence/representativeness assessment, deviations, residual risk, evidence retention, and gate/release links (FR-026, FR-028–FR-032, FR-037–FR-040, FR-046–FR-047, SC-018–SC-019).
- [x] T011 [P] Author `docs/product/definition/registers/CHG-change-records.md` with material-change identity, scope, impact analysis across requirements/architecture/data/interfaces/UI/UX/risks/tests/roadmap/operations/releases, review, approval, effective baseline, and rollback/supersession history (FR-010, FR-026–FR-028, Constitution III).
- [x] T012 [P] Author `docs/product/definition/registers/REL-release-baselines.md` with immutable manifest, exact item versions/hashes, provenance, verification summary, known issues, residual risk, rollback/recovery evidence, authorization, and pilot-claim boundaries (FR-012, FR-037–FR-041, SC-007, SC-012–SC-014).
- [x] T013 [P] Author `docs/product/definition/registers/OPS-operations-and-retirement.md` with support, incident, recovery, retention, operational learning, dependency checks, retirement, and feedback links to the applicable core documents (FR-006, FR-009, FR-020, FR-043, Constitution V).

**Checkpoint**: The catalogue, common control envelope, supporting record classes, and documentation-only boundary are available for independent story work.

---

## Phase 3: User Story 1 - Define the Internal Product Through Eight Authoritative Documents (Priority: P1) 🎯 Documentation Baseline Increment

**Goal**: Give an author one bounded, IDEA-language product-definition set from vision through UI/UX,
with one authority per statement and no accidental commercial or competitor source of truth.

**Independent Test**: Using the catalogue and the Validation Pack's criterion-selected 20-item set of
vision, feasibility, business, software, architecture, data/integration, roadmap, interaction and
supporting-record information, an author places each item in one authoritative document, follows the
required references, and identifies the first gate for every class (User Story 1, SC-001, SC-003,
SC-018).

### Implementation for User Story 1

- [x] T014 [P] [US1] Author `docs/product/definition/DOC-01-product-vision-and-scope.md` with the common control envelope and authored/instruction delimiter plus internal purpose, Problem Hypothesis and evidence class, Internal Operational Value, stakeholders, system boundary, trajectory, non-goals, assumptions, constraints, success measures, open decisions, and links without detailed software requirements (FR-013, FR-043, FR-048).
- [x] T015 [P] [US1] Author `docs/product/definition/DOC-02-feasibility-and-options-assessment.md` with the common control envelope, independent indexed-instance identity, and authored/instruction delimiter plus feasibility questions, current-process baseline, buy/configure, adapt/integrate, and independent-build options, evaluation criteria, evidence, risks, unknowns, throwaway prototype boundary, recommendation, and decision status (FR-014, FR-042, FR-048).
- [x] T016 [P] [US1] Author `docs/product/definition/DOC-03-business-requirements.md` with the common control envelope and authored/instruction delimiter plus internal stakeholders/actors, operational needs and scenarios, business processes/rules, priorities, constraints, assumptions, acceptance intent, traceable sources, and distinct pilot/claim statuses (FR-015, FR-037–FR-039, FR-048).
- [x] T017 [P] [US1] Author `docs/product/definition/DOC-04-software-requirements-specification.md` with the common control envelope and authored/instruction delimiter; uniquely identified functional, interface, data, quality, security, privacy, operational, support, retirement, and `en`/`vi`/`ja` Locale Profile requirement sections each carry source, rationale, acceptance, verification, priority, lifecycle, and trace fields, including cross-locale task-suite parity and Unicode/Japanese scenarios (FR-016–FR-017, FR-045, FR-048, SC-004, SC-017).
- [x] T018 [P] [US1] Author `docs/product/definition/DOC-05-architecture-description.md` with the common control envelope and authored/instruction delimiter plus system-of-interest context and boundaries, stakeholders/concerns, viewpoints/views, responsibilities, interfaces, quality scenarios, risks/treatments, ADR links, constraints, and verification implications without selecting an unapproved production stack (FR-018, FR-048, Out of Scope).
- [x] T019 [P] [US1] Author `docs/product/definition/DOC-06-data-integration-and-migration-specification.md` with the common control envelope and authored/instruction delimiter plus authoritative data concepts/ownership, identities, lifecycle, relationships/integrity, classification/retention, exchange semantics, migration mapping, validation, failure behavior, idempotency, reconciliation, security/privacy, and verification obligations (FR-019, FR-048).
- [x] T020 [P] [US1] Author `docs/product/definition/DOC-07-mvp-roadmap-and-delivery-plan.md` with the common control envelope, independent indexed increment-record identity, and authored/instruction delimiter plus bounded increments, objectives, dependencies, owners, gate prerequisites, exit evidence, acceptance, migration/rollback implications, deferred scope, and the MVP Release Spine without changing requirements or architecture by assertion (FR-020, FR-041, FR-048).
- [x] T021 [P] [US1] Author `docs/product/definition/DOC-08-ui-ux-and-interaction-specification.md` with the common control envelope and authored/instruction delimiter plus users/context, accessibility needs, journeys, information architecture, task flows, interaction states/rationale, usability objectives, `en`/`vi`/`ja` Locale Profiles, surface-specific HCD/accessibility profiles, component/semantic contracts, cross-locale task-suite evaluation, deviations, residual risk, and IDEA-only language (FR-021, FR-022, FR-023, FR-045, FR-048, SC-008, SC-017).
- [x] T022 [US1] Complete the eight core rows and authority/non-ownership map in `docs/product/definition/README.md`, linking each DOC template to its required inputs, outputs, first/later gates, supporting records, and downstream consumers (FR-002, SC-001).
- [x] T023 [US1] Add the criterion-selected 20-item author placement exercise to `specs/003-controlled-documentation/quickstart.md` and `validation-results.md`, covering every class plus shared-fact/non-ownership cases, with selection rationale, expected result, author outcome and authority links; include a reference-observation case that cannot become an IDEA requirement without need/decision evidence (FR-004–FR-005, FR-024–FR-025, FR-046, SC-003, SC-006, SC-018).

**Checkpoint**: US1 is independently reviewable when the catalogue, all eight templates, authority boundaries, and placement exercise are complete.

---

## Phase 4: User Story 2 - Review and Baseline Documentation at Product Gates (Priority: P1)

**Goal**: Let a reviewer identify exact baselines, missing prerequisites, accountable authorities,
and one honest gate outcome without reconstructing context from chat or source code.

**Independent Test**: Assemble a sample PG2 or PG3 package and the required Validation Pack strata,
identify every applicable artifact and version, record exactly one permitted outcome, assess reviewer
independence/representativeness, and distinguish completed, missing, blocked, failed, and unrun
evidence (User Story 2, SC-002, SC-007, SC-010, SC-018–SC-019).

### Implementation for User Story 2

- [x] T024 [P] [US2] Complete `docs/product/definition/registers/GOV-governance-and-standards.md` with the PG0–PG7 minimum package map, exact input baselines, gate authority/independence basis, one-outcome rule, production-authorization boundary, and the Validation Pack/coverage-register ownership and disposition rules (FR-029–FR-032, FR-044, FR-046–FR-047, SC-007, SC-016, SC-018–SC-019).
- [x] T025 [P] [US2] Complete `docs/product/definition/registers/VVP-verification-validation-plan.md` with gate-specific verification obligations, evidence sufficiency, exact configuration requirements, fixed Validation Pack strata/counts, and independent-review/representativeness expectations for material PG2/PG3/PG5/PG6 baselines (FR-026, FR-031–FR-032, FR-046–FR-047, SC-007, SC-018–SC-019).
- [x] T026 [P] [US2] Complete `docs/product/definition/registers/VEV-verification-evidence.md` with explicit `PASS`, `FAIL`, `BLOCKED`, and `NOT-RUN` evidence outcomes, missing-evidence treatment, Validation Pack stratum/selection metadata, independence/representativeness assessment, deviations, residual risk, and no-substitute/no-false-pass language (FR-028–FR-032, FR-046–FR-047, SC-018–SC-019, Constitution IV).
- [x] T027 [P] [US2] Complete `docs/product/definition/registers/REL-release-baselines.md` with release-authorization inputs, exact manifest/pin evidence, known issues, residual-risk disposition, rollback/recovery evidence, and lower-status claim restrictions (FR-037–FR-041, SC-012–SC-014).
- [x] T028 [P] [US2] Complete `docs/product/definition/registers/OPS-operations-and-retirement.md` with gate-to-operation handoff, support readiness, incident/recovery records, retention/dependency checks, and controlled retirement evidence (FR-006, FR-009, FR-020, Constitution V).
- [x] T029 [US2] Add status-transition, reviewer/approver, `PASS-WITH-ACTIONS` action, and accountable-authority examples to `docs/product/definition/registers/CMP-configuration-management.md`, requiring owner, affected baseline, due condition/date, expiry, and escalation for every action (FR-007, FR-030–FR-031).
- [x] T030 [US2] Add the PG2/PG3 review-package walkthrough and failure classifications to `specs/003-controlled-documentation/quickstart.md` and `validation-results.md`, including the fixed gate-outcome strata, unavailable-independent-reviewer/competence/population cases, two-participant representativeness rule, and the rule that file-count completeness is not a pass (FR-046–FR-047, SC-007, SC-010, SC-018–SC-019).

**Checkpoint**: US2 is independently reviewable when a reviewer can assemble a gate package and issue an attributable, single-valued disposition with truthful missing-work status.

---

## Phase 5: User Story 3 - Trace and Change the Product Definition Safely (Priority: P1)

**Goal**: Preserve a bidirectional, typed path from evidence and stakeholder need through requirement,
design, change, verification, and release, with material impact visible.

**Independent Test**: Seed a sample need, requirement, design response, change, verification result,
and release reference; traverse both directions; then introduce a broken/orphan/stale/circular link
and show that the affected gate is blocked or formally dispositioned (User Story 3, SC-004–SC-005).

### Implementation for User Story 3

- [x] T031 [P] [US3] Complete `docs/product/definition/registers/CHG-change-records.md` with typed upstream/downstream links, impact coverage for requirements/architecture/data/interfaces/UI/UX/risks/tests/roadmap/operations/releases, review/approval, effective baseline, and repair/supersession disposition (FR-010, FR-026–FR-028).
- [x] T032 [P] [US3] Complete `docs/product/definition/registers/CMP-configuration-management.md` with exact baseline manifests, version watch, supersession, stale-rendition accounting, and Git evidence rules that keep class, instance, version, Generation, Revision, and commit distinct (FR-006, FR-011–FR-012, SC-005, SC-009).
- [x] T033 [US3] Add typed source, downstream, change, verification, and release trace sections to `docs/product/definition/DOC-01-product-vision-and-scope.md`, `DOC-02-feasibility-and-options-assessment.md`, `DOC-03-business-requirements.md`, `DOC-04-software-requirements-specification.md`, `DOC-05-architecture-description.md`, `DOC-06-data-integration-and-migration-specification.md`, `DOC-07-mvp-roadmap-and-delivery-plan.md`, and `DOC-08-ui-ux-and-interaction-specification.md` (FR-026–FR-027).
- [x] T034 [US3] Add the bidirectional trace navigation rules, one-authority rule, and trace-view non-authority statement to `docs/product/definition/README.md`, linking the supporting `CHG`, `CMP`, `VVP`, `VEV`, and `REL` records (FR-004, FR-026–FR-027, Key Entities).
- [x] T035 [US3] Add the evidence-to-release trace walkthrough and broken/orphan/stale/unjustified-circular-link scenarios to `specs/003-controlled-documentation/quickstart.md`, with `BLOCKED` or authorized disposition evidence (FR-028, SC-005).

**Checkpoint**: US3 is independently reviewable when a reviewer can follow every applicable trace in both directions and see the impact of a material change.

---

## Phase 6: User Story 4 - Keep Supporting Evidence Outside the Eight Core Documents (Priority: P2)

**Goal**: Keep the core documents decision-focused while retaining reusable governance, provenance,
risk, verification, configuration, change, release, and operations evidence.

**Independent Test**: For one requirement and one release, store standards, provenance, risk, change,
verification, configuration, release, operations, and a material reference behavior in the appropriate
supporting records; complete the GOV coverage disposition and locale profile, while core documents
retain only their owned conclusions and links (User Story 4, SC-006, SC-011, SC-016–SC-017).

### Implementation for User Story 4

- [x] T036 [P] [US4] Complete `docs/product/definition/registers/CLR-clean-room-provenance.md` with the permitted transfer chain from authorized source to classified finding, bounded inference, IDEA decision/need, requirement, design, change, verification, and release (FR-024–FR-025, FR-034, SC-006).
- [x] T037 [P] [US4] Complete `docs/product/definition/registers/RSK-risk-register.md` with one-owner treatment for cross-document risks, residual-risk disposition, escalation, and links that prevent risk rules from being duplicated in core documents (FR-018, FR-020, FR-026, SC-001).
- [x] T038 [US4] Add the standards applicability, exact-edition, classification enum, lawful-access, tailoring, objective-evidence, and no-conformity-claim sections to `docs/product/definition/registers/GOV-governance-and-standards.md` and the surface-specific portions of `docs/product/definition/DOC-08-ui-ux-and-interaction-specification.md` (FR-021–FR-023, FR-033–FR-036, SC-008).
- [x] T039 [US4] Add concise supporting-record link sections to `docs/product/definition/DOC-01-product-vision-and-scope.md`, `DOC-02-feasibility-and-options-assessment.md`, `DOC-03-business-requirements.md`, `DOC-04-software-requirements-specification.md`, `DOC-05-architecture-description.md`, `DOC-06-data-integration-and-migration-specification.md`, `DOC-07-mvp-roadmap-and-delivery-plan.md`, and `DOC-08-ui-ux-and-interaction-specification.md`, keeping each authoritative statement in one owner (FR-002–FR-004, FR-027).
- [x] T040 [US4] Add the DDM/reference-evidence, GOV-owned Behavioral Coverage Register boundary, clean-room, restricted-material, and core-language boundary to `docs/product/definition/README.md` and `docs/product/definition/registers/CLR-clean-room-provenance.md`, with reference observations classified as `Reference-Coverage Evidence`, proactive benchmark comparison/disposition fields, and no Aras name/comparison narrative in DOC-01…DOC-08 (FR-025, FR-034, FR-044, Constitution I, SC-016).
- [x] T041 [US4] Add the supporting-record placement, Behavioral Coverage Register, proprietary-evidence, and explicit `NO-STRONGER-PATTERN` walkthrough to `specs/003-controlled-documentation/quickstart.md` and `validation-results.md`, including the case where a standards edition changes without silently rewriting dependent documents (FR-003, FR-033–FR-036, FR-044, SC-006, SC-014, SC-016).

**Checkpoint**: US4 is independently reviewable when a reviewer can locate one supporting owner for each cross-cutting fact and see the permitted evidence-transfer boundary.

---

## Phase 7: User Story 6 - Bound Internal MVP and Pilot Evidence (Priority: P2)

**Goal**: Make useful internal technical progress while keeping product direction, internal need,
technical verification, single-actor evidence, internal pilot acceptance, and rollout authorization
truthfully separate.

**Independent Test**: Prepare an MVP/pilot package using the Canonical Demo Dataset, a sanitized
Representative Pilot Project, two identities operated by one person, a reference-evidence record and
the complete 3-by-3 Locale Profile matrix (9 cells per DOC-04/DOC-08 template); the reviewer can classify each claim and identify `UNKNOWN`/`BLOCKED` status
where authority, locale evidence or participant population is absent (User Story 6, SC-012–SC-019).

### Implementation for User Story 6

- [x] T042 [P] [US6] Add the MVP Release Spine, vertical-slice order, exact-pin/reproduction outcomes, stale/unauthorized publication rejection, local-work preservation, and MVP Success Metric Set to `docs/product/definition/DOC-07-mvp-roadmap-and-delivery-plan.md` (FR-020, FR-041, SC-013).
- [x] T043 [P] [US6] Add the Generic Controlled-File Baseline, one DOC-02-selected deep CAD Format Capability Profile, later additive-profile rule, and throwaway pre-PG2 prototype boundary to `docs/product/definition/DOC-02-feasibility-and-options-assessment.md` and `docs/product/definition/DOC-06-data-integration-and-migration-specification.md` (FR-014, FR-019, FR-042, SC-013).
- [x] T044 [US6] Add the distinct pilot claim/status matrix and Internal Pilot Evidence Boundary to `docs/product/definition/DOC-03-business-requirements.md`, `docs/product/definition/DOC-07-mvp-roadmap-and-delivery-plan.md`, `docs/product/definition/registers/VEV-verification-evidence.md`, and `docs/product/definition/registers/REL-release-baselines.md` (FR-037, FR-038, FR-039, FR-040, SC-012, SC-014).
- [x] T045 [P] [US6] Add the cross-surface HCD/accessibility and locale routing for native Desktop, Web, and Web-rendered Desktop, including conditional WCAG, WAI-ARIA, and EN 301 549 applicability, the complete 3-by-3 `en`/`vi`/`ja` Locale Profile matrix (9 locale-surface cells), Localized Resource Catalogue/fallback/review status, persisted preference, Unicode preservation, cross-locale task-suite parity, Japanese IME/normalization/width/search/font-fallback/line-breaking scenarios, and manual/assistive evidence expectations, to `docs/product/definition/DOC-08-ui-ux-and-interaction-specification.md` (FR-021, FR-022, FR-023, FR-045, SC-008, SC-015, SC-017).
- [x] T046 [US6] Add the internal-company value model and explicit exclusion of pricing, revenue, customer acquisition, market-share, market-fit, and external-buyer objectives to `docs/product/definition/DOC-01-product-vision-and-scope.md`, `DOC-03-business-requirements.md`, `DOC-07-mvp-roadmap-and-delivery-plan.md`, and `docs/product/definition/README.md` (FR-013, FR-043, SC-011).
- [x] T047 [US6] Add the MVP/pilot claim-classification, one-human/two-identity, missing-adoption-authority, prototype, company-data handling, complete 9-cell-per-template locale-matrix, and missing-population handling walkthroughs to `specs/003-controlled-documentation/quickstart.md` and `validation-results.md` (FR-037, FR-038, FR-039, FR-040, FR-045–FR-047, SC-012–SC-019).

**Checkpoint**: US6 is independently reviewable when technical evidence can progress without being relabeled as representative acceptance, independent review, or rollout authorization.

---

## Phase 8: User Story 5 - Share Controlled Renditions Without Losing Source Identity (Priority: P3)

**Goal**: Make DOCX/PDF renditions shareable while keeping Markdown authoritative and making stale or
superseded copies obvious.

**Independent Test**: Produce two rendition records from different source baselines; a reviewer can
identify source ID/version/baseline, rendition date/status, and the current authority without opening
repository history (User Story 5, SC-009).

### Implementation for User Story 5

- [x] T048 [P] [US5] Add the rendition metadata contract—stable rendition ID, source document ID/version/baseline, date, producer identity where material, status, classification, retention, and trace links—to `docs/product/definition/registers/CMP-configuration-management.md`, `docs/product/definition/registers/REL-release-baselines.md`, and `docs/product/definition/README.md` (FR-011–FR-012, SC-009).
- [x] T049 [US5] Add source-pinned rendition, `Current`/`Stale`/`Superseded`/`Withdrawn` handling, comments/approval redirection, and non-authority language to the control sections of `docs/product/definition/DOC-01-product-vision-and-scope.md`, `DOC-02-feasibility-and-options-assessment.md`, `DOC-03-business-requirements.md`, `DOC-04-software-requirements-specification.md`, `DOC-05-architecture-description.md`, `DOC-06-data-integration-and-migration-specification.md`, `DOC-07-mvp-roadmap-and-delivery-plan.md`, and `DOC-08-ui-ux-and-interaction-specification.md` (FR-011–FR-012, FR-028).
- [x] T050 [US5] Add the two-baseline rendition comparison and stale/superseded handling walkthrough to `specs/003-controlled-documentation/quickstart.md`, including classification/retention parity and the prohibition on silently editing a rendition into authority (SC-009, User Story 5).

**Checkpoint**: US5 is independently reviewable when every rendition points to one exact authoritative baseline and divergence is visible.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Execute and retain the stratified Validation Pack, coverage-register, locale, static and
human-review evidence; record unresolved decisions honestly; and prepare the next Spec Kit quality
gate. These tasks do not authorize production implementation.

- [x] T051 [P] Run the exact-count, core-language, commercial-boundary, and competitor-name scans described in `specs/003-controlled-documentation/quickstart.md` against `docs/product/definition/`, scope the competitor scan to core `DOC-*.md` files, and record command output and disposition in `specs/003-controlled-documentation/validation-results.md` (SC-001, SC-011, Constitution I).
- [x] T052 Run heading/ID/link/placeholder/whitespace validation for `docs/product/definition/` and `specs/003-controlled-documentation/` after T051, then append only executed results as `PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN` to `specs/003-controlled-documentation/validation-results.md` (FR-008–FR-012, FR-028, SC-002, SC-005).
- [x] T053 [P] Have the designated reviewer evaluate the generated requirements-quality criteria in `specs/003-controlled-documentation/checklists/controlled-documentation.md` and mark `[x]` only for satisfied written-requirement criteria; link unresolved findings to `CLR`, `CHG`, `RSK`, or `GOV` records rather than treating checklist state as implementation status (Checklist, FR-009–FR-010).
- [x] T054 Reconcile `docs/product/definition/README.md`, the GOV coverage register, all eight core templates, and Locale Profiles against `CONTEXT.md`, accepted ADRs, the standards register, the clean-room register, and `.specify/memory/constitution.md`; record every still-unassigned authority, exact-edition, pilot, format, locale, coverage, or threshold decision as `UNKNOWN`/`BLOCKED` with owner and resolution path in `docs/product/definition/registers/GOV-governance-and-standards.md` and `validation-results.md` (FR-004, FR-009, FR-033, FR-044–FR-045, Assumptions).
- [x] T055 Perform the final scope audit in `specs/003-controlled-documentation/quickstart.md` and `validation-results.md`: confirm exactly eight core and nine supporting classes, the coverage register is GOV-owned rather than a tenth class, English source is distinct from `en`/`vi`/`ja`, no runtime/API/database/deployment artifact was introduced, no unsupported conformity/parity claim is present, and the documentation baseline is ready for `$speckit-analyze` before `$speckit-implement` (FR-001, FR-035, FR-044–FR-048, Out of Scope).
- [x] T056 Initialize the retained Documentation Validation Pack and execute only its general strata—class structure, placement, requirements, reference coverage, gate outcomes, surface profiles, rendition states, and pilot/claim statuses—as defined in `specs/003-controlled-documentation/contracts/validation.md` and `quickstart.md`; enumerate each minimum and append per-item selection rationale, expected/executed result, exact baseline, environment, date, owner, evidence link, and disposition to `specs/003-controlled-documentation/validation-results.md`. Coverage-inventory/locale-cell execution belongs to T057 and human assessment belongs to T058 (FR-046, SC-018).
- [x] T057 Execute the seeded GOV Material Coverage Inventory and its Behavioral Coverage Register at the recorded as-of baseline, then review the complete 9-cell `DOC-04` and `DOC-08` Locale Profile matrices (`en`/`vi`/`ja` × Desktop/Web/Web-rendered Desktop); retain comparison/disposition, fallback/review/Unicode/Japanese-scenario evidence or `UNKNOWN`/`BLOCKED` outcomes in `specs/003-controlled-documentation/validation-results.md` (FR-044–FR-045, SC-016–SC-017).
- [x] T058 Conduct the human reviewer/acceptance walkthrough against the retained Validation Pack and its T056/T057 results, record participant roles, population availability, author/owner separation, competence or `Specialist Review Gap`, independence, representativeness, and outcome in `specs/003-controlled-documentation/validation-results.md`; do not re-execute the general, coverage, or locale strata, and if the required reviewer or population is unavailable record `BLOCKED` or `NOT-RUN` (FR-047, SC-019).
- [x] T059 Re-run the post-Phase 1 constitution and artifact consistency check after T051–T058, update the re-check notes in `specs/003-controlled-documentation/plan.md`, and leave a concise evidence link/status in `specs/003-controlled-documentation/validation-results.md`; do not authorize production implementation (FR-032, FR-048, SC-018–SC-019).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001–T004; no story work starts before the navigation and authoring boundary exist.
- **Foundational (Phase 2)**: T005–T013 depend on Phase 1 and block all user-story phases.
- **US1 (Phase 3, P1)**: T014–T023 depend on the foundational contracts; this is the Documentation Baseline Increment, not the product MVP.
- **US2 (Phase 4, P1)**: T024–T030 depend on US1 because gate packages must pin the eight document baselines.
- **US3 (Phase 5, P1)**: T031–T035 depend on US1 and the foundational control records; trace links may be refined alongside US2 after the catalogue exists.
- **US4 (Phase 6, P2)**: T036–T041 depend on US1 and the supporting-record scaffolds; they may proceed in parallel with late US2/US3 work when file ownership is separated.
- **US6 (Phase 7, P2)**: T042–T047 depend on US1, the gate vocabulary, and the evidence boundary; pilot/rollout claims remain unavailable without later evidence and authority.
- **US5 (Phase 8, P3)**: T048–T050 depend on US1 and CMP/REL; rendition work does not change Markdown authority.
- **Polish (Phase 9)**: T051–T059 depend on all desired story phases; T052 follows T051, T056–T058
  consume the authored templates and contracts with non-overlapping ownership (general strata, then
  coverage/locale cells, then human assessment), and all must finish before the next implementation
  lifecycle gate.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on another story.
- **US2 (P1)**: Depends on US1's eight class catalogue and template baselines.
- **US3 (P1)**: Depends on US1 and the common control envelope; can overlap US2 after the catalogue is stable.
- **US4 (P2)**: Depends on the catalogue and supporting-record scaffolds; can overlap late US2/US3 work where files do not conflict.
- **US6 (P2)**: Depends on US1 plus evidence/gate vocabulary; it does not depend on Internal Adoption Authority being available.
- **US5 (P3)**: Depends on US1 and CMP/REL; it can proceed after source identity rules are stable.

### Parallel Opportunities

- After T001–T004, T005–T013 can run in parallel because each foundational register owns a separate file.
- T014–T021 can run in parallel after Phase 2; each core template has a separate authority boundary and file.
- T024–T028 can run in parallel after US1; T029–T030 integrate their outputs.
- T031–T032 can run in parallel before T033–T035 consume the trace rules.
- T036–T037 can run in parallel; T038–T041 integrate the evidence and standards boundary.
- T042, T043, and T045 can begin in parallel after the gate/evidence vocabulary is stable; T044 and T046 integrate the affected baselines.
- T048 can run before T049–T050; rendition checks remain downstream of source-identity rules.
- T051 and T053 can run in parallel on separate evidence/checklist concerns; T052 follows T051 because
  both append to the retained result ledger. T054 reconciles authored artefacts, T055 audits scope,
  T056 executes the general Validation Pack strata, T057 executes the inventory and 9-cell locale
  matrices, and T058 records the human assessment without duplicating those executions; T059 is the
  final post-Phase 1 check.

---

## Parallel Examples

### User Story 1

```text
After Phase 2 completes, author these independent core templates in parallel:
T014 DOC-01, T015 DOC-02, T016 DOC-03, T017 DOC-04,
T018 DOC-05, T019 DOC-06, T020 DOC-07, T021 DOC-08.
Then run T022 and T023 to integrate the catalogue and placement exercise.
```

### User Story 2

```text
After US1, author the independent gate evidence records in parallel:
T024 GOV, T025 VVP, T026 VEV, T027 REL, T028 OPS.
Then run T029 for status/action examples and T030 for the reviewer walkthrough.
```

### User Story 3

```text
Run T031 (CHG impact contract) and T032 (CMP baseline/trace accounting) in parallel.
After both complete, run T033–T035 to connect the core templates, catalogue, and walkthrough.
```

### User Story 4

```text
Run T036 (CLR) and T037 (RSK) in parallel.
Then integrate standards, supporting links, and the evidence walkthrough with T038–T041.
```

### User Story 6

```text
Once the gate/evidence vocabulary is stable, T042 (MVP spine), T043 (format boundary),
and T045 (HCD profiles) can be drafted in parallel.
Run T044, T046, and T047 after their affected baselines are reconciled.
```

### User Story 5

```text
Run T048 first to establish rendition identity in CMP/REL.
Then run T049 and T050 to apply and walk through the source-pinned rendition rules.
```

---

## Implementation Strategy

### Documentation Baseline Increment First (US1)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational supporting-record contracts.
3. Complete Phase 3 US1: catalogue plus eight core templates.
4. Stop and run the US1 placement/authority review independently, using the Validation Pack sample.
5. Do not treat this Documentation Baseline Increment as product MVP or production readiness;
   PG2/PG3/PG4 remain mandatory.

### Incremental Delivery

1. Add US2 gate-package controls and review evidence.
2. Add US3 bidirectional trace and controlled change.
3. Add US4 evidence/provenance/risk separation.
4. Add US6 bounded MVP and pilot claims.
5. Add US5 source-pinned DOCX/PDF rendition rules.
6. Run Phase 9 Validation Pack, coverage-register, locale, static and human-review checks and then
   `$speckit-analyze`; only an approved requirements/architecture/readiness baseline may proceed to
   `$speckit-implement`.

### Single-Author / Reviewer Strategy

The current project may have one Principal Product Author. Tasks may be prepared by that author,
but material PG2/PG3/PG5/PG6 review must retain an appropriately independent reviewer or remain
`BLOCKED`; relabeling one person's identities does not create independent evidence.

## Notes

- `[P]` means separate-file work with no unfinished dependency; it is not a claim that the work is safe to merge without review.
- Story labels map tasks to the six user stories in `spec.md`.
- Supporting records are nine classes, not a tenth traceability authority; trace views derive from authoritative items.
- The GOV Behavioral Coverage Register is a record/sub-register, not a tenth supporting class.
- `validation-results.md` is the retained Validation Pack ledger; unexecuted or unavailable checks stay `NOT-RUN`/`BLOCKED`.
- All tasks are documentation/static-review work. No task authorizes production code, runtime APIs, database schemas, deployment, identity-provider selection, or unsupported parity/conformity claims.
- Record blocked or unexecuted validation honestly as `BLOCKED` or `NOT-RUN`; never convert it to `PASS`.

## Phase 10: Convergence

- [x] T060 Have an eligible designated reviewer evaluate all 52 requirements-quality criteria in `specs/003-controlled-documentation/checklists/controlled-documentation.md`, mark `[x]` only for criteria the reviewer finds satisfied, record reviewer identity/competence and author-owner separation, and link every unresolved finding to `CLR`, `CHG`, `RSK`, or `GOV` per T053 and FR-009–FR-010 (`resolved 2026-08-28`).

## Phase 11: Convergence — Code-review remediation

- [x] T061 Correct the retained commercial-boundary scan evidence in `specs/003-controlled-documentation/validation-results.md` and `quickstart.md`: record the three permitted explicit exclusion matches, keep the competitor scan at zero matches, and re-run both scans with attributable output per FR-046, SC-011, SC-018 and Constitution IV (contradicts; resolved 2026-08-28).
- [x] T062 Create `specs/003-controlled-documentation/validation-baseline-manifest.sha256` and define the assessed baseline as parent commit `04e6a97e537eba51d5344f7b6f6f2d5edb87f9ee` plus the scoped SHA-256 manifest; update the retained ledger and plan so every result resolves to this reproducible configuration per FR-046, SC-018 and Constitution IV (partial; resolved 2026-08-28).
- [x] T063 Preserve the 52 user-directed checklist marks while recording controlled reviewer attribution as `BLOCKED` until an attributable personal or organizational identifier is supplied; distinguish administrative transcription from independent specialist/material-gate review in the checklist, plan and validation ledger per FR-047, SC-019 and Constitution III/IV (partial; resolved 2026-08-28).
- [x] T064 Add an accountable role and explicit non-ownership boundary to every DOC-01…DOC-08 row in `docs/product/definition/README.md` per FR-002 and User Story 1 Acceptance Scenario 1 (missing; resolved 2026-08-28).
- [x] T065 Add `Owning scope` to the DOC-04 requirement record contract and requirement ledger in `docs/product/definition/DOC-04-software-requirements-specification.md` per FR-016 (missing; resolved 2026-08-28).
- [x] T066 Narrow the CMP version rule so only material authority/contract changes increment major and compatible content increments minor, preserving history, per FR-006, ADR-0008 and CONTEXT.md (contradicts; resolved 2026-08-28).
- [x] T067 Require a fixed source-artifact SHA-256 for transferred external research conclusions in `docs/product/definition/registers/CLR-clean-room-provenance.md`, while keeping the direct-public-research exception explicit, per FR-024, FR-034 and Constitution I (partial; resolved 2026-08-28).
- [x] T068 Split the six ISO/IEC/IEEE 29119 entries in `docs/product/definition/registers/GOV-governance-and-standards.md` into exact edition/source and one classification/applicability record per entry per FR-033 and Constitution IV (partial; resolved 2026-08-28).
- [x] T069 Enumerate DOC-01…DOC-08 and GOV…OPS by name in the 17 class-structure rows of `specs/003-controlled-documentation/validation-results.md`, with exact evidence links, per FR-046 and SC-018 (partial; resolved 2026-08-28).
- [x] T070 Resolve retained `PASS-WITH-ACTIONS` records by reclassifying task-only completion rows to `PASS` (or adding owner, affected baseline, due condition/date, expiry and escalation); do not treat them as gate outcomes, per FR-030 and SC-007 (partial; resolved 2026-08-28).
- [x] T071 Narrow the DOC-08 Web accessibility wording so the WCAG Web/rendered profile is required for applicable Web scope and WAI-ARIA is additive only for necessary custom semantics, per FR-022 and FR-023 (partial; resolved 2026-08-28).
