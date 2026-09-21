# Forecast Calendar Correction — Technical Pilot

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-CALENDAR-TP-001` |
| Supporting class / version / status | `CHG` / `0.1` / `Draft` |
| Date | 2026-09-21 |
| Owner / author | Principal Product Author; named attribution `BLOCKED` before `Proposed` |
| Reviewer / planning authority | Project user confirmed the actual recurring work calendar on 2026-09-21 |
| Product Decision Authority | Not requested; this record changes forecast availability, not Feature, Spec or Tech |
| Product normativity | `INFORMATIVE` |
| Applicable baseline | `IE-PLAN-DEC2026-002@0.1`; DOC-07 predecessor weekday-only comparison baseline retained |
| Source / upstream trace | Project user clarification: work Monday–Friday and the first, third and fifth Saturday of each month; second and fourth Saturdays are days off |
| Downstream trace | `planning/idea-technical-pilot-project-calendar.json`; `planning/idea-technical-pilot-baseline-reference.json`; DOC-07@0.15; Appendix A; Project Management Compiler source contract |
| Evidence / claim status | Calendar arithmetic calculated for 2026-09-18 through 2026-12-31; implementation and delivery evidence remain `NOT-RUN` |
| Classification / retention | `INTERNAL`; retain with DOC-07 and the execution-source package |

## 1. Change

The previous selected forecast rule incorrectly treated the second and fourth Saturday of each
month as working Saturdays. The corrected forecast rule is:

```text
Monday–Friday: working days
Saturday in week 1, 3 or 5 of the month: working day, 8 hours
Saturday in week 2 or 4 of the month: day off
Sunday: day off
```

## 2. Calendar result

For 18 September–31 December 2026, this gives **83 forecast working days / 664 hours** before
holidays, leave and other assignments. The approved comparison baseline remains **75 weekdays / 600
hours**. The existing plan still allocates **512 planned work hours + 88 controlled reserve hours**;
the additional **64 hours** are forecast headroom and do not create new scope automatically.

## 3. Impact and non-impact

- Forecast scheduling and remaining-date calculations use the corrected calendar.
- The approved weekday-only comparison baseline is not silently rewritten.
- Planned work packages, Delivery Card identities, Feature, Spec, Tech, Q-15, Product Scope and
  PG4 state are unchanged.
- The warning `PMC-CALENDAR-001` remains until an explicit rebaseline decision changes the approved
  comparison baseline.
- No implementation, gate or delivery result is created by this record.

## 4. Review trigger

Reopen this record if working hours, Saturday availability, holidays, leave or other assignments
change, or if management chooses to make the forecast calendar the new approved baseline.
