import { useState } from "react";
import { AdminActor, AdminDepartment, AdminRole } from "./mockAdminData";

export interface DepartmentsViewProps {
  departments: AdminDepartment[];
  actors: AdminActor[];
  roles: AdminRole[];
  selectedDepartmentId?: string;
  onSelectDepartment: (dept: AdminDepartment) => void;
  onOpenCreateDepartment: () => void;
}

export function DepartmentsView({
  departments,
  actors,
  roles,
  selectedDepartmentId,
  onSelectDepartment,
  onOpenCreateDepartment,
}: DepartmentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = departments.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.lead.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-main">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Cơ cấu tổ chức &amp; Phòng ban</div>
          <h1 className="admin-main-title">Cơ Cấu Tổ Chức &amp; Phòng Ban</h1>
          <p className="admin-main-desc">
            Quản lý sơ đồ phòng ban kỹ thuật, người phụ trách và cấu hình các vai trò được phép hoạt động.
          </p>
        </div>

        <div className="admin-head-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={onOpenCreateDepartment}
          >
            <svg
              style={{ width: 14, height: 14 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tạo phòng ban mới</span>
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Tìm theo tên phòng ban, mã phòng (DEPT-MECH) hoặc người phụ trách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-data-table" aria-label="Danh sách phòng ban">
          <thead>
            <tr>
              <th style={{ width: 130 }}>Mã phòng</th>
              <th>Tên phòng ban &amp; Chức năng</th>
              <th>Trưởng phòng / Phụ trách</th>
              <th style={{ width: 110 }}>Nhân sự</th>
              <th>Vai trò kỹ thuật cho phép</th>
              <th style={{ width: 110 }}>Thành lập</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => {
              const isSelected = selectedDepartmentId === dept.id;
              const memberCount = actors.filter((a) => a.department === dept.name).length;
              const deptRoles = roles.filter((r) =>
                dept.allowedRoleIds
                  ? dept.allowedRoleIds.includes(r.id)
                  : r.departments?.includes(dept.name)
              );

              return (
                <tr
                  key={dept.id}
                  className={isSelected ? "selected" : ""}
                  onClick={() => onSelectDepartment(dept)}
                >
                  <td>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--admin-navy)" }}>
                      {dept.code}
                    </strong>
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                        {dept.name}
                      </strong>
                      <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "11.5px" }}>
                        {dept.description}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "14px" }}>👤</span>
                      <span>{dept.lead}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-nav-badge" style={{ fontSize: "11px" }}>
                      {memberCount} kỹ sư
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {deptRoles.map((r) => (
                        <span
                          key={r.id}
                          className="admin-status-pill active"
                          style={{ fontSize: "10.5px", padding: "1px 6px" }}
                        >
                          {r.name}
                        </span>
                      ))}
                      {deptRoles.length === 0 && (
                        <span style={{ color: "#94a3b8", fontSize: "11px", fontStyle: "italic" }}>
                          Chưa gán vai trò
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "12px" }}>{dept.createdAt}</td>
                </tr>
              );
            })}

            {filteredDepartments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                  Không tìm thấy phòng ban nào khớp với từ khóa tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
