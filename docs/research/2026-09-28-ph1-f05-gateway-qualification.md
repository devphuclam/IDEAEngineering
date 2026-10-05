# F05-A / T027 Preparation Baseline

| Control field | Value |
|---|---|
| Stable artifact ID | `IE-RES-PH1-F05-GATEWAY-QUAL-001` |
| Class / normativity | Preparation/technology research record; product `INFORMATIVE` |
| Version / document status | `1.1 / Draft successor`; v1.0 approved preparation remains in its frozen Git lineage |
| Disposition | Current qualification reconciliation in §13; §§1–12 retain historical preparation, not current NOT-RUN status |
| Actual publication / approval date | 2026-10-03, Asia/Ho_Chi_Minh; the 2026-09-28 filename is a legacy T027 path, not the creation date |
| Owner / author | Project Reviewer / Codex, Primary Implementation Worker |
| Reviewer / acceptance authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit freeze instruction in the project conversation on 2026-10-03 |
| Worker mode | `CODEX_ONLY` |
| Applicable baseline | `IE-INC-PH1-FOUNDATION-CUSTODY-001`; repository input `4e43bc58d94f7eae17346e02ba484e9d0fe4a678` |
| Change record | Historical [#35](https://github.com/devphuclam/IDEAEngineering/issues/35) preparation; current [#37](https://github.com/devphuclam/IDEAEngineering/issues/37) authorized T027 closure, published 2026-10-05 Asia/Ho_Chi_Minh |
| Freeze / exact content binding | [Original v1.0 freeze](2026-10-03-f05-preparation-freeze-record.md) binds historical bytes only; [successor v1.1 freeze](2026-10-05-f05-t027-baseline-freeze.md) binds current reconciliation, and [closure §4](2026-10-05-f05a-t027-closure.md#4-exact-profile-freeze-and-usability-boundary) binds exact executed profile |
| Repository instruction state | Preparation handoff only; no implementation/execution grant |
| Classification / retention | `INTERNAL`; retain version, freeze record and supersession history with PH1 |
| Supersedes / superseded by | No earlier published package found; supersedes the uncommitted preparation proposal only / `NOT-APPLICABLE` |
| Review trigger | Authority, runtime/version, dependency graph/hash, wire/crypto direction, test target or qualified parameter changes |
| Evidence status | Accepted prerequisites +146/146 envelope/profile PASS; §13 distinguishes qualification from unimplemented product capabilities |

**Current-reading rule (2026-10-05):** §§1–12 are the retained v1.0 preparation snapshot.
Their NOT-STARTED/NOT-RUN/pending wording is historical, not a reopening of accepted execution.
Read §13 and its linked exact receipts for current status. The old freeze still identifies
v1.0 at source87376bba/blob72ecbbfb/SHAa14a58ce, not these v1.1 successor bytes.

## 1. Authority and scope

This freezes preparation, not T027 execution. T027 remains unchecked/not started; Gateway code,
qualification tests, database/certificate/tunnel provisioning and F05-A timer are not authorized.
Tracker and actual effort are unchanged. Verifier remains `NOT-RUN`.

Governing inputs at the repository input commit above:

| Source | Governing scope |
|---|---|
| [PG4 record](../../specs/004-technical-pilot-readiness/pg4-gate-record.md) | PH1 F01–F05; one Gateway/Vault |
| [ADR-0013 / IE-ADR-C1-011](../adr/0013-separate-artifact-control-and-data-planes.md) | Server control plane; direct Client→Gateway bytes; private Adapter; Receipt is not publication |
| [DOC-04 v0.15](../product/instances/idea-engineering/DOC-04-software-requirements-specification.md) | REQ-WS-016, REQ-SEC-001/002, bounded authorization and no client permanent store credentials |
| [DOC-05 v0.26](../product/instances/idea-engineering/DOC-05-architecture-description.md) | IF-ARTIFACT-CUSTODY/TRANSFER; Server/IAM and owner authority; Gateway byte custody only |
| [DOC-06 v0.18](../product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md) | DATA-REL-030/031; Transfer/Grant/Receipt correlation, identity, private staging and reconciliation |
| [PH1 diagram guide](../product/instances/idea-engineering/ph1-diagram-guide.md) | Current control/data arrows; predecessor proxy sequence is historical |
| [Spec v0.8](../../specs/005-ph1-foundation-custody/spec.md) | FR-008–011, SC-005/006 and User Story 5 failure outcomes |
| [Plan](../../specs/005-ph1-foundation-custody/plan.md), [data model](../../specs/005-ph1-foundation-custody/data-model.md), [contract](../../specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md), [tasks](../../specs/005-ph1-foundation-custody/tasks.md) | PH1 delivery refinement; T027–T034 order |
| [Authoring standard](../agents/product-document-authoring-standard.md), [technology standard](../agents/technology-stack-documentation-standard.md) | Controlled identity, trace, approval and truthful qualification states |

Closed architecture stays unchanged: Server selects and authorizes; Client sends bytes only to
the selected Gateway; Gateway uses one private Vault Adapter; Server verifies Receipt before
accepted custody metadata. Gateway cannot publish a Generation. ArtifactId, VaultId, LocationId
and physical path stay distinct. Multiple locations remain an additive future seam, not a PH1 test.

Standards tailoring: the authoring standard's information/CM, architecture and verification
controls apply to this combined preparation item. It is not a Core Product Document, a new product
requirement, a PG approval, a license/legal clearance, or an ISO-conformity claim.

## 2. Preparation decision receipt

The human freeze instruction approved the following dispositions on 2026-10-03. Approval was
received in conversation; it is not represented as a GitHub approval-review event.

| Decision | Accepted disposition | Qualification |
|---|---|---|
| Q1 runtime | Temurin `25.0.4.1+1`, Boot `4.1.1`, Maven `3.9.16`; separate Ubuntu executable Gateway JAR; `apps/gateway/` ownership | Approved for T027 qualification, `NOT-RUN` |
| Q1 Windows harness | Node `24.19.0` remains a test-harness candidate, subject to exact F05 intake | Not Desktop/Workspace qualification |
| Q2 protection | JDK Ed25519; Server signs Grant, Gateway signs Receipt; separate purposes and pinned public keys | Exact deterministic encoding/provider behavior `NOT-RUN` |
| Q2 presenter correction | Narrow bearer Grant over qualified TLS; no ephemeral client-key binding | Actor provenance is not presenter proof |
| Q2 TTL/ranges | Validity/Receipt window/chunk size remain T027 qualification parameters | No numeric value frozen as product authority |
| Q3 environment | New run-owned root, private staging/objects, one test Vault, separately authorized new F05 DB, owned ports/tunnels | Provisioning/connection `NOT-RUN` |
| Q4 intake | Prepare F05-scoped exact-used tooling/graph records; installed/cache availability does not transfer F04 authority | Missing rights/hash/artifact/runtime remains `BLOCKED` |

The earlier ephemeral client-key registration/request-signature/nonce proposal was evaluated
and **not selected for F05**. It is retained here as decision history, not an implementation
instruction. The earlier 5-minute and 1-MiB suggestions are unselected test starting candidates,
not approved TTL, chunk size, Core file-size limit or product protocol constants.

## 3. Runtime and ownership

| Alternative | Fit / cost | Disposition |
|---|---|---|
| Java25 + Boot4.1.1 executable JAR | Reuses the Server stack/tooling evidence; still needs a minimal exact Gateway graph and qualification | Selected direction for T027 |
| JDK-only HTTPS process | Fewer framework dependencies, more first-party transport/lifecycle work | Alternative; not selected |
| .NET Gateway | Viable family; Ubuntu SDK/cache/intake has not been established | Alternative; not selected |

Gateway owns streaming, grant validation, range/candidate state, size/digest verification,
private filesystem Adapter and Receipt signing. It does not own IAM/RBAC, relational custody
acceptance or document publication. Do not copy the Server application or automatically add
its JDBC/Flyway/Modulith/Security/UI/Swagger graph to Gateway.

The filesystem Adapter derives its own bounded paths from controlled identities, validates root
containment and rejects traversal/symlink escape. Client supplies no provider path. Candidate
bytes remain private; completed verified bytes remain immutable under the Adapter contract.
Durable-write behavior and failure boundaries still need qualification; filesystem and PostgreSQL
are not claimed to commit atomically.

## 4. Grant and Receipt qualification direction

### Grant

Server issues a short-lived bearer capability only after current eligibility and operation checks.
It binds GrantId, OperationId, TransferId, selected Gateway/endpoint, upload direction, candidate
or exact Artifact, expected size/SHA-256, permitted ranges and validity. Client-supplied ActorId
is not authority; Actor/Organization/session provenance comes from Server state.

Server holds the Grant signing private key; Gateway receives only its pinned public verification
key. No algorithm negotiation, token key URL discovery, JWT/JOSE or extra crypto dependency.
Separate signing-purpose/domain identifiers prevent treating one envelope kind as another.

The proposed exact-byte, typed/versioned envelope has bounded lengths and explicit field order.
The final byte layout/version, malformed-input rules and cross-process vectors are T027 outputs,
not a qualified wire contract in this preparation baseline. Unknown versions/keys, altered or
out-of-scope claims fail closed. No client key registration or client request-signature/nonce
subsystem is part of the selected direction.

A bearer Grant can be used by its holder inside its granted scope; the Actor claim does not
cryptographically identify that holder. TLS, short lifetime, narrow scope and secret custody are
the selected bounded protection. Server rechecks current eligibility/business state before
authoritative acceptance. Gateway validates transfer authority, not IDEA RBAC. Signature validity
does not prove current session eligibility; exact Gateway↔Server control authentication and
revocation signaling must be recorded under T027 before endpoint acceptance.

### Receipt

Gateway signs correlated Receipt evidence with a separate Gateway private key. Server holds the
pinned Gateway public verification key. Receipt binds its issuer/audience/purpose/version and
ReceiptId/GrantId/TransferId/OperationId to candidate or exact Artifact, VaultId, LocationId,
observed size/digest, verified ranges/completion result and applicable validity policy.
Physical path/permanent storage credential never enters Client Receipt or retained public evidence.

For a new upload, Gateway identifies the candidate, not a new logical Artifact. After exact Receipt
verification, Server Artifact Custody may allocate/reuse ArtifactId and link its Location/Vault.
Receipt is evidence only; it neither publishes Generation nor replaces current owner/IAM checks.
Server commits custody metadata and its required attributable records under the approved owner
contract; F04 sample event meaning is not automatically imposed on a custody event.

### Retry and reconciliation

An unchanged same-operation request resolves current progress/result; identical accepted ranges
do not append twice. Changed input for the same OperationId is a conflict, not another success.
Improper Grant replay, stale/expired/revoked scope and mismatched Receipt cannot accept custody.
Renewal requires fresh Server checks, a new Grant identity and the same operation/transfer identity;
it does not discard already verified ranges or create another operation.

Duplicate valid Receipt presentation resolves existing custody, without duplicate required records.
Interrupted/missing/corrupt bytes remain private. Lost responses require same-ID status lookup.
Uncertain commit is not confirmed rollback or FAILED; no silent new-ID retry. If relational
acceptance fails, private bytes may remain for controlled reconciliation, not public success.

## 5. Transfer sequence and failure ownership

| Step | Normal boundary | Failure oracle |
|---|---|---|
| Prepare | Eligible Client→Server metadata/control request; exact operation and input retained | Refusal gives no accepted custody/usable wrong-scope Grant |
| Grant | Server→Client selected endpoint and signed scope | Wrong/altered/expired scope is unusable |
| Bytes | Client→Gateway→private Adapter/Vault; Server carries no payload | Wrong range/size/chunk state never becomes verified progress |
| Verify | Gateway checks complete observed byte count and full SHA-256 | Missing/corrupt candidate stays private/ineligible |
| Receipt | Gateway→Client or protected Server path; exact correlated evidence | Lost response resolves same transfer, no second operation |
| Presentation | Eligible Client/controlled Gateway evidence→Server | Forged/mismatched evidence creates no successful custody |
| Accept | Server verifies evidence/scope/current state, then commits relational custody | Rollback creates no accepted custody; candidate may require reconciliation |
| Resolve | Same OperationId/TransferId status after response loss | Distinguish completed/refused/in-progress/uncertain; do not infer success |

Exact transport routes/status codes, range mechanics, timeouts and control authentication are
qualification outputs. Nothing here introduces a test endpoint or a supported new business API.

## 6. Qualification matrix — all NOT-RUN

Use the exact [P05 synthetic fixture manifest/evidence](../../specs/004-technical-pilot-readiness/evidence/P05-SERVER-FIXTURES-20260924.md).
1 KiB = 1,024 bytes, SHA-256 `c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384`.
64 MiB = 67,108,864 bytes, SHA-256 `04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae`.
Copy/regenerate only under separately authorized run ownership; do not reuse the private P05 directory.

| Case / requirement | Planned observable oracle |
|---|---|
| 1 KiB and 64 MiB happy path; FR-008/009, SC-005 | Actual Client→Gateway bytes, matching size/digest, Receipt verified before accepted metadata |
| Wrong/altered Grant; FR-008/011 | Wrong signature/key/endpoint/object/direction/range rejected; zero successful custody |
| Expiry; FR-008/011 | Before/at/after parameter boundaries under controlled test time; no host-clock change |
| Improper replay / same-ID duplicate; FR-011 | No second transfer result/accepted custody/duplicate required evidence; legitimate status/resume remains possible |
| Size mismatch; FR-009/011 | Missing or excessive bytes leave private candidate ineligible |
| Chunk/full digest mismatch; FR-009/011 | No verified full Receipt/accepted custody |
| Wrong Receipt; FR-009/011 | Issuer/signature/correlation/object/Vault/Location/size/digest mismatch fails closed |
| Interrupted 64 MiB; FR-011 | Query/resume only missing verified ranges under same identity and renewed valid scope |
| Lost range acknowledgement; FR-011 | Identical authorized retry does not append accepted bytes twice |
| Lost Receipt / Server response; FR-011 | Same-operation lookup; no silent new operation or false success |
| Changed input under same ID; FR-011 | Input conflict leaves original transfer/result unchanged |
| Renewal / disable or revocation before accept; FR-008/009/011 | Current Server checks; no accepted custody from an ineligible operation/session |
| Storage/control unavailable; FR-009/011 | Explicit bounded failure/reconciliation; no accepted orphan bytes |
| Private-path boundary; FR-010, SC-006, REQ-SEC-001 | Independent IDs, opaque mapping; no raw path/direct client Vault access/traversal |
| TLS/provider/envelope; REQ-SEC-002 | Trusted exact endpoint, Ed25519 availability, purpose/key/version and parser vectors on exact runtime |

Negative observations are attributable without fabricating an Actor for unauthenticated input
or logging bearer material. T027 qualifies prerequisites/profile; T028–T034 supply their named
implementation/transfer evidence later. No throughput, multi-GB, HA, restore or second-Vault result.

## 7. F05-scoped tooling inventory plan

This is an inventory for intake preparation, not admission or permission to execute. Only artifacts
used by the selected path are reconciled. Historical availability is not live cache verification.

| Exact candidate | Use / existing source | Recorded license / F05 state |
|---|---|---|
| Temurin `25.0.4.1+1` | Ubuntu runtime, `/opt/idea/tools/jdk-25.0.4.1+1`; [native intake](2026-09-23-p04-ubuntu-native-runtime-intake.md) | GPLv2 + Classpath Exception/notices; historical intake, F05 execution admission pending |
| Maven `3.9.16` | Historical wrapper cache `/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38` | Apache-2.0/bundled terms; exact cached artifacts/hashes and F05 scope pending |
| Boot `4.1.1` minimal Gateway graph | Existing source/version context in [F01 intake](2026-09-28-ph1-f01-dependency-intake.md) | Spring Apache-2.0; actual Gateway direct/transitive graph not yet resolved/admitted |
| Existing Server Modulith `2.1.1`, Security `7.1.1` | Server only; existing reviewed graph, not automatic Gateway dependencies | Apache-2.0 and recorded bundled crypto terms; scoped used-graph reconciliation pending |
| Flyway `12.4.0`, pgJDBC `42.7.13` | Server/database only; [F02 intake](2026-09-29-ph1-f02-dependency-intake.md) | Apache-2.0 / BSD-2-Clause; no Gateway DB credential; F05 use pending |
| PostgreSQL `18.6-0ubuntu0.26.04.1` | Historical Ubuntu package source | PostgreSQL License/package obligations; live target/access not yet qualified |
| Ubuntu Node `24.21.0` / npm `11.19.0` | Only if the selected Server build invokes its actual Web hook | MIT/bundled terms; F05 scope/cache pending |
| Windows Node `24.19.0` | Codex bundle `26.921.10847`, explicit bundled executable; standard-library-only client candidate | MIT/bundled terms; exact F05 intake pending, not Desktop/Workspace qualification |
| Windows OpenSSH `9.5p2` / LibreSSL `3.8.2` | Read-only transport inventory; owned tunnels only after authorization | Exact provenance/hash/license/use record pending |

Observed bundled Windows Node SHA-256:
`3602F2BB1A10F2CBAB4C36886218A33C1AB3DB87290E73B033C46C77147D0237`.
It matches the publisher's [v24.19.0 win-x64/node.exe entry](https://nodejs.org/download/release/v24.19.0/SHASUMS256.txt).
This match is inventory evidence, not completed F05 admission; [exact LICENSE](https://github.com/nodejs/node/blob/v24.19.0/LICENSE)
and bundled terms still belong in the scoped intake before use. Do not substitute the unrelated
Windows Node24.16.0 executable or download a Windows Java runtime to bypass the gate.

Server Maven `generate-resources` currently invokes the Web build. The following exact nine
build-tool artifacts have historical [T043 inventory/hashes](2026-10-01-t043-maven-web-build-intake.md),
but no inherited F05 exception:

| Coordinate | Version | Recorded terms |
|---|---|---|
| org.codehaus.mojo:exec-maven-plugin | 3.6.3 | Apache-2.0 |
| org.apache.maven.resolver:maven-resolver-api | 1.9.24 | Apache-2.0 |
| org.apache.maven.resolver:maven-resolver-util | 1.9.24 | Apache-2.0 |
| org.codehaus.plexus:plexus-utils | 4.0.2 | Apache-2.0 + supplemental ExtremeLab/Javolution/ThoughtWorks terms |
| org.codehaus.plexus:plexus-xml | 3.0.1 | Apache-2.0 + supplemental terms |
| org.apache.commons:commons-exec | 1.6.0 | Apache-2.0 |
| org.ow2.asm:asm | 9.9.1 | BSD-3-Clause |
| org.ow2.asm:asm-commons | 9.9.1 | BSD-3-Clause |
| org.ow2.asm:asm-tree | 9.9.1 | BSD-3-Clause |

Before any build uses this path, obtain the applicable F05 legal disposition or bounded process
exception and match every used hash. A documented approved path that does not use these tools
must prove non-use, not silently skip controls. No artifact/version/graph expansion, public
registry resolution, download/install or commercial clearance is authorized by this baseline.
Python, Docker, Playwright and an additional crypto library are not selected for this profile.

## 8. Isolated environment and evidence

| Proposed boundary | Preparation value / qualification condition |
|---|---|
| Ubuntu host | Recorded `phuclam@192.168.137.33`; read-only SSH previously refused authentication, so live versions/cache/access remain unverified |
| Windows endpoints | Candidate `https://localhost:18446/` Server and `https://localhost:18447/` Gateway; owned high ports/tunnels, availability checked before use |
| Ubuntu processes | Separate owned loopback processes; no service installation or Ubuntu restart |
| Run root | `/home/phuclam/idea-f05-<32hexRunId>/`; fresh root, private staging/objects/state/evidence within it |
| Database | One fresh `idea_ddm_f05_<run-id>` when separately authorized; existing migrator/app model, no new roles/credentials |
| Windows fixtures | New run-owned local directory; exact P05 sizes/digests, no company files |
| TLS | Qualified trust/hostname/certificate profile before connection; separate controlled key custody; no TLS warning/bypass |

No existing preview port18444, retained F02/F03/F04 DB, company/production data, existing Vault
or P05 directory is a target. Ports and paths above are execution parameters, not architecture
constants. Test processes sharing Unix user phuclam do not establish production process/key
isolation, even with private filesystem modes.

Retain exact source/package/tool versions and hashes, parameter set, commands, safe correlations,
size/digest comparison, expected/actual result and owned-target cleanup disposition. Credentials,
cookies, reusable Grant material, private keys and provider paths stay outside repository/evidence.
Stop owned processes before guarded cleanup; resolve exact absolute targets and prove containment.
Retain the new review DB until explicit disposition; no automatic DROP or broad cleanup.
Private raw-log access remains an evidence-access limitation if logs are not independently shared.

## 9. Open qualification parameters and stop conditions

| Unresolved item | Owner / action / review trigger |
|---|---|
| Grant lifetime and Receipt acceptance/renewal window | Codex qualifies 1 KiB/64 MiB usability and boundary behavior; Project Reviewer accepts exact profile before endpoint acceptance |
| Chunk/range size, framing limits and timeouts | Codex records measured usable parameter set and safe retries; review any parameter/profile change |
| Exact envelope layout/version, installed provider, keys/trust and control authentication | Codex supplies deterministic vectors and negative evidence; reviewer accepts before endpoint implementation acceptance |
| Exact used runtime/graph/cache/license disposition | Codex prepares F05 intake; missing artifact/hash/rights/runtime blocks use; no inherited F04 exception |
| SSH access, unused ports, new root/DB, TLS trust | Environment custodian authorizes named execution actions; Codex verifies safe target before use |
| Node client candidate | Codex completes exact F05 binary/license intake and records approved harness path; otherwise candidate remains blocked/unselected |

Stop before T027 until separate qualification authorization is received. Stop any later authorized
execution on tool/version/module/graph/hash/target drift, missing legal disposition, untrusted TLS,
unsafe target, unexpected data or behavior differing from the recorded oracle. Report BLOCKED or
FAIL truthfully; do not install a substitute, retarget a retained DB, change migration history,
extend an exception, or widen product scope to make a check pass.

## 10. Successor path refinements — candidates only

These paths organize already-owned T029/T031/T033 work after T027. None is created by this baseline;
filename selection is not implementation authorization or runtime qualification.

| Task | Candidate paths |
|---|---|
| T029 | `tests/ph1/transfer-smoke/gateway-cases.json`; `apps/gateway/src/test/java/com/idea/ddm/gateway/GatewayTransferTest.java` |
| T031 entrypoint/service | `apps/gateway/src/main/java/com/idea/ddm/gateway/GatewayApplication.java`; `apps/gateway/src/main/java/com/idea/ddm/gateway/transfer/GatewayTransferService.java` |
| T031 security/receipt | `apps/gateway/src/main/java/com/idea/ddm/gateway/security/TransferGrantVerifier.java`; `apps/gateway/src/main/java/com/idea/ddm/gateway/receipt/TransferReceiptSigner.java` |
| T031 Adapter/test | `apps/gateway/src/main/java/com/idea/ddm/gateway/adapter/FilesystemVaultAdapter.java`; `apps/gateway/src/test/java/com/idea/ddm/gateway/adapter/FilesystemVaultAdapterTest.java` |
| T031 handoff/evidence | `apps/gateway/README.md`; `specs/005-ph1-foundation-custody/evidence/F05-A-gateway-files.md` |
| T033, subject to Node intake | `tests/ph1/transfer-smoke/client-transfer.mjs`; `tests/ph1/transfer-smoke/client-transfer.test.mjs`; `tests/ph1/transfer-smoke/README.md` |

Preserve task IDs/status/order. Reconcile the qualified profile to these candidates and rerun
read-only Spec Kit analyze before Gateway implementation; material findings return to human review.

## 11. Technical-source evidence and limits

Primary sources consulted 2026-10-03 support feasibility, not IDEA test outcomes:

| Primary source | Bounded fact / use |
|---|---|
| [JDK25 providers](https://docs.oracle.com/en/java/javase/25/security/oracle-providers.html), [Signature](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/security/Signature.html) | Documented SunEC Ed25519 support; installed Temurin provider behavior still NOT-RUN |
| [Node24.19 crypto](https://nodejs.org/download/release/v24.19.0/docs/api/crypto.html), [HTTPS](https://nodejs.org/download/release/v24.19.0/docs/api/https.html) | Standard-library crypto/HTTPS APIs available in published documentation; no executed client qualification |
| [RFC9110 §14.5](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.5) | Resumable upload needs an explicit application agreement, not assumed GET Range behavior |
| [RFC7662 §4](https://www.rfc-editor.org/rfc/rfc7662.html#section-4) | Cached authorization can miss revocation; analogy only, no OAuth protocol selected |

## 12. Current disposition

Preparation: `1.0 / APPROVED PREPARATION BASELINE`, exact-byte freeze in the separate record.
T027 qualification: `NOT-RUN / NOT-STARTED`. Gateway code: `NOT-STARTED`.
F05-A timer: `NOT-STARTED`. Tracker: unchanged. No implementation or execution is authorized.
No production/commercial, HA/recovery, multi-Vault or Desktop/Workspace acceptance is claimed.

## 13. Current T027 qualification successor — 2026-10-05

Authority: explicit user A–I “Continue F05-A / T027” work package. It freezes Q01, root05,
filesystem8/8 and HTTPS attempt02 as accepted predecessors and authorizes the remaining
envelope/profile/control/intake reconciliation and closure when analyze has no material gap.
No predecessor was rerun. [Current closure evidence](2026-10-05-f05a-t027-closure.md) records
remaining execution at2c7eb32397a9f033885c48e19e27e6716ed8fd64:146/146 PASS, fresh signer/
public-only verifier JVMs, exact deterministic bytes, negative vectors and P05 bounded hash probe.
T027 COMPLETE / PASS; [final read-only analyze](2026-10-05-f05a-t027-analyze.md) has0 material/open findings.

| Current topic | Qualified/frozen profile | Product obligation still NOT-STARTED |
|---|---|---|
| Runtime/package | Temurin25.0.4.1+1 /Boot4.1.1 /Maven3.9.16; actual115 rows/99 acquisitions/242 POMs/52 core; application38, payload32; JSR305-free root05 accepted | Separate Gateway executable, lifecycle/production operation |
| Envelope | [Exact version1 binary Grant/Receipt profile](2026-10-03-f05a-t027-envelope-profile.md), qualified146/146; SunEC Ed25519, Server Grant/Gateway Receipt separate pinned keys/domains | T028/T030/T031/T032 real issuance, request-scope enforcement, replay/result/commit behavior |
| Parameters | Grant300s, Receipt900s;1MiB chunks;4096-byte signed frames/256-byte strings; connect10s, inactivity30s, range60s, control30s; exact expiry, same-ID lookup, new-Grant renewal | T029/T034 actual request timers and both1KiB/64MiB transfers; CPU hash probe is not throughput |
| Control protection | Client-mediated ordinary Server session/CSRF; TLS chain/endpoint + pinned signed envelopes; fresh Server IAM/owner/allocation checks at renewal/final commit; no Gateway DB/RBAC authority | T028/T030/T032/T034 implement fail-closed coordination, no accepted custody from stale scope |
| HTTPS | Attempt02 accepted PASS, dedicated stores/no TLS bypass; owned loopback listener terminated | Product endpoint deployment/certificate custody, not production TLS qualification |
| Filesystem/Adapter | Accepted8/8 prerequisite; profile §5 controlled private root/staging/size/full digest/promotion/immutable completion, distinct Artifact/Vault/Location | T031 real FilesystemVaultAdapter; T029/T034 full transfer/interruption/retry matrices |
| Intake | Exact known-term T027 process scope and proven JSR305 non-use; all obligations retained, historical BLOCKED-LEGAL preserved | T027 exception expires at closure; later F05 build use requires its own applicable authority, not commercial/T036 clearance |
| Node | Existing24.19.0 candidate/path/hash in closure §5; runtime legal admission pending for T033 only | T033 exact Node intake/client qualification, not a T027 blocker |

The selected paths in §10 are now **post-T027 refined implementation paths**, not unresolved
runtime candidates: T029 JSON scenarios + GatewayTransferTest; T031 GatewayApplication,
GatewayTransferService, TransferGrantVerifier, TransferReceiptSigner, FilesystemVaultAdapter
and FilesystemVaultAdapterTest; T033 client-transfer.mjs/.test.mjs and README subject to its
own Node admission. No apps/gateway or transfer-smoke product file is created here.

Preserve original freeze/STOP/raw-log limits. Gateway/Adapter/Grant service/Receipt acceptance
remain NOT-STARTED; SC-005/006 product-transfer acceptance and whole F05-A/B are not inferred.
Verifier NOT-RUN; no DB/TLS/port/preview changes in this envelope unit, timer action or merge.
