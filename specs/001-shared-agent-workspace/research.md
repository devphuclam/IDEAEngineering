# Research: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace | **Date**: 2026-08-13

Research consolidates the technical choices for the optional Agent Orchestration Layer package
(`tools/agent-workspace/`). Sources are cited inline; empirical checks are marked as such.

## 1. Node.js runtime and TypeScript execution

**Decision**: Node.js 24 LTS ("Krypton") as the engine baseline, TypeScript executed natively via
type stripping, `node:test` as the built-in test runner, `tsc --noEmit` as the type-check gate.

**Rationale**:

- Node 24 is the current Active LTS (LTS since 2025-10-28, maintenance from 2026-10-20, EOL
  2028-04-30). Node 26 is Current but does not become LTS until 2026-10-28. A new optional package in 2026
  targets Node 24. (endoflife.date/nodejs; pkgpulse.com comparative Node lifecycle note, 2026-06)
- Type stripping is documented as stable in the maintained v24 line: `node file.ts` executes
  TypeScript directly with no build step. Supported
  syntax is the "erasable" subset (interfaces, type annotations, `import type`); enums,
  namespaces, and parameter properties require full transpilation and are avoided.
  (nodejs.org release notes; stevekinney.com type-stripping guide)
- The native `node:test` runner in 2026 includes mocking, spies, and code coverage, which is
  sufficient for unit, contract, and black-box tests that spawn the CLI against temporary Git
  repositories; no Vitest/Jest dependency is required. (techglock.com Node mid-2026 trends)

**Alternatives considered**:

- Node 26: not LTS until October 2026; avoided for a template baseline.
- tsx/ts-node build step: unnecessary when type stripping is stable; adds dependencies.
- Vitest/Jest: richer DX, but `node:test` covers mocking/spies/coverage without a dependency.

**Configuration note**: `tsconfig.json` uses `module: nodenext`, `target: esnext`,
`allowImportingTsExtensions: true`, `rewriteRelativeImportExtensions: true`,
`verbatimModuleSyntax: true`, `erasableSyntaxOnly: true`. Type-checking stays a separate
`tsc --noEmit` step; runtime never checks types.

## 2. Deterministic Work Claim serialization on GitHub

**Decision**: The GitHub adapter represents the authoritative claim state as **append-only claim
records** — structured, machine-readable comment entries on the Work Item Issue, each carrying a
claim token, claimant identity, and lease metadata. The deterministic winner is the **first
unexpired claim record in comment creation order**; a later claimant whose start attempt finds an
existing unexpired claim is rejected with an actionable conflict and no sandbox is created.

**Rationale**:

- GitHub's REST API has **no Idempotency-Key header support** for issues/comments, and content
  creation is subject to secondary rate limits (about 80 content-creating requests per minute and
  500 per hour per token; primary limit is 5,000 requests/hour authenticated). Two concurrent
  `POST` comment creates can both succeed, so the winner cannot be decided at write time — it must
  be decided at reconciliation time. Append-only records plus "oldest valid wins" is the only
  deterministic rule possible without a CAS primitive. (docs.github.com rate limits; GitHub
  Community discussion 192764 on idempotency keys)
- Best-practice guidance for integrators requires serial requests per user and at least ~1 second
  between content-creating writes; content-creating responses carry no `Retry-After` header, and
  abuse detection can 403. The adapter therefore serializes writes, spaces them, and classifies
  403/429/abuse responses as actionable `rate-limited` or `blocked` failures (FR-019) instead of
  silently retrying forever. (docs.github.com/rest best practices; peter-evans/create-pull-request
  issue 855)
- Assignee (`gh issue edit --add-assignee @me`) remains a **human-visible convenience marker**
  only; it is not the authority because GitHub does not provide a compare-and-swap on assignees
  and assignee state is not append-only.
- Renewal is a heartbeat: a new claim record is appended before lease expiry; expiry is computed
  from the newest valid record, and an expired claim releases the Work Item while preserving all
  records (FR-004). Duplicate delivery is absorbed because reconciliation is idempotent — a
  duplicate claim record for the same token is treated as one claim.

**Alternatives considered**:

- Issue label as claim marker: not append-only (edits), no ordering, easy to corrupt.
- Assignee as authority: no atomic CAS; two users can both be assigned; not attributable.
- Milestone/state tricks: heavy, collides with team usage of milestones.
- External database claim store: introduces a mandatory shared service, violates the Azure-free,
  local-first delivery (FR-017).

## 3. Git worktree Agent Sandboxes

**Decision**: One Local Agent Runner owns one local clone of the Generated Project and creates
each Agent Sandbox as `git worktree add <clone>/.worktrees/<run-id> -b feature/<work-item-slug>`.
Each team member uses their own clone; sandboxes are never shared between people.

**Rationale**:

- Empirically verified on this machine: linked worktrees inside a `.worktrees/` subdirectory of
  the main clone coexist on separate branches, and `.worktrees/` is already git-ignored in this
  repository. Each worktree has its own working directory, HEAD, and index lockfile, so two
  sandboxes in one clone never contend on `.git/index` — the main source of lock collisions when
  running two Agents in one checkout. (corecocept.com worktree guide; empirical test 2026-08-13)
- Git itself is a single-process tool: concurrent `git` invocations across worktrees can corrupt
  repository state. The CLI therefore serializes its own git operations (a per-run operation
  queue), and the design's claim protocol already guarantees at most one active run per Work Item
  (FR-002). (kaeawc/auto-worktree issue 176; git-gc notes on concurrent writers)
- Cleanup uses `git worktree remove` (never `rm -rf`), `git worktree prune` repairs stale
  administrative metadata after a crash, and `git worktree lock` protects sandboxes on shared
  drives. A sandbox may disappear at any time; recovery comes from pushed checkpoints, never from
  uncommitted sandbox files (FR-007). (git-worktree(1); gitworktree.org best practices)

**Alternatives considered**:

- Sibling directory pattern (`../<project>-<slug>`): equally valid; the in-clone `.worktrees/`
  pattern keeps all sandboxes discoverable per member, is already ignored, and matches the
  existing repository layout.
- One shared clone on a shared filesystem for both members: rejected — concurrent git writers on
  one shared store plus cross-machine state makes corruption and identity confusion likely; the
  spec requires separate development environments per person (FR-021).

## 4. Branch policy and review surface

**Decision**: Descriptive branches `feature/<work-item-slug>` (no Agent/AI/Codex/personal
markers), pull request as the review surface, and the repository's `minimum_human_approvals: 0`
policy recorded in the pull request template — mapped to GitHub branch protection with
`required_approving_review_count: 0` while required status checks still gate integration.

**Rationale**:

- `minimum_human_approvals: 0` is this repository's documented policy (PR template,
  `docs/agents/collaboration.md`), not a GitHub feature. GitHub branch protection separates
  `required_pull_request_reviews.required_approving_review_count` (set to 0) from
  `required_status_checks` (still enforced), which matches the spec: the author may satisfy the
  review intent, and GitHub never fabricates an independent approval (FR-022). The GitHub adapter
  reads the protection configuration through
  `GET /repos/{owner}/{repo}/branches/{branch}/protection` to confirm required checks before
  `workspace integrate`. (docs.github.com REST branch protection)
- Agents never push to `main`; the adapter creates branches, pushes checkpoints, opens pull
  requests, and requests integration through the queue (FR-020).
- GitHub branch-name restrictions (no spaces, no `..`, no trailing dot, length limits) are
  satisfied by the slug convention `feature/<work-item-slug>`.

**Alternatives considered**:

- Direct push to main for the two-person pilot: rejected by FR-020 and the constitution
  (least-privilege, review workflow).
- Requiring one independent human approval: explicitly out of scope; the template policy is
  author self-review with required checks.

## 5. Codex Desktop coordination (Local Agent Runner)

**Decision**: The first Local Agent Runner coordinates *around* Codex Desktop: `workspace start`
prepares the isolated worktree, branch, and run context, then tells the Run Owner which folder to
open in Codex Desktop. The runner does not scrape Desktop state, inject remote messages into a
Desktop task, or create a shared Codex thread.

**Rationale**: This is a settled design decision from the approved Shared Agent Workspace design
("Local Agent Runner coordinates the work around Codex Desktop; it does not scrape Desktop
state..."). No research is required because the boundary is defined by exclusion; the managed
path (Codex SDK inside a managed sandbox with an approved AI Workload Credential) is deferred to
a later phase and must remain disabled until company approval exists (FR-018).

**Alternatives considered**: managed Codex SDK execution in the first delivery — rejected, blocked
by FR-018 and the Azure-free delivery constraint.

## 6. Open questions carried into planning (not blocking)

- Claim lease defaults (duration, heartbeat interval): configurable in the package; the initial
  two-person profile follows the design's concurrency defaults (at most two active runs, one
  active integration operation).
- Blocker classification taxonomy: capability, credential, quota, region, network are the
  classes named in the spec (FR-019); concrete error codes are assigned in the contracts.
