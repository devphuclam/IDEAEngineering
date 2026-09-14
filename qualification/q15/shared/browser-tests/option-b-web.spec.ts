import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("console", (message) => {
    if (message.type() === "error") console.error(`[browser-console] ${message.text()}`);
  });
  page.on("pageerror", (error) => console.error(`[browser-pageerror] ${error.message}`));
});

async function enableSemantics(page: Page) {
  const placeholder = page.locator("flt-semantics-placeholder");
  await placeholder.waitFor({ state: "attached", timeout: 15_000 });
  await placeholder.evaluate((element: HTMLElement) => element.click());
  await expect(page.getByRole("textbox").first()).toBeVisible({ timeout: 15_000 });
}

async function replaceText(page: Page, textboxName: string, value: string) {
  const textbox = page.getByRole("textbox", { name: textboxName });
  await textbox.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(value);
  await expect(textbox).toHaveValue(value);
}

test("Flutter Web executes login, large search, detail and locale switch", async ({ page }) => {
  await page.goto("/");
  await enableSemantics(page);
  await expect(page.getByRole("group", { name: /IDEA Engineering Q-15/ })).toBeVisible();

  await replaceText(page, "Username", "engineer");
  await replaceText(page, "Password", "q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Tìm tài liệu được kiểm soát").first()).toBeVisible();

  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page.getByText("100000 dòng × 20 cột")).toBeVisible();
  const firstRow = page.getByRole("button", { name: /DOC-Q15-000001,/ });
  await firstRow.click();
  await expect(page.getByText("Generation: GEN-Q15-000001-V001")).toBeVisible();

  await page.getByRole("button", { name: "Mở trong Workspace" }).click();
  await expect(page.getByText(/Bridge Workspace native không có/).first()).toBeVisible();
  await page.getByText("Tiếng Việt").click();
  await page.getByRole("menuitem", { name: "日本語" }).click();
  await expect(page.getByRole("textbox", { name: "管理対象ドキュメントを検索" })).toBeVisible();
});

test("Flutter Web exposes distinct empty, refused, error and expired states", async ({ page }) => {
  await page.goto("/");
  await enableSemantics(page);
  await replaceText(page, "Username", "engineer");
  await replaceText(page, "Password", "q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  await replaceText(page, "Tìm tài liệu được kiểm soát", "__empty__");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page.getByText("Không tìm thấy tài liệu được phép xem")).toBeVisible();
  await replaceText(page, "Tìm tài liệu được kiểm soát", "__refused__");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page.getByText(/SEARCH_REFUSED/).first()).toBeVisible();
  await replaceText(page, "Tìm tài liệu được kiểm soát", "__error__");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page.getByText(/SEARCH_UNAVAILABLE/).first()).toBeVisible();
  await replaceText(page, "Tìm tài liệu được kiểm soát", "__expire__");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  await expect(page.getByText(/SESSION_EXPIRED/).first()).toBeVisible();
});

test("Flutter Web records transfer metrics for the large-fixture surface", async ({ page }, testInfo) => {
  await page.goto("/");
  await enableSemantics(page);
  await expect(page.getByRole("textbox").first()).toBeVisible();
  const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => {
    const resource = entry as PerformanceResourceTiming;
    return {
      name: resource.name,
      durationMs: resource.duration,
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
      decodedBodySize: resource.decodedBodySize
    };
  }));
  await testInfo.attach("flutter-web-transfer-metrics.json", {
    body: JSON.stringify({ candidate: "option-b", surface: "Flutter Web", resources }, null, 2),
    contentType: "application/json"
  });
  expect(resources.some((resource) => resource.name.includes("flutter_bootstrap.js") || resource.name.includes("main.dart.js") || resource.name.includes("main.dart.wasm"))).toBe(true);
});
