# Feature Specification: Authentication & Session UI (F03-B Alignment)

**Feature Branch**: `specs/007-f03b-login-session-ui/`  
**Created**: 2026-10-03  
**Status**: In Review  
**Standards**: Spec Kit 1.0.7 + Matt Pocock `$prototype` + Taste Skill (Anti-Slop v2)  
**Worker Role**: Product Design & Presentational UI Specialist (Gemini)  
**Backend Lineage**: Codex F03-B (`specs/005-ph1-foundation-custody/contracts/ph1-boundaries.md#f03-b-http-refinement`)  

| Control | Value |
|---|---|
| Identity / version | `IE-SPK-AUTH-007` / `0.1` |
| Owner / author | Product Design & Presentational UI Specialist (Gemini) |
| Reviewer / authority | Project Lead / Reviewer Nguyễn Huỳnh Phúc Lâm |
| Scope | F03-B Login / Logout UI, Session State Landing, Fail-Closed Feedback, Standalone Prototype |
| Upstream Contracts | F03-B HTTP Contract, W01–W10 Qualification Oracles |
| Downstream | `prototypes/idea-authentication-preview.html` |

---

## 1. Taste Skill Design Read & Dials (IDEA Brand Soul)

- **Design Read**: *"Reading this as: Industrial Engineering Custody & CAD Session Context for Mechanical Engineers & PDM Administrators of IDEA Group, with an uncompromising, prestigious, high-precision industrial voice, centered on the iconic IDEA Crimson Red spark + Machined Gold bevel accents + Deep Precision Charcoal background + Segoe/Fira typography."*
- **The Three Dials**:
  - `DESIGN_VARIANCE: 4` (Strict, predictable, high-precision mechanical layout)
  - `MOTION_INTENSITY: 3` (Subtle 150ms tactile feedback, zero distracting animations)
  - `VISUAL_DENSITY: 7` (High information density, compact inputs, clear hierarchy)
- **Brand Palette & Anti-Slop Discipline**:
  - **IDEA Crimson Red (`#dc2626`)**: Trọng tâm thị giác lấy từ dấu chấm đỏ biểu tượng trên chữ `i` — biểu trưng cho ngọn lửa đổi mới sáng tạo và tia laser định vị cơ học chính xác.
  - **Machined Gold (`#f59e0b` / `#d97706`)**: Ánh kim đồng thau gia công cơ khí tinh xảo từ viền logo.
  - **Deep Charcoal Canvas (`#070b14` / `#0f172a`)**: Nền than chì cơ khí nguyên khối, vững chắc.
  - Không dùng màu xanh dương SaaS đại trà; không dùng gradient tím AI; không dùng các khối thẻ văn mẫu.
  - Bán kính bo góc đồng nhất 8px (`var(--radius)`); độ tương phản WCAG AA $\ge 4.5:1$.

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 — Đăng nhập an toàn & Bố cục Enterprise Split-Screen (Priority: P1)
Là kỹ sư hoặc quản trị viên, tôi muốn một giao diện đăng nhập chuyên nghiệp với nhận diện thương hiệu rõ ràng để truy cập vào hệ thống IDEA Engineering.

**Acceptance Criteria**:
1. **Bố cục Split-Screen**: Phía bên trái là bảng định danh kỹ thuật với con dấu chính thức `LOGO_IDEA_full_L.png`, lưới họa tiết kỹ thuật CAD blueprint, và khung đồ họa kỹ thuật cơ khí Isometric CAD (không dùng thẻ quảng bá tính năng marketing). Phía bên phải là thẻ form đăng nhập trên nền lưới tinh tế.
2. **Logo công ty**: Form đăng nhập hiển thị logo chính thức `logo-idea.png` (iDEA - Innovation for a better life) sắc nét.
3. **Form & Trạng thái**: Các trường `Tên đăng nhập` và `Mật khẩu` có nhãn đặt phía trên, đường viền focus màu xanh Cobalt (`#2563eb`), nút Đăng nhập hiển thị rõ ràng.
4. **Trạng thái gửi (Busy)**: Khi đang gửi yêu cầu xác thực, nút Đăng nhập chuyển trạng thái `Đang kiểm tra...` và bị vô hiệu hóa (`disabled`) để chống gửi trùng lặp.
5. **Đăng nhập thành công**: Chuyển sang màn hình làm việc với thanh Topbar chứa logo công ty, thẻ định danh kỹ sư (`Kỹ sư: <actorId>`) và đèn tín hiệu xanh sống động.

### User Story 2 — Phản hồi lỗi minh bạch và bảo mật Fail-Closed (Priority: P1)
Giao diện phản hồi lỗi rõ ràng bằng ngôn ngữ người dùng, không để lộ mã định danh kỹ thuật nội bộ (F03-B, T041).

**Acceptance Criteria**:
1. **Sai thông tin (W03)**: Khi nhập sai tài khoản hoặc mật khẩu, hiển thị thông báo trung tính: *"Đăng nhập không thành công: Tên đăng nhập hoặc mật khẩu không chính xác."* Mật khẩu lập tức bị xóa sạch khỏi ô nhập.
2. **Bị tạm khóa do thử sai nhiều lần**: Khi tài khoản bị khóa trong 15 phút, hiển thị thông báo cảnh báo màu hổ phách: *"Tài khoản tạm thời bị khóa do nhập sai mật khẩu nhiều lần liên tiếp. Vui lòng thử lại sau 15 phút hoặc liên hệ quản trị viên."*
3. **Mất kết nối máy chủ (W04 / W10)**: Hiển thị thông báo thân thiện: *"Không thể kết nối đến máy chủ IDEA. Vui lòng kiểm tra lại đường truyền mạng."*
4. **Không lưu trữ bí mật (W10)**: Tuyệt đối không lưu mật khẩu hoặc token vào `localStorage`, `sessionStorage`, hay URL parameters.

### User Story 3 — Không gian đón tiếp phiên làm việc (Session Workspace Landing) (Priority: P2)
Khi người dùng đăng nhập thành công, giao diện đón tiếp họ với đầy đủ ngữ cảnh phiên làm việc bằng ngôn ngữ kỹ thuật thân thiện.

**Acceptance Criteria**:
1. Thanh **Topbar** hiển thị logo `IDEA Engineering`, đèn tín hiệu xanh `● Đã kết nối`, thẻ kỹ sư, và nút `Đăng xuất`.
2. Khi bấm **Đăng xuất (W07)**: Chấm dứt phiên làm việc an toàn và quay về màn hình đăng nhập với thông báo *"Bạn đã đăng xuất khỏi phiên làm việc an toàn."*
3. Thẻ thông tin phiên làm việc hiển thị: Kỹ sư phụ trách, Mã tài khoản, Kho lưu trữ kết nối (`Kho chính - icVault-Primary`), và Trạng thái phiên (`Đã kết nối an toàn`). Không hiển thị mã cờ hay cookie nội bộ.

---

## 3. Ranh giới Phân công (Worker Role Boundaries)

- **Gemini (Product Design & Presentational UI Specialist)**:
  - Thiết kế visual, typography, màu sắc, bố cục, feedback states, và tạo file standalone prototype `prototypes/idea-authentication-preview.html` để con người duyệt visual.
  - Đảm bảo tuân thủ 100% Taste Skill và WCAG AA.
- **Codex (Backend & Integration Specialist)**:
  - Tiếp quản các endpoints `/api/v1/identity/*`, quản lý cookie session `IDEA_SESSION`, logic băm mật khẩu, và bảo mật transaction PostgreSQL.
