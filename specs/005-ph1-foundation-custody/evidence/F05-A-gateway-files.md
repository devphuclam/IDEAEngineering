# F05-A Gateway implementation — partial executed evidence

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-F05A-GATEWAY-20261005 / verification record / 0.1 |
| Status / result | IN_PROGRESS / PARTIAL; T029/T031/T032–T034 not closed |
| Owner / author / worker | Engineering / Codex / CODEX_ONLY |
| Authority / date / timezone | Project Reviewer continuous T028–T034 sprint + successor process exception /2026-10-05 /Asia/Ho_Chi_Minh |
| Normativity / repository instruction | INFORMATIVE / NOT-APPLICABLE |
| Baseline / trace | Issue37/PR38 Draft/Open; T027 COMPLETE/PASS and T030 predecessor preserved |
| Upstream | Frozen T027 v1 profile; IE-RES-T029-T034-PROCESS-EXCEPTION-20261005; PH1 FR-008–012/014, ADR-0013 |
| Downstream / retention | Real Server Receipt acceptance and client transfer qualification; private host logs/fixtures retained, no bearer/key values here |
| Review / acceptance | Engineering execution receipts below; whole-F05 Project Reviewer acceptance pending |
| Tailoring / limits | STANDARD-GUIDED under IE-STD-AUTH-001; hashes identify private logs, not independent raw-log review |
| Trigger | Source/tool/graph/rights/scope/target drift; retain original attempts, prospective repairs only |

## Actual component and HTTP execution

| Boundary | Exact executed source | Actual result | Private result log SHA-256 |
|---|---|---|---|
| Adapter range RED | 7093f1f0858f1f4a19c896871bfd5648588f2341 | Missing persisted-range behavior, intended RED | 843d1d5ef6865c7dd0ffbf30fd6388a4c167be1381282843f8293c4d123c0da5 |
| Adapter range GREEN | d13482741a62a4b2b9f4555f9f6f74bb59816fd4 | 9 grouped cases PASS | 8a7046e21b54886696ffcc6f7f6376ade156aff83ef287f09e7112dfdc820f0b |
| Adapter guards/progress | 4c99089189ccd18448e94ef55675c29821b5e897 | 13 grouped cases PASS; query after recreation | 2b99329d67ab6cf0ab38e7c19748ecabb92ad3630ef81050ee53e273dd91b8a2 |
| Verifier RED | a4ee40d72d4014a66e622cf019f427e683ccedd9 | Missing verifier, intended RED | c9b40f30be43574390e7578000a47f9c132bb43f4ff938a87d1a3e4a3785ff5c |
| Receipt signer RED | fc5fa343a03d6362689f8a0404b8639fc000a786 | Missing Receipt signer, intended RED | 5f0b7586e96d2efb8bf9ccd50115db7c7feaaa880e99d811b85000dce04a9566 |
| Receipt signer GREEN | 5580c4d722f07ac435dd59a28ab4159ceb1357e3 | 2 grouped cases PASS, independent parse/signature | 5b459c11cf78499748ab1208e64cae0a66ebc7e9035e3fc5ea040bbfe9d407f7 |
| Gateway orchestration RED | 771bb9741b5ca95940667a64ac7e5275730de127 | Missing service, intended RED | 3aa33b31d9f4d694b60b44c9d9951ccce458d74139a1c04e6aadf5f5326f0a48 |
| Gateway component guards | 0c7f0b42142f826c5fa741d0bea54e766d0b225a | 25 grouped cases PASS | 38cc2c79e98da3c53698487e61a6d3f66af438c461ed78eba49d89f317118ca3 |
| Real Boot HTTPS range RED | 847c8e2d36ab7f99f6f52ba18aa7f033bd747765 | Verified TLS/single loopback then 501 missing handler | 1898275d7e618f2dd2b1004a33162f2a7e5a37fe45aab6cc2d2cc2eecf9b16ed |
| Real Boot HTTPS range GREEN | 6aaae5d31bdcdf13737b20fd13f4cac43ae2664a | Actual1024 bytes → private Adapter → independently verified signed Receipt | d1c6a2f6dc61762a19c8de220571a422c677e9a2ecb73a983487b8bc02ccba6f |

These are grouped JDK boundary cases, not Surefire test counts. Every executed packet was
committed/pushed first; raw manifests matched locally/remotely and archive hashes matched.
Exact setup/runner failures, earlier whole-object RED/GREEN and prospective recipes are retained
in `tests/ph1/f05-qualification/gateway/README.md`; no setup failure is called behavioral RED.

Private roots are fresh named attempts under `/home/phuclam/idea-f05-sprint-20261005-37`.
No company/Vault/preview data, database or global trust store was touched by these packets.
Owned synthetic files/logs remain private for review. Each HTTPS JVM terminated; exact18447
listener count returned0, cleanup SHA-256
84fcb7658428001336afda8960d9e45a594c79e58599974b3fb3e5e75c920b30.

## Actual product paths and package

`apps/gateway` now contains GatewayApplication, GatewayTransferService, TransferGrantVerifier,
GatewayEnvelope, TransferReceiptSigner and FilesystemVaultAdapter at the T027-refined paths.
Component tests exercise public methods with real files and independent Server frame production.
No DB, Session/ActorId authority or Server-custody publication is implemented in Gateway.
The candidate remains private even when it has a valid Gateway Receipt.

Final current HTTP package built from6aaae5d31bdcdf13737b20fd13f4cac43ae2664a:
JAR SHA-2566e231382db31384d22985683ffa2a890d38ddbe56adf4b8c6f59cb0f445399df.
POM preserves Boot4.1.1/Java25 and exact admitted115-row/99-JAR/242-POM/four-plugin graph.
Actual graph/realm hashes PASS; exact38 application collection projects to32 runtime payload JARs
by the six known metadata-only starter omissions. Boot loader/main/bytecode/provider/package
oracles PASS. JSR305 absent and no build-tool JAR leaks. Source/tools/cache postflight unchanged.
Known mixed/custom license obligations remain retained in private build legal directories; the
bounded process exception is not legal/commercial/T036 or broader development clearance.

HTTPS GREEN used fresh harness-only TLS, SAN IP127.0.0.1, dedicated truststore, no bypass,
only127.0.0.1:18447. Actual TLSv1.3 / TLS_AES_256_GCM_SHA384; certificate SHA-256
67d3ce4154a3ca4ca8bf3859cbcb5bcbd12fad8997ba9c591bc341f702c5b6d7;
TLS freeze SHA-256673ec3a8b9be8f5dc9ccb465e536a17d487c80ede34862d4ed50d89826ac6074.
This cert/key is synthetic/private, not production PKI qualification.

## Remaining, explicitly not inferred

- Actual HTTP negative/interruption/lost-response/concurrency/request-timer matrices remain owed.
- Server Receipt acceptance, atomic Artifact/Vault/Location custody and revocation coordination
  remain NOT-RUN/NOT-IMPLEMENTED for this successor.
- Node exact T033 admission and real client/1KiB+64MiB end-to-end matrix remain owed.
- No product permission-free Server endpoint, general product RBAC, Desktop/Workspace,
  power-loss/hostile-same-user/HA/recovery, production or commercial readiness claim.
- Verifier NOT-RUN; no merge, Issue/card closure, Tracker publication or timer restart.

Continue under existing sprint authority. The predecessor process-scope STOP is superseded by
the approved successor record, not by rewriting historical exceptions. No new approval is
needed for ordinary remaining engineering work; only genuine material STOP or merge-readiness
returns for human attention.
