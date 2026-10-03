import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { INITIAL_PROJECTS } from "./mockAdminData";
import { ProjectsView } from "./ProjectsView";

describe("ProjectsView component", () => {
  it("renders projects list with mechanical codes and lead engineers", () => {
    const html = renderToStaticMarkup(
      createElement(ProjectsView, {
        projects: INITIAL_PROJECTS,
        selectedProjectId: INITIAL_PROJECTS[0].id,
        onSelectProject: () => {},
      })
    );

    expect(html).toContain("Dự Án &amp; Nhóm Cơ Khí");
    expect(html).toContain("P-100");
    expect(html).toContain("Máy đóng gói tự động");
    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("icVault-Primary");
  });
});
