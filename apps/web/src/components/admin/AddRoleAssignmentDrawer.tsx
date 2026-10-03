import { useState } from "react";
import {
  AdminActor,
  AdminGroup,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
  INITIAL_GROUPS,
} from "./mockAdminData";

export interface AddRoleAssignmentDrawerProps {
  isOpen: boolean;
  roles: AdminRole[];
  actors: AdminActor[];
  groups?: AdminGroup[];
  projects: AdminProject[];
  preselectedActorId?: string;
  onClose: () => void;
  onSubmit: (assignment: Omit<AdminRoleAssignment, "id" | "assignedAt">) => void;
  onAddActor?: (newActor: AdminActor) => void;
}

export function AddRoleAssignmentDrawer({
  isOpen,
  roles,
  actors,
  groups = INITIAL_GROUPS,
  projects,
  preselectedActorId,
  onClose,
  onSubmit,
  onAddActor,
}: AddRoleAssignmentDrawerProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "");
  
  // Principal type: "group" (recommended by Microsoft) or "user"
  const [principalType, setPrincipalType] = useState<"group" | "user">(
    preselectedActorId ? "user" : "group"
  );
  
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || "");
  const [selectedActorId, setSelectedActorId] = useState<string>(
    preselectedActorId || actors[0]?.id || ""
  );
  const [selectedScope, setSelectedScope] = useState<string>(
    projects[0]?.name ? `Dự án ${projects[0].code}` : "Toàn hệ thống"
  );

  // Search filter in Step 2
  const [memberSearch, setMemberSearch] = useState("");

  // Inline quick create user state
  const [isQuickCreating, setIsQuickCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newDepartment, setNewDepartment] = useState(
    groups[0]?.name || "Phòng Thiết kế Cơ khí JIG & Máy"
  );

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const selectedActor = actors.find((a) => a.id === selectedActorId) || actors[0];

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      g.code.toLowerCase().includes(memberSearch.toLowerCase()) ||
      g.department.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredActors = actors.filter(
    (a) =>
      a.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      a.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
      a.department.toLowerCase().includes(memberSearch.toLowerCase())
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
    if (principalType === "group") {
      onSubmit({
        principalId: selectedGroup.id,
        principalName: selectedGroup.name,
        principalType: "group",
        groupCode: selectedGroup.code,
        memberCount: selectedGroup.memberCount,
        roleId: selectedRole.id,
        roleName: selectedRole.name.split("(")[0].trim(),
        scope: selectedScope,
        assignmentType: "Direct",
      });
    } else {
      onSubmit({
        principalId: selectedActor.id,
        principalName: selectedActor.fullName,
        principalType: "user",
        roleId: selectedRole.id,
        roleName: selectedRole.name.split("(")[0].trim(),
        scope: selectedScope,
        assignmentType: "Direct",
      });
    }
    onClose();
  };

  return (
    <div className="admin-drawer-overlay" role="dialog" aria-modal="true" aria-label="Thêm phân quyền vai trò">
      <div className="admin-drawer-panel">
        <div className="admin-drawer-head">
          <div>
            <h2 className="admin-drawer-title">Thêm phân quyền vai trò (Add role assignment)</h2>
            <small style={{ color: "#64748b" }}>Theo quy trình phân quyền 3 bước chuẩn Microsoft Azure</small>
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
          <span className={`admin-step-pill ${step === 1 ? "active" : ""}`}>1. Vai trò (Role)</span>
          <span className={`admin-step-pill ${step === 2 ? "active" : ""}`}>2. Thành viên (Members)</span>
          <span className={`admin-step-pill ${step === 3 ? "active" : ""}`}>3. Phạm vi (Scope)</span>
          <span className={`admin-step-pill ${step === 4 ? "active" : ""}`}>4. Xem lại (Review)</span>
        </div>

        <div className="admin-drawer-body">
          {step === 1 && (
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 1: Chọn vai trò kỹ thuật cần cấp ("What role?")
              </h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12px" }}>
                Chọn một vai trò từ danh mục quyền của IDEA Group để phân công cho nhân sự hoặc nhóm kỹ sư.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {roles.map((r) => (
                  <label
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: 12,
                      border: "1px solid var(--admin-line)",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: selectedRoleId === r.id ? "var(--admin-blue-soft)" : "#ffffff",
                      borderColor: selectedRoleId === r.id ? "var(--admin-blue)" : "var(--admin-line)",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.id}
                      checked={selectedRoleId === r.id}
                      onChange={() => setSelectedRoleId(r.id)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <strong style={{ display: "block", color: "var(--admin-navy)", fontSize: "13px" }}>
                        {r.name}
                      </strong>
                      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "11.5px" }}>
                        {r.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 2: Chọn Thành viên thụ hưởng ("Who gets access?")
              </h3>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "12px" }}>
                Microsoft Entra ID khuyến nghị phân quyền theo <strong>Nhóm bảo mật (Group)</strong> để nhân sự mới tự động kế thừa quyền truy cập.
              </p>

              {/* Microsoft-style Segmented Selector */}
              <div className="admin-segmented-control" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={principalType === "group"}
                  className={`admin-segmented-btn ${principalType === "group" ? "active" : ""}`}
                  onClick={() => setPrincipalType("group")}
                >
                  <span>👥 Nhóm kỹ thuật (Group) — Khuyên dùng</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={principalType === "user"}
                  className={`admin-segmented-btn ${principalType === "user" ? "active" : ""}`}
                  onClick={() => setPrincipalType("user")}
                >
                  <span>👤 Kỹ sư cá nhân (User)</span>
                </button>
              </div>

              {principalType === "group" && (
                <div className="admin-tip-box">
                  <span className="admin-tip-icon" aria-hidden="true">💡</span>
                  <div>
                    <strong>Quy tắc kế thừa cho người mới (Microsoft Entra ID):</strong>
                    <br />
                    Khi phân quyền cho Nhóm phòng ban, mọi kỹ sư hiện tại và <strong>kỹ sư mới được tuyển dụng</strong> vào phòng ban này sẽ <strong>tự động nhận quyền</strong> trên dự án mà không cần cấp quyền thủ công từng người.
                  </div>
                </div>
              )}

              {/* Search bar */}
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  className="admin-search-input"
                  style={{ width: "100%" }}
                  placeholder={
                    principalType === "group"
                      ? "Tìm theo tên nhóm, mã nhóm (SG-...), phòng ban..."
                      : "Tìm theo tên kỹ sư, mã định danh, phòng ban..."
                  }
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>

              {/* Group list */}
              {principalType === "group" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredGroups.map((grp) => (
                    <label
                      key={grp.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: 12,
                        border: "1px solid var(--admin-line)",
                        borderRadius: 4,
                        cursor: "pointer",
                        background: selectedGroupId === grp.id ? "var(--admin-blue-soft)" : "#ffffff",
                        borderColor: selectedGroupId === grp.id ? "var(--admin-blue)" : "var(--admin-line)",
                      }}
                    >
                      <input
                        type="radio"
                        name="group"
                        value={grp.id}
                        checked={selectedGroupId === grp.id}
                        onChange={() => setSelectedGroupId(grp.id)}
                        style={{ marginTop: 2 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="admin-entity-badge group">👥 Nhóm</span>
                          <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                            {grp.name}
                          </strong>
                          <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "var(--font-mono)" }}>
                            [{grp.code}]
                          </span>
                        </div>
                        <p style={{ margin: "4px 0 2px", color: "#475569", fontSize: "11.5px" }}>
                          {grp.description}
                        </p>
                        <span style={{ fontSize: "11px", color: "#166fbd", fontWeight: 600 }}>
                          • Quy mô: {grp.memberCount} kỹ sư trực thuộc
                        </span>
                      </div>
                    </label>
                  ))}
                  {filteredGroups.length === 0 && (
                    <div style={{ padding: 16, textAlign: "center", color: "#64748b", fontSize: "12px" }}>
                      Không tìm thấy nhóm kỹ thuật phù hợp.
                    </div>
                  )}
                </div>
              )}

              {/* User list */}
              {principalType === "user" && (
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredActors.map((actor) => (
                      <label
                        key={actor.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: 12,
                          border: "1px solid var(--admin-line)",
                          borderRadius: 4,
                          cursor: "pointer",
                          background: selectedActorId === actor.id ? "var(--admin-blue-soft)" : "#ffffff",
                          borderColor: selectedActorId === actor.id ? "var(--admin-blue)" : "var(--admin-line)",
                        }}
                      >
                        <input
                          type="radio"
                          name="actor"
                          value={actor.id}
                          checked={selectedActorId === actor.id}
                          onChange={() => setSelectedActorId(actor.id)}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span className="admin-entity-badge user">👤 Kỹ sư</span>
                            <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                              {actor.fullName}
                            </strong>
                          </div>
                          <span style={{ color: "#64748b", fontSize: "11.5px" }}>
                            @{actor.username} • {actor.department}
                          </span>
                        </div>
                        <span className={`admin-status-pill ${actor.status}`}>
                          {actor.status === "active" ? "Hoạt động" : "Tạm khóa"}
                        </span>
                      </label>
                    ))}

                    {filteredActors.length === 0 && (
                      <div style={{ padding: 14, textAlign: "center", color: "#64748b", fontSize: "12px", background: "#f8fafc", borderRadius: 4 }}>
                        Không tìm thấy kỹ sư "{memberSearch}" trong danh sách tài khoản hiện có.
                      </div>
                    )}
                  </div>

                  {/* Quick User Onboarding Section */}
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
                          Thêm kỹ sư mới vào hệ thống (Quick Onboard)
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
                              Tên đăng nhập (username):
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
                              {groups.map((g) => (
                                <option key={g.id} value={g.name}>
                                  {g.name}
                                </option>
                              ))}
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
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 3: Chọn Phạm vi áp dụng ("Where / Scope?")
              </h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12px" }}>
                Ranh giới dự án mà kỹ sư được phép thao tác. Quyền chỉ có hiệu lực bên trong phạm vi này.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {projects.map((proj) => (
                  <label
                    key={proj.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      border: "1px solid var(--admin-line)",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: selectedScope === `Dự án ${proj.code}` ? "var(--admin-blue-soft)" : "#ffffff",
                      borderColor: selectedScope === `Dự án ${proj.code}` ? "var(--admin-blue)" : "var(--admin-line)",
                    }}
                  >
                    <input
                      type="radio"
                      name="scope"
                      value={`Dự án ${proj.code}`}
                      checked={selectedScope === `Dự án ${proj.code}`}
                      onChange={() => setSelectedScope(`Dự án ${proj.code}`)}
                    />
                    <div>
                      <strong style={{ display: "block", color: "var(--admin-navy)", fontSize: "13px" }}>
                        Dự án {proj.code} — {proj.name}
                      </strong>
                      <span style={{ color: "#64748b", fontSize: "11.5px" }}>
                        Kho lưu trữ: {proj.vault}
                      </span>
                    </div>
                  </label>
                ))}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    border: "1px solid var(--admin-line)",
                    borderRadius: 4,
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
                  />
                  <div>
                    <strong style={{ display: "block", color: "var(--admin-navy)", fontSize: "13px" }}>
                      Toàn hệ thống (Global Scope)
                    </strong>
                    <span style={{ color: "#64748b", fontSize: "11.5px" }}>
                      Áp dụng trên toàn bộ các dự án máy của Tập đoàn IDEA
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 4: Xem xét &amp; Xác nhận phân quyền ("Review + Assign")
              </h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12px" }}>
                Kiểm tra lại toàn bộ thông tin theo chuẩn Microsoft Azure trước khi kích hoạt phân quyền.
              </p>

              <div style={{ background: "#f8fafc", border: "1px solid var(--admin-line)", borderRadius: 4, padding: 14 }}>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Vai trò cần cấp:</span>
                  <span className="admin-prop-val" style={{ color: "var(--admin-blue)", fontWeight: 700 }}>
                    {selectedRole.name}
                  </span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Loại đối tượng:</span>
                  <span className="admin-prop-val">
                    {principalType === "group" ? (
                      <span className="admin-entity-badge group">👥 Nhóm kỹ thuật (Security Group)</span>
                    ) : (
                      <span className="admin-entity-badge user">👤 Kỹ sư cá nhân (User)</span>
                    )}
                  </span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Đối tượng thụ hưởng:</span>
                  <span className="admin-prop-val" style={{ fontWeight: 600 }}>
                    {principalType === "group"
                      ? `${selectedGroup.name} [${selectedGroup.code}]`
                      : `${selectedActor.fullName} (@${selectedActor.username})`}
                  </span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Phạm vi Scope:</span>
                  <span className="admin-prop-val" style={{ fontFamily: "var(--font-mono)" }}>
                    {selectedScope}
                  </span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Cơ chế áp dụng:</span>
                  <span className="admin-prop-val">
                    {principalType === "group"
                      ? `Kế thừa tự động cho ${selectedGroup.memberCount} thành viên hiện tại và mọi kỹ sư mới gia nhập phòng ban`
                      : "Gán trực tiếp cho tài khoản cá nhân"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 4, color: "#065f46", fontSize: "12px" }}>
                ✓ Phân quyền này sẽ có hiệu lực ngay lập tức. Hệ thống sẽ ghi nhận lịch sử vào Audit Trail tuân thủ chuẩn kiểm toán bảo mật.
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
              Xác nhận &amp; Cấp quyền (Review + Assign)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
