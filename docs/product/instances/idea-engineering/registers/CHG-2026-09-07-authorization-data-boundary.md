# IDEA Engineering Authorization and Data-Boundary Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-AUTH-DATA-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 07-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Work Item | [PDM document clarification](https://github.com/devphuclam/IDEAEngineering/issues/4) |
| Evidence class | User-confirmed design direction; planned acceptance, not runtime or security evidence |
| Access / retention | `INTERNAL`; retain with the affected Feature/Spec/Tech and Core source versions |

## Instruction and decision

Correction point 10 identified that “make authorization flexible by converting it to JSON or a
database” confuses three different concerns: authenticating an account, deciding product authority,
and transporting/storing configuration. The user accepted the following IDEA direction and
authorized this documentation update.

1. Identity and Accounts establishes the stable Actor, account eligibility, credentials and session.
   It does not by itself decide document, Approval or Release authority.
2. Access Policy evaluates Actor, role/group, resource scope/state and requested action. Each owning
   Server module enforces the final decision; clients, workers and projections are not authority.
3. Authorized administration may change Access Policy without owner-module code changes. A material
   change creates a new immutable version; the active version is never edited in place.
4. Ordinary authority is assigned through groups/roles. Adding or removing a person's Membership is
   the normal personnel-change path and does not require editing each document. A direct Actor grant
   is an exception requiring exact scope/action, reason, start/expiry, authority and Audit.
5. Administration may use a validated form/API. JSON is optional transport for seed/import/export;
   uploading or editing it creates no authority and is not required for Core v0 if the form is enough.
6. An imported candidate identifies schema version, base-policy pin and digest. Server validates its
   structure, references, meaning and proposer/activator authority and shows a diff before activation.
7. Activation is a separate authorized and audited operation under the currently active policy or
   explicit bootstrap authority. A candidate cannot grant the authority required for its own adoption.
8. Invalid, unresolved, stale-base or unauthorized candidates fail atomically and leave the active
   policy and retained decisions unchanged.
9. Web, Desktop, Workspace and workers receive no direct database credential. They cannot bypass the
   owning Server module by changing a JSON file, UI state, login claim or direct-store request.
10. ASP.NET Core Identity and PostgreSQL 18 remain candidate Tech choices awaiting the Product Decision
   Authority. The product-level separation above remains required even if those technologies change.

This resolves correction point 10 at the design/specification level. It does not claim that account,
authorization, administration, database or JSON-import behavior has been implemented or tested.

## Changed sources and preserved boundaries

| Source | Treatment |
|---|---|
| [CONTEXT.md](../../../../../CONTEXT.md) | `Access Policy Version` now explicitly separates account/session identity from product authorization and serialized candidate data. |
| [FEATURE-001](../decision-briefs/FEATURE-001-feature-definition-and-scope.md) | Draft 0.7 → 0.8; FTR-011 states the configurable authorization outcome without adding a Feature ID. |
| [SPEC-001](../decision-briefs/SPEC-001-product-specification.md) | Draft 0.9 → 0.10; existing REQ-GOV-002/005 are clarified and section 8.4 adds AC-01…05. All 68 requirement IDs remain. |
| [DOC-04](../DOC-04-software-requirements-specification.md) | Draft 0.5 → 0.6; existing requirements distinguish Identity, Access Policy, candidate import and activation. |
| [DOC-05](../DOC-05-architecture-description.md) | Draft 0.5 → 0.6; Access Policy owns governed authorization and a narrow policy-administration interface. |
| [DOC-06](../DOC-06-data-integration-and-migration-specification.md) | Draft 0.5 → 0.6; policy candidate, activation and exact history have explicit identities and failure behavior. |
| [TECH-001](../decision-briefs/TECH-001-technology-and-architecture-proposal.md) | Draft 0.6 → 0.7; ASP.NET Core Identity is proposed for accounts while IDEA Access Policy remains the product authorization authority. |
| [VVP](VVP-core-v0-verification-validation-plan.md) | Draft 0.6 → 0.7; VVP-007/011/015 gain procedure set `IE-VVP-AUTH-CONFIG-001@0.1`, AC-01…05. All 15 objective identities remain. |
| [Catalogue](../README.md), [version history](../decision-briefs/VERSION-HISTORY.md) | Record the new versions, retained predecessors, current hashes and review/test limits. |
| DOC-01/02/03/07/08, GOV and accepted ADRs | Unchanged; no new feature class, account provider, authorization product or deployment is approved. |
| Human/Word/PDF originals and prototype | Unchanged; the submitted management documents and source correction report are not regenerated or overwritten. |
| Spec Kit and implementation | No feature lifecycle or production-code change; no `specs/` or runtime files are edited. |

## Evidence and decision boundary

The source PDF asked for future authorization changes to be easy, but its JSON/database wording did
not define a usable permission model. The accepted correction states the required product behavior
without treating a serialization format or database product as the authorization rule.

ASP.NET Core Identity is a candidate implementation for native IDEA accounts. It is not presented as
proof that resource/state/workflow authorization is complete. PostgreSQL is the proposed authoritative
relational store in Tech, but no production database or stack decision has been made. The Product
Decision Authority must decide the exact Feature, Spec and Tech versions before implementation gates
can pass.

## Preserved source versions

[Pre-change archive](../history/2026-09-07-before-authorization-data-boundary-decision.zip) contains
the exact ten files below. Archive SHA-256:
`b5aebbb4fd6ca235ebf7a7035df58d9a984459e2d038bd41dc270fddefc1c010`.

| Archived file | Version / role | SHA-256 |
|---|---|---|
| CONTEXT.md | Pre-change domain glossary | b8f92de6e4fa35c23eea9fc1db6aec69f1c9d5f3a52ce350db21444fbfd20a22 |
| FEATURE-001-feature-definition-and-scope.md | FEATURE-001@0.7 | e5d3d8734398f869e06cb4b5006595ac8e4b1cb879e374db7015d2f08e3c4ee3 |
| SPEC-001-product-specification.md | SPEC-001@0.9 | 2275de031887eb1fca14027ead4251bfaf9b8eaea4513705ae661313c086e97b |
| TECH-001-technology-and-architecture-proposal.md | TECH-001@0.6 | 8856ee413b7a51942a701cbceeaa6194ad394ff478b17ee2b28dc1e50a52b8f6 |
| DOC-04-software-requirements-specification.md | DOC-04@0.5 | 0b476cc748a59816876376275ae75f3958b3014df319c4a5c894c6ae5c060c84 |
| DOC-05-architecture-description.md | DOC-05@0.5 | a14f62f5a78fec35d6a9f97c8c90f4172b2811afc74a44fa16b5b3f650add584 |
| DOC-06-data-integration-and-migration-specification.md | DOC-06@0.5 | b43288fbb268c30e94fb2c8fb22f14fde253e63fba83c3f60331245fc3433bd2 |
| VVP-core-v0-verification-validation-plan.md | VVP@0.6 | 82a432605ccd4fb7f486521a67bb00c941fde984ccf67fd127d9696ba23cfc8b |
| README.md | Pre-change instance catalogue | 5cfb1e8722cfbf9256832e8bd2f3b812e9bc433fed4332a1c8cf790f2957d9f5 |
| VERSION-HISTORY.md | Pre-change version/source ledger | 2425cd163522ec24930ac8ca50aa1dddc85186a550c4e36c34862bf6a845a358 |

## Verification scope

Before handoff, check the unchanged 14 FTR, 68 REQ and 15 VVP identity sets; agreement of AC-01…05
between Spec and VVP; source/version links; Markdown structure; and archive entries/hashes. These are
document checks only. Every account, authorization, database, import, security and product procedure
result remains `NOT-RUN` or `BLOCKED` until executed in an approved environment.
