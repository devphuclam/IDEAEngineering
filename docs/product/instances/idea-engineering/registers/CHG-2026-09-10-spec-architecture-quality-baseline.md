# IDEA Engineering Spec and Architecture Quality Re-baseline

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-SPEC-ARCH-QUALITY-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 10-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user requested the higher-standard Spec and clear architecture drawings; review of this exact result is `NOT-RUN` |
| Approver | Product Decision Authority for Feature/Spec/Tech as applicable; no decision recorded |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Evidence class | Controlled document/design change; not implementation, product-test, usability, security or approval evidence |
| Access / retention | `INTERNAL`; retain with the affected sources and predecessor archive |

## 1. Proposed change and boundary

The project user asked to raise the Spec to a defensible requirements standard and to provide clear,
maintainable architecture drawings. The user accepted the proposed approach: separate the normative
SRS/architecture sources from management briefs, preserve accepted product behavior, expose gaps and
trace every architecture view back to owned responsibilities and requirements.

This change therefore:

1. makes DOC-04 the sole normative product SRS and records its tailored ISO/IEC/IEEE 29148:2018
   requirement contract;
2. makes DOC-05 the sole architecture description and records its tailored ISO/IEC/IEEE 42010:2022
   viewpoints/correspondence rule;
3. adds maintained Mermaid views for context, deployment, module authority, lifecycle versus
   Checkout state, Check-in/conflict, review/Release, administration/authorization and core data
   identities;
4. reconciles the already accepted responsibility split: Account Administration owns Actors,
   accounts, Login Identities, Business Groups and membership; PDM Administration defines Access
   Policy, Workflow Roles and governed definitions; each authoritative product Module enforces the
   final action; and
5. marks decision briefs, VVP and planning pins stale instead of pretending that an older review or
   test result applies to the new source versions.

It does **not** add/remove/reprioritize a Feature, add/remove a `REQ-*` identity, approve a Spec or
Tech choice, select a deployment topology, close `SPEC-OPEN-02…08`, change the December schedule or
edit any Human/Word submission.

## 2. Impact analysis

| Area | Successor | Impact and compatibility | Required action / evidence | Status |
|---|---|---|---|---|
| Business requirements | DOC-03 0.5 → 0.6 | Clarifies actors, groups, membership and administration responsibility; business capability remains FTR-011. | Internal requirements review, then Feature brief refresh. | `Draft`; `NOT-RUN` |
| Software requirements | DOC-04 0.10 → 0.11 | Retains 74 IDs; strengthens source authority/quality contract, places SPEC-OPEN-02…08 under SRS ownership and clarifies REQ-GOV-002, REQ-IAM-002/005 without adding authority. | Resolve applicable open values; qualified atomicity/source review; refresh VVP and Spec brief. | `Draft`; `BLOCKED/PENDING` as recorded in DOC-04 |
| Architecture | DOC-05 0.9 → 0.10 | Corrects Module ownership and adds maintainable views/sequences. Candidate technologies and accepted ADRs are unchanged. | Architecture, security and operations review; render/inspect diagrams in the chosen publication tool. | `Draft`; review `NOT-RUN` |
| Data/integration | DOC-06 0.10 → 0.11 | Separates directory/membership, policy and workflow data ownership; adds conceptual ER views. No migration is authorized. | Data model and interface review; later schema/test design. | `Draft`; review `NOT-RUN` |
| UI/UX | DOC-08 0.6 → 0.7 | Separates Account Administration from PDM Administration and links the admin prototype as design evidence. | Representative task/usability/accessibility review; prototype is not conformance evidence. | `Draft`; evidence `NOT-RUN` |
| Decision briefs | FEATURE-001@0.12, SPEC-001@0.14, TECH-001@0.8 | Their pinned detailed sources advanced, so each brief is stale even though its lifecycle status remains Draft. | Create concise successor briefs only after this source set is internally reviewed. | `STALE` |
| Verification / plan | VVP@0.11 and DOC-07@0.5 | Existing IDs/schedule remain, but source pins and account/group/policy separation checks need review. | Refresh trace/procedures; do not change hours or claim test execution without separate evidence. | `STALE`; execution `NOT-RUN` |
| Runtime / release | No implementation or release baseline | No code, database, deployment or user data changes. | None in this change. | `NOT APPLICABLE` |

## 3. Predecessor and successor evidence

The predecessor bytes are retained in
[`history/2026-09-09-before-cross-document-reconciliation.zip`](../history/2026-09-09-before-cross-document-reconciliation.zip)
and identified by the predecessor hashes recorded in
[`IE-CHG-SOURCE-RECON-001`](CHG-2026-09-09-cross-document-reconciliation.md).

| Source | Predecessor SHA-256 | Successor SHA-256 |
|---|---|---|
| DOC-03@0.5 → 0.6 | `31dfd988b1e3ecf0af79e8ee904abcab3574e36fb3ebb22141c854730d8503dc` | `ef2e8ba27d3427f2f145ca03bb40b96921c021d6ed457092ec8a2fa528ee0e1b` |
| DOC-04@0.10 → 0.11 | `a86dc21a49b9f9febef37bac2f74d446d7387202878da22690dd324db1528b67` | `6f60d2b7af4c71f3d42b0ec5d79b85b9e5903d5d89200f0e366d037fb9c164b9` |
| DOC-05@0.9 → 0.10 | `e3912682ecf0f2651f49d448abb1caaf8c91f4ed1bee92e7375cc1d78f8fa142` | `d3422bcfbc0a4b8d8b4839768e9a846d40dbbb07b58aa5985216f578524c045a` |
| DOC-06@0.10 → 0.11 | `c2336c543b23b48b760f1a87ea6a5d088b3ab8d097ceaa2ec14b78d57d78469a` | `6c593e816814a86799175a72a5f7aecbdb5f6af71839554acf95bcbe1890e263` |
| DOC-08@0.6 → 0.7 | `65b19153de0df9be69035300507ee0f3daec1f5805d960b4a8767f3b51f7f753` | `715e9c1d9a8f12452757908edc82a65da2a7bc398d972ac3aef01eefdda9d7bc` |

The successor hashes above identify the final source contents, including each source's link back to
this CHG. The CHG itself and the instance catalogue are intentionally omitted from the hash table.

## 4. Review, approval and rollback

| Item | Rule / evidence | Status |
|---|---|---|
| Internal review | Project user reviews the exact successor source set, including diagram meaning and remaining Spec gaps. | `NOT-RUN` |
| Specialist review | Requirements, architecture, security, data, operations and HCD competence/independence are assigned where the applicable gate requires them. | `BLOCKED` |
| Product decision | The boss receives refreshed Feature/Spec/Tech briefs that pin these sources; a decision names exact versions. | `NOT-RUN` |
| Rollback | Restore the identified predecessor sources; do not reverse selected sentences independently because their ownership/trace changes are coupled. | Available from retained archive/hash; not exercised |
| Runtime rollback | No runtime or production state changed. | `NOT APPLICABLE` |

## 5. Required consistency checks

- 74 unique `REQ-*` rows remain and every row contains the six required ledger fields.
- 14 Feature IDs and seven unresolved Spec points remain; none is silently closed.
- Account Administration, PDM Administration, Business Group, Workflow Role and Access Policy use
  the controlled definitions in `CONTEXT.md` across DOC-03/04/05/06/08.
- Mermaid blocks are structurally closed and every diagram is labeled as conceptual or candidate
  where it does not define an approved implementation.
- Local Markdown links, source versions, stale status, whitespace and merge markers are checked.
- Product, performance, security, usability, restore and DDM-parity results remain `NOT-RUN` unless
  a separate exact-baseline evidence record says otherwise.

## 6. Validation evidence for this Draft

These checks validate document structure only. They do not validate the product, approve the Spec or
approve the architecture.

| Check | Scope and result | Disposition |
|---|---|---|
| Requirement ledger | `PASS`: 74 rows, 74 unique `REQ-*` IDs, six required fields per row and at least one normative `shall` in every obligation. A heuristic found 37 rows with more than one `shall`. | Qualified semantic/atomicity review remains `NOT-RUN`; split only clauses that can be changed or verified independently. |
| Open-decision ownership | `PASS`: DOC-04 contains exactly seven table rows `SPEC-OPEN-02…08`; `SPEC-OPEN-01` is separately identified as resolved with CHG trace. | The seven decisions remain open; structural presence is not resolution. |
| Feature trace vocabulary | `PASS`: 14 unique `FTR-*` IDs exist in the current Feature brief and all 14 referenced from DOC-04 resolve to that set. | Feature brief remains stale and boss decision `NOT-RUN`. |
| Local links | `PASS`: all relative Markdown targets in the instance catalogue, five revised Core sources and this CHG exist at check time. | Re-run after moving, renaming or packaging files. |
| Markdown hygiene | `PASS`: 33 Markdown files in the instance set contain no merge marker or trailing whitespace; the seven revised/index records have consistent table column counts. | This is syntax/hygiene evidence only. |
| Diagram source | `STATIC PASS`: 11 Mermaid blocks have balanced fences and stable view IDs: nine architecture views and two data views. | Visual rendering is `NOT-RUN`; no local Mermaid renderer is installed and no internal architecture was sent to an external rendering service. |
| Product verification | No software/runtime behavior was executed by this change. | All product, performance, security, usability, recovery and parity results remain `NOT-RUN`. |
