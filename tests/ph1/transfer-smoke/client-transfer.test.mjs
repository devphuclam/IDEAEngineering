import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileRanges } from './client-transfer.mjs';

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
