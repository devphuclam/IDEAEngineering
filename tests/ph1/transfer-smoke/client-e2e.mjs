import { SecureEndpoint, uploadRanges, gatewayProgress, fileRanges } from './client-transfer.mjs';
import https from 'node:https';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// All readiness material is captured in RAM; never echo identity credentials or bearer frames.
const remote = '/home/phuclam/idea-f05a-t028-t030-20261005-37/run-receipt-green-32/source/apps/server/target/client-e2e-01';
const sshArgs = ['-i', 'C:/Users/TD-999/.ssh/idea_ddm_dev_ed25519', '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=5'];
const read = command => execFileSync('ssh', [...sshArgs, 'phuclam@192.168.137.33', command],
  { encoding: 'utf8', timeout: 15000, stdio: ['ignore', 'pipe', 'pipe'] });
const fixture = JSON.parse(read(`cat ${remote}/ready.json`));
const tunnel = spawn('ssh', [...sshArgs, '-o', 'ExitOnForwardFailure=yes', '-N',
  '-L', '127.0.0.1:18446:127.0.0.1:18446', '-L', '127.0.0.1:18447:127.0.0.1:18447',
  'phuclam@192.168.137.33'], { stdio: 'ignore' });
const root = await mkdtemp(join(tmpdir(), 'idea-f05-client-'));
const server = new SecureEndpoint('https://127.0.0.1:18446/', fixture.ca);
const gateway = new SecureEndpoint('https://127.0.0.1:18447/', fixture.ca);
const csrf = async () => {
  const response = await server.request('/api/v1/identity/csrf', { method: 'GET' });
  assert.equal(response.status, 200);
  const value = JSON.parse(response.body); return { [value.headerName]: value.token };
};
let stage = 'TLS_READY';
try {
  let ready = false;
  let lastReadyCode = 'CLIENT_READY_UNOBSERVED';
  for (let i = 0; i < 30; i++) {
    try { assert.equal((await server.request('/health', { method: 'GET' })).status, 200); ready = true; break; }
    catch (error) {
      lastReadyCode = /^CLIENT_[A-Z0-9_]+$/.test(error.message ?? '') ? error.message : 'CLIENT_HEALTH_REFUSED';
      if (tunnel.exitCode !== null) throw new Error('CLIENT_TUNNEL_REFUSED'); await new Promise(r => setTimeout(r, 200));
    }
  }
  if (!ready) throw new Error(lastReadyCode);
  stage = 'ANONYMOUS';
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 401);
  const password = Buffer.from(new URLSearchParams({ username: fixture.login, password: fixture.password }).toString());
  stage = 'LOGIN';
  try {
    assert.equal((await server.request('/api/v1/identity/login', { body: password,
      headers: { ...(await csrf()), 'Content-Type': 'application/x-www-form-urlencoded' } })).status, 200);
  } finally { password.fill(0); delete fixture.password; }
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 200);
  assert.equal((await server.request('/qualification/f05/grant?size=1024')).status, 403);
  stage = 'P05_GENERATION';
  const fixtures = join(root, 'p05-fixtures');
  execFileSync(process.execPath, [fileURLToPath(new URL('../../../tools/p05-fixtures/generate-fixtures.mjs', import.meta.url)),
    '--output-dir', fixtures], { stdio: 'pipe', timeout: 30000 });
  for (const [size, name] of [[1024, 'IE-DATA-CANONICAL-001-small-1KiB.bin'], [67108864, 'IE-DATA-CANONICAL-001-transfer-64MiB.bin']]) {
    stage = 'GRANT_' + size;
    const response = await server.request(`/qualification/f05/grant?size=${size}${size === 67108864 ? '&expired=true' : ''}`, { headers: await csrf() });
    assert.equal(response.status, 200);
    let grant = JSON.parse(response.body);
    if (size === 67108864) {
      stage = 'EXPIRED_RENEWAL';
      const expired = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame } });
      assert.equal(expired.status, 403); assert.equal(expired.body.length, 0);
      assert.equal((await server.request(`/qualification/f05/renew?size=${size}`)).status, 403);
      const renewal = await server.request(`/qualification/f05/renew?size=${size}`, { headers: await csrf() });
      assert.equal(renewal.status, 200);
      const renewed = JSON.parse(renewal.body); assert.equal(renewed.transferId, grant.transferId);
      assert.notEqual(renewed.frame, grant.frame);
      const old = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame } });
      assert.equal(old.status, 403); grant = renewed;
    }
    const same = await server.request(`/qualification/f05/grant?size=${size}`, { headers: await csrf() });
    assert.equal(same.status, 200); assert.deepEqual(JSON.parse(same.body), grant);
    const mutated = Buffer.from(grant.frame, 'base64url'); mutated[mutated.length - 1] ^= 1;
    const invalid = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': mutated.toString('base64url') } });
    assert.equal(invalid.status, 403); assert.equal(invalid.body.length, 0);
    const path = join(fixtures, name);
    const firstReader = fileRanges(path);
    let first;
    try { first = (await firstReader.next()).value; } finally { await firstReader.return(); }
    const rangeHeaders = range => ({ 'X-IDEA-Grant': grant.frame, 'X-IDEA-Range-Start': String(range.start),
      'X-IDEA-Range-End': String(range.end), 'X-IDEA-Chunk-SHA256': range.digest });
    const badBytes = Buffer.from(first.bytes); badBytes[0] ^= 1;
    const mismatch = await gateway.request('/transfer/range', { body: badBytes, headers: rangeHeaders(first) });
    assert.equal(mismatch.status, 400); assert.equal(mismatch.body.length, 0);
    const before = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame } });
    assert.equal(before.status, 200); assert.deepEqual(gatewayProgress(before.body, size), { verifiedBytes: 0, receipt: null });
    let sent = 0;
    if (size === 67108864) {
      stage = 'INTERRUPTION';
      const prefix = await gateway.request('/transfer/range', { body: first.bytes, headers: rangeHeaders(first) });
      assert.equal(prefix.status, 200); assert.deepEqual(gatewayProgress(prefix.body, size), { verifiedBytes: 1048576, receipt: null });
      const ranges = fileRanges(path); await ranges.next(); const second = (await ranges.next()).value; await ranges.return();
      await new Promise((resolve, reject) => {
        const request = https.request('https://127.0.0.1:18447/transfer/range', {
          method: 'POST', ca: fixture.ca, rejectUnauthorized: true, agent: false,
          headers: { ...rangeHeaders(second), 'Content-Length': second.bytes.length } });
        const timeout = setTimeout(() => { request.destroy(); reject(new Error('CLIENT_INTERRUPT_TIMEOUT')); }, 10000);
        request.on('error', () => {}); request.on('close', () => { clearTimeout(timeout); resolve(); });
        request.write(second.bytes.subarray(0, 131072), () => setTimeout(() => request.destroy(), 200));
      });
      const progress = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame } });
      assert.equal(progress.status, 200); assert.deepEqual(gatewayProgress(progress.body, size), { verifiedBytes: 1048576, receipt: null });
    }
    stage = 'GATEWAY_UPLOAD_' + size;
    const observed = { request: async (path, options) => {
      if (path === '/transfer/range') { sent++; if (size === 67108864 && sent === 1)
        assert.equal(options.headers['X-IDEA-Range-Start'], '1048576'); }
      return gateway.request(path, options);
    } };
    const receipt = await uploadRanges(observed, path, grant.frame, size);
    assert.equal(sent, size === 1024 ? 1 : 63);
    stage = 'GATEWAY_STATUS_' + size;
    const status = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame }, limit: 4108 });
    assert.equal(status.status, 200); assert.deepEqual(gatewayProgress(status.body, size).receipt, receipt);
    const changed = await gateway.request('/transfer/range', { body: badBytes, headers: rangeHeaders(first) });
    assert.equal(changed.status, 400);
    const retry = await gateway.request('/transfer/range', { body: first.bytes, headers: rangeHeaders(first) });
    assert.equal(retry.status, 200); assert.deepEqual(gatewayProgress(retry.body, size).receipt, receipt);
    const badReceipt = Buffer.from(receipt); badReceipt[badReceipt.length - 1] ^= 1;
    assert.notEqual((await server.request('/qualification/f05/receipt', { body: badReceipt, headers: await csrf() })).status, 200);
    for (let retry = 0; retry < 2; retry++) {
      stage = 'SERVER_ACCEPT_' + size + '_' + retry;
      const accepted = await server.request('/qualification/f05/receipt', { body: receipt, headers: await csrf() });
      assert.equal(accepted.status, 200);
      const result = JSON.parse(accepted.body); assert.equal(result.transferId, grant.transferId);
    }
    console.log(`CLIENT_ACTUAL_TRANSFER=PASS; BYTES=${size}; SAME_RECEIPT_RETRY=PASS`);
  }
  stage = 'LOGOUT';
  assert.equal((await server.request('/api/v1/identity/logout', { headers: await csrf() })).status, 204);
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 401);
  read(`test ! -e ${remote}/client-done && touch ${remote}/client-done`);
  console.log('CLIENT_E2E=PASS; TLS_BYPASS=false; SERVER_BYTE_RELAY=false');
} catch (error) {
  const code = error.code === 'ERR_ASSERTION' ? 'ASSERTION' :
    /^CLIENT_[A-Z0-9_]+$/.test(error.message ?? '') ? error.message : 'HARNESS_FAILURE';
  console.error('CLIENT_E2E=FAIL; STAGE=' + stage + '; CODE=' + code);
  try { read(`test ! -e ${remote}/client-failed && touch ${remote}/client-failed`); } catch { /* No success inferred. */ }
  process.exitCode = 1;
} finally {
  server.close(); gateway.close(); tunnel.kill(); await rm(root, { recursive: true });
}
