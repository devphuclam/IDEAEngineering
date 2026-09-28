# Pull Request Review Guidance

Use the shared [Pull Request template](../../.github/pull_request_template.md) when its prompts are
helpful. It is an optional Kaizen aid, not a condition for requesting review, approval, or merge.
The Kaizen pilot is not active. Follow the Work Item, actual repository policy, and any configured
branch protection or organization rules for required reviews and checks.

## How to record a check

- `PASS` (`Đạt`): checked and supported by a diff, command result, or other stated evidence.
- `FAIL` (`Không đạt`): the checked condition is not met. Record the issue and resolve it when it is
  required by the Work Item or repository policy; a status in this optional checklist does not by
  itself block merge.
- `N/A` (`Không áp dụng — lý do`): the condition does not apply to this change; state why. An
  empty status is not `N/A`.
- `NOT RUN`: a test or repository check was not executed. State why and what remains unverified;
  do not label it `PASS`.

Use the test-result table for commands, outcomes, and evidence. `PASS` means that command ran and
passed for the recorded source revision and environment. It does not imply broader behavior that
the command did not exercise.

## Author and reviewer responsibilities

The author should check changed files for scope, debug or temporary content, unrelated changes,
input/error handling, environment assumptions, and secret-like values. Run repository-required
verification and applicable focused tests as directed by repository policy; record actual results
and describe changes involving access/security, data/schema, or deployment.

The reviewer should check the diff against the Work Item, examine logic and existing behavior,
verify higher-risk claims against the change and evidence, review test results, and resolve required
comments. If using the optional template, record a status and short evidence pointer or reason for
each completed row.

If a commit changes after review, recheck affected files and relevant tests according to the
repository's review policy; a prior review does not cover code added afterward. Record or renew the
review decision through the selected Platform Adapter when required.

## Merge condition

Merge according to the Work Item, configured branch protection, organization rules, and other
repository policy. Resolve blocking comments and required change requests, and pass checks that
those rules require. This optional checklist creates no additional approval or merge gate. Record
unrun checks accurately; do not imply that the repository has an automated gate it does not have.

The selected platform may not technically enforce a manual review procedure. Consult its adapter
and repository settings before describing any step as an automated gate.
