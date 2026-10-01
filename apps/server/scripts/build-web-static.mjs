import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const serverDirectory = resolve(scriptDirectory, "..");
const repositoryDirectory = resolve(serverDirectory, "../..");
const webDirectory = resolve(repositoryDirectory, "apps/web");
const webOutputDirectory = resolve(webDirectory, "dist");
const staticDirectory = resolve(serverDirectory, "src/main/resources/static");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["run", "build"], {
  cwd: webDirectory,
  stdio: "inherit",
  // Windows exposes npm through a .cmd shim; Linux uses the executable directly.
  shell: process.platform === "win32",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const outputEntries = await readdir(webOutputDirectory);
if (!outputEntries.includes("index.html")) {
  throw new Error(`Web build did not produce ${resolve(webOutputDirectory, "index.html")}`);
}

await rm(staticDirectory, { recursive: true, force: true });
await mkdir(staticDirectory, { recursive: true });
await cp(webOutputDirectory, staticDirectory, { recursive: true });
console.log(`T043 Web bundle copied to ${staticDirectory}`);
