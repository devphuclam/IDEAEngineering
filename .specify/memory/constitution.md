<!--
Sync Impact Report:
- Version change: 1.0.0 -> 2.0.0
- Modified principles:
  - I. Product-Neutral Core -> I. Stakeholder-Backed, Evidence-Bounded Product Definition
  - II. Specifications Before Implementation -> II. Controlled Documentation Before Implementation
  - III. Testable, Reproducible Verification -> IV. Measurable Quality, Verification, and Truthful Claims
  - IV. Isolated Collaboration and Durable Handoffs -> III. End-to-End Traceability and Controlled Change
  - V. Least-Privilege and Explicit Integration -> V. Secure, Least-Privilege, and Recoverable Delivery
- Added guidance:
  - standards applicability and tailoring vocabulary
  - eight-document product-definition system plus supporting registers
  - PG0-PG7 lifecycle gates and controlled gate outcomes
- Removed sections: none
- Follow-up work:
  - select and baseline human-centred-design and accessibility sources for DOC-08
  - create the approved DOC-01 through DOC-08 templates and supporting registers in a separate workflow
-->

# IDEA Engineering Constitution

## Core Principles

### I. Stakeholder-Backed, Evidence-Bounded Product Definition

Every approved requirement MUST trace to an identified stakeholder need or an approved IDEA
product decision. It MUST state its rationale, acceptance criterion, and verification method.
Competitor behavior, marketing, tutorials, public material, and authorized runtime observations
MUST remain classified evidence, findings, unknowns, boundaries, or design lessons until the
requirement-translation gate is satisfied.

DDM, icVault, and other external products MAY motivate questions, risks, comparison dimensions,
and independently authored design lessons. They MUST NOT be treated as parity specifications or
copied into IDEA requirements, schemas, user interfaces, protocols, or implementation. `UNKNOWN`
and `BLOCKED` MUST remain visible outcomes and MUST NOT be filled by assumption.

Rationale: IDEA Engineering must solve evidenced stakeholder problems while preserving clean-room
provenance and the scope of every claim.

### II. Controlled Documentation Before Implementation (NON-NEGOTIABLE)

Production implementation for an increment MUST NOT begin until its affected scope has an approved
requirements baseline at PG2, an approved architecture and design baseline at PG3, and an increment
readiness disposition at PG4. A `PASS-WITH-ACTIONS` disposition permits implementation only when its
recorded actions do not invalidate the requirements, architecture, risk treatment, test design, or
rollback readiness for that increment.

Pre-PG2 prototypes MAY be used only to answer explicit feasibility questions. They MUST be marked
throwaway, kept outside the production baseline, and MUST NOT be used as evidence that production
requirements, architecture, security, or quality gates have passed.

Documentation MUST support a decision, trace, verification obligation, controlled baseline, or gate.
The project MUST NOT measure documentation quality by page count, duplicate one fact across multiple
authoritative documents, or retain sections that have no decision or evidence purpose.

Rationale: code must implement an approved, testable product definition rather than become the
uncontrolled source from which requirements are reconstructed later.

### III. End-to-End Traceability and Controlled Change

The controlled trace chain MUST remain navigable in both directions:

```text
Evidence -> Finding -> Product Decision or Stakeholder Need
  -> Requirement -> Architecture, Interface, or ADR
  -> Change and Work Item -> Implementation Revision
  -> Verification Result -> Release Baseline
```

Every controlled information item MUST have a stable identity, owner, status, version, applicable
baseline, effective date, source and downstream links, and change history. Reviewer, approver,
access-classification, and retention fields MUST be recorded where applicable.

Every material baseline change MUST have a Change Record or traceable Work Item, impact analysis,
review, and approval. The analysis MUST cover affected requirements, architecture, data, interfaces,
UI/UX, risks, tests, roadmap, operations, and releases. A roadmap, schema, prototype, user-interface
design, or implementation detail MUST NOT silently override an approved requirement or decision.

Rationale: controlled traceability makes the product explainable, reviewable, testable, and safe to
change throughout its PDM-to-PLM evolution.

### IV. Measurable Quality, Verification, and Truthful Claims

Functional, interface, data, quality, security, privacy, operational, support, and retirement
requirements MUST be uniquely identified and verifiable. Quality requirements MUST define the
relevant stimulus, operating condition, expected response, metric or threshold where meaningful,
and required evidence.

Verification MUST identify the exact controlled configuration, environment, procedure, and result.
A check that was not run, was blocked, or used an unauthorized substitute MUST be reported as such;
it MUST NOT be reported as PASS. Backup completion MUST NOT be presented as recoverability evidence
without an applicable restore result.

Standards and policies MUST be registered with their exact selected version or controlled source,
applicability class, and tailoring disposition. IDEA Engineering MUST NOT claim ISO conformity,
certification, vendor parity, security, performance, or recovery capability without an approved
scope, lawful access where required, objective evidence, and the applicable formal decision.

Rationale: quality and compliance statements are product claims and are trustworthy only when they
are scoped, reproducible, and supported by controlled evidence.

### V. Secure, Least-Privilege, and Recoverable Delivery

Security, privacy, safety, auditability, rollback, reconciliation, and recovery MUST be considered
with the happy path from requirements through release and operation. Credentials and secrets MUST
remain outside source control. Identities, permissions, service connections, workers, and automated
delivery MUST use the least privilege supported by the approved environment.

External or company policies MAY become binding only after their authority, scope, platform,
applicability, conflicts, responsible owner, and verification method are recorded. Platform-specific
controls such as identity groups, approval counts, branch strategies, token lifetimes, and cloud or
on-premises choices MUST NOT be adopted as universal product rules without that assessment.

Release MUST fail closed when the exact baseline, verification evidence, residual-risk disposition,
rollback or recovery readiness, or required approval is incomplete. A weaker procedural control MAY
temporarily address a missing technical control only when the limitation and risk are explicit; it
MUST NOT be described as equivalent enforcement.

Rationale: controlled engineering data and the software that governs it require explicit trust
boundaries, recoverable failure behavior, and honest treatment of environmental limitations.

## Additional Constraints

- IDEA Engineering is C1: an independently useful PDM product that evolves toward PLM inside the
  same product boundary. Platform D MUST NOT be implemented before an independent C2 and concrete
  cross-application requirements exist.
- `CONTEXT.md` controls canonical product language. The standards register controls selected sources,
  versions, and applicability. Approved requirements control product obligations. Accepted ADRs and
  architecture baselines control approved design decisions. No lower-authority artifact may silently
  override a higher-authority decision within its scope.
- Standards MUST be classified as `STANDARD`, `STANDARD-GUIDED`,
  `STANDARD-GUIDED, CONDITIONAL`, `REFERENCE/WATCH`, or `PROJECT-CONVENTION`. Applicability records
  MUST use `APPLY`, `TAILOR`, `NOT-APPLICABLE`, or `BLOCKED` with rationale and evidence expectations.
- The controlled product-definition set consists of DOC-01 Product Vision and Scope, DOC-02
  Feasibility and Options Assessment, DOC-03 Business Requirements, DOC-04 Software Requirements
  Specification, DOC-05 Architecture Description, DOC-06 Data, Integration, and Migration
  Specification, DOC-07 MVP Roadmap and Delivery Plan, and DOC-08 UI/UX and Interaction
  Specification.
- Supporting controlled information MUST cover governance and standards (`GOV`), clean-room
  provenance (`CLR`), risk (`RSK`), verification planning and evidence (`VVP` and `VEV`),
  configuration and change (`CMP` and `CHG`), release (`REL`), and operations (`OPS`). Traceability
  is a cross-cutting view across these items rather than a competing source of truth.
- Markdown under version control is the authoritative editable source unless an approved information
  item explicitly defines another controlled format. DOCX and PDF renditions MUST identify the exact
  source baseline from which they were produced.
- Raw proprietary evidence, licensed material without redistribution rights, credentials, customer
  data, copied competitor implementation, and unsupported conformity claims MUST NOT enter the
  product repository.
- Technology, deployment, identity-provider, database, storage, framework, and integration choices
  MUST remain open until controlled requirements and architecture decisions justify them.

## Development Workflow

1. **PG0 - Governance:** approve the constitution, standards and tailoring approach, roles, gate
   model, clean-room controls, and configuration-management foundation.
2. **PG1 - Needs and feasibility:** baseline DOC-01, DOC-02, the applicable initial DOC-03 content,
   admitted evidence, assumptions, and initial risks.
3. **PG2 - Requirements:** approve DOC-03, DOC-04, and the requirement-bearing portions of DOC-06
   and DOC-08 with measurable acceptance and complete source traceability.
4. **PG3 - Architecture and design:** approve DOC-05, DOC-06, DOC-08, applicable ADRs, risk and
   threat treatment, quality scenarios, and the verification and validation strategy.
5. **PG4 - Increment readiness:** select the bounded scope in DOC-07 and record its requirements,
   Change Record, impact analysis, test design, controlled dependencies, migration, and rollback.
6. **PG5 - Verification and acceptance:** verify the exact controlled configuration and retain test,
   security, review, defect, waiver, coverage, and acceptance evidence.
7. **PG6 - Release authorization:** approve an immutable release manifest with hashes, SBOM and
   provenance where applicable, verification summary, known issues, residual risk, rollback,
   recovery, and operational readiness.
8. **PG7 - Operate and learn:** monitor, support, respond, recover, change, retain, and retire through
   controlled records; feed validated needs and evidence back into the lifecycle.

Gate outcomes are only `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED`. Every conditional action
MUST identify its owner, affected baseline, due condition or date, expiry, and escalation path.
Material PG2, PG3, PG5, and PG6 baselines require an appropriately independent reviewer or approver;
when that role is unavailable, the limitation MUST be recorded and the applicable gate MUST NOT be
self-certified.

Spec Kit owns bounded feature-artifact progression from specification through convergence. The eight
product-definition documents and supporting registers own product-level baselines. Each increment
MUST link the two layers; neither may silently duplicate or replace the other.

## Governance

This constitution governs IDEA Engineering repository work and supersedes conflicting generic
workflow defaults. Applicable law, contract, and approved company policy take precedence, but their
authority, scope, conflicts, and resulting project controls MUST be recorded through the standards
or policy applicability process.

An amendment MUST include a rationale, impact analysis, Sync Impact Report, semantic version change,
Product Owner approval, and a migration plan when existing baselines or workflows are incompatible.
Constitution versions follow semantic versioning:

- **MAJOR** for incompatible principle, authority, or governance changes;
- **MINOR** for a new principle or materially expanded mandatory guidance;
- **PATCH** for non-semantic clarification and correction.

Every Work Item, review, gate, and release MUST assess the applicable constitutional principles.
Approved deviations MUST record scope, rationale, risk, owner, approver, expiry, and remediation.
No deviation may convert missing evidence into PASS, erase an `UNKNOWN` or `BLOCKED` result, or turn
competitor evidence into an IDEA requirement.

The standards and policy baseline MUST be reviewed on its recorded cadence and when a source is
published, amended, withdrawn, superseded, contractually required, or made applicable by a material
change in system boundary or deployment. A new edition MUST enter through controlled impact and
tailoring review; it MUST NOT silently replace the approved baseline.

**Version**: 2.0.0 | **Ratified**: 2026-08-13 | **Last Amended**: 2026-08-27
