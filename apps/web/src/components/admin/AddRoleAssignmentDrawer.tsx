import { useState } from "react";
import {
  AdminActor,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
} from "./mockAdminData";

export interface AddRoleAssignmentDrawerProps {
  isOpen: boolean;
  roles: AdminRole[];
  actors: AdminActor[];
  projects: AdminProject[];
  preselectedActorId?: string;
  onClose: () => void;
  onSubmit: (assignment: Omit<AdminRoleAssignment, "id" | "assignedAt">) => void;
}

export function AddRoleAssignmentDrawer({
  isOpen,
  roles,
  actors,
  projects,
  preselectedActorId,
  onClose,
  onSubmit,
}: AddRoleAssignmentDrawerProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "");
  const [selectedActorId, setSelectedActorId] = useState<string>(
    preselectedActorId || actors[0]?.id || ""
  );
  const [selectedScope, setSelectedScope] = useState<string>(
    projects[0]?.name ? `Dự án ${projects[0].code}` : "Toàn hệ thống"
  );

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const selectedActor = actors.find((a) => a.id === selectedActorId) || actors[0];

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
                Chọn một vai trò từ danh mục quyền của IDEA Group để phân công cho nhân sự.
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
              <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "var(--admin-navy)" }}>
                Bước 2: Chọn Kỹ sư hoặc Nhóm nhận quyền ("Who?")
              </h3>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "12px" }}>
                Chỉ định người dùng cụ thể sẽ được áp dụng quyền hạn này.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {actors.map((actor) => (
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
                      <strong style={{ display: "block", color: "var(--admin-navy)", fontSize: "13px" }}>
                        {actor.fullName}
                      </strong>
                      <span style={{ color: "#64748b", fontSize: "11.5px" }}>
                        @{actor.username} • {actor.department}
                      </span>
                    </div>
                    <span className={`admin-status-pill ${actor.status}`}>
                      {actor.status === "active" ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </label>
                ))}
              </div>
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
                Kiểm tra lại toàn bộ thông tin trước khi lưu phân quyền vào sổ kiểm toán Audit Trail.
              </p>

              <div style={{ background: "#f8fafc", border: "1px solid var(--admin-line)", borderRadius: 4, padding: 14 }}>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Kỹ sư nhận:</span>
                  <span className="admin-prop-val">{selectedActor.fullName} (@{selectedActor.username})</span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Vai trò:</span>
                  <span className="admin-prop-val" style={{ color: "var(--admin-blue)" }}>{selectedRole.name}</span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Phạm vi Scope:</span>
                  <span className="admin-prop-val">{selectedScope}</span>
                </div>
                <div className="admin-prop-row">
                  <span className="admin-prop-label">Loại gán:</span>
                  <span className="admin-prop-val">Gán trực tiếp (Direct Assignment)</span>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 4, color: "#065f46", fontSize: "12px" }}>
                ✓ Phân quyền này sẽ có hiệu lực ngay lập tức. Kỹ sư có thể bắt đầu thao tác với các bản vẽ theo đúng thẩm quyền được cấp.
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
              Xác nhận &amp; Gán vai trò
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
