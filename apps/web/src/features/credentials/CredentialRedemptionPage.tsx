import { useRef, useState, type FormEvent } from "react";
import { createIamClient, type ProofPurpose } from "../../api/iamClient";
import { outcomeMessage } from "../iamIntegration/IamStatus";

const client = createIamClient();
export function CredentialRedemptionPage() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [unresolved, setUnresolved] = useState(false);
  const summary = useRef<HTMLParagraphElement>(null);
  async function redeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || unresolved) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const accountId = String(data.get("accountId") ?? "").trim();
    const purpose = String(data.get("purpose")) as ProofPurpose;
    let proof = String(data.get("proof") ?? "");
    let password = String(data.get("password") ?? "");
    let confirmation = String(data.get("confirmation") ?? "");
    // Drop every secret control and FormData copy before the asynchronous request.
    form.reset(); data.delete("proof"); data.delete("password"); data.delete("confirmation");
    if (!/^[0-9a-f-]{36}$/i.test(accountId) || !/^[A-Za-z0-9_-]{43}$/.test(proof) ||
      password !== confirmation || [...password].length < 15 || new TextEncoder().encode(password).length > 72) {
      proof = password = confirmation = ""; setMessage("Kiểm tra Account UUID, proof và mật khẩu xác nhận: tối thiểu 15 ký tự, tối đa 72 byte UTF-8.");
      requestAnimationFrame(() => summary.current?.focus()); return;
    }
    setBusy(true); setMessage("Đang gửi credential riêng tư…");
    try {
      const result = await client.redeemCredential({ operationId: crypto.randomUUID(), accountId, purpose, proof, password });
      setUnresolved(result.kind === "unresolved");
      setMessage(result.kind === "confirmed" ? "Credential đã được Server xác nhận. Reset không re-enable Account bị DISABLED. Hãy đăng nhập mới khi Account được phép hoạt động." : outcomeMessage(result));
    } finally { proof = password = confirmation = ""; setBusy(false); requestAnimationFrame(() => summary.current?.focus()); }
  }
  return <main className="credential-page" aria-labelledby="credential-title">
    <a href="#accounts">← Về đăng nhập / quản trị Account</a>
    <h1 id="credential-title">Nhận credential riêng tư</h1>
    <p>Nhập thông tin được bàn giao trực tiếp. Không cần vai trò quản trị; proof đúng target, còn hạn và chưa dùng là authority của thao tác này.</p>
    <p ref={summary} tabIndex={-1} role="status" className="status-message" aria-live="polite">{message}</p>
    <form onSubmit={event => void redeem(event)} aria-label="Nhận credential" className="form-card">
      <fieldset disabled={busy || unresolved}><legend>Đích nhận credential</legend>
        <label>Account UUID<input name="accountId" autoComplete="off" required /></label>
        <label>Mục đích<select name="purpose"><option value="FIRST_SETUP">Thiết lập lần đầu</option><option value="RESET">Reset mật khẩu</option></select></label>
        <label>Proof riêng tư<input name="proof" type="password" autoComplete="off" required spellCheck={false} /></label>
        <label>Mật khẩu mới<input name="password" type="password" autoComplete="new-password" minLength={15} required /></label>
        <label>Xác nhận mật khẩu mới<input name="confirmation" type="password" autoComplete="new-password" minLength={15} required /></label>
        <p className="hint">Tối thiểu 15 ký tự, tối đa 72 byte UTF-8. Cho phép paste và password manager. Không tự đổi khoảng trắng.</p>
        <button className="primary" type="submit">Xác nhận credential</button>
      </fieldset>
    </form>
    {unresolved && <p role="alert">Không gửi lại proof cũ tự động. Thử đăng nhập mới để kiểm tra kết quả; nếu cần proof khác, liên hệ người cấp để reissue có kiểm soát.</p>}
  </main>;
}
