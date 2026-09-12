# IDEA Engineering Architecture Consistency Correction — Successor

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ARCH-CORR-002` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 12-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user confirmed the correction direction. Exact-source review and specialist review remain `NOT-RUN`. |
| Approver | Product Decision Authority for Feature, Spec and Tech as applicable; no decision recorded. |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-04@0.13 remains the normative SRS. Successor of [IE-CHG-ARCH-CORR-001](CHG-2026-09-12-architecture-consistency-correction.md). |
| Evidence class | Controlled architecture/data/interaction/verification correction; not implementation, test, product approval or technology-selection evidence. |
| Access / retention | `INTERNAL`; retain with the affected sources, predecessor CHG/VEV records and successor VEV. |

## 1. Reason and non-negotiable guards

This successor closes the remaining transaction and ownership ambiguities found while preparing the
post-correction audit. It refines the existing architecture/data contracts without adding or changing
a DOC-04 requirement, selecting a technology, claiming implementation, or changing the PG4/PG5
status. The predecessor record and its evidence remain immutable historical evidence.

The following guards remain mandatory:

1. `ARCH-VIEW-SEC-001` and `ARCH-VIEW-SEQ-011` are existing DOC-05 views and are refactored in
   place; no duplicate View ID is created.
2. Reservation lifecycle remains exactly `Active → Ended / Expired / Recovered`. `Released` belongs
   only to Business Revision and is never a Reservation terminal status.
3. The client supplies session proof only. Server/IAM establishes `ActorContext`; a client-supplied
   `ActorId` is never trusted.

## 2. Confirmed successor correction set

| Area | Corrected direction | Boundary preserved |
|---|---|---|
| BOM import transaction | `ARCH-VIEW-SEQ-009` uses a named BOM Import coordinator. It owns only the declared operation and shared relational UoW; Product Structure writes only Structure Snapshot state and Controlled Product Data writes only Generation/Working Head state. Each owner records its own outcome while Audit Evidence/outbox commit atomically. | The coordinator is not a product-state owner, authorization authority or generic CRUD API. Candidate bytes remain private external custody and no partial result is published. |
| Material account mutation | `ARCH-VIEW-SEQ-008` makes IAM state, IAM Owner Command Outcome, material Audit Evidence and applicable outbox one owner-UoW outcome before success. Failed sign-in is an independently auditable path with no authoritative mutation. | Account administration does not confer product access; refusal evidence cannot be mistaken for a successful mutation. |
| Commit-time authorization | `ARCH-VIEW-SEQ-004` and the BOM/account flows show explicit terminal commit-time refusal branches. A refusal rolls back the authoritative write set, records bounded refusal evidence where required and cannot fall through to an owner write or success response. | Access Policy still owns eligibility-only `AuthorizationDecision`; the resource owner owns business gates and final `OwnerCommandOutcome`. |
| IAM query seam | Access Policy reads current IAM eligibility/security version through `IF-IAM-ELIGIBILITY-QUERY`, a narrow read-only logical port. It never re-enters an IAM mutation handler or holds an IAM mutation lock during resolution. | Server/IAM remains the source of ActorContext and account state; this is not a new process/service or a generic IAM facade. |
| Representation acceptance | `ARCH-VIEW-SEQ-010` separates Artifact Custody's immutable byte storage and verified digest from Format Intelligence's authoritative Representation metadata acceptance. The owner UoW records metadata, outcome, Audit and outbox together; metadata failure leaves bytes private/unreferenced. | Artifact Custody does not own Representation metadata, Generation, Working Head or Release state. A stored byte is never automatically `Current`. |
| Module depth | Artifact Custody and the transaction coordinator remain narrow deep modules with explicit seams. Cross-view text, data and interfaces use the same owner vocabulary. | No new God Module, generic repository authority or technology decision is introduced. |

## 3. Controlled-source impact

| Source | Successor / treatment | Change and evidence boundary |
|---|---|---|
| `CONTEXT.md` / ADR-0012 | No new glossary or decision required | Existing ActorContext, Authorization Decision, Owner Command Outcome, Artifact Custody, Reference and recovery vocabulary remains authoritative; ADR status remains Proposed. |
| DOC-04 | Unchanged at `0.13` | No new requirement, product behavior or technology decision is inferred. |
| DOC-05 | `0.14 → 0.15` | Refines MOD-001/interfaces and SEQ-004/008/009/010; retains existing SEC-001/SEQ-011 IDs; no new technology selection. |
| DOC-06 | `0.14 → 0.15` | Aligns data relationships and exchange rows for coordinator UoW, account mutation, IAM query and Representation acceptance. |
| DOC-08 | `0.10 → 0.11` | Refreshes DOC-05/DOC-06 source pins only; no UI behavior or requirement change. |
| VVP | `0.14 → 0.15` | Adds focused checks for the successor boundaries; all product procedures remain `NOT-RUN`. |
| VEV | New `IE-VEV-ARCH-CORR-002` | Pins the successor source/rendition audit. It cannot make VVP-016, PG4 or qualified review PASS. |
| Predecessor CHG/VEV | Retained unchanged | `IE-CHG/VEV-ARCH-CORR-001` and earlier evidence remain historical and are not overwritten. |

## 4. Verification, limits and handoff

The successor VEV must inventory and render all 30 maintained DOC-05/DOC-06 views, open each SVG,
and perform source/cross-view checks for the guards above. The focused render/check may establish
bounded source/rendition results; it is not product verification or qualified architecture/security/
HCD review. The slow full-repository verifier is intentionally omitted for this correction at the
user's request; its omission is not a PASS claim.

PG4, qualified review, controlled-rendition acceptance, technology selection, deployment, security
operations, recovery drills and product behavior evidence remain `BLOCKED`/`NOT-RUN` under the
existing gate records.
