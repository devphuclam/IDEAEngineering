# F05-B actual client/transfer qualification

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-PH1-F05B-TRANSFER-RESULTS / verification record /0.2 |
| Status / disposition | In progress; positive actual two-fixture end-to-end PASS (§3); refusal/resume/renewal qualification remains open |
| Owner / author / authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm /Codex CODEX_ONLY /continuous T028–T034 sprint authorization |
| Baseline / date | Issue37/PR38, frozen T027 v1 envelope/profile;2026-10-05 Asia/Ho_Chi_Minh |
| Normativity / retention | INFORMATIVE, no new product obligation; INTERNAL, preserve execution lineage |
| Upstream | [Sprint](../../../docs/research/2026-10-05-f05-execution-sprint.md), [Node admission](../../../docs/research/2026-10-05-node24190-project-admission.md), T033/T034 |
| Review / limitation | External review pending; local preparation tests are not network transfer, Server or custody acceptance |

## 1. Client preparation — executed RED/GREEN

Published commands/oracles: `tests/ph1/transfer-smoke/README.md`.
Windows x64 admitted Node24.19.0, binary SHA-256
3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237.
No npm/dependency/download/install, listener, system trust, database or preview change.
Tests create fresh OS-temp synthetic fixture directories and remove only those exact
fixtures in `finally`. Source is committed/pushed before every execution.

| Exact executed source | Actual result |
|---|---|
| 261ef9f68f0bed3ac0cb77707b82308860b90bc8 | RED1/1: CLIENT_RANGE_READER_NOT_IMPLEMENTED; tool available |
| 0e68ae98fb87a41be5d4e9e65d0862cbca7eedb6 | GREEN1/1: one1KiB half-open range, byte equality and known SHA-256 |
| f6d05b046be6b51a6d91bc1169f06ee43df857ee | PASS2/2: existing reader qualified additionally on64MiB,64 contiguous1MiB ranges |
| 6df8ffbd1d92b03723a63a6efbabf83b0fa86269 | RED:2 PASS/1 FAIL, CLIENT_PROGRESS_NOT_IMPLEMENTED |
| 044f896109ac464cb6c86711af899e2c85f35132 | GREEN3/3,0 failures/skips: zero Receipt remains progress; malformed/trailing/oversized/impossible progress refuses |
| 9c655360ea3967e59d22b16626c1923f3ae248f3 | PASS4/4,0 failures/skips: existing P05 generator on admitted Node, both literal governing size/full-digest manifests match through client ranges |

Final executed raw source hashes, unchanged before/after run:

- client-transfer.mjs: e939a26b02ad5913601c0d6e31dc19f6c1bf9cb0a4e0f20723807adbac299460
- client-transfer.test.mjs at044f896:919f259067cac30ffb6562c1081c40fa1452dc1fb90de8df175718e1cbb610fc
- successor client-transfer.test.mjs at9c65536:96a986768eceae9231982e3e42e76a59bd9f624389a9854d625d04903b05fca6
- actual executed P05 generator raw input:ba4918c8d5041d5262588900721bb968f22d294ae63638606b722cbb5b682a26
- admitted executable unchanged before/after; version v24.19.0.

First reader RED source hashd8098ccb1df0a653841d64e44fe17671901c4418d9fa1aec357970718d5c81b5;
initial test hash9b4ecd112cc2eb515b27849292d9d3518afe8d4162439b6fbd18fbf70a1d5244.
Reader GREEN source hashdf78d692c89eb76375f45a7f093747d4e3c3ac1da53da2665e0348e1ca873502.
Response RED source hashab6111c0eafadf40623b2a134ac00e2f823ca47068a23aa13694bfd9da792b4e.
Safe test output retained in this task's command outputs; no independent raw-file
log hash is invented. No credential, cookie, CSRF, Grant or Receipt was captured.

The original64MiB test uses synthetic zero bytes solely for range preparation.
The9c65536 successor additionally generates and reads the exact governing P05
fixtures:1KiB c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384;
64MiB04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae.
This reuses existing first-party generator code unchanged, not the historical
server Node runtime. Both source/raw generator hashes were unchanged before/after.
The actual executed raw generator hash above is not the historical P05 LF source
hash; retained historical evidence is not rewritten. Neither test is a network
transfer or establishes throughput.
Opaque Receipt handling is not signature acceptance; Server remains authoritative.

## 2. Remaining actual qualification

T033/T034 remain unchecked: ordinary Server HTTP session/CSRF control, direct
actual HTTPS Gateway bytes, actual FilesystemVaultAdapter, signed Gateway Receipt,
Server current IAM/controlled-allocation acceptance and committed metadata,
1KiB/64MiB manifest comparisons and affected refusal/retry/renewal/interruption
matrix. Real transfer remains NOT-RUN in this record, not inferred from local4/4.

SSH read-only preflight succeeded; retained qualified Gateway package is present.
Node is not a blocker. No new rights exception is required for unchanged admitted
Node use. PR38 stays Draft/Open; no merge/verifier/timer/Tracker action.

## 3. Positive actual end-to-end successor — PASS

Section2 preserves the earlier preparation checkpoint, not this successor result.
Exact executed source **4b12b10dec1dc4e7f6ed2bf14ca7d4fcebe75d66**; fresh owned
/home/phuclam/idea-f05a-t028-t030-20261005-37/run-receipt-green-29/source.
Raw input101/101 locally/remotely PASS, byte-preserving archive identity
d46e9abaecf6c2755d0fad29a8a14948b276dd77ad2aea1f773ba24d9e144321;
manifest8256f0d197dd5d846178521258da3e86e51789559caf192110a318633f6073f2.
Recipe: published README, run-slice.sh source/manifest receipt-green-29 1;
admitted Windows Node runs raw-export client-e2e.mjs after safe READY marker.
Node24.19.0 binary unchanged before/after, SHA-2563602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237.
JDK25.0.4.1+1/Maven3.9.16/psql pins,456 inventory rows,52 core pins and695
actual selected input-path observations PASS; controlled inputs unchanged.

Actual HTTPS Server127.0.0.1:18446 and Gateway127.0.0.1:18447 through owned
Windows loopback SSH forwards. Ordinary Server session/CSRF establishes Actor;
manually registered test-only bridge invokes actual Grant/Receipt services.
No supported product controller/Permission or client-authoritative Actor introduced.
Allocation oracle independently reads the exact owned Gateway allocation binding:
same-host test-controlled allocation, NOT a qualified distributed production
allocation-discovery protocol or Server Vault-access API. Mandatory owner callbacks
are bounded to the synthetic Actor/Organization/scope, never permissive defaults.
Direct Client→Gateway bytes; Server sees control metadata/Receipt only.
Normal dedicated test-CA and endpoint verification; no TLS bypass/trust-store change.
No global-store snapshot is invented. Gateway executable reused unchanged:
c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1.

Fresh TLS freeze: certificate PEMf9b93cffb51dba238e402ea6ce0ca5bc9a50f91c53c3f8e9880bff65c35526c2;
keystore47bd3c1f75c5d378526f3cad57e11de40625e3e439991d7b532ac04eba83a4a9;
subject CN=IDEA F05 synthetic client test, SAN IP127.0.0.1, serialc1e2a3e279092d81;
valid2026-10-05T10:03:26Z→2026-10-07T10:03:26Z. Private key/password never public.

Both governing P05 fixtures genuinely transferred with literal size/fullSHA:
1KiB c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384;
64MiB04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae,
64 contiguous1MiB requests. Actual Gateway status resolves identical signed Receipt;
Server verifies/accepts each twice into the same TransferId. Independent JUnit PG
oracle verifies Artifact size/digest, Location VERIFIED, Transfer CONSUMED, exactly
one receipt-accept Audit and actual Adapter file size/fullSHA. Login/session200,
logout204, subsequent session401. Node CLIENT_E2E=PASS and Server
F05_ACTUAL_CLIENT_CUSTODY=PASS; JUnit1/1,0 failure/error/skip, BUILD SUCCESS.
No custody success inferred from client preparation/progress/candidate alone.

Approved retained DB idea_ddm_f05a_20261005_t028; fresh source-marked schema
f05_87f0136b03d348ee835cf65072d1abb5 exact owner/marker cleanup COMPLETE, remainder0.
Owned Server/Gateway terminated before cleanup; Windows forward listeners absent
afterward. Only fresh readiness credential handoff and temporary P05 fixtures
removed; retained private candidates/logs/roots and DB preserved. No public
migration/preview/company/Vault change, dependency/download, verifier or timer action.
Raw Maven log4c12a49a730ab602a04d1f09054a03b0518c0a0dfe211ac1d2f1bed1e717e644;
preflight4a556f6000db09663952e92835c90197d593a807798517ee1d9b16db1a88e0fb;
postflight0e773830fc726e0980c57d4429a3353bc91d3bb91e753209e0fa84f007a7170c.
Hashes identify private retained logs; independent GitHub raw-log access remains limited.

## 4. Preserved failed attempts and prospective repairs

Fresh attempts20–28 remain overall FAIL, not rewritten by §3. All are retained
under the same controlled parent as run-receipt-green-NN; each exact marked schema
was cleaned only after owned JVM exit, DB retained, remainder0.

| Attempt / exact source | Failure / private Maven log SHA-256 |
|---|---|
|20 /7d67a6f1981a96e9859187fd9bf555217f607ed5|IPv4-mapped Server listener failed exact binding oracle; client NOT-RUN /54960bc7fcd2f322711cb016524dcb86b88607653f0a550be2f99c69bbf2a29c|
|21 /4188c3a1f19ad8f92a1ee9c3bd8b13df93ed8281|Client failed; targeted1KiB diagnostic was not whole-flow PASS /5d6b1b9c1d3ebe49ad7219c2a60b3db1c08f6a1116af48227e8950110b735d15|
|22 /a9f54128b7115b730534bbf717ca57b106c98aff|TLS readiness /0f747a0f1fbcce3e3541b63c476d5bfe81ff3334bb4a8f797b215e207c9e8322|
|23 /3f6279af29424a9716821e803d293c7257904d95|TLS readiness /913d269d57bc99a98ca2e20edc0760e8149d6c81161069d4ed6460d6f1982588|
|24 /75a119f3eb5298c687abe55d44c22251a30dc67a|CERT_NOT_YET_VALID, observed Windows81s behind Ubuntu /ca37ae7fc333d9cdb39075007d6f692c27d9f28a4d1383cebbbbe9ba612a9289|
|25 /b0317374533589119f9bbffd13395bfea42f3e82|Both transfers/Receipt retries succeeded, logout parser refused; final independent oracle NOT-RUN /410f9bc431271a9d351b99935b0d760babada39d80d061ac818843e26a71c646|
|26 /1234ae57586f84e277c3b21ca654f6b97ec0e4cd|Same logout boundary /5ce2929e7d6b9014f9aa16ae8591717bd285b72d75c4cc0856b2a5ffda6971f3|
|27 /86ffe57953e25374bd1b0b024e52c9849276ef9e|Same logout boundary /09e04613ba59366cbadbb9b1a5203c47c7f32887c781509a011670d662c84563|
|28 /ccba9bad637d8b83828e86ccd15a3699f92fdb59|Safe flags1_1_1_0_1_1_0_0_1 identified Expires-only deletion /8698e64621e9a4c188f49a189fd659232d4dad9ddf5f5e6c97303883154392a5|

Repairs were published prospectively: exact IPv4 JVM flag; client-failed marker;
safe stage/attribute flags without headers/proofs; fresh certificate NotBefore
host-local now minus5min (no TLS bypass, OS-clock change or Grant validity grace).
Cached Tomcat11.0.24 bytecode confirms MaxAge0 emits ancient Expires without
Max-Age. Exact empty, already-known host-only Secure Path=/ deletion accepted;
new positive proof still requires Secure/HttpOnly/SameSiteStrict.
Quoted-empty guard RED531a190:4 PASS/1 FAIL, GREEN3c9ecaa:5/5;
Expires-only REDbc98ca0:5 PASS/1 FAIL, GREEN1ac6997:6/6.
All failures are first-party harness defects, not legal/tool/dependency failure.
Attempt21 required exact owned-PID termination; later failure-marker cleanup is
automatic. Historical directories/logs/candidates preserved, no broad deletion.

T033/T034 and whole F05 remain incomplete pending actual negative/resume/renewal
matrix and affected reconciliation. No throughput, HA/recovery, commercial,
Desktop/Workspace or product UI claim. PR38 Draft/Open, no merge.

## 5. Actual interrupted transfer / refusal / retry successor

RED source7d9c1e142a2642bf14b830e98a4e984382c8c4a1, fresh receipt-red-30:
actual Gateway retained verified1MiB after partial second-range disconnect, no
Receipt. Client attempted offset0 rather than missing offset1048576 and failed
the independent actual-request oracle. JUnit1 failure, schema
f05_4c78968a412a46bfbece1605f25e4bc9 cleanup after JVM exit, database retained;
private logbf37d9fe908b2fff1622db339007aa3c26c5481d42e4356c085fc4ff746b0028.
Source archivef010489b53457bbb94a0e3ac88ab1f7740b52e446ad0a80612a7d26d231af445,
manifeste5774e30a43194da26bf91ed266ec18fd55c905a9e4f8db47d3d5f355e1724fd.
Observed file-handle GC warning was also corrected prospectively in test fixture.

GREEN exact sourcef6f75b319598999d15b1e0f4b7e168fbbc44100c, fresh receipt-green-31.
Raw101/101 local/remote PASS, archived937729277c97c1feb1d98c674004387c044831bc2bac3b3a998e2a5a6bbdc7e6,
manifestaef70a85ffa55d28c313225dd6eb32fc9e4a38c10919bbb8cfc99d6fa9022718.
Same unchanged admitted tools/Gateway/graph and controlled TLS/test-only bridge.
Actual status-first client sent only63 missing ranges for64MiB, no retransmitted
verified prefix; actual adapter/custody oracle still matched both P05 manifests.
Missing CSRF403; changed signed Grant403 with empty body; wrong chunk digest400
and status0/no Receipt; completed changed bytes400; unchanged range retry yields
same Receipt; modified Receipt refuses Server acceptance. Same-operation issue
resolves exact original Grant frame/TransferId; same Receipt acceptance twice
retains one receipt Audit and one custody result. Real logout204 then401.
No false custody inferred from interrupted/unverified candidates.

Node CLIENT_E2E=PASS; JUnit1/1,0 failure/error/skip, independent
F05_ACTUAL_CLIENT_CUSTODY=PASS. Source/tool/inventory/actual observations postflight
PASS; schemaf05_9fc4f730915e44098a7319bec12fc2de exact cleanup/remainder0,
owned listeners stopped and DB retained. Private log
38e6f6e9eee863047feee1d54ad2aa0b1b783f0caef8997a2bd99e23917e86a1;
preflight4a556f6000db09663952e92835c90197d593a807798517ee1d9b16db1a88e0fb;
postflight0e773830fc726e0980c57d4429a3353bc91d3bb91e753209e0fa84f007a7170c.
Exact expiry/renewal successor and final affected reconciliation remain open.
