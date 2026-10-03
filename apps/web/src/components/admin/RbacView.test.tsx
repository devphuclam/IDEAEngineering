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
    expect(html).toContain("Project Administrator");
    expect(html).toContain("Dự án P-100");
  });

  it("renders Add Role Assignment button to open project assignment wizard", () => {
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

  it("renders engineer role assignments with project scopes and roles", () => {
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

    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("Dự án P-100");
    expect(html).toContain("Trực tiếp");
  });

  it("renders Check Access tab and toolbar filters", () => {
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

    expect(html).toContain("Kiểm tra quyền thực tế (Check access)");
    expect(html).toContain("Tất cả phạm vi Scope");
  });
});
