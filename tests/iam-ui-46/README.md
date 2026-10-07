# IAM UI 46 owner qualification packet

Control: IE-VVP-IAM-46-OWNER-20261007 / first-party execution procedure / v0.1 Draft;
Issue #46 / PR #47, CODEX_ONLY; 2026-10-07 Asia/Ho_Chi_Minh; INTERNAL, Git plus private
mode-600 raw logs. PG2/PG3/PG4 PASS authority is recorded in
[the execution envelope](../../specs/009-iam-rbac-ui-integration/execution-envelope.md).
This procedure adds no product requirement, tool, dependency, permission or route.
Independent runtime acceptance is NOT-RUN; verifier, deployment and merge are NOT-RUN.

## Exact source and commands

Commit and push source before each run. Export that exact commit with command-local
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

## Database and cleanup

Only `idea_ddm_iam_ui_20261007_46`, existing migrator/app roles, and one fresh
`iam_ui_<32 lowercase hex>` schema per run. Java verifies DB/owner/role and creates an exact
`IDEA_IAM_UI_RUN:<source>:<schema>` marker before migrating immutable V1–V10 in that schema.
Named synthetic fixtures confer no new role or membership. No public migration, preview,
company data, Vault, live adoption or DB drop.

After the owned Server and forked test JVM have exited, the runner validates exact DB, schema,
migrator owner and source marker, then drops only that exact schema. Retain the DB, export and
private logs. Oracle: zero exact schema remainder, public still empty, controlled inputs/tools
unchanged. Failures retain diagnostics and attempt identity; missing/drift tool/input, unexpected
target/role/marker or remaining JVM stops cleanup/execution. A normal first-party test/compile
defect is engineering work, not missing dependency or permission evidence.
