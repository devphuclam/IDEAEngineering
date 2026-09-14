# Post-pull Document and Diagram Review Corrections

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-DOC-REVIEW-001` |
| Supporting class / version / status | `CHG` / `0.2` / `Draft` |
| Date | 2026-09-14 |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Project user requested the corrections; independent architecture/security review and Product Decision Authority acceptance `NOT-RUN` |
| Product normativity | `INFORMATIVE`; no FTR, REQ, product permission or Tech decision created |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; starting `main` commit `43c14ba4375ccf1e56f2dca85fcb1d3793f23a9e` |
| Source / upstream trace | [DOC-04@0.13](../DOC-04-software-requirements-specification.md), [DOC-03@0.7](../DOC-03-business-requirements.md), [CONTEXT](../../../../../CONTEXT.md), [prior architecture audit](VEV-2026-09-12-architecture-consistency-correction-003.md), [authoring standard](../../../../agents/product-document-authoring-standard.md) |
| Downstream trace | [DOC-05@0.20](../DOC-05-architecture-description.md), [DOC-07@0.8](../DOC-07-mvp-roadmap-and-delivery-plan.md), six controlled research notes, [current architecture rendition](VEV-2026-09-14-module-authority-view-legibility.md), [catalogue](../README.md) |
| Access / retention | `INTERNAL`; retain with predecessor source hashes and successor rendition |
| Supersession / review trigger | Version 0.2 retains the 0.1 corrections and adds a legibility-only successor rendition for `ARCH-VIEW-MOD-001`. Revisit if protected-command, RBAC ownership or Module boundaries change. |
| Evidence status | Documentation correction only; product verification, qualified review and gate decisions remain `NOT-RUN` or `BLOCKED` as previously recorded. |

## 1. Disposition

The maintained Review/Release sequence now shows that Submit and Approve/Reject are separate
protected Lifecycle commands. Each uses Server-established actor context, current RBAC evaluation,
commit-time revalidation, Lifecycle-owned accepted or refused command outcome, and attributable
Audit Evidence. The Account/Project administration activity now identifies the Project
Administrator as the requester of a missing Group Role Assignment, subject to delegation checks;
Access Policy does not decide to create an assignment by itself. The ambiguous word “hold” is
replaced with `Reservation` for Checkout edit entitlement and “pending result” for uncertain
operation handling. These are architecture-expression corrections, not new behavior.

DOC-07 now routes the current source set directly and records that DOC-04@0.13 contains 87
requirements. Its 56 tasks, 756-hour estimate, December horizon, gate states and planning
assumptions are unchanged. The three existing decision briefs remain Draft; stale source pins are
not silently treated as reviewed or approved.

Six admitted technology/competitor research notes gain stable IDs, Draft versions, owner/reviewer
state, evidence dates, source/downstream links, predecessor hashes and explicit control tailoring.
Their underlying claims and dated source boundaries are unchanged.

After management review exposed overlapping edge labels in `ARCH-VIEW-MOD-001`, DOC-05@0.20
replaces that dense arrow graph with a scoped C4 Component Diagram. The view now declares its model
kind, purpose, audience, scope, exclusions and notation before showing the logical Modules inside one
IDEA Server and only their principal permitted dependencies. Detailed ownership remains in the
existing Module table; administrator responsibilities and runtime behaviour remain in their dedicated
activity and sequence views. The ownership rules are unchanged; this correction removes mixed
concerns rather than creating a new Module, permission, workflow or technology decision.

## 2. Predecessor source pins

| Source | Before | After / treatment |
|---|---|---|
| DOC-05 | `Draft 0.18`; raw SHA-256 `8b30359419387d0b1dc2904df9800ea2f3fa29053b50db9d4a7c9be3ef3e5f44` | `Draft 0.19`; two maintained views and terminology corrected. Exact successor SHA and rendition are in `IE-VEV-ARCH-CORR-004`. |
| DOC-05 module-view presentation | `Draft 0.19`; rendered working-copy SHA-256 `34c085c6d02b0019a7fdf0a251b1d21aef54e38659fe4552a3e4c3c4b1609843` | `Draft 0.20`; `ARCH-VIEW-MOD-001` only is redrawn as a scoped C4 Component Diagram. Exact successor SHA and rendition are in `IE-VEV-ARCH-CORR-005`. |
| DOC-06 | `Draft 0.16`; raw SHA-256 `11db41f439cb801fc510ac1f959340d1435df5e25d8096862bb05169c76c9a93` | Unchanged data contracts; exact source included in the successor rendition manifest. |
| DOC-07 | `Draft 0.7`; raw SHA-256 `85a4023ec808850f180973e467fc0230ef987b0244a30f913ad7fc8ba1a53d6d` | `Draft 0.8`; routing/count/status correction only. |
| Earlier VEV-003 source pins | DOC-05 `ea071acf…`; DOC-06 `50be6ed1…` | The pinned byte streams cannot be reproduced from the committed starting baseline, and VEV-003 remains historical. A new exact-source record supersedes it for current use without rewriting its asserted result. |
| VEV-VIEW-001 SVGs | Seven standalone SVGs contain HTML `<br>` elements that are invalid as XML. | Only those seven files receive a mechanical `<br>` → `<br/>` repair. Their original bytes remain in starting Git commit; the historical render manifest is not rewritten. A separate repair manifest records old/new hashes and XML-open status. |

## 3. Decision and evidence boundary

No acceptance is inferred for Feature, Spec or Tech. The current TECH-001@0.11 text still pins
earlier DOC-05/DOC-07 versions and requires a controlled refresh before presentation; FEATURE-001
and SPEC-001 were already stale. The administration prototype and BOM interaction evidence remain
separate open work under DOC-08. A generated SVG or successful source parse is not independent
architecture review or product implementation evidence. The full repository verifier was not run
at the project user's request; only focused source/rendition and Git hygiene checks may be reported.
