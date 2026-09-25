# Quickstart: Review the PH0 Readiness Package

This guide validates the PH0 package. It does not install software, start production services or
execute a product test.

## 1. Prerequisites

- Repository checked out on the branch containing `specs/004-technical-pilot-readiness/`.
- Git available.
- PowerShell available for repository scripts and SHA-256 checks.
- Access to the controlled sources linked by the baseline manifest.
- Reviewer understands that the approved predecessor and Vault successor have different authority.

## 2. Resolve the active Spec Kit increment

```powershell
.\.specify\scripts\powershell\check-prerequisites.ps1 -Json -PathsOnly
```

Expected: `FEATURE_DIR` resolves to `specs/004-technical-pilot-readiness`.

## 3. Review P01 — baseline identity

1. Open [baseline-manifest.md](baseline-manifest.md).
2. Confirm that `IE-CHG-PDA-APPROVAL-001` names commit `f269a044...`.
3. Use Git to confirm the commit exists:

```powershell
git cat-file -e 'f269a0445737a7efd7f406ee51517149a8967afa^{commit}'
```

4. Recompute current successor hashes where required:

```powershell
Get-FileHash -Algorithm SHA256 docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md
Get-FileHash -Algorithm SHA256 docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md
```

5. Confirm predecessor and successor entries remain in separate sections.

Expected result: a reviewer can reproduce every primary pin and explain why `aabf02ff...` is plan
history while `f269a044...` is the approval baseline. Record the actual result; do not assume `PASS`.

## 4. Review P02 — bounded Technical Pilot scenario

Check that the scenario package, when authored through tasks, includes:

- authenticated account/RBAC eligibility;
- stable Logical Document identity and exact Generation;
- explicit Checkout or Reference Workspace scope;
- changed and `NoChange` Check-in behavior;
- stale/unauthorized/interrupted/retry failures with local-work preservation;
- exact Review/Approval/Release scope;
- retrieval of the same historical Controlled Release Package;
- mandatory, deferred and prohibited-claim lists;
- trace to existing `REQ-*`, architecture and VVP sources.

Any missing mandatory step makes P02 incomplete; it does not change product requirements.

## 5. Review P03 — decisions and dependencies

For every open item, verify the fields in
[decision-and-evidence-register.md](contracts/decision-and-evidence-register.md). At minimum inspect:

- D0 successor disposition;
- exact Artifact Gateway and Format Worker qualification state;
- development/server environment and company approvals;
- test identities and Vault locations;
- representative Artifact corpus and license/provenance;
- security, operations and specialist reviewer availability.

Search for uncontrolled placeholders:

```powershell
rg -n --glob '!quickstart.md' --glob '!**/checklists/**' "TBD|TODO|NEEDS CLARIFICATION|assume approved" specs/004-technical-pilot-readiness
```

An intentional `UNKNOWN`, `BLOCKED` or `NOT-RUN` with owner and gate effect is permitted. An
unowned placeholder is not.

## 6. Review P04–P06 — environment, evidence and recovery

Use this matrix when the corresponding records are produced:

| Area | Minimum review question |
|---|---|
| Environment | Is the allocated Ubuntu development host identified, with Windows client scope, allowed tools, access route, configuration/secret owners and prohibited actions explicit? |
| Build/test | Are repeatable entry points named without downloading or installing unapproved dependencies? |
| Migration | Is forward migration versioned and is rollback/recovery behavior stated? |
| Dataset | Are fixture provenance, identities, Artifact digest/size and initial states recorded? |
| Vault | Are logical locations and failure-domain assumptions explicit rather than inferred from folders? |
| Failure paths | Are denied, stale, interrupted, duplicate/retry and recovery paths represented? |
| Workspace | Is local work preserved when publication or recovery fails? |
| Backup/restore | Are metadata, Artifact, configuration and keys treated as a coordinated recovery set? |
| Security review | Are trust boundaries, abuse cases, reviewer competence and unresolved gaps visible? |
| External sources | Does every proposed inclusion have an exact version, license and intake record? |

## 7. Validate structure and links

```powershell
rg -n --glob '!quickstart.md' --glob '!**/checklists/**' "\[FEATURE NAME\]|\[DATE\]|\[Brief Title\]|What happens when" specs/004-technical-pilot-readiness
git diff --check -- specs/004-technical-pilot-readiness
```

Expected: no template placeholders and no whitespace errors. A zero-match `rg` exit is expected for
the placeholder scan and must be interpreted deliberately.

## 8. P07 review work and PG4 decision

DeliveryCard P07 may start after its management-card predecessors to record the remaining
T011/T016 review effort. Its start is not a PG4 decision. T026 follows the review dispositions
and preparation below; P07 can close only after the separate gate record contains a decision.

1. Freeze the exact readiness manifest and Git commit.
2. Review every `P01`–`P07` criterion and evidence result.
3. List open blockers and residual risks with owners.
4. Name the exact PH1 successor increment and its boundaries. Here PH1 means the first code-bearing
   successor after PH0; record its stable increment ID and feature directory rather than treating
   the label as an approval.
5. Complete the actual `pg4-gate-record.md` using the
   [PG4 contract](contracts/pg4-gate-record.md), including its Tracker-readable decision summary.
6. Record execution state separately from outcome. Before a disposition, outcome is
   `NOT-APPLICABLE`; a completed assessment records `PASS`, `PASS-WITH-ACTIONS`, `FAIL` or `BLOCKED`.
7. For a conditional pass, check action owner, affected baseline, due condition/date, expiry,
   escalation and the rationale that actions do not invalidate readiness.

An attributable `PASS` or valid `PASS-WITH-ACTIONS` permits only the exact PH1 successor, with
approved PG2/PG3 baselines and recorded conditions met. Create its Spec Kit increment before code.
`FAIL`, `BLOCKED`, `NOT-RUN` or `IN-PROGRESS` authorize no production implementation; a missing
mandatory prerequisite cannot be bypassed through a conditional pass.

## 9. Current execution status

This guide and its supporting design artifacts are authored. P01 is `COMPLETE / PASS` for the exact
reviewed input recorded in the readiness register. The P04 development-environment result is
`PASS` based on the reviewed Ubuntu host, native dependencies, database roles, one Vault directory
and documented delivery procedure. P05 preparation is `COMPLETE / PASS` based on the reviewed
synthetic files, manifest, digests and two Test Persona profiles.
Application build, Flyway migration, client-to-application endpoints and Vault Adapter I/O remain
`NOT-RUN`; the earlier Docker Compose syntax check belongs only to the retired local candidate.
P06 is `COMPLETE / PASS` in the tracker for PH0 documentary readiness; runtime recovery/security
checks remain `NOT-RUN`. P02/T011 is `COMPLETE / PASS` for the
[documentary scenario review](evidence/P02-T011-GUIDED-REVIEW-20260925.md) only. P03/T016 is
`COMPLETE / PASS` for documentary decision capture; its application/runtime conditions remain
separate. T023–T025 are prepared on the frozen manifest; [the PG4 review package](pg4-review-package.md)
is ready for review. [T031](evidence/P07-T031-REVIEW-20260925.md) is complete for
requirements quality: 32 current criteria accepted, CHK030 superseded. P07 is `IN-PROGRESS`;
T026/`PG4` remains `NOT-RUN` with outcome `NOT-APPLICABLE`. P05 application checks remain
`NOT-RUN`; D4's bounded PH1 fixture disposition is recorded in the P03/T016 review. Neither
the checklist result nor P07 progress is a PG4 outcome.
