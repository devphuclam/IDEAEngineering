import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AccountsView } from "./AccountsView";
import { INITIAL_ACTORS } from "./mockAdminData";

describe("AccountsView component", () => {
  it("renders accounts table with formatted actor identities and status badges", () => {
    const html = renderToStaticMarkup(
      createElement(AccountsView, {
        actors: INITIAL_ACTORS,
        selectedActorId: INITIAL_ACTORS[0].id,
        onSelectActor: () => {},
      })
    );

    expect(html).toContain("Tài Khoản Kỹ Sư &amp; Định Danh (F04)");
    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("engineer.dev");
    expect(html).toContain("Đang hoạt động");
    expect(html).toContain("Tạm khóa");
    // Formatted UUID token
    expect(html).toContain("99fc203b...725b");
  });

  it("highlights currently selected actor row", () => {
    const html = renderToStaticMarkup(
      createElement(AccountsView, {
        actors: INITIAL_ACTORS,
        selectedActorId: INITIAL_ACTORS[0].id,
        onSelectActor: () => {},
      })
    );

    expect(html).toContain('class="selected"');
  });
});
