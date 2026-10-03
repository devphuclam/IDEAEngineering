import { formatDisplayId } from "../../utils/identity";

export interface TopbarProps {
  actorId: string;
  busy: boolean;
  logoSrc?: string;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

export function Topbar({
  actorId,
  busy,
  logoSrc = "/logo-idea.png",
  onLogout,
  onOpenAdmin,
}: TopbarProps) {
  const displayId = formatDisplayId(actorId);

  return (
    <nav className="topbar-container" aria-label="Thanh điều hướng chính">
      <div className="topbar-brand">
        <img
          src={logoSrc}
          alt="IDEA Engineering Logo"
          className="topbar-logo-img"
        />
        <span className="topbar-brand-text">IDEA Engineering</span>
      </div>

      <div className="topbar-actions">
        <div className="actor-pill" title={`Kỹ sư phụ trách: ${actorId}`}>
          <div className="pulse-dot" aria-hidden="true" />
          <svg
            className="actor-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="actor-label">
            Kỹ sư:{" "}
            <strong data-testid="session-actor" className="actor-code">
              {displayId}
            </strong>
          </span>
        </div>

        {onOpenAdmin && (
          <button
            type="button"
            className="admin-btn"
            style={{
              height: 36,
              background: "#1e293b",
              color: "#cbd5e1",
              borderColor: "#334155",
            }}
            onClick={onOpenAdmin}
            title="Mở Cổng Quản Trị Hệ Thống DDM & Phân quyền RBAC"
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Cổng Quản Trị</span>
          </button>
        )}

        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          disabled={busy}
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
