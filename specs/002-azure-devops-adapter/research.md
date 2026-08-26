# Research: Azure DevOps Collaboration Adapter

**Feature**: 002-azure-devops-adapter | **Date**: 2026-08-14 | **Status**: Complete

This document resolves the technical choices needed to plan the adapter. Company Organization,
Project, Repository, permissions, process customization, and credentials remain runtime inputs by
specification; they are not unresolved design questions.

## D1. Use direct Azure DevOps REST behind an injected transport

- **Decision**: Implement a small `AzureDevOpsHttpClient` over Node's built-in `fetch`. Each
  operation selects its documented endpoint and API version. Authentication is injected. The
  Azure DevOps CLI extension is not a runtime dependency.
- **Rationale**: The required surface spans Work Item Tracking, Work Item Tracking Process, Git,
  and Policy APIs. Direct HTTP exposes revision tests, headers, pagination, and policy evaluation
  records to deterministic fake-transport tests while preserving zero new runtime npm
  dependencies.
- **Alternatives rejected**:
  - `az boards`/`az repos` plus `az rest`: uneven command coverage and indirect HTTP behavior;
    harder to test stale revisions and rate-limit headers without launching subprocesses.
  - `azure-devops-node-api`: workable, but adds a runtime dependency and still needs explicit
    seams for auth, wire validation, and concurrency.
- **Sources**: [Azure DevOps REST API 7.1](https://learn.microsoft.com/en-us/rest/api/azure/devops/),
  [Work Item Tracking API](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/?view=azure-devops-rest-7.1),
  [Git API](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/?view=azure-devops-rest-7.1).

## D2. Prefer user-delegated Entra; permit only an explicit PAT fallback

- **Decision**: `EntraCliCredentialProvider` invokes
  `az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798` once per CLI
  process and treats the returned token as opaque. If credential acquisition is unavailable, the
  auth chain may read one per-developer PAT from the configured secret environment variable only
  when `patFallback.mode` is `company-approved`; otherwise it fails. It never falls back after a
  permission denial, policy failure, rate limit, or network error.
- **Git authentication**: REST and Git use the same selected identity. The adapter supplies an
  ephemeral Authorization header to `git --config-env=http.extraHeader=<env-name>` through the
  child environment, never through command arguments or persistent Git config.
- **Rationale**: Microsoft recommends Entra tokens for new integrations and documents the Azure
  DevOps resource ID. The clarified feature allows PAT only as a company-approved, explicitly
  enabled fallback. Restricting fallback to credential acquisition failure prevents a PAT from
  silently bypassing a real authorization denial.
- **Alternatives rejected**: `az devops login` PAT storage; token decoding; service principal or
  managed identity for the Local Agent Runner; shared PAT; Git credentials embedded in a URL.
- **Sources**:
  [Azure DevOps authentication guidance](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/authentication-guidance?view=azure-devops),
  [issue Entra tokens with Azure CLI](https://learn.microsoft.com/en-us/azure/devops/cli/entra-tokens?view=azure-devops),
  [Azure Repos authentication](https://learn.microsoft.com/en-us/azure/devops/repos/git/auth-overview?view=azure-devops).

## D3. Pin API versions per endpoint and honor server throttling

- **Decision**: Stable endpoints use `api-version=7.1`; Work Item comments use
  `7.1-preview.4`; policy evaluations use `7.1-preview.1`. Versions live beside endpoint decoders,
  not in one misleading global constant. Reads may retry transient failures. A mutation retries
  only after its operation receipt or current provider state proves whether it committed.
- **Rate strategy**: no inherited GitHub-style one-second delay. On 429 or a throttling response,
  honor `Retry-After`, expose Azure rate headers for non-secret diagnostics, apply bounded jitter,
  and return `quota` when the budget is exhausted. Revision conflicts use the separate reread and
  re-evaluate loop.
- **Rationale**: Azure DevOps documents consumption-based throttling and response headers; a fixed
  interval is neither required nor sufficient.
- **Sources**:
  [Azure DevOps rate and usage limits](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits?view=azure-devops),
  [add Work Item comment](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/comments/add-work-item-comment?view=azure-devops-rest-7.1),
  [list policy evaluations](https://learn.microsoft.com/en-us/rest/api/azure/devops/policy/evaluations/list?view=azure-devops-rest-7.1).

## D4. Use `/rev` plus an operation-receipt outbox for safe mutations

- **Decision**: Every canonical Work Item mutation is a JSON Patch beginning with
  `{ "op": "test", "path": "/rev", "value": <observed-revision> }`. The request carries a stable
  operation ID. The same atomic patch changes current state and records a
  `pendingPublication` receipt. No different mutation may advance that record until the receipt's
  append-only comment is found or published and the pending marker is cleared under a later
  revision.
- **Duplicate behavior**:
  1. A matching immutable receipt comment returns its recorded outcome.
  2. A matching pending receipt finishes publication and returns that outcome.
   3. A stale revision rereads canonical state and re-evaluates preconditions; exactly
      `MAX_STALE_REREADS = 4` retries (five total attempts including the initial mutation) are
      allowed while the original operation is still valid.
  4. A changed precondition returns an explicit conflict. Last-write-wins is never used.
- **Crash behavior**: an exclusive, revision-guarded publisher lease plus a comment lookup by
  operation ID closes the crash window after comment creation but before acknowledgement. A later
  worker repairs the pending receipt before allowing subsequent state transitions.
- **Rationale**: Azure demonstrates `/rev` as the optimistic-concurrency test. Work Item PATCH and
  comment POST are not one transaction, so a small durable outbox is required to meet the
  state-plus-history and no-duplicate requirements.
- **Source**: [Work Item update example with `/rev` test](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/?view=azure-devops-rest-7.1#work-item-batch-update-api).

## D5. Use visible, versioned Description markers instead of HTML comments

- **Decision**: Coordination State, Change Scope, and queue manifest use ASCII BEGIN/END marker
  text and an HTML-escaped JSON `<pre>` payload. The strict parser requires exactly one ordered
  pair, validates schema/version, and preserves every byte outside the managed slice. Duplicate,
  missing, reordered, or corrupt blocks fail closed.
- **Rationale**: Azure Boards Description is HTML, but preservation of invisible HTML comments or
  arbitrary `data-*` attributes is not a contract relied upon here. Visible marker text survives
  ordinary rich-text normalization and makes accidental human edits reviewable. Live validation
  still includes a provider round-trip test before the adapter is declared live-ready.
- **Alternatives rejected**: custom fields (requires process administration), tags as authority,
  attachments, invisible HTML comments, or inference from unstructured discussion.

## D6. Represent the Integration Queue as one revisioned coordination Work Item

- **Decision**: A deterministic `queueKey` derived from canonical Organization/Project/Repository
  IDs and the target ref identifies one coordination Work Item. Its active manifest contains only
  queued, blocked, preparing, or incorporating entries, each with an immutable enqueue sequence.
  A revision-guarded integration lease permits one active candidate. The lowest-sequence eligible
  candidate is selected; unmet dependencies remain queued and do not block an independent eligible
  candidate.
- **Completion**: finalization atomically removes the active entry and creates a pending compact
  completion receipt. Publishing that receipt appends one immutable summary linked to full
  candidate evidence. The manifest never accumulates completed entries.
- **Recovery**: the queue Work Item block, pending receipt, relations, completion comments, and
  candidate evidence reconstruct state without `.workspace/`. Duplicate coordination Work Items
  discovered by bootstrap fail closed for maintainer repair; bootstrap never silently elects one.
- **Rationale**: one `/rev`-guarded record supplies canonical order across clones while bounded
  active state satisfies the 10,000-completion criterion.

## D7. Verify process mappings against observed provider metadata

- **Decision**: Ship `agile@1`, `scrum@1`, and `basic@1` profiles, but never trust the profile name
  alone. Read the Project, find its Process, read the configured requirement Work Item Type and
  states, and compute an `observedProcessFingerprint` from process IDs, customization type, Work
  Item Type reference, and canonicalized state IDs/names/categories/order/hidden flags. Bootstrap
  prints and records the fingerprint used for validation.
- **Built-in coarse projection**:

  | Neutral state | Agile User Story | Scrum PBI | Basic Issue |
  |---|---|---|---|
  | `open` | New | New | To Do |
  | `claimed` | New | Approved | To Do |
  | `in-progress` | Active | Committed | Doing |
  | `ready-for-integration` | Resolved | Committed | Doing |
  | `integrated` | Closed | Done | Done |
  | `blocked` | Active | Committed | Doing |

  The managed Coordination State remains authoritative. Inherited/custom processes require a
  complete explicit mapping and expected fingerprint. Any missing mapped state, unexpected process
  identity, or fingerprint drift fails before mutation.
- **Rationale**: Azure exposes process identity and Work Item state metadata but no single process
  revision suitable for this contract. A deterministic observed fingerprint supplies the required
  stale-mapping guard without best-effort category inference.
- **Sources**:
  [default process states](https://learn.microsoft.com/en-us/azure/devops/boards/work-items/guidance/choose-process?view=azure-devops),
  [list processes](https://learn.microsoft.com/en-us/rest/api/azure/devops/processes/processes/list?view=azure-devops-rest-7.1),
  [list process Work Item Types and states](https://learn.microsoft.com/en-us/rest/api/azure/devops/processes/work-item-types/list?view=azure-devops-rest-7.1).

## D8. Evaluate provider policy separately from local verification

- **Decision**: Replace the overloaded `requiredChecks(): string[]` seam with two contracts:
  `LocalVerificationRunner` executes configured commands, while `PolicyAdapter` returns a
  structured provider snapshot for a specific PR and target commit.
- **Azure mapping**:
  - list branch policy configurations through the Git policy configuration endpoint filtered by
    Repository and fully qualified target ref;
  - list PR policy evaluations with `includeNotApplicable=true` using the PR artifact ID;
  - require every enabled, blocking, applicable policy to have an observable evaluation;
  - map `approved` to passed, `queued|running` to pending, `rejected` to failed,
    `broken` to blocked/unavailable, and explicit `notApplicable` to non-effective;
  - use PR statuses and reviewer votes only as diagnostics; policy evaluations are the gate.
- **Completion**: never set `bypassPolicy=true` and never ignore a blocking policy. Re-read target
  commit and policy state immediately before completion; Azure's server-side completion remains the
  final enforcement boundary.
- **Rationale**: Policy evaluation records directly describe each policy as applied to one PR.
  Counting votes or reading status checks alone misses other effective policies and can mishandle
  author self-review rules.
- **Sources**:
  [Git policy configurations](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/policy-configurations/get?view=azure-devops-rest-7.1),
  [PR policy evaluations](https://learn.microsoft.com/en-us/rest/api/azure/devops/policy/evaluations/list?view=azure-devops-rest-7.1),
  [branch-policy self-review semantics](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops),
  [complete/update a PR](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/update?view=azure-devops-rest-7.1).

## D9. Push checkpoints with Git; create and complete PRs through REST

- **Decision**: The Local Runner continues to create local Work Item-oriented branches. A
  checkpoint push uses `git` to Azure `origin` with the ephemeral auth header; the adapter rejects
  an integration-target ref as a source ref. PR create/read/complete and Work Item association use
  REST and return structured `{ repositoryId, pullRequestId, url, sourceRef, targetRef }` records.
- **Adoption**: preview validates remotes. Apply makes Azure Repos the only push-capable `origin`.
  If retained, personal GitHub becomes `template-upstream` with its fetch URL preserved and an
  explicit locally failing push URL; verification rejects any GitHub push URL after adoption.
- **Rationale**: checkpoint branches already exist locally, so a separate REST ref-create call is
  unnecessary. Structured PR identity is needed for policy artifact IDs and idempotent lookup.
- **Source**: [create Azure Repos PR](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-requests/create?view=azure-devops-rest-7.1).

## D10. Make bootstrap queue-only, previewable, and idempotent

- **Decision**: `workspace provider prepare` is generic at the CLI boundary. Preview resolves and
  audits target identity, auth mode, permissions-by-operation, observed process fingerprint and
  mapping, remote roles, target policy visibility, and the exact queue plan. Apply may create or
  reuse exactly one Integration Queue Coordination Work Item of the configured existing Work Item
  Type and may set only `System.Title`, the managed Queue Manifest slice in
  `System.Description`, and the reserved `agent-workspace:integration-queue` and
  `agent-workspace:queue-key:<digest>` tags. It never mutates a candidate Work Item. The allowlist
  is compiled into the adapter and cannot be widened by config.
- **Idempotency**: queue discovery uses its deterministic key and full target IDs. Zero matches may
  create one; one match is reused only after its identity and managed block validate; multiple
  matches stop. Repeated identical apply produces no new mutation. Project, Repository, process,
  permissions, policies, checks, branch settings, candidate Work Items, and unrelated fields on a
  reused queue Work Item are never modified.
- **Rationale**: provider preparation is not infrastructure provisioning and should not require
  collection/project administration beyond the exact Work Item metadata it owns.

## D11. Test the real adapter offline; gate live mutation before transport creation

- **Decision**: Offline contract tests instantiate the real Azure serializers, auth chain,
  revision protocol, policy decoder, and adapters over fake HTTP/Git/token transports. The offline
  black-box suite installs a network-denying transport and uses two contexts over one fake provider
  state. Results are labeled `offline/simulated`.
- **Live gates**: before constructing a mutating client, require the live-mode flag, exact
  allowlisted canonical Organization URL + Project ID + Repository ID, supported environment,
  selected named identity, permissions, network, and dedicated test target. Missing gates produce
  a machine-readable `not-run` result. Read-only, single-identity mutation, and two-identity
  concurrency are separate phases; an unavailable phase is never generalized into a pass.
- **Recovery and cleanup**: before every provider mutation, atomically write an intent containing
  the stable Validation Run ID, artifact key, exact target, operation, and expected revision/head.
  Every Run-created Work Item, queue entry, branch, and pull request carries a deterministic
  provider marker. After a response, journal the provider identity and revision. Recovery searches
  only the exact allowlisted target for reserved markers, including when the local ledger was lost,
  and never adopts unmarked/pre-existing artifacts. Cleanup may remove the Run-owned queue entry,
  close a Run-created Work Item, abandon a Run-created PR, and delete a Run-created branch only
  while marker and expected revision/head still match. Comments and pre-existing coordination
  records remain. Cleanup uncertainty is blocked evidence, not permission to broaden deletion.

## D12. Add an optional Local Agent Runner runtime profile

- **Decision**: Keep the Core `.devcontainer/devcontainer.json` unchanged. Add
  `.devcontainer/agent-workspace/devcontainer.json` as an optional configuration with pinned Node
  24 tooling and the prerequisites needed by the Local Agent Runner. Azure CLI is a live-mode
  capability, not an offline-test prerequisite. WSL2 uses the same package lock and a runtime
  doctor script. Direct native Windows reports unsupported for V1.
- **Rationale**: GitHub Codespaces and Dev Containers support multiple configurations, while the
  clarified spec requires the collaboration profile to remain optional and independent from an
  application Stack Profile.
- **Source**: [multiple dev container configurations](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers).

## D13. Probe effective Azure permissions by exact operation without writes

- **Decision**: Read the current organization's security namespace descriptions, validate the
  expected namespace ID and action name, use the returned exact action bit, and submit one
  `permissionevaluationbatch` request with `alwaysAllowAdministrators: false`. Each result is kept
  separate; it is never aggregated into a vague "contributor" capability. The minimum matrix is:

  | Operation | Namespace/token/action | Required capability read |
  |---|---|---|
  | Work Item and comment read | CSS `83e28ad4-2d72-4ceb-97b0-c7726d5502c3`; exact Area Node token; `WORK_ITEM_READ` | read configured Work Item and comments |
  | Queue/candidate Work Item create or update; comment append | same CSS Area Node token; `WORK_ITEM_WRITE` | validate configured Work Item Type and managed fields |
  | Git read and policy visibility | Git Repositories `2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87`; exact Repository token; `GenericRead` | read target ref, policy inventory, and evaluations |
  | Create/push source branch | exact Repository/source-ref tokens; `CreateBranch` and `GenericContribute` | read intended source and target refs |
  | Create/read/complete pull request | exact Repository token; `PullRequestContribute` plus `GenericRead` | read Repository, target head, existing PRs, and policy objects without a write probe |
  | Delete validation source branch during cleanup | exact Repository/validation-source-ref token; `ForcePush` | reread matching Run marker and expected source head immediately before delete |

  Policy read has no invented standalone permission bit: it requires the exact Git read result and
  successful read-only policy calls. A true permission result does not override access level,
  service visibility, or endpoint denial.
- **Failure rule**: denied, unknown, missing, malformed, namespace/action drift, or unavailable
  results fail closed for that operation. A permission failure never triggers PAT fallback.
- **Rationale**: Azure evaluates effective caller permissions, including inheritance and deny, but
  capability APIs still determine whether the exact service object is visible. Write probes would
  violate readiness and could leave artifacts.
- **Sources**:
  [Has Permissions Batch](https://learn.microsoft.com/en-us/rest/api/azure/devops/security/permissions/has-permissions-batch?view=azure-devops-rest-7.1),
  [Security namespace query](https://learn.microsoft.com/en-us/rest/api/azure/devops/security/security-namespaces/query?view=azure-devops-rest-7.1),
  [namespace and token reference](https://learn.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference?view=azure-devops).

## D14. Give GitHub compatibility deterministic append-reread-reconcile revisions

- **Decision**: Derive `ProviderRevision` from canonical Issue state, the exact normalized/sorted
  queue-label pair when the Issue is a coordination record, plus the ordered IDs and payload hashes
  of recognized immutable proposal and receipt comments. The only queue labels are
  `agent-workspace:integration-queue` and one
  `agent-workspace:queue-key:sha256:<lowercase-hex>`; malformed, duplicate, or mismatched pairs
  fail closed, while all other labels remain non-authoritative diagnostics. A mutation appends a
  proposal with expected revision, stable operation ID, normalized payload hash, actor, and
  preconditions, rereads the complete recognized stream, and applies authority only when those
  preconditions still hold and the proposal is the deterministic earliest valid winner. An
  immutable resolution receipt references that proposal. Any later reconciliation computes the
  same winner; a losing proposal remains historical evidence and returns `conflict`.
- **Duplicate rule**: the same operation ID and payload hash returns the prior authoritative
  result. Reusing an operation ID with a different hash is corruption/conflict. Merely appending a
  comment is never equivalent to acquiring a claim, Run, sandbox, or queue lease.
- **Queue compatibility**: The same projection implements GitHub's canonical queue through one
  coordination Issue per Repository/target. Its key is
  `sha256("github\\n" + canonicalRepositoryId + "\\n" + targetRef)`, using the immutable GitHub REST
  Repository numeric ID serialized as decimal. A normal enqueue may create the deterministic
  Issue/label pair, append its queue proposal, and reread discovery; create-race duplicates block
  for administrator remediation. GitHub preparation is read-only `not-applicable`; it never
  creates a coordination Issue as a bootstrap side effect.
- **Rationale**: GitHub comments do not provide Azure's atomic `/rev` test. Making authority a
  deterministic projection of the immutable stream preserves provider-neutral stale-write and
  exactly-one-winner semantics without pretending the append was transactional.

## D15. Map complete effective GitHub policy on the exact candidate head

- **Decision**: `inspectTarget` reads every active effective rule for the target branch and the
  applicable classic branch protection inventory. `evaluatePullRequest` then joins the exact PR
  head SHA, review/conversation/merge state, required check runs, and commit statuses, preserving
  required application/source restrictions and distinct same-named check/status requirements.
  Unreadable potentially applicable inventory, a missing required result, pending execution,
  failure, cancellation, stale head, or unknown mapping is not passed. GitHub's server-side merge
  remains the final enforcement boundary.
- **Review intent**: `minimum_human_approvals: 0` adds no template gate. It never weakens active
  repository/organization approval requirements, and author self-review counts only when GitHub's
  effective policy permits it.
- **Rationale**: classic branch protection alone misses organization/repository Rulesets, while PR
  mergeability alone does not provide a complete, attributable requirement snapshot.
- **Sources**:
  [rules for a branch](https://docs.github.com/en/rest/repos/rules?apiVersion=2026-03-10),
  [branch protection](https://docs.github.com/en/rest/branches/branch-protection),
  [check runs](https://docs.github.com/en/rest/checks/runs), and
  [combined commit status](https://docs.github.com/en/rest/commits/statuses).

## D16. Require real clean baselines for both supported V1 environments

- **Decision**: implementation evidence records separate clean-checkout command/outcome matrices
  for the optional Linux Dev Container and WSL2. Each baseline runs package install from the
  committed lockfile, typecheck, unit/contract/black-box/Azure-offline suites, secret scan, and the
  Core verifier. Environment identity and unavailable checks are explicit; native Windows cannot
  substitute for either baseline.
- **Rationale**: sharing a runtime profile does not prove both supported entry paths work. A missing
  environment remains `not-run`, preserving honest verification until that baseline is available.

## D17. Preserve explicit GitHub selection and make pilot criteria auditable

- **Decision**: Commit a non-secret root `agent-workspace.config.json` selecting `github` with
  `runtimeProfile: null`. Omitted/null runtime selection permits Core verification, provider
  configuration, and offline inspection but returns `not-run` for Local Agent Runner-dependent or
  live operations until `local-agent-v1` is selected. Azure adoption deliberately replaces that
  provider selection; no remote-derived default or silent fallback is allowed.
- **Pilot measurement**: run ten first-time maintainers against an approved target and ten pilot
  reviewers against a prepared evidence view. At least nine maintainers must prepare within 20
  minutes and at least nine reviewers must identify the required state within 5 minutes. When
  company access is unavailable, record the live pilot as `not-run` rather than extrapolating from
  offline evidence.
- **Rationale**: a safe explicit default keeps existing GitHub projects operational while the
  optional Azure feature remains offline-testable, and fixed cohort sizes make the 90% criteria
  repeatable rather than anecdotal.

## Resolved vs runtime-gated information

All architecture decisions needed for task generation are resolved. The following are intentionally
runtime-gated rather than research TODOs:

- company Organization URL and canonical IDs for Project and Repository;
- selected process, Work Item Type, observed process fingerprint, and any custom mapping override;
- actual permissions and policy configuration/evaluation IDs;
- approved named identities and whether company policy permits PAT fallback;
- exact live-validation allowlist and dedicated non-production test target.
