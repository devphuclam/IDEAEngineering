import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://127.0.0.1:5115/api/v1/qualification/reset");
});

async function loginAndSearch(page: Page) {
  await page.goto("/");
  await page.getByLabel("Username").fill("engineer");
  await page.getByLabel("Password").fill("q15-engineer-only");
  await page.getByRole("button", { name: "Sign in" }).click();
  const query = page.locator('[data-q15="search-query"]');
  await expect(query).toBeVisible();
  await query.fill("pump");
  await page.locator('[data-q15="search-submit"]').click();
  await expect(page.locator('[data-q15="document-grid"] .virtual-grid')).toHaveAttribute("aria-rowcount", "100000");
}

test("phase 2 grid keeps header and body horizontally aligned", async ({ page }) => {
  await loginAndSearch(page);
  const grid = page.locator('[data-q15="document-grid"] .virtual-grid');
  const viewport = grid;
  await viewport.evaluate((element) => { element.scrollLeft = 420; });
  const positions = await grid.evaluate((root) => {
    const header = root.querySelector<HTMLElement>("[role=columnheader]")?.getBoundingClientRect();
    const body = root.querySelector<HTMLElement>("[data-row-index='0'] [role=gridcell]")?.getBoundingClientRect();
    return { headerX: header?.x, bodyX: body?.x, scrollLeft: (root as HTMLElement).scrollLeft };
  });
  expect(positions.scrollLeft).toBe(420);
  expect(Math.abs((positions.headerX ?? 0) - (positions.bodyX ?? 0))).toBeLessThan(1);
});

test("phase 2 browser refresh exposes the session boundary and stale results do not leak", async ({ page }) => {
  await loginAndSearch(page);
  await expect(page.getByText("Pump assembly 000001", { exact: false }).first()).toBeVisible();
  await page.locator('[data-q15="search-query"]').fill("__empty__");
  await page.locator('[data-q15="search-submit"]').click();
  await expect(page.getByRole("status").filter({ hasText: /No permitted documents found|Không tìm thấy/ })).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-q15="login-submit"]')).toBeVisible();
});

test("phase 2 records browser transfer metrics for the same large fixture", async ({ page }, testInfo) => {
  await loginAndSearch(page);
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
  await testInfo.attach("option-a-browser-transfer-metrics.json", {
    body: JSON.stringify({ candidate: "option-a", fixture: "large", resources }, null, 2),
    contentType: "application/json"
  });
  expect(resources.some((resource) => resource.name.includes("/api/v1/search"))).toBe(true);
});
