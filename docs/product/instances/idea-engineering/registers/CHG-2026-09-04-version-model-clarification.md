# IDEA Engineering Version Model Clarification Change Record

> **Supporting-record state**: controlled `Draft 0.1`. This record preserves the accepted internal
> clarification and its impact. It is not a Product Decision Authority approval or implementation
> authorization.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-VERSION-001` |
| Supporting Class | `CHG` — Controlled Change Record |
| Record Status / Version | `Draft 0.1` |
| Date | 04-09-2026 |
| Owner | `Principal Product Author` |
| Internal Reviewer | Project user |
| Product Decision Authority | Boss; Feature and Spec decisions remain `NOT-RUN` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Access Classification | `INTERNAL` |

## Decision and rationale

The product model uses three distinct concepts:

1. **Business Revision** is the governed business milestone, such as A or B.
2. **Version within Revision** is the visible order `1, 2, 3…` inside that Revision.
3. **Generation** is the immutable system snapshot created for initial content, a successful changed
   Check-in, or the baseline of a new Business Revision.

`Version Sequence` is removed because it duplicated Version within Revision without a separate
business rule. Keeping both would make the UI, data model, tests and explanations disagree about
which number is authoritative.

The confirmed rules are:

- the initial content Check-in creates Revision A / Version 1 and one Generation;
- a later changed Check-in increments Version exactly once and creates exactly one Generation;
- a No Change Check-in increments neither and still ends Checkout;
- creating a new Business Revision starts again at Version 1 and creates its baseline Generation;
- Approve and Release pin an existing Generation and do not renumber Version.

The project user confirmed this direction on 04-09-2026 with the instruction to finalize and update
the material accordingly. That confirmation closes `SPEC-OPEN-01` for internal drafting. The complete
Feature and Spec baselines still require their normal review and the boss's separate decision.

## Impact and trace

| Affected item | Change | Resulting Draft |
|---|---|---|
| Domain language and lifecycle architecture | Define one Version within Revision; remove duplicate model field. | Current working source |
| DOC-01 | Refresh downstream Feature state only; product scope unchanged. | 0.3 |
| DOC-03/04 | Update business rule and testable requirement. | 0.3 |
| DOC-05/06 | Update architecture/data field and invariants. | 0.3 |
| DOC-07 | Close SPEC-OPEN-01 in the preparation plan and refresh source pins. | 0.3 |
| DOC-08 | Remove Version Sequence from the item header. | 0.3 |
| GOV/VVP | Correct the evidence disposition and planned test. | 0.3 |
| FEATURE-001 / SPEC-001 | Explain the rule in Vietnamese and record partial internal review. | 0.5 / 0.6 |
| TECH-001 | Refresh source pins; technology selection is unchanged. | 0.4 |
| HTML prototype | Keep only Revision, Version and Generation; update transitions and diagnostics. | Design evidence only |

## Verification status

| Check | Status |
|---|---|
| Static terminology scan and JavaScript syntax | `PASS` for the prototype scope: embedded JavaScript parses; no `documentVersion`, `versionSequence` or duplicate `Version Sequence` UI field remains. |
| Prototype transition walkthrough | `PASS` — 10/10 automated in-memory checks: initial/changed/No Change Check-in, Submit/Approve/Release, new Revision, stale conflict and all 10 seeded documents in VI/EN/JA. This is prototype evidence, not a production test. |
| Product implementation/model tests | `NOT-RUN`; no production implementation exists |
| Boss Feature/Spec/Tech decision | `NOT-RUN` |
