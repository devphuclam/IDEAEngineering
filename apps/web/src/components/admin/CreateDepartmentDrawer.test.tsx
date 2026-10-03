import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CreateDepartmentDrawer } from "./CreateDepartmentDrawer";
import { INITIAL_ACTORS, INITIAL_ROLES } from "./mockAdminData";

describe("CreateDepartmentDrawer component", () => {
  it("returns null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      createElement(CreateDepartmentDrawer, {
        isOpen: false,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toBe("");
  });

  it("renders form fields for creating department with role checkboxes", () => {
    const html = renderToStaticMarkup(
      createElement(CreateDepartmentDrawer, {
        isOpen: true,
        roles: INITIAL_ROLES,
        actors: INITIAL_ACTORS,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toContain("Tạo phòng ban kỹ thuật mới");
    expect(html).toContain("Tên phòng ban / Tổ chuyên môn:");
    expect(html).toContain("Mã phòng ban:");
    expect(html).toContain("Trưởng phòng / Phụ trách:");
    expect(html).toContain("Vai trò kỹ thuật cho phép trong phòng ban:");
    expect(html).toContain("Design Engineer");
    expect(html).toContain("Automation Engineer");
    expect(html).toContain("Xác nhận tạo phòng ban");
  });
});
