# Data Model: Technical Pilot Implementation Readiness

This is the logical model for PH0 records. It is not an application database schema and creates no
new product-domain entity.

## 1. Baseline Entry

Represents one exact controlled source used or considered by the readiness review.

| Field | Rule |
|---|---|
| `entry_id` | Stable within the manifest. |
| `axis` | Feature, Spec, Tech, support, planning or evidence. |
| `stable_document_id` | Controlled ID when one exists. |
| `version` | Exact controlled version, never “latest”. |
| `path` | Repository-relative source path. |
| `git_commit` | Commit that resolves the reviewed bytes. |
| `sha256` | Required for primary approved sources and current successor sources. |
| `authority` | Named authority or controlled record that owns the disposition. |
| `disposition` | `APPROVED`, `DRAFT`, `PROPOSED`, `NOT-RUN`, `BLOCKED`, `SUPERSEDED` or `REFERENCE-ONLY` as applicable. |
| `evidence_link` | Link to approval, change or verification evidence. |

**Validation**: A primary source cannot be labelled `APPROVED` without an attributable decision
record. Matching content hashes do not prove that a decision occurred.

## 2. Successor Delta

Groups controlled changes made after one approved baseline.

| Field | Rule |
|---|---|
| `delta_id` | Stable change identity. |
| `predecessor_commit` | Exact approved or accepted source baseline. |
| `change_record` | Required controlled change record. |
| `source_entries` | One or more Baseline Entries. |
| `impact` | Feature, Spec, Tech, architecture, data, UX, verification and roadmap effects. |
| `required_authority` | Authority that may approve, change, defer or reject the delta. |
| `current_disposition` | Never inherited from the predecessor. |

## 3. Canonical Scenario

Describes the bounded end-to-end proof selected for the Technical Pilot.

| Field | Rule |
|---|---|
| `scenario_id` | Stable identifier. |
| `purpose` | User/business outcome, not implementation mechanism. |
| `actors` | Exact personas/identities and independence limitations. |
| `preconditions` | Baseline, data, authority and environment conditions. |
| `steps` | Ordered Scenario Steps. |
| `mandatory_scope` | Capabilities required for pilot completion. |
| `deferred_scope` | Product obligations retained for later increments. |
| `prohibited_claims` | Claims the evidence cannot support. |

### Scenario Step

Each step records `step_id`, action, expected result, negative path, recovery behavior, requirement
trace, architecture trace, VVP trace and evidence status.

## 4. Open Decision

Represents one unresolved value or authority needed by the implementation or gate.

| Field | Rule |
|---|---|
| `decision_id` | Stable; use the owning register ID where one exists. |
| `question` | One decision expressed without embedding a preferred answer as fact. |
| `current_state` | `OPEN`, `RESOLVED`, `BLOCKED` or `DEFERRED`. |
| `options` | Alternatives and consequences where useful. |
| `recommendation` | Engineering recommendation, explicitly separate from authority disposition. |
| `owner` | One accountable organizational role. |
| `due_condition` | Date or gate/event by which it is needed. |
| `closure_evidence` | Exact artifact or attributable decision required. |
| `affected_work` | Work packages, scenario steps or later increment. |
| `gate_effect` | `BLOCKS_PG4`, `BLOCKS_LATER_MILESTONE`, `DEFERRED_SCOPE` or `NONE`. |

**State transitions**:

```text
OPEN ──evidence/decision──> RESOLVED
  ├──missing authority───> BLOCKED ──authority/evidence──> RESOLVED
  └──authorized deferral─> DEFERRED ──reopen trigger─────> OPEN
```

## 5. Environment Profile

Records the permitted delivery context for the next increment.

Required fields: profile ID/version, developer machine class, allowed server class, network and
access assumptions, required tool families/versions, license status, configuration owner, secret
source/custodian, build/test entry points, database migration/rollback entry points, prohibited
actions and qualification status.

**Validation**: A named tool may be `SELECTED` yet its exact installed build remains `NOT-RUN`.
Neither condition permits unapproved installation or license use.

## 6. Test Dataset Profile

Records only authorized fixtures and expected evidence.

Required fields: dataset ID/version, source/provenance, synthetic or sanitized classification,
identities and roles, document fixtures, Artifact size/digest/generation method, logical Vault
locations and failure domains, initial states, expected outcomes, retention and disposal.

**Validation**: Two identities operated by one human prove identity separation, not independent human
review. Two paths on one host do not automatically prove independent Vault failure domains.

## 7. Readiness Check and Evidence

| Field | Rule |
|---|---|
| `check_id` | Stable and traceable to P01–P07. |
| `criterion` | Observable completion condition. |
| `owner` | Person/role that performs or obtains the check. |
| `baseline` | Exact input versions/hashes. |
| `method` | Review, command, walkthrough, inspection or external decision. |
| `result` | `PASS`, `FAIL`, `BLOCKED` or `NOT-RUN`. |
| `observed_at` | Required when executed. |
| `evidence_link` | Required for `PASS` or `FAIL`. |
| `blocker_or_deviation` | Required for `BLOCKED`; deviations cannot be hidden in notes. |

**State transitions**:

```text
NOT-RUN ──execute──> PASS | FAIL | BLOCKED
BLOCKED ──resolve + re-execute──> PASS | FAIL
PASS/FAIL ──baseline changes──> NOT-RUN on the successor baseline
```

## 8. Recovery Plan

Owns application/schema rollback, local Workspace preservation, metadata/Artifact reconciliation,
backup/restore, session/key handling, evidence retention and explicit reopen conditions. Each
procedure has a precondition, responsible role, ordered steps, stop condition and expected evidence.

## 9. Gate Record

Represents the attributable `PG4` decision.

Required fields: gate ID, reviewed increment, exact manifest hash/commit, date, decision authority,
review participants, prerequisites, check results, blockers, residual risks, decision rationale,
Gate Execution State, Gate Outcome, proposed/authorized successor increment and conditional actions.

Execution state is `NOT-RUN`, `IN-PROGRESS` or `COMPLETE`. Outcome is `NOT-APPLICABLE` before
`COMPLETE`; a completed decision uses only `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`.
`COMPLETE` records a decision, not successful entry criteria.

**Authorization rule**: `PASS` or valid `PASS-WITH-ACTIONS` authorizes only the named successor,
with approved PG2/PG3 baselines. Conditional actions have owner, affected baseline, due condition/date,
expiry and escalation, and must not invalidate requirements, architecture, risk treatment, test design
or rollback readiness. Missing mandatory prerequisites block authorization. `FAIL`, `BLOCKED` and
an undecided gate authorize no implementation. Exact validation rules are in
[pg4-gate-record.md](contracts/pg4-gate-record.md).

## 10. Relationships

- One approved baseline contains many Baseline Entries.
- One Successor Delta references one predecessor baseline and many successor Baseline Entries.
- One Canonical Scenario contains many Scenario Steps and traces to many product sources.
- One Open Decision can block many Readiness Checks or one gate.
- One Environment Profile and one Test Dataset Profile can support many checks, but each result pins
  the exact profile versions used.
- One Gate Record evaluates one exact readiness manifest and aggregates Readiness Checks without
  changing their evidence.
