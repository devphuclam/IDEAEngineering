# Contract: Decision and Evidence Register

## Open-decision record

```text
decision_id
question
current_state: OPEN | RESOLVED | BLOCKED | DEFERRED
recommendation
options_and_tradeoffs
accountable_owner
due_date_or_condition
closure_evidence
affected_work
gate_effect: BLOCKS_PG4 | BLOCKS_LATER_MILESTONE | DEFERRED_SCOPE | NONE
reopen_trigger
```

An Engineering recommendation and an authority disposition are separate fields. A recommendation
cannot close a decision owned by the Product Decision Authority, QLHT, Operations, Security or
another external role.

## Readiness-evidence record

```text
check_id
work_package
criterion
method
executor_or_source_authority
exact_input_baseline
result: PASS | FAIL | BLOCKED | NOT-RUN
observed_at
evidence_link
deviation_or_blocker
affected_gate
```

## Integrity rules

1. `PASS` and `FAIL` require executed evidence on the exact recorded baseline.
2. `BLOCKED` identifies the missing authority, tool, environment, data or review and its owner.
3. `NOT-RUN` never carries an implied successful result.
4. Re-execution on a successor baseline creates a new result; it does not overwrite history.
5. One-human/two-identity evidence must not be labelled independent-human review.
6. External-source inclusion decisions link the completed intake record and exact license/version.
