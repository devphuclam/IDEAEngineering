# PH0 Test Data and Verification Plan

**Increment**: `IE-INC-READY-001`
**Record ID**: `IE-PH0-P05-DATA-001`
**Version / status**: `0.4` / Draft; P05 preparation `PASS` after Project Reviewer disposition
**Owner**: Principal Product Author
**Reviewer / data custodian**: Project Reviewer; the same person performs both roles for this preparation, so it is not independent-human review evidence
**Data boundary**: Synthetic data only. This document defines fixtures and expected evidence; it
does not claim that a product build or transfer has run.

## 1. Fixture identities

| Fixture | Purpose | Required content | Status |
|---|---|---|---|
| `IE-DATA-CANONICAL-001` | Canonical Technical Pilot Dataset | Reuses the P-100 scenario definition in [`canonical-scenario.md`](canonical-scenario.md); the descriptor is test-planning data, not seeded application records. | Scenario defined; application records `NOT-RUN` |
| `IE-DATA-CANONICAL-001-SMALL` | Small transfer candidate | Deterministic 1 KiB synthetic byte file for transfer and SHA-256 checks. | Server size/hash/ownership verified in [P05 server evidence](evidence/P05-SERVER-FIXTURES-20260924.md); expected digest in [`fixtures/expected-artifact-digests.json`](fixtures/expected-artifact-digests.json) |
| `IE-DATA-CANONICAL-001-64M` | Bounded transfer candidate | Deterministic 64 MiB synthetic byte file. It is not valid CAD/Office content and does not establish throughput or scale. | Server size/hash/ownership verified in [P05 server evidence](evidence/P05-SERVER-FIXTURES-20260924.md); expected digest in [`fixtures/expected-artifact-digests.json`](fixtures/expected-artifact-digests.json) |
| `IE-DATA-CANONICAL-001-A/N/S/R` | Changed, no-change, stale and modified-Reference cases | Scenario variants are described by the existing canonical walkthrough; application state and outcomes are created only during PH1 execution. | Defined as planned cases; application execution `NOT-RUN` |
| `IE-DATA-CANONICAL-001-L` | Multi-GB transfer candidate | Multi-GB corpus, chunk/range and resource measurements for later Q03. | Deferred to Q03; not part of P05 |

The fixture must not contain company production documents, personal credentials, licensed CAD/Office
payloads or any source whose commercial-use rights are unresolved. The first-party generator at
[`tools/p05-fixtures/generate-fixtures.mjs`](../../tools/p05-fixtures/generate-fixtures.mjs)
creates synthetic bytes only. It uses Node.js built-in modules and adds no external dependency.
The generator refuses to overwrite a non-empty target directory and restricts Linux `/srv` output
to `/srv/idea/artifacts/p05-fixtures`.

## 2. Identity and Workspace profiles

| Profile | Contents | Limitation |
|---|---|---|
| `IDENTITY-A` | Test Persona for the eligible editor path: Checkout, Reference, changed Check-in and no-change Check-in. | Persona profile is prepared in [`fixtures/test-persona-profiles.json`](fixtures/test-persona-profiles.json). A native IDEA account, Role Assignment and credentials are not created in P05; provision them in PH1 from the approved RBAC baseline. |
| `IDENTITY-B` | Second Test Persona for wrong-owner, wrong-Workspace, stale and denied paths; review-flow use only if the PH1 baseline permits it. | A native IDEA account is not created in P05. Two identities operated by one person do not prove independent-human review. |
| `WORKSPACE-A` | Planned PH1 Workspace for `IDENTITY-A`, tied to exact Generation, digest, mode and Reservation records. | No IDEA Workspace exists yet; application execution is `NOT-RUN`. |
| `WORKSPACE-B` | Planned PH1 Workspace for `IDENTITY-B`, used for cross-identity and cross-Workspace cases. | No IDEA Workspace exists yet; application execution is `NOT-RUN`. |

## 3. Vault and transfer fixture

The fixture describes logical locations, not a claim about physical failure domains.

| Logical location | Required evidence | Status |
|---|---|---|
| `VAULT-LOC-A` | One development Vault `VAULT-01` / `LOCAL-DEV-01`; P04 review evidence records its server path and permissions. | Physical Vault exists; Artifact Gateway behavior and transfer runtime `NOT-RUN` |
| `VAULT-LOC-B` | Candidate second location with the same Artifact identity, size and digest for a later exact-read failover qualification. | Provider, topology and independent failure domain `UNKNOWN`/`BLOCKED`; successor disposition D0/D1 required |
| Private staging | Candidate bytes before authoritative Check-in. | Must not resolve as a public Generation or end Reservation. |

P05 files are placed at `/srv/idea/artifacts/p05-fixtures`, a separate directory on the same
artifact-storage mount and outside `/srv/idea/artifacts/vault-01`. This placement does not create a
second Vault location or claim an independent failure domain. The server-side `manifest.json` must
record actual generation time, Node version, size and SHA-256; compare file hashes with the expected
fingerprint record before treating provisioning as complete.

The multi-GB size, chunk size, memory bound, replica policy and durability target remain later Q03
or successor decisions. P05 does not choose those values. The agreed P05 files are reviewed and
deleted by `2027-01-31`; record any extension before that date. The Project Reviewer is both custodian
and reviewer for this first preparation, so no independent-review claim is made.

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

Rows `P05-DATA-01`–`P05-DATA-09` are planned PH1 application checks. P05 prepares their synthetic
inputs and expected outcomes; it does not execute them. Their `NOT-RUN` result remains until an IDEA
build and the required accounts/endpoints exist.

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

The P05 profile, generator, expected digests, data custodian and retention-review date are recorded.
The server files, manifest, sizes, hashes and ownership have been verified in
[P05 server evidence](evidence/P05-SERVER-FIXTURES-20260924.md). The Project Reviewer accepted the
P05 preparation result as `PASS` on 2026-09-24. Native account creation, Gateway transfer,
application behavior, multi-GB throughput and a second Vault location are later work.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial synthetic fixture, identity, Vault-location and verification matrix; no runtime result claimed. | T018–T019 |
| 0.2 | 2026-09-24 | Record the Project Reviewer-selected P05 profile: 1 KiB and 64 MiB deterministic synthetic files, two Test Persona profiles, separate server fixture directory, Node.js 24 built-in generator, digest baseline and review/delete date. Native IDEA accounts remain PH1 work; multi-GB measurement remains Q03. The Product Decision Authority disposition of D4's PH1 gate effect is still `NOT-RUN`. | Project Reviewer interview; generator and expected digest record; server provisioning `NOT-RUN` |
| 0.3 | 2026-09-24 | Record observed server fixture provisioning, manifest, independent file hashes and ownership; leave final P05 reviewer disposition open. | [P05 server evidence](evidence/P05-SERVER-FIXTURES-20260924.md) |
| 0.4 | 2026-09-24 | Record Project Reviewer acceptance of P05 preparation after observed server evidence review; keep D4 PH1 gate and application tests open. | Project Reviewer `Hoàn thành P05`; [P05 server evidence](evidence/P05-SERVER-FIXTURES-20260924.md) |
