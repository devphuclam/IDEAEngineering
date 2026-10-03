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

  it("formats raw UUIDs cleanly and provides full UUID in title attributes", () => {
    const rawActorUuid = "99fc203b-d303-4d3b-9a26-bdce8d4f725b";
    const rawAccountUuid = "872c524d-2ce6-4715-931a-c15785876baf";
    const html = renderToStaticMarkup(
      createElement(SessionLanding, {
        actorId: rawActorUuid,
        accountId: rawAccountUuid,
        onEnterWorkbench: () => {},
      })
    );

    // Formatted tokens
    expect(html).toContain("99fc203b...725b");
    expect(html).toContain("872c524d...6baf");
    // Full UUIDs retained in title attributes for tooltip & inspection
    expect(html).toContain(rawActorUuid);
    expect(html).toContain(rawAccountUuid);
  });
});
