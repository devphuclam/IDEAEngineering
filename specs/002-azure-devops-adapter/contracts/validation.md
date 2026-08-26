# Validation Contract

## Evidence modes

Every result carries:

```ts
type ValidationMode = 'offline' | 'live';
type ValidationOutcome = 'passed' | 'failed' | 'blocked' | 'unexecuted' | 'not-run';
```

Implementation status is a separate task/lifecycle axis and MUST NOT be inferred from this
outcome. `passed` requires an executed successful check; `blocked` means execution was attempted
but an environment or tool policy prevented a result; `not-run` means a missing prerequisite or
gate prevented execution before it started; `failed` means the check executed and failed.
`blocked` and `not-run` are never equivalent to `passed`.

Offline mode proves domain/adapter behavior against controlled transports. It never proves Azure
availability, permissions, HTML round-trip behavior, or company policy. Live mode proves only the
exact target, identity, phase, and timestamp recorded in its evidence.

## Test scripts

Target package scripts:

```text
npm test                         # all unit + provider-neutral contract suites
npm run typecheck
npm run test:blackbox            # existing local black-box suites
npm run test:github:compatibility # GitHub adapter regression contract
npm run test:azure:offline       # Azure offline pilot; network denied
npm run test:azure:live          # separately gated; not in default verification
npm run test:baseline            # asserts recorded Dev Container/WSL2 baseline evidence shape
```

The Core `scripts/verify-template` remains usable from a clean checkout without installing
`tools/agent-workspace`, Azure CLI, or credentials.

## Offline architecture

Offline Azure tests instantiate production block serializers, wire decoders, auth selection,
revision logic, queue store, policy mapping, and adapters with:

- one shared deterministic fake Azure provider state;
- injected fake HTTP transport with request/response fixtures and revision enforcement;
- injected fake token providers that expose mode but never a real secret;
- injected fake Git executor/remote inventory;
- injected clock and ID generator;
- a network-denying production-transport sentinel that fails the test if contacted.

Testing only generic in-memory feature-001 fakes is insufficient; the actual Azure adapter must run
over the fake transport so request serialization, `/rev`, pagination, decoding, and redaction are
covered.

## Required offline matrix

| Contract | Required evidence |
|---|---|
| Configuration | Valid built-in/custom files; secret-bearing values rejected; no implicit provider fallback |
| Auth chain | Entra attempted first in 100% of cases; PAT only on acquisition-unavailable + `company-approved`; no fallback on 403/network/quota/policy; output redacted |
| Permission probes | Exact namespace/token/action bit per operation, including `ForcePush` on an exact validation source ref before conditional branch delete; `alwaysAllowAdministrators: false`; capability reads combined; denied/unknown/malformed/unavailable fail closed; zero write probes |
| Description blocks | Deterministic round trip; human bytes preserved; duplicate/missing/corrupt/version-newer blocks fail closed |
| Work Item concurrency | 100 simultaneous valid claim operations for one Work Item: exactly one applied; no loser creates sandbox; same operation ID is duplicate |
| GitHub revision compatibility | Concurrent append proposals reconcile to one authoritative winner; losing/stale proposals remain history; same operation/payload duplicates; changed payload conflicts; exact queue-label projection and coordination-Issue queue recovery are deterministic |
| Mutation crash recovery | Crash before PATCH, after PATCH, after publisher lease, after comment POST, and before pending clear; final state has one receipt and no overtaking mutation |
| Queue concurrency | 100 paired stale-revision updates: no accepted decision lost, no duplicate entry/decision/completion; invalidated operations conflict |
| Queue ordering | Immutable enqueue sequences; lowest eligible candidate selected; one integration lease; target drift requeues visibly |
| Queue compaction | 10,000 simulated completions leave zero final entries in active manifest and 10,000 unique compact summaries linked to candidate evidence |
| Recovery | Delete all `.workspace/` state; reconstruct queue, active claims/runs, decisions, PR refs, and completion history; provider mutation limited to reported pending-publication reconciliation |
| Process mapping | Agile/Scrum/Basic complete; observed states/fingerprint validated; inherited/custom incomplete or stale override rejected before mutation |
| Azure policy | Config inventory + evaluations: approved passes; queued/running pending; rejected failed; broken/missing/unknown unavailable; non-applicable excluded explicitly |
| GitHub policy | Effective Rulesets + classic protection + reviews + check runs + statuses on exact head; incomplete inventory and missing/pending/failing results do not pass |
| Review intent | Zero template approvals adds no gate; author self-review allowed only when Azure policy evaluation allows it; stricter policy blocks |
| Integration | Local verification and provider policy are separately represented; either non-pass blocks; no bypass flag or target push generated |
| Bootstrap | Preview sends no mutation; three identical applies reuse one valid queue Work Item; only title, managed Queue Manifest slice, and two reserved tags change; candidate/duplicate/out-of-allowlist actions stop |
| Adoption | Azure is only push-capable origin; template upstream fetch works; GitHub push URL is absent/failing; bidirectional mirror never configured |
| Evidence | Credential/token/header/session/prompt/transcript/full-source fixtures are redacted; blocked/unexecuted/not-run never become passed |
| Live-ledger recovery | Crash before create, after provider acceptance, after response, and during cleanup; marker-only reconstruction after ledger loss; only Run-owned queue entry/Work Item/PR/branch cleanup |
| Environment | Separate clean Linux Dev Container and WSL2 baselines run the same V1 matrix; native Windows produces explicit unsupported result and cannot substitute |

## Success-criterion coverage

| Criterion | Evidence source |
|---|---|
| SC-001 | timed live preparation pilot with 10 first-time maintainers; at least 9 finish in 20 minutes; not claimable offline |
| SC-002 | two-context shared-fake observation timing offline, repeated with two live identities when available |
| SC-003 | 100-attempt claim concurrency contract |
| SC-004 | provider-only recovery after deleting all local mirrors |
| SC-005 | semantic-conflict, local-check, policy-unavailable, and stricter-policy matrix |
| SC-006 | three identical preparation applies and provider-record count |
| SC-007 | network-denied complete offline pilot |
| SC-008 | every missing live-gate combination yields structured `not-run`; crash-injected runs reconcile/clean only proven Run-owned artifacts or report an ownership/revision blocker |
| SC-009 | config/output/evidence secret fixtures plus repository secret scan |
| SC-010 | timed live inspection by 10 pilot reviewers of owner, scope, checkpoint, policy, queue, and next action; at least 9 finish in 5 minutes |
| SC-011 | remote-role/adoption tests prove Azure-only push capability |
| SC-012 | Core verifier plus complete offline collaboration without Azure/Managed Runner |
| SC-013 | 100 paired stale queue mutations with receipt/decision uniqueness assertions |
| SC-014 | built-in and custom mapping contract matrix |
| SC-015 | 10,000-completion compaction simulation |
| SC-016 | auth-chain matrix: Entra first, PAT only under both approval and explicit enablement |

## Offline black-box scenario

Two simulated named identities use separate temporary clones and Local Agent Runner worktrees over
one fake provider:

1. prepare preview/apply and recover the same queue key;
2. concurrently claim one Work Item and prove exactly one winner;
3. work on two dependent/overlapping candidates with declared Change Scopes;
4. checkpoint, handoff, lose a local mirror, and recover;
5. record a semantic serialization decision;
6. run local verification plus fake provider policy evaluation;
7. integrate one candidate at a time and compact completion records;
8. assert all output says `mode: offline` and `evidence: simulated`.

The scenario fails immediately on network access.

## Live gate

The live runner performs no provider mutation until all are true:

1. `runtimeProfile: local-agent-v1` selected in a supported Linux Dev Container or WSL2 runtime;
2. `AGENT_WORKSPACE_AZURE_LIVE=1`;
3. complete non-secret provider configuration;
4. successful named-identity auth selection;
5. read-only resolution of canonical Organization/Project/Repository IDs;
6. exact runtime allowlist match for Organization URL, Project ID, Repository ID, and dedicated
   target ref;
7. read-only effective permission batch and capability-read results for every operation requested
   by the phase, with no write probe; a branch-delete cleanup action additionally requires exact
   validation-source-ref `ForcePush` plus marker/head read capability;
8. network and policy/process visibility;
9. no ambiguous pre-existing validation marker or queue identity.

A missing gate emits one structured `not-run` result listing every missing prerequisite and a TAP
skip where `node:test` is used. It must not emit a passing live assertion.

## Live phases

| Phase | Identity/access | Mutations | Evidence |
|---|---|---|---|
| `readiness` | one named identity | none | target IDs, auth mode, permissions-by-operation, process fingerprint, policy visibility |
| `boards-roundtrip` | one named identity | one tagged test Work Item + comments | Description marker round trip, `/rev` stale rejection, receipt idempotency |
| `repos-policy` | one named identity | one validation branch/PR in dedicated target | checkpoint push, PR identity, observable policy evaluation, no bypass |
| `two-identity` | two separately supplied approved identities | bounded concurrent claims/queue updates | attribution and exactly-one-winner evidence; `not-run` if second identity unavailable |
| `cleanup` | creator identity/approved permission | remove Run queue entry; close Work Item; abandon PR; conditionally delete branch | marker + expected revision/head recheck, exact-source-ref `ForcePush` result before delete, and cleanup outcome |

Passing one phase does not pass an unavailable later phase. A one-identity live run cannot claim
that two-identity behavior passed.

## Live write-ahead ledger, discovery, and cleanup

The ignored ledger path is `.workspace/validation/<validationRunId>/ledger.json`. Updates use a
same-directory temporary file, durable close, and atomic replacement. Before every provider
mutation the harness records stable Run ID, monotonic intent sequence, artifact key, exact target,
operation, deterministic marker, expected revision/head, and allowlisted cleanup operation. After
the response it records provider ID/URL and observed revision/head.

Provider markers use the reserved Validation Run ID plus artifact key in the narrowest supported
surface: Work Item tag/managed content, queue-entry payload, source-branch name, and pull-request
description. They contain no credential. Recovery after crash or complete ledger loss:

1. re-runs every live gate and exact target allowlist before constructing a mutating client;
2. loads the ledger when present and scans only the exact allowlisted target for the reserved
   validation marker prefix;
3. reconciles pending intents with exact marker/type/key matches and never adopts an unmarked or
   pre-existing artifact;
4. treats duplicate/ambiguous markers, ownership drift, or revision/head drift as blocked manual
   recovery; and
5. retains the ledger until cleanup is complete or an attributable handoff is recorded.

The fixed cleanup allowlist is: conditionally remove only the Run-owned queue entry; close rather
than delete a Run-created Work Item; abandon a Run-created pull request; and delete a Run-created
source branch only at the expected head after the exact source-ref `ForcePush` probe and marker
capability recheck pass. Immutable comments and a pre-existing queue coordination Work Item remain.
Cleanup never touches policies, permissions, processes, repositories, projects, organizations,
pipelines, service connections, unrelated artifacts, or ordinary Run Evidence.
Cleanup failure is `blocked`/`failed` evidence with provider references and manual next action; it
is never hidden or broadened into destructive recovery.

Offline crash-injection tests stop immediately before provider contact, after provider acceptance
but before local acknowledgement, after response journaling, and before/after each cleanup action.
Every point must converge idempotently or fail closed without changing pre-existing artifacts.

## Completion gate for implementation

Implementation may be called offline-complete only when Core verification, typecheck, unit,
provider-neutral/GitHub/Azure contract suites, black-box, Azure offline pilot, secret scans, and
separate clean Linux Dev Container and WSL2 baselines pass. An unavailable baseline is `not-run`,
not a pass, and native Windows cannot substitute. The feature may be called live-validated only for
the explicitly completed live phases. A skipped phase, unavailable Azure account, or missing
second identity remains visibly `not-run`.
