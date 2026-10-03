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

    expect(html).toContain("Phân công nhân sự dự án");
    expect(html).toContain("1. Dự án");
    expect(html).toContain("2. Kỹ sư");
    expect(html).toContain("3. Vai trò");
    expect(html).toContain("4. Xác nhận");
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

  it("renders Step 3 with department selector and filters roles by department", () => {
    // Nguyễn Văn An belongs to "Phòng Thiết kế Cơ khí JIG & Máy"
    const html = renderToStaticMarkup(
      createElement(AddRoleAssignmentDrawer, {
        isOpen: true,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        initialStep: 3,
        preselectedActorId: INITIAL_ACTORS[0].id,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toContain("Bước 3: Chọn vai trò &amp; Quyền kỹ thuật");
    expect(html).toContain("Chọn phòng ban:");
    expect(html).toContain("Phòng Thiết kế Cơ khí JIG &amp; Máy");
    // Mechanical department has Design Engineer and Reviewer / Approver
    expect(html).toContain("Design Engineer");
    expect(html).toContain("Reviewer / Approver");
    // Should NOT contain roles restricted to other departments
    expect(html).not.toContain("Automation Engineer");
    expect(html).not.toContain("Project Administrator");
    expect(html).not.toContain("Account Administrator");
  });

  it("filters roles to automation department when an electrical engineer is preselected", () => {
    // Đỗ Minh Quân belongs to "Phòng Điện - Tự động hóa"
    const electricalActor = INITIAL_ACTORS.find(
      (a) => a.department === "Phòng Điện - Tự động hóa" && a.status === "active"
    )!;

    const html = renderToStaticMarkup(
      createElement(AddRoleAssignmentDrawer, {
        isOpen: true,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        projects: INITIAL_PROJECTS,
        initialStep: 3,
        preselectedActorId: electricalActor.id,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toContain("Gán cho: " + electricalActor.fullName);
    expect(html).toContain("Automation Engineer");
    expect(html).toContain("Design Engineer");
    expect(html).not.toContain("Project Administrator");
    expect(html).not.toContain("Account Administrator");
  });
});

