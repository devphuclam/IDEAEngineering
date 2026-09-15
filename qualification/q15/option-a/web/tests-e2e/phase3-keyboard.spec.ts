import { expect, test, type Locator, type Page } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:5115/api/v1/qualification/reset");
});

async function loginAndSearch(page: Page): Promise<Locator> {
  await page.goto("/");
  await page.getByLabel("Username").fill("engineer");
  await page.getByLabel("Password").fill("q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Ngôn ngữ").selectOption("en");
  await page.getByLabel("Search controlled documents").fill("pump");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const grid = page.getByRole("grid", { name: "Controlled document results" });
  await expect(grid).toHaveAttribute("aria-rowcount", "100000");
  return grid;
}

async function expectSelectedVisible(grid: Locator, index: number) {
  const row = grid.locator(`[data-row-index="${index}"]`);
  await expect(row).toHaveClass(/selected/);
  await expect.poll(async () => row.evaluate((node) => {
    const rowBounds = node.getBoundingClientRect();
    const gridBounds = node.parentElement?.parentElement?.getBoundingClientRect();
    return Boolean(gridBounds && rowBounds.top >= gridBounds.top + 35 && rowBounds.bottom <= gridBounds.bottom);
  })).toBe(true);
}

test("phase 3 grid keyboard changes selection and the actual viewport", async ({ page }) => {
  const grid = await loginAndSearch(page);
  await grid.focus();
  await grid.press("ArrowDown");
  await expectSelectedVisible(grid, 0);

  await grid.press("PageDown");
  const pageIndex = Number(await grid.locator(".grid-row.selected").getAttribute("data-row-index"));
  expect(pageIndex).toBeGreaterThan(1);
  await expectSelectedVisible(grid, pageIndex);

  await grid.press("End");
  await expectSelectedVisible(grid, 99999);
  await expect.poll(() => grid.evaluate((node) => node.scrollTop)).toBeGreaterThan(3_000_000);

  await grid.press("PageUp");
  const pageUpIndex = Number(await grid.locator(".grid-row.selected").getAttribute("data-row-index"));
  expect(pageUpIndex).toBeLessThan(99999);
  await expectSelectedVisible(grid, pageUpIndex);

  await grid.press("Home");
  await expectSelectedVisible(grid, 0);
  await expect.poll(() => grid.evaluate((node) => node.scrollTop)).toBe(0);

  await grid.press("Space");
  await expect(grid.locator('[data-row-index="0"]')).toHaveAttribute("aria-selected", "false");
  await grid.press("Space");
  await expect(grid.locator('[data-row-index="0"]')).toHaveAttribute("aria-selected", "true");

  await grid.press("F2");
  await expect(page.getByLabel("Edit title")).toBeFocused();
  await page.getByLabel("Edit title").press("Escape");
  await grid.focus();
  await grid.press("Shift+F10");
  await expect(page.getByRole("menu", { name: "Document actions" })).toBeVisible();
  await page.getByRole("menuitem", { name: "Close" }).click();
  await expect(grid).toBeFocused();

  await grid.press("Enter");
  await expect(page.getByText("DOC-Q15-000001", { exact: true }).last()).toBeVisible();
});
