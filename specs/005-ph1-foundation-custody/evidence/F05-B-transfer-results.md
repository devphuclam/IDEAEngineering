# F05-B actual client/transfer qualification

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-PH1-F05B-TRANSFER-RESULTS / verification record /0.3 |
| Status / disposition | Engineering transfer qualification PASS (§9); final focused hygiene/regression PASS (§10); external whole-F05 review/acceptance pending |
| Owner / author / authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm /Codex CODEX_ONLY /continuous T028–T034 sprint authorization |
| Baseline / date | Issue37/PR38, frozen T027 v1 envelope/profile; execution lineage2026-10-05, current publication2026-10-06 Asia/Ho_Chi_Minh |
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

## 6. Explicit renewal and canonical completed-operation repair

This successor closes the earlier pending expiry/renewal matrix, not by rewriting
§2/§4/§5. All packets used the same admitted Node/JDK/Maven/cache, unchanged
Gateway JAR, dedicated TLS and approved database with fresh owned UUID schemas.
Raw inputs101/101 passed before transfer and after extraction; archives matched.

| Packet / exact executed source | Actual outcome | Private Maven log SHA-256 |
|---|---|---|
| receipt-green-32 /8baa0140c13c37415add0075a82f0f2dd9be967c |1/1 + Node PASS; actual expired Grant403, explicit eligible renewal retains OperationId/TransferId/scope with new GrantId, old Grant still403; both fixture/custody/resume/refusal matrices PASS |896f61cabe87199ae409cf037cd521fefd301b573cf921411bc6c55ad4e65916|
| receipt-red-33 /0ce01b52b2d5d65ff73ad808d8deff8c3a49295c |Genuine RED after first custody: COMPLETED_OPERATION_RETRY_1024; Server lookup filtered out CONSUMED Grant |19e3dad4e6959b11d8823a58a5834c2b4bdc18fdceaa6dc57adcace141f9e9c1|
| receipt-green-34 /8d6c26d3872630130cb4a7d5dd333f5676c77b2e |1/1 + Node PASS; canonical issue retry after custody returns original signed Grant/Transfer rather than inserting again; full matrix remains PASS |9e7e7b3317a210d1569a8a2a59c8411f70768cc725d7c6349d419decd60e0175|

Production repair commit363f6d3 expands exact Grant lookup from ISSUED to
ISSUED/CONSUMED; it does not reactivate consumed state or bypass current Actor,
Organization, owner/allocation, immutable scope or expiry checks. Renewal remains
ISSUED-only. This is not an indefinitely valid post-expiry issue API claim.

| Packet | Archive SHA-256 | Input manifest SHA-256 | Cleaned exact schema |
|---|---|---|---|
|32|a3cf0d55171785bfe2665e0c316d52afdbc633398a5d335440be90990fa20c16|90f787d168337f0c3a6ae6910a6af4f7b2d78ed10bdd3585986359510f797873|f05_e5da270c06a34453a77b47bcae6a6a55|
|33|4d49f12a547201db0294c833713009efb8e0d929cd8e70d1254499a9c1c93cb1|a51541b355c3e3c21b0c35356d514201f256b7a8d5c84b62e42dec31a1b0d4be|f05_b77583021ccf40798e512304c9b1525b|
|34|a0915c96b7f058b306b82c7370354bf4242eff3c838c250702756aaf239b27af|368496cbf3afd9daad085d607d9e632bf8f2c2dae26ed3db4da9f9d45674d762|f05_1c554723932043ebb3acd055fa7b7303|

## 7. Affected regression after canonical-result repair

Separate execution receipts, not one aggregated run:

| Packet / exact source | Actual result | Private Maven log SHA-256 |
|---|---|---|
|regression-green-11 /8d6c26d3872630130cb4a7d5dd333f5676c77b2e|Grant10/10,0 failure/error/skip|753a9125e5bedae40ddf3766ae31019a54efee90cf293ead6b8519f6292f1029|
|receipt-green-35 /8d6c26d3872630130cb4a7d5dd333f5676c77b2e|Receipt6/6,0 failure/error/skip|b661271f7691b0f35794c1f093f6547a66e13d3cd014377e084bde1f5dff808c|
|regression-green-12 /804335807c33a42e46ffd9dd374ca7e7e87a9113|IAM/HTTP/health105/105 =83 HTTP+20 identity+2 health,0 failure/error/skip|af5decbd8a59c58ae6a64fc937368fc68e0b5ed32dff98222c27ccbff0c19381|

34→8043358 only runner/recipe/manifest changes; application/tests/migrations
unchanged. Local client preparation/parser guards6/6 on8043358; admitted Node
binary unchanged. Regression12 archive7c74bbcd52203670d2c8907cd722c343db273d9700fb4f0da7a9f279632672d3,
manifest85caae479a9a8e8e70b86b862129c76bd05084d2686ec09655381fa4a54fe3f0.
103 individually marked IAM schemas cleaned; runner preallocated
f05_ef5df2784f2342248438596f024b9a12 was not created, so no cleanup adopted for it.
Source-owned remainder0. Grant11 schemaf05_e379296e0c014c7284128ddc4b16372b;
Receipt35 schemaf05_32e481e8312f424cb61f344b2e006370; both cleaned after JVM exit.
An attempted reuse of historical regression09 target stopped before copying/build;
that directory/evidence remained unchanged. Fresh12 was published prospectively.

## 8. Actual control deadline and lost upload response qualification

| Packet / exact source | Actual result | Private Maven log SHA-256 |
|---|---|---|
|receipt-green-37 /8bc6c07058f97151024f57b5a1c76e3b67f8268a|1/1 + Node PASS; real HTTPS control body withheld, empty408 within28–40s (30s profile), then complete two-fixture matrix|17c417c037bd9d639af5d0f9cdf0e7ee1c36f1186acd585e6d8beec3091a4fa5|
|receipt-green-38 /8a8ea3a5c3cae2d9348c9ccf44c59637109cfc32|1/1 + Node PASS; actual1KiB completion response body dropped at headers, status resolves canonical Receipt, zero additional range POST; all37 cases plus independent custody PASS|d8c7de44bc6e554f80663d1ad832f012aba49ab17cc2c44ee08b431de4dbbefd|

No production timer change or accelerated host clock. Source37/38 only add test
qualification/recipe/manifest, not Gateway/Server behavior. Lost body is an actual
HTTPS socket close, not a mocked response; custody is independently observed only
after Server Receipt acceptance. Both fixture manifests in §1/§3 still match real
Adapter files and authoritative Artifact/Location/Transfer.64MiB resumes63 missing
1MiB ranges after partial second-range interruption; no false complete Receipt
from the unverified fragment. No throughput or network-latency target is claimed.

37 archive32676b8c59c0483a186f7d79d5058f78aadbaf2d88f7a2b077bedc762c352332,
manifesta8da4cd1e8ba25d6ff555c9f88ee2ec84d7f8d88b5aa94fafa13224fd5652815,
schemaf05_df5f9ed9995b4b608d48904e8b6c5b0b.
38 archive35112cf7395e20f74ef97f145be07281462a15354021d9372c566a11e8d8eae5,
manifestc6f1ec463ed663c393d8f644f6885e1146ffafd3707b22809629396c339ea94b,
schemaf05_8a4787428ac449a4a7d5eea64b175dc0.
Both exact schemas cleaned, source-owned remainder0; retained database unchanged,
owned Server/Gateway JVMs stopped and18446/18447 have no listener after execution.

For32–38 preflight hash4a556f6000db09663952e92835c90197d593a807798517ee1d9b16db1a88e0fb;
postflight0e773830fc726e0980c57d4429a3353bc91d3bb91e753209e0fa84f007a7170c
except regression12 postflight9afcdfe3b014753b0471c46253d7580f91aba9c3f54d7d29b1221143a1413761.
Logs under approved parent/run-<packet>; raw-log access limitation remains.
Fresh public V1–V10 NOT-RUN; these are isolated real-PostgreSQL schemas. No
Desktop/Workspace, production/HA/recovery, commercial/T036, full PH1 acceptance,
verifier, timer/Tracker publication, merge or Issue closure is inferred.

## 9. Final allocation repair and sequential exact-source qualification

Read-only final inspection found commit-time owner allocation was re-evaluated but
its adapter key was not compared with the tuple used for tentative metadata.
This was a real first-party consistency gap, not a new product policy.

| Packet / exact source | Actual result | Private Maven log SHA-256 |
|---|---|---|
|receipt-red-39 /ef678d851ebf10c04b03aa3fbdb9a5489b136ad1|7 tests,6 PASS/1 FAIL: changed owner allocation was accepted, expected IllegalStateException not thrown|a4d3b740be886c9eecd4258277caf9715bed44c0c2ff9a2741a821a6f334fbd7|
|receipt-green-40 /947c60d050e371ea1ed81969471d7368836b15fd|7/7 PASS: exact allocation equality required before commit, zero partial custody/Receipt/Audit after drift; stable same-operation retry works|294a339a6be7b5941eadd9e73b4b66120f9567de794e5aa7d878757aaf47a80f|
|receipt-green-41 /55b186541120f72ad77a5df53d69d14e0b1464dd|Behavioral1/1 + Node PASS, but runner STOP=OWNED_REGRESSION_SCHEMA_REMAINS before postflight; overall packet NOT-PASS|4c90cdc727261b6b5dd09715dca0a0c2879f56e8a66af6823dedb898c251127a|
|regression-green-13 /55b186541120f72ad77a5df53d69d14e0b1464dd|105/105 PASS,0 failure/error/skip; all103 actual IAM schema fixtures cleaned, source-owned remainder0|9caecbe1440bfab30a0f1a72d33bc9dda307a077337438b6253d42adf911f9f5|
|receipt-green-42 /e542b46184b1e2792c7d5f0fcdcf38c0d7d7cd34|Final1/1 + actual Windows Node PASS; full matrix, lost Server acceptance body and stable private-path relocation, independent custody oracle, complete source/tool postflight|44be5f51b02c07b966fc738e95d232ab57264b98650785bab5a3279ceb126fad|

Production repaira49d5fc compares the complete current Allocation record after
IAM commit coordination. No new permission, owner protocol, migration, dependency
or Gateway change.39 schemaf05_7155cd068ede49de8a322bffd0bb537e and40
schemaf05_72b87f5231e642bbaf0e6e9792f7d462 cleaned after owned JVM exit.
39 archive380b4d796d6f2e0ba8075f6142f37fe17862827776db982b045638c43f1655d6,
manifest6de1a2a873c36e98a6d49c7cda50f8269af0fa8e53aa4552d660ff866db0f38d;
40 archive891fdfb435f248204eaae663d528a68b636b7597d1e70dc8968bbac23b732ece,
manifest2e1c5fdb67ed1e79ec46b8758b6e86e7f7be22eac513824518f28f2a62b9202c.

41's residuals were concurrently active regression13 schemas with the same source
SHA, not leaked client schema: exact client schemaf05_d00952643809414080c65ce7758d9952
was already removed. Both behavior logs remain retained, but no41 postflight PASS
is invented.13 finished and cleaned its fixtures. Fresh42 then ran sequentially,
with unchanged guard semantics and source-owned remainder0.13 runner preallocated
f05_38be476aac904cfc87b57764a1cad30d was not created; no cleanup adopted for it.
41/13 archive547324c4376dac38b471eec959bc2627212b6073973b0f1bfb4846623817a301,
manifestc7c2db5ab9bb87204c4a6b78eca82a40509165f88a858cb7ab355bfbfabbf785.

Final42 archiveb2638163668c30bf9f4e76d9b44bd5f23e1937ce3d9cb2f3d950d519d54d922d,
manifest4e88f8b4ebde21a3004c3ceee9461583da5ee7325e4b0238495c46e5049a1df1.
Raw101/101 local and remote, archive transfer identity and offline input/tool/
realm postflight PASS. Exact final schemaf05_f769feed824d4dc5af0b27eaf07b04d0
cleaned after JVMs exited; source-owned remainder0, approved database retained.
No concurrent same-source test packet ran during42. Gateway package remains
c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1.

42 genuinely discards the Server Receipt-acceptance response body at HTTP headers,
after the bridge's service commit, then retries the exact Receipt/operation. It
observes the original TransferId and independent single acceptance Audit/custody,
not a fabricated rollback or new operation. Both P05 real files then move only
from this owned ROOT/vault to absent ROOT/relocated-vault after Gateway exit.
Read-only PostgreSQL queries confirm unchanged Artifact/Vault/Location identities,
VERIFIED state, and both moved files' exact byte counts/full SHA-256. This is
isolated private-path independence, not a Gateway relocation runbook, production
data migration, second-Vault or power-loss/recovery qualification.

40→42 changes only qualification test/driver/recipe/runner/manifest; production
code, migrations and dependency bytes do not change. Thus7/7 Receipt at40 and
105/105 IAM at13 apply to final production source without claiming a rerun at42.
Grant10/10 at34 remains applicable because the Receipt-only production repair
does not alter Grant source/fixture; V8→V9 and V9→V10 retained migration checks
likewise apply to unchanged SQL/migration tests. Local Node6/6 rerun on42,
admitted binary SHA unchanged. Counts are separate commands, not an invented
single129-test run.

All final Server packets use preflight4a556f6000db09663952e92835c90197d593a807798517ee1d9b16db1a88e0fb
and postflight0e773830fc726e0980c57d4429a3353bc91d3bb91e753209e0fa84f007a7170c,
except13 postflight9afcdfe3b014753b0471c46253d7580f91aba9c3f54d7d29b1221143a1413761;
41 postflight NOT-RUN. Private retained logs remain under run-<packet> in the
approved parent. Public evidence is a summary/hash record, not independent raw-log access.

The tracked-secret detector reports two credential-assignment findings in generated
TLS configuration source (TransferClientBoundaryTest/GatewayHttpQualification).
Manual source inspection finds runtime-generated/private-file-read values, not
committed credentials; detector command is NOT-PASS and is not rewritten as PASS.
No bypass/allowlist or source rename to evade detection was introduced. No credential
value, cookie, CSRF, private key, Grant or Receipt is recorded in this evidence.

Current engineering completion mapping is [F05 closure matrix](F05-closure-matrix.md).
Project Reviewer acceptance, F05 card/Issue closure and merge remain pending/separate.
Fresh public V1–V10, verifier, production/commercial/T036, Desktop/Workspace,
HA/recovery/throughput and later document workflow remain unclaimed.

## 10. Final handoff cleanup qualification and publication

Standards-axis source review identified that a failed process-shutdown assertion
could skip deletion of the private `ready.json` handoff. Repair `cd60602` changes
only the test helper: deletion runs in `finally`, preserves the primary exception
and attaches a deletion failure as suppressed. Two focused synthetic-file cases
prove successful and exceptional cleanup while preserving an unrelated sentinel.
There is no retained pre-repair RED execution for this hygiene fix; it is a
source-review repair with successor qualification, not a fabricated RED/GREEN pair.

Exact executed source: `e5428846b59c2ec79a72647f71045ecaae0f582f`.
Packet `regression-green-14`: Receipt7 + OwnedHandoffCleanup2 = **9/9 PASS**,
0 failures/errors/skips; offline BUILD SUCCESS. Production, migrations, Gateway
package and client driver are unchanged from the final actual-transfer run42.
The cleanup helper is the only changed test behavior; no transfer rerun is claimed.

- Raw102/102 local/remote and archive identity PASS.
- Archive SHA-256: `3359f71379390a592aa24e67d7a896cf2ea709703da55836d34a3e1e9504a51d`.
- Manifest SHA-256: `07742d3ad92f30ba960e1b085446d99a69ae8abe12f1c07539c9341c89875e60`.
- Exact owned schema: `f05_27b4aec930164ce4afa54882779fe9a4`; guarded cleanup after JVM exit, source-owned remainder0; approved database retained.
- Input observations:456 inventory rows,52 Maven-core rows,695 actual-used observations PASS.
- Private Maven log SHA-256: `afdf58c11ee64eeef671cd3d7a876abb59d956f2aba1fdecef835a3b34dfcac2`.
- Private postflight SHA-256: `d4b4f4a7d23c595b3e5a78ca5bba6199b6aa413ce6a15f20f043a380d49a267e`.
- Retention: `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-regression-green-14/`; raw logs remain private, hashes do not substitute for independent log access.

Publication on2026-10-06 follows interruption, not a backdated execution or a new
qualification run. Standards review's cleanup finding is repaired and qualified;
Spec-axis review identified no actionable scope/behavior finding. These are
engineering reviews, not Project Reviewer whole-card acceptance. The automated
secret-detector disposition in §9 remains NOT-PASS with manual generated-value
analysis; no detector bypass or credential literal was introduced.
