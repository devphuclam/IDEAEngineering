# IDEA Engineering

IDEA Engineering is the internal C1 product: controlled engineering data that starts with PDM and
can grow toward PLM in the same application. An IDEA Platform requires an independent C2.

## Start here

The project has **eight authored product-document drafts**, three management decision briefs,
UI prototypes and a delivery roadmap. It is still in analysis and design; the product Core is not
implemented. Existing repository tools are inherited development infrastructure, not the product.

| What you need | Where to read | What it owns |
|---|---|---|
| The eight DOCs written for IDEA | [Product-document catalogue](docs/product/instances/idea-engineering/README.md) | Product-specific content, exact versions and review status |
| Feature, Spec and Tech for management | [Decision briefs](docs/product/instances/idea-engineering/README.md#two-layer-reading-model) | Three decision views of the detailed DOCs; not separate requirement authorities |
| Roadmap and work to do next | [DOC-07](docs/product/instances/idea-engineering/DOC-07-mvp-roadmap-and-delivery-plan.md#32-december-2026-schedule-and-task-appendix) | The December plan, with its 56-task appendix and Gantt |
| Templates for authoring a DOC or supporting record | [Class-template index](docs/product/definition/README.md) | Reusable structure and authoring rules, not the IDEA product content |
| UI design and simulated interactions | [Prototype guide](prototypes/README.md) | Current review prototype, retained comparison versions and limits of the HTML simulation |
| Product terminology and architecture decisions | [CONTEXT.md](CONTEXT.md), [ADR index](docs/adr/README.md), [lifecycle architecture](docs/architecture/idea-product-lifecycle-architecture.md) | Shared vocabulary and documented design decisions |
| Reference-product findings and standards | [Knowledge index](docs/product/knowledge/README.md), [standards register](docs/governance/standards-register.md) | Classified evidence and applicable source editions |
| Delivery workflow and previous increments | [Spec Kit workflow](docs/agents/spec-kit.md), [controlled-documentation increment](specs/003-controlled-documentation/spec.md) | Feature delivery artifacts and the history of setting up the documentation system |
| Earlier prototype Word reports | [Report index](docs/reports/README.md) | Retained communication snapshots, not current product specifications |

The two sets of DOC-01…DOC-08 have different purposes: `docs/product/definition/` contains the
**templates**; `docs/product/instances/idea-engineering/` contains the **documents written for
IDEA**. The earlier Spec Kit increment established the first set and its controls. Subsequent
analysis and design populated the second set.

Use the product-document catalogue and its linked version history for current approvals and open
points. A written draft, an accepted prototype or a finished documentation task does not establish
a product-gate PASS, production readiness or ISO conformity.

## Continue from the roadmap

Start with [DOC-07 and its task appendix](docs/product/instances/idea-engineering/DOC-07-mvp-roadmap-and-delivery-plan.md#32-december-2026-schedule-and-task-appendix).
A01 reconciles the versions actually presented to management with the controlled sources; it does
not ask for the documents to be written again. Follow the recorded dependencies for remaining
design decisions, company prerequisites and early format checks.

Prepare the next bounded product increment through the [Spec Kit workflow](docs/agents/spec-kit.md).
Complete its review and planning checks and the applicable readiness gates before production code.
Keep feature `003` as the documentation-system delivery history. The prototype supplies design
evidence, not production code.

For management-facing Word work, read the [writing and layout guide](docs/agents/management-documents.md).
It identifies the user's editorial copies and how to preserve them.

## Verification and inherited workspace

The repository originated from Development Workspace Template release `0.1.1`;
[.template-provenance](.template-provenance) retains that history. PG0 transformation is documented in
the [bootstrap design](docs/superpowers/specs/2026-08-26-idea-engineering-repository-bootstrap-pg0-design.md).
Until PG0 records a retain/replace/remove decision, the public repository check remains:

```bash
./scripts/verify-template
```

This checks the repository contract, not product behavior or standards conformity. Inherited
"Core Workspace" means development infrastructure; it is distinct from the IDEA product Core.

Contributors must also follow the [Core Workspace contract](docs/core-workspace.md),
[development environment guide](docs/development-environment.md),
[Generated Project onboarding](docs/generated-projects.md), [Template Releases](docs/releases/),
[template migration guidance](docs/template-migrations.md), and
[Azure Platform Adapter boundary](docs/platform-adapters/azure.md). Operational references are
[AGENTS.md](AGENTS.md), [the example environment](config/template.env.example),
[the Azure adapter example](config/azure-adapter.env.example), and the
[Docker Desktop/WSL recovery script](scripts/docker-wsl-recovery.sh).

## Research boundary

Raw icVault/DDM evidence, captures, installers, binaries, schema dumps and proprietary material
remain outside this repository. Classified findings, traceable design lessons, accepted decisions
and independently authored product artifacts enter through the
[clean-room transfer register](docs/governance/clean-room-transfer-register.md).
