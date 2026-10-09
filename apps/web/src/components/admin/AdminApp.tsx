import { createContext, useContext, useState, useCallback, type ReactNode, type CSSProperties } from "react";
import type { AdministrationContext } from "../../api/iamClient";
import { formatDisplayId } from "../../utils/identity";
import { AdminRail, type AdminSection } from "./AdminRail";
import logoUrl from "../../assets/logo-idea.png";

export interface AdminLayoutContextType {
  railWidth: number;
  masterWidth: number;
  startRailResize: (e: React.MouseEvent) => void;
  startMasterResize: (e: React.MouseEvent) => void;
  resetRailWidth: () => void;
  resetMasterWidth: () => void;
}

const defaultLayoutContext: AdminLayoutContextType = {
  railWidth: 238,
  masterWidth: 420,
  startRailResize: () => {},
  startMasterResize: () => {},
  resetRailWidth: () => {},
  resetMasterWidth: () => {},
};

export const AdminLayoutContext = createContext<AdminLayoutContextType>(defaultLayoutContext);

export function useAdminLayout(): AdminLayoutContextType {
  return useContext(AdminLayoutContext);
}

// Presentation from feat/f04-admin-iam-ui @ 9160ec27. No mock collections or authority fallback.
export function AdminApp({ context, busy, onExitAdmin, onLogout, children, activeSection="accounts", onSelectSection=()=>{} }: {
  context: AdministrationContext;
  busy: boolean;
  onExitAdmin(): void;
  onLogout(): void;
  children: ReactNode;
  activeSection?: AdminSection;
  onSelectSection?(section: AdminSection): void;
}) {
  const [railWidth, setRailWidth] = useState<number>(() => {
    try {
      const saved = typeof localStorage !== "undefined" ? localStorage.getItem("idea_admin_rail_width") : null;
      if (saved) {
        const v = parseInt(saved, 10);
        if (!isNaN(v) && v >= 180 && v <= 380) return v;
      }
    } catch {}
    return 238;
  });

  const [masterWidth, setMasterWidth] = useState<number>(() => {
    try {
      const saved = typeof localStorage !== "undefined" ? localStorage.getItem("idea_admin_master_width") : null;
      if (saved) {
        const v = parseInt(saved, 10);
        if (!isNaN(v) && v >= 320 && v <= 750) return v;
      }
    } catch {}
    return 420;
  });

  const startRailResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = railWidth;
    let currentWidth = startWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      currentWidth = Math.max(180, Math.min(380, startWidth + delta));
      setRailWidth(currentWidth);
      if (typeof document !== "undefined") {
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }
    };

    const onMouseUp = () => {
      if (typeof document !== "undefined") {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      try {
        localStorage.setItem("idea_admin_rail_width", String(currentWidth));
      } catch {}
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [railWidth]);

  const startMasterResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = masterWidth;
    let currentWidth = startWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      currentWidth = Math.max(320, Math.min(750, startWidth + delta));
      setMasterWidth(currentWidth);
      if (typeof document !== "undefined") {
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }
    };

    const onMouseUp = () => {
      if (typeof document !== "undefined") {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      try {
        localStorage.setItem("idea_admin_master_width", String(currentWidth));
      } catch {}
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [masterWidth]);

  const resetRailWidth = useCallback(() => {
    setRailWidth(238);
    try { localStorage.removeItem("idea_admin_rail_width"); } catch {}
  }, []);

  const resetMasterWidth = useCallback(() => {
    setMasterWidth(420);
    try { localStorage.removeItem("idea_admin_master_width"); } catch {}
  }, []);

  return (
    <AdminLayoutContext.Provider value={{ railWidth, masterWidth, startRailResize, startMasterResize, resetRailWidth, resetMasterWidth }}>
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
        <main
          className="admin-workspace"
          style={{
            "--admin-rail-width": `${railWidth}px`,
            "--admin-master-width": `${masterWidth}px`,
          } as CSSProperties}
        >
          <AdminRail activeSection={activeSection} availableSections={[...(context.actions.includes("account.read")?["accounts" as const]:[]),...(context.actions.includes("project.admin.read")?["projects" as const]:[]),...(context.actions.includes("role.catalogue.read")?["rbac" as const]:[]),...(context.actions.includes("access.inspect")?["access" as const]:[])]} onSelectSection={onSelectSection} />
          {children}
        </main>
        <footer className="admin-statusbar">
          <div className="admin-status-item">Account / Project / RBAC · Dữ liệu từ Server, không có demo fallback</div>
          <span className="admin-status-spacer" />
          <a href="#credentials">Nhận credential</a>
        </footer>
      </div>
    </AdminLayoutContext.Provider>
  );
}
