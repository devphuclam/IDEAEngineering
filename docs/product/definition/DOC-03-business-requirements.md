DOC-03

# Business Requirements

> **Template state**: `INSTRUCTION-ONLY`. Use this structure to capture internal stakeholder needs and
> business rules; do not approve a requirement from a reference observation alone.
>
> **Authority**: DOC-03 owns internal needs, actors, operational scenarios, business processes/rules,
> priorities, constraints and acceptance intent. DOC-04 owns software requirement obligations.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until assigned |
| Document Class | `DOC-03` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until an accountable role/person is named |
| Document Status | `Draft` for this scaffold; instance uses `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Document Version | `0.1` scaffold version; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact need/gate/increment baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities, role, competence, independence and authority basis |
| Source Links | Stakeholder evidence, accepted decision, research finding or ADR |
| Downstream Links | DOC-04, DOC-07, DOC-08, RSK, VVP, CHG and verification |
| Evidence / Claim Status | Classify each need and claim; reference evidence is not internal validation |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until authored and reviewed |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Internal stakeholders and actors

<!-- Identify company roles, operating context, affected product data and decision authority. Record representative population status. -->

| Stakeholder / actor | Internal context | Need or responsibility | Evidence / decision link | Population status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Business needs

Each need receives a stable identity, source, rationale, priority, owner and acceptance intent. A
reference-product observation may inform a hypothesis but cannot substitute for an internal need or an
approved product decision.

| Need ID | Actor / context | Desired outcome | Current consequence | Source / evidence class | Priority | Status |
|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Operational scenarios and processes

<!-- Describe trigger, preconditions, actors, controlled Product Definition, normal path, negative path, postconditions and evidence. -->

| Scenario ID | Trigger / precondition | Normal and negative path | Controlled outcome | Acceptance intent |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Business rules and constraints

| Rule / constraint ID | Rule or constraint | Rationale / source | Affected DOC or data | Verification / review trigger |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Business rules must not silently select an implementation stack, database, deployment topology or
identity provider. Link a later approved design decision instead.

## 5. Priorities, assumptions and non-goals

### 5.1 Priority model

<!-- Use an approved priority vocabulary and state the decision owner. Do not infer priority from document order. -->

### 5.2 Assumptions and unresolved points

| Item | Assumption / gap | Impact | Owner | Resolution trigger | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

### 5.3 Non-goals and deferred needs

<!-- Record explicit exclusions, `DEFER` dispositions and why they do not belong in the current internal baseline. -->

## 6. Acceptance intent and claim boundaries

| Need / scenario | Acceptance intent | Evidence class/status | Required reviewer | Result |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT-RUN` |

Keep these pilot and claim statuses distinct: `Canonical Demo Dataset`, `Technical Pilot Verification`,
`Single-Actor Functional Acceptance`, `Internal Operational Need Validation`, `Internal Pilot
Acceptance`, and operational rollout authorization. A lower status cannot be relabeled as a higher one.

## 7. Trace and gate readiness

| Trace or gate item | Required link / rule | Result |
|---|---|---|
| Need to source | Evidence or approved decision with scope and limitation | `UNKNOWN` |
| Need to requirement | DOC-04 requirement ID and rationale | `UNKNOWN` |
| Need to roadmap | DOC-07 increment and dependency | `UNKNOWN` |
| First gate | `PG1` exact input baseline and outcome | `NOT-RUN` |
| Change impact | `CHG`/Work Item when a material need changes | `UNKNOWN` |

## Internal-company value and claim boundary

| Value/claim area | Required treatment | Status |
|---|---|---|
| Internal operating outcome | State the affected company role, workflow, control, quality, maintainability or evidenced efficiency | `UNKNOWN` |
| Technical or pilot claim | Link the exact evidence class, scope, limitation and authority; keep technical verification separate from acceptance | `UNKNOWN` |
| Commercial objective | Pricing, revenue, customer acquisition, market-share, market-fit or external-buyer objective | `NOT APPLICABLE` |

## Pilot claim/status matrix

| Claim status | Minimum evidence | What it does not prove | Result |
|---|---|---|---|
| `Canonical Demo Dataset` | Approved synthetic dataset and exact test baseline | Internal need, pilot acceptance or rollout | `NOT-RUN` |
| `Technical Pilot Verification` | Approved non-production execution, configuration and `VEV` result | Representative acceptance or rollout authority | `NOT-RUN` |
| `Single-Actor Functional Acceptance` | One person operating separately provisioned identities, with scope and limitations | Independent review or representative-user acceptance | `NOT-RUN` |
| `Internal Operational Need Validation` | Representative internal roles/workflows and attributable evidence | Technical readiness by itself or rollout authorization | `NOT-RUN` |
| `Internal Pilot Acceptance` | Technical evidence, representative internal-user evidence and named authority | Broader rollout beyond approved scope | `NOT-RUN` |
| Operational rollout authorization | Named authority, exact scope, accepted residual risk and release baseline | No claim outside the authorized scope | `NOT-RUN` |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | Stakeholder evidence, internal decision or bounded reference finding | `UNKNOWN` |
| `DOWNSTREAM` | DOC-04 requirement, DOC-07 increment, DOC-08 interaction or affected data/design | `UNKNOWN` |
| `CHANGE` | `CHG`/Work Item and impact across requirements, design, risks, tests, operations and release | `UNKNOWN` |
| `VERIFICATION` | VVP/VEV method and exact result for the requirement-bearing consequence | `UNKNOWN` |
| `RELEASE` | REL baseline and authorized claim scope | `UNKNOWN` |
| `RENDITION` | Source-pinned DOCX/PDF metadata and stale/superseded disposition | `UNKNOWN` |

Supporting records provide evidence and trace; they do not rewrite a business rule owned here.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Project domain language](../../../CONTEXT.md)
