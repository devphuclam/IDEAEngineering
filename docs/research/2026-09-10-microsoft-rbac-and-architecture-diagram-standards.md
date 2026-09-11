# Microsoft RBAC and architecture-diagram standards for IDEA Engineering

| Field | Value |
| --- | --- |
| Finding ID | `IE-RES-RBAC-ARC-001` |
| Date accessed | 2026-09-10 |
| Status | Research finding; creates no approved product requirement or conformity claim |
| Evidence classes | `MICROSOFT-OFFICIAL`, `ISO-OFFICIAL-PUBLIC`, `C4-OFFICIAL`, `OMG-OFFICIAL`, `MERMAID-OFFICIAL`, `W3C-OFFICIAL`, and `IDEA-RECOMMENDATION` |
| Scope | Microsoft RBAC concepts and a diagram policy suitable for `DOC-05` |

## 1. Executive finding

Microsoft's reusable RBAC core is:

```text
Security Principal + Role Definition + Scope = Role Assignment
```

An administrator is therefore not a special account type. A user or group becomes an administrator when it receives an administrator Role Definition at an allowed Scope. This supports many narrowly defined administrator roles without creating a hierarchy of administrator account types.

For `DOC-05`, ISO/IEC/IEEE 42010:2022 should remain the architecture-description basis, C4 should provide the high-level structural views, and UML should describe domain structure and behavior that C4 intentionally does not cover. Mermaid is only a rendering tool; it is not an architecture method or a substitute for a defined viewpoint, legend, traceability, and textual explanation.

## 2. Microsoft RBAC — verified facts

### 2.1 The core model

**Evidence class: `MICROSOFT-OFFICIAL`.**

Microsoft Entra defines a Role Assignment as a Role Definition attached to a Security Principal at a Scope. The principal can be a user, group, or service principal; the Role Definition is a collection of permissions; and Scope constrains the resources on which those permissions apply. Azure RBAC uses the same principal–role–scope assignment shape and also supports managed/workload identities as principals. Sources: [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview) and [Azure role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments).

Access is granted by creating an assignment and revoked by removing it. A Role Definition can be reused in multiple assignments and at different scopes. A role and a user are therefore independent objects; “Administrator” describes an assigned role, not a separate kind of login account.

### 2.2 Built-in and custom roles

**Evidence class: `MICROSOFT-OFFICIAL`.**

Microsoft Entra supports built-in roles with fixed permissions and custom roles managed by the organization. Azure role assignments likewise accept either built-in or custom Role Definitions. A Role Definition is a collection of permitted operations; in Azure, `NotActions`/`NotDataActions` subtract operations from a role's broad allowed set and are not the same as a Deny Assignment. Sources: [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview) and [Azure role definitions](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions).

### 2.3 Scope differs between Azure and Entra

**Evidence class: `MICROSOFT-OFFICIAL`.**

The two RBAC systems share concepts but govern different resource families:

| System | What its roles govern | Official scope examples |
| --- | --- | --- |
| Microsoft Entra RBAC | Directory resources through Microsoft Graph, such as users, groups and applications | Tenant, administrative unit, or a supported Entra resource |
| Azure RBAC | Azure resources through Azure Resource Manager, such as virtual machines and storage | Management group, subscription, resource group, or resource |

Microsoft states that permissions from one system cannot be placed in custom roles of the other. Azure higher scopes can pass role permissions to lower resource scopes. Entra has its own container/resource rules; for example, a role scoped to a group resource governs that group object and does not thereby govern all members of the group. Sources: [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview) and [Azure RBAC scope](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview).

This means IDEA can copy the assignment pattern but must define its own resource hierarchy. Azure's subscription/resource-group hierarchy and Entra's tenant/administrative-unit hierarchy are not IDEA domain objects.

### 2.4 Group-based assignment

**Evidence class: `MICROSOFT-OFFICIAL`.**

Microsoft recommends assigning roles to groups where appropriate because membership changes are easier to administer consistently and audit than many individual role assignments. Entra protects groups that can receive privileged roles: role-assignability is fixed at creation, membership must be explicitly assigned rather than dynamic, and group nesting is not supported for these groups. Microsoft explains that these restrictions reduce unintended privilege elevation through indirect membership. Source: [Use Microsoft Entra groups to manage role assignments](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/groups-concept).

Those exact Entra restrictions are product-specific, but the underlying risk is general: whoever can change membership of a privileged group can indirectly grant the group's roles.

### 2.5 Effective access

**Evidence class: `MICROSOFT-OFFICIAL`.**

For an Entra management request, Microsoft retrieves the Role Assignments applicable directly or through group membership at the target resource, then checks whether an applicable role contains the requested operation. If no applicable role contains it, access is not granted. Azure's `Check access` UI shows assignments at the selected scope and inherited assignments, plus applicable Deny Assignments and eligible/time-bound assignments. Sources: [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview) and [Check access for an Azure resource](https://learn.microsoft.com/en-us/azure/role-based-access-control/check-access).

“Effective access” is therefore a computed result with provenance, not merely a role name stored on a user.

### 2.6 Deny and conditions are different mechanisms

**Evidence class: `MICROSOFT-OFFICIAL`.**

Azure Deny Assignments can block actions even when a Role Assignment grants them. Customers cannot directly create arbitrary Deny Assignments; Azure creates and manages them for specific resource-protection mechanisms. Azure Role Assignment Conditions are optional attribute checks that filter down an existing grant; Microsoft explicitly distinguishes them from explicit deny. Current Azure condition support is also feature/resource-specific rather than a universal rule language. Sources: [Azure Deny Assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments), [Azure ABAC conditions](https://learn.microsoft.com/en-us/azure/role-based-access-control/conditions-overview), and [conditions FAQ](https://learn.microsoft.com/en-us/azure/role-based-access-control/conditions-faq).

Microsoft also supports constrained delegation: a role-assignment administrator can be limited in which roles they may assign, to which principals, and which assignments they may remove. This prevents a delegate from freely granting powerful roles or creating another unconstrained access administrator. Source: [Delegate Azure role-assignment management](https://learn.microsoft.com/en-us/azure/role-based-access-control/delegate-role-assignments-overview).

### 2.7 Least privilege and privileged access

**Evidence class: `MICROSOFT-OFFICIAL`.**

Microsoft recommends the least-privileged role, the smallest sufficient scope, group-based administration where suitable, regular access review, and just-in-time/time-limited privileged activation through PIM for higher-risk environments. Sources: [Microsoft Entra role best practices](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices) and [Azure role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments).

PIM, Conditional Access, access review, Azure Deny Assignments, and Azure ABAC are complementary Microsoft capabilities. They are not all part of the minimal RBAC data model and should not be claimed as automatically present when IDEA adopts RBAC.

## 3. Bounded IDEA recommendation

Everything in this section is **`IDEA-RECOMMENDATION`**. It adapts the verified pattern to the IDEA domain; it is not a claim that Microsoft defines IDEA's data model.

### 3.1 Canonical authorization objects

| IDEA object | Recommended meaning |
| --- | --- |
| `Security Principal` | A User, Project Group, or future Service Account that can receive a role. Login Identity authenticates a user but is not an extra authorization level. |
| `Permission` | One server-recognized operation, such as `document.read`, `document.checkout`, `document.checkin`, `review.approve`, or `roleAssignment.create`. |
| `Role Definition` | A named, reusable collection of Permissions. Built-in definitions are protected; approved custom definitions can be added without changing code. |
| `Scope` | The IDEA resources on which an assignment applies. The initial hierarchy should be explicit, for example System → Project → governed resource collection → individual controlled resource where justified. A folder is not automatically a security scope. |
| `Role Assignment` | The association `Principal + Role Definition + Scope`, with identity, effective period/status, assigner, justification, and audit metadata. |
| `Effective Access` | The server-computed result and every assignment/group path that contributed to it, followed by any independent document-control gate. |

Do not use `Project → Group → Identity → Permission`. A Group is itself a Security Principal. The correct reusable relationship is:

```text
User ──member of──> Group
  │                   │
  └──────────┬────────┘
             ▼
       Role Assignment ──> Role Definition ──contains──> Permission
             │
             └──────────> Scope
```

### 3.2 Administrator model

All administrator types should be Role Definitions, not account types or levels in a hierarchy. The initial catalogue can contain:

| Built-in Role Definition | Responsibility | Recommended default Scope |
| --- | --- | --- |
| Account Administrator | Create, disable, recover and maintain accounts | System |
| Privileged Role Administrator | Maintain protected administrator Role Assignments under a constrained delegation rule | System or an explicitly delegated boundary |
| Product Configuration Administrator | Maintain document types, workflows, numbering, format profiles, Permission catalogue and permitted custom Role Definitions | System |
| Project Access Administrator | Add/remove project membership, maintain project groups, and assign only the approved project roles they are allowed to delegate | Named Project |
| Workflow Administrator | Maintain workflow definitions/assignments where separately delegated | System or named Project |
| Audit Reader | Read/export authorization and configuration history only | System or named Project |
| Emergency Administrator | Recovery-only authority with exceptional monitoring and procedure | System; tightly held |

A person may receive several independent assignments. QLHT can hold `Account Administrator` without document access. The current developer can temporarily hold bootstrap assignments, but “superuser” should not be the normal production path.

For Linh's example:

```text
1. Account Administrator creates Linh's User account.
2. Project Access Administrator for P-100 adds Linh to Project Group “Cơ khí P-100”.
3. That Group has Role Assignment:
   Design Engineer + Scope P-100.
4. Linh receives those permissions only in P-100 through group membership.
```

### 3.3 Required safety boundary

A delegated administrator must not be able to assign every role merely because they can create a Role Assignment. Their own assignment must constrain at least:

- the scopes they can administer;
- the Role Definitions they may assign or remove;
- the principal classes or groups they may manage;
- whether they may manage privileged roles;
- whether they may modify their own assignment.

The default recommendation is that an administrator cannot broaden or alter their own privileged assignment. All membership, Role Definition and Role Assignment changes must be audited with actor, before/after values, time, scope and reason.

### 3.4 Authorization is followed by business gates

RBAC determines whether the actor is eligible to request an operation. It does not replace current document rules. For example, permission to `Check-in` does not bypass Checkout ownership, expected/current Generation, lifecycle state, review freeze, or release-scope completeness. The UI and audit should distinguish:

```text
RBAC: operation is granted at this scope
Business gate: operation is currently blocked because the Revision is Under Review
```

For Core v0, retain additive grants, absence of a grant means no access, and hard server-side business gates. Do not add a general user-authored Deny editor merely to resemble Azure. Record conditions as a future extension seam only after precedence, supported attributes, explanation, testing and migration behavior are specified.

## 4. Architecture-description and diagram evidence

### 4.1 ISO/IEC/IEEE 42010:2022

**Evidence class: `ISO-OFFICIAL-PUBLIC`.**

The ISO public abstract distinguishes an entity's architecture from the Architecture Description that expresses it. The standard addresses the structure and expression of an Architecture Description, architectural concepts and relationships, Architecture Description Frameworks, Architecture Description Languages, viewpoints and model kinds. It does not prescribe an architecting process, method, notation, tool, recording format, or the architecture of the system itself. Source: [ISO/IEC/IEEE 42010:2022 official catalogue](https://www.iso.org/standard/74393.html).

The public abstract is sufficient to justify organizing `DOC-05` around identified stakeholders/concerns and selected views/viewpoints, but it is not sufficient for a clause-level conformity claim. The full licensed 2022 text was not accessed for this note. A public paper from the authors of the predecessor IEEE 1471 explains the historical intent of selecting stakeholders and concerns and constructing views according to documented viewpoints; it is background, not a substitute for the 2022 normative edition. Source: [Introducing IEEE Standard 1471](https://www.iso-architecture.org/ieee1471/wav2001/positions/maier-emery-hilliard.pdf).

### 4.2 C4

**Evidence class: `C4-OFFICIAL`.**

The official C4 site defines hierarchical static views—System Context, Container, Component and Code—and supporting System Landscape, Dynamic and Deployment diagrams. C4 is notation- and tooling-independent. Its author says most teams need only Context and Container views; supporting diagrams should be added when they answer a useful question. Sources: [C4 overview](https://c4model.com/), [C4 diagram set](https://c4model.com/diagrams), [C4 dynamic diagrams](https://c4model.com/diagrams/dynamic), and [C4 deployment diagrams](https://c4model.com/diagrams/deployment).

The official C4 review checklist requires a clear title, diagram type, scope and legend; named/typed elements with understandable responsibilities and technologies where applicable; and directional, labelled relationships with protocols/technology where applicable. Source: [C4 diagram review checklist](https://c4model.com/diagrams/checklist).

C4 focuses on software structure. Its official FAQ recommends supplementing C4 when business process, workflow, state machine, domain model or data model must be shown. It also recommends several smaller focused diagrams over one crowded diagram. Source: [C4 FAQ](https://c4model.com/faq).

### 4.3 UML

**Evidence class: `OMG-OFFICIAL`.**

OMG's current formal UML release is UML 2.5.1. The specification defines common modeling concepts, semantics and human-readable notation for diagram types addressing different aspects of modeled systems. OMG groups UML diagrams into structure, behavior and interaction families; its introductory material lists Class, Component and Deployment diagrams for structure, Use Case/Activity/State Machine for behavior, and Sequence/Communication/Timing/Interaction Overview for interactions. Sources: [UML 2.5.1 specification page](https://www.omg.org/spec/UML), [UML 2.5.1 normative PDF](https://www.omg.org/spec/UML/2.5.1/PDF), and [OMG: What is UML?](https://www.omg.org/uml/what-is-uml.htm).

UML is a modeling language, not a prescribed delivery process. IDEA should use only the diagram types needed to answer controlled architecture questions; “using UML” does not require producing every UML diagram.

### 4.4 Mermaid limitations

**Evidence class: `MERMAID-OFFICIAL`.**

Mermaid can render useful flowchart, class, state and sequence syntax, but its C4 syntax is explicitly experimental; its syntax/properties may change, its C4 style and layout controls are limited, and Legend is listed as unsupported. Mermaid's separate `architecture-beta` syntax is described mainly for services/resources in cloud or CI/CD deployments and should not be mistaken for a complete architecture-description method. Sources: [Mermaid C4 diagrams](https://mermaid.js.org/syntax/c4) and [Mermaid architecture diagrams](https://mermaid.js.org/syntax/architecture).

Mermaid supports `accTitle` and `accDescr`, producing SVG `title`/`desc` relationships. These fields help, but a short embedded description is not enough for a complex architecture diagram. Source: [Mermaid accessibility options](https://mermaid.js.org/config/accessibility.html).

### 4.5 Accessibility and text alternatives

**Evidence class: `W3C-OFFICIAL`.**

WCAG 2.2 Success Criterion 1.1.1 requires non-text content to have a text alternative serving an equivalent purpose. W3C guidance treats architecture diagrams as complex images: provide a short identification and a longer textual representation of the essential relationships/information. Do not rely on color alone, and update the text alternative when the diagram changes. Sources: [Understanding WCAG 2.2 SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) and [W3C complex-images tutorial](https://www.w3.org/WAI/tutorials/images/complex/).

WCAG is directly applicable when the diagram is Web content. Applying the same two-part description to controlled Word/PDF architecture documents is an IDEA documentation recommendation here, not a claim that this note has established WCAG conformance for those formats.

## 5. Recommended `DOC-05` diagram policy

Everything in this section is **`IDEA-RECOMMENDATION`**.

### 5.1 View catalogue

`DOC-05` should begin with a view catalogue. Every diagram entry should record:

| Required field | Purpose |
| --- | --- |
| View ID and title | Stable reference from requirements, ADRs and reviews |
| Question answered | Prevents decorative or unfocused diagrams |
| Stakeholders and concerns | Explains who needs the view and why |
| View type/viewpoint | C4 Context/Container/Component/Deployment or selected UML type |
| Scope and exclusions | Identifies the system/resource boundary and what is intentionally absent |
| Abstraction level | Prevents mixing systems, containers, modules, classes and runtime instances without explanation |
| Status and baseline | `Proposed`, `Accepted`, or `As-built`, with version/date |
| Source/trace links | Related requirements, interfaces, ADRs, risks and verification scenarios |
| Text alternative | Short summary plus a structured long description |

### 5.2 Minimum useful diagram set

| View | Notation | Question it must answer |
| --- | --- | --- |
| System Context | C4 | Who uses IDEA, which external systems exist, and where is the system boundary? |
| Container | C4 | How do Web/Desktop clients, server application, database, file store and isolated format worker divide responsibilities and communicate? |
| Server Module | C4 Component | Which server modules own which behavior/data, and through which interfaces may they collaborate? |
| Deployment and trust boundaries | C4 Deployment | What runs on engineer workstations and servers in each named environment, and where do HTTPS, credentials, files, backup and worker isolation cross boundaries? |
| Controlled-document domain | UML Class | How are Logical Document, Business Revision, Generation, representation, Project and release records related? |
| RBAC domain | UML Class | How are Principal, Group membership, Role Definition, Permission, Scope and Role Assignment related? |
| Lifecycle | UML State Machine | Which states and guarded commands move a Business Revision through In Work, Under Review and Released? Keep Checkout state separate if it has a different lifecycle owner. |
| Critical command interactions | UML Sequence | In what order do authorization, business gates, database transaction, file staging, audit and response occur for Check-in, submit/review/release and role assignment? Use one focused diagram per materially different scenario. |
| Administrative responsibility | UML Activity or clearly labelled swimlane | Who creates accounts, adds Project membership/groups, assigns roles, reviews access and handles recovery? |

The data schema belongs primarily in `DOC-06`; `DOC-05` should reference it rather than duplicate a large ER model. Code/class-level diagrams should be deferred until code exists or generated from the implementation, because hand-maintained low-level diagrams become stale quickly.

### 5.3 Diagram construction rules

1. One diagram answers one principal question; split diagrams that mix unrelated stories.
2. Put the title, view type, scope, baseline/status and legend on or immediately beside the diagram.
3. Name every element, state its type, and add a one-line responsibility. Add technology only where the view requires it.
4. Label every meaningful arrow with an action or information passed; ensure wording agrees with arrow direction. Show protocol and trust-boundary crossing where relevant.
5. Use stable domain terms from `CONTEXT.md`. Expand acronyms at first use.
6. Do not encode meaning by color, icon, line style or position alone. Explain every visual convention in the legend.
7. Do not mix logical modules with processes, deployment nodes or database tables unless the view explicitly marks the different abstraction types.
8. Show ownership and boundaries, not generic boxes such as “Business Logic” or “Service”.
9. Trace decisions and critical relations to requirement/ADR/interface identifiers outside the graphic; do not crowd full requirement prose into the diagram.
10. Keep editable diagram source under configuration control and render it in CI or the controlled document build. A successful Mermaid parse is not a semantic review.
11. Review both source and rendered output at the intended page/screen size. Check overlap, clipped labels, direction, contrast and legibility.
12. Give every complex diagram a short alternative and a nearby structured long description listing purpose, elements, relationships, sequence/conditions and key conclusion.

### 5.4 Review gate for each diagram

A diagram is not ready for baseline until a reviewer can answer “yes” to all of these:

- Is its question, stakeholder, concern, type, scope and abstraction level explicit?
- Can every element, boundary, symbol, color and acronym be understood from the diagram and legend?
- Is every relationship directional and labelled, with protocol/data where relevant?
- Does it agree with the requirements, ADRs, interface contracts and other views?
- Can a reader understand the same essential information from the long text description?
- Was the actual rendered artifact inspected rather than only syntax-checked?

## 6. Source and claim limitations

- Microsoft documentation describes Microsoft products. Only the principal–role–scope assignment pattern and explicitly accepted safeguards should become IDEA requirements.
- Entra RBAC and Azure RBAC are related but separate authorization systems; their roles, resource scopes, inheritance rules, conditions and deny behavior are not interchangeable.
- ISO's public page does not expose the full normative clauses of ISO/IEC/IEEE 42010:2022. Clause-level adoption or conformity requires lawful access, tailoring and recorded evidence.
- C4 is official guidance from its creator, not an ISO/IEC/IEEE or OMG standard and not a substitute for an architecture description.
- OMG defines UML syntax/semantics but not which exact diagram set IDEA must produce; the mapping in section 5 is project tailoring.
- Mermaid rendering support and syntax vary by Mermaid version. Pin the renderer version and do not depend on experimental C4 syntax for a controlled long-lived baseline without an exit/migration plan.
- W3C guidance establishes the Web accessibility basis cited here. Applying it to Word/PDF deliverables requires format-specific authoring and verification; no conformity claim is made in this note.
