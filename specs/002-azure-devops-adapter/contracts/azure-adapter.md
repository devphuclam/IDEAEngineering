# Azure DevOps Adapter Contract

## Transport boundary

The adapter uses direct HTTPS requests through an injected transport:

```ts
interface HttpTransport {
  send(request: HttpRequest): Promise<HttpResponse>;
}

interface AzureCredentialProvider {
  acquire(): Promise<{
    mode: 'entra-user' | 'pat';
    identityHint?: string;
    authorizationHeader: SecretString;
  }>;
}
```

The production transport uses Node built-in `fetch`. Tests replace both interfaces. `SecretString`
may be consumed only by the HTTP/Git boundary; stringification, JSON serialization, logging, and
evidence conversion must redact it.

## Authentication selection

1. Attempt the current user's Entra session by invoking:

   ```text
   az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken --output tsv
   ```

2. Treat token output as opaque. Do not decode claims, persist it, echo subprocess output, or place
   it in a command argument.
3. Resolve attribution through supported Azure DevOps profile/project calls, not token claims.
4. PAT fallback is considered only when Entra credential acquisition is unavailable and config
   states `patFallback.mode: company-approved` with a secret environment-variable name.
5. Do not fallback for 403 permission denial, policy result, conflict, rate limit, malformed
   provider response, or network failure.
6. PAT belongs to the current developer, is narrowly scoped by company policy, and is read once
   into process memory. Shared PATs are unsupported.
7. Report only `entra-user` or `pat`; never report token text, token prefix/length, header, secret
   source value, or decoded claim.

Azure CLI is optional for offline mode and for an explicitly approved PAT-only fallback attempt.
The Azure DevOps CLI extension and `az devops login` are not prerequisites.

## REST endpoint map

All path components and query values are URI-encoded. Responses are decoded as untrusted data and
validated before entering domain types.

| Concern | Method and endpoint | Version | Contract notes |
|---|---|---|---|
| Resolve Project | `GET /_apis/projects/{project}?includeCapabilities=true` | `7.1` | Read-only; capture canonical Project ID/name |
| Resolve Repository | `GET /{project}/_apis/git/repositories/{repository}` | `7.1` | Read-only; capture canonical Repository ID/name/remote URL |
| Security namespace | `GET /_apis/securitynamespaces/{namespaceId}` | `7.1` | Validate namespace/action identity and obtain the exact permission bit |
| Effective permissions | `POST /_apis/security/permissionevaluationbatch` | `7.1` | Calling user; `alwaysAllowAdministrators: false`; read-only evaluation |
| Processes | `GET /_apis/work/processes?$expand=projects` | `7.1` | Find configured Project's process; never mutate |
| Process WIT/states | `GET /_apis/work/processes/{processId}/workitemtypes?$expand=States` | `7.1` | Build observed fingerprint and mapping validation |
| Read Work Item | `GET /{project}/_apis/wit/workitems/{id}?$expand=relations` | `7.1` | Return `rev`, fields, and relations |
| Create queue Work Item | `PATCH /{project}/_apis/wit/workitems/${type}` | `7.1` | Bootstrap allowlist only; `application/json-patch+json` |
| Update Work Item | `PATCH /{project}/_apis/wit/workitems/{id}` | `7.1` | First JSON Patch operation tests `/rev`; never bypass rules |
| Query adapter records | `POST /{project}/_apis/wit/wiql` | `7.1` | Discovery by deterministic key/tag; result is validated by block content |
| List comments | `GET /{project}/_apis/wit/workitems/{id}/comments` | `7.1-preview.4` | Follow continuation/paging; search immutable operation markers |
| Append comment | `POST /{project}/_apis/wit/workitems/{id}/comments?format=markdown` | `7.1-preview.4` | Append only; adapter never edits/deletes |
| Target head | `GET /{project}/_apis/git/repositories/{repoId}/refs?filter=heads/{target}` | `7.1` | Capture exact target commit |
| Create/read PR | `POST/GET /{project}/_apis/git/repositories/{repoId}/pullrequests...` | `7.1` | Structured PR identity; source/target refs fully qualified |
| Complete PR | `PATCH /{project}/_apis/git/repositories/{repoId}/pullrequests/{prId}` | `7.1` | `bypassPolicy` absent/false; expected target commit enforced |
| Branch policy inventory | `GET /{project}/_apis/git/policy/configurations?repositoryId=...&refName=...` | `7.1` | Read-only, paginated, target-specific |
| PR policy evaluations | `GET /{project}/_apis/policy/evaluations?artifactId=...&includeNotApplicable=true` | `7.1-preview.1` | Primary provider gate |
| PR statuses/reviewers | Git PR status/reviewer list endpoints | `7.1` | Diagnostic only; never override policy evaluations |
| Current profile | `GET https://app.vssps.visualstudio.com/_apis/profile/profiles/me` | `7.1` | Attribution without token decoding |

The policy evaluation artifact ID is
`vstfs:///CodeReview/CodeReviewId/{projectId}/{pullRequestId}`.

## Read-only permission probes

Readiness validates current namespace descriptions and then submits one effective-permission batch;
it never infers capability from a group name and never attempts a write. Each evaluation records the
namespace ID, exact resource token, action name, returned action bit, effective result, and required
capability-read outcome.

| Operation | Effective permission evaluation | Capability reads |
|---|---|---|
| Work Item/comment read | CSS `83e28ad4-2d72-4ceb-97b0-c7726d5502c3`; `vstfs:///Classification/Node/{areaNodeId}`; `WORK_ITEM_READ` | configured Work Item and comments are readable |
| Queue/candidate create/update and comment append | same CSS Area Node token; `WORK_ITEM_WRITE` | configured existing Work Item Type and managed fields are visible |
| Git and policy read | Git Repositories `2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87`; `repoV2/{projectId}/{repositoryId}`; `GenericRead` | target ref, policy inventory, and PR evaluations are readable |
| Source-branch create/push | exact Repository/source-ref tokens; `CreateBranch` and `GenericContribute` | intended source/target refs and Repository identity are readable |
| Pull-request read/create/complete | exact Repository token; `GenericRead` and `PullRequestContribute` | Repository, existing PR, target head, and policy objects are readable |
| Validation source-branch delete | exact Repository/validation-source-ref token; `ForcePush` | the Run marker and expected source head are readable immediately before deletion |

The namespace query supplies the exact numeric action bit; an unknown/missing action or mismatched
namespace fails closed. A false, missing, malformed, or unavailable batch result fails only the
corresponding operation and includes an administrator next action. A successful permission bit is
still insufficient when its capability read fails. Permission or capability failure never triggers
credential fallback.

The cleanup phase requests the `ForcePush` row only when a validation-created source branch is
scheduled for conditional deletion. It does not broaden normal checkpoint-push permissions and does
not authorize any branch delete unless the exact Run marker and expected head still match.

## Work Item update contract

Every state-changing PATCH:

- sends `Content-Type: application/json-patch+json`;
- begins with an `op: test` on `/rev` using the observed integer revision;
- replaces only the adapter's exact managed Description slice and any selected coarse
  `System.State` projection;
- preserves human-authored Description content, unrelated fields, tags, and relations;
- never sets `bypassRules=true` or `suppressNotifications=true` to hide activity;
- validates the returned Work Item and new revision before reporting application.

A stale revision enters the bounded operation reconciliation loop. The adapter does not classify
every HTTP 400 as a revision conflict; it must recognize the provider revision failure or prove the
current state through reread.

## Git boundary

- Local branches/worktrees remain the Local Runner's responsibility.
- Checkpoint push uses `git` against the validated Azure `origin` and an ephemeral auth environment
  header. The token/header is not present in command-line arguments or persistent `.git/config`.
- The adapter rejects a push refspec that writes the configured integration target.
- PR creation is idempotent: search the same active source/target PR before creating.
- PR completion never bypasses policy and is attempted only for the source/target commits captured
  by the active integration lease.
- After one-way adoption, every push URL is audited. Personal GitHub may exist only as fetch URL of
  `template-upstream`; its push URL must fail locally and must not point to GitHub.

## Policy evaluation mapping

| Azure evaluation status | Neutral outcome | Integration behavior |
|---|---|---|
| `approved` | `passed` | requirement satisfied |
| `queued`, `running` | `pending` | wait/block; never pass |
| `rejected` | `failed` | block with requirement and next action |
| `broken` | `blocked` | fail closed; provider/admin action required |
| `notApplicable` | non-effective | exclude only when explicitly returned |
| missing/unknown/malformed | `unavailable` | fail closed |

Only enabled, blocking, applicable policies gate completion. A stricter company reviewer policy
wins naturally through its Azure evaluation. The template's `minimum_human_approvals: 0` creates
no extra provider policy and never weakens an existing one.

## Retry and throttling

- Same-process writes are serialized per Work Item ID or queue key, not globally.
- Reads may retry transient network/5xx responses with bounded full-jitter backoff.
- 429 honors `Retry-After`; diagnostic output may include non-secret rate-limit delay/resource
  fields but not raw headers wholesale.
- Mutations are never blindly replayed. On timeout/unknown delivery, lookup operation receipt and
  reread canonical state before deciding whether to repair, return duplicate, or retry.
- Revision conflict permits at most four stale retries after the initial attempt, and only while
  normalized payload and original domain preconditions remain valid.
- Exhausted rate/revision budgets return an actionable classified result.

## Error classification

| Condition | Error code | Classification |
|---|---|---|
| Azure CLI missing / unsupported environment | `AZURE_CAPABILITY_MISSING` | `capability` |
| Entra and permitted PAT unavailable/rejected | `AZURE_CREDENTIAL_REJECTED` | `credential` |
| HTTP 403 or operation-specific permission denied | `AZURE_PERMISSION_DENIED` | `capability` |
| HTTP 429 / throttling budget exhausted | `AZURE_RATE_LIMITED` | `quota` |
| DNS, connection, TLS, timeout after reconciliation | `AZURE_NETWORK_FAILURE` | `network` |
| `/rev` stale or changed domain precondition | `AZURE_REVISION_CONFLICT` | `conflict` |
| policy unavailable/broken or missing required capability | `AZURE_POLICY_UNAVAILABLE` | `capability` |
| unsupported host/process/API response | stable capability-specific code | `capability` |

All messages are passed through credential/header redaction before output or evidence.

## Bootstrap mutation allowlist

Apply may perform only these Azure mutations:

1. create or reuse exactly one Integration Queue Coordination Work Item for the configured
   Repository/target queue key using the configured existing Work Item Type;
2. set `System.Title` on that queue Work Item;
3. insert or replace only its exact managed Queue Manifest slice in `System.Description`; and
4. set only `agent-workspace:integration-queue` and
   `agent-workspace:queue-key:<digest>` in `System.Tags`, preserving unrelated tags.

Project/Repository creation, permissions, process fields/states, policies, required checks, branch
settings, pipelines, service connections, infrastructure, candidate Work Items, comments,
relations, coarse Work Item states, unrelated fields/tags, and publication recovery are never
mutated by preparation. Pending publication repair belongs only to the explicit recovery/mutation
protocol, not bootstrap.
