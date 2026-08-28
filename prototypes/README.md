# Controlled Document Workspace UI prototype

> **THROWAWAY PROTOTYPE — NOT PRODUCTION CODE**

This prototype answers one design question: **which information hierarchy should IDEA Engineering
use for a controlled-document workspace that makes identity, lifecycle, permissions, conflicts and
release evidence understandable to an internal reviewer?**

## Open it

Double-click [`controlled-document-workspace.html`](controlled-document-workspace.html). It requires
no server, package installation, database or network connection.

The same file exposes three structurally different layouts through a query parameter:

- `?variant=A` — Engineering Explorer
- `?variant=B` — Task-first Workspace
- `?variant=C` — Lifecycle Board

Use the floating arrows at the bottom of the page or the keyboard left/right arrow keys to switch
between variants. Arrow keys are ignored while an input, textarea, select or editable element has
focus.

## Suggested boss-review walkthrough

1. Start with Variant A and identify the selected document's Stable Document ID, Business Revision,
   Document Version, Version Sequence and Product Generation.
2. Run the **Happy path** guided walkthrough to move the synthetic record from `Start` through
   independent approval and `Released`.
3. Run **Stale conflict** and confirm that expected/current Generations are visible and local work is
   preserved.
4. Run **Self-approval blocked** and switch between the Author and Independent Approver personas.
5. Compare Variants B and C without resetting the current in-memory state.
6. Open **Executive Review**, record the preferred variant or mix, and use the browser's
   **Print / Save as PDF** command.

## Interaction boundary

- `LD-P100-001` is the only fully interactive Logical Document.
- The other synthetic records provide realistic information density and are read-only context.
- All state is in memory and disappears on reload.
- Reserve, Publish, Review, Approve, Reject, Release, conflict handling and Create Revision are UI
  simulations of accepted domain semantics; they are not a backend implementation.
- The VI/EN/JA switch demonstrates label length, fallback and layout pressure. It is not a complete
  translation review or accessibility-conformance result.
- The prototype uses no real company document, user identity, credential, file, integration or
  production service.

## Capture policy

The prototype belongs on the throwaway branch
`codex/prototype-controlled-document-workspace`. After review, record the chosen variant, retained
elements, rejected alternatives and unresolved questions. Only the validated decision should be
promoted to `main`; production UI must be rewritten under its own specification, tests and quality
gates.
