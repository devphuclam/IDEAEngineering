import type { FormEvent, ReactNode } from "react";
import type { ProjectView } from "../../api/iamClient";

// Authored ProjectsView @ 9160ec27: retain header, toolbar/table and visual classes.
// Mock lead/code/Vault/status/counts are not Server authority and are deliberately not projected.
export function ProjectsView({ projects, selectedProjectId, filter, loading, busy, canCreate, onFilterChange, onSearch, onReload, onSelectProject, onOpenCreate, children, status }: {
  projects: ProjectView[] | null; selectedProjectId?: string; filter: string; loading: boolean; busy: boolean; canCreate: boolean;
  onFilterChange(value: string): void; onSearch(event: FormEvent<HTMLFormElement>): void; onReload(): void;
  onSelectProject(project: ProjectView): void; onOpenCreate(): void; children: ReactNode; status: ReactNode;
}) {
  return <div className="admin-main">
    <div className="admin-main-head"><div><div className="admin-crumbs">Quản trị hệ thống &gt; Dự án &amp; Nhóm</div>
      <h1 className="admin-main-title">Dự Án &amp; Nhóm</h1><p className="admin-main-desc">Quản trị Project và tham gia kỹ thuật là hai quyền khác nhau. Group thuộc đúng một Project.</p>
    </div><div className="admin-head-actions">{canCreate && <button type="button" className="admin-btn primary" disabled={busy} onClick={onOpenCreate}>
      <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg><span>Tạo Project</span>
    </button>}</div></div>
    <form className="admin-toolbar" aria-label="Tìm Project" onSubmit={onSearch}><label className="sr-only" htmlFor="project-filter">Tìm Project theo tên</label>
      <input id="project-filter" className="admin-search-input" value={filter} maxLength={200} onChange={e=>onFilterChange(e.target.value)} placeholder="Tìm theo tên Project…" />
      <button className="admin-btn" disabled={busy||loading} type="submit">Tìm</button><button className="admin-btn" disabled={busy||loading} type="button" onClick={onReload}>Tải lại Project</button>
    </form>{status}
    {loading ? <p role="status">Đang đọc Project được phép truy cập…</p> : projects===null ? <p>Chưa có dữ liệu được Server xác nhận. Không hiển thị danh sách giả.</p> : projects.length===0 ? <p>Danh sách được phép truy cập hiện không có Project phù hợp.</p> :
      <div className="admin-table-container"><div className="admin-table-meta"><span className="admin-table-counter">Đang hiển thị <strong>{projects.length}</strong> dự án</span></div><table className="admin-data-table" aria-label="Danh sách Project"><thead><tr><th>Project ID</th><th>Tên Project</th><th>Version</th><th>Thao tác</th></tr></thead><tbody>
        {projects.map(project=><tr key={project.projectId} className={project.projectId===selectedProjectId?"selected":""}><td><code>{project.projectId}</code></td><td>{project.name}</td><td>{project.version}</td><td>
          <button type="button" className="admin-btn" disabled={busy} onClick={()=>onSelectProject(project)} aria-label={`Mở Project ${project.name}`}>Mở</button>
        </td></tr>)}
      </tbody></table></div>}{children}
  </div>;
}
