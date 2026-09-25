# Architecture Decision Index

## IDEA Engineering product decisions

- [ADR-0002 — C1 evolves from PDM to PLM; Platform D waits for C2](0002-c1-evolves-from-pdm-to-plm-before-platform.md)
- [ADR-0003 — No IDEA code runs inside design tools](0003-no-code-runs-inside-design-tools.md)
- [ADR-0004 — Start C1 as a modular monolith with deep modules](0004-start-c1-as-a-modular-monolith.md)
- [ADR-0005 — Use immutable Generations and atomic Check-in Change Sets](0005-use-immutable-generations-and-atomic-change-sets.md)
- [ADR-0006 — Bind Reservations to Document and Workspace](0006-bind-reservations-to-document-and-workspace.md)
- [ADR-0007 — Use generic vaulting and external Format Intelligence](0007-use-generic-vaulting-and-external-format-intelligence.md)
- [ADR-0008 — Treat core product documents as controlled information-item classes](0008-treat-core-product-documents-as-controlled-classes.md)
- [ADR-0010 — Separate operational configuration, governed policy, and solution-package paths](0010-separate-configuration-governance-paths.md)
- [ADR-0011 — Give each Logical Document one governing Project](0011-one-governing-project-per-logical-document.md)
- [ADR-0012 — Use principal-role-scope RBAC for product and administration authority](0012-use-principal-role-scope-rbac.md)
- [ADR-0013 — Separate Artifact control and data planes and support multi-location custody](0013-separate-artifact-control-and-data-planes.md)

ADR-0010–0013 were accepted through the Product Decision Authority decision reported on
2026-09-25. ADR-0009 was also reported within that review, but retains `proposed` until its
outdated graphical-workflow claim is reconciled against the approved Feature/Spec boundary.
The exact Proposed source hashes are retained in
[IE-CHG-PDA-APPROVAL-004](../product/instances/idea-engineering/registers/CHG-2026-09-25-pg2-pg3-approval.md).

### Proposed product decision pending consistency correction

- [ADR-0009 — Use DDM as the behavioral baseline and Aras as the quality benchmark](0009-use-ddm-baseline-and-aras-quality-benchmark.md)

## Inherited template decision

[ADR-0001 — Coordinate shared Agent work through isolated runs](0001-coordinate-shared-agent-work-through-isolated-runs.md) belongs to inherited Development Workspace Template tooling. It is not part of C1 product behavior and remains only until its PG0 retain/remove disposition is implemented.

Read the product ADRs for PDM, PLM, format, workspace, concurrency, or Platform design. Read ADR-0001 only when changing the inherited Agent Workspace tooling.
