REL

# Release Baseline Record

> **Template state**: `INSTRUCTION-ONLY`. This record pins an immutable releasable set; it does not
> authorize operational rollout by itself.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `REL` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | DOC-07, CMP, VEV, gates, OPS and rendition links |
| Evidence / Claim Status | `UNKNOWN` until release evidence is complete |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `REL` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `REL` |
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

## 1. Release manifest and exact pins

| Release Record ID | Item ID/class | Exact document version / Product Generation / Business Revision | Hash/provenance | Scope | Status |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Verification, known issues and residual risk

| Evidence / issue | Exact baseline and environment | Outcome | Residual risk / disposition | Owner |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Rollback, recovery and authorization

| Control | Required evidence | Authority / approver | Result |
|---|---|---|---|
| Rollback / recovery | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Pilot claim boundary | Keep Canonical Demo Dataset, Technical Pilot Verification, Internal Pilot Acceptance and rollout statuses distinct | `UNKNOWN` | `UNKNOWN` |
| Release authorization | Exact scope, evidence, residual risk and named authority | `UNKNOWN` | `NOT-RUN` |

## 4. Renditions and distribution

| Rendition / package | Source ID/version/baseline | Producer/date | Current/Stale/Superseded/Withdrawn | Classification / retention |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 5. Release authorization minimum

Before an authorization decision, the release record pins the exact scope and includes:

| Required input | Minimum record |
|---|---|
| Manifest | Every included item ID/class, document version, Product Generation/Business Revision where applicable, immutable hash or controlled-storage pin |
| Provenance | Source baseline, producer/tool identity where material, lawful-access and classification handling |
| Verification | Linked `VEV` results, applicable `VVP` procedures, defects/waivers and coverage disposition |
| Risk and recovery | Known issues, residual risk owner/disposition, rollback/recovery evidence and operational readiness |
| Authority | Named release authority, reviewer/approver identities, competence/independence basis, decision date and one permitted outcome |
| Claim boundary | Explicit pilot/claim status; lower evidence status cannot be promoted by release packaging |

The release outcome is one of `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`. A missing exact pin,
required approval, verification result, residual-risk disposition or recovery evidence keeps release
authorization `BLOCKED`. A successful technical or synthetic run does not create representative
internal acceptance or operational rollout authorization.

## 6. Rendition identity and claim restrictions

Every distributed DOCX/PDF records a stable rendition ID, source document ID and version, exact source
baseline, date, producer/tool identity where material, status (`Current`, `Stale`, `Superseded` or
`Withdrawn`), classification, retention and trace links. A source change makes the old rendition
`Stale` until regenerated; comments against it are redirected to the authoritative source.

The release package preserves the distinct statuses `Canonical Demo Dataset`, `Technical Pilot
Verification`, `Single-Actor Functional Acceptance`, `Internal Operational Need Validation`,
`Internal Pilot Acceptance` and operational rollout authorization. No lower status is rewritten as a
higher claim by a release manifest.

## 7. Pilot claim matrix for release use

| Claim status | Minimum release-linked evidence | Authority condition | Allowed release statement |
|---|---|---|---|
| `Canonical Demo Dataset` | Synthetic dataset and exact technical evidence | Technical verifier | Demonstration/technical verification only |
| `Technical Pilot Verification` | Bounded non-production `VEV` result and environment pin | Pilot runner; adoption authority not required to run | Technical pilot scope only |
| `Single-Actor Functional Acceptance` | One-human/two-identity record and limitations | Not independent approval | Functional exercise only |
| `Internal Operational Need Validation` | Representative internal roles/workflows and need evidence | Product Decision Authority | Need validation for stated scope |
| `Internal Pilot Acceptance` | Representative evidence plus named Internal Adoption Authority | Authority and exact scope required | Pilot acceptance for exact release scope |
| Operational rollout authorization | Approved release, residual risk, recovery and named authority | Operational/product authority | Rollout only within the authorized baseline |

The release record must preserve the lowest truthful status supported by evidence. Packaging or
publishing a technically verified artifact cannot promote it to pilot acceptance or rollout.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Gate package](../../../../specs/003-controlled-documentation/contracts/gate-package.md)
- [Rendition contract](../../../../specs/003-controlled-documentation/contracts/rendition.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
