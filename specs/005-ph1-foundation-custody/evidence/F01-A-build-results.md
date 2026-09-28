# F01-A Build and Smoke Results

**T012 disposition:** `PASS` for the four approved foundation smoke/build checks below.
**Card status:** `IN-PROGRESS / review corrections open`. The four checks passing does not by
itself close F01-A or establish product acceptance.

## Common tested source

| Field | Result |
|---|---|
| Tested source commit | `c600f7be41f0732cb57d521017bae0565ab229bd` on `codex/ph1-foundation-f01` |
| Source checkout | Clean application directories exported with `git archive` from the tested commit and extracted to new temporary directories; no build outputs included |
| Ubuntu archive | `apps/server` + `apps/web`; SHA-256 `5F362E06E26C986CFEB0E1C13938A146F664B039B263B4266E4862D03BF3A593`; uploaded archive hash independently matched on the host |
| Windows archive | `apps/desktop` + `apps/workspace`; SHA-256 `B222D2F367BC5D2D9F27EBE7E86ADEA1A7A41DAA3CCFD226707114BE9305E2DD` |
| Run date | 2026-09-28, Asia/Ho_Chi_Minh |

## Server — Ubuntu 26.04 development host

| Field | Result |
|---|---|
| Tools | Temurin `25.0.4.1+1`; Maven Wrapper `3.3.4`; Apache Maven `3.9.16` |
| Fresh build cache | New Maven Wrapper home and new Maven local repository under `/tmp`; dependencies were fetched for this clean source export. The repository was not reused from the earlier snapshot run. |
| Extraction support | A temporary PATH directory pointed `unzip` to the host's BusyBox applet. The wrapper retained and passed the pinned Maven ZIP checksum. |
| Command | `./mvnw -B -Dmaven.repo.local=/tmp/idea-f01a-m2-c600f7b verify` |
| Result | Exit `0`, `BUILD SUCCESS`, 1 test passed. The test starts the Server and checks `GET /health` gives HTTP `200` and JSON `status=UP`; no database configuration or database call is used by this scaffold test. |
| Warning | Mockito printed a non-fatal Java-agent/dynamic-attach warning. It did not affect the result; revisit if a later JDK removes this attach behavior. |
| Disposition | `PASS` for the Server smoke/build only. No database, authentication, authorization, Gateway, Vault, or product behavior is claimed. |

The exact resolved Server dependency graph is retained in
[`F01-A-server-dependency-tree.json`](F01-A-server-dependency-tree.json), SHA-256
`C36F53C13AACAA18CAEA5026B53295ECDA230BC9170DA325412AA65A19756049`.

## Web — Ubuntu 26.04 development host

| Field | Result |
|---|---|
| Tools | Node.js `v24.21.0`; npm `11.19.0`; Vitest `5.0.2`; Vite `8.3.1` |
| Commands | `npm ci --no-audit --no-fund`; `npm test`; `npm run build` |
| Result | All commands exited `0`; 44 packages installed from the lockfile; 1 file and 1 test passed. TypeScript check passed; Vite transformed 15 modules and emitted the production HTML and JavaScript bundle. |
| Disposition | `PASS` for the Web rendering/build check only. The test verifies `App` renders a `<main>` landmark; no user workflow or Server integration is claimed. |

## Desktop — Windows x64 engineering workstation

| Field | Result |
|---|---|
| Tools | .NET SDK `10.0.300`; Windows `net10.0-windows` targeting pack |
| Commands | `dotnet test apps/desktop/tests/IdeaDesktop.Tests.csproj`; `dotnet build apps/desktop/IdeaDesktop.csproj` |
| Result | Restore and both commands succeeded from the clean archive; 1 test passed; build had 0 warnings and 0 errors. Test verifies `Idea.Ddm.Desktop.App` derives from WPF `Application`. |
| Disposition | `PASS` for the Desktop startup-boundary/build check only. No window interaction or product behavior is claimed. |

## Workspace — Windows x64 engineering workstation

| Field | Result |
|---|---|
| Tools | .NET SDK `10.0.300`; Windows `net10.0-windows` targeting pack |
| Commands | `dotnet test apps/workspace/tests/IdeaWorkspace.Tests.csproj`; `dotnet build apps/workspace/IdeaWorkspace.csproj` |
| Result | Restore and both commands succeeded from the clean archive; 1 test passed; build had 0 warnings and 0 errors. Test verifies the separate public static `Main` has `[STAThread]`. |
| Disposition | `PASS` for the Workspace entry-point/build check only. No file custody or Server interaction is claimed. |

## Issue found and corrected during verification

The first committed archive (`2a955a66e541f80bc83a2e6303439943db48dc41`) failed on Linux because
the Maven Wrapper had CRLF after its shebang (`/bin/sh^M`). `.gitattributes` now pins
`apps/server/mvnw` to LF; the corrected archive from the tested commit had LF and mode `755`, and
the fresh Maven build above passed. The initial failure is resolved, not hidden as a passing run.

All four checks therefore exercised the same committed application source revision. The user
approved these as scaffolding smoke tests only. They do not prove business workflows, security,
PostgreSQL, file custody, transfer performance, multi-Vault operation, or deployment readiness.

## Review findings — 2026-09-28

- The four green smoke/build outcomes above are supported. The retained record does **not** show
  an intended test failure before implementing the Server, Web, Desktop or Workspace behavior.
  The earlier Maven Wrapper CRLF launch failure is a build-launch failure, not a TDD red result.
  T006–T008 remain open until the missing evidence is resolved through an explicit review decision;
  a later test-sensitivity run must be labelled retrospective, not presented as an original red run.
- The [dependency intake](../../../docs/research/2026-09-28-ph1-f01-dependency-intake.md) has
  not completed exact NuGet transitive license/notice qualification. Windows restore already ran,
  so T002's before-first-import order was not met. Retain this as a deviation and do not call
  the entire F01-A prerequisite set complete merely because the four smoke checks passed.
