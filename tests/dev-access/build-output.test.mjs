import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, win32 } from 'node:path';
import { assertBuildOutput, strictlyWithin } from '../../apps/web/scripts/build-output.mjs';

test('reject cross-drive, root and parent outputs before an emptyOutDir operation', () => {
  assert.equal(strictlyWithin('C:\\web\\target', 'E:\\unrelated', win32), false);
  assert.equal(strictlyWithin('C:\\web\\target', 'C:\\web\\target', win32), false);
  assert.equal(strictlyWithin('C:\\web\\target', 'C:\\web\\outside', win32), false);
  assert.equal(strictlyWithin('C:\\web\\target', 'C:\\web\\target\\generated', win32), true);
});

test('allow owned generated outputs but reject a junction and arbitrary output', async () => {
  const fixture = await mkdtemp(resolve(tmpdir(), 'idea-build-output-'));
  try {
    const web = resolve(fixture, 'apps/web');
    await mkdir(web, { recursive: true });
    assert.equal(await assertBuildOutput(web, resolve(web, 'dist')), resolve(web, 'dist'));
    assert.equal(await assertBuildOutput(web, resolve(web, '../server/target/web')), resolve(web, '../server/target/web'));
    await assert.rejects(assertBuildOutput(web, resolve(fixture, 'outside')));
    await mkdir(resolve(fixture, 'outside'));
    await symlink(resolve(fixture, 'outside'), resolve(web, 'dist'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(assertBuildOutput(web, resolve(web, 'dist')), /symlink\/junction/);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});
