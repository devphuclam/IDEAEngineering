# IDEA Engineering

IDEA Engineering is the product repository for C1: controlled engineering data that begins as PDM, evolves toward PLM inside the same application, and becomes part of an IDEA Platform only after an independent C2 exists.

The repository is currently establishing the PG0 governance, clean-room, domain, quality, and architecture baseline. Production implementation and technology choices are not yet authorized by this phase.

## Read first

| Need | Authoritative entry point |
|---|---|
| Canonical product language | [CONTEXT.md](CONTEXT.md) |
| Audited icVault/DDM knowledge | [Product knowledge index](docs/product/knowledge/README.md) |
| C1 PDM-to-PLM architecture | [Product lifecycle architecture](docs/architecture/idea-product-lifecycle-architecture.md) |
| Repository bootstrap architecture | [PG0 bootstrap design](docs/superpowers/specs/2026-08-26-idea-engineering-repository-bootstrap-pg0-design.md) |
| Standards and edition baseline | [Standards register](docs/governance/standards-register.md) |
| Accepted architecture decisions | [ADR index](docs/adr/README.md) |

## Verification

The inherited Core Workspace verifier remains the public clean-checkout check while PG0 replacement tooling is designed:

```bash
./scripts/verify-template
```

Passing that command verifies the current repository contract; it is not evidence that IDEA product requirements, runtime behavior, or ISO conformity have been achieved.

## Inherited workspace references

Until PG0 records a retain/replace/remove decision, repository contributors must also follow the
[Core Workspace contract](docs/core-workspace.md), [development environment guide](docs/development-environment.md),
[Generated Project onboarding](docs/generated-projects.md), [Spec Kit workflow](docs/agents/spec-kit.md),
[Template Releases](docs/releases/), [template migration guidance](docs/template-migrations.md), and
[Azure Platform Adapter boundary](docs/platform-adapters/azure.md). Operational references are
[AGENTS.md](AGENTS.md), [the example environment](config/template.env.example),
[the Azure adapter example](config/azure-adapter.env.example), and the
[Docker Desktop/WSL recovery script](scripts/docker-wsl-recovery.sh). These are inherited repository
contracts, not C1 product capabilities.

## Research boundary

Raw icVault/DDM evidence, captures, installers, binaries, schema dumps, and proprietary material remain outside this repository. Only classified findings, traceable design lessons, accepted decisions, and independently authored product artifacts enter IDEA Engineering through the [clean-room transfer register](docs/governance/clean-room-transfer-register.md).

The repository originated from Development Workspace Template release `0.1.1`; [.template-provenance](.template-provenance) retains that history while the controlled PG0 transformation proceeds.
