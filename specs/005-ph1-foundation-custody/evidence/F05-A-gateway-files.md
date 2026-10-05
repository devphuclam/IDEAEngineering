# F05-A Gateway implementation — partial executed evidence

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-F05A-GATEWAY-20261005 / verification record / 0.3 |
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

Historical first HTTP GREEN package built from6aaae5d31bdcdf13737b20fd13f4cac43ae2664a:
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
- Server Receipt acceptance now has the executed minimum custody tracer recorded below;
  full negative/replay/atomic-failure/revocation/concurrency qualification remains owed.
- Node exact T033 admission and real client/1KiB+64MiB end-to-end matrix remain owed.
- No product permission-free Server endpoint, general product RBAC, Desktop/Workspace,
  power-loss/hostile-same-user/HA/recovery, production or commercial readiness claim.
- Verifier NOT-RUN; no merge, Issue/card closure, Tracker publication or timer restart.

Continue under existing sprint authority. The predecessor process-scope STOP is superseded by
the approved successor record, not by rewriting historical exceptions. No new approval is
needed for ordinary remaining engineering work; only genuine material STOP or merge-readiness
returns for human attention.

## Successor actual network inactivity RED → GREEN

2026-10-05; same approved offline graph/tooling/loopback boundary, fresh private roots.
No database, preview or system trust changes. Existing first HTTP execution remains historical.

| Stage | Exact source | Result | Private result-log SHA-256 |
|---|---|---|---|
| gateway-boot-05 | 678fd77f355b7ebed9a925252add9310a3b1315f | Genuine RED: one byte of declared1024 body, no refusal after35075ms | 3aa6871cf41f758a386877ca8e6318d5b5e5af5816595fd1f5fa657aea7237f1 |
| gateway-boot-06 | bce772969e9e7ef56d04f6e2b853c0f007145f7f | GREEN: empty408 after30074ms; status zero verified bytes/no Receipt, positive1024 transfer remains200 | a4a5bf4b7c0c3119030aff8a1d31d7df090f9ada83e1a877fc4b5df00820a023 |

Both raw25/25 local/remote, archive identity,99JAR/242POM/115-row/four-realm and exact
32 nested-runtime package oracles PASS. Source/tools/cache/TLS/system trust unchanged.
Current executed HTTP JAR SHA-25659d8a4686e54179d367baf4a3d0dd9327ff4bf90b97d4ad03adf81806e6a995e;
archive115e9a0eef847cb1eb4a206d3013c4a13ab94b17969fcda6073a3077ef761298;
input manifestd9ccdc2e0fc4ea3c6fcb95b2bbb88ffd71861fc653bd2e7b1c7540cfbbc39255.
GREEN certificate4e9f008debee6c91c3f5efc0f2c5eeb5b9e3be3c95ada3aff16dd2b19b261c6e,
TLS freezeecbb5b41d41237aec019d5b070fd1320bfcffa34bd98e631a5f36d069c846feb;
normal trusted endpoint, TLSv1.3/TLS_AES_256_GCM_SHA384.
Private logs live under each named root/source/run, no credential/proof recorded here.
Both cleanup logs84fcb7658428001336afda8960d9e45a594c79e58599974b3fb3e5e75c920b30:
owned JVM terminated, zero18447 listener. Not evidence of60s whole-range or30s control deadline.

## T032 minimum Server Receipt custody RED → GREEN

Real HTTP identity seam and PostgreSQL18 in approved retained database
idea_ddm_f05a_20261005_t028, fresh source-marked schemas only. Existing migrator/app roles.
Exact existing456-row Server/tool inventory and52 Maven core checks; direct offline goals,
no Web lifecycle/exec/plugin graph/dependency acquisition. No Gateway byte-transfer claim here.

| Stage | Exact source | Result | Owned schema | Maven private-log SHA-256 |
|---|---|---|---|---|
| receipt-red-01 | 05cd5726c1162cc73731468efd29fa44aca22bf7 |1 test, expected RECEIPT_ACCEPTANCE_NOT_IMPLEMENTED | f05_c9314ade0e314cbdbe40989a5a1476a4 | d71057a20c2dbd2ca5e85f8ca2bfe1a6473a0d34e1bb415a63a89f0ce6af330c |
| receipt-green-01 | c7846aea8825a1846de9d54e5ef2870c63e88abd |1/1 PASS,0 failure/error/skip | f05_76c62d513c124c29abaaee45e75ba69b |61eb2a0a77837ebca615967a26530cbc86c1d88e4a699984c963d580cfadeac3 |

GREEN raw93 inputs local/remote PASS; archive642b0e853d0ba682a85fa20b1db632eeb1468d0402d29e92a54700ebbd6a8d9a;
manifest5003eacfb02cbe675406a6df51b72faea6beacf91115c10dac2fc539c11a9186.
Private logs retained under /home/phuclam/idea-f05a-t028-t030-20261005-37/run-receipt-{red,green}-01/.
Input/postflight GREEN hashes ebe2aebaaabfce09c6f442127f4264690a73f60f68dd4995f075e710f4b9d934 /
1364b1cee290d60ed3290d0fe7ac5fbae14cd6973d5a86c354bcaaa820851e88.
Both owned Server JVMs stopped before exact source-marker/owner schema cleanup; zero source-owned
schema remainder; database retained, no public/old DB/preview/company/Vault modification.

Tracer proves eligible Server-established Actor plus independently signed25-field Receipt,
exact originating Grant scope, owner-controlled Vault/Location, Artifact/Location/Receipt/
transfer CONSUMED/Audit atomic writes and identical retry with one acceptance Audit.
No default owner policy/public product route/Permission was added. GREEN corrects test producer
purpose to frozen RECEIPT_VERIFIED; RED skeleton had not inspected it. No wire contract changed.
Remaining schema-level immutability/exact original evidence and failures are not inferred PASS.

## Historical execution STOP — network prerequisite

Prospective receipt-red-02 source5f54951 was not executed: GitHub push failed before export/
transfer. Later connectivity restored for push; source30a71f9603c3abf35ba396662337d3a6430c9e41
corrected the changed-evidence fixture before execution so its timestamps stay within the
original Grant window. No RED/GREEN result is assigned to this unexecuted test.
SSH192.168.137.33:22 then timed out; Windows had no192.168.137.x adapter address.
Latest attempts initiated no owned remote JVM/listener/schema. Next exact-source packet must
be frozen/exported/checked again before execution after connectivity returns. No timer restart.
T028/T029/T031–T034 remain unchecked; Issue37/PR38 Draft/Open, no merge/verifier.

## Successor Receipt and migration execution — network restored

SSH access returned after the human restored connectivity. The historical STOP above is
preserved; it is no longer the current blocker. Fresh packets below were committed/pushed
before export and execution, with raw local/remote source, transfer archive and tool/cache
preflight/postflight checks. No timer action was inferred from network restoration.

| Packet | Executed source | Actual result | Private Maven log SHA-256 | Exact owned schema |
|---|---|---|---|---|
| receipt-red-03 | 80802a18f42ec0fff3ba1800b3f33900e2447963 | 2 tests /1 intended failure: changed signed evidence was accepted for the same ReceiptId | 278c92559dfa8e06bfb2e795fa1c28b53fe0f28833ef0a154a68ac562775ec6b | f05_3fb86c75664d4b70ba38ee23a21d3781 |
| receipt-green-02 | b868a8961791a5b3a353b3d3d3be086a80b90dad | 2/2 PASS; additive V10 pins exact signed-frame SHA-256 | c37654992fd891c2d2251d2f25ae346554c36684f908f0a4d7092649e4329349 | f05_1cd80d8ab95643a6ab90dd7eb9cce22a |
| receipt-green-03 | c705714c267995afb020f91ec0d70364eea08863 | 3/3 PASS; signed-scope/key/framing/time negatives and zero-custody oracle | c13659772d6b7510999586afc717eafcd60affdc371d9b4b73c9a91e7f06d933 | f05_86c3729c10fd480ca568ff7560892f19 |
| receipt-green-04 | fc4b1ab278af5806a5af1586185919cfea2af7ca | 6/6 PASS; suppressed required writes, deferred commit failure, logout-first coordination, stale refusal/fresh same Actor, concurrent exact retry | 943a6ffd9016bd865e0a594af8d871510b90a953d18b7d4bacc244595406b3b0 | f05_7ceb1f0aa3014191a8f5ebe9385eee80 |
| regression-green-05 | 4f9e6ba2deae8005c8635055f530df92275cbf7d | 1/1 PASS; V9→V10, repeat0/checksums/ownership/real app42501 | cbbc799181d08ab8c560290d32b644f42e809dc29bdbaa44e2a49cc7c869f08c | f05_fa24a6c3d16f41f6bdee05f9710b4fa4 |
| regression-green-06 | 4f9e6ba2deae8005c8635055f530df92275cbf7d | 1/1 PASS; retained V8→V9 target qualification | 25308fad056803f0184f205dfc515f8cbe7b34b42989b5aca52b29a1d87bdb7f | f05_91c23d6e081e494fbe395e58435ca1d3 |
| regression-green-09 | da2fe131daaaa224b53274dd8e7536182bb9bfe2 | 105/105 PASS:83 HTTP +20 identity +2 health | 3f57adfd7732d5d20a4eae95c3bde28d4d734c3ee265ee483afc8451832ceaf4 | Individual guarded F03 fixtures; source-owned remainder0 |

Private logs: `/home/phuclam/idea-f05a-t028-t030-20261005-37/run-<packet>/maven-private.log`.
Each exact owned schema above was removed only after owned JVM exit and matching owner/source
marker checks. The approved database `idea_ddm_f05a_20261005_t028` remains retained; no public
schema, old database, preview, company data or Vault was adopted. Raw host logs remain private;
hashes are file identities, not independent public inspection of their contents.

The Receipt owner seam is `TransferReceiptService`, with a mandatory owner-controlled exact
allocation callback and Server-established eligible Actor. No permissive default, public
product route or new Permission was added. V10 retains exact Receipt/Grant/Transfer binding
and signed-frame digest with append-only protection; V1–V9 were not changed.

Regression-green-07 at63c37b7a2ea6080b67ba9e2867b294c6c0d35a14 failed104/105 because one
current-chain assertion still expected V1–V9. This was an outdated first-party test expectation,
not an IAM behavior failure. Successor expectation includes V10; previous evidence is unchanged.
Regression-green-08 mistakenly exported predecessor committed source while its intended test
repair was still uncommitted. It ran the predecessor default Grant suite, not the intended105
tests, and failed the expected-count oracle. No105-test PASS is attributed to that packet.
The repair was committed before the fresh09 manifest/publication.09 raw inputs95/95,
archive18150ebb26fd1030fbf4bc8e9682b746f75c23169cee757d13588af8a1c5ac45,
manifest817dae9b050f4b7834a4a2f3f2b026e8862b1a7318768b46309ae42f9c806abe,
preflight548674baedcfe29e10af0b97f4ca387f42352eba60cc3409ac209eb13ef35f1e,
postflight6e5a882b24b4155c9f661768dcf0b0b307a4815a11cb31f46180579231601e92.

Whole T032/T034 and whole F05 remain incomplete: actual Gateway→Server Receipt/client matrix,
1KiB/64MiB transfers, remaining transport deadlines and final applicable regression are not
inferred from these service-level tests. Fresh public V1–V10 remains NOT-RUN.
PR38 Draft/Open, Issue37 Open, verifier NOT-RUN, no merge/Tracker mutation.
