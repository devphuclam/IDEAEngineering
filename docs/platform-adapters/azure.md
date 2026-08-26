# Azure DevOps Platform Adapter

This document describes the implemented Azure DevOps collaboration adapter. It remains usable
without an Azure account because the offline transport and live gates are separate.

Azure is optional; the Core Workspace remains usable without Azure.

## Independent adapter concerns

Adopt these concerns independently:

- **Azure Repos and work tracking**: Azure Boards and Repos provide the Work Item, source host,
  branch policy, PR, and canonical queue surfaces.
- **Local Agent Runner V1**: optional Linux Dev Container or WSL2 execution only.
- **Out of scope**: Azure Pipelines, Azure infrastructure, deployment, Managed Runner, process mutation,
  and policy bypass.

Choosing one concern does not silently select the others, an application Stack Profile, or a deployment target.

## Company information to obtain

Before enabling an adapter, the company must provide and approve:

- Azure DevOps Organization, Project, Repository, and fully qualified target ref.
- Project/Repository IDs, process profile or complete custom state map, and observed process fingerprint
  when required.
- Microsoft Entra tenant, approved named identities, read permissions, policy visibility, and network boundary.
- The exact live validation allowlist and responsible administrator for queue bootstrap/adoption.

Record these values outside the template's committed example. The [safe example configuration](../../config/azure-adapter.env.example) contains only self-referential placeholders.

## Identity and credential boundaries

Keep named developer identities, federated pipeline identities, and managed runtime identities separate. Use the least privilege required for each boundary. Store unavoidable secrets only in an approved secret store; never commit them to a Generated Project or bake them into a container image.

Entra user authentication is attempted first. PAT fallback is disabled by default and is allowed only
when the company explicitly approves the configured environment-variable source. Credentials are
never committed, serialized, included in URLs/arguments, or persisted as evidence.

## Safety boundary

Bootstrap is an explicit queue-only mutation and is bound to an unchanged preview digest. It may
create or reuse one queue Coordination Work Item and its reserved managed fields/tags only.
Permission probes are read-only. Normal collaboration uses revision-guarded Work Item mutations,
immutable comments, one canonical queue, and PR completion without target bypass. The local cache is
disposable; recovery reads provider state first and repairs only an already-recorded pending
publication.

The offline pilot uses a network-denied fake and is labeled simulated. The live harness is separately
gated by exact target and permission configuration and reports missing prerequisites as `not-run`.
The Core verifier remains usable without Azure CLI, credentials, or network access.

## Operational boundaries

Company onboarding records the approved source host, subscription scope, CI policy, role boundaries,
network restrictions, and responsible administrators. The adapter does not provision, does not delete,
and does not mutate Azure infrastructure or administrator-owned settings. There is no live check in
the Core Workspace; Azure CLI and credentials are optional, and pipelines are optional.

See [`docs/agents/azure-devops-platform-adapter.md`](../agents/azure-devops-platform-adapter.md)
for the operator workflow and [`specs/002-azure-devops-adapter/quickstart.md`](../../specs/002-azure-devops-adapter/quickstart.md)
for the complete validation procedure.
