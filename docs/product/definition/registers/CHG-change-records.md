CHG

# Change Record

> **Template state**: `INSTRUCTION-ONLY`. Use this record for every material baseline change. A
> roadmap or implementation detail cannot silently override an approved decision.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `CHG` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | Trigger, affected DOCs, requirements, design, tests, gates and release |
| Evidence / Claim Status | `UNKNOWN` until impact evidence is recorded |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `CHG` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `CHG` |
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

## 1. Proposed change

| Field | Recorded value |
|---|---|
| Change identity and reason | `UNKNOWN` |
| Requested by / date | `UNKNOWN` |
| Affected baseline | `UNKNOWN` |
| Proposed effective baseline | `UNKNOWN` |
| Urgency / trigger | `UNKNOWN` |

## 2. Impact analysis

| Area | Affected item / ID | Impact and compatibility | Required action / evidence | Status |
|---|---|---|---|---|
| Requirements | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Architecture / interfaces | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Data / migration | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| UI/UX / accessibility / locale | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Risks / tests / roadmap | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Operations / release / recovery | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 3. Review, approval and implementation evidence

| Reviewer / approver | Independence and competence | Decision / date | Gate or baseline | Evidence link |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 4. Rollback, supersession and closure

| Item | Rule / evidence | Owner | Status |
|---|---|---|---|
| Rollback or recovery | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Superseded versions | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Closure verification | `UNKNOWN` | `UNKNOWN` | `NOT-RUN` |

## 5. Typed trace and impact coverage

Every material change uses typed links rather than a free-text list. The change owner records the
source trigger, affected item/version, proposed successor and downstream verification/release use.

| Link type | Required target | Minimum impact question |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | Stakeholder need, product decision, evidence or ADR | Why is the change necessary and what authority admits it? |
| `AFFECTS` | DOC, requirement, architecture/design, data, interface, UI/UX, locale or standard | Which exact baseline and owner change? |
| `MITIGATES` / `INTRODUCES` | `RSK` record | Does risk exposure or residual disposition change? |
| `VERIFIED-BY` | `VVP` procedure / `VEV` result | What exact configuration and evidence must be rerun? |
| `RELEASED-IN` | `REL` baseline / `DOC-07` increment | Which release or increment consumes the change? |
| `SUPERSEDES` / `REPAIRS` | Prior change, item or broken link | Is history preserved and is the repaired link justified? |

The impact review explicitly covers requirements, architecture, data, interfaces, UI/UX and locale,
risks, tests, roadmap, operations, releases and recovery. An area may be `NOT APPLICABLE` only with
an owner-approved rationale. A broken, orphaned, stale or unjustified circular link blocks the
affected gate or receives an authorized disposition before closure.

## 6. Review, approval and effective-baseline rule

Review records name author/owner conflicts, reviewer competence and independence, decision date,
affected baseline, approval authority, rollback/recovery evidence and the exact effective baseline.
Approval does not silently edit a rendition or lower-authority document; successor versions and
stale renditions remain linked through `CMP` and `REL`.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Evidence and trace](../../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
