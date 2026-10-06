# Tasks: Authentication & Session UI (F03-B Alignment)

Input: [spec](spec.md), [plan](plan.md), [prototype](../../prototypes/idea-authentication-preview.html).  
Methodology: **Spec Kit** + **Matt Pocock Skills** (`grilling`, `prototype`, `tdd`) + **Taste Skill** (Anti-Slop v2).

## Phase 1: Setup & Intake

- [x] T001 Intake Taste Skill into `.agents/skills/taste-skill/`, register in manifest, and document intake record in `docs/research/2026-10-03-taste-skill-intake.md`.
- [x] T002 Author feature specification in `specs/007-f03b-login-session-ui/spec.md` with Taste Skill Design Read and Dials (4/3/7).
- [x] T003 Author implementation plan in `specs/007-f03b-login-session-ui/plan.md`.

## Phase 2: Standalone Prototype (Matt Pocock `$prototype`)

- [x] T004 Build standalone 0-dependency interactive prototype in `prototypes/idea-authentication-preview.html` covering all 6 authentication states.
- [x] T005 Present standalone prototype to user/reviewer for visual review and approval before touching web app code (Approved by user on 2026-10-03).

## Phase 3: Environment & Feature Branch

- [x] T006 Create isolated working branch `feat/f03b-login-session-ui` from latest `main`.
- [x] T007 Add missing `"dev": "vite"` and `"preview": "vite preview"` scripts to `apps/web/package.json`.

## Phase 4: Presentational Components (TDD & Anti-Slop)

- [x] T008 Extract design tokens and CSS styles into `apps/web/src/styles/auth.css` adhering to Taste Skill (Deep Charcoal / IDEA Crimson Red / 8px radius).
- [x] T009 TDD `StatusBanner` component (`apps/web/src/components/auth/StatusBanner.tsx`) with tests for neutral, warning, danger states.
- [x] T010 TDD `LoginForm` component (`apps/web/src/components/auth/LoginForm.tsx`) with tests for busy state, WCAG AA labels, and password clearing upon submit.
- [x] T011 TDD `Topbar` and `SessionLanding` components (`apps/web/src/components/auth/SessionLanding.tsx`).

## Phase 5: Standalone Dev Preview & Verification

- [x] T012 Integrate offline Dev Preview mode (e.g. `?dev=true` or dev toggle) in `apps/web/src/App.tsx` so developers can test UI states without running the backend server.
- [x] T013 Verify complete test suite (`npm test`: 13/13 PASS) and build verification (`npm run build`: PASS in 166ms) in `apps/web/`.
- [x] T014 Execute cross-artifact convergence check.
