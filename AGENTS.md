## Agent skills

### Work items

Route Work Item reads, writes, triage, and wayfinding through `docs/agents/issue-tracker.md`. This template currently selects the GitHub Platform Adapter; Generated Projects may replace that adapter without changing Core Work Item concepts.

### Collaboration workflow

Follow [`docs/agents/collaboration.md`](docs/agents/collaboration.md) for provider-neutral branch, worktree, pull request, review, and handoff rules. Use [`docs/agents/local-skills.md`](docs/agents/local-skills.md) and the pinned [`skill manifest`](.agents/skills/manifest.yml) before relying on an optional global Agent plugin.

### Triage labels

Use the default Matt Pocock triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo using `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.

### Spec Kit and Matt Pocock workflow

When a Work Item is managed through Spec Kit, read [`docs/agents/spec-kit.md`](docs/agents/spec-kit.md)
and use the project-local `$speckit-*` skills from `.agents/skills/`. Spec Kit owns the feature
artifact lifecycle; Matt Pocock skills own domain judgment, design quality, TDD, review, and
recovery. Do not run two competing specification or implementation workflows for the same feature.
