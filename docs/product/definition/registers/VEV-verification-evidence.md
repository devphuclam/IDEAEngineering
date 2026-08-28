VEV

# Verification Evidence Record

> **Template state**: `INSTRUCTION-ONLY`. This record captures an executed check and its limits; an
> unrun or blocked check cannot be represented as a pass.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `VEV` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | Requirement/claim, VVP procedure, gate, release and risk links |
| Evidence / Claim Status | Exact evidence class and claim boundary |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `VEV` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `VEV` |
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

## 1. Executed result

| Field | Recorded value |
|---|---|
| Verification ID | `UNKNOWN` |
| Requirement / claim ID | `UNKNOWN` |
| Procedure / VVP link | `UNKNOWN` |
| Exact configuration and environment | `UNKNOWN` |
| Execution date/time | `UNKNOWN` |
| Actor / owner | `UNKNOWN` |
| Outcome | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, `BLOCKED`, or `NOT-RUN` |
| Evidence link / hash | `UNKNOWN` |

## 2. Validation Pack metadata

| Pack ID | Stratum | Sample item ID | Selection rationale | Expected result | Executed result | Baseline / environment |
|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT-RUN` | `UNKNOWN` |

## 3. Review, deviation and residual risk

| Reviewer | Competence or Specialist Review Gap | Author/owner conflict | Representativeness | Deviation / residual risk | Disposition / next action |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Gate and release use

| Gate / release baseline | Input pin | Permitted use | Status |
|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 5. Outcome and missing-evidence rules

| Outcome | Meaning | Required follow-up |
|---|---|---|
| `PASS` | The stated procedure ran against the exact baseline and met its acceptance condition | Retain evidence and link the applicable gate/release |
| `PASS-WITH-ACTIONS` | The result is usable only with explicit bounded actions that do not invalidate the baseline | Name owner, affected baseline, due condition/date, expiry and escalation |
| `FAIL` | The observed result did not meet the stated acceptance condition | Link defect/change/risk and prevent an unqualified gate pass |
| `BLOCKED` | A prerequisite, authority, access, competence or environment prevented execution | Name the missing prerequisite and owner; do not substitute another check |
| `NOT-RUN` | The check has not been executed at the recorded baseline | Keep the claim unavailable until execution is retained |

An executed result must identify the exact configuration, environment, procedure, timestamp, actor,
sample stratum, selection rationale, evidence hash/link, reviewer independence and representativeness.
File counts, backup completion, static scans or a successful neighboring check cannot substitute for
the required result. An unauthorized tool, dataset or source is recorded as a limitation and cannot
be relabeled `PASS`.

## 6. Validation Pack and gate safeguards

For a Validation Pack item, retain `pack_id`, stratum, stable sample ID, selection rationale,
expected/executed result, exact baseline, environment, date, owner, evidence link, reviewer,
competence/independence, representativeness and next action. If a two-participant population is not
available, record `BLOCKED` or `NOT-RUN`; one person using two identities remains
`Single-Actor Functional Acceptance`, not independent review.

## 7. Pilot evidence boundary

| Claim status | Evidence required | Authority / limitation | Result |
|---|---|---|---|
| `Canonical Demo Dataset` | Approved synthetic dataset, exact configuration and reproducible result | Technical verification only | `NOT-RUN` |
| `Technical Pilot Verification` | Bounded non-production execution and retained `VEV` result | No Internal Adoption Authority required to run; no rollout claim | `NOT-RUN` |
| `Single-Actor Functional Acceptance` | One person operating multiple separately provisioned identities | Not independent review or representative acceptance | `NOT-RUN` |
| `Internal Operational Need Validation` | Representative internal role/workflow evidence | Need validation only; release remains separate | `NOT-RUN` |
| `Internal Pilot Acceptance` | Technical evidence plus representative internal evidence and named authority | Exact approved scope only | `NOT-RUN` |
| Operational rollout authorization | Named authority, exact release, residual-risk and recovery evidence | Cannot exceed release baseline | `NOT-RUN` |

Company-derived or production-sensitive data is referenced by approved storage metadata, classification,
owner and retention record; it is not copied into the repository by this template.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Validation contract](../../../../specs/003-controlled-documentation/contracts/validation.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
