# IDEA Engineering Architecture Consistency Correction — Final Micro Correction

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ARCH-CORR-003` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 12-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user approved this correction set. Exact-source review and specialist review remain `NOT-RUN`. |
| Approver | Product Decision Authority for Feature, Spec and Tech as applicable; no decision recorded. |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-04@0.13 remains the normative SRS. Successor of [IE-CHG-ARCH-CORR-002](CHG-2026-09-12-architecture-consistency-correction-002.md). |
| Evidence class | Controlled architecture/data/verification correction; not implementation, test, product approval or technology-selection evidence. |
| Access / retention | `INTERNAL`; retain with the affected sources, predecessor CHG/VEV records and successor VEV. |

## 1. Reason and non-negotiable guards

This final micro correction closes four remaining semantic ownership ambiguities found during the
successor architecture audit. It refines maintained architecture/data contracts without redesigning
the product, adding scope or requirements, selecting technology, claiming implementation, or changing
PG4/PG5 status. The predecessor records and evidence remain immutable historical evidence.

The following guards remain mandatory:

1. `ARCH-VIEW-SEC-001` and `ARCH-VIEW-SEQ-011` already exist in DOC-05 and are updated in place; no
   duplicate View ID is created.
2. Reservation lifecycle remains exactly `Active → Ended / Expired / Recovered`. `Released` belongs
   only to Business Revision and is never a Reservation terminal status.
3. The client supplies session proof only. Server/IAM establishes `ActorContext`; a client-supplied
   `ActorId` is never trusted. Access Policy owns `AuthorizationDecision`, the resource owner owns
   `OwnerCommandOutcome`, and the coordinator owns orchestration only.
4. Artifact Custody owns bytes, candidates, locations, transfers and provider mapping only. Controlled
   Product Data owns Generation-manifest `ArtifactReference` values; Product Structure and Format
   Intelligence own their own Representation metadata and exact ArtifactId/digest pins.
5. Material owner state, its owner outcome, Audit Evidence and applicable outbox remain atomic in the
   declared relational UoW. `Store → Server → Workspace`, `ReleaseRecord → 0..* StructurePin` and
   Restricted Recovery Mode remain unchanged. The IAM eligibility query remains read-only and cannot
   re-enter an IAM mutation handler.

## 2. Confirmed successor correction set

| Area | Previous problem | Corrected rule | Boundary preserved |
|---|---|---|---|
| CPD `ArtifactReference` wording | DOC-06 wording could be read as storing one generic `ArtifactReference` with every Representation manifest. | A CPD `ArtifactReference` is only the Generation-manifest relation/value pinning one exact `ArtifactId`, digest and declared content role. Product Structure BOM metadata and Format Intelligence neutral/CAD/Office metadata may pin exact ArtifactId/digest values in their own records; those are not CPD `ArtifactReference` records. | CPD does not own BOM/Format Representation metadata; Artifact Custody owns only bytes/custody and provider mapping. |
| SEQ-008 refusal ownership | Expected-state and commit-time refusal arrows said Audit appended a refused `OwnerCommandOutcome`. | When an IAM command was invoked, IAM records the refused IAM `OwnerCommandOutcome` in a refusal-evidence UoW; IAM asks Audit to append attributable Audit Evidence, and optional outbox is retained before evidence-only commit. Initial authorization refusal occurs before an IAM state command, so it records Audit evidence only and explicitly creates no IAM outcome. | Audit never creates/owns an `OwnerCommandOutcome`; account mutation/refusal never changes state silently. |
| SEQ-009 refusal/rollback ownership | Failure branches said the coordinator/Audit appended refused owner outcomes, and a rolled-back Structure write could be read as committed. | Case A: Product Structure records its refused outcome when its gate fails before CPD invocation; no CPD outcome is created. Case B: the whole UoW rolls back, then Structure records a rolled-back/refused outcome and CPD records a refused outcome in a separate evidence UoW; Audit records correlated evidence only. Case C: commit-time authorization failure before owner writes has no coordinator-owned outcome; relevant owner outcome is recorded only if a command was invoked, otherwise Audit evidence only. | Owner Module → OwnerCommandOutcome; Audit → AuditEvidence; coordinator orchestrates only. A rolled-back write is never described as committed. |
| BOM Export retained Representation | SEQ-009 returned a BOM Representation after Artifact Custody stored bytes, without Product Structure metadata acceptance. | Product Structure resolves and authorizes the exact snapshot/profile, generates a candidate, asks Artifact Custody to verify/store bytes, revalidates source/profile/business conditions, writes BOM Representation metadata and its owner outcome/Audit/outbox in a Product Structure UoW, and returns a retained Representation only after COMMIT. If metadata acceptance fails, bytes remain private/unreferenced and the UI does not report retained/Current output. | Artifact Custody is not the BOM Representation owner; byte-storage success alone never means accepted Representation. |

## 3. Controlled-source impact

| Source | Successor / treatment | Change and evidence boundary |
|---|---|---|
| `CONTEXT.md` / ADR-0012 | No change required | Existing glossary and RBAC decision already express Generation-manifest Artifact Reference, server-established ActorContext, separate authorization/owner outcomes and owner boundaries. |
| DOC-04 | Unchanged at `0.13` | No requirement, product scope or technology decision changes. |
| DOC-05 | `0.15 → 0.16` | Clarifies Module/interface ownership, updates SEQ-008 refusal evidence, SEQ-009 owner-specific refusal/rollback and BOM export owner-UoW acceptance; no new or duplicate view IDs. |
| DOC-06 | `0.15 → 0.16` | Clarifies CPD versus owner-specific ArtifactId/digest references, BOM/Format ownership and BOM export exchange/data relationships. |
| DOC-08 | `0.11 → 0.12` | BOM Export has a visible candidate/private-versus-retained/Current status boundary: UI reports retained output only after Product Structure owner-UoW commit and reports metadata-refusal candidates as not accepted/unreferenced. No broader UI scope changes. |
| VVP | `0.15 → 0.16` | Adds verification obligations for reference distinction, owner refusal outcomes, rollback disposition and BOM export metadata acceptance. Product procedures remain `NOT-RUN`. |
| VEV | New `IE-VEV-ARCH-CORR-003` | Pins the focused 30-view source/rendition audit and new cross-source checks. It cannot make qualified review, controlled-rendition acceptance or PG4 PASS. |
| Predecessor CHG/VEV | Retained unchanged | `IE-CHG/VEV-ARCH-CORR-001` and `-002`, including their evidence folders, are not overwritten or regenerated. |

## 4. Verification, limits and handoff

The successor VEV inventories and renders all maintained DOC-05/DOC-06 views, opens every standalone
SVG, records source hashes and inspects SEQ-008/009/010 plus related Module/data views. The focused
architecture render/check is mandatory and bounded. The slow full-repository verifier is intentionally
skipped at the user's request; `NOT-RUN` is not a PASS claim.

The correction does not assess implementation, runtime behavior, production deployment, technology
selection, qualified architecture/security/HCD review, controlled-rendition acceptance or PG4. Those
remain `BLOCKED`/`NOT-RUN` under the applicable gate and review records.
