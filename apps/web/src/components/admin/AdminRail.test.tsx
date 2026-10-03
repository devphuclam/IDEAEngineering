import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminRail, AdminSection } from "./AdminRail";

describe("AdminRail component", () => {
  it("renders 4 DDM administration sections with item counts", () => {
    const html = renderToStaticMarkup(
      createElement(AdminRail, {
        activeSection: "accounts",
        counts: { accounts: 4, departments: 5, projects: 3, assignments: 5 },
        onSelectSection: () => {},
      })
    );

    expect(html).toContain("Tài khoản &amp; Định danh");
    expect(html).toContain("Cơ cấu tổ chức &amp; Phòng ban");
    expect(html).toContain("Dự án &amp; Nhóm cơ khí");
    expect(html).toContain("Phân quyền vai trò RBAC");
    expect(html).toContain("4");
    expect(html).toContain("5");
    expect(html).toContain("3");
  });

  it("marks active section with active CSS class and proper aria attributes", () => {
    const html = renderToStaticMarkup(
      createElement(AdminRail, {
        activeSection: "departments" as AdminSection,
        counts: { accounts: 4, departments: 5, projects: 3, assignments: 5 },
        onSelectSection: () => {},
      })
    );

    expect(html).toContain('class="admin-nav-item active"');
    expect(html).toContain("Cơ cấu tổ chức &amp; Phòng ban");
  });
});

