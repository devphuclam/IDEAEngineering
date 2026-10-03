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
});
