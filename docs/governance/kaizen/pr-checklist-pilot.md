# PR Checklist Kaizen — Optional Measurement Plan

| Field | Value |
|---|---|
| Improvement | `KAIZEN-PR-CHECKLIST-001` |
| Work Item | [#6 — optional PR checklist guidance](https://github.com/devphuclam/IDEAEngineering/issues/6) |
| Pilot repository | `devphuclam/IDEAEngineering` |
| Status | `REPORT-ONLY / NOT STARTED`; this plan is optional and creates no PR requirement |
| Pilot and maintenance owner | `devphuclam` (repository owner and Work Item assignee) |
| Start | Not started. A future pilot requires an explicit owner decision; merge does not start it. |
| End | Not applicable unless a pilot is explicitly started; then the first 10 PRs targeting `main` or 8 weeks after start, whichever comes first. |

## Purpose

This file preserves the proposed measurement method for company reporting. The owner has decided
that the Kaizen is a reporting deliverable, not a mandatory repository process. No pilot has been
started, no pilot data has been collected, and this plan does not require future participation. A
pilot may be started only by a later explicit owner decision. No reduction in rework, review time,
or defects is claimed.

## Historical baseline

GitHub history was inspected on 2026-09-28. Only one merged PR was available before this pilot:

| Sample | PR | Observation | Limit |
|---|---|---|---|
| Historical merged PRs | [#5](https://github.com/devphuclam/IDEAEngineering/pull/5) | The PR body had a change summary and verification notes. GitHub recorded no review event, review comment, or issue comment. | `n=1`; its ready-for-review-to-approval time is unavailable because there was no approval. No conclusion about typical rework or review duration can be drawn. |

The previous PR template had a short author checklist, but the merged PR body did not contain it.
This is a single observed consistency gap, not a measured repository-wide rate. The baseline is
`INSUFFICIENT`; no further sample is required unless an optional pilot is explicitly started.

## What to record if a pilot is explicitly started

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

If the owner later starts a pilot, maintainers may compare available pre-pilot and pilot samples using:

1. Checklist completion rate: complete PRs divided by pilot PRs.
2. PRs with checklist-omission rework: affected PRs divided by PRs with enough review evidence to assess; show the assessed and total sample sizes and the `UNASSESSED` count.
3. Median ready-for-review-to-first-approval time, only for PRs with both timestamps.
4. Author and reviewer feedback and recurring `N/A` reasons.

Show sample sizes beside every rate or median. State when either sample is too small, has no
comparable approval events, or is otherwise incomplete. Do not claim improvement from missing or
non-comparable data. If fewer than 10 pilot PRs are available at the 8-week end, report the actual
sample; the owner may decide whether another pilot window is worthwhile.

Any future decision to adopt, revise, or stop the optional guidance must be recorded with its
evidence and date in the Work Item. Until then, the template and procedure remain optional aids;
they do not change repository review or merge policy.

## Maintenance

`devphuclam` is the recorded owner of these optional reporting artifacts. Repository maintainers may
propose edits when feedback or a repository policy change makes them useful. No pilot-close or annual
review is required unless the owner chooses to adopt this process later; record any ownership
transfer in the Work Item.
