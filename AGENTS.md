## Agent skills

### IDEA product knowledge

Before work involving PDM, PLM, document identity, Generation, Revision, Checkout, Reservation, Reference, product structure, CAD/Office formats, icVault, or DDM, read the [product knowledge index](docs/product/knowledge/README.md). Preserve each claim's evidence class; a competitor observation is never sufficient by itself to create an IDEA requirement.

### Work items

Route Work Item reads, writes, triage, and wayfinding through `docs/agents/issue-tracker.md`. The inherited Core Workspace currently selects the GitHub Platform Adapter; its final PG0 disposition remains separate from C1 product behavior.

### Collaboration workflow

Follow [`docs/agents/collaboration.md`](docs/agents/collaboration.md) for provider-neutral branch, worktree, pull request, review, and handoff rules. Use [`docs/agents/local-skills.md`](docs/agents/local-skills.md) and the pinned [`skill manifest`](.agents/skills/manifest.yml) before relying on an optional global Agent plugin.

Lần sau tôi mà có nói là push lên main thì push lên luôn.

### External sources and licenses

Before cloning or pulling an external project for adaptation, adding a submodule or dependency,
copying or modifying third-party code/content/assets, or vendoring a repository, follow
[`docs/agents/external-source-intake.md`](docs/agents/external-source-intake.md). Pin the exact source
and license before import; a public repository without a usable license remains reference-only.

### Triage labels

Use the default Matt Pocock triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo using `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.

### Product documents and planning

Before authoring or reporting the status of DOC-01…DOC-08, Feature/Spec/Tech, or the roadmap, read
the [IDEA instance catalogue](docs/product/instances/idea-engineering/README.md). It distinguishes
authored instances, decision briefs, templates and their current versions. Follow its DOC-07
links for task order and planning dependencies.

### Product and research authoring standard

Before authoring a controlled product document, `IE-KNW-*` knowledge artifact, research record,
ADR, decision brief or verification record, read the [product and research authoring standard](docs/agents/product-document-authoring-standard.md).
It defines the control envelope, standards tailoring, evidence-to-decision separation,
requirement/architecture/data/verification writing rules and explicit `UNKNOWN`/`BLOCKED`/
`NOT-RUN` handling. Its document Status is `Draft`, but its Repository Instruction State is
`Effective`; follow it as an active contributor/agent process instruction. This does not imply
Product Decision Authority review or acceptance; it does not make the guide a Core Product
Document, create product scope or change gate decisions.

Before creating or revising a technology decision matrix, `TECH-*` brief or technology
architecture view set, also read the
[technology stack documentation standard](docs/agents/technology-stack-documentation-standard.md).
It keeps evidence, Engineering selection, qualification and Product Decision Authority approval
as separate controlled states.

### Management-facing Word documents

Before creating, editing or comparing Word documents for management, read
[management-document guidance](docs/agents/management-documents.md) for the Human editorial copies,
source comparison, writing, logo, layout and verification rules.

### Spec Kit and Matt Pocock workflow

When a Work Item is managed through Spec Kit, read [`docs/agents/spec-kit.md`](docs/agents/spec-kit.md)
and use the project-local `$speckit-*` skills from `.agents/skills/`. Spec Kit owns the feature
artifact lifecycle; Matt Pocock skills own domain judgment, design quality, TDD, review, and
recovery. Do not run two competing specification or implementation workflows for the same feature.
