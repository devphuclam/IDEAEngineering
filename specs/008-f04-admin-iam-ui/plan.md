# Implementation Plan: Administration Console & Microsoft RBAC Parity

**Feature**: `008-f04-admin-iam-ui`  
**Standard**: Spec Kit 1.0.7 + Matt Pocock `$tdd` + Taste Skill (Anti-Slop v2)  

## Component Architecture

```
apps/web/src/
├── components/
│   ├── admin/
│   │   ├── AdminApp.tsx               # Root 3-column layout container (Topbar, Menubar, Workspace, Statusbar)
│   │   ├── AdminRail.tsx              # Left navigation rail (Accounts, Projects & Groups, Roles & RBAC)
│   │   ├── AdminInspector.tsx         # Right-hand inspector panel with entity details & safety actions
│   │   ├── AccountsView.tsx           # Accounts table (F04 Actor/Account, status badges, suspend/activate)
│   │   ├── ProjectsView.tsx           # Projects & Groups table (e.g. Project P-100, Mechanical Group)
│   │   ├── RbacView.tsx               # Microsoft Azure IAM 3-tab view (Assignments, Roles catalog, Check access)
│   │   ├── AddRoleAssignmentDrawer.tsx# Microsoft-style 3-step Flyout Drawer wizard
│   │   └── mockAdminData.ts          # Authentic IDEA Group engineering mock dataset
│   └── auth/                          # Existing verified components
├── styles/
│   ├── auth.css                       # Brand tokens & auth styles
│   └── admin.css                      # DDM 3-column grid & Microsoft RBAC styles
└── utils/
    └── identity.ts                    # Shared identity formatting & copy helpers
```

## TDD Seams

1. `AdminRail.test.tsx`: Tests navigation category selection, active badges, and accessibility.
2. `AccountsView.test.tsx`: Tests search filtering, row selection, formatted actor IDs, and status updates.
3. `RbacView.test.tsx`: Tests 3-tab switching (`Role assignments`, `Roles`, `Check access`), effective access computation, and drawer opening.
4. `AddRoleAssignmentDrawer.test.tsx`: Tests 3-step flow (Role -> Members -> Scope -> Review+Assign) and cancel/submit callbacks.
5. `AdminApp.test.tsx`: Tests end-to-end admin view rendering and seamless return to Engineer Workbench / Session.
