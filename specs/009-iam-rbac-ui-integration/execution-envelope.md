# IAM UI 46 controlled readiness envelope

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-EXE-IAM-UI-46-20261007 / readiness configuration and gate record / 0.5 / Draft result record; PG2/PG3/PG4 PASS, section 6; approved Project/Group browser successor in section 7 |
| Scope / authority / date | Issue #46 / PR #47, feature 009; explicit human readiness continuation at 5b2fb9f; 2026-10-07 Asia/Ho_Chi_Minh |
| Owner / author / reviewer | Project user / Codex CODEX_ONLY / Project Reviewer; technical spec/design acceptance retained, formal PG2/PG3 supplied separately below |
| Normativity / classification / retention | INFORMATIVE product semantics; controlled execution instruction for this increment / INTERNAL / retain historical attempts and exact-source results |
| Upstream / downstream | [Handoff](integration-readiness.md), [plan](plan.md), [tasks](tasks.md) / T007 disposition complete; T008 then T009 RED authorized inside section 5 boundaries |
| Change / trigger / tailoring | Resolves the four accepted blockers; source/tool/hash/graph/target/scope drift reopens preflight; STANDARD-GUIDED IE-STD-AUTH-001 |
| Limit | No PG5, implemented IAM UI, production/partner/commercial qualification, deploy or merge claim |

## 1. Explicit gates and target authority

The human explicitly answered **“Xác nhận PG2 và PG3 = PASS”** on 2026-10-07 for the exact
successor at `5b2fb9fbeec9e2edc23532de7b2a81d84289a664`. This is a new formal affected-increment
disposition of the requirements/design already independently reviewed, not a retrospective
conversion of SPEC/DESIGN REVIEW PASS. Accepted spec, Q14/Q15, Core refinements and contracts
are unchanged. Scope is 009 only, not universal Core/production/release gate approval.

At the historical readiness authority through 4e20db2, PG4 was to be disposed only after DB,
offline build/package and trusted browser environment conditions below were met. That instruction authorized **readiness
environment/build preparation before PG4**, but not T008+ product/test implementation.
This is the explicit bounded successor to the old preflight's no-setup-before-gate wording.
The subsequent human development-gate decision is recorded separately in section 5; the actual
unexecuted HTTPS/browser result is not changed to PASS.

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

## 4. Historical readiness execution at 4e20db2 — 2026-10-07

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

### Historical gate disposition at 4e20db2

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

## 5. Human Backend-first gate disposition — 2026-10-07

**Disposition at d13dd7b: PG4 = PASS-WITH-ACTIONS; T007 = COMPLETE.** After the assistant proposed separating
Backend readiness from the not-yet-executed Web/HTTPS prerequisite, the human answered
**“Pass luôn có sao đâu”**. Record this as human authorization to proceed with Backend-first
development, not as evidence that the HTTPS or Chrome check ran. It is a successor disposition
to 4e20db2, not a rewrite of its BLOCKED result or a GitHub approval-review event.

The controlled outcome uses Constitution II's `PASS-WITH-ACTIONS` because a verification action
remains. PG2/PG3 remain explicitly PASS. DB, offline tool/cache/rights/graph and predecessor
package results retain their actual PASS evidence; **certificate trust / actual Chrome HTTPS
remain NOT-RUN**. The previously pending Windows import completed with cancellation
`0x800704C7`; the certificate is absent from CurrentUser Root. No retry, trust modification,
listener, tunnel, TLS bypass or browser run was performed for this disposition.

| Action control | Bounded obligation |
|---|---|
| Stable action / owner / approver | `IAM-46-A01` / Codex implements and retains evidence; project user confirms exact CurrentUser import if required / project user, the conversation instruction above |
| Affected baseline / scope | 009 at 4e20db2 and this documentation-only successor; Backend/source/real PostgreSQL preparation first. No deploy, merge, company data, live Q15 adoption or product acceptance |
| Due condition | Before the first actual Web/HTTPS integration/qualification run and before any PG5 whole-feature acceptance or release claim. This does not require running Chrome before named Backend fixtures / eligible-context TDD |
| Required completion evidence | Normally trusted exact test certificate; published headed Chrome probe passes both SAN names; owned process/tunnel cleanup; source/tool/certificate pins checked. Later actual IDEA Web qualification remains separately required by accepted tasks |
| Certificate expiry / reopen | Current TLS material expires `2026-10-14T05:19:50Z`; do not reuse after expiry. Prepare/freeze/trust a fresh bounded replacement before Web execution if needed; tool/source/graph/target drift reopens the relevant preflight |
| Escalation / STOP | If trust or normal endpoint validation is unavailable, STOP the affected Web/browser execution and report to the project user; never bypass TLS or describe it as PASS. No unconditional PG5/PG6, deployment or merge approval |

Risk and rationale: normal browser trust and endpoint compatibility are still unknown. They do
not alter the accepted IAM/RBAC rules, Backend test design or DB isolation; postponing this
environment proof permits the first Backend vertical slice without changing product security.
The exact required Web tests are retained, not waived. Migration immutability, least privilege,
rollback/forward-repair rules, source pinning and all other STOP boundaries still apply.

T008 is now the next authorized task, followed by T009 RED before T010 minimum GREEN. None
has started in this publication. Only gate/status documentation changed; no Java, test,
migration, dependency, tool, certificate or application result changed, and no tests reran.

## 6. Trusted HTTPS execution and action closure — 2026-10-07

**Current PG4 = PASS; IAM-46-A01 = CLOSED; T007 = COMPLETE.** The human subsequently instructed
**“Thôi thì bạn chạy cái đó luôn đi”** and confirmed **“yes rồi”** after the exact Windows
certificate warning. The originally conditional readiness authority is now supported by all
actual prerequisite results. This supersedes only the pending action/gate status in section 5;
historical cancellation, BLOCKED and PASS-WITH-ACTIONS records remain true for their dates.

Executed harness source remains **4c98f2266dd159c7609afcab4c95eb4479ae0384**:
`HttpsFixture.java` on the verified remote LF export and `browser-preflight.mjs` on the verified
Windows LF export. Both are byte-identical at execution-publication head d13dd7b. No source,
tool, graph or certificate replacement was made to obtain PASS.

| Check | Actual result |
|---|---|
| Exact CurrentUser trust | PASS: human-confirmed import; stored raw DER SHA-256 equals `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`; certificate valid. No LocalMachine/system/JDK global trust modification |
| Remote fixture and loopback scope | PASS: owned JVM PID 12441, exact published `serve` command; one loopback-only listener on 18446. Linux reports the IPv4-mapped representation `[::ffff:127.0.0.1]:18446`, not wildcard `::` or a LAN address |
| Owned SSH forwarding | PASS: Windows PID 34352, existing key, strict known-host verification and ExitOnForwardFailure; only `127.0.0.1:18446` → remote `127.0.0.1:18446` |
| Headed actual Chrome / Playwright | PASS: Chrome `154.0.8037.98`, Playwright/core `1.62.1`, approved Windows Node `24.19.0`; source/executable pins checked. Normal certificate and hostname validation, no ignore-TLS option |
| `https://localhost:18446/__iam_readiness` | PASS: HTTP 200 and exact `IDEA_IAM_UI_READINESS_46` body with trailing LF |
| `https://127.0.0.1:18446/__iam_readiness` | PASS: HTTP 200 and the same exact body; browser harness exit 0, `ENVIRONMENT_TLS_ONLY=PASS` |
| Cleanup | PASS: exact JVM command/PID validated before TERM; process absent. Exact SSH command/PID validated before termination. No listener remains on 18446 on Ubuntu or Windows; browser/context closed |
| Final hashes / DB isolation | PASS: 82 toolchain rows, complete selected-input inventory, 106/106 original exported files, Node-only binary/LICENSE and TLS material unchanged; Windows 10 executable/legal pins unchanged. Both DB-role catalog rechecks still show public 0 tables and the unchanged privilege split |

A first literal-text socket inspection returned nonzero because it expected `127.0.0.1:18446`
instead of Linux's IPv4-mapped representation. A bounded read-only inspection verified exactly
one `[::ffff:127.0.0.1]:18446` endpoint and the owned command/PID. No application/fixture change,
wildcard allowance or TLS weakening was used; this diagnostic failure is not relabelled PASS.

Retained evidence: private remote `tls-01/serve-01.log`, SHA-256
`8a94e47167e3c338e97ca4d0a16e25ab506e42426fc676c5979e9dcc6bca7540`;
Windows `C:/Users/TD-999/.codex/iam-ui-46/browser-https-01.log`, SHA-256
`2a41d17393f4e19d1488a16dfd8c9557be181dce220ac3d79f0cac5dfb756966`.
Postflight completed `2026-10-07T06:10:21Z` (13:10:21 Asia/Ho_Chi_Minh). No password,
private-key bytes, cookie, proof, CSRF, HAR or recorded browser profile retained in evidence.
Private TLS material and the exact CurrentUser test certificate are retained for the approved
later tests; expiry/revalidation and drift STOP rules continue to apply.

This qualifies **HTTPS/browser environment readiness only**, not the actual IDEA Web application,
IAM UI, role/session behavior or Spring Boot HTTPS runtime. Product tests, verifier, deployment,
merge and T008+ implementation remain NOT-RUN / NOT-STARTED. PR #47 Draft/Open; Issue #46 OPEN.
T008 remains the next authorized task, then T009 RED before T010 minimum GREEN.

## 7. Project/Group browser tooling successor — 2026-10-08

Before the Project/Group actual browser execution, the controlled preflight discovered that
the installed Chrome no longer matched the historical 154 pin. It stopped before launching
Chrome or executing a product/browser case. The owned qualification JVM and SSH forwarding
were terminated; its exact marked schema was removed after JVM termination. Historical
Chrome 154 readiness and Account qualification records remain unchanged.

The human explicitly answered **“Duyệt Chrome đang cài cho qualification Project/Group”**
after being presented the new version and exact executable hash. This prospectively admits
the existing installed browser for this Project/Group qualification, not a claim that an
unexecuted test passed or that automatic-update provenance was independently established.

| Controlled input | Exact approved successor |
|---|---|
| Existing executable / publisher | `C:/Program Files/Google/Chrome/Application/chrome.exe`; VersionInfo Google LLC |
| Version / SHA-256 | `155.0.8059.39`; `d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c` |
| Installed-file signature | Authenticode `Valid`, signer CN/O Google LLC, certificate thumbprint `607A3EDAA64933E94422FC8F0C80388E0590986C` |
| Unchanged automation | Windows Node 24.19.0 at its admitted absolute path/hash; Playwright and playwright-core 1.62.1, installed branded Chrome only |
| Unchanged trust / target | Existing section 6 normally trusted test certificate, SAN localhost + 127.0.0.1, valid until 2026-10-14; dedicated loopback 18446 and owned forwarding only |
| Intended use / obligations | Internal test tool only, not application payload; retain applicable existing browser/tool license and notice records. No browser/package download, install, TLS bypass or trust-store mutation |

Only `project-browser.mjs` receives this successor executable/version pin before execution.
Its exact source and input manifest are committed before the run. The historical Account
browser harness remains pinned to the version actually used for its prior evidence. Browser
source/hash/version, certificate validity, graph or target drift still stops the affected
execution. No application contract, authority, dependency or qualification oracle changes.

This record authorizes resumption inside the already approved Project/Group vertical slice.
Actual Project/Group browser results are **NOT-RUN** at this pre-execution publication;
record the successor result separately. No whole-feature acceptance, deploy, merge or timer
action is implied.

## 8. US3 FAST DELIVERY execution continuation — 2026-10-08

The human explicitly authorizes T055–T064 at publication head 45da65c9b92231dda5214318df515afa2cddb2fc:
actual Roles/Assignment HTTP, PostgreSQL, Web and Chrome qualification, inside the same accepted
design and PG2/PG3/PG4 envelope. Reuse the section 7 installed Chrome 155 exact binary, unchanged
Playwright/core, Node, JDK/Maven/cache, TLS certificate/trust and owned database/schema/18446
boundary; no new rights, tooling, listener scope or persistent deployment. Check relevant pins,
source inputs and exact fresh target before each execution, not a repeated complete readiness run.
Internal owner/HTTP tests use the already qualified ephemeral HTTP fixture; final actual Web
uses normal trusted same-origin HTTPS. No Custom publication or Inspector implementation.

The first tracer is RoleAssignmentContractTest, expecting actual GET administration/roles with
exact immutable roleVersionId/code/version and explicit non-selectable DESIGN content. Execute
assignment-red-01 with one test before catalogue implementation. Later approved grant/end/replace
and preview tests run vertically with fresh assignment-red/green/qualification-NN roots.
Source commits/manifests precede runs; coherent milestone is pushed once. Same guarded schema
cleanup after owned JVM exit, database/logs retained, no broad cleanup. Verifier/deploy/merge
NOT-RUN; Issue #46 remains open, PR #47 Draft/Open. Historical sections and hashes unchanged.

## 9. US4 FAST DELIVERY continuation — 2026-10-08

Human authorization at accepted predecessor `febe59dee53fbee060a18692a7d15ce3b4f50b7e` covers
T065–T074 only: real Custom candidate/validation/immutable activation, explicit assignment
preservation/replacement regression and original Web integration. CODEX_ONLY. Reuse the exact
section 7/8 tooling, normally trusted HTTPS/Chrome and dedicated database; no download, dependency,
architecture, deployment or trust change. UI-R01 remains the US3 adapter. Audit query and Inspector
remain outside this slice; registry presence is not qualification. Existing PRA prerequisites are
synthetic controlled fixtures, not qualification of every built-in PRA permission.

Controlled commands: `run-owner-tests.sh <source> <manifest> custom-role-{red,green,qualification}-NN
<one allowed test class> <exact count> {RED,PASS}`; separate source-marked fresh schemas per class,
offline direct Maven goals. `run-web-tests.ps1` uses existing hash-checked Windows cache/Node,
either targeted Custom tests or the consolidated unchanged Web suites. Final
`account-browser.sh <source> <manifest> custom-role-qualification-NN {build,start,verify,stop}`
uses the new synthetic CustomRoleBrowserFixtureCommand, followed by headed
`custom-role-browser.mjs <source> <manifest> <label>`. Only test loopback 18446 and owned SSH
forward, generated private synthetic credentials in a mode-600 fixture, no retained secrets.
The full manifest/raw export/transfer checks precede execution. Package oracle pins unchanged
57 runtime JARs/notices plus exact additive migrations. Terminate owned JVM before exact marked
schema cleanup; retain database and sanitized/hash evidence, remove private browser fixture.

Normal first-party test/harness errors are fixed within this authorization and retained honestly.
STOP on tool/graph/hash/trust/target drift or requirement/security contradiction. No Access
Inspector, generic policy engine, arbitrary Permission or built-in rewrite. PR remains Draft/Open;
whole feature, verifier, deployment, merge and timer changes remain NOT-RUN.

## 10. US5 and final FAST DELIVERY continuation — 2026-10-08

Human authorization at `b4559915abbbb3d8dd097e388d556418656a9c68` covers T075–T082,
then T083–T093 execution/reviewer preparation, not PG5 acceptance or integration. Reuse
the admitted section 7–9 tool/cache/Chrome/TLS/18446/database envelope unchanged. Inspector
is a read-only client of the existing evaluator; history never promotes DESIGN audit.read.
Owned `inspection-{red,green,qualification}-NN` and `final-qualification-NN` roots run one
allowed HTTP/owner test class per fresh source-marked schema. The first tracer expects a
200 all-path result through real session + CSRF at POST administration/access-inspections;
before implementation that route is missing. Each exact committed raw input manifest and
archive identity precedes execution. Same offline direct Maven goals, guarded JVM-before-schema
cleanup and retained DB/private logs. Actual browser fixture/harness is published before use.
No dependency/install, production data, persistent preview, deployment, verifier, timer or merge.
Independent review and final qualification remain distinct; secret detector findings retained.

Published actual-browser contract: `account-browser.sh <source> <manifest>
inspection-qualification-NN {build,start,verify,stop}` plus headed
`inspection-browser.mjs <source> <manifest> <label>`, normal trusted HTTPS only. I01–I08
cover actual direct/Group provenance, owner-gate separation, unsupported independent Audit,
one real synthetic Project owner operation/read resolution, actual lost-read/bad-CSRF refusal,
controlled Web-only 409/503 projection, ordinary refusal, invalidated session/reload and authored
cross-screen keyboard/focus/Escape/privacy. Uppercase UUIDs are equivalent identities; malformed
UUIDs do not submit. The three `iamIntegration.{browser,accessibility,failure}.test.ts` modules
assert actual Chrome observations within this harness, not a separate mock browser suite.
Previously implemented behavior may be qualification GREEN without manufactured RED.
DB oracle: exactly one Project outcome + its Audit, five unchanged prerequisite assignments,
zero assignment/custom owner operations or committed events. Private fixture RAM/mode600 only,
no HAR, screenshot, request-body/token or console retention. Guarded teardown is mandatory.
