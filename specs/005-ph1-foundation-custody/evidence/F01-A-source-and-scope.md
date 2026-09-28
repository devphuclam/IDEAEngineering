# F01-A Source and Scope

Captured: 2026-09-28 (Asia/Ho_Chi_Minh)

## Source and work item

- Source commit: `03d34d36145186102460d135d8d670c31c63b8ea`
- Tested application source commit: `c600f7be41f0732cb57d521017bae0565ab229bd` (includes the cross-platform Maven Wrapper line-ending fix)
- Branch: `codex/ph1-foundation-f01`
- Worktree: `C:/Users/TD-999/.codex/worktrees/ph1-foundation-f01/IDEAEngineering`
- GitHub Work Item: [#12 — F01-A buildable application foundation](https://github.com/devphuclam/IDEAEngineering/issues/12)
- Delivery Card: [F01-A in the approved PH1 CARIO plan](../../../docs/product/instances/idea-engineering/planning/idea-technical-pilot-kanban-cario.md)
- Spec Kit execution source: [tasks T001–T012](../tasks.md)

## Authorization and boundary

The [PG4 Gate Record](../../004-technical-pilot-readiness/pg4-gate-record.md) records `COMPLETE / PASS` for
`IE-INC-PH1-FOUNDATION-CUSTODY-001`: PH1 F01–F05, 72 planned hours, one Gateway/Vault endpoint.
This work item implements only F01-A's buildable project foundation. It does not change Feature,
Spec, Tech, Q-15, Product Scope, or PG3/PG4 decisions.

F01-A covers build-only Server, Web, Desktop, Workspace and test-project scaffolds; dependency
intake; reproducible build commands; and actual basic-check results. It does not add product
behavior or implement F01-B secret scanning, F02–F05, Gateway/Vault transfer, a second Vault,
replication, failover or commercial distribution.

The future multi-Vault path remains an approved architecture constraint for later work. Nothing in
F01-A is evidence that multi-Vault behavior has been implemented or tested.

## Capture state

The worktree was clean when this source/scope record was first captured. The user then explicitly
started F01-A; its active effort is recorded by the repository Progress Tracker/Work Journal. All
four approved smoke/build checks later passed from clean platform-specific archives of tested
commit `c600f7be41f0732cb57d521017bae0565ab229bd`. Commands, tools, archive hashes, the wrapper
issue and scope limits are recorded in [F01-A-build-results.md](F01-A-build-results.md). The card
remains open for Project Reviewer closure; no product-level acceptance is implied.
