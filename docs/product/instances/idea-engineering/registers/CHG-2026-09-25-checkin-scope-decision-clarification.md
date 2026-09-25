# Check-in Scope Decision Clarification

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-WS-SCOPE-001` |
| Class / version / status | `CHG` / `0.2` / `Draft` pre-approval design record |
| Product normativity | `INFORMATIVE`; DOC-04 remains the requirement source and DOC-05 the candidate architecture source |
| Date / applicability | 2026-09-25 / Core v0 Check-in scope design |
| Owner / author | Principal Product Author / assistant drafting support; named accountable author pending |
| Reviewer / acceptance authority | Project Reviewer selected the recommended Q1/Q2/unknown-dependency handling before approval; controlled-source review `NOT-RUN`. Product Decision Authority later approved all three branches on 25-09-2026 under [IE-CHG-PDA-APPROVAL-003](CHG-2026-09-25-pda-approval-checkin-scope.md) |
| Source / upstream trace | DOC-04 `REQ-WS-005/006/007/010/013`; [architecture input](../../../../architecture/idea-product-lifecycle-architecture.md) §14; DOC-05@0.23 §§3.2/7.2; [DDM/Aras Q2 evidence review](../../../../research/2026-09-25-checkin-unreserved-nonrequired-ddm-aras-review.md); user selection of the recommended Q1/Q2/unknown-dependency handling |
| Downstream trace | [Retained DOC-05@0.24 diagram source](../evidence/IE-VEV-WS-SCOPE-001/ARCH-VIEW-ACT-004.mmd), [pre-approval rendition review](VEV-2026-09-25-checkin-scope-view-review.md), [policy approval](CHG-2026-09-25-pda-approval-checkin-scope.md), current DOC-05@0.25 and VVP@0.19 |
| Change / supersession | DOC-05 `Draft 0.23 → 0.24`; earlier P06 and Vault views remain unchanged |
| Review trigger | A policy decision about unreserved dependencies, `REQ-WS-006`, required-dependency semantics or `ARCH-VIEW-ACT-004` changes |
| Access / retention | `INTERNAL`; retain with DOC-05 and focused rendition evidence |
| Evidence status | Source correction and author visual QA. Policy acceptance later `APPROVED` in a separate record; implementation and product verification `NOT-RUN` |
| 0.2 amendment | Add the later approval link and exact retained Mermaid source. The original design/rendition result was not reclassified as a product test. |

## Reason and bounded correction

The prior Check-in sequence showed a full scan and atomic publication but did not distinguish
two different decisions when a local file was changed without a Reservation. A related file that
is **not** required by the selected root can be shown as excluded from a newly confirmed scope.
A selected root or required dependency cannot be silently removed from that root's proposed
publication. Architecture input §14 already proposed blocking that case by default, but the
specific branch selection was not visible in DOC-05 and, at the time of this design correction,
had not received a separate Product Decision Authority disposition.

`ARCH-VIEW-ACT-004` now shows unknown dependency scope, both known-scope paths, explicit scope reconfirmation, safe refusal and the
handoff to `ARCH-VIEW-SEQ-002`. Its table and long description make the same distinction without
requiring a reader to infer policy from arrow routing. The selected-root/required-dependency
blocking rule was marked **Draft candidate default** in the pre-approval view. DOC-04 `REQ-WS-006` still controls: an
unreserved changed item is never silently published, and exclusion versus blocking follows an
approved policy.

The Project Reviewer chose the recommended Q1/Q2 handling and agreed that unresolved dependency
scope blocks Check-in while preserving local work on 2026-09-25. The bounded
[DDM/Aras review](../../../../research/2026-09-25-checkin-unreserved-nonrequired-ddm-aras-review.md)
found no evidence that either product performs the exact Q2 sequence of excluding an unrelated,
locally modified file and reconfirming a reduced multi-document Check-in scope. Aras Office
Connector's per-file Claim and local-file prompts are narrower analogies. Q2 is therefore an
explicit IDEA safety choice, not a DDM-parity or Aras-equivalence claim. Reviewer selection did
not itself approve the policy; [IE-CHG-PDA-APPROVAL-003](CHG-2026-09-25-pda-approval-checkin-scope.md)
records the later decision.

## Impact and non-effects

| Area | Disposition |
|---|---|
| Feature / Spec | No new `REQ-*`, changed Feature, or alteration of DOC-04 `REQ-WS-006`. The three branches were subsequently approved under `IE-CHG-PDA-APPROVAL-003`. |
| Architecture | One focused UML-style Activity added to DOC-05. It refuses unknown dependency scope before deciding whether an unreserved file may be excluded. The maintained count becomes 30 DOC-05 views plus four DOC-06 data views. `ARCH-VIEW-SEQ-002` points to this preflight decision and retains transfer/commit authority. |
| Data / Interface / UX | No new persisted record, protocol, screen or permission. Existing scan state and reconfirmation in DOC-08 remain the generic interaction contract; WS-09…11 are the later planned test cases. |
| Security / Operations | An unreserved item never gains publish authority; failed attempts preserve local work and do not end a still-valid Reservation. Release keeps its separate fail-closed gate. |
| Verification | The view has focused source/render/standalone-open/visual evidence in `IE-VEV-WS-SCOPE-001`. Product runtime and `VVP-002/003` execution remain `NOT-RUN`. |
| Planning / gates / authority | No tracker action, P02/P06 result, Tech selection, Product Scope, Q-15, PG3 or PG4 change. Approval belongs to the separate PDA record, not this design record. |

The approved predecessor and this successor's scoped approval are pinned separately; neither is a
runtime test or approval of the whole architecture.
