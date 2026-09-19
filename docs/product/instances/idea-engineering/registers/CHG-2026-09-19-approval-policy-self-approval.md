# IDEA Engineering Approval Policy Self-Approval Change Record

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-APPROVAL-POLICY-001` |
| Supporting Class / Version | `CHG` / `Draft 0.1` |
| Date | 19-09-2026 |
| Owner / internal reviewer | Principal Product Author prepares; project user reviews |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; successor to the approved 17-09-2026 Feature/Spec/Tech predecessor |
| Evidence class | Microsoft official product behavior plus user-confirmed IDEA direction and Product Decision Authority approval; not runtime evidence |
| Access / retention | `INTERNAL`; retain with lifecycle requirements, architecture, VVP and successor decision records |

## 1. Decision context

The approved predecessor seeded an independent-approver rule: the author/editor could not approve or
Release the affected Revision. The project direction is now to follow the Microsoft-style separation
between role eligibility and workflow policy. This record preserves the predecessor and defines the
successor interpretation; it does not change the predecessor retroactively.

The reference pattern is bounded to two Microsoft products, because “Microsoft RBAC” is not one
single product behavior:

- Microsoft Entra/Azure RBAC uses `Security Principal + Role Definition + Scope = Role Assignment`.
- Azure DevOps branch policy has a separate, policy-scoped **Allow requestors to approve their own
  changes** setting. Microsoft recommends it be off by default; another applicable policy may still
  require a different approver.

Sources: [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview),
[Azure DevOps branch policies](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops),
and [secure repositories and pull requests](https://learn.microsoft.com/en-us/azure/devops/repos/git/secure-repositories-pull-requests?view=azure-devops).

Microsoft behavior is evidence for the separation, not a claim that IDEA has copied Microsoft's
resource hierarchy or internal implementation.

## 2. Successor decision

1. RBAC remains the eligibility layer: the server evaluates the Actor/Group principal, Project and
   other Scope, Role Definition Version and `Approve` Permission before an approval command.
2. A versioned `Approval Policy` is the rule layer. It owns `AllowSelfApproval`, required independent
   approval, minimum decision count, last-editor/pusher restrictions and any other approval condition.
3. `AllowSelfApproval` is `false` by default. A privileged administrator may enable it in a new,
   validated Approval Policy Version. It is not a Permission and does not grant `Approve` by itself.
4. The seeded Core v0 policy remains the safe default: one eligible independent approver is required,
   so an author/editor's own decision is refused. A later policy may explicitly allow self-approval
   without changing an already running Review Round.
5. If multiple applicable policies are evaluated, any blocking or stricter rule wins. Enabling
   self-approval in one policy cannot bypass another policy that requires an independent approver.
6. `Release` remains a separate Permission and policy decision. Allowing self-approval never implies
   permission to self-Release.
7. Every Review Round pins the exact Workflow Definition Version and Approval Policy Version. The
   decision and Audit Evidence record the effective self-approval rule and whether the actor was the
   author/editor. A self-approval is never labelled independent approval.

## 3. Example

```text
Linh → P-100 → Group “Cơ khí” → Role Definition Version “Approver”
     → Scope P-100 → Permission Approve
     → Approval Policy Version 1.1: AllowSelfApproval = true
     → self-approval may proceed if all other policy and business gates pass.
```

If the same Review Round is governed by another policy requiring an independent approver, Linh's
decision is not sufficient. A separate eligible person must decide. None of these checks bypasses
Checkout ownership, Generation freshness, lifecycle state, dependency completeness or Release scope.

## 4. Impact and boundaries

| Area | Treatment |
|---|---|
| Feature groups | Unchanged: no new feature group and no change to the 14-group scope |
| Product Scope | Unchanged |
| RBAC model | Unchanged: principal–role–scope remains the authorization model |
| Lifecycle requirements | Successor clarification: self-approval is policy-controlled and opt-in; seeded default still refuses it |
| Release | Separate from Approve; no automatic self-Release |
| Q-15 / Tech Stack | Unchanged |
| PG3 / PG4 | Unchanged; no implementation or qualification result |
| PDA approval | `NOT-RUN` for this successor decision; user direction is recorded, not misreported as boss approval |

## 5. Required verification additions

The next VVP revision shall exercise at least these cases:

1. Default policy denies self-approval.
2. A new policy with `AllowSelfApproval = true` permits it only when RBAC and business gates pass.
3. A second applicable policy requiring an independent approver blocks self-only approval.
4. A running Review Round keeps its pinned policy when a later policy is activated.
5. Self-approval does not grant Release; the Audit record distinguishes self from independent approval.

All procedures and results remain `NOT-RUN` until an approved environment and qualified reviewers exist.

## 6. Successor source impact

| Source | Treatment |
|---|---|
| `SPEC-001` | Draft `0.14 → 0.15`; clarify lifecycle rule and WF-04; management brief remains a successor draft |
| `DOC-04` | Draft `0.14 → 0.15`; clarify `REQ-LC-003` while retaining the same requirement identity and default seeded behavior |
| `DOC-05` | Draft `0.21 → 0.22`; describe policy evaluation and self-approval audit in the lifecycle view |
| `DOC-06` | Draft `0.17 → 0.18`; retain the effective Approval Policy Version and self-approval outcome as decision data |
| `VVP` | Draft `0.17 → 0.18`; add default/opt-in/conflicting-policy/pinning checks |
| `FEATURE-001`, `TECH-001`, DOC-07, DOC-08 | No scope or technology change; references remain valid, and no predecessor is overwritten |
| Spec Kit canonical scenario | Default seeded path remains the scenario; any successor implementation task must be generated through the Spec Kit lifecycle |

## 7. Decision status

This record is a controlled successor decision approved by the Product Decision Authority on
19-09-2026, as recorded in
[`IE-CHG-PDA-APPROVAL-002`](CHG-2026-09-19-pda-approval-approval-policy.md). The approval covers
this policy correction only. It does not create implementation authorization, runtime evidence or a
product-gate result for the remaining successor content.
