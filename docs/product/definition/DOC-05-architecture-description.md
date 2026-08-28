DOC-05

# Architecture Description

> **Template state**: `INSTRUCTION-ONLY`. Use this structure for an approved architecture/design
> baseline; it does not select a production technology stack by itself.
>
> **Authority**: DOC-05 owns the system-of-interest context, boundaries, viewpoints/views,
> responsibilities, interfaces, quality scenarios, risks, ADR links and verification implications.
> Business needs remain in DOC-03 and software obligations remain in DOC-04.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until assigned |
| Document Class | `DOC-05` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until an accountable architecture owner is named |
| Document Status | `Draft` for this scaffold; instance uses `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Document Version | `0.1` scaffold version; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact requirements/increment/gate baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities, competence, independence and authority basis |
| Source Links | DOC-04 requirements, DOC-03 decisions, evidence and accepted ADRs |
| Downstream Links | DOC-06, DOC-07, DOC-08, VVP, RSK, CHG and release records |
| Evidence / Claim Status | Classify architecture observations and verification claims |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until the architecture baseline is authored and reviewed |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. System of interest and context

<!-- Define the internal product boundary, external actors/systems, trust boundaries and assumptions. Do not copy an external implementation. -->

| Context item | Description | Authority / evidence | Status |
|---|---|---|---|
| System of interest | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Internal actor or role | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| External boundary | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Concerns, quality attributes and scenarios

| Concern / quality attribute | Stimulus and operating condition | Expected response / metric | Risk if unmet | Verification link |
|---|---|---|---|---|
| Correctness / traceability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Security / privacy / isolation | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Recovery / reconciliation | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Maintainability / operability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Add only concerns justified by an approved DOC-04 requirement or decision. A quality label without a
stimulus, condition, response and evidence method is not a verifiable claim.

## 3. Viewpoints and views

| Viewpoint | Intended concern / audience | View or model reference | Decision/evidence link | Review status |
|---|---|---|---|---|
| Context | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Responsibility / capability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Information / data | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Deployment / operation | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Responsibilities and interfaces

| Responsibility or interface ID | Owner | Inputs / outputs | Contract and error behavior | Security / classification | Requirement / ADR trace |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Do not introduce an API, database, identity provider, deployment topology or service boundary as a
unapproved product rule. If a technology is evaluated, link the approved decision and exact scope.

## 5. Data, lifecycle and integration implications

<!-- Summarize authoritative data ownership and lifecycle; defer detailed data semantics to DOC-06. -->

| Topic | Architectural implication | DOC-06 / requirement link | Status |
|---|---|---|---|
| Product Definition identity and version | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Workflow, review and release | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Integration boundary | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Audit, retention and recovery | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 6. Decisions, risks and constraints

| Record | ID | Decision/risk/constraint | Impacted baseline | Owner / treatment | Status |
|---|---|---|---|---|---|
| ADR / RSK / CHG | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 7. Verification and gate readiness

| Gate / verification item | Required evidence | Result |
|---|---|---|
| PG3 architecture review | Views, responsibilities, interfaces, quality scenarios, risks and approved ADR links | `NOT-RUN` |
| Requirement consistency | Every architectural obligation traces to DOC-04; no architecture statement overrides a requirement | `UNKNOWN` |
| Increment readiness | DOC-07 scope, dependencies, test design, migration and rollback are pinned | `UNKNOWN` |
| Change impact | `CHG`/Work Item covers affected requirements, data, UI, tests, operations and release | `UNKNOWN` |

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Project domain language](../../../CONTEXT.md)
