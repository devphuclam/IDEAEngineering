# IDEA Engineering RBAC and Diagram Governance Re-baseline

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-RBAC-ARCH-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 10-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user confirmed the design direction in discussion; review of the exact successor files remains `NOT-RUN` |
| Approver | Product Decision Authority for Feature, Spec and Tech as applicable; no decision recorded |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001` |
| Evidence class | Controlled requirements/domain/architecture/design change; not implementation, security-test, usability-test or approval evidence |
| Access / retention | `INTERNAL`; retain with affected sources and predecessor history |

## 1. Reason and boundary

The prior draft separated account administration from product-policy administration, but its chain
`Project → Group → Project Role → Identity → Permission Set` created overlapping concepts and left
unclear who adds a person to a Project, who manages a Group and who may delegate an administrative
role. It also allowed diagrams to exist without a stable question, Scope, legend, text alternative or
render-review rule.

The project user confirmed one replacement model:

`Security Principal + Role Definition + Authorization Scope = Role Assignment`.

This change defines that model, separates administration responsibilities, adds atomic software
requirements and planned verification cases, and establishes one controlled architecture-diagram
policy. It does not implement authorization, change the roadmap, modify a prototype or Word/Human
copy, approve Feature/Spec/Tech, assign a production administrator or record any test result.

## 2. Internally confirmed authorization decisions

1. An Actor or Business Group is a Security Principal. Core v0 does not nest Groups.
2. A Role Definition contains stable Permissions. Built-in definitions are protected; changing an
   active Custom Role creates an immutable successor version. Activation makes the successor
   available for new Role Assignments but does not retarget existing assignments; each intended
   replacement is separately previewed, authorized and audited.
3. Authorization Scope is Operating Organization → Project → individual governed resource. Folder,
   department, Document Class and lifecycle state are not Scope levels.
4. A Role Assignment connects exactly one Principal, one exact Role Definition version and one
   Scope. It may have an effective period and a condition from a controlled supported catalogue.
5. Group assignment is the normal personnel path. Direct Actor assignment is supported, visible and
   audited; it is not a separate exception object.
6. Positive Permissions from applicable assignments combine. No applicable grant means blocked;
   Core v0 has no general administrator-authored explicit-deny rule.
7. RBAC grants eligibility only. Lifecycle, Checkout owner/Workspace, expected Generation, review
   independence, required evidence and Release completeness remain owner-Module business gates.
8. Role delegation is constrained by the administrator's allowed Role Definitions, principal
   classes and Scopes and cannot broaden itself.
9. Only an effective Super Administrator may add/remove that highest role, and the last effective
   recovery path cannot be removed.
10. Core v0 records reason and Audit for privileged assignment changes but does not require a second
    approver. Just-in-time activation and multi-person approval remain possible future extensions.

The `Project Role` term remains only as a plain business-facing name for a Role Definition intended
at Project Scope. `Permission Set` and `Direct Grant Exception` are not separately assignable domain
objects.

## 3. Administration responsibility model

| Role Definition | Responsibility | Explicit boundary |
|---|---|---|
| Account Administrator | Create, activate, suspend, recover and maintain Actors, IDEA Accounts and Login Identities. | Cannot create Project/Group membership or product authority by implication. |
| Project Administrator | Manage Project Membership, direct Project Groups and permitted Project Role Assignments inside its assigned Project. | Cannot create accounts, edit system-wide roles, act in another Project or grant an undelegated/admin role. |
| Privileged Role Administrator | Manage permitted non-Super Role Definitions and administrative Role Assignments within delegated Scope. | Cannot grant Super Administrator or broaden its own authority. |
| Product Configuration Administrator | Manage governed document-class, metadata, numbering, Workflow, localization and format configuration. | Cannot create accounts, Groups or RBAC authority by implication. |
| Audit Reader | Read/export authorized Audit and access-decision evidence. | Cannot alter evidence, membership, assignments, configuration or product state. |
| Super Administrator | Bootstrap and recover the highest administration authority. | Not a routine engineering/admin role and grants no product action by implication. |

Example responsibility flow: QLHT creates Linh's account; a Project Administrator at `P-100` adds
Linh to the Project and `Cơ khí P-100`; the Group's `Design Engineer` Role Assignment at Scope
`P-100` contributes Linh's product eligibility. The authoritative product Module still checks its
business gates before changing state.

## 4. Architecture views and diagram standard added

DOC-05 now maintains a view catalogue rather than treating every Mermaid block as an isolated
picture. The catalogue includes:

| View ID | Question |
|---|---|
| `ARCH-VIEW-CTX-001` | Who uses the product and where is its boundary? |
| `ARCH-VIEW-CON-001` | Which executable/data containers exist and what crosses their interfaces? |
| `ARCH-VIEW-DEP-001` | What runs on user/admin devices and in the server trust zone? |
| `ARCH-VIEW-MOD-001` | Which Module owns each authoritative responsibility? |
| `ARCH-VIEW-RBAC-001` | How do Principal, Group, Role Definition, Permission, Scope and Role Assignment relate? |
| `ARCH-VIEW-STATE-001/002` | How do workflow state and Checkout entitlement change independently? |
| `ARCH-VIEW-SEQ-001/002/003` | How do Checkout/Reference, Check-in/conflict and Review/Release execute? |
| `ARCH-VIEW-ACT-001` | Who creates Linh's account and grants P-100 access? |
| `ARCH-VIEW-SEQ-004` | How is Effective Permission evaluated before business gates? |
| `DATA-VIEW-CORE-001` | Which exact identities reproduce a Release? |
| `DATA-VIEW-AUTH-001` | Which records persist account, Project/group and RBAC authority? |

The authoring policy is based on the architecture-description concerns of ISO/IEC/IEEE 42010, C4
abstraction concepts, selected UML model kinds and accessible complex-image guidance. Mermaid is the
editable source format, not the architecture method. Every maintained view requires a stable ID,
question, audience/concern, type, Scope/exclusions, abstraction level, status, trace, legend, labelled
relationships, text alternative, editable source and inspection of the actual rendered result.

Source syntax or balanced code fences cannot by themselves PASS a diagram. Rendered-output
inspection, qualified architecture/security review and accessibility review remain `NOT-RUN`.
Primary-source findings and limitations are in
[IE-RES-RBAC-ARC-001](../../../../research/2026-09-10-microsoft-rbac-and-architecture-diagram-standards.md).

## 5. Controlled-source impact

| Source | Successor | Material change | Current evidence state |
|---|---|---|---|
| `CONTEXT.md` | Current glossary | Adds Principal, Permission, Role Definition, Scope, Role Assignment and the six administrator definitions; marks Permission Set obsolete. | Domain consistency review pending. |
| DOC-01 | 0.5 → 0.6 | Separates administration stakeholders without changing Feature scope. | `Draft`; Feature brief stale. |
| DOC-03 | 0.6 → 0.7 | Replaces the former role/permission chain and adds Project-access/delegation business rules. | `Draft`; internal direction confirmed, authority decision `NOT-RUN`. |
| DOC-04 | 0.11 → 0.12 | Adds `REQ-AUTH-001…010`; requirement ledger becomes 84 IDs. | Structural checks may be run; qualified requirements/security review `NOT-RUN`. |
| DOC-05 | 0.10 → 0.11 | Adds RBAC ownership/interfaces, Linh/P-100 and effective-access views, review-round correction and diagram policy. | `Draft`; render and architecture/security review `NOT-RUN`. |
| DOC-06 | 0.11 → 0.12 | Replaces group-policy grant records with Project, Group, Role Definition/Assignment, Scope and decision records/interfaces. | `Draft`; data/security review `NOT-RUN`. |
| DOC-08 | 0.7 → 0.8 | Defines separate Account, Project, Role/Assignment, Effective Access, Product Configuration and Audit work areas. | Current administration prototype marked `STALE`; successor prototype not created. |
| VVP | 0.11 → 0.12 | Adds `VVP-016`, PA-01…04 and RBAC-01…10; updates account/security/UX coverage. | All procedures `NOT-RUN`. |
| Product architecture input | 0.1 → 0.2 | Aligns Module ownership and invariants; returns the graphical Workflow designer to deferred scope. | `Proposed`; PG3 remains blocked. |
| ADR-0011 | Proposed | One Governing Project per Logical Document. | Product Decision Authority decision `NOT-RUN`. |
| ADR-0012 | Proposed | Principal–role–scope RBAC and constrained administration. | Product Decision Authority decision `NOT-RUN`. |
| Feature/Spec/Tech briefs, DOC-07, GOV, Word/Human copies | Unchanged | Their source pins are stale where applicable; no schedule or submitted editorial copy is rewritten. | Refresh only after current source review and remaining Spec decisions. |

## 6. Remaining decisions and verification

The structural model is no longer open. `SPEC-OPEN-03` still requires the actual Permission catalogue,
contents of seeded product/admin Role Definitions, permitted conditions, delegation matrix, initial
Groups/assignments and related business defaults. Security reviewer/production role holders,
retention/review periods and environment policy remain open under `SPEC-OPEN-06…08`.

Before this change can support an approved Spec/Tech baseline:

- check all current links, versions, requirement IDs, table/fence structure and stale terms;
- review the 84 requirements semantically and for atomicity;
- render and inspect every maintained diagram under `VVP-016`;
- execute PA/RBAC procedures against an exact implementation rather than a prototype alone;
- obtain the required independent/specialist reviews; and
- present refreshed Feature/Spec/Tech briefs that pin the exact accepted sources.

No item above has been represented as a completed test or Product Decision Authority approval.

## 7. Static source checks performed on 10-09-2026

These checks cover document-source integrity only. They are not product verification, specialist
review, rendered-diagram inspection or approval evidence.

| Check | Observed result | Disposition |
|---|---|---|
| Local Markdown links across the 15 in-scope changed/new sources | 0 unresolved targets | `PASS — STATIC` |
| Controlled IDs in DOC-04 | 84 requirement rows / 84 unique IDs; 7 open-point rows / 7 unique IDs | `PASS — STRUCTURAL` |
| Planned VVP identifiers | 16 VVP objectives, 4 PA cases and 10 RBAC cases; each set unique | `PASS — STRUCTURAL`; execution remains `NOT-RUN` |
| Maintained diagram sources | 14 Mermaid blocks, 14 stable diagram labels and 14 unique labels; no unbalanced code fence | `PASS — SOURCE STRUCTURE`; rendering remains `NOT-RUN` |
| Markdown table and source hygiene | 0 inconsistent column-count rows in parsed table runs; 0 merge markers; 0 trailing-whitespace lines; `git diff --check` reports no whitespace error | `PASS — STATIC` |
| Requirement atomicity heuristic | 47 of 84 requirement rows contain more than one `shall` | `REVIEW REQUIRED`; this is a triage signal, not proof that 47 requirements are defective |
| Actual diagram render at intended page/screen size | No local Mermaid CLI renderer was available in the checked environment | `NOT-RUN`; do not infer visual correctness from source parsing |

The remaining semantic, security and architecture reviews and every product-facing procedure retain
their existing `NOT-RUN` or `BLOCKED` state.
