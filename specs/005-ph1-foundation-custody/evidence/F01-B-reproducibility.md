# F01-B Clean-Source Reproducibility and Secret-Check Results

| Control field | Value |
|---|---|
| Stable Verification ID | `IE-VEV-PH1-F01-B-001` |
| Document class / title | `VERIFICATION-RECORD` / F01-B Clean-Source Reproducibility and Secret-Check Results |
| Version / status | `0.5` / `Draft`; T013 execution is recorded below; F01-B Delivery Card remains `IN_PROGRESS` pending Project Reviewer closure |
| Product normativity / process authority | `INFORMATIVE` / `NOT-APPLICABLE`; this record creates no product requirement or release approval |
| Owner / author | F01-B Engineering implementer / repository maintainer |
| Reviewer / acceptance authority | Project Reviewer; review of this record `NOT-RUN` |
| Applicable source / evidence date | Clean-source build/test baseline `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`; scanner corrections `c2798a45496d5babced6897e9379dc20940f9bbc`, `e9d17ebbdd7c30b0791f1fe64ca15ca89cbd42b7`, `f52ecb86147c8e6a2db6774bc189355f9c97a80c` and `1b4fb72fcc9d74cb3b9df724f701bbe9add69a0b`; checks run 2026-09-29 (Asia/Ho_Chi_Minh) |
| Upstream / downstream trace | [PH1 tasks T001–T013](../tasks.md), [F01-A build evidence](F01-A-build-results.md), [dependency intake](../../../docs/research/2026-09-28-ph1-f01-dependency-intake.md), [NuGet audit](../../../docs/research/2026-09-28-ph1-f01-nuget-transitive-audit.md), GitHub Issue [#17](https://github.com/devphuclam/IDEAEngineering/issues/17) → PH1/T036 |
| Classification / retention | `INTERNAL`; retain with the tested source and dependency evidence while this baseline is used or reviewed |
| Change record | GitHub Issue `#17` / Spec Kit task `T013`; predecessor `IE-VEV-PH1-F01-B-001@0.4` at `417ea2c20867e3d75169792fc0c1ba2ec1209d8c`; records scanner corrections from independent review, with no clean-source build outcome or product-baseline change |
| Supersession | Supersedes `IE-VEV-PH1-F01-B-001@0.4`; superseded by `NOT-APPLICABLE` |
| Review trigger | Re-review if the tested source revision, dependency lock graph, scanner/harness behavior, or T013 acceptance scope changes |
| Evidence status | `PASS` for the scoped checks below; Project Reviewer acceptance remains `NOT-RUN` |
| Standards tailoring | `STD-INFO-001` (ISO/IEC/IEEE 15289:2019) and `STD-TEST-001` through `STD-TEST-004` (ISO/IEC/IEEE 29119 series), all `STANDARD-GUIDED`; identity, configuration, procedure and result concepts are tailored to the compact records below; no conformity claim |

## 1. T013 disposition

**Execution result: `PASS` for the scoped checks in this record.** The four Windows .NET project
files (Desktop, Desktop tests, Workspace and Workspace tests) were restored in locked mode; the two
applications were tested and built from one clean source archive at
`b5c4701cf5a1cd37ae8295ed4af1621a6b522d03`. Server and Web use their Maven/npm procedures listed
below. Scanner corrections at `c2798a45496d5babced6897e9379dc20940f9bbc` and
`e9d17ebbdd7c30b0791f1fe64ca15ca89cbd42b7` add coverage for YAML `secret_key`, tracked
`.env.local`, and differing or missing working copies. A later independent review found that
unquoted shell assignments and blanket fixture-directory exclusions were not adequately covered.
Correction `f52ecb86147c8e6a2db6774bc189355f9c97a80c` adds shell/source-literal regressions and
replaces blanket exclusions with exact path-and-content-hash exceptions. A second review found
that an unstaged manifest edit could otherwise exempt staged fixture bytes. Correction
`1b4fb72fcc9d74cb3b9df724f701bbe9add69a0b` reads the exception manifest from committed `HEAD` and
adds a regression for a staged fixture credential hidden by a worktree-only manifest change. The
focused harness and tracked-source scan passed against that correction. Expected results and actual
results are listed separately.

This is not Product Reviewer acceptance of the Delivery Card. It does not prove that all possible
secrets are absent, qualify the final dependency bundle for redistribution, close T036, or establish
application security, production readiness or product behavior. F01-B remains `IN_PROGRESS` in the
Execution Register until the Project Reviewer explicitly closes the card.

## 2. Common source configuration

| Field | Result |
|---|---|
| Clean-source build/test commit | `b5c4701cf5a1cd37ae8295ed4af1621a6b522d03` on `codex/f01b-secret-check` |
| Scanner correction commits | `c2798a45496d5babced6897e9379dc20940f9bbc` and `e9d17ebbdd7c30b0791f1fe64ca15ca89cbd42b7` are the earlier fixes; `f52ecb86147c8e6a2db6774bc189355f9c97a80c` adds shell-literal and exact-fixture corrections; `1b4fb72fcc9d74cb3b9df724f701bbe9add69a0b` binds exceptions to committed `HEAD`. Focused harness and repository scan were rerun against `1b4fb72fcc9d74cb3b9df724f701bbe9add69a0b`. |
| Source export | Full tracked repository at the clean-source build/test commit exported with `git archive` to a new temporary directory; no build outputs or ignored local configuration included |
| Archive SHA-256 | `CA7B294BB7E50954482FF6E248FE605D8F07D69B479E698DA070C97301EC0251`; the uploaded Ubuntu copy independently matched this value |
| Dependency changes | None; locked graphs match the current F01 intake/audit. No Tech selection or product baseline changed. |
| Windows host | Windows `10.0.26200`, x64; .NET SDK `10.0.300` |
| Ubuntu host | Ubuntu `26.04.1 LTS`, x86_64; Temurin `25.0.4.1+1`; Node.js `24.21.0`; npm `11.19.0`; Maven Wrapper resolved Apache Maven `3.9.16` |
| Retained evidence | This versioned record, the identified source commits/archive hash, committed lockfiles and the reproducible scanner/harness. Raw terminal transcripts were not archived separately. |

## 3. Clean-source project results

### Windows — Desktop and Workspace

Each project first passed `dotnet restore --locked-mode` from the clean archive. The expected
restore oracle was exit `0` with the committed lockfile accepted unchanged. The recorded test/build
commands then used the resulting locked assets with `--no-restore`.

| Project | Check | Expected result / oracle | Actual result |
|---|---|---|---|
| Desktop | `dotnet restore --locked-mode` | Exit `0`; committed lockfile accepted unchanged. | Exit `0`. |
| Desktop tests | `dotnet restore --locked-mode` | Exit `0`; committed lockfile accepted unchanged. | Exit `0`. |
| Desktop | `dotnet test --no-restore apps/desktop/tests/IdeaDesktop.Tests.csproj` | Exit `0`; all tests pass, no failed tests. | Exit `0`; 1 passed, 0 failed. |
| Desktop | `dotnet build --no-restore apps/desktop/IdeaDesktop.csproj` | Exit `0`; 0 warnings and 0 errors. | Exit `0`; 0 warnings, 0 errors. |
| Workspace | `dotnet restore --locked-mode` | Exit `0`; committed lockfile accepted unchanged. | Exit `0`. |
| Workspace tests | `dotnet restore --locked-mode` | Exit `0`; committed lockfile accepted unchanged. | Exit `0`. |
| Workspace | `dotnet test --no-restore apps/workspace/tests/IdeaWorkspace.Tests.csproj` | Exit `0`; all tests pass, no failed tests. | Exit `0`; 1 passed, 0 failed. |
| Workspace | `dotnet build --no-restore apps/workspace/IdeaWorkspace.csproj` | Exit `0`; 0 warnings and 0 errors. | Exit `0`; 0 warnings, 0 errors. |

These results are limited to the scaffold boundaries exercised by the tests; they do not establish
product behavior beyond those boundaries.

### Ubuntu — Server and Web

| Check | Command | Expected result / oracle | Actual result |
|---|---|---|---|
| Server verification | `./mvnw -B -Dmaven.repo.local=<new-temporary-repository> verify` | Exit `0`; Maven reports `BUILD SUCCESS`, with no failed, errored or skipped tests. | Exit `0`; `BUILD SUCCESS`; 1 test passed, 0 failed/errors/skipped. This is a scaffold health test, not a database, identity, Gateway or Vault test. |
| Web dependency install | `npm ci --no-audit --no-fund` | Exit `0`; dependencies resolve from the committed npm lockfile without changing it. | Exit `0`; 44 packages installed. |
| Web test | `npm test` | Exit `0`; all test files and tests pass. | Exit `0`; 1 test file and 1 test passed. |
| Web build | `npm run build` | Exit `0`; TypeScript check and Vite production build complete successfully. | Exit `0`; build succeeded; 15 modules transformed. |

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

| Check | Expected result / oracle | Procedure and observed result |
|---|---|---|
| Black-box regression harness | Synthetic JSON/YAML credentials and tracked `.env.local` assignments return `1`; shell assignments and quoted PowerShell/JavaScript/TypeScript literals return `1`; new files under formerly excluded roots are scanned; output names affected files/category without values; exact unchanged synthetic fixtures, ignored `.env` and placeholders do not create findings; changed fixture contents are scanned; a safe or missing working copy cannot hide a credential in the Git index; an unstaged manifest edit cannot exempt staged fixture bytes; after cleaning tracked findings the scan returns `0`. | `pwsh -NoProfile -File tests/ph1/test-check-no-secrets.ps1` — exit `0`; all assertions passed. The harness creates a temporary Git repository and uses synthetic values only. |
| TDD evidence | The YAML `secret_key`, Git-index/working-copy, unquoted shell, changed fixture content, new file under a formerly excluded root, and worktree-only manifest tampering cases must fail before their scanner fixes and pass afterward. | Those regression cases failed before the relevant corrections and passed afterward. For the trust-boundary case, the new regression returned exit `1` before the scanner fix because a worktree-only manifest edit hid staged content; after reading the committed manifest, the focused harness passed. It also verifies quoted literals in `.ps1`, `.js` and `.ts`, exact fixture-content matching, and shell placeholders. No real credentials were used. |
| Repository scan | Exit `0` when no findings or scan errors exist; findings and incomplete scans must return nonzero. | `pwsh -NoProfile -File tests/ph1/check-no-secrets.ps1` — exit `0`: `PASS: no secret-like values found in scanned tracked UTF-8 text files; exact synthetic fixture contents recognized: 10; skipped known binary files: 233.` |
| Finding behavior | A finding returns `1` and reports only tracked filename/category; inability to complete the scan returns `2`; neither outcome prints a candidate value. | The harness observed exit `1` for synthetic findings in JSON, YAML and `.env.local`, including index content hidden by deleted/sanitized working copies; the synthetic value was absent from output. |
| Full repository verifier | Not part of this correction's verification scope. | `./scripts/verify-template` — `NOT-RUN`; no full-verifier result is claimed. |

The scan is heuristic. It scans the working copy of Git-indexed regular files and also scans the
Git-index blob when a tracked path has unstaged changes or is missing from the working copy. This
covers both the content being prepared for commit and current edits; it does not inspect untracked
or ignored files. Tracked `.env` variants such as `.env.local` receive configuration-assignment
matching; unquoted assignment matching also covers `.sh`, `.bash`, `.zsh` and `.fish`, while quoted
credential literals are checked in tracked text files. Ten synthetic fixture files are exempted
only when both their exact repository-relative path and canonical-text SHA-256 match the manifest
from committed `HEAD` at `tests/ph1/known-synthetic-fixtures.json`. Working-tree or staged manifest
edits cannot exempt pending content; new paths and changed contents are scanned. The scanner skips
known binary files. It does not inspect binary contents, history, environment variables,
processes, external services or every possible credential format. A clean result is not a guarantee
that the repository has no secret.

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
| 0.2 | 2026-09-29 | Add the `secret_key` regression and its correction revision; separate expected result/oracle from actual result for each recorded check. |
| 0.3 | 2026-09-29 | Add Git-index/working-copy and `.env.local` coverage; clarify platform-specific restore procedures and controlled review state. |
| 0.4 | 2026-09-29 | Add explicit change, supersession and review-trigger controls required for the verification-record class. |
| 0.5 | 2026-09-29 | Close independent-review gaps for shell/source literals and broad fixture exclusions; bind exact-content exceptions to committed `HEAD`; record focused and repository-scan results and the verifier left `NOT-RUN`. |
