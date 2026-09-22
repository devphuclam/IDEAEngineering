# Core v0 Planning Card Identity Correction

| Control field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PLAN-ID-001` |
| Document class / version / status | `CHG` / `0.1` / `Current` |
| Change date | 22 September 2026 |
| Owner / recorder | Project user (`LEAD`); Principal Product Author prepares the controlled correction |
| Applicable predecessor | `IE-PLAN-DEC2026-003@0.1`; DOC-07@0.16; Appendix A@0.8; Kanban CARIO@0.4 |
| Applicable successor | `IE-PLAN-DEC2026-003@0.2`; DOC-07@0.17; Appendix A@0.9; Kanban CARIO@0.5 |
| Authority basis | The project user confirmed that WBS, Gantt/milestones and Kanban/progress setup are the three completed planning activities to show in the management plan. |
| Product normativity | `INFORMATIVE`; no Feature, Spec, Tech, Product Scope, architecture, gate or Product Decision Authority decision is changed. |
| Evidence state | Planning correction and retrospective effort attribution `RECORDED`; product implementation and `PG4` execution remain `NOT-RUN`. |
| Classification / retention | `INTERNAL`; retain with the Core v0 schedule baseline and Execution Register history. |

## 1. Reason for correction

The predecessor management WBS used Delivery Card IDs `P01`–`P03` for work that management and
the project user already considered complete. It also made those cards look like pending work in
the Project Management Compiler. The same labels are used independently by the Spec Kit PH0
readiness package, where `WorkPackage:P01`–`WorkPackage:P03` have a different meaning.

The correction introduces explicit planning IDs and makes the current management view distinguish
completed plan preparation from pending implementation-readiness work.

## 2. Controlled identity replacement

| Superseded Delivery Card | Current Delivery Card | Meaning | Planned hours | Current state |
|---|---|---|---:|---|
| `DeliveryCard:P01` | `DeliveryCard:PLN01` | Build and agree the Core v0 WBS | 4 | `COMPLETED / PASS` |
| `DeliveryCard:P02` | `DeliveryCard:PLN02` | Build the Gantt, working calendar and milestones | 4 | `COMPLETED / PASS` |
| `DeliveryCard:P03` | `DeliveryCard:PLN03` | Set up Kanban CARIO and progress recording | 4 | `COMPLETED / PASS` |

The predecessor identities remain as `SUPERSEDED` records in the current Execution Register and
remain recoverable through its revision history. They must not be reused for different future
Delivery Cards. `WorkPackage:P01`–`WorkPackage:P03` in
`specs/004-technical-pilot-readiness` are not renamed or superseded because identity is the pair
`kind + id`.

## 3. Dependency correction

```text
PLN01 → PLN02 → PLN03
                    ├─→ P04 ─┐
                    └─→ P05 ─┴─→ P06 → P07/PG4
```

- `P04` and `P05` may start after `PLN03`; WIP limit 1 still permits only one primary active card.
- `P06` requires `P04` and `P05`.
- `P07` requires `PLN01`–`PLN03` and `P04`–`P06`.
- PH1 remains blocked until the recorded `PG4` outcome permits it.

## 4. Actual-effort treatment

The project user confirmed a retrospective estimate of four hours for each planning activity.
Current actual effort is therefore **12 hours** and current remaining planned work is **500 hours**.
The corresponding delivery ratio is **12 / 512 = 2.3%**.

This percentage means that the controlled planning work is complete. It must not be labelled as
2.3% of product code or 2.3% of software implementation. No `actualStart` is fabricated because no
historical timer session exists. The Work Journal retains the prior P01 correction and records the
identity migration so the 4 hours are not double-counted in the current baseline.

## 5. Invariants preserved

| Controlled point | Result |
|---|---|
| Core v0 finish | 31 December 2026 — unchanged |
| Planned work | 512 hours — unchanged |
| Technical reserve / operational buffer | 88 / 32 hours — unchanged |
| Work packages / Delivery Cards / gates | 35 / 53 / 7 — unchanged |
| Feature, Spec and Tech | unchanged |
| Product Scope and one-Vault Core v0 boundary | unchanged; future multi-vault seam retained |
| Product Decision Authority approval | unchanged |
| `PG3` / `PG4` | unchanged; this record does not execute either gate |
| Q-15 | `PARTIAL / NO WINNER` — unchanged |

## 6. Updated controlled sources

- [DOC-07@0.17](../DOC-07-mvp-roadmap-and-delivery-plan.md)
- [Appendix A@0.9](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md)
- [Kanban CARIO@0.5](../planning/idea-technical-pilot-kanban-cario.md)
- [Gantt rendition](../planning/idea-roadmap-december-2026.html)
- [Baseline reference](../../../../../planning/idea-technical-pilot-baseline-reference.json)
- [Execution Register](../../../../../planning/idea-technical-pilot-execution-register.json)
- [Work Journal](../../../../../planning/idea-progress-work-journal.json)

The next pending implementation-readiness cards are `P04` and `P05`. Selecting one of them for
work still requires an explicit progress-tracker instruction; this change record does not start a
timer.
