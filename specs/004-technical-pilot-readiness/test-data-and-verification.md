# PH0 Test Data and Verification Plan

**Increment**: `IE-INC-READY-001`  
**Record ID**: `IE-PH0-P05-DATA-001`  
**Version / status**: `0.1` / Draft; P05 execution `NOT-RUN`  
**Owner**: Principal Product Author  
**Reviewer**: Verification, data and project reviewers; not assigned in an attributable record  
**Data boundary**: Synthetic data only. This document defines fixtures and expected evidence; it
does not claim that a product build or transfer has run.

## 1. Fixture identities

| Fixture | Purpose | Required content | Status |
|---|---|---|---|
| `IE-DATA-CANONICAL-001` | Canonical Technical Pilot Dataset | One `P-100` Project, one Logical Document, current Working Head, one related document, two Workspaces, Review/Release scope and Audit seed. | Planned; content/hash `NOT-RUN` |
| `IE-DATA-CANONICAL-001-A` | Changed Artifact candidate | Synthetic CAD/Office-shaped bytes, expected size/digest, local edit marker and exact Workspace Manifest. | Planned; generator/provenance `NOT-RUN` |
| `IE-DATA-CANONICAL-001-N` | No-change candidate | Same semantic bytes and normalized metadata as current Working Head. | Planned; comparator qualification `NOT-RUN` |
| `IE-DATA-CANONICAL-001-S` | Stale candidate | Candidate based on an older exact Generation after another actor advances the Working Head. | Planned; conflict setup `NOT-RUN` |
| `IE-DATA-CANONICAL-001-R` | Modified Reference candidate | Reference-mode local file changed without a Reservation. | Planned; safe-copy evidence `NOT-RUN` |
| `IE-DATA-CANONICAL-001-L` | Large transfer candidate | Representative multi-GB synthetic Artifact with chunk/range manifest and digest. | Size, generator and retention `UNKNOWN` |

The fixture must not contain company production documents, personal credentials, raw Vault paths,
licensed CAD/Office payloads or any source whose commercial-use rights are unresolved.

## 2. Identity and Workspace profiles

| Profile | Contents | Limitation |
|---|---|---|
| `IDENTITY-A` | Native Account + Actor eligible for `P-100` membership, Group membership and the required Role Assignment. | Allocation and exact credentials are P03/P04 decisions. |
| `IDENTITY-B` | Separate native Account + Actor used for conflict, independent-approver and concurrency paths. | Two identities may be operated by one person; this is not independent-human evidence. |
| `WORKSPACE-A` | `IDENTITY-A` local Workspace with exact Generation, digest, mode and Reservation records. | Local path and retention policy require environment confirmation. |
| `WORKSPACE-B` | Independent Workspace used to prove a Reservation cannot be reused implicitly. | Same-Actor/different-Workspace and different-Actor paths are both required. |

## 3. Vault and transfer fixture

The fixture describes logical locations, not a claim about physical failure domains.

| Logical location | Required evidence | Status |
|---|---|---|
| `VAULT-LOC-A` | Addressed Artifact Gateway, selected location identity, accepted ranges, size and digest. | Allocation/runtime `NOT-RUN` |
| `VAULT-LOC-B` | Candidate second location with the same Artifact identity, size and digest for a later exact-read failover qualification. | Provider, topology and independent failure domain `UNKNOWN`/`BLOCKED`; successor disposition D0/D1 required |
| Private staging | Candidate bytes before authoritative Check-in. | Must not resolve as a public Generation or end Reservation. |

The final multi-GB size, chunk size, memory bound, retention period, replica policy and durability
target are open P03 decisions. Do not choose values in this document.

## 4. Verification matrix

| ID | Setup / action | Expected evidence | Result |
|---|---|---|---|
| `P05-DATA-01` | Resolve exact identity, Generation, Workspace and per-document Checkout/Reference scope. | Workspace Manifest, Reservation records, exact digests and scope confirmation. | `NOT-RUN` |
| `P05-DATA-02` | Changed Check-in with one or more changed documents. | One logical Change Set, one Generation per changed document, Working Head update and Reservation dispositions. | `NOT-RUN` |
| `P05-DATA-03` | No-change Check-in. | `No Change` outcome, no Generation/Version increment, recorded outcome and ended scope. | `NOT-RUN` |
| `P05-DATA-04` | Stale, non-owner, wrong-Workspace, expired and unauthorized Check-in attempts. | Refusal reason, no authoritative change, preserved local bytes and Audit evidence. | `NOT-RUN` |
| `P05-DATA-05` | Modified Reference, current and stale conversion attempts. | Direct Check-in refused; safe copy/Checkout/Create Copy choices; no CAD/Office auto-merge. | `NOT-RUN` |
| `P05-DATA-06` | Interrupt transfer at each range boundary and retry same OperationId. | Accepted ranges resume, final digest matches, no duplicate Generation/Change Set. | `NOT-RUN` |
| `P05-DATA-07` | Lose response before and after authoritative commit. | Same OperationId resolves progress, committed result or reconciliation; no inferred success. | `NOT-RUN` |
| `P05-DATA-08` | Review/reject/approve/release exact scope with required dependency missing and then satisfied. | Missing prerequisite blocks; valid exact scope produces one Release Record/package. | `NOT-RUN` |
| `P05-DATA-09` | Advance later heads and retrieve earlier Release package. | Historical Generation, structure, digest and approval provenance remain exact. | `NOT-RUN` |
| `P05-DATA-10` | Optional successor qualification: read failover from `VAULT-LOC-A` to `VAULT-LOC-B`. | Only same ArtifactId/size/digest is accepted; no eligible copy yields bounded refusal. | `BLOCKED` pending D0/D1; not part of the approved predecessor pilot path |

## 5. Evidence and disposal rules

- Record fixture manifest, generator/version, source-license state, size, digest, retention owner and
  disposal date before execution.
- Keep expected and observed results separate. Screenshots or logs without the exact baseline do not
  establish `PASS`.
- Retain only synthetic bytes, manifests and bounded evidence in the repository. Company-controlled
  storage is required for any larger pilot corpus.
- Failed or abandoned private candidates follow reconciliation/expiry; they cannot be reclassified as
  a Generation by moving a file or changing metadata.

## 6. Readiness status

`P05-DATA-001` is `NOT-RUN`. P03 must assign the data custodian, Vault locations, fixture generator,
retention/disposal rule and license/provenance owner before P05 can be executed.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial synthetic fixture, identity, Vault-location and verification matrix; no runtime result claimed. | T018–T019 |
