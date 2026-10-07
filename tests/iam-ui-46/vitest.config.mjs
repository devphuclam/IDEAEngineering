import { fileURLToPath } from "node:url";

// Native config loading avoids writes in shared node_modules. All output stays in the owned export.
export default {
  root: fileURLToPath(new URL("../../apps/web", import.meta.url)),
  cacheDir: fileURLToPath(new URL("../../apps/web/.iam-vitest-cache", import.meta.url)),
  test: {
    environment: "node",
    include: ["src/features/iamIntegration/iamIntegrationState.test.ts"],
    fileParallelism: false,
    maxWorkers: 1,
  },
};
