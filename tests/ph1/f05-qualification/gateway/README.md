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
