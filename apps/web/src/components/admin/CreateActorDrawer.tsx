import { FormEvent, useEffect, useState } from "react";
import { generateUuid } from "../../utils/identity";
import {
  AdminActor,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
} from "./mockAdminData";

export interface CreateActorDrawerProps {
  isOpen: boolean;
  projects: AdminProject[];
  roles: AdminRole[];
  onClose: () => void;
  onSubmit: (
    newActor: AdminActor,
    initialAssignment?: Omit<AdminRoleAssignment, "id" | "assignedAt">
  ) => void;
}

const DEPARTMENTS = [
  "Phòng Thiết kế Cơ khí JIG & Máy",
  "Phòng Điện - Tự động hóa",
  "Ban Công nghệ & IT",
  "Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật",
  "Ban Quản lý Dự án (PMO)",
];

function suggestUsername(fullName: string): string {
  if (!fullName) return "";
  const cleaned = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  const firstName = parts[parts.length - 1];
  const lastName = parts[0];
  return `${firstName}.${lastName}`;
}

export function CreateActorDrawer({
  isOpen,
  projects,
  roles,
  onClose,
  onSubmit,
}: CreateActorDrawerProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameCustom, setIsUsernameCustom] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailCustom, setIsEmailCustom] = useState(false);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [status, setStatus] = useState<"active" | "pending">("active");

  // Optional project role assignment
  const [assignProject, setAssignProject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id || ""
  );
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || "");

  // Auto-sync username and email as user types full name if user hasn't explicitly customized them
  const handleFullNameChange = (name: string) => {
    setFullName(name);
    const suggested = suggestUsername(name);
    if (!isUsernameCustom) {
      setUsername(suggested);
    }
    if (!isEmailCustom) {
      setEmail(suggested ? `${suggested}@ideagroupvn.com` : "");
    }
  };

  const handleUsernameChange = (uname: string) => {
    setUsername(uname);
    setIsUsernameCustom(true);
    if (!isEmailCustom) {
      setEmail(uname ? `${uname}@ideagroupvn.com` : "");
    }
  };

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setUsername("");
      setIsUsernameCustom(false);
      setEmail("");
      setIsEmailCustom(false);
      setDepartment(DEPARTMENTS[0]);
      setStatus("active");
      setAssignProject(false);
      if (projects.length > 0) setSelectedProjectId(projects[0].id);
      if (roles.length > 0) setSelectedRoleId(roles[0].id);
    }
  }, [isOpen, projects, roles]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    const newActorId = generateUuid();
    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim() || `${cleanUsername}@ideagroupvn.com`;

    const newActor: AdminActor = {
      id: newActorId,
      fullName: cleanFullName,
      username: cleanUsername,
      email: cleanEmail,
      department,
      status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    let initialAssignment:
      | Omit<AdminRoleAssignment, "id" | "assignedAt">
      | undefined;

    if (assignProject) {
      const proj = projects.find((p) => p.id === selectedProjectId);
      const role = roles.find((r) => r.id === selectedRoleId);
      if (proj && role) {
        initialAssignment = {
          principalId: newActorId,
          principalName: cleanFullName,
          principalType: "user",
          roleId: role.id,
          roleName: role.name,
          scope: `Dự án ${proj.code}`,
          assignmentType: "Direct",
        };
      }
    }

    onSubmit(newActor, initialAssignment);
    onClose();
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div
      className="admin-drawer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo tài khoản kỹ sư mới"
    >
      <div className="admin-drawer-panel">
        <div className="admin-drawer-head">
          <div>
            <h2 className="admin-drawer-title">Tạo tài khoản kỹ sư mới</h2>
            <small style={{ color: "#64748b" }}>
              Khởi tạo hồ sơ định danh và cấp quyền truy cập hệ thống DDM cho nhân sự.
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

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}
        >
          <div className="admin-drawer-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Họ và tên kỹ sư */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--admin-navy)",
                    marginBottom: 4,
                  }}
                >
                  Họ và tên kỹ sư <span style={{ color: "var(--admin-red)" }}>*</span>:
                </label>
                <input
                  type="text"
                  required
                  className="admin-search-input"
                  style={{ width: "100%" }}
                  placeholder="Ví dụ: Trần Quốc Tuấn"
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                />
                <span style={{ fontSize: "11px", color: "#64748b", marginTop: 3, display: "block" }}>
                  Họ tên thật của kỹ sư, không chêm chức danh hay phòng ban vào tên.
                </span>
              </div>

              {/* Tên đăng nhập & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--admin-navy)",
                      marginBottom: 4,
                    }}
                  >
                    Tên đăng nhập <span style={{ color: "var(--admin-red)" }}>*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    className="admin-search-input"
                    style={{ width: "100%", fontFamily: "var(--font-mono)" }}
                    placeholder="tuan.tran"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--admin-navy)",
                      marginBottom: 4,
                    }}
                  >
                    Email công vụ:
                  </label>
                  <input
                    type="email"
                    required
                    className="admin-search-input"
                    style={{ width: "100%" }}
                    placeholder="tuan.tran@ideagroupvn.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailCustom(true);
                    }}
                  />
                </div>
              </div>

              {/* Phòng ban kỹ thuật */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--admin-navy)",
                    marginBottom: 4,
                  }}
                >
                  Phòng ban kỹ thuật:
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trạng thái tài khoản ban đầu */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--admin-navy)",
                    marginBottom: 6,
                  }}
                >
                  Trạng thái tài khoản ban đầu:
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  <label
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      border: "1px solid var(--admin-line)",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: status === "active" ? "var(--admin-blue-soft)" : "#ffffff",
                      borderColor: status === "active" ? "var(--admin-blue)" : "var(--admin-line)",
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}
                    />
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: "var(--admin-navy)" }}>
                        Đang hoạt động
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Kích hoạt truy cập ngay
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      border: "1px solid var(--admin-line)",
                      borderRadius: 4,
                      cursor: "pointer",
                      background: status === "pending" ? "var(--admin-blue-soft)" : "#ffffff",
                      borderColor: status === "pending" ? "var(--admin-blue)" : "var(--admin-line)",
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={status === "pending"}
                      onChange={() => setStatus("pending")}
                    />
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: "var(--admin-navy)" }}>
                        Chờ kích hoạt
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Đổi mật khẩu lần đầu
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tùy chọn phân công dự án ngay */}
              <div
                style={{
                  borderTop: "1px solid var(--admin-line)",
                  paddingTop: 12,
                  marginTop: 4,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "var(--admin-navy)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={assignProject}
                    onChange={(e) => setAssignProject(e.target.checked)}
                  />
                  <span>Phân công kỹ sư vào dự án máy ngay khi tạo</span>
                </label>

                {assignProject && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      background: "#f8fafc",
                      border: "1px solid var(--admin-line)",
                      borderRadius: 6,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Dự án máy giao việc:
                      </label>
                      <select
                        className="admin-select"
                        style={{ width: "100%" }}
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            Dự án {p.code} &mdash; {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                        Vai trò kỹ thuật:
                      </label>
                      <select
                        className="admin-select"
                        style={{ width: "100%" }}
                        value={selectedRoleId}
                        onChange={(e) => setSelectedRoleId(e.target.value)}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedRole && (
                      <div style={{ fontSize: "11.5px", color: "#64748b", background: "#ffffff", padding: 8, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                        <span style={{ fontWeight: 600, color: "var(--admin-navy)" }}>{selectedRole.name}:</span>{" "}
                        {selectedRole.description}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Thông báo kiểm toán & an toàn */}
              <div className="admin-tip-box" style={{ margin: 0 }}>
                <span className="admin-tip-icon" aria-hidden="true">
                  🛡️
                </span>
                <div style={{ fontSize: "11.5px", lineHeight: "1.45" }}>
                  <strong>Quy chuẩn bảo mật định danh DDM:</strong>
                  <br />
                  Mã định danh kỹ sư (Actor UUID) sẽ được hệ thống sinh tự động theo chuẩn RFC 4122. Mật khẩu tạm thời sẽ được tạo và yêu cầu cập nhật ở lần đăng nhập đầu tiên theo chính sách an toàn thông tin.
                </div>
              </div>
            </div>
          </div>

          <div className="admin-drawer-footer">
            <button type="button" className="admin-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="admin-btn primary">
              {assignProject ? "Tạo tài khoản & Phân công" : "Tạo tài khoản kỹ sư"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
