# T043 Browser Tool Intake

| Field | Value |
|---|---|
| Stable ID | `IE-RES-T043-BROWSER-INTAKE-20261001` |
| Document class | Research / external-source intake record |
| Version / status | `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; creates no product requirement |
| Repository process authority | `NOT-APPLICABLE` |
| Owner / author | Owner `UNKNOWN`; author `Codex`; reviewer `NOT-RUN`; acceptance authority `Project Reviewer` |
| Applicable baseline | F03-B T043 Web qualification, internal test tooling only |
| Evidence date | 2026-10-01 |
| Classification / retention | `INTERNAL`; retain with T043 evidence while F03-B is open |
| Upstream trace | `specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md#t043-web-qualification-contract` |
| Downstream trace | `specs/005-ph1-foundation-custody/plan.md`, `tasks.md`, `worker-handoff.md` |
| Evidence status | `APPROVED-WITH-OBLIGATIONS`; no execution result claimed |

## 1. Source and intended use

The T043 Web qualification may use the Playwright packages already bundled in the Codex local
runtime, with the branded Chrome already installed on the workstation. The packages are a test
tool only; they are not added to `apps/web`, the shipped application, or a production runtime.
No Internet download, registry install, or project `npm install` is authorized by this record.

| Item | Pinned observation |
|---|---|
| Source location | `C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules` |
| `playwright` | `1.62.1` |
| `playwright-core` | `1.62.1` |
| Project `@playwright/test` | Not present; no project dependency added |
| Browser boundary | Existing branded Chrome; version observed `154.0.8037.92` |
| License | Package metadata and bundled `LICENSE`/`NOTICE` identify Apache-2.0 for Playwright; bundled third-party notices remain part of the source intake |
| Disposition | Approved for internal T043 qualification only, subject to retaining this source/version and the license notice hashes below |

## 2. Retained integrity observations

The following SHA-256 values identify the notice files inspected from the pinned runtime source:

| File | SHA-256 |
|---|---|
| `playwright/LICENSE` | `45873D00A0DD243596DEB4AA23B2493B3D1F0671921BF2538EA431D7380220EB` |
| `playwright/NOTICE` | `6D602191187B35B9B01D2CFFA01C8469C2C8D9DE8A96F1BF868E0F264F51C81D` |
| `playwright/ThirdPartyNotices` | `B17AC0BD6F4B8207E440639CC8E0BA1BF1D9EAF9B12236764AB93B346C7ABD8E` |
| `playwright-core/LICENSE` | `45873D00A0DD243596DEB4AA23B2493B3D1F0671921BF2538EA431D7380220EB` |
| `playwright-core/NOTICE` | `6D602191187B35B9B01D2CFFA01C8469C2C8D9DE8A96F1BF868E0F264F51C81D` |
| `playwright-core/ThirdPartyNotices` | `A549D329BAD8806FE279F0ECAE0FC0270DEC7E7C2DC8EC10F90E394F7C32B144` |

The bundled notice inspection also identified `proxy-agent-negotiate@1.1.0` as MIT in its package
metadata; its upstream package metadata was checked at commit
`b7e5f7ccce1a3ac5b339cc4c587974e8989cbc16`. This is an intake observation, not a claim of broad
commercial redistribution clearance.

## 3. Obligations and limits

- Use the exact bundled source and version above, or record a new intake before changing it.
- Do not add Playwright or `@playwright/test` to a project lockfile/package manifest.
- Do not download a browser or bypass TLS verification. If actual Chrome cannot trust the approved
  T043 certificate, the browser oracle is `BLOCKED`.
- Retain only sanitized test evidence; never retain password, cookie, CSRF secret, or private key.
- This record does not make Web qualification PASS, does not qualify Desktop, and does not grant
  commercial redistribution rights.

## 4. Self-check

Source/version, license observations, integrity hashes and scope limits are recorded. Independent
review and actual browser execution remain `NOT-RUN` until the T043 Web checkpoint is executed.
