---
status: accepted
---

# Coordinate shared Agent work through isolated runs

A Generated Project will support multi-user Agent collaboration through a Shared Agent Workspace rather than a shared Codespace, filesystem, branch, or Agent session. Durable Work Items, Work Claims, Run Evidence, and an Integration Queue form the shared coordination surface, while every Agent Run has one Run Owner and executes in exactly one isolated Agent Sandbox; this prevents concurrent work from overwriting mutable state while still allowing explicit handoff and dependency-aware integration.

## Considered options

- A shared Codespace or Live Share session was rejected because host ownership, lifecycle, and a shared mutable checkout do not provide independent or durable Agent execution.
- Independent personal Agent environments without orchestration were rejected because they cannot reliably prevent duplicate claims, expose overlapping Change Scopes, or preserve a common audit trail.
- A mandatory cloud coordinator was rejected because the Core Workspace must remain usable before an Azure organization, company identity policy, or AI Workload Credential is available.

## Consequences

- The Agent Orchestration Layer is optional and adapter-based. The initial path uses Local Agent Runners and a GitHub Platform Adapter; a future managed Azure path may add an Agent Control Plane and Managed Agent Runners without changing the Core Workspace contract.
- Concurrent Agent Runs may modify the same path, but semantic overlap is serialized through dependencies or the Integration Queue rather than hidden by file locks.
- Agent Sandboxes are disposable. Recovery depends on Agent Checkpoints and durable Run Evidence, not uncommitted sandbox state.
- A Managed Agent Runner cannot use an uploaded personal ChatGPT or Codex session. It remains disabled until the organization approves an AI Workload Credential.

The approved behavior and acceptance criteria are defined in the [Shared Agent Workspace design](../superpowers/specs/2026-08-13-shared-agent-workspace-design.md).
