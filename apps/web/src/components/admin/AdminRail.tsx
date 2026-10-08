export type AdminSection = "accounts" | "departments" | "projects" | "rbac";

export interface AdminRailProps {
  activeSection: AdminSection;
  counts?: Partial<Record<"accounts" | "departments" | "projects" | "assignments", number>>;
  availableSections?: AdminSection[];
  onSelectSection: (section: AdminSection) => void;
}

export function AdminRail({
  activeSection,
  counts = {},
  availableSections = ["accounts"],
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
          disabled={!availableSections.includes("accounts")}
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
          {counts.accounts !== undefined && <span className="admin-nav-badge">{counts.accounts}</span>}
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "departments" ? "active" : ""}`}
          disabled={!availableSections.includes("departments")}
          title="Group được quản trị trong đúng Project"
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
          <span>Nhóm trong phạm vi</span>
          {counts.departments !== undefined && <span className="admin-nav-badge">{counts.departments}</span>}
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "projects" ? "active" : ""}`}
          disabled={!availableSections.includes("projects")}
          title={availableSections.includes("projects")?"Quản trị Project và Group":"Không có quyền quản trị Project"}
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
          <span>Dự án &amp; Nhóm</span>
          {counts.projects !== undefined && <span className="admin-nav-badge">{counts.projects}</span>}
        </button>

        <div className="admin-rail-section-label" style={{ marginTop: 14 }}>
          Bảo mật &amp; Phân quyền
        </div>

        <button
          type="button"
          className={`admin-nav-item ${activeSection === "rbac" ? "active" : ""}`}
          disabled={!availableSections.includes("rbac")}
          title="Chưa có trong Account MVP"
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
          {counts.assignments !== undefined && <span className="admin-nav-badge">{counts.assignments}</span>}
        </button>
      </div>

      <div className="admin-rail-footer">
        <strong>Authority từ IDEA Server</strong>
        <p style={{ margin: "4px 0 0", color: "#64748b" }}>
          Được bảo vệ bằng chính sách IAM fail-closed của IDEA Engineering.
        </p>
      </div>
    </aside>
  );
}
