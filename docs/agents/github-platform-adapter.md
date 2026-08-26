# GitHub Platform Adapter: Work Items

This adapter represents Work Items as GitHub Issues and implements tracker operations with the `gh` CLI.

## Author self-review checklist

The pull request template records the author's review intent:

- [ ] I read the Work Item acceptance criteria and checked each one against the diff.
- [ ] I ran the public verification command and focused tests from a clean checkout.
- [ ] I checked documentation references, secret-like configuration, and branch scope.
- [ ] I recorded remaining risks or blockers in the Work Item.

GitHub does not record the pull request author's checklist as an independent approval. This
repository therefore does not invent an approval event. The provider-neutral review intent remains
`minimum_human_approvals: 0`; its JSON/API serialization is `reviewIntent.minimumHumanApprovals: 0`.
Effective GitHub rules still win and may require stricter independent review. A requester vote is not treated as an independent approval unless the selected provider
explicitly records that event.

## Conventions

- **Create**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment**: `gh issue comment <number> --body "..."`.
- **Apply or remove labels**: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- **Close**: `gh issue close <number> --comment "..."`.

Infer the repository from `git remote -v`; `gh` does this automatically inside a clone.

Provider selection is explicit in `agent-workspace.config.json`. A GitHub remote never selects
GitHub implicitly, and the Azure adapter does not invoke `gh` when Azure is selected.

The GitHub compatibility surface also exposes the provider-neutral revisioned queue and policy
contracts. GitHub preparation is read-only `not-applicable`; normal enqueue may create/reuse the
exact coordination Issue/label pair and recovery reconstructs state from its immutable comment
stream.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repository treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read**: `gh pr view <number> --comments` and `gh pr diff <number>`.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`, then retain only `authorAssociation` values `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE`.
- **Comment, label, or close**: `gh pr comment`, `gh pr edit --add-label` or `--remove-label`, and `gh pr close`.

GitHub shares one number space across issues and PRs. Resolve a bare `#42` with `gh pr view 42`, falling back to `gh issue view 42`.

## Skill operations

- **Publish to the issue tracker**: create a GitHub Issue.
- **Fetch the relevant ticket**: run `gh issue view <number> --comments`.

## Wayfinding operations

The **map** is one issue whose **child** issues are tickets.

- **Map**: label one issue `wayfinder:map` and store Notes, Decisions-so-far, and Fog in its body. Create it with `gh issue create --label wayfinder:map`.
- **Child**: link an issue to the map as a GitHub sub-issue with `gh api`. Where sub-issues are unavailable, add the child to the map's task list and put `Part of #<map>` at the top of the child body. Apply one `wayfinder:<type>` label: `research`, `prototype`, `grilling`, or `task`.
- **Blocking**: use GitHub's native issue dependencies. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the numeric database ID returned by `gh api repos/<owner>/<repo>/issues/<n> --jq .id`. Where dependencies are unavailable, put `Blocked by: #<n>, #<n>` at the top of the child body. A child is unblocked when every blocker is closed.
- **Frontier**: list the map's open children, remove assigned children and those with open blockers, and select the first remaining child in map order.
- **Claim**: run `gh issue edit <n> --add-assignee @me` as the session's first write.
- **Resolve**: run `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer and link to the map's Decisions-so-far.
