# Node.js 24 Web-Build Baseline — Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-TECH-NODE24-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Title | Node.js 24 Web-Build Baseline |
| Decision date | 2026-09-23 (Asia/Bangkok) |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Product Decision Authority / Principal Product Author; repository update prepared with the project user |
| Reviewer / acceptance authority | Project Reviewer / Product Decision Authority; the project user reported their joint approval of Node.js 24 LTS for the IDEA Web-build baseline on 2026-09-23 |
| Product normativity | `INFORMATIVE`; this record changes no Feature, Spec, FTR, REQ or product behavior |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; approved Tech predecessor plus the current technology successor sources listed below |
| Source / upstream trace | [`IE-RES-NODE24-20260923-001`](../../../../research/2026-09-23-node24-web-build-baseline.md); official Node.js release/lifecycle/license sources and Vite compatibility sources cited there; local observation `node v24.16.0`, `npm 12.0.2` |
| Downstream trace | `IE-KNW-TECH-DEC-001@0.7`; `TECH-001@0.16`; Node.js 24 technology view predecessor `IE-ARC-TECH-VIEW-001@0.4` / `IE-VEV-TECH-VIEW-003`; current one-Vault-corrected successor `IE-ARC-TECH-VIEW-001@0.5` / `IE-VEV-TECH-VIEW-004`; PH0 environment profile |
| Change record | This record is the controlling `CHG`; no separate product Work Item is created |
| Predecessor / supersession | Supersedes the prior Web-build-family statement for the current technology successor only; retained Q-15 evidence and historical baselines are not rewritten / superseded by `NOT-APPLICABLE` |
| Classification / retention | `INTERNAL`; retain with the approved decision, predecessor Tech baseline and successor qualification history |
| Review trigger | Node.js 24 leaves support, Vite or the selected package graph becomes incompatible, a security/license issue changes acceptability, or authority selects another Web-build family |
| Decision status | Node.js 24 LTS Web-build family `APPROVED`; exact package graph, build, test and release qualification `NOT-RUN` |
| Evidence status | Official lifecycle/compatibility/license facts and local tool observation are recorded; exact lockfile/build/test/release qualification remains `NOT-RUN` |
| Unchanged controls | Tech Stack outside the Web-build runtime family; Q-15 `PARTIAL / NO WINNER`; Product Scope; PDA decisions outside this change; PG3 and PG4 |

## 1. Decision

IDEA Engineering uses **Node.js 24 LTS** to build the React/TypeScript/Vite Web client.

- Node.js is a build-time tool. It does not become the production IDEA Server runtime.
- The inspected development machine currently provides Node.js `v24.16.0` and npm `12.0.2`.
- The future project-owned implementation package must constrain the engine to the Node.js 24 major line (for example `>=24 <25`); the retained Q-15 harness and its evidence are historical and are not rewritten by this decision.
- Future build evidence must record the exact Node.js/npm versions and the exact lockfile used.
- The decision does not select the latest upstream patch as if that patch were already installed.

## 2. Evidence and qualification boundary

Official evidence establishes that Node.js 24 is an LTS line and that Node.js 24 is within Vite 8's
supported runtime ranges. Local observation establishes only what is installed on the inspected
workstation. Neither proves that the IDEA Web dependency graph, lint, tests or production asset
build succeeds.

The following result therefore remains explicit:

```text
Selected family: Node.js 24 LTS
Observed local runtime: Node.js v24.16.0 / npm 12.0.2
Exact lockfile/build/test qualification: NOT-RUN
```

## 3. Controlled source effects

| Controlled source | Effect |
|---|---|
| Technology Decision Matrix | Version `0.7` selects Node.js 24 LTS for Web build. |
| TECH-001 | Version `0.16` presents the approved Node.js 24 baseline to management. |
| Technology Architecture View Set | Version `0.4` updates TECH-D07 and routes to a successor rendition. |
| PH0 environment profile and config template | The installed Node.js 24 line is permitted for local development; qualification remains `NOT-RUN`. |
| Q-15 Option A project-owned engine rule | Requires Node.js 24; third-party transitive compatibility ranges in the lockfile are not rewritten. |

No Server, Desktop, Workspace, Format Worker, PostgreSQL, Vault or deployment technology is changed
by this record.

## 4. Invariants

- **Tech baseline changed outside Node.js family:** `NO`.
- **Q-15 changed:** `NO`; it remains `PARTIAL / NO WINNER`.
- **Product Scope changed:** `NO`.
- **PG3 or PG4 changed:** `NO`.
- **Exact Web build qualified:** `NO`; result remains `NOT-RUN`.

## 5. Reopen triggers

Reopen this decision if the selected Node.js 24 line leaves support, a security/support policy makes
it unacceptable, Vite or a mandatory build dependency no longer supports it, or reproducible build
evidence fails on the selected line. A trigger opens reconsideration; it does not predetermine the
successor.
