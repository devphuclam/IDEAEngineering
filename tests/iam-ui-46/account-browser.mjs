import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const [source, manifest, label] = process.argv.slice(2);
assert.match(source ?? "", /^[0-9a-f]{40}$/); assert.match(manifest ?? "", /^[0-9a-f]{64}$/);
assert.match(label ?? "", /^account-qualification-[0-9]{2}$/);
const owned = `/home/phuclam/idea-iam-ui-20261007-46/run-${label}`;
const ssh = "C:/Windows/System32/OpenSSH/ssh.exe";
const key = "C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519";
const sshOptions = ["-i", key, "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes", "-o", "ConnectTimeout=8"];
const command = `bash ${owned}/source/tests/iam-ui-46/account-browser.sh ${source} ${manifest} ${label}`;
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
let stage = "preflight", browser, fixture;
const secrets = [];
const passed = [];
const pass = name => { passed.push(name); console.log(`${name}=PASS`); };

async function consoleAdoption(expected) {
  const operation = randomUUID();
  const entries = [
    ["Exact Organization UUID: ", fixture.organizationId],
    ["Same originating Actor UUID: ", fixture.superActorId],
    ["Exact native Login Identity UUID: ", fixture.superLoginIdentityId],
    ["Current Super@1 assignment UUID: ", fixture.superAssignmentId],
    ["Expected account security version: ", "1"],
    ["Reason: ", "Synthetic Q15 console qualification"],
    ["Operation UUID: ", operation],
    ["Confirm this exact transition by typing ADOPT: ", "ADOPT"],
    ["Existing native password (not echoed): ", fixture.superPassword],
  ];
  await new Promise((resolve, reject) => {
    const child = spawn(ssh, [...sshOptions, "-tt", "phuclam@192.168.137.33", command + " console"], { windowsHide: true });
    let index = 0, buffer = "", output = "";
    const timeout = setTimeout(() => { child.kill(); reject(new Error("Console deadline")); }, 30000);
    child.stdout.on("data", data => {
      buffer += data.toString(); output += data.toString();
      while (index < entries.length && buffer.includes(entries[index][0])) {
        buffer = buffer.slice(buffer.indexOf(entries[index][0]) + entries[index][0].length);
        child.stdin.write(entries[index][1] + "\n"); index++;
      }
    });
    child.stderr.on("data", () => {}); // SSH closure text is not application evidence.
    child.on("error", () => { clearTimeout(timeout); reject(new Error("Console process")); });
    child.on("close", code => {
      clearTimeout(timeout);
      if (code !== 0 || index !== entries.length || !output.includes(`ADOPTION_STATE=${expected};`) || output.includes(fixture.superPassword)) reject(new Error("Console oracle"));
      else resolve();
      output = buffer = "";
    });
  });
}

const url = "https://localhost:18446/";
async function signIn(page, login, password, expected = 200) {
  await page.goto(url);
  await page.getByRole("form", { name: "Đăng nhập", exact: true }).waitFor();
  await page.locator('[name="username"]').fill(login);
  await page.locator('[name="password"]').fill(password);
  const response = page.waitForResponse(r => new URL(r.url()).pathname === "/api/v1/identity/login" && r.request().method() === "POST");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  assert.equal((await response).status(), expected);
  if (expected === 200) await page.getByTestId("session-actor").waitFor();
  else await page.getByTestId("status-banner").waitFor();
  assert.equal(await page.locator('[name="password"]').count() === 0 || await page.locator('[name="password"]').inputValue() === "", true);
}
async function issue(page, purpose) {
  await page.getByRole("button", { name: purpose === "FIRST_SETUP" ? "Cấp setup proof" : "Cấp reset proof", exact: true }).click();
  const form = page.getByRole("form", { name: "Xác nhận thao tác", exact: true });
  const value = await form.locator('select[name="loginIdentityId"] option:not([disabled])').first().getAttribute("value");
  await form.locator('select[name="loginIdentityId"]').selectOption(value);
  await form.locator('[name="reason"]').fill("Synthetic intentional private handoff");
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole("button", { name: "Xác nhận trên Server" }).click();
  const input = page.getByTestId("private-proof"); await input.waitFor();
  const proof = await input.inputValue(); assert.match(proof, /^[A-Za-z0-9_-]{43}$/); secrets.push(proof);
  assert.equal(await input.getAttribute("type"), "password"); return proof;
}
async function redeem(page, account, purpose, proof, password, expected) {
  await page.goto(url + "#credentials");
  await page.locator('[name="accountId"]').fill(account);
  await page.locator('[name="purpose"]').selectOption(purpose);
  await page.locator('[name="proof"]').fill(proof);
  await page.locator('[name="password"]').fill(password);
  await page.locator('[name="confirmation"]').fill(password);
  const response = page.waitForResponse(r => new URL(r.url()).pathname === "/api/v1/identity/credentials" && r.request().method() === "POST");
  await page.getByRole("button", { name: "Xác nhận credential", exact: true }).click();
  assert.equal((await response).status(), expected);
  for (const name of ["proof", "password", "confirmation"]) assert.equal(await page.locator(`[name="${name}"]`).inputValue(), "");
}
async function change(page, action) {
  await page.getByRole("button", { name: action, exact: true }).click();
  const form = page.getByRole("form", { name: "Xác nhận thao tác", exact: true });
  await form.locator('[name="reason"]').fill("Synthetic lifecycle qualification"); await form.locator('input[type="checkbox"]').check();
  const response = page.waitForResponse(r => r.request().method() === "POST" && /\/(?:disable|re-enable)$/.test(new URL(r.url()).pathname));
  await form.getByRole("button", { name: "Xác nhận trên Server" }).click(); assert.equal((await response).status(), 200);
  await page.getByTestId("account-status").filter({ hasText: "Server xác nhận trạng thái" }).waitFor();
}
async function privateBoundary(page) {
  const observed = await page.evaluate(() => ({ text: document.body.innerText, url: location.href,
    local: JSON.stringify(localStorage), session: JSON.stringify(sessionStorage), cookies: document.cookie }));
  for (const secret of secrets) for (const value of Object.values(observed)) assert.equal(value.includes(secret), false);
  assert.equal(observed.cookies.includes("IDEA_SESSION="), false);
}

try {
  assert.equal(process.version, "v24.19.0");
  assert.equal(sha(await readFile(process.execPath)), "3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237");
  assert.equal(sha(await readFile("C:/Program Files/Google/Chrome/Application/chrome.exe")), "6849d2982038de9f9489a7b3858f3b785b7fec06a842c93c517281d21995c8ca");
  const base = "C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
  for (const name of ["playwright", "playwright-core"]) assert.equal(JSON.parse(await readFile(base + name + "/package.json", "utf8")).version, "1.62.1");
  const privateRead = spawnSync(ssh, [...sshOptions, "phuclam@192.168.137.33", `test "$(stat -c '%U:%a' ${owned}/fixture.private.json)" = phuclam:600 && cat ${owned}/fixture.private.json`], { encoding: "utf8", windowsHide: true, timeout: 10000 });
  assert.equal(privateRead.status, 0); fixture = JSON.parse(privateRead.stdout); privateRead.stdout = "";
  assert.equal(fixture.source, source); secrets.push(fixture.adminPassword, fixture.ordinaryPassword, fixture.superPassword);
  stage = "interactive-console";
  await consoleAdoption("ADOPTED"); await consoleAdoption("ALREADY_ADOPTED"); pass("Q15_ACTUAL_PTY_INITIAL_REPEAT");
  const { chromium } = createRequire(import.meta.url)(base + "playwright");
  browser = await chromium.launch({ channel: "chrome", headless: false }); assert.equal(browser.version(), "154.0.8037.98");
  const adminContext = await browser.newContext(); const recipientContext = await browser.newContext(); const ordinaryContext = await browser.newContext();
  const page = await adminContext.newPage(); const recipient = await recipientContext.newPage(); const ordinary = await ordinaryContext.newPage();
  let leaked = false, clientActor = false;
  for (const context of [adminContext, recipientContext, ordinaryContext]) {
    context.on("page", tab => tab.on("console", message => { if (secrets.some(secret => message.text().includes(secret))) leaked = true; }));
    context.on("request", request => { const headers = request.headers(); if ("actorid" in headers || "x-actor-id" in headers) clientActor = true;
      if (secrets.some(secret => request.url().includes(secret))) leaked = true; });
  }
  for (const tab of [page, recipient, ordinary]) tab.on("console", message => { if (secrets.some(secret => message.text().includes(secret))) leaked = true; });
  stage = "actual-branded-login";
  const initial = await page.goto(url); assert.equal(initial.status(), 200);
  await page.getByRole("heading", { name: "Cổng Đăng Nhập Kỹ Thuật" }).waitFor();
  await page.waitForFunction(() => { const img = document.querySelector('.brand-showcase-panel img'); return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0; });
  await signIn(page, fixture.adminLogin, fixture.adminPassword);
  const cookie = (await adminContext.cookies(url)).find(cookie => cookie.name === "IDEA_SESSION");
  assert.ok(cookie); assert.equal(cookie.secure && cookie.httpOnly && cookie.sameSite === "Strict", true); assert.equal(cookie.domain, "localhost");
  assert.equal(await page.getByTestId("session-actor").innerText(), `${fixture.adminActorId.slice(0,8)}...${fixture.adminActorId.slice(-4)}`);
  await page.getByRole("button", { name: "Cổng Quản Trị", exact: true }).click();
  await page.getByRole("heading", { name: "Tài Khoản & Định Danh" }).waitFor(); pass("W01_REAL_BRANDED_SESSION_ADMIN");
  stage = "create-pending";
  await page.getByRole("button", { name: "Tạo tài khoản", exact: true }).click();
  const create = page.getByRole("form", { name: "Tạo Account PENDING", exact: true });
  const login = "browser-recipient-" + randomUUID();
  await create.locator('[name="displayName"]').fill("Synthetic browser recipient"); await create.locator('[name="login"]').fill(login);
  await create.getByRole("button", { name: "Tạo PENDING" }).click();
  const detail = page.getByRole("complementary", { name: "Chi tiết Account", exact: true });
  await detail.getByRole("heading", { name: "Synthetic browser recipient", exact: true }).waitFor();
  const actorId = await detail.locator("dd").nth(0).innerText(), accountId = await detail.locator("dd").nth(1).innerText();
  assert.equal(await detail.locator(".state").innerText(), "PENDING"); pass("W02_CREATE_PENDING_ACTUAL_TARGET");
  stage = "private-reissue-redemption";
  const first = await issue(page, "FIRST_SETUP"); const second = await issue(page, "FIRST_SETUP"); assert.notEqual(first, second);
  await privateBoundary(page); await page.getByRole("button", { name: "Đã bàn giao / Xóa khỏi màn hình" }).click();
  assert.equal(await page.getByTestId("private-proof").count(), 0);
  const password = randomUUID(); secrets.push(password);
  await redeem(recipient, accountId, "FIRST_SETUP", first, password, 400);
  await redeem(recipient, accountId, "FIRST_SETUP", second, password, 204);
  await privateBoundary(recipient); await signIn(recipient, login, password); pass("W03_REISSUE_ONE_USE_RECIPIENT_CLEARING");
  stage = "disable-invalidates-session";
  await page.getByRole("button", { name: "Tải lại", exact: true }).click();
  await page.getByRole("button", { name: "Xem Synthetic browser recipient", exact: true }).click();
  await change(page, "Disable"); assert.equal(await detail.locator(".state").innerText(), "DISABLED");
  await recipient.reload(); await recipient.getByRole("form", { name: "Đăng nhập", exact: true }).waitFor();
  await signIn(recipient, login, password, 401); pass("W04_DISABLE_OLD_SESSION_REFUSED");
  stage = "disabled-reset-reenable";
  const reset = await issue(page, "RESET"); const nextPassword = randomUUID(); secrets.push(nextPassword);
  await page.getByRole("button", { name: "Đã bàn giao / Xóa khỏi màn hình" }).click();
  await redeem(recipient, accountId, "RESET", reset, nextPassword, 204); await signIn(recipient, login, nextPassword, 401);
  await page.getByRole("button", { name: "Tải lại", exact: true }).click(); await page.getByRole("button", { name: "Xem Synthetic browser recipient", exact: true }).click();
  assert.equal(await detail.locator(".state").innerText(), "DISABLED");
  await change(page, "Re-enable"); assert.equal(await detail.locator("dd").nth(0).innerText(), actorId); assert.equal(await detail.locator("dd").nth(1).innerText(), accountId);
  await signIn(recipient, login, password, 401); await signIn(recipient, login, nextPassword);
  pass("W05_RESET_SEPARATE_ENABLEMENT_STABLE_ID_FRESH_LOGIN");
  stage = "ordinary-refusal-reload";
  await signIn(ordinary, fixture.ordinaryLogin, fixture.ordinaryPassword);
  assert.equal(await ordinary.getByRole("button", { name: "Cổng Quản Trị", exact: true }).count(), 0);
  await ordinary.goto(url + "#accounts"); await ordinary.getByTestId("account-status").filter({ hasText: "Không có quyền đọc" }).waitFor();
  assert.equal(await ordinary.getByRole("button", { name: "Tạo tài khoản", exact: true }).count(), 0);
  await page.reload(); await page.getByRole("heading", { name: "Tài Khoản & Định Danh" }).waitFor(); pass("W06_ORDINARY_REFUSAL_RELOAD_SERVER_AUTHORITY");
  stage = "committed-response-loss";
  await page.route("**/api/v1/identity/accounts", async route => {
    if (route.request().method() !== "POST") return route.continue();
    const result = await route.fetch(); assert.equal(result.status(), 201); await route.abort("failed");
  });
  await page.getByRole("button", { name: "Tạo tài khoản", exact: true }).click();
  await create.locator('[name="displayName"]').fill("Synthetic lost response"); await create.locator('[name="login"]').fill("lost-" + randomUUID());
  await create.getByRole("button", { name: "Tạo PENDING" }).click();
  await page.getByTestId("account-status").filter({ hasText: "Chưa xác định được kết quả" }).waitFor();
  assert.equal(await create.locator("fieldset").isDisabled(), true);
  await page.unroute("**/api/v1/identity/accounts"); pass("W07_LOST_RESPONSE_NO_FALSE_SUCCESS_NO_AUTO_RETRY");
  stage = "keyboard-responsive-privacy";
  await page.setViewportSize({ width: 780, height: 900 }); await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement !== document.body), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  for (const tab of [page, recipient, ordinary]) await privateBoundary(tab);
  assert.equal(leaked || clientActor, false); pass("W08_KEYBOARD_RESPONSIVE_PRIVATE_BOUNDARIES");
  stage = "logout";
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click(); await page.getByRole("form", { name: "Đăng nhập", exact: true }).waitFor();
  assert.equal(await page.getByTestId("private-proof").count(), 0); await privateBoundary(page); pass("W09_LOGOUT_PROTECTED_UI_UNMOUNT");
  await adminContext.close(); await recipientContext.close(); await ordinaryContext.close();
  console.log(`ACCOUNT_MVP_BROWSER=PASS;SOURCE=${source};CASES=${passed.length};CHROME=154.0.8037.98;HTTPS=NORMAL_TRUST;RETAINED_SECRETS=0`);
} catch { console.error(`ACCOUNT_MVP_BROWSER=FAIL;STAGE=${stage};NO_PRIVATE_DIAGNOSTICS_RETAINED=true`); process.exitCode = 1; }
finally { if (browser) await browser.close(); secrets.length = 0; fixture = undefined; }
