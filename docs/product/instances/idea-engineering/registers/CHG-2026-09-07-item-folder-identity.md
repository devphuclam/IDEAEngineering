# IDEA Engineering Item, Folder and Copy-Identity Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-ITEM-FOLDER-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed product direction plus bounded `VENDOR-PUBLIC` reference behavior; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with the affected Feature/Spec and Core source versions |

## Instruction and decision

Correction point 11 asked how the reference product treats items, visible names and folders. Public
tutorial evidence separates Store, Move, Rename, Save-As, Reserve and Reference user actions, but
does not reveal internal database keys. The project user confirmed the following IDEA direction and
authorized this documentation update.

1. A Logical Document retains one stable `DocumentId` across name changes, Document Placement
   changes, Generations, Business Revisions and workflow transitions.
2. Document Folders/dividers are organization-owned logical navigation containers. Their hierarchy
   and labels are not physical Artifact-storage or Managed Workspace paths.
3. A Document Placement makes one Logical Document visible in a folder. Moving, linking or unlinking
   a placement creates no new Logical Document, Revision, Version, Generation or file copy.
4. A historical placement link pins the exact selected Business Revision and Generation; it does
   not silently follow a later Working Head.
5. Rename retains `DocumentId`. A navigation-only alias change is audited without a Generation; a
   controlled Product Definition name/title change uses Checkout/Check-in and creates a Generation
   under the normal changed-content rule.
6. Create Copy/Save-As allocates a new `DocumentId`, records the exact source and actor and follows
   normal New/first-publish rules. It does not inherit a source Reservation, Approval or Released state.
7. The owning Server module authorizes and commits these commands. Failure leaves the prior document,
   placement and copy-provenance state unchanged.
8. The behavior is `DDM-aligned` only at the externally observable user-flow level. IDEA does not
   claim or copy DDM source, schema, persistence keys or undocumented protocols.

This resolves correction point 11 at the design/specification level. It does not claim that the
behavior has been implemented, tested or approved by the Product Decision Authority.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [CONTEXT.md](../../../../../CONTEXT.md) | Clarifies Logical Document and adds Document Folder, Document Placement and Create Copy terms. |
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.8 → 0.9; FTR-002 explains Move/Rename/Create Copy without adding a Feature ID. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.10 → 0.11; adds REQ-ID-007…009 and IF-01…06, increasing the requirement set from 68 to 71. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.6 → 0.7; adds three separately verifiable identity/organization/copy obligations and QRS-010. |
| [DOC-05](../DOC-05-architecture-description.md) | Draft 0.6 → 0.7; Controlled Product Data owns Folder/Placement/copy provenance and the atomic command sequence. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.6 → 0.7; adds folder/placement/source-copy identities and DATA-REL-017…019. |
| [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md) | Draft 0.3 → 0.4; specifies visible same-document versus new-document consequences and UX-JRN-011/UX-OBJ-008. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.7 → 0.8; adds procedure set `IE-VVP-ITEM-IDENTITY-001@0.1`, IF-01…06. All results remain `NOT-RUN`. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record successor versions, predecessor preservation, current hashes and review/test limits. |
| [DDM evidence finding](../../../knowledge/2026-09-07-ddm-item-name-folder-identity-evidence.md) | `IE-KNW-DDM-005`; retains vendor-public observations, inferences and runtime unknowns outside Core DOC-01…08. |
| DOC-01/02/03/07, GOV, Tech, accepted ADRs and prototype | Unchanged; no new business need, technology selection, prototype claim or product approval is inferred. |
| Human/Word/PDF originals | Unchanged; already submitted editorial copies are not overwritten or silently regenerated. |
| Spec Kit and implementation | No feature lifecycle or production-code change; no `specs/` or runtime files are edited. |

## Evidence and decision boundary

The source tutorial behavior supports treating Move, Rename and Save-As as distinct user intentions
and treating Reference/placement as a relationship to an existing managed item. The exact DDM
database key, reference pinning, copy transaction and every CAD-link consequence remain unknown.
The IDEA rules above are explicit requirements selected to preserve stable identity, exact history,
safe failure and future storage replacement; they must not be represented as proven DDM internals.

The Product Decision Authority still decides the exact Feature and Spec versions. This internal
confirmation does not satisfy independent requirements, HCD, data, security or runtime review.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-item-folder-identity-decision.zip) contains the exact
ten files below. Archive SHA-256:
`16e1f7f8a879ef0a16b6c41b1222d86935cd8514b2ec678b84d6da86dc9358a9`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| CONTEXT.md | Pre-change domain glossary | 25d57f355258708e530d9de343eba002118de52e9bad4bdabaff9d69fcd282c8 |
| FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.8 | d50e652c6f629816cf0c3216d24816cbda3f82a5ad404dabdd36cd1cfa59e54a |
| SPEC-001-product-specification.md | SPEC-001@0.10 | df039091bf6f65329fc03a7653b6c2210e922583d898075909f77e6387a25ad7 |
| DOC-04-software-requirements-specification.md | DOC-04@0.6 | fa6fc850ead455aee022cdc34eb45199790798c49612b580eda07b0b9fd18acd |
| DOC-05-architecture-description.md | DOC-05@0.6 | 823d58851febd185faf507c5473f70e9bbd56b1ca55d1d7bd903209dab7ad941 |
| DOC-06-data-integration-and-migration-specification.md | DOC-06@0.6 | 729aa1410028a629037c941dbb8f5e567ff6edc5f66b98b0b6d3453cac05882d |
| DOC-08-ui-ux-and-interaction-specification.md | DOC-08@0.3 | 4e1d6b2fc12174ad48502608910bdb2c36633a862da43be0fe89ad44b930e7d8 |
| VVP-core-v0-verification-validation-plan.md | VVP@0.7 | 7e49124f40598020840cc72644c5b098d163546f94e335d357b5031448c93350 |
| README.md | Pre-change instance catalogue | 6bea9fd5e9d353d45b69d8557ad3512a7778a5a7c7003c2e39c875521cd6958e |
| VERSION-HISTORY.md | Pre-change version/source ledger | ae366aab4a7bd404c43cd439c5141f18f32f3cd99a53d6e718ae15de478eac4e |

## Verification scope

Before handoff, check the 14 FTR, 71 REQ and 15 VVP identity sets; IF-01…06 agreement across Spec,
DOC-04/05/06/08 and VVP; local Markdown links; tables/headings; archive entries and recorded hashes;
and the absence of reference-product names in DOC-01…08. These are document checks only. Every
product procedure remains `NOT-RUN` until executed against an approved build and environment.
