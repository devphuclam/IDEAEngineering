import { formatDisplayId, isUuidOrLongIdentifier } from "../../utils/identity";
import {
  AdminActor,
  AdminDepartment,
  AdminProject,
  AdminRole,
  AdminRoleAssignment,
} from "./mockAdminData";

export interface AdminInspectorProps {
  selectedActor?: AdminActor | null;
  selectedDepartment?: AdminDepartment | null;
  selectedProject?: AdminProject | null;
  selectedAssignment?: AdminRoleAssignment | null;
  actors?: AdminActor[];
  roles?: AdminRole[];
  onToggleStatus?: (actorId: string) => void;
  onOpenAddRole?: (actorId?: string) => void;
  onRevokeAssignment?: (assignmentId: string) => void;
}

export function AdminInspector({
  selectedActor,
  selectedDepartment,
  selectedProject,
  selectedAssignment,
  actors,
  roles,
  onToggleStatus,
  onOpenAddRole,
  onRevokeAssignment,
}: AdminInspectorProps) {

  if (selectedActor) {
    const isSuspended = selectedActor.status === "suspended";
    const isLongId = isUuidOrLongIdentifier(selectedActor.id);
    const displayId = formatDisplayId(selectedActor.id);

    return (
      <aside className="admin-inspector" aria-label="Bảng chi tiết tài khoản">
        <div className="admin-inspector-head">
          <span className="admin-rail-eyebrow">Hồ sơ kỹ sư</span>
          <div className="admin-inspector-title">{selectedActor.fullName}</div>
          <div className="admin-inspector-sub">@{selectedActor.username}</div>
        </div>

        <div className="admin-inspector-body">
          <div className="admin-prop-group">
            <div className="admin-prop-row">
              <span className="admin-prop-label">Mã định danh:</span>
              <span
                className="admin-prop-val"
                title={`Toàn bộ Actor ID: ${selectedActor.id}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {displayId}
              </span>
            </div>

            <div className="admin-prop-row">
              <span className="admin-prop-label">Tài khoản:</span>
              <span className="admin-prop-val">{selectedActor.username}</span>
            </div>

            <div className="admin-prop-row">
              <span className="admin-prop-label">Email:</span>
              <span className="admin-prop-val">{selectedActor.email}</span>
            </div>

            <div className="admin-prop-row">
              <span className="admin-prop-label">Phòng ban:</span>
              <span className="admin-prop-val">{selectedActor.department}</span>
            </div>

            <div className="admin-prop-row">
              <span className="admin-prop-label">Ngày tạo:</span>
              <span className="admin-prop-val">{selectedActor.createdAt}</span>
            </div>

            <div className="admin-prop-row">
              <span className="admin-prop-label">Trạng thái:</span>
              <span className="admin-prop-val">
                <span className={`admin-status-pill ${selectedActor.status}`}>
                  {selectedActor.status === "active"
                    ? "Đang hoạt động"
                    : selectedActor.status === "suspended"
                    ? "Tạm khóa"
                    : "Chờ duyệt"}
                </span>
              </span>
            </div>
          </div>

          <div className="admin-inspector-actions">
            <button
              type="button"
              className="admin-btn primary"
              onClick={() => onOpenAddRole?.(selectedActor.id)}
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <span>Phân quyền vai trò mới</span>
            </button>

            <button
              type="button"
              className={`admin-btn ${isSuspended ? "primary" : "danger"}`}
              onClick={() => onToggleStatus?.(selectedActor.id)}
            >
              {isSuspended ? "Kích hoạt lại tài khoản" : "Tạm khóa tài khoản"}
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedDepartment) {
    const deptMembers = actors?.filter((a) => a.department === selectedDepartment.name) || [];
    const deptRoles = roles?.filter((r) =>
      selectedDepartment.allowedRoleIds
        ? selectedDepartment.allowedRoleIds.includes(r.id)
        : r.departments?.includes(selectedDepartment.name)
    ) || [];

    return (
      <aside className="admin-inspector" aria-label="Bảng chi tiết phòng ban">
        <div className="admin-inspector-head">
          <span className="admin-rail-eyebrow">Cơ cấu tổ chức</span>
          <div className="admin-inspector-title">{selectedDepartment.name}</div>
          <div className="admin-inspector-sub" style={{ fontFamily: "var(--font-mono)" }}>
            {selectedDepartment.code}
          </div>
        </div>

        <div className="admin-inspector-body">
          <div className="admin-prop-group">
            <div className="admin-prop-row">
              <span className="admin-prop-label">Mã phòng ban:</span>
              <span className="admin-prop-val" style={{ fontFamily: "var(--font-mono)" }}>
                {selectedDepartment.code}
              </span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Trưởng bộ phận:</span>
              <span className="admin-prop-val">{selectedDepartment.lead}</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Nhân sự trực thuộc:</span>
              <span className="admin-prop-val">{deptMembers.length} kỹ sư</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Ngày thành lập:</span>
              <span className="admin-prop-val">{selectedDepartment.createdAt}</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Chức năng &amp; Nhiệm vụ:
            </span>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#334155",
                background: "#f8fafc",
                padding: "8px 10px",
                borderRadius: 4,
                border: "1px solid var(--admin-line)",
              }}
            >
              {selectedDepartment.description}
            </p>
          </div>

          <div style={{ marginTop: 14 }}>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Vai trò kỹ thuật cho phép ({deptRoles.length}):
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {deptRoles.map((r) => (
                <span key={r.id} className="admin-status-pill active" style={{ fontSize: "10.5px" }}>
                  {r.name}
                </span>
              ))}
            </div>
          </div>

          {deptMembers.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Kỹ sư trong phòng ban ({deptMembers.length}):
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  maxHeight: 150,
                  overflowY: "auto",
                }}
              >
                {deptMembers.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11.5px",
                      padding: "4px 6px",
                      background: "#f8fafc",
                      borderRadius: 4,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--admin-navy)" }}>{m.fullName}</span>
                    <span style={{ color: "#64748b" }}>@{m.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  if (selectedProject) {

    return (
      <aside className="admin-inspector" aria-label="Bảng chi tiết dự án">
        <div className="admin-inspector-head">
          <span className="admin-rail-eyebrow">Dự án cơ khí</span>
          <div className="admin-inspector-title">[{selectedProject.code}] {selectedProject.name}</div>
          <div className="admin-inspector-sub">Trưởng dự án: {selectedProject.lead}</div>
        </div>

        <div className="admin-inspector-body">
          <div className="admin-prop-group">
            <div className="admin-prop-row">
              <span className="admin-prop-label">Mã dự án:</span>
              <span className="admin-prop-val" style={{ fontFamily: "var(--font-mono)" }}>
                {selectedProject.code}
              </span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Tên đầy đủ:</span>
              <span className="admin-prop-val">{selectedProject.name}</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Chủ trì:</span>
              <span className="admin-prop-val">{selectedProject.lead}</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Thành viên:</span>
              <span className="admin-prop-val">{selectedProject.memberCount} kỹ sư</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Kho icVault:</span>
              <span className="admin-prop-val">{selectedProject.vault}</span>
            </div>
          </div>

          <div className="admin-inspector-actions">
            <button
              type="button"
              className="admin-btn primary"
              onClick={() => onOpenAddRole?.()}
            >
              <span>Phân công nhân sự vào dự án</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedAssignment) {
    const isGroup = selectedAssignment.principalType === "group";

    return (
      <aside className="admin-inspector" aria-label="Bảng chi tiết phân quyền">
        <div className="admin-inspector-head">
          <span className="admin-rail-eyebrow">
            {isGroup ? "Phân quyền nhóm" : "Phân quyền kỹ sư"}
          </span>
          <div className="admin-inspector-title">{selectedAssignment.roleName}</div>
          <div className="admin-inspector-sub">
            {isGroup ? `Cấp cho Nhóm: ${selectedAssignment.principalName}` : `Cấp cho: ${selectedAssignment.principalName}`}
          </div>
        </div>

        <div className="admin-inspector-body">
          <div className="admin-prop-group">
            <div className="admin-prop-row">
              <span className="admin-prop-label">Đối tượng:</span>
              <span className="admin-prop-val">
                {isGroup ? (
                  <span className="admin-entity-badge group">👥 Nhóm</span>
                ) : (
                  <span className="admin-entity-badge user">👤 Kỹ sư</span>
                )}
                {" "}{selectedAssignment.principalName}
              </span>
            </div>
            {isGroup && selectedAssignment.groupCode && (
              <div className="admin-prop-row">
                <span className="admin-prop-label">Mã nhóm:</span>
                <span className="admin-prop-val" style={{ fontFamily: "var(--font-mono)" }}>
                  {selectedAssignment.groupCode}
                </span>
              </div>
            )}
            {isGroup && selectedAssignment.memberCount && (
              <div className="admin-prop-row">
                <span className="admin-prop-label">Quy mô nhóm:</span>
                <span className="admin-prop-val">
                  {selectedAssignment.memberCount} kỹ sư trực thuộc
                </span>
              </div>
            )}
            <div className="admin-prop-row">
              <span className="admin-prop-label">Vai trò:</span>
              <span className="admin-prop-val" style={{ color: "var(--admin-blue)", fontWeight: 600 }}>
                {selectedAssignment.roleName}
              </span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Phạm vi:</span>
              <span className="admin-prop-val">{selectedAssignment.scope}</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Cơ chế gán:</span>
              <span className="admin-prop-val">{selectedAssignment.assignmentType}</span>
            </div>
            <div className="admin-prop-row">
              <span className="admin-prop-label">Thời gian gán:</span>
              <span className="admin-prop-val">{selectedAssignment.assignedAt}</span>
            </div>
          </div>

          {isGroup && (
            <div className="admin-tip-box" style={{ marginTop: 14 }}>
              <span className="admin-tip-icon" aria-hidden="true">💡</span>
              <div style={{ fontSize: "11.5px" }}>
                <strong>Tự động kế thừa cho người mới:</strong>
                <br />
                Mọi kỹ sư mới được tuyển vào nhóm này sẽ tự động nhận quyền hạn này ngay khi tài khoản được kích hoạt.
              </div>
            </div>
          )}

          <div className="admin-inspector-actions" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="admin-btn danger"
              onClick={() => onRevokeAssignment?.(selectedAssignment.id)}
            >
              Thu hồi vai trò này
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="admin-inspector" aria-label="Bảng chi tiết rỗng">
      <div className="admin-inspector-head">
        <span className="admin-rail-eyebrow">Bảng thông số</span>
        <div className="admin-inspector-title">Chưa chọn đối tượng</div>
      </div>
      <div className="admin-inspector-body" style={{ color: "#64748b", fontSize: "12px", paddingTop: 30, textAlign: "center" }}>
        Nhấp chọn một hàng trong bảng dữ liệu để kiểm tra thuộc tính và thực hiện thao tác quản trị.
      </div>
    </aside>
  );
}
