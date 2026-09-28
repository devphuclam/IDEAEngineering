# F01-A Build and Smoke Results

**Card status:** `IN-PROGRESS` — project-level smoke/build checks passed on separate uncommitted
snapshots. T012 remains open until all four checks are repeated from one committed source revision.
No F01-A PASS is claimed.

## Server — P04 Ubuntu development host

| Field | Result |
|---|---|
| Run date | 2026-09-28, Asia/Ho_Chi_Minh |
| Repository branch / base commit | `codex/ph1-foundation-f01` / `03d34d36145186102460d135d8d670c31c63b8ea` |
| Source state | Uncommitted Server snapshot transferred to a temporary directory on `ideaddmserver`; snapshot archive SHA-256 `2C46ED8D571B99B435658E68CCD487DC8D0DEEC91B1544F130BFBFB2EA66DCF5` |
| Host / tools | Ubuntu 26.04.1 LTS; Temurin `25.0.4.1+1`; Maven Wrapper `3.3.4`; Apache Maven `3.9.16` |
| Wrapper check | Ran with a fresh wrapper/Maven cache and retained the pinned Apache ZIP checksum; the host supplied its BusyBox `unzip` applet through a temporary PATH shim. No checksum check was disabled. |
| Red result before health implementation | The initial health smoke test failed before `/health` was implemented; the failure was followed by the passing run below. |
| Smoke/build | `bash ./mvnw -B verify` — exit `0`; 1 test passed, Maven build succeeded. The test starts the Server without a database and checks `GET /health` returns HTTP `200` and JSON `status=UP`. |
| Build note | Mockito emitted a non-fatal Java-agent/dynamic-attach warning. The check still exited successfully; track warning cleanup if a later JDK changes this behavior. |
| Disposition | `PASS` for this Server smoke/build run only. It does not establish database, security, Gateway, Vault, or product integration behavior. |

The exact resolved Server dependency graph is retained in
[`F01-A-server-dependency-tree.json`](F01-A-server-dependency-tree.json), SHA-256
`C36F53C13AACAA18CAEA5026B53295ECDA230BC9170DA325412AA65A19756049`.

## Web — P04 Ubuntu development host

| Field | Result |
|---|---|
| Run date | 2026-09-28, Asia/Ho_Chi_Minh |
| Repository branch / base commit | `codex/ph1-foundation-f01` / `03d34d36145186102460d135d8d670c31c63b8ea` |
| Source state | Uncommitted Web snapshot, transferred to a temporary directory on `ideaddmserver`; snapshot archive SHA-256 `A9699338985BA920516C4C88616FB9540F9772CEF80926E52CA22076A182A4AD` |
| Host / tools | Ubuntu 26.04.1 LTS; Node.js `v24.21.0`; npm `11.19.0`; Vitest `5.0.2`; Vite `8.3.1` |
| Install | `npm ci --no-audit --no-fund` — exit `0`, 44 platform packages installed from the checked-in lockfile |
| Red result before `App` implementation | `npm test` failed because `src/App` did not yet exist |
| Smoke test | `npm test` — exit `0`; 1 file passed, 1 test passed. It checks that `App` renders a `<main>` landmark. |
| Build | `npm run build` — exit `0`; TypeScript check passed; Vite transformed 15 modules and emitted `dist/index.html` plus the production JavaScript bundle. |
| Disposition | `PASS` for this Web smoke/build run only. It does not pass the F01-A card or assert product behavior. |

## Desktop — Windows engineering workstation

| Field | Result |
|---|---|
| Run date | 2026-09-28, Asia/Ho_Chi_Minh |
| Repository branch / base commit | `codex/ph1-foundation-f01` / `03d34d36145186102460d135d8d670c31c63b8ea` |
| Source state | Uncommitted Windows worktree snapshot; no shared committed-snapshot archive recorded for this run |
| Host / tools | Windows x64; .NET SDK `10.0.300`; `net10.0-windows` targeting pack |
| Red/green test | The initial startup-boundary test failed before the WPF `App` class was added. Final `dotnet test apps/desktop/tests/IdeaDesktop.Tests.csproj --no-restore` — exit `0`; 1 test passed. It verifies `Idea.Ddm.Desktop.App` derives from WPF `Application`. |
| Build | `dotnet build apps/desktop/IdeaDesktop.csproj --no-restore` — exit `0`; 0 warnings, 0 errors. |
| Disposition | `PASS` for this Desktop startup-boundary test/build only. No window interaction or product behavior was tested. |

## Workspace — Windows engineering workstation

| Field | Result |
|---|---|
| Run date | 2026-09-28, Asia/Ho_Chi_Minh |
| Repository branch / base commit | `codex/ph1-foundation-f01` / `03d34d36145186102460d135d8d670c31c63b8ea` |
| Source state | Uncommitted Windows worktree snapshot; no shared committed-snapshot archive recorded for this run |
| Host / tools | Windows x64; .NET SDK `10.0.300`; `net10.0-windows` targeting pack |
| Red/green test | The initial entry-point test failed before the Workspace host was added. Final `dotnet test apps/workspace/tests/IdeaWorkspace.Tests.csproj --no-restore` — exit `0`; 1 test passed. It verifies the separate public static `Main` has `[STAThread]`. |
| Build | `dotnet build apps/workspace/IdeaWorkspace.csproj --no-restore` — exit `0`; 0 warnings, 0 errors. |
| Disposition | `PASS` for this Workspace entry-point test/build only. No file-custody or Server interaction was tested. |

## Shared revision rerun still required

The four passing results above came from per-component, uncommitted source snapshots. The Server and
Web were each copied to the Ubuntu host independently; the Windows checks ran from the Windows
worktree. The Server archive hash is not the same as the Web archive hash, and neither is a Git
commit. After the implementation is committed, run all four documented checks from that exact
commit (or its verified archive), record its full commit ID and archive/hash evidence, and confirm
the source was clean. Until then T012 remains `NOT-RUN` for the acceptance criterion requiring one
common committed revision, even though each component check above passed individually.

These checks are scaffolding smoke tests only. They do not assert business behavior, authentication,
authorization, PostgreSQL, Vault I/O, transfer performance, multi-Vault operation, or deployment
readiness.
