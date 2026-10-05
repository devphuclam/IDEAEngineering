# Continuous F05 execution — controlled successor record

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-VEV-F05-SPRINT-20261005 / execution packet / 0.1 / Draft |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Reviewer / authority | Human continuation under T028–T034 sprint; predecessor accepted head 5e7c631327bc8cbde9591a8b676e8da43e76b2bc |
| Normativity / instruction | INFORMATIVE product / NOT-APPLICABLE |
| Date / timezone / retention | 2026-10-05 / Asia/Ho_Chi_Minh / INTERNAL, preserve every prior attempt |
| Upstream / downstream | Frozen T027, T028/T030 input freeze, G01/G02 receipts → G03–G06, regressions, T029–T034 |
| Tailoring / trigger | STANDARD-GUIDED under IE-STD-AUTH-001, no conformity claim; tool/graph/target/rights drift STOP |

## Continuity authority

Human authorizes continuous vertical implementation without another approval between units;
ordinary RED/compiler/SQL/race/runner defects are engineering work, repaired in fresh source/
attempts. Keep historical failures. Do not merge; do not restart timer or change Tracker.
Do not widen a rights exception or treat new execution authority as a grant of missing rights.
Each stage uses the applicable exact admitted graph and safe target; new inputs require intake.

## Server slice execution recipe

Each exact pushed source supplies a byte-preserving export and raw manifest. Verify all entries
locally, identical archive after transfer and all extracted entries before execution.
`run-slice.sh <source-sha> <manifest-sha256> <stage-red-or-green-NN> <expected-test-count>`
uses a new owned `run-<stage>/source` under `/home/phuclam/idea-f05a-t028-t030-20261005-37`.
Stages are restricted to g03/g04/g05/g06/regression; each concrete target is published below
before use. No existing target/log reuse. Same five direct offline resources/compiler/Surefire
goals, pinned existing JDK/Maven/psql, exact 456-row inventory and 52 core hashes. No lifecycle,
exec/Node/Web/Boot repackage/cache resolution/download. Real HTTP Server 127.0.0.1 ephemeral
and exact retained DB `idea_ddm_f05a_20261005_t028`, fresh marked f05 UUID schema only.
Stop owned JVM before schema owner/source marker cleanup, retain DB. Rehash actual observed
cached inputs and original source. Private credentials/keys/frames/logs never public evidence.

## Predeclared G03 qualification

Fresh target `run-g03-green-01/source`; expected G01/G02/G03 4/4 PASS. Existing product signer
issues a Grant under actual Server context; independent test decoder verifies with pinned public
key. Wrong key and modified signed bytes refuse; re-signed wrong audience/purpose/version
fixtures distinguish policy refusal from mere bad signature. Exact public HTTPS endpoint and
22-field frame excludes storage paths/credential fields. No Gateway verification implementation
or repeat of the full T027 codec matrix is claimed. This qualifies existing behavior; first
GREEN need not manufacture a production RED. G04–G06 and later tasks remain NOT-RUN.

No verifier, preview/trust-store action, public schema test, merge or progress action.
PR #38 Draft/Open, Issue #37 Open. Public evidence hashes are not independent host-log review.

## G04 first RED packet

Fresh target `run-g04-red-01/source`, same admitted recipe, expected 5 test methods with
G04 identical issue retry failing against the predecessor implementation. Lost-response lookup
must first return the original. Genuine missing retry behavior is then witnessed at the second
issue under the original OperationId (unique operation storage cannot permit a second transfer).
Required GREEN: original Grant/Transfer/frame and one issuance Audit, no duplicate original
state. No source/migration/dependency expansion. Concurrency/conflict follow vertically, not
prewritten bulk speculative implementation. Original attempt preserved and no in-place repair.

## G04 retry GREEN packet

G04 genuine RED at `aa811ef401bbc1b5062ed66517f9ac1ed601f092`: 5 tests / 1 error,
duplicate `transfer_record_operation_id_key` on identical retry, after lost-response lookup
succeeded. Schema `f05_d30be7e5ce994aae9cfd28ff9bc456cb` exact cleanup COMPLETE.
Private log hash `d06fc28d16c0d336ccc4b6d12cfee419a594633e6b487c244219eb4601906b87`.
G03 preceding source `4187790e9b6933e883672eb539f5d4b4445ac69e` 4/4 PASS,
schema `f05_6445de5abb7548358a40d79e6b70f873`, exact cleanup COMPLETE; log
`c2a865b07a60a4d4293f91869133aa3264964ad15f90b95f46a453935515e21a`.
Both full raw local/remote source and admitted postflight hashes PASS, DB retained.

Fresh G04 GREEN target `run-g04-green-01/source`, expected 5/5. Minimum service acquires
transaction-scoped OperationId arbitration, resolves stored full original scope, refuses changed
immutable scope/Actor and returns original without reinsert/Audit duplication. Current IAM and
explicit owner/allocation decision are rechecked before returning. No schema/tool/input changes.
Concurrency and conflict coverage is not inferred until its own successor test execution.

## G04 concurrent/conflict qualification packet

Fresh `run-g04-green-02/source`; expected 6/6, no production changes. Two concurrent identical
issue calls use real PostgreSQL transaction arbitration and the established session. Both must
return one canonical Grant/Transfer/frame and one original Audit. A changed size/range under
the same OperationId is explicitly authorized by the test-owned callback but must still conflict
at immutable-operation comparison; original result remains unchanged. Bounded latches/future
timeouts prevent an unbounded race test. This separately qualifies the already-added lock.

## Executed receipts and material network STOP

| Stage | Exact source | Actual result | Owned schema / cleanup | Private Maven log SHA-256 |
|---|---|---|---|---|
| G03 | 4187790e9b6933e883672eb539f5d4b4445ac69e | 4/4 PASS | f05_6445de5abb7548358a40d79e6b70f873 / COMPLETE | c2a865b07a60a4d4293f91869133aa3264964ad15f90b95f46a453935515e21a |
| G04 retry RED | aa811ef401bbc1b5062ed66517f9ac1ed601f092 | 5 tests, 1 error: duplicate original operation | f05_d30be7e5ce994aae9cfd28ff9bc456cb / COMPLETE | d06fc28d16c0d336ccc4b6d12cfee419a594633e6b487c244219eb4601906b87 |
| G04 retry GREEN | 2309694faa6837d5d788266469b48a073159d707 | 5/5 PASS | f05_1dfe2b41584b47b48abd67a92f0bfd6b / COMPLETE | 01078c84af4b73ccf1e1800ca9c65dab4f6ebdef87a04ba29185acc2765b9822 |
| G04 concurrent/conflict | 18758bec4678ffff9685e9ddbc1218194e749bb6 | NOT-RUN: transfer blocked by network | No test/schema creation by this runner observed; partial transfer root retained | NOT-AVAILABLE: Maven not invoked |

G03 archive/manifest: `590037a9f96b78912e81fe08a757e8fd74373f5069c3f7d92d008ae85169bc4f` /
`a6291d80038bab10e1748b9de0057d1f801f1893f90b49417c7e152672a3ad4f`.
G04 RED: `0bd70257c90f2031d775b90038ba4a3cce185f286811799920aa350dfa81d942` /
`50a5efe9311664cbe7ad354465f77ff8b22f0739bfea1cd8aa2dc9d439fb0330`.
G04 GREEN: `70feef67abea474323161796db1cb47e1a26e3a2f5af1681da9589d9b3c2d935` /
`144a67c2b62ad4eda43cbffcbb85ae18be088ad5b9ec539e16fc3cb85772b121`.
All three executed runs: local/remote raw inputs 78/78 PASS; controlled source and admitted
inventory/core/observed-input postflight PASS; database retained. Expected RED is not PASS.

Published concurrent source local 78/78 PASS, archive
`ad8cff9455abf36894509af28fac1a4dab0306e8c4071cdd52e8a546c523b045`, manifest
`cad466e98a57caf6aa540b50d9492412410f75f2ca326c4dae506abd217364a0`.
First SSH root probe timed out before creation. Subsequent SSH answered and confirmed target
absent; continuation then stalled in SCP. Network also produced GitHub TLS handshake timeout.
Final bounded SSH ConnectTimeout5 probe again timed out. Windows hotspot adapter existed at
192.168.137.1; this does not prove remote server reachability. Cause beyond that is UNKNOWN.

Only the stalled local SCP child matching exact archive/host/owned destination was terminated
(PID34652); parent exited at TRANSFER guard. No remote execute command followed. Do not claim
archive transfer identity/remote raw hashes/qualification/cleanup PASS for this attempt. Existing
remote owned target may contain a partial archive; preserve it, do not reuse or adopt it.

**Material STOP: server network unavailable/unstable.** No approval gate is reopened. After
connectivity returns, inspect retained target read-only and use fresh `run-g04-green-03/source`
for the same published concurrent/conflict contract (6/6 expected), with exact successor source/
manifest/export/transfer checks before execution. Continue G05/G06 and the full authorized sprint
automatically thereafter. No extra approval is needed for normal repairs or continuation.
T028/T030 incomplete, later T029–T034 NOT-RUN; no merge/verifier/Gateway/preview/progress action.

## Restored network / G05 RED packet

Connectivity restored; partial root02 archive retained unchanged. Fresh root03 executed
source19b49b8cf60bf111fbcb2c0866b639c2dad9b47f, **6/6 PASS** including real concurrent identical
retry and authorized changed-input conflict. Schema f05_35882bd498fb403fa36478e215ee5ce3 cleanup
COMPLETE; private log7b7a6a530fed2a2df4a48f1c0979cc6cedc0bba6906f6dcf6918f8385075e43f.
Raw78/78 and admitted-input pre/post hashes PASS; database retained.

Next fresh `run-g05-red-01/source`: 7 test methods, G05 new expiry/renewal tracer is expected
to fail at explicit GRANT_VALIDITY_NOT_IMPLEMENTED skeleton. Authoritative test Clock is UTC,
monotonic/in-memory; actual Server and Grant service share it. Before/at/after expiry and explicit
new GrantId/same original operation/transfer/scope are observed, old validity must not change.
No host time change, no waiting 300 seconds, no schema/dependency/tool change. Run existing
published five direct offline goals and full input/target/schema guards. Minimum GREEN only
after observed RED; then fresh-eligibility/allocation renewal refusals and G06 follow vertically.

## G05 minimum GREEN packet

Observed RED source7b5339d728c91ad631c252f7f01eb5249adcc6d0, 7 tests/1 error at
GRANT_VALIDITY_NOT_IMPLEMENTED; schema f05_7d9de25d448f4f91a4e8c353d2c4f2c0 exact cleanup
COMPLETE; log7b449e878db952297e50515264dc28610e1cffe4e9da661a4806cf23deff9a65.
Fresh `run-g05-green-01/source`, expected7/7. Grant validity is issued-inclusive/expiry-exclusive;
ordinary retry after expiry refuses with explicit renewal required. Explicit renew retains original
Operation/Transfer/full immutable scope, supersedes old status without changing old signed bytes,
inserts fresh Grant/scope/Audit and revalidates IAM/owner/allocation before shared commit. Lookup
selects the current ISSUED generation (an expired timestamp can still be resolved as metadata but
is not valid); no implicit extension or Gateway progress/custody claim. V9 and graph unchanged.

## G05 refusal qualification

Minimum GREEN c59174f967f24aa7d4b48d9863605d06de477d43:7/7 PASS, schema
f05_bc59266efb14452f86dfe5dc43030946 exact cleanup COMPLETE, private log
a1f4b494781ae2cc3471c432a3ea5bd9bdd58e72960e39eb8655269e3d018447.
Fresh `run-g05-green-02/source`: expected8/8; real HTTP logout invalidates original context,
renewal must refuse without replacing original Grant. Fresh sign-in plus ineligible configured
Vault also refuses; no extra transfer/grant/scope/Audit, original still resolves once allocation
restored. Expired ordinary retry explicitly refuses, never silently renews. No production change.

## G06 existing transaction qualification packet

G05 refusal source843fd9f20a2e9bac78add88fe98a2912dece99f7 **8/8 PASS**, schema
f05_0bf9b64f4178455cab0190b1a216623d exact cleanup COMPLETE; log
a9845ec88e79cfcb6fa0a68e77cd2a3dddcd31fdeabe47326e143b2f5eb70771.
Fresh `run-g06-green-01/source`, expected10/10. Qualification tests existing transaction guards:
suppressed required transfer/grant/scope/Audit insert, unusable signing key, deferred PostgreSQL
commit failure, renewal Audit failure and real HTTP logout winning before both issuance/renewal
commit. Real marked-schema PostgreSQL trigger barrier waits before IAM commit coordination;
logout commits, barrier releases, owner must roll back pending writes. Original renewal result
survives unchanged. Deferred failure remains labeled uncertain by caller; independent DB observer
confirms zero committed state for that controlled failure, not a general lost-response claim.
Owned trigger/function guards use only current test schema, are removed after each case; no public
schema/role/old DB change. No test-only production hook, permission, HTTP Grant route or F04 event.
No manufactured RED where existing guards already pass; ordinary failures are fixed prospectively.

## G06 execution receipt and affected regression packet

Executed source7022857426d7f00655978f567b326aaaaf1575b7: **10/10 PASS**, no failure/error/skip.
Raw local/remote78/78 PASS; archive5afbb7de8c965288718b83ccba684d31eb420581330daf8191fdcc8c3d316877.
Schema f05_0109dd80378e492e9fcab6ac728eb040 exact cleanup COMPLETE, database retained.
Private Maven logb2ebbcd87c3a19a6be0f07162a661d8f7915fb108280bd72a353cd67059d42a3.
Actual cached-input and source pre/post hash guards PASS. Raw host logs remain privately retained,
not independently inspectable through GitHub; these hashes do not substitute for such access.

Next execution uses the same admitted five offline direct goals and exact test DB, not public:

- `run-regression-green-01/source`: F05GrantMigrationTest, expected1/1. Fresh marked schema
  initially migrates V1–V8; synthetic legacy Grant survives additive V9, missing historical scope
  stays absent. V9 apply1/repeat0, nine history checksums/validate/pending0, migrator ownership,
  actual app DDL/scope mutation refusal and immutable legacy claims/status-only transition.
- `run-regression-green-02/source`: IdentityFlowTest20 + HttpSessionFlowTest83 + ServerSmokeTest2,
  expected105/105. Existing service/real-HTTP tests unchanged in behavior; each regression gets
  a fresh source-marked f05 UUID schema in the same approved database. Private role inputs remain
  inside the forked JVM, never Maven properties/environment. Stop Server before guarded exact
  schema cleanup. Source-owned remainder must be zero; database remains retained.
- Final Grant qualification `run-regression-green-03/source`: CustodyBoundaryTest10, expected10/10.

This is affected regression/qualification, not a manufactured RED or fresh-public claim.
Current migration expectations move to V1–V9 without altering V1–V8 or historical execution.
No new dependency, tool, listener scope, product permission/API, tooling exception or cleanup target.
T030 stays unchecked until these executions satisfy its actual obligations. T028 Receipt/custody
obligations remain open; later execution must respect its own applicable input-use authority.
