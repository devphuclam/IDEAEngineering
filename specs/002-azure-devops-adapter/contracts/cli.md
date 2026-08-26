# CLI Contract

## Global conventions

The executable remains `workspace`. Provider selection comes from `agent-workspace.config.json`;
commands do not silently infer or fall back to GitHub from a remote URL.

The template commits a non-secret default file that selects `github` and sets
`runtimeProfile: null`. A Generated Project deliberately changes that selection when it adopts
Azure; the absence of a company Azure configuration does not make GitHub selection implicit.

```text
workspace <command> [subcommand] [options]
```

- Exit `0`: requested command completed successfully.
- Exit `1`: operational failure or blocked result with stable classification.
- Exit `2`: usage/configuration syntax error.
- `--json`: one JSON document on stdout; diagnostics go inside that document, not mixed text.
- Errors: `{ "error": { "errorCode", "classification", "message", "nextAction?" } }`.
- Every mutating command accepts `--operation-id <id>`. If omitted, the CLI creates and locally
  journals an ID before provider contact. The result always reports it so an external retry can
  reuse it.
- Tokens, Authorization headers, credential-bearing URLs, secret values, and subprocess token
  output are redacted before stdout/stderr/evidence.

## `workspace doctor [--live]`

Provider-neutral readiness report. Default mode checks runtime, config, local Git/worktree, remote
roles, local verification commands, and offline-test capability without requiring Azure access.
`--live` additionally checks Entra/PAT selection, resolved target, exact effective
permissions-by-operation, capability reads, process mapping/fingerprint, queue visibility, and
target policy visibility read-only. It emits no write probe.

When `runtimeProfile` is omitted or `null`, default doctor reports
`runtime-profile: not-selected` without invalidating provider configuration or offline inspection.
`workspace doctor --live` and any Local Agent Runner-dependent command report `not-run` with
`select local-agent-v1 in Linux Dev Container or WSL2` before auth/provider contact.

```json
{
  "provider": "azure-devops",
  "mode": "live",
  "environment": "linux-dev-container",
  "authMode": "entra-user",
  "checks": [
    { "name": "runtime.node", "outcome": "passed", "detail": "Node 24.x" },
    { "name": "provider.policy-visibility", "outcome": "blocked", "classification": "capability", "nextAction": "request read policy permission" }
  ]
}
```

Outcomes are `passed | failed | blocked | unexecuted | not-run`. Overall exit is `0` only when all
checks required for the requested mode pass. Direct native Windows is explicitly unsupported for
`local-agent-v1`.

## `workspace provider prepare [--preview | --apply]`

`--preview` is the default and is read-only. It reports:

- exact configured and resolved Organization/Project/Repository/target;
- selected non-secret auth mode and each namespace/token/action-bit permission result plus its
  capability-read result;
- process profile, Work Item Type, observed fingerprint, resolved state mapping;
- queue key and existing valid coordination record count;
- remote-role and policy audit findings;
- the exact allowlisted changes that apply would make;
- administrator-owned gaps as required actions.

`--apply` requires a preview digest in the same invocation or
`--plan-digest <sha256:...>` from an unchanged preview, plus operation ID. It rejects target drift,
plan drift, missing permissions, duplicate queue records, or any action outside the fixed allowlist.

For the GitHub provider, preview/readiness reports preparation as `not-applicable`; `--apply`
returns the same classified result before a provider mutation. GitHub's canonical queue is created
only through the normal queue mutation protocol, never as bootstrap side effect.

```json
{
  "operationId": "op-...",
  "mode": "preview",
  "target": { "organizationUrl": "...", "projectId": "...", "repositoryId": "...", "targetRef": "refs/heads/main" },
  "planDigest": "sha256:...",
  "proposedChanges": [],
  "auditFindings": [],
  "readyToApply": true
}
```

Three identical applies reuse the same queue Work Item and create no duplicate artifact or
out-of-allowlist field/tag change. Apply may set only its title, managed Queue Manifest slice, and
two reserved queue tags; it never mutates a candidate Work Item.

## `workspace provider adopt [--preview | --apply]`

One-way remote migration, separate from provider preparation. Preview reports current fetch/push
URLs and proposed roles. Apply:

1. validates the configured Azure Repository URL;
2. makes it the only push-capable `origin`;
3. optionally retains personal template provenance as fetch-only `template-upstream`;
4. installs a locally failing push URL for that upstream;
5. re-reads all remotes and refuses success if any personal GitHub push path remains.

It does not copy application code to an unexpected Repository, create a Repository, or establish a
bidirectional mirror.

## Existing collaboration commands

`claim`, `start`, `checkpoint`, `handoff`, `release`, `retry`, `status`, and `integrate` retain their
feature-001 meanings. Their provider interaction changes as follows:

- mutating commands use one stable operation ID and expected revision;
- `claim` returns the winning current block or a conflict; a losing claimant creates no sandbox;
- `checkpoint`, `handoff`, release/expiry, retry, and outcome update current Coordination State and
  publish one immutable receipt before a later transition can advance;
- `status` reads canonical provider state first and labels any local mirror stale/missing;
- provider-specific IDs appear only inside structured references, not as domain control logic.

## `workspace recover [work-item]`

Read-only provider recovery followed by atomic recreation of ignored local indexes. With no Work
Item argument it recovers the selected Repository/target queue and all linked active runs visible
to the identity. It never mutates provider state except reconciling an adapter-owned pending
publication through the explicit receipt protocol, and that repair is reported.

```json
{
  "recovery": {
    "queueKey": "sha256:...",
    "activeCandidates": 2,
    "completedSummariesRead": 41,
    "localIndexesRebuilt": false,
    "localRecovery": {
      "queueMirror": "rebuilt",
      "checkpoints": "not-run",
      "activeRuns": "not-run",
      "runEvidence": "not-run",
      "pullRequests": "not-run"
    },
    "providerRepairs": []
  }
}
```

Ambiguous/corrupt canonical records block recovery; a stale local file never wins.

## `workspace integrate <work-item>`

Integration is provider-neutral and uses these ordered gates:

1. active claim/owner and durable checkpoint;
2. canonical queue enqueue/lease and dependency/semantic-decision eligibility;
3. latest target commit captured in the lease;
4. configured local verification against that target;
5. idempotent selected-provider PR for the source/target commits;
6. observable provider policy snapshot with all effective requirements passed;
7. target commit recheck and server-side PR completion without bypass;
8. verification of the updated target;
9. queue finalization and immutable completion summary.

Pending/failed/blocked/unexecuted/unavailable local or provider evidence stops the flow and remains
visible. If the target or policy changes, the attempt is released/requeued for fresh evaluation;
the next candidate does not begin.

```json
{
  "operationId": "op-...",
  "integration": {
    "queuePosition": 1,
    "state": "queued|preparing|blocked|incorporating|integrated|rejected",
    "targetCommit": "sha",
    "pullRequest": null,
    "verification": [],
    "policy": null,
    "nextAction": "..."
  }
}
```

No CLI option exposes policy bypass, direct target push, automatic semantic side selection,
Managed Runner selection, Azure infrastructure, or pipeline mutation.
