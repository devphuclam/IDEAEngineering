// Actual headed Chrome against the packaged application. No HAR/trace/storageState or raw errors.
import assert from 'node:assert/strict';
import { randomBytes, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const [moduleRoot, id] = process.argv.slice(2);
assert.match(id ?? '', /^[a-f0-9]{32}$/);
const approved = join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
assert.equal(resolve(moduleRoot ?? ''), resolve(approved));
assert.equal(JSON.parse(readFileSync(join(moduleRoot, 'package.json'))).version, '1.62.1');
for (const [file, expected] of Object.entries({
  LICENSE: '45873d00a0dd243596deb4aa23b2493b3d1f0671921bf2538ea431d7380220eb',
  NOTICE: '6d602191187b35b9b01d2cffa01c8469c2c8d9de8a96f1bf868e0f264f51c81d',
  'ThirdPartyNotices.txt': 'b17ac0bd6f4b8207e440639cc8e0ba1bf1d9eaf9b12236764ab93b346c7abd8e',
})) assert.equal(createHash('sha256').update(readFileSync(join(moduleRoot, file))).digest('hex'), expected);
const core = join(moduleRoot, '../playwright-core');
assert.equal(JSON.parse(readFileSync(join(core, 'package.json'))).version, '1.62.1');
for (const [file, expected] of Object.entries({
  'lib/coreBundle.js': '9393fa79e1c67c74edc26b610d65a4f7ed73d345a762465cc88340a33a2454ac',
  'lib/utilsBundle.js': '580f571bf063e2256b51b3946a035bc452fc0e22808d5547b198baea39923a32',
  'lib/utilsBundle.js.LICENSE': '57945338cba4878e373646733528017fbe3db1503ec2b431fd30d2a390c70c33',
})) assert.equal(createHash('sha256').update(readFileSync(join(core, file))).digest('hex'), expected);
const { chromium } = await import(pathToFileURL(join(moduleRoot, 'index.mjs')).href);
const origin = 'https://localhost:18445';
const identity = '/api/v1/identity/';
const remote = `/home/phuclam/idea-devaccess-browser-${id}`;
const key = join(homedir(), '.ssh/idea_ddm_dev_ed25519');
const ssh = ['-i', key, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=10'];
let browser, tunnel, page, prepared = false, password = randomBytes(24).toString('hex');
let current = 'ENVIRONMENT', oracle = 'Prerequisites';
const results = [], statuses = [], observations = [], secrets = new Set([password]);
let csrf = null, csrfSubmitted = false, actorSent = false, diagnosticLeak = false;
let requestMethodFailure = false;
const check = (condition, label) => { oracle = label; assert.ok(Boolean(condition), label); };
const fixture = (action, input) => {
  const result = spawnSync('ssh', [...ssh, 'phuclam@192.168.137.33', `bash ${remote}/swagger-browser-fixture.sh ${action} ${id}`],
    { input, encoding: 'utf8', timeout: 60000, windowsHide: true, maxBuffer: 1024 * 1024 });
  if (action === 'prepare' && result.stdout?.includes('SWAGGER_SCHEMA_CREATED=YES')) prepared = true;
  check(result.status === 0, `Owned fixture ${action}`);
  return result.stdout;
};
const test = async (name, action) => { current = name; await action(); results.push({ case: name, result: 'PASS' }); console.log(`${name}=PASS`); };

async function noSecrets(page, context) {
  await Promise.all(observations);
  for (const cookie of await context.cookies(origin)) secrets.add(cookie.value);
  const snapshot = await page.evaluate(() => ({ text: document.body.innerText, markup: document.body.innerHTML,
    url: location.href, local: Object.values(localStorage), session: Object.values(sessionStorage), cookie: document.cookie,
    passwordsEmpty: [...document.querySelectorAll('input[type=password]')].every(input => input.value === '') }));
  check(snapshot.passwordsEmpty && snapshot.local.length === 0 && snapshot.session.length === 0,
    'No retained credential or alternative browser authentication storage');
  check(!snapshot.cookie.includes('IDEA_SESSION='), 'Ordinary cookie is not JavaScript readable');
  check(![...secrets].some(value => value && JSON.stringify(snapshot).includes(value)), 'No password/cookie/CSRF in DOM URL or storage');
  check(!diagnosticLeak && !actorSent, 'No diagnostic secret or authoritative outbound ActorId');
}
async function operation(page, id) {
  oracle = `${id} resolved operation`;
  const block = page.locator(`#operations-default-${id}`);
  if (!await block.locator('.opblock-body').isVisible()) await block.locator('.opblock-summary').click();
  await block.locator('.opblock-body').waitFor({ state: 'visible' });
  // Expansion resolves the operation asynchronously; don't treat its loading placeholder
  // as proof that Try out is absent or that an Execute control is already available.
  await block.getByRole('heading', { name: 'Responses', exact: true }).first().waitFor();
  return block;
}
async function execute(page, id, path, expected) {
  const block = await operation(page, id);
  if (await block.getByRole('button', { name: 'Cancel', exact: true }).count() === 0)
    await block.getByRole('button', { name: 'Try it out', exact: true }).click();
  // Attach rejection handling immediately, while a locator click may itself be pending.
  const response = page.waitForResponse(value => new URL(value.url()).pathname === path)
    .then(value => ({ value }), () => ({ value: null }));
  oracle = `${id} Execute button`;
  await block.getByRole('button', { name: 'Execute', exact: true }).click();
  const observed = (await response).value;
  check(observed?.status() === expected, `${id} HTTP ${expected}`);
  oracle = `${id} visible response status`;
  await block.locator('.responses-inner .response-col_status').filter({ hasText: String(expected) }).first().waitFor();
  return block;
}
try {
  fixture('prepare', password); prepared = true;
  fixture('start');
  tunnel = spawn('ssh', [...ssh, '-o', 'ExitOnForwardFailure=yes', '-N', '-L', '127.0.0.1:18445:127.0.0.1:18445', 'phuclam@192.168.137.33'],
    { stdio: 'ignore', windowsHide: true });
  browser = await chromium.launch({ channel: 'chrome', headless: false });
  const context = await browser.newContext();
  page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('console', message => {
    requestMethodFailure ||= message.text().includes('toUpperCase');
    diagnosticLeak ||= [...secrets].some(value => value && message.text().includes(value));
  });
  page.on('pageerror', failure => {
    requestMethodFailure ||= failure.message.includes('toUpperCase');
    diagnosticLeak ||= [...secrets].some(value => value && failure.message.includes(value));
  });
  page.on('response', response => {
    if (new URL(response.url()).origin !== origin) return;
    statuses.push({ path: new URL(response.url()).pathname, status: response.status() });
    if (new URL(response.url()).pathname === `${identity}csrf` && response.ok()) {
      const observation = response.json().then(value => { csrf = value; secrets.add(value.token); });
      observations.push(observation);
    }
  });
  page.on('request', request => {
    if (new URL(request.url()).origin !== origin) { actorSent = true; return; }
    if (!new URL(request.url()).pathname.startsWith(identity)) return;
    actorSent ||= /actor[-_]?id/i.test(request.postData() ?? '') || /actor[-_]?id/i.test(new URL(request.url()).search);
    // The preceding CSRF response body may still be resolving when request fires.
    const precedingObservations = observations.slice();
    observations.push(Promise.all(precedingObservations).then(() => request.allHeaders()).then(headers => {
      actorSent ||= Object.entries(headers).some(([name, value]) => /actor[-_]?id/i.test(name) || /actor[-_]?id/i.test(value));
      const token = csrf;
      if (new URL(request.url()).pathname === `${identity}logout` && token)
        csrfSubmitted ||= headers[token.headerName.toLowerCase()] === token.token;
    }));
  });
  let ready = false;
  for (let attempt = 0; attempt < 20; attempt++) {
    try { const response = await page.goto(`${origin}/health`); ready = response?.ok() ?? false; }
    catch { /* Startup connectivity is not a UI RED; trust failure never bypassed. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  check(ready, 'Trusted HTTPS fixture prerequisite');
  await test('S01-anonymous-documentation', async () => {
    // Chrome may represent an empty 401 navigation as an error page. Observe the actual
    // browser network response, not a successful document-navigation prerequisite.
    const anonymousPage = await context.newPage();
    try {
      const refused = anonymousPage.waitForResponse(response => new URL(response.url()).pathname === '/dev-api/');
      await anonymousPage.goto(`${origin}/dev-api/`).catch(() => {});
      check((await refused).status() === 401, 'Anonymous documentation refused');
    } finally { await anonymousPage.close(); }
  });
  current = 'LOGIN-PREREQUISITE'; oracle = 'Existing Web navigation';
  await page.goto(origin);
  oracle = 'Existing Web anonymous state';
  await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
  oracle = 'Existing Web login control';
  await page.getByLabel('Login', { exact: true }).fill(`swagger.synthetic.${id}`);
  oracle = 'Existing Web password control';
  await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
  const login = page.waitForResponse(response => new URL(response.url()).pathname === `${identity}login`);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  check((await login).status() === 200, 'Existing IDEA Web sign-in prerequisite');
  await page.getByTestId('session-actor').waitFor();
  await noSecrets(page, context);
  await test('S02-actual-swagger', async () => {
    check((await page.goto(`${origin}/dev-api/`)).status() === 200, 'Actual application-served UI');
    await page.locator('#swagger-ui .opblock').first().waitFor();
    check((await page.getByRole('button', { name: /authorize/i }).count()) === 0, 'No cookie paste or alternative authorization input');
    const assetStatuses = await page.evaluate(async () => {
      const paths = [
        '/dev-api/assets/swagger-ui.css',
        '/dev-api/assets/swagger-ui-bundle.js',
        '/dev-api/assets/unknown.js',
        '/webjars/swagger-ui/5.32.14/swagger-ui.css',
        '/webjars/swagger-ui/5.32.14/swagger-ui-bundle.js',
      ];
      const results = [];
      for (const path of paths) results.push({ path, status: (await fetch(path, { credentials: 'same-origin' })).status });
      return results;
    });
    check(assetStatuses[0].status === 200 && assetStatuses[1].status === 200
      && assetStatuses[2].status === 404 && assetStatuses[3].status === 404
      && assetStatuses[4].status === 404, 'Authenticated browser can use only allowlisted Swagger assets');
    await noSecrets(page, context);
  });
  await test('S03-sensitive-documentation-only', async () => {
    for (const name of ['csrfAcquisition', 'nativeSignIn', 'issueCredentialProof', 'redeemCredentialProof']) {
      const block = await operation(page, name);
      check(await block.getByRole('button', { name: 'Try it out', exact: true }).count() === 0, 'Sensitive operation has no interactive submission');
    }
  });
  await test('S04-session-read', async () => { await execute(page, 'currentSession', `${identity}session`, 200); await noSecrets(page, context); });
  await test('S05-invalid-csrf', async () => {
    await page.route(`${origin}${identity}logout`, route => route.continue({ headers: { ...route.request().headers(), 'x-csrf-token': 'synthetic-invalid-csrf' } }));
    await execute(page, 'signOut', `${identity}logout`, 403);
    await page.unroute(`${origin}${identity}logout`);
    await execute(page, 'currentSession', `${identity}session`, 200);
    await noSecrets(page, context);
  });
  await test('S06-eligible-logout', async () => {
    csrfSubmitted = false;
    await execute(page, 'signOut', `${identity}logout`, 204);
    await Promise.all(observations); check(csrfSubmitted, 'Swagger automatically submits current Server-named CSRF');
    await noSecrets(page, context);
  });
  await test('S07-anonymous-try-out', async () => { await execute(page, 'currentSession', `${identity}session`, 401); await noSecrets(page, context); });
  console.log(JSON.stringify({ result: 'PASS', browser: browser.version(), applicationSource: 'daa8c10304db5f61184c285d1735af3d2c0b491d',
    jarSha256: '48fe98659db3c075b771a90fd0f4fc61f79a01c01cc941114db9a5299a685bde', results, statuses,
    csrfSubmitted, authoritativeActorSent: actorSent, diagnosticLeak }));
} catch (failure) {
  // Fixed classification only; raw locator/transport diagnostics can contain submitted data.
  const message = String(failure?.message ?? '');
  const classification = message.includes('interrupted by another navigation') ? 'NAVIGATION_INTERRUPTED'
    : message.includes('ERR_HTTP_RESPONSE_CODE_FAILURE') ? 'HTTP_NAVIGATION_REFUSAL'
    : message.includes('ERR_CERT') ? 'TLS_TRUST' : message.includes('ERR_CONNECTION') ? 'CONNECTIVITY'
    : message.includes('strict mode violation') ? 'AMBIGUOUS_LOCATOR'
    : message.includes('Timeout') ? 'OBSERVATION_TIMEOUT' : failure?.name === 'AssertionError' ? 'ORACLE_REFUSAL' : 'HARNESS_ERROR';
  const loadingProbe = page ? await page.evaluate(() => ({ swaggerGlobal: typeof SwaggerUIBundle,
    methodFailure: document.body.innerText.includes('toUpperCase'), definitionFailure: document.body.innerText.includes('Failed to load API definition'),
    interceptorRefusal: document.body.innerText.includes('API credential/CSRF'), operations: document.querySelectorAll('.opblock').length })).catch(() => null) : null;
  console.log(JSON.stringify({ result: 'FAIL_OR_BLOCKED', case: current, oracle, classification, requestMethodFailure, loadingProbe,
    completed: results, statuses })); process.exitCode = 1;
} finally {
  password = ''; secrets.clear(); csrf = null;
  try { if (browser) await browser.close(); } catch { console.log('BROWSER_CLEANUP=BLOCKED'); process.exitCode = 1; }
  try {
    if (tunnel && tunnel.exitCode === null) {
      const stopped = new Promise(resolve => tunnel.once('exit', resolve)); tunnel.kill();
      await Promise.race([stopped, new Promise((_, reject) => setTimeout(() => reject(new Error('cleanup')), 5000))]);
    }
  } catch { console.log('TUNNEL_CLEANUP=BLOCKED'); process.exitCode = 1; }
  if (prepared) {
    try { check(fixture('cleanup').includes('SWAGGER_SCHEMA_REMOVED=YES'), 'Owned JVM stopped before exact fixture removal'); console.log('CLEANUP=PASS'); }
    catch { console.log('FIXTURE_CLEANUP=BLOCKED'); process.exitCode = 1; }
  }
}
