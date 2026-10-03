import { FormEvent, useState } from "react";
import { formatDisplayId, isUuidOrLongIdentifier } from "../../utils/identity";
import {
  AdminActor,
  AdminProject,
  AdminRoleAssignment,
  INITIAL_ACTORS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PROJECTS,
  INITIAL_ROLES,
} from "../admin/mockAdminData";
import "../../styles/profile.css";

export interface UserProfileScreenProps {
  actorId: string;
  accountId: string;
  onBack: () => void;
  onOpenAdmin?: () => void;
  onLogout: () => void;
  logoSrc?: string;
}

export type ProfileTab = "personal" | "roles" | "projects" | "security";

export function UserProfileScreen({
  actorId,
  accountId,
  onBack,
  onOpenAdmin,
  onLogout,
  logoSrc = "/logo-idea.png",
}: UserProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Match current actor or fallback to senior engineer profile
  const matchedActor: AdminActor = INITIAL_ACTORS.find(
    (a) => a.id === actorId || a.username === actorId || a.fullName === actorId
  ) || {
    id: actorId,
    username: isUuidOrLongIdentifier(actorId) ? "an.nguyen" : actorId,
    fullName: isUuidOrLongIdentifier(actorId) ? "Nguyễn Văn An" : actorId,
    email: `${isUuidOrLongIdentifier(actorId) ? "an.nguyen" : actorId}@ideagroupvn.com`,
    department: "Phòng Thiết kế Cơ khí JIG & Máy",
    status: "active",
    createdAt: "2026-01-01",
  };

  // Personal Info Form State
  const [fullName, setFullName] = useState(matchedActor.fullName);
  const [phone, setPhone] = useState("+84 908 123 456");
  const [specialty, setSpecialty] = useState("Thiết kế kết cấu JIG & Máy tự động hóa");
  const [personalMsg, setPersonalMsg] = useState<string | null>(null);

  // Password Form State
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Emergency action state
  const [securityActionMsg, setSecurityActionMsg] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1800);
      }
    } catch {
      // Fallback ignore
    }
  };

  const handleSavePersonal = (e: FormEvent) => {
    e.preventDefault();
    setPersonalMsg("✓ Đã lưu thay đổi thông tin cá nhân thành công.");
    setTimeout(() => setPersonalMsg(null), 3000);
  };

  const handleSavePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg({ text: "Vui lòng nhập đầy đủ các trường mật khẩu.", isError: true });
      return;
    }
    if (newPwd.length < 8) {
      setPwdMsg({ text: "Mật khẩu mới phải có tối thiểu 8 ký tự.", isError: true });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ text: "Mật khẩu xác nhận không khớp.", isError: true });
      return;
    }
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setPwdMsg({ text: "✓ Mật khẩu tài khoản đã được cập nhật thành công.", isError: false });
    setTimeout(() => setPwdMsg(null), 3500);
  };

  // Assigned Roles & Permissions for this engineer
  const userAssignments: AdminRoleAssignment[] = INITIAL_ASSIGNMENTS.filter(
    (asg) =>
      asg.principalId === matchedActor.id ||
      asg.principalName === matchedActor.fullName ||
      asg.principalType === "group"
  );

  // Assigned Projects for this engineer
  const userProjects: AdminProject[] = INITIAL_PROJECTS.filter(
    (p) => p.lead === matchedActor.fullName || p.id === "proj_p100" || p.id === "proj_p200"
  );

  const displayActorId = formatDisplayId(matchedActor.id);
  const displayAccountId = formatDisplayId(accountId);

  // Initials for avatar
  const initials = matchedActor.fullName
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div className="profile-shell" aria-label="Hồ sơ người dùng">
      {/* Top Navigation Bar */}
      <nav className="topbar-container" aria-label="Thanh điều hướng hồ sơ">
        <div className="topbar-brand">
          <img src={logoSrc} alt="IDEA Engineering Logo" className="topbar-logo-img" />
          <span className="topbar-brand-text">IDEA Engineering</span>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="admin-btn"
            style={{
              background: "#1e293b",
              color: "#ffffff",
              borderColor: "#334155",
            }}
            onClick={onBack}
          >
            ← Về Bàn Làm Việc
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              className="admin-btn"
              style={{
                background: "#0f172a",
                color: "#93c5fd",
                borderColor: "#1e3a8a",
              }}
              onClick={onOpenAdmin}
            >
              Cổng Quản Trị
            </button>
          )}

          <button type="button" className="logout-btn" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="profile-container">
        {/* Hero Header Card */}
        <section className="profile-hero-card" aria-label="Thông tin tổng quan kỹ sư">
          <div className="profile-hero-cover">
            <div className="profile-hero-cover-badge">
              <span className="pulse-dot" style={{ width: 7, height: 7 }} />
              Phiên bảo mật hoạt động &bull; Core C1 v0.14
            </div>
          </div>

          <div className="profile-hero-content">
            <div className="profile-avatar-row">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-online-badge" title="Đang hoạt động" />
              </div>

              <div className="profile-hero-actions">
                <span className="admin-status-pill active" style={{ fontSize: "12px", padding: "4px 10px" }}>
                  ✓ Đã xác thực định danh IAM
                </span>
              </div>
            </div>

            <div className="profile-title-block">
              <h1>
                {matchedActor.fullName}
                <span className="profile-role-tag">Kỹ sư Cơ khí Chế tạo máy</span>
              </h1>
              <p>
                <span>🏢 {matchedActor.department}</span>
                <span>&bull;</span>
                <span>✉️ {matchedActor.email}</span>
                <span>&bull;</span>
                <span>🗓️ Thành viên từ: {matchedActor.createdAt}</span>
              </p>
            </div>

            <div className="profile-identity-chips">
              <div className="profile-chip">
                <span>Mã kỹ sư (Actor ID):</span>
                <strong>{displayActorId}</strong>
                <button
                  type="button"
                  className="profile-chip-copy-btn"
                  title="Sao chép toàn bộ mã định danh"
                  onClick={() => handleCopy(matchedActor.id, "actor")}
                >
                  {copiedKey === "actor" ? "✓" : "📋"}
                </button>
              </div>

              <div className="profile-chip">
                <span>Mã tài khoản (Account ID):</span>
                <strong>{displayAccountId}</strong>
                <button
                  type="button"
                  className="profile-chip-copy-btn"
                  title="Sao chép mã tài khoản"
                  onClick={() => handleCopy(accountId, "account")}
                >
                  {copiedKey === "account" ? "✓" : "📋"}
                </button>
              </div>

              <div className="profile-chip">
                <span>Tên đăng nhập:</span>
                <strong>@{matchedActor.username}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="profile-tabs-nav" aria-label="Các mục hồ sơ">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <span>👤 Thông tin cá nhân &amp; Thiết lập</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "roles" ? "active" : ""}`}
            onClick={() => setActiveTab("roles")}
          >
            <span>🛡️ Vai trò &amp; Thẩm quyền kỹ thuật</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <span>📁 Dự án đang tham gia ({userProjects.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <span>🔒 Bảo mật &amp; Lịch sử phiên</span>
          </button>
        </nav>

        {/* TAB 1: THÔNG TIN CÁ NHÂN & THIẾT LẬP */}
        {activeTab === "personal" && (
          <div className="profile-panel">
            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Hồ sơ thông tin kỹ sư</h2>
                  <p className="profile-card-desc">
                    Thông tin liên hệ kỹ thuật và chuyên môn nghiệp vụ trong Tập đoàn IDEA.
                  </p>
                </div>
              </div>

              {personalMsg && (
                <div
                  style={{
                    background: "#ecfdf5",
                    color: "#065f46",
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: "13px",
                    marginBottom: 16,
                    border: "1px solid #a7f3d0",
                  }}
                >
                  {personalMsg}
                </div>
              )}

              <form onSubmit={handleSavePersonal}>
                <div className="profile-form-grid">
                  <div className="profile-field-group">
                    <label className="profile-label">Họ và tên kỹ sư:</label>
                    <input
                      type="text"
                      className="profile-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Tên đăng nhập hệ thống:</label>
                    <input
                      type="text"
                      className="profile-input"
                      value={matchedActor.username}
                      disabled
                      title="Tên đăng nhập do quản trị viên IAM cấp"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Email công việc:</label>
                    <input
                      type="email"
                      className="profile-input"
                      value={matchedActor.email}
                      disabled
                      title="Email liên kết miền @ideagroupvn.com"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Số điện thoại nội bộ / Di động:</label>
                    <input
                      type="tel"
                      className="profile-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="profile-field-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="profile-label">Phòng ban trực thuộc:</label>
                    <input
                      type="text"
                      className="profile-input"
                      value={matchedActor.department}
                      disabled
                      title="Phòng ban được quản lý bởi cơ cấu IAM tập đoàn"
                    />
                    <small style={{ fontSize: "11px", color: "#64748b", marginTop: 3 }}>
                      Phòng ban do quản trị viên IAM chỉ định theo cơ cấu tổ chức doanh nghiệp.
                    </small>
                  </div>

                  <div className="profile-field-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="profile-label">Chuyên môn &amp; Lĩnh vực phụ trách:</label>
                    <input
                      type="text"
                      className="profile-input"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ví dụ: Thiết kế Jig hàn Robot, Đồ gá gia công CNC, Băng tải tự động"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button type="submit" className="admin-btn primary">
                    Lưu thay đổi hồ sơ
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Đổi mật khẩu tài khoản</h2>
                  <p className="profile-card-desc">
                    Cập nhật mật khẩu định kỳ để bảo vệ dữ liệu thiết kế và bản vẽ kỹ thuật.
                  </p>
                </div>
              </div>

              {pwdMsg && (
                <div
                  style={{
                    background: pwdMsg.isError ? "#fef2f2" : "#ecfdf5",
                    color: pwdMsg.isError ? "#991b1b" : "#065f46",
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: "13px",
                    marginBottom: 16,
                    border: `1px solid ${pwdMsg.isError ? "#fecaca" : "#a7f3d0"}`,
                  }}
                >
                  {pwdMsg.text}
                </div>
              )}

              <form onSubmit={handleSavePassword}>
                <div className="profile-form-grid">
                  <div className="profile-field-group">
                    <label className="profile-label">Mật khẩu hiện tại:</label>
                    <input
                      type="password"
                      className="profile-input"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Mật khẩu mới (tối thiểu 8 ký tự):</label>
                    <input
                      type="password"
                      className="profile-input"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="profile-field-group">
                    <label className="profile-label">Xác nhận mật khẩu mới:</label>
                    <input
                      type="password"
                      className="profile-input"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button type="submit" className="admin-btn">
                    Cập nhật mật khẩu mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: VAI TRÒ & THẨM QUYỀN KỸ THUẬT */}
        {activeTab === "roles" && (
          <div className="profile-panel">
            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Các vai trò được gán</h2>
                  <p className="profile-card-desc">
                    Quyền hạn thực tế của bạn trên từng dự án máy móc cơ khí và kho lưu trữ icVault.
                  </p>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-data-table" aria-label="Danh sách vai trò hiệu lực">
                  <thead>
                    <tr>
                      <th>Vai trò kỹ thuật</th>
                      <th>Phạm vi áp dụng</th>
                      <th style={{ width: 140 }}>Cơ chế gán</th>
                      <th style={{ width: 140 }}>Ngày chỉ định</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAssignments.map((asg) => (
                      <tr key={asg.id}>
                        <td>
                          <strong style={{ color: "var(--admin-navy)" }}>{asg.roleName}</strong>
                        </td>
                        <td>
                          <span style={{ color: "var(--admin-blue)", fontWeight: 600 }}>
                            {asg.scope}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status-pill ${asg.assignmentType === "Direct" ? "active" : "pending"}`}>
                            {asg.assignmentType === "Direct" ? "Trực tiếp" : "Kế thừa phòng"}
                          </span>
                        </td>
                        <td>{asg.assignedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Thẩm quyền thao tác DDM/CAD được cấp phép</h2>
                  <p className="profile-card-desc">
                    Các hành động kỹ thuật bạn có thẩm quyền thực hiện trên hệ thống dữ liệu bản vẽ.
                  </p>
                </div>
              </div>

              <div className="perm-matrix-grid">
                {INITIAL_ROLES.slice(0, 3).map((r) => (
                  <div key={r.id} className="perm-domain-box">
                    <div className="perm-domain-title">
                      <span>🛡️</span>
                      <span>{r.name}</span>
                    </div>
                    <div className="perm-action-list">
                      {r.permissions.map((p) => (
                        <div key={p.action} className="perm-action-item">
                          <span className="perm-action-code">{p.action}</span>
                          <span className="perm-action-desc">{p.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DỰ ÁN ĐANG THAM GIA */}
        {activeTab === "projects" && (
          <div className="profile-panel">
            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Dự án máy móc &amp; Đồ gá được phân công</h2>
                  <p className="profile-card-desc">
                    Các không gian dự án mà bạn có quyền truy cập kho bản vẽ icVault và cập nhật danh mục BOM.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {userProjects.map((p) => (
                  <div key={p.id} className="profile-project-card">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: "#eff6ff",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        📁
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong style={{ fontFamily: "var(--font-mono)", color: "var(--admin-blue)", fontSize: "14px" }}>
                            [{p.code}]
                          </strong>
                          <strong style={{ fontSize: "14px", color: "var(--admin-navy)" }}>
                            {p.name}
                          </strong>
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                          Chủ trì dự án: <strong>{p.lead}</strong> &bull; Kho lưu trữ: <strong>{p.vault}</strong> &bull; Quy mô: <strong>{p.memberCount} kỹ sư</strong>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="admin-status-pill active">
                        Đang tham gia
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BẢO MẬT & LỊCH SỬ PHIÊN */}
        {activeTab === "security" && (
          <div className="profile-panel">
            <div className="profile-card">
              <div className="profile-card-head">
                <div>
                  <h2 className="profile-card-title">Trạng thái bảo mật phiên làm việc</h2>
                  <p className="profile-card-desc">
                    Hệ thống kiểm soát định danh và bảo vệ phiên làm việc theo tiêu chuẩn F04.
                  </p>
                </div>
              </div>

              <div className="profile-form-grid" style={{ marginBottom: 20 }}>
                <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>Chính sách Fail-Closed IAM</strong>
                    <span className="admin-status-pill active">Đang bảo vệ</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Mọi yêu cầu truy xuất dữ liệu ngoài phạm vi ủy quyền sẽ tự động bị từ chối an toàn.
                  </p>
                </div>

                <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>Bảo vệ CSRF Token</strong>
                    <span className="admin-status-pill active">Đã kích hoạt</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Phiên làm việc được ký số bảo vệ chống tấn công chéo nguồn (Cross-Site Request Forgery).
                  </p>
                </div>
              </div>

              {securityActionMsg && (
                <div
                  style={{
                    background: "#eff6ff",
                    color: "#1e40af",
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: "13px",
                    marginBottom: 16,
                    border: "1px solid #bfdbfe",
                  }}
                >
                  {securityActionMsg}
                </div>
              )}

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                <h3 style={{ fontSize: "13.5px", margin: "0 0 10px", color: "#0f172a" }}>
                  Phiên làm việc hiện tại của bạn
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", border: "1px solid #e2e8f0", padding: "12px 14px", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "22px" }}>💻</span>
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                        Máy trạm Windows Desktop &bull; Trình duyệt Web DDM
                      </strong>
                      <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                        Mạng nội bộ R&D Tập đoàn IDEA &bull; Phiên đăng nhập lúc: 2026-10-03 08:30
                      </div>
                    </div>
                  </div>
                  <span className="admin-status-pill active">Thiết bị hiện tại</span>
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => {
                      setSecurityActionMsg("✓ Đã vô hiệu hóa toàn bộ các phiên làm việc khác trên thiết bị từ xa.");
                      setTimeout(() => setSecurityActionMsg(null), 3000);
                    }}
                  >
                    Đăng xuất khỏi tất cả thiết bị khác
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
