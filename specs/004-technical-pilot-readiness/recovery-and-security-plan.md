# PH0 Recovery and Security Plan

**Increment**: `IE-INC-READY-001`
**Record ID**: `IE-PH0-P06-RECOVERY-001`
**Version / status**: `0.5` / Draft; review result `PASS`; result scope is PH0 documentary
readiness; the P06 tracker card is `COMPLETED / PASS` in Execution Register revision 18
**Owner**: Principal Product Author
**Reviewer**: Current Project Reviewer assigned directly to the PH1 Security/Verification review
under [D3](evidence/D3-REVIEW-SCOPE-20260924.md). The reviewer completed the guided documentary
review with introductory security knowledge and assistant-provided explanation; this is not an
independent specialist review. Recovery/storage specialist review is conditionally deferred.
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

An isolated replacement must invalidate restored sessions and remain in Restricted Recovery Mode.
Account, membership, role and policy changes after the selected recovery point may be reconciled
only from independent evidence. Missing or ambiguous evidence keeps service restricted; a named
security/operations decision is needed to reopen. This is a planned later restore check, not PH0
restore evidence.

For this PH0/PH1 readiness scope, the current Project Reviewer is the interim **Change/Recovery
Authority**: the reviewer selects one evidence-supported recovery route and may accept return to
service only after the exact checks in the controlled recovery views succeed. This concise
responsibility does not grant production access, replace a later Operations/Security assignment or
turn a documentary review into restore evidence.

### 2.5 Application and schema rollback

1. Deliver a versioned release bundle with its dependency/license inventory, protected configuration
   and preflight/health checks.
2. Take the approved pre-change backup and record the reconciliation criteria before a migration or
   account/policy change.
3. Do not assume that replacing old binaries is a safe schema downgrade. Choose either a forward
   repair or a proven full recovery path and record compatibility and possible data loss.
4. Keep the system in Restricted Recovery Mode until retained Generations, Structure Snapshots,
   Release Records, Artifact digests and independently evidenced security changes are reconciled;
   restored sessions remain invalid and a named authority decides when service may reopen.

These are planning rules aligned with `DOC-05` Draft `0.23` §§9.3–9.4 and §10. That candidate
architecture is not a runtime result; no rollback path has been rehearsed in PH0.

## 3. Security review matrix

| Case | Expected safe result | Planned evidence | Result |
|---|---|---|---|
| Forged/expired/replayed Transfer Grant | Gateway refuses wrong object, direction, range, digest, endpoint or expiry. | Gateway security log and before/after product-state check. | `NOT-RUN` |
| Forged Transfer Receipt | Server refuses custody evidence that is not exact, authenticated or correlated. | Receipt validation trace; no Generation/Reservation mutation. | `NOT-RUN` |
| Client-supplied Actor/role/policy claim | Server ignores it and establishes current `ActorContext` from the session. | Web/Desktop/API path comparison. | `NOT-RUN` |
| Untrusted WebView message or another user commands Workspace | Desktop accepts only approved origin/frame and allowlisted intent; Workspace IPC authenticates the same user/session and exact Manifest Scope. Neither bridge exposes generic filesystem or shell authority. | Wrong-origin/frame, stale navigation, malformed message and cross-user IPC attempts. | `NOT-RUN` |
| Revoked session or changed account/role after authentication | Current eligibility and Role Assignment are checked at the authoritative decision; an old session cannot reuse revoked authority. | Account suspension, role removal and old-session attempts with before/after decision and Audit evidence. | `NOT-RUN` |
| Account admin attempts Project/product action | Account operation may succeed; Project/product mutation is refused and separately audited. | `VVP-015`, PA-01 evidence. | `NOT-RUN` |
| Project/Group/Role cross-scope attempt | Scope/membership/delegation limits fail closed and atomically. | `VVP-007`, PA-02…04/RBAC-01…10. | `NOT-RUN` |
| Direct store/Vault path or database mutation | No supported product authority; event is detected/denied and state remains governed. | Security and audit evidence. | `NOT-RUN` |
| Client package or configuration exposes a permanent database/Vault credential or recovery key | No permanent provider credential or unrestricted path is shipped to the Client; recovery keys remain in protected custody outside source. | Package/configuration secret scan and raw-provider access denial. | `NOT-RUN` |
| Audit write or outbox failure during an owner command | No success is claimed without the required attributable owner outcome and Audit Evidence; retry must not fabricate a second business outcome. | Fault-injection trace linking owner transaction, Audit, outbox and retry result. | `NOT-RUN` |
| Worker input/output escape | Worker boundary rejects unapproved path/content and cannot publish a Generation. | Sandbox test and owner-outcome trace. | `NOT-RUN` |
| Local Workspace loss or disconnect | Local work is preserved or recovery status is explicit; no silent publish/overwrite. | WS-01/03/04 recovery log. | `NOT-RUN` |

## 4. Review competence and unresolved gaps

For PH1, the current Project Reviewer is assigned to the Security and Verification review under D3.
The reviewer described their security knowledge as introductory and completed this documentary
review with assistant-provided explanations. The attributable decisions and examined material are
recorded in the three bounded review notes and the
[final guided-review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md). This supports
the P06 documentary-readiness result; it is not an independent security certification, an
operations qualification or runtime evidence. A single developer or two identities controlled by
one person cannot be recorded as independent-human review.

Recovery/storage specialist review is deferred only while PH1 makes no backup, failover or
production-recovery claim. This does not remove the P06 review of the recovery plan. Data and
Operations ownership for later runtime recovery remains to be assigned when that work enters scope.

The guided review examined §§1–3 against `DOC-04` `REQ-WS-010…015`, `REQ-SEC-001…004`,
`REQ-AUD-001/002` and `REQ-OPS-001…004`, and `DOC-05` Draft `0.23` §§7.2.1, 9.3–9.4 and 10.
It accepted the expected safe outcomes for interrupted Check-in, stale work, metadata/Artifact
divergence, current identity and scoped RBAC, staged Artifact transfer, local execution boundaries,
Audit/outbox atomicity and coordinated recovery. Existing controlled views are reused where they
already fix ordering and ownership; a focused new view is required only when those facts remain
ambiguous. No material documentary gap remained after correcting the recovery-route views.

Open dependencies are tracked as D1–D5 in [readiness-register.md](readiness-register.md): actual
Vault locations and failure domains, Format Worker qualification, backup/key policy, reviewer
assignment, external-source/license intake and environment approval.

## 5. Readiness status

The Project Reviewer disposition is `PASS`. Its scope is the recovery procedure, security-review
matrix, responsibility boundary and later verification plan in this exact PH0 document version.
The P06 tracker card was completed by the Project Reviewer on 2026-09-24 and recorded as
`COMPLETED / PASS` in Execution Register revision 18. The final tracker evidence points to the
[guided review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md).

All application, fault-injection, abuse, rollback and restore executions represented by
`P06-RECOVERY-*` and `P06-SECURITY-*` remain `NOT-RUN`. No runtime control, independent specialist
review, accepted deployment, Product Decision Authority approval or `PG4` outcome is implied.

## Change log

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-18 | Initial rollback, recovery, backup, trust-boundary and security review plan; no runtime result claimed. | T020 |
| 0.2 | 2026-09-24 | Record the confirmed D3 PH1 review scope and direct Project Reviewer assignment; preserve the competence and executed-review gaps. | [D3 decision evidence](evidence/D3-REVIEW-SCOPE-20260924.md) |
| 0.3 | 2026-09-24 | Align the documentary review with current recovery/security architecture: restored-session invalidation, post-recovery authority reconciliation, old-session denial, bridge and key boundaries, and Audit/owner outcome checks. Add a guided review method; P06 work is active while its review result remains `NOT-RUN`. | `DOC-05` Draft `0.22` §§9.3–9.4, 10; `DOC-04` Draft `0.15` requirements above |
| 0.4 | 2026-09-24 | Record the Project Reviewer's guided acceptance of the complete PH0 documentary scope, define the concise interim Change/Recovery Authority responsibility and keep every runtime/security/restore check `NOT-RUN`. | [Final guided-review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md); `DOC-05` Draft `0.23` |
| 0.5 | 2026-09-24 | Record the explicit P06 card completion as `COMPLETED / PASS`, Execution Register revision 18; preserve the documentary result scope and all runtime `NOT-RUN` checks. | [Final guided-review disposition](evidence/P06-GUIDED-REVIEW-DISPOSITION-20260924.md); [Execution Register](../../planning/idea-technical-pilot-execution-register.json) |
