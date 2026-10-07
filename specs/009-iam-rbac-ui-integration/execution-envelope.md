# IAM UI 46 controlled readiness envelope

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-EXE-IAM-UI-46-20261007 / readiness configuration and gate record / 0.2 / Draft; PG2/PG3 PASS; PG4 BLOCKED only on pending certificate trust / actual Chrome HTTPS |
| Scope / authority / date | Issue #46 / PR #47, feature 009; explicit human readiness continuation at 5b2fb9f; 2026-10-07 Asia/Ho_Chi_Minh |
| Owner / author / reviewer | Project user / Codex CODEX_ONLY / Project Reviewer; technical spec/design acceptance retained, formal PG2/PG3 supplied separately below |
| Normativity / classification / retention | INFORMATIVE product semantics; controlled execution instruction for this increment / INTERNAL / retain historical attempts and exact-source results |
| Upstream / downstream | [Handoff](integration-readiness.md), [plan](plan.md), [tasks](tasks.md) / T007 only now; T008+ after explicit final PASS |
| Change / trigger / tailoring | Resolves the four accepted blockers; source/tool/hash/graph/target/scope drift reopens preflight; STANDARD-GUIDED IE-STD-AUTH-001 |
| Limit | No PG5, implemented IAM UI, production/partner/commercial qualification, deploy or merge claim |

## 1. Explicit gates and target authority

The human explicitly answered **“Xác nhận PG2 và PG3 = PASS”** on 2026-10-07 for the exact
successor at `5b2fb9fbeec9e2edc23532de7b2a81d84289a664`. This is a new formal affected-increment
disposition of the requirements/design already independently reviewed, not a retrospective
conversion of SPEC/DESIGN REVIEW PASS. Accepted spec, Q14/Q15, Core refinements and contracts
are unchanged. Scope is 009 only, not universal Core/production/release gate approval.

PG4 is to be disposed only after DB, offline build/package and trusted browser environment
conditions below are met. The latest human instruction specifically authorizes **readiness
environment/build preparation before PG4**, but not T008+ product/test implementation.
This is the explicit bounded successor to the old preflight's no-setup-before-gate wording.

The operator completed the published one-stage wizard (SHA-256
`09753c6bbd7c2b8060a4616027fa022b0270f720dafe138c59eb0f33221623e4`).
Read-only psql then authenticated both real existing identities to:

`127.0.0.1:5432/idea_ddm_iam_ui_20261007_46` on ideaddmserver.

DB owner is idea_ddm_migrator; public owner pg_database_owner; public table count **0**.
Migrator database/public CREATE true; app both false and no migrator membership. Both roles
have no superuser/createdb/createrole/replication/bypassrls. Database PUBLIC privileges revoked;
app receives CONNECT and public USAGE only. No migration/identity/bootstrap/product row created.
Retain this DB: **no automatic DROP DATABASE**. Synthetic data and per-run
`iam_ui_<32 lowercase UUID hex>` schemas only; verify DB, exact schema, owner/run marker and
terminated owned JVM before narrowly dropping a future run's schema. Never clean public/old DBs.

## 2. Actual offline graph and minimal necessary repair

Offline Maven-core Resolver inspected the effective Server model and the plugin dependency graph,
without Maven goals or plugin realm loading. Original exact POM SHA-256
`32c4432479955693644a8677b1ed8d209e5b6a823294a11725e8f9afb48d349d`
**actually selects** com.google.code.findbugs:jsr305:3.0.2 in the Boot plugin acquisition path:
Boot Maven Plugin 4.1.1 → buildpack-platform 4.1.1 → tomlj 1.0.0 → JSR305.
It is not in the selected application dependencies. Mere cache presence was not the finding.

Original complete audit log: `graph-original-02.log`, SHA-256
`68207bfb550780ec30b9fc1631243d39dbd7a7d4756a1022c8b836a0e63c33bb`.
An initial diagnostic omitted Maven's boot/classworlds classpath and failed before resolution;
it is retained in `graph-original.log`, not called a dependency failure or PASS.

The user permits a graph repair only if actual graph evidence requires it. The sole build POM
change applies the exact previously qualified buildpack-platform 4.1.1 plugin dependency with
a JSR305 exclusion. No application dependency, version, architecture, Java, migration or API
change. Repaired POM SHA-256:
`fd4a929d0b8071799acfca186371b119d664ac7a4b0b11a720977212cac41169`.

The completed repaired offline audit returns **no JSR305 selected**, with:
347 parent/imported/selected POM rows; 63 compile + 4 runtime + 29 test JAR rows;
9 exec + 38 Boot + 9 resources + 14 compiler + 16 jar + 15 Surefire plugin rows.
197 selected JAR rows / **171 unique actual JARs**, all hashes found in retained exact
rights/intake inventories, no new artifact. Model/plugin rows and paths are pinned in
[resolved inputs](../../docs/research/inventories/iam-ui-46-resolved-inputs.tsv).
Complete repaired log SHA-256:
`22c8a8735e417e932337630c2b1a906cb4513b9741db427f3bceaf87316e687a`.

Existing exact rights evidence for these components is reused, not the expired F05/T043 process
exceptions: [T036 current-use rights](../../docs/research/2026-10-06-t036-current-use-rights.md),
[Q02 rights map](../../docs/research/inventories/f05a-q02-rights-dispositions.tsv),
[T043 exact nine-artifact evidence](../../docs/research/2026-10-01-t043-maven-web-build-intake.md)
and prior Server input evidence. Current human comply-and-use authority admits unchanged
known-term components as **APPROVED-WITH-OBLIGATIONS for this internal 009 build/test**.
Retain all embedded/adjacent source license, NOTICE, copyright, acknowledgement, source-handling,
patent and no-endorsement terms. Do not ship build-only tools in BOOT-INF/lib; package oracle
checks this. No missing grant is waived. Historical JSR305 BLOCKED-LEGAL remains intact.

## 3. Published environment/build procedure and final gate

The exact first-party [utilities and command packet](../../tools/iam-ui-readiness/README.md)
are published before certificate generation/listener/package execution. Reuse existing cached
tools only; fresh owned export/build/TLS children; source/inputs hash verification before and
after. Node Linux 24.21.0 must have its own exact intake before build; Windows browser runner
uses already admitted Node 24.19.0, not PATH. No npm install/ci/npm/Corepack/package download.

TLS fixture: dedicated fresh tls-01 root, 7-day test cert, SAN localhost/127.0.0.1, private
keystore/password; freeze certificate identity before trust/serve. Import only the confirmed
public cert to CurrentUser Root. Installed headed Chrome 154.0.8037.98 + cached Playwright/core
1.62.1; no browser download/TLS bypass. Test-only loopback18446, never preview18444. Normal
trust/endpoint verification must return exact 200/body on both hostnames; record actual result,
then terminate owned fixture/tunnel and prove no listener remains. This is environment readiness,
not IDEA client/session/role qualification.

At the historical 4c98f226 pre-execution publication, package and HTTPS results were **NOT-RUN**.
PG2 **PASS**; PG3 **PASS**; PG4 **BLOCKED** until their actual successor results are recorded.
T008 remains NOT-STARTED. No verifier, deployment, merge, company/production data or timer action.

## 4. Actual readiness execution — 2026-10-07

### Exact source and publication lineage

| Identity | Actual use |
|---|---|
| Authorized predecessor | `5b2fb9fbeec9e2edc23532de7b2a81d84289a664`; accepted spec/design/task/Analyze retained |
| Published build, graph and TLS utility source | `4c98f2266dd159c7609afcab4c95eb4479ae0384`; build-only POM exclusion, pinned inventory and readiness utilities published before execution |
| Exact Linux Node admission | `04b8b98a46bf62a5669e38450423505451536902`; intake committed before Node-only Web build |
| Package content oracle | `94ff88e546c5fc09061f40187848f0ba8d9069bb`; utility published before its execution, no application source change after 4c98f226 |
| Source ZIP / target | SHA-256 `d7fa0fe6f80a9919e373530f98d8be8be7714a6c5303dee1889e12e64efe285a`; owned `/home/phuclam/idea-iam-ui-20261007-46/export-4c98f22-02` |
| Built predecessor Server JAR | SHA-256 `f1939531de93c3acf07758ded85708c887acd0fe067b3244f77839a47d70dc16`; `apps/server/target/idea-server-0.1.0-SNAPSHOT.jar` inside that export |

Command-local byte-preserving Git export, local committed-byte comparison, identical archive
transfer and remote extraction all passed **106/106**. Remote `unzip` was unavailable at the
first empty extraction target; no installation or normalization was used. A distinct owned
`-02` target was extracted with the already admitted JDK `jar`, then the same hashes passed.
The original empty diagnostic target is retained. The package-oracle first invocation lacked
its inventory document in the scoped export and stopped; a separate exact LF export of the
published oracle, migration files and inventory supplied the required data. Neither diagnostic
is described as an application failure or an earlier PASS.

### Environment and offline package results

| Check | Actual result / limit |
|---|---|
| New DB and two real identities | PASS: catalog recheck confirms exact DB/owner/roles and privileges in section 1; public still has 0 tables. No migration, fixture/bootstrap or identity row created |
| Linux Node | PASS: exact installed 24.21.0 binary and complete LICENSE match [scoped intake](../../docs/research/2026-10-07-iam-ui-node24210-intake.md); byte-identical private `node-only/bin/node` and `node-only/LICENSE`, no npm/npx/corepack copied or invoked |
| Linux Web cache | PASS: 44 installed selected packages match the unchanged lockfile and 44 cached archive SHA-512 pins; retained Linux native Rolldown/TypeScript/LightningCSS match their actual platform hashes. Other-platform optional packages are not missing inputs; no install/download |
| Selected Java acquisition graph | PASS: section 2 / 544 pinned model/JAR rows; all actual selected hashes match retained rights/cache evidence. No JSR305 selection; unchanged application dependency graph |
| Actual Web build | PASS: admitted Node-only executable runs existing `build-web-static.mjs`, using retained TypeScript/Vite directly; actual Web resources and legal notices produced |
| Offline direct Maven goals | PASS: resources 3.5.0 → compiler 3.15.0 → jar 3.5.1 → Boot repackage 4.1.1; `BUILD SUCCESS`, no JSR305 in diagnostic acquisition/realm output. No clean, install, lifecycle test/package, test suite or download |
| Executable package content | PASS: `PACKAGE_CONTENT=PASS;NESTED_JARS=57;JSR305_PROVIDERS=0;BUILD_TOOL_LEAK=0;NOTICES=3/3;MIGRATIONS=10/10`. Manifest/loader, actual Web, exact accepted nested hashes and immutable V1–V10 bytes checked; this is predecessor package readiness, not 009 behavior qualification |
| Windows Node / Chrome / Playwright | Exact version and executable/legal-file pins PASS: Node 24.19.0, Chrome 154.0.8037.98 and Playwright/core 1.62.1 at existing paths from handoff section 8. No PATH Node, browser/package download or TLS bypass |
| Final non-TLS input recheck | PASS: 82 toolchain rows, complete resolved-input inventory, Node-only binary/LICENSE and all 106 exported controlled source files unchanged after package execution. DB remains empty; no listener on 18446 |

The package oracle compares the **57-JAR Server payload** against its accepted actual inventory,
not the different 38-JAR Gateway graph. Boot omits 11 selected starter/processor JARs and adds
the retained jarmode-tools 4.1.1 entry; those exact expected bytes are checked. No new dependency
or runtime behavior is introduced by the minimal tooling exclusion.

### Fresh TLS identity and remaining blocker

Published `HttpsFixture.java prepare` created fresh mode-700 `tls-01`, with PKCS12 and password
files mode 600 on the server. Only the public DER certificate was transferred to Windows.

| Certificate/material identity | Frozen value |
|---|---|
| Subject / SAN | `CN=IDEA IAM UI 46 loopback test`; DNS localhost, IP 127.0.0.1; serverAuth |
| Serial / validity UTC | `c5c64956580d0752`; `2026-10-07T05:19:50Z` → `2026-10-14T05:19:50Z` (12:19:50 Asia/Ho_Chi_Minh) |
| Public certificate SHA-256 | `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad` |
| SHA-1 thumbprint for Windows import confirmation | `514FFB4578712A5A5585FAAACACDD4344868C083` |
| Private keystore SHA-256 (no private bytes/password) | `cb9c804289e7d3e6b4d7e6c9f665a61194b42eac7b55146f5eecd023ef8cab2f` |

The authorized CurrentUser Root import is awaiting Windows confirmation. Store presence is
currently false; the import is not retried and no duplicate import dialog is intentionally
created. **Trusted HTTPS and actual Chrome probe are NOT-RUN**, not PASS. No readiness listener
or SSH tunnel has been started while this prerequisite is pending. No machine/system CA,
global cacerts, preview, firewall or company trust store has been modified.

After import of this exact fingerprint is confirmed, check the store's raw certificate hash,
execute the already-published normal-trust headed Chrome probe against both SAN names, stop
only the owned fixture/tunnel and prove both 18446 listeners absent. Do not substitute a
click-through, `ignoreHTTPSErrors`, insecure client or configuration change. This environment
probe is not IDEA application/role/session qualification or deployment.

### Retained execution evidence

Private logs below are retained under `/home/phuclam/idea-iam-ui-20261007-46`, with restricted
access; repository evidence records identities/results, not independent public access to raw logs.

| Evidence | SHA-256 |
|---|---|
| `graph-original-02.log` | `68207bfb550780ec30b9fc1631243d39dbd7a7d4756a1022c8b836a0e63c33bb` |
| `graph-repaired-complete.log` | `22c8a8735e417e932337630c2b1a906cb4513b9741db427f3bceaf87316e687a` |
| `web-build.log` | `621f8e9f64b3dd7a86b3f6392c984ac0822e675825977a3ee1e9b8423e768393` |
| `maven-package.log` | `a7ee38b3b08766fe2b8b3318a081bf08dd20cb4add8427a9c183d9eb95993ea8` |
| `tls-preparation.log` | `d76baad07825979a1049a1573836c30267f8e01e02b64e167ca6fcb5c90acacb` |

### Current gate disposition

| Gate / task | Current disposition and authority |
|---|---|
| PG2 / PG3 | PASS / PASS: explicit human confirmation for the accepted affected successor, section 1; not inferred from a GitHub review event |
| T002 | COMPLETE: exact scoped tools/cache/rights/package inputs now confirmed; unresolved TLS target execution belongs to T007 |
| PG4 / T007 | BLOCKED solely on CurrentUser certificate confirmation plus normal-trust actual Chrome result; no unconditional human PG4 or runtime acceptance claimed |
| T008–T093 | NOT-STARTED. T008 remains the first eligible task only after final readiness PASS, then T009 RED before T010 GREEN |
| Product qualification / verifier / deployment / merge | NOT-RUN. No 009 application/test/migration implementation, live adoption, company data or timer action |

The human authorizes an explicit PG4 readiness disposition only **after all** the listed
environment/build blockers are closed. This conditional authority is retained; it is not used
to certify the still-unexecuted browser boundary. PR #47 remains Draft/Open, Issue #46 OPEN.
