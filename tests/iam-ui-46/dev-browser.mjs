import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const url = "https://localhost:5174/";
const owned = "/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44";
const control = "/home/phuclam/idea-iam-ui-20261007-46/manual-dev-01/backend.sh";
const source = "9d3732cb173e8094195b9bdd60b5588ac3cfa42e";
const ssh = ["-i", "C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes", "-o", "ConnectTimeout=8", "phuclam@192.168.137.33"];
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
let browser, fixture, stage = "preflight", leaked = false;
function remote(command) {
  const result = spawnSync("C:/Windows/System32/OpenSSH/ssh.exe", [...ssh, command], { encoding: "utf8", timeout: 30000, windowsHide: true });
  assert.equal(result.status, 0, "Owned remote action must succeed");
  return result;
}
async function login(page) {
  await page.goto(url);
  await page.getByRole("form", { name: "Đăng nhập", exact: true }).waitFor();
  await page.locator('[name="username"]').fill(fixture.adminLogin);
  await page.locator('[name="password"]').fill(fixture.adminPassword);
  const response = page.waitForResponse(r => new URL(r.url()).pathname === "/api/v1/identity/login" && r.request().method() === "POST");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  assert.equal((await response).status(), 200);
  await page.getByTestId("session-actor").waitFor();
  assert.ok((await page.getByTestId("session-actor").innerText()).includes(fixture.adminActorId));
}
try {
  assert.equal(process.version, "v24.19.0");
  assert.equal(sha(await readFile(process.execPath)), "3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237");
  assert.equal(sha(await readFile("C:/Program Files/Google/Chrome/Application/chrome.exe")), "d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c");
  const base = "C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
  for (const name of ["playwright", "playwright-core"]) assert.equal(JSON.parse(await readFile(base + name + "/package.json", "utf8")).version, "1.62.1");
  const privateRead = remote(`test "$(stat -c '%U:%a' ${owned}/fixture.private.json)" = phuclam:600 && cat ${owned}/fixture.private.json`);
  fixture = JSON.parse(privateRead.stdout); privateRead.stdout = "";
  assert.equal(fixture.source, source);
  const secrets = [fixture.adminPassword, fixture.memberPassword, fixture.ordinaryPassword];
  const { chromium } = createRequire(import.meta.url)(base + "playwright");
  browser = await chromium.launch({ channel: "chrome", headless: false });
  assert.equal(browser.version(), "155.0.8059.39");
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("console", message => { if (secrets.some(s => message.text().includes(s))) leaked = true; });
  page.on("request", request => { if (secrets.some(s => request.url().includes(s))) leaked = true; });
  stage = "anonymous-trusted-https";
  await page.goto(url);
  assert.equal(await page.evaluate(async () => (await fetch("/api/v1/identity/session")).status), 401);
  console.log("D01_TRUSTED_HTTPS_ANONYMOUS_REFUSAL=PASS");
  stage = "real-login-context-cookie";
  await login(page);
  const cookie = (await context.cookies(url)).find(c => c.name === "IDEA_SESSION");
  assert.ok(cookie && cookie.secure && cookie.httpOnly && cookie.sameSite === "Strict" && cookie.domain === "localhost");
  const facts = await page.evaluate(async () => {
    const context = await fetch("/api/v1/administration/context");
    const accounts = await fetch("/api/v1/administration/accounts?offset=0&limit=50");
    return { context: context.status, accounts: accounts.status };
  });
  assert.deepEqual(facts, { context: 200, accounts: 200 });
  await page.goto(url + "#accounts");
  await page.getByRole("heading", { name: "Tài Khoản & Định Danh", exact: true }).waitFor();
  await page.getByRole("button", { name: "Tạo tài khoản", exact: true }).waitFor();
  console.log("D02_ACTUAL_UI_SERVER_CONTEXT_COOKIE=PASS");
  stage = "stop-start-preserved-account";
  remote(`bash ${control} stop`);
  remote(`bash ${control} start`);
  await page.goto(url);
  assert.equal(await page.evaluate(async () => (await fetch("/api/v1/identity/session")).status), 401);
  await login(page);
  console.log("D03_RESTART_SAME_ACTOR_OLD_SESSION_REFUSED=PASS");
  stage = "logout-privacy";
  const logout = page.waitForResponse(r => new URL(r.url()).pathname === "/api/v1/identity/logout" && r.request().method() === "POST");
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  assert.equal((await logout).status(), 204);
  assert.equal(await page.evaluate(async () => (await fetch("/api/v1/identity/session")).status), 401);
  const exposed = await page.evaluate(() => [document.body.innerText, location.href, JSON.stringify(localStorage), JSON.stringify(sessionStorage), document.cookie]);
  for (const secret of secrets) for (const value of exposed) assert.equal(value.includes(secret), false);
  assert.equal(leaked, false);
  console.log("D04_LOGOUT_REFUSAL_NO_SECRET_RETENTION=PASS");
  console.log("DEV_PATH=PASS;CHROME=4/4;APPLICATION_SOURCE=" + source + ";NO_FULL_FEATURE_RERUN=true");
} catch {
  console.error("DEV_PATH=STOP;STAGE=" + stage + ";NO_SECRET_DIAGNOSTICS=true");
  process.exitCode = 1;
} finally { if (browser) await browser.close(); fixture = undefined; }
