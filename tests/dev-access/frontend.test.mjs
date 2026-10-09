import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startFrontend } from '../../apps/web/scripts/dev.mjs';

test('Frontend serves the selected source directory, not a remote mirror', async () => {
  const root = await mkdtemp(join(tmpdir(), 'idea-dev-source-'));
  let server;
  try {
    await writeFile(join(root, 'index.html'), '<html><body>LOCAL_SOURCE_A</body></html>');
    await writeFile(join(root, '.env'), 'SYNTHETIC_PRIVATE_DATA');
    server = await startFrontend({ webDirectory: root, port: 0 });
    const address = server.httpServer.address();
    assert.equal(address.address, '127.0.0.1');
    const url = `http://127.0.0.1:${address.port}`;
    assert.match(await (await fetch(url)).text(), /LOCAL_SOURCE_A/);
    await writeFile(join(root, 'index.html'), '<html><body>LOCAL_SOURCE_B</body></html>');
    assert.match(await (await fetch(url)).text(), /LOCAL_SOURCE_B/);
    const client = await (await fetch(url + '/@vite/client')).text();
    assert.match(client, /18448/);
    assert.match(client, /__vite_hmr/);
    assert.equal((await fetch(url + '/.env')).status, 403);
  } finally {
    await server?.close();
    await rm(root, { recursive: true, force: true }); // Only the mkdtemp-owned fixture.
  }
});
