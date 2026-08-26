# CLI Contract: `workspace`

**Feature**: 001-shared-agent-workspace | **Package**: `tools/agent-workspace/`

The CLI coordinates human-controlled Agent work (initially Codex Desktop) for the Local Agent
Runner. It is the minimum surface from the approved design; provider serialization stays in the
GitHub adapter.

## Invocation

```text
workspace <command> [options]
```

Global conventions:

- Exit `0` on success; `2` on usage errors; `1` on operational failure with a classified
  diagnostic.
- Machine-readable output on stdout is JSON (one document per command) when `--json` is passed;
  human-oriented text otherwise.
- Operational and usage failures also use one JSON error document on stdout when `--json` is
  passed: `{ "error": { "errorCode", "classification", "message" } }`.
- All state-changing commands identify the Work Item, Agent Run, actor, time, and outcome in
  evidence (FR-013).
- Duplicate delivery is idempotent: re-running the same command with the same token does not
  create a second sandbox, pull request, or state transition.

## Commands

### `workspace doctor`

Check required capabilities (git, gh, node, auth, remote, protection policy) and report each as
`ok` / `missing` / `blocked` with an actionable message.

- No capability failure is silently substituted (FR-019).
- Output (text): one line per check; (JSON): `{ "checks": [{ "name", "status", "detail" }] }`.
- Exit `0` when all checks pass; `1` otherwise.

### `workspace claim <work-item> [--lease <duration>]`

Acquire a renewable, time-bounded Work Claim for one Work Item (FR-002, FR-004).

- Rejects with an actionable conflict when another active claim exists; no sandbox is created.
- Deterministic winner: first valid unexpired claim record wins (see `adapters.md`).
- Output: `{ "claim": { "workItemId", "claimToken", "claimant", "acquiredAt",
  "leaseExpiresAt" } }`.

### `workspace start <work-item>`

Confirm the claim, create the isolated sandbox and descriptive branch, write the local run
context, and report the folder to open in Codex Desktop (FR-003, FR-009, FR-021).

- Requires a claimed Work Item with a declared Change Scope.
- Creates exactly one sandbox per run; a losing or duplicate claim rejects the start (FR-002).
- Branch: `feature/<work-item-slug>-wi-<work-item>-run-<run-id>`; no Agent/AI/Codex/personal
  markers (FR-020). The Work Item and run identity make retry branches collision-safe.
- Output: `{ "run": { "runId", "sandboxId", "branch", "worktreePath", "owner",
  "next": "<folder>" } }`.

### `workspace status [work-item]`

Inspect run state, ownership, checkpoints, verification, and integration result (FR-013, FR-014).

- Passed/failed/blocked/unexecuted checks are distinguishable; a blocked or unexecuted check is
  never shown as passed.
- Output: `{ "runs": [{ "runId", "workItemId", "state", "owner", "branch", "checkpoints":
  [...], "verification": [...], "integration": null|{...} }] }`.

### `workspace checkpoint <work-item>`

Create a durable Agent Checkpoint: push the branch, record verification evidence, unresolved
work, and next action (FR-007, FR-013). Also renews the claim lease as a heartbeat so an active
run's claim does not expire while work is progressing (FR-004; see `research.md` §2).

- Fails with a classified diagnostic when repository state is not valid enough to recover.
- Output: `{ "checkpoint": { "checkpointId", "runId", "branch", "commit", "createdAt" } }`.

### `workspace handoff <work-item> --to <identity>`

Transfer Run Owner responsibility (FR-005, FR-006).

- Requires a valid checkpoint; records previous owner, replacement owner, checkpoint, unresolved
  risks, and next action before control transfers.
- Rejects control instructions from a non-owner.
- Output: `{ "handoff": { "previousOwner", "replacementOwner", "checkpoint", "nextAction" } }`.

### `workspace release <work-item>`

Release the claim; the Work Item becomes claimable again while the run, branch, and evidence
remain preserved (FR-004).

- Output: `{ "released": { "workItemId", "runId", "preserved": true } }`.

### `workspace retry <work-item>`

Create a new linked Agent Run from the latest durable checkpoint (FR-008).

- The earlier run, branch, checkpoint, and evidence remain preserved.
- The new run receives a new claim token, run id, sandbox, and collision-safe branch.
- Without a valid pushed checkpoint, the command fails with a classified capability diagnostic.
- Output: `{ "retry": { "runId", "retryOf", "sandboxId", "branch", "worktreePath", "owner" } }`.

### `workspace integrate <work-item> [--approve-semantic <run-id> --by <identity>]`

Request dependency-aware incorporation of the checkpointed change (FR-011, FR-012, FR-020).

- Ordered by dependency; incorporated one at a time against the latest target; required
  verification reruns after each incorporation.
- The source-host protection policy must expose at least one configured required check; an empty
  check policy is blocked rather than treated as a local fallback.
- Semantic conflicts require a responsible Work Item or human decision; never automatic side
  selection.
- `--approve-semantic` records a serialized integration decision for the named overlapping run;
  `--by` must match the authenticated Run Owner. Without a dependency or this explicit decision,
  the operation remains blocked.
- Output: `{ "integration": { "queuePosition", "state", "verification": [...] } }`.

## Error classification

All failures carry a stable `errorCode` and `classification`:

| Classification | Example |
|---|---|
| `capability` | missing git/gh/node, unsupported platform |
| `credential` | unauthenticated gh, rejected token |
| `quota` | rate-limited GitHub API |
| `network` | DNS/connectivity failure |
| `conflict` | already-claimed Work Item, semantic overlap |
| `usage` | unknown command, malformed option |

No fallback substitutes an unapproved capability (FR-019).
