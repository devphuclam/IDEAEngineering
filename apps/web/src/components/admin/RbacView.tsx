import { useState } from "react";
import {
  AdminActor,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
} from "./mockAdminData";

export interface RbacViewProps {
  assignments: AdminRoleAssignment[];
  roles: AdminRole[];
  actors: AdminActor[];
  projects: AdminProject[];
  selectedAssignmentId?: string;
  onSelectAssignment: (assignment: AdminRoleAssignment) => void;
  onOpenAddAssignment: () => void;
}

export function RbacView({
  assignments,
  roles,
  actors,
  projects,
  selectedAssignmentId,
  onSelectAssignment,
  onOpenAddAssignment,
}: RbacViewProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "roles" | "check_access">("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");

  // State for Check Access tab
  const [checkActorId, setCheckActorId] = useState<string>(actors[0]?.id || "");
  const [checkScope, setCheckScope] = useState<string>("Dự án P-100");

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.principalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.scope.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScope = scopeFilter === "all" || a.scope === scopeFilter;

    return matchesSearch && matchesScope;
  });

  // Compute effective access for Check Access tab
  const effectiveAssignments = assignments.filter(
    (a) => a.principalId === checkActorId && (a.scope === checkScope || a.scope === "Toàn hệ thống")
  );

  const effectiveRoles = roles.filter((r) =>
    effectiveAssignments.some((a) => a.roleId === r.id)
  );

  return (
    <div className="admin-main">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Phân quyền vai trò RBAC</div>
          <h1 className="admin-main-title">Phân Quyền Vai Trò RBAC (Microsoft Azure Parity)</h1>
          <p className="admin-main-desc">
            Kiểm soát quyền truy cập theo vai trò kỹ thuật, phạm vi dự án và kiểm tra quyền thực tế.
          </p>
        </div>

        <div className="admin-head-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={onOpenAddAssignment}
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
            <span>+ Thêm phân quyền vai trò</span>
          </button>
        </div>
      </div>

      {/* Microsoft-style 3 tabs */}
      <div className="admin-tabs-row" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "assignments"}
          className={`admin-tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          <svg style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="18" y1="8" x2="23" y2="8" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <span>Bảng gán vai trò (Role assignments)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "roles"}
          className={`admin-tab-btn ${activeTab === "roles" ? "active" : ""}`}
          onClick={() => setActiveTab("roles")}
        >
          <svg style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Danh mục vai trò (Roles)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "check_access"}
          className={`admin-tab-btn ${activeTab === "check_access" ? "active" : ""}`}
          onClick={() => setActiveTab("check_access")}
        >
          <svg style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Kiểm tra quyền thực tế (Check access)</span>
        </button>
      </div>

      {activeTab === "assignments" && (
        <>
          <div className="admin-toolbar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Tìm theo tên kỹ sư, vai trò hoặc dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="admin-select"
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              aria-label="Lọc theo phạm vi Scope"
            >
              <option value="all">Tất cả phạm vi Scope ({assignments.length})</option>
              <option value="Dự án P-100">Dự án P-100 (Máy đóng gói)</option>
              <option value="Dự án P-200">Dự án P-200 (Đồ gá hàn)</option>
              <option value="Dự án P-300">Dự án P-300 (Cấp phôi)</option>
              <option value="Toàn hệ thống">Toàn hệ thống (Global)</option>
            </select>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table" aria-label="Bảng phân quyền vai trò">
              <thead>
                <tr>
                  <th>Đối tượng (Kỹ sư / Nhóm)</th>
                  <th>Vai trò (Role)</th>
                  <th>Phạm vi (Scope)</th>
                  <th style={{ width: 120 }}>Loại gán</th>
                  <th style={{ width: 120 }}>Ngày gán</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((a) => {
                  const isSelected = selectedAssignmentId === a.id;

                  return (
                    <tr
                      key={a.id}
                      className={isSelected ? "selected" : ""}
                      onClick={() => onSelectAssignment(a)}
                    >
                      <td>
                        <strong>{a.principalName}</strong>
                      </td>
                      <td>
                        <span style={{ color: "var(--admin-blue)", fontWeight: 600 }}>
                          {a.roleName}
                        </span>
                      </td>
                      <td>{a.scope}</td>
                      <td>
                        <span className="admin-status-pill active">{a.assignmentType}</span>
                      </td>
                      <td>{a.assignedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "roles" && (
        <div className="admin-table-container">
          <table className="admin-data-table" aria-label="Danh mục vai trò kỹ thuật">
            <thead>
              <tr>
                <th style={{ width: 240 }}>Tên vai trò</th>
                <th>Mô tả trách nhiệm kỹ thuật</th>
                <th style={{ width: 140 }}>Số quyền hạn</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong style={{ color: "var(--admin-navy)" }}>{r.name}</strong>
                  </td>
                  <td>{r.description}</td>
                  <td>
                    <span className="admin-nav-badge" style={{ fontSize: "11px" }}>
                      {r.permissions.length} quyền
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "check_access" && (
        <div className="admin-table-container">
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--admin-line)",
              borderRadius: 6,
              padding: 20,
              maxWidth: 720,
              marginBottom: 20,
            }}
          >
            <h3 style={{ margin: "0 0 12px", color: "var(--admin-navy)" }}>
              Kiểm tra quyền thực tế (Effective Access Checker)
            </h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12.5px" }}>
              Mô phỏng cơ chế tính toán quyền của Microsoft: Chọn một kỹ sư và phạm vi dự án để tính toán tổng hợp quyền hạn có hiệu lực.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Chọn Kỹ sư (Actor):
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={checkActorId}
                  onChange={(e) => setCheckActorId(e.target.value)}
                >
                  {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>
                      {actor.fullName} (@{actor.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Chọn Phạm vi (Scope):
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={checkScope}
                  onChange={(e) => setCheckScope(e.target.value)}
                >
                  <option value="Dự án P-100">Dự án P-100 (Máy đóng gói)</option>
                  <option value="Dự án P-200">Dự án P-200 (Đồ gá hàn robot)</option>
                  <option value="Dự án P-300">Dự án P-300 (Cấp phôi rung)</option>
                </select>
              </div>
            </div>

            {effectiveRoles.length > 0 ? (
              <div style={{ background: "#f8fafc", border: "1px solid var(--admin-line)", padding: 16, borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span className="admin-status-pill active">Được cấp quyền hợp lệ</span>
                  <span style={{ fontSize: "12px", color: "#475569" }}>
                    Kỹ sư nắm giữ <strong>{effectiveRoles.length} vai trò</strong> tại {checkScope}:
                  </span>
                </div>

                <ul style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: "12.5px" }}>
                  {effectiveRoles.map((r) => (
                    <li key={r.id}>
                      <strong>{r.name}</strong> — {r.description}
                    </li>
                  ))}
                </ul>

                <h4 style={{ margin: "14px 0 8px", fontSize: "12px", color: "var(--admin-navy)" }}>
                  Các quyền kỹ thuật được phép thực thi:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Array.from(
                    new Set(effectiveRoles.flatMap((r) => r.permissions))
                  ).map((perm, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "12px",
                        color: "#1e293b",
                        background: "#ffffff",
                        padding: "6px 10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 3,
                      }}
                    >
                      <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                      <strong style={{ fontFamily: "var(--font-mono)", color: "#166fbd" }}>
                        {perm.action}
                      </strong>
                      <span>— {perm.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, color: "#991b1b", fontSize: "12.5px" }}>
                Kỹ sư này hiện <strong>không có quyền hạn nào</strong> tại {checkScope}. Mọi thao tác Checkout/Check-in bản vẽ sẽ bị từ chối an toàn (Fail-closed).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
