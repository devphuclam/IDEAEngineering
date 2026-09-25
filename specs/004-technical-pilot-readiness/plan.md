# Implementation Plan: Technical Pilot Implementation Readiness

**Branch at creation**: `codex/technical-pilot-speckit` | **Current baseline branch**: `main` | **Date**: 2026-09-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-technical-pilot-readiness/spec.md`

## Summary

Deliver `IE-INC-READY-001`, the PH0 package that permits an attributable `PG4` decision. The plan
pins the approved Feature/Spec/Tech predecessor, separates the later multi-location Vault successor,
bounds the Technical Pilot scenario, exposes unresolved prerequisites, defines the permitted
environment and representative evidence, and prepares rollback/recovery/security review. This is a
documentation and readiness increment; it creates no production source tree and authorizes no code.

## Technical Context

**Language/Version**: Controlled Markdown; PowerShell entry points already present in the repository;
Spec Kit CLI 1.0.7

**Primary Dependencies**: Git; project-local Spec Kit skills; `CONTEXT.md`; controlled
Feature/Spec/Tech, architecture, roadmap, VVP, ADR and change records

**Storage**: Git-tracked Markdown and retained hashes/links; no application database or Vault data is
created by PH0

**Testing**: Structural scans, source/hash reconciliation, link and placeholder checks, requirement
trace review, scenario walkthrough and human `PG4` review

**Target Platform**: PH0 document authoring on the current Windows machine; P04's selected
development target is the new Ubuntu Server 26 for Java Server, Web, native PostgreSQL and one
Vault. Windows remains the Desktop/Workspace/CAD client platform. The exact Ubuntu build is
subject to host and dependency qualification under the approved Tech baseline.

**Project Type**: Delivery-readiness and gate package for a future Web/Desktop/Server product

**Performance Goals**: Not applicable to PH0 execution. Performance values for the future pilot are
recorded as owned qualification inputs, not invented here.

**Constraints**: One primary developer; no production implementation before `PG4`; no unapproved
tools or external-source imports; approved predecessor and successor Draft must remain distinct;
missing evidence is `BLOCKED` or `NOT-RUN`; internal-first scope with a separate future Commercial
Readiness Gate

**Scale/Scope**: Seven PH0 work packages (`P01`–`P07`), 32 planned hours plus 8 hours operational
buffer under `IE-PLAN-DEC2026-003@0.2`, one exact next increment, one canonical Technical Pilot
scenario and one `PG4` decision

## Constitution Check

*Author planning-alignment check: re-checked on 2026-09-17 after the approved PH0 correction. The
results below assess document alignment only; they are not PG2, PG3 or PG4 decisions or qualified
independent review.*

| Constitutional gate | Plan response | Result |
|---|---|---|
| Clean-room product definition | PH0 consumes admitted findings and controlled IDEA decisions only; it copies no external implementation or proprietary asset. | `PASS` |
| Exact product authority | Approved predecessor remains pinned to `IE-CHG-PDA-APPROVAL-001`; the successor is separately labelled. | `PASS` |
| Canonical terminology | Contracts and data model use `CONTEXT.md` terms and do not redefine product concepts. | `PASS` |
| Evidence honesty | Every check retains `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN`; dates and plans cannot create a pass. | `PASS` |
| Traceability | Scenario, scope, decisions, evidence and gate records have stable identities and upstream/downstream links. | `PASS` |
| Security and recovery before implementation | P05/P06 require representative negative paths, rollback, backup/restore and review competence. | `PASS` |
| External-source and license control | Every proposed dependency or adapted source passes the repository intake process before import. | `PASS` |
| Internal-first/commercial boundary | PH0 preserves future assessment without introducing customer, billing, public SaaS or sale scope. | `PASS` |
| Gate discipline | Gate Execution State is separate from the four constitutional outcomes. Only `PASS` or valid `PASS-WITH-ACTIONS`, with approved PG2/PG3 baselines and recorded conditions met, authorizes the exact successor. | `PASS` |

No constitutional violation or complexity exception is requested.

## Project Structure

### Documentation (this feature)

```text
specs/004-technical-pilot-readiness/
├── spec.md
├── plan.md
├── research.md
├── baseline-manifest.md
├── data-model.md
├── quickstart.md
├── README.md
├── readiness-register.md
├── trace-matrix.md
├── canonical-scenario.md
├── environment-profile.md
├── test-data-and-verification.md
├── recovery-and-security-plan.md
├── pg4-review-package.md          # created by T025 before the gate review
├── pg4-gate-record.md             # completed by T026 when the gate is decided
├── analysis-findings.md
├── analysis-findings-002.md
├── analysis-findings-003.md
├── analysis-findings-004.md
├── checklists/
│   ├── requirements.md
│   └── readiness.md
├── contracts/
│   ├── README.md
│   ├── baseline-manifest-contract.md
│   ├── decision-and-evidence-register.md
│   ├── pg4-review-package.md
│   └── pg4-gate-record.md
└── tasks.md
```

### Product and planning sources

```text
CONTEXT.md
docs/adr/
docs/architecture/
docs/governance/
docs/product/knowledge/
docs/product/instances/idea-engineering/
```

Product requirements, architecture and Tech decisions are read-only to PH0. The authorized
glossary, process-guide and Appendix A wording corrections are recorded in
[IE-CHG-PH0-CORR-001](../../docs/product/instances/idea-engineering/registers/CHG-2026-09-17-ph0-readiness-correction.md).
It changes no hours, milestone, product obligation or gate disposition.

**Structure Decision**: PH0 is a deep documentation module with three authority contracts—baseline
identity, readiness decisions/evidence and the `PG4` result—plus one review-package format contract.
Product requirements and architecture remain in their existing owners. No production `src/` or
`tests/` directory is created because doing so would cross the gate this increment is meant to
prepare.

## Phase 0: Research and Decision Resolution

The completed research is recorded in [research.md](research.md). It resolves planning questions
without reopening product decisions:

1. Use `IE-CHG-PDA-APPROVAL-001` and commit `f269a044...` as the approved predecessor authority.
2. Preserve the confirmed future multi-location custody direction and the selected one-Vault Core
   v0 boundary, while keeping the exact successor-source disposition open in `D0` until the
   applicable authority records it.
3. Use `004-technical-pilot-readiness` only for `P01`–`P07`; give every code-bearing phase its own
   post-`PG4` Spec Kit increment.
4. Treat environment, corpus, reviewer and topology values as managed readiness decisions with gate
   effects, not as product behavior to guess in this spec.
5. Use the repository external-source intake and future Commercial Readiness Gate as mandatory
   safeguards while keeping the 2026 pilot internal.

## Phase 1: Design and Contracts

| Artifact | Purpose | PH0 trace |
|---|---|---|
| [baseline-manifest.md](baseline-manifest.md) | Pin the approved predecessor, current successor Draft and planning sources without conflation. | `P01` |
| [data-model.md](data-model.md) | Define the readiness records, identities, validation rules and state transitions. | `P01`–`P07` |
| [README.md](README.md) | Provide the navigable reading order, current execution status and non-inference rules. | `P01`–`P07` |
| [readiness-register.md](readiness-register.md) | Track work-package state, open dependencies, results and evidence links. | `P01`–`P07` |
| [trace-matrix.md](trace-matrix.md) | Connect PH0 requirements to approved product, architecture and verification sources. | `P01`–`P07` |
| [canonical-scenario.md](canonical-scenario.md) | Define the bounded Technical Pilot sequence, failure paths and prohibited inferences. | `P02` |
| [environment-profile.md](environment-profile.md) | Define permitted hosts, tools, configuration ownership and setup constraints. | `P04` |
| [test-data-and-verification.md](test-data-and-verification.md) | Define synthetic fixtures, identity separation, locations and the verification matrix. | `P05` |
| [recovery-and-security-plan.md](recovery-and-security-plan.md) | Define rollback, recovery, trust boundaries, abuse cases and reviewer gaps. | `P06` |
| `pg4-review-package.md` (created by T025; see [contract](contracts/pg4-review-package.md)) | Assemble the reviewable P01–P07 summary and proposed PH1 boundary before the gate decision. | `T025` / `P07` |
| `pg4-gate-record.md` (created by T026; see [contract](contracts/pg4-gate-record.md)) | Record the attributable gate execution state, outcome and exact authorization boundary. | `T026` / `P07` |
| [analysis-findings.md](analysis-findings.md) | Retain the read-only cross-artifact analysis, remediation decisions and reviewed source hashes. | `T028`–`T030` |
| [analysis-findings-002.md](analysis-findings-002.md) | Retain the fresh analysis after PH0 scenario/P04–P06 preparation and the baseline-semantics remediation. | `T028`–`T030`, T021 |
| [analysis-findings-003.md](analysis-findings-003.md) | Retain the current read-only analysis after successor-authority wording, navigation and baseline-metadata remediation. | `T028`–`T030` |
| [analysis-findings-004.md](analysis-findings-004.md) | Retain the current analysis after P01 completion, Node.js 24, one-Vault Core v0 and control-envelope consistency corrections. | `T028`–`T030` |
| [contracts/baseline-manifest-contract.md](contracts/baseline-manifest-contract.md) | Define fields and consistency rules for exact source pins. | `P01` |
| [contracts/decision-and-evidence-register.md](contracts/decision-and-evidence-register.md) | Define how open decisions, checks and blockers are owned and closed. | `P03`–`P06` |
| [contracts/pg4-review-package.md](contracts/pg4-review-package.md) | Define the minimum structure and evidence rules for the pre-decision PG4 review package. | `T025` / `P07` |
| [contracts/pg4-gate-record.md](contracts/pg4-gate-record.md) | Define the attributable gate result and authorization boundary. | `P07` |
| [quickstart.md](quickstart.md) | Give the author/reviewer one repeatable PH0 review walkthrough. | `P01`–`P07` |

The contracts describe repository records, not application APIs. Detailed product module boundaries
remain owned by DOC-05. For the future code-bearing plans, `codebase-design` will preserve the
existing authoritative modules and narrow seams rather than introduce cross-module data access.

## Work-Package Alignment

| Work package | Planned output in this increment | Completion rule |
|---|---|---|
| `P01` | Baseline manifest and discrepancy log | Exact approved predecessor and successor delta resolve independently. |
| `P02` | Canonical scenario, mandatory/deferred scope and trace matrix | One end-to-end thread is reviewable without deleting deferred product scope. |
| `P03` | Decision/dependency register | Every open item has owner, due condition, closure evidence and gate effect. |
| `P04` | Environment/delivery profile | Permitted setup, config/secret ownership, build/test entry points and migration rules are explicit. |
| `P05` | Dataset and verification matrix | Fixtures, identities, Artifact evidence, Vault locations and normal/error paths are defined. |
| `P06` | Rollback/recovery/security-review plan | Material failure and trust-boundary checks have procedures, evidence and reviewer gaps. |
| `P07` | Readiness checklist and `PG4` record | Exact baseline, residual risk and one bounded next increment receive an attributable result. |

## Post-Design Constitution Re-check

The Phase 1 artifacts keep baseline authority, open decisions, evidence and gate authorization in
separate records. They do not add product behavior, technology selection, source code, external
dependency, commercial scope or an inferred approval. All pre-planning constitution checks remain
`PASS` as author document-alignment checks after the correction; this does not certify a product
gate. At the current checkpoint, T001–T010, T012–T015, T017–T021 and T028–T030 are complete at
their stated author/evidence-preparation level. P01, P04 and P05 are `COMPLETE / PASS` within their
reviewed scopes. P05 covers synthetic fixture preparation on the development server; application
checks remain `NOT-RUN`. P06 is `COMPLETE / PASS` in the tracker for PH0 documentary readiness;
its runtime recovery/security checks remain `NOT-RUN`. P02, P03 and P07 remain `NOT-RUN`.
`PG4` execution state is `NOT-RUN` with outcome
`NOT-APPLICABLE` until an attributable decision exists.

## Complexity Tracking

No constitutional exception is required.
