GOV

# Governance and Standards Record

> **Template state**: `INSTRUCTION-ONLY`. This supporting record governs roles, standards,
> applicability, gates and reference-coverage decisions. It does not own Core Product Document
> requirements or implementation.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` until assigned |
| Record Class | `GOV` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until a governance authority is named |
| Record Status | `Draft` for this scaffold; use `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact governance/product/gate baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities, competence and authority basis |
| Source / Downstream Links | Constitution, standards register, DOCs, gate packages, CHG and VEV links |
| Evidence / Claim Status | Classify each standard or reference decision |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until authored and reviewed |

The common envelope is explicit for this `GOV` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `GOV` |
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

## 1. Roles and authority

| Role / authority | Scope | Eligible decisions | Separation / competence | Assignment status |
|---|---|---|---|---|
| Product Decision Authority | `UNKNOWN` | Scope, specification, technology and gate decisions within mandate | `UNKNOWN` | `UNKNOWN` |
| Life-cycle / Quality Authority | `UNKNOWN` | Governance, standards and quality dispositions | `UNKNOWN` | `UNKNOWN` |
| Independent reviewer | `UNKNOWN` | Review only within competence | Must not author or own the decision | `UNKNOWN` |

## 2. Standards applicability register

| Standard/policy ID | Exact edition/source | Classification | Surface/scope | Applicability | Tailoring rationale | Objective evidence | Owner / review trigger |
|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `STANDARD`, `STANDARD-GUIDED`, `STANDARD-GUIDED, CONDITIONAL`, `REFERENCE/WATCH`, or `PROJECT-CONVENTION` | `UNKNOWN` | `APPLY`, `TAILOR`, `NOT-APPLICABLE`, or `BLOCKED` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Citation alone never proves conformity. A new edition enters through controlled impact review and does
not silently replace the effective baseline.

## 3. Gate model

| Gate | Minimum inputs | Authority / independent review | One permitted outcome | Conditional action fields |
|---|---|---|---|---|
| `PG0`–`PG7` | `UNKNOWN` | `UNKNOWN` | `PASS`, `PASS-WITH-ACTIONS`, `FAIL`, or `BLOCKED` | Owner, affected baseline, due condition/date, expiry, escalation |

## 4. Material Coverage Inventory

The inventory is a closed denominator at an explicit as-of baseline/date. It is a register shape within
GOV, not a tenth supporting class.

| Inventory ID | Material behavior/product area | Inclusion criterion | Explicit exclusion rationale | As-of baseline/date | Owner | Review trigger | CHG history |
|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `NOT APPLICABLE` or `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Additions, removals and scope changes require a `CHG` record and successor effective inventory
baseline. The denominator is never inferred from whichever coverage rows happen to exist.

## 5. Behavioral Coverage Register

There is exactly one coverage record for every Material Coverage Inventory entry at its recorded
as-of baseline. Reference names and comparison evidence stay in this supporting record or linked
research; core DOCs contain only approved IDEA language.

| Inventory ID / Coverage ID | DDM target version/edition/configuration | Evidence and limitations | Proactive quality-benchmark comparison | Advantage/limitation and stakeholder/risk | Disposition | Owner / rationale | IDEA trace / increment | Verification / result |
|---|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` or `NO-STRONGER-PATTERN` | `UNKNOWN` | `ADOPT`, `ADAPT`, `ADAPT-ARAS`, `DEFER`, `EXCLUDE`, `UNKNOWN`, or `BLOCKED` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

An evidenced behavior cannot be marked `ADOPT` until its applicable proactive comparison is recorded.
Every omitted evidenced behavior is visible as `DEFER` or `EXCLUDE`; inaccessible evidence is
`UNKNOWN` or `BLOCKED`.

## 6. Governance decisions and open gaps

| Decision / gap ID | Statement | Authority / evidence | Impacted baseline | Owner and resolution trigger | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

<!-- AUTHOR CONTENT END -->

## Contract references

- [Catalogue contract](../../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
