import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalRunnerAdapter } from '../../src/adapters/local/runner.ts';

test('local sandbox entry rejects the protected integration target', async () => {
  const runner = new LocalRunnerAdapter(process.cwd());
  await assert.rejects(
    runner.create('run-protected-target', 'refs/heads/validation-target', undefined, 'refs/heads/validation-target'),
    /protected integration target/,
  );
});
