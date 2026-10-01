// Approved external qualification: installed headed Chrome + admitted bundled Playwright.
// No HAR/trace/screenshot/storageState, request body, cookie, password, or raw error output.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const [moduleRoot, runId] = process.argv.slice(2);
const approvedRoot = join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
assert.equal(resolve(moduleRoot ?? ''), resolve(approvedRoot), 'Use the admitted bundled Playwright source');
assert.match(runId ?? '', /^[a-f0-9]{32}$/, 'Use a new UUID-owned fixture');
assert.equal(JSON.parse(readFileSync(join(moduleRoot, 'package.json'))).version, '1.62.1');
const { chromium } = await import(pathToFileURL(join(moduleRoot, 'index.mjs')).href);
const remoteRoot = `/home/phuclam/idea-t043-browser-${runId}`;
const origin = 'https://127.0.0.1:18444';
const identity = '/api/v1/identity/';
const key = join(homedir(), '.ssh/idea_ddm_dev_ed25519');
const sshArguments = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-i', key, 'phuclam@192.168.137.33'];
const fixture = (action, input) => {
  const result = spawnSync('ssh', [...sshArguments, `bash ${remoteRoot}/run-browser-fixture.sh ${action} ${runId}`],
    { input, encoding: 'utf8', windowsHide: true, timeout: 60000, maxBuffer: 1024 * 1024 });
  if (action === 'prepare' && result.stdout?.includes('T043_OWNED_SCHEMA_CREATED=YES')) prepared = true;
  // stdout/stderr are never included in assertion diagnostics.
  assert.equal(result.status, 0, `Owned fixture ${action} must succeed`);
  return result.stdout;
};
let lastOracle = 'Environment setup';
const check = (condition, safeLabel) => { lastOracle = safeLabel; assert.ok(Boolean(condition), safeLabel); };
const results = [];
const statuses = [];
const assetStatuses = [];
const shellStatuses = [];
let password = randomBytes(24).toString('hex');
let browser, tunnel, prepared = false;
let currentCase = 'ENVIRONMENT';
let fixtureData;
let csrf = null;
let anonymousCookie = null;
const secretNeedles = new Set([password]);
let observedSecretLeak = false;
let outboundActor = false;
let loginRequests = 0;
let loginCsrfMatched = false;
let acceptedCookieProperties = false;
let serverActor = null;
const pendingObservations = [];

async function recordResponse(response) {
  const url = new URL(response.url());
  if (url.origin === origin && url.pathname === '/') shellStatuses.push(response.status());
  if (url.pathname.startsWith('/assets/')) assetStatuses.push(response.status());
  if (url.pathname.startsWith(identity)) statuses.push({ path: url.pathname.slice(identity.length), status: response.status() });
  if (url.pathname === `${identity}session` && response.ok()) serverActor = (await response.json()).actorId;
  if (url.pathname === `${identity}csrf` && response.ok()) {
    csrf = await response.json();
    secretNeedles.add(csrf.token);
  }
  if (url.pathname === `${identity}login` && response.ok()) {
    const cookies = (await response.headersArray()).filter(header => header.name.toLowerCase() === 'set-cookie');
    const session = cookies.find(header => header.value.startsWith('IDEA_SESSION='));
    if (session) {
      const attributes = session.value.split(';').slice(1).map(part => part.trim().toLowerCase());
      acceptedCookieProperties = attributes.includes('secure') && attributes.includes('httponly')
        && attributes.includes('samesite=strict') && !attributes.some(part => part.startsWith('domain='));
    }
  }
}

async function secretCheck(page) {
  await Promise.all(pendingObservations);
  const snapshot = await page.evaluate(() => ({
    text: document.body.innerText,
    markup: document.body.innerHTML,
    url: location.href,
    local: Object.values(localStorage),
    session: Object.values(sessionStorage),
    cookieReadable: document.cookie.split(';').some(part => part.trim().startsWith('IDEA_SESSION=')),
    passwordEmpty: [...document.querySelectorAll('input[type=password]')].every(input => input.value === ''),
  }));
  check(!snapshot.cookieReadable, 'Session cookie must not be page-JavaScript-readable');
  check(snapshot.passwordEmpty, 'Password control must be clear after completed submission/remount');
  check(snapshot.local.length === 0 && snapshot.session.length === 0, 'No browser-storage authentication or credential state');
  const text = JSON.stringify(snapshot);
  check(![...secretNeedles].some(secret => secret && text.includes(secret)), 'No secret in DOM/URL/storage snapshot');
  check(!observedSecretLeak && !outboundActor, 'No diagnostic secret or outbound authoritative ActorId');
}

async function responseAfter(page, path, action, expected) {
  const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === `${identity}${path}`);
  await action();
  const response = await responsePromise;
  check(response.status() === expected, `${currentCase}: expected HTTP ${expected}`);
  return response;
}

async function signIn(page, submitted = password, expected = 200) {
  await page.getByLabel('Login', { exact: true }).fill(fixtureData.login);
  await page.getByLabel('Mật khẩu', { exact: true }).fill(submitted);
  secretNeedles.add(submitted);
  const response = await responseAfter(page, 'login', () => page.getByRole('button', { name: 'Đăng nhập', exact: true }).click(), expected);
  if (expected === 200) {
    await page.getByTestId('session-actor').waitFor();
    await Promise.all(pendingObservations);
    check(serverActor === fixtureData.actorId
      && (await page.getByTestId('session-actor').innerText()) === `Actor: ${serverActor}`, 'UI identity must be the Server response');
  } else {
    await page.getByRole('status').filter({ hasText: 'Đăng nhập bị từ chối' }).waitFor();
    check(await page.getByTestId('session-actor').count() === 0, 'Refused sign-in is never authenticated success');
  }
  await secretCheck(page);
  return response;
}

async function caseRun(id, behavior) {
  currentCase = id;
  await behavior();
  results.push({ case: id, result: 'PASS' });
  console.log(`${id}=PASS`);
}

try {
  const output = fixture('prepare', password);
  prepared = true;
  fixtureData = JSON.parse(output.trim().split(/\r?\n/).findLast(line => line.startsWith('{"schema":')));
  fixture('start');
  tunnel = spawn('ssh', ['-o', 'BatchMode=yes', '-o', 'ExitOnForwardFailure=yes', '-o', 'ServerAliveInterval=15',
    '-i', key, '-N', '-L', '127.0.0.1:18444:127.0.0.1:18444', 'phuclam@192.168.137.33'],
    { stdio: 'ignore', windowsHide: true });
  browser = await chromium.launch({ channel: 'chrome', headless: false });
  const context = await browser.newContext(); // normal certificate validation; no TLS/error overrides
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('response', response => {
    const observation = recordResponse(response);
    pendingObservations.push(observation);
    observation.catch(() => { observedSecretLeak = true; });
  });
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== origin || !url.pathname.startsWith(identity)) return;
    const body = request.postData() ?? '';
    outboundActor ||= /actor_?id/i.test(body) || /actor_?id/i.test(url.search);
    const headerObservation = request.allHeaders().then(headers => {
      outboundActor ||= Object.keys(headers).some(name => /actor[-_]?id/i.test(name));
    });
    pendingObservations.push(headerObservation);
    if (url.pathname === `${identity}login`) {
      loginRequests++;
      const submittedCsrf = csrf;
      const observation = request.allHeaders().then(headers => {
        loginCsrfMatched = submittedCsrf !== null && headers[submittedCsrf.headerName.toLowerCase()] === submittedCsrf.token;
      });
      pendingObservations.push(observation);
    }
  });
  page.on('console', message => {
    const text = message.text();
    observedSecretLeak ||= [...secretNeedles].some(secret => secret && text.includes(secret));
  });
  page.on('pageerror', error => {
    observedSecretLeak ||= [...secretNeedles].some(secret => secret && error.message.includes(secret));
  });
  // Readiness retries are environment setup, never a behavioral RED or result.
  let ready = false;
  for (let attempt = 0; attempt < 25; attempt++) {
    try { await page.goto(origin); ready = true; break; }
    catch { await new Promise(resolve => setTimeout(resolve, 400)); }
  }
  check(ready, 'Trusted actual Chrome/HTTPS environment must be available');
  await caseRun('W01', async () => {
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    check(await page.getByTestId('idea-web-app').count() === 1, 'Actual React shell renders');
    check(shellStatuses.length > 0 && shellStatuses.every(status => status === 200), 'Chrome received actual Server shell 200');
    check(statuses.some(row => row.path === 'session' && row.status === 401), 'Actual anonymous protected request is 401');
    const assets = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(script => script.src));
    check(assets.length > 0 && assets.every(asset => new URL(asset).origin === origin), 'Same-origin built React assets');
    check(assetStatuses.length > 0 && assetStatuses.every(status => status === 200), 'Chrome received built assets 200');
    anonymousCookie = (await context.cookies(origin)).find(cookie => cookie.name === 'IDEA_SESSION')?.value;
    check(anonymousCookie, 'Anonymous CSRF session exists for fixation oracle');
    secretNeedles.add(anonymousCookie);
    await secretCheck(page);
  });
  await caseRun('W03', async () => {
    const before = loginRequests;
    await signIn(page, randomBytes(24).toString('hex'), 401);
    await page.waitForTimeout(200); // bounded automatic-retry observation, not an expiry test
    check(loginRequests === before + 1, 'No automatic stored-credential retry');
  });
  await caseRun('W04-login', async () => {
    await page.route(`${origin}${identity}login`, route => {
      const headers = { ...route.request().headers() };
      delete headers[csrf.headerName.toLowerCase()];
      return route.continue({ headers });
    });
    await signIn(page, password, 403);
    await page.unroute(`${origin}${identity}login`);
  });
  await caseRun('W02', async () => {
    await signIn(page);
    check(loginCsrfMatched && !outboundActor, 'Actual login submits Server-named CSRF header without authoritative ActorId');
    check(statuses.some(row => row.path === 'session' && row.status === 200), 'Protected session request follows login');
  });
  await caseRun('W05', async () => {
    const cookie = (await context.cookies(origin)).find(cookie => cookie.name === 'IDEA_SESSION');
    check(cookie && cookie.secure && cookie.httpOnly && cookie.sameSite === 'Strict', 'Observed Chrome cookie flags');
    check(acceptedCookieProperties, 'Observed login Set-Cookie attributes and absent Domain');
    check(cookie.value !== anonymousCookie, 'Ordinary fixation protection rotates cookie proof');
    secretNeedles.add(cookie.value);
    await secretCheck(page);
  });
  await caseRun('W04-logout', async () => {
    await page.route(`${origin}${identity}logout`, route => {
      const headers = { ...route.request().headers(), [csrf.headerName.toLowerCase()]: 'synthetic-invalid-csrf' };
      return route.continue({ headers });
    });
    await responseAfter(page, 'logout', () => page.getByRole('button', { name: 'Đăng xuất', exact: true }).click(), 403);
    await page.getByRole('status').filter({ hasText: 'Đăng xuất bị từ chối' }).waitFor();
    check(await page.getByTestId('session-actor').count() === 1, 'Refused logout must not claim session ended');
    await page.unroute(`${origin}${identity}logout`);
    await secretCheck(page);
  });
  await caseRun('W09-eligible', async () => {
    await responseAfter(page, 'session', () => page.reload(), 200);
    await page.getByTestId('session-actor').waitFor();
    await secretCheck(page);
  });
  await caseRun('W06', async () => {
    const other = await context.newPage();
    const original = (await context.cookies(origin)).find(cookie => cookie.name === 'IDEA_SESSION');
    check(original, 'Original host cookie is established');
    let originalProofSent = false;
    other.on('request', request => {
      const observation = request.allHeaders().then(headers => {
        originalProofSent ||= (headers.cookie ?? '').includes(`IDEA_SESSION=${original.value}`);
      });
      pendingObservations.push(observation);
    });
    const responsePromise = other.waitForResponse(response => new URL(response.url()).pathname === `${identity}session`);
    await other.goto('https://localhost:18444');
    check((await responsePromise).status() === 401, 'Other trusted host has no authenticated proof');
    await other.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    await Promise.all(pendingObservations);
    const hostCookie = (await context.cookies('https://localhost:18444')).find(cookie => cookie.name === 'IDEA_SESSION');
    check(!originalProofSent && hostCookie?.value !== original.value, 'Original host-only proof not sent to localhost');
    await other.close();
  });
  await caseRun('W07', async () => {
    const previousCsrf = csrf.token;
    await responseAfter(page, 'logout', () => page.getByRole('button', { name: 'Đăng xuất', exact: true }).click(), 204);
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    check(csrf.token !== previousCsrf, 'Logout reacquires current CSRF');
    check(statuses.at(-1)?.status === 401, 'Post-logout protected request refuses');
    await responseAfter(page, 'session', () => page.reload(), 401);
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    await signIn(page);
  });
  await caseRun('W10-network', async () => {
    await page.route(`${origin}${identity}session`, route => route.abort('failed'));
    await page.reload();
    await page.getByRole('status').filter({ hasText: 'Không kết nối được IDEA Server' }).waitFor();
    check(await page.getByTestId('session-actor').count() === 0, 'Request error must not show stale authenticated success');
    await secretCheck(page);
    await page.unroute(`${origin}${identity}session`);
    await page.reload();
    await page.getByTestId('session-actor').waitFor();
    await responseAfter(page, 'logout', () => page.getByRole('button', { name: 'Đăng xuất', exact: true }).click(), 204);
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    await page.route(`${origin}${identity}login`, route => route.abort('failed'));
    await page.getByLabel('Login', { exact: true }).fill(fixtureData.login);
    await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Đăng nhập bị từ chối' }).waitFor();
    await secretCheck(page);
    await page.unroute(`${origin}${identity}login`);
    await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
    await page.reload(); // unmount/remount; no submission and no password persistence
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    await secretCheck(page);
    await signIn(page);
  });
  await caseRun('W08', async () => {
    check(fixture('disable').includes('T043_TARGET_DISABLED=YES'), 'Authorized isolated fixture disables target');
    await responseAfter(page, 'session', () => page.reload(), 401);
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    check(await page.getByTestId('session-actor').count() === 0, 'Invalidated session clears identity');
    await secretCheck(page);
  });
  await caseRun('W09-invalidated', async () => {
    await responseAfter(page, 'session', () => page.reload(), 401);
    await page.getByRole('status').filter({ hasText: 'Chưa đăng nhập' }).waitFor();
    await secretCheck(page);
  });
  console.log(JSON.stringify({ disposition: 'PASS', browser: browser.version(), schema: fixtureData.schema,
    applicationSource: '2fe89d481842f4cf26078c07d4b78fb3bdacd7c4', results,
    observed: { csrfHeader: loginCsrfMatched, cookieAttributes: acceptedCookieProperties,
      authoritativeActorSent: outboundActor, secretLeak: observedSecretLeak }, statuses }));
} catch {
  console.log(JSON.stringify({ disposition: 'FAIL_OR_BLOCKED', case: currentCase, oracle: lastOracle, completed: results }));
  process.exitCode = 1;
} finally {
  password = ''; anonymousCookie = null; csrf = null; secretNeedles.clear();
  try { if (browser) await browser.close(); }
  catch { console.log('BROWSER_CLEANUP=BLOCKED'); process.exitCode = 1; }
  try { if (tunnel) tunnel.kill(); }
  catch { console.log('TUNNEL_CLEANUP=BLOCKED'); process.exitCode = 1; }
  if (prepared) {
    try { check(fixture('cleanup').includes('T043_OWNED_SCHEMA_REMOVED=YES'), 'Exact fixture cleanup'); console.log('CLEANUP=PASS'); }
    catch { console.log('CLEANUP=BLOCKED; retain exact owned fixture for controlled follow-up'); process.exitCode = 1; }
  }
}
