# F05 engineering closure matrix — external review packet

| Control | Value |
|---|---|
| Stable ID / class / version | IE-VEV-PH1-F05-CLOSURE-MATRIX / verification record /0.2 |
| Status / engineering disposition | Approved for bounded F05 technical acceptance / ACCEPTED, PASS WITH NOTES; PH1 acceptance/integration separate |
| Owner / author / reviewer | Engineering /Codex CODEX_ONLY /Project Reviewer Nguyễn Huỳnh Phúc Lâm, received whole-F05 decision at 874088695d0b65e6d71b40078d6f55e623087b0a |
| Authority / applicability | Issue37/PR38; continuous T028–T034 sprint and bounded successor tooling authority; frozen T027 v1 envelope/profile |
| Publication / normativity | 2026-10-06 Asia/Ho_Chi_Minh /INFORMATIVE; repository instruction NOT-APPLICABLE |
| Classification / retention | INTERNAL; retain original failures, exact execution lineage and private-log access limitation |
| Upstream | [Spec FR-008–012, SC-005/006](../spec.md), [contract](../contracts/ph1-boundaries.md), [tasks](../tasks.md), [sprint](../../../docs/research/2026-10-05-f05-execution-sprint.md) |
| Downstream | PR38 whole-F05 external review; separate card acceptance/publication and merge authority |
| Change / supersession | New current index of existing and successor execution; historical evidence preserved; supersedes NOT-APPLICABLE |
| Tailoring / trigger | STANDARD-GUIDED under IE-STD-AUTH-001; source/tool/graph/rights/target/scope drift requires affected review/execution |

## 1. Exact candidate and actual boundaries

Final actual transfer source **`e542b46184b1e2792c7d5f0fcdcf38c0d7d7cd34`**,
receipt-green-42: both P05 fixtures, real admitted Windows Node client, real
Server HTTPS session/CSRF and PostgreSQL, actual packaged HTTPS Gateway and
FilesystemVaultAdapter. Final focused source **`e5428846b59c2ec79a72647f71045ecaae0f582f`**
adds only test-handoff cleanup and runs Receipt7 + cleanup2. Subsequent closure
publication changes documentation only; exact PR head is recorded on the PR.

Gateway application source **`0aefb56f4f87b337ce4cc614f51b5f96ac2e86c9`**;
retained JAR SHA-256 **`c26b870e22a6ffb6ed9acbcbcd1dd20208004226c4d09a399e227983023a14e1`**.
No Gateway source change during final client integration. Server is the actual
Spring application test context/classes, not a newly qualified packaged Server.
Control endpoints are a manually registered test-only bridge into actual Grant/
Receipt services. Ordinary qualified authentication supplies Actor authority;
no new product Server route, Swagger operation or product Permission is claimed.
Owner/allocation authority is explicit; the controlled same-host allocation
fixture is not a distributed production allocation-discovery protocol.

All database executions use fresh marked `f05_<UUID>` schemas in the approved
retained `idea_ddm_f05a_20261005_t028`, separate app/migrator roles, guarded
cleanup after owned JVM exit. Database remains retained. Final ports18446/18447
are released. No company data, preview, global trust, dependency download or
verifier execution. Harness-only TLS uses normal trust and endpoint verification.

## 2. Requirement → source → executed evidence → disposition

Paths below are repository-relative; full execution identities and retained log
hashes are in [component evidence](F05-A-gateway-files.md) and
[transfer evidence](F05-B-transfer-results.md). PASS is engineering qualification;
external whole-F05 disposition remains PENDING for every row.

| Requirement / task | Actual source and test | Execution / oracle | Engineering status |
|---|---|---|---|
| FR-008; T028/T030: eligible scoped time-bounded Grant, canonical retry/renewal | `TransferGrantService.java`; `custody/CustodyBoundaryTest.java` G01–G06 | Grant10/10 at8d6c26d; F05-B §§6–7; current IAM/owner/allocation, signature pins, controlled expiry/renewal, concurrent same-ID and forced-write/commit refusals | PASS |
| FR-008/011; T029/T031: verified candidate and signed Receipt, bounded transport | `apps/gateway/.../FilesystemVaultAdapter.java`, `GatewayTransferService.java`, verifier/signer; Adapter/Gateway tests | Adapter13 and Gateway25 grouped cases; packaged gateway-boot-08 range60/inactivity30; actual run42 control30 empty408; F05-A and F05-B §§8–9 | PASS; grouped cases are not Surefire counts |
| FR-009/011; T028/T032: exact Receipt and atomic custody | `TransferReceiptService.java`; `ReceiptBoundaryTest.java` R01–R07 | Receipt7/7 at947c60d and final e542884; signature/scope/correlation/allocation/expiry, canonical retry, forced writes/deferred commit, concurrent same Receipt, logout/revocation and allocation drift produce no partial custody; F05-B §§9–10 | PASS |
| SC-005; T033/T034: actual direct bytes and custody, both fixtures | `client-transfer.mjs`, `client-e2e.mjs`; `identity/TransferClientBoundaryTest.java` | run42 sourcee542b461,1/1 integration + actual Node PASS. Independent Adapter full-file size/hash and PostgreSQL Artifact/Location VERIFIED/Transfer CONSUMED/single Audit; F05-B §9 | PASS |
| FR-011/SC-005/CHK009: refusal/mismatch, interruption/resume | Gateway/Adapter cases, Grant/Receipt tests, actual client driver | Layered evidence: wrong size/full digest guards in components; altered Grant/Receipt, expired Grant, bad chunk digest, changed completed range and partial second range in actual run42. No invalid candidate publishes false custody. 64MiB resumes63 missing1MiB ranges from1048576; F05-A, F05-B §§6–9 | PASS within stated layer-specific cases |
| FR-011/CHK009: lost response after transfer and Server acceptance | actual driver discards HTTP bodies at headers; service/idempotency and independent PG assertions | run42: lost Gateway completion body resolves via status without more range writes; lost Server acceptance body retries exact Receipt/operation, same Transfer and single acceptance Audit. No uncertain response is relabeled rollback | PASS |
| FR-010/SC-006/CHK010: logical identities independent of private path | V9/V10 Artifact/Vault/Location relationships; Adapter interface/callers; actual relocation assertion | run42 moves only owned test vault directory after Gateway exit; both file hashes/sizes and original Artifact/Vault/Location IDs/VERIFIED metadata retained. Schema/source review shows separate identities, not hostname/path-derived IDs | PASS seam check; no second-Vault runtime claim |
| Data/migration boundary; T028/T032 | `F05GrantMigrationTest`, `F05ReceiptMigrationTest`, unchanged V9/V10 | Retained V8→V9 and V9→V10 first/repeat/history/checksum/owner/app42501 qualification. F05-A migration receipts; SQL/tests unchanged in final continuation | PASS isolated predecessor checks; fresh public V1–V10 NOT-RUN |
| Affected IAM/HTTP/health | existing identity/HTTP/health suites |105/105 at55b1865, regression13, after allocation repair; F05-B §9. No subsequent production change | PASS; separate command, not rerun at final head |
| T033 client guards / cleanup hygiene | client parser/ranges tests; `OwnedHandoffCleanupTest` | Local Node6/6 at run42 source; final Receipt7+cleanup2=9/9 at e542884. Primary failure preserved and private handoff deleted; F05-B §§9–10 | PASS; cleanup repair has no retained original RED run |
| FR-012 bounded intake/tooling control | frozen inventories/exceptions, exact offline graph and Node admission | Exact-source archive/raw-input/tool/cache/realm preflight and postflight; no drift/new dependencies. Node24.19.0 project-wide APPROVED-WITH-OBLIGATIONS. F05-B §§9–10 | Intended-use engineering authority retained; no legal/commercial/T036 clearance |

Fixture oracle:

- 1KiB: `c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384`.
- 64MiB: `04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae`.

## 3. Repairs, preserved failures and review limits

Completed-operation lookup repair363f6d3 resolves the original consumed transfer
instead of creating another transfer. Allocation repaira49d5fc requires equality
of the complete current allocation tuple before authoritative Receipt commit.
Both have retained genuine RED/GREEN. Historical runner STOP41 remains NOT-PASS;
fresh sequential42 supplies complete postflight. Hygiene repaircd60602 is test-only
and explicitly qualified without claiming a retained RED witness.

Engineering Standards/Spec-axis review found one cleanup defect, repaired and
qualified, and no actionable Spec finding. These reviews do not grant human
acceptance. The tracked-secret detector remains **NOT-PASS** for two dynamic
TLS assignments; manual source inspection identifies generated/private-read
values, not committed secrets. No bypass/rename/allowlist makes that command PASS.
No credential, cookie, CSRF, key, Grant or Receipt value is retained publicly.
Private host-log hashes identify files; independent raw-log access remains limited.

## 4. Completion boundary and next action

T027–T034 engineering obligations are satisfied by the mapped evidence. Task
markers do not close F05-A/B cards or Issue37. **PR38 stays Draft/Open**;
whole-F05 external review was subsequently received on the exact accepted head (§5).
Actual-effort publication, card/Issue closure and merge remain separate authorized actions.

T035/T036 PH1-wide coverage/license review are not silently completed by this
packet. Fresh public V1–V10 and verifier remain NOT-RUN. No Desktop/Workspace,
client management UI, future Document/Generation workflow, second Vault,
production policy/PKI, HA/recovery, throughput or commercial readiness is claimed.

## 5. Received Project Reviewer acceptance — 2026-10-06

The Project Reviewer reviewed head `874088695d0b65e6d71b40078d6f55e623087b0a` and
accepted F05-A/B as **ACCEPTED / PASS WITH NOTES**: T027–T034 engineering obligations,
the actual session/CSRF/Grant → direct HTTPS Gateway/Adapter bytes → signed Receipt →
current IAM/allocation → atomic custody flow, both 1 KiB/64 MiB sizes/hashes, refusal,
interruption/resume, renewal, lost responses and canonical/changed-input retry are accepted.
SC-005 and bounded PH1 SC-006 are accepted. No material technical F05 blocker remains.

Preserve detector NOT-PASS/manual disposition, fresh public V1–V10 NOT-RUN, verifier
NOT-RUN and private raw-log access limitation. T035/T036 are separate PH1-wide reviews.
The reviewer reported a GitHub connector 403: no GitHub acceptance comment/review was
created. This section records the conversation decision, not a fabricated GitHub event.
Earlier pending wording/row dispositions describe the pre-acceptance publication.
No application, test, migration, dependency or execution evidence changes accompany this
record. PR38 remains Draft/Open, no merge; PH1 and actual-progress publication remain separate.
