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
        <div className="actor-pill">
          <div className="pulse-dot" />
          <span>
            Kỹ sư:{" "}
            <strong
              data-testid="session-actor"
              style={{ fontFamily: "var(--font-mono)", color: "#ffffff" }}
            >
              {actorId}
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
