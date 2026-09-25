# PH0 Canonical Technical Pilot Scenario

**Increment**: `IE-INC-READY-001`
**Record ID**: `IE-PH0-P02-SCENARIO-001`
**Version / status**: `0.2` / Draft; P02 execution `NOT-RUN`
**Owner**: Principal Product Author
**Reviewer**: Project user acting as Project Reviewer; T011 disposition `NOT-RUN`
**Applicable baseline**: Approved predecessor pinned by [baseline-manifest.md](baseline-manifest.md):
`f269a0445737a7efd7f406ee51517149a8967afa`, `DOC-04@0.13`, `DOC-05@0.20`, `DOC-06@0.16`,
`VVP@0.16`. The later Vault successor remains a separate Draft input and is not silently treated as
approved. Two later, **scoped** Product Decision Authority decisions also apply to this walkthrough:
the [Approval Policy self-approval correction](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-19-pda-approval-approval-policy.md)
and the [three-branch Check-in scope policy](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-25-pda-approval-checkin-scope.md).
They do not approve the whole successor DOC-04@0.15, DOC-05@0.25 or VVP@0.19. The latter two are
Draft supporting sources for the exact Check-in branches and planned WS-09…11 checks.

## 1. Purpose and evidence boundary

This document defines one walkthrough that a reviewer can use to check whether the first technical
pilot is bounded and traceable. It is a scenario record, not product test evidence and not a new
product requirement. No step has been executed in this PH0 record; every result below is therefore
`NOT-RUN` unless explicitly marked `BLOCKED`.

The scenario separates three facts that must not be conflated:

1. a byte transfer may complete in private staging;
2. a Check-in may or may not commit an authoritative Change Set; and
3. a Review or Release may or may not accept an exact Generation.

The pilot must never treat a successful upload, a lost response or an RBAC grant as proof of a
successful Check-in or Release.

## 2. Actors and test identities

| Actor / identity | Responsibility in this scenario | Boundary |
|---|---|---|
| Design Engineer | Uses a native IDEA account, selects Workspace scope, edits a materialized file and submits a Check-in. | Cannot approve or Release the same Revision under the seeded independent-approver policy used in this scenario. |
| Independent Approver | Reviews the exact submitted Generation and records an attributable decision; for the Release step, also holds a separately applicable Project-scoped Release Role Assignment. | Approval eligibility alone does not grant Release. Two accounts operated by one person are not independent-human evidence. |
| Project Administrator | Provides Project/Group membership and permitted project-scoped assignments in the fixture. | Cannot issue an account merely because it administers a Project. |
| Account Administrator | Creates/activates the native account and manages account/session operations. | Account administration alone grants no Project or product Permission. |
| Support / Operations reviewer | Inspects interruption, reconciliation, Vault and recovery evidence. | Does not change authoritative product state during an evidence review. |

The minimum fixture contains two separately provisioned native identities and two Workspaces. This
is sufficient for eligibility and concurrency checks; it does not claim two independent humans.

## 3. Preconditions and fixed fixture

1. The reviewer resolves the exact approved predecessor commit and manifest from
   [baseline-manifest.md](baseline-manifest.md). P01 is `COMPLETE / PASS` for the exact reviewed
   input recorded there; the later planning and technology deltas remain separate inputs for the
   future T023 freeze and do not imply PG4 approval.
2. The fixture contains one Logical Document in Project `P-100`, one current Working Head and an
   exact Artifact digest. A related document is present so the user must choose its scope rather
   than receiving an implicit tree-wide Checkout.
3. The fixture has a native account, Project membership, Group membership and a Role Assignment
   that resolves through the Principal–Role Definition Version–Authorization Scope model. The
   actual role/Scope seed and test identity allocation remain P03/P04 decisions.
4. A Managed Workspace records the exact materialized Generation, digest, local path and mode for
   each selected document. Local work is retained outside the authoritative store while the pilot
   is being prepared.
5. A synthetic changed Artifact, an unchanged Artifact and a deliberately stale candidate are
   available. P05 preparation has verified deterministic 1 KiB and 64 MiB files on the development
   server. Multi-GB transfer/resource qualification belongs to Q03 or a later work package; a
   second Vault and distinct failure-domain evidence remain outside the P05 result.
6. The product procedures in [VVP@0.16](../../docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md)
   are the planned verification sources. They are not execution evidence.

## 4. Ordered normal path

| Step | What the pilot does | Expected controlled outcome | Trace |
|---:|---|---|---|
| 1 | Sign in with the native IDEA account and establish the server `ActorContext`. | The server derives current account/session eligibility; the client cannot choose a durable `ActorId` or policy snapshot. | `REQ-IAM-001…007`, `REQ-AUTH-006…009`; `VVP-015`, `RBAC-01…10` |
| 2 | Resolve the Logical Document, governing Project, current Working Head and exact Generation. | The user sees stable identity and exact content coordinate; no floating “latest” is used for the Workspace file. | `REQ-ID-001…009`, `REQ-WS-001…004`; `VVP-001`, `IF-01…06` |
| 3 | Select the root and each related document as `Checkout`, `Reference` or excluded. | The confirmed scope is explicit per document; no hidden parent/child cascade occurs. | `REQ-WS-001`, `REQ-WS-002/003`; `VVP-002`, `WS-01` |
| 4 | Materialize the selected exact Generations into the Workspace. | Each digest is verified and the Workspace Manifest records mode, path and expected Generation before the file is reported ready. | `REQ-WS-003/004`; `VVP-002`, `IF-ARTIFACT-TRANSFER` |
| 5 | Edit only the Checkout file through the approved operating-system application association. | The Workspace detects the file state without loading IDEA code into the design application. | `REQ-WS-004/005`, `REQ-SEC-003`; `VVP-002`, `WS-01` |
| 6 | Scan the complete proposed scope and confirm the Check-in set. | The user sees `Unchanged`, `Modified under Checkout`, `Modified without Checkout`, `Missing`, `Out of date` and `Unresolved`. Unknown required-dependency scope blocks Check-in. A changed selected root or required dependency without `Active` Reservation blocks the whole proposal. A proven unrelated unreserved change is excluded as `Modified without Checkout`; the reduced exact scope needs explicit reconfirmation. | `REQ-WS-005/006`; approved `IE-CHG-PDA-APPROVAL-003`; `ARCH-VIEW-ACT-004`; `VVP-002`, `WS-02/09/10/11` |
| 7 | Prepare an `OperationId`; stream exact bytes in resumable chunks to private staging through the approved Artifact custody boundary. | Verified private staging proves custody of candidate bytes only. It does not publish a Generation, end a Reservation or decide Check-in success. A direct multi-location Gateway path is a separate successor qualification, not an assumed predecessor capability. | `REQ-WS-012/015`, `REQ-OPS-001`; `VVP-003`, `WS-08`, `ARCH-VIEW-SEQ-006` |
| 8 | Commit a changed Check-in for the confirmed scope. | One logical all-or-none Change Set creates exactly one Generation per changed Logical Document, updates the Working Head and ends every confirmed in-scope Reservation. | `REQ-WS-007/009`, `REQ-WS-013`; `VVP-003`, `WS-02`, `ADR C1-004/C1-005` |
| 9 | Submit the exact Generation and scope for Review. | One Review Round pins the exact Generation, Workflow Definition Version and Approval Policy Version. | `REQ-LC-001/002`; `VVP-006`, `WF-01…03`, `ARCH-VIEW-SEQ-003` |
| 10 | Independent Approver records approval or rejection with a reason. | The seeded independent-approver policy used here refuses self-approval. An authorized, versioned policy may separately allow it; this pilot path does not activate that variant. The decision records actor, time, exact Generation/scope, policy version and reason. | `REQ-LC-003/004/005`; approved `IE-CHG-PDA-APPROVAL-002`; `VVP-006`, `WF-04…06` |
| 11 | The same Approver identity, with a separate applicable Release Role Assignment, confirms one exact Release scope and requests Release. | Release eligibility and commit-time business gates are checked independently of Approval. Each required Generation, Structure Snapshot, access and exception is revalidated; one immutable Release Record and exact package are retained, with no silent dependency cascade. | `REQ-LC-006/007/008`, `REQ-STR-001…005`; `VVP-006`, `SR-01…06` |
| 12 | Change unrelated work and retrieve the earlier package again. | The earlier Release resolves the same Generation, Artifact digests, structure and approval provenance; later Working Heads do not rewrite it. | `REQ-LC-008/009`, `REQ-STR-001/002`; `VVP-006`, `SR-06` |
| 13 | Inspect Audit and operation evidence for the complete path. | Material outcomes are attributable; authorization evidence remains separate from the owning Module's command outcome and Audit. | `REQ-AUD-001/002`, `REQ-AUTH-006…008`, `REQ-GOV-002`; `VVP-007`, `DH-01…04` |

## 5. No-change Check-in path

1. Repeat steps 1–6 with a semantically unchanged file and normalized metadata.
2. Use a new `OperationId` for this business operation.
3. The server returns `No Change`, creates no Generation and no Version increment, records the
   outcome, and ends Checkout for the confirmed scope.
4. If the request is retried after an uncertain response, the same `OperationId` and identical
   declared inputs return or resume the same logical result. Changed inputs are refused as a
   different operation.

Trace: `REQ-WS-008`, `REQ-WS-012/013`; `VVP-003`, `WS-02/07`, `QRS-001/002`.

## 6. Denied and recovery paths

Each path below is part of the same walkthrough. The expected result is a safe refusal or governed
recovery, never an inferred success.

| Path | Trigger | Expected outcome | Local-work rule | Trace |
|---|---|---|---|---|
| RBAC denial | Account lacks Project membership, applicable Group/Actor Role Assignment, Permission or Scope. | Server returns an explainable refusal; owner state is unchanged. | Keep local Workspace files. | `REQ-AUTH-001…010`, `REQ-GOV-002`; `VVP-007`, `RBAC-01…10` |
| Non-owner / wrong Workspace | Same Actor uses another Workspace, or a different Actor uses the Reservation. | Check-in is refused; no Generation or Working Head change. | Keep local files and Reservation evidence for recovery. | `REQ-WS-010/013`; `VVP-004`, `WS-03/07` |
| Stale expected Generation | Current Working Head differs from the Workspace's expected Generation. | Refuse publication and identify expected/current Generation plus permitted `Refresh`, `Reapply`, `Save As`, retry or governed recovery. | Never overwrite or auto-merge CAD/Office bytes. | `REQ-WS-010/011/014`; `VVP-004`, `QRS-003`, `ARCH-VIEW-SEQ-007` |
| Expired or recovered Reservation | Lease is expired or recovery state is not eligible for this command. | Publish entitlement is absent until a governed, audited recovery or fresh Checkout succeeds. | Local work is not deleted or silently transferred. | `REQ-WS-013`; `VVP-004`, `WS-04` |
| Modified Reference | A Reference file was edited locally. | Direct Check-in to its original Logical Document is refused; user may request a fresh Checkout, keep a safe copy, Create Copy or confirm discard. | Preserve the local candidate; stale conversion is refused. | `REQ-WS-003/014`; `VVP-002/004/WS-05/06`, `ARCH-VIEW-SEQ-005` |
| Unresolved dependency scope | The resolver cannot establish whether a locally changed file is required by the selected root. | Block Check-in and identify the unresolved file and reason; do not classify it as unrelated. | Keep local bytes and still-valid Reservations. | `REQ-WS-005/006/010/013`; `IE-CHG-PDA-APPROVAL-003`, `ARCH-VIEW-ACT-004`; `VVP-002`, `WS-09` |
| Required unreserved change | A selected root or required dependency changed without an `Active` Reservation. | Block the complete proposed Check-in; no partial Change Set or Generation. | Keep local bytes and still-valid Reservations. | `REQ-WS-005/006/007/010/013`; `IE-CHG-PDA-APPROVAL-003`, `ARCH-VIEW-ACT-004`; `VVP-002/003`, `WS-10` |
| Proven unrelated unreserved change | A locally changed file is proven outside the selected roots and required dependency closure. | Show `Modified without Checkout`, exclude it and require explicit confirmation of the reduced exact scope. Declining publishes nothing; confirming permits only preflight, with server revalidation before commit. | Excluded bytes remain local; no direct publish authority is created. | `REQ-WS-005/006/007/010/013`; `IE-CHG-PDA-APPROVAL-003`, `ARCH-VIEW-ACT-004`, `ARCH-VIEW-SEQ-002`; `VVP-002/003`, `WS-11` |
| Interrupted transfer | Connection/process fails before all ranges are verified. | Resume the same transfer/OperationId from accepted ranges, or keep it private for reconciliation. | Preserve verified local ranges and the original local work. | `REQ-WS-012/015`; `VVP-003`, `WS-08`, `ARCH-VIEW-SEQ-006` |
| Lost response | Commit may have succeeded but the response did not arrive. | Query the same `OperationId`; return the committed result, safe progress, or `Needs reconciliation`. Never create a second operation. | Do not discard local work until authoritative status is known. | `REQ-WS-007/010/012/013`; `VVP-003/004`, `WS-03/07`, `ARCH-VIEW-SEQ-007` |
| Pre-commit failure | Validation, digest, owner or transaction precondition fails before authoritative commit. | No public Change Set/Generation and no confirmed Reservation is ended. | Preserve local candidate; private bytes are reconciled separately. | `REQ-WS-007/010/013/015`; `VVP-003`, `WS-03` |
| Review invalidation | Content changes after Submit for Review, or required approver/transition is missing. | Pending Review is invalidated or blocked; no approval/release is inferred. | Return to In Work only through the governed Reject/Withdraw path. | `REQ-LC-002/005`; `VVP-006`, `WF-03/05` |
| Release scope invalid | Required Generation, Structure Snapshot, approval, access or exception is stale/ineligible. | Entire confirmed Release is refused; no partial Release Record. | Preserve existing records and Workspace data. | `REQ-LC-006/007`; `VVP-006`, `SR-02/04/05` |

## 7. Mandatory, deferred and prohibited scope

### Mandatory for this pilot

- Native account/session establishment and request-time Principal–Role Definition Version–Scope
  eligibility.
- One Logical Document with exact Generation identity, two Workspaces and explicit per-document
  Checkout/Reference scope.
- Changed and `No Change` Check-in, including Reservation end rules and idempotent `OperationId`.
- Stale, wrong-owner, wrong-Workspace, modified-Reference, interruption and lost-response safety.
- Exact Review, independent decision evidence, Release scope confirmation and historical package
  retrieval.
- Audit/evidence linkage and separation of byte custody from authoritative publication.

### Deferred or awaiting qualification

- Full format breadth and exact Format Worker runtime/toolchain/license qualification.
- Direct multi-location Artifact Gateway, replica/failover and provider/topology qualification from
  the later Vault successor; the approved predecessor only establishes the resumable transfer and
  private-custody boundary used by this scenario.
- Exact Vault provider/topology, durability numbers, throughput, memory and SLA thresholds.
- Company SSO/directory integration, graphical workflow designer and broad rollout operations.
- Production migration, retention/legal-hold periods and commercial readiness.

### Prohibited claims for PH0

- No claim of full Core v0 implementation, production rollout, SLA, DDM parity or commercial
  readiness.
- No claim that a document upload is a successful Check-in or that a Gateway receipt publishes a
  Generation.
- No binary CAD/Office auto-merge, silent overwrite, hidden tree-wide Checkout or privilege bypass.
- No claim of independent-human review when two identities are operated by one person.
- No claim that a Draft successor or an unqualified Vault location is approved.

## 8. Review and status

| Check | Method | Result | Required evidence |
|---|---|---|---|
| `P02-SCENARIO-001` | Walkthrough against exact predecessor source pins and trace matrix | `NOT-RUN` | Named reviewer, date, scenario hash, trace hash and disposition in [readiness-register.md](readiness-register.md) |
| Trace completeness | Inspect every step/path for exact REQ, architecture and VVP IDs | `NOT-RUN` | T009 record; unresolved sources remain `BLOCKED` |
| Scope review | Confirm mandatory/deferred/prohibited boundaries | `NOT-RUN` | T011 record; no feature/spec/tech change is implied |

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial canonical scenario and explicit negative/recovery paths; no execution result claimed. | T007–T010 |
| 0.2 | 2026-09-25 | Align the pilot narrative with the two narrowly approved policy corrections, identify a separately Release-eligible actor and correct the P05 fixture boundary. P02/T011 review remains `NOT-RUN`. | `IE-CHG-PDA-APPROVAL-002/003`; P05 evidence; T011 preparation |
