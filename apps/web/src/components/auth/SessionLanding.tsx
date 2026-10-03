import { useState } from "react";
import { formatDisplayId, isUuidOrLongIdentifier } from "../../utils/identity";

export interface SessionLandingProps {
  actorId: string;
  accountId: string;
  vaultName?: string;
  onEnterWorkbench?: () => void;
}

export function SessionLanding({
  actorId,
  accountId,
  vaultName = "Kho chính (icVault-Primary)",
  onEnterWorkbench,
}: SessionLandingProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (id: string, key: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(id);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1800);
      }
    } catch {
      // Ignore clipboard write failures in non-secure or restricted contexts
    }
  };

  const renderIdentityValue = (value: string, key: string, label: string) => {
    const display = formatDisplayId(value);
    const isLong = isUuidOrLongIdentifier(value);

    return (
      <div className="spec-code-wrapper" title={`Toàn bộ ${label}: ${value}`}>
        <span className="spec-code-text">{display}</span>
        {isLong && (
          <button
            type="button"
            className="spec-copy-btn"
            onClick={() => handleCopy(value, key)}
            aria-label={`Sao chép ${label}`}
            title="Sao chép toàn bộ mã"
          >
            {copiedKey === key ? (
              <span className="spec-copy-copied">✓ Đã chép</span>
            ) : (
              <svg
                className="spec-copy-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="session-landing-content" aria-label="Phiên làm việc hiện tại">
      <div className="session-card">
        <div className="session-header-row">
          <h1 className="session-title">Chào mừng bạn quay trở lại làm việc</h1>
          <span className="session-badge">
            <svg
              style={{ width: 14, height: 14 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Phiên bảo mật đang hoạt động
          </span>
        </div>

        <p className="session-desc">
          Bạn đã đăng nhập thành công vào hệ thống IDEA Engineering. Mọi thao
          tác quản lý dữ liệu kỹ thuật, xem xét mô hình CAD và cập nhật trạng
          thái dự án sẽ được ghi nhận và đồng bộ an toàn.
        </p>

        <div className="spec-grid">
          <div className="spec-tile">
            <div className="spec-label">
              <svg
                className="spec-icon"
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
              <span>Kỹ sư phụ trách</span>
            </div>
            <div className="spec-value">
              {renderIdentityValue(actorId, "actor", "mã kỹ sư")}
            </div>
          </div>

          <div className="spec-tile">
            <div className="spec-label">
              <svg
                className="spec-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Mã tài khoản</span>
            </div>
            <div className="spec-value">
              {renderIdentityValue(accountId, "account", "mã tài khoản")}
            </div>
          </div>

          <div className="spec-tile">
            <div className="spec-label">
              <svg
                className="spec-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <span>Kho lưu trữ kết nối</span>
            </div>
            <div className="spec-value" style={{ fontWeight: 600 }}>
              {vaultName}
            </div>
          </div>

          <div className="spec-tile">
            <div className="spec-label">
              <svg
                className="spec-icon"
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
              <span>Trạng thái phiên</span>
            </div>
            <div className="spec-value" style={{ color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
              Đã kết nối an toàn
            </div>
          </div>
        </div>

        <div className="session-action-row">
          <span style={{ fontSize: "13.5px", color: "var(--ink-secondary)" }}>
            Không gian quản lý dữ liệu kỹ thuật CAD & PDM đã sẵn sàng.
          </span>
          <button
            type="button"
            className="submit-btn"
            style={{ width: "auto", height: 40, padding: "0 22px", margin: 0 }}
            onClick={onEnterWorkbench}
          >
            Vào Bàn Làm Việc Kỹ Thuật →
          </button>
        </div>
      </div>
    </section>
  );
}
