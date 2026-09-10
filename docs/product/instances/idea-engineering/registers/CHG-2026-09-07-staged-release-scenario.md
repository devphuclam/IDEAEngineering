# IDEA Engineering Staged Release Scenario Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-STAGED-RELEASE-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; DOC-04 requirements remain Draft 0.3 |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed design clarification; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with the Spec/VVP source versions and subsequent review records |

## Instruction and purpose

While clarifying point 07 of the context-document review, the user confirmed that completed
assemblies may release ahead of unfinished assemblies. The user then authorized the proposed
acceptance scenario with “ok bạn ơi, làm theo bạn đề nghị đi” and asked to continue after interruption.

The scenario uses a completed pump, an unfinished electrical cabinet and their whole-machine parent.
It verifies independent release scope, exact member versions, explicit required dependencies,
commit-time checks, transaction completeness and historical reproduction. This is an application
of existing IDEA requirements, not an assertion that a competitor's runtime behaves identically.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.6 → 0.7; section 8.1 provides the Vietnamese example and SR-01…06, with current VVP pin. All 68 requirement rows remain unchanged. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.3 → 0.4; section 1.2 owns procedure set `IE-VVP-STAGED-RELEASE-001@0.1`, its fixture and expected evidence. The 15 objective identities remain unchanged. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record versions, preserved predecessors, current hashes and downstream references awaiting refresh. |
| DOC-01…08, Feature, Tech and architecture | Unchanged. The cases use `REQ-STR-001…003`, `REQ-LC-006…009`; no new requirement, feature, stack or roadmap commitment. |
| Human/Word/PDF originals and prototype | Unchanged; this update does not regenerate management-facing copies. |
| Spec Kit and implementation | No new feature lifecycle or execution plan; no edits to `specs/`, `.specify/` or production code. |

All product test results remain `NOT-RUN`. The user's confirmation accepts the direction of this
scenario; full review of the authored additions and boss decisions are not implied. No existing
open Spec point or product gate is closed by this update.

## Acceptance coverage

| Cases | Purpose | Existing trace |
|---|---|---|
| SR-01 | Release only the complete pump set; parent and cabinet stay In Work. | REQ-LC-006/007; REQ-STR-001/002 |
| SR-02/03 | Distinguish an unrelated sibling from an explicit required dependency; refuse missing prerequisites and allow eligible exact dependencies. | REQ-STR-001/003; REQ-LC-006/007 |
| SR-04/05 | Revalidate at commit; reject invalid eligibility and prevent partial success. | REQ-LC-006/007 |
| SR-06 | Retrieve identical historical content after cabinet work and a new drawing Revision. | REQ-LC-008/009; REQ-STR-001/002 |

The dependency relation must be present in the fixture. Engineering compatibility is an input
to review; the planned tests do not promise automatic geometric or manufacturing validation.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-staged-release-scenario.zip) contains the exact
four pre-change files below, with paths relative to the repository root. Original Word/Human
copies were not used as mutable inputs. Archive SHA-256:
`2fc794fa7bef620af952a2a7e3dc0b3c6114d36aafcc90d29bcde9ad32849d9e`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| decision-briefs/SPEC-001-product-specification.md | Draft 0.6 | 09190e4079c19df1cd70fc6237431d1180ccb029f21dae84a48e72d0d1d2543b |
| registers/VVP-core-v0-verification-validation-plan.md | Draft 0.3 | 10b4d498c82e379ea0a7dc661e7e28273b69c303a281652f6acebef4318ae2fe |
| README.md | Pre-change instance catalogue | 3d7c78faeb18c80aa985e5b0fd033df17a5ad586a55d36d042cc7c2ace4c4766 |
| decision-briefs/VERSION-HISTORY.md | Pre-change version/source ledger | cd1b54825362f95124fba78d79d386fc447202b70895f70b20bbb490d00b6d54 |

Current output hashes are recorded in VERSION-HISTORY section 7. Relative links in an archived
file refer to the source versions it names, not automatically to newer working files.

## Follow-up references

Feature@0.5 and Tech@0.4 still reference Spec@0.6; Tech and DOC-04/06/08 also reference VVP@0.3.
DOC-05/07 retain old Spec status, and DOC-07 retains the old VVP pin. These references are listed
in the catalogue for refresh when preparing the next decision packet. Existing content and reviews
remain attributable to their original versions; no review is silently transferred.

## Verification scope

Before handoff, check unchanged requirement/objective identities, agreement of the six cases,
Markdown tables/links, source hashes and archive-entry preservation. Record results in the Work
Item. These are document checks; the six product procedures require a future approved build,
dataset and execution record before receiving a result other than `NOT-RUN`.
