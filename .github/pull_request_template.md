> **Optional Kaizen aid:** Use any part of this template that helps explain or review the change. Completing it is not a repository merge gate. Follow the repository's configured required checks, branch protections, and organization rules.

## Purpose and scope

Work Item: #

What changes and why:

What is intentionally out of scope:

## Optional risk notes

Describe affected behavior, or write `N/A` with a reason.

| Area | Impact and evidence / reason for N/A |
|---|---|
| Access, security, or permissions | |
| Database, schema, or data migration | |
| Environment configuration or deployment | |

## Test notes

List relevant commands and actual results when useful. For checks not run, state why and what remains unverified. Repository-required checks still apply independently of this template.

| Command / check | Result (PASS / FAIL / NOT RUN) | Evidence or reason |
|---|---|---|
| Relevant required checks and focused tests (if applicable) | | |

## Optional review notes

Review or approval requirements come from the Work Item and configured repository rules. An author checklist is not an approval event. See `docs/agents/pull-request-review.md` for guidance.

## Optional author self-check

If you use this section, record `PASS`, `FAIL`, or `N/A` and provide a reason for `N/A`. See `docs/agents/pull-request-review.md` for status meanings. Link evidence where applicable. A status here does not by itself block review readiness or merge.

| Check | Status | Evidence / reason |
|---|---|---|
| Purpose, scope, Work Item, and acceptance criteria match the diff | | |
| Documentation references and branch scope match the intended change | | |
| I reviewed the changed files; debug code, temporary data, and unrelated edits are removed | | |
| Errors, empty values, and invalid input have deliberate behavior | | |
| Environment configuration is documented and no password, token, or API key is included | | |
| Required checks and applicable test results are stated accurately; unrun checks are identified | | |
| Access/security, database, and deployment impacts are described and checked | | |

## Optional reviewer notes

If a reviewer uses this section, record `PASS`, `FAIL`, or `N/A` and provide a reason for `N/A`. See `docs/agents/pull-request-review.md` for status meanings. Required approvals are determined by repository policy, not by this template.

| Check | Status | Evidence / reason |
|---|---|---|
| Changes satisfy the Work Item and do not exceed its scope | | |
| Logic and effects on existing behavior have been checked | | |
| Higher-risk areas and the author's evidence have been independently examined | | |
| Test results and required repository checks support the change | | |
| Required review comments are resolved | | |
| Changes made after review were rechecked in the affected files and tests | | |

## Optional merge notes

- Repository-required approvals, checks, and blocking feedback have been addressed according to configured rules.

The template records optional review notes; it does not create a GitHub approval or independent merge condition. Repository rules and configured required checks still apply.
