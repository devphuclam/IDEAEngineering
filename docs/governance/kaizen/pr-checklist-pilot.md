# Pull Request Checklist Pilot

| Field | Value |
|---|---|
| Improvement | `KAIZEN-PR-CHECKLIST-001` |
| Work Item | [#6 — standardize pull request checks and run a pilot](https://github.com/devphuclam/IDEAEngineering/issues/6) |
| Pilot repository | `devphuclam/IDEAEngineering` |
| Status | `PILOT-PLANNED`; template and procedure take effect when merged |
| Pilot and maintenance owner | `devphuclam` (repository owner and Work Item assignee) |
| Start | First PR opened after this change is merged |
| End | The first 10 PRs targeting `main` or 8 weeks after start, whichever comes first |

## Purpose

Check whether the shared author and reviewer checklist is understandable, used consistently, and
helps catch basic omissions before merge. This pilot tests the process; it does not assume the
checklist already reduces rework or review time.

## Historical baseline

GitHub history was inspected on 2026-09-28. Only one merged PR was available before this pilot:

| Sample | PR | Observation | Limit |
|---|---|---|---|
| Historical merged PRs | [#5](https://github.com/devphuclam/IDEAEngineering/pull/5) | The PR body had a change summary and verification notes. GitHub recorded no review event, review comment, or issue comment. | `n=1`; its ready-for-review-to-approval time is unavailable because there was no approval. No conclusion about typical rework or review duration can be drawn. |

The previous PR template had a short author checklist, but the merged PR body did not contain it.
This is a single observed consistency gap, not a measured repository-wide rate. Keep the baseline
as `INSUFFICIENT` until a comparable sample exists.

## What to record for each pilot PR

Use the PR number as the row key. Record dates and elapsed times from GitHub's timestamps in UTC.
Do not record credentials or personal performance rankings.

| Field | Recording rule |
|---|---|
| Checklist completion | `Complete` only when every row has a status and every `N/A` has a reason; otherwise `Incomplete`. |
| Separate reviewer | Record whether a reviewer other than the author completed the reviewer section and submitted an approval event. |
| Checklist omission rework | Count a PR when a review comment or follow-up commit shows that an item in the checklist was missed. Cite the PR comment or commit. A PR counts at most once in the rate; retain the number and category of omissions separately. Report how many PRs had enough review evidence to assess; unreviewed PRs are `UNASSESSED`, not zero rework. |
| Ready-to-approval time | Elapsed hours from GitHub's `Ready for review` event to the first reviewer `APPROVED` event. If no such approval occurs, record `N/A — no approval event`; do not substitute merge time. |
| Required checks | Record the configured checks and their final status. If none are configured, record `None configured`. |
| User feedback | After review, ask the author and reviewer whether any row was unclear, repetitive, missing, or hard to evidence. Record the suggested change and disposition. |

| PR | Checklist complete? | Missed-item rework? (count/category/evidence) | Ready → first approval (hours or reason N/A) | Required checks result | Feedback / follow-up |
|---|---|---|---|---|---|

## Compare and decide

At pilot end, maintainers compare the available pre-pilot and pilot samples using:

1. Checklist completion rate: complete PRs divided by pilot PRs.
2. PRs with checklist-omission rework: affected PRs divided by PRs with enough review evidence to assess; show the assessed and total sample sizes and the `UNASSESSED` count.
3. Median ready-for-review-to-first-approval time, only for PRs with both timestamps.
4. Author and reviewer feedback and recurring `N/A` reasons.

Show sample sizes beside every rate or median. State when either sample is too small, has no
comparable approval events, or is otherwise incomplete. Do not claim improvement from missing or
non-comparable data. If fewer than 10 pilot PRs are available at the 8-week end, report the actual
sample and decide whether another pilot window is needed.

Before formal adoption, repository maintainers record one decision: adopt as-is, revise and extend
the pilot, or stop the change. Include the data, feedback, remaining issues, and decision date in
the Work Item. The template remains marked as pilot guidance until that decision is recorded.

## Maintenance

`devphuclam` is accountable for maintaining the template and this procedure. Repository maintainers
may propose edits when the pilot finds a repeated omission, a confusing check, or a repository
policy change. Review the procedure at pilot close and at least annually thereafter; record any
transfer of ownership in the Work Item.
