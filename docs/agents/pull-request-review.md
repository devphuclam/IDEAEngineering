# Pull Request Review Checklist

Use the shared [Pull Request template](../../.github/pull_request_template.md) for every PR in
this repository. The author completes the self-check before requesting review. A reviewer other
than the author completes the reviewer section and submits an approval after all required checks
pass.

## How to record a check

- `PASS` (`Đạt`): checked and supported by a diff, command result, or other stated evidence.
- `FAIL` (`Không đạt`): a required condition is not met. Keep the PR out of merge until it is corrected or the
  Work Item is explicitly changed by its owner.
- `N/A` (`Không áp dụng — lý do`): the condition does not apply to this change; state why. An
  empty status is not `N/A`.
- `NOT RUN`: a test or repository check was not executed. State why and what remains unverified;
  do not label it `PASS`.

Use the test-result table for commands, outcomes, and evidence. `PASS` means that command ran and
passed for the recorded source revision and environment. It does not imply broader behavior that
the command did not exercise.

## Author and reviewer responsibilities

The author checks each changed file for scope, debug or temporary content, unrelated changes,
input/error handling, environment assumptions, and secret-like values. The author runs the required
repository verification and applicable focused tests from a clean checkout, records actual results,
and describes changes involving access/security, data/schema, or deployment.

The reviewer checks the diff against the Work Item, examines logic and existing behavior, verifies
the author's higher-risk claims against the change and evidence, reviews test results, and resolves
required comments. The reviewer records a status and short evidence pointer or reason for each row.

If a commit changes after review, the reviewer inspects the affected files again and reruns or
rechecks the relevant tests. A prior review does not cover code added afterward. Resolve or renew a
review decision according to the repository's GitHub rules.

## Merge condition

Merge only when required checklist rows are `PASS` or `N/A` with reasons, required change requests
and blocking comments are resolved, and every check required by repository policy has passed. If a
required check is not configured or was not run, record that fact accurately; do not imply that the
repository has an automated gate it does not have.

This pilot procedure requires a reviewer other than the author. The current
`reviewIntent.minimumHumanApprovals: 0` setting does not make GitHub enforce that manual gate; it
remains possible for a user with permission to merge without satisfying the procedure. Do not
describe the setting as an enforced independent-approval rule. GitHub branch protection and
organization policy remain authoritative for technical enforcement.
