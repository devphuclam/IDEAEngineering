import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBanner } from "./StatusBanner";

describe("StatusBanner component", () => {
  it("renders status banner with polite aria-live and role status", () => {
    const html = renderToStaticMarkup(
      createElement(StatusBanner, {
        type: "neutral",
        message: "Vui lòng nhập tài khoản và mật khẩu.",
      })
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Vui lòng nhập tài khoản và mật khẩu.");
    expect(html).toContain("status-neutral");
  });

  it("renders warning state with correct modifier class", () => {
    const html = renderToStaticMarkup(
      createElement(StatusBanner, {
        type: "warning",
        message: "Tài khoản tạm thời bị khóa 15 phút.",
      })
    );

    expect(html).toContain("status-warning");
    expect(html).toContain("Tài khoản tạm thời bị khóa 15 phút.");
  });

  it("renders danger state for wrong credentials", () => {
    const html = renderToStaticMarkup(
      createElement(StatusBanner, {
        type: "danger",
        message: "Tên đăng nhập hoặc mật khẩu không chính xác.",
      })
    );

    expect(html).toContain("status-danger");
    expect(html).toContain("Tên đăng nhập hoặc mật khẩu không chính xác.");
  });
});
