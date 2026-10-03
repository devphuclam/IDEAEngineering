import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CreateActorDrawer } from "./CreateActorDrawer";
import { INITIAL_PROJECTS, INITIAL_ROLES } from "./mockAdminData";

describe("CreateActorDrawer component", () => {
  it("renders create engineer account drawer with full form controls", () => {
    const html = renderToStaticMarkup(
      createElement(CreateActorDrawer, {
        isOpen: true,
        projects: INITIAL_PROJECTS,
        roles: INITIAL_ROLES,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toContain("Tạo tài khoản kỹ sư mới");
    expect(html).toContain("Họ và tên kỹ sư");
    expect(html).toContain("Tên đăng nhập");
    expect(html).toContain("Email công vụ");
    expect(html).toContain("Phòng ban kỹ thuật");
    expect(html).toContain("Đang hoạt động");
    expect(html).toContain("Chờ kích hoạt");
    expect(html).toContain("Phân công kỹ sư vào dự án máy ngay khi tạo");
    expect(html).toContain("Tạo tài khoản kỹ sư");
  });

  it("returns null when isOpen is false", () => {
    const html = renderToStaticMarkup(
      createElement(CreateActorDrawer, {
        isOpen: false,
        projects: INITIAL_PROJECTS,
        roles: INITIAL_ROLES,
        onClose: () => {},
        onSubmit: () => {},
      })
    );

    expect(html).toBe("");
  });
});
