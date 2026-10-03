import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SessionLanding } from "./SessionLanding";

describe("SessionLanding component", () => {
  it("renders verified session context and tiles without nagging text", () => {
    const html = renderToStaticMarkup(
      createElement(SessionLanding, {
        actorId: "engineer.dev",
        accountId: "acc_019842a",
        onEnterWorkbench: () => {},
      })
    );

    expect(html).toContain("Chào mừng bạn quay trở lại làm việc");
    expect(html).toContain("engineer.dev");
    expect(html).toContain("acc_019842a");
    expect(html).toContain("Kho chính (icVault-Primary)");
    expect(html).toContain("Vào Bàn Làm Việc Kỹ Thuật →");
    expect(html).not.toContain("Khi hết ca hoặc rời máy tính");
  });
});
