import type { ReactNode } from "react";
import type { AdministrationContext } from "../../api/iamClient";
import { formatDisplayId } from "../../utils/identity";
import { AdminRail } from "./AdminRail";
import logoUrl from "../../assets/logo-idea.png";

// Presentation from feat/f04-admin-iam-ui @ 9160ec27. No mock collections or authority fallback.
export function AdminApp({ context, busy, onExitAdmin, onLogout, children }: {
  context: AdministrationContext;
  busy: boolean;
  onExitAdmin(): void;
  onLogout(): void;
  children: ReactNode;
}) {
  return (
    <div className="admin-shell" aria-label="IDEA DDM Administration Console" data-testid="idea-web-app">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <img src={logoUrl} alt="IDEA Logo" className="admin-topbar-logo" />
          <div className="admin-topbar-title">
            <strong>IDEA DDM Administration</strong>
            <small>Cổng Quản Trị Hệ Thống &amp; Phân Quyền RBAC</small>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <div className="actor-pill" title={`Actor: ${context.actorId}`}>
            <span>{context.displayName}: <strong data-testid="session-actor">{formatDisplayId(context.actorId)}</strong></span>
          </div>
          <button type="button" className="admin-btn" onClick={onExitAdmin} disabled={busy}>← Về phiên làm việc</button>
          <button type="button" className="logout-btn" onClick={onLogout} disabled={busy}>Đăng xuất</button>
        </div>
      </header>
      <nav className="admin-menubar" aria-label="Thanh tác vụ quản trị">
        <span>Người dùng &amp; Truy cập</span>
        <span className="admin-menu-spacer" />
        <span className="admin-surface-badge">{context.organizationName}</span>
      </nav>
      <main className="admin-workspace">
        <AdminRail activeSection="accounts" onSelectSection={() => {}} />
        {children}
      </main>
      <footer className="admin-statusbar">
        <div className="admin-status-item">Account MVP · Dữ liệu từ Server, không có demo fallback</div>
        <span className="admin-status-spacer" />
        <a href="#credentials">Nhận credential</a>
      </footer>
    </div>
  );
}
