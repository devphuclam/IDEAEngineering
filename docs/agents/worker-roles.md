# AI Worker Role Policy

This document defines the default division of work between implementation assistants used on IDEA Engineering.

It is a repository workflow rule, not a product architecture or product-scope decision.

## 1. Primary ownership

### Codex — Primary Application Implementation Owner

Codex is the default and primary implementation worker for IDEAEngineering.

Codex owns:

- Server/backend implementation;
- Gateway implementation;
- PostgreSQL and migrations;
- authentication and authorization;
- security behavior;
- transaction and concurrency behavior;
- API and wire contracts;
- real API clients;
- connecting real APIs to UI;
- real frontend application state;
- authoritative business behavior;
- integration;
- regression;
- qualification;
- execution evidence;
- cross-cutting implementation necessary to complete a feature;
- any work not explicitly delegated to Gemini.

Codex may also perform Design/UI work whenever Gemini is not used or is unavailable.

Rule:

> Anything that determines authoritative system behavior or connects the product end-to-end belongs to Codex.

## 2. Gemini ownership

### Gemini — Product Designer + Presentational UI Worker

Gemini is an optional secondary worker used to accelerate UI/UX work.

Gemini may own:

- UX flow;
- screen composition;
- layout;
- visual hierarchy;
- component design;
- React page/component skeletons;
- CSS and visual styling;
- responsive behavior;
- accessibility presentation;
- loading states;
- empty states;
- error states;
- success states;
- progress states;
- mock data;
- mock view models;
- mock-only UI demonstrations;
- presentational frontend tests.

Gemini may produce real frontend source code, but its boundary is **presentational UI**.

A Gemini UI should be able to render from explicit props, view models or mock adapters without requiring Gemini to define authoritative backend behavior.

Rule:

> Gemini designs and builds what the user sees. Codex makes it real.

## 3. Gemini boundary

Gemini does not own:

- Java/backend code;
- Gateway behavior;
- PostgreSQL;
- migrations;
- IAM/security semantics;
- transaction semantics;
- API controller implementation;
- real API client integration;
- authoritative DTO or wire-contract decisions;
- Grant/Receipt semantics;
- persistence;
- real business state;
- backend-driven retry/idempotency rules;
- cross-module integration.

When Gemini needs a backend/API behavior that current authority has not defined, it must return:

`DECISION REQUIRED / BACKEND CONTRACT REQUEST`

It must not invent an endpoint or backend contract merely to make a UI work.

Mock interfaces are allowed only as presentational seams and must be clearly identified as mocks.

A mock is never evidence that a real backend contract exists.

## 4. Codex integration ownership

Codex takes Gemini's UI output and performs all real integration.

Typical flow:

```text
Gemini
UX + UI skeleton
        |
        v
explicit props / mock view model
        |
        v
Codex
real application state
API client
authentication/session
Server contract
Gateway interaction
error/retry behavior
integration tests
        |
        v
working feature
```

Codex may modify frontend code where required for:

- real integration;
- correctness;
- security;
- accessibility;
- application state;
- accepted backend contracts.

Codex should preserve the accepted UI/interaction intent where practical.

A material redesign may return to Gemini when Gemini is available.

If Gemini is unavailable, Codex completes the redesign itself under the fallback rule.

## 5. Working modes

Every applicable Work Item uses one of three worker modes.

### `CODEX_ONLY`

This is the default mode.

Use when:

- Gemini is unnecessary;
- Gemini is unavailable;
- the work is mainly backend/integration;
- the human chooses Codex only.

Codex owns the entire implementation including any UI needed for completion.

### `CODEX+GEMINI_UI`

Use when dedicated Design/UI work is useful.

The two workers may proceed in parallel.

#### Codex lane

Codex continues:

- backend;
- contracts;
- integration;
- database;
- security;
- real application behavior.

#### Gemini lane

Gemini works on:

- UX;
- visual design;
- presentational components;
- mock/view-model driven UI skeleton.

The lanes use separate branches/worktrees according to the repository collaboration rules.

Gemini does not need to wait for the entire backend implementation.

It only needs enough accepted feature intent/UI boundary to avoid inventing product behavior.

Codex integrates the result.

### `FALLBACK_TO_CODEX`

This mode transfers Gemini's current Design/UI work to Codex.

Activate it when:

- Gemini reports token/quota exhaustion;
- Gemini becomes unavailable;
- Gemini cannot continue the assigned task;
- the human explicitly says `Fallback to Codex`;
- the human decides Gemini is no longer useful for that Work Item.

A reported Gemini token/quota/unavailability condition is sufficient authority to activate this mode.

Do not ask the human for a second authorization merely to continue the same already-authorized Work Item.

Fallback does not:

- reopen architecture;
- reopen approved product decisions;
- restart the Work Item;
- restart the Delivery Card;
- create a new timer;
- discard valid Gemini work.

Codex continues from the latest valid repository state.

## 6. Fallback procedure

When `FALLBACK_TO_CODEX` activates:

1. Read Gemini's latest handoff.
2. Inspect Gemini's latest exact commit if one exists.
3. Preserve usable UI work.
4. Continue unfinished Design/UI work as Codex.
5. Connect the UI to real application/backend state.
6. Complete integration and verification normally.

If Gemini has no usable commit, Codex resumes from the authoritative:

- Work Item;
- Spec Kit artifacts;
- accepted architecture/contracts;
- current repository state.

Codex may implement the missing UI directly.

Do not reconstruct or wait for Gemini solely because Gemini was originally assigned the UI lane.

## 7. Asymmetric takeover rule

The worker relationship is intentionally asymmetric.

### Allowed

`Gemini → Codex`

Codex may always take over Gemini-owned Design/UI work.

### Not automatic

`Codex → Gemini`

Gemini may not take over Codex-owned authoritative/backend/integration work merely because Codex is busy or unavailable.

Such reassignment requires explicit human authorization for the named Work Item.

Reason:

Gemini is an acceleration lane.

Codex is the project's implementation continuity owner.

## 8. Gemini handoff contract

Before Gemini finishes, pauses or exhausts its available quota, retain as much of this handoff as possible:

- Work Item;
- branch/worktree;
- exact commit;
- changed UI files;
- intended user flow;
- supported visual states;
- mock/view-model assumptions;
- responsive/accessibility behavior that matters;
- unresolved items;
- backend needs marked `DECISION REQUIRED / BACKEND CONTRACT REQUEST`.

The handoff is sufficient when Codex can continue without reconstructing Gemini's private reasoning or chat history.

If token exhaustion prevents a complete handoff, the latest committed repository state plus existing Work Item/spec remains authoritative.

Incomplete Gemini handoff must not block Codex takeover.

## 9. Human mode controls

The human may use these short instructions:

### `Codex only`

Activate `CODEX_ONLY`.

### `Use Gemini for UI`

Activate `CODEX+GEMINI_UI`.

### `Fallback to Codex`

Activate `FALLBACK_TO_CODEX`.

These are worker-allocation controls only.

They do not change product scope, Delivery Card state or architecture authority.

## 10. Parallel-delivery principle

Where safe, Design/UI and implementation should proceed concurrently.

Preferred pattern:

```text
Accepted feature intent
        |
        +-----------------------+
        |                       |
        v                       v
      CODEX                   GEMINI
backend/contracts          UX/UI skeleton
integration               mock visual states
        |                       |
        +-----------+-----------+
                    |
                    v
             CODEX integrates
                    |
                    v
              working feature
```

Do not serialize the entire frontend behind completed backend work when the UI boundary is already sufficiently defined.

Likewise, do not block backend work while waiting for optional Gemini design output.

## 11. Collaboration rule

Both workers must follow [docs/agents/collaboration.md](collaboration.md).

Use separate branch/worktree ownership for simultaneous work.

Do not allow Codex and Gemini to edit the same branch/worktree concurrently.

Worker assignment does not change:

- Product Decision Authority;
- Project Reviewer authority;
- Spec Kit task order;
- accepted ADRs;
- security gates;
- external-source intake;
- Delivery Card progress/timer rules.

## 12. Completion criterion

This policy is correctly applied when:

- every worker knows Codex is primary;
- Gemini stays inside Design + presentational UI unless explicitly reassigned;
- real API/backend integration remains Codex-owned;
- Gemini exhaustion cannot block project progress;
- Codex can continue the same Work Item without a new architecture/restart cycle;
- the repository remains the handoff source of truth rather than chat history.
