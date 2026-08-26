# State Files: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace | **Package**: `tools/agent-workspace/`

Local durable state owned by one Run Owner inside their clone. These files are git-ignored
(`.workspace/` and `.worktrees/` are ignored); they are execution aids, never the canonical work record
(Work Items and source-host state are canonical).

## Local run context — `.workspace/runs/<run-id>/run/context.json`

Written by `workspace start`; read by every later command and by the receiving Agent.

```json
{
  "runId": "run-01J2...",
  "workItemId": "123",
  "owner": "alice",
  "sandboxId": "sandbox-01J2...",
  "branch": "feature/reporting-foundation",
  "worktreePath": ".worktrees/run-01J2...",
  "changeScope": {
    "paths": ["src/reporting/"],
    "semanticSeams": ["reporting-service"],
    "prerequisites": [],
    "integrationTarget": "main"
  }
}
```

Retry runs copy the latest source-host checkpoint into their new run mirror and add `retryOf` to
the run context/evidence. The source-host branch and checkpoint comment remain authoritative.

## Claim state — `.workspace/runs/<run-id>/run/claim.json`

Mirror of the owner's active claim; the authority remains the append-only records on the Work
Item provider.

```json
{
  "workItemId": "123",
  "claimToken": "claim-01J2...",
  "claimant": "alice",
  "acquiredAt": "2026-08-13T09:00:00.000Z",
  "leaseExpiresAt": "2026-08-13T17:00:00.000Z"
}
```

## Checkpoint record — `.workspace/runs/<run-id>/run/checkpoints/<checkpointId>.json`

Serialized `AgentCheckpoint` (see `adapters.md`); the branch/commit are pushed to the source
host, so recovery never depends on uncommitted sandbox files.

```json
{
  "checkpointId": "cp-01J2...",
  "runId": "run-01J2...",
  "branch": "feature/reporting-foundation",
  "commit": "9f2c1a4...",
  "verification": [
    { "command": "./scripts/verify-template", "outcome": "passed" },
    { "command": "npm test", "outcome": "unexecuted" }
  ],
  "unresolvedWork": ["integration test for the export path"],
  "nextAction": "push checkpoint and request integration",
  "createdAt": "2026-08-13T15:30:00.000Z"
}
```

## Evidence mirror — `.workspace/runs/<run-id>/run/evidence.json`

Local mirror of `RunEvidence`; persisted through `EvidenceStore` with redaction. Never contains
credentials, prompts, transcripts, or full source snapshots.

```json
{
  "runId": "run-01J2...",
  "workItemId": "123",
  "owner": "alice",
  "timestamps": ["2026-08-13T09:00:00.000Z", "2026-08-13T15:30:00.000Z"],
  "stateTransitions": [
    { "from": "requested", "to": "claimed", "at": "2026-08-13T09:00:00.000Z" },
    { "from": "claimed", "to": "running", "at": "2026-08-13T09:05:00.000Z" }
  ],
  "checkpointRefs": ["cp-01J2..."],
  "verification": [{ "command": "./scripts/verify-template", "outcome": "passed" }],
  "integrationResult": "pending",
  "blocker": null,
  "retention": { "days": 30, "expiresAt": "2026-09-12T15:30:00.000Z" }
}
```

## Writing rules

- Every state-changing operation appends (never overwrites history) where attribution matters;
  derived mirrors may be replaced atomically (write temp file, rename).
- File writes are serialized per run; no concurrent git or file operations from one CLI process.
- Checkpoints and evidence that contain a `blocked`/`unexecuted` outcome never rewrite it as
  `passed` (FR-014).
- The local integration queue mirror is `.workspace/integration-queue.json`; it is disposable
  coordination state, while Work Item comments, checkpoint branches, pull requests, and evidence
  remain canonical on the source host.
