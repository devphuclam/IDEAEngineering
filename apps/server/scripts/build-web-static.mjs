import { access, rm } from "node:fs/promises";
import { delimiter, dirname, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const serverDirectory = resolve(scriptDirectory, "..");
const repositoryDirectory = resolve(serverDirectory, "../..");
const webDirectory = resolve(repositoryDirectory, "apps/web");
const buildDirectory = resolve(process.argv[2] ?? resolve(serverDirectory, "target"));
const buildRelativePath = relative(serverDirectory, buildDirectory);
if (buildRelativePath !== "target" && !buildRelativePath.startsWith(`target${sep}`)) {
  throw new Error("Web output must stay within this Server project's target directory");
}
if (Number(process.versions.node.split(".")[0]) !== 24) {
  throw new Error("The Web build requires the approved Node.js 24 baseline");
}
const webOutputDirectory = resolve(buildDirectory, "generated-resources/web");
const nodeDirectory = dirname(process.execPath);
const npmCandidates = [
  resolve(nodeDirectory, "node_modules/npm/bin/npm-cli.js"),
  resolve(nodeDirectory, "../lib/node_modules/npm/bin/npm-cli.js"),
];
let npmCli;
for (const candidate of npmCandidates) {
  try { await access(candidate); npmCli = candidate; break; } catch { /* Try the other Node layout. */ }
}
if (!npmCli) throw new Error("Use the approved Node 24 distribution with its bundled npm");
await access(resolve(webDirectory, "node_modules/typescript/package.json"));

// Dependency installation is an explicit, intake-controlled prerequisite, never a hidden build step.
const result = spawnSync(process.execPath, [npmCli, "run", "build", "--",
  "--outDir", webOutputDirectory, "--emptyOutDir"], {
  cwd: webDirectory,
  stdio: "inherit",
  env: { ...process.env, PATH: `${nodeDirectory}${delimiter}${process.env.PATH ?? ""}` },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await access(resolve(webOutputDirectory, "index.html"));
// Remove only generated, compiled Web resources so repeat package cannot retain old hashed assets.
await rm(resolve(buildDirectory, "classes/static"), { recursive: true, force: true });
console.log("Actual Web build ready for Maven resource packaging");
