import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { fileRanges, gatewayProgress } from './client-transfer.mjs';
import * as client from './client-transfer.mjs';

test('ordinary quoted-empty logout deletion clears only an existing host-scoped session', () => {
  assert.equal(typeof client.sessionCookie, 'function');
  const known = new Map([['IDEA_SESSION', 'synthetic-proof']]);
  assert.deepEqual(client.sessionCookie('IDEA_SESSION=""; Path=/; Max-Age=0; Secure', known),
    { name: 'IDEA_SESSION', value: '' });
  for (const bad of ['IDEA_SESSION=""; Path=/; Secure',
    'IDEA_SESSION=""; Path=/; Max-Age=0',
    'IDEA_SESSION=""; Path=/; Max-Age=0; Secure; Domain=localhost',
    'OTHER=""; Path=/; Max-Age=0; Secure',
    'IDEA_SESSION=synthetic-proof; Path=/; Secure'])
    assert.throws(() => client.sessionCookie(bad, known), /CLIENT_COOKIE_REFUSED/);
});

test('Tomcat zero-age Expires-only deletion cannot be mistaken for a new proof', () => {
  const known = new Map([['IDEA_SESSION', 'synthetic-proof']]);
  const deletion = 'IDEA_SESSION=; Expires=Thu, 01 Jan 1970 00:00:10 GMT; Path=/; Secure; SameSite=Strict';
  assert.deepEqual(client.sessionCookie(deletion, known), { name: 'IDEA_SESSION', value: '' });
  assert.throws(() => client.sessionCookie(deletion, new Map()), /CLIENT_COOKIE_REFUSED/);
  assert.throws(() => client.sessionCookie(deletion.replace('1970', '2099'), known), /CLIENT_COOKIE_REFUSED/);
  assert.throws(() => client.sessionCookie(deletion + '; Max-Age=30', known), /CLIENT_COOKIE_REFUSED/);
});

test('1 KiB synthetic file becomes one exact range with independently known SHA-256', async () => {
  const root = await mkdtemp(join(tmpdir(), 'idea-f05-client-'));
  try {
    const path = join(root, 'synthetic.bin');
    await writeFile(path, Buffer.alloc(1024));
    const ranges = [];
    for await (const range of fileRanges(path)) ranges.push(range);
    assert.equal(ranges.length, 1);
    assert.equal(ranges[0].start, 0);
    assert.equal(ranges[0].end, 1024);
    assert.equal(ranges[0].digest, '5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef');
    assert.deepEqual(ranges[0].bytes, Buffer.alloc(1024));
  } finally {
    // Exact newly created synthetic fixture only; never a repository/user root.
    await rm(root, { recursive: true });
  }
});

test('64 MiB synthetic file produces 64 contiguous 1 MiB ranges without whole-file buffering', async () => {
  const root = await mkdtemp(join(tmpdir(), 'idea-f05-client-'));
  try {
    const path = join(root, 'synthetic.bin');
    const { open } = await import('node:fs/promises');
    const file = await open(path, 'wx');
    try { await file.truncate(67108864); } finally { await file.close(); }
    let count = 0;
    for await (const range of fileRanges(path)) {
      assert.equal(range.start, count * 1048576);
      assert.equal(range.end, (count + 1) * 1048576);
      assert.equal(range.bytes.length, 1048576);
      assert.equal(range.digest, '30e14955ebf1352266dc2ff8067e68104607e750abb9d3b36582b8af909fcb58');
      count++;
    }
    assert.equal(count, 64);
  } finally { await rm(root, { recursive: true }); }
});

test('Gateway acknowledgement without a Receipt remains progress, never custody success', () => {
  const body = Buffer.alloc(12);
  body.writeBigInt64BE(1024n);
  assert.deepEqual(gatewayProgress(body, 1024), { verifiedBytes: 1024, receipt: null });
  for (const bad of [Buffer.alloc(11), Buffer.alloc(13), Buffer.alloc(4109)])
    assert.throws(() => gatewayProgress(bad, 1024), /CLIENT_GATEWAY_RESPONSE_REFUSED/);
  const overflow = Buffer.alloc(12); overflow.writeBigInt64BE(1025n);
  assert.throws(() => gatewayProgress(overflow, 1024), /CLIENT_GATEWAY_RESPONSE_REFUSED/);
});

test('client reads both exact governing P05 manifests through the admitted runtime', async () => {
  const root = await mkdtemp(join(tmpdir(), 'idea-f05-client-'));
  try {
    const fixtures = join(root, 'p05-fixtures');
    const generator = fileURLToPath(new URL('../../../tools/p05-fixtures/generate-fixtures.mjs', import.meta.url));
    execFileSync(process.execPath, [generator, '--output-dir', fixtures], { stdio: 'pipe', timeout: 30000 });
    for (const [name, size, digest, count] of [
      ['IE-DATA-CANONICAL-001-small-1KiB.bin', 1024,
        'c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384', 1],
      ['IE-DATA-CANONICAL-001-transfer-64MiB.bin', 67108864,
        '04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae', 64],
    ]) {
      const hash = createHash('sha256'); let bytes = 0; let ranges = 0;
      for await (const range of fileRanges(join(fixtures, name))) {
        assert.equal(range.start, bytes);
        hash.update(range.bytes); bytes = range.end; ranges++;
      }
      assert.equal(bytes, size); assert.equal(ranges, count);
      assert.equal(hash.digest('hex'), digest);
    }
  } finally { await rm(root, { recursive: true }); }
});
