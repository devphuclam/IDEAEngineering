# Contract: PG4 Gate Record

## Required fields

```text
gate_id: PG4
increment_id: IE-INC-READY-001
reviewed_manifest_id_and_hash
reviewed_git_commit
execution_state: NOT-RUN | IN-PROGRESS | COMPLETE
outcome: NOT-APPLICABLE until COMPLETE; then PASS | PASS-WITH-ACTIONS | FAIL | BLOCKED
decision_date: required when COMPLETE
decision_authority: required when COMPLETE
review_participants_and_roles
entry_criteria
approved_pg2_requirements_baseline_and_evidence
approved_pg3_architecture_design_baseline_and_evidence
readiness_check_ids
open_blockers
residual_risks_and_owners
rationale
proposed_successor_increment
authorized_successor_increment
authorization_limits
conditional_actions: action_id, description, owner, affected_baseline,
                     due_condition_or_date, expiry, escalation_path,
                     non_invalidating_rationale, evidence_link
evidence_links
supersession_or_reopen_trigger
```

## Execution-state semantics

- `NOT-RUN`: assessment has not started; outcome is `NOT-APPLICABLE`.
- `IN-PROGRESS`: assessment has started but no attributable disposition exists; outcome is
  `NOT-APPLICABLE`.
- `COMPLETE`: the named authority recorded one of the four permitted outcomes. This is not a pass
  by itself: a completed assessment may be `FAIL` or `BLOCKED`.

No production implementation is authorized before a disposition exists. Individual readiness-check
results are separate from both fields above.

`PH1` is the label for the first code-bearing successor after PH0. It is not an authorization by
itself. When a successor is proposed or authorized, the record must include its stable increment ID,
feature directory, bounded scope and authorization limits; no feature directory is created before
the authorization rule in T027 is satisfied.

## Outcome semantics

- `PASS`: all mandatory entry criteria have attributable evidence and the named successor increment
  may begin with approved PG2/PG3 baselines. It authorizes no other phase.
- `PASS-WITH-ACTIONS`: only the named successor may begin, with approved PG2/PG3 baselines and
  complete conditional-action records. Actions must not invalidate its requirements, architecture,
  risk treatment, test design or rollback readiness. Missing mandatory inputs cannot be waived by
  calling them actions. A breached condition or expiry reopens the decision; its authorization must
  not be assumed to remain valid.
- `FAIL`: assessment found that the exact baseline does not meet an applicable entry criterion.
  Production implementation remains unauthorized until correction and reassessment.
- `BLOCKED`: one or more mandatory criteria lack authority, evidence, environment, data or review.
  Production implementation remains unauthorized.

`authorized_successor_increment` is `NOT-APPLICABLE` for `FAIL`, `BLOCKED` or an undecided gate.
`conditional_actions` is required for `PASS-WITH-ACTIONS`; record `NOT-APPLICABLE` when there are none.

## Prohibited inferences

No outcome may be used to claim full Core v0 completion, production acceptance, company rollout,
SLA attainment, commercial readiness, customer-data permission or approval of an unnamed successor
baseline.
