# IAM UI 46 controlled readiness envelope

| Control | Value |
|---|---|
| Stable ID / class / version / status | IE-EXE-IAM-UI-46-20261007 / readiness configuration and gate record / 0.1 / Draft; PG4 BLOCKED pending actual package/HTTPS results |
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

Package and HTTPS results currently **NOT-RUN** at this pre-execution publication.
PG2 **PASS**; PG3 **PASS**; PG4 **BLOCKED** until their actual successor results are recorded.
T008 remains NOT-STARTED. No verifier, deployment, merge, company/production data or timer action.
