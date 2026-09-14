import { defineConfig } from "@playwright/test";

const projectDirectory = new URL(".", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:5173",
    browserName: "chromium",
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: [
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
