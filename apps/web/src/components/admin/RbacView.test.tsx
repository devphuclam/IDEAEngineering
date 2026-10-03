import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  INITIAL_ACTORS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PROJECTS,
  INITIAL_ROLES,
} from "./mockAdminData";
import { RbacView } from "./RbacView";

describe("RbacView component", () => {
  it("renders 3 Microsoft-style tabs: Role assignments, Roles, and Check access", () => {
    const html = renderToStaticMarkup(
      createElement(RbacView, {
        assignments: INITIAL_ASSIGNMENTS,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        selectedAssignmentId: INITIAL_ASSIGNMENTS[0].id,
        onSelectAssignment: () => {},
        onOpenAddAssignment: () => {},
      })
    );

    expect(html).toContain("Bảng gán vai trò (Role assignments)");
    expect(html).toContain("Danh mục vai trò (Roles)");
    expect(html).toContain("Kiểm tra quyền thực tế (Check access)");
    expect(html).toContain("Design Engineer");
    expect(html).toContain("Dự án P-100");
  });

  it("renders Add Role Assignment button to open Microsoft-style wizard", () => {
    const html = renderToStaticMarkup(
      createElement(RbacView, {
        assignments: INITIAL_ASSIGNMENTS,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        onSelectAssignment: () => {},
        onOpenAddAssignment: () => {},
      })
    );

    expect(html).toContain("Thêm phân quyền vai trò");
  });
});
