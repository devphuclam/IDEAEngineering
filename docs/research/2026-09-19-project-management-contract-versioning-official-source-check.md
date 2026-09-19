# Project-management state and contract-versioning evidence from Jira, ClickUp and Microsoft Project

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-PM-CONTRACT-20260919-001` |
| Document class / version / status | `RESEARCH-NOTE` / `0.1` / `Draft` |
| Artifact role | `INFORMATIVE RESEARCH INPUT` for the Q24 Project Management Compiler contract/versioning question |
| Product normativity | `INFORMATIVE`; this note creates no Product requirement, architecture decision, implementation commitment or approval |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Product Decision Authority / repository maintainers; named attribution `UNKNOWN` |
| Reviewer / acceptance authority | Project user (`LEAD`) for the project-management source contract; working selection recorded 2026-09-19. Product Decision Authority approval is not claimed or required by this informative research note. |
| Evidence date / source access | `2026-09-19` (Asia/Bangkok) |
| Applicable baseline | IDEA Engineering source commit `111363de0c87e6f70a9e2573cbcc2fcad0a20ae6`; corrected Q24 recommendation selected by `LEAD` for the draft source contract on 2026-09-19 |
| Classification / retention | `INTERNAL`; retain with the Project Management Compiler source contract |
| Source / upstream trace | [`IE-STD-AUTH-001@0.2`](../agents/product-document-authoring-standard.md); Q24 working question and `LEAD` selection; first-party sources `JIRA-SRC-*`, `CU-SRC-*`, `MSP-SRC-*` and `STD-SRC-*` in Section 2 |
| Downstream trace | [`IE-PMC-SOURCE-CONTRACT-001@0.1.0`](../../planning/project-management-compiler-source-contract.md), manifest, Execution Register, validator and fixtures; official committed-source handoff remains `NOT-RUN` |
| Change record / predecessor | Initial evidence record; predecessor `NOT-APPLICABLE`; Product Scope impact `NONE` |
| Supersedes / Superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Review trigger | A cited vendor contract changes materially; a controlled Project Management Compiler contract is drafted; or compatibility/concurrency tests produce executable evidence |
| Evidence status | `PRIMARY-SOURCE-CHECKED`; contract, validator and bounded fixtures implemented; Source Readiness `PASS` with validation `PASS_WITH_WARNINGS`; exact commit is bound by import context; vendor runtime inspection `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this research item keeps vendor observations,
cross-source interpretation and Engineering recommendation visibly separate. Source silence is
recorded as `UNKNOWN` or a bounded source-set observation, not as proof that a capability does not
exist. Competitor behavior remains informative and cannot create an IDEA requirement by itself.

## 1. Research question and boundary

This note answers four bounded questions:

1. How do Jira Cloud, ClickUp and Microsoft Project separate an agreed plan or baseline from
   current/actual execution data?
2. How do they distinguish workflow status, progress and the reason or result of completion?
3. What change-history, record-version or concurrency mechanism is documented for task/project
   updates?
4. Is the proposed combination of `contractVersion`, `schemaVersion` and `registerRevision`
   modelled on these project-management products, or does it belong to the separate discipline of
   versioned machine contracts?

The product scope is deliberately narrow:

- **Jira:** Jira Cloud work items and Jira Cloud REST API v3.
- **ClickUp:** the current hosted product, public API v2/v3 documentation and webhooks.
- **Microsoft Project:** Project desktop baseline/tracking behavior and Project Online/Project
  Server check-out behavior. Microsoft has announced Project Online retirement on `2026-09-30`;
  the check-out material is used as evidence of a documented concurrency pattern, not as a future
  platform recommendation.

No vendor tenant, paid plan, local installation or API mutation was exercised. This is a
documentation review, not a parity test. It does not inspect private APIs, database internals or
undocumented behavior.

Evidence labels used below are:

| Label | Meaning |
|---|---|
| `DIRECT-VENDOR-FACT` | The product owner directly documents the behavior or interface. |
| `DIRECT-SPECIFICATION-FACT` | The owning standards/specification body directly defines the mechanism. |
| `SOURCE-SET-OBSERVATION` | A bounded statement about what the reviewed official documentation does or does not expose; not a universal absence claim. |
| `CROSS-SOURCE-INTERPRETATION` | A conservative conclusion derived from multiple direct facts. |
| `ENGINEERING-RECOMMENDATION` | A proposed IDEA convention requiring a later controlled decision; not vendor behavior and not approved Product scope. |
| `UNKNOWN` / `NOT-RUN` | The evidence does not establish the answer / the named check was not executed. |

## 2. First-party source register

### 2.1 Jira / Atlassian

| Source ID | Official source | Evidence use | Limitation |
|---|---|---|---|
| `JIRA-SRC-01` | Atlassian Support, [Log time on a work item](https://support.atlassian.com/jira-software-cloud/docs/log-time-on-an-issue/) | Original estimate, current/remaining estimate, time spent and work-log behavior | Time tracking is not a complete schedule baseline across dates, cost and scope. |
| `JIRA-SRC-02` | Atlassian Support, [What are work item statuses, priorities, and resolutions?](https://support.atlassian.com/jira-cloud-administration/docs/what-are-issue-statuses-priorities-and-resolutions/) | Status as workflow position and Resolution as how work completed | Administrators can customize values; the default vocabulary is not an IDEA vocabulary. |
| `JIRA-SRC-03` | Atlassian Support, [What are the different types of activity on a work item?](https://support.atlassian.com/jira-software-cloud/docs/what-are-the-different-types-of-activity-on-an-issue/) | User-visible history of field edits, workflow moves and work logs | The page does not specify retention, immutability or every event type. |
| `JIRA-SRC-04` | Atlassian Developer, [Jira Cloud REST API v3 — Issues](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/) | Issue update and paginated issue-changelog operations | The published operation surface is not evidence of Jira's internal storage/concurrency implementation. |
| `JIRA-SRC-05` | Atlassian Developer, [Atlassian REST API policy](https://developer.atlassian.com/platform/marketplace/atlassian-rest-api-policy/) | Backward compatibility, additive properties, resource/media-type evolution and deprecation | This is an Atlassian REST policy, not a per-work-item versioning model and not Semantic Versioning. |

### 2.2 ClickUp

| Source ID | Official source | Evidence use | Limitation |
|---|---|---|---|
| `CU-SRC-01` | ClickUp Help, [Use baselines on Gantt view](https://help.clickup.com/hc/en-us/articles/34358881283863-Use-baselines-on-Gantt-view) | Point-in-time start/end-date baseline snapshots and variance viewing | Availability varies by plan/role; this is a date baseline, not a full contract schema. |
| `CU-SRC-02` | ClickUp Help, [Manage task statuses](https://help.clickup.com/hc/en-us/articles/6309452618647-Manage-task-statuses) | Active, Done and Closed status groups and customizable workflow statuses | It does not define a separate general-purpose completion-resolution field. |
| `CU-SRC-03` | ClickUp Help, [Search and filter task activity](https://help.clickup.com/hc/en-us/articles/6309921223191-Search-and-filter-task-activity) | Activity entries for field, status, estimate and tracked-time changes | The page explicitly says quick status changes are not recorded in task activity. |
| `CU-SRC-04` | ClickUp Developer, [Webhooks](https://developer.clickup.com/docs/webhooks) and [Task webhook payloads](https://developer.clickup.com/docs/webhooktaskpayloads) | Event IDs, timestamps, actor, before/after values and a webhook-delivery idempotency key | A webhook event ID is not documented as a conditional-write token for task updates. |
| `CU-SRC-05` | ClickUp Developer, [Update Task](https://developer.clickup.com/reference/updatetask) and [Get Tasks](https://developer.clickup.com/reference/gettasks) | Public task update body and filtering/order by update time | The reviewed update operation documents no ETag or expected task revision; that bounded observation does not prove absence of internal controls. |
| `CU-SRC-06` | ClickUp Developer, [Get Started with the ClickUp API](https://developer.clickup.com/docs/Getting%20Started) and [API v2/v3 terminology](https://developer.clickup.com/docs/general-v2-v3-api) | Coexisting `/api/v2/` and `/api/v3/` surfaces and a breaking terminology change from Team to Workspace | The sources do not publish a SemVer compatibility policy for task representations. |

### 2.3 Microsoft Project

| Source ID | Official source | Evidence use | Limitation |
|---|---|---|---|
| `MSP-SRC-01` | Microsoft Support, [Create or update a baseline or an interim plan in Project desktop](https://support.microsoft.com/en-us/project/create-or-update-a-baseline-or-an-interim-plan-in-project-desktop) | Baseline fields, up to eleven baselines and comparison with actual data | Applies to the listed desktop/Project Server products; it is not an API contract. |
| `MSP-SRC-02` | Microsoft Support, [Update work on a project](https://support.microsoft.com/en-us/project/update-work-on-a-project) | Actual start/finish/work/duration, remaining work and percent-complete calculations | Calculation behavior is product-specific and does not define a task-result taxonomy. |
| `MSP-SRC-03` | Microsoft Support, [Status (task field)](https://support.microsoft.com/en-us/project/status-task-field) | Calculated `Complete`, `On Schedule`, `Late` and `Future Task` state | The field is schedule status, not a workflow engine or completion reason. |
| `MSP-SRC-04` | Microsoft Support, [Compare two versions of a project](https://support.microsoft.com/en-US/project/compare-two-versions-of-a-project) | Difference report between saved project versions | The comparison is not a complete append-only audit trail and does not compare assignments. |
| `MSP-SRC-05` | Microsoft Support, [Open a project file](https://support.microsoft.com/en-us/project/open-a-project-file), and Microsoft Learn, [`CheckOutProject`](https://learn.microsoft.com/en-us/dotnet/api/websvcproject.project.checkoutproject?view=office-project-server) | Exclusive check-out and application-level logical lock bound to user and session | This Project Online/Server pattern is pessimistic locking, not optimistic concurrency or SemVer. |
| `MSP-SRC-06` | Microsoft Planner Blog, [Microsoft Project Online is retiring: What you need to know](https://techcommunity.microsoft.com/blog/plannerblog/microsoft-project-online-is-retiring-what-you-need-to-know/4450558) | Project Online retirement date `2026-09-30`; Project desktop and Project Server are unaffected | Time-sensitive lifecycle context; it does not invalidate the documented historical concurrency pattern. |

### 2.4 Contract, schema and concurrency specifications

| Source ID | Owning authority / official source | Evidence use | Limitation |
|---|---|---|---|
| `STD-SRC-01` | Semantic Versioning, [Semantic Versioning 2.0.0](https://semver.org/) | `X.Y.Z`, declared public API, immutability after release, `0.y.z` development and `1.0.0` public API definition | SemVer is a software public-API convention; it does not define project baseline, audit history or row revision. |
| `STD-SRC-02` | JSON Schema, [JSON Schema Core Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core) | `$schema` as dialect/meta-schema URI and `$id` as canonical schema-resource URI | JSON Schema does not prescribe a custom instance property named `schemaVersion` or require SemVer for `$id`. |
| `STD-SRC-03` | OpenAPI Initiative, [OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/v3.1.1.html) | Separation of the OAS version, OpenAPI document version, described API version and JSON Schema dialect | OpenAPI's own version policy is not automatically the compatibility policy for an IDEA data contract. |
| `STD-SRC-04` | IETF / RFC Editor, [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match) | ETag/`If-Match` conditional writes to prevent lost updates and `412 Precondition Failed` | An in-file integer becomes equivalent only if write paths enforce the precondition atomically. |

Every external source in this register is first-party or an owning specification. No analyst post,
community answer, reseller page or unsourced comparison is used.

## 3. Observed project-management practice

### 3.1 Baseline versus actual/current state

| Claim ID | Evidence class | Observed practice | Source | Boundary |
|---|---|---|---|---|
| `PM-BASE-001` | `DIRECT-VENDOR-FACT` | Jira retains an Original estimate, a current/remaining estimate and Time spent/work logs so a team can compare the original estimate with actual time and the current forecast. | `JIRA-SRC-01` | This is estimate tracking, not a full frozen schedule/cost baseline. |
| `PM-BASE-002` | `DIRECT-VENDOR-FACT` | ClickUp Gantt baselines are point-in-time snapshots of task start and end dates. Current task dates can continue to change while the baseline remains available for acceleration/delay comparison. | `CU-SRC-01` | The cited baseline covers task dates. |
| `PM-BASE-003` | `DIRECT-VENDOR-FACT` | Microsoft Project stores nearly twenty baseline reference points across start, finish, duration, work and cost; it supports up to eleven baselines and compares them with current/actual progress. Changes to actual or scheduled dates do not alter baseline dates. | `MSP-SRC-01`, `MSP-SRC-02` | Microsoft permits an authorized user to update/rework a baseline, so “baseline” means a controlled reference, not necessarily physically immutable bytes. |
| `PM-BASE-004` | `CROSS-SOURCE-INTERPRETATION` | All three products preserve some form of prior plan/reference independently from current execution. None treats an update to actual/current progress as an automatic rewrite of the original reference. | `PM-BASE-001` through `PM-BASE-003` | The products differ materially in breadth and governance of a baseline. |

**Bounded interpretation:** keeping a Baseline source separate from an Execution Register follows a
recognizable mature-product pattern. The competitor evidence supports separation of authority, but
it does not determine IDEA field names, file layout or approval rules.

### 3.2 Workflow status, progress and completion result

| Claim ID | Evidence class | Observed practice | Source | Boundary |
|---|---|---|---|---|
| `PM-STATE-001` | `DIRECT-VENDOR-FACT` | Jira defines Status as the work item's current place in a workflow and Resolution as the description of how it was completed or resolved, such as Done, Won't do, Duplicate or Cannot reproduce. | `JIRA-SRC-02` | Values and workflows are customizable. |
| `PM-STATE-002` | `DIRECT-VENDOR-FACT` | ClickUp groups customizable statuses into Active, Done and Closed. Done can mean work is done while the task remains open; Closed means totally completed. | `CU-SRC-02` | ClickUp encodes these semantics in status groups rather than a separate general result field. |
| `PM-STATE-003` | `DIRECT-VENDOR-FACT` | Microsoft Project separately maintains actual/remaining quantities and percent complete; its calculated Status field reports Complete, On Schedule, Late or Future Task. | `MSP-SRC-02`, `MSP-SRC-03` | The examined sources do not expose a Jira-like Resolution reason. |
| `PM-STATE-004` | `CROSS-SOURCE-INTERPRETATION` | Mature tools avoid reducing execution to one Boolean. Workflow position, terminality, quantitative progress and completion reason are separate concepts in at least one product and distinct fields/groups across the set. | `PM-STATE-001` through `PM-STATE-003` | The evidence does not prescribe one universal state machine. |

**Bounded interpretation:** a separate execution `state` and terminal `result` is most directly
analogous to Jira's Status/Resolution split. ClickUp and Project reinforce the need to keep workflow
position, terminal completion and quantitative actuals distinct, but do not prove that every task
needs a non-null result.

### 3.3 Update history and revision evidence

| Claim ID | Evidence class | Observed practice | Source | Boundary |
|---|---|---|---|---|
| `PM-HIST-001` | `DIRECT-VENDOR-FACT` | Jira records comments, field edits, workflow moves and work logs in Activity; the REST API exposes paginated issue changelogs. | `JIRA-SRC-03`, `JIRA-SRC-04` | Retention and tamper-resistance are not established by these pages. |
| `PM-HIST-002` | `DIRECT-VENDOR-FACT` | ClickUp task activity can show changes to status, dates, estimates and tracked time. Webhook `history_items` can carry event ID, timestamp, actor and before/after values; ClickUp recommends `webhook_id:history_item_id` as an idempotency key for webhook processing. | `CU-SRC-03`, `CU-SRC-04` | Quick status changes may be omitted from task activity; webhook idempotency is not task-write concurrency. |
| `PM-HIST-003` | `DIRECT-VENDOR-FACT` | Microsoft Project can compare current and saved earlier/later project versions and produce a differences report. The reviewed product pages do not define that report as an append-only per-task audit contract. | `MSP-SRC-04` | A saved version comparison is not the same as a complete event log. |
| `PM-HIST-004` | `CROSS-SOURCE-INTERPRETATION` | A current revision number and an audit/change history solve different problems. A revision identifies a state; history explains who changed what and when. | `PM-HIST-001` through `PM-HIST-003` | Exact retention, authorization and immutability remain an IDEA decision. |

### 3.4 Concurrency and interface versioning

| Claim ID | Evidence class | Observed practice | Source | Boundary |
|---|---|---|---|---|
| `PM-CONC-001` | `SOURCE-SET-OBSERVATION` | Jira Cloud REST API v3 documents issue update and changelog operations, but the reviewed issue-update contract does not publish `If-Match`, ETag or an expected issue-revision parameter. Atlassian separately publishes backward-compatibility and deprecation rules for REST resources and JSON representations. | `JIRA-SRC-04`, `JIRA-SRC-05` | This does not prove that Jira lacks internal conflict handling or that another Atlassian API exposes a concurrency token. |
| `PM-CONC-002` | `SOURCE-SET-OBSERVATION` | ClickUp versions public endpoints through `/api/v2/` and `/api/v3/`. Its reviewed `Update Task` operation accepts mutable fields but publishes no ETag or expected task-revision input; `date_updated` is available for query filtering/order. | `CU-SRC-05`, `CU-SRC-06` | A timestamp/filter is not automatically a compare-and-swap precondition. Internal controls remain `UNKNOWN`. |
| `PM-CONC-003` | `DIRECT-VENDOR-FACT` | Project Online/Server uses pessimistic check-out: opening from Project Web App checks the project out to prevent others from changing it; the API describes an application-level logical lock bound to the user and `sessionUid`. | `MSP-SRC-05` | Project Online retires on 2026-09-30; this is a documented pattern, not a recommended platform. |
| `PM-CONC-004` | `CROSS-SOURCE-INTERPRETATION` | None of the three reviewed task/project models uses a SemVer value as the revision of every mutable task or register state. Their visible mechanisms are change histories, timestamps, saved versions, coarse API-version paths or exclusive locks. | `PM-CONC-001` through `PM-CONC-003` | This conclusion is limited to the official surfaces reviewed here. |

## 4. What the contract/schema standards actually establish

### 4.1 Semantic Versioning applies to a declared compatibility surface

`STD-SRC-01` states that software using SemVer declares a precise public API. `X.Y.Z` then signals
backward-incompatible, backward-compatible additive and backward-compatible bug-fix changes. It
also states that `0.y.z` is initial development, `1.0.0` defines the public API, and a released
version's contents are not modified in place.

This supports SemVer for a serialized manifest/register **contract** if the project explicitly
defines the compatible reader/writer behavior as its public machine interface. It does not support
using SemVer as an edit counter, audit sequence or substitute for the exact schema artifact.

### 4.2 JSON Schema has a dialect identity and a schema-resource identity

`STD-SRC-02` defines two distinct identifiers:

- `$schema` is the URI of the JSON Schema dialect/meta-schema used to interpret the schema, for
  example Draft 2020-12.
- `$id` is the canonical URI identifying a particular schema resource.

The specification does not define an instance property called `schemaVersion`, nor does it require
`$id` to contain a SemVer string. A project may put a version in its `$id`, but that is a local
identity/versioning convention.

### 4.3 OpenAPI demonstrates separation of version axes, not dual SemVer by default

`STD-SRC-03` explicitly separates:

- the `openapi` value that tells tooling which OpenAPI Specification version interprets the
  document;
- `info.version`, the version of the OpenAPI document, which the specification says is distinct
  from the OAS version and the described API's version; and
- `jsonSchemaDialect`, a URI identifying the default JSON Schema dialect.

This is a strong analogy for separating contract compatibility, schema dialect and document/state
revision. It is **not** evidence that both `contractVersion` and `schemaVersion` should be independent
SemVer counters for one data format.

### 4.4 Optimistic concurrency needs an enforced precondition

`STD-SRC-04` defines `If-Match` with an entity tag for state-changing requests to prevent one
client accidentally overwriting another client's work. A stale tag causes the precondition to fail,
normally with `412 Precondition Failed`.

An integer `registerRevision` can implement the same class of compare-and-swap check in a file or
domain API, but only when the write path atomically verifies an expected prior revision and commits
the next revision. An integer that is merely incremented by convention after a Git merge is state
metadata; by itself it is not optimistic concurrency control.

## 5. Assessment of the original Q24 proposal

The exact answer is **partly aligned, but not equivalent**. The baseline/state/history principles
look like mature project-management practice. The three-version-field design belongs primarily to
machine-contract, schema-identity and concurrency design.

| Original proposal element | Evidence disposition | Research assessment |
|---|---|---|
| Baseline remains separate from actual Execution Register | `SUPPORTED IN PRINCIPLE` | Retain. Jira separates original estimate/current actuals, ClickUp snapshots dates, and Project keeps explicit baseline fields. |
| Workflow state and task result remain separate | `SUPPORTED IN PRINCIPLE` | Retain. Jira's Status/Resolution is the clearest direct analogue. Make result applicability explicit for terminal states instead of duplicating state. |
| `contractVersion` uses SemVer | `SUPPORTED WITH CONDITIONS` | Appropriate if the serialized semantics are a declared, tested compatibility surface. While still unstable/draft, SemVer points to `0.y.z`; use `1.0.0` only when the public machine contract is intentionally stable. |
| Independent `schemaVersion` also uses SemVer | `REVISE` | JSON Schema already separates dialect (`$schema`) and schema-resource identity (`$id`). A second SemVer is justified only if the schema artifact has an independently managed compatibility lifecycle; otherwise it duplicates or can contradict `contractVersion`. |
| `registerRevision` is an increasing integer after every merge | `REVISE` | Increment on each accepted authoritative register mutation/transaction, not every repository merge. A merge that does not change the register should not change its revision. Enforce expected revision on writes if it is meant to prevent lost updates. |
| DOC-07/Product Document versions remain independent | `SUPPORTED IN PRINCIPLE` | Retain. Document control version, serialized contract compatibility and mutable execution-state revision answer different questions. |
| Unsupported contract major is rejected | `SUPPORTED` | Retain as a minimum fail-closed rule. |
| Unknown newer minor only warns and continues if required fields are understood | `TOO PERMISSIVE` | Same-major does not by itself prove an older reader can safely ignore new execution/authority semantics. Accept only an explicitly supported range or a contract-defined ignorable extension area; otherwise reject. |
| Newer patch is accepted whenever schema validation succeeds | `REVISE` | Schema validity is necessary but not sufficient. Accept only a supported patch range with compatibility tests. A constraint change that alters which instances are valid or changes meaning is not automatically a safe patch. |
| Authority/execution fields are never silently ignored | `SUPPORTED` | Retain. This is especially important if an extension policy permits unknown presentation-only metadata. |
| Migration is reviewed and import never silently rewrites the source | `SUPPORTED` | Retain. This aligns with controlled API evolution and preserves source evidence. |

## 6. Bounded Engineering recommendation supplied to Q24

This section remains `ENGINEERING-RECOMMENDATION`, not vendor behavior or a Product requirement.
The project user selected the corrected recommendation for the draft machine-source contract on
2026-09-19. That working selection does not create or change Feature, Spec, Tech or a product gate.

### 6.1 Use four identities, each for one question

| Concern | Candidate identity | Meaning |
|---|---|---|
| Serialized semantics | `contractVersion` | SemVer for the machine-readable meaning and compatibility obligations of the manifest/register contract. |
| JSON Schema language | schema file `$schema` | Exact JSON Schema dialect URI, pinned to Draft 2020-12 if that remains the selected dialect. |
| Validator artifact | schema file `$id`, optionally selected by an allow-listed `schemaRef` | Exact identity of the schema resource used for validation; repository commit/digest supplies exact byte provenance when needed. |
| Mutable register state | `registerRevision` | Monotonic integer for one committed authoritative register state; usable as an optimistic-concurrency token only with an enforced expected-revision check. |

The simplest viable contract is for `contractVersion` to select one exact allow-listed schema `$id`
inside the Compiler. In that model, an independent `schemaVersion` property adds no value and should
be omitted. If the instance must name its schema, use an exact `schemaRef`/schema ID rather than a
free-floating second SemVer whose compatibility relationship is undefined.

### 6.2 Draft and stable version states

- Use `0.y.z` while the machine contract is still experimental and incompatible changes remain
  possible.
- Publish `1.0.0` only after the contract's field semantics, unknown-field policy, compatibility
  promises, schemas and contract tests are reviewed as the stable public machine interface.
- Never change a released contract/schema artifact in place; publish a successor identity and keep
  the predecessor available for reproducible import/migration.

### 6.3 Compatibility behavior

The Compiler can use an explicit support table instead of inferring all behavior from the version
string alone:

| Input condition | Candidate Compiler behavior |
|---|---|
| Exact supported contract/schema pair | Validate structure and cross-file rules, then import if all gates pass. |
| Unsupported major | Reject with a typed unsupported-contract error. |
| Newer minor in the same major | Reject by default. Continue only when that minor is explicitly in the supported range, or all unknown content is confined to a contract-defined ignorable extension namespace. |
| Newer patch in a supported minor | Accept only when the support table/schema identity and contract tests establish compatibility; schema validation alone is not sufficient. |
| Unknown authority, identity, workflow, result or execution field | Reject; never discard or default it silently. |
| Migration needed | Produce a reviewed successor/output or explicit migration change; do not mutate the source during import. |

This is deliberately stricter than Atlassian's published policy of tolerating additive response
properties and ignoring some unrecognized request properties. Atlassian also states that its REST
APIs do not guarantee forward compatibility. A local Compiler that consumes authority-bearing
records should fail closed unless the extension point is explicitly declared safe to ignore.

### 6.4 Register revision, audit history and Git evidence

`registerRevision` should advance once per successful authoritative register mutation. A candidate
writer supplies the revision it read; the accepting transaction verifies it still matches and
commits the next value. A conflict returns a typed stale-revision result rather than overwriting the
newer register.

The revision does not replace:

- actor and timestamp attribution;
- field-level or event-level change history;
- baseline/rebaseline identity and authority;
- evidence links and terminal result evidence; or
- the Git commit that fixes the exact repository bytes.

If all updates initially occur through reviewed Git changes, Git supplies exact content history and
merge conflict detection. The integer still helps the Compiler detect stale cross-file candidates,
but its increment rule must be validator-enforced rather than a comment-only convention.

## 7. Controlled unknowns and limitations

| ID | State | Open point |
|---|---|---|
| `UNK-PM-001` | `UNKNOWN` | Whether Jira Cloud or ClickUp exposes a conditional task-write token through a different first-party API or plan-specific surface not included in the reviewed references. |
| `UNK-PM-002` | `UNKNOWN` | Vendor retention, immutability and completeness guarantees for every Jira/ClickUp activity event. |
| `UNK-PM-003` | `RESOLVED-IN-DRAFT` | The source contract separates execution/result states and requires completion evidence; future contract changes remain controlled. |
| `UNK-PM-004` | `RESOLVED-IN-DRAFT` | Contract `0.1.0` uses one `contractVersion` across the manifest and Execution Register plus JSON Schema `$schema`/`$id`. |
| `UNK-PM-005` | `NOT-RUN` | Contract compatibility tests for `0.x`, `1.0`, additive minor changes, patch corrections and rejected major changes. |
| `UNK-PM-006` | `NOT-RUN` | Atomic compare-and-swap behavior for `registerRevision` under two concurrent writers. |
| `UNK-PM-007` | `NOT-APPLICABLE` | The Q24 selection governs the informative project-management source interface under `LEAD`; it does not change a Product Decision Authority axis. |

The source review does not establish that Jira, ClickUp or Microsoft Project is universally
superior, or that IDEA should reproduce any vendor's field names, workflows or licensing model.
Microsoft Project Online's imminent retirement also makes it unsuitable as a future platform
precedent; only its documented baseline and locking concepts are used.

## 8. Research disposition

### Directly supported observations

- Jira, ClickUp and Microsoft Project all preserve a plan/original reference separately from
  changing current or actual execution data, at different levels of richness.
- Jira directly separates workflow Status from completion Resolution.
- Jira and ClickUp expose change/activity information; Microsoft Project supports saved-version
  comparison and Project Online/Server uses exclusive logical check-out.
- Jira and ClickUp version public API surfaces coarsely, while no reviewed vendor task/project
  model uses SemVer as the revision of every mutable record.

### Bounded answer to Q24

The original recommendation is **not a direct copy of Jira, ClickUp or Microsoft Project**. Its
good parts are consistent with them: separate baseline/current data, separate state/result,
retained history and controlled migration. `contractVersion`, schema identity and
`registerRevision` are instead a machine-contract design informed by SemVer, JSON Schema and
optimistic-concurrency patterns.

The evidence supports adopting Q24 only after these corrections:

1. keep one SemVer `contractVersion` for the declared serialized compatibility surface;
2. use JSON Schema `$schema` and `$id` for dialect and exact schema identity, omitting a second
   SemVer unless an independent schema lifecycle is demonstrated;
3. increment `registerRevision` per accepted register mutation and enforce it as a precondition if
   it is meant to provide optimistic concurrency;
4. do not automatically accept an unknown newer minor or patch solely because basic schema
   validation succeeds; and
5. keep explicit audit/history and Git evidence separate from the revision counter.

### Decision state and non-impact

Q24 project-management source-contract selection: `SELECTED` by `LEAD` on 2026-09-19. Contract
implementation and bounded fixture validation: `PASS_WITH_WARNINGS`; Source Readiness Gate:
`PASS`. The exact accepted commit is supplied by import context after clean-tree validation.

Product Decision Authority review/acceptance: `NOT-APPLICABLE` to this informative source
interface; no Feature, Spec or Tech approval is inferred.

This research note makes **No Product Scope Change**. It modifies no Feature, Spec, Tech decision,
FTR, REQ, architecture semantic, ADR, Product Document, roadmap, gate state, manifest, Execution
Register, validator or Compiler implementation.
