import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "src/features/iamIntegration/iamIntegration.accessibility.test.ts",
      "src/features/iamIntegration/iamIntegration.browser.test.ts",
      "src/features/iamIntegration/iamIntegration.failure.test.ts",
    ],
  },
});
