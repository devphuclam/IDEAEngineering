# IDEA Engineering Architecture Consistency Correction

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ARCH-CORR-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 12-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user confirmed the correction direction. Exact-source review and specialist review remain `NOT-RUN`. |
| Approver | Product Decision Authority for Feature, Spec and Tech as applicable; no decision recorded. |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-04@0.13 remains the normative SRS. |
| Evidence class | Controlled architecture/data/interaction/verification correction; not implementation, test, product approval or technology-selection evidence. |
| Access / retention | `INTERNAL`; retain with the affected sources, earlier CHG records and successor VEV. |

## 1. Reason and non-negotiable guards

The user-approved correction resolves cross-view ownership, authorization, recovery and product-data
inconsistencies found during architecture review. It refines the architecture/data contracts without
adding or changing a DOC-04 requirement, selecting a technology, claiming implementation, or changing
the PG4/PG5 status.

Two guards are mandatory throughout the successor sources and evidence:

1. `ARCH-VIEW-SEC-001` and `ARCH-VIEW-SEQ-011` already exist in DOC-05@0.13. They are **refactored in
   place** in DOC-05@0.14; no duplicate View ID is created.
2. Reservation lifecycle remains exactly `Active → Ended / Expired / Recovered`. `Released` is only a
   Business Revision lifecycle state and must never be emitted, displayed or tested as a Reservation
   terminal status. The older wording in `IE-CHG-WS-SCALE-001@0.2` is retained as historical evidence
   but is superseded for current controlled behavior by this correction and the current DOC-05/DOC-06/
   CONTEXT sources.

## 2. Confirmed correction set

| Area | Corrected direction | Boundary preserved |
|---|---|---|
| Artifact custody | Introduce an explicit Artifact Custody Module for private candidate verification/deduplication, immutable Artifact identity, location/transfer records, server-mediated streaming and verified provider migration. | Controlled Product Data keeps `ArtifactReference` in Generation manifests and remains the owner of Logical Documents, Generations and Working Heads. |
| Use-case transaction coordination | A named Application Use-case Transaction Coordinator sequences only its declared cross-module operation and lifetime of a shared relational unit of work. | It is not an owner of product state, an authorization authority or a generic CRUD API. |
| Atomic outcome evidence | The authoritative owner state, Owner Command Outcome, Audit Evidence and transactional outbox commit atomically in the shared relational unit of work. | Artifact bytes/candidates remain private external custody and are not misrepresented as part of the relational commit. |
| Authorization context | Client provides session proof; Server/IAM establishes ActorContext. The owner asks Access Policy with ActorContext, Permission, ResourceId, Scope and expected state. | A client-supplied `ActorId` is never trusted. |
| Authorization resolution | Access Policy resolves IAM eligibility, Project Membership, Group Membership, Role Assignments, immutable Role Definition versions and Scope hierarchy itself. | A granted Authorization Decision is eligibility only; the owner still applies business gates. |
| Authorization outcome / TOCTOU | Immutable `AuthorizationDecision` is separate from owner `OwnerCommandOutcome`; the owner requests commit-time authorization/state revalidation before commit. | Access Policy never stores the owner's business-gate result or final product command outcome. |
| Workspace transfer and trust boundary | Core v0 transfer is Store → server → Workspace. The existing security view explicitly shows `WebView → Desktop → Workspace → CAD/Office`. | Workspace never receives direct storage-provider credentials or paths; Desktop/WebView boundary remains explicit. |
| Reference condition | Reference condition becomes `LocalIntegrity × ServerFreshness`, with both axes allowed to be `Unknown`. | Unknown, missing/unreadable or out-of-date evidence cannot imply safe conversion or publish; no automatic CAD/Office merge/overwrite/discard. |
| Recovery | Restore enters Restricted Recovery Mode; post-recovery security changes require independent proof, named governed reconciliation and explicit reopen. | No automatic reconciliation claim is made for security changes. |
| Release structure evidence | `ReleaseRecord → 0..* StructurePin`; applicable Release Policy determines which Structure Pins are required. | Every selected/required pin resolves one exact Structure Snapshot; no claim says every Release universally has a structure. |
| Existing diagrams | Refactor `ARCH-VIEW-SEC-001` and `ARCH-VIEW-SEQ-011` in place; correct `ACT-001` action/resource ordering and `SEQ-001` mediation. | View count/identity integrity is checked by the successor VEV. |

## 3. Controlled-source impact

| Source | Successor / treatment | Change and evidence boundary |
|---|---|---|
| `CONTEXT.md` | Current glossary clarified | Adds ActorContext, Authorization Decision, Owner Command Outcome, Artifact Custody/Reference, Reference Condition and Restricted Recovery Mode; corrects Release Record cardinality. |
| ADR-0012 | Proposed ADR clarified | Separates server-established authorization decision from owner outcome and requires commit-time revalidation; its decision status remains Proposed. |
| DOC-04 | Unchanged at `0.13` | No new requirement, product behavior or technology decision is inferred. |
| DOC-05 | `0.13 → 0.14` | Refactors existing views and module/interface/security/sequence contracts; all maintained views require successor source/rendition audit. |
| DOC-06 | `0.13 → 0.14` | Aligns data ownership, exchange/migration/security/recovery contract and two-axis Reference condition. |
| DOC-08 | `0.9 → 0.10` | Aligns visible Reference, transfer, authorization and Release-Pin interaction contracts; no prototype is declared conformant. |
| VVP | `0.13 → 0.14` | Adds the correction-specific verification/audit criteria; all product procedures remain `NOT-RUN`. |
| VEV | New `IE-VEV-ARCH-CORR-001` | Pins the corrected source/render audit. It may record author checks but cannot make VVP-016 or PG4 PASS without qualified review. |
| Earlier CHG/VEV evidence | Retained | Historical sources/results are not overwritten. Earlier `Released`-for-Reservation wording is explicitly superseded for active controlled behavior. |

## 4. Required successor audit and remaining limits

Before PG4 assessment, the successor VEV must re-render and open every DOC-05/DOC-06 Mermaid view,
check unique catalogue IDs, inspect changed views for readability, and perform source/cross-view checks
for the guards in section 1 plus the ownership boundaries in section 2. The audit specifically rejects
an Artifact Custody or Transaction Coordinator diagram/contract that implies broad product-state,
authorization or generic CRUD authority.

This correction does not resolve the still-open technology stack, deployment topology, storage vendor,
security/recovery operating procedure, specialist review, representative usability evidence or any
runtime test. Those remain subject to the existing Feature → Spec → Tech sequence and VVP gates.
