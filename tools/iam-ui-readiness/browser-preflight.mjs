import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const base = "C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/";
const expectedNode = "3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237";
const expectedChrome = "6849d2982038de9f9489a7b3858f3b785b7fec06a842c93c517281d21995c8ca";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
assert.equal(process.version, "v24.19.0");
assert.equal(hash(await readFile(process.execPath)), expectedNode);
assert.equal(hash(await readFile("C:/Program Files/Google/Chrome/Application/chrome.exe")), expectedChrome);
for (const name of ["playwright", "playwright-core"]) {
  assert.equal(JSON.parse(await readFile(base + "node_modules/" + name + "/package.json", "utf8")).version, "1.62.1");
}
const { chromium } = require(base + "node_modules/playwright");
const browser = await chromium.launch({ channel: "chrome", headless: false });
try {
  assert.equal(browser.version(), "154.0.8037.98");
  const context = await browser.newContext(); // normal certificate/hostname checks; no TLS bypass
  const page = await context.newPage();
  for (const host of ["localhost", "127.0.0.1"]) {
    const response = await page.goto("https://" + host + ":18446/__iam_readiness");
    assert.equal(response.status(), 200);
    assert.equal(await response.text(), "IDEA_IAM_UI_READINESS_46\n");
    console.log("TRUSTED_HTTPS_" + host + "=PASS;HTTP=200");
  }
  await context.close();
  console.log("CHROME=154.0.8037.98;PLAYWRIGHT=1.62.1;ENVIRONMENT_TLS_ONLY=PASS");
} finally { await browser.close(); }
