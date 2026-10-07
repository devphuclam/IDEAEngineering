import { useEffect, useRef, useState, type FormEvent } from "react";
import { createIamClient, type AdministrationContext } from "../api/iamClient";
import { AccountAdministrationPage } from "../features/accountAdministration/AccountAdministrationPage";
import { CredentialRedemptionPage } from "../features/credentials/CredentialRedemptionPage";
import { outcomeMessage } from "../features/iamIntegration/IamStatus";

const client = createIamClient();
export function Routes() {
  const [route, setRoute] = useState(location.hash === "#credentials" ? "credentials" : "accounts");
  const [context, setContext] = useState<AdministrationContext | null>(null);
  const [message, setMessage] = useState("Đang kết nối IDEA Server…");
  const [busy, setBusy] = useState(false);
  const summary = useRef<HTMLParagraphElement>(null);
  async function refresh() {
    const result = await client.loadContext();
    if (result.kind === "confirmed") { setContext(result.value); setMessage("Đã đăng nhập"); }
    else { setContext(null); setMessage(result.kind === "refused" && result.status === 401 ? "Chưa đăng nhập" : outcomeMessage(result)); }
  }
  useEffect(() => {
    const change = () => setRoute(location.hash === "#credentials" ? "credentials" : "accounts");
    window.addEventListener("hashchange", change); void refresh();
    return () => window.removeEventListener("hashchange", change);
  }, []);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget; const data = new FormData(form);
    const login = String(data.get("username") ?? ""); let password = String(data.get("password") ?? "");
    (form.elements.namedItem("password") as HTMLInputElement).value = ""; data.delete("password");
    setBusy(true); setContext(null); setMessage("Đang xác thực…");
    try {
      const result = await client.signIn(login, password);
      if (result.kind === "confirmed") await refresh(); else setMessage(outcomeMessage(result));
    } finally { password = ""; setBusy(false); requestAnimationFrame(() => summary.current?.focus()); }
  }
  async function signOut() {
    if (busy) return; setBusy(true); setContext(null); // Clear protected/private UI before sending.
    try { const result = await client.signOut(); setMessage(result.kind === "confirmed" ? "Đã đăng xuất" : outcomeMessage(result)); }
    finally { setBusy(false); }
  }
  if (route === "credentials") return <CredentialRedemptionPage />;
  return <div className="idea-shell" data-testid="idea-web-app">
    <header className="app-header"><a className="wordmark" href="#accounts">IDEA<span>Engineering</span></a><span className="environment-label">Core v0 · Account Administration</span>
      {context && <div className="current-user"><span>{context.displayName}</span><button type="button" disabled={busy} onClick={() => void signOut()}>Đăng xuất</button></div>}</header>
    <main className="workspace">
      <p role="status" ref={summary} tabIndex={-1} aria-live="polite" className="session-message">{message}</p>
      {context ? <>
        <div className="context-strip"><strong>{context.organizationName}</strong><span>Actor: <code data-testid="session-actor">{context.actorId}</code></span><a href="#credentials">Nhận credential</a></div>
        <AccountAdministrationPage context={context} onInvalidated={() => { setContext(null); setMessage("Phiên không còn hợp lệ. Hãy đăng nhập lại."); }} />
      </> : <section className="login-section"><div className="login-introduction"><p className="eyebrow">Controlled identity</p><h1>Đăng nhập IDEA</h1><p>Đăng nhập bằng IDEA Account của bạn. Vai trò và phạm vi được Server kiểm tra cho từng thao tác.</p><a href="#credentials">Tôi có proof để thiết lập / reset credential</a></div>
        <form aria-label="Đăng nhập" onSubmit={event => void signIn(event)} className="form-card"><fieldset disabled={busy}><legend>IDEA Account</legend>
          <label>Login<input name="username" autoComplete="username" maxLength={254} required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label>
          <button type="submit" className="primary">Đăng nhập</button><button type="button" onClick={() => void refresh()}>Kiểm tra phiên hiện tại</button>
        </fieldset></form></section>}
    </main>
    <footer>Authority do IDEA Server xác định · Không có quyền kỹ thuật ngầm từ Account Administration.</footer>
  </div>;
}
