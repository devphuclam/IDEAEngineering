# Microsoft authorization patterns applicable to IDEA DDM

| Field | Value |
|---|---|
| Finding ID | `IE-KNW-MS-AUTH-001` |
| Status | Research finding; product recommendations remain subject to Feature/Spec approval |
| Evidence class | `MICROSOFT-OFFICIAL` for Microsoft behavior; `IDEA-RECOMMENDATION` where explicitly labelled |
| Access date | 2026-09-09 |
| Scope | Authorization structure, group assignment, privileged administration, effective-permission explanation and future identity integration |

## 1. Short answer

**IDEA DDM should learn from Microsoft's authorization model, but should not copy Azure RBAC as a product feature.**

The most useful Microsoft pattern is simple:

> **Who** receives **which set of actions**, within **what scope**?

Microsoft represents that as `security principal + role definition + scope`. This gives IDEA a clean base for answering practical questions such as:

- Which group gives Linh the right to Checkout a Technical Specification?
- Does that right apply to the whole organization, one project, or one product area?
- Why can a reviewer Approve but not Release?
- Why is an action still blocked even though the user belongs to an authorized group?

The last question is where IDEA must go beyond generic RBAC. Checkout ownership, current Generation, lifecycle state, workflow assignment and release dependencies are document-control rules. They must remain server-side business gates and cannot be reduced to a role name.

## 2. What Microsoft actually demonstrates

### 2.1 A role assignment has three parts

**Evidence class: `MICROSOFT-OFFICIAL`**

Azure RBAC and Microsoft Entra RBAC both define a role assignment around:

1. a **security principal** such as a user, group or service identity;
2. a **role definition**, which is a collection of permitted actions;
3. a **scope**, which limits the resources to which the assignment applies.

Microsoft recommends using the smallest scope that meets the need. This reduces the resources exposed if an identity is compromised.

Sources: [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview), [Azure role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments), and [Microsoft Entra RBAC overview](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-overview).

### 2.2 Assigning roles to groups simplifies administration

**Evidence class: `MICROSOFT-OFFICIAL`**

Microsoft describes group-based role assignment as a way to make permissions consistent and easier to audit. Adding or removing a person from the group changes the role they receive indirectly, instead of requiring many individual assignments.

Microsoft also warns that privileged groups need stronger control. In its Entra model, role-assignable groups restrict dynamic membership and group nesting because automatic or indirect membership can create unintended privilege elevation.

Sources: [Use Microsoft Entra groups to manage role assignments](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/groups-concept) and [Best practices for Microsoft Entra roles](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices).

### 2.3 Least privilege includes action, scope and time

**Evidence class: `MICROSOFT-OFFICIAL`**

Microsoft's guidance defines least privilege as granting exactly the permissions needed, over a specific scope and, where appropriate, for a specific period. It recommends avoiding broad roles over broad scopes simply because that is easier to configure.

This supports separating administrator responsibilities rather than creating one permanent all-powerful administrator role.

Source: [Best practices for Microsoft Entra roles](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices).

### 2.4 Effective access must be computable

**Evidence class: `MICROSOFT-OFFICIAL`**

Azure RBAC is principally additive: effective permission is the combined result of applicable role assignments. Azure then checks deny assignments, action membership and optional conditions before allowing a request. Microsoft's documentation exposes this evaluation order because administrators need to diagnose why access was allowed or blocked.

Azure deny assignments are a special mechanism managed by Azure; the standard Azure interface does not let customers freely create arbitrary deny assignments. This is an important limit: “Microsoft has deny” does not mean IDEA should add a general-purpose deny editor.

Sources: [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview), [Azure deny assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments), and [Azure ABAC conditions](https://learn.microsoft.com/en-us/azure/role-based-access-control/conditions-overview).

### 2.5 Privileged access can be temporary

**Evidence class: `MICROSOFT-OFFICIAL`**

Microsoft Entra Privileged Identity Management provides eligible roles, time-limited activation, justification, approval, notification, access review and audit history. Its purpose is to avoid leaving powerful administrative access active all the time.

Source: [What is Privileged Identity Management?](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure).

### 2.6 Access should be reviewed, not merely granted once

**Evidence class: `MICROSOFT-OFFICIAL`**

Microsoft Entra access reviews let designated reviewers periodically confirm whether users still need group, application or privileged-role access. Microsoft presents group membership as an effective review boundary because a reviewer can inspect one group instead of many unrelated individual grants.

Sources: [Plan a Microsoft Entra access reviews deployment](https://learn.microsoft.com/en-us/entra/id-governance/deploy-access-reviews) and [Best practices for Microsoft Entra roles](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices).

### 2.7 App roles can remain stable across identity providers

**Evidence class: `MICROSOFT-OFFICIAL`**

Microsoft allows an application to define its own app roles and assign users or groups to them. When Entra is the identity provider, assigned app roles can be emitted as token claims. Microsoft distinguishes these application-specific roles from tenant-specific groups.

Source: [Add app roles and receive them in a token](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps).

## 3. Recommended IDEA model

Everything in this section is **`IDEA-RECOMMENDATION`**, derived from the project context and informed by the Microsoft patterns above. It is not a claim that Microsoft or DDM uses this exact data model.

### 3.1 Core assignment

Use the following stable relationship:

```text
Business Group ── receives ── Permission Policy ── within ── Admin Scope
       ▲                         │
       │                         └─ Document Class × Lifecycle State × Action
     Users
```

Suggested meanings:

| IDEA concept | Meaning |
|---|---|
| User | The signed-in person; initially an IDEA local account, later possibly mapped to a company identity. |
| Business Group | A maintainable set of people who perform the same business responsibility. |
| Permission Policy | The actions that a group may perform for a document class and lifecycle state. |
| Admin Scope | The organization, project or product area to which the assignment applies. A folder is not automatically a security boundary. |
| Workflow Role | Eligibility for a workflow task such as review or approval; it does not by itself grant unrestricted document access. |

For the agreed IDEA policy shape, the Microsoft `role definition` idea is best adapted as a reusable **Permission Policy**, not as hundreds of hard-coded role names.

### 3.2 Separate the two administrator responsibilities

Keep these as distinct assignments:

| Assignment | May do | Must not receive automatically |
|---|---|---|
| Account Administrator | Create, suspend, recover and manage IDEA accounts and active sessions. | Document access, policy editing, approval or release authority. |
| PDM Administrator | Configure business groups, document classes, numbering, permission policies, workflows and format profiles. | Password recovery, account issuance, document approval or release authority. |

One person may hold both assignments, but the system must still show which assignment authorized each administration action. This preserves accountability and allows the responsibilities to be separated later without redesigning the product.

The development superuser is a bootstrap mechanism, not a production role. It should disappear from pilot/live behavior.

### 3.3 Keep detailed document authority inside IDEA Server

When company sign-in is added, an identity token may provide the person's identity and a coarse application role. IDEA Server should still determine the current detailed permission because:

- group membership or policy may have changed after the token was issued;
- document class and lifecycle state are IDEA data;
- Checkout ownership and expected/current Generation are request-time facts;
- approval and release depend on workflow and release rules;
- every authoritative path—Web, Desktop, file transfer, preview, export and workers—must reach the same decision.

Therefore, future Entra integration should be an identity adapter, not a replacement for IDEA's document-authorization engine.

### 3.4 Recommended evaluation order

```text
1. Is the account active and authenticated?
2. Which Business Groups and administrator assignments currently apply?
3. Which activated policy version applies at this scope?
4. Does the policy grant this action for the document class and lifecycle state?
5. Do the document-control gates pass?
6. Record the decision and, for a successful command, the resulting audit event.
```

If any required answer is absent, the result is **not allowed**. This is IDEA's default-deny rule.

Examples of step 5:

- `Check-in` requires the valid Checkout owner and the expected Generation.
- `Approve` requires an assigned workflow role and a document currently awaiting that decision.
- `Release` requires an approved release candidate, a confirmed release scope and all required dependencies.
- `Reference` never gains authority to overwrite the source document.

A role grants eligibility to attempt an operation; it does not bypass the operation's business rules.

### 3.5 Explain every effective permission

The administration UI should answer both successful and blocked cases with:

- effective result: allowed or blocked;
- user and active account status;
- source Business Group or administrator assignment;
- active Permission Policy version;
- applicable Admin Scope;
- document class, lifecycle state and requested action;
- business gate that blocks the action, when applicable.

Example:

```text
Checkout: Allowed
Source: Kỹ sư thiết kế → Chính sách kỹ thuật v3
Scope: Dự án P-100

Release: Blocked
Permission: Granted through Nhóm phát hành
Business gate: Tài liệu đang Under Review, chưa có quyết định Approve
```

This distinction prevents the misleading conclusion that “có quyền Release” means “có thể Release mọi tài liệu ở mọi thời điểm.”

### 3.6 Start with allow-only policy plus hard business gates

For the first implementation:

- absence of an applicable grant means blocked;
- group policies grant actions;
- non-overridable business gates block invalid lifecycle, Checkout, stale Generation and release operations;
- avoid routine direct grants to individual users;
- record every membership, policy and administrator-assignment change.

Do not add a general explicit-deny editor merely to resemble Azure. If IDEA later needs deny rules, first specify precedence, inheritance, exceptions, conflict resolution and explanation behavior. An unexplained mix of grants and denials is harder to operate safely than a smaller allow-only model.

### 3.7 Preserve policy change control

The accepted IDEA direction of `Draft → Compare/Preview → Activate → Audit/Roll back` should remain. This is an IDEA governance improvement; the Microsoft sources above do not establish this exact workflow.

Group membership changes may take effect immediately when that is the approved business rule, but they must identify the actor and resulting effective access. Policy changes should identify their version and activation point so past decisions can be explained against the policy that was active at the time.

### 3.8 Defer a PIM-like feature, but leave room for it

For 50–100 internal users and local accounts in the first stage, building a full PIM clone would add disproportionate scope. Do not put eligibility, activation approval and time-boxed roles into the MVP merely because Microsoft offers them.

Prepare for later extension by allowing administrator assignments to carry optional:

- start and end times;
- justification;
- activation and expiry status;
- approving actor;
- audit references.

Adopt this only when the pilot risk, company identity integration or operating policy establishes the need.

## 4. What IDEA should not copy

| Microsoft mechanism | Why it should not be copied directly |
|---|---|
| Azure's management-group/subscription/resource-group/resource hierarchy | IDEA needs organization/project/product-area scope. Azure infrastructure hierarchy does not describe engineering-document structure. |
| Azure built-in role names such as Owner or Contributor | They are too broad and carry cloud-resource meanings unrelated to Checkout, Check-in, Reference, Approve and Release. |
| Additive permissions without visible provenance | Combining grants is manageable only when the administrator can see every source and the final result. |
| Arbitrary explicit deny rules | Azure deny assignments are a specialized Azure-managed control. A user-editable deny system would require a separate IDEA specification. |
| Token claims as the complete authorization decision | Tokens cannot express current document state, Checkout owner, current Generation or release completeness. |
| Dynamic or deeply nested privileged groups | Indirect membership can make privilege elevation difficult to predict. Keep privileged membership explicit in the first stage. |
| Full PIM, Conditional Access or Entra Governance in the MVP | These are separate Microsoft products/capabilities with licensing and operational assumptions. IDEA should integrate with company identity later, not reproduce an identity-governance suite. |
| Microsoft limits or emergency-account counts as IDEA requirements | They are guidance for Microsoft environments. IDEA needs its own approved break-glass and last-administrator recovery procedure. |

## 5. Practical conclusion for the Admin prototype

The prototype should visibly contain only the controls needed to test the authorization model:

1. `Tài khoản` for Account Administrators.
2. `Nhóm & thành viên` for PDM Administrators.
3. `Quyền tài liệu` as group × document class × lifecycle state × action × scope.
4. `Quyền thực tế` showing the result and its source.
5. `Bản nháp chính sách`, comparison, activation and audit.
6. Separate views for document classes, workflow, numbering and format profiles where those settings affect permission policy.

It should not display generic security scores, cloud terminology, licensing, subscription controls or a PIM dashboard. Those would add visual weight without helping an IDEA administrator configure document work.

## 6. Evidence boundary

This note records public first-party Microsoft documentation and a bounded product recommendation for IDEA. It does not claim Microsoft endorsement, DDM behavior, runtime parity or an approved IDEA requirement. Any material change to Feature, Spec or architecture still requires its normal decision and traceability process.

