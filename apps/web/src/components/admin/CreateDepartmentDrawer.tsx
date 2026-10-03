import { FormEvent, useEffect, useState } from "react";
import { AdminActor, AdminDepartment, AdminRole } from "./mockAdminData";

export interface CreateDepartmentDrawerProps {
  isOpen: boolean;
  roles: AdminRole[];
  actors: AdminActor[];
  onClose: () => void;
  onSubmit: (newDept: AdminDepartment) => void;
}

function suggestDepartmentCode(name: string): string {
  if (!name.trim()) return "DEPT-";
  const cleaned = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();

  const words = cleaned
    .replace(/^(PHONG|TO|BAN|TRUNG TAM)\s+/, "")
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length === 0) return "DEPT-NEW";
  const acronym = words.map((w) => w[0]).join("");
  return `DEPT-${acronym.slice(0, 6)}`;
}

export function CreateDepartmentDrawer({
  isOpen,
  roles,
  actors,
  onClose,
  onSubmit,
}: CreateDepartmentDrawerProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isCodeCustom, setIsCodeCustom] = useState(false);
  const [lead, setLead] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setCode("");
      setIsCodeCustom(false);
      setLead(actors[0]?.fullName || "");
      setDescription("");
      // Default to the first role or design engineer
      setSelectedRoleIds(roles.length > 0 ? [roles[0].id] : []);
    }
  }, [isOpen, actors, roles]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isCodeCustom) {
      setCode(suggestDepartmentCode(val));
    }
  };

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const newDept: AdminDepartment = {
      id: `dept_${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      lead: lead.trim() || "Chưa phân công",
      description: description.trim() || `Phòng ban phụ trách các nghiệp vụ kỹ thuật ${name.trim()}.`,
      allowedRoleIds: selectedRoleIds,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onSubmit(newDept);
    onClose();
  };

  return (
    <div
      className="admin-drawer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo phòng ban kỹ thuật mới"
    >
      <div className="admin-drawer-panel" style={{ maxWidth: 540 }}>
        <div className="admin-drawer-head">
          <div>
            <h2 className="admin-drawer-title">Tạo phòng ban kỹ thuật mới</h2>
            <small style={{ color: "#64748b" }}>
              Cơ cấu tổ chức &gt; Khai báo đơn vị &amp; Gán vai trò cho phép
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="admin-drawer-body">
            {/* 1. TÊN & MÃ PHÒNG BAN */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 4,
                }}
              >
                Tên phòng ban / Tổ chuyên môn: <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                className="admin-search-input"
                style={{ width: "100%" }}
                placeholder="Ví dụ: Phòng Kiểm định & Đo lường CMM"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Mã phòng ban: <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="admin-search-input"
                  style={{ width: "100%", fontFamily: "var(--font-mono)" }}
                  placeholder="DEPT-CMM"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setIsCodeCustom(true);
                  }}
                />
                <small style={{ fontSize: "10.5px", color: "#64748b" }}>
                  Mã định danh duy nhất (tự động gợi ý)
                </small>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 4,
                  }}
                >
                  Trưởng phòng / Phụ trách:
                </label>
                <select
                  className="admin-select"
                  style={{ width: "100%" }}
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                >
                  <option value="">-- Chọn kỹ sư phụ trách --</option>
                  {actors
                    .filter((a) => a.status === "active")
                    .map((a) => (
                      <option key={a.id} value={a.fullName}>
                        {a.fullName} ({a.department})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* 2. MÔ TẢ NHIỆM VỤ */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 4,
                }}
              >
                Chức năng &amp; Nhiệm vụ kỹ thuật:
              </label>
              <textarea
                className="admin-search-input"
                style={{ width: "100%", height: 60, resize: "vertical", paddingTop: 6 }}
                placeholder="Mô tả phạm vi chuyên môn, thẩm quyền phụ trách thiết kế hoặc kiểm tra kỹ thuật..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 3. VAI TRÒ ĐƯỢC PHÉP HOẠT ĐỘNG TRONG PHÒNG BAN */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--admin-navy)",
                  }}
                >
                  Vai trò kỹ thuật cho phép trong phòng ban: <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <span style={{ fontSize: "11px", color: "var(--admin-blue)" }}>
                  Đã chọn: {selectedRoleIds.length} vai trò
                </span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "11.5px", color: "#64748b" }}>
                Kỹ sư thuộc phòng ban này sẽ chỉ được phân công các vai trò đã được tick chọn dưới đây.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {roles.map((r) => {
                  const isChecked = selectedRoleIds.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "8px 10px",
                        border: "1px solid var(--admin-line)",
                        borderRadius: 5,
                        background: isChecked ? "var(--admin-blue-soft)" : "#ffffff",
                        borderColor: isChecked ? "var(--admin-blue)" : "var(--admin-line)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRole(r.id)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "12.5px", color: "var(--admin-navy)" }}>
                            {r.name}
                          </strong>
                          <span className="admin-nav-badge" style={{ fontSize: "10px" }}>
                            {r.permissions.length} quyền
                          </span>
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>
                          {r.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. XEM TRƯỚC TỔNG QUAN */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid var(--admin-line)",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                Xem trước cấu hình phòng ban
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <strong style={{ fontFamily: "var(--font-mono)", color: "var(--admin-blue)", fontSize: "12px" }}>
                  {code || "DEPT-..."}
                </strong>
                <span style={{ color: "#94a3b8" }}>&bull;</span>
                <strong style={{ color: "var(--admin-navy)", fontSize: "13px" }}>
                  {name || "(Chưa nhập tên phòng ban)"}
                </strong>
              </div>
              <div style={{ fontSize: "11.5px", color: "#475569" }}>
                Phụ trách: <strong>{lead || "Chưa phân công"}</strong>
              </div>
            </div>
          </div>

          <div className="admin-drawer-foot">
            <button type="button" className="admin-btn" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn primary"
              disabled={!name.trim() || !code.trim() || selectedRoleIds.length === 0}
            >
              Xác nhận tạo phòng ban
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
