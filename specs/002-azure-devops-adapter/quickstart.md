# Quickstart: Azure DevOps Collaboration Adapter

**Feature**: 002-azure-devops-adapter | **Purpose**: post-implementation validation guide

This guide has two deliberately separate paths. Offline validation needs no Azure account and
produces simulated evidence. Live validation is refused until a real company test target satisfies
every gate.

Implementation completion and verification outcome are reported separately. A successful executed
check is `passed`; an attempted check prevented by environment or tool policy is `blocked`; a check
prevented before execution by a missing prerequisite or gate is `not-run`; and an executed failure
is `failed`. `blocked` and `not-run` must never be presented as PASS.

## 1. Choose a supported Local Agent Runner environment

V1 supports:

- the optional Linux Dev Container at `.devcontainer/agent-workspace/devcontainer.json`; or
- WSL2 with Node.js >= 24 and Git.

The checked-in Dev Container builds from a pinned Node 24 Debian-slim image and the dated Debian
snapshot `20260803T000000Z`; the direct bash, CA certificate, and Git package versions are pinned
in `.devcontainer/agent-workspace/Dockerfile`. It runs as the non-root `node` user and marks the
mounted workspace as a Git safe directory after creation. It does not install Azure CLI, GitHub
CLI, credentials, or any application stack. With Docker Desktop and the Dev Container CLI available
on the host, start it locally with:

```bash
devcontainer up --workspace-folder . --config .devcontainer/agent-workspace/devcontainer.json
devcontainer exec --workspace-folder . --config .devcontainer/agent-workspace/devcontainer.json bash
```

Inside the container, run the package commands from the repository checkout. The package README
also documents the optional local `npm link` step for exposing the `workspace` CLI; invoking
`node tools/agent-workspace/src/cli/index.ts ...` is the dependency-free equivalent.

Direct native Windows is outside V1 and `workspace doctor` reports it as unsupported. A Dev Box is
supported only when running one of the two environments above.

The Generated Project starts with `runtimeProfile: null`. That is intentional: Core verification,
provider configuration, and offline inspection work without selecting a Local Agent Runner. Select
`local-agent-v1` only when using the Dev Container or WSL2; until then runner-dependent and live
commands report `not-run`, not a partial pass.

For GitHub Codespaces, first create the Generated Project Repository, then create a Codespace from
that Repository's advanced creation options and select the Agent Workspace dev-container
configuration. The template's one-click unpublished Codespace uses the default Core configuration,
because alternate configurations are optional.

## 2. Install the optional package dependencies

Inside the supported environment:

```bash
cd tools/agent-workspace
npm ci
npm run typecheck
npm test
```

`npm ci` uses the committed lockfile. The package adds no Azure SDK runtime dependency.

## 3. Run the complete offline path

No Azure CLI, Azure account, credentials, Organization, Project, Repository, or network access is
needed:

```bash
npm run test:azure:offline
```

Expected result:

- real Azure adapter serializers and concurrency logic run over fake HTTP/Git/token transports;
- network access is denied by the harness;
- two simulated identities coordinate claims, handoff, recovery, queue, local verification,
  provider policy, and integration;
- all evidence says `mode: offline` and `evidence: simulated`;
- no line claims that live Azure permissions or behavior passed.

Also run the Core verifier from the Repository root:

```bash
cd ../..
./scripts/verify-template
```

This must pass independently of the optional package and Azure.

Before calling the implementation offline-complete, repeat the complete package and Core matrix
from separate clean checkouts in both the optional Linux Dev Container and WSL2. Record each
environment and command outcome separately, including `npm run test:baseline` after the package
tests. An unavailable environment remains `not-run`; direct native Windows cannot substitute for
either baseline.

## 4. Create company provider configuration later

The Generated Project starts with a committed non-secret `agent-workspace.config.json` selecting
GitHub explicitly. When the company supplies Azure DevOps details, deliberately replace that
selection from the placeholder example in the Generated Project, not in the reusable template
source:

```bash
cp config/agent-workspace.azure.example.json agent-workspace.config.json
```

Set the non-secret Organization URL, Project, Repository, integration target, process profile, and
Work Item Type. Keep the template example as placeholders. For inherited/custom processes, add the
complete state override and the approved observed fingerprint.

Set `runtimeProfile` to `local-agent-v1` only when running in the supported Dev Container or WSL2
environment. No command infers GitHub or Azure from `origin`.

Do not place a PAT, bearer token, password, Authorization header, credential-bearing URL, or private
key in this file.

## 5. Check readiness without mutation

```bash
workspace doctor --json
workspace doctor --live --json
workspace provider prepare --preview --json
```

The first command can succeed for offline work; with `runtimeProfile: null` it reports
`runtime-profile: not-selected`. Live readiness reports each missing capability separately:
configuration, selected supported environment, Entra/PAT selection, target visibility, exact
namespace/token/action-bit permissions and capability reads by operation, process mapping, remote
roles, and policy visibility. Readiness never attempts a write probe.

Preparation preview prints the exact target, process fingerprint/mapping, queue key, proposed
allowlisted changes, plan digest, and administrator-owned gaps. It creates nothing.

## 6. Authenticate as the current developer

Preferred path:

```bash
az login
az account get-access-token \
  --resource 499b84ac-1321-427f-aa17-267ca6975798 \
  --query accessToken \
  --output tsv >/dev/null
```

The second command is only a local readiness check; do not paste or print its token. The adapter
runs the equivalent command privately and calls Azure DevOps REST directly. The `azure-devops` CLI
extension and `az devops login` are not required.

If company policy explicitly approves PAT fallback, set
`patFallback.mode: company-approved` and inject the current developer's narrow PAT through the
configured secret environment variable using the approved secret mechanism. Do not type the token
into shared terminal logs. The adapter attempts PAT only when Entra credential acquisition is
unavailable; a 403 permission denial does not trigger fallback.

## 7. Apply provider preparation explicitly

Review the preview, then apply the unchanged digest:

```bash
workspace provider prepare \
  --apply \
  --plan-digest 'sha256:<digest-from-preview>' \
  --json
```

Apply may create or reuse only the Integration Queue Coordination Work Item of the configured
existing Work Item Type. It may set only `System.Title`, the managed Queue Manifest slice in
`System.Description`, and the two reserved queue tags. It never mutates a candidate Work Item or
creates/alters the Organization, Project, Repository, process, permissions, policies, checks,
pipelines, service connections, or Azure infrastructure. Repeating the same apply reuses the same
queue record.

## 8. Perform one-way source-host adoption

Preview first:

```bash
workspace provider adopt --preview --json
```

After verifying the exact Azure Repository, apply with the reported operation/plan data:

```bash
workspace provider adopt --apply --json
git remote -v
```

Expected state:

- `origin` fetches and pushes only to Azure Repos;
- optional `template-upstream` fetches Template Releases from personal GitHub;
- `template-upstream` has a locally failing push URL;
- no company-code push path or required mirror points to personal GitHub.

## 9. Use the normal collaboration flow

Each person uses a separate clone, separate Entra identity, separate Agent Run, and isolated
worktree:

```bash
workspace claim <work-item> --json
workspace start <work-item> --json
workspace checkpoint <work-item> --json
workspace status <work-item> --json
workspace integrate <work-item> --json
```

The CLI reports operation IDs. Reuse `--operation-id <id>` when retrying the same externally
submitted mutation. Integration runs local verification and Azure policy evaluation as separate
gates, completes only through a PR without bypass, and finalizes one queue candidate at a time.

After losing local mirrors:

```bash
workspace recover --json
```

Recovery reconstructs provider state and does not let stale local files win.

## 10. Run live validation only in the approved test target

Supply exact runtime gates through the approved environment mechanism:

```bash
export AGENT_WORKSPACE_AZURE_LIVE=1
export AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL='https://dev.azure.com/<organization>'
export AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID='<project-uuid>'
export AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID='<repository-uuid>'
export AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF='refs/heads/<dedicated-test-target>'

# Set these only after the corresponding read-only checks have actually passed.
export AGENT_WORKSPACE_AZURE_ACTOR='<approved-named-identity>'
export AGENT_WORKSPACE_AZURE_LIVE_RUNTIME_READY=1       # runtime doctor: Linux Dev Container or WSL2
export AGENT_WORKSPACE_AZURE_LIVE_PERMISSIONS_READY=1   # administrator-approved permission probes
export AGENT_WORKSPACE_AZURE_LIVE_CAPABILITIES_READY=1  # read-only capability probes
export AGENT_WORKSPACE_AZURE_LIVE_NETWORK_READY=1       # approved network check
export AGENT_WORKSPACE_AZURE_LIVE_POLICY_READY=1        # process/policy visibility check

# Optional two-identity phase: set only after an independently issued second
# credential has been provider-verified and company-approved.
export AGENT_WORKSPACE_AZURE_SECOND_ACTOR='<second-approved-named-identity>'
export AGENT_WORKSPACE_AZURE_SECOND_PAT_ENV='AGENT_WORKSPACE_AZURE_SECOND_PAT'
export AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_READY=1
export AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_APPROVED=1
export AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_VERIFIED=1

cd tools/agent-workspace
npm run test:azure:live
```

The generated project must select `azure-devops` with `runtimeProfile: local-agent-v1` in its
non-secret `agent-workspace.config.json`; do not set the runtime gate on native Windows. Run
`bash tools/agent-workspace/scripts/runtime-doctor.sh` from Linux Dev Container or WSL2 first.
The runtime, permission, capability, network, and policy variables are attestations from those
checks, not substitutes for them. If the Azure config lives outside the repository root, supply
its non-secret path through `AGENT_WORKSPACE_AZURE_CONFIG_PATH`.

The runner resolves IDs read-only and compares them exactly before constructing the mutating
provider adapters. Authentication remains Entra-first; an approved PAT fallback is read only from
the configured environment variable and never printed or persisted.
The two-identity phase remains `not-run` unless the second credential is separately issued,
company-approved, independently verified against its provider identity, and different from the
primary credential; these environment variables attest to those external checks and do not replace
them.
Missing or mismatched gates produce `not-run` with a prerequisite list. Live phases are reported
separately: readiness, Boards round trip, Repos/policy, two-identity concurrency, and cleanup. If a
second approved identity is unavailable, the two-identity phase remains `not-run`; other passing
phases do not conceal that fact.
The V1 runner now contains the full source-branch, pull-request policy-evaluation, canonical-queue,
ledger-recovery, and four-operation cleanup pilot. Its offline equivalent is executable with the
network-denying Azure fake. A real Azure run is still reported phase-by-phase: without the approved
runtime, exact target, identity, permissions, capability, network, policy, and credential gates,
every live phase remains `not-run`; offline evidence never becomes live PASS.

Before every mutation, the harness atomically writes an intent under
`.workspace/validation/<validationRunId>/ledger.json`; every created artifact carries the matching
Run/artifact marker. Cleanup may remove only the Run's queue entry, close its Work Item, abandon its
pull request, and delete its source branch when the expected head, marker, and exact-source-ref
`ForcePush` permission/capability check all match. It never deletes comments or a pre-existing
queue coordination record.

After a crash, or when the ledger was lost, rerun recovery with the same exact allowlist gates:

```bash
export AGENT_WORKSPACE_AZURE_VALIDATION_RUN_ID='<path-safe-validation-run-id-from-the-earlier-run>'
npm run test:azure:live -- --recover
```

Recovery requires the earlier run ID, scans only the exact allowlisted target for reserved validation
markers, and can reconstruct the local ledger from one unique marker after local state loss. It never
adopts an unmarked artifact. Ambiguous ownership or revision/head drift is reported with a manual next
action; recovery mode never creates a new validation artifact and the harness never broadens deletion.

## 11. Record the company pilot separately

When company access is available, record a timed cohort of ten first-time maintainers and a timed
cohort of ten reviewers. At least nine maintainers must complete preparation in 20 minutes and at
least nine reviewers must identify the owner, scope, candidate PR, check state, queue decision, and
next action in 5 minutes. If the company target or participants are unavailable, record both live
criteria as `not-run`; offline evidence does not substitute.

## References

- [`plan.md`](plan.md) - architecture and delivery sequence
- [`research.md`](research.md) - resolved technical decisions and primary sources
- [`data-model.md`](data-model.md) - canonical records and invariants
- [`contracts/`](contracts/README.md) - normative implementation contracts
