import { useState } from "react";
import {
  AdminActor,
  AdminGroup,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
  INITIAL_GROUPS,
} from "./mockAdminData";

export interface RbacViewProps {
  assignments: AdminRoleAssignment[];
  roles: AdminRole[];
  actors: AdminActor[];
  groups?: AdminGroup[];
  projects: AdminProject[];
  selectedAssignmentId?: string;
  onSelectAssignment: (assignment: AdminRoleAssignment) => void;
  onOpenAddAssignment: () => void;
}

export function RbacView({
  assignments,
  roles,
  actors,
  groups = INITIAL_GROUPS,
  projects,
  selectedAssignmentId,
  onSelectAssignment,
  onOpenAddAssignment,
}: RbacViewProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "roles" | "check_access">("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "group" | "user">("all");

  // State for Check Access tab
  const [checkActorId, setCheckActorId] = useState<string>(actors[0]?.id || "");
  const [checkScope, setCheckScope] = useState<string>("Dự án P-100");

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.principalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.groupCode && a.groupCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesScope = scopeFilter === "all" || a.scope === scopeFilter;
    const matchesType = typeFilter === "all" || a.principalType === typeFilter;

    return matchesSearch && matchesScope && matchesType;
  });

  // Microsoft-Style Effective Access Computation: Direct + Inherited via Groups
  const selectedCheckActor = actors.find((a) => a.id === checkActorId) || actors[0];

  // 1. Direct assignments for this actor
  const directAssignments = assignments.filter(
    (a) =>
      a.principalType === "user" &&
      a.principalId === checkActorId &&
      (a.scope === checkScope || a.scope === "Toàn hệ thống")
  );

  // 2. Inherited assignments from Groups matching the actor's department
  const matchingGroups = groups.filter(
    (g) =>
      g.department === selectedCheckActor?.department ||
      g.name === selectedCheckActor?.department
  );

  const inheritedGroupAssignments = assignments.filter(
    (a) =>
      a.principalType === "group" &&
      matchingGroups.some((g) => g.id === a.principalId) &&
      (a.scope === checkScope || a.scope === "Toàn hệ thống")
  );

  interface EffectiveRoleItem {
    roleId: string;
    roleName: string;
    assignmentType: "Direct" | "Inherited";
    source: string;
    scope: string;
    roleDef?: AdminRole;
  }

  const effectiveRolesMap = new Map<string, EffectiveRoleItem>();

  // Add direct assignments
  for (const asg of directAssignments) {
    const roleDef = roles.find((r) => r.id === asg.roleId);
    effectiveRolesMap.set(asg.roleId, {
      roleId: asg.roleId,
      roleName: asg.roleName,
      assignmentType: "Direct",
      source: "Gán trực tiếp cho tài khoản",
      scope: asg.scope,
      roleDef,
    });
  }

  // Add inherited assignments (if already exists directly, direct takes precedence or union)
  for (const asg of inheritedGroupAssignments) {
    const roleDef = roles.find((r) => r.id === asg.roleId);
    if (!effectiveRolesMap.has(asg.roleId)) {
      effectiveRolesMap.set(asg.roleId, {
        roleId: asg.roleId,
        roleName: asg.roleName,
        assignmentType: "Inherited",
        source: `Kế thừa từ Nhóm: ${asg.principalName} [${asg.groupCode || "Group"}]`,
        scope: asg.scope,
        roleDef,
      });
    }
  }

  const effectiveRoleList = Array.from(effectiveRolesMap.values());
  const hasInheritedRoles = effectiveRoleList.some((r) => r.assignmentType === "Inherited");

  return (
    <div className="admin-main">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Phân quyền vai trò RBAC</div>
          <h1 className="admin-main-title">Phân Quyền Vai Trò RBAC (Microsoft Azure Parity)</h1>
          <p className="admin-main-desc">
            Kiểm soát quyền truy cập theo vai trò kỹ thuật, nhóm phòng ban (Group RBAC) và kiểm tra quyền thực tế.
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
            <span>Thêm phân quyền vai trò</span>
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
              placeholder="Tìm theo tên kỹ sư, nhóm, vai trò hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="admin-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "group" | "user")}
              aria-label="Lọc theo loại đối tượng"
            >
              <option value="all">Tất cả đối tượng (Nhóm &amp; Kỹ sư)</option>
              <option value="group">👥 Nhóm kỹ thuật (Group)</option>
              <option value="user">👤 Kỹ sư cá nhân (User)</option>
            </select>

            <select
              className="admin-select"
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              aria-label="Lọc theo phạm vi Scope"
            >
              <option value="all">Tất cả phạm vi Scope ({assignments.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={`Dự án ${p.code}`}>
                  Dự án {p.code} ({p.name})
                </option>
              ))}
              <option value="Toàn hệ thống">Toàn hệ thống (Global)</option>
            </select>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table" aria-label="Bảng phân quyền vai trò">
              <thead>
                <tr>
                  <th>Đối tượng thụ hưởng (Principal)</th>
                  <th>Vai trò (Role)</th>
                  <th>Phạm vi (Scope)</th>
                  <th style={{ width: 120 }}>Cơ chế gán</th>
                  <th style={{ width: 110 }}>Ngày gán</th>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {a.principalType === "group" ? (
                            <span className="admin-entity-badge group">👥 Nhóm</span>
                          ) : (
                            <span className="admin-entity-badge user">👤 Kỹ sư</span>
                          )}
                          <div>
                            <strong style={{ display: "block", color: "var(--admin-navy)" }}>
                              {a.principalName}
                            </strong>
                            {a.principalType === "group" && a.groupCode && (
                              <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                                {a.groupCode} • {a.memberCount ? `${a.memberCount} kỹ sư` : "Cả phòng ban"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "var(--admin-blue)", fontWeight: 600 }}>
                          {a.roleName}
                        </span>
                      </td>
                      <td>{a.scope}</td>
                      <td>
                        <span className={`admin-status-pill ${a.assignmentType === "Direct" ? "active" : "pending"}`}>
                          {a.assignmentType === "Direct" ? "Trực tiếp" : "Kế thừa"}
                        </span>
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
              maxWidth: 760,
              marginBottom: 20,
            }}
          >
            <h3 style={{ margin: "0 0 8px", color: "var(--admin-navy)" }}>
              Kiểm tra quyền thực tế (Effective Access Checker — Microsoft Azure Parity)
            </h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12.5px" }}>
              Tính toán tổng hợp quyền hạn có hiệu lực cho một kỹ sư trên một dự án máy, bao gồm cả quyền <strong>gán trực tiếp</strong> và quyền <strong>tự động kế thừa từ Nhóm phòng ban</strong>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Chọn Kỹ sư kiểm tra:
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
                <span style={{ display: "block", marginTop: 4, fontSize: "11px", color: "#64748b" }}>
                  Phòng ban: <strong>{selectedCheckActor?.department}</strong>
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Chọn Phạm vi dự án (Scope):
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={checkScope}
                  onChange={(e) => setCheckScope(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={`Dự án ${p.code}`}>
                      Dự án {p.code} ({p.name})
                    </option>
                  ))}
                  <option value="Toàn hệ thống">Toàn hệ thống (Global Scope)</option>
                </select>
              </div>
            </div>

            {/* Microsoft Entra ID explanation for new hires */}
            {hasInheritedRoles && (
              <div className="admin-tip-box" style={{ marginBottom: 16 }}>
                <span className="admin-tip-icon" aria-hidden="true">💡</span>
                <div>
                  <strong>Giải thích cơ chế phân quyền cho người mới (Microsoft Entra ID):</strong>
                  <br />
                  Kỹ sư <strong>{selectedCheckActor.fullName}</strong> thuộc <em>{selectedCheckActor.department}</em>. Khi mới gia nhập công ty hoặc nhận dự án, kỹ sư này <strong>tự động kế thừa quyền</strong> từ chính sách phân quyền của Nhóm phòng ban mà không cần ai phải cấu hình thủ công từng tài khoản.
                </div>
              </div>
            )}

            {effectiveRoleList.length > 0 ? (
              <div style={{ background: "#f8fafc", border: "1px solid var(--admin-line)", padding: 16, borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span className="admin-status-pill active">Được cấp quyền hợp lệ</span>
                  <span style={{ fontSize: "12px", color: "#475569" }}>
                    Kỹ sư nắm giữ <strong>{effectiveRoleList.length} vai trò</strong> tại {checkScope}:
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {effectiveRoleList.map((item) => (
                    <div
                      key={item.roleId}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 4,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                          {item.roleName}
                        </strong>
                        <span className={`admin-status-pill ${item.assignmentType === "Direct" ? "active" : "pending"}`}>
                          {item.assignmentType === "Direct" ? "Gán trực tiếp" : "Kế thừa từ Nhóm"}
                        </span>
                      </div>
                      <div style={{ marginTop: 4, fontSize: "11.5px", color: "#64748b" }}>
                        Nguồn gốc quyền: <strong style={{ color: "#334155" }}>{item.source}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 style={{ margin: "14px 0 8px", fontSize: "12px", color: "var(--admin-navy)" }}>
                  Các quyền kỹ thuật được phép thực thi trong dự án:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Array.from(
                    new Set(
                      effectiveRoleList
                        .flatMap((item) => item.roleDef?.permissions || [])
                        .map((p) => JSON.stringify(p))
                    )
                  ).map((pStr, idx) => {
                    const perm = JSON.parse(pStr);
                    return (
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
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, color: "#991b1b", fontSize: "12.5px" }}>
                Kỹ sư này hiện <strong>không có quyền hạn nào</strong> tại {checkScope}. Mọi thao tác Checkout/Check-in bản vẽ CAD sẽ bị từ chối an toàn (Fail-closed).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
