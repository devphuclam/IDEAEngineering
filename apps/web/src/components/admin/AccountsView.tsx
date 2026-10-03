import { useState } from "react";
import { formatDisplayId } from "../../utils/identity";
import { AdminActor } from "./mockAdminData";

export interface AccountsViewProps {
  actors: AdminActor[];
  selectedActorId?: string;
  onSelectActor: (actor: AdminActor) => void;
  onOpenAddAccount?: () => void;
}

export function AccountsView({
  actors,
  selectedActorId,
  onSelectActor,
  onOpenAddAccount,
}: AccountsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredActors = actors.filter((actor) => {
    const matchesSearch =
      actor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || actor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-main">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Người dùng &amp; Truy cập</div>
          <h1 className="admin-main-title">Tài Khoản Kỹ Sư &amp; Định Danh (F04)</h1>
          <p className="admin-main-desc">
            Quản lý tài khoản đăng nhập, trạng thái hoạt động và phân định danh tính kỹ sư cơ khí.
          </p>
        </div>

        <div className="admin-head-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={onOpenAddAccount}
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
            <span>+ Tạo tài khoản kỹ sư</span>
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Tìm theo tên kỹ sư, tài khoản, phòng ban hoặc UUID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Lọc theo trạng thái"
        >
          <option value="all">Tất cả trạng thái ({actors.length})</option>
          <option value="active">Đang hoạt động</option>
          <option value="suspended">Tạm khóa</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-data-table" aria-label="Danh sách tài khoản kỹ sư">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Mã kỹ sư (Actor ID)</th>
              <th>Họ và tên</th>
              <th>Tài khoản</th>
              <th>Phòng ban</th>
              <th>Ngày tạo</th>
              <th style={{ width: 120 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredActors.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                  Không tìm thấy tài khoản nào khớp với tiêu chí tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredActors.map((actor) => {
                const isSelected = selectedActorId === actor.id;
                const displayId = formatDisplayId(actor.id);

                return (
                  <tr
                    key={actor.id}
                    className={isSelected ? "selected" : ""}
                    onClick={() => onSelectActor(actor)}
                  >
                    <td>
                      <span
                        title={actor.id}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "12px",
                        }}
                      >
                        {displayId}
                      </span>
                    </td>
                    <td>
                      <strong>{actor.fullName}</strong>
                    </td>
                    <td>{actor.username}</td>
                    <td>{actor.department}</td>
                    <td>{actor.createdAt}</td>
                    <td>
                      <span className={`admin-status-pill ${actor.status}`}>
                        {actor.status === "active"
                          ? "Đang hoạt động"
                          : actor.status === "suspended"
                          ? "Tạm khóa"
                          : "Chờ kích hoạt"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
