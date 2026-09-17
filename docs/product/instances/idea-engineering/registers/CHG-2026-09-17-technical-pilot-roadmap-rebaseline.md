# Technical Pilot Roadmap Rebaseline

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ROADMAP-TP-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Date | 2026-09-17 |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / planning authority | Project user selected the proposed roadmap direction on 2026-09-17: “Theo Roadmap đề xuất đi.” |
| Product decision authority | Not requested by this record. The boss continues to decide Feature, Spec and Tech; roadmap selection is not a fourth product-decision axis. |
| Product normativity | `INFORMATIVE`; DOC-04 remains the SRS and DOC-05 remains the architecture authority |
| Applicable baseline | Git commit `aabf02ffdef4ca901a84d39af5a467d39fd2c0d2`; `DOC-07@0.12`; multi-location Vault successor Draft |
| Source / upstream trace | Current one-coder context; [PDA approval record](CHG-2026-09-17-product-decision-authority-approval.md); [Vault architecture change](CHG-2026-09-17-multi-location-vault-transfer-architecture.md); predecessor Appendix/Gantt at the applicable commit |
| Downstream trace | `DOC-07@0.13`; `IE-PROD-ROADMAP-001-APP-A@0.5`; `IE-PLAN-DEC2026-002@0.1`; `IE-PLAN-DEC2026-002-KANBAN@0.2`; future Spec Kit increments and Work Items |
| Evidence / claim status | Calendar arithmetic and internal consistency reviewed; implementation, gate and delivery evidence remain `NOT-RUN` |
| Supersedes / superseded by | Supersedes the execution use of `IE-PLAN-DEC2026-001@0.1`; superseded by `NOT-APPLICABLE` |
| Access / retention | `INTERNAL`; retain with DOC-07 and its current renditions |

## 1. Reason for change

The predecessor plan allocated 756 hours from 7 September to 31 December 2026 and assumed selected
Saturday work. It also predated the direct Artifact data plane, Artifact Gateway, multi-location Vault,
Transfer Grant/Receipt, replication, exact-read failover and their verification obligations.

At the re-planning date, the remaining window from 18 September through 31 December contains 75
weekdays, or 600 nominal hours at eight hours per weekday, before holidays, leave or unrelated work.
Even all 15 Saturdays would add only 120 hours and must not be treated as committed capacity. The
predecessor forecast therefore cannot honestly represent a one-coder full-Core-v0 commitment.

## 2. Selected planning direction

The selected direction is a **bounded Technical Pilot by 31 December 2026**:

1. keep the approved Feature, Spec and Tech predecessor baseline intact;
2. obtain an exact disposition for the later Vault successor before claiming it as approved;
3. pass `PG4` before production implementation;
4. build one end-to-end, production-shaped thread rather than partial breadth across every Feature;
5. demonstrate native account/RBAC foundations, controlled document identity, Workspace,
   Checkout/Reference/Check-in, direct resumable transfer, two verified Artifact locations,
   Review/Release, Audit and bounded restore evidence;
6. retain deep breadth across all target formats, graphical workflow design, company login,
   hundreds-of-terabytes proof and multi-site active/active as later increments unless separately
   approved and re-estimated.

This is implementation phasing, not a deletion of approved product scope.

## 3. Capacity, phases and milestones

| Phase | Work | Reserve | Window | Closing milestone |
|---|---:|---:|---|---|
| PH0 — Implementation readiness | 64 h | 24 h | 18/09–02/10 | `MS0`: exact baseline/delta, bounded increment and recorded `PG4` result |
| PH1 — Running foundation | 72 h | 8 h | 05/10–16/10 | `MS1`: Web/Desktop/Server/PostgreSQL/Gateway path with login and Audit seam |
| PH2 — Controlled-document core | 96 h | 24 h | 19/10–06/11 | `MS2`: Store/Create, identity, Revision/Version/Generation and authorized retrieval |
| PH3 — Workspace and multi-location Vault | 144 h | 16 h | 09/11–04/12 | `MS3`: safe Check-in family and direct transfer to two verified locations |
| PH4 — Review and Release | 72 h | 8 h | 07/12–18/12 | `MS4`: exact Review/Approval/Release and reproducible package |
| PH5 — Hardening and Technical Pilot | 64 h | 8 h | 21/12–31/12 | `MS5`: regression, security, transfer, restore and bounded pilot evidence |
| **Total** | **512 h** | **88 h** | **18/09–31/12** | **600 weekday hours** |

Saturdays are not baseline capacity. Reserve cannot waive a gate, authority, required review or
critical correctness condition.

## 4. Claim boundaries

- The 31 December date is not a promise of full Core v0, production readiness or company rollout.
- Estimates are planning allocations, not measured velocity. Reforecast is mandatory after `MS0` and `MS3`.
- Product Decision Authority approval of the predecessor Feature/Spec/Tech baseline does not silently
  approve the later Vault successor.
- Exact Artifact Gateway runtime/toolchain and exact Format Worker runtime/toolchain remain governed
  decisions; this record does not select them.
- A Technical Pilot `PASS` requires evidence from its stated environment and dataset; it is not an SLA.
- Missing external authority, environment, license or reviewer is `BLOCKED`, not absorbed as coding effort.

## 5. Changed artifacts

| Artifact | Change |
|---|---|
| `DOC-07@0.13` | Replace the stale execution forecast with six delivery phases, six closing milestones, capacity and exit rules. |
| `IE-PROD-ROADMAP-001-APP-A@0.5` | Replace 56 predecessor tasks with 35 current work packages and one shared Definition of Done. |
| `IE-PLAN-DEC2026-002@0.1` Gantt | Show the phase bars, work packages, reserve, zero-duration milestone markers, dependencies and critical path. |
| `IE-PLAN-DEC2026-002-KANBAN@0.2` | Split the 35 work packages into 53 delivery cards and 7 zero-effort decision/milestone cards; map them to the company Kanban states and CARIO roles without inventing additional delivery capacity. Version 0.2 rewrites each card for cross-functional readers using purpose, work and completion statements; schedule and effort are unchanged. |
| Instance catalogue | Mark the predecessor plan historical and route readers to the current baseline. |

No Feature group, `REQ-*` obligation, Tech Stack selection, Q-15 result, Product Decision Authority
approval record, PG3 result or PG4 result is changed by this planning record.

## 6. Review checks

| Check | Result |
|---|---|
| Phase work hours | `64 + 72 + 96 + 144 + 72 + 64 = 512` |
| Reserve hours | `24 + 8 + 24 + 16 + 8 + 8 = 88` |
| Total allocation | `512 + 88 = 600` |
| Weekday count, 18/09–31/12 | 75 weekdays; 600 nominal hours |
| Work-package count | 35 |
| Kanban card count | 53 delivery + 7 decision/milestone = 60; reserve is not represented as task cards |
| Product baseline change | `NO` |
| Execution evidence | `NOT-RUN` |
| `PG4` | `NOT-RUN` |
