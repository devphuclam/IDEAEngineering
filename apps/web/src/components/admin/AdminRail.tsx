export type AdminSection = "accounts" | "departments" | "projects" | "rbac";

export interface AdminRailProps {
  activeSection: AdminSection;
  counts: {
    accounts: number;
    departments: number;
    projects: number;
    assignments: number;
  };
  onSelectSection: (section: AdminSection) => void;
}

export function AdminRail({
  activeSection,
  counts,
  onSelectSection,
}: AdminRailProps) {
  return (
    <aside className="admin-rail" aria-label="Thanh điều hướng phân hệ quản trị">
      <div className="admin-rail-head">
        <span className="admin-rail-eyebrow">Phân hệ quản trị</span>
        <div className="admin-rail-title">Quản Trị Hệ Thống DDM</div>
      </div>

      <div className="admin-rail-scroll">
        <div className="admin-rail-section-label">Người dùng &amp; Truy cập</div>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "accounts" ? "active" : ""}`}
          onClick={() => onSelectSection("accounts")}
          aria-current={activeSection === "accounts" ? "page" : undefined}
        >
          <svg
            style={{ width: 16, height: 16, flexShrink: 0 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Tài khoản &amp; Định danh</span>
          <span className="admin-nav-badge">{counts.accounts}</span>
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "departments" ? "active" : ""}`}
          onClick={() => onSelectSection("departments")}
          aria-current={activeSection === "departments" ? "page" : undefined}
        >
          <svg
            style={{ width: 16, height: 16, flexShrink: 0 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Cơ cấu tổ chức &amp; Phòng ban</span>
          <span className="admin-nav-badge">{counts.departments}</span>
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "projects" ? "active" : ""}`}
          onClick={() => onSelectSection("projects")}
          aria-current={activeSection === "projects" ? "page" : undefined}
        >
          <svg
            style={{ width: 16, height: 16, flexShrink: 0 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>Dự án &amp; Nhóm cơ khí</span>
          <span className="admin-nav-badge">{counts.projects}</span>
        </button>

        <div className="admin-rail-section-label" style={{ marginTop: 14 }}>
          Bảo mật &amp; Phân quyền
        </div>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "rbac" ? "active" : ""}`}
          onClick={() => onSelectSection("rbac")}
          aria-current={activeSection === "rbac" ? "page" : undefined}
        >
          <svg
            style={{ width: 16, height: 16, flexShrink: 0 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Phân quyền vai trò RBAC</span>
          <span className="admin-nav-badge">{counts.assignments}</span>
        </button>
      </div>

      <div className="admin-rail-footer">
        <strong>Chuẩn phân quyền F04</strong>
        <p style={{ margin: "4px 0 0", color: "#64748b" }}>
          Được bảo vệ bằng chính sách IAM fail-closed của IDEA Engineering.
        </p>
      </div>
    </aside>
  );
}
