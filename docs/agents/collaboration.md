# Agent Collaboration Workflow

This is the provider-neutral collaboration contract for the Development Workspace Template. It applies whether a Platform Adapter represents a Work Item in GitHub Issues, Azure Boards, or another tracker.

## Work Item to delivery flow

1. Read the Work Item and its acceptance criteria before changing files.
2. Claim the Work Item through the selected Platform Adapter, then create a focused branch from the agreed base branch.
3. Use one isolated worktree per Agent task. Do not allow concurrent Agent work in one branch or one worktree.
4. Keep the branch focused on one Work Item and use a pull request or the equivalent review surface for integration.
5. Run the public verification command and the focused tests before requesting review.
6. Record decisions, verification evidence, blockers, and the next handoff in the Work Item.

## Review intent

Every change has one human review intent. The policy value is `minimum_human_approvals: 0`: this permits the author to satisfy the review intent where the selected platform supports author review, while teams may require an independent reviewer through their platform policy.

The Core contract records review intent and checklists, not a provider-specific approval event. Provider-specific approval semantics belong in the selected Platform Adapter.

## Handoff

A handoff names the current branch, worktree, Work Item, changed seams, verification commands, unresolved risks, and the exact next action. A receiving Agent starts by reading the local instructions, the Work Item, and the handoff before editing.

Provider-specific tracker commands do not belong in this document; see `docs/agents/issue-tracker.md` and its selected adapter.
