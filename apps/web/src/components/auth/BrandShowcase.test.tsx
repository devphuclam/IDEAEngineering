import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandShowcase } from "./BrandShowcase";

describe("BrandShowcase component", () => {
  it("renders IDEA Group seal and authentic industrial titles", () => {
    const html = renderToStaticMarkup(createElement(BrandShowcase));

    expect(html).toContain("IDEA GROUP");
    expect(html).toMatch(/THE WORLD OF CREATIVITY/i);
    expect(html).toMatch(/INNOVATION FOR A BETTER LIFE/i);
    expect(html).toContain('src="/LOGO_IDEA_full_L.png"');
  });

  it("does not render marketing feature pitch cards", () => {
    const html = renderToStaticMarkup(createElement(BrandShowcase));

    expect(html).not.toContain("Kiểm soát Dữ liệu CAD & Cấu trúc BOM");
    expect(html).not.toContain("Kho lưu ký icVault An Toàn");
    expect(html).not.toContain("Truyền tệp Tin cậy & Chống gián đoạn");
  });
});
