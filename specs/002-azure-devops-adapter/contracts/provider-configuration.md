# Provider Configuration Contract

## Files and ownership

- The Development Workspace Template ships a committed non-secret root
  `agent-workspace.config.json` that explicitly selects `github` with `runtimeProfile: null`, plus
  `config/agent-workspace.azure.example.json` with self-evident Azure placeholders.
- A Generated Project selects its provider in root `agent-workspace.config.json`. This file is
  non-secret and team-owned; company policy decides whether its real non-secret target values are
  committed in the company Repository.
- Local auth material and live-test gates come from the developer/company secret/runtime
  environment, never from either JSON file.
- `.workspace/` contains ignored mirrors and atomic live-validation ledgers and may not override
  shared provider selection. Ledgers contain no credential and are not committed.

## Schema

```jsonc
{
  "schemaVersion": 1,
  "provider": "azure-devops",
  // Omit this field or use null when no Local Agent Runner profile is selected.
  "runtimeProfile": "local-agent-v1",
  "azureDevOps": {
    "organizationUrl": "https://dev.azure.com/<organization>",
    "project": {
      "name": "<project-name>",
      "expectedId": "<optional-project-uuid>"
    },
    "repository": {
      "name": "<repository-name>",
      "expectedId": "<optional-repository-uuid>"
    },
    "integrationTarget": "refs/heads/main",
    "process": {
      "profile": "agile@1",
      "workItemType": "User Story",
      "expectedFingerprint": "<required-for-inherited-or-custom>",
      "override": null
    },
    "authentication": {
      "preferred": "entra-user",
      "tenantId": "<optional-tenant-uuid>",
      "patFallback": {
        "mode": "disabled",
        "secretEnvironmentVariable": "AGENT_WORKSPACE_AZURE_PAT"
      }
    },
    "remoteRoles": {
      "companyOrigin": "origin",
      "templateUpstream": "template-upstream"
    }
  },
  "verification": {
    "commands": ["./scripts/verify-template"]
  },
  "reviewIntent": {
    "minimumHumanApprovals": 0,
    "authorSelfReview": true
  },
  "liveValidation": {
    "modeFlagEnvironmentVariable": "AGENT_WORKSPACE_AZURE_LIVE",
    "allowlistEnvironmentPrefix": "AGENT_WORKSPACE_AZURE_LIVE_ALLOW_"
  }
}
```

The provider-neutral policy concept is `minimum_human_approvals`. Its serialized JSON/API field is
normatively `reviewIntent.minimumHumanApprovals`; provider configurations MUST use this mapping
and MUST NOT rename or reinterpret the value. A value of zero adds no template approval gate and
never weakens stricter provider policy.

For approved PAT fallback, the only valid alternate value is:

```json
{
  "mode": "company-approved",
  "secretEnvironmentVariable": "AGENT_WORKSPACE_AZURE_PAT"
}
```

The string asserts an external company decision; the adapter cannot manufacture that approval.
Fallback still occurs only after an Entra credential-acquisition failure.

## Template default GitHub configuration

The committed root configuration is intentionally safe for a new personal/template Repository and
prevents a remote-derived provider fallback:

```json
{
  "schemaVersion": 1,
  "provider": "github",
  "runtimeProfile": null,
  "github": { "remote": "origin" },
  "verification": { "commands": ["./scripts/verify-template"] },
  "reviewIntent": { "minimumHumanApprovals": 0, "authorSelfReview": true }
}
```

It contains neither a company target nor an authentication value. An Azure Generated Project
deliberately replaces the provider selection from the reviewed placeholder example; it does not
infer Azure or GitHub from a remote URL.

## Process override

Built-in profiles are `agile@1`, `scrum@1`, and `basic@1`. Inherited/custom configuration uses:

```jsonc
{
  "profile": "custom@1",
  "workItemType": "<exact Work Item Type name>",
  "expectedFingerprint": "sha256:<observed-and-approved-fingerprint>",
  "override": {
    "open": "<state>",
    "claimed": "<state>",
    "in-progress": "<state>",
    "ready-for-integration": "<state>",
    "integrated": "<state>",
    "blocked": "<state>"
  }
}
```

All six neutral states are required. Extra keys, missing keys, a state absent from observed Work
Item Type metadata, or fingerprint drift fails closed. Bootstrap displays the complete resolution
before any apply.

## Validation rules

| Field/rule | Validation |
|---|---|
| Organization URL | HTTPS, exact `dev.azure.com` host, one organization path segment, no userinfo/query/fragment |
| Project/Repository names | Non-empty; read-only resolution must return exactly one canonical object |
| Expected IDs | If present, exact case-insensitive UUID match to resolved IDs |
| Integration target | Fully qualified `refs/heads/...`; not a wildcard |
| Provider | Exactly one supported provider selected; no implicit GitHub fallback |
| Runtime profile | Omitted or `null` means `not-selected`; `local-agent-v1` requires Linux Dev Container or WSL2; all other values are invalid |
| Verification commands | Non-empty, project-relative approved commands; no secret interpolation |
| Review intent | Template values are exactly `0` and `true`; observed stricter selected-provider policy still wins |
| Auth | Preferred mode fixed to `entra-user`; PAT secret source is a variable name, never a value |
| Remote roles | Names distinct; `origin` resolves to configured Azure Repository; retained template remote has no GitHub push URL |
| Secret scan | Reject credential-bearing URLs/headers and keys or values representing token, PAT, password, private key, or secret material |

The bootstrap action allowlist is not configurable. It is limited to one queue Work Item of the
configured existing type, `System.Title`, the managed Queue Manifest slice in
`System.Description`, and the two reserved queue tags. A user-provided array cannot authorize a
candidate Work Item, comment, relation, policy, permission, process, Repository, Project, pipeline,
or infrastructure change.

## Live-validation runtime gates

The live runner reads these values at runtime:

```text
AGENT_WORKSPACE_AZURE_LIVE=1
AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL=https://dev.azure.com/<organization>
AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID=<canonical-project-uuid>
AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID=<canonical-repository-uuid>
AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF=refs/heads/<dedicated-test-target>
```

All are required for mutating live phases. The runner first resolves target IDs read-only, then
performs exact comparison. Missing/mismatched values produce `not-run` before constructing a
mutating adapter. Repository naming conventions, provider markers, and interactive confirmation do
not substitute for the allowlist.

If PAT fallback is approved, `AGENT_WORKSPACE_AZURE_PAT` must be injected by an approved per-user
secret source. Example files contain only `${AGENT_WORKSPACE_AZURE_PAT}` or the variable name, never
a sample token.

## Runtime profile

`local-agent-v1` is optional and independent from an application Stack Profile. When
`runtimeProfile` is omitted or `null`, provider configuration, Core verification, and offline
provider-neutral inspection remain valid; `workspace doctor` reports `runtime-profile:
not-selected`, and Local Agent Runner-dependent or live commands report `not-run` before auth or
provider mutation. When selected, its readiness report includes:

- supported environment: Linux Dev Container or WSL2;
- Node.js >= 24, npm lockfile readiness, Git, worktree support, and Codex Desktop handoff path;
- selected provider config and remote roles;
- offline-test capability without Azure/network;
- Azure CLI/Entra capability only for live mode;
- explicit unsupported result for direct native Windows.

Dev Box qualifies only when the commands run inside its Linux Dev Container or WSL2 environment.
No Managed Runner, Azure infrastructure, application runtime, database, deployment, or pipeline is
selected by this profile.
