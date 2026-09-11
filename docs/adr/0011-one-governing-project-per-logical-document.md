---
status: proposed
date: 2026-09-10
decision-id: IE-ADR-C1-009
---

# Give each Logical Document one governing Project

Each Logical Document has exactly one Governing Project responsible for its modification, review and Release. Another Project may use an authorized Cross-Project Reference to one exact Released Business Revision and Generation, but it cannot modify the source document. A Project that needs its own variant creates a new Logical Document through Create Copy and retains the source relationship. A future Shared Library may act as a separately governed source scope for reusable documents without introducing shared write ownership.

This avoids conflicting Project memberships, roles, policies and lifecycle authorities on one controlled identity while preserving controlled reuse and exact historical reproduction.

## Consequences

- Every document command resolves the Governing Project before evaluating the Actor's direct and Business-Group Role Assignments at the applicable Authorization Scope.
- A Cross-Project Reference is explicit, attributable and pinned to a Released baseline; it never follows an unqualified latest Generation.
- Permission to work in the consuming Project does not imply access to, or modification authority over, the source document.
- Create Copy allocates a new Logical Document identity and records source provenance.
- Transfer of governing ownership and Shared Library administration require separately specified governed operations before implementation.
- This ADR remains Proposed until the Product Decision Authority reviews the Project-ownership model.
