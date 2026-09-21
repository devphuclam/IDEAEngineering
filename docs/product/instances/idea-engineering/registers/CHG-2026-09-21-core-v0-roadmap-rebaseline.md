# Core v0 Roadmap Rebaseline

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ROADMAP-CV0-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Date | 2026-09-21 |
| Owner / author | Principal Product Author; named attribution `BLOCKED` before `Proposed` |
| Reviewer / planning authority | Project user selected the recommendations during roadmap clarification on 2026-09-21 |
| Product Decision Authority | Feature, Spec and Tech remain the approved product baseline reported by the project user; this record does not create a fourth product-decision axis |
| Product normativity | `INFORMATIVE`; execution-planning authority for `IE-PLAN-DEC2026-003@0.1` |
| Applicable baseline | `IE-PROD-ROADMAP-001@0.16`; `IE-PLAN-DEC2026-003@0.1` |
| Supersedes | Active execution use of `IE-PLAN-DEC2026-002@0.1`; predecessor remains in Git history |
| Downstream trace | DOC-07@0.16; Appendix A@0.8; Kanban CARIO@0.4; project calendar; execution register; Project Management Compiler manifest; progress tracker |
| Evidence / claim status | Planning decision recorded; implementation, milestones and verification remain `NOT-RUN` unless separately evidenced |
| Classification / retention | `INTERNAL`; retain with DOC-07 and the execution-source package |

## 1. Selected plan

- Start: **23 September 2026**.
- Finish target: **31 December 2026**.
- Outcome: a small, installable **Core v0** for bounded internal use, not a company-wide rollout or
  commercial release.
- Calendar: Monday–Friday plus Saturdays in weeks 1, 3 and 5; Saturdays in weeks 2 and 4 are days
  off. The horizon contains **79 working days / 632 hours**.
- Allocation: **512 task hours + 88 technical-reserve hours + 32 operational-buffer hours = 632
  hours**.
- Resourcing: one primary software developer; WIP limit one implementation card.

## 2. Scope and Vault boundary

Core v0 implements one configured Vault. It must not hard-code document identity, Generation,
Check-in logic or business modules to one physical storage machine. Vault identity, location and
transfer access remain behind the selected Artifact Custody/Gateway boundary so that multiple Vaults,
replication and failover can be added later. Multi-vault behavior itself is not a Core v0 exit
condition and remains `NOT-RUN`.

The internal-use check covers 2–5 Windows machines, project P-100, 30–50 documents, 50–100 files,
representative IRONCAD/PDF/DOCX/XLSX content and one file of approximately 5 GB. These are pilot
conditions, not production capacity promises.

## 3. Progress recording decision

Actual effort is the sum of confirmed work sessions, not elapsed wall-clock time between a card's
start and finish:

```text
Start/Resume -> open work session
Stop timer   -> close session; card remains IN_PROGRESS
Suspend      -> close session; record a genuine blocker
Complete     -> close session; require evidence; remaining = 0
```

Sessions longer than eight hours or crossing a calendar day require user confirmation. Effort is
stored in minutes and displayed in hours. A correction retains before/after values, reason and
history. Remaining effort is an estimate: the tracker may reduce it after a session, but the user
may correct it with a recorded reason.

Local edits remain a draft until the user chooses **Ghi nhận & công bố**. Publication validates the
source package, limits the commit to controlled progress files and pushes the current `main` baseline.

## 4. Non-impact

This rebaseline does not change Feature, Spec, Tech, Product Scope, Q-15, PDA approval, PG3 or PG4.
It changes the active execution calendar, phase allocation, milestone dates, Vault delivery scope and
progress-recording mechanics only.

## 5. Reopen triggers

Reforecast or create a successor baseline when working availability changes, a milestone reveals a
material delivery-rate difference, a phase estimate varies by more than 20%, an external dependency
blocks the critical path, or management changes the 31 December outcome.
