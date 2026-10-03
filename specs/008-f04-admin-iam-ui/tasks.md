# Implementation Tasks: Administration Console & Microsoft RBAC Parity

- [ ] **Task 1: DDM Admin Layout & Styling Tokens (`admin.css`)**
  - Define DDM 3-column grid (`238px minmax(620px, 1fr) 306px`), topbar (55px), menubar (32px), and statusbar (27px).
  - Implement status pills (`green`, `amber`, `red`), data tables with sticky headers, and drawer transitions.

- [ ] **Task 2: Mock Engineering Administration Dataset (`mockAdminData.ts`)**
  - Define realistic IDEA Group mechanical data: Actors (Linh, Tuan Dat, Hoang Nam, Minh Tri), Accounts, Projects (`P-100: Máy đóng gói tự động`, `P-200: Đồ gá hàn robot`), Groups (`Cơ khí P-100`, `Điện - Tự động hóa`), and Role Definitions (`Design Engineer`, `Reviewer`, `Project Administrator`, `Account Administrator`).

- [ ] **Task 3: Navigation Rail Component (`AdminRail.tsx` & `AdminRail.test.tsx`)**
  - TDD test and implement left rail with sections: Tài khoản & Định danh, Dự án & Nhóm cơ khí, Phân quyền vai trò RBAC.

- [ ] **Task 4: Right Inspector Component (`AdminInspector.tsx` & `AdminInspector.test.tsx`)**
  - TDD test and implement inspector panel showing selected entity details, key-value properties, formatted UUIDs, and safe action buttons (Tạm khóa / Kích hoạt).

- [ ] **Task 5: Accounts Work Area (`AccountsView.tsx` & `AccountsView.test.tsx`)**
  - TDD test and implement Accounts table with search input, status filter, formatted actor badges, and row selection.

- [ ] **Task 6: Projects & Groups Work Area (`ProjectsView.tsx` & `ProjectsView.test.tsx`)**
  - TDD test and implement Projects and mechanical engineering groups view.

- [ ] **Task 7: Microsoft Azure RBAC Parity Component (`RbacView.tsx` & `RbacView.test.tsx`)**
  - TDD test and implement 3-tab layout: `Role assignments`, `Roles`, and `Check access` (Effective Access inspector).
  - Add Scope filter on Toolbar (`Tất cả phạm vi`, `Dự án P-100`, `Dự án P-200`).

- [ ] **Task 8: Flyout 3-Step Wizard Drawer (`AddRoleAssignmentDrawer.tsx` & `AddRoleAssignmentDrawer.test.tsx`)**
  - TDD test and implement 3-step wizard: `1. Vai trò (Role)` -> `2. Thành viên (Members)` -> `3. Phạm vi (Scope)` -> `4. Xem lại & Gán (Review + Assign)`.

- [ ] **Task 9: Top-level Administration App (`AdminApp.tsx` & `AdminApp.test.tsx`)**
  - Combine Topbar, Menubar, Rail, Main View, Inspector, and Statusbar into complete DDM experience.

- [ ] **Task 10: App.tsx Integration & Synchronized Prototype**
  - Add admin navigation trigger on Topbar & Session Landing in `App.tsx`.
  - Update `prototypes/idea-ddm-administration.html` with synchronized visual parity.
  - Verify complete test suite with `npm test` and build with `npm run build`.
