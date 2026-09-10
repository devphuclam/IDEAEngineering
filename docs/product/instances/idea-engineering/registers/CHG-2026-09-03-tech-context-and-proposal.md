# Tech Context and Proposal Change Record

## Common control envelope

| Field | Recorded value |
|---|---|
| Stable Record ID | `IE-CHG-TECH-001` |
| Record Class | `CHG` |
| Title | Confirmed operating context and successor Core v0 technology proposal |
| Owner / Authors | Principal Product Author — assistant prepares the documents at the user's request |
| Record Status / Version | `Draft 0.1` |
| Applicable Baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Effective Date | `NOT APPLICABLE` to product implementation until applicable approvals |
| Reviewers | Project user is the internal document reviewer; independent/specialist competence is not established by that role |
| Approvers | Product Decision Authority for Feature, Spec and Tech; decisions remain `NOT-RUN` |
| Source Links | User's Tech-context answers and final “Duyệt” confirmation on 2026-09-03, transcribed below; [primary-source research](../../../../research/2026-09-03-idea-tech-stack-primary-sources.md) |
| Downstream Links | [Instance catalogue](../README.md), [Tech](../decision-briefs/TECH-001-technology-and-architecture-proposal.md), [version history](../decision-briefs/VERSION-HISTORY.md) |
| Evidence / Claim Status | Context confirmed by the user; successor requirements and design are proposals; implementation and operational verification `NOT-RUN` |
| Change History | Initial record of this material context/design change; no earlier version |
| Access Classification | `INTERNAL` |
| Retention Rule | Retain with the affected source/review baselines; exact organizational period `UNKNOWN`, Product Decision Authority to resolve before approval |
| Content State | `AUTHORED DRAFT`; source synchronization does not close product gates |

## 1. Source decision and its limits

The user asked for a justified Tech proposal and supplied the missing company context. “Duyệt”
accepts the consolidated context below and allows documentation preparation. It is **not** a boss
decision selecting a stack, permission to install/deploy, a verified service target, or authorization
to write production code. No independent review is inferred.

| Context ID | User-confirmed planning input | Boundary still open |
|---|---|---|
| `TECH-CTX-001` | Design engineers use Windows PCs. A new company-controlled server may be proposed. System management and technical support handle installation/deployment permission. | Exact Windows versions, server OS, topology and software approvals are not known. |
| `TECH-CTX-002` | Approximately 50–100 intended users at one site. | Total intended users, not measured simultaneous workload or tested capacity. |
| `TECH-CTX-003` | Use native IDEA accounts initially; support other login methods, including company accounts, later. | The existing company account system is bespoke; its integration protocol is unknown. No AD, Entra or OIDC compatibility is assumed. |
| `TECH-CTX-004` | The project user initially administers accounts. Accounts are administrator-issued, without open self-registration. Account administration does not automatically grant document access or approval authority. | Exact account/security policy and formal operational attribution remain to be recorded. |
| `TECH-CTX-005` | Related document sets may total hundreds of MB to GB; the user explicitly lacks a measurement. | Not a maximum individual file, project size, repository capacity or growth rate. |
| `TECH-CTX-006` | The user has operated servers and may initially operate this one; no dedicated DevOps capacity may be assumed. | Preferred server environment, specialist competence, support coverage and long-term owner are unconfirmed. |
| `TECH-CTX-007` | Internal company use. Prefer maintainable technology without license charges where suitable; budget infrastructure, backup and operations separately. Paid components need a justified, approved benefit. | No numeric budget, procurement approval or company license inventory was supplied. |
| `TECH-CTX-008` | Preliminary severe-server-failure recovery objectives: restore within four working hours, with a restored recovery point no more than one hour behind the incident. | Planning objectives only, not a validated SLA. Working-hour clock/coverage, representative restore scope and technical feasibility require qualification. Normal atomic Check-in and local-work preservation are unchanged. |

## 2. Material impact and proposed successors

| Link type / area | Affected authority and proposed version | Change / required evidence | Disposition |
|---|---|---|---|
| `AFFECTS` — vision context | DOC-01 `0.1 → 0.2` | Clarify native-account scope, confirmed operating context and current source/review status; overall product direction and 14-feature boundary unchanged. | Draft |
| `AFFECTS` — feasibility | DOC-02 `0.1 → 0.2` | Replace wholly unknown context with confirmed inputs; compare implementation cost and operational burden without invented measurements. | Draft |
| `AFFECTS` — business need | DOC-03 `0.1 → 0.2` | Add account administration need/scenario and separation rules from `TECH-CTX-003/004`; retain independent product approval. | Draft |
| `AFFECTS` — requirements | DOC-04 `0.1 → 0.2`; Feature `0.3 → 0.4`; Spec `0.4 → 0.5` | Add `REQ-IAM-001…007` under existing FTR-011; qualify recovery objectives and partially resolve context gaps. Preserve the original 61 requirement IDs and all 14 feature IDs. | Successor internal review `NOT-RUN`; prior review does not transfer |
| `AFFECTS` — architecture/interfaces | DOC-05 `0.1 → 0.2`; Tech `0.2 → 0.3` | Replace company-IdP prerequisite with native-account design; compare each technology independently, specify trust/transaction/recovery boundaries and explicit qualification. | Stack selection and architecture review `NOT-RUN` |
| `AFFECTS` — data | DOC-06 `0.1 → 0.2`; domain glossary | Stable Actor/IDEA Account, account status/session invalidation and future login links; no identity merge by email or username; aligned backup scope. | Design Draft; no live data migration |
| `AFFECTS` — interaction/locale | DOC-08 `0.1 → 0.2` | Account provisioning/login/recovery and suspension journeys across applicable surfaces/locales; Desktop/rendered boundary proposal. | Requirements/design only; HTML prototype unchanged |
| `AFFECTS` — roadmap and tests | DOC-07/VVP `0.1 → 0.2` | Account/security foundation before document commands; `VVP-015`, restore timing/consistency and Desktop-bridge checks. | All execution `NOT-RUN`; no delivery dates invented |
| `AFFECTS` — reference coverage | GOV `0.1 → 0.2` | Amend IDEA authentication disposition from mandatory provider integration to framework-managed native accounts first. | Public reference denominator and evidence unchanged |
| `REPAIRS` — contradictory design | DOC-05/Tech | Successful or No Change Check-in ends the confirmed hold, with no retain option in Core v0. Durable private file materialization precedes the atomic database publication; no cross-store transaction claim. | Aligns design with existing DOC-03/04 behavior; does not change that behavior |
| `INTRODUCES` / `MITIGATES` — risks | DOC-05 risk table | Account recovery/impersonation, session revocation, browser/native bridge, single-operator continuity, private-file-store recovery, patches and licensing. | Owned preliminary risks; formal RSK instance/eligible review required before PG4 |
| `VERIFIED-BY` | VVP-003/004/007/009/010/011/013/014/015 | Fault, account isolation/revocation, session/bridge, localized task and timed restore evidence. | NOT-RUN, not satisfied by source review |
| `RELEASED-IN` | DOC-07 `IE-INC-TECH-001` and `IE-INC-READY-001` | Consume successor baselines only after the appropriate Feature/Spec/Tech decisions. | No product release; `REL` not applicable to this authoring change |

The overall product direction, accepted ADRs, constitution, Spec Kit delivery artifacts and
prototype are unchanged. Reviewer fields distinguish the project user's internal document review
from the assistant's author checks and from any required independent/specialist review. This change
does not establish an IDEA requirement from competitor evidence.

## 3. Review and decision record

| Scope | Actor / authority | Evidence and disposition |
|---|---|---|
| Planning context | Project user | Q1–Q8 answers followed by “Duyệt”, 2026-09-03; confirmed as planning input only |
| Previous internal Feature/Spec review | Project user, internal document reviewer | `RVW-FEATURE-SPEC-20260903-001` remains valid only for retained Feature 0.3 / Spec 0.4 content |
| Successor Feature 0.4 / Spec 0.5 / Tech 0.3 | Project user to review; Product Decision Authority later decides | `NOT-RUN`; material additions and technology choices have not been accepted |
| Architecture/security/operations/HCD and locale assessment | Eligible roles not assigned | `BLOCKED`; self-review is not independent evidence |
| Implementation, deployment and product verification | No authorization/result supplied | `NOT-RUN` |

## 4. History, recovery and closure

The exact pre-change bytes of the 16 affected source/index files are retained in the
[pre-Tech source archive](../history/2026-09-03-before-tech-context.zip), using repository-relative
member paths. Archive SHA-256:
`1333d9d578338f475852dd5d329c22046562da6df805ae403b1020c845461c1e`.
Every member was read back and checked against its pre-change SHA-256. Existing historic brief
snapshots remain in place; the archive preserves their source context, not a new approval.

| Item | Rule / evidence | Owner / status |
|---|---|---|
| Document recovery | Consult the archive and original version hashes; any reversal is another explicit successor change, not silent replacement of history. | Principal Product Author |
| Product migration/rollback | No production runtime or database was changed. Future schema/account/bootstrap and release rollback must be planned before PG4. | Future implementation owner; `NOT-RUN` |
| Renditions | No new DOCX/PDF; an older rendition is not the current decision input after this change. | Principal Product Author |
| Source-level closure | [Version history](../decision-briefs/VERSION-HISTORY.md) records exact successor hashes and bounded consistency checks. | Authoring verification only; not product validation |
| Change approval/closure | Record actual user review, boss decisions and required specialist dispositions for the exact successor baseline. | `OPEN`; no approval inferred |

## Contract reference

- [CHG class template](../../../definition/registers/CHG-change-records.md)
