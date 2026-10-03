# Feature Specification: Administration Console & Role-Based Access Control (IAM & RBAC UI - F04 Alignment)

**Feature Branch**: `gemini/f04-admin-iam-ui`  
**Created**: 2026-10-03  
**Status**: In Implementation  
**Standards**: Spec Kit 1.0.7 + Matt Pocock `$tdd` + Taste Skill (Anti-Slop v2)  
**Worker Role**: Product Design & Presentational UI Specialist (Gemini)  
**Backend Lineage**: Codex F04 (`specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md#f04-owner-foundation`, Actor/Account Foundation, IAM Disable Recovery)  

| Control | Value |
|---|---|
| Identity / version | `IE-SPK-ADMIN-008` / `0.1` |
| Owner / author | Product Design & Presentational UI Specialist (Gemini) |
| Reviewer / authority | Project Lead / Reviewer Nguyễn Huỳnh Phúc Lâm |
| Scope | DDM Administration 3-column Layout, Microsoft Azure RBAC Parity, Account Management, Project & Groups, Role Assignments, Effective Access Inspector, Flyout Assignment Drawer |
| Upstream Contracts | F04 Owner Foundation, DOC-08 `UX-JRN-009` / `UX-JRN-014` / `UX-JRN-015` |
| Downstream | `apps/web/src/components/admin/*`, `prototypes/idea-ddm-administration.html` |

---

## 1. Taste Skill Design Read & Dials (IDEA Brand & DDM Precision)

- **Design Read**: *"Reading this as: High-precision Industrial CAD/PDM Administration & Governance Cockpit for Mechanical Engineering Organizations, combining DDM's 3-column desktop density (Rail - Main Table - Inspector) with Microsoft Azure IAM's gold-standard RBAC clarity (Role assignments, Roles, Check access), wrapped in the prestigious IDEA Brand System (IDEA Crimson Red, Machined Gold accents, Deep Precision Navy/Charcoal, and Cascadia/SFMono typography)."*
- **The Three Dials**:
  - `DESIGN_VARIANCE: 3` (Strict, predictable, high-discipline industrial governance layout)
  - `MOTION_INTENSITY: 2` (Fast 120ms transitions, smooth drawer slide, zero fluff)
  - `VISUAL_DENSITY: 8` (High information density, sticky table headers, compact status pills, clear key-value specs)
- **Palette & Typography**:
  - **DDM Deep Navy Shell (`#13233d` / `#203b5c`)**: Khung điều khiển chuẩn DDM.
  - **IDEA Crimson Energy (`#dc2626`)**: Trọng tâm thao tác chính và các cảnh báo bảo mật nguy hiểm (Khóa tài khoản, Thu hồi quyền).
  - **Machined Gold Accents (`#d97706` / `#f59e0b`)**: Nhấn mạnh trạng thái tạm giữ (Suspended / Draft).
  - **Precision Surface (`#ffffff` / `#f4f7fa` / `#e2e8f0`)**: Tương phản cao, dễ đọc trong môi trường xưởng cơ khí và phòng thiết kế.

---

## 2. Bố cục 3 cột Chuẩn DDM (Architecture Grid)

Toàn bộ Cổng Quản Trị tuân thủ lưới hiển thị của DDM:
1. **Topbar (55px)**: Nhận diện thương hiệu IDEA Engineering, thông tin quản trị viên đăng nhập, nút chuyển nhanh về *Bàn Làm Việc Kỹ Thuật* và nút *Đăng xuất*.
2. **Menubar (32px)**: Thanh menu ứng dụng (Hệ thống, Quản trị, Tác vụ, Trợ giúp) + nhãn phân hệ (`CỔNG QUẢN TRỊ DDM & PHÂN QUYỀN RBAC`).
3. **Workspace (1fr) - 3 Cột**:
   - **Cột trái - Rail (238px)**: Điều hướng danh mục phân hệ:
     - 👤 **Tài khoản & Định danh** (`Accounts & Login Identities` - F04)
     - 📁 **Dự án & Nhóm cơ khí** (`Projects & Groups`)
     - 🛡️ **Phân quyền vai trò RBAC** (`Roles & Access Control` - chuẩn Microsoft)
   - **Cột giữa - Main Content Stage (1fr)**:
     - Header: Tiêu đề trang, breadcrumbs, nút tác vụ chính (`+ Thêm mới`).
     - Toolbar: Ô tìm kiếm kỹ thuật, Dropdown lọc theo Phạm vi Scope (`Tất cả phạm vi`, `Dự án P-100`, `Dự án P-200`, `Toàn hệ thống`).
     - Bảng dữ liệu: Thẻ bảng dạng grid kỹ thuật với hàng chọn `selected`, status badge chuẩn màu.
   - **Cột phải - Inspector Panel (306px)**:
     - Header: Tên và mã của thực thể đang được chọn trong bảng.
     - Body: Danh sách thuộc tính Key-Value chi tiết (ActorId, AccountId, Ngày tạo, Vai trò, Trạng thái).
     - Action footer: Các nút hành động nghiệp vụ (Tạm khóa / Kích hoạt lại, Cấp quyền vai trò).
4. **Statusbar (27px)**: Đèn trạng thái máy chủ, tên kho icVault, mã phiên làm việc bảo mật.

---

## 3. Quy chuẩn Phân quyền RBAC theo Chuẩn Microsoft Azure IAM

Mục **Phân quyền vai trò RBAC** được tổ chức thành 3 Tab làm việc:
1. **Tab 1: Bảng Gán Vai Trò (`Role assignments`)**:
   - Liệt kê các bản gán quyền: Cột `Đối tượng (Kỹ sư / Nhóm)` | `Vai trò (Role)` | `Phạm vi (Scope)` | `Loại gán (Trực tiếp / Kế thừa)` | `Hành động (Thu hồi)`.
2. **Tab 2: Danh Mục Vai Trò (`Roles`)**:
   - Bảng danh mục các vai trò chuẩn trong IDEA Group:
     - `Design Engineer` (Kỹ sư thiết kế): Quyền tạo bản vẽ, Checkout, Check-in, sửa thông số mô hình CAD.
     - `Reviewer / Approver` (Người thẩm duyệt): Quyền xem xét, ký duyệt, từ chối, yêu cầu sửa đổi.
     - `Project Administrator` (Quản trị viên dự án): Quyền thêm thành viên vào dự án, cấu hình phân quyền trong phạm vi dự án.
     - `Account Administrator` (Quản trị viên tài khoản): Quyền quản lý danh tính Actor, cấp tài khoản IDEA.
3. **Tab 3: Kiểm Tra Quyền Thực Tế (`Check access / Effective Access`)**:
   - Chọn Kỹ sư (Actor) + Chọn Dự án (Scope) ➔ Hệ thống trả về ma trận quyền thực tế mà kỹ sư đó sở hữu, kèm lý do (do gán trực tiếp hay kế thừa từ nhóm cơ khí).
4. **Flyout Drawer Thêm Phân Quyền (`Add Role Assignment Wizard`)**:
   - Ngăn kéo trượt từ phải sang với 3 bước chuẩn Microsoft:
     - **Bước 1: Vai trò (What role?)** — Chọn vai trò cần cấp.
     - **Bước 2: Thành viên (Who?)** — Chọn Kỹ sư hoặc Nhóm.
     - **Bước 3: Phạm vi (Where?)** — Chọn Scope (Dự án P-100, P-200 hoặc Toàn hệ thống).
     - **Xem lại & Gán (Review + Assign)** — Bảng tổng hợp xác nhận an toàn trước khi lưu.

---

## 4. User Stories & Acceptance Criteria

### User Story 1 — Điều hướng phân hệ và giao diện DDM 3 cột (Priority: P1)
Là quản trị viên, tôi muốn một giao diện 3 cột chuẩn DDM để quản lý tài khoản kỹ sư và phân quyền một cách chuyên nghiệp.
- **AC1**: Màn hình quản trị hiển thị đầy đủ 3 cột: `Rail` trái, `Main Content` giữa, `Inspector` phải.
- **AC2**: Chuyển đổi giữa 3 phân hệ (Tài khoản, Dự án & Nhóm, Phân quyền RBAC) cập nhật ngay lập tức bảng dữ liệu và tiêu đề trang tương ứng.
- **AC3**: Cột Inspector bên phải tự động hiển thị chi tiết của hàng (row) đang được chọn trong bảng giữa.

### User Story 2 — Quản lý Tài khoản kỹ sư chuẩn F04 (Priority: P1)
Là quản trị viên tài khoản, tôi muốn xem danh sách kỹ sư, trạng thái hoạt động và thực hiện thao tác tạm khóa / kích hoạt tài khoản an toàn.
- **AC1**: Bảng tài khoản hiển thị Actor ID (được định dạng rút gọn với nút copy 1-click), Tên kỹ sư, Trạng thái (Đang hoạt động, Tạm khóa), Ngày tạo.
- **AC2**: Khi bấm nút "Tạm khóa tài khoản", hệ thống yêu cầu xác nhận và chuyển trạng thái sang `Tạm khóa` (hiển thị badge màu đỏ/hổ phách cảnh báo).
- **AC3**: Tuyệt đối không hiển thị mật khẩu trong bất kỳ góc nào của giao diện (tuân thủ F04).

### User Story 3 — Quản lý Phân quyền RBAC chuẩn Microsoft (Priority: P1)
Là quản trị viên dự án, tôi muốn xem ma trận phân quyền, kiểm tra quyền thực tế của kỹ sư và cấp vai trò mới qua ngăn kéo Wizard 3 bước.
- **AC1**: Tab `Role assignments` hiển thị đầy đủ người được gán, vai trò, phạm vi (Scope).
- **AC2**: Tab `Check access` cho phép chọn kỹ sư để xem bảng quyền thực tế rõ ràng.
- **AC3**: Bấm nút `+ Thêm phân quyền vai trò` mở ngăn kéo Flyout Drawer 3 bước chuẩn Microsoft để chọn Vai trò ➔ Thành viên ➔ Phạm vi ➔ Xác nhận.
