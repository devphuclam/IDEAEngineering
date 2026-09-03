# IDEA Engineering

IDEA Engineering is the product repository for C1: controlled engineering data that begins as PDM, evolves toward PLM inside the same application, and becomes part of an IDEA Platform only after an independent C2 exists.

## Current state

| Area | Current disposition | Meaning |
|---|---|---|
| PG0 foundation | Prepared; no retained `PG0 PASS` decision | Governance, clean-room, domain, standards and architecture material exists, but the repository does not claim that the gate has passed. |
| Controlled-documentation increment | Task execution complete; specification is `Draft`; Validation Pack is `PARTIAL` | Feature `003-controlled-documentation` produced the catalogue, contracts and validation structure. Treat it as setup history, not as the place for the next product feature. |
| `DOC-01`…`DOC-08` | Instruction-only templates | The eight Markdown files define where product information belongs. They are not yet approved, substantively authored product documents. |
| UI prototype | Accepted design reference | The reviewed HTML snapshot demonstrates the chosen item-centric workspace and interaction direction. It remains synthetic prototype code, not a production baseline. |
| Supporting DOCX reports | Frozen historical snapshots | They help explain the prototype but do not own requirements, decisions or DDM evidence. No further report authoring is currently planned. |
| Production implementation | Not authorized | Runtime stack, API, database, identity provider, deployment topology and production format adapters remain open until the applicable requirements, architecture and gates are approved. |

These dispositions deliberately separate “material exists” from “reviewed”, “gate passed”, and
“production-ready”. `UNKNOWN`, `BLOCKED`, `NOT-RUN` and `PARTIAL` must not be rewritten as success.

## Read first

| Need | Authoritative entry point |
|---|---|
| Current state and next increment | This README |
| Canonical product language | [CONTEXT.md](CONTEXT.md) |
| Audited icVault/DDM knowledge | [Product knowledge index](docs/product/knowledge/README.md) |
| C1 PDM-to-PLM architecture | [Product lifecycle architecture](docs/architecture/idea-product-lifecycle-architecture.md) |
| Eight controlled document classes | [Product-definition template index](docs/product/definition/README.md) |
| Accepted UI design reference | [Prototype guide](prototypes/README.md) |
| Historical prototype reports | [Report index](docs/reports/README.md) |
| Repository bootstrap architecture | [PG0 bootstrap design](docs/superpowers/specs/2026-08-26-idea-engineering-repository-bootstrap-pg0-design.md) |
| Standards and edition baseline | [Standards register](docs/governance/standards-register.md) |
| Accepted architecture decisions | [ADR index](docs/adr/README.md) |

## Next bounded increment

Do not reopen `003-controlled-documentation` to build the product. Its output is the documentation
system that the next increment will use.

The recommended next increment is the first end-to-end controlled-document workflow: select a
Logical Document, Checkout, edit its working copy, Check-in with stale-change protection, submit an
exact Generation for review, approve or reject it, Release it, and inspect its audit history. Before
implementation:

1. transfer only the accepted prototype decisions into the owning IDEA requirements and interaction
   records (`DOC-03`, `DOC-04`, `DOC-06`, and `DOC-08`);
2. resolve any remaining behavior or terminology questions through domain review;
3. create a new Spec Kit feature with `$speckit-specify` rather than reusing feature `003`;
4. pass its clarify, plan, checklist/analyze and task gates before production implementation.

The prototype may be used as interaction evidence for that work. It must not be promoted wholesale
as the production implementation or treated as proof of DDM parity.

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
