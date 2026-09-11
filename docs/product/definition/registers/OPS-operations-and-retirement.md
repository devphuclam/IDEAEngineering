OPS

# Operations and Retirement Record

> **Template state**: `INSTRUCTION-ONLY`. This record captures support, incident, recovery, retention,
> operational learning and retirement evidence for the internal product.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `OPS` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until an operations role is assigned |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | DOC-01/03/04/07, REL, RSK, CHG and verification links |
| Evidence / Claim Status | `UNKNOWN` until operational evidence exists |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `OPS` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `OPS` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Status | `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Version | `major.minor` |
| Applicable Baseline | `UNKNOWN` |
| Effective Date | `NOT APPLICABLE` until approved |
| Authors | `UNKNOWN` |
| Reviewers | `UNKNOWN` |
| Approvers | `UNKNOWN` |
| Source Links | `UNKNOWN` |
| Downstream Links | `UNKNOWN` |
| Evidence / Claim Status | `UNKNOWN` |
| Change History | `UNKNOWN` |
| Access Classification | `UNKNOWN` |
| Retention Rule | `UNKNOWN` |
| Content State | `INSTRUCTION-ONLY` |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Support and operational readiness

| Capability / dependency | Owner | Procedure / evidence | Monitoring or trigger | Status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Incident and recovery records

| Incident / recovery ID | Affected baseline | Detection and impact | Response / containment | Recovery evidence | Residual risk / follow-up |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Retention, dependency and operational learning

| Record / dependency | Classification and retention rule | Review result | Learning / linked change | Owner |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Retirement

| Retirement item | Preconditions and impact | Data/export/hold handling | Approval / effective date | Result |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT-RUN` |

## 5. Feedback to product documents

| Learning / need | DOC-01/03/04/07 link | RSK / CHG / VEV link | Disposition | Status |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 6. Gate-to-operation handoff

| Handoff area | Required input / evidence | Owner / authority | Missing-work disposition |
|---|---|---|---|
| Support readiness | Approved `DOC-07` scope, support procedure, dependency inventory and contact path | Operations role when assigned; Product Decision Authority for scope | `BLOCKED` until an accountable owner exists |
| Incident and recovery | Exact release baseline, incident severity/containment, recovery procedure and restore evidence | Operations/recovery owner | `NOT-RUN` if no execution evidence exists |
| Retention and dependency | Classification, retention/hold, dependency/version watch and review trigger | Records/configuration owner | `UNKNOWN` or `BLOCKED` with resolution owner |
| Operational learning | Validated observation, affected DOC/RSK/CHG and proposed disposition | Product Decision Authority | Must become a traceable change/need, not an informal note |

## 7. Controlled retirement and feedback rules

Retirement requires an exact affected baseline, dependency and data-export/hold assessment, support
and recovery impact, accountable approval, effective date and retained result. Retirement is not
deletion; superseded records remain traceable for the applicable retention period. A feedback record
links to the owning `DOC-01`, `DOC-03`, `DOC-04` or `DOC-07` item and uses `RSK`/`CHG` when it changes
scope, requirements, risks, operations or release claims.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
