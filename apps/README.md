# Application projects

This folder contains the selected IDEA application boundaries in one repository:

| Project | Responsibility | Build platform |
|---|---|---|
| `server/` | Java 25 / Spring control plane; owns authoritative relational decisions. It does not relay Vault bytes. | Ubuntu 26.04 development host |
| `web/` | React/TypeScript business interface, built with Node.js 24. | Ubuntu 26.04 development host |
| `desktop/` | Narrow WPF/.NET 10 Windows shell hosting the shared Web interface through WebView2. | Windows engineering workstation |
| `workspace/` | Separate per-user .NET 10 Windows process for local engineering-file custody. | Windows engineering workstation |

F01 creates build scaffolds only; product behavior is added by its ordered Spec Kit tasks. The
Workspace project is not the Format Worker. The Artifact Gateway and its Vault Adapter are not
created here: F05 must qualify their exact runtime and Adapter before implementation. PH1 uses one
Vault endpoint while retaining distinct Artifact, Vault and Location identity so a later increment
can add multiple Vaults. This README makes no product-behavior or integration claim.
Current F01-A build and smoke-test results are recorded in
[`F01-A-build-results.md`](../specs/005-ph1-foundation-custody/evidence/F01-A-build-results.md).
All four checks passed from clean platform-specific archives of the same committed source
revision. F01-A still awaits the Project Reviewer's explicit card closure; the smoke tests do not
assert product behavior.

## Build entry points

These are the reproducible entry points. The evidence file above records the tested source commit,
command results and limits; T012 passed for these foundation checks.

| Project | Command | Required tools |
|---|---|---|
| Server (Ubuntu) | `cd apps/server && ./mvnw -B verify` | Ubuntu 26.04, Git, Temurin JDK 25, Bash, `curl` or `wget`, `unzip`, and `sha256sum`. The wrapper downloads Apache Maven 3.9.16 as a ZIP and checks its pinned SHA-256 before use. |
| Web (Ubuntu) | `cd apps/web && npm ci && npm test && npm run build` | Node.js 24.21.0 and npm 11.19.0; use the checked-in lockfile. |
| Desktop (Windows) | `dotnet test apps/desktop/tests/IdeaDesktop.Tests.csproj` then `dotnet build apps/desktop/IdeaDesktop.csproj` | Windows x64 and .NET 10 SDK/Windows targeting pack; NuGet access is needed on first restore. |
| Workspace (Windows) | `dotnet test apps/workspace/tests/IdeaWorkspace.Tests.csproj` then `dotnet build apps/workspace/IdeaWorkspace.csproj` | Windows x64 and .NET 10 SDK/Windows targeting pack. |

Desktop and Workspace commit a NuGet `packages.lock.json` beside each project. All four projects
set `RestoreLockedMode`; ordinary `dotnet test` and `dotnet build` therefore fail rather than
silently resolving a different package graph. Update a lock only as a deliberate dependency-intake
change, then reconcile it with the exact-package review before merging.

For F01-B, run `pwsh -NoProfile -File tests/ph1/test-check-no-secrets.ps1` for the isolated
black-box regression cases, then `pwsh -NoProfile -File tests/ph1/check-no-secrets.ps1` to scan
Git-tracked text files. The scan checks the working copy and also reads the Git-index version when
a tracked file is changed or missing, so a local edit or deletion cannot hide staged content. It
recognizes tracked `.env.local` files. The scan is heuristic, skips known binary files, and does not
inspect untracked or ignored files; a clean result is not a guarantee that no secret exists.
Synthetic fixture exceptions are limited to exact paths and canonical-text SHA-256 values in the
committed `HEAD` version of [`tests/ph1/known-synthetic-fixtures.json`](../tests/ph1/known-synthetic-fixtures.json);
working-tree or staged edits to that manifest cannot exempt pending content. New files and changed
contents are scanned. Quoted credential literals are checked across tracked text files, and
unquoted assignment checks cover configuration files and common shell scripts. See the
[F01-B reproducibility record](../specs/005-ph1-foundation-custody/evidence/F01-B-reproducibility.md)
for the exact source, commands, results and limitations.

The F01 dependency intake permits internal build/test only. The full NuGet license and notice review
remains for T036; do not package or distribute these projects from this intake. PostgreSQL and
Vault are not prerequisites for these F01 build/smoke checks. Use the server-local file described in
[development deployment](../deploy/development/README.md) for filled configuration; never put
secrets in this repository.
