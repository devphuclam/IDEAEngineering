import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:5115/api/v1/qualification/reset");
});

test("keyboard reaches login, search, large grid and exact detail", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Username").fill("engineer");
  await page.getByLabel("Password").fill("q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).press("Enter");
  await expect(page).toHaveURL(/\/documents$/);
  await page.getByLabel("Ngôn ngữ").selectOption("en");
  await page.getByLabel("Search controlled documents").focus();
  await page.getByLabel("Search controlled documents").fill("pump");
  await page.getByRole("button", { name: "Search", exact: true }).press("Enter");
  const grid = page.getByRole("grid", { name: "Controlled document results" });
  await expect(grid).toHaveAttribute("aria-rowcount", "100000");
  await expect(grid).toHaveAttribute("aria-colcount", "20");
  await grid.focus();
  await grid.press("ArrowDown");
  await grid.press("Enter");
  await expect(page.getByText("DOC-Q15-000001", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("GEN-Q15-000001-V001", { exact: true })).toBeVisible();
});

test("locale switching preserves Unicode and server state", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Username").fill("engineer");
  await page.getByLabel("Password").fill("q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Ngôn ngữ").selectOption("ja");
  await expect(page.getByRole("button", { name: "検索" })).toBeVisible();
  await page.getByLabel("管理対象ドキュメントを検索").fill("pump");
  await page.getByRole("button", { name: "検索" }).click();
  await expect(page.getByRole("grid", { name: "管理対象ドキュメントの結果" })).toHaveAttribute("aria-rowcount", "100000");
  await page.getByLabel("言語").selectOption("en");
  await expect(page.getByRole("button", { name: "Search", exact: true })).toBeVisible();
});

test("empty, refused, error and expired-session states are distinct", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Username").fill("engineer");
  await page.getByLabel("Password").fill("q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  const input = page.getByLabel("Tìm tài liệu được kiểm soát");
  for (const [query, expected] of [["__empty__", "Không tìm thấy"], ["__refused__", "SEARCH_REFUSED"], ["__error__", "SEARCH_UNAVAILABLE"], ["__expire__", "SESSION_EXPIRED"]] as const) {
    await input.fill(query);
    await page.getByRole("button", { name: "Tìm kiếm" }).click();
    const result = query === "__empty__"
      ? page.getByRole("status").filter({ hasText: expected }).first()
      : page.getByRole("alert").filter({ hasText: expected });
    await expect(result).toBeVisible();
    if (query === "__expire__") break;
  }
});
