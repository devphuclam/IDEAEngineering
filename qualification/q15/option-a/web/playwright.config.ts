import { defineConfig } from "@playwright/test";

const projectDirectory = new URL(".", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const externalBaseUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.Q15_BROWSER_BASE_URL;

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30_000,
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:5173",
    browserName: "chromium",
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: externalBaseUrl ? undefined : [
    {
      command: "dotnet run --project ../../shared/dotnet/Idea.Q15.ApiHarness/Idea.Q15.ApiHarness.csproj -c Release --no-build",
      cwd: projectDirectory,
      url: "http://127.0.0.1:5115/health",
      reuseExistingServer: true,
      timeout: 60_000
    },
    {
      command: "npm run dev",
      cwd: projectDirectory,
      url: "http://127.0.0.1:5173",
      reuseExistingServer: true,
      timeout: 60_000
    }
  ]
});
