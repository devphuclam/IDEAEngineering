# PH0 Readiness Consistency Correction

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PH0-CORR-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Prepared date | 2026-09-17 |
| Effective date | `NOT-APPLICABLE`; author correction, not a new product baseline |
| Owner | Principal Product Author; named accountable attribution `BLOCKED` before `Proposed` |
| Author | Codex assistant acting as Principal Product Author |
| Reviewer / acceptance authority | Project user authorized the proposed remediation: “Theo đề xuất của bạn hết nhé”; independent review `NOT-RUN` |
| Product Decision Authority | No new decision requested or recorded; predecessor approval remains pinned by `IE-CHG-PDA-APPROVAL-001` |
| Product normativity | `INFORMATIVE`; no new product requirement, architecture or technology decision |
| Applicable baseline | Input repository commit `4e5c964727e16486ea60fe4b7c3cc7daafed24e1`; Appendix A@0.5; draft PH0 package on `codex/technical-pilot-speckit`; Constitution@3.4.0 |
| Source / upstream trace | [Constitution](../../../../../.specify/memory/constitution.md), [Spec Kit process](../../../../agents/spec-kit.md), [PDA approval](CHG-2026-09-17-product-decision-authority-approval.md), [roadmap change](CHG-2026-09-17-technical-pilot-roadmap-rebaseline.md), prior read-only PH0 analysis findings C1/C2/I1/I2/U1 in this task |
| Downstream trace | [PH0 spec](../../../../../specs/004-technical-pilot-readiness/spec.md), plan, tasks, contracts, data model, quickstart, manifest and checklists; [Appendix A@0.6](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md); [domain language](../../../../../CONTEXT.md); instance catalogue |
| Change record | This record controls the approved remediation; predecessor planning bytes remain at the input Git commit |
| Supersedes / superseded by | Supersedes Appendix A@0.5 wording for P01/P07 only; does not supersede the roadmap rebaseline record; superseded by `NOT-APPLICABLE` |
| Review trigger | PH0 source/baseline changes, any gate-model amendment, or PG4 review preparation |
| Evidence status | Documentary source correction; T001–T005 author work and focused checks are recorded below; P01 readiness result, independent review and PG4 decision remain `NOT-RUN` |
| Classification / retention | `INTERNAL`; retain with DOC-07 and the PH0 delivery increment |

## 1. Reason and authorized scope

The first read-only analysis of PH0 found two constitutional conflicts and three execution/trace
issues. The project user approved their correction. This record corrects the authored delivery
package and one planning appendix; it does not amend the constitution to accommodate the errors.

## 2. Corrections

| Finding | Correction | Owning sources |
|---|---|---|
| C1 — gate outcome conflict | Separate Gate Execution State from Gate Outcome. A completed gate has only `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`; `NOT-RUN` is progress, not a disposition. Preserve approved PG2/PG3 prerequisites and complete non-invalidating conditional-action records. | CONTEXT; PH0 spec, gate contract, data model, research, tasks, quickstart and quality checklist; Appendix A P07 |
| C2 — premature planning pass claim | Re-evaluate the plan against the corrected sources. Its checks concern author document alignment only, not product-gate approval or independent acceptance. | PH0 plan Constitution Check and post-design check |
| I1 — PowerShell revision quoting | Quote the Git revision expression in the quickstart command so PowerShell sends it as one argument. | PH0 quickstart §3 |
| I2 — analysis writing its own output | T028 emits a read-only report. T029 separately saves it and remediates only explicitly approved findings; changed source pins require re-analysis and gate-impact review. | PH0 tasks; Spec Kit process guide |
| U1 — missing exact planning-change trace | Pin T005 to this exact change-record path; update Appendix A@0.5 → 0.6 with history and retain old plan history separately from the approved product baseline. | PH0 tasks/manifest; Appendix A; instance catalogue |

Supporting reconciliation also updates the Spec Kit process guide to installed integration 1.0.7
and its required `tasks → analyze` order, and corrects the manifest's Kanban input version to 0.3
without changing the recorded source hash. These are process/source-accounting corrections, not
technology selection. Custom checklist items are appended unchecked; original reviewer markers
are preserved, with CHK033 explicitly superseding CHK030's incomplete authorization wording.
The focused placeholder scan also corrects the quickstart's exclusion glob to `!**/checklists/**`
so intentional checklist criteria are not reported as unresolved specification placeholders.

## 3. Control and standards tailoring

Apply `STD-INFO-001` (ISO/IEC/IEEE 15289:2019, `STANDARD-GUIDED`) to this change record's identity,
ownership, status, baseline and traces; apply `STD-CM-001` (ISO 10007:2017, `STANDARD-GUIDED`) to
the predecessor/successor record and impact accounting. This is local information-item/change
discipline, not a conformity or certification claim. Editions and classifications remain owned by
the [standards register](../../../../governance/standards-register.md).

## 4. Impact and non-effects

- Approved 14 Feature groups and the 87-requirement predecessor SRS remain unchanged. The later
  Vault successor remains a separate Draft; this correction does not approve it.
- Tech Stack, Q-15 `PARTIAL / NO WINNER`, Format Worker runtime/toolchain qualification, product
  behavior, data contracts and UI are unchanged.
- DOC-07@0.14, Gantt dates, 35 work packages, 512 work hours, 88 reserve hours and dependencies are
  unchanged. Appendix A@0.6 corrects wording, not the schedule.
- Feature/Spec/Tech PDA approval remains attached to its exact predecessor. No PG2, PG3, PG4,
  rollout, commercial or runtime verification decision is made here.
- T001–T005 are marked complete as authoring/reconciliation work; T006 and later tasks remain
  unchecked. P01 project review, PH0 execution and PG4 assessment are not self-certified by
  authoring these documents.

## 5. Focused verification

| Check | Configuration / method | Actual result |
|---|---|---|
| Active increment resolution | Updated local Spec Kit prerequisite script with `-Json -RequireSpec -RequireTasks -IncludeTasks` | `PASS`; resolves `specs/004-technical-pilot-readiness` and finds spec/plan/tasks |
| PowerShell revision command | Execute the exact quoted quickstart command on this workstation | `PASS`; `git cat-file -e 'f269a0445737a7efd7f406ee51517149a8967afa^{commit}'` exits 0 |
| Structure / links / pins | Task IDs/paths, relative-link targets and Appendix successor SHA-256 | `PASS`; 32 sequential tasks (T001–T005 complete, T006–T032 unchecked), 33 unchecked custom checklist items, relative links resolve in 17 PH0/change files and the Appendix pin matches |
| Placeholder / whitespace | Corrected quickstart glob; `git diff --check` on modified tracked source files | `PASS`; no uncontrolled template markers and no tracked-source whitespace errors; intentional checklist wording excluded |
| Schedule preservation | Compare the 35 work-package rows with input commit `4e5c964` | `PASS`; hours and dependencies unchanged except correcting P01's approval-source reference |
| Cross-artifact consistency | `$speckit-analyze` read-only on corrected PH0 spec/plan/tasks and Constitution@3.4.0 | Author documentary check `PASS`; 26 local requirements/criteria have planned task coverage, 32 tasks, no remaining actionable findings; not runtime or qualified independent acceptance |
| Project review and PG4 decision | Attributable reviewer/authority disposition of frozen PH0 inputs | `NOT-RUN`; outside this author correction |

Analysis was emitted to the review conversation without file writes. The results above are saved
after that read-only phase as part of this separately authorized correction record. Reviewed
working-tree source SHA-256 values on 2026-09-17:

| Source | SHA-256 |
|---|---|
| PH0 `spec.md` | `62BBE94D2771B3C7A239C68269E259802871DC51D791CB595C803A62BE5D7F00` |
| PH0 `plan.md` | `08DA43E7CD3BFE1EC27E20EE2653746F1FB176AF454095A01812909730B143FE` |
| PH0 `tasks.md` | `8B58772AFF10630CD292C31EAC06E3BCD0D5608977F589787E9B7DD461D012C6` |

These are author-review pins, not a frozen PG4 decision baseline. Planned coverage does not mean
the tasks were completed. Spec Kit CLI reports 1.0.7; no new tool installation or technology
research was performed during this correction.

## 6. Next action

The focused documentary checks and T001–T005 author work are complete. Continue PH0/P01 only as
readiness work; no product implementation is authorized by this record. Obtain the required
reviewer disposition in T006 before claiming P01, PH0 or PG4 complete.
