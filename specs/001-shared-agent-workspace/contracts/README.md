# Contracts: Shared Agent Workspace

**Feature**: 001-shared-agent-workspace

The optional Agent Orchestration Layer package (`tools/agent-workspace/`) exposes two contract
surfaces:

| Document | Scope |
|---|---|
| [`cli.md`](cli.md) | The `workspace` CLI: commands, options, JSON output, exit codes. |
| [`adapters.md`](adapters.md) | Provider-neutral TypeScript port interfaces and shared domain types. |
| [`state-files.md`](state-files.md) | Local run context, checkpoint, and evidence file formats. |

CLI commands are the user-facing surface; adapter ports are the replaceable boundaries
(Work Item provider, source host, runner, Agent Driver, claim store, evidence store, integration
queue). Both are validated by the black-box and contract test suites described in `quickstart.md`.
