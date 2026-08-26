# agent-workspace

Optional Agent Orchestration Layer for the Development Workspace Template.

Coordinates shared Agent work through isolated runs: claim a Work Item, start work in a
git worktree sandbox, checkpoint durable state, hand off control, integrate safely, and
inspect attributable evidence. The Core is provider-neutral; the selected adapter may be
GitHub or Azure DevOps. No Azure SDK runtime dependency is required.

## Requirements

- Node.js >= 24 (type stripping; no build step)
- git >= 2.30
- GitHub CLI (`gh`) is required only when the selected provider is GitHub
- Azure DevOps uses Entra user authentication first; PAT fallback is disabled unless explicitly
  company-approved

## Setup (once, per person)

```bash
cd tools/agent-workspace
npm install
npm run typecheck   # tsc --noEmit
npm test            # unit + contract tests
npm run test:blackbox
npm run test:offline-pilot  # simulate two Agents without Azure/GitHub credentials
```

To expose the `workspace` CLI on PATH: `npm link` (or run `node src/cli/index.ts`).

## Two-person onboarding

1. **Prepare**: both people clone one Generated Project and authenticate the selected provider.
2. **doctor**: `workspace doctor` — all capability checks must report `ok` (exit 0).
3. **claim**: `workspace claim <work-item>` — acquires a renewable, time-bounded lease.
   A second claim on the same Work Item is rejected with an actionable `conflict`.
4. **start**: `workspace start <work-item>` — creates `.worktrees/<run-id>` on a collision-safe
   Work Item/run branch and prints the folder to open in Codex Desktop.
5. **checkpoint**: `workspace checkpoint <work-item>` — pushes the branch, records
   verification evidence, and renews the claim lease (heartbeat).
6. **handoff**: `workspace handoff <work-item> --to <identity>` — transfers single-owner
   control (requires a valid checkpoint; non-owners are rejected).
7. **release**: `workspace release <work-item>` — frees the claim; run, branch, and
   evidence stay preserved.
8. **retry**: `workspace retry <work-item>` — creates a new linked run from the latest pushed
   checkpoint after sandbox loss or a failed attempt.
9. **integrate**: `workspace integrate <work-item>` — dependency-aware incorporation
   through the queue; required verification reruns after each incorporation; semantic
   conflicts require a human/Work Item decision.
10. **status**: `workspace status [work-item] --json` — attributable current and historical run state, ownership,
   checkpoints, verification outcomes, and integration result; blocked/unexecuted checks
   are never shown as passed; sensitive data is redacted.

For Azure DevOps, run `workspace provider prepare --preview` and apply the approved unchanged
digest before the normal flow. The Azure queue is provider-canonical, so local `.workspace/`
files are only disposable mirrors.

## CLI reference

| Command | Purpose |
|---|---|
| `workspace doctor` | Check the selected provider, runtime, auth, target, permissions, remotes, and policy |
| `workspace provider prepare --preview|--apply` | Preview or apply the allowlisted provider bootstrap |
| `workspace provider adopt --preview|--apply` | Preview or apply one-way Azure source-host adoption |
| `workspace claim <work-item> [--lease <duration>]` | Acquire a renewable claim; deterministic first-valid-wins |
| `workspace start <work-item>` | Create the isolated worktree sandbox and run context |
| `workspace status [work-item]` | Inspect run state, ownership, checkpoints, verification, integration |
| `workspace checkpoint <work-item>` | Durable checkpoint + lease heartbeat renewal |
| `workspace handoff <work-item> --to <identity>` | Transfer Run Owner responsibility |
| `workspace release <work-item>` | Release the claim; history preserved |
| `workspace retry <work-item>` | Create a new linked run from the latest checkpoint |
| `workspace integrate <work-item>` | Queue incorporation with verification rerun |

Exit codes: `0` success, `1` operational failure (classified diagnostic), `2` usage error.
Add `--json` for one machine-readable JSON document per command, including classified errors.

The Local Agent Runner V1 is optional and requires the Linux Dev Container or WSL2 when selected;
native Windows is reported as unsupported. Managed Runner, Azure infrastructure, and application
pipeline work are outside this template.

## Offline pilot

When Azure access, GitHub credentials, or a second developer are unavailable, run the
deterministic local pilot:

```bash
npm run test:offline-pilot
```

It simulates Alice and Bob with two real git worktree sandboxes and fake provider adapters.
The scenario verifies isolated edits to the same path, checkpoint, handoff, stale-owner
rejection, retry from a checkpoint, semantic-overlap blocking, explicit approval, and
one-at-a-time integration. It does not prove live GitHub or Azure behavior; run the live
acceptance cases later when a shared test repository and approved credentials are available.

## Live GitHub pilot

Use a dedicated test repository only. The live pilot creates real issues, comments, branches,
and labels, then closes its Work Items during cleanup:

```powershell
$env:WORKSPACE_BB_REPO = 'devphuclam/agent-workspace-live-pilot'
npm run test:live
```

The live pilot validates the GitHub control plane and local runners. A private repository on
plans without branch-protection support will intentionally refuse integration because required
checks cannot be verified; that refusal is a pass for the safety gate, not a merged integration.

## Contracts and design

Full contracts, data model, and validation scenarios live in
[`specs/001-shared-agent-workspace/`](../../specs/001-shared-agent-workspace/):
`contracts/cli.md`, `contracts/adapters.md`, `contracts/state-files.md`, `data-model.md`,
`research.md`, `quickstart.md`.

For Azure-specific setup, canonical records, permission probes, policy precedence, and live
recovery, see [`docs/agents/azure-devops-platform-adapter.md`](../../docs/agents/azure-devops-platform-adapter.md)
and [`specs/002-azure-devops-adapter/quickstart.md`](../../specs/002-azure-devops-adapter/quickstart.md).
