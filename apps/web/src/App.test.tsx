import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Web entry point", () => {
  it("renders the application inside a main landmark", () => {
    const html = renderToStaticMarkup(createElement(App));

    expect(html).toMatch(/<main(?:\s|>)/);
  });

  it("renders a fail-closed login boundary without a bearer-token field", () => {
    const html = renderToStaticMarkup(createElement(App));

    expect(html).toContain('aria-label="Đăng nhập"');
    expect(html).toContain('type="password"');
    expect(html).not.toContain("localStorage");
    expect(html).not.toContain("sessionStorage");
  });
});
