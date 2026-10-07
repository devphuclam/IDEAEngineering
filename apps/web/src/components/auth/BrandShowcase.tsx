export interface BrandShowcaseProps {
  sealSrc?: string;
}

export function BrandShowcase({
  sealSrc = "/LOGO_IDEA_full_L.png",
}: BrandShowcaseProps) {
  return (
    <aside className="brand-showcase-panel">
      <div className="brand-showcase-header">
        <div className="brand-seal-block">
          <img
            src={sealSrc}
            alt="IDEA Group Seal"
            className="brand-seal-img"
          />
          <div className="brand-title-group">
            <h2>IDEA GROUP</h2>
            <p>The World of Creativity</p>
          </div>
        </div>

        <div className="brand-hero-text">
          <h1>Quản Lý Dữ Liệu Kỹ Thuật & Sáng Tạo Cơ Khí</h1>
          <p>
            Nơi hàng triệu giờ thiết kế máy móc tinh xảo, mô hình CAD và tài
            sản sở hữu trí tuệ của Tập đoàn IDEA được bảo vệ, đồng bộ hóa và phát
            triển vững bền.
          </p>
        </div>
      </div>

      <div className="cad-precision-stage" aria-hidden="true">
        <svg
          className="cad-precision-svg"
          viewBox="0 0 460 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <line
            x1="40"
            y1="130"
            x2="420"
            y2="130"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="10 4 2 4"
          />
          <line
            x1="230"
            y1="20"
            x2="230"
            y2="240"
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="10 4 2 4"
          />

          <circle
            cx="230"
            cy="130"
            r="105"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <circle cx="230" cy="130" r="95" stroke="#64748b" strokeWidth="1.8" />
          <circle cx="230" cy="130" r="82" stroke="#94a3b8" strokeWidth="1.2" />

          <circle
            cx="230"
            cy="42"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="230"
            cy="218"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="142"
            cy="130"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="318"
            cy="130"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="168"
            cy="68"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="292"
            cy="68"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="168"
            cy="192"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <circle
            cx="292"
            cy="192"
            r="6.5"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          <circle cx="230" cy="130" r="50" stroke="#e2e8f0" strokeWidth="1.8" />
          <circle cx="230" cy="130" r="28" stroke="#f8fafc" strokeWidth="1.8" />

          <circle
            cx="230"
            cy="130"
            r="8"
            fill="#dc2626"
            filter="drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))"
          />
          <circle cx="230" cy="130" r="3" fill="#ffffff" />

          <line
            x1="70"
            y1="130"
            x2="390"
            y2="130"
            stroke="url(#laserBeam)"
            strokeWidth="1"
            strokeDasharray="8 6"
          />

          <path
            d="M 230 25 L 340 25 L 360 45"
            stroke="#f59e0b"
            strokeWidth="1.2"
            fill="none"
          />
          <text
            x="345"
            y="20"
            fill="#f59e0b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="700"
          >
            R 95.00 H7
          </text>

          <path
            d="M 125 130 L 105 130 L 90 105"
            stroke="#94a3b8"
            strokeWidth="1.2"
            fill="none"
          />
          <text
            x="50"
            y="100"
            fill="#94a3b8"
            fontSize="11"
            fontFamily="monospace"
          >
            ISO 286-1
          </text>
        </svg>
      </div>

      <div className="brand-showcase-footer">
        <span className="footer-slogan">Innovation for a better life</span>
        <span>© 2026 IDEA Group</span>
      </div>
    </aside>
  );
}
