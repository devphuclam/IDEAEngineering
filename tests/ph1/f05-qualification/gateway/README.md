# T029/T031 actual FilesystemVaultAdapter tracer packet

Authority: IE-RES-T029-T034-PROCESS-EXCEPTION-20261005, approved continuous sprint, frozen
T027 filesystem/profile. Real product Adapter, JDK-only public boundary test, not a Boot
architecture substitution. No Maven/JAR/provider/Node/DB/TLS/listener/preview execution here.
Exactly two java/javac pins in run-adapter.sh; no third-party code/package copied or installed.

First RED: adapter-red-01 under /home/phuclam/idea-f05-sprint-20261005-37, fresh source/classes/
vault-test. Test1 stores known1024 zero bytes (independent literal SHA-256), resolves exact
TransferId/LocationId and reads identical bytes. Skeleton must reach ADAPTER_NOT_IMPLEMENTED,
not a tool/compilation/hash failure. GREEN adapter-green-01 only after that genuine RED.
Completed bytes are private until Server custody acceptance; this test does not claim Receipt.

Before execution commit/push source+manifest, byte-preserving Git export; verify every raw
manifest entry locally and remotely, archive SHA-256 identical after transfer. Runner:
`bash source/tests/ph1/f05-qualification/gateway/run-adapter.sh <source> <manifest> <stage>`.
Published runner compiles only actual Adapter and boundary test, then invokes its Java main.
Fresh owned canonical root, no symlink/reuse. Retain private result/byte fixtures, source hashes,
tool pre/post hashes; no automatic cleanup of a real Vault. Ordinary defects repaired in fresh
attempts, missing/drifting tool/input/rights/unsafe target STOP. No merge/verifier/progress action.

Prospective setup retry: adapter-red-01 source032919e was published/raw4/4 local PASS, but
PowerShell expanded a remote realpath substitution before SSH; empty owned remote directory
may exist. No transfer/Java/Adapter execution followed. Retain it. Fresh adapter-red-03 uses
the same test/oracle, command passed literally to SSH. Local adapter-red-02 export-only diagnostic
also retains identical raw inputs; no remote execution. These are setup defects, not behavioral RED.

Behavioral RED at84954404c7cc512d1c95ddf252c159a637925ee6 reached ADAPTER_NOT_IMPLEMENTED
after raw4/4 local/remote PASS and successful javac. Private log SHA-256
04b8d157860c4009fb1efa9dd2495a92085539c4b8c8fb44b3a30af2edf0ef50.
Archivead6a92bb733973734fb0c0580f8eec343e2182bf405e2bcc34449c8f60e05c3b.
Fresh adapter-green-01 executes the minimum streaming/size/digest/private atomic-promotion
implementation and same single completed-read tracer; no Gateway or custody PASS yet.

Minimum1/1 GREEN a66054e4303c9618e06443ebb7c735f62b338da9, private log
750513255e1bdd2202175e18db7721abf3695bc32a1047884c00d710b9579a4f; raw4/4 local/remote PASS.
Next fresh adapter-red-04 adds immutable retry: identical request returns same identity/bytes,
changed byte with same claimed digest must refuse and preserve original. Expected missing behavior
CHANGED_RETRY_FALSE_SUCCESS; prior constructor skeleton witness remains accepted by runner.

Retry RED3dfad5448645c09df1332da27a2338aa294d3247 reached CHANGED_RETRY_FALSE_SUCCESS,
private loge0c9719bc438edf265bbccdb392ad83bc496fe64dff46125b00c194d43814077.
Fresh adapter-green-02 checks supplied retry bytes against immutable size/digest even when a
completed object exists. Discard input verification output, never overwrite completed bytes.

Retry GREEN a441213ac765af9c2f6d3dbde5e76424d77a5988:2/2, private log
0e8ddffb02b89e983c164b9f9b57a5d87933590b47775e5ef90c78eccee13c18.
Fresh adapter-green-03 qualifies existing guard behavior (no manufactured RED): eight grouped
cases covering read/completion, retry/changed input, short/extra size, digest mismatch,
midstream IOException with no completion/staging residue, noncanonical root, symlinked root/
staging, invalid identity. All synthetic files/symlinks are under the exact new owned target;
symlink destination is its own outside-test sibling, not a company path. Retain privately.
No hostile same-user race, power-loss durability, full Gateway/range/Receipt qualification claim.

Guard GREEN fe4fcafd8b41e802bfb329a7b8844900915adcc7:8/8, private log
f0fb2237d8920045cd83b47d0a723ba2b9c8cbc7d93cc67e9dffdecd74088af0.
Next adapter-red-05 adds real persisted range seam: first512 bytes private/incomplete,
recreate Adapter instance, identical lost-response retry resolves512, changed bytes refuse,
final512 completes original1024/full digest. Literal chunk digest independently calculated
with workstation .NET SHA-256; not derived using Adapter code. Expected RANGE_RESUME_NOT_IMPLEMENTED.
Fresh adapter-green-04 follows minimum real contiguous chunk persistence/verification.

Range RED7093f1f0858f1f4a19c896871bfd5648588f2341 reached RANGE_RESUME_NOT_IMPLEMENTED;
private log843d1d5ef6865c7dd0ffbf30fd6388a4c167be1381282843f8293c4d123c0da5.
Range GREEN d13482741a62a4b2b9f4555f9f6f74bb59816fd4:9/9, private log
8a7046e21b54886696ffcc6f7f6376ade156aff83ef287f09e7112dfdc820f0b.
Fresh adapter-green-05 adds qualification of existing range guards: changed allocation/range,
gapped request, interrupted chunk does not advance progress and resumes, full-file digest
mismatch never completes, concurrent streaming writer rejects a second writer without removing
the first writer's lock. Bounded ten-second barriers; no fabricated RED for existing behavior.

Range guard13/13 PASS at6ebdd09bfb906ad36feff2997f37d2286bd8527a, private log
2b99329d67ab6cf0ab38e7c19748ecabb92ad3630ef81050ee53e273dd91b8a2.
Next gateway-red-01 uses independent DataOutputStream Server-wire signer in the actual Gateway
test and product verifier entrypoint. Exact22 fields must survive verification unchanged;
expected GRANT_VERIFIER_NOT_IMPLEMENTED. Qualified first-party T027 codec is promoted without
new external dependency. run-gateway.sh uses only pinned JDK/java/javac, no listener or Maven.
Same raw manifest/archive/source publication procedure, private synthetic owned fixture root.

gateway-red-01 at1de598e281b38d28ce7b07aa654545ff4440edc0 passed raw8/8 but runner compiled
the Adapter class list rather than GatewayTransferTest, so main was not found. Not behavioral RED.
Preserve attempt; gateway-red-02 only repairs the explicit javac inputs and repeats the same oracle.

Verifier REDa4ee40d72d4014a66e622cf019f427e683ccedd9, logc9b40f30be43574390e7578000a47f9c132bb43f4ff938a87d1a3e4a3785ff5c.
Verifier GREENcd93addab1043270c537bc9a5ef003449233c184:1/1, logfa637bb87d01f40e7c634cca928e3599b3e30ae12c0952c7d579138439ea9440.
Next gateway-red-03 connects verified independent Server Grant to actual Adapter completion and
Gateway-owned Receipt signer. Independently parse exact25 fields and verify Ed25519 signature;
no producer-derived expected correlation/allocation. Expected RECEIPT_SIGNER_NOT_IMPLEMENTED.

Receipt REDfc5fa343a03d6362689f8a0404b8639fc000a786, log5f0b7586e96d2efb8bf9ccd50115db7c7feaaa880e99d811b85000dce04a9566.
Receipt GREEN5580c4d722f07ac435dd59a28ab4159ceb1357e3:2/2, log5b459c11cf78499748ab1208e64cae0a66ebc7e9035e3fc5ea040bbfe9d407f7.
gateway-green-03 qualifies existing refusal boundaries: signature/key/pins/Gateway/endpoint,
unauthorized ranges, before/at/after expiry, trailing/oversized frames, partial completion and
expiry before Receipt issuance. No manufactured RED, Boot/listener/Server custody claim.

Gateway negative19/19 PASS35997c47dd25eb0fe35a161c8168d83040598d6e, private log
e89e6a39ebbfb003d083b1894686dfa550b7dadb60cf89b287379af908b9a666.
adapter-red-06 adds independent query of persisted verified512 bytes after Adapter recreation,
without resubmitting bytes. Expected PROGRESS_QUERY_NOT_IMPLEMENTED. Needed by Gateway same-ID
status after uncertain response; no new operation identity or fake completed Receipt.

Progress RED38845b377b9300071bd7e33b6aec148f76b02ffb, private log690b242959b5bdb2ba416b92de889d161b3569ad4461a87c9a400c6466c0b879.
Progress GREEN4c99089189ccd18448e94ef55675c29821b5e897:13/13, log2b99329d67ab6cf0ab38e7c19748ecabb92ad3630ef81050ee53e273dd91b8a2.
gateway-red-04 enters the actual GatewayTransferService through a signed Grant, writes real bytes,
requires signed completion and recreates service to query the exact original Receipt after lost
response. State root is private gateway-state sibling inside owned attempt. Prior lower-level
fixtures have distinct candidate TransferId to avoid ambiguous completed allocation reuse.
Expected GATEWAY_SERVICE_NOT_IMPLEMENTED, no Boot/HTTP/server custody inference.

Service RED771bb9741b5ca95940667a64ac7e5275730de127, log3aa33b31d9f4d694b60b44c9d9951ccce458d74139a1c04e6aadf5f5326f0a48.
Service GREEN77ceffc6eeaf15ba5adc5b244adb8c7ebd04ae9c:20/20, log1ddd5e1bd67a6ef113be9a291432359ada464b78de9f650839dea311b9b07364.
GREEN fixture explicitly separated its service candidate from the earlier raw Adapter candidate;
the RED documentation intended that isolation but source did not yet perform it. No test oracle
or product authority changed. Fresh gateway-green-05 qualifies existing retry/changed bytes,
signed retarget refusal, partial/no Receipt, exact expiry and explicit same-transfer renewal
preserving verified progress. Synthetic controlled Clock, no wall-clock waiting, listener or DB.

Service guard25/25 PASS0c7f0b42142f826c5fa741d0bea54e766d0b225a, private log
38cc2c79e98da3c53698487e61a6d3f66af438c461ed78eba49d89f317118ca3.
Next packaging boundary gateway-boot-01/source uses GatewayBuild.java and run-build.sh.
Actual selected set is unchanged root05:115 rows/99 artifact JARs/242 models/four realms,
52 Maven core JARs and exact toolchain.tsv. Copies only hash-matching admitted cache into
fresh isolated run/repository, never resolves/downloads. POM changes only first-party coordinates
and mainClass; webmvc/log4j2/exclusions/includeTools and all plugin/dependency versions unchanged.
Exact graph: inventories/f05a-q02-jsr305-exclusion-proposed-graph.tsv; hash/pin/model/core/legal
inventories shipped as raw input-manifest entries, no new external source. preserveLegal retains
actual embedded notices, custom/mixed terms, Maven notices and embedded Boot loader legal bytes.
Offline direct resources3.5.0/compile3.15.0/jar3.5.1/Boot4.1.1:repackage only. Package requires
Java25 GatewayApplication, Boot loader manifest/classes exact hash and exact32 nested runtime
JAR/hash projection, no JSR305 or build tool payload; actual acquisition/realm sets unchanged.
No listener/TLS/DB is started by build. Any graph/hash/rights drift STOP; ordinary first-party
compiler/oracle failure retained and repaired under sprint authority. HTTP is still NOT-RUN.

Actual packaging3b14cddd6d6d8cb998366aaa1ddc714ad7720cda PASS; JARf1ee1c9bf00821b71781662ffa05357e93066192701ba2df4affee3c681b5bb5.
Fullraw22/22,115/99/242 acquisition/four realms/package32 projection/no JSR305/postflight PASS.
Next fresh gateway-boot-02/source builds the same product skeleton plus HTTP RED test. Reuse
only admitted99/242 artifacts and exact tools, not an old application JAR. GatewayTlsMaterial
generates fresh private two-day test TLS using keytool, exact SAN IP127.0.0.1, dedicated positive/
negative truststores. No system/user/global trust changes. Freeze cert/keystore/truststore hashes
before starting exactly one owned127.0.0.1:18447 Boot HTTPS process; refuse occupied/wildcard.
GatewayHttpQualification creates fresh in-RAM Server signer, Gateway signer with only its private
key in mode600 Gateway configuration; Gateway receives only Server public key. No DB/session
or company key. Commands run-build.sh source manifest gateway-boot-02, then run-http.sh source red.
HTTP seam POST/transfer/range: X-IDEA-Grant base64url<=4096 decoded bytes, half-open integer
X-IDEA-Range-Start/End, lowerhex X-IDEA-Chunk-SHA256, raw body<=1MiB. Response exact big-endian
i64 verified byte count/u32 Receipt length/Receipt bytes, no Receipt before full verification.
Control lookup POST/transfer/status carries same Grant, no bytes. Current RED expects missing
501 marker only after trusted TLS and exact loopback binding; not missing cert/tool failure.
Finally terminate owned JVM, prove zero listener, rehash source/tools/TLS and unchanged system
trust even when behavioral RED. Internal Gateway control contract, no Server route/RBAC change.

gateway-boot-02 source27cb904ee1bd8023f7922e27f46f2d195950f046 local25/25 exported,
but publication polling yielded before local export metadata was read; no remote transfer/build/
TLS/listener ran. Before execution review caught literal backslash-n source-prefix defect in
TLS helper. Repair published prospectively and fresh gateway-boot-03 uses the same packet/oracles,
not normalized input, changed graph or reused source/target. Keep local02 export unchanged.

Actual HTTP RED847c8e2d36ab7f99f6f52ba18aa7f033bd747765: trusted TLS/exact loopback PASS,
501 GATEWAY_HTTP_NOT_IMPLEMENTED after POST real1024-byte request. Private result log
1898275d7e618f2dd2b1004a33162f2a7e5a37fe45aab6cc2d2cc2eecf9b16ed;
cleanup84fcb7658428001336afda8960d9e45a594c79e58599974b3fb3e5e75c920b30,
owned process stopped/no listener/source tools TLS system trust unchanged. Fresh gateway-boot-04
rebuilds minimum GREEN handler/service with same offline graph and new private harness TLS/keys.
Commands run-build.sh source manifest gateway-boot-04 then run-http.sh source green. No DB or
preview. Timers/full negatives and Server Receipt custody are not inferred from this tracer.

Fresh gateway-boot-05 adds actual TLS socket inactivity qualification: send one byte of a
declared 1024-byte range then stall. Server must issue 408 after 30 seconds (28–35 seconds
wall-clock observation tolerance), with no verified progress/Receipt. Client read timeout
35 seconds is the genuine RED witness, not a TLS bypass or accelerated policy claim.
Commands run-build.sh source manifest gateway-boot-05 then run-http.sh source red.
Same admitted offline graph/no DB, private fresh TLS/key fixtures, exact single
loopback listener and owned JVM cleanup. Preserve boot04 package/tracer evidence unchanged.

Inactivity RED at678fd77f355b7ebed9a925252add9310a3b1315f: actual TLS request had no
Server refusal after35075ms, private log3aa6871cf41f758a386877ca8e6318d5b5e5af5816595fd1f5fa657aea7237f1.
Owned process stopped/zero listener/source/tool/TLS/trust unchanged. Fresh gateway-boot-06
configures qualified Tomcat upload socket inactivity30000ms, maps timeout to bounded empty408,
and reruns the same genuine network oracle. This is inactivity only, not the60s absolute
range/control elapsed-time requirement. Commands run-build.sh source manifest gateway-boot-06,
then run-http.sh source green. No new dependencies, TLS bypass, DB or preview changes.

Fresh gateway-boot-07 adds the absolute range deadline oracle: authenticated signed synthetic
Grant, normal verified TLS, one byte every five seconds (below inactivity limit), declared1024
bytes. Server must return empty408 at60s (58–65s observation tolerance), with no verified
progress/Receipt.65s client read timeout is RED, never PASS. Sender is owned and terminated.
Existing positive/inactivity cases run first; same admitted offline graph, fresh private TLS,
single loopback18447 and exact cleanup/postflight. Commands run-build.sh source manifest
gateway-boot-07 then run-http.sh source red. No accelerated Clock for real socket deadline.

Actual absolute RED6094338e19ffe5e8b100314e4c3ff327d6494d43: inactivity PASS30077ms,
but trickle request still lacked refusal65018ms; private log9758f50212716e1cf95ea4c842164f5cb78125ab7478eac3cdd8650c6650df37.
Owned process stopped/zero listeners/source/tools/TLS/trust unchanged. Fresh gateway-boot-08
uses Servlet non-blocking reads, at most1MiB RAM per range, independent non-renewing absolute
60s range/30s control and30s inactivity deadlines. Partial bodies never reach the Adapter.
No new dependency, route, signature, authority or graph; same real positive/inactivity/absolute
oracle. Commands run-build.sh source manifest gateway-boot-08 then run-http.sh source green.

Actual deadline GREEN0aefb56f4f87b337ce4cc614f51b5f96ac2e86c9: normal trustedTLSv1.3 /
TLS_AES_256_GCM_SHA384,1024-byte completed Receipt, inactivity40830044ms,
absolute trickle40860041ms, zero partial verified progress/Receipt. Private result
b8ef3972b08c3908c215f3e7c95faa9c40e0fa2e435726ba0a12234009491d8a;
cleanup84fcb7658428001336afda8960d9e45a594c79e58599974b3fb3e5e75c920b30.
Owned JVM stopped/zero listener; controlled inputs/tool/TLS/global trust unchanged.
Exact package c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1,
collection38/payload32, actual115/99 graph/four realms and noJSR305 PASS. Control30s is
implemented but not independently wall-clock qualified by this range-only test.
