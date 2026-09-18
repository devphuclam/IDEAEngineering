# PH0 Recovery and Security Plan

**Increment**: `IE-INC-READY-001`
**Record ID**: `IE-PH0-P06-RECOVERY-001`
**Version / status**: `0.1` / Draft; P06 execution `NOT-RUN`
**Owner**: Principal Product Author
**Reviewer**: Security, Operations, data and project reviewers; not assigned in an attributable record
**Boundary**: Planning and review material only. No service, database, Vault or backup operation is
executed by PH0.

## 1. Protected assets and trust boundaries

| Boundary / asset | Required control | Evidence still needed |
|---|---|---|
| Native session and ActorContext | Server establishes current identity and eligibility; clients cannot supply durable identity or policy claims. | Session/revocation test on approved build. |
| Product metadata and relational state | Authoritative modules commit owner state, Authorization Decision, Owner Command Outcome, Audit and outbox according to the declared unit of work. | Fault-injection and transaction evidence. |
| Workspace and local candidates | Local files and manifests survive refusal, stale conflict, disconnect and recovery; no automatic overwrite or binary merge. | Two-workspace interruption/recovery evidence. |
| Artifact Gateway/Vault locations | Short-lived exact Transfer Grant, scoped ranges/digest, verified receipt and private staging; Gateway cannot publish. | Grant abuse, receipt forgery, digest and failover evidence. |
| Format Worker | Separate boundary, least privilege and controlled input/output; exact runtime/toolchain/license qualification is still `NOT-RUN`. | Worker sandbox and format qualification record. |
| Backup and recovery set | Metadata, Artifact manifests/locations, configuration, audit/outbox and key-recovery material are coordinated. | Restore rehearsal with exact baseline and owner sign-off. |

## 2. Recovery procedures

### 2.1 Interrupted or uncertain Check-in

1. Preserve local Workspace files, manifest and the original `OperationId`.
2. Query status using the same `OperationId` and identical declared inputs.
3. If the authoritative commit exists, return its complete result and Reservation dispositions.
4. If pre-commit progress is resumable, continue only the accepted ranges and validations.
5. If evidence is inconsistent or unavailable, hold `Needs reconciliation`; do not retry with changed
   inputs, create a second Generation or tell the user that Check-in succeeded.

Trace: `REQ-WS-007/010/012/013`, `REQ-OPS-001/002`; `VVP-003/004`, `WS-03/07`.

### 2.2 Stale, wrong-owner or expired Reservation

1. Return the affected Logical Document, expected/current Generation and safe local-work status.
2. Do not delete, overwrite, auto-merge or silently transfer local bytes.
3. Offer only the documented refresh/reapply, Save As/Create Copy, fresh Checkout or governed
   recovery choices after current-head validation.
4. Record the refusal/recovery request and actor; specialist recovery requires its own authorization
   and reason.

Trace: `REQ-WS-010/011/013/014`; `VVP-004`, `WS-04/05/06`.

### 2.3 Metadata/artifact divergence

1. Keep a private Artifact candidate separate from public Generation metadata.
2. Reconcile missing/corrupt/unreferenced candidates by digest, operation and retention policy.
3. A successful byte transfer is not a Check-in; a failed owner commit does not become public by
   inspecting a file or inserting a row.
4. A missing eligible Vault copy is a bounded refusal, not permission to serve another digest.

Trace: `REQ-WS-015/016`, `REQ-OPS-001/003/007/008`; `ARCH-VIEW-SEQ-006/012`, `ST-01…07`.

### 2.4 Backup and restore

The future rehearsal must restore a coordinated set, not only a database dump or only a Vault folder:

- relational metadata and versioned authorization/lifecycle state;
- exact Artifact identity, digest and location records;
- configuration/policy versions and workflow assignments;
- Audit, transactional outbox and reconciliation evidence;
- encrypted backup keys or an approved key-recovery path;
- Workspace recovery guidance for local candidates that were not yet authoritative.

The restore result must prove historical Generation/Release package resolution and must identify any
candidate that requires reconciliation. Exact RPO/RTO, backup frequency, retention and key custody
are `UNKNOWN` and owned by Operations/Security until recorded in P03.

### 2.5 Application and schema rollback

1. Deliver a versioned release bundle with its dependency/license inventory, protected configuration
   and preflight/health checks.
2. Take the approved pre-change backup and record the reconciliation criteria before a migration or
   account/policy change.
3. Do not assume that replacing old binaries is a safe schema downgrade. Choose either a forward
   repair or a proven full recovery path and record compatibility and possible data loss.
4. Keep the system in Restricted Recovery Mode until retained Generations, Structure Snapshots,
   Release Records, Artifact digests and security changes are independently reconciled.

These are planning rules from `DOC-05@0.20 §9.3–§9.4`; no rollback path has been rehearsed in PH0.

## 3. Security review matrix

| Case | Expected safe result | Planned evidence | Result |
|---|---|---|---|
| Forged/expired/replayed Transfer Grant | Gateway refuses wrong object, direction, range, digest, endpoint or expiry. | Gateway security log and before/after product-state check. | `NOT-RUN` |
| Forged Transfer Receipt | Server refuses custody evidence that is not exact, authenticated or correlated. | Receipt validation trace; no Generation/Reservation mutation. | `NOT-RUN` |
| Client-supplied Actor/role/policy claim | Server ignores it and establishes current `ActorContext` from the session. | Web/Desktop/API path comparison. | `NOT-RUN` |
| Account admin attempts Project/product action | Account operation may succeed; Project/product mutation is refused and separately audited. | `VVP-015`, PA-01 evidence. | `NOT-RUN` |
| Project/Group/Role cross-scope attempt | Scope/membership/delegation limits fail closed and atomically. | `VVP-007`, PA-02…04/RBAC-01…10. | `NOT-RUN` |
| Direct store/Vault path or database mutation | No supported product authority; event is detected/denied and state remains governed. | Security and audit evidence. | `NOT-RUN` |
| Worker input/output escape | Worker boundary rejects unapproved path/content and cannot publish a Generation. | Sandbox test and owner-outcome trace. | `NOT-RUN` |
| Local Workspace loss or disconnect | Local work is preserved or recovery status is explicit; no silent publish/overwrite. | WS-01/03/04 recovery log. | `NOT-RUN` |

## 4. Review competence and unresolved gaps

P06 requires named reviewers for security, recovery, storage/transfer, data and verification. The
current repository has procedure owners in VVP but no attributable execution review record. A single
developer or two identities controlled by one person cannot be recorded as independent-human review.

Open dependencies are tracked as D1–D5 in [readiness-register.md](readiness-register.md): actual
Vault locations and failure domains, Format Worker qualification, backup/key policy, reviewer
assignment, external-source/license intake and environment approval.

## 5. Readiness status

`P06-RECOVERY-001` and `P06-SECURITY-001` are `NOT-RUN`. No recovery or security control is claimed
as verified until the exact environment, fixture, build and attributable specialist review exist.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial rollback, recovery, backup, trust-boundary and security review plan; no runtime result claimed. | T020 |
