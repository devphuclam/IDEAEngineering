# T043 Web Dependency Intake

| Field | Value |
|---|---|
| Stable ID | `IE-RES-T043-WEB-DEPS-INTAKE-20261001` |
| Document class | External-source intake / research record |
| Version / status | `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; creates no product requirement |
| Owner / reviewer / acceptance | Owner `UNKNOWN`; reviewer `NOT-RUN`; acceptance authority `Project Reviewer` |
| Scope | Existing `apps/web/package-lock.json` dependencies used to build/test T043 Web |
| Lockfile SHA-256 | `350E5D24057C55D6ACEF6FB6A71B73948E2711D9279C12E2FE52071B815F611B` |
| Source policy | Exact lockfile versions; `npm ci --ignore-scripts`; no package added or upgraded |
| Evidence status | `APPROVED-WITH-OBLIGATIONS`; license metadata inspected after installation |

## License inventory

The package metadata for the exact lockfile installation reported these licenses. `MPL-2.0`,
`Apache-2.0`, `MIT`, `ISC` and `BSD-3-Clause` are recorded as package metadata observations; this
record does not claim commercial redistribution clearance beyond the repository's T036 process.

| Package families | Versions observed | License |
|---|---|---|
| `react`, `react-dom` | `19.3.0` | MIT |
| `@types/react`, `@types/react-dom` | `19.3.0` | MIT |
| `@vitejs/plugin-react` | `6.1.1` | MIT |
| `typescript`, `@typescript/typescript-win32-x64` | `7.0.2` | Apache-2.0 |
| `vite` | `8.3.1` | MIT |
| `vitest`, `@vitest/mocker`, `@vitest/spy` | `5.0.2` | MIT |
| `lightningcss`, `lightningcss-win32-x64-msvc` | `1.33.0` | MPL-2.0 |
| `detect-libc` | `2.1.2` | Apache-2.0 |
| `expect-type` | `1.4.0` | Apache-2.0 |
| `source-map-js` | `1.2.1` | BSD-3-Clause |
| `picocolors` | `1.1.1` | ISC |
| Remaining transitive packages in the lockfile | Exact locked versions | MIT, as reported by package metadata |

The exact transitive names and versions remain in the lockfile; no unlisted package was installed.
No package reported a missing license field in the post-install inventory. Native `lightningcss`
is an existing locked build dependency and is not shipped as an IDEA runtime dependency.

## Obligations and disposition

- Keep `package-lock.json` unchanged unless a new intake and review occurs.
- Do not commit `node_modules`; it is ignored and exists only for the local build/test run.
- Do not add Playwright to this project. T043 browser automation, if used, uses the separately
  recorded Codex runtime intake.
- Recheck this inventory if the lockfile, package versions or build toolchain changes.
- This record does not prove Web qualification, production readiness or commercial clearance.

## Self-check

Exact lockfile, installation mode, package versions and license metadata are recorded. Independent
review and actual Web execution remain `NOT-RUN` until the T043 checkpoint is executed.
