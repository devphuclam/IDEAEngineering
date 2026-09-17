# Spec Kit and Matt Pocock Workflow

This repository includes GitHub Spec Kit `1.0.7` with its Codex skills integration. The
integration is project-local: `.specify/` contains the Spec Kit project infrastructure and
`.agents/skills/speckit-*` contains the Codex skills. The global `specify` CLI is only needed to
upgrade or reinitialize the integration; day-to-day feature work uses the checked-in skills.

## Division of responsibility

Spec Kit owns the ordered feature-artifact lifecycle:

```text
constitution -> specify -> clarify -> plan -> checklist -> tasks -> analyze -> implement -> converge
```

Matt Pocock skills own the engineering judgment around that lifecycle:

- `grill-with-docs` and `domain-modeling` resolve domain language and durable decisions before
  they become requirements.
- `codebase-design` and `ask-matt` challenge architecture and design boundaries.
- `tdd` drives test-first implementation at agreed seams.
- `code-review` checks standards and the approved specification.
- `diagnosing-bugs` and `resolving-merge-conflicts` handle failures and integration problems.
- `writing-for-agents` governs changes to agent-facing instructions.

The repository's `CONTEXT.md` and `docs/adr/` remain authoritative for domain terms and durable
decisions. Spec Kit artifacts explain a feature; they do not silently replace the glossary or
reopen an accepted ADR.

## Recommended feature sequence

For a new feature, use this sequence:

1. Read `AGENTS.md`, `CONTEXT.md`, the relevant ADRs, and the Work Item.
2. Run `$grill-with-docs` when the domain, scope, or important trade-offs are unsettled. Let it
   update `CONTEXT.md` or create an ADR before writing the feature specification.
3. Run `$speckit-constitution` once for a new project, or when the project governance genuinely
   changes. Do not run it for every feature.
4. Run `$speckit-specify` to create `specs/<feature>/spec.md` from the user value and behavior.
5. Run `$speckit-clarify` when the specification contains material ambiguity.
6. Run `$speckit-plan` to choose the implementation approach, then `$speckit-checklist` to prepare
   a reviewer-owned requirements-quality checklist.
7. Run `$speckit-tasks` to produce the dependency-ordered `tasks.md`, then `$speckit-analyze` to
   inspect spec/plan/tasks read-only. Save its report or remediate findings only in a separate,
   explicitly approved step. Artifact-quality checks do not grant product-gate approval.
8. Run `$speckit-implement` when `tasks.md` is the execution source. During implementation, use
   `$tdd` at pre-agreed seams and `$code-review` before integration.
9. Run `$speckit-converge` after implementation to assess remaining work and append follow-up
   tasks. Use `$speckit-taskstoissues` only when the team explicitly wants tasks mirrored to the
   selected Work Item provider.

For work that already has an approved ticket/spec but is not managed in a Spec Kit feature
directory, use Matt Pocock `$implement` as the outer implementation workflow, with `$tdd` and
`$code-review` inside it.

## Avoiding overlap

Use one source of truth per feature:

- Do not run `$to-spec` after `$speckit-specify` for the same feature. Choose Spec Kit's
  `spec.md`, or use `$to-spec` when the work intentionally stays outside Spec Kit.
- Do not run `$implement` and `$speckit-implement` sequentially on the same `tasks.md`. Choose
  `$speckit-implement` for Spec Kit tasks, or `$implement` for ticket-driven work without a Spec
  Kit task list.
- `$speckit-implement` does not replace TDD, code review, domain modeling, or repository
  collaboration rules. Those remain required project-local guidance.
- Spec Kit does not create a shared filesystem or shared Codex session. Follow the repository's
  isolated Work Item, branch, worktree, Agent Run, and handoff rules.

## Command examples

```text
$speckit-constitution Establish product-neutral principles for reproducibility, security, and testable delivery.
$speckit-specify Add the first local Agent Workspace CLI vertical slice.
$speckit-clarify Focus on claim expiry, handoff, and recovery behavior.
$speckit-plan Use the approved repository stack and adapter boundaries; preserve Core Workspace independence.
$speckit-checklist
$speckit-tasks
$speckit-analyze
$speckit-implement
$speckit-converge
```

The first command that needs an active feature is `$speckit-specify`; it creates the feature
directory and updates the active-feature pointer. Do not manually create `specs/<feature>/` before
that command unless the Spec Kit skill explicitly asks for it.

## Upgrade and verification

Check the installed CLI with:

```powershell
specify version --features
specify check
```

Upgrade the CLI and then refresh the Codex integration through Spec Kit's integration upgrade
command. Review the diff because Spec Kit owns its generated skill files:

```powershell
specify self check
specify self upgrade
specify integration upgrade codex --integration-options="--skills"
```

After an upgrade, run `./scripts/verify-template` and confirm the Spec Kit skill paths in
`.agents/skills/manifest.yml` still exist. Do not overwrite customized Matt Pocock skills.
