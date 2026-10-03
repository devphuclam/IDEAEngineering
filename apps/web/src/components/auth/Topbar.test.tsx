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

  it("formats long UUID actor IDs cleanly and preserves full ID in tooltip title", () => {
    const rawUuid = "99fc203b-d303-4d3b-9a26-bdce8d4f725b";
    const html = renderToStaticMarkup(
      createElement(Topbar, {
        actorId: rawUuid,
        busy: false,
        onLogout: () => {},
      })
    );

    expect(html).toContain("99fc203b...725b");
    expect(html).toContain(rawUuid);
  });
});
