<!--
Sync Impact Report:
- Version change: template -> 1.0.0
- Modified principles: replaced all generated placeholders with workspace rules
- Added sections: Additional Constraints, Development Workflow
- Removed sections: none
- Deferred: product-specific architecture and deployment policy remain in generated projects
-->

# Development Workspace Template Constitution

## Core Principles

### I. Product-Neutral Core

The Core Workspace MUST remain product-, stack-, and cloud-neutral. Product-specific code,
business rules, secrets, and deployment assumptions belong in a Generated Project or an explicit
optional layer. Azure support MUST be added through documented adapters and examples rather than
hard-coding a single organization's tenancy or subscription.

### II. Specifications Before Implementation

Material feature work MUST have a traceable Work Item. When the work is managed with Spec Kit,
the feature MUST progress through the applicable specification, clarification, plan, and task
artifacts before implementation. The resulting artifacts MUST stay aligned with the Work Item
and MUST be updated when the agreed scope changes.

### III. Testable, Reproducible Verification

Every Core Workspace change MUST preserve the repository verifier and relevant test contracts.
Generated projects MUST add real checks appropriate to their stack. Agents MUST report checks that
were not run, blocked, or substituted instead of claiming success from a weaker substitute.

### IV. Isolated Collaboration and Durable Handoffs

Each Agent Run MUST have an explicit scope and isolated branch, worktree, or equivalent sandbox.
Concurrent runs MUST coordinate through the documented Work Item and handoff protocol. Shared
files MUST be reconciled through reviewable commits or patches; agents MUST NOT silently overwrite
another run's work.

### V. Least-Privilege and Explicit Integration

Credentials MUST remain outside source control and examples MUST use placeholders. Optional
integrations, including Azure and external issue providers, MUST be opt-in, documented, and
replaceable. Changes to protected branches MUST go through the repository's review and merge
workflow rather than direct agent writes.

## Additional Constraints

- Project-local instructions and skills take precedence over optional global extensions.
- `AGENTS.md`, `CONTEXT.md`, and the applicable ADRs are the source of truth for repository
  terminology and settled decisions.
- Spec Kit owns feature-artifact lifecycle; Matt Pocock skills provide domain modeling, design,
  TDD, diagnosis, review, and other engineering judgment.
- The Core Workspace MUST NOT claim that an environment, dependency, test, deployment, or cloud
  integration is available unless the corresponding check has actually passed.

## Development Workflow

1. Start from a Work Item, define the scope, and identify affected optional layers.
2. For Spec Kit-managed work, use `$speckit-specify`, `$speckit-clarify`, `$speckit-plan`,
   `$speckit-tasks`, and `$speckit-implement` as applicable. Use `$speckit-converge` before
   handoff when the feature needs cross-artifact reconciliation.
3. Use Matt Pocock skills at the judgment points: domain modeling before uncertain vocabulary,
   codebase design before a deep interface change, TDD while implementing, and code review before
   merge. Do not run duplicate specification or implementation lifecycles for one change.
4. Run the strongest relevant verification available, document blockers, and hand off through a
   reviewable pull request or equivalent checkpoint.

## Governance

This constitution supersedes generic workflow defaults for this template. Amendments MUST update
the Sync Impact Report, version, ratification/amendment dates, and any affected agent-facing
documentation or verifier contract. Every change MUST preserve product neutrality, reproducible
verification, isolated collaboration, and least-privilege defaults. Generated projects MAY extend
these rules but MUST NOT weaken them without an explicit project decision and rationale.

**Version**: 1.0.0 | **Ratified**: 2026-08-13 | **Last Amended**: 2026-08-13
