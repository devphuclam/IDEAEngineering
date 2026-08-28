CMP

# Configuration Management Record

> **Template state**: `INSTRUCTION-ONLY`. This record accounts for controlled information items,
> baselines, versions, revisions and renditions; it does not choose a runtime configuration system.

## Common control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Record ID | `UNKNOWN` |
| Record Class | `CMP` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` |
| Record Status | `Draft` for this scaffold; instance uses controlled lifecycle status |
| Record Version | `0.1` scaffold; instance uses `major.minor` |
| Applicable Baseline / Effective Date | `UNKNOWN` / `NOT APPLICABLE` until approved |
| Authors / Reviewers / Approvers | Attributable identities and authority basis |
| Source / Downstream Links | DOCs, CHG, REL, rendition and verification links |
| Evidence / Claim Status | `UNKNOWN` until status accounting evidence exists |
| Change History / Classification / Retention | `UNKNOWN` or controlled records |
| Content State | `INSTRUCTION-ONLY` |

The common envelope is explicit for this `CMP` instance:

| Common field | Recorded value / instruction |
|---|---|
| Stable Document/Record ID | `UNKNOWN` |
| Class/type | `CMP` |
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

## 1. Configuration-item register

| Item ID | Class/type | Path or repository identity | Owner | Status | Version | Applicable baseline | Effective date |
|---|---|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `Draft` | `0.1` | `UNKNOWN` | `UNKNOWN` |

## 2. Version, Generation and Revision accounting

| Concept | Controlled rule | Source / trace | Status |
|---|---|---|---|
| Document Version | `major.minor` content version; Git commit is evidence only | `UNKNOWN` | `UNKNOWN` |
| Product Generation | Immutable published Product Definition snapshot | `UNKNOWN` | `UNKNOWN` |
| Business Revision | Governed business milestone under the active Revision Policy | `UNKNOWN` | `UNKNOWN` |
| Git evidence | Repository commit or baseline evidence; not a product identity | `UNKNOWN` | `UNKNOWN` |

## 3. Baseline and rendition accounting

| Baseline / rendition ID | Exact item versions or source pin | Hash/provenance | Status | Staleness/supersession rule | Release / CHG link |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

DOCX/PDF renditions remain non-authoritative and become visibly stale or superseded when their exact
source baseline changes.

## 4. Status transitions and audit

| Transition | Preconditions | Approver / evidence | Recovery or reversal | Result |
|---|---|---|---|---|
| `UNKNOWN` → `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 5. Controlled transition and action examples

| Transition / action | Preconditions | Required record | Accountable authority | Failure consequence |
|---|---|---|---|---|
| `Draft` → `Proposed` | Required sections complete or every gap has owner/action/trigger | Review request, exact baseline and checklist result | Document owner and reviewer | Return to `Draft`; gate remains unavailable |
| `Proposed` → `Approved` | Authority, evidence, trace and applicable gate decision present | Gate decision with one outcome and approval identities | Product Decision Authority / designated approver | `BLOCKED` or `FAIL`; no authority transfer |
| `Approved` → `Superseded` | Successor approved and source identity retained | Successor link, effective baseline and rendition impact | Configuration/change authority | Old item remains visible and non-current |
| `Approved` → `Retired` | Retention, dependency, export/hold and operational checks complete | Retirement record and effective date | Accountable product/operations authority | Retirement remains `BLOCKED` |
| `PASS-WITH-ACTIONS` | Action does not invalidate requirements/design/test/recovery | Action owner, affected baseline, due condition/date, expiry and escalation | Gate authority | Expiry or missed condition reopens/blockades the affected gate |

`PASS-WITH-ACTIONS` is not a document status. `Start` and `In Work` are product workflow states for
a Business Revision; they are not substitutes for the document lifecycle vocabulary.

## 6. Exact baseline and rendition watch

| Watch item | Required fields | Rule |
|---|---|---|
| Baseline manifest | Stable item ID, class, instance, version, source pin/hash, effective date and scope | A manifest is immutable once used by a gate or release |
| Version watch | Current and prior document versions, `CHG`/Work Item, impact and successor | A material authority or contract change increments the document major version; compatible content changes increment the minor version; both preserve history |
| Generation/Revision watch | Product Generation, Business Revision and governing policy | These values are distinct from document version and Git commit |
| Rendition watch | Rendition ID, source ID/version/baseline, date, producer, status, classification and retention | Source change makes a rendition `Stale`; replacement makes it `Superseded`; withdrawal records reason |
| Git evidence | Commit/ref and repository state | Git proves the source snapshot only; it does not approve or redefine a document |

<!-- AUTHOR CONTENT END -->

## Contract references

- [Control fields and status](../../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Rendition contract](../../../../specs/003-controlled-documentation/contracts/rendition.md)
- [Core document catalogue](../../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
