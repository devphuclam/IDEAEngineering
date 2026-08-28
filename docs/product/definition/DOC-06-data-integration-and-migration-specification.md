DOC-06

# Data, Integration, and Migration Specification

> **Template state**: `INSTRUCTION-ONLY`. This structure records data and boundary obligations; it is
> not a runtime schema, API contract or migration authorization.
>
> **Authority**: DOC-06 owns data concepts, ownership, identity, lifecycle, relationships, integrity,
> classification, retention, exchange semantics, migration mapping, reconciliation and failure
> obligations. DOC-04 owns requirement authority and DOC-05 owns architecture views.

## Control envelope

| Field | Recorded value / instruction |
|---|---|
| Stable Document ID | `UNKNOWN` until assigned |
| Document Class | `DOC-06` |
| Title | `UNKNOWN` |
| Owner | `UNKNOWN` until a data/integration owner is named |
| Document Status | `Draft` for this scaffold; instance uses `Draft`, `Proposed`, `Approved`, `Superseded`, or `Retired` |
| Document Version | `0.1` scaffold version; instance uses `major.minor` |
| Applicable Baseline | `UNKNOWN` or exact requirements/architecture/increment baseline |
| Effective Date | `NOT APPLICABLE` until approval |
| Authors / Reviewers / Approvers | Attributable identities plus data/security competence and authority basis |
| Source Links | DOC-03 needs, DOC-04 requirements, DOC-05 views, evidence and decisions |
| Downstream Links | DOC-07, VVP, VEV, RSK, CHG, REL and applicable interfaces |
| Evidence / Claim Status | Classify data observations, mappings and verification claims |
| Change History | `UNKNOWN` or `CHG`/Work Item links |
| Access Classification / Retention Rule | Approved classification and retention rule |
| Content State | `INSTRUCTION-ONLY` until the specification is authored and reviewed |

## Authored-content boundary

<!-- AUTHOR CONTENT START -->

## 1. Data scope and ownership

<!-- Define the exact information boundary, authoritative owner, custody, lawful use and lifecycle. -->

| Data concept / class | Business meaning | Authoritative owner | Custody / access | Classification / retention | Source link |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 2. Identity, version and lifecycle

| Identity or lifecycle item | Stable identity rule | Version/Generation/Revision relationship | State transitions | Audit and recovery evidence |
|---|---|---|---|---|
| Logical Document | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Artifact / Generation | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Business Revision | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Structure / Release baseline | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Keep Document Version, Product Generation, Business Revision and Git evidence distinct. A later
revision or generation must not mutate the identity or reinterpret an earlier released baseline.

## 3. Relationships and integrity

| Relationship ID | Parent/child or reference rule | Cardinality / invariants | Conflict or orphan behavior | Verification |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Record exact Structure Snapshot, reference and release-pin behavior where applicable. An unresolved
dependency is visible as `UNKNOWN`, `BLOCKED` or an approved exception; it is not silently omitted.

## 4. Exchange and integration semantics

| Boundary / interface | Source owner | Destination owner | Exchange meaning and version | Failure, retry and idempotency rule | Security / audit |
|---|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Do not choose an API protocol, database, message broker or deployment topology here. Record an
approved architecture decision when one becomes applicable.

## 5. Migration and reconciliation

### 5.1 Mapping

| Source identity/field | Target identity/field | Transform / loss rule | Evidence and owner | Disposition |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

### 5.2 Reconciliation and rollback

| Migration step | Precondition | Reconciliation check / threshold | Failure handling | Rollback or recovery evidence |
|---|---|---|---|---|
| `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

Bulk migration is a separate controlled decision. A prototype or import exercise is not migration
approval, production readiness or evidence of complete data fidelity.

## 6. Format capability boundary

<!-- Link the Generic Controlled-File Baseline and the one selected deep CAD profile from DOC-02. Add later profiles through controlled change. -->

| Profile | Format/scope | Identity/digest control | Semantic/structure capability | Limitations / status |
|---|---|---|---|---|
| Generic Controlled-File Baseline | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Selected deep CAD profile | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 7. Security, privacy, retention and operational obligations

| Obligation | Data/surface | Control or evidence | Owner | Status |
|---|---|---|---|---|
| Least privilege / isolation | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Classification / retention / hold | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| Audit / recovery / incident | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

## 8. Verification and gate readiness

| Gate / verification item | Required evidence | Result |
|---|---|---|
| PG2 requirement consistency | Every data obligation traces to DOC-04 and DOC-03 | `NOT-RUN` |
| PG3 design consistency | Ownership, relationships, boundaries and failure behavior align with DOC-05 | `UNKNOWN` |
| Migration readiness | Mapping, reconciliation, rollback and approved data boundary | `UNKNOWN` |
| Material change | `CHG`/Work Item with data/interface/security/operations/release impact | `UNKNOWN` |

## Typed trace, supporting records and rendition controls

| Link type | Required target and purpose | Result |
|---|---|---|
| `SOURCE-NEED` / `SOURCE-DECISION` | DOC-03 need/rule, DOC-04 obligation, DOC-05 view or data evidence | `UNKNOWN` |
| `DOWNSTREAM` | Interfaces, migration increment, DOC-07 scope, verification and operations | `UNKNOWN` |
| `CHANGE` | `CHG`/Work Item covering data, interface, security/privacy, migration, recovery and release impact | `UNKNOWN` |
| `VERIFICATION` | Mapping/reconciliation procedure and exact VEV result | `UNKNOWN` |
| `RELEASE` | REL baseline and data-boundary authorization | `UNKNOWN` |
| `RENDITION` | Source document ID/version/baseline and rendition status if distributed | `UNKNOWN` |

Trace links identify the source and target item versions; a trace view never becomes a schema or
integration authority. A rendition cannot be edited into a different data baseline, and a stale
rendition is redirected to the current Markdown source.

<!-- AUTHOR CONTENT END -->

## Contract references

- [Core document catalogue](../../../specs/003-controlled-documentation/contracts/document-catalogue.md)
- [Control fields and status](../../../specs/003-controlled-documentation/contracts/control-fields-and-status.md)
- [Evidence and trace](../../../specs/003-controlled-documentation/contracts/evidence-and-trace.md)
- [Rendition contract](../../../specs/003-controlled-documentation/contracts/rendition.md)
