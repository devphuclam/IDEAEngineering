# Azure DevOps Platform Adapter

This adapter is the Azure implementation of the provider-neutral collaboration Core. V1 covers
Azure Boards, Azure Repos, pull-request policy observation, the provider-canonical Integration
Queue, bootstrap, offline validation, and the Local Agent Runner profile. It does not provision
Azure infrastructure, create pipelines, use a Managed Runner, or change an Azure process or policy.

## Runtime and configuration

The committed template configuration selects GitHub explicitly and leaves `runtimeProfile` as
`null`. A generated project may deliberately replace it with
`config/agent-workspace.azure.example.json`, then fill in the company's non-secret Organization,
Project, Repository, target ref, process profile, Work Item Type, and expected IDs/fingerprint.
Provider selection is never inferred from `origin`.

`local-agent-v1` is supported only in the Linux Dev Container at
`.devcontainer/agent-workspace/devcontainer.json` or in WSL2 with Node.js 24+ and Git. Native
Windows is reported as unsupported. A null runtime remains useful for provider configuration,
read-only inspection, and offline tests.

Azure authentication is Entra user authentication first. PAT fallback is disabled in the example
and may be enabled only by an explicit company-approved configuration. The configuration stores
only the name of the secret environment variable; credentials never enter the repository,
command arguments, URLs, request bodies, evidence, or ledger.

## Preparation boundary

Run readiness and preview before applying anything:

```bash
workspace doctor --json
workspace provider prepare --preview --json
```

Preparation is an explicit, digest-bound mutation. Apply may create or reuse exactly one
Integration Queue Coordination Work Item for the configured Organization/Project/Repository/target
vector. Its allowlist is limited to the adapter title, Queue Manifest managed description slice,
and two reserved tags. It does not mutate candidate Work Items, process definitions, permissions,
policies, checks, pipelines, infrastructure, or credentials.

Permission probes are read-only and operation-specific. A missing or denied probe is reported as
unavailable/denied; it is never treated as permission to write and never triggers PAT fallback.
Duplicate valid queue records fail closed for administrator remediation.

## Canonical collaboration records

- Work Items keep human-authored description and tags. Coordination State and Change Scope are
  strict managed blocks. Every mutation tests Azure `System.Rev` first and returns an explicit
  conflict on stale state.
- Claims are leases with one authoritative owner. Durable operation receipts make redeliveries
  duplicates; a losing Agent cannot create or control a sandbox.
- Evidence is redacted before publication and appended immutably to the Work Item comments. The
  local `.workspace/` mirror is disposable and can never override provider state.
- The Queue Manifest is one canonical Work Item per exact Organization/Project/Repository/target
  key. It allocates monotonic sequences, permits one integration lease, records decisions, and
  publishes compact completion summaries through the same pending-publication recovery protocol.
- Azure Repos is the only completion surface. Integration runs local verification separately from
  provider policy evaluation, rechecks the target head, completes through the PR API, runs post-
  merge verification, and finalizes the queue. There is no direct target push or bypass flag.

`minimumHumanApprovals: 0` describes the template review intent. It never weakens a stricter
company or Azure policy. The provider's effective policy remains the final gate, including when
the author is allowed to review their own change.

## Source-host adoption

Adoption is one-way and must be previewed first:

```bash
workspace provider adopt --preview --json
workspace provider adopt --apply --json
```

After apply, the configured company Azure remote is the only push-capable `origin`. The optional
personal GitHub template remote is fetch-only and has a locally failing push URL. The adapter
rejects a second push-capable remote and does not silently mirror company code to personal GitHub.

## Normal two-person flow

Each developer uses a separate clone, Entra identity, local Agent Run, and worktree:

```bash
workspace claim <work-item> --json
workspace start <work-item> --json
workspace checkpoint <work-item> --json
workspace handoff <work-item> --to <identity> --json
workspace status <work-item> --json
workspace integrate <work-item> --json
```

The CLI compatibility bridge routes these commands to Azure's provider-neutral adapters. When two
features overlap semantically, record a dependency or explicit serialized decision; path overlap is
visible as a warning and is not automatically promoted to a semantic conflict.

If local state disappears:

```bash
workspace recover --json
```

Recovery reads the canonical queue, Work Items, comments, and completion history first. Its only
provider mutation is reconciling an already-recorded pending publication; it does not create,
merge, close, or delete artifacts.

## Offline and live validation

The offline pilot uses the real Azure adapter over a network-denied fake transport:

```bash
cd tools/agent-workspace
npm ci
npm run typecheck
npm test
npm run test:azure:offline
npm run test:baseline
npm run test:secret-scan
```

Offline evidence is explicitly simulated and proves adapter contracts, not company Azure access.
The live harness remains `not-run` until the approved runtime, exact Organization/Project/
Repository/target allowlist, named identity, capability probes, network, and policy gates are
present. It constructs no mutating provider client before those gates pass. Its write-ahead ledger
records intent before every mutation and recovery adopts only artifacts carrying the exact
validation Run marker; ambiguous ownership or revision/head drift blocks cleanup.

See [`specs/002-azure-devops-adapter/quickstart.md`](../../specs/002-azure-devops-adapter/quickstart.md)
for the full setup and live-gate procedure.
