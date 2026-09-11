RSK

# Risk Register

> **Template state**: `INSTRUCTION-ONLY`. Use one record per material risk; do not hide residual risk
> in a gate or roadmap statement.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `RSK` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | DOCs, evidence, requirements, changes, gates and releases |
| Evidence / Claim Status | `UNKNOWN` until risk evidence is classified |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `RSK` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `RSK` |
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

## Risk records

| Risk ID | Statement / cause / consequence | Affected baseline or DOC | Likelihood / impact method | Treatment and control | Owner | Residual disposition | Escalation / review trigger | Evidence |
|---|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Treat security, privacy, safety, auditability, rollback, reconciliation, recovery, accessibility,
localization and clean-room risks explicitly when applicable. A missing owner or evidence is
`UNKNOWN`/`BLOCKED`, not an implicit acceptance.

## Gate and trace links

| Gate / requirement / change | Risk response required | Evidence / outcome | Status |
|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## Risk ownership and cross-document treatment

Each material risk has one accountable owner and one authoritative treatment record. Core documents
link the risk and summarize only the conclusion relevant to their authority; they do not duplicate
the risk rule or residual disposition.

| Risk concern | Required owner/treatment fields | Cross-document links |
|---|---|---|
| Requirements or scope | Trigger, affected baseline, treatment, acceptance impact and review trigger | `DOC-01`, `DOC-03`, `DOC-04`, `CHG` |
| Architecture, data or integration | Failure mode, dependency, security/privacy impact, mitigation and verification | `DOC-05`, `DOC-06`, `VVP`, `VEV` |
| UI/UX, accessibility or localization | Surface/locale cell, population, limitation, mitigation and evidence | `DOC-08`, `GOV`, `VVP`, `VEV` |
| Release, rollback or operations | Exact release, residual risk, recovery evidence, escalation and expiry | `DOC-07`, `REL`, `OPS`, `CHG` |

An unowned risk, missing evidence or expired action remains `UNKNOWN`/`BLOCKED`. A residual-risk
acceptance names the authority, scope, expiry and review trigger; it cannot be hidden in a gate or
roadmap status.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
