import type { FormEvent } from "react";
import { StatusBanner, type BannerType } from "./StatusBanner";
import logoUrl from "../../assets/logo-idea.png";

export interface LoginFormProps {
  username: string;
  password: string;
  busy: boolean;
  statusMessage: string;
  statusType?: BannerType;
  logoSrc?: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  username,
  password,
  busy,
  statusMessage,
  statusType = "neutral",
  logoSrc = logoUrl,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="auth-form-card">
      <div className="auth-card-head">
        {logoSrc && (
          <img
            src={logoSrc}
            alt="IDEA - Innovation for a better life"
            className="auth-company-logo"
          />
        )}
        <h2 className="auth-card-title">Cổng Đăng Nhập Kỹ Thuật</h2>
        <p className="auth-card-subtitle">
          Hệ thống xác thực tài khoản kỹ sư và quản trị viên
        </p>
      </div>

      <div className="auth-card-body">
        <StatusBanner type={statusType} message={statusMessage} />

        <form aria-label="Đăng nhập" onSubmit={onSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="inp-username">
              Tên đăng nhập
            </label>
            <input
              id="inp-username"
              name="username"
              type="text"
              className="field-input"
              placeholder="Ví dụ: engineer.dev"
              autoComplete="username"
              maxLength={254}
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              disabled={busy}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="inp-password">
              Mật khẩu
            </label>
            <input
              id="inp-password"
              name="password"
              type="password"
              className="field-input"
              placeholder="Nhập mật khẩu..."
              autoComplete="current-password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={busy}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-card-footer">
          Không gian quản lý dữ liệu kỹ thuật nội bộ IDEA Group.
        </div>
      </div>
    </div>
  );
}
