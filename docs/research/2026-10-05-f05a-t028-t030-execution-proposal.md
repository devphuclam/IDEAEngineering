# F05-A — T028/T030 Server Grant execution proposal

| Control | Value |
|---|---|
| Stable ID / class | IE-PLAN-F05A-GRANT-20261005 / bounded execution proposal |
| Version / document status | 0.1 / Draft for Project Reviewer decision |
| Product normativity / repository instruction | INFORMATIVE / NOT-APPLICABLE; proposed work, not an execution authorization |
| Owner / author / worker | Project Reviewer Nguyễn Huỳnh Phúc Lâm / Codex / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer; implementation, test-boundary, tooling and environment authorization PENDING |
| Evidence/publication date / timezone | 2026-10-05 / Asia/Ho_Chi_Minh; no backdating |
| Inspected repository baseline | `0ed9d3296958d7901681718f200d674366bd91d5`, PR38 Draft/Open, Issue37 Open |
| Upstream | [T027 closure](2026-10-05-f05a-t027-closure.md), [current preparation freeze](2026-10-05-f05-t027-baseline-freeze.md), [PH1 tasks](../../specs/005-ph1-foundation-custody/tasks.md), FR-008–012/014, [PH1 contract](../../specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md), [ADR-0013](../adr/0013-separate-artifact-control-and-data-planes.md) |
| Downstream | Proposed partial T028/T030 Server checkpoint; Gateway/Adapter T029/T031 and Receipt acceptance T032 remain separate |
| Classification / retention | INTERNAL; retain with PH1, exact commands/source/input hashes, historical gates and private-log access limitation |
| Change / supersession | New proposal after T027 closure; no predecessor execution, rights or frozen profile record replaced |
| Review trigger | Scope, owner authorization, schema, tool/version/hash/graph, target, security/wire profile or external-source use changes |
| Evidence / tailoring | Read-only source/cache/host observations below; all proposed implementation/tests NOT-RUN. STANDARD-GUIDED under IE-STD-AUTH-001, ISO 10007:2017 and ISO/IEC/IEEE 29119 test-information tailoring; no conformity claim |

## 1. Outcome and scope

The next tracer bullet is **Server admission → exact signed Grant → durable same-operation lookup**.
It uses a real authenticated Server session and real PostgreSQL. It does not move bytes, run a
Gateway, accept a Receipt or create accepted Artifact custody. A valid Grant is permission for
bounded private byte work, not a completed custody result.

T028 is broader than this first checkpoint. Its Receipt/custody and full failure obligations remain
open for T032/T034. Neither T028 nor T030 is marked complete merely because the first issuance
test passes. T027 remains COMPLETE/PASS; F05-A remains IN_PROGRESS. No Tracker/timer action is
authorized by preparation or by generic continuation wording.

### Proposed first boundary for approval

Reuse the qualified real HTTP sign-in path to establish the principal. A test-only internal bridge
captures that Server-established context at the existing protected session boundary. Invoke the
real `TransferGrantService` with this context and a Server-controlled admitted transfer scope.
Actor and Organization are resolved through `OwnerSessionEligibility`, not taken from command
input. This first unit has **no new HTTP route or Swagger operation**. It does not qualify the
eventual client-facing Grant HTTP/CSRF boundary; that mapping needs its own explicit contract
before public exposure.

**Eligibility is not owner authorization.** The service also requires an explicit owner admission
decision for the exact operation/object and configured Gateway allocation, revalidated before
commit. Proposed initial qualification uses a test-only owner decision backed by a fixed synthetic
Actor/Organization/object allocation. Wrong allocation is refused. There is no allow-all default
in the service and no test owner admitted in ordinary application configuration. The owner seam
must carry the exact scope, not an arbitrary client-selected candidate plus a boolean `isAdmin`.

This is a proposed bounded qualification boundary, **not** approval for a product RBAC shortcut,
a permission-free production Grant endpoint or arbitrary eligible-user upload. Real Document/
Check-in owner authorization is not qualified here. The F04 permission-free sample decision does
not apply to F05. Super/Account Administrator definitions and assignments remain unchanged.

If the Project Reviewer instead requires a supported Grant HTTP route or a concrete product
Permission in this first unit, reconcile that exact owner/Permission/scope/CSRF contract before
code; this proposal does not invent it indirectly.

## 2. Ordered execution and completion criteria

Approval of the behavior/environment proposal does not bypass the graph/rights gate in §4.

1. **Read-only graph reconciliation.** Resolve the cached Server application/test models and
   three selected plugin acquisition models, including JUnit provider, parent/BOM management,
   scopes/exclusions, core imports and bundled material. Publish an exact hash/rights inventory
   and a prospective T028/T030-specific execution record. Completion: no unaccounted selected
   artifact, no missing actual grant, and explicit applicable admission for each used input.
   Custom/unclear terms require the established authority; an old exception is not inherited.
2. **Publish the exact RED source.** Use Spec Kit's existing tasks and TDD, one behavior at a time.
   Commit/push the test and guarded fixture/runner, freeze raw-byte input manifest and exact
   source SHA. Completion: a reviewer can identify what will execute before it executes.
3. **Provision only the proposed test DB after explicit environment approval.** Verify name
   absence again immediately before creation; create from `template0` with existing roles.
   Completion: empty `public` witness and correct owner/role/privilege checks. No tests migrate
   that public schema in this checkpoint; migrations run in owned UUID schemas only.
4. **Execute RED.** First test expects an exact Grant from the real admitted context. Missing
   service/API compilation may be an initial RED witness, followed by a behavior failure once
   the smallest compilable skeleton exists. Completion: retained genuine failure for the intended
   behavior, not a missing tool/cache, network/certificate defect or assertion deliberately broken.
5. **Minimum GREEN.** Add the Server service/persistence/signing seam necessary for that behavior;
   run the same test on a new exact committed source. Completion: exact persisted/signed claims
   match and no accepted custody appears. Then proceed vertically through §3, not all tests first.
6. **Checkpoint regression/publication.** Run focused tests and applicable IAM/owner/schema
   regressions on exact source, record counts/failures/skips, guarded cleanup and source-to-head
   trace. Completion: reviewable results, residual limitations and T028/T030 remaining coverage.
   External review follows; PR38 stays Draft/Open, no merge or automatic whole-card closure.

## 3. Test/evidence contract — all NOT-RUN

Use a controllable authoritative `Clock`; no minutes-long expiry wait or host clock change.
Use fresh synthetic users, candidate identities and key pairs. Grant bearer bytes/private keys
remain in RAM/private test output only, never Git, URL, console or retained public evidence.

| Slice | Observable oracle | Coverage / limitation |
|---|---|---|
| G01 first issuance | Real sign-in establishes Actor; exact Actor/Organization/Operation/Transfer/Grant/Gateway/endpoint/object/direction/size/digest/range/purpose/key/version/validity agree between persisted scope and signed frame. Distinct relevant IDs; candidate remains private. | First executable T028/T030 behavior; no Gateway or custody acceptance |
| G02 eligibility and scope refusal | Anonymous, revoked/disabled/stale session, wrong Organization/object/owner allocation or unavailable configured Gateway cannot obtain a Grant; client ActorId cannot establish authority. No partial issued Grant/Transfer success. | Current IAM plus bounded owner-decision seam, not general product RBAC qualification |
| G03 frozen codec | Independent verification with pinned Server public key uses the unchanged v1 frame; wrong key/purpose/audience/version and altered claims refuse. No filesystem path/permanent credential enters frame or safe result. | Product signer/codec integration; T027 vectors are predecessors, not product execution evidence |
| G04 same-operation lookup | Identical retry resolves one Transfer/result without duplicate Grant issuance or mandatory evidence. Changed immutable scope is a bounded conflict. Concurrent identical requests arbitrate one original operation. Lost response resolves by same ID. | Lookup access is owner-policy-controlled, not a universal F04 originating-Actor-only database constraint |
| G05 expiry and renewal | Grant expires at equality; before/at/after boundaries use controlled time. Explicit renewal issues a new GrantId only after fresh eligibility/owner/allocation checks, retains OperationId/TransferId and verified progress, and does not silently extend old validity. | Same-ID lookup is distinct from explicit renewal; actual Gateway use/replay remains T029/T031 |
| G06 commit/failure | Invalidation committed before authoritative issuance/renewal commit prevents success. Required persistence/evidence or commit failure leaves no partial issued result; uncertain response is not mislabeled rollback or retried under a new ID. | Reuse IAM coordination semantics; do not apply F04 sample event type to custody |
| Regression | Applicable existing IAM/session, owner coordination and schema tests preserve accepted behavior; additive migration has upgrade/repeat and least-privilege coverage. | Exact selectors and fixture targets are published before execution, not copied from F04 runner blindly |

Scope/evidence oracle: zero newly accepted `artifact`, `artifact_location` or `transfer_receipt`
state in all issuance/lookup/renewal slices. Do not invent a custody event merely to reuse F04.
Required owner outcome/Audit meaning must be mapped to DOC-06 before its implementation; a
missing mapping is a contract gate, not permission to create a generic event framework.

Retain exact test method/count, source commit, raw-byte manifest/transfer hash, command, DB/schema,
role identity, profile/public-key fingerprint, safe claim comparison, failure/rollback oracle,
log hash and cleanup result. Public hashes identify private evidence but do not substitute for
independent raw-log inspection. Record any actual acquisition/realm different from the frozen
inventory as STOP, not automatically admitted by a successful build.

## 4. Tooling gate and command proposal

### Read-only observations on 2026-10-05

SSH to existing `phuclam@192.168.137.33` reached `ideaddmserver`. Existing host authentication
was used without recording credential material. No package was installed or downloaded.

| Input | Exact observed source / result |
|---|---|
| JDK | Temurin `25.0.4.1+1-LTS`, `/opt/idea/tools/jdk-25.0.4.1+1`; java SHA-256 `7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3`; javac `86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e` |
| Maven executable | Existing `3.9.16` distribution at `/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38`; launcher SHA-256 `f9381d0cb98abaaf9592dae421eddc497e84ed9bfb723b84c111d1350863c3a2`. Current launcher hash matched; distribution/version authority remains the retained T027 toolchain, not a newly run build |
| PostgreSQL | psql `18.6`; `/usr/bin/psql` SHA-256 `a200e38c89b111d3abdf26927b186fdd423bef3d84f157af0f4b65db6f8e6c94`; read-only live server version `180006` |
| Existing application/test history | `/home/phuclam/idea-f03b-Qw74tmdH/dependency-tree.json`, SHA-256 `a1a2b2aaef870adf23c4de4f94dfaf5726810500d61d4f717384d14e7584e1c5`, matched [F03-B intake §8](2026-09-30-ph1-f03b-http-security-intake.md#8-implementer-follow-up--2026-09-30); 95 unique coordinates, 62 compile / 4 runtime / 29 test tree nodes. Historical tree, not current resolved graph |
| Current application POM | `apps/server/pom.xml` Git blob `8a6f0e54ea7d59e5839ebff513bd9903b802a19f`; unchanged accepted build input. Includes Swagger UI5.32.14 and Web lifecycle binding, beyond historical tree |
| Swagger cached input | `org.webjars:swagger-ui:5.32.14` JAR SHA-256 `d17ca6b09c60518574c14d4a40318dc58a11ea92a962e94f30e5a286e1efa4a6`; its existing intake remains applicable, not a new Swagger change |
| Private credential prerequisite | Existing `/home/phuclam/.config/idea/f03a-test.env`, owner `phuclam`, mode600, checked without exposing contents. Contains existing role credentials; no new role/password is proposed |

Three proposed plugin roots are cached. Their exact JAR / POM hashes respectively are:

| Root | JAR SHA-256 | POM SHA-256 |
|---|---|---|
| `org.apache.maven.plugins:maven-resources-plugin:3.5.0` | `2c923c63a197565a3e78f2b16d762d0f49bb83250dd2b1e6286704ea0f447060` | `9f2275ca2ba3a3ab38caf6c2bc21be787c7305ea5333d1c33f52a530afc0bc7f` |
| `org.apache.maven.plugins:maven-compiler-plugin:3.15.0` | `6ea0ca0558ccf248c514aa94908d1f895a92e9b4e4604c1bb29f7a4ab1b833f0` | `2d2f7a7073c1def3b1473fbedad7dbfc559ed6fb0dc5a94edc347fd4905e7651` |
| `org.apache.maven.plugins:maven-surefire-plugin:3.5.6` | `5fea3d2f0ad1d790717d66aa31d995c22ca528612316f8380d67c40367af3464` | `a9fe60995e2bf4146e3bdd4e4a12737bdafd23cffa52626af57e2162cb077ee1` |

Paths follow the existing `.m2/repository/<group-path>/<artifact>/<version>/` convention. These
root checks are not a complete plugin graph, rights disposition or Maven execution PASS.

The proposed direct-goal path avoids the Server's `generate-resources → exec-maven-plugin → Node
Web build` lifecycle and does not invoke Boot repackage. Thus it does not require a new use of
the nine-artifact T043 Web build-tool exception or pretend that T027's 38-JAR application/99-node
packaging graph covers the Server. This is a candidate path; the first authorized run must confirm
the actual selected goals/realms. Any unapproved lifecycle/extension execution stops the run.

Read-only descriptor inspection of Surefire exposed 19 dependency entries; a naive descriptor
union/cache probe reported missing repository pairs for Commons Lang3 `3.20.0`, Maven Shared
Utils `3.3.4`, Plexus Classworlds `2.9.0` and Component Annotations `2.2.0`. **This is not evidence
that all four are required downloads.** Surefire Shared Utils' actual published POM describes a
relocated bundle and has no direct dependencies; its shaded contents/NOTICE still require
accounting. Resources' earlier exclusions/core-provider findings are in the retained
[Maven realm investigation](2026-10-03-f05a-q02-maven-core-realm.md). Reconcile actual POM acquisition
versus descriptor/shaded/core visibility before claiming a blocker or substituting a version.

Surefire API/common POMs also name JSR305 as `provided`. That observation is **not** a new license
grant or proof of runtime use/absence. Confirm actual selected acquisition/class/provider inputs;
if JSR305 is required, preserve BLOCKED-LEGAL and stop. Do not silently inherit the different
Boot-plugin exclusion experiment or add a second exception for missing rights.

The existing read-only cached-POM audit, invoked in memory with the three test-plugin roots and
the JUnit provider root, stopped at the provider's standalone default model:
`MISSING_CACHED_POM=org.junit.platform:junit-platform-engine:1.14.2`. This is not yet evidence
that the actual Server test execution requests that version: its project test graph and Surefire
provider selection/mediation must be reconciled, rather than silently adding or replacing it.
An additional full cache capture became unresponsive and was terminated at the exact owned
local SSH child only; no Maven/Server process or remote DB was touched. No graph output from
that incomplete capture is treated as a final inventory. These are preparation limitations,
not a T027 failure or JSR305 requirement witness.

### Proposed command — NOT EXECUTED

Run only after an exact new Server-test graph/rights receipt and execution approval. Use a fresh
archive with no `target` or generated Web resources, empty controlled user/global settings,
cleared unapproved Maven/JVM options and no `.mvn` extension/config. A private runner checks pins
and DB/schema gates before calling the command. It loads secrets privately with tracing disabled;
no password appears in CLI arguments, URLs or retained command evidence.

```bash
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:$PATH"
task_maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
cd /home/phuclam/idea-f05a-t028-t030-20261005-37/run-<owned-id>/source/apps/server
"$task_maven" -o -B -X \
  -s ../../settings.xml -gs ../../settings.xml \
  -Dmaven.repo.local=/home/phuclam/.m2/repository \
  -Dtest=CustodyBoundaryTest -DfailIfNoTests=true \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile \
  org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test
```

`run-<owned-id>` is a future fresh owned target, not an executable literal or existing directory.
The settings file above is in that run's `source/` root. Publish its bytes, runner, concrete target
and hash manifest before the first run. Retain Maven diagnostics privately: any credential/proof
disclosure detected there stops publication and the affected logging must be corrected before
reuse. No `clean`, lifecycle `test/package`, `install`, `deploy`, dependency goal, Boot goal or
Web packaging is authorized by this command proposal. Source tests launch the actual Server;
not invoking the Boot packaging plugin is not replacing Server HTTP/PostgreSQL with mocks.

**Current gate: GRAPH/RIGHTS RECONCILIATION PENDING; Maven/test execution NOT AUTHORIZED.**
Engineering can complete the remaining read-only inventory without additional user facts. Then
request only the exact needed execution/process disposition; do not ask for a blanket license
approval now. Known obligations are retained; unknown grant/custom-term questions escalate by
[external intake](../agents/external-source-intake.md). T036/legal/commercial remain separate.

## 5. Proposed environment and destructive-action guards

| Target | Proposal / read-only observation |
|---|---|
| Host | Existing Ubuntu `ideaddmserver`, PostgreSQL only `127.0.0.1:5432` on that host, never Windows-local assumed DB |
| New database | `idea_ddm_f05a_20261005_t028`; catalog count0 observed via read-only query. Recheck immediately before creation; if present STOP, no reuse |
| Creation | `template0`, owner `idea_ddm_migrator`, runtime `idea_ddm_app`, existing credentials/roles only. Operator/sudo step after explicit approval; retain DB after checkpoint, no DROP DATABASE |
| Role witness | Both existing roles observed `super=false`, `createdb=false`, `createrole=false`; exact authentication, DB/public no-CREATE and ownership/grants rechecked on new DB before tests |
| Owned root | `/home/phuclam/idea-f05a-t028-t030-20261005-37` absent at inspection; fresh per-run subdirectory, physical path/owner/symlink guards before any write |
| Schema | One fresh `f05_<32-lowercase-hex>` per invocation, migrator-owned, source/run marker. Migrate/test only that schema; app has no DDL or migration-history mutation authority |
| Server test process | One owned actual Server process bound only `127.0.0.1` on an OS-assigned ephemeral test port; no persistent/wildcard listener. No change to preview18444 or Gateway18447 |
| Cleanup | Stop only owned test JVMs before schema cleanup. Exact DB/name/owner/UUID/run-marker checks; drop only that run's UUID schema. Retain logs/DB; marker mismatch or live JVM means STOP, not broad cleanup |

The internal-session bridge may follow the existing F04 test-local HTTP seam, including its
test-only cookie configuration. It is not a production transport-policy change or a new HTTPS
qualification. TLS/gateway/network transfer evidence remains at T027/T029/T034; synthetic
credentials on loopback must not escape into company accounts or public logs.

Old F02/F03/F04 review DBs, `idea_ddm_dev`, preview DB, company data and Vaults are outside this
target. The existing F04 runner is not reused unchanged: it pins another DB/schema, F04-only
authorization and Python. This proposed runner uses Bash/JDK/existing Maven only; Python, Node,
npm, Playwright, packaging and Windows/system trust-store changes are outside this unit.

## 6. Source boundary and schema decision

Primary task paths remain `apps/server/src/test/java/com/idea/ddm/custody/CustodyBoundaryTest.java`
and `apps/server/src/main/java/com/idea/ddm/custody/TransferGrantService.java`. Supporting first-party
codec/persistence/owner-admission code, a named synthetic identity/session fixture, guarded
Server-test runner and checkpoint evidence may be proposed as required by the approved slices.
Reuse the qualified first-party codec contract; do not import a third-party token framework.

The existing V1 Transfer/Grant tables do not persist the complete frozen Organization/Gateway/
endpoint/object scope. A minimal additive migration will likely be required. **No V9 exists or is
authorized by preparing this note.** Publish an exact schema delta and least-privilege/test
contract before migration execution; preserve V1–V8 byte-identical. Do not solve scope gaps by
placing unchecked claims only in the signature. Freeze/enforce the immutable operation scope;
range renewal is not permission to change the underlying object/digest/endpoint.

Keep application POM/dependency versions/graph, IAM role contents and qualified profile unchanged.
No Gateway/Adapter product implementation, Receipt acceptance, dispatcher, Web/Desktop UI,
Check-in/Generation, preview redeploy, public API, verifier, merge or work-item closure here.

## 7. Review decisions requested and actual preparation result

| Decision | Recommendation / approval sought | Current state |
|---|---|---|
| First implementation/test boundary | Approve §1/§3 partial Server Grant vertical slice: real session/PostgreSQL, explicit bounded test owner-allocation seam, no public route or general RBAC claim | PENDING |
| Environment | Approve §5 only: new named DB from template0, existing separate roles, UUID-schema migration/test, owned ephemeral loopback Server, guarded schema cleanup, retain DB | PENDING |
| Tooling execution | Finish read-only graph/rights reconciliation and publish exact successor admission/process record for §4 before execution; no download or expired-exception reuse | PENDING; not a blanket approval request |
| Additive schema | Present exact delta/test/privilege contract before executing it | PENDING; no migration authored |

Preparation performed: clean active worktree and exact GitHub head/state confirmed; live SSH,
JDK/tool hashes, PostgreSQL version/role flags, proposed DB/root absence and cached root-plugin
hashes checked; historical tree hash/count reconciled; POM/descriptor/shaded/provided distinctions
identified. No Maven goal, Server launch, DB creation/migration, test, TLS/port provisioning,
package/download, timer action or merge occurred. This file is the only repository change.

Before continuing, read this proposal at the exact published head. After the decisions above,
use the existing Spec Kit implementation/TDD route; publish source/hash/target before execution
and stop on actual drift. No new constitution/specification workflow or T027 requalification is
needed merely to start this bounded successor.

Author checks: relative document links and recorded Git/SHA-256 pin lengths checked; scope review
kept all current implementation/execution decisions PENDING. Staged whitespace and secret-like
literal checks are publication checks only; application tests and verifier remain NOT-RUN.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-05 | Concrete next Server Grant boundary, read-only host/cache observations, proposed test/direct-goal/environment package and explicit remaining gates |
