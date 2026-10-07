import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createIamClient, type AccountPage, type AccountView, type AdministrationContext, type IamResult, type PrivateProof, type ProofPurpose } from "../../api/iamClient";
import { CredentialProofHandoff } from "../credentials/CredentialProofHandoff";
import { outcomeMessage } from "../iamIntegration/IamStatus";
import { AccountsView } from "../../components/admin/AccountsView";

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
  const createName = useRef<HTMLInputElement>(null);
  const epoch = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const can = (action: string) => context.actions.includes(action); // Advisory only. Server rechecks every command.
  const clearDelivery = useCallback(() => setDelivery(null), []);
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
    if (result.kind === "confirmed") { setDetail(result.value); setMessage(""); requestAnimationFrame(() => heading.current?.focus()); } else refuse(result);
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
    <aside className="admin-inspector" aria-label="Chi tiết Account"><div className="admin-inspector-body">
      {!detail ? <p>Chọn Account để xem dữ liệu thực tế và thao tác được phép.</p> : <>
        <h2 ref={heading} tabIndex={-1}>{detail.displayName}</h2><span className={`state ${detail.status.toLowerCase()}`}>{detail.status}</span>
        <dl><dt>Actor</dt><dd>{detail.actorId}</dd><dt>Account</dt><dd>{detail.accountId}</dd><dt>Security version</dt><dd>{detail.securityVersion}</dd></dl>
        <h3>Login Identities</h3><ul className="login-identities">{detail.loginIdentities.map(login => <li key={login.loginIdentityId}><strong>{login.normalizedLogin}</strong><code>{login.loginIdentityId}</code><span>{login.credentialState === "ESTABLISHED" ? "Credential đã thiết lập" : "Chưa thiết lập credential"}</span></li>)}</ul>
        <div className="actions">{detail.status !== "DISABLED" && can("account.disable") && <button type="button" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("disable"); }}>Disable</button>}
          {detail.status === "DISABLED" && can("account.re-enable") && <button type="button" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("re-enable"); }}>Re-enable</button>}
          {detail.status === "PENDING" && can("account.credential.setup.issue") && <button type="button" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("FIRST_SETUP"); }}>Cấp setup proof</button>}
          {detail.status !== "PENDING" && can("account.credential.reset.issue") && <button type="button" disabled={busy || unresolved} onClick={() => { setDelivery(null); setPendingAction("RESET"); }}>Cấp reset proof</button>}</div>
        {pendingAction && <form onSubmit={event => void confirm(event)} className="form-card" aria-label="Xác nhận thao tác"><fieldset disabled={busy || unresolved}><legend>Xác nhận {pendingAction}</legend>
          <p>Đích: {detail.displayName}; version {detail.securityVersion}; Organization {context.organizationName}.</p>
          <p>{pendingAction === "disable" ? "Account bị vô hiệu hóa; phiên cũ bị từ chối." : pendingAction === "re-enable" ? "Không đổi credential. Người dùng phải đăng nhập mới." : "Proof mới chỉ cho đúng Login Identity/mục đích. Proof chưa dùng trước đó cùng đích sẽ không còn dùng được; password không được bàn giao cho quản trị viên."}</p>
          {(pendingAction === "FIRST_SETUP" || pendingAction === "RESET") && <label>Exact Login Identity<select name="loginIdentityId" required defaultValue=""><option value="" disabled>Chọn đúng login</option>{detail.loginIdentities.filter(login => pendingAction === "FIRST_SETUP" ? login.credentialState === "NOT_ESTABLISHED" : login.credentialState === "ESTABLISHED").map(login => <option key={login.loginIdentityId} value={login.loginIdentityId}>{login.normalizedLogin} — {login.loginIdentityId}</option>)}</select></label>}
          <label>Lý do<input name="reason" maxLength={500} required /></label><label className="check-label"><input type="checkbox" required />Tôi đã kiểm tra target, version và hậu quả/reissue.</label>
          <div className="actions"><button type="submit" className="primary">Xác nhận trên Server</button><button type="button" onClick={() => setPendingAction(null)}>Hủy</button></div></fieldset></form>}
        {delivery && <CredentialProofHandoff delivery={delivery} accountId={delivery.accountId} loginIdentityId={delivery.loginIdentityId} purpose={delivery.purpose} onClear={clearDelivery} />}
      </>}
      {unresolved && <p role="alert">Kết quả chưa rõ: các mutation đang bị khóa, không tự retry. Tải lại để xem trạng thái; quyết định thao tác mới chỉ sau khi đối chiếu Operation ở trên.</p>}
      {unresolved && <button type="button" disabled={busy} onClick={async () => { if (await load()) setUnresolved(false); }}>Đối chiếu lại trước thao tác mới</button>}
    </div></aside>
  </div>;
}
