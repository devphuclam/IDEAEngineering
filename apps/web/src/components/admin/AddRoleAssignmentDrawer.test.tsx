import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AddRoleAssignmentDrawer } from "./AddRoleAssignmentDrawer";
import { INITIAL_ACTORS, INITIAL_PROJECTS, INITIAL_ROLES } from "./mockAdminData";

describe("AddRoleAssignmentDrawer component", () => {
  it("renders Microsoft-style 3-step wizard steps", () => {
    const html = renderToStaticMarkup(
      createElement(AddRoleAssignmentDrawer, {
        isOpen: true,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toContain("Thêm phân quyền vai trò (Add role assignment)");
    expect(html).toContain("1. Vai trò (Role)");
    expect(html).toContain("2. Thành viên (Members)");
    expect(html).toContain("3. Phạm vi (Scope)");
    expect(html).toContain("4. Xem lại (Review)");
    expect(html).toContain("Design Engineer");
  });

  it("returns null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      createElement(AddRoleAssignmentDrawer, {
        isOpen: false,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toBe("");
  });
});
