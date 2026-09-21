# Project-management source package

This directory is the machine-facing planning and execution input for Project Management
Compiler. IDEAEngineering remains the source of truth; the Compiler validates and visualizes this
repository rather than becoming a second planning authority.

This package does not change IDEA Feature, Spec, Tech, Product Scope or any product-gate state.

## Compiler entry point

Give Project Management Compiler these two values:

```text
repositoryRoot = <IDEAEngineering checkout or immutable snapshot>
manifestPath   = planning/project-management-compiler-manifest.json
```

The [manifest](project-management-compiler-manifest.json) is the only discovery entry point. It
declares which source owns each kind of planning data. A consumer must not scan the repository and
guess between files with similar content.

## What each file is for

| File | Purpose | Edit when |
|---|---|---|
| [Source contract](project-management-compiler-source-contract.md) | Defines identity, authority, state, baseline, forecast, diagnostics and handoff rules. | The machine contract itself changes. |
| [Manifest](project-management-compiler-manifest.json) | Declares the contract version, source roles, expected totals and the exact register revision. | A declared source or accepted register revision changes. |
| [Execution Register](idea-technical-pilot-execution-register.json) | Records attributable actual state, effort, remaining work, forecast overrides, blockers and evidence for Delivery Cards. | Real execution information is learned or corrected. |
| [Work-session journal](idea-progress-work-journal.json) | Preserves Start/Stop sessions and before/after values for manual effort corrections used by the local Progress Tracker. | A timer session closes or an effort estimate is corrected. |
| [Execution Register schema](idea-technical-pilot-execution-register.schema.json) | Defines the serialized shape of the Execution Register. | A reviewed contract change requires a new compatible schema. |
| [Baseline reference](idea-technical-pilot-baseline-reference.json) | Machine cross-check of the approved DOC-07 planning totals and horizon. It is not a second plan. | A controlled rebaseline is accepted. |
| [Project calendar](idea-technical-pilot-project-calendar.json) | Records the selected Core v0 working calendar and dated forecast exceptions. | Availability or the selected Baseline calendar changes. |
| [Diagnostic catalogue](project-management-compiler-diagnostics.md) | Gives stable codes and treatments for invalid, incomplete or stale source data. | Validator behavior changes. |
| [Fixture catalogue](project-management-compiler-fixtures/fixture-catalog.json) | Lists valid, invalid and realistic contract-test inputs and their expected outcomes. | Contract or validator behavior changes. |

The roadmap, Work Packages and Delivery Cards remain in DOC-07 and its controlled appendices. The
manifest points to those owning files. The HTML Gantt is a visual cross-check only.

## Recording actual progress

Use the Execution Register for actual progress. Do not rewrite the approved Baseline to make a
dashboard look current.

For a guided local entry point, use the [IDEA Engineering Progress Tracker](../tools/progress-tracker/README.md).
It reads the same Execution Register, checks the one-card WIP limit and direct predecessors, and
writes a controlled register revision plus the matching manifest revision. The browser view is a
local preview; it does not make an uncommitted working tree an official Compiler snapshot.

1. Find the Delivery Card by the stable pair `entity.kind + entity.id`.
2. Record only facts supported by a person or controlled evidence. If history is unknown, retain
   `NOT_RECORDED`; do not guess `NOT_STARTED`.
3. Keep execution state separate from result state. For example, verification can be `COMPLETED`
   with result `FAIL`.
4. Record actual effort from closed work sessions. `actualStart`–`actualFinish` is elapsed calendar
   time and must not be substituted for actual effort. Review remaining effort at least weekly.
5. Add blockers separately from dependencies. A planned predecessor is not an unexpected blocker.
6. Increment `registerRevision` once for the accepted register mutation and update
   `manifest.execution.expectedRegisterRevision` in the same commit.
7. Run the validator before treating the change as a usable snapshot. The Progress Tracker button
   **Ghi nhận & công bố** performs validation, a scoped commit and push to `main`; it refuses to run
   when unrelated working-tree changes are present.

Changes to scope, Delivery Card identity, planned effort or Baseline dates belong in their owning
planning source and follow planning change control. They must not be smuggled into the Execution
Register as progress updates.

## Validation

From the repository root, run:

```powershell
pwsh -NoProfile -File .\scripts\validate-project-management-source.ps1 -RunFixtures
```

Exit codes are:

| Code | Meaning |
|---:|---|
| `0` | `PASS` or `PASS_WITH_WARNINGS` |
| `1` | Source data is invalid |
| `2` | The validator could not read or execute in the current environment |
| `3` | The contract version is unsupported |

`PASS_WITH_WARNINGS` is usable only when every warning has an understood owner and treatment. The
current Core v0 baseline and forecast calendar are aligned: Monday–Friday plus Saturdays in weeks
1, 3 and 5; Saturdays in weeks 2 and 4 are days off. Dated leave, holidays or other assignments are
recorded as forecast exceptions and never add scope automatically.

## Official handoff

A dirty working tree is a preview, not an official source snapshot. Official handoff requires:

- one exact Git commit containing every declared source;
- validator result `PASS` or owned `PASS_WITH_WARNINGS`;
- fixtures passing and source totals reconciling;
- the project user confirming the commit supplied to the Compiler.

Until those conditions are recorded, `sourceReadiness.gateState` remains `NOT_RUN`.
