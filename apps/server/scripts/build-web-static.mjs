import { access, copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
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
await access(resolve(webDirectory, "node_modules/typescript/package.json"));

// Dependency installation is an explicit, intake-controlled prerequisite, never a hidden build step.
// A Node-only admitted runtime can use the same locked CLIs without acquiring npm.
const commands = npmCli
  ? [[npmCli, "run", "build", "--", "--outDir", webOutputDirectory, "--emptyOutDir"]]
  : [[resolve(webDirectory, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json", "--noEmit"],
    [resolve(webDirectory, "node_modules/vite/bin/vite.js"), "build", "--outDir", webOutputDirectory, "--emptyOutDir"]];
for (const command of commands) {
  const result = spawnSync(process.execPath, command, {
    cwd: webDirectory,
    stdio: "inherit",
    env: { ...process.env, npm_config_offline: "true",
      PATH: `${nodeDirectory}${delimiter}${process.env.PATH ?? ""}` },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

await access(resolve(webOutputDirectory, "index.html"));
// R36-04: exact admitted runtime notices accompany the copies served to browsers.
// A dependency upgrade reopens intake rather than silently retaining an obsolete notice.
const runtimeNotices = [["react", "19.3.0"], ["react-dom", "19.3.0"], ["scheduler", "0.28.0"]];
const noticeHash = "da6d3703ed11cbe42bd212c725957c98da23cbff1998c05fa4b3d976d1a58e93";
for (const [name, version] of runtimeNotices) {
  const dependencyDirectory = resolve(webDirectory, "node_modules", name);
  const manifest = JSON.parse(await readFile(resolve(dependencyDirectory, "package.json"), "utf8"));
  const bytes = await readFile(resolve(dependencyDirectory, "LICENSE"));
  if (manifest.name !== name || manifest.version !== version ||
      createHash("sha256").update(bytes).digest("hex") !== noticeHash) {
    throw new Error(`Runtime notice intake drift: ${name}`);
  }
}
const noticeDirectory = resolve(webOutputDirectory, "assets/licenses");
await mkdir(noticeDirectory, { recursive: true });
for (const [name] of runtimeNotices) {
  await copyFile(resolve(webDirectory, "node_modules", name, "LICENSE"), resolve(noticeDirectory, `${name}.txt`));
}
// Remove only generated, compiled Web resources so repeat package cannot retain old hashed assets.
await rm(resolve(buildDirectory, "classes/static"), { recursive: true, force: true });
console.log("Actual Web build ready for Maven resource packaging");
