# Work Item 26 browser tooling admission

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-DEVACCESS-BROWSER-INTAKE-20261002` / external-source intake |
| Version / status | `0.1` / `Approved` for the bounded internal use below |
| Normativity / process authority | INFORMATIVE / NOT-APPLICABLE |
| Owner / author / reviewer | Engineering / Codex / Project Reviewer Nguyễn Huỳnh Phúc Lâm |
| Authority / evidence date | User explicitly approved reuse for Issue #26 on 2026-10-02, before execution |
| Baseline / trace | [Issue #26](https://github.com/devphuclam/IDEAEngineering/issues/26), [Swagger seam](../../specs/006-backend-dev-access/contracts/swagger.md) |
| Predecessor | [T043 inventory](2026-10-01-t043-browser-tool-intake.md); this is a new scope, not a rewrite/inheritance of its authority |
| Classification / retention | INTERNAL; retain with Work Item 26 evidence |
| Review trigger / evidence state | Version/source/graph/hash/use change / APPROVED-WITH-OBLIGATIONS; qualification results separate |

Use: test-only DEPENDENCY, no copied library, application dependency or project lockfile change.
Exact source is the Codex bundled `playwright` + `playwright-core` 1.62.1 under
`C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules`.
Installed branded Chrome was observed as 154.0.8037.92. No registry install, browser download or TLS
bypass is permitted. Run headed Chrome against the actual packaged application, not test HTML.

The predecessor's Apache-2.0 LICENSE/NOTICE and third-party notice inventory were rechecked before
reuse. Paths abbreviated as `pw` = playwright and `core` = playwright-core:

| Exact file | SHA-256 |
|---|---|
| pw/LICENSE, core/LICENSE | `45873D00A0DD243596DEB4AA23B2493B3D1F0671921BF2538EA431D7380220EB` |
| pw/NOTICE, core/NOTICE | `6D602191187B35B9B01D2CFFA01C8469C2C8D9DE8A96F1BF868E0F264F51C81D` |
| pw/ThirdPartyNotices.txt | `B17AC0BD6F4B8207E440639CC8E0BA1BF1D9EAF9B12236764AB93B346C7ABD8E` |
| core/ThirdPartyNotices.txt | `A549D329BAD8806FE279F0ECAE0FC0270DEC7E7C2DC8EC10F90E394F7C32B144` |
| core/lib/coreBundle.js | `9393FA79E1C67C74EDC26B610D65A4F7ED73D345A762465CC88340A33A2454AC` |
| core/lib/utilsBundle.js | `580F571BF063E2256B51B3946A035BC452FC0E22808D5547B198BAEA39923A32` |
| core/lib/utilsBundle.js.LICENSE | `57945338CBA4878E373646733528017FBE3DB1503EC2B431FD30D2A390C70C33` |

Bundled MIT/BSD/ISC notices remain unmodified in their runtime source. The known missing text for
`proxy-agent-negotiate@1.1.0` retains the predecessor's exact-source MIT provenance observation;
this successor does not claim the empty bundled notice contains a license grant. Engineering owns
retention, no redistribution and hash preflight. Chrome remains the user's installed browser;
its own license is not asserted to be Apache. Nothing enters BOOT-INF/lib.

Only sanitized outcome/status evidence is retained: no password, cookie, CSRF value, raw exception,
HAR, screenshot, trace or storageState. Synthetic password is generated in RAM and sent over SSH
stdin to an isolated fixture; it is never an argument or company credential.
This admission is not a legal/commercial/T036 or production clearance and creates no product scope.
