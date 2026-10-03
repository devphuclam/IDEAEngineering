import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DepartmentsView } from "./DepartmentsView";
import {
  INITIAL_ACTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_ROLES,
} from "./mockAdminData";

describe("DepartmentsView component", () => {
  it("renders list of enterprise departments with codes and roles", () => {
    const html = renderToStaticMarkup(
      createElement(DepartmentsView, {
        departments: INITIAL_DEPARTMENTS,
        actors: INITIAL_ACTORS,
        roles: INITIAL_ROLES,
        selectedDepartmentId: INITIAL_DEPARTMENTS[0].id,
        onSelectDepartment: () => {},
        onOpenCreateDepartment: () => {},
      })
    );

    expect(html).toContain("Cơ Cấu Tổ Chức &amp; Phòng Ban");
    expect(html).toContain("Tạo phòng ban mới");
    expect(html).toContain("DEPT-MECH");
    expect(html).toContain("Phòng Thiết kế Cơ khí JIG &amp; Máy");
    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("DEPT-ELEC");
    expect(html).toContain("Phòng Điện - Tự động hóa");
    expect(html).toContain("Đỗ Minh Quân");
  });

  it("highlights selected department row with selected class", () => {
    const html = renderToStaticMarkup(
      createElement(DepartmentsView, {
        departments: INITIAL_DEPARTMENTS,
        actors: INITIAL_ACTORS,
        roles: INITIAL_ROLES,
        selectedDepartmentId: "dept_elec",
        onSelectDepartment: () => {},
        onOpenCreateDepartment: () => {},
      })
    );

    expect(html).toContain('class="selected"');
  });
});
