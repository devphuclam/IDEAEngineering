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
