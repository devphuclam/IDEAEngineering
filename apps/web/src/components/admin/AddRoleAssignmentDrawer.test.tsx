import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AddRoleAssignmentDrawer } from "./AddRoleAssignmentDrawer";
import {
  INITIAL_ACTORS,
  INITIAL_PROJECTS,
  INITIAL_ROLES,
} from "./mockAdminData";

describe("AddRoleAssignmentDrawer component", () => {
  it("renders natural 4-step project RBAC wizard steps: Project -> Engineer -> Role -> Review", () => {
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

    expect(html).toContain("Phân công nhân sự dự án (Project Role Assignment)");
    expect(html).toContain("1. Dự án (Project)");
    expect(html).toContain("2. Kỹ sư (Engineer)");
    expect(html).toContain("3. Vai trò (Role)");
    expect(html).toContain("4. Xác nhận (Review)");
    expect(html).toContain("Dự án P-100");
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
