# T027 deterministic envelope and PH1 protocol profile

| Control | Value |
|---|---|
| Stable ID / class | IE-RES-F05A-T027-PROFILE-20261003 / qualification profile |
| Version / status | 0.1 / Proposed engineering realization under authorized T027 qualification; execution NOT-RUN |
| Product normativity / repository instruction | INFORMATIVE / NOT-APPLICABLE; no new Core requirement |
| Owner / author / worker | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / CODEX_ONLY |
| Authority / date / timezone | User-supplied “Continue F05-A / T027” A–I work package, 2026-10-03 / Asia/Ho_Chi_Minh |
| Baseline / change | Predecessor c8ba465f4761dfeb5f3490cc268077127f53d71b, Issue37/PR38; accepted predecessor results not reopened |
| Classification / retention | INTERNAL; retain source/commands/hashes/results; synthetic signatures and private keys stay on owned host only |
| Upstream | [Frozen preparation v1.0](2026-09-28-ph1-f05-gateway-qualification.md), ADR-0013, PH1 FR-008–012 and DATA-REL-031 |
| Downstream | T027 closure, T028–T034 production responsibilities; harness below is not product code |
| Review / acceptance | Project Reviewer authorization to resolve bounded details and close T027 when A–I criteria pass; no product gate or independent raw-log review inferred |
| Supersession / trigger | New profile successor, frozen v1.0 bytes unchanged; version/graph/security/target drift reopens applicable gate |
| Evidence / tailoring | Planned deterministic JDK-only CLI seam, controlled-time vectors and bounded resource probe; STANDARD-GUIDED under IE-STD-AUTH-001; actual results separate |

## 1. Qualification seam and exact execution

The authorized public test boundary is file-based signer/verifier CLI in independent JVMs.
Source: `tests/ph1/f05-qualification/envelope/Envelope.java`, `Qualification.java`, `run.sh`.
JDK25 standard library only; no Maven, dependency, Python, Node, DB, TLS/listener or preview.
Use the existing82 pinned JDK/host inputs from the HTTPS packet, not a new toolchain graph.
Fresh owned roots: `envelope-red-01`, `envelope-green-01`, `envelope-qualification-01`
under `/home/phuclam/idea-f05a-20261003-37/`. Require absent roots, canonical containment,
owner phuclam, mode700; source files600. Refuse symlinks/reuse. Keep all attempts for review.
Commands: `bash .../envelope/run.sh <exact source SHA> <manifest SHA> <trace|full>`,
from the exact exported source under the named root. Source/manifest/archive identities
are published before execution. Any input/tool hash mismatch blocks execution.
Trace RED must expose absent encoding, not missing tool. After its minimal GREEN, negative
vectors qualify already implemented refusal behavior without fabricating REDs.

Signer creates two fresh Ed25519 key pairs in memory and exits after retaining only payload,
signature and pinned public-key files in the private vector directory. No private-key file is
ever written. A subsequent verifier JVM reads only those public files, with fresh state.
Retained repository evidence contains hashes and safe case results, not full bearer messages.
Fixture time is an explicit synthetic epoch, not host time or a public time-control route.

## 2. Exact binary contract v1

All multibyte integers are big-endian. UUID = two64-bit words (16 bytes), nonzero.
Integer sizes/offsets/timestamps are signed64-bit nonnegative; chunk is signed32-bit positive.
Time = whole UTC Unix epoch seconds; exact deadline is expired, no implicit clock-skew grace.
Digest =32 raw SHA-256 bytes. Strings use strict UTF-8 (malformed/unmappable rejected),
with ASCII identifier/URI subset in this PH1 profile,1..256 bytes, no controls/NUL.
Endpoint is exact configured canonical HTTPS URI with no credentials/query/fragment.
No Java serialization, map iteration order, locale, platform newline, JSON canonicalization or JOSE.

Signed payload: ASCII magic `IEPH1ENV` (8 bytes), kind u8 (1 Grant /2 Receipt),
version u16 (1 only), field-count u16, then the exact ordered field set below.
Each field has tag u16, byte-length u16 and exactly that many value bytes.
Tags must occur exactly once in increasing fixed order: duplicates, unknown/missing/reordered
fields, truncation, invalid lengths/types and trailing bytes refuse before authority is used.
Complete signed message: payload-length u32, payload bytes, signature-length u16 (64 only),
64-byte Ed25519 signature; total size at most4096 bytes, exact EOF required.
The authenticated payload includes magic/kind/version and every field; the outer length has
one strict interpretation and is not an independently usable authority claim.

| Grant tag | Field / representation |
|---|---|
| 1–4 | issuer, audience, purpose=`GRANT_UPLOAD`, signing key ID: strict bounded UTF-8 |
| 5–10 | GrantId, OperationId, TransferId, OrganizationId, originating ActorId, GatewayId: UUID |
| 11 | exact selected HTTPS endpoint URI |
| 12–14 | direction u8=1 upload; object-kind u8=1 candidate/2 exact Artifact; object UUID |
| 15–16 | expected byte count i64; expected SHA-256 |
| 17–19 | permitted contiguous start-inclusive/end-exclusive i64 offsets; chunk bytes i32 |
| 20–22 | issued, not-before, expires: i64 epoch seconds |

| Receipt tag | Field / representation |
|---|---|
| 1–4 | issuer, audience, purpose=`RECEIPT_VERIFIED`, signing key ID |
| 5–12 | ReceiptId, GrantId, OperationId, TransferId, OrganizationId, originating ActorId, GatewayId (UUID), exact HTTPS endpoint |
| 13–15 | direction, object-kind, candidate/exact Artifact UUID |
| 16–19 | VaultId, LocationId (UUID), observed byte count i64, observed/full SHA-256 |
| 20–22 | verified start/end-exclusive i64; completion u8=1 (fully VERIFIED only) |
| 23–25 | issued, not-before, expires: i64 epoch seconds |

Actor/Organization are immutable Server provenance, not proof of the bearer presenter.
Endpoint/Gateway identities remain distinct from physical Vault path. Receipt must match the
originating verified Grant on Grant/Operation/Transfer/Actor/Organization/Gateway/endpoint,
direction/object/size/digest/ranges. A completed Receipt requires full [0,size) coverage and
matching full digest, never partial progress interpreted as complete. Other Receipt result
types are deliberately not accepted by v1; later progress APIs need their own typed contract.
Server compares Vault/Location with its controlled allocation, not merely nonzero IDs.

## 3. Frozen qualification parameters

| Parameter | PH1 qualification value / rationale |
|---|---|
| Grant validity | 300 seconds; issued=not-before, expires=issued+300; no grace |
| Receipt acceptance | 900 seconds from issuance; exact expiry refused; Receipt issuance must be during originating Grant eligibility |
| Chunk/range profile | 1,048,576 bytes maximum per request; half-open offsets, contiguous authorized scope; final chunk may be shorter |
| Control framing | 4096 bytes maximum signed envelope; receive cap before parsing/allocation; strings256 bytes each; fixed schema count |
| Timeouts | connect10s; response/read inactivity30s; whole range request60s; final status/control request30s |
| Retry | After timeout/uncertain response query same OperationId/TransferId. Identical accepted range resolves without append; changed offset/length/digest/input conflicts, never overwrite |
| Renewal | New GrantId, same operation/transfer/object/digest/scope and verified progress; fresh Server eligibility/owner checks, no automatic extension of an old signed Grant |
| Range identity | TransferId + start + end + chunk SHA-256; Gateway persists verified range state before acknowledgement in T031 |
| Same operation | Resolve existing progress/result under owner query access policy; do not silently create another operation after loss/uncertainty |

300/900-second choices are bounded PH1 test profile, not production performance/security SLA.
1KiB needs1 request;64MiB needs64 full1MiB requests. Renew when necessary; a whole64MiB
upload need not fit inside one300-second Grant. The bounded JDK probe streams exact P05
pattern bytes through a1MiB buffer and hashes them; calculated request count/frame bounds and
controlled before/at/after validity are measured/tested. No HTTP transfer throughput,60-second
network deadline enforcement or product resume PASS is inferred from this calculation/probe.
Timeouts bound one stalled request; T029/T034 must exercise actual request timers and retries.

## 4. Control protection and authority

Use client-mediated control in PH1: authenticated ordinary Server session/CSRF obtains or
renews Grant, Client sends bytes directly to Gateway, Client presents signed Receipt to Server.
No independent Gateway-to-Server RPC or service credential is needed for this selected flow.
Gateway authenticates Server authority through pinned Server Grant public key, exact
issuer/audience/key ID/domain/version and scope. Server authenticates Gateway evidence through
pinned Gateway Receipt public key and exact issuer/audience/domain/correlation/allocation.
An authenticated envelope is not current IAM authorization.

TLS performs normal CA/trust-chain and endpoint identity verification on both endpoints;
Ed25519 binds end-to-end typed control/evidence independent of who transports it. Private keys
remain at their signing owner. Named operator provisions exact peer public-key fingerprint,
key ID/service identity and endpoint into private owner-controlled configuration, never key
discovery URLs/client registration or private-key exchange. Unknown key/version fails closed;
rotation requires a separately controlled configuration/profile update, not automatic trust.

Gateway trusts only finite signed byte scope and its own verified storage observations. It
cannot infer current Account eligibility from signature validity or consult Server PostgreSQL.
No proactive revocation signaling is invented: unexpired granted private-byte work may proceed,
but renewal requires current Server checks and final Server acceptance must coordinate fresh
eligibility/owner checks with revocation/disablement before relational commit. Thus stale Grant
or Receipt cannot commit accepted custody after authoritative eligibility is invalidated.
When Server/control is unavailable: no issuance/renewal/final acceptance; candidate remains
private and same-ID resolution is required after recovery. No fallback database/RBAC authority,
plaintext fallback, synthetic success or new-ID silent retry.

## 5. Adapter profile (no real Adapter implementation)

Accepted filesystem8/8 proves only its named prerequisite primitive. T031 must implement the
real boundary with one controlled root, opaque identity-derived private paths, no client path,
absolute/traversal/symlink refusal, private candidate staging, independent size/full digest
verification before promotion, immutable completed objects and bounded failure containment.
No candidate becomes accepted custody until Server verifies exact Receipt and commits metadata.
ArtifactId/VaultId/LocationId remain distinct; future multiple locations are additive architecture,
not tested PH1 behavior. No same-user hostile-process isolation, crash/power-loss durability,
filesystem/PostgreSQL atomicity, replication or real Adapter PASS is claimed.

## 6. Required retained oracles

Positive deterministic model/bytes/parse and two-owner Ed25519 verification; fresh public-only
verifier. Refuse payload/signature/key/domain/purpose/audience tamper; unknown version;
missing/duplicate/ambiguous/truncated/trailing/oversized/invalid UTF-8/type values;
every authority ID/size/digest/range mutation; before/at/after deadlines; Receipt correlation
and controlled Vault/Location mismatch. Retain fixture/vector SHA-256, exact source/tool and
command identities, RED/GREEN receipts and limitations. Replay prevention is NOT claimed by
signature verification; real transfer state/arbitration belongs to T028–T034.

Node24.19.0 remains T033-only candidate under its existing exact path/intake state; it is not
needed by this JDK-only qualification and not a T027 blocker. No Node execution occurs here.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-03 | Exact authorized envelope/profile/control/Adapter seam and independent CLI qualification packet; actual result pending |
