## Agent skills

### IDEA product knowledge

Before work involving PDM, PLM, document identity, Generation, Revision, Checkout, Reservation, Reference, product structure, CAD/Office formats, icVault, or DDM, read the [product knowledge index](docs/product/knowledge/README.md). Preserve each claim's evidence class; a competitor observation is never sufficient by itself to create an IDEA requirement.

### Work items

Route Work Item reads, writes, triage, and wayfinding through `docs/agents/issue-tracker.md`. The inherited Core Workspace currently selects the GitHub Platform Adapter; its final PG0 disposition remains separate from C1 product behavior.

### Pull Request review and optional Kaizen checklist

For every PR, follow [`docs/agents/pull-request-review.md`](docs/agents/pull-request-review.md) and the repository's actual review and required-check rules. The shared [PR template](.github/pull_request_template.md) is an optional review aid; completing it or taking part in the Kaizen pilot is not an additional merge condition. The pilot is not active. Its reporting plan and recorded limits are in [`docs/governance/kaizen/pr-checklist-pilot.md`](docs/governance/kaizen/pr-checklist-pilot.md).

### Collaboration workflow

Follow [`docs/agents/collaboration.md`](docs/agents/collaboration.md) for provider-neutral branch, worktree, pull request, review, and handoff rules. Use [`docs/agents/local-skills.md`](docs/agents/local-skills.md) and the pinned [`skill manifest`](.agents/skills/manifest.yml) before relying on an optional global Agent plugin. For Codex/Gemini assignment, Design/UI delegation, parallel worker execution, or worker fallback/takeover, follow [docs/agents/worker-roles.md](docs/agents/worker-roles.md). This includes Gemini unavailability and token/quota exhaustion.

Lần sau tôi mà có nói là push lên main thì push lên luôn.

### API contract synchronization

When adding, changing or removing a Server/Gateway HTTP API, follow
[the contract exporter workflow](tools/contract-exporter/README.md). Review the canonical
OpenAPI/owner semantics and affected source fingerprints, regenerate the catalog, and pass
`node tools/contract-exporter/export.mjs --check` plus the tool regression before publishing.
This is a contributor instruction; GitHub merge enforcement depends on actual required-check settings.

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

### Actual progress recording

Use [`tools/progress-tracker/README.md`](tools/progress-tracker/README.md) and the repository-owned
Execution Register/Work Journal for Delivery Card progress. In conversation, only an explicit
`Bắt đầu <Card ID>`, `Dừng`, `Tiếp tục` or `Hoàn thành <Card ID>` instruction authorizes the
corresponding tracker action; after one card is active, the Card ID may be omitted for stop/resume/
complete. Do not infer a timer action from generic wording such as `làm tiếp đi`. Do not substitute
planned hours for actual effort. A retrospective estimate may be recorded only when the user
explicitly confirms the estimate and the correction remains attributable in the Work Journal.

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
