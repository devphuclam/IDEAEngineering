import type { ReactNode, FormEvent } from "react";
import type { AccountView } from "../../api/iamClient";
import { formatDisplayId } from "../../utils/identity";

// Retains the authored AccountsView table/toolbar. Filtering/paging remain Server-authorized.
export function AccountsView({ accounts, selectedAccountId, filter, busy, loading, canRead, canCreate,
  onFilterChange, onSearch, onReload, onSelectAccount, onOpenCreate, status, children }: {
  accounts: AccountView[] | null;
  selectedAccountId?: string;
  filter: string;
  busy: boolean;
  loading: boolean;
  canRead: boolean;
  canCreate: boolean;
  onFilterChange(value: string): void;
  onSearch(event: FormEvent<HTMLFormElement>): void;
  onReload(): void;
  onSelectAccount(account: AccountView): void;
  onOpenCreate(): void;
  status: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-main" aria-labelledby="accounts-title">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Người dùng &amp; Truy cập</div>
          <h1 id="accounts-title" className="admin-main-title">Tài Khoản &amp; Định Danh</h1>
          <p className="admin-main-desc">Account và credential; không tự cấp membership hay quyền dữ liệu kỹ thuật.</p>
        </div>
        {canCreate && <div className="admin-head-actions">
          <button type="button" className="admin-btn primary" onClick={onOpenCreate} disabled={busy}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tạo tài khoản</span>
          </button>
        </div>}
      </div>
      {canRead && <form className="admin-toolbar" onSubmit={onSearch}>
        <label className="sr-only" htmlFor="account-filter">Tìm tên hoặc login</label>
        <input id="account-filter" className="admin-search-input" placeholder="Tìm theo tên hiển thị hoặc login…"
          value={filter} onChange={event => onFilterChange(event.target.value)} maxLength={200} disabled={busy} />
        <button className="admin-btn" disabled={busy}>Tìm</button>
        <button type="button" className="admin-btn" disabled={busy} onClick={onReload}>Tải lại</button>
      </form>}
      <div className="admin-table-container">
        {status}
        {loading && <p>Đang đọc danh sách từ Server…</p>}
        {accounts !== null && <table className="admin-data-table" aria-label="Danh sách tài khoản">
          <thead><tr><th>Actor</th><th>Tên hiển thị</th><th>Login</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {accounts.length === 0 && <tr><td colSpan={5}>Không có Account phù hợp trong phạm vi được phép.</td></tr>}
            {accounts.map(account => <tr key={account.accountId} className={selectedAccountId === account.accountId ? "selected" : ""}>
              <td><span title={account.actorId} className="actor-code-value">{formatDisplayId(account.actorId)}</span></td>
              <td><strong>{account.displayName}</strong></td>
              <td>{account.loginIdentities.map(login => login.normalizedLogin).join(", ") || "Chưa có Login Identity"}</td>
              <td><span className={`admin-status-pill ${account.status.toLowerCase()}`}>{account.status}</span></td>
              <td><button type="button" className="admin-btn" disabled={busy} onClick={() => onSelectAccount(account)}
                aria-label={`Xem ${account.displayName}`}>Chi tiết</button></td>
            </tr>)}
          </tbody>
        </table>}
        {children}
      </div>
    </section>
  );
}
