import { formatDisplayId } from "../../utils/identity";

export interface TopbarProps {
  actorId: string;
  busy: boolean;
  logoSrc?: string;
  onLogout: () => void;
}

export function Topbar({
  actorId,
  busy,
  logoSrc = "/logo-idea.png",
  onLogout,
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
