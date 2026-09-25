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
authorized_first_delivery_card
authorization_limits
authorization_state: INACTIVE | ACTIVE | REOPENED
conditional_actions: action_id, description, owner, affected_baseline,
                     due_condition_or_date, expiry, escalation_path,
                     non_invalidating_rationale, evidence_link
evidence_links
supersession_or_reopen_trigger
```

## Tracker-readable decision summary

When T026 creates the actual `pg4-gate-record.md`, include exactly one fenced
`pg4-authorization` JSON block. It is a machine-readable summary of the same attributable
decision, not a second approval. The Tracker checks this block before closing P07 or recording
code-bearing work; the full record and its evidence remain authoritative for the merits of the
decision. A missing, malformed or incomplete block fails closed.

Use these keys: `gate_id`, `increment_id`, `reviewed_manifest_id_and_hash`,
`reviewed_git_commit`, `execution_state`, `outcome`, `decision_date`, `decision_authority`,
`rationale`,
`approved_pg2_requirements_baseline_and_evidence`,
`approved_pg3_architecture_design_baseline_and_evidence`, `authorized_successor_increment`,
`authorized_first_delivery_card`, `authorization_limits`, `authorization_state`, and
`conditional_actions`.
`reviewed_git_commit` is the full 40-character commit and the manifest reference contains its
64-character SHA-256. Dates use `YYYY-MM-DD`. The current PH0 increment is
`IE-INC-READY-001`; the planned PH1 successor is `IE-INC-PH1-FOUNDATION-CUSTODY-001`, starting
with Delivery Card `F01-A`. A different successor requires a controlled planning change before
the Tracker can open it. `PASS` and `PASS-WITH-ACTIONS` require recorded T011 and T016 review
tasks as well as PG2/PG3 baseline evidence; a checked task marker alone is not proof of approval.

For `FAIL` or `BLOCKED`, set both authorization fields to `NOT-APPLICABLE` and
`authorization_state` to `INACTIVE`; P07 may still close
because a decision was recorded, but no code-bearing card may begin. For `PASS`, use an empty
`conditional_actions` array. For an effective pass, set `authorization_state` to `ACTIVE`;
set it to `REOPENED` when a condition is breached or a superseding decision is required.
For `PASS-WITH-ACTIONS`, each action must carry `action_id`,
`description`, `owner`, `affected_baseline`, `due_condition_or_date`, `expiry`,
`escalation_path`, `non_invalidating_rationale` and `evidence_link`. The Tracker rejects an
expired action; `expiry` is an exact `YYYY-MM-DD` date. These structural checks cannot establish that the authority's judgment or a
non-date condition remains valid; the gate owner must reopen the decision if a condition is
breached.

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
