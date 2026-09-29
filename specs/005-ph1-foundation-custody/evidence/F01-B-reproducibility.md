# F01-B Clean-Source Reproducibility and Secret-Check Results

| Control field | Value |
|---|---|
| Stable Verification ID | `IE-VEV-PH1-F01-B-001` |
| Document class / title | `VERIFICATION-RECORD` / F01-B Clean-Source Reproducibility and Secret-Check Results |
| Version / status | `0.1` / `Draft`; T013 execution is recorded below; F01-B Delivery Card remains `IN_PROGRESS` pending Project Reviewer closure |
| Product normativity / process authority | `INFORMATIVE` / `NOT-APPLICABLE`; this record creates no product requirement or release approval |
| Owner / author | F01-B Engineering implementer / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer; review of this record `NOT-RECORDED` |
| Applicable source / evidence date | Source commit `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`; checks run 2026-09-29 (Asia/Ho_Chi_Minh) |
| Upstream / downstream trace | [PH1 tasks T001–T013](../tasks.md), [F01-A build evidence](F01-A-build-results.md), [dependency intake](../../../docs/research/2026-09-28-ph1-f01-dependency-intake.md), [NuGet audit](../../../docs/research/2026-09-28-ph1-f01-nuget-transitive-audit.md), GitHub Issue [#17](https://github.com/devphuclam/IDEAEngineering/issues/17) → PH1/T036 |
| Classification / retention | `INTERNAL`; retain with the tested source and dependency evidence while this baseline is used or reviewed |
| Standards tailoring | `STD-INFO-001` (ISO/IEC/IEEE 15289:2019) and `STD-TEST-001` through `STD-TEST-004` (ISO/IEC/IEEE 29119 series), all `STANDARD-GUIDED`; identity, configuration, procedure and result concepts are tailored to the compact records below; no conformity claim |

## 1. T013 disposition

**Execution result: `PASS` for the scoped checks in this record.** The four application projects
were restored in locked mode and tested/built from one clean source archive. The secret-check
harness passed its approved black-box cases, and the repository scan completed without a finding
or scan error.

This is not Product Reviewer acceptance of the Delivery Card. It does not prove that all possible
secrets are absent, qualify the final dependency bundle for redistribution, close T036, or establish
application security, production readiness or product behavior. F01-B remains `IN_PROGRESS` in the
Execution Register until the Project Reviewer explicitly closes the card.

## 2. Common source configuration

| Field | Result |
|---|---|
| Source commit | `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03` on `codex/f01b-secret-check` |
| Source export | Full tracked repository exported with `git archive` to a new temporary directory; no build outputs or ignored local configuration included |
| Archive SHA-256 | `CA7B294BB7E50954482FF6E248FE605D8F07D69B479E698DA070C97301EC0251`; the uploaded Ubuntu copy independently matched this value |
| Dependency changes | None; locked graphs match the current F01 intake/audit. No Tech selection or product baseline changed. |
| Windows host | Windows `10.0.26200`, x64; .NET SDK `10.0.300` |
| Ubuntu host | Ubuntu `26.04.1 LTS`, x86_64; Temurin `25.0.4.1+1`; Node.js `24.21.0`; npm `11.19.0`; Maven Wrapper resolved Apache Maven `3.9.16` |

## 3. Clean-source project results

### Windows — Desktop and Workspace

Each project first passed `dotnet restore --locked-mode` from the clean archive. The recorded
test/build commands then used the resulting locked assets with `--no-restore`.

| Project | Test | Build | Result |
|---|---|---|---|
| Desktop | `dotnet test --no-restore apps/desktop/tests/IdeaDesktop.Tests.csproj` — 1 passed, 0 failed | `dotnet build --no-restore apps/desktop/IdeaDesktop.csproj` — 0 warnings, 0 errors | `PASS` for the WPF startup/build boundary only |
| Workspace | `dotnet test --no-restore apps/workspace/tests/IdeaWorkspace.Tests.csproj` — 1 passed, 0 failed | `dotnet build --no-restore apps/workspace/IdeaWorkspace.csproj` — 0 warnings, 0 errors | `PASS` for the separate Workspace entry-point/build boundary only |

### Ubuntu — Server and Web

| Project | Command | Result |
|---|---|---|
| Server | `./mvnw -B -Dmaven.repo.local=<new-temporary-repository> verify` | Exit `0`; Maven `BUILD SUCCESS`; 1 test passed, 0 failed/errors/skipped. This remains the scaffold health test, not a database, identity, Gateway or Vault test. |
| Web dependency install | `npm ci --no-audit --no-fund` | Exit `0`; 44 packages installed from the committed npm lockfile. |
| Web test | `npm test` | Exit `0`; 1 test file and 1 test passed. |
| Web build | `npm run build` | Exit `0`; TypeScript check and Vite production build succeeded; 15 modules transformed. |

## 4. Locked dependency evidence

All four Windows projects have `RestorePackagesWithLockFile=true` and
`RestoreLockedMode=true`; clean-source `dotnet restore --locked-mode` succeeded for each.
Lockfile hashes below were recomputed from the tested source tree and match the recorded F01 audit.

| Project | Lockfile SHA-256 |
|---|---|
| Desktop | `5386CC9B0B11E8D2C2A4BC5402ABE1598BD1E9167E69EFD71DB0A0C5150EB01E` |
| Desktop tests | `68B9F5A6CD4A1ECD8817BAC15F4E6923FA58393FCDF0AF0670D945AF885984A2` |
| Workspace | `531D4CF71E5420C1C03DA4C06778BA2A212C7058A3882E7A3A873AE2F811511E` |
| Workspace tests | `6260CA6026B00B248878A7ACFEFB09C425296547883B2207F9F3D79A38273A69` |
| Web `package-lock.json` | `350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B` |

The npm lock graph has 88 exact package versions with license metadata recorded as 51 MIT,
23 Apache-2.0, 12 MPL-2.0, one ISC and one BSD-3-Clause. The four NuGet lock graphs retain
the same 13 external package IDs and versions already audited; `MSTest.Sdk/4.4.1` remains pinned
by its exact project-SDK reference rather than a `PackageReference` lock entry. These are repeatable
resolution/build records, not a new license approval or distribution clearance; see the linked F01
intake/audit and PH1/T036 for later bundle review.

## 5. Tracked-secret check

| Check | Procedure and observed result |
|---|---|
| Black-box regression harness | `pwsh -NoProfile -File tests/ph1/test-check-no-secrets.ps1` — exit `0`. It creates a temporary Git repository, confirms a committed JSON and unquoted YAML credential-shaped synthetic value returns `1`, checks that output identifies only file/category and never the value, confirms a placeholder sample and Git-ignored `.env` do not create findings, then commits a clean version and confirms exit `0`. |
| TDD evidence | Before the scanner correction, the new alphanumeric-only test failed because the candidate was treated as a placeholder. After removing the catch-all “any simple word” placeholder rule, the complete harness passed. No real credentials were used. |
| Repository scan | `pwsh -NoProfile -File tests/ph1/check-no-secrets.ps1` — exit `0`: `PASS: no secret-like values found in scanned tracked UTF-8 text files; excluded known synthetic fixture files: 202; skipped known binary files: 227.` |
| Finding behavior | A detected item reports the tracked filename and finding category only; the synthetic value is never included. A finding returns `1`; inability to complete the scan returns `2`. |

The scan is heuristic. It reads Git-indexed regular files from the working tree; untracked and
ignored files are not scanned. It skips known binary files and 202 pre-existing synthetic test
fixtures that are separately controlled. It does not inspect binary contents, history, environment
variables, processes, external services or every possible credential format. A clean result is not
a guarantee that the repository has no secret.

## 6. Correction trail and remaining boundary

F01-B/T013 independently corrected two earlier recorded SHA-256 values after comparison with the
retained files. The corrections do not change build outcomes, package graphs or product decisions.

| Record | Earlier value | Verified value | Effect |
|---|---|---|---|
| [Web package intake, v0.10](../../../docs/research/2026-09-28-ph1-f01-dependency-intake.md) | `1C011F5EBFEA15E039E236B4713C3ED7E0B1657A654A95887B3B13D0C84B803D` | `350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B` | Corrects the npm lockfile hash only. |
| [F01-A build record, v0.3](F01-A-build-results.md) | `C36F53C13AACAA18CAEA5026B53295ECDA230BC9170DA325412AA65A19756049` | `59077C834765F9B41AF6537C98ECA7ACFFAE90A1A08289C1EAE615502A5F5579` | Corrects the retained Server dependency-tree JSON hash only. |

F01-B changes no Tech Stack selection, Q-15 disposition, Product Scope, PDA approval, Product
Decision, authorization rule, database/Vault behavior or license disposition. F01-B also does not
complete PH1/T036, prove third-party redistribution rights, or qualify a commercial release.

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-09-29 | Record clean-source locked restore/build/test results for all four projects, tracked-secret check behavior and limits, lockfile hashes and the two verified hash corrections. |
