import { useEffect, useState } from "react";
import type { PrivateProof, ProofPurpose } from "../../api/iamClient";

/** The only admin proof display: intentional temporary control, never a URL or automatic clipboard. */
export function CredentialProofHandoff({ delivery, accountId, loginIdentityId, purpose, onClear }: {
  delivery: PrivateProof; accountId: string; loginIdentityId: string; purpose: ProofPurpose; onClear(): void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(onClear, Math.max(0, Date.parse(delivery.expiresAt) - Date.now()));
    return () => clearTimeout(timer);
  }, [delivery.expiresAt, onClear]);
  return <section className="private-handoff" aria-label="Bàn giao credential riêng tư">
    <h3>Bàn giao riêng cho đúng người nhận</h3>
    <p>Không gửi proof bằng đường dẫn. Người nhận tự đặt mật khẩu tại <a href="#credentials">màn hình nhận credential</a>. Quản trị viên không nhận mật khẩu.</p>
    <dl><dt>Account</dt><dd>{accountId}</dd><dt>Login Identity</dt><dd>{loginIdentityId}</dd><dt>Mục đích</dt><dd>{purpose}</dd><dt>Hết hạn</dt><dd>{new Date(delivery.expiresAt).toLocaleString("vi-VN")}</dd></dl>
    <label htmlFor="private-proof">Proof riêng tư — chỉ sao chép thủ công cho người nhận</label>
    <input id="private-proof" data-testid="private-proof" type={visible ? "text" : "password"} readOnly value={delivery.proof} autoComplete="off" spellCheck={false} />
    <div className="actions"><button type="button" onClick={() => setVisible(value => !value)}>{visible ? "Ẩn proof" : "Hiện proof"}</button>
    <button type="button" onClick={onClear}>Đã bàn giao / Xóa khỏi màn hình</button></div>
    <p className="hint">Không lưu trong ứng dụng. Khi đóng, chuyển màn hình hoặc hết hạn, proof bị xóa khỏi trạng thái UI. Không tự lưu clipboard.</p>
  </section>;
}
