# DDM Administration and Permission UI — Vendor-Public Evidence

| Field | Value |
|---|---|
| Finding ID | `IE-KNW-DDM-ADM-001` |
| Status | Vendor-public evidence finding |
| Evidence class | `VENDOR-PUBLIC` with explicit `DEMONSTRATED`, `CLAIM`, and `UNKNOWN` labels |
| Access date | 2026-09-09 |
| Scope | Public DDM Administration UI for users, groups, roles, profiles and access-control lists |
| Target-runtime evidence | None |

## 1. Answer

**DDM does have a dedicated administration UI for access management.** The official DDM tutorial demonstrates a Windows application titled **DDM Administration**, with screens for users, groups, business units, lifecycle states, access controls and profiles. It also demonstrates a group access-control editor whose rows are lifecycle states and whose columns are permitted actions.

This is historical public evidence, not evidence of the current DDM release or of an installed target. The demonstrated window carries the build label `2020.04.200622`. The official tutorial itself warns that its build may differ from the viewer's version.

## 2. First-party sources

| Source | What it supplies | Evidence limit |
|---|---|---|
| [DDM Admin Tutorial Videos](https://www.designdatamanager.com/ddm-admin-tutorials/) | Official tutorial index and chapter markers for system access, users, groups, access controls, lifecycle-state access controls and profiles. | Page and linked videos demonstrate an historical vendor example; they do not establish the current UI or an installed configuration. |
| [DDM Tutorials (Admin) — Configuring System Access](https://www.youtube.com/watch?v=IAoU2iPDYxs) | First-party video published by the DesignDataManager channel. Visible UI evidence for the observations below. | Happy-path demonstration only. No source-code, database, enforcement or concurrency evidence. |
| [DDM Administration Basic Course Overview](https://www.designdatamanager.com/services/training-3/ddm-admin-training/) | Official training outline naming user accounts and profiles, user groups, business units and ACLs as administration topics. | A course outline is a capability claim, not proof of runtime enforcement or current screen parity. |

## 3. What the public UI demonstrates

### 3.1 Administration shell

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The video shows a separate, dense desktop administration application rather than placing administrator controls in the engineering workbench. The top-level ribbon includes:

- `Users & Groups`;
- `States & Permission`;
- `Folders & Attributes`;
- `Tools`;
- `Reports & Watermarks`;
- `Multi Site`.

Within the left navigation, `System Access` contains `Users`, `Groups`, `Business Units`, `States`, `Access Controls`, and `Profiles`. Other administration areas such as attributes, folders, system and maintenance remain separate. The visible application title includes `DDM Administration | 2020.04.200622 | User: Administrator`.

Direct evidence: [Configuring System Access video, around 00:50](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=50s) and [around 06:45](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=405s).

### 3.2 Users

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The `Users` page is a searchable table. Visible columns include user ID, type, first name, initials, surname, drawn-by name, domain ID, email address, profile name, default business unit and comments. A `Show Disabled Users` control is displayed separately from the table.

The demonstrated user actions include create, create similar, edit, delete, reset password, disable/enable account, show audit, reset working folder and permission summary. The create-user flow is a step-by-step dialog with separate steps for user properties, groups for the default business unit and a summary. Visible properties include user ID, name, email, password, default business unit, default profile, comments, drawn-by name, initials and domain ID.

Direct evidence: [around 00:50](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=50s), [around 01:22](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=82s), and [around 01:30](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=90s).

### 3.3 Groups, roles and membership

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The `Groups` page is a table with `Name`, `Type`, `Primary`, and `Description`. The example distinguishes entries whose visible type is `Group`, `Role`, or `System`. It shows ordinary groups, department-style roles and system groups. Group rows can be expanded to show a business unit and user membership; the table marks a user's primary membership.

The ribbon separates group maintenance, membership actions, business units and profiles. The create-group flow is a step-by-step dialog with group properties, selection of users for a business unit and a summary. Visible group properties include group name, description and group type.

Direct evidence: [around 05:35](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=335s), [around 06:00](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=360s), and [around 07:18](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=438s).

### 3.4 Access-control lists by lifecycle state

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The `Access Controls` page presents a tree/table of lifecycle schemes. In the demonstrated example, a scheme can be expanded into a group and then into lifecycle states such as `Work in Progress`, `Checked`, `Released`, `Under Review`, `Superseded`, and `Obsolete`.

Permission columns visible in the screen include:

- `Visible`;
- `Create`;
- `Modify`;
- `Change To State`;
- `Change From State`;
- `Load File`;
- `Load Preview`;
- `UnReserve`;
- `Reserve`;
- `UpIssue`;
- `Delete`.

The edit dialog is explicitly scoped to one group access-control list and one lifecycle scheme. It uses lifecycle states as rows and actions as checkbox columns, followed by `Confirm` or `Cancel`. This directly demonstrates a configurable **group × lifecycle state × action** matrix. It does not reveal DDM's internal authorization algorithm.

Direct evidence: [around 06:45](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=405s) and [around 09:10](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=550s).

### 3.5 Effective-permission summary

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The user permission summary is more than a flat list. The demonstrated dialog contains separate `Items` and `Folders` tabs. The item view is arranged as a hierarchy of business unit, table/type and lifecycle state, with action columns. When one permission cell is selected, a lower panel identifies the group that grants that permission and shows the group's description.

This is useful evidence that DDM exposes an explanation path from a user's effective permission back to group membership in the demonstrated configuration. The video does not establish how conflicting grants or denials are resolved.

Direct evidence: [around 05:35](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=335s).

### 3.6 Profiles

**Evidence class: `VENDOR-PUBLIC DEMONSTRATED`**

The `Profiles` page shows default user settings by table/type. Visible settings include whether the table is visible, default new issue, new status, up-issue status and web-upload status. Profiles are therefore visibly separated from group access-control lists in this historical UI.

Direct evidence: [around 21:50](https://www.youtube.com/watch?v=IAoU2iPDYxs&t=1310s).

### 3.7 Official capability statement

**Evidence class: `VENDOR-PUBLIC CLAIM`**

The official DDM Administration Basic course lists lifecycle states, user accounts and profiles, user groups, business units and access-control lists among the subjects administrators are expected to manage. This supports the existence of those administration concerns, but the course outline alone does not demonstrate their exact UI or enforcement.

Source: [DDM Administration Basic Course Overview](https://www.designdatamanager.com/services/training-3/ddm-admin-training/).

## 4. What remains unknown

All points in this section are **`UNKNOWN`** from the admitted vendor-public evidence:

- whether current DDM releases retain the same screens, labels, navigation or permission columns;
- whether every DDM edition or licensed module exposes the demonstrated administration functions;
- the exact meaning and precedence of `Group`, `Role`, `System`, business-unit and profile assignments;
- whether DDM has explicit deny rules, inheritance rules, exception rules or conflict-resolution ordering;
- whether effective permissions are cached, when changes take effect and how active sessions are refreshed;
- whether access is enforced identically through Office, CAD, Web, file, preview, export, integration and background-service paths;
- who may edit ACLs, whether two administrators can edit concurrently and how stale changes are handled;
- whether permission edits are versioned, staged, approved, activated, rolled back or compared before publication;
- the completeness and tamper-resistance of the displayed audit history;
- the exact folder-permission configuration model, despite the demonstrated `Folders` tab in the user permission summary;
- authorization behaviour for nested product structure, released baselines, derived files and external integrations;
- the target runtime's actual configuration, security posture and granted permissions.

Public silence on any of these points is an evidence gap, not proof that DDM lacks the capability.

## 5. Clean-room lessons for an IDEA prototype

The following are **prototype candidates, not IDEA requirements and not claims of DDM parity**. They reuse observable interaction concepts while avoiding DDM branding, assets, source code and pixel-level copying.

| Candidate for IDEA | Evidence-derived reason | Clean-room adaptation |
|---|---|---|
| Keep administration outside the engineer workbench | DDM demonstrates a dedicated administration application/surface. | Add a clearly named `Quản trị` area in IDEA with the IDEA design system; do not copy the DDM ribbon or icons. |
| Separate `Người dùng`, `Nhóm`, `Quyền tài liệu`, and `Quyền thực tế` | DDM visibly separates users, groups, access controls and permission summary. | Use a compact left navigation and one task-focused table per page. |
| Configure rights as group × document type × lifecycle state × action | DDM demonstrates a lifecycle-state/action checkbox matrix for a selected group ACL. | Use IDEA terms and its controlled document classes; do not reproduce DDM's exact state list or column order unless independently required. |
| Explain why a user has a right | DDM's permission summary identifies the group granting a selected permission. | Provide `Xem quyền của người dùng`: effective result, source group and applicable policy in one readable panel. |
| Keep users and groups searchable in tables | DDM demonstrates searchable, dense administration lists. | Retain table density but use readable Vietnamese labels, clear empty states and fixed scrolling regions. |
| Use guided dialogs only for bounded create/edit work | DDM demonstrates step-based dialogs for new users and groups. | Use short dialogs for identity and membership; keep the permission matrix in the main workspace rather than a small modal. |
| Separate defaults from authorization | DDM displays profiles separately from ACLs. | Treat personal/default settings as a distinct concept from permission grants in the prototype. |
| Preserve an audit/explanation path | DDM demonstrates a user audit action and permission summary. | Show who changed a policy, when, and the previous/current values; label this as IDEA behaviour unless separately evidenced in DDM. |

One material IDEA-specific improvement may be explored without attributing it to DDM: a draft/preview/activate flow for policy changes, with an impact summary before activation. The public DDM tutorial does not demonstrate this workflow, so it must remain an IDEA proposal until accepted through the product-decision process.

## 6. Evidence boundary

This finding records externally visible vendor behaviour and vocabulary only. It does not copy DDM assets or infer internal implementation. It does not create or modify an IDEA product requirement. Any lesson selected for IDEA must still receive a stable requirement identity, product rationale, acceptance criterion and verification method through the controlled Feature/Spec process.
