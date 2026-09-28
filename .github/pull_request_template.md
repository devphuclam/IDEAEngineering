> **Pilot:** Complete both sections for each PR. Follow `docs/agents/pull-request-review.md` for reviewer assignment and record feedback in Work Item #6.

## Purpose and scope

Work Item: #

What changes and why:

What is intentionally out of scope:

## Risk areas

Describe affected behavior, or write `N/A` with a reason.

| Area | Impact and evidence / reason for N/A |
|---|---|
| Access, security, or permissions | |
| Database, schema, or data migration | |
| Environment configuration or deployment | |

## Test results

List the relevant commands and actual results. For checks not run, state why and what remains unverified.

| Command / check | Result (PASS / FAIL / NOT RUN) | Evidence or reason |
|---|---|---|
| `./scripts/verify-template` and applicable focused tests from a clean checkout | | |

## Author self-check

For each row, record `PASS`, `FAIL`, or `N/A` and provide a reason for `N/A`. See `docs/agents/pull-request-review.md` for status meanings. Link evidence where applicable. A `FAIL` or unexplained `N/A` blocks review readiness.

| Check | Status | Evidence / reason |
|---|---|---|
| Purpose, scope, Work Item, and acceptance criteria match the diff | | |
| Documentation references and branch scope match the intended change | | |
| I reviewed the changed files; debug code, temporary data, and unrelated edits are removed | | |
| Errors, empty values, and invalid input have deliberate behavior | | |
| Environment configuration is documented and no password, token, or API key is included | | |
| Required repository verification and applicable focused tests ran from a clean checkout; unrun checks and limits are stated above | | |
| Access/security, database, and deployment impacts are described and checked | | |

## Reviewer verification

Reviewer: fill this section after inspecting the diff. Record `PASS`, `FAIL`, or `N/A` and provide a reason for `N/A` on every row. See `docs/agents/pull-request-review.md` for status meanings and reviewer assignment. A `FAIL` or unexplained `N/A` blocks approval.

| Check | Status | Evidence / reason |
|---|---|---|
| Changes satisfy the Work Item and do not exceed its scope | | |
| Logic and effects on existing behavior have been checked | | |
| Higher-risk areas and the author's evidence have been independently examined | | |
| Test results and required repository checks support the change | | |
| Required review comments are resolved | | |
| Changes made after review were rechecked in the affected files and tests | | |

## Merge readiness

- [ ] Every required author and reviewer check is `PASS` or `N/A` with a reason.
- [ ] Reviewer decision and approval are recorded.
- [ ] No unresolved required change request or blocking comment remains.
- [ ] Repository-required checks have passed. If none are configured, record that fact in the test results; do not describe an unrun check as passed.

The checklist records review work; it does not create an independent GitHub approval. Repository rules and configured required checks still apply.
