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
            <div className="spec-label">Kỹ sư phụ trách</div>
            <div className="spec-value">{actorId}</div>
          </div>
          <div className="spec-tile">
            <div className="spec-label">Mã tài khoản</div>
            <div className="spec-value">{accountId}</div>
          </div>
          <div className="spec-tile">
            <div className="spec-label">Kho lưu trữ kết nối</div>
            <div className="spec-value">{vaultName}</div>
          </div>
          <div className="spec-tile">
            <div className="spec-label">Trạng thái phiên</div>
            <div className="spec-value" style={{ color: "#059669" }}>
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
