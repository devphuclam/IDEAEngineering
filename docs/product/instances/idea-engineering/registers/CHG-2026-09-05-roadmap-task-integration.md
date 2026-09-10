# IDEA Engineering Roadmap and Task Integration Change Record

> **Supporting-record state**: controlled `Draft 0.1`. This is a planning update requested by the
> project user, not a Feature, Spec or Tech approval, a product-gate result or implementation authorization.

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ROADMAP-001` |
| Supporting Class | `CHG` — Controlled Change Record |
| Record Status / Version | `Draft 0.1` |
| Date | 05-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Product Decision Authority | Boss; existing exact decision records remain authoritative and are not changed here |
| Applicable product baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Roadmap / schedule | `IE-PROD-ROADMAP-001@0.4` / `IE-PLAN-DEC2026-001@0.1`, both Draft |
| Work Item | [DOC-07 synchronization](https://github.com/devphuclam/IDEAEngineering/issues/1) |
| Access Classification | `INTERNAL` |
| Retention | Retain with DOC-07 and the product-definition baseline; organizational duration remains unresolved under DOC-07's control envelope |

## User instruction and boundary

The project user asked whether the previously prepared 56-task breakdown had been recorded in DOC-07.
After confirmation that it existed only outside the repository, the user instructed the assistant
to incorporate the schedule, task appendix and Gantt into the project documents.

This carries forward the already proposed one-coder, 7 September–31 December 2026 forecast:
676 work hours plus 80 contingency hours, with 11 conditional Saturdays. The dates are not a
measured commitment. This update creates no requirement, changes no Feature/Spec/Tech selection,
resolves no open specification point and authorizes no Core code, software installation or rollout.

## Authority and impact

| Item | Treatment |
|---|---|
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | Draft 0.3 → 0.4; section 3.2 owns schedule assumptions, responsibility, package summaries, resource order and milestones. Existing gate states remain unchanged. |
| [Appendix A](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md) | Subordinate part of DOC-07@0.4, not an additional Core Product Document. Retains all 56 task IDs, hours, dates, dependencies and completion criteria; adds parent control fields and repository-relative links. |
| [Gantt](../planning/idea-roadmap-december-2026.html) | Frozen visual view of schedule 0.1. The supplied complete HTML is copied byte-for-byte, including the sandboxed iframe and CSP; not reconstructed from the earlier fragment. |
| [Catalogue](../README.md) and [version history](../decision-briefs/VERSION-HISTORY.md) | Link the package, record current Draft version and preserve prior hashes/review scope. |
| Feature 0.5 | Retained unchanged. Its DOC-07@0.3 source pin is stale relative to the current roadmap; reconcile the affected planning reference before presenting it as current. |
| Spec 0.6 / Tech 0.4 | Content and decision/review state retained. Task sequencing does not select new technology or change behavior; references to the current roadmap do not transfer approval. |
| Word and Human editorial copies | Not opened for editing, rewritten or regenerated; the rendition index identifies that the prior Feature planning source does not include this update. |
| Spec Kit | No edit under `specs/` or `.specify/`; no new execution plan or change to feature 003. Later Core increments must use the established lifecycle. |

The task appendix is intentionally Vietnamese for assignment/readability, while DOC-07's main
controlled source remains English. The appendix's former phrase about complete competitor/ISO
coverage is restated with neutral reference-product wording; no task behavior or estimate changes.
The original external task file and supplied HTML remain preserved at their original locations.

## Exact source and output pins

SHA-256 identifies content only; it does not establish review, approval or software correctness.

| Record | Version / role | SHA-256 |
|---|---|---|
| Pre-change DOC-07, inside archive below | Draft 0.3 | a33d4a4334c5236d36a839a2cb5a5904755b13c2fea5f592ad7ba65dec71b028 |
| [Pre-change archive](../history/2026-09-05-before-roadmap-sync.zip) | Original DOC-07, catalogue, version history and rendition index | 212e9e927dd3a5e576738d04165dea28f5dddbc80c700bcab5b411230f36ccfa |
| External task breakdown prepared earlier in this task | Input; `idea-core-v0-task-breakdown-december-2026.md` | e018011461561470bdc19341c5780db3f05069e8ac0662985d9868df46c93105 |
| [DOC-07](../DOC-07-mvp-roadmap-and-delivery-plan.md) | Draft 0.4 | ae338e17319c22a70b5a6e3a3842121b957c81935f8f64e1a5c27119648727f9 |
| [Appendix A](../planning/DOC-07-appendix-A-task-breakdown-december-2026.md) | Draft 0.4 / schedule 0.1 | 8a3a826764231db49ce4dcac43c1aab38f6d3e9de31f407f3bc1d95bb88751b9 |
| [Gantt](../planning/idea-roadmap-december-2026.html) | Source attachment and copied view have the same bytes | 6974272dd4c36934219ad6fa44a50ce818cd679faa3b9a8b2ca97e7626c1b455 |

Archive entries retain their original content. Resolve their relative links against the original
`docs/product/instances/idea-engineering` directory structure and the source versions recorded
at the time, not by treating a retained DOC-07@0.3 as current.

## Review and maintenance conditions

- Required calendar confirmation: holidays, leave, 11 Saturdays and other assignments.
- Required early reforecasts: F03 after the permitted IRONCAD probe; B06 on 30 September after the
  first implementation slice. Later scope additions or failed qualification also trigger reforecast.
- Representative pilot inputs, IT/license permissions and required specialist/independent reviews
  remain prerequisites; one person using two accounts does not satisfy representative-user acceptance.
- Any future change to task hours, dates or prerequisites must reconcile DOC-07, appendix and Gantt
  under the same schedule version, retain the predecessor, and reassess affected brief/rendition pins.
- Product tests, gate evidence and operational authorization remain `NOT-RUN` or `BLOCKED` as
  already recorded in their source documents. This record does not promote them.

## Verification for this update

Focused documentary checks are run before handoff: task identity/count/hour preservation; resource
order and capacity; 14 Feature / 68 existing requirement / 15 VVP references; local file links;
current output pins; archive-entry hashes; unchanged HTML including CSP/sandbox; and unchanged
Feature/Spec/Tech/Word inputs. Results and the bounded public workspace-check outcome are recorded
in the Work Item. None of these are product runtime, performance, security or conformity tests.
