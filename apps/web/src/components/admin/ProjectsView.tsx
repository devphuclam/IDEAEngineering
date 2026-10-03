import { useState } from "react";
import { AdminProject } from "./mockAdminData";

export interface ProjectsViewProps {
  projects: AdminProject[];
  selectedProjectId?: string;
  onSelectProject: (project: AdminProject) => void;
  onOpenAddProject?: () => void;
}

export function ProjectsView({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenAddProject,
}: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-main">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Dự án &amp; Nhóm cơ khí</div>
          <h1 className="admin-main-title">Dự Án &amp; Nhóm Cơ Khí</h1>
          <p className="admin-main-desc">
            Không gian ranh giới kỹ thuật theo từng máy móc, đồ gá JIG và kho lưu trữ icVault.
          </p>
        </div>

        <div className="admin-head-actions">
          <button
            type="button"
            className="admin-btn primary"
            onClick={onOpenAddProject}
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
            <span>+ Tạo dự án máy mới</span>
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Tìm theo mã dự án (P-100), tên máy hoặc chủ trì..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-data-table" aria-label="Danh sách dự án cơ khí">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Mã dự án</th>
              <th>Tên máy móc / Sản phẩm</th>
              <th>Chủ trì dự án</th>
              <th>Thành viên</th>
              <th>Kho icVault</th>
              <th style={{ width: 120 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => {
              const isSelected = selectedProjectId === project.id;

              return (
                <tr
                  key={project.id}
                  className={isSelected ? "selected" : ""}
                  onClick={() => onSelectProject(project)}
                >
                  <td>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "#1e293b" }}>
                      {project.code}
                    </strong>
                  </td>
                  <td>{project.name}</td>
                  <td>{project.lead}</td>
                  <td>{project.memberCount} kỹ sư</td>
                  <td>{project.vault}</td>
                  <td>
                    <span className="admin-status-pill active">Đang thực hiện</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
