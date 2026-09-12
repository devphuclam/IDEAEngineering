## Agent skills

### IDEA product knowledge

Before work involving PDM, PLM, document identity, Generation, Revision, Checkout, Reservation, Reference, product structure, CAD/Office formats, icVault, or DDM, read the [product knowledge index](docs/product/knowledge/README.md). Preserve each claim's evidence class; a competitor observation is never sufficient by itself to create an IDEA requirement.

### Work items

Route Work Item reads, writes, triage, and wayfinding through `docs/agents/issue-tracker.md`. The inherited Core Workspace currently selects the GitHub Platform Adapter; its final PG0 disposition remains separate from C1 product behavior.

### Collaboration workflow

Follow [`docs/agents/collaboration.md`](docs/agents/collaboration.md) for provider-neutral branch, worktree, pull request, review, and handoff rules. Use [`docs/agents/local-skills.md`](docs/agents/local-skills.md) and the pinned [`skill manifest`](.agents/skills/manifest.yml) before relying on an optional global Agent plugin.

Lần sau tôi mà có nói là push lên main thì push lên luôn.

### Triage labels

Use the default Matt Pocock triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo using `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.

### Product documents and planning

Before authoring or reporting the status of DOC-01…DOC-08, Feature/Spec/Tech, or the roadmap, read
the [IDEA instance catalogue](docs/product/instances/idea-engineering/README.md). It distinguishes
authored instances, decision briefs, templates and their current versions. Follow its DOC-07
links for task order and planning dependencies.

### Management-facing Word documents

Before creating, editing or comparing Word documents for management, read
[management-document guidance](docs/agents/management-documents.md) for the Human editorial copies,
source comparison, writing, logo, layout and verification rules.

### Spec Kit and Matt Pocock workflow

When a Work Item is managed through Spec Kit, read [`docs/agents/spec-kit.md`](docs/agents/spec-kit.md)
and use the project-local `$speckit-*` skills from `.agents/skills/`. Spec Kit owns the feature
artifact lifecycle; Matt Pocock skills own domain judgment, design quality, TDD, review, and
recovery. Do not run two competing specification or implementation workflows for the same feature.
