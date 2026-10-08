# Native IAM/RBAC UI Integration — Confirmed Intent and Controlled Refinement

| Field | Value |
|---|---|
| Stable ID / class / version / status | `IE-CHG-IAM-UI-001` / CHG, decision and impact record / `0.5` / Draft review-repair status successor; independent successor acceptance pending |
| Product normativity / process state | INFORMATIVE record of confirmed intent and required baseline refinement / NOT-APPLICABLE |
| Owner / author / worker mode | Project user / Codex, Primary Implementation Worker / CODEX_ONLY |
| Reviewer / acceptance authority | Project Reviewer spec PASS at e227cb1d and DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d via human conversation on 2026-10-07; explicit successor PG2/PG3/PG4 PASS recorded in readiness / whole-feature external review and PG5 pending |
| Baseline / publication / effective date | Main `4e5244430ea89ffe878819e1279f6e05c60d610a` / 2026-10-07 Asia/Ho_Chi_Minh / NOT-APPLICABLE until applicable approval |
| Classification / retention | INTERNAL / retain decisions, predecessor sources and supersession history in Git |
| Upstream | [DOC-04](../DOC-04-software-requirements-specification.md), [DOC-05](../DOC-05-architecture-description.md), [DOC-06](../DOC-06-data-integration-and-migration-specification.md), [DOC-08](../DOC-08-ui-ux-and-interaction-specification.md), [ADR-0012](../../../../adr/0012-use-principal-role-scope-rbac.md), [domain language](../../../../../CONTEXT.md) |
| Downstream / change | [Spec Kit 009](../../../../../specs/009-iam-rbac-ui-integration/spec.md), [source inventory](../../../../../specs/009-iam-rbac-ui-integration/integration-readiness.md), [Issue #46](https://github.com/devphuclam/IDEAEngineering/issues/46) |
| Supersession | No accepted record superseded; UI presentation specs 007/008 remain lineage rather than authoritative integration requirements |
| Review trigger | Role/scope/delegation, credential channel, supported actions or owner-contract changes |
| Evidence | Historical user-confirmed design/read-only source inspection and sections 16–21 retained; current review-repair execution in readiness section 22; no company rollout or independent acceptance claim |
| Standards tailoring | IE-STD-AUTH-001 control/decision rules; STD-INFO-001 and STD-CM-001 STANDARD-GUIDED identity/change accounting, no conformity claim |

## 1. Intent and approval boundary

The user wants the existing account/permission UI connected to actual native IDEA identity, scoped RBAC and Project/Group state. They do not want a standalone mock or only account CRUD. The confirmed presentation is retained where practical.

The user confirmed Q14 on 2026-10-07. At original spec head e227cb1df60e70a1294628b4f153ad50d8f034c6 this recorded preparation, not independent written review. Subsequently the Project Reviewer reported SPEC REVIEW PASS for that exact head and accepted planning, not implementation. Q15 separately confirms inclusion of a narrow console successor-adoption design. No successor PG2/PG3/PG4 or runtime/rollout PASS is inferred.

Current-reading successor, 2026-10-08: explicit PG2/PG3/PG4 and subsequent FAST DELIVERY
execution authority are recorded in [readiness](../../../../../specs/009-iam-rbac-ui-integration/integration-readiness.md).
Account → Project/Group → Assignment → immutable Custom Role → Inspector are engineering-qualified
on the retained original presentation. Final actual-browser/recovery and affected regression
are linked in sections 16–21. Independent review at 73b5d95 recommended FAIL for S1/F1/F2;
the user authorized all three repairs. Section 22 qualifies committed-scope/replay, actual bounded
independent history/ordinary AA+PA+PRA granting, and exact confirmation diff/interval. 92/93 tasks
engineering complete, T093 awaits successor external review. Automated secret detector remains
NOT-PASS with manual canary/private-read dispositions; user's manual PASS is separately reported.
Verifier NOT-RUN.
This does not alter Q14/Q15/30 FR/9 SC or historical gate/review text. No live adoption,
deployment, merge, Issue closure, PG5 or Tracker action is authorized by this publication.

The request does not restart F03/F04/PH1, start a Delivery Card or modify its timer. No new production authority is inferred from an old UI branch/spec labelled F04.

## 2. Confirmed design tree

| ID | Decision / conversational trace | Boundary and rationale |
|---|---|---|
| D01 | Q1/Q3: native IDEA Accounts and actual authoritative fields | No company identity prerequisite or invented email/Department/profile state. Actor remains distinct from Account/login. |
| D02 | Q4: reuse account/inspector and Project/Group/RBAC views; Scope → person within Group → exact Role/version → confirm | Preserve useful presentation; account creation, membership and assignment remain distinct owner commands, not one silently privilege-granting operation. |
| D03 | Q2/Q4: actual Server-owned RBAC and honest outcome | Server establishes Actor/Organization; owner revalidates before commit. No isAdmin, simulated live authority, local security success or content bypass. |
| D04 | Q6: private manual first-setup/reset proof delivery | One-use 15-minute proof; recipient sets password; no automatic email or administrator-known password. Current synthetic delivery does not qualify live use. Password/proof may exist transiently in intended controls/submission; no persistent storage/log/URL/evidence. |
| D05 | Q7: person-filter and Group-principal modes are explicit | Filter mode creates a direct Actor assignment; leaving the filter Group does not remove it. Group mode creates one Group assignment, not N copied user grants. |
| D06 | Q9: one Actor may hold multiple independent roles | Linh may hold AA, PA and PRA independently. Every assignment pins version/scope/assigner/reason; revocation of one does not revoke all other paths. No atomic bulk grant implied. |
| D07 | Q5: supported Custom Role composition and immutable successors | Built-ins protected; permissions are registered owner actions, not scripts/codes invented by administrators. Active successor availability never auto-retargets old assignments. |
| D08 | Q10: explicit scope, Project-specific by default | Several Projects use several assignments. Organization-wide scope requires Role support and grantor authority; no wildcard, folder/Department scope or Organization switching. |
| D09 | Q12: Org-scoped Project Administrator can create Project through explicit permission | Project-only PA cannot create another Project. Super must acquire applicable ordinary authority to create Projects. No implicit creator membership/assignment/content permission. |
| D10 | Q11/Q13: bounded privileged delegation profile | Administrative built-ins are direct-to-Actor in this initial profile; Groups carry business roles. PRA may manage AA/PA/Audit Reader only within delegated limits; effective Super manages Super/PRA with declared permissions. No group/custom-role privilege-equivalence loophole or self-broadening. This is not a universal schema ban on Group principals. |
| D11 | Q14: administrative authority is separate from Project participation | Applicable Project/Group administration does not require the administrator personally to be a Project Member. Engineering participation and Group-derived authority still require applicable membership, permission and owner gates. Creation cannot require membership in a nonexistent Project. |
| D12 | Q8: supported account/RBAC/Project-Group permissions only | Exact catalogue/delegation codes are a next-stage written contract. Unsupported engineering operations and Product Configuration administration remain DESIGN; no fake Checkout/Approval/Release or sample permission is made executable just for a demo. |
| D13 | Q15: narrow console adoption DESIGN | Current effective Super reauthenticates; exact same Actor/Organization receives separate supported Super successor assignment with reason, Access Policy outcome/evidence and Audit. No old-version/grant rewrite, startup/HTTP grant or bootstrap reuse. Approved for inclusion in plan, not execution. |

Q14 was asked because sources establish participation/Project Group membership gates, but not universal membership for every administrator action. No implementation preference was silently turned into that policy.

## 3. Authority cross-check and required refinement

Existing authority already settles multiple roles, Actor/Group principals, positive union, immutable successors, explicit Scope, ordinary administrative assignments, no implicit content authority, constrained delegation and last-Super recovery. References: REQ-AUTH-001…010; REQ-IAM-001…007; ADR-0012; DATA-REL-013…016/025…028/032.

The accepted [PH1 FR-013 clarification](../../../../../specs/005-ph1-foundation-custody/spec.md) also retains bounded Super self-assignment of Account Administrator through its existing assignment permission. D10 does not retrospectively prohibit that qualified behavior, permit arbitrary self-grants or allow a candidate to authorize itself.

Three refinements need their owning baseline/interface recorded before execution:

| Confirmed choice | Current governing gap / location | Required controlled incorporation |
|---|---|---|
| D09 Org-scoped PA Project creation | Project Governance owns Projects, but CONTEXT Project Administrator and IF-PROJECT-ACCESS-ADMIN describe assigned-Project administration; exact creator permission is unpinned under SPEC-OPEN-03. | Distinguish Org create authority, covered descendant administration and Project-only PA. Trace REQ-AUTH-003/009/010; reconcile CONTEXT, DOC-05 interface/implementation concerns, DOC-06 Project/admin interface, DOC-08 actor/journey and catalogue PRJ-1. |
| D10 delegation/principal profile | REQ-AUTH-010/PRA definition authorize constrained non-Super administration; exact initial allowlist/principal/scope configuration is SPEC-OPEN-03. | Pin supported exact versions/permissions and the AA/PA/Audit versus Super/PRA split; keep original versions immutable, Custom Role equivalence checks and effective recovery. Do not create an administrator rank hierarchy. |
| D11 membership applicability | DATA-REL-016/025 distinguish Project participation and active-member Project Groups; every admin action's own membership gate was unspecified. | Record action-specific administrative applicability separately from engineering/Group participation in DOC-05/06/08 and the reviewed Permission/interface catalogue; no general membership bypass for product operations. |

The original e227cb1d publication left Core bytes unchanged. This planning successor incorporates
the refinements into DOC-03@0.8, DOC-04@0.16, DOC-05@0.27, DOC-06@0.19 and DOC-08@0.14,
with corresponding terminology/catalogue changes. Separately verifiable candidate REQ-AUTH-011…014
are owned by DOC-04; original 30 delivery FR/9 SC semantics are unchanged. Exact historical
approval records and their hashes are preserved, not relabelled as approval of these Draft successors.
Project Reviewer accepted this exact written Core/design packet at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d.
That written-design acceptance does not constitute or imply formal PG2/PG3/PG4 or execution approval.

SPEC-OPEN-03/06 remain partially clarified. Document Class, Workflow, Reservation, company/MFA policy, deployment, full product configuration and unrelated support decisions remain outside this resolution.

## 4. Alternatives and architectural treatment

- **Reuse UI with actual owner modules — selected.** Preserves interaction value while qualifying real queries, authority and persistence in vertical slices.
- **Ship UI-only/mock administration — rejected for live use.** Local role arrays or fake sign-in cannot meet attributable authority, current eligibility or Audit obligations.
- **Add a universal generic IAM/configuration platform first — rejected.** No second demonstrated use justifies a new framework, generic policy engine, arbitrary-condition interpreter or speculative multi-tenant protocol.
- **Treat Super as an implicit bypass — rejected.** Contradicts ordinary scoped assignments and hides permissions; supported successors/explicit assignment grants preserve additive evolution.
- **Make administrators members automatically — rejected.** Combines administration with engineering participation and creates unwanted grants; D11 separates the two.

Hard-to-change foundations: stable Actor/principal/scope identity, exact immutable role versions, owner-module state and transaction/evidence fate. Additive later: registered permissions, supported owner actions, exact successor versions and separately reviewed company delivery/identity methods. Domain-specific content/lifecycle gates remain with their future owner. No new architectural framework/ADR is required merely to document this integration.

## 5. Impact and preserved boundaries

| Area | Impact / disposition |
|---|---|
| Requirements and architecture | Scoped candidate refinement above; no implicit product-gate or whole-Core completion |
| IAM / credential / sessions | Reuse accepted behavior; new manual-delivery contract and ambiguous first-setup treatment need qualification; no new session scheme |
| Access Policy / Project Governance | Missing general administration, evaluator/query and Project/Group ownership require reviewed design; not preexisting endpoints |
| Data and migrations | Future additive design must address regrant history, Group/scope representation and narrow app writes; V1–V10 unchanged here |
| UI / UX | Retain reviewed layout; replace simulated authority, fabricated context and false success; confirm consequence and keyboard/focus behavior |
| Verification | Planned real Server/PostgreSQL and actual browser tests, including wrong scope, multi-path access, stale state, revocation-before-commit, evidence failure, proof/privacy and recovery; no execution this step |
| Tooling / licenses | No new package/runtime or inherited process-exception expansion. Future exact tooling/environment envelope must be authorized for this increment. |
| Plans / operations / release | Existing roadmap, actual effort, retained review databases and preview unchanged; deployment/rollout/merge are separate actions |
| Existing accepted evidence | PH1 and API predecessors unchanged; no prior result is relabelled as current qualification |

## 6. Next controlled stage

The written spec is accepted for planning at e227cb1d. Project Reviewer reported DESIGN REVIEW
PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d for the
[plan](../../../../../specs/009-iam-rbac-ui-integration/plan.md),
[exact catalogue](../../../../../specs/009-iam-rbac-ui-integration/contracts/permission-delegation.md),
[operations](../../../../../specs/009-iam-rbac-ui-integration/contracts/operations.md) and
[20-item reviewer checklist](../../../../../specs/009-iam-rbac-ui-integration/checklists/design-review.md).
The 20/20 written-design quality criteria are accepted; the historical author checkbox view is
retained separately. The task predecessor at 16f98e5c6a7c5919bcb29cf74e850215911594e7 has now
received an authorized documentation-only Analyze repair. See the [93-task worklist and ID crosswalk](../../../../../specs/009-iam-rbac-ui-integration/tasks.md)
and [current handoff](../../../../../specs/009-iam-rbac-ui-integration/integration-readiness.md).
Read-only Analyze and explicit applicable gate/target/tooling readiness precede all code/test/schema
writing or runtime setup; current execution remains NOT-RUN.

Current record version 0.3 supersedes current-reading metadata of 0.2/0.1; Git retains original
spec/preparation history. New package source/definition/assignment authority must be accepted,
not assumed from prior PH1 completion. Named owner/security/gate attribution is resolved before
approval/execution. Existing briefs/renditions tied to old Core hashes are stale for these specific
refinements, not rewritten. Runtime/browser/PostgreSQL tests and verifier NOT-RUN; no merge,
execution, deployment or timer action.

## 7. Authorized task/Analyze repair — 2026-10-07

Scope: repair C1/I1/I2/U1/U2/I3/D1/I4 from the author Analyze, as explicitly approved by the user.
Move the gate/Analyze before every implementation/test task; move one evaluator/owner read facts
and shared client state to foundations; make exact Project HTTP, recipient/reissue qualification
and per-slice routes explicit; give inspection adapters a single owner; record actual review lineage.
Retain all 30 FR/9 SC and technical catalogue/data/operation/Web semantics. Renumber tasks and
preserve all 75 old IDs in a crosswalk. No Core requirement, Java, Web, test implementation, SQL,
dependency, tooling, runtime or deployment change. Original author checks/review/execution history
remain attributable. This repair authorization is not production implementation or integration authority.
