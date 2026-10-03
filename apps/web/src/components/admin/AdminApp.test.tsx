import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminApp } from "./AdminApp";

describe("AdminApp component", () => {
  it("renders DDM 3-column administration workspace and topbar with return button", () => {
    const html = renderToStaticMarkup(
      createElement(AdminApp, {
        actorId: "engineer.dev",
        onExitAdmin: () => {},
        onLogout: () => {},
      })
    );

    expect(html).toContain("IDEA DDM Administration");
    expect(html).toContain("← Về Bàn Làm Việc Kỹ Thuật");
    expect(html).toContain("Tài khoản &amp; Định danh");
    expect(html).toContain("Phân quyền vai trò RBAC");
    expect(html).toContain("Máy chủ IAM: Sẵn sàng");
  });
});
