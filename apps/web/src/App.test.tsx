import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Web entry point", () => {
  it("renders the application inside a main landmark", () => {
    const html = renderToStaticMarkup(createElement(App));

    expect(html).toMatch(/<main(?:\s|>)/);
  });
});
