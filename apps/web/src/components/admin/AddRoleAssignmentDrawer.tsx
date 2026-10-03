import { useEffect, useState } from "react";
import {
  AdminActor,
  AdminGroup,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
  ADMIN_DEPARTMENTS,
} from "./mockAdminData";

export interface AddRoleAssignmentDrawerProps {
  isOpen: boolean;
  roles: AdminRole[];
  actors: AdminActor[];
  groups?: AdminGroup[];
  projects: AdminProject[];
  preselectedProjectId?: string;
  preselectedActorId?: string;
  initialStep?: 1 | 2 | 3 | 4;
  onClose: () => void;
  onSubmit: (assignment: Omit<AdminRoleAssignment, "id" | "assignedAt">) => void;
  onAddActor?: (newActor: AdminActor) => void;
}

export function AddRoleAssignmentDrawer({
  isOpen,
  roles,
  actors,
  projects,
  preselectedProjectId,
  preselectedActorId,
  initialStep = 1,
  onClose,
  onSubmit,
  onAddActor,
}: AddRoleAssignmentDrawerProps) {
  if (!isOpen) return null;

  // Step 1: Dự án (Scope) -> Step 2: Kỹ sư (Engineer) -> Step 3: Vai trò (Role) -> Step 4: Xác nhận (Review)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);

  // Step 1: Selected Project / Scope
  const defaultScope = preselectedProjectId
    ? `Dự án ${projects.find((p) => p.id === preselectedProjectId)?.code || projects[0]?.code}`
    : `Dự án ${projects[0]?.code || "P-100"}`;
  const [selectedScope, setSelectedScope] = useState<string>(defaultScope);
  const targetProject = projects.find((p) => selectedScope.includes(p.code));

  // Step 2: Selected Actor (Default to first ACTIVE actor, NEVER suspended)
  const activeActors = actors.filter((a) => a.status === "active");
  const [selectedActorId, setSelectedActorId] = useState<string>(
    preselectedActorId || activeActors[0]?.id || actors[0]?.id || ""
  );

  const selectedActor = actors.find((a) => a.id === selectedActorId) || actors[0];

  // Step 3: Selected Department & Role Filter
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    selectedActor?.department && ADMIN_DEPARTMENTS.includes(selectedActor.department)
      ? selectedActor.department
      : ADMIN_DEPARTMENTS[0]
  );

  // Auto-sync selectedDepartment when chosen engineer changes
  useEffect(() => {
    if (selectedActor?.department && ADMIN_DEPARTMENTS.includes(selectedActor.department)) {
      setSelectedDepartment(selectedActor.department);
    }
  }, [selectedActorId, selectedActor?.department]);

  const filteredRoles = roles.filter((r) =>
    r.departments ? r.departments.includes(selectedDepartment) : true
  );

  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    filteredRoles[0]?.id || roles[0]?.id || ""
  );

  // Ensure selectedRoleId points to an available role in the filtered department list
  useEffect(() => {
    if (filteredRoles.length > 0 && !filteredRoles.some((r) => r.id === selectedRoleId)) {
      setSelectedRoleId(filteredRoles[0].id);
    }
  }, [selectedDepartment, filteredRoles, selectedRoleId]);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || filteredRoles[0] || roles[0];

  // Search filter for Step 2
  const [actorSearch, setActorSearch] = useState("");

  // Inline Quick Onboard state for new engineer
  const [isQuickCreating, setIsQuickCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newDepartment, setNewDepartment] = useState("Phòng Thiết kế Cơ khí JIG & Máy");

  const filteredActors = actors.filter(
    (a) =>
      a.fullName.toLowerCase().includes(actorSearch.toLowerCase()) ||
      a.username.toLowerCase().includes(actorSearch.toLowerCase()) ||
      a.department.toLowerCase().includes(actorSearch.toLowerCase())
  );

  const handleQuickCreateActor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) return;

    const createdActor: AdminActor = {
      id: `actor_${Date.now()}`,
      fullName: newName.trim(),
      username: newUsername.trim().toLowerCase().replace(/\s+/g, "."),
      email: `${newUsername.trim().toLowerCase().replace(/\s+/g, ".")}@ideagroupvn.com`,
      department: newDepartment,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddActor?.(createdActor);
    setSelectedActorId(createdActor.id);
    setIsQuickCreating(false);
    setNewName("");
    setNewUsername("");
  };

  const handleFinish = () => {
    onSubmit({
      principalId: selectedActor.id,
      principalName: selectedActor.fullName,
      principalType: "user",
      roleId: selectedRole.id,
      roleName: selectedRole.name.split("(")[0].trim(),
      scope: selectedScope,
      assignmentType: "Direct",
    });
    onClose();
  };

  return (
    <div className="admin-drawer-overlay" role="dialog" aria-modal="true" aria-label="Phân công nhân sự & Vai trò dự án">
      <div className="admin-drawer-panel">
        <div className="admin-drawer-head">
          <div>
            <h2 className="admin-drawer-title">Phân công nhân sự dự án</h2>
            <small style={{ color: "#64748b" }}>
              Quy trình chuẩn kỹ thuật: Dự án &rarr; Kỹ sư &rarr; Vai trò &rarr; Xác nhận
            </small>
          </div>
          <button
            type="button"
            className="admin-btn"
            style={{ width: 28, height: 28, padding: 0 }}
            onClick={onClose}
            aria-label="Đóng ngăn kéo"
          >
            ✕
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="admin-drawer-steps">
          <span className={`admin-step-pill ${step === 1 ? "active" : ""}`}>1. Dự án</span>
          <span className={`admin-step-pill ${step === 2 ? "active" : ""}`}>2. Kỹ sư</span>
          <span className={`admin-step-pill ${step === 3 ? "active" : ""}`}>3. Vai trò</span>
          <span className={`admin-step-pill ${step === 4 ? "active" : ""}`}>4. Xác nhận</span>
        </div>

        <div className="admin-drawer-body">
          {/* ===================== BƯỚC 1: CHỌN DỰ ÁN ===================== */}
          {step === 1 && (
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 1: Chọn dự án máy cần phân công
              </h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12px" }}>
                Chỉ định dự án máy cơ khí mà bạn muốn thêm nhân sự và phân bổ thẩm quyền thao tác.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {projects.map((proj) => {
                  const isSelected = selectedScope === `Dự án ${proj.code}`;
                  return (
                    <label
                      key={proj.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 12,
                        border: "1px solid var(--admin-line)",
                        borderRadius: 5,
                        cursor: "pointer",
                        background: isSelected ? "var(--admin-blue-soft)" : "#ffffff",
                        borderColor: isSelected ? "var(--admin-blue)" : "var(--admin-line)",
                      }}
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={`Dự án ${proj.code}`}
                        checked={isSelected}
                        onChange={() => setSelectedScope(`Dự án ${proj.code}`)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "16px" }}>📁</span>
                          <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                            Dự án {proj.code} — {proj.name}
                          </strong>
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 4 }}>
                          Trưởng dự án: <strong>{proj.lead}</strong> &bull; Kho lưu trữ: <strong>{proj.vault}</strong>
                        </div>
                      </div>
                    </label>
                  );
                })}

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 12,
                    border: "1px solid var(--admin-line)",
                    borderRadius: 5,
                    cursor: "pointer",
                    background: selectedScope === "Toàn hệ thống" ? "var(--admin-blue-soft)" : "#ffffff",
                    borderColor: selectedScope === "Toàn hệ thống" ? "var(--admin-blue)" : "var(--admin-line)",
                  }}
                >
                  <input
                    type="radio"
                    name="scope"
                    value="Toàn hệ thống"
                    checked={selectedScope === "Toàn hệ thống"}
                    onChange={() => setSelectedScope("Toàn hệ thống")}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "16px" }}>🌐</span>
                      <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                        Toàn hệ thống
                      </strong>
                    </div>
                    <span style={{ display: "block", color: "#64748b", fontSize: "11.5px", marginTop: 3 }}>
                      Quyền quản trị cấp cao trên toàn bộ các dự án máy của Tập đoàn IDEA
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ===================== BƯỚC 2: CHỌN KỸ SƯ ===================== */}
          {step === 2 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: "14px", color: "var(--admin-navy)" }}>
                  Bước 2: Chọn kỹ sư được phân công
                </h3>
                <span style={{ fontSize: "11px", color: "var(--admin-blue)", fontWeight: 600 }}>
                  Áp dụng cho: {selectedScope}
                </span>
              </div>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "12px" }}>
                Chỉ định đích danh kỹ sư sẽ tham gia dự án. <em>Tài khoản đang bị tạm khóa sẽ không được phép nhận quyền.</em>
              </p>

              {/* Search Bar */}
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  className="admin-search-input"
                  style={{ width: "100%" }}
                  placeholder="Tìm kỹ sư theo họ tên, username (@...), phòng ban..."
                  value={actorSearch}
                  onChange={(e) => setActorSearch(e.target.value)}
                />
              </div>

              {/* Engineers List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {filteredActors.map((actor) => {
                  const isSuspended = actor.status === "suspended";
                  const isSelected = selectedActorId === actor.id;

                  return (
                    <label
                      key={actor.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        border: "1px solid var(--admin-line)",
                        borderRadius: 4,
                        cursor: isSuspended ? "not-allowed" : "pointer",
                        background: isSuspended ? "#f8fafc" : isSelected ? "var(--admin-blue-soft)" : "#ffffff",
                        borderColor: isSelected && !isSuspended ? "var(--admin-blue)" : "var(--admin-line)",
                        opacity: isSuspended ? 0.6 : 1,
                      }}
                    >
                      <input
                        type="radio"
                        name="actor"
                        value={actor.id}
                        disabled={isSuspended}
                        checked={isSelected && !isSuspended}
                        onChange={() => {
                          if (!isSuspended) setSelectedActorId(actor.id);
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong style={{ color: isSuspended ? "#64748b" : "var(--admin-navy)", fontSize: "13px" }}>
                            {actor.fullName}
                          </strong>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            @{actor.username}
                          </span>
                        </div>
                        <span style={{ color: "#64748b", fontSize: "11px" }}>
                          {actor.department}
                        </span>
                      </div>

                      {isSuspended ? (
                        <span className="admin-status-pill danger" title="Tài khoản bị tạm khóa, không thể phân quyền">
                          🚫 Tạm khóa
                        </span>
                      ) : (
                        <span className="admin-status-pill active">
                          ✓ Hoạt động
                        </span>
                      )}
                    </label>
                  );
                })}

                {filteredActors.length === 0 && (
                  <div style={{ padding: 14, textAlign: "center", color: "#64748b", fontSize: "12px", background: "#f8fafc", borderRadius: 4 }}>
                    Không tìm thấy kỹ sư nào với từ khóa "{actorSearch}".
                  </div>
                )}
              </div>

              {/* Quick Onboarding for New Engineers */}
              {!isQuickCreating ? (
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--admin-line)" }}>
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ width: "100%", justifyContent: "center", borderColor: "var(--admin-blue)", color: "var(--admin-blue)" }}
                    onClick={() => setIsQuickCreating(true)}
                  >
                    <span>Tạo nhanh tài khoản cho kỹ sư mới</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickCreateActor} className="admin-inline-create-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <strong style={{ fontSize: "12.5px", color: "var(--admin-navy)" }}>
                      Thêm kỹ sư mới vào dự án
                    </strong>
                    <button
                      type="button"
                      className="admin-btn"
                      style={{ height: 22, padding: "0 6px", fontSize: "11px" }}
                      onClick={() => setIsQuickCreating(false)}
                    >
                      Hủy
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 3 }}>
                        Họ và tên kỹ sư:
                      </label>
                      <input
                        type="text"
                        required
                        className="admin-search-input"
                        style={{ width: "100%" }}
                        placeholder="Ví dụ: Lê Hoàng Nam"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 3 }}>
                          Tên đăng nhập:
                        </label>
                        <input
                          type="text"
                          required
                          className="admin-search-input"
                          style={{ width: "100%" }}
                          placeholder="nam.le"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 3 }}>
                          Phòng ban / Nhóm:
                        </label>
                        <select
                          className="admin-select"
                          style={{ width: "100%" }}
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                        >
                          <option value="Phòng Thiết kế Cơ khí JIG & Máy">Phòng Thiết kế Cơ khí JIG &amp; Máy</option>
                          <option value="Phòng Điện - Tự động hóa">Phòng Điện - Tự động hóa</option>
                          <option value="Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật">Tổ Thẩm duyệt &amp; Tiêu chuẩn Kỹ thuật</option>
                          <option value="Ban Quản lý Dự án (PMO)">Ban Quản lý Dự án (PMO)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                      <button type="submit" className="admin-btn primary">
                        Tạo &amp; Chọn kỹ sư này
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ===================== BƯỚC 3: GÁN VAI TRÒ & QUYỀN HẠN ===================== */}
          {step === 3 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontSize: "14px", color: "var(--admin-navy)" }}>
                  Bước 3: Chọn vai trò &amp; Quyền kỹ thuật
                </h3>
                <span style={{ fontSize: "11px", color: "var(--admin-blue)", fontWeight: 600 }}>
                  Gán cho: {selectedActor.fullName}
                </span>
              </div>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "12px" }}>
                Chỉ định thẩm quyền mà kỹ sư <strong>{selectedActor.fullName}</strong> được phép thực hiện trên <strong>{selectedScope}</strong>.
              </p>

              {/* Bộ chọn phòng ban để lọc vai trò */}
              <div style={{ marginBottom: 14, background: "#f8fafc", border: "1px solid var(--admin-line)", padding: "10px 12px", borderRadius: 5 }}>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "var(--admin-navy)", marginBottom: 4 }}>
                  Chọn phòng ban:
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%", background: "#ffffff" }}
                  value={selectedDepartment}
                  onChange={(e) => {
                    const newDept = e.target.value;
                    setSelectedDepartment(newDept);
                    const matching = roles.filter((r) =>
                      r.departments ? r.departments.includes(newDept) : true
                    );
                    if (matching.length > 0) {
                      setSelectedRoleId(matching[0].id);
                    }
                  }}
                  aria-label="Chọn phòng ban lọc vai trò"
                >
                  {ADMIN_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span style={{ display: "block", fontSize: "11px", color: "#64748b", marginTop: 4 }}>
                  Hệ thống chỉ hiển thị các vai trò kỹ thuật trực thuộc <strong>{selectedDepartment}</strong> ({filteredRoles.length} vai trò).
                </span>
              </div>

              {/* Danh sách vai trò đã lọc theo phòng ban */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredRoles.map((r) => {
                  const isSelected = selectedRoleId === r.id;
                  return (
                    <label
                      key={r.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: 12,
                        border: "1px solid var(--admin-line)",
                        borderRadius: 5,
                        cursor: "pointer",
                        background: isSelected ? "var(--admin-blue-soft)" : "#ffffff",
                        borderColor: isSelected ? "var(--admin-blue)" : "var(--admin-line)",
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.id}
                        checked={isSelected}
                        onChange={() => setSelectedRoleId(r.id)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                          <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                            {r.name}
                          </strong>
                          <span className="admin-status-pill active" style={{ fontSize: "10.5px" }}>
                            {selectedDepartment}
                          </span>
                        </div>
                        <p style={{ margin: "3px 0 6px", color: "#475569", fontSize: "11.5px" }}>
                          {r.description}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {r.permissions.map((p, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: "10.5px",
                                fontFamily: "var(--font-mono)",
                                background: isSelected ? "#ffffff" : "#f1f5f9",
                                color: "#166fbd",
                                padding: "1px 6px",
                                borderRadius: 3,
                                border: "1px solid #cbd5e1",
                              }}
                            >
                              ✓ {p.action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  );
                })}

                {filteredRoles.length === 0 && (
                  <div style={{ padding: 14, textAlign: "center", color: "#64748b", fontSize: "12px", background: "#f8fafc", borderRadius: 4 }}>
                    Không có vai trò nào được định nghĩa cho phòng ban này.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== BƯỚC 4: XEM LẠI & XÁC NHẬN ===================== */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--admin-navy)" }}>
                  Bước 4: Xem xét &amp; Xác nhận phân quyền
                </h3>
                <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: "12px" }}>
                  Kiểm tra lại toàn bộ thông tin trước khi lưu phân quyền vào sổ kiểm toán bảo mật.
                </p>
              </div>

              {/* 1. DỰ ÁN */}
              <div style={{ background: "#ffffff", border: "1px solid var(--admin-line)", borderRadius: 6, padding: 14 }}>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", marginBottom: 8 }}>
                  1. Dự án áp dụng
                </span>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: "18px" }}>📁</span>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "var(--admin-navy)" }}>
                      {selectedScope} {targetProject ? `— ${targetProject.name}` : ""}
                    </strong>
                    {targetProject && (
                      <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                        Trưởng dự án: <strong>{targetProject.lead}</strong> &bull; Kho lưu trữ: <strong>{targetProject.vault}</strong>
                      </div>
                    )}
                    {!targetProject && (
                      <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 2 }}>
                        Áp dụng trên toàn bộ kho lưu trữ icVault của các dự án máy thuộc Tập đoàn IDEA.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. KỸ SƯ ĐƯỢC GIAO VIỆC */}
              <div style={{ background: "#ffffff", border: "1px solid var(--admin-line)", borderRadius: 6, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                    2. Kỹ sư được phân công
                  </span>
                  <span className="admin-status-pill active">
                    ✓ Hoạt động
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", padding: "10px 12px", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "22px" }}>👤</span>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "var(--admin-navy)" }}>
                      {selectedActor.fullName}
                    </strong>
                    <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                      @{selectedActor.username} &bull; {selectedActor.email}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#475569", marginTop: 2 }}>
                      Phòng ban: <strong>{selectedActor.department}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. VAI TRÒ & QUYỀN HẠN */}
              <div style={{ background: "#ffffff", border: "1px solid var(--admin-line)", borderRadius: 6, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                    3. Vai trò &amp; Quyền kỹ thuật được cấp
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="admin-status-pill active" style={{ fontSize: "10.5px" }}>
                      {selectedDepartment}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--admin-blue)" }}>
                      {selectedRole.name}
                    </span>
                  </div>
                </div>

                <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#475569" }}>
                  {selectedRole.description}
                </p>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, padding: "8px 10px" }}>
                  <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Các quyền hạn kỹ thuật có hiệu lực ({selectedRole.permissions.length} quyền):
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {selectedRole.permissions.map((perm, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: "12px",
                          background: "#ffffff",
                          padding: "6px 10px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 3,
                        }}
                      >
                        <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "#166fbd", fontSize: "11.5px" }}>
                          {perm.action}
                        </strong>
                        <span style={{ color: "#334155" }}>&mdash; {perm.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit Confirmation Box */}
              <div style={{ padding: 12, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 4, color: "#065f46", fontSize: "12px" }}>
                ✓ <strong>Hiệu lực tức thì:</strong> Sau khi bấm xác nhận, kỹ sư <strong>{selectedActor.fullName}</strong> sẽ có quyền truy cập vào <strong>{selectedScope}</strong>. Toàn bộ thao tác sẽ được lưu vào sổ kiểm toán Audit Trail.
              </div>
            </div>
          )}
        </div>

        <div className="admin-drawer-footer">
          {step > 1 && (
            <button
              type="button"
              className="admin-btn"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
            >
              ← Quay lại
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              className="admin-btn primary"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
            >
              Tiếp tục →
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn primary"
              onClick={handleFinish}
            >
              Xác nhận &amp; Phân công vào dự án
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
