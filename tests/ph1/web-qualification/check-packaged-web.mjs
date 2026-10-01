import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { request } from "node:https";

// Public packaging boundary: the executable JAR must serve its real Web shell/assets.
// No sign-in, database migration, credential or company-data operation is performed.
const [jarArgument, caArgument] = process.argv.slice(2);
assert.ok(jarArgument && caArgument, "Supply the packaged Server JAR and trusted test CA PEM");
const jarFile = resolve(jarArgument);
const ca = await readFile(resolve(caArgument));
const javaTool = (name) => process.env.JAVA_HOME
  ? join(process.env.JAVA_HOME, "bin", name + (process.platform === "win32" ? ".exe" : ""))
  : name;
const listing = spawnSync(javaTool("jar"), ["tf", jarFile], { encoding: "utf8" });
assert.equal(listing.status, 0, "The executable JAR must be readable");
const entries = new Set(listing.stdout.split(/\r?\n/));
const indexEntry = "BOOT-INF/classes/static/index.html";
assert.ok(entries.has(indexEntry), "Clean Server package must contain the actual Web index.html");

const extractionDirectory = await mkdtemp(join(tmpdir(), "idea-packaged-web-"));
let server;
try {
  const extract = (entry) => {
    const result = spawnSync(javaTool("jar"), ["xf", jarFile, entry], { cwd: extractionDirectory });
    assert.equal(result.status, 0, "The packaged Web resource must extract");
  };
  extract(indexEntry);
  const index = await readFile(join(extractionDirectory, indexEntry));
  assert.match(index.toString("utf8"), /id="root"/, "Package must contain the React root");
  const assets = [...index.toString("utf8").matchAll(/(?:src|href)="(\/assets\/[A-Za-z0-9_.-]+)"/g)]
    .map((match) => match[1]);
  assert.ok(assets.some((asset) => /-[A-Za-z0-9_-]+\.js$/.test(asset)),
    "Web shell must reference a hashed JavaScript build asset");
  for (const asset of assets) {
    assert.ok(entries.has(`BOOT-INF/classes/static${asset}`), "Referenced asset must be in the JAR");
    extract(`BOOT-INF/classes/static${asset}`);
  }

  const portProbe = createServer();
  await new Promise((done) => portProbe.listen(0, "127.0.0.1", done));
  const port = portProbe.address().port;
  await new Promise((done) => portProbe.close(done));
  server = spawn(javaTool("java"), ["-jar", jarFile, `--server.port=${port}`,
    "--server.address=127.0.0.1", "--spring.flyway.enabled=false"], { stdio: "ignore" });
  const get = (path) => new Promise((done, fail) => {
    const call = request({ hostname: "127.0.0.1", port, path, ca, method: "GET" }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => done({ status: response.statusCode, body: Buffer.concat(chunks) }));
    });
    call.on("error", fail);
    call.setTimeout(3000, () => call.destroy(new Error("Server request timeout")));
    call.end();
  });
  let ready = false;
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline && server.exitCode === null) {
    try {
      ready = (await get("/health")).status === 200;
      if (ready) break;
    } catch { /* Startup polling only; TLS is still verified on every request. */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  assert.ok(ready, "Packaged Server must become ready through normally validated HTTPS");
  const shell = await get("/");
  assert.equal(shell.status, 200, "Anonymous HTTPS shell request must succeed");
  assert.deepEqual(shell.body, index, "Server must serve the shell from this exact JAR");
  for (const asset of assets) {
    const response = await get(asset);
    assert.equal(response.status, 200, "Referenced built asset must be served anonymously");
    assert.deepEqual(response.body,
      await readFile(join(extractionDirectory, `BOOT-INF/classes/static${asset}`)),
      "Server must serve the asset bytes from this exact JAR");
  }
  assert.equal((await get("/api/v1/identity/session")).status, 401,
    "Public Web assets must not expose the protected session route");
  console.log(`PACKAGED_WEB=PASS; shell=200; assets=${assets.length}; anonymous_session=401; TLS=VERIFIED`);
} finally {
  if (server && server.exitCode === null) {
    const stopped = new Promise((done) => server.once("exit", done));
    server.kill("SIGTERM");
    const forceStop = setTimeout(() => server.kill("SIGKILL"), 10000);
    await stopped;
    clearTimeout(forceStop);
  }
  // This directory was allocated by this process; no checkout/database cleanup is performed.
  await rm(extractionDirectory, { recursive: true, force: true });
}
