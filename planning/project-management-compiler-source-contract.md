# IDEA Engineering Project Management Source Contract

| Control field | Value |
|---|---|
| Stable Document ID | `IE-PMC-SOURCE-CONTRACT-001` |
| Document class / version / status | `DATA-CONTRACT` / `0.1.0` / `Current` |
| Purpose | Define the repository-owned planning and execution input consumed by Project Management Compiler. |
| Product normativity | `INFORMATIVE`; this contract does not change IDEA product Feature, Spec, Tech, scope, architecture or gate decisions. |
| Planning authority | Existing DOC-07 sources remain authoritative as declared in the manifest; this contract does not become a second plan. |
| Owner / recorder | Project user (`LEAD`) owns execution facts; Principal Product Author prepares controlled changes. |
| Consumer | Project Management Compiler. |
| Applicable baseline | `IE-PLAN-DEC2026-002@0.1`; exact repository commit is supplied by the import context. |
| Classification / retention | `INTERNAL`; retain every released contract and accepted register revision required to reproduce an imported snapshot. |
| Source / upstream trace | DOC-07, Appendix A, Kanban CARIO, the PH0 readiness package, decisions Q1-Q39 confirmed on 2026-09-19, and the forecast-calendar clarification recorded on 2026-09-21. |
| Downstream trace | `project-management-compiler-manifest.json`, Execution Register schema, validator and fixtures in this directory. |
| Evidence status | Source Readiness `PASS`; validation `PASS_WITH_WARNINGS` with the controlled forecast-calendar warning; exact source commit is bound by import context. |

## 1. Boundary

IDEAEngineering is the source of truth. Project Management Compiler reads, validates and
visualizes this source. It must not silently repair the source, infer approval, or write progress
back as authoritative data. An edit made in the Compiler remains an uncommitted proposal until a
reviewed change is merged into IDEAEngineering and imported again.

This contract standardizes project-management input only. It does not authorize product
implementation and does not alter the `PG4` state.

## 2. Entry point and source authority

The consumer receives two values:

```text
repositoryRoot = path to one IDEAEngineering checkout or immutable snapshot
manifestPath   = planning/project-management-compiler-manifest.json
```

The manifest is the only discovery entry point. Paths inside it are repository-relative. A reader
must reject absolute paths, traversal outside the repository, undeclared files and resolved links
that leave the repository.

| Manifest role | Authority |
|---|---|
| `ROADMAP_AUTHORITY` | DOC-07 owns roadmap purpose, horizon, phase allocation and milestones. |
| `WORK_PACKAGE_AUTHORITY` | Appendix A owns 35 work packages, planned effort and package dependencies. |
| `DELIVERY_CARD_AUTHORITY` | Kanban CARIO owns 53 executable Delivery Cards, seven zero-effort gates/milestones, dates, card dependencies and responsibility assignments. |
| `EXECUTION_AUTHORITY` | The Execution Register owns recorded actual state, actual effort, remaining effort, forecast overrides, blockers and evidence for Delivery Cards. |
| `RENDITION_CROSS_CHECK` | The HTML Gantt is a visual cross-check only. |
| `READINESS_EVIDENCE` | The PH0 readiness package supplies gate and human-review evidence; it is not Delivery Card actuals. |
| `NAVIGATION_ONLY` | The instance catalogue helps a human navigate and owns no planning field. |

If two sources claim the same field, the role table above decides ownership. A conflict is a
diagnostic; import must not choose whichever value was read last.

## 3. Contract and snapshot identity

- `contractVersion` is Semantic Versioning for the serialized meaning of this interface. While
  incompatible changes remain possible, the contract stays in `0.y.z`. `1.0.0` is reserved for an
  intentionally stable and tested public machine contract.
- JSON Schema `$schema` identifies the Draft 2020-12 dialect. `$id` identifies the exact schema
  resource. There is no second free-floating `schemaVersion` counter.
- `registerRevision` is a monotonic integer advanced once for every accepted authoritative
  Execution Register mutation. It prevents lost updates only when a writer atomically checks the
  expected prior revision.
- The exact source commit is import context, not a self-referential field committed inside the
  same Git tree. An official Snapshot ID is computed from project ID, source commit, Baseline ID
  and register revision.

An import is atomic. Every declared source is read from the same commit or snapshot. If validation
fails, the consumer retains the last valid snapshot and reports that the candidate failed. A dirty
working tree may be shown only as `UNCOMMITTED_PREVIEW`.

## 4. Stable identity and hierarchy

Entity identity is the pair `kind + id`; `DeliveryCard:P01` and `WorkPackage:P01` are distinct.
Titles and paths may change without changing identity. IDs are never reused.

The Execution Register contains Delivery Card records only. Work packages, phases and milestones
are aggregates or zero-effort control points. Spec Kit task IDs are trace links, not another unit of
project effort.

An accepted entity is never hard-deleted. Cancellation, replacement, split and merge keep the old
identity and record successor relations. If an identity in the prior accepted snapshot disappears
without a controlled disposition, import fails.

## 5. Execution facts

`recordingState` distinguishes `NOT_RECORDED` from a recorded execution state. Missing historical
evidence must not be rewritten as `NOT_STARTED`.

Recorded execution states are:

```text
NOT_STARTED | IN_PROGRESS | COMPLETED | SUSPENDED | CANCELLED
```

Result states are separate:

```text
NOT_RUN | PASS | FAIL | BLOCKED | NOT_APPLICABLE
```

Normal delivery work may have `NOT_APPLICABLE`; verification work may be completed with a `FAIL`
result. `COMPLETED` requires the observable output, actual finish, zero remaining effort, required
review and evidence. Overdue, stale and at-risk are derived alerts, not execution states.

Actual effort and remaining effort are independent values. Remaining effort is not calculated as
baseline minus actual. An evidence item records type, repository path or controlled external URI,
commit/digest where applicable, description, result, recorder and time. Local absolute paths and
temporary files are prohibited.

## 6. Baseline, forecast and progress

Baseline is the approved comparison reference. Actual and forecast may change without changing the
baseline. Rebaseline requires a recorded authority decision and retains every predecessor baseline.

The consumer displays three separate views:

1. **Delivery ratio**: baseline effort of accepted completed Delivery Cards divided by total
   baseline Delivery Card effort. This is the primary management percentage.
2. **Estimated work progress**: actual divided by actual plus remaining for records with sufficient
   data. It must not be labelled delivered percentage.
3. **Schedule health**: `ON_TRACK`, `AT_RISK`, `LATE` or `UNKNOWN`, derived from baseline dates,
   calculated forecast, blockers and reserve usage.

Default risk thresholds are five working days of remaining schedule margin and 80 percent reserve
consumption. They are baseline configuration, not user-selected dashboard colours.

## 7. Calendar, capacity and scheduling

The controlled December 2026 baseline remains Monday-Friday because that is what DOC-07 currently
approves. The project user selected Monday-Friday plus the first, third and fifth Saturday of each
month as the current forecast calendar; the second and fourth Saturdays are days off. The calendar
file keeps both facts visible. Until a rebaseline is approved, the difference produces
`PMC-CALENDAR-001`; it does not rewrite DOC-07 or add work automatically.

The active forecast uses `Asia/Ho_Chi_Minh`, eight hours per working day, calendar exceptions,
remaining effort, dependencies, committed capacity and WIP limit one for the primary developer.
Uncommitted backup developers are not counted.

Dependencies are shown to users as `blocks` / `is waiting on`. The data model supports
`FINISH_TO_START`, `START_TO_START`, `FINISH_TO_FINISH` and `START_TO_FINISH`; Core v0 defaults to
`FINISH_TO_START`. Cycles are invalid. A dependency is planned sequencing; a blocker is an
unexpected impediment.

Calculated Forecast uses forward scheduling and resource leveling. It never overwrites source
dates, silently splits a Card or claims a verified Critical Path before dependency, duration,
calendar and resource constraints are all qualified.

Priority (`URGENT`, `HIGH`, `NORMAL`, `LOW`) is separate from planned order. Priority cannot bypass
a dependency, gate or review and does not automatically interrupt active work.

## 8. Recording cadence and unplanned work

Actual effort is recorded at the end of a working day; important state, blocker and forecast events
are recorded when they occur. Remaining effort is reviewed at least weekly. The weekly status date
is the last working day in the selected forecast calendar. An in-progress Card without an update
for more than two working days is stale; a seven-day-old remaining estimate requires review.

Unplanned work is classified as `DEFECT`, `REWORK`, `DISCOVERED_WORK`, `RISK_RESPONSE` or
`NEW_SCOPE`. Work with its own output, dependency, assignee, verification or scope impact receives
a successor Delivery Card. In-scope variance may consume controlled reserve with attribution.
`NEW_SCOPE` requires change control and cannot silently consume reserve or alter the baseline.

## 9. Diagnostics and compatibility

Diagnostics have `ERROR`, `WARNING` or `INFO` severity and the structured fields defined in the
[diagnostic catalogue](project-management-compiler-diagnostics.md). Results are `PASS`,
`PASS_WITH_WARNINGS` or `FAIL`.

- Unsupported contract versions, unknown authority/execution semantics, identity failures,
  path escape, dependency cycles and mixed snapshots fail closed.
- A newer minor or patch is accepted only when explicitly listed as supported and covered by
  contract tests. Basic schema validation alone is insufficient.
- Migrations produce a reviewed successor; an importer never mutates the source in place.

Validator exit codes are `0` for `PASS`/`PASS_WITH_WARNINGS`, `1` for invalid data, `2` for an
environment/read failure and `3` for an unsupported contract.

## 10. Source Readiness Gate and handoff

The package is ready for official handoff only when all declared files belong to one committed
snapshot, validation has no `ERROR`, fixture expectations pass, source totals reconcile, and the
project user confirms the exact source commit. Warnings require an owner and treatment but do not
necessarily block the handoff.

The handoff to Project Management Compiler contains exactly:

```text
Source repository: devphuclam/IDEAEngineering
Manifest path: planning/project-management-compiler-manifest.json
Contract version: 0.1.0
Source commit: <exact accepted commit>
Validation result: PASS or PASS_WITH_WARNINGS
```

For this `0.1.0` handoff the Source Readiness Gate is `PASS` and validation is
`PASS_WITH_WARNINGS`. The retained warning records the deliberate difference between the approved
weekday-only Baseline and the selected forecast calendar. The exact accepted source commit is
supplied by import context after clean-tree validation. Product Feature/Spec/Tech, Product Scope
and `PG4` remain unchanged.
