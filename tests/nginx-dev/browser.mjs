import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const origin = 'https://localhost:18448';
const root = '/home/phuclam/idea-nginx-dev-20261008-49';
const fixtureRoot = '/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44';
const launcher = fileURLToPath(new URL('../../deploy/development/nginx/launch.ps1', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const predecessorSockets = 'ss -H -ltnp "sport = :18444 or sport = :18446 or sport = :5173"';
const predecessorForward = 'C:/Users/TD-999/.codex/iam-ui-46/dev-forward.json';
const predecessorLauncher = fileURLToPath(new URL('../../tools/iam-ui-dev/launch.ps1', import.meta.url));
const ssh = ['-i', 'C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=8', 'phuclam@192.168.137.33'];
const secrets = new Set();
let browser, fixture, stage = 'preflight', leaked = false;
function remote(command) {
  const r = spawnSync('C:/Windows/System32/OpenSSH/ssh.exe', [...ssh, command], { encoding: 'utf8', windowsHide: true, timeout: 30000 });
  assert.ok(r.status === 0, 'Controlled remote check failed');
  return r.stdout;
}
function control(action) {
  const r = spawnSync('powershell.exe', ['-NoProfile', '-File', launcher, '-Action', action], { encoding: 'utf8', windowsHide: true, timeout: 45000 });
  assert.ok(r.status === 0, 'Owned launcher action failed');
  return r.stdout;
}
function preservedSockets() {
  return remote(predecessorSockets).trim().split('\n').map(line => ({ address: line.trim().split(/\s+/)[3], pids: [...line.matchAll(/pid=(\d+)/g)].map(m => m[1]).sort() })).sort((a, b) => a.address.localeCompare(b.address));
}
function preservedForward() {
  const r = spawnSync('powershell.exe', ['-NoProfile', '-File', predecessorLauncher, '-Action', 'Status'], { encoding: 'utf8', windowsHide: true, timeout: 30000 });
  const status = r.stdout.match(/IAM_DEV_FORWARD=(RUNNING|STOPPED)/)?.[1];
  assert.ok(r.status === 0 && status, 'Predecessor owned forward status resolves');
  // Preserve the state actually found, including a predecessor already stopped
  // by its owner. This slice must neither restart it nor require it to be live.
  return { status, record: existsSync(predecessorForward) ? readFileSync(predecessorForward, 'utf8') : null };
}
function request(ca, headers = {}, servername = 'localhost') {
  return new Promise((resolve, reject) => {
    const r = https.get({ hostname: '127.0.0.1', port: 18448, path: '/health/database', servername, ca,
      headers: { Host: 'localhost:18448', ...headers }, rejectUnauthorized: true, timeout: 5000 }, res => {
      let body = '';
      const socket = res.socket;
      const tls = { protocol: socket.getProtocol(), cipher: socket.getCipher().name, fingerprint: socket.getPeerCertificate().fingerprint256 };
      res.setEncoding('utf8'); res.on('data', bytes => { body += bytes; });
      res.on('end', () => resolve({ status: res.statusCode, body, tls }));
    });
    r.on('error', reject); r.on('timeout', () => r.destroy(new Error('Probe timeout')));
  });
}
async function login(page) {
  stage = 'login-form';
  await page.goto(origin);
  await page.getByRole('form', { name: 'Đăng nhập', exact: true }).waitFor();
  await page.locator('[name=username]').fill(fixture.adminLogin);
  await page.locator('[name=password]').fill(fixture.adminPassword);
  const response = page.waitForResponse(r => new URL(r.url()).pathname === '/api/v1/identity/login' && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  const status = (await response).status();
  console.log('NGINX_UI_LOGIN_HTTP=' + status);
  stage = 'login-response';
  assert.ok(status === 200, 'UI sign-in must succeed');
  stage = 'login-server-actor';
  await page.getByTestId('session-actor').waitFor();
  const actor = await page.evaluate(async () => (await (await fetch('/api/v1/identity/session')).json()).actorId);
  assert.ok(actor === fixture.adminActorId, 'Server-established stable Actor');
}
async function execute(page, id, path, expected) {
  const block = page.locator('#operations-default-' + id);
  if (!await block.locator('.opblock-body').isVisible()) await block.locator('.opblock-summary').click();
  await block.getByRole('heading', { name: 'Responses', exact: true }).first().waitFor();
  if (!await block.getByRole('button', { name: 'Cancel', exact: true }).count())
    await block.getByRole('button', { name: 'Try it out', exact: true }).click();
  const response = page.waitForResponse(r => new URL(r.url()).pathname === path && r.request().method() === (id === 'signOut' ? 'POST' : 'GET'));
  await block.getByRole('button', { name: 'Execute', exact: true }).click();
  assert.ok((await response).status() === expected, 'Swagger response status');
}
async function privateState(page, context) {
  for (const c of await context.cookies(origin)) secrets.add(c.value);
  const retained = await page.evaluate(() => ({ text: document.body.innerText, markup: document.body.innerHTML, url: location.href,
    local: Object.values(localStorage), session: Object.values(sessionStorage), cookie: document.cookie,
    empty: [...document.querySelectorAll('input[type=password]')].every(input => input.value === '') }));
  assert.ok(retained.empty && !retained.cookie.includes('IDEA_SESSION='), 'Password cleared; cookie unreadable');
  assert.ok(![...secrets].some(secret => secret && JSON.stringify(retained).includes(secret)) && !leaked, 'No retained secret');
}
try {
  assert.equal(process.version, 'v24.19.0');
  assert.equal(sha(readFileSync(process.execPath)), '3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237');
  assert.equal(sha(readFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe')), 'd3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c');
  const base = 'C:/Users/TD-999/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
  for (const name of ['playwright', 'playwright-core']) {
    assert.equal(JSON.parse(readFileSync(base + name + '/package.json')).version, '1.62.1');
    assert.equal(sha(readFileSync(base + name + '/LICENSE')), '45873d00a0dd243596deb4aa23b2493b3d1f0671921bf2538ea431d7380220eb');
    assert.equal(sha(readFileSync(base + name + '/NOTICE')), '6d602191187b35b9b01d2cffa01c8469c2c8d9de8a96f1bf868e0f264f51c81d');
  }
  const predecessor = preservedSockets();
  const oldForward = preservedForward();
  assert.ok(control('Start').includes('NGINX_ENTRY=READY'));
  const certificate = remote(`cat ${root}/tls/certificate.pem`);
  fixture = JSON.parse(remote(`test "$(stat -c '%U:%a' ${fixtureRoot}/fixture.private.json)" = phuclam:600 && cat ${fixtureRoot}/fixture.private.json`));
  assert.ok(fixture.source === '9d3732cb173e8094195b9bdd60b5588ac3cfa42e');
  for (const name of ['adminPassword', 'memberPassword', 'ordinaryPassword']) secrets.add(fixture[name]);
  stage = 'tls';
  const positive = await request(certificate);
  assert.equal(positive.status, 200); assert.deepEqual(JSON.parse(positive.body), { status: 'UP' });
  assert.ok(positive.tls.fingerprint.replaceAll(':', '').toLowerCase() === '6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad');
  await assert.rejects(request([]), e => ['DEPTH_ZERO_SELF_SIGNED_CERT', 'SELF_SIGNED_CERT_IN_CHAIN', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'].includes(e.code));
  await assert.rejects(request(certificate, {}, 'wrong.invalid'), e => e.code === 'ERR_TLS_CERT_ALTNAME_INVALID');
  console.log('N01_TLS_TRUST_ENDPOINT_NEGATIVES=PASS;PROTOCOL=' + positive.tls.protocol + ';CIPHER=' + positive.tls.cipher);
  const { chromium } = createRequire(import.meta.url)(base + 'playwright');
  browser = await chromium.launch({ channel: 'chrome', headless: false });
  assert.equal(browser.version(), '155.0.8059.39');
  const context = await browser.newContext(); const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('console', m => { leaked ||= [...secrets].some(s => s && m.text().includes(s)); });
  page.on('pageerror', e => { leaked ||= [...secrets].some(s => s && e.message.includes(s)); });
  page.on('request', r => { leaked ||= [...secrets].some(s => s && r.url().includes(s)); });
  page.on('response', r => { if (new URL(r.url()).pathname === '/api/v1/identity/csrf' && r.ok()) r.json().then(x => secrets.add(x.token)).catch(() => {}); });
  stage = 'anonymous-packaged-web';
  await page.goto(origin);
  const anonymous = await page.evaluate(async () => ({ session: (await fetch('/api/v1/identity/session')).status,
    docs: (await fetch('/dev-api/')).status, vite: document.documentElement.innerHTML.includes('/@vite/client') }));
  assert.deepEqual(anonymous, { session: 401, docs: 401, vite: false });
  await page.getByRole('form', { name: 'Đăng nhập', exact: true }).waitFor();
  console.log('N02_ACTUAL_PACKAGED_WEB_ANONYMOUS=PASS');
  stage = 'login-context-cookie'; await login(page);
  stage = 'cookie-profile';
  const cookie = (await context.cookies(origin)).find(c => c.name === 'IDEA_SESSION');
  assert.ok(cookie && cookie.secure && cookie.httpOnly && cookie.sameSite === 'Strict' && cookie.domain === 'localhost');
  secrets.add(cookie.value);
  stage = 'context-account-reads';
  const reads = await page.evaluate(async () => {
    const current = await fetch('/api/v1/administration/context');
    const context = await current.json();
    return { context: current.status, accountRead: context.actions.includes('account.read'),
      accounts: (await fetch('/api/v1/administration/accounts?offset=0&limit=50')).status };
  });
  console.log('NGINX_CONTEXT_HTTP=' + reads.context + ';ACCOUNTS_HTTP=' + reads.accounts + ';ACCOUNT_READ_ADMITTED=' + reads.accountRead);
  // The retained human-review fixture can change legitimately. Preserve its current
  // authority: never seed/grant roles to satisfy a proxy test's stale fixture assumption.
  assert.equal(reads.context, 200);
  assert.equal(reads.accounts, reads.accountRead ? 200 : 403);
  if (!reads.accountRead) {
    await page.goto(origin + '/#accounts');
    await page.getByText('Không có quyền đọc danh sách Account. Không suy quyền từ tên vai trò.', { exact: true }).waitFor();
  }
  stage = 'post-login-private-state'; await privateState(page, context);
  console.log('N03_UI_LOGIN_ACTOR_CONTEXT_COOKIE=PASS');
  stage = 'origin-csrf';
  assert.equal((await request(certificate, { Host: 'attacker.invalid' })).status, 400);
  assert.equal((await request(certificate, { Origin: 'https://attacker.invalid', 'X-Forwarded-Host': 'localhost:18448' })).status, 403);
  const badCsrf = await page.evaluate(async () => (await fetch('/api/v1/identity/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': 'synthetic-invalid' } })).status);
  assert.equal(badCsrf, 403);
  assert.equal(await page.evaluate(async () => (await fetch('/api/v1/identity/session')).status), 200);
  console.log('N04_HOST_ORIGIN_BAD_CSRF_REFUSAL=PASS');
  stage = 'swagger'; await page.goto(origin + '/dev-api/');
  await page.locator('#swagger-ui .opblock').first().waitFor();
  const assets = await page.evaluate(async () => {
    const statuses = [];
    for (const p of ['/dev-api/assets/swagger-ui.css', '/dev-api/assets/swagger-ui-bundle.js', '/dev-api/assets/unknown.js', '/webjars/swagger-ui/5.32.14/swagger-ui.css']) statuses.push((await fetch(p)).status);
    return statuses;
  });
  assert.deepEqual(assets, [200, 200, 404, 404]);
  await execute(page, 'currentSession', '/api/v1/identity/session', 200);
  await execute(page, 'signOut', '/api/v1/identity/logout', 204);
  await execute(page, 'currentSession', '/api/v1/identity/session', 401);
  await privateState(page, context);
  console.log('N05_SWAGGER_ALLOWLIST_SESSION_LOGOUT=PASS');
  stage = 'restart'; await login(page);
  const stopped = control('Stop'); assert.ok(stopped.includes('NGINX_DEV_STATE=STOPPED'));
  assert.ok(control('Status').includes('NGINX_DEV_STATE=STOPPED'));
  assert.ok(control('Start').includes('NGINX_ENTRY=READY'));
  assert.equal(await page.evaluate(async () => (await fetch('/api/v1/identity/session')).status), 401);
  await login(page); await privateState(page, context);
  console.log('N06_OWNED_RESTART_DATA_STABLE_ACTOR_OLD_SESSION_REFUSED=PASS');
  stage = 'scope';
  const sockets = remote('ss -H -ltn "sport = :18448 or sport = :18449"');
  // ss's peer column is normally wildcard even when the LOCAL bind is loopback.
  const localBindings = sockets.trim().split('\n').map(line => line.trim().split(/\s+/)[3]).sort();
  assert.deepEqual(localBindings, ['127.0.0.1:18448', '127.0.0.1:18449']);
  assert.deepEqual(preservedSockets(), predecessor);
  assert.deepEqual(preservedForward(), oldForward);
  assert.ok(control('Status').includes('POSTGRESQL=UP'));
  console.log('N07_LOOPBACK_OWNERSHIP_PREDECESSOR_RETAINED=PASS');
  stage = 'privacy';
  const token = await page.evaluate(async () => (await (await fetch('/api/v1/identity/csrf')).json()).token); secrets.add(token);
  assert.equal(await page.evaluate(async t => (await fetch('/api/v1/identity/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': t } })).status, token), 204);
  await privateState(page, context);
  console.log('N08_PRIVATE_STATE_NO_SECRET_RETENTION=PASS');
  stage = 'upstream-tls-refusals';
  const upstream = remote('bash /home/phuclam/idea-nginx-dev-control-49/upstream.test.sh');
  assert.ok(upstream.includes('NGINX_UPSTREAM_wrong-name=PASS') && upstream.includes('NGINX_UPSTREAM_untrusted=PASS'));
  assert.ok(control('Status').includes('NGINX_DEV_STATE=RUNNING'));
  assert.equal((await request(certificate)).status, 200);
  assert.deepEqual(preservedSockets(), predecessor);
  assert.deepEqual(preservedForward(), oldForward);
  console.log('N09_UPSTREAM_TLS_REFUSALS_AND_RESTORATION=PASS');
  console.log('NGINX_DEV_BROWSER=9/9_PASS;APPLICATION_SOURCE=9d3732cb173e8094195b9bdd60b5588ac3cfa42e;DEPLOYMENT_ONLY=true');
} catch {
  console.error('NGINX_DEV_BROWSER=STOP;STAGE=' + stage + ';NO_SECRET_DIAGNOSTICS=true'); process.exitCode = 1;
} finally {
  if (browser) await browser.close(); fixture = undefined; secrets.clear();
}
