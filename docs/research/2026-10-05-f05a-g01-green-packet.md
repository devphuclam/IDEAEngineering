# G01 minimum GREEN / additive V9 — controlled execution packet

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-VEV-F05A-G01-GREEN-20261005 / qualification packet / 0.1 / Draft |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / authority | Approved T028/T030 vertical slice and conditional additive V9 authority; execution NOT-RUN at publication |
| Normativity / instruction | Product INFORMATIVE / NOT-APPLICABLE |
| Date / timezone / retention | 2026-10-05 / Asia/Ho_Chi_Minh / INTERNAL, retain historical attempts |
| Upstream / downstream | [input freeze](2026-10-05-f05a-t028-t030-input-freeze.md), [behavior RED](2026-10-05-f05a-g01-behavior-red-packet.md), DOC-06 Check-in transfer preparation → G01 only |
| Supersession / trigger / tailoring | Successor attempt, historical evidence unchanged; source/graph/target drift STOP; STANDARD-GUIDED under IE-STD-AUTH-001, no conformity claim |

## Genuine RED receipt

Executed source `6fa424aec8bd0aa58648c5c26320d348af97fdc7`, owned root
`/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-behavior-red-01`.
Local and remote raw input hashes 73/73 PASS; archive SHA-256
`5c01665dae99205bd0484bebc2f72c111c68cbb6ca1b8b9373ad833133860a49`;
manifest `5245a910894dbd5030d00b83d614ff71745614ad3fef1bb4b165cbfc317ca818`.
Real HTTP sign-in/principal capture and fresh-schema V1–V8 succeeded before
`GRANT_ISSUANCE_NOT_IMPLEMENTED`: 1 test, 0 failures, 1 error, 0 skipped.
Schema `f05_f018a8d8e42843aba9a65a266f7d09f3` was removed only after JVM exit
and exact source/owner marker verification. Database retained. Maven exit 1 is RED, not PASS.
Pre/post source 73, inventory 456, Maven core 52 and 695 observed cached paths PASS.
Private Maven log SHA-256 `f96373e49cd5f0e11799f2b14a6fbf580611b1e6d9a7178c6e76f05fdb60e13e`;
preflight `34756259be968e242c5753d18370c9d16c7c2b6467b288a6785683258a9a1d47`;
postflight `b77762f0de431d397b4269684858b3173fe4a60a5fafbb97acb1fc4ef2f16b54`.
Logs remain private on the host; hashes do not constitute independent raw-log review.

## Why V9 is needed, and exact delta

DOC-06 requires exact endpoint/object/operation/size/digest/ranges/expiry and retained
bounded claims, without permanent credentials. V1's transfer/grant rows lack Organization,
Gateway, endpoint, exact object and signing identity. Resolving the issued scope must not
rely on command input or an in-memory result alone. The genuine RED activates the approved
conditional V9 authority. V1–V8 remain byte-immutable.

`V9__exact_transfer_grant_scope.sql` adds only two composite identity constraints,
`transfer_grant_scope` with typed original scope/correlation/signing identity, its FKs,
append-only trigger and a trigger preventing legacy signed claim mutation except status.
App receives SELECT/INSERT only on the extension; UPDATE/DELETE/TRUNCATE are revoked.
Migrator creates/owns the objects. No private key, signed bearer frame or storage credential
is persisted. Existing claims plus these typed fields reconstruct the exact private frame.
No Artifact/location/Receipt or F04 committed-event mutation is added.

The minimum service has mandatory owner/allocation policy on the caller transaction;
IAM establishes current Actor/Organization and coordinates eligibility before commit.
Issuance inserts PREPARING transfer + ISSUED grant + typed scope + issuance Audit atomically;
the frame escapes only after commit. ACCEPTED means Grant issuance, never accepted custody.
Resolve revalidates current IAM/owner policy and reads stored scope. It is not yet a claim
of the complete retry/concurrency/expiry/replacement/failure matrix.

## Published execution contract

Fresh target `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-green-01/source`.
Exact pushed successor commit and manifest SHA are supplied to:

```bash
bash tests/ph1/f05-qualification/server-grant/run-g01-green.sh <source-sha> <manifest-sha256>
```

Byte-preserving Git export; every manifest entry must match locally and after extraction;
transfer archive hash must match. Same admitted JDK25/Maven3.9.16/tool hashes and cached
456-row input envelope; no new external input. Five direct offline resources/testResources,
compile/testCompile/Surefire goals only. No lifecycle/exec/Boot/package/clean/download.
Private role file is read only within the guarded forked test, not Maven properties/env.

Only `idea_ddm_f05a_20261005_t028`, fresh marked `f05_<32lowerhex>` schema; migrate V1–V9
there, restrict history privileges and verify app has no schema/database CREATE. Synthetic
eligible Vault row is a fixture, not a Gateway. Actual Server binds 127.0.0.1 ephemeral port.
Expected G01 1/1 PASS: persisted exact full scope, independently decoded 22-tag Ed25519
signature, literal frozen fields and identical issue/resolve frame; zero custody/event rows.
This run does not qualify V8→V9 upgrade/privilege mutation matrices or G02–G06: retain them
for their affected regression/vertical slices, not inferred PASS.

STOP on wrong target/hash/tool/input, unexpected compilation/fixture/test failure or graph
drift. No dynamic repair in this attempt. After owned JVM exit, only exact marked schema
may be dropped; database retained. Rehash controlled inputs and actual observed cached
paths. Keep logs private and retain only bounded result/hash/source/schema evidence.
PR #38 Draft/Open; Issue #37 Open; T028/T030/F05-A incomplete; verifier NOT-RUN;
no Gateway/Receipt/T032+, preview, TLS provision, timer/Tracker or merge.
