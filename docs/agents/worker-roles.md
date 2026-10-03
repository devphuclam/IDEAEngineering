# AI Worker Role Policy

This is the single source for the current worker mapping, delegation boundaries and working modes.
Read [Constitution principle VI](../../.specify/memory/constitution.md#vi-implementation-continuity-and-bounded-specialist-delegation)
for provider-neutral continuity, takeover and authority rules. This file implements that principle;
it does not create product scope, backend contracts, implementation authorization or gate acceptance.

## Current worker mapping

### Primary Implementation Worker — Codex

Codex is the default implementation worker and continuity owner. Codex owns:

- backend, Server and Gateway implementation;
- database, PostgreSQL and migrations;
- IAM, authentication, authorization and security behavior;
- transactions, concurrency and backend retry/idempotency;
- authoritative business behavior and persistence;
- API/wire contracts and authoritative DTOs;
- real API clients and real frontend application state;
- wiring APIs/backend into UI, session handling and Gateway interaction;
- cross-module and end-to-end integration;
- regression, qualification and execution evidence;
- all work not explicitly delegated.

Codex may perform UI/design work when Gemini is not used or unavailable. During integration,
Codex may change frontend code for correctness, security, accessibility, application state or the
accepted backend contract, preserving accepted UI/interaction intent where practical. Codex may
complete a necessary redesign itself; optional Gemini participation is not a prerequisite.

### Optional Specialist Worker — Gemini

Gemini is supplementary, not required for delivery. Its current specialization is Product Design
and **presentational UI implementation**:

- UX flows, wireframes and screen/component composition;
- layout and visual hierarchy;
- React presentational page/component skeletons;
- CSS, design tokens and visual styling;
- responsive behavior and accessibility presentation;
- loading, empty, error, success and progress visual states;
- mock data/view models, mock adapters and mock-only UI demonstrations;
- presentational UI tests.

Gemini may produce real frontend source that renders from explicit props or view models. It works
from accepted feature intent, not as an authority to approve new product behavior. Clearly mark
mock interfaces/data; mocks do not prove that a backend contract exists.

Real API integration, Java/backend, Gateway behavior, persistence, IAM/security, transactions,
Grant/Receipt semantics and authoritative contracts remain in the Codex lane. If required backend
semantics are missing, Gemini returns **DECISION REQUIRED / BACKEND CONTRACT REQUEST** rather than
inventing an endpoint or wire contract. Any proposed reassignment beyond this mapping follows the
explicit human authority rule in Constitution principle VI for the named Work Item.

## Working modes

Record the selected mode in the existing Work Item or handoff. Exactly three modes apply:

### `CODEX_ONLY`

Default. Codex performs all necessary authorized work, including UI/design. Use when Gemini is
unnecessary, unavailable, the work is mainly backend/integration, or the human says **Codex only**.

### `CODEX+GEMINI_UI`

Use when the human says **Use Gemini for UI** or bounded Design/UI delegation is otherwise
authorized. Codex continues backend/contracts/security/data/API work and real integration while
Gemini creates UX and a presentational UI skeleton driven by props/mock view models.

When accepted feature intent defines the UI boundary sufficiently, these lanes may proceed
concurrently. Neither lane waits for the other to finish the entire feature. Codex integrates
the UI into real application/backend state and performs the required verification.

```text
                 accepted feature intent
                         |
             +-----------+-----------+
             |                       |
             v                       v
          Codex                    Gemini
backend/integration          UX + UI skeleton
security/data/API            mock visual states
             |                       |
             +-----------+-----------+
                         |
                         v
                  Codex integrates
```

Use separate branches/worktrees under [collaboration.md](collaboration.md). Workers must not
edit the same branch/worktree concurrently.

### `FALLBACK_TO_CODEX`

Activate immediately when Gemini reports token/quota exhaustion, is unavailable, cannot continue,
or the human says **Fallback to Codex** or otherwise requests takeover. Continue the same
already-authorized Work Item under Constitution principle VI; no second human authorization is
required merely for the specialist's loss of availability.

1. Read the latest available Gemini handoff and inspect its latest exact usable commit.
2. Preserve usable UI work and resolve branch/worktree ownership before editing it.
3. Continue unfinished Design/UI as Codex, then connect it to real application/backend state.
4. Complete integration and verification under the existing Work Item/specification and gates.

If there is no usable Gemini commit, continue from the authoritative Work Item, specification,
accepted contracts and repository state. An incomplete or missing handoff caused by token/quota
exhaustion must not block takeover or require reconstruction of private reasoning/chat history.
Worker fallback does not restart a Delivery Card or timer; existing progress rules still apply.

Codex may take over Gemini's Design/UI lane. The reverse is not automatic: Gemini does not inherit
Codex's authoritative/backend/integration lane because Codex is busy or unavailable. Apply the
named-Work-Item human reassignment rule in Constitution principle VI.

## Gemini handoff

Before finishing, pausing or losing available capacity, retain these fields when possible:

- Work Item and selected worker mode;
- branch/worktree and exact commit;
- changed UI files;
- intended UX flow and supported visual states;
- mock/view-model assumptions;
- responsive/accessibility notes;
- unresolved items and backend needs marked **DECISION REQUIRED / BACKEND CONTRACT REQUEST**.

The handoff is sufficient when Codex can continue from those repository records without private
model context. If capacity loss prevents completion, use the fallback procedure above.

## Authority and completion check

Constitution principle VI and [collaboration.md](collaboration.md) govern allocation and continuity.
Product Decision Authority, Project Reviewer rules, Spec Kit task order, accepted ADRs, security
and external-source intake gates, and Delivery Card/Tracker rules remain unchanged. Worker modes
do not authorize a new feature, acceptance, timer action or product/architecture decision.

For each allocation or takeover, verify:

- Codex remains primary/default and Gemini remains optional;
- Gemini's assigned work is bounded to the approved Design/presentational UI lane unless explicitly
  reassigned by the human for that Work Item;
- real API/backend integration remains Codex-owned under the current mapping;
- Gemini capacity loss cannot block continuity of the same authorized work;
- the current mode, valid repository state and remaining work are navigable through the Work Item
  and handoff, without a new architecture/restart cycle.

Historical completed Work Item allocations remain historical records, not a second current
worker policy. Apply this mapping to current/future allocations without rewriting accepted evidence.
