# Contracts: Azure DevOps Collaboration Adapter

**Feature**: 002-azure-devops-adapter | **Package**: `tools/agent-workspace/`

These documents are normative for implementation. Feature 001 remains authoritative for the
meaning of Shared Agent Workspace entities; this feature revises provider seams where the current
TypeScript interfaces are GitHub-shaped.

| Document | Contract surface |
|---|---|
| [`provider-ports.md`](provider-ports.md) | Provider-neutral ports, revisioned mutations, queue, policy, verification, readiness |
| [`azure-adapter.md`](azure-adapter.md) | Azure auth, REST/Git mapping, endpoint versions, retries, error classification |
| [`github-adapter.md`](github-adapter.md) | GitHub append-reread-reconcile revisions, coordination-Issue queue, preparation, and effective policy mapping |
| [`canonical-records.md`](canonical-records.md) | Managed blocks, immutable receipts, publication recovery, Azure/GitHub canonical queue rules |
| [`provider-configuration.md`](provider-configuration.md) | Explicit GitHub default, shared non-secret configuration, auth fallback assertion, live allowlist gates |
| [`cli.md`](cli.md) | Provider-neutral CLI commands, options, JSON results, exit semantics |
| [`validation.md`](validation.md) | Offline contract matrix and gated live phases |

No contract authorizes Azure infrastructure, Azure Pipelines/application pipeline, Managed Agent
Runner implementation, direct protected-target pushes, policy bypass, process mutation, or secret
persistence.
