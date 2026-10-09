import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createIamClient, type AccountPage, type AccountView, type AdministrationContext, type IamResult, type PrivateProof, type ProofPurpose } from "../../api/iamClient";
import { CredentialProofHandoff } from "../credentials/CredentialProofHandoff";
import { outcomeMessage } from "../iamIntegration/IamStatus";
import { AccountsView } from "../../components/admin/AccountsView";
import { toShortDisplayCode, getInitials } from "../../utils/identity";

const client = createIamClient();
type Delivery = PrivateProof & { accountId: string; loginIdentityId: string; purpose: ProofPurpose };

export function AccountAdministrationPage({ context, onInvalidated }: { context: AdministrationContext; onInvalidated(): void }) {
  const [page, setPage] = useState<AccountPage | null>(null);
  const [detail, setDetail] = useState<AccountView | null>(null);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"disable" | "re-enable" | ProofPurpose | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [unresolved, setUnresolved] = useState(false);
  const [lastOperation, setLastOperation] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const createName = useRef<HTMLInputElement>(null);
  const epoch = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const can = (action: string) => context.actions.includes(action); // Advisory only. Server rechecks every command.
  const clearDelivery = useCallback(() => setDelivery(null), []);

  const copyCode = (code: string) => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  function refuse(result: IamResult<unknown>) {
    setMessage(outcomeMessage(result));
    if (result.kind === "refused" && result.status === 401) { setPage(null); setDetail(null); setDelivery(null); onInvalidated(); }
  }

  async function load(offset = 0) {
    const request = ++epoch.current; setLoading(true); setPage(null); setDetail(null); setDelivery(null); setPendingAction(null);
    const result = await client.loadAccounts(filter, offset);
    if (request !== epoch.current) return false;
    setLoading(false);
    if (result.kind === "confirmed") { setPage(result.value); setMessage(result.value.items.length ? "Dữ liệu hiện tại từ Server." : "Danh sách được phép truy cập hiện không có Account phù hợp."); return true; }
    refuse(result); return false;
  }

  useEffect(() => { if (can("account.read")) void load(); else { setLoading(false); setMessage("Không có quyền đọc danh sách Account. Không suy quyền từ tên vai trò."); } return () => { epoch.current++; }; }, [context.actorId, context.organizationId]);

  async function select(accountId: string) {
    const request = ++epoch.current; setDetail(null); setDelivery(null); setPendingAction(null); setMessage("Đang đọc Account…");
    const result = await client.loadAccount(accountId);
    if (request !== epoch.current) return;
    if (result.kind === "confirmed") { setDetail(result.value); setCollapsed(false); setMessage(""); requestAnimationFrame(() => heading.current?.focus()); } else refuse(result);
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || unresolved) return;
    const form = event.currentTarget; const data = new FormData(form); const operationId = crypto.randomUUID();
    setBusy(true); setLastOperation(operationId); setMessage("Đang tạo Account PENDING…");
    try {
      const result = await client.createAccount({ operationId, organizationId: context.organizationId, displayName: String(data.get("displayName")), login: String(data.get("login")) });
      setUnresolved(result.kind === "unresolved");
      if (result.kind === "confirmed") { form.reset(); setShowCreate(false); await load(); await select(result.value.accountId); setMessage("Account PENDING đã tạo. Chưa có credential, membership hoặc Role Assignment tự động."); }
      else refuse(result);
    } finally { setBusy(false); requestAnimationFrame(() => messageRef.current?.focus()); }
  }

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!detail || !pendingAction || busy || unresolved) return;
    const data = new FormData(event.currentTarget); const operationId = crypto.randomUUID();
    const reason = String(data.get("reason") ?? ""); const selected = detail; const action = pendingAction;
    setBusy(true); setDelivery(null); setLastOperation(operationId); setMessage("Đang kiểm tra và thực hiện trên Server…");
    try {
      if (action === "disable" || action === "re-enable") {
        const result = await client.changeAccount(selected.accountId, action, { operationId, organizationId: context.organizationId, expectedSecurityVersion: selected.securityVersion, reason });
        setUnresolved(result.kind === "unresolved");
        if (result.kind === "confirmed") { await load(); await select(selected.accountId); setMessage("Server xác nhận trạng thái Account. Actor/Account/Login Identity không được tạo lại."); }
        else { setDetail(null); refuse(result); }
      } else {
        const loginIdentityId = String(data.get("loginIdentityId") ?? "");
        const result = await client.issueProof(selected.accountId, { operationId, organizationId: context.organizationId, loginIdentityId, purpose: action, expectedSecurityVersion: selected.securityVersion, reason });
        setUnresolved(result.kind === "unresolved");
        if (result.kind === "confirmed") { setDelivery({ ...result.value, accountId: selected.accountId, loginIdentityId, purpose: action }); setMessage("Proof đã được cấp. Bàn giao riêng tư; reissue đã supersede các proof chưa dùng cùng Login Identity/mục đích."); }
        else refuse(result);
      }
      setPendingAction(null);
    } finally { setBusy(false); requestAnimationFrame(() => messageRef.current?.focus()); }
  }

  return <div className="account-layout">
    <AccountsView accounts={page?.items ?? null} selectedAccountId={detail?.accountId} filter={filter} busy={busy} loading={loading}
      canRead={can("account.read")} canCreate={can("account.create") && !unresolved} onFilterChange={setFilter}
      onSearch={event => { event.preventDefault(); void load(); }} onReload={() => void load(page?.offset ?? 0)}
      onSelectAccount={account => void select(account.accountId)}
      onOpenCreate={() => { setShowCreate(true); requestAnimationFrame(() => createName.current?.focus()); }}
      status={<><p ref={messageRef} tabIndex={-1} role="status" className="status-message" aria-live="polite" data-testid="account-status">{message}</p>
        {lastOperation && <p className="hint">Operation: <code>{lastOperation}</code></p>}</>}>
      {page && <div className="actions"><button type="button" className="admin-btn" disabled={busy || page.offset === 0} onClick={() => void load(Math.max(0, page.offset - page.limit))}>Trang trước</button><button type="button" className="admin-btn" disabled={busy || !page.hasMore} onClick={() => void load(page.offset + page.limit)}>Trang sau</button></div>}
      {showCreate && can("account.create") && <form onSubmit={event => void create(event)} className="form-card" aria-label="Tạo Account PENDING"><fieldset disabled={busy || unresolved}><legend>Tạo Account PENDING</legend>
        <label>Tên hiển thị<input ref={createName} name="displayName" maxLength={160} required /></label><label>Login<input name="login" maxLength={254} autoComplete="off" required /></label>
        <p className="hint">Không tạo mật khẩu tạm. Người nhận tự thiết lập credential qua proof riêng.</p><div className="actions"><button type="submit" className="admin-btn primary">Tạo PENDING</button><button type="button" className="admin-btn" onClick={() => setShowCreate(false)}>Hủy</button></div></fieldset></form>}
    </AccountsView>
    <aside className={`admin-inspector ${collapsed ? "collapsed" : ""}`} aria-label="Chi tiết Account">
      {collapsed ? (
        <div className="admin-inspector-collapsed-strip">
          <button type="button" className="admin-inspector-expand-btn" onClick={() => setCollapsed(false)} aria-label="Mở rộng panel chi tiết" title="Mở rộng panel chi tiết">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Chi tiết</span>
          </button>
        </div>
      ) : (
        <>
          <div className="admin-inspector-head">
            <div className="admin-inspector-head-row">
              <span className="admin-surface-badge">Hồ sơ người dùng</span>
              <button type="button" className="admin-inspector-toggle-btn" onClick={() => setCollapsed(true)} aria-label="Thu gọn panel chi tiết" title="Thu gọn panel chi tiết">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="admin-inspector-body">
            {!detail ? (
              <div className="admin-empty-inspector">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ color: "#94a3b8", marginBottom: 12 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p>Chọn một Account từ danh sách để xem thông tin chi tiết và thao tác quản trị được cấp phép.</p>
              </div>
            ) : <>
              <div className="admin-detail-card">
                <div className="admin-profile-head">
                  <div className="admin-profile-avatar" aria-hidden="true">
                    {getInitials(detail.displayName)}
                  </div>
                  <div className="admin-profile-meta">
                    <h2 ref={heading} tabIndex={-1} className="admin-detail-title">{detail.displayName}</h2>
                    <div className="admin-badge-row">
                      <span className="admin-id-pill" title="Mã tài khoản doanh nghiệp">
                        <span className="admin-id-pill-tag">MÃ THẺ</span>
                        <span className="admin-id-pill-code">{toShortDisplayCode(detail.accountId)}</span>
                        <button type="button" className="admin-copy-pill-btn" onClick={() => copyCode(toShortDisplayCode(detail.accountId))} title="Sao chép mã thẻ">
                          {copied ? "✓" : "📋"}
                        </button>
                      </span>
                      <span className={`state admin-status-pill ${detail.status.toLowerCase()}`}>{detail.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-prop-section">
                <div className="admin-section-label">Thông tin đăng nhập</div>
                <ul className="login-identities admin-login-list">
                  {detail.loginIdentities.map(login => (
                    <li key={login.loginIdentityId} className="admin-login-item">
                      <div className="admin-login-head">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <strong className="admin-login-username">{login.normalizedLogin}</strong>
                      </div>
                      <div className="admin-login-status">
                        <span className={`admin-cred-tag ${login.credentialState === "ESTABLISHED" ? "ready" : "none"}`}>
                          {login.credentialState === "ESTABLISHED" ? "✓ Mật khẩu: Đã thiết lập" : "Chưa tạo mật khẩu"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="actions admin-inspector-actions">
                {detail.status !== "DISABLED" && can("account.disable") && (
                  <button type="button" className="admin-btn danger" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("disable"); }}>
                    Disable
                  </button>
                )}
                {detail.status === "DISABLED" && can("account.re-enable") && (
                  <button type="button" className="admin-btn success-btn" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("re-enable"); }}>
                    Re-enable
                  </button>
                )}
                {detail.status === "PENDING" && can("account.credential.setup.issue") && (
                  <button type="button" className="admin-btn primary" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("FIRST_SETUP"); }}>
                    Cấp setup proof
                  </button>
                )}
                {detail.status !== "PENDING" && can("account.credential.reset.issue") && (
                  <button type="button" className="admin-btn" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("RESET"); }}>
                    Cấp reset proof
                  </button>
                )}
              </div>
              {pendingAction && <form onSubmit={event => void confirm(event)} className={`form-card ${pendingAction === "disable" ? "destructive-warning" : ""}`} aria-label="Xác nhận thao tác"><fieldset disabled={busy || unresolved}><legend>Xác nhận {pendingAction}</legend>
                {pendingAction === "disable" && <div className="admin-warning-box" role="note">
                  <svg className="admin-warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <strong>CẢNH BÁO: Vô hiệu hóa tài khoản</strong>
                    Account sẽ bị khóa ngay lập tức; các phiên đăng nhập hiện hữu bị từ chối. Thao tác yêu cầu lý do kiểm toán bắt buộc.
                  </div>
                </div>}
                <p>Đích: {detail.displayName}; version {detail.securityVersion}; Organization {context.organizationName}.</p>
                <p>{pendingAction === "disable" ? "Account bị vô hiệu hóa; phiên cũ bị từ chối." : pendingAction === "re-enable" ? "Không đổi credential. Người dùng phải đăng nhập mới." : "Proof mới chỉ cho đúng Login Identity/mục đích. Proof chưa dùng trước đó cùng đích sẽ không còn dùng được; password không được bàn giao cho quản trị viên."}</p>
                {(pendingAction === "FIRST_SETUP" || pendingAction === "RESET") && <label>Exact Login Identity<select name="loginIdentityId" required defaultValue=""><option value="" disabled>Chọn đúng login</option>{detail.loginIdentities.filter(login => pendingAction === "FIRST_SETUP" ? login.credentialState === "NOT_ESTABLISHED" : login.credentialState === "ESTABLISHED").map(login => <option key={login.loginIdentityId} value={login.loginIdentityId}>{login.normalizedLogin} — {toShortDisplayCode(login.loginIdentityId)}</option>)}</select></label>}
                <label>Lý do<input name="reason" maxLength={500} required /></label><label className="check-label"><input type="checkbox" required />Tôi đã kiểm tra target, version và hậu quả/reissue.</label>
                <div className="actions"><button type="submit" className={`admin-btn ${pendingAction === "disable" ? "danger" : "primary"}`}>{pendingAction === "disable" ? "Vô hiệu hóa trên Server" : "Xác nhận trên Server"}</button><button type="button" className="admin-btn" onClick={() => setPendingAction(null)}>Hủy</button></div></fieldset></form>}
              {delivery && <CredentialProofHandoff delivery={delivery} accountId={delivery.accountId} loginIdentityId={delivery.loginIdentityId} purpose={delivery.purpose} onClear={clearDelivery} />}

              {/* Technical / Audit Details Accordion (Preserves exact DOM dl/dd contracts for tests, clean for humans) */}
              <details className="admin-tech-accordion">
                <summary className="admin-tech-summary">
                  <span className="admin-tech-summary-left">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Thông tin kỹ thuật &amp; Đối soát hệ thống</span>
                  </span>
                  <span className="admin-tech-badge">Chỉ IT/Audit</span>
                </summary>
                <div className="admin-tech-body">
                  <p className="admin-tech-note">Mã định danh UUID nội bộ của cơ sở dữ liệu. Dùng khi tra cứu log máy chủ.</p>
                  <dl className="admin-prop-dl">
                    <div className="admin-prop-row">
                      <dt>Actor</dt>
                      <dd><code>{detail.actorId}</code></dd>
                    </div>
                    <div className="admin-prop-row">
                      <dt>Account</dt>
                      <dd><code>{detail.accountId}</code></dd>
                    </div>
                    <div className="admin-prop-row">
                      <dt>Security version</dt>
                      <dd><span className="admin-version-badge">v{detail.securityVersion}</span></dd>
                    </div>
                    {detail.loginIdentities.map(login => (
                      <div key={login.loginIdentityId} className="admin-prop-row">
                        <dt>Login ID ({login.normalizedLogin})</dt>
                        <dd><code>{login.loginIdentityId}</code></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>
            </>}
            {unresolved && <p role="alert">Kết quả chưa rõ: các mutation đang bị khóa, không tự retry. Tải lại để xem trạng thái; quyết định thao tác mới chỉ sau khi đối chiếu Operation ở trên.</p>}
            {unresolved && <button type="button" disabled={busy} onClick={async () => { if (await load()) setUnresolved(false); }}>Đối chiếu lại trước thao tác mới</button>}
          </div>
        </>
      )}
    </aside>
  </div>;
}
