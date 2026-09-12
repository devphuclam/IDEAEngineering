---
status: proposed
date: 2026-09-10
decision-id: IE-ADR-C1-010
---

# Use principal-role-scope RBAC for product and administration authority

IDEA uses one role-based access-control model for engineering actions and administration actions:

`Security Principal + Role Definition + Authorization Scope = Role Assignment`.

A Security Principal is an Actor or Business Group. A Role Definition is a reusable collection of Permissions. An Authorization Scope is the Operating Organization, one Project or one individual governed resource. A Role Assignment joins those three objects and may have an effective period and a supported condition. Group assignment is the normal personnel-management path; direct Actor assignment remains supported, visible and audited.

Built-in Role Definitions are protected. Custom Role Definitions may be added without changing owner-module code; changing an active Custom Role creates and activates an immutable successor version. The successor is available for new Role Assignments, while an existing assignment remains pinned to its exact predecessor version until an authorized replacement is explicitly confirmed and audited. Core v0 combines positive Permissions from all applicable direct and Group assignments. Absence of a grant means blocked, and there is no general administrator-authored explicit-deny rule.

Administrator is not an account type or rank. An Actor becomes an administrator through an ordinary Role Assignment at an explicit Scope. The initial built-in administration roles are Super Administrator, Privileged Role Administrator, Account Administrator, Product Configuration Administrator, Project Administrator and Audit Reader. One Actor may hold several independent assignments.

The RBAC result establishes eligibility to attempt an action. The authoritative resource Module still enforces lifecycle state, Checkout ownership, current Generation, author-review separation, required evidence and Release completeness. An RBAC grant cannot bypass those business gates.

For every protected request, the client presents session proof rather than a trusted `ActorId`. Server/IAM
establishes the `ActorContext`; the resource owner requests authorization with that context, the
Permission, ResourceId, Scope and expected state. Access Policy resolves current IAM eligibility,
Project Membership, Group Membership, Role Assignments, immutable Role Definition versions and Scope
hierarchy itself, then emits an immutable `AuthorizationDecision`. The owner records its separate
`OwnerCommandOutcome` after its business gates and commit-time revalidation. A client-supplied Actor
identity, a prior decision or a granted RBAC result cannot bypass that final owner check.

## Consequences

- Project authority does not carry to another Project merely because a Group or Role has the same name.
- Core v0 does not support Group nesting; an Actor may instead belong directly to several Groups.
- Every immutable Authorization Decision identifies server-established ActorContext, account eligibility, Group membership paths, Role Assignments, Role Definition versions and resolved Scope/conditions. The authoritative owner's separate Command Outcome identifies the correlated business-gate and final command result.
- Access Policy evaluates current authorization evidence itself, while resource owners revalidate authorization and their own expected state at commit time to prevent a time-of-check/time-of-use bypass.
- Activating a Custom Role successor does not silently change anyone's current authority; administrators must preview and explicitly replace affected assignments when migration is intended.
- Removing a membership or Role Assignment affects the next protected request; an existing login session does not preserve lost authority.
- A Project Administrator may assign only the approved roles, principals and Scopes permitted by its own assignment and may not broaden its own privileged authority.
- Only an effective Super Administrator may add or remove Super Administrator, and the system refuses removal of the last effective recovery path.
- Assignment of a privileged role records the actor, principal, role, Scope, effective period, reason and before/after state in Audit.
- Role Assignment conditions use a controlled supported attribute catalogue; arbitrary administrator-authored scripts are not accepted.
- General explicit deny, nested Groups, just-in-time privileged activation and multi-person approval of privileged assignments require later requirements and precedence rules before implementation.
- This pattern is supported by the official-source analysis in [IE-RES-RBAC-ARC-001](../research/2026-09-10-microsoft-rbac-and-architecture-diagram-standards.md); Microsoft product-specific role names, resource hierarchies and permissions are not imported as IDEA domain objects.
- This ADR remains Proposed until the Product Decision Authority decides the corresponding Spec and architecture baseline.
