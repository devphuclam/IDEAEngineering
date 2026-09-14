import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/option-b-web.json" }]],
  use: {
    baseURL: process.env.Q15_BROWSER_BASE_URL ?? "http://127.0.0.1:5174",
    browserName: "chromium",
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  }
});
