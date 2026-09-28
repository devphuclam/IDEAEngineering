# Agent Collaboration Workflow

This is the provider-neutral collaboration contract for the Development Workspace Template. It applies whether a Platform Adapter represents a Work Item in GitHub Issues, Azure Boards, or another tracker.

## Work Item to delivery flow

1. Read the Work Item and its acceptance criteria before changing files.
2. Claim the Work Item through the selected Platform Adapter, then create a focused branch from the agreed base branch.
3. Use one isolated worktree per Agent task. Do not allow concurrent Agent work in one branch or one worktree.
4. Keep the branch focused on one Work Item and use a pull request or the equivalent review surface for integration.
5. Complete the author section of the [shared PR template](../../.github/pull_request_template.md), then run the public verification command and focused tests before requesting review. Record actual results and any unrun checks.
6. A reviewer other than the author completes the reviewer section using the [repository PR review procedure](pull-request-review.md) and submits an approval. Recheck changed files and affected tests when a commit changes after review.
7. Merge only after that reviewer approval, when required checklist rows pass or have a reasoned N/A, blocking review comments are resolved, and all checks required by repository policy have passed.
8. Record decisions, verification evidence, blockers, and the next handoff in the Work Item.

## Review intent

Every change has one human review intent. During the PR checklist pilot, a reviewer other than the author must complete the reviewer checklist and approve before merge. The provider policy remains `minimum_human_approvals: 0`; it does not technically enforce this manual pilot rule.

The Core contract records review intent and checklists; provider-specific approval semantics belong in the selected Platform Adapter. Follow the explicit manual reviewer requirement above even if GitHub branch protection does not enforce it.

The PR checklist supports the review decision but does not create an approval event. Follow the selected provider's actual review and branch protection rules.

## Handoff

A handoff names the current branch, worktree, Work Item, changed seams, verification commands, unresolved risks, and the exact next action. A receiving Agent starts by reading the local instructions, the Work Item, and the handoff before editing.

Provider-specific tracker commands do not belong in this document; see `docs/agents/issue-tracker.md` and its selected adapter.
