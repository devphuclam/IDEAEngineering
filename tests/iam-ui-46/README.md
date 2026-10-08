# IAM UI 46 owner qualification packet

Control: IE-VVP-IAM-46-OWNER-20261007 / first-party execution procedure / v0.2 Draft;
Issue #46 / PR #47, CODEX_ONLY; 2026-10-07 Asia/Ho_Chi_Minh; INTERNAL, Git plus private
mode-600 raw logs. PG2/PG3/PG4 PASS authority is recorded in
[the execution envelope](../../specs/009-iam-rbac-ui-integration/execution-envelope.md).
This procedure adds no product requirement, tool, dependency, permission or route.
Independent runtime acceptance is NOT-RUN; verifier, deployment and merge are NOT-RUN.

## Exact source and commands

FAST DELIVERY successor: commit exact source before each run; push the coherent vertical slice
at its milestone, not every microtask. Earlier pushed-before-run checkpoints remain historical.
Export that exact commit with command-local
`git -c core.autocrlf=false archive`, restricted to `apps/server`, `database/migrations`,
`tests/iam-ui-46`, the existing Server Grant settings, pinned toolchain and resolved-input
inventory. Verify every raw exported file against `inputs.sha256` locally and after extraction;
freeze the complete archive SHA-256 and require identical transferred archive hash. No CRLF
normalization after export, no uncommitted source, reused target, download or installation.

Fresh root per run: `/home/phuclam/idea-iam-ui-20261007-46/run-<label>/source`.
Allowed labels/selectors are constrained in `run-owner-tests.sh`; first label
`owner-qualification-01`, selector `OwnerSessionEligibilityTest`, expected count 1.
After transfer/preflight, execute:

    bash <source>/tests/iam-ui-46/run-owner-tests.sh <40-char-source-SHA> <manifest-SHA256> owner-qualification-01 OwnerSessionEligibilityTest 1 PASS

The published runner pins the admitted JDK 25.0.4.1+1, Maven 3.9.16, complete 82-row toolchain
and 544-row resolved inputs. Only offline resources/testResources/compile/testCompile/Surefire
direct goals execute. No Maven lifecycle/exec/repackage/clean, Node/Web build or package run.
No POM/graph change. Credentials are read only from the existing guarded remote file, with
tracing off; they are not Maven properties, command arguments, log output or repository content.

## Test seam and oracle

T021/T023 shared Web state is tested through exported client/state functions with the already
admitted Vitest 5.0.2. `run-web-tests.ps1 -SourceRoot <fresh-owned-export>/source -SourceSha <SHA>
-Oracle RED|PASS -ExpectedCount <count>` pins Windows Node 24.19.0, 44 installed locked package
versions and their existing cache archives; every used package member must match raw cached
archive bytes before copying to an isolated owned dependency projection. Full package notices
remain with the copies. No primary checkout/cache writes, junction, npm/install or download.
Native config loading and a private cacheDir keep all Vitest outputs in that export. Source,
Node and all shared/projected package-file hashes are rechecked afterwards. RED/GREEN report/log
hashes are retained. These non-browser client/state tests use an external fetch boundary where
needed, never mock our own modules or invent authenticated Server authority. They do not replace
the actual same-origin HTTPS/browser qualification required by each owner story.

First case uses real Boot HTTP sign-in + ordinary session/CSRF on one ephemeral loopback-only
port. A test-only filter observes the principal on the existing protected session route; no new
test/product route. A forged caller ActorId in query/header cannot establish authority. The
owner's read-only admission must resolve exact original Actor + Organization on the real app
connection in a PostgreSQL read-only transaction. Credentials are random private memory only.
This HTTP-only focused owner test does not substitute for the later actual packaged Web/HTTPS
qualification. The production TLS/cookie policy is unchanged; only this isolated test overrides
Secure for loopback HTTP, as in the qualified predecessor owner fixtures.

`OwnerSessionEligibility` already exists from F04/F05. First execution may be GREEN without
production edits; retain that as previously implemented behavior newly qualified. Never sabotage
the existing seam to manufacture RED. A genuine gap gets a successor failing test before repair.
Later qualification includes revoked, stale, disabled, idle/absolute and runtime-instance cases.

Successor `owner-qualification-02` executes the 10-case current-eligibility matrix. Boundary time
is controlled at one microsecond before/exactly expiry, no wall-clock waiting. The new-runtime
case qualifies the adapter's runtime binding with a second SessionService instance, not full
process restart/recovery. All cases still enter through the actual HTTP sign-in seam first.

T011 first vertical RED: `transaction-red-01 IdentityTransactionsTest 1 RED`. The new owner
transaction method is an explicit unimplemented seam, not sabotage of the existing F03 paths.
The first owner test expects one synthetic state change plus required owner outcome, two
authorization records and Audit to commit together. New callbacks must revalidate current owner
authority at coordinated admission and finalization; the shared seam derives Actor/Organization
from IAM, holds lock 73003002, and owns commit/rollback. It does not invent Project/RBAC rules,
an HTTP route, Permission, generic CRUD coordinator or owner evidence schema.

T013 first schema RED: `schema-red-01 IamSchemaPrivilegeTest 1 RED`. Migrate V1–V10 in the
owned schema, then invoke the successor migration path and require migrator-owned Project,
Project Membership, Business Group and Group Membership tables. Missing successor state is a
real RED; no fixture grants or product HTTP behavior are inferred. Later vertical schema tests
qualify retained predecessor revocation, immutable role/version content, separate candidate
staging, same-Org/Project constraints and direct app protected-DML/SET ROLE refusal. The schema
is still discarded only through the published exact-marker runner after the test JVM exits.

Current successor adds V11 only inside fresh test schemas. The schema suite migrates V1–V10,
retains a synthetic revoked predecessor assignment and checks V11 upgrade/repeat, exact 8-role /
25-permission content without automatic grants, sealed content, app privilege denial and relational
scope constraints. Normal owner/eligibility fixtures also migrate V11 fresh. Raw V1–V10 hashes
remain pinned to the accepted predecessor. This does not qualify an actual Project/assignment/
Custom-role HTTP workflow or deploy the successor to a retained/public/preview database.

T015's `IamTestFixture` gives stories a named `SignedInActor` and the qualified owner transaction
port. It wraps the same real HTTP fixture; no password/cookie/proof in the value object, no raw
ActorContext constructor, automatic grant, schema cleanup or new production abstraction.

## Database and cleanup

T020 HTTP mapping tracer is `http-contract-red-01 IamHttpContractTest 1 RED`.
The explicit test-only adapter lives solely in test source and is excluded from product scanning;
it is not a new product API or implementation of any UI-I/P/R operation. It enters through real
HTTP sign-in and ordinary security/CSRF. New reviewed adapters opt into bounded safe reason /
Server-generated correlation bodies; legacy Identity statuses/empty bodies and security-filter
refusals remain unchanged. First RED expects 400 rather than the unmapped 500. Later mapping,
shape/privacy/correlation and legacy compatibility cases precede minimum GREEN repairs. The
callback retains session cookies only in private test memory and clears them on exit. Real
PostgreSQL target, immutable migrations, direct offline goals and cleanup guards are unchanged.

T018 first evaluator RED is `authorization-red-01 AuthorizationDecisionTest 1 RED`.
It enters through the actual Server-established context, uses current read-only IAM eligibility
and resolves all applicable exact assignment/version paths on the same app transaction.
The first tracer expects the positive union of separate legacy AA@1 and AA@2 prerequisites;
no account type, role-name bypass, LIMIT-1 result, owner business success or client capability.
Later direct/Group/scope/period/unavailable cases precede any necessary repair. Supported legacy
callers must delegate to the same resolution logic without rewriting historical one-path evidence.

Multi-owner advisory reads use a caller-owned REPEATABLE READ/SERIALIZABLE snapshot. Authoritative
owner commands use the already-qualified READ COMMITTED transaction under lock 73003002 so a
blocked security writer is observed after acquisition. The evaluator never changes isolation or
acquires this lock itself; uncoordinated READ COMMITTED evaluation is refused. It does not turn a
snapshot/Decision into a capability or replace final current owner/IAM revalidation.

T016/T017 use `project-read-red-01 ProjectAuthorizationReadTest 1 RED` and its GREEN successor.
The Project-owned query reads current exact Project, Project Membership and Group Membership
facts in the caller's connection, filtered to the Server-established Organization and Actor.
It is not a second policy evaluator, public directory, participant query or UI-P01–P13 API.
Named migrator-seeded Project/Group rows are synthetic prerequisites only. Read-only PostgreSQL
transactions prove no mutation, activity refresh, security lock acquisition or IAM mutation
re-entry. Half-open periods, canonical termination, same-Project and same-Organization filtering
are incremental tests before the single evaluator. No schema/POM/tool/graph change is needed.

Only `idea_ddm_iam_ui_20261007_46`, existing migrator/app roles, and one fresh
`iam_ui_<32 lowercase hex>` schema per run. Java verifies DB/owner/role and creates an exact
`IDEA_IAM_UI_RUN:<source>:<schema>` marker before migrating immutable V1–V10 plus candidate V11 in that schema.
Named synthetic fixtures confer no new role or membership. No public migration, preview,
company data, Vault, live adoption or DB drop.

After the owned Server and forked test JVM have exited, the runner validates exact DB, schema,
migrator owner and source marker, then drops only that exact schema. Retain the DB, export and
private logs. Oracle: zero exact schema remainder, public still empty, controlled inputs/tools
unchanged. Failures retain diagnostics and attempt identity; missing/drift tool/input, unexpected
target/role/marker or remaining JVM stops cleanup/execution. A normal first-party test/compile
defect is engineering work, not missing dependency or permission evidence.

## Account MVP consolidated qualification (successor, pre-execution)

Existing execution envelope, tool identities, approved synthetic database and trusted certificate
are reused. This is not deployment or live adoption. V1–V11 bytes remain unchanged; additive V12
qualifies exact-purpose/login proof supersession. Original authored UI presentation is reused from
`feat/f04-admin-iam-ui@9160ec27dec2b80b96c36adf94460864fd265099`; actual state/authority comes
from the Server, never from its former mock collections or demo sign-in. Future screens stay disabled.

Commands, all against one exact committed/exported/hash-verified source:

    bash tests/iam-ui-46/account-browser.sh <source> <manifest> account-qualification-04 build
    pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical-transferred-JAR> -RepositoryRoot <verified-export>
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> account-qualification-04 start
    <approved-Windows-Node> tests/iam-ui-46/account-browser.mjs <source> <manifest> account-qualification-04
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> account-qualification-04 verify
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> account-qualification-04 stop

Fresh root: `/home/phuclam/idea-iam-ui-20261007-46/run-account-qualification-04`.
Actual packaged Server binds only `127.0.0.1:18446`; an owned Windows SSH loopback forward exposes
`https://localhost:18446/` to installed headed Chrome 154.0.8037.98 / admitted Playwright 1.62.1.
Normal CurrentUser-root trust and SAN verification; no TLS bypass. Existing preview 18444 is untouched.
Committed-response loss intercepts the actual Chrome response at its CDP response boundary;
it never substitutes a Node HTTP proxy/trust context for the actual browser request.
Build uses admitted Node 24.21.0 Linux and direct offline resources/testResources/compile/testCompile/
jar/Boot-repackage goals only. Package oracle requires exact 57 runtime JAR hashes, zero JSR305/
build-tool provider leakage, actual Web, three notices and byte-identical controlled migrations.

Oracle: synthetic actual interactive Q15 adoption and repeat (one new Super@2 assignment, preserved
Super@1/bootstrap and zero console sessions), then branded real login/context, list/detail/create
PENDING, private exact-login setup reissue, refused old proof, recipient credential redemption and
fresh login, disable/old-session refusal, DISABLED reset without re-enable, separate re-enable with
stable identities and new-password login, ordinary-user refusal, reload, committed response loss
without false success/retry, basic keyboard/responsive/private boundaries, logout/unmount. This is
US1 browser qualification, not whole-feature accessibility or general role-assignment qualification.

Random synthetic credentials and proof/cookie/CSRF values stay in private transient memory; only
the fixture seed file is retained temporarily at mode 600 in the owned root and deleted after test.
No screenshots/HAR/traces/private diagnostic printing. Console uses actual packaged operator main
via PropertiesLauncher and a PTY with non-echoing password prompt, never a test route or startup grant.
Positive prerequisite AA@3 is explicitly fixture-seeded, not claimed as implemented general granting.

Affected predecessor `HttpSessionFlowTest` (83) and `IdentityFlowTest` (20) keep their assertions;
the bounded `IamRegressionSchemas` retargets only to new owned UUID schemas in this same approved DB,
with exact owner/source markers before cleanup. `AccountIsolationTest` proves no implicit Project/
Group membership or Role Assignment through actual create HTTP. Runner also checks zero schemas
for the exact executed source, unchanged tools/inputs and empty public. No old F03/F05 DB reuse.

On failure retain safe stage/result and private logs, stop only the owned process/forward, then
guard cleanup by exact DB/schema/source/owner after JVM exit. Normal first-party defects get a
committed successor and fresh numbered target; target/tool/dependency/right drift is STOP.
Do not drop database or delete predecessor logs. No verifier, preview change or merge.

## Project/Group consolidated milestone

UI-P01–P13 uses the same owner/session/evaluator boundary and actual authored Web, not fixture
HTTP routes. `ProjectBrowserFixtureCommand` is test-only and not in the executable package.
`account-browser.sh` also accepts `project-qualification-NN` and selects that named fixture;
the `console` mode is deliberately unavailable for Project runs. V1–V12 remain unchanged;
additive V13/V14 protect owner evidence and provide four narrow state ports without blanket DML.

Executed final source `1d3fbd4d35650ec2c561032ae605e440a639473c`, manifest
`98013f5adae745c779e1809caf650ca1b2f9c8f157198d22fb987f50e8d2cc77`, fresh owned
`/home/phuclam/idea-iam-ui-20261007-46/run-project-qualification-27`:

    bash tests/iam-ui-46/account-browser.sh <source> <manifest> project-qualification-27 build
    pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical JAR> -RepositoryRoot <raw verified export>
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> project-qualification-27 start
    <admitted Windows Node> <raw verified export>/tests/iam-ui-46/project-browser.mjs <source> <manifest> project-qualification-27
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> project-qualification-27 verify
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> project-qualification-27 stop

Actual installed Chrome 155.0.8059.39 was separately human-approved and pinned before this run
in [execution envelope section 7](../../specs/009-iam-rbac-ui-integration/execution-envelope.md#7-projectgroup-browser-tooling-successor--2026-10-08).
Historical Chrome 154 Account evidence/harness remains unchanged. Browser P01–P08 qualifies
Org versus Project-only scope, explicit Project→Group participation/history, ordinary refusal,
stale state, actual lost committed response with unchanged-ID resolution, unavailable refresh,
bounded keyboard/private/cookie and logout/reload. Same normal TLS trust/loopback18446, no bypass,
HAR/screenshots/secret diagnostics or preview18444 change. Final fixture verifies actual DB state.

Affected backend runs use the named Project owner/data/atomicity/HTTP selectors in
`run-owner-tests.sh`, each with a fresh marked schema. The expanded reissue 5/5, Account HTTP6/6
and isolation1/1 are affected US1 regression; do not rerun the full legacy suite for every task.
Web runner supports an optional exact `-TestFile` for targeted RED/GREEN and complete 36-case
milestone + TypeScript, always from verified cached packages, no npm install/download.
Full exact-source results, retained failures/limitations, hashes and cleanup are in
[handoff section 18](../../specs/009-iam-rbac-ui-integration/integration-readiness.md#18-projectgroup-usable-vertical-slice--2026-10-08)
and the [run ledger](../../specs/009-iam-rbac-ui-integration/evidence/project-group-runs.tsv).
Both listeners and owned schemas have been cleaned; DB and historical logs retained. Next is
the authorized US3 assignment slice, not deployment/merge or whole-feature completion.

## Role Assignment consolidated milestone

UI-R01 and UI-R05–R09 use real current IAM/evaluator/delegation and authored RBAC/wizard UI.
No Custom Role publication, Inspector route, DESIGN-to-executable fallback or test-only HTTP
route. `AssignmentBrowserFixtureCommand` is excluded from the application; its sealed business
role is a migrator-only prerequisite, not qualification of Custom Role activation.

Final package/browser source `6687439cd6c26ee2612effadba69b4e647b3cf42`, manifest
`e99f5a2a25aec13359a5e6b0afedeb494851dd0c20ec76419ef25f20e6449cc5`, owned
`/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-25`:

    bash tests/iam-ui-46/account-browser.sh <source> <manifest> assignment-qualification-25 build
    pwsh tools/iam-ui-readiness/package-preflight.ps1 -JarPath <identical JAR> -RepositoryRoot <raw export>
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> assignment-qualification-25 start
    <admitted Windows Node> <raw export>/tests/iam-ui-46/assignment-browser.mjs <source> <manifest> assignment-qualification-25
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> assignment-qualification-25 verify
    bash tests/iam-ui-46/account-browser.sh <source> <manifest> assignment-qualification-25 stop

Console mode is forbidden for assignment runs. Same exact database, fresh marked UUID schema,
offline tools/cache, Chrome155/Playwright1.62.1, normal loopback HTTPS18446; preview18444 untouched.
R01–R09 cover exact independent roles, preview, atomic replace/end history, stale/refused states,
Project filtered Actor versus Group principal, DESIGN option refusal, actual committed response
loss/same-ID resolution, unavailable reads, keyboard/privacy/logout. Final DB oracle requires
7 accepted + 1 refused, 16 authorization rows/8 Audit, no duplicate or implicit membership.

Assignment HTTP10/atomicity4/recovery3; affected Account11/Project9/evaluator22 across retained
exact-source runs; complete Web44 + TypeScript. No same-source grand total or new legacy103 claim.
Executed failures and observation/fixture corrections remain in [section 19](../../specs/009-iam-rbac-ui-integration/integration-readiness.md#19-role-assignment-ui-usable-vertical-slice--2026-10-08)
and [ledger](../../specs/009-iam-rbac-ui-integration/evidence/assignment-runs.tsv). V1–V14 immutable;
V15 protects owner state/evidence and narrows assignment termination, not blanket app DML.
All fixture listeners and schemas cleaned after owned JVM exit; DB/logs retained, no deploy/merge.
