# Implementation Plan: Azure DevOps Collaboration Adapter

**Branch**: `002-azure-devops-adapter` | **Date**: 2026-08-14 | **Spec**: [`spec.md`](spec.md)

**Input**: Feature specification from `specs/002-azure-devops-adapter/spec.md`

## Summary

Add Azure Boards and Azure Repos as a selectable collaboration provider for a Generated Project
without making Azure a Core Workspace dependency. The implementation first repairs the
provider-neutral seams exposed by feature 001: provider policy evaluation is separated from local
verification, opaque revisions support both atomic compare-and-set and append-reread-reconcile
providers, stable operation identities determine authoritative outcomes, and the Integration Queue
uses a canonical provider store instead of a local-file authority. The existing GitHub adapter is
migrated and contract-tested at this foundation before Azure becomes selectable. The Azure adapter
then maps the same contracts to Azure DevOps REST APIs, Azure Repos Git remotes, and Azure Boards
Work Items.

The current developer's Microsoft Entra session is preferred. Azure CLI is used only as an Entra
token broker; the adapter calls Azure DevOps REST directly through an injectable HTTP transport.
An explicitly enabled, company-approved per-developer PAT fallback is allowed only when Entra
credential acquisition is unavailable. Offline tests exercise the real serializers and adapter
logic over fake transports, while live tests require an explicit live flag and an exact approved
Organization/Project/Repository/target-ref allowlist before any mutation.

## Technical Context

**Language/Version**: TypeScript on Node.js >= 24, matching `tools/agent-workspace/`

**Primary Dependencies**: no new runtime npm dependency; Node built-in `fetch` behind an injected
`HttpTransport`; `git` for branch/checkpoint transport; Azure CLI only for
`az account get-access-token` in Entra mode. The Azure DevOps CLI extension is not required.

**Authentication**: one opaque credential per CLI process; Entra bearer token first, PAT basic
header only under the explicit fallback contract. The same in-memory credential supplies REST and
ephemeral Git `http.extraHeader` authentication and is never placed in arguments, files, output,
or evidence.

**Storage**: Azure Boards Work Items hold managed Description blocks and append-only comments;
Azure Repos holds branches and pull requests; `.workspace/` remains an ignored, disposable local
mirror. One queue coordination Work Item exists per Repository and fully qualified target ref.
Live validation uses an atomic ignored write-ahead ledger under `.workspace/validation/` plus
deterministic markers on provider artifacts so recovery survives local cache loss.

**Testing**: `node --test` unit and provider-neutral contract suites; GitHub compatibility tests;
a network-denying Azure offline pilot; clean-baseline runs in the Linux Dev Container and WSL2;
and gated live suites with crash-injected artifact-ledger recovery and cleanup. Core verification
continues to run without installing the optional package. Implementation status and verification
outcome are separate: an implementation may be complete while its verification is `passed`,
`blocked`, `not-run`, or `failed`. `passed` requires an executed successful check; an attempted
check prevented by environment/tool policy is `blocked`; a check prevented before execution by a
missing prerequisite or gate is `not-run`; neither `blocked` nor `not-run` is a pass.

**Target Platform**: Azure DevOps Services at `https://dev.azure.com/<organization>`; V1 Local
Agent Runner in the Linux Dev Container or WSL2. Native Windows parity, Managed Runner, Azure
infrastructure, Azure Pipelines/application pipeline, and deployment are out of scope.

**Performance/Resilience**: no fixed one-second write delay. Respect `Retry-After` and Azure rate
headers; bound transport retries; serialize same-process writes by canonical record key; use
`/rev` optimistic concurrency across Azure processes; use deterministic append-reread-reconcile
for GitHub; reread and re-evaluate before retrying a stale queue mutation at most four times after
its initial attempt (`MAX_STALE_REREADS = 4`).

**Constraints**: preview before apply; bootstrap's non-configurable allowlist can only create or
reuse one queue coordination Work Item and set `System.Title`, the managed Queue Manifest slice in
`System.Description`, and the two reserved queue tags; policy, permissions, repository settings,
candidate Work Items, and process configuration are read-only. No direct protected-target push,
credential/full-source durable evidence, skipped check reported as passed, or cleanup with
unproven ownership/revision or an unprobed exact-source-ref `ForcePush` permission is permitted.
The provider-neutral review concept `minimum_human_approvals` serializes as the mandatory JSON/API
field `reviewIntent.minimumHumanApprovals`; providers MUST NOT rename or reinterpret it.

**Scale/Scope**: one or more repositories in one configured Azure DevOps Project, initially two
named developers and two Local Agent Runners; active queue manifests remain bounded even after
10,000 completed integrations.

## Constitution Check

*GATE: evaluated before Phase 0 and re-evaluated after Phase 1.*

| Principle | Gate status |
|---|---|
| I. Product-Neutral Core | **PASS** - Azure code stays in the optional `tools/agent-workspace` layer. Core documents retain provider-neutral Work Item terms, and `scripts/verify-template` needs no Azure account or CLI. |
| II. Specifications Before Implementation | **PASS** - [Work Item #9](https://github.com/devphuclam/CodespaceTemplate/issues/9) traces this feature; the clarified spec contains 5 user stories, 37 functional requirements, 16 success criteria, and a complete requirements checklist. |
| III. Testable, Reproducible Verification | **PASS** - offline and live evidence are separate contracts; fake-transport tests deny network; a gated or skipped live run is `not-run`, never `passed`. |
| IV. Isolated Collaboration and Durable Handoffs | **PASS** - planning runs on isolated branch `002-azure-devops-adapter`; Local Agent Runner worktrees remain isolated; canonical claims, queue state, operation receipts, checkpoints, handoffs, completion summaries, and live-validation markers survive loss of local mirrors. |
| V. Least-Privilege and Explicit Integration | **PASS** - Entra is preferred, PAT fallback is explicit and narrow, bootstrap defaults to preview, administrator settings are read-only, and PR completion never bypasses policy. |

**Post-design re-check**: **PASS**. Direct REST does not add Azure to Core; Azure's mutation outbox
closes the Work Item PATCH/comment dual-write gap; GitHub append reconciliation never turns a
losing proposal into authority; policy evaluations remain provider-owned; and the optional runtime
profile does not select an application Stack Profile.

## Architecture and Contract Boundaries

1. `ProviderConfigLoader` validates one shared, non-secret Generated Project configuration and
   builds a provider-neutral `CliContext`. The committed root default explicitly selects GitHub with
   `runtimeProfile: null`; no remote-derived fallback is permitted. Provider-specific `gh` fields
   leave the shared context. The provider-neutral review concept is named
   `minimum_human_approvals`; its required serialized field is
   `reviewIntent.minimumHumanApprovals`.
2. `RevisionedWorkItemStore` and `CanonicalQueueStore` expose snapshots, opaque provider revisions,
   operation identities, and classified mutation outcomes. Domain services own preconditions and
   authority rules; adapters implement either atomic conditional mutation or deterministic
   append-reread-reconcile without exposing provider wire semantics.
3. `LocalVerificationRunner` executes configured commands. `PolicyAdapter` returns a complete,
   head-specific provider snapshot. Azure joins policy configurations and evaluations; GitHub joins
   active effective rules, classic protection, reviews, check runs, and commit statuses. Neither
   provider policy nor local verification can impersonate the other.
4. `SourceHostAdapter` owns branch/checkpoint push, pull-request lifecycle, target-head reads, and
   direct-target-push rejection. It returns structured refs rather than parsing URLs in domain code.
5. `EvidenceStore` publishes immutable, redacted operation receipts and Run Evidence. A managed
   pending-publication outbox in each canonical block prevents a later mutation from overtaking a
   state change whose comment was not yet durably published.
6. `RuntimeReadinessAdapter` reports `not-selected` when the optional profile is omitted/null and
   reports capabilities only after `local-agent-v1` is selected in a supported local environment.
   Azure permission probes use effective permission batch evaluation for an exact operation matrix
   plus read-only capability calls; cleanup branch deletion separately probes `ForcePush` on the
   exact source ref. No write probe or auth fallback is allowed.
7. `ValidationLedger` writes an atomic intent before provider mutation and reconciles it with
   deterministic provider markers. Cleanup has a closed operation allowlist and stops on ownership
   or revision drift. Managed execution remains the existing disabled stub.
8. `provider-runtime.ts` is the provider-neutral lifecycle seam used by CLI commands. The
   `github/provider.ts` module supplies the revised GitHub provider ports; existing `Legacy*`
   adapters remain only as a compatibility shell for generated projects and tests that construct
   a legacy context without provider ports.

The Integration Coordinator processes one candidate at a time: claim a queue lease against the
latest queue revision, record the target commit, run local verification against that target, ensure
the PR and provider policy evaluations refer to the current target, complete the PR without bypass,
verify the updated target, then atomically remove the active entry and publish its completion
summary. Any target, policy, revision, or precondition change invalidates that attempt.

## Project Structure

### Documentation (this feature)

```text
specs/002-azure-devops-adapter/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- README.md
|   |-- provider-ports.md
|   |-- azure-adapter.md
|   |-- github-adapter.md
|   |-- canonical-records.md
|   |-- provider-configuration.md
|   |-- cli.md
|   `-- validation.md
|-- spec.md
`-- checklists/requirements.md
```

### Source Code (repository root)

```text
tools/agent-workspace/
|-- src/
|   |-- config/
|   |   `-- provider.ts                 # shared config schema, loading, validation
|   |-- domain/
|   |   |-- mutations.ts                # operation identity, revision, receipt/outbox rules
|   |   |-- policy.ts                   # provider-neutral policy outcomes
|   |   `-- queue.ts                    # queue ordering and integration attempt rules
|   |-- adapters/
|   |   |-- ports.ts                    # revised provider-neutral contracts
|   |   |-- azure/
|   |   |   |-- auth.ts                 # Entra-first + explicitly gated PAT fallback
|   |   |   |-- http.ts                 # REST transport, versions, pagination, throttling
|   |   |   |-- models.ts               # untrusted Azure wire DTOs and decoders
|   |   |   |-- blocks.ts               # strict managed-block serializer/parser
|   |   |   |-- boards.ts               # revisioned Work Item store
|   |   |   |-- claims.ts               # claim/run transitions over Boards
|   |   |   |-- evidence.ts             # immutable comments and outbox reconciliation
|   |   |   |-- queue.ts                # canonical queue Work Item store
|   |   |   |-- process-mapping.ts      # built-ins, override, observed fingerprint
|   |   |   |-- repos.ts                # Git remote roles, push, PR lifecycle
|   |   |   |-- policies.ts             # config inventory + PR evaluation snapshots
|   |   |   `-- bootstrap.ts            # readiness, preview, fixed-allowlist apply
|   |   |-- github/
|   |   |   |-- revisions.ts            # append-reread-reconcile authoritative winner
|   |   |   |-- queue.ts                # coordination-Issue-backed canonical queue
|   |   |   |-- preparation.ts          # read-only not-applicable preparation behavior
|   |   |   |-- provider.ts              # provider-neutral GitHub ports used by CLI lifecycle commands
|   |   |   `-- policies.ts             # rules/protection/reviews/checks/statuses mapping
|   |   |-- local/
|   |   |   `-- runtime-readiness.ts    # shared not-selected/local-agent-v1 inspection
|   |   |-- fakes/                       # neutral fakes plus fake HTTP/Git transports
|   |   `-- managed/index.ts             # unchanged disabled V1 stub
|   |-- validation/
|   |   |-- ledger.ts                    # atomic intents, marker discovery, cleanup allowlist
|   |   `-- live-readiness.ts             # pure readiness outcome/fail-closed assessment
|   `-- cli/
|       |-- context.ts                   # provider-selected wiring
|       |-- provider-runtime.ts           # provider-neutral lifecycle command seam
|       |-- doctor.ts                    # provider-neutral readiness output
|       |-- provider.ts                  # prepare/adopt preview and apply
|       |-- integrate.ts                 # separate verification and policy gates
|       `-- index.ts                     # routing and stable JSON output
|-- scripts/
|   `-- runtime-doctor.sh                # Linux Dev Container/WSL2 environment check
|-- test/
|   |-- unit/azure/                      # parsers, auth, retry, mapping, redaction
|   |-- unit/github/                     # revision and effective-policy compatibility
|   |-- contract/                        # shared claims/queue/policy/mutation suites
|   |-- baseline/                        # clean Dev Container and WSL2 evidence assertions
|   |-- blackbox/test_azure_offline_pilot.ts
|   |-- live/live_azure.ts               # gated phases, write-ahead ledger, marker recovery
|   `-- validation/live-pilot.ts         # provider-neutral PR/queue/cleanup pilot orchestration
`-- package.json

tests/
|-- devcontainer-smoke.test.sh            # Core and optional Agent Workspace profile smoke harness
|-- generated-project-smoke.test.sh       # clean generated-project contract coverage
`-- verify-template.test.sh               # verifier regression coverage

The validation harnesses above are referenced by their exact repository paths:
`tests/devcontainer-smoke.test.sh`, `tests/generated-project-smoke.test.sh`, and
`tests/verify-template.test.sh`.

agent-workspace.config.json                       # committed non-secret explicit GitHub default
.devcontainer/agent-workspace/
|-- devcontainer.json                            # optional Local Agent Runner profile
|-- Dockerfile                                    # pinned Node 24 + minimal local-runner tools
`-- .dockerignore                                 # keep the build context application-neutral
config/agent-workspace.azure.example.json        # placeholders only
docs/agents/azure-devops-platform-adapter.md
docs/platform-adapters/azure.md                   # extend current Azure-ready boundary
```

**Structure decision**: extend the existing optional package rather than create a second
orchestrator. Azure wire models never enter Core documents or domain decisions. The GitHub path is
adapted to the revised contracts and gains explicit revision/policy compatibility tests.

## Delivery Sequence

1. Introduce provider-neutral mutation, queue, policy, structured PR, configuration, readiness, and
   recovery contracts. Commit the non-secret explicit GitHub default, then migrate fake and GitHub
   adapters first, including coordination-Issue queue, read-only not-applicable preparation,
   append-reread-reconcile revisions, shared runtime readiness, and complete effective GitHub
   policy mapping without changing valid GitHub behavior.
2. Add the shared Azure read-only foundation required by every later story: configuration loading,
   target resolution, Entra/PAT auth selection, injectable REST transport, wire decoding,
   redaction, pagination/throttling, queue identity discovery, strict Queue Manifest parsing,
   observed process fingerprints/mappings, exact permission probes, and policy visibility.
3. Deliver provider preparation and one-way adoption: preview first; queue-only fixed-allowlist
   apply; no candidate mutation; Azure-only push origin with fetch-only template provenance.
4. Implement Azure Boards canonical candidate records, claim/run transitions, keyed same-process
   serialization, `/rev` concurrency, immutable evidence, and pending-publication recovery.
5. Implement the canonical queue store, deterministic sequence, single integration lease, four-
   reread stale retry bound, semantic decisions, completion compaction, and provider-only
   reconstruction.
6. Implement Azure Repos checkpoint push, PR lifecycle, effective policy evaluation, and the
   Integration Coordinator's separate local-verification/provider-policy gates.
7. Add the optional Dev Container/WSL2 runtime profile and live-validation write-ahead ledger,
   deterministic provider markers, crash recovery, closed cleanup allowlist with exact-source-ref
   `ForcePush` probing, and documentation.
8. Complete unit/contract/GitHub compatibility/Azure offline/black-box suites and clean baseline
   runs in both supported environments, then add separately gated readiness, single-identity,
   crash-recovery, and two-identity live phases. When company access becomes available, record
   measured cohorts of ten first-time maintainers and ten reviewers; unavailable phases remain
   `not-run`.
9. Phase 9 convergence (T111-T113) reconciles the provider-runtime and revised GitHub seams,
   preserves the two-axis validation status semantics, and keeps T098, T103, and T113 explicitly
   separate: T098 owns the Phase 7 harness/no-credential run, T103 owns the available verification
   matrix, and T113 owns executable harness surfaces plus convergence classification. None of these
   tasks turns `blocked` or `not-run` into PASS; T104, T105, and T114 remain gated validation work.
10. Phase 10 runtime convergence (T115-T119) records the Docker-backed profile evidence separately
    from clean-checkout and WSL2 evidence, extends the profile smoke coverage, pins the reproducible
    runtime boundary, keeps runtime selection config-driven, and names the exact profile paths in
    task/plan traceability. These tasks do not close T104, T105, or T114 by inference.
11. Phase 11 live-foundation convergence (T120-T123) keeps the live runner gated and provider-neutral,
    verifies actual runtime/capability/policy readiness before mutation, preserves the write-ahead
    ledger and marker recovery boundary, extends secret scanning and smoke assertions, and records
    exact evidence paths. A no-access live run remains `not-run`.
12. Phase 12 remaining pilot convergence (T124-T126) is the final implementation gate for the
   allowlisted Azure Repos branch/PR/policy/queue cleanup pilot and the offline recovery/ledger
    contract coverage. Missing company access or provider artifacts keeps the affected phase
    `not-run`; no live PASS is inferred.
13. Run T114 only after T115-T126 and the gated T104-T109 outcomes have either been implemented or
    independently recorded. T114 is the final clean-environment handoff/convergence gate, and its
    result must preserve separate `passed`, `blocked`, `not-run`, and `failed` outcomes. This
    sequence does not expand scope to Managed Runner, Azure infrastructure, or application pipelines.

## Requirement Coverage

| Requirements | Planned owner |
|---|---|
| FR-001, FR-002, FR-003, FR-004 | provider config/context factory and SourceHost adoption contract |
| FR-005, FR-006, FR-007 | read-only readiness, exact permission-operation matrix, queue-only preparation preview/apply |
| FR-008, FR-009, FR-037 | Entra-first auth chain, explicit PAT fallback, secret-safe REST/Git boundary |
| FR-010, FR-011, FR-012, FR-013, FR-014, FR-015 | provider-neutral atomic/append-reconcile mutations, Azure managed blocks/outbox, GitHub reconciliation, Local Runner isolation |
| FR-016, FR-017, FR-018, FR-019, FR-020 | canonical queue store, sequence/lease/decision rules, one-at-a-time Integration Coordinator |
| FR-021, FR-022, FR-023 | Azure/GitHub branch-policy adapters, head-specific effective policy snapshots, no bypass, stricter-policy precedence, and the `minimum_human_approvals` to `reviewIntent.minimumHumanApprovals` mapping |
| FR-024, FR-025, FR-026 | immutable redacted evidence/comments and honest provider retention documentation |
| FR-027, FR-028, FR-029 | replaceable ports and optional Linux Dev Container/WSL2 `local-agent-v1` runtime profile |
| FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036 | network-denied offline suites, exact-allowlist live phases, write-ahead marker recovery, closed cleanup, Core independence, and separate `passed`/`blocked`/`not-run`/`failed` verification outcomes |

The validation matrix in [`contracts/validation.md`](contracts/validation.md) maps SC-001..SC-016
to fixed-cohort pilot timing, concurrency, recovery, compaction, redaction, adoption, mapping,
auth, and offline/live evidence checks; company-access-dependent criteria remain live-gated rather
than silently passed.

## Complexity Tracking

| Decision | Why required | Simpler option rejected |
|---|---|---|
| Extend feature-001 ports | Existing `requiredChecks(): string[]` conflates local commands with provider policy and existing mutations cannot carry revisions/operation IDs. | Hiding Azure semantics inside the old interfaces would permit false-pass policy results and untestable concurrency. |
| Pending-publication outbox in managed blocks | Work Item PATCH and comment creation are separate Azure operations; FR-014 requires state plus exactly-once historical evidence under retries/crashes. | Best-effort append after PATCH can lose or duplicate evidence. |
| Direct REST with injected transport | Required endpoints span Boards, Process, Git, and Policy APIs and need deterministic offline contract tests. | Azure DevOps CLI output/coverage is uneven and makes HTTP concurrency and fixture tests indirect. |
| GitHub append-reread-reconcile | GitHub Issues/comments do not expose Azure-style atomic revision tests, but compatibility must still reject stale authority deterministically. | Treating a comment append as an atomic accepted mutation permits two authoritative winners. |
| Explicit GitHub default plus optional runtime | Existing Generated Projects must remain selectable without an Azure account, while a runtime profile must never be inferred. | Remote inference or a mandatory runtime profile would either hide provider choice or make offline use fail unnecessarily. |
| Write-ahead live-validation ledger plus provider markers | A crash can occur after provider acceptance but before the response is journaled, and local cache can be lost. | Local IDs alone orphan artifacts; provider markers alone cannot prove the intended operation sequence. |
| Separate implementation status from verification outcome | A completed harness or adapter can still be blocked by Windows process policy or remain not-run until a supported environment or Azure target exists. | A single task checkbox would falsely collapse blocked/not-run evidence into PASS and weaken the handoff contract. |

No unresolved technical question blocks task generation. Company Organization, Project,
Repository, process values, permissions, policy IDs, and live credentials remain explicit runtime
inputs and live-validation gates by design.
