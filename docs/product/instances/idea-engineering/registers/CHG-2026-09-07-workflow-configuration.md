# IDEA Engineering Workflow Configuration Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-WORKFLOW-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed product direction plus bounded reference-product evidence; planned acceptance, not runtime evidence |
| Access / retention | `INTERNAL`; retain with the affected Feature/Spec/Tech and Core source versions |

## Instruction and decision

Correction point 09 identified that “use the current cross-department workflow and keep it flexible”
was too vague to design or test. The user accepted the following IDEA direction and authorized the
documentation update.

1. Core v0 may retain multiple Workflow Definitions and their versions.
2. Each Document Class has one active default Workflow Definition Version. An explicitly permitted
   alternative may be selected and recorded; there is no floating “latest workflow” at runtime.
3. The seeded Core v0 path is `Start → In Work → Under Review → Released`. Reject or Withdraw may
   return to In Work only through a configured, authorized transition.
4. Configurable content includes states, transitions, eligible roles/groups, required decision
   count/rule, required reason/evidence and notification intent.
5. A Workflow Instance pins the exact Workflow Definition and Approval Policy versions when it
   starts. Later activation affects new instances only. Moving a running instance requires a
   separately authorized, previewed and audited migration.
6. The seeded Approval Policy requires one independent eligible approver. The author/editor cannot
   approve or Release the affected Revision. A later policy may change roles or decision rules only
   through a valid new version.
7. An invalid definition or unresolved mandatory role blocks activation or the affected operation
   and identifies the missing rule/role; the system never silently skips a step or weakens policy.
8. A graphical drag-and-drop Workflow Designer is deferred. Core v0 may use validated configuration
   data or administration forms, while preserving the model/API needed for a future designer.

This resolves correction point 09 at the design/specification level. It does not claim that a
workflow engine or administration screen has been implemented or tested.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.6 → 0.7; FTR-008 now states the configurable multi-workflow boundary without adding a Feature ID. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.8 → 0.9; existing REQ-LC-001/003/005 are clarified and section 8.3 adds WF-01…06. All 68 requirement IDs remain. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.4 → 0.5; existing lifecycle requirements gain default selection, versioning and invalid-configuration behavior. |
| [DOC-05](../DOC-05-architecture-description.md) | Draft 0.4 → 0.5; Lifecycle Governance owns validation, activation, class assignment and pinned runtime instances. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.4 → 0.5; workflow definitions, assignments, instances and decisions have explicit identities and retention rules. |
| [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Draft 0.5 → 0.6; workflow is governed configuration enforced by Server, while the graphical designer remains deferred. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.5 → 0.6; VVP-006/007 gain procedure set `IE-VVP-WORKFLOW-001@0.1`, WF-01…06. All 15 objective identities remain. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record the new versions, retained predecessors, current hashes and review/test limits. |
| DOC-01/02/03/07/08, GOV and accepted ADRs | Unchanged; no additional feature class, roadmap promise or interface claim is introduced. |
| Human/Word/PDF originals and prototype | Unchanged; submitted management documents are not regenerated or overwritten. |
| Spec Kit and implementation | No feature lifecycle or production-code change; no `specs/` or runtime files are edited. |

## Evidence boundary

The project knowledge baseline records that the reference product publicly demonstrates graphical
workflow, configurable workflow types, formal decisions, reject/resubmit and history. Public sources
do not establish its internal definition-version migration, quorum races or transaction model.

The immutable version pin, fail-closed invalid configuration, non-retroactive activation and
post-commit notification rules are IDEA integrity safeguards accepted for this design. They are not
presented as observed implementation details or parity evidence.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-workflow-configuration-decision.zip) contains
the exact nine files below. Archive SHA-256:
`e9a874807c603a64ad433c7a09c5d97aba0b3790f6ca89e2ddeea685769494ba`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.6 | 819a58c5a87a71bd979d14c263234678e41cf3c11d58e4a2d25f1e6ef6ab5c3b |
| SPEC-001-product-specification.md | SPEC-001@0.8 | 2d1eec5c70bd79a175e6f8a1b074487b534ec6a89cb8180c6614a2e6d224d12b |
| TECH-001-technology-and-architecture-proposal.md | TECH-001@0.5 | 7b421b335f2f6f5374b92f8936db968661f6a49f3ae82e2bea343ac21c762c67 |
| DOC-04-software-requirements-specification.md | DOC-04@0.4 | 330de3fcf707c068b5b77bd1ede433ffb78ad964715d77ed906c2135d4d7dd21 |
| DOC-05-architecture-description.md | DOC-05@0.4 | bdab97c1916ea06700984323efbf40f97eed7589cf7a60693454f1537f4346f7 |
| DOC-06-data-integration-and-migration-specification.md | DOC-06@0.4 | c6d2b2aac4447e2f3710049912739b3a0f27af20f7edf487c9235fb5b11c7408 |
| VVP-core-v0-verification-validation-plan.md | VVP@0.5 | 9d45b0a5918246b391d3fefb8f5669feb2d315b4f94dcefaac9b5984fbfe00ca |
| README.md | Pre-change instance catalogue | 99a6f2bbc73a547bdd8a0aa1b072db2b304801bf490dc56a9b9c18a73dc77447 |
| VERSION-HISTORY.md | Pre-change version/source ledger | 3dc334f9c8326eb462715f8de46011acddf07139b2a4851de1bda09dc7e8fe8b |

## Verification scope

Before handoff, check the unchanged 14 FTR, 68 REQ and 15 VVP identity sets; agreement of WF-01…06
between Spec and VVP; source/version links; Markdown structure; and archive entries/hashes. These are
document checks only. Every workflow, authorization, concurrency, notification and product procedure
result remains `NOT-RUN` or `BLOCKED` until executed in an approved environment.
