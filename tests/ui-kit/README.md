# UI Kit & RBAC Pilot Browser Interaction Runner

This directory contains the browser interaction runner for the UI Kit Foundation and RBAC Pilot (`tests/ui-kit/rbac-pilot-browser.runner.mjs`).

## Purpose & Scope

The browser interaction runner verifies real in-browser execution of the compiled UI Kit and RBAC Pilot application:
1. **Unauthenticated Fail-Closed Boundary**: Proves the UI safely rejects mutation actions, alerts the user, and presents no mutation controls when session context is absent.
2. **Authoritative Catalogue Loading**: Verifies that the Semantic DataTable loads roles, renders classification badges, handles pagination indicators, and enforces fail-closed locking when either Role or Permission catalogue read fails or returns incomplete pagination.
3. **DataTable Keyboard Navigation**: Exercises keyboard events (`Enter`, `ArrowDown`) on table rows to confirm row selection and inspector synchronization.
4. **Overlay Stacking & Keyboard Isolation**: Tests the `overlayStack` under nested overlay conditions (e.g. Discard Dialog open on top of the Candidate Drawer). Confirms that:
   - Only the topmost overlay receives `Escape` and focus-trap keystrokes.
   - The first `Escape` closes only the Dialog, leaving the underlying Drawer interactive.
   - Background layers (`#appRoot`) remain `inert` and `aria-hidden="true"` until all overlays are unmounted.
5. **DOM & Accessibility Contracts**: Checks strict DOM ID uniqueness, `aria-*` attributes, focus preservation, and zero runtime JavaScript exceptions in browser console.
6. **Recovery Limitation on Unresolved Mutations**: Verifies resolution-only behavior and accurate reporting of recovery boundaries when a lost-response mutation commits on the server.

---

## Architectural Note on Authenticated Boundary

> **IMPORTANT**: The HTTP endpoints served by this runner use a mocked authenticated protocol to verify client-side UI integration, DOM contracts, state transitions, accessibility, and fail-closed behaviors under controlled boundary responses.
>
> **A mocked authenticated API is NOT proof of a real Server E2E transaction.**
> Real end-to-end transaction validity is governed exclusively by authoritative IDEA Server integration tests (`com.idea.ddm.access.*ContractTest`) against running PostgreSQL databases, cryptographic token validation, and transactional session management.

---

## Running the Browser Test

Prerequisites:
- Node.js >= 24
- Built frontend distribution (`apps/web/dist`)
- Microsoft Edge or Chromium browser

```bash
# 1. Build web distribution
node apps/web/scripts/build.mjs

# 2. Execute browser interaction runner
node tests/ui-kit/rbac-pilot-browser.runner.mjs
```
