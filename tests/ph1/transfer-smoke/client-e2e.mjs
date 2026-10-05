import { SecureEndpoint, uploadRanges, gatewayProgress } from './client-transfer.mjs';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// All readiness material is captured in RAM; never echo identity credentials or bearer frames.
const remote = '/home/phuclam/idea-f05a-t028-t030-20261005-37/run-receipt-green-20/source/apps/server/target/client-e2e-01';
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
try {
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try { assert.equal((await server.request('/health', { method: 'GET' })).status, 200); ready = true; break; }
    catch { if (tunnel.exitCode !== null) throw new Error('CLIENT_TUNNEL_REFUSED'); await new Promise(r => setTimeout(r, 200)); }
  }
  assert.equal(ready, true);
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 401);
  const password = Buffer.from(new URLSearchParams({ username: fixture.login, password: fixture.password }).toString());
  try {
    assert.equal((await server.request('/api/v1/identity/login', { body: password,
      headers: { ...(await csrf()), 'Content-Type': 'application/x-www-form-urlencoded' } })).status, 200);
  } finally { password.fill(0); delete fixture.password; }
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 200);
  const fixtures = join(root, 'p05-fixtures');
  execFileSync(process.execPath, [fileURLToPath(new URL('../../../tools/p05-fixtures/generate-fixtures.mjs', import.meta.url)),
    '--output-dir', fixtures], { stdio: 'pipe', timeout: 30000 });
  for (const [size, name] of [[1024, 'IE-DATA-CANONICAL-001-small-1KiB.bin'], [67108864, 'IE-DATA-CANONICAL-001-transfer-64MiB.bin']]) {
    const response = await server.request(`/qualification/f05/grant?size=${size}`, { headers: await csrf() });
    assert.equal(response.status, 200);
    const grant = JSON.parse(response.body);
    const receipt = await uploadRanges(gateway, join(fixtures, name), grant.frame, size);
    const status = await gateway.request('/transfer/status', { headers: { 'X-IDEA-Grant': grant.frame }, limit: 4108 });
    assert.equal(status.status, 200); assert.deepEqual(gatewayProgress(status.body, size).receipt, receipt);
    for (let retry = 0; retry < 2; retry++) {
      const accepted = await server.request('/qualification/f05/receipt', { body: receipt, headers: await csrf() });
      assert.equal(accepted.status, 200);
      const result = JSON.parse(accepted.body); assert.equal(result.transferId, grant.transferId);
    }
    console.log(`CLIENT_ACTUAL_TRANSFER=PASS; BYTES=${size}; SAME_RECEIPT_RETRY=PASS`);
  }
  assert.equal((await server.request('/api/v1/identity/logout', { headers: await csrf() })).status, 204);
  assert.equal((await server.request('/api/v1/identity/session', { method: 'GET' })).status, 401);
  read(`test ! -e ${remote}/client-done && touch ${remote}/client-done`);
  console.log('CLIENT_E2E=PASS; TLS_BYPASS=false; SERVER_BYTE_RELAY=false');
} catch {
  console.error('CLIENT_E2E=FAIL; SENSITIVE_DIAGNOSTICS_SUPPRESSED'); process.exitCode = 1;
} finally {
  server.close(); gateway.close(); tunnel.kill(); await rm(root, { recursive: true });
}
