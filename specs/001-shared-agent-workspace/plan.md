# Implementation Plan: Shared Agent Workspace

**Branch**: `001-shared-agent-workspace` | **Date**: 2026-08-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-shared-agent-workspace/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

Add an optional, real Agent Orchestration Layer as an independently installable TypeScript
package (`tools/agent-workspace/`) so two or more people can coordinate Agent work against one
Generated Project without sharing a mutable filesystem, branch, Agent session, or personal
credential. The first delivery is Azure-free: a `workspace` CLI, a GitHub Work Item/Source Host
adapter, a Local Agent Runner based on isolated git worktrees, and the Work Claim, Agent Run,
Change Scope, Agent Handoff, Agent Checkpoint, Run Evidence, and Integration Queue behavior —
validated by unit, contract, and black-box tests. The Core Workspace (`./scripts/verify-template`)
remains the sole public command and passes without the package installed.

## Technical Context

**Language/Version**: TypeScript 5.x (erasable syntax only), executed natively on Node.js 24 LTS
("Krypton") via type stripping; `tsc --noEmit` is the type-check gate. See `research.md` §1.

**Primary Dependencies**: Runtime: none beyond Node built-ins (`node:fs`, `node:child_process`,
`node:test`). CLI shells out to `git` and `gh` (never spawns concurrent git writes — serialized
per run). Dev: `typescript` only.

**Storage**: Git + GitHub Issues (append-only claim records and evidence comments) and local
git-ignored state under `.workspace/runs/<run-id>/run/` (run context, claim mirror, checkpoints,
evidence mirror). No database. See `contracts/state-files.md`.

**Testing**: `node:test` built-in runner — unit tests for lifecycle transitions, claim
concurrency, lease expiry, overlap classification, dependency ordering, handoff, retry linkage,
idempotency, and redaction; contract tests run every adapter against the same behavior suite;
black-box tests spawn the CLI against temporary repositories (distinct worktrees, duplicate-claim
rejection, checkpoint recovery after sandbox deletion, branch naming, direct-`main` refusal).

**Target Platform**: Linux (Git Bash/WSL2 compatible), macOS, and Windows shells; the CLI runs
wherever `git` and `gh` exist. Managed Azure execution is deferred and disabled.

**Project Type**: CLI tool + library (provider-neutral adapter ports) with its own package
manifest, lockfile, tests, and optional container image definition.

**Performance Goals**: Claim/start/checkpoint/status commands complete in seconds (no scraping,
no polling loops); claim reconciliation is read-comments-once; no daemon. SC-003: replacement
owner resumes within 5 minutes from a valid checkpoint.

**Constraints**: Azure-free first delivery (FR-017); managed execution disabled without an
approved AI Workload Credential (FR-018); no root lifecycle commands added to the template; Core
Workspace verifies without this package installed; GitHub writes are serialized with ≥1s spacing
(secondary rate limits); redaction before persistence (FR-015); blocked/unexecuted checks never
reported as passed (FR-014).

**Scale/Scope**: Two-person pilot — at most two active Agent Runs and one active integration
operation; zero prewarmed managed sessions; 30-day default operational-log retention.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution principle | Gate | Status |
|---|---|---|
| I. Product-Neutral Core | Optional layer only; no root lifecycle commands; Azure stays optional and adapter-based. | PASS |
| II. Specifications Before Implementation | spec.md → clarify → plan artifacts trace to the Work Item and approved design + ADR-0001. | PASS |
| III. Testable, Reproducible Verification | Unit/contract/black-box tests; `./scripts/verify-template` unaffected; no false success claims. | PASS |
| IV. Isolated Collaboration and Durable Handoffs | One sandbox per run, deterministic claims, explicit handoff, durable checkpoints. | PASS |
| V. Least-Privilege and Explicit Integration | Placeholder config only; adapters opt-in; no direct push to protected target; no personal credentials uploaded. | PASS |

*Post-Phase 1 re-check:* PASS — the design (research.md, data-model.md, contracts/) preserves all
five principles; no complexity-tracking violations exist.

## Project Structure

### Documentation (this feature)

```text
specs/001-shared-agent-workspace/
├── spec.md              # Feature specification ($speckit-specify output)
├── plan.md              # This file ($speckit-plan output)
├── research.md          # Phase 0 output ($speckit-plan)
├── data-model.md        # Phase 1 output ($speckit-plan)
├── quickstart.md        # Phase 1 output ($speckit-plan)
├── contracts/           # Phase 1 output ($speckit-plan)
│   ├── README.md
│   ├── cli.md           # workspace CLI contract
│   ├── adapters.md      # provider-neutral TypeScript ports
│   └── state-files.md   # local run/checkpoint/evidence file formats
└── tasks.md             # Phase 2 output ($speckit-tasks - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
tools/
└── agent-workspace/               # optional, independently installable package
    ├── package.json               # engines: node >=24; bin: workspace
    ├── package-lock.json
    ├── tsconfig.json              # nodenext, erasableSyntaxOnly, verbatimModuleSyntax
    ├── README.md                  # package usage + two-person onboarding pointer
    ├── Dockerfile                 # optional; container image definition (unused in V1)
    └── src/
        ├── cli/
        │   ├── index.ts           # command dispatch, --json, exit codes
        │   ├── doctor.ts
        │   ├── claim.ts
        │   ├── start.ts
        │   ├── status.ts
        │   ├── checkpoint.ts
        │   ├── handoff.ts
        │   ├── release.ts
        │   └── integrate.ts
        ├── domain/
        │   ├── types.ts           # shared domain types (data-model.md)
        │   ├── lifecycle.ts       # run state machine + idempotent transitions
        │   ├── claims.ts          # deterministic claim reconciliation
        │   ├── overlap.ts         # path vs semantic overlap classification
        │   ├── queue.ts           # dependency-ordered integration queue
        │   ├── handoff.ts
        │   ├── checkpoint.ts
        │   └── redaction.ts       # evidence redaction rules
        ├── adapters/
        │   ├── github/
        │   │   ├── work-items.ts  # WorkItemAdapter
        │   │   ├── claims.ts      # ClaimStore (append-only records)
        │   │   ├── source-host.ts # SourceHostAdapter (PRs, protection)
        │   │   └── evidence.ts    # EvidenceStore
        │   ├── local/
        │   │   ├── runner.ts      # RunnerAdapter (git worktree)
        │   │   ├── codex-driver.ts# AgentDriver (folder instruction only)
        │   │   └── state-files.ts # run context / claim / checkpoint / evidence files
        │   └── fakes/             # fake adapters for unit + contract tests
        └── errors.ts              # classified failures (capability/credential/quota/...)
    └── test/
        ├── unit/                  # lifecycle, claims, overlap, queue, redaction
        ├── contract/              # same suite against every adapter
        └── blackbox/              # spawns the CLI against temporary repositories
```

**Structure Decision**: A single independently installable package under `tools/agent-workspace/`,
mirroring the design's "optional package boundary": the package owns its manifest, lockfile,
tests, and image definition; the repository root gains no `setup`/`lint`/`test`/`build`/`deploy`
commands; `./scripts/verify-template` stays the sole public Core command. `specs/` and the
optional package directory are the only new top-level areas. `.worktrees/` (sandboxes) is already
git-ignored and is never committed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations; no complexity tracking required.
