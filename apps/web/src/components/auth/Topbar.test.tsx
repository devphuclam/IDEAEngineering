import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Topbar } from "./Topbar";

describe("Topbar component", () => {
  it("renders brand, actor identity, and logout button", () => {
    const html = renderToStaticMarkup(
      createElement(Topbar, {
        actorId: "engineer.dev",
        busy: false,
        onLogout: () => {},
      })
    );

    expect(html).toContain("IDEA Engineering");
    expect(html).toContain("engineer.dev");
    expect(html).toContain("Đăng xuất");
  });

  it("disables logout button when busy", () => {
    const html = renderToStaticMarkup(
      createElement(Topbar, {
        actorId: "engineer.dev",
        busy: true,
        onLogout: () => {},
      })
    );

    expect(html).toContain("disabled");
  });
});
