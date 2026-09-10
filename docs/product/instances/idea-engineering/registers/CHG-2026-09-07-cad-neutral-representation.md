# IDEA Engineering CAD Neutral Representation Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-CAD-REP-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed product direction plus bounded vendor-public research; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with the affected Feature/Spec/Tech and Core source versions |

## Instruction and decision

While resolving point 08 of the context-document review, the user asked whether the reference
product converts CAD to PDF itself or uses an intermediate component. Public first-party evidence
shows automatic PDF/neutral-file behavior through named CAD integrations, but does not identify a
vendor-owned renderer, native CAD API, headless server process or third-party service. The user then
accepted the following IDEA direction and authorized the documentation update.

1. IDEA does not assume or build a universal CAD renderer for Core v0.
2. A versioned Format Adapter/worker may invoke a qualified export interface of an installed CAD
   application or an approved standalone converter. Exact application, Adapter, tool, license,
   execution host and prerequisites are declared per Format Capability Profile.
3. When automatic conversion is unavailable or unqualified, an authorized user may export outside
   IDEA and upload the PDF/neutral file manually through the same acceptance boundary.
4. Every Representation pins the exact source Generation and source Artifact digest, records its
   producer versions and output digest, and never replaces the authoritative CAD Artifact.
5. A Representation is `Current` only for its pinned source Generation. After source advance it is
   `Needs update`; it remains historical evidence and is not silently relinked.
6. A versioned Release Policy decides whether a missing, failed or mismatched Representation blocks
   Release or produces a warning. Processing failure preserves the source and authoritative state.
7. Core v0 does not require an in-application add-in. A future add-in is a separately governed
   capability, so the design remains extensible without claiming that it already exists.

This resolves correction point 08 at the design/specification level. It does not close
`SPEC-OPEN-04`: the exact IRONCAD/application versions, export path, license, file corpus, limits and
measured capability remain open and must be qualified before an automatic-support claim.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.5 → 0.6; FTR-013 now presents automatic Adapter and manual-upload paths without adding a Feature ID. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.7 → 0.8; REQ-FMT-002/004/005 are clarified and section 8.2 adds CR-01…05. All 68 requirement IDs remain. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.3 → 0.4; the same existing REQ-FMT identities gain execution-mode, provenance, freshness and policy behavior. |
| [DOC-05](../DOC-05-architecture-description.md) | Draft 0.3 → 0.4; Format Intelligence and `IF-FORMAT-JOB` own the replaceable Adapter/worker boundary. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.3 → 0.4; Representation identity, producer provenance, `Current`/`Needs update` and policy semantics are explicit. |
| [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Draft 0.4 → 0.5; proposes per-CAD Adapter/worker plus manual fallback and records remaining license/runtime decisions. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.4 → 0.5; VVP-008 gains procedure set `IE-VVP-CAD-REP-001@0.1`, CR-01…05. All 15 objective identities remain. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record the new versions, retained predecessors, current hashes and review/test limits. |
| DOC-01/02/03/07/08, GOV and accepted ADRs | Unchanged; existing product boundary and roadmap tasks already permit per-format qualification. |
| Human/Word/PDF originals and prototype | Unchanged; submitted management documents are not regenerated or overwritten. |
| Spec Kit and implementation | No feature lifecycle or production-code change; no `specs/` or runtime files are edited. |

## Evidence boundary

The bounded finding is recorded in
[IE-KNW-DDM-004](../../../knowledge/2026-09-07-ddm-cad-neutral-representation-evidence.md).
It permits the statement that the reference product demonstrates automatic PDF/neutral generation
associated with managed CAD records and regeneration on CAD Save. It does not permit a claim that
the reference product owns a universal renderer, pins every PDF to an exact source version, exposes
every stale state or blocks Release on a PDF/source mismatch.

The source-Generation/digest rule, `Needs update` status and policy-controlled Release behavior are
IDEA integrity safeguards accepted for this design. They are not relabeled as demonstrated parity.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-cad-neutral-representation-decision.zip) contains
the exact nine files below with paths relative to the IDEA instance directory. Archive SHA-256:
`2806a79f82b96ecfba25552b1d7a37bf27018f35c606d0d803f876a8ce1b9419`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| decision-briefs/FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.5 | a9dde0ee7732ab8dc600780095cde97c599b69f6db3974025e17a2b2d15d346c |
| decision-briefs/SPEC-001-product-specification.md | SPEC-001@0.7 | 32a006be0d986671479f78eb1c21aca55f36855f0aad244c9aacba2af8e093eb |
| decision-briefs/TECH-001-technology-and-architecture-proposal.md | TECH-001@0.4 | c07a2c4324558f749ead9c217709e033413739b71161cbcb810f782ef18ea72d |
| DOC-04-software-requirements-specification.md | DOC-04@0.3 | 17a1b3791f8f925bee8cf7ed6ac7f3d5cfc6b57163f400ecca272360fe7f93f3 |
| DOC-05-architecture-description.md | DOC-05@0.3 | b87fe1230ac7675a147f67dc633d62d0394f3436493cabcf941e7f5f19dcf2fe |
| DOC-06-data-integration-and-migration-specification.md | DOC-06@0.3 | 67c900858564710cf5f631de5f2a59b604b58117580cc8127dcdb592d604f10b |
| registers/VVP-core-v0-verification-validation-plan.md | VVP@0.4 | c28ea6238e30877e58e123e3f0d08987c2948ae42420521cf101bf4540bce298 |
| README.md | Pre-change instance catalogue | 45febd10414aee2cd295b2966dd6f49ab7fb394a752661730ce6ba5719c8d216 |
| decision-briefs/VERSION-HISTORY.md | Pre-change version/source ledger | 8c4a65e21f333d17e4e58623dd40e43a07d0e8792a6cf7670a82a02d99ca9360 |

## Verification scope

Before handoff, check the unchanged 14 FTR, 68 REQ and 15 VVP identity sets; agreement of CR-01…05
between Spec and VVP; version/source links; Markdown structure; and archive entries/hashes. These are
document checks only. Every CAD, converter, license, Release-policy and product procedure result
remains `NOT-RUN` or `BLOCKED` until executed in an approved environment.
