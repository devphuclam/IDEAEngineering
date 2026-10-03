import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm component", () => {
  const defaultProps = {
    username: "",
    password: "",
    busy: false,
    statusMessage: "Vui lòng nhập tài khoản và mật khẩu.",
    statusType: "neutral" as const,
    onUsernameChange: () => {},
    onPasswordChange: () => {},
    onSubmit: () => {},
  };

  it("renders form with accessible name and labeled inputs above fields", () => {
    const html = renderToStaticMarkup(createElement(LoginForm, defaultProps));

    expect(html).toContain('aria-label="Đăng nhập"');
    expect(html).toContain("Tên đăng nhập");
    expect(html).toContain("Mật khẩu");
    expect(html).toContain('type="password"');
    expect(html).toMatch(/autocomplete="username"/i);
    expect(html).toMatch(/autocomplete="current-password"/i);
  });

  it("disables button and displays loading text when busy", () => {
    const html = renderToStaticMarkup(
      createElement(LoginForm, {
        ...defaultProps,
        busy: true,
      })
    );

    expect(html).toContain("disabled");
    expect(html).toContain("Đang kiểm tra...");
  });

  it("renders official company logo and card title", () => {
    const html = renderToStaticMarkup(
      createElement(LoginForm, {
        ...defaultProps,
        logoSrc: "/logo-idea.png",
      })
    );

    expect(html).toContain('src="/logo-idea.png"');
    expect(html).toContain("Cổng Đăng Nhập Kỹ Thuật");
  });
});
