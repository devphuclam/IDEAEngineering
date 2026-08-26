# Shared Agent Workspace Design

**Status:** Approved design

**Approved:** 2026-08-13

**Decision:** [ADR-0001 — Coordinate shared Agent work through isolated runs](../../adr/0001-coordinate-shared-agent-work-through-isolated-runs.md)

## Goal

Add an optional, real Agent Orchestration Layer to the Development Workspace Template so two or more people can coordinate Codex Agent work against one Generated Project without sharing a mutable filesystem, branch, Agent session, or personal credential.

The first usable delivery must work without Azure. A later Azure Platform Adapter may add managed execution after the company supplies its organization, tenant, subscription boundary, identity policy, network policy, and approved AI Workload Credential.

## Design principles

1. Shared coordination, isolated execution: people share Work Items, claims, run state, evidence, and integration order; every Agent Run owns one Agent Sandbox.
2. One active controller: an Agent Run has exactly one Run Owner. Another person takes control only through an explicit Agent Handoff.
3. Durable state over sandbox state: branches, pushed commits, Work Items, and Run Evidence survive; an Agent Sandbox may disappear at any time.
4. Work Item as source of truth: chat history, a dashboard, and local metadata are views or execution aids, not the canonical work record.
5. Optional orchestration: the Core Workspace remains stack-neutral and verifiable without Node.js, Codex SDK packages, Azure tooling, credentials, or network access.
6. Provider and runner boundaries: Work Item providers, source hosts, Agent Drivers, claim stores, evidence stores, and execution environments are replaceable adapters.
7. Explicit failure: unavailable capabilities, rejected credentials, and unsupported Azure regions stop with actionable diagnostics. No silent infrastructure fallback is allowed.

## System shape

```text
Human A + personal Codex identity ----+
                                      +--> Agent Control Plane --> Work Items / Work Claims
Human B + personal Codex identity ----+             |
                                                    +--> Local Agent Runner --> local worktree
                                                    |
                                                    +--> Managed Agent Runner --> managed sandbox

Agent Sandbox --> Agent Checkpoint --> branch / commit / pull request
pull requests --> dependency-aware Integration Queue --> main
```

The Shared Agent Workspace is logical. It is not one GitHub Codespace shared by multiple people. A GitHub Codespace, local worktree, container session, or ephemeral virtual machine is only a possible Agent Sandbox host.

## Optional package boundary

The Agent Orchestration Layer will live in an independently installable TypeScript package under `tools/agent-workspace/` and target the selected Node.js LTS release. It owns its own package manifest, lockfile, tests, and container image definition.

The repository root will not gain placeholder `setup`, `lint`, `test`, `build`, or `deploy` commands. `./scripts/verify-template` remains the sole public Core Workspace command and must continue to pass when the optional package has never been installed.

The package exposes provider-neutral ports with these responsibilities:

- `WorkItemAdapter`: read and append durable Work Item state and evidence.
- `ClaimStore`: acquire, renew, transfer, expire, and release a Work Claim using optimistic concurrency.
- `RunnerAdapter`: create, inspect, and destroy one Agent Sandbox for one Agent Run.
- `AgentDriver`: start or resume the selected coding Agent inside a prepared sandbox.
- `EvidenceStore`: persist Run Evidence and recovery references without persisting unnecessary sensitive content.
- `SourceHostAdapter`: create branches, push Agent Checkpoints, open pull requests, read required checks, and request integration.
- `IntegrationQueue`: order integration by dependency and serialize conflicting candidate changes.

Codex is the first `AgentDriver`. The first Local Agent Runner coordinates the work around Codex Desktop; it does not scrape Desktop state, inject remote messages into a Desktop task, or create a shared Codex thread. A Managed Agent Runner uses the Codex SDK inside its own sandbox when an approved AI Workload Credential is available.

## Initial local vertical slice

The Azure-free delivery includes:

- a GitHub Work Item and Source Host Adapter;
- a Local Agent Runner based on isolated Git worktrees;
- Work Claim, Agent Run, Change Scope, Agent Handoff, Agent Checkpoint, Run Evidence, and Integration Queue behavior;
- a CLI that coordinates human-controlled Codex Desktop work;
- black-box tests with fake provider and runner adapters;
- onboarding for two people using separate clones, identities, Codex tasks, and sandboxes.

The minimum CLI surface is:

```text
workspace doctor
workspace claim <work-item>
workspace start <work-item>
workspace status [work-item]
workspace checkpoint <work-item>
workspace handoff <work-item> --to <identity>
workspace release <work-item>
workspace integrate <work-item>
```

`workspace start` confirms the Work Claim, creates the isolated worktree and descriptive branch, writes the local run context, and tells the Run Owner which folder to open in Codex Desktop. It does not claim that Codex Desktop is centrally controlled.

The GitHub adapter represents human-visible state through the Issue and pull request. Provider-specific serialization is adapter-owned. It must provide a deterministic winning claim or reject the start operation; a losing claimant must not create an active Agent Sandbox. Append-only provider events are preferred so claim, handoff, expiry, retry, and integration history remain attributable.

## Work Claim and control semantics

A Work Item has at most one active Agent Run. A Work Claim is a renewable lease with a configurable heartbeat and expiry. Expiry releases the Work Item for a new attempt without deleting the expired Agent Run, its branch, or its Run Evidence.

An active Agent Run accepts instructions from exactly one Run Owner. Other participants may inspect status, add Work Item comments, or request handoff, but they cannot concurrently control the run. Handoff records the old owner, new owner, Agent Checkpoint, unresolved risks, and next action before ownership changes.

Retry never reactivates or overwrites an earlier Agent Run. It creates a new run identifier linked to the earlier attempt and starts from an explicit Agent Checkpoint or clean agreed base.

## Change Scope and dependency semantics

Before an Agent Run starts, its Work Item declares a Change Scope containing:

- expected repository paths or path patterns;
- semantic seams, modules, or domain concepts expected to change;
- parent and prerequisite Work Items;
- intended integration target.

Path overlap is a warning, not a hard lock. Two changes may touch the same file when they alter independent semantic seams. Semantic overlap requires an explicit dependency or serialized integration; the coordinator must not present the work as safely parallel when both runs own the same behavior.

For sibling features that depend on a common parent feature:

1. Prefer merging the stable foundation into `main` behind a feature flag.
2. When that is not possible, create one short-lived parent integration branch.
3. Give every child Work Item the same agreed integration target and explicit dependency information.
4. Integrate children one at a time against the latest target and rerun required checks after each incorporation.

Mechanical merge conflicts may be resolved by an Agent when focused verification proves the result. A semantic conflict returns to the responsible Work Item or a human decision. The integration path never automatically selects `ours` or `theirs` for a semantic conflict.

## Agent Run lifecycle

The conceptual lifecycle is:

```text
requested -> claimed -> preparing -> running -> verifying -> ready-for-integration
     |          |           |          |          |                 |
     +----------+-----------+----------+----------+-----------------+
                            terminal: integrated | failed | cancelled | expired
```

An Agent Run keeps the same identifier through handoff. A retry is a new Agent Run. States and transitions must be idempotent because provider APIs and message brokers can repeat requests.

Before handoff, release, idle termination, or successful completion, the runner creates an Agent Checkpoint when repository state is valid enough to recover. A checkpoint records the branch, commit, verification evidence, unresolved work, and next action. Uncommitted sandbox state is never the only recovery source.

## Git and review policy

- Every change uses a focused descriptive branch and pull request or equivalent review surface.
- Branch names may include Work Item context but do not include `codex`, `AI`, an Agent name, or a person's identity.
- Agents may create branches, commit, push, open pull requests, and update Work Items through the selected adapters.
- Agents do not push directly to `main`.
- Required checks gate integration.
- The repository policy remains `minimum_human_approvals: 0`.
- The author may satisfy self-review intent and merge after required checks. A platform that does not count author approval records self-review as a checklist or comment rather than fabricating an independent approval.

## Managed Azure mapping

The recommended Azure Platform Adapter maps the provider-neutral ports as follows:

| Capability | Recommended Azure service |
| --- | --- |
| Agent Control Plane API and workers | Azure Container Apps |
| Managed Agent Sandbox | Azure Container Apps Dynamic Sessions with a custom container |
| Runner images | Azure Container Registry |
| Command and event transport | Azure Service Bus |
| Work Claim and Agent Run metadata | Azure Table Storage using ETag conditional updates |
| Run Evidence and larger artifacts | Azure Blob Storage |
| Human authentication | Microsoft Entra ID |
| Service authentication | Managed Identity |
| Unavoidable secrets | Azure Key Vault |
| Logs, metrics, and lifecycle events | Azure Monitor and Log Analytics |
| Reference infrastructure definition | Bicep inside the Azure Platform Adapter |

This mapping does not select Azure Repos, Azure Boards, or Azure Pipelines. GitHub may remain the source host and Work Item provider while Azure hosts only the managed Agent infrastructure. Provider migration occurs only when company policy requires it.

Dynamic Sessions is capability-checked before deployment. If the approved region, quota, network policy, or subscription does not support it, deployment stops with the failed capability. The only approved alternatives are an explicitly selected ephemeral Azure Container Apps Job or ephemeral virtual-machine Runner Adapter; no fallback occurs automatically.

Microsoft Dev Box is not the managed Agent Sandbox target. Human developers may use an organization-approved workstation product, personal Codespaces, or local environments independently from the Agent Runner architecture.

## Security boundaries

- Humans authenticate to the Agent Control Plane with named Microsoft Entra identities.
- Local Agent Runners use the Run Owner's existing source-host, Git, and Codex identities.
- Azure services use Managed Identity and least-privilege Azure RBAC wherever supported.
- A Managed Agent Runner uses an organization-approved AI Workload Credential. Personal ChatGPT cookies, Codex Desktop sessions, refresh tokens, and developer credentials are never uploaded to Azure or baked into an image.
- If no AI Workload Credential is approved, managed execution remains disabled while local execution continues.
- Source-host credentials are short-lived and repository-scoped where the provider supports that model.
- Agent Sandboxes receive only the permissions and secrets required by the claimed Work Item.
- Direct production access, subscription administration, broad repository administration, and unrestricted internal-network access are outside the default permission profile.
- Container ingress is authenticated and HTTPS-only. Enterprise deployments prefer internal ingress and private networking when company policy supplies those boundaries.
- Network egress is denied by default and opened through an explicit Stack Profile or Platform Adapter allowlist. A runner does not silently gain unrestricted Internet or corporate-network access.

## Evidence, privacy, and retention

Run Evidence includes the Work Item identifier, Agent Run identifier, Run Owner, timestamps, state transitions, command category, branch, checkpoint commit, verification commands and outcomes, integration result, and blocker classification.

Logs exclude credentials and apply redaction before persistence. Raw prompts, full source snapshots, personal conversation history, and complete Agent transcripts are not retained by default. An organization may opt in only through an explicit policy with an approved retention period.

Operational logs default to 30-day retention. Pull request evidence and repository history follow the repository's retention lifecycle. An Agent Run never reports an unexecuted or blocked check as passing.

## Failure and recovery

- A runner crash leaves its Work Claim to expire unless a healthy owner renews or releases it.
- A replacement run starts from the latest valid Agent Checkpoint and receives a new Agent Run identifier.
- Service Bus consumers are idempotent and correlate every command with Work Item and Agent Run identifiers.
- Duplicate delivery cannot create a second sandbox, duplicate pull request, or second state transition.
- Poison commands move to an inspectable failure path rather than retrying forever.
- Sandbox destruction deletes ephemeral files but not Work Items, branches, pushed commits, Run Evidence, or approved logs.
- A capability or credential failure is classified and reported; it is not bypassed by installing an unapproved substitute.

## Cost and concurrency defaults

The initial managed profile for a two-person team allows at most two active Agent Runs and one active integration operation. It starts with zero prewarmed Dynamic Sessions. A session becomes eligible for destruction after 15 minutes of inactivity, and the coordinator requests a checkpoint before normal termination.

Azure Budget alerts are required before managed execution is enabled. Automatic quota increases and silent scale-limit changes are not allowed. Teams may change concurrency, warm-pool, retention, and idle values through reviewed adapter configuration after observing real usage.

## Infrastructure boundary

The Azure reference adapter uses Bicep because it is native to Azure, but infrastructure behavior is described through the Platform Adapter contract. A company may replace Bicep with Terraform without changing Core Workspace, Work Item, Agent Run, Work Claim, or Runner Adapter semantics.

Committed examples contain placeholders only. They do not provision resources, contact Azure, select a tenant or subscription, or contain company identifiers and credentials. Live deployment requires explicit company-provided values and approval.

## Acceptance criteria

### Core Workspace independence

- A clean checkout passes `./scripts/verify-template` without Node.js package installation, Codex SDK installation, Azure CLI, Azure credentials, or network access.
- The optional orchestration package has its own lifecycle and does not add fake root lifecycle commands.
- Azure and managed execution remain disabled when their configuration is absent.

### Multi-user local operation

- Two people can claim different Work Items, create separate branches and worktrees, and operate separate Codex tasks without writing to each other's mutable files.
- A second claimant cannot start an active Agent Sandbox for an already claimed Work Item.
- An expired claim can be reclaimed without deleting the earlier Agent Run or its evidence.
- An Agent Handoff transfers the single-writer right and records a recoverable checkpoint.
- Retry creates a new linked Agent Run rather than mutating the previous attempt.

### Overlap and integration

- Path overlap produces a visible warning with both Work Items and scopes.
- Semantic overlap blocks unsafe parallel execution until a dependency or serialized integration decision is recorded.
- Parent and child Work Items can target a common integration branch when the foundation cannot yet merge to `main`.
- The Integration Queue processes conflicting changes one at a time against the latest target and reruns required verification.
- Semantic conflicts require a human or responsible Work Item decision; no automatic side selection is permitted.

### Git, review, and recovery

- Generated branch names contain no Agent, AI, Codex, or personal identity marker.
- Agent permissions do not allow direct push to `main`.
- `minimum_human_approvals: 0` and author self-review intent remain supported while required checks still gate integration.
- Deleting an Agent Sandbox does not prevent a new run from recovering from the last valid Agent Checkpoint.
- Run Evidence distinguishes passed, failed, blocked, and unexecuted verification.

### Managed Azure operation

- The adapter authenticates humans with Entra ID and services with Managed Identity where supported.
- No personal ChatGPT or Codex session is accepted as a managed credential.
- Claim updates use conditional concurrency so two successful active claims cannot exist for one Work Item.
- Duplicate commands are idempotent and cannot create duplicate runs or integrations.
- Dynamic Sessions support is checked before deployment; unsupported capability fails explicitly.
- Network, secret, retention, concurrency, idle, and budget controls are configurable without changing Core semantics.

### Privacy and auditability

- Default logs contain attributable run metadata and verification evidence but not raw credentials, prompts, source snapshots, or complete transcripts.
- Operational logs expire after the configured retention period, defaulting to 30 days.
- Every state-changing operation identifies the Work Item, Agent Run, actor, time, and outcome.

## Verification strategy

The optional package will use unit tests for lifecycle transitions, claim concurrency, lease expiry, overlap classification, dependency ordering, handoff, retry linkage, idempotency, and redaction. Contract tests will run every adapter against the same provider-neutral behavior suite.

Black-box local tests will create temporary repositories and prove that two Local Agent Runners receive distinct worktrees, duplicate claims are rejected, checkpoints survive sandbox deletion, normal branch names are used, and direct `main` mutation is refused.

Azure tests are layered:

1. Offline schema and Bicep validation with placeholder configuration.
2. Adapter contract tests using fakes or approved local emulators where policy permits.
3. Live sandbox, identity, storage, queue, network, and recovery smoke tests only after the company provides an approved Azure environment and credentials.

No unavailable live Azure check is reported as passing.

## Delivery phases

1. Preserve the Core Workspace and define orchestration schemas and adapter contracts.
2. Deliver the CLI, fake adapters, GitHub adapter, Local Agent Runner, and two-person onboarding.
3. Add Change Scope analysis, Agent Handoff, durable checkpoints, and the Integration Queue.
4. Add the Azure reference adapter, Bicep definitions, capability checks, and offline verification without provisioning.
5. After company approval, enable Managed Agent Runners and execute live Azure acceptance tests.

Each phase must be usable and verifiable before the next begins. The local path remains supported after managed execution is introduced.

## Out of scope

- A shared writable Codespace, shared worktree, shared branch, or simultaneously controlled Agent thread.
- A custom web dashboard in the first delivery.
- Automatic migration from GitHub to Azure Repos, Azure Boards, or Azure Pipelines.
- AKS or a Kubernetes control plane for the initial managed architecture.
- Uploading or sharing personal ChatGPT, Codex, Git, GitHub, or Azure credentials.
- Application Stack Profiles, databases for the generated product, OpenAPI, Swagger UI, or product-specific deployment.
- Live Azure provisioning before company boundaries and approval exist.
- Automatic fallback to an unapproved runner service, region, credential, package, or network path.

## Company prerequisites for managed execution

Before phase 5, obtain and record outside committed examples:

- Azure DevOps Organization and project only if Azure DevOps services are selected;
- Microsoft Entra tenant and approved human groups;
- subscription and resource-group boundaries;
- approved regions and Container Apps Dynamic Sessions availability;
- networking, egress, private endpoint, logging, retention, and data-residency policy;
- source-host application or service-connection policy;
- an approved AI Workload Credential and its rotation owner;
- Azure RBAC owners, deployment approvers, budget, quota, and incident contacts.

## References

- [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)
- [Codex App Server](https://learn.chatgpt.com/docs/app-server)
- [GitHub Codespaces collaboration](https://docs.github.com/en/enterprise-cloud@latest/codespaces/developing-in-a-codespace/working-collaboratively-in-a-codespace)
- [Azure Container Apps Dynamic Sessions](https://learn.microsoft.com/en-us/azure/container-apps/sessions)
- [Azure Container Apps custom container sessions](https://learn.microsoft.com/en-us/azure/container-apps/sessions-custom-container)
- [Azure Container Apps authentication and authorization](https://learn.microsoft.com/en-us/azure/container-apps/authentication)
- [Managed identities in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/managed-identity)
- [Azure Container Apps secrets and Key Vault references](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets)
- [Azure Service Bus delivery and duplicate processing](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-message-loss-and-duplicates)
- [Azure Table Storage optimistic concurrency](https://learn.microsoft.com/en-us/rest/api/storageservices/Update-Entity2)
- [Microsoft Dev Box overview and maintenance status](https://learn.microsoft.com/en-us/azure/dev-box/overview-what-is-microsoft-dev-box)
