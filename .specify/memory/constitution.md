<!--
Sync Impact Report:
- Version change: 3.3.0 -> 3.4.0
- Modified principles:
  - I. DDM Baseline, Aras-Informed Improvement, and Clean-Room Product Definition
- Added guidance:
  - IDEA Engineering remains internal-first for the current multi-year delivery horizon
  - Current work preserves a lawful future commercial path without creating commercial scope
  - Third-party software, content, assets, data, models, fonts, and SDKs require controlled license intake
  - External pilots, offers, customer data, installations, or sales require a separate Commercial Readiness Gate
- Removed guidance:
  - The prior rule that a future commercial direction required another constitutional amendment
- Follow-up TODOs: none
-->

# IDEA Engineering Constitution

## Core Principles

### I. DDM Baseline, Aras-Informed Improvement, and Clean-Room Product Definition

IDEA Engineering's primary product objective is to reproduce DDM's externally observable PDM and
PLM capabilities, workflows, and user-visible semantics through an independently designed and
implemented product. A behavior established by lawfully available official or authorized DDM
evidence MUST default to `ADOPT` in the controlled DDM coverage register unless an approved IDEA
product decision records `ADAPT`, `DEFER`, or `EXCLUDE` with rationale, impact, and verification.

Official Aras Innovator material MUST be evaluated proactively as a quality benchmark for each
material product area, not only when DDM evidence is missing. Where evidenced Aras behavior offers
a stronger pattern for usability, configurability, data integrity, security, auditability,
extensibility, interoperability, lifecycle governance, or maintainability, the comparison MUST
identify the DDM limitation, the Aras advantage, the affected stakeholders and risks, and a
recommended `ADAPT-ARAS` IDEA behavior. A material adaptation MUST be presented to the Product Owner
and MUST NOT silently replace the DDM reference behavior.

When DDM evidence is silent, ambiguous, or insufficient to define a behavior, official Aras
Innovator documentation MUST also be evaluated as the first fallback. If neither source resolves
the behavior, it MUST remain `UNKNOWN` until an approved IDEA decision supplies an independently
justified, verifiable rule. Applicable law, standards, security, safety, accessibility, immutable
product-baseline guarantees, and Organizational Isolation take precedence and MUST produce an
explicit `ADAPT`, `ADAPT-ARAS`, or `EXCLUDE` disposition rather than a hidden divergence.

Every resulting IDEA requirement MUST still have a stable identity, source trace, rationale,
acceptance criterion, and verification method. DDM or Aras evidence establishes the reference
behavior and scope; it does not authorize copying source code, binaries, database schemas,
undocumented protocols, visual assets, proprietary documentation, trademarks, or other protected
implementation material. "Copy DDM" means clean-room behavioral parity, not implementation,
pixel, branding, or internal-schema identity.

IDEA Engineering MUST be governed as an internal-first product for the company's own engineering
work during the current multi-year delivery horizon. The reference-product strategy MUST serve
evidenced internal needs and MUST NOT be used to invent present commercial capabilities or release
claims. In current Core Product Documents, business value means internal operational control,
engineering-data integrity, release risk reduction, quality, maintainability, and measured
efficiency. Sales, revenue, customer acquisition, commercial buyer personas, pricing, market share,
and market fit remain outside the current product boundary.

The project MUST preserve a lawful path to a possible future commercial product without treating
that direction as current Product Scope. Architecture, dependencies, data custody, configuration,
deployment, export, migration, retirement, security, privacy, and ownership decisions MUST avoid
unnecessary restrictions that would make a future commercial assessment impossible or knowingly
unlawful. Work that exists only for external customers, licensing enforcement, billing, public
SaaS, multi-customer operation, sales, or commercial support MUST remain deferred until a separate
approved increment and Commercial Readiness Gate authorize it.

Every external project, package, source fragment, asset, document, dataset, model, font, SDK,
runtime, converter, and generated artifact MUST be classified and reviewed under the repository's
external-source intake procedure before it is copied, adapted, vendored, linked, redistributed, or
used to produce a release. Public availability MUST NOT be interpreted as reuse permission. Exact
source identity, version or commit, governing license or agreement, transitive obligations,
attribution, patent and trademark limits, intended use, and distribution model MUST be recorded.
Missing or incompatible rights MUST result in `REFERENCE-ONLY`, `BLOCKED-LEGAL`, or `REJECTED`, not
an implementation assumption.

MVP increments MAY deliver a controlled subset, but every omitted evidenced DDM capability MUST be
visible as `DEFER` or `EXCLUDE`; absence from the current increment MUST NOT silently erase the
long-term parity target. `UNKNOWN` and `BLOCKED` MUST remain visible and MUST NOT be filled by
assumption. Complete DDM parity MUST NOT be claimed without an identified target version, edition,
configuration, lawful evidence scope, and objective coverage results.

Rationale: the current objective is an internal DDM-like product improved with the strongest
evidenced Aras patterns. Clean-room provenance, license intake, traceability, explicit divergence
controls, and an internal-first boundary keep the current result lawful and relevant while avoiding
avoidable barriers to a separately governed commercial assessment in later years.

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

- IDEA Engineering is internal-first. DOC-01 through DOC-08 MUST express company stakeholders,
  internal operating contexts, internal governance, operational outcomes, and evidenced engineering
  value for the current baseline. They MUST NOT introduce commercial customer segmentation,
  external buyer journeys, pricing, revenue, market-share, or market-fit objectives unless a later
  controlled product decision explicitly brings those subjects into scope.
- Future commercial direction is governed separately from current product delivery. No external
  pilot, offer, customer-data receipt, customer installation, public hosted service, or sale may be
  claimed or started until the Commercial Readiness Gate records applicable legal, security,
  privacy, licensing, support, deployment, contractual, operational, and release dispositions.
- DDM behavioral parity is the default long-term product target. The controlled coverage register
  MUST identify each reference capability or behavior, DDM evidence and limitation, applicable Aras
  comparison and evidenced advantage, IDEA disposition, owning requirement or decision, delivery
  increment, and verification result. Aras is not a second full-product parity target; it is the
  required quality benchmark and the first fallback for DDM gaps. The intended outcome is DDM
  capability coverage with reviewed Aras-informed improvements.
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
- DOC-01 through DOC-08 MUST use only IDEA product language and MUST NOT contain the name `Aras`,
  Aras-specific citations, or competitor-comparison narrative. Aras evidence, provenance, and
  comparisons MUST remain in supporting research, comparison or coverage registers, and ADR or
  governance records; only the reviewed and approved IDEA need, requirement, behavior, design, or
  decision may cross into a Core Product Document.
- Supporting controlled information MUST cover governance and standards (`GOV`), clean-room
  provenance (`CLR`), risk (`RSK`), verification planning and evidence (`VVP` and `VEV`),
  configuration and change (`CMP` and `CHG`), release (`REL`), and operations (`OPS`). Traceability
  is a cross-cutting view across these items rather than a competing source of truth.
- Markdown under version control is the authoritative editable source unless an approved information
  item explicitly defines another controlled format. DOCX and PDF renditions MUST identify the exact
  source baseline from which they were produced.
- Raw proprietary evidence, material without the rights needed for its recorded use, credentials,
  company-sensitive or production data not approved for repository use, copied competitor
  implementation, and unsupported conformity claims MUST NOT enter the product repository.
- External-source intake MUST precede importing or adapting third-party software, source, assets,
  data, models, fonts, SDKs, runtimes, converters, or generated material. Release preparation MUST
  reconcile the exact shipped dependency and asset inventory with recorded licenses, notices,
  source-delivery obligations, and company approvals.
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
No deviation may convert missing evidence into PASS, erase an `UNKNOWN` or `BLOCKED` result, bypass
the controlled DDM coverage and requirement-translation records, or treat competitor implementation
material as IDEA implementation authority.

The standards and policy baseline MUST be reviewed on its recorded cadence and when a source is
published, amended, withdrawn, superseded, contractually required, or made applicable by a material
change in system boundary or deployment. A new edition MUST enter through controlled impact and
tailoring review; it MUST NOT silently replace the approved baseline.

**Version**: 3.4.0 | **Ratified**: 2026-08-13 | **Last Amended**: 2026-09-17
