# Quickstart: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace | **Package**: `tools/agent-workspace/`

Validation guide for the initial Azure-free vertical slice. It proves the feature works
end-to-end; implementation details live in `tasks.md`. Contracts and model details are linked,
not duplicated.

## Prerequisites

- Node.js 24 LTS (`node --version` ≥ 24), npm.
- Git ≥ 2.30 and the GitHub CLI (`gh`) authenticated as each pilot user.
- Two people (Alice, Bob), each with their own clone of one Generated Project and their own
  GitHub identity. Each must have `gh auth status` showing a named login.
- The repository's protected branch requires the repository's required checks; the PR review
  policy remains `minimum_human_approvals: 0` (see `contracts/adapters.md`).

## Setup (once, per person)

```bash
cd tools/agent-workspace
npm install
npm run typecheck      # Node 24 executes the erasable TypeScript directly
npm link               # exposes the `workspace` CLI
workspace doctor
```

Expected: all capability checks `ok`; exit `0`. A missing capability prints a classified
diagnostic and never falls back silently (`contracts/cli.md`).

## Validation scenarios

### Scenario 1 — Two people claim and start isolated work

Alice and Bob each open the repo, and each runs:

```bash
workspace claim 12        # Alice claims Work Item 12
workspace start 12
```

Expected (US1, FR-002/003, SC-001):

- Alice's `start` confirms the claim, creates `.worktrees/run-<id>` with a collision-safe
  `feature/<work-item-slug>-wi-<id>-run-<id>` branch, and prints the folder to open in Codex Desktop.
- If Bob runs `workspace claim 12` while Alice's claim is active, he gets an actionable
  `conflict` error and **no sandbox is created** (SC-002: exactly one active claim).
- Bob claims a different Work Item 13 and starts successfully; the two worktrees coexist with
  no shared mutable files (`git worktree list` shows both).

### Scenario 2 — Claim expiry releases without deleting history

```bash
workspace claim 14 --lease 1m   # short lease for the test
# wait for expiry (or simulate a crashed runner by deleting claim.json and not renewing)
workspace claim 14
```

Expected (FR-004): the Work Item is claimable again; the expired run's branch, checkpoint, and
evidence remain preserved and visible in `workspace status 14`.

### Scenario 3 — Checkpoint survives sandbox destruction

```bash
workspace checkpoint 12
rm -rf .worktrees/run-<id>          # simulate sandbox loss
git worktree prune
workspace start 12                  # after re-claiming
# or, when the previous claim is still owned by the recovering operator:
workspace retry 12
```

Expected (FR-007, FR-008, SC-003): recovery from the latest valid checkpoint succeeds within
minutes; a retry creates a **new run id** linked to the earlier run; the earlier branch and
evidence remain inspectable. With no checkpoint, `start` reports the missing prerequisite.

### Scenario 4 — Handoff transfers single-owner control

```bash
workspace checkpoint 12
workspace handoff 12 --to bob
```

Expected (FR-005/006): the handoff records Alice → Bob, checkpoint, unresolved risks, and next
action. While Alice owns the run, Bob's `workspace checkpoint 12` is rejected; after handoff,
Bob controls it and Alice's control instruction is rejected.

### Scenario 5 — Integration queue serializes and re-verifies

```bash
workspace integrate 12
workspace integrate 13   # sibling feature depending on 12
```

Expected (FR-011/012): candidates incorporate one at a time against the latest target; required
verification reruns after each incorporation; a semantic overlap with no recorded dependency
blocks until an explicit decision; a semantic conflict requires a human/Work Item decision and
is never auto-resolved. No push to `main` happens outside the flow (FR-020).

### Scenario 6 — Evidence is attributable and redacted

```bash
workspace status 12 --json
```

Expected (FR-013..015, SC-006): owner, state transitions, checkpoints, verification outcomes
(passed/failed/blocked/unexecuted distinct), and integration result are attributable; no
credentials, prompts, or transcripts appear; blocked/unexecuted checks are never shown as
passed. `workspace status` with no Work Item inspects local run mirrors; a Work Item argument
also reads canonical provider evidence and released/expired/retried history.

## Test commands

From `tools/agent-workspace/`:

```bash
npm run typecheck     # tsc --noEmit
npm test              # unit + contract tests (node:test)
npm run test:blackbox # spawns the CLI against temporary repositories
npm run test:offline-pilot # two-Agent local pilot without Azure/GitHub credentials
npm run test:live          # only with a dedicated WORKSPACE_BB_REPO test repository
```

The repository-wide gate `./scripts/verify-template` must still pass from a clean checkout
**without** this package installed (Core Workspace independence).

## Expected outcome

All six scenarios pass for the two-person pilot; `workspace doctor`, claim conflict rejection,
checkpoint recovery, handoff control transfer, serialized integration, and redacted evidence are
demonstrated. Model and field details: `data-model.md`; command and error contracts:
`contracts/cli.md`.
