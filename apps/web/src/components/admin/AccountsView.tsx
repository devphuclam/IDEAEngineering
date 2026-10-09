import { useState, type ReactNode, type FormEvent } from "react";
import type { AccountView } from "../../api/iamClient";
import { toShortDisplayCode, getRawDigits, getInitials } from "../../utils/identity";

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
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const cleanFilter = filter.trim().toLowerCase();
  const rawDigits = getRawDigits(cleanFilter);
  const visibleAccounts = accounts === null ? null : accounts.filter(account => {
    if (!cleanFilter) return true;
    const matchName = account.displayName.toLowerCase().includes(cleanFilter);
    const matchLogin = account.loginIdentities.some(l => l.normalizedLogin.toLowerCase().includes(cleanFilter));
    const shortCode = toShortDisplayCode(account.accountId);
    const matchCode = shortCode.toLowerCase().includes(cleanFilter) || (rawDigits.length >= 2 && getRawDigits(shortCode).includes(rawDigits));
    const matchActor = account.actorId.toLowerCase().includes(cleanFilter);
    return matchName || matchLogin || matchCode || matchActor;
  });

  const toggleCheck = (accountId: string, checked: boolean) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(accountId);
      else next.delete(accountId);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    if (checked && visibleAccounts) {
      setCheckedIds(new Set(visibleAccounts.map(a => a.accountId)));
    } else {
      setCheckedIds(new Set());
    }
  };

  const clearSelection = () => setCheckedIds(new Set());

  const handleBatchSelect = () => {
    if (checkedIds.size > 0 && accounts) {
      const firstSelected = accounts.find(a => checkedIds.has(a.accountId));
      if (firstSelected) onSelectAccount(firstSelected);
    }
  };

  return (
    <section className="admin-main" aria-labelledby="accounts-title">
      <div className="admin-main-head">
        <div>
          <div className="admin-crumbs">Quản trị hệ thống &gt; Người dùng &amp; Truy cập</div>
          <h1 id="accounts-title" className="admin-main-title">Tài Khoản &amp; Định Danh</h1>
          <p className="admin-main-desc">Quản lý người dùng, trạng thái tài khoản và cấp phát chứng thực an toàn.</p>
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

      {/* Microsoft 365 Contextual Command Bar when rows are checked */}
      {checkedIds.size > 0 && (
        <div className="admin-command-bar" role="toolbar" aria-label="Thao tác hàng loạt">
          <span className="admin-command-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Đã chọn: <strong>{checkedIds.size}</strong></span>
          </span>
          <button type="button" className="admin-command-btn" onClick={handleBatchSelect}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Xem hồ sơ</span>
          </button>
          <button type="button" className="admin-command-btn" onClick={handleBatchSelect}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>Thao tác chứng thực</span>
          </button>
          <button type="button" className="admin-command-link" onClick={clearSelection}>
            Bỏ chọn
          </button>
        </div>
      )}

      {canRead && <form className="admin-toolbar" onSubmit={onSearch}>
        <label className="sr-only" htmlFor="account-filter">Tìm theo mã hoặc tên</label>
        <div className="admin-search-wrap">
          <svg className="admin-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input id="account-filter" className="admin-search-input" placeholder="Tìm theo mã (#123-456), tên hiển thị hoặc login…"
            value={filter} onChange={event => onFilterChange(event.target.value)} maxLength={200} disabled={busy} />
        </div>
        <button className="admin-btn" disabled={busy}>Tìm</button>
        <button type="button" className="admin-btn" disabled={busy} onClick={onReload}>Tải lại</button>
      </form>}
      <div className="admin-table-container">
        {status}
        {loading && <p className="admin-loading-text">Đang tải danh sách từ Server…</p>}
        {visibleAccounts !== null && <>
          <div className="admin-table-meta">
            <span className="admin-table-counter">Đang hiển thị <strong>{visibleAccounts.length}</strong> tài khoản</span>
            {cleanFilter && visibleAccounts.length !== accounts?.length && (
              <span className="admin-filter-indicator">Đã lọc theo từ khóa &ldquo;{filter}&rdquo;</span>
            )}
          </div>
          <div className="admin-account-list" role="list" aria-label="Danh sách tài khoản">
            {visibleAccounts.length === 0 && (
              <div className="admin-empty-cell">Không có Account phù hợp với từ khóa tìm kiếm.</div>
            )}
            {visibleAccounts.map(account => {
              const isSelected = selectedAccountId === account.accountId;
              const isChecked = checkedIds.has(account.accountId);
              return (
                <div
                  key={account.accountId}
                  role="listitem"
                  className={`admin-account-card ${isSelected ? "selected" : ""} ${isChecked ? "checked" : ""}`}
                  onClick={() => onSelectAccount(account)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onSelectAccount(account); }}
                >
                  <div className="admin-card-check" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      aria-label={`Chọn ${account.displayName}`}
                      checked={isChecked}
                      onChange={e => toggleCheck(account.accountId, e.target.checked)}
                    />
                  </div>
                  <div className="admin-avatar-sm" aria-hidden="true">
                    {getInitials(account.displayName)}
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-card-title-row">
                      <strong className="admin-user-name" title={account.displayName}>
                        {account.displayName}
                      </strong>
                    </div>
                    <div className="admin-card-sub-row">
                      <span className="admin-login-text" title={account.loginIdentities.map(l => l.normalizedLogin).join(", ")}>
                        {account.loginIdentities.map(login => login.normalizedLogin).join(", ") || "Chưa có Login Identity"}
                      </span>
                    </div>
                  </div>
                  <div className="admin-card-tags">
                    <span className="admin-badge-code" title={`Account UUID: ${account.accountId}`}>
                      {toShortDisplayCode(account.accountId)}
                    </span>
                    <span className={`admin-status-pill ${account.status.toLowerCase()}`}>
                      {account.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>}
        {children}
      </div>
    </section>
  );
}
