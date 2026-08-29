# Controlled Document Workspace UI prototype

> **THROWAWAY PROTOTYPE — NOT PRODUCTION CODE**

This prototype answers one design question: **does one object-centric Engineering Explorer make
identity, lifecycle, permissions, conflicts and release evidence understandable to an internal
reviewer?**

## Open it

Double-click [`controlled-document-workspace.html`](controlled-document-workspace.html). It requires
no server, package installation, database or network connection.

The file contains one UI direction: **Engineering Explorer**. There are no alternate layouts. The
layout keeps the document tree, selected-object details, contextual actions and evidence inspector
visible together so a reviewer can judge the information hierarchy in one pass.

## Applied UI direction

- **Hierarchy:** object identity is the first read; actions follow the selected object's state; evidence
  remains visible in the right rail and expandable state snapshot.
- **Visual system:** Swiss/minimal enterprise treatment from UI UX Pro Max — slate foundation,
  blue action accent, restrained borders/shadows, Fira Sans body text and Fira Code identifiers.
- **Interaction:** SVG line icons, visible keyboard focus, 44px primary targets, explicit disabled-action
  reasons, live status feedback, responsive collapse at tablet/mobile widths, and reduced-motion support.
- **Scope:** this is one decision aid for an internal boss review. It is not a production design system,
  conformance claim or backend implementation.

## Suggested boss-review walkthrough

1. Identify the selected document's Stable Document ID, Business Revision,
   Document Version, Version Sequence and Product Generation.
2. Run the **Happy path** guided walkthrough to move the synthetic record from `Start` through
   independent approval and `Released`.
3. Run **Stale conflict** and confirm that expected/current Generations are visible and local work is
   preserved.
4. Run **Self-approval blocked** and switch between the Author and Independent Approver personas.
5. Open **Executive Review**, record the disposition and any adjustments, and use the browser's
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
`codex/prototype-controlled-document-workspace`. After review, record the chosen direction, retained
elements and unresolved questions. Only the validated decision should be
promoted to `main`; production UI must be rewritten under its own specification, tests and quality
gates.
