# Controlled Document Workspace UI prototype

> **THROWAWAY PROTOTYPE — NOT PRODUCTION CODE**

This prototype answers one design question: **does one object-centric Engineering Explorer make
identity, lifecycle, permissions, conflicts and release evidence understandable to an internal
reviewer?**

## Open it

Double-click [`controlled-document-workspace.html`](controlled-document-workspace.html). It requires
no server, package installation, database or network connection.

The file contains one UI direction: **Engineering Explorer**. There are no alternate layouts. The
layout now follows a familiar item-centric PLM composition: application menu and command bar,
breadcrumb to the selected item, a hierarchical navigator on the left, a tabbed item form in the
center, relationship rows/lifecycle state in the working area, and an evidence inspector on the
right. This is a clean-room information-architecture adaptation; it is not a claim of product
parity or a copy of any vendor UI.

## PLM layout cues carried into the prototype

- **Item form first:** stable identity, revision, version, generation and state are read before
  actions, with Overview / Files / Structure / Lifecycle / Audit tabs for progressive detail.
- **Navigator + relationships:** the same item can be reached from a product tree, a document list,
  or a relationship row without opening a second workspace.
- **Command bar:** Checkout, Check-in, review and release actions stay beside the item. **More actions**
  contains only currently usable lifecycle/recovery commands plus focused views and demo tools;
  Reservation/Open/Generation-writing substeps are not exposed as competing commands.
- **Lifecycle visibility:** the state path `Start → In Work → Under Review → Released` is a visible
  strip, while the right rail keeps edit ownership, the Generation under review and the check result in view.

## Applied UI direction

- **Hierarchy:** object identity is the first read; actions follow the selected object's state; evidence
  remains visible in the right rail and expandable state snapshot.
- **Visual system:** Swiss/minimal enterprise treatment from UI UX Pro Max — slate foundation,
  blue action accent, restrained borders/shadows, Fira Sans body text and Fira Code identifiers.
- **Interaction:** SVG line icons, visible keyboard focus, 44px primary targets, explicit disabled-action
  reasons, live status feedback, responsive collapse at tablet/mobile widths, and reduced-motion support.
- **Scope:** this is one decision aid for an internal boss review. It is not a production design system,
  conformance claim or backend implementation.

## Information ownership policy

The prototype uses one authoritative surface per fact so the PLM composition stays readable:

- **Item header:** title, Stable Document ID, Class, Revision, Version, Generation and current state.
- **Next-action card:** the next permitted step, role prerequisite, gate/conflict explanation and reservation signal.
- **Overview:** only key properties, a lifecycle summary and a relationship count.
- **Files / Structure / Lifecycle / Audit:** each opens in one reusable detail drawer. The drawer body is the
  only scrolling surface for that data type; the Overview remains visible behind it as the stable context.
- **Right rail:** a plain-language control summary, the three latest item audit events and links to Files / Structure;
  it is not a second metadata or audit authority. The recent-audit panel links to the full immutable
  timeline in the Audit drawer.
- **Full properties, State & audit inspector and Guided walkthrough:** stay behind the More actions disclosure.
  Properties use the detail drawer; the state inspector and Guided walkthrough use a modal so their longer
  content does not lengthen the page. The state inspector is a prototype-debug view of in-memory JSON and
  audit events, not an end-user production capability.
- **Navigator and evidence rail:** remain bounded columns on desktop, so a long document tree or growing audit
  list scrolls inside its own rail rather than moving the whole decision viewport.
- **Collapsible hierarchy:** the product root and each document class can be expanded or collapsed independently;
  collapsing a branch hides only its children and keeps the selected item context intact.
- **Narrow screens:** the Navigator and Evidence rail leave the page flow and are opened as focused drawers from
  the compact workspace tools; the item workspace stays the primary surface.

### Scroll and disclosure contract

- The default desktop Overview targets one viewport: identity, next action, key properties, lifecycle summary,
  relationships count and control signals are visible together.
- At shorter desktop widths, the item remains the primary bounded viewport and Navigator/Evidence are disclosed
  through the same focused drawers used on mobile.
- A detail view owns its own vertical scroll. Opening a drawer or modal locks the page behind it, preserves focus,
  closes with `Esc` or the scrim, and restores focus to the launching control.
- At narrow widths, drawers and modals become full-width surfaces and item tabs wrap instead of introducing a
  horizontal page scroll. This is a prototype interaction contract, not an accessibility-conformance claim.

When adding a field, choose its owning surface first. Do not copy the same value into a badge, metric, inspector and
table merely to keep it visible. A contextual reference is allowed only when it helps navigation or explains a decision.

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

- Every synthetic Logical Document can be exercised from its seeded lifecycle state. The records
  differ in Revision, Generation, ownership, workflow and gate outcome so reviewers can inspect
  more than one state without encountering an artificial context-only block.
- All state is in memory and disappears on reload.
- Checkout requests a per-document Reservation and materializes a working copy. Check-in validates
  ownership/staleness and records changed work as an immutable Generation. Check-in does not silently release the Reservation; Reservation
  disposition remains an explicit later decision. These actions, Review, Approve, Reject, Release, conflict
  handling and Create Revision are UI simulations of accepted domain semantics, not a backend implementation.
- Check-in and Release are deliberately separate: Check-in may create the next immutable Generation while
  the Business Revision remains `In Work`; Release occurs only after approval, pins the exact evaluated
  Generation in a Release Record and changes the Revision to `Released` without creating another Generation.
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
