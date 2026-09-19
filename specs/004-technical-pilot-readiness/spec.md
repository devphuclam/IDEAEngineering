# Feature Specification: Technical Pilot Implementation Readiness

**Feature Branch at creation**: `codex/technical-pilot-speckit`
**Current baseline branch**: `main`

**Created**: 2026-09-17

**Status**: Draft

**Input**: Prepare `IE-INC-READY-001`, the bounded implementation-readiness increment for the
IDEA Engineering Technical Pilot. Pin the exact approved Feature/Spec/Tech predecessor, keep the
later multi-location Vault successor visibly separate until its exact disposition is recorded,
bound the first implementation increment, identify every open dependency, prepare the permitted
environment and representative test data, define rollback/recovery/security review, and record an
honest `PG4` result before production implementation begins.

## Authority and Scope Boundary

This Spec Kit artifact controls delivery of PH0 only. It does **not** create a new product Feature,
replace the 87 approved `REQ-*` rows in `DOC-04@0.13`, select a new Tech Stack, approve the later
Vault successor, or authorize production implementation. Product behavior remains owned by the
controlled Feature, Spec and Tech sources. The approved predecessor is pinned by
`IE-CHG-PDA-APPROVAL-001` to Git commit `f269a0445737a7efd7f406ee51517149a8967afa`.

The later Vault successor is a separate Draft delta. Limited authority records may cover a specific
correction or architectural direction, but approval of the complete successor source set and its
exact Product Decision Authority disposition remain `NOT-RUN` until attributable evidence records
otherwise.

For `PG4`, record **Gate Execution State** separately from **Gate Outcome**. Execution state is
`NOT-RUN`, `IN-PROGRESS` or `COMPLETE`. Until an attributable disposition exists, outcome is
`NOT-APPLICABLE`; a completed assessment records only `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or
`BLOCKED`, as required by the constitution. Individual readiness checks retain their separate
`PASS`, `FAIL`, `BLOCKED` or `NOT-RUN` results.

`PASS-WITH-ACTIONS` permits only the named successor increment and only when recorded actions do
not invalidate its requirements, architecture, risk treatment, test design or rollback readiness.
Each action identifies its owner, affected baseline, due condition/date, expiry and escalation path.
Approved PG2 requirements and PG3 architecture/design remain prerequisites; neither form of PG4
pass waives them or permits a missing mandatory input to be treated as satisfied.

In this increment, `PH1` means the first code-bearing successor increment proposed after PH0 and
authorized, if at all, by the `PG4` record. `PH1` is a planning label, not a pre-approved scope.
The gate record must name its stable increment ID, feature directory, bounded scope and
authorization limits before any PH1 work can begin.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Work from one unambiguous baseline (Priority: P1)

As the Principal Product Author and primary implementer, I want a manifest that separates the
approved predecessor from every later Draft change so that implementation cannot accidentally use
an unapproved mixture of Feature, Spec and Tech content.

**Why this priority**: Every later readiness decision depends on knowing exactly which product
baseline is authoritative and which changes still require disposition.

**Independent Test**: Give a reviewer only the readiness package. The reviewer can identify the
approved Feature, Spec and Tech versions and hashes, the approval evidence, every successor source,
and the approval state of each successor without consulting chat history.

**Acceptance Scenarios**:

1. **Given** the predecessor approval record and current repository, **When** the baseline manifest
   is reviewed, **Then** it identifies the exact approved commit, document versions and recorded
   hashes without treating later Draft versions as approved.
2. **Given** the multi-location Vault successor, **When** the manifest is reviewed, **Then** the
   successor sources, change record and current `NOT-RUN` disposition for the complete successor
   source set are shown separately from the approved predecessor. Any limited approval or confirmed
   direction is linked separately and is not treated as approval of the remaining successor sources.
3. **Given** a source whose status text predates the approval record, **When** the sources are
   reconciled, **Then** the later attributable approval record governs the exact pinned baseline
   and the discrepancy is recorded rather than silently rewritten.

---

### User Story 2 - Agree what the Technical Pilot must prove (Priority: P1)

As the project user and gate reviewer, I want one bounded canonical scenario and an explicit
deferred list so that the Technical Pilot proves a coherent end-to-end thread instead of partial
pieces of the full product.

**Why this priority**: The project has one primary developer and a fixed 2026 pilot window. A
bounded scenario is required to protect correctness without pretending that all Core v0 scope can
be completed in the pilot.

**Independent Test**: A reviewer can follow the proposed scenario from authenticated access through
controlled document work, exact review/release and retrieval, map every step to controlled product
requirements and verification procedures, and identify everything intentionally deferred.

**Acceptance Scenarios**:

1. **Given** the approved product baseline, **When** the canonical scenario is read, **Then** it
   covers native account/RBAC foundations, document identity, Workspace, Checkout, Reference,
   Check-in, Review, Release, Audit and exact package retrieval in one traceable sequence.
2. **Given** a stale, unauthorized, interrupted or ambiguous operation, **When** the scenario matrix
   is reviewed, **Then** the expected safe outcome and local-work preservation rule are explicit.
3. **Given** a capability outside the Technical Pilot, **When** scope is reviewed, **Then** the
   capability remains traceable to the product baseline or a later increment and is not described
   as removed from the product.

---

### User Story 3 - Expose every unresolved prerequisite before coding (Priority: P1)

As the primary implementer, I want each unresolved decision, authority, environment, data, license
and review dependency to have an owner, due condition and gate effect so that missing prerequisites
cannot be hidden inside implementation work.

**Why this priority**: A missing server decision, permission, test location, reviewer or license can
invalidate an otherwise completed implementation. Recording it before coding protects the schedule
and the evidence claim.

**Independent Test**: Select any unresolved item from the readiness register. A reviewer can see
what is unknown, who must resolve it, when it is needed, what evidence closes it, and whether its
absence blocks `PG4`, a later milestone or only a deferred capability.

**Acceptance Scenarios**:

1. **Given** an unresolved prerequisite, **When** it is entered in the decision register, **Then**
   it has one accountable owner, a due date or due condition, closure evidence and an explicit gate
   effect.
2. **Given** an external-source or dependency candidate, **When** it is proposed for adaptation or
   inclusion, **Then** its source, exact version, license and permitted commercial use are assessed
   before import.
3. **Given** a prerequisite that cannot be resolved by the gate date, **When** readiness is assessed,
   **Then** it is reported as `BLOCKED`, `NOT-RUN` or deferred with impact; it is never reported as
   passed by schedule assertion.

---

### User Story 4 - Make the first coding increment testable and recoverable (Priority: P2)

As the implementation and review team, I want a permitted delivery environment, representative
test data, verification strategy and recovery plan so that the first implementation increment can
be built, tested, rolled back and reviewed without improvising operational controls.

**Why this priority**: The product manages controlled engineering data. A build that cannot be
reproduced, a test that cannot be attributed, or a migration that cannot be reversed is not ready
for production-shaped implementation.

**Independent Test**: Using the readiness package, an authorized engineer can prepare the named
environment and fixtures, execute the documented readiness checks without real company secrets,
and explain how application, schema, metadata, Artifact and local Workspace state are protected or
restored if the first increment fails.

**Acceptance Scenarios**:

1. **Given** an allowed development or server environment, **When** the setup instructions are
   followed, **Then** required tools, configuration ownership, secret handling, build/test commands
   and database-migration controls are explicit and no unapproved installation is required.
2. **Given** the Technical Pilot scenario, **When** test data is prepared, **Then** it includes
   synthetic controlled documents, a representative resumable-transfer Artifact, two separately
   provisioned identities, and two candidate Vault locations if the successor is approved.
3. **Given** a failed deployment, migration, Check-in or restore exercise, **When** the recovery plan
   is applied, **Then** the expected metadata, Artifact and local Workspace preservation behavior is
   stated, along with the evidence needed to claim recovery success.

---

### User Story 5 - Record an honest PG4 decision (Priority: P1)

As the applicable gate authority, I want one reviewable readiness package with trace, blockers,
residual risks and a bounded next increment so that I can decide whether production implementation
may begin.

**Why this priority**: `PG4` is the explicit boundary between analysis/design and production
implementation. Passing it by inference would bypass the approved lifecycle.

**Independent Test**: Present the completed PH0 package to the recorded authority. The authority can
issue one attributable result, see every unmet entry condition, and identify the exact PH1 increment
that is or is not authorized.

**Acceptance Scenarios**:

1. **Given** all PH0 outputs, **When** the gate checklist is reviewed, **Then** each criterion links
   to executed evidence or an explicit `BLOCKED`/`NOT-RUN` result.
2. **Given** a material prerequisite or required review is missing, **When** the authority decides
   `PG4`, **Then** neither `PASS` nor `PASS-WITH-ACTIONS` may authorize implementation while that
   mandatory input remains missing.
3. **Given** approved PG2/PG3 baselines and an attributable `PASS` or valid `PASS-WITH-ACTIONS`
   result, **When** implementation begins, **Then** authorization is limited to the exact PH1
   increment and baseline named in the gate record, with any conditional actions and limits; it
   does not authorize the whole Core v0 roadmap or a commercial release.
4. **Given** no attributable gate disposition, **When** progress is reported, **Then** execution
   state remains `NOT-RUN` or `IN-PROGRESS` and outcome is `NOT-APPLICABLE`, never `PASS`.

### Edge Cases

- The approved commit and the current source version differ: retain both identities and classify
  the current source as successor, editorial correction or unrelated change before use.
- A document's own status line still says approval is pending while a later attributable approval
  record pins that exact version: record the precedence and the stale status text as a discrepancy.
- The later Vault successor is not approved by the P01/P02 due date: keep the predecessor approved
  baseline intact and record the successor as a gate blocker or remove it from the authorized first
  implementation increment; do not imply approval.
- Only one human is available to operate two test identities: record one-human/two-identity evidence
  and do not claim independent human review.
- A realistic multi-gigabyte file is unavailable or unsafe to use: use an authorized synthetic file
  whose size, digest and generation method are recorded; do not copy restricted engineering data.
- A second Vault host or location is unavailable: preserve the two-location test case as `BLOCKED`
  or `NOT-RUN`; a second folder on the same failure domain cannot silently prove location diversity.
- A tool, SDK, library, sample, font, diagram asset or source repository has unclear licensing:
  keep it reference-only and exclude it from the implementation baseline until intake is complete.
- A review check is not executable on the available machine: record the missing tool or authority
  and its gate effect; do not substitute an unrelated check and report `PASS`.

## Requirements *(mandatory)*

The `FR-*` identifiers below are requirements of this readiness increment. They are not additional
product requirements and do not extend the approved `REQ-*` ledger.

### Functional Requirements

- **FR-001**: The readiness package MUST contain an exact baseline manifest that identifies the
  approved Feature, Spec and Tech sources, their versions, recorded hashes, approval record and
  pinned Git commit.
- **FR-002**: The baseline manifest MUST list every successor source considered by PH0 separately,
  with its change record, disposition, authority and current evidence status.
- **FR-003**: The readiness package MUST identify and explain any conflict between source status
  text, approval records, roadmap references and current repository state without silently choosing
  the most convenient value.
- **FR-004**: The increment MUST define one canonical Technical Pilot scenario, its actors, starting
  state, controlled steps, expected outcomes, failure paths and exact completion evidence.
- **FR-005**: Every canonical-scenario step MUST trace to existing controlled `REQ-*`, architecture
  and verification sources; PH0 MUST NOT invent replacement product behavior.
- **FR-006**: The increment MUST list mandatory pilot scope, deferred product scope and prohibited
  claims, and MUST preserve deferred Feature/Spec obligations for later increments.
- **FR-007**: Every unresolved decision or dependency MUST record its stable ID, question, current
  state, accountable owner, due date or condition, closure evidence, affected work and gate effect.
- **FR-008**: The exact Product Decision Authority disposition of the multi-location Vault successor
  MUST be recorded before that successor is treated as an approved implementation input.
- **FR-009**: The delivery-environment record MUST identify permitted developer/server environments,
  required tool families, configuration and secret ownership, repeatable build/test entry points,
  database migration controls and prohibited workstation actions.
- **FR-010**: The test-data strategy MUST define authorized synthetic fixtures, identity separation,
  file-size/digest evidence, candidate Vault locations and a matrix covering normal, denied, stale,
  interrupted, retry and recovery paths.
- **FR-011**: The recovery plan MUST cover application and schema rollback, preservation of local
  Workspace candidates, metadata/Artifact consistency, backup restoration and evidence retention.
- **FR-012**: The security-review plan MUST identify the protected assets, trust boundaries, abuse
  cases, required reviewer competence, unresolved review gaps and the gate effect of each gap.
- **FR-013**: Every external software, code, content, model, dataset, font, asset or service proposed
  for inclusion MUST follow the repository external-source intake process before import or adaptation.
- **FR-014**: The readiness checklist MUST map each `P01` through `P07` completion condition to a
  source artifact, owner, executed result and retained evidence link.
- **FR-015**: The `PG4` record MUST identify the exact reviewed baseline, date, authority, rationale,
  blockers, residual risks and proposed/authorized next increment; it MUST separate Gate Execution
  State from Gate Outcome and record any conditional actions with the fields and limits defined
  above, without converting unexecuted work into a pass.
- **FR-016**: No production implementation task may start under this increment before an attributable
  `PG4 PASS` or valid `PASS-WITH-ACTIONS` authorizes its exact successor increment with approved
  PG2 requirements and PG3 architecture/design in place.
- **FR-017**: A `PG4 PASS` or `PASS-WITH-ACTIONS` MUST NOT be represented as full Core v0 completion, production acceptance,
  company rollout, SLA evidence, commercial readiness or permission to use customer data.

### Key Entities *(include if feature involves data)*

- **Baseline Entry**: One exact controlled source, version, hash, commit, authority and disposition
  used or considered by the readiness review.
- **Successor Delta**: A change made after an approved baseline, with its own source set, impact and
  required authority decision.
- **Canonical Scenario**: The bounded end-to-end behavior the Technical Pilot must demonstrate,
  including normal and failure paths and trace to controlled product requirements.
- **Open Decision**: A question whose unresolved answer affects scope, architecture, environment,
  evidence or gate outcome; it has one owner, due condition and closure evidence.
- **Environment Profile**: The permitted machines, services, tool families, configuration ownership
  and repeatable commands used to build and verify the next increment.
- **Test Dataset Profile**: The identities, document fixtures, Artifact characteristics, Vault
  locations and expected results used to produce attributable evidence.
- **Recovery Plan**: The rollback, preservation, backup, restore and reconciliation steps required
  before a failed change can be recovered safely.
- **Gate Record**: The attributable `PG4` decision over one exact readiness baseline and one bounded
  successor increment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Feature, Spec and Tech sources used by the readiness review resolve to an exact
  version and hash; approved predecessor and later Draft successor entries are not conflated.
- **SC-002**: 100% of canonical-scenario steps and failure paths have at least one controlled
  requirement source and one planned verification source.
- **SC-003**: 100% of mandatory/deferred scope entries have an explicit disposition and destination;
  no approved Feature group or `REQ-*` row disappears from trace.
- **SC-004**: 100% of open decisions and external dependencies have an owner, due condition, closure
  evidence and gate effect before the `PG4` review.
- **SC-005**: The retained test matrix covers normal, denied, stale, interrupted, idempotent retry and
  recovery behavior for every applicable step in the bounded scenario.
- **SC-006**: Every proposed external dependency or adapted source has a completed intake record or a
  visible `BLOCKED`/reference-only disposition; zero unlicensed imports enter the baseline.
- **SC-007**: The recovery package identifies how to restore or reconcile application, schema,
  metadata, Artifact and local Workspace state for every planned material failure exercise.
- **SC-008**: The `PG4` package gives the gate authority enough information to issue one attributable
  result without relying on chat history, undocumented assumptions or a stale rendition.
- **SC-009**: Production implementation remains at zero tasks started until the gate record contains
  an attributable `PASS` or valid `PASS-WITH-ACTIONS` for the exact next increment, with approved
  PG2/PG3 baselines and all recorded authorization conditions met.

## Assumptions

- The Product Decision Authority's 17-09-2026 approval applies only to the exact predecessor pinned
  by `IE-CHG-PDA-APPROVAL-001`; it does not silently approve successor Vault documents.
- The project user is the primary developer and internal document reviewer. A second software
  colleague may receive information but is not assumed to provide full-time implementation capacity.
- Initial operation uses internal native IDEA accounts. Future company-login integration remains
  outside PH0 unless separately approved.
- The current product purpose is internal engineering work. Commercial readiness is a future,
  separately governed direction and not a Technical Pilot success claim.
- Environmental values that require company infrastructure, license or specialist confirmation may
  remain open during P01/P02, but they must be owned and dispositioned before the gate they affect.
- Exact performance and capacity thresholds are not invented in PH0. The test profile records the
  actual environment, corpus and measurements; a Technical Pilot result is not an SLA.

## Dependencies

- Current `CONTEXT.md`, accepted ADRs, controlled Feature/Spec/Tech sources and VVP.
- `DOC-07@0.14`, Appendix A and the current Technical Pilot Kanban as planning authorities.
- An attributable Product Decision Authority decision on the exact multi-location Vault successor.
- Company-approved development/server access and any required QLHT/technical-support action.
- Authorized test identities, synthetic fixtures and two distinct candidate Vault locations if
  multi-location behavior is included in the authorized implementation increment.
- Suitable security/operations review competence for the checks classified as material.

## Out of Scope

- Production implementation, package installation, service deployment or database migration.
- Reopening the 14 approved Feature groups, 87 approved SRS requirements or selected Tech Stack.
- Full Core v0, company rollout, production acceptance, SLA proof or broad format qualification.
- Company SSO, graphical workflow design, every CAD/Office format, active/active multi-site operation,
  customer data, customer installations, public service operation, billing or commercial release.
