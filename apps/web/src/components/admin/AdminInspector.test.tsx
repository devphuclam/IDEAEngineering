import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminInspector } from "./AdminInspector";
import { INITIAL_ACTORS, INITIAL_ASSIGNMENTS } from "./mockAdminData";

describe("AdminInspector component", () => {
  it("renders selected actor details and safety actions without revealing passwords", () => {
    const actor = INITIAL_ACTORS[0]; // engineer.dev
    const html = renderToStaticMarkup(
      createElement(AdminInspector, {
        selectedActor: actor,
        onToggleStatus: () => {},
        onOpenAddRole: () => {},
      })
    );

    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("engineer.dev");
    expect(html).toContain("Phòng Thiết kế Cơ khí JIG");
    expect(html).toContain("Tạm khóa tài khoản");
    expect(html).not.toContain("password");
    expect(html).not.toContain("mật khẩu");
  });

  it("offers reactivation button when actor is suspended", () => {
    const suspendedActor = INITIAL_ACTORS[2]; // nam.hoang (suspended)
    const html = renderToStaticMarkup(
      createElement(AdminInspector, {
        selectedActor: suspendedActor,
        onToggleStatus: () => {},
        onOpenAddRole: () => {},
      })
    );

    expect(html).toContain("Kích hoạt lại tài khoản");
    expect(html).toContain("Tạm khóa");
  });

  it("renders role assignment details when inspecting a project role assignment", () => {
    const asg = INITIAL_ASSIGNMENTS[0]; // Nguyễn Văn An, Project Administrator, Dự án P-100
    const html = renderToStaticMarkup(
      createElement(AdminInspector, {
        selectedAssignment: asg,
        onRevokeAssignment: () => {},
      })
    );

    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("Project Administrator");
    expect(html).toContain("Dự án P-100");
    expect(html).toContain("Thu hồi vai trò này");
  });

  it("renders department details with code, lead, and authorized roles", () => {
    const dept = {
      id: "dept_mech",
      code: "DEPT-MECH",
      name: "Phòng Thiết kế Cơ khí JIG & Máy",
      lead: "Nguyễn Văn An",
      description: "Chịu trách nhiệm thiết kế kết cấu cơ khí 3D.",
      allowedRoleIds: ["role_design_engineer"],
      createdAt: "2026-01-01",
    };

    const html = renderToStaticMarkup(
      createElement(AdminInspector, {
        selectedDepartment: dept,
        actors: INITIAL_ACTORS,
      })
    );

    expect(html).toContain("Cơ cấu tổ chức");
    expect(html).toContain("DEPT-MECH");
    expect(html).toContain("Phòng Thiết kế Cơ khí JIG &amp; Máy");
    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("Mã phòng ban:");
  });
});

