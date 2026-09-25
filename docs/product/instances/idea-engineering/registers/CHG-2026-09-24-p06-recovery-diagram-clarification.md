# P06 Recovery Diagram Clarification

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-P06-DIAGRAM-001` |
| Class / version / status | `CHG` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; DOC-05 remains the controlled architecture source |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Date / applicability | 2026-09-24 / Core v0 candidate architecture and PH0 P06 documentary review |
| Owner / author | Principal Product Author / assistant drafting support; named accountable author pending |
| Reviewer / acceptance authority | Project Reviewer; source review `NOT-RUN`. Product Decision Authority acceptance of this exact DOC-05 successor `NOT-RUN` |
| Source / upstream trace | [DOC-05@0.22](../DOC-05-architecture-description.md) §§9.3–9.4; [P06 recovery plan@0.3](../../../../../specs/004-technical-pilot-readiness/recovery-and-security-plan.md) §2.5; [diagram-method note](../../../../research/2026-09-24-p06-diagram-method-review.md); user direction to apply the proposed bounded correction |
| Downstream trace | [DOC-05@0.23](../DOC-05-architecture-description.md) `ARCH-VIEW-SEQ-011` and `ARCH-VIEW-ACT-003`; [focused VEV](VEV-2026-09-24-p06-recovery-diagram-review.md); later P06 source-pin reconciliation before P06 documentary disposition |
| Change / supersession | Initial record; predecessor and superseded-by `NOT-APPLICABLE`; DOC-05@0.23 succeeds @0.22 as the current Draft source |
| Review trigger | Recovery-route guard, source requirements, P06 review scope or either diagram changes |
| Access / retention | `INTERNAL`; retain with DOC-05 versions and rendition evidence |
| Evidence status | Source correction and focused rendition review only; system rollback/restore, independent specialist review and P06 acceptance `NOT-RUN` |

## Reason and bounded change

`ARCH-VIEW-SEQ-011` already places an explicit authorization message in its successful recovery
branch. Its final response incorrectly said the operator was merely *eligible* for that same
decision. The final response now says authorization has occurred and directs the operator to the
controlled return-to-service runbook. This corrects presentation, not the authority rule.

DOC-05@0.22 §9.4 and the P06 plan already required a choice between compatible forward repair and
proven full recovery after a failed change. They did not show that choice or the unresolved-evidence
branch as one reviewable flow. `ARCH-VIEW-ACT-003` now shows containment, evidence, two guarded
routes, exact verification, remain-restricted outcomes and a separate named reopen decision.
`ARCH-VIEW-SEQ-011` continues to describe the detailed coordinated-recovery exchange.

## Impact and non-effects

| Area | Disposition |
|---|---|
| Feature / Spec / Tech Stack | No changed selection or new obligation; the diagram traces existing `REQ-OPS-003/004`, `REQ-IAM-004` and `QRS-006`. |
| Architecture | DOC-05 advances `Draft 0.22 → 0.23`; catalogue count becomes 29 DOC-05 views plus four DOC-06 data views. New view uses the existing §3.2 authoring/review policy. |
| Data / Interface / UX | No changed identity, persisted data contract, protocol, screen or user action. |
| Security / Operations | Existing Restricted Recovery Mode, independent security-change evidence, session invalidation and named reopen authority are shown explicitly. Backup-product, actual recovery policy and operator assignment remain open. |
| Verification | Focused source/rendition evidence is recorded separately. `VVP-013/014`, restore rehearsal, application/schema rollback and P06 review result remain `NOT-RUN`. |
| Existing P06 evidence pins | Guided P06 steps were recorded against DOC-05@0.22/P06 plan@0.3. They stay historical; a reviewer must reconcile the @0.23 diagram successor before closing P06. This record does not silently rewrite their hashes or change tracker state. |
| Product/gate authority | No Product Scope, PDA-approved predecessor, PG3, PG4, Q-15 or technology decision change. Exact successor architecture acceptance `NOT-RUN`. |

No old-binary replacement is represented as proof of a safe schema downgrade. An unproven forward
repair and an incomplete or unapproved recovery set both leave service restricted.
