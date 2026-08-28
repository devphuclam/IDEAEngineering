DOC-01

# Product Vision and Scope

> **Template state**: `INSTRUCTION-ONLY`. This file supplies the controlled structure for a DOC-01
> instance; it is not an approved product statement.
>
> **Authority**: DOC-01 owns internal purpose, problem hypothesis, stakeholders, boundary, trajectory,
> non-goals and success measures. It does not own detailed requirements, architecture or delivery
> scheduling.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until an instance identity is assigned |
| Document Class | `DOC-01` |
| Title | `UNKNOWN` until the instance title is approved |
| Owner | `UNKNOWN` until an accountable role/person is assigned |
| Document Status | `Draft` for this scaffold; use `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` for an instance |
| Document Version | `0.1` scaffold version; use `major.minor` for the instance |
| Applicable Baseline | `UNKNOWN` or an exact product/gate/increment baseline |
| Effective Date | `NOT APPLICABLE` until approval establishes authority |
| Authors | `Principal Product Author` plus attributable identities |
| Reviewers | `UNKNOWN`; record competence and independence where applicable |
| Approvers | `UNKNOWN`; record authority basis and decision date |
| Source Links | Link to stakeholder need, evidence, decision or accepted ADR; use `UNKNOWN` when absent |
| Downstream Links | Link to DOC-02, DOC-03, DOC-07, requirements, changes and verification |
| Evidence / Claim Status | `UNKNOWN` until each claim is classified and linked |
| Change History | `UNKNOWN` or linked `CHG`/Work Item records |
| Access Classification | `INTERNAL` or the approved repository/storage classification |
| Retention Rule | `UNKNOWN` or the applicable controlled rule |
| Content State | `INSTRUCTION-ONLY` until all required sections are authored and reviewed |

Do not move an instance to `Proposed` or `Approved` while a required field is `UNKNOWN` or `BLOCKED`
without an owner, resolution action and review trigger.

## Authored-content boundary

Instructions stay outside the delimiters below. Author only controlled IDEA product content between the
literal markers; retain evidence links and explicit gap dispositions.

<!-- AUTHOR CONTENT START -->

## 1. Internal purpose

<!-- State the internal engineering problem and the controlled outcome. Cite an eligible need/decision. -->

### 1.1 Problem hypothesis and evidence class

| Field | Instruction |
|---|---|
| Problem hypothesis | Describe the internal problem, affected work and consequence; do not state an unmeasured benefit as fact |
| Evidence class | Use one controlled class such as `IDEA DECISION`, `IDEA REQUIREMENT`, `INFERENCE`, `UNKNOWN`, or `BLOCKED` |
| Evidence references | Link exact source IDs, scope, limitations and lawful-access basis |
| Internal need status | `UNKNOWN` until representative company evidence exists; a reference observation is not internal need validation |

### 1.2 Intended internal outcome

<!-- Define the operational control, data integrity, release-risk, quality, maintainability or measured-efficiency outcome. -->

## 2. Stakeholders and operating context

<!-- Identify internal roles, workflows, organizational boundary, assumptions and affected product data. -->

| Stakeholder / role | Context and need | Decision or evidence link | Owner / review status |
|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Scope boundary and trajectory

### 3.1 Included scope

<!-- State the exact PDM capability boundary and any approved PLM evolution that remains inside C1. -->

### 3.2 Explicit exclusions and deferred scope

<!-- Record what is excluded, why, owner, review trigger and linked change/decision. An omitted reference capability is visible as `DEFER` or `EXCLUDE`, never silently absent. -->

| Item | Disposition | Rationale | Owner / review trigger |
|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

### 3.3 Boundary and dependency map

<!-- Identify upstream/downstream IDEA records and external boundaries without choosing an unapproved runtime stack. -->

## 4. Product direction and success measures

### 4.1 Product direction

<!-- Explain the intended internal product direction and the controlled path from PDM capability toward PLM. -->

### 4.2 Success measures

| Measure ID | Internal outcome | Baseline / target | Evidence method | Status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Do not enter monetization, sales, external-buyer, acquisition, market-positioning or other commercial
objectives in this document.

## 5. Assumptions, risks and decisions

<!-- Link risks to RSK, decisions to their authority, and unresolved points to a named resolution path. -->

| Record type | ID | Statement / impact | Disposition |
|---|---|---|---|
| `RSK` / decision | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 6. Trace and review readiness

<!-- Show the upstream need/evidence → DOC-01 decision → downstream document/requirement path. -->

| Trace item | Required link | Result |
|---|---|---|
| Authority owner | `GOV` / accountable role | `UNKNOWN` |
| First gate | `PG1` package and exact baseline | `UNKNOWN` |
| Later impact | DOC-02, DOC-03, DOC-07, `CHG`, verification and release links | `UNKNOWN` |
| Review outcome | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED`, or `NOT-RUN` as applicable | `NOT-RUN` |

## Internal-company value boundary

Record value as an internal operational outcome, not as a commercial promise.

| Value dimension | Required evidence or measure | Status |
|---|---|---|
| Engineering-data integrity and control | Internal baseline, failure mode and measurable control outcome | `UNKNOWN` |
| Release-risk reduction and quality | Internal risk/quality baseline and verification method | `UNKNOWN` |
| Maintainability and evidenced efficiency | Defined scope, baseline, metric and evidence owner | `UNKNOWN` |
| Commercial objectives | Pricing, revenue, customer acquisition, market-share, market-fit or external-buyer objective | `NOT APPLICABLE` |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | Internal need, decision, evidence or accepted ADR with scope and limitation | `UNKNOWN` |
| `DOWNSTREAM` | DOC-02, DOC-03, DOC-07 and any derived requirement/design item | `UNKNOWN` |
| `CHANGE` | `CHG`/Work Item, impact analysis and successor baseline | `UNKNOWN` |
| `VERIFICATION` | `VVP` procedure and `VEV` result against an exact configuration | `UNKNOWN` |
| `RELEASE` | `REL` manifest and `DOC-07` increment consuming this version | `UNKNOWN` |
| `RENDITION` | DOCX/PDF rendition ID, source ID/version/baseline, date, status, classification and retention | `UNKNOWN` |

Trace views are navigational and never a second authority. A stale, superseded or withdrawn rendition
is redirected to this Markdown source; it cannot be edited into authority or approved against another
baseline.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Control fields and status](../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Project domain language](../../../CONTEXT.md)
