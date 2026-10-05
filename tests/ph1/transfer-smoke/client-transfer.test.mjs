import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileRanges, gatewayProgress } from './client-transfer.mjs';

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
