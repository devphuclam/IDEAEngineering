# Implementation Plan: Authentication & Session UI (F03-B Alignment)

**Branch**: `feat/f03b-login-session-ui` | **Date**: 2026-10-03 | **Spec**: [spec.md](spec.md)

## Summary

Deliver a trustworthy, high-density, anti-slop user interface for F03-B Authentication and Session Context aligned with Codex's verified backend baseline (`/api/v1/identity/*`). 
Execution follows the mandatory combination of **Spec Kit** + **Matt Pocock Skills** (`grilling`, `prototype`, `tdd`) + **Taste Skill** (anti-slop v2).
A 0-dependency standalone prototype is delivered first in `prototypes/idea-authentication-preview.html` for human visual review. Upon approval, implement reusable presentational React components in `apps/web/` with 100% test coverage and zero new npm dependencies.

## Technical Context

- **Platform / Runtime**: React 19.x, TypeScript 5.7+, Vite 6.x in `apps/web/`.
- **CSS / Styling Architecture**: Vanilla CSS / CSS Modules utilizing semantic design tokens inspired by Taste Skill / Tailwind Slate palette. Zero Tailwind npm package installed, zero external CSS dependencies added.
- **Taste Skill Design Read**:
  - *Reading*: Industrial Engineering Authentication & Session Context for Mechanical CAD Engineers & PDM Administrators. Uncompromising, trustworthy, Swiss/Linear-style enterprise language.
  - *Dials*: `VARIANCE: 4`, `MOTION: 3`, `DENSITY: 7`.
  - *Palette*: Deep Canvas (`#0b1329`), Slate Surface (`#ffffff`, `#f8fafc`), Border (`#e2e8f0`), Focus Ring (`#2563eb`), Text Ink (`#0f172a`, `#475569`).
  - *Anti-Slop*: No purple/mesh gradients, no em-dashes in copy, strict 8px radius (`var(--radius)`), WCAG AA (>= 4.5:1) contrast.
- **Backend Seam / Contracts**:
  - `GET /api/v1/identity/csrf` (Header name + Token stored in memory only).
  - `POST /api/v1/identity/login` (`application/x-www-form-urlencoded`, `username`, `password`, CSRF header).
  - `GET /api/v1/identity/session` (`{ actorId: string, accountId: string }`, 401 if anonymous).
  - `POST /api/v1/identity/logout` (CSRF header, 204 No Content).
  - Cookie: `IDEA_SESSION` (managed exclusively by browser / backend with `HttpOnly; Secure; SameSite=Strict`).
- **Dev Preview Offline Mode**:
  - The UI must support a standalone dev preview mode (e.g. `?dev=true` or dev toolbar) so the web app can run and render all states in `npm run dev` even when the Java/PostgreSQL backend is stopped.
- **Role Isolation**:
  - Gemini: Presentational UI components, visual styling, client feedback states, DOM-level password clearing on submit, Vitest test suite.
  - Codex: Spring Boot endpoints, PostgreSQL IAM schema, password hashing, session expiration, cryptography.

## Constitution & Boundary Check

1. **Anti-Slop & Quality**: All visual components adhere to Taste Skill v2 guidelines.
2. **Security & Least Privilege**: Passwords never retained in DOM or persistent browser storage; cleared immediately upon submission attempt (W03/W10).
3. **Dependency Integrity**: Strictly zero new `npm` packages added to `apps/web/package.json`.
4. **Non-Breaking Isolation**: Work carried out in dedicated Gemini branch; main branch remains clean until review and merge.

## Project Structure

```text
prototypes/
└── idea-authentication-preview.html              # Standalone 0-dependency interactive prototype
specs/007-f03b-login-session-ui/
├── spec.md                                       # Feature specification
├── plan.md                                       # Implementation plan (this document)
└── tasks.md                                      # Task breakdown & progress
apps/web/
├── package.json                                  # Add missing "dev": "vite"
├── src/
│   ├── components/auth/
│   │   ├── LoginForm.tsx                         # Controlled/presentational login form
│   │   ├── StatusBanner.tsx                      # Neutral, warning, danger feedback alerts
│   │   ├── SessionLanding.tsx                    # Post-login session context view
│   │   └── Topbar.tsx                            # Topbar with Actor Pill and Logout
│   ├── styles/
│   │   └── auth.css                              # Design tokens & anti-slop CSS classes
│   └── test/
│       ├── LoginForm.test.tsx                    # TDD unit tests
│       └── StatusBanner.test.tsx                 # TDD unit tests
```
