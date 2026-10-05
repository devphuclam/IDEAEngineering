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
