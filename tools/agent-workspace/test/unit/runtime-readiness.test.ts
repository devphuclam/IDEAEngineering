import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { inspectRuntime } from '../../src/adapters/local/runtime-readiness.ts';

const cwd = process.cwd();
const repositoryCwd = resolve(cwd, '../..');

test('runtimeProfile null is explicitly not-selected', async () => {
  const report = await inspectRuntime({ runtimeProfile: null, cwd });
  assert.equal(report.state, 'not-selected');
  assert.equal(report.checks[0].outcome, 'not-run');
});

test('native Windows cannot substitute for the V1 Linux/WSL2 runtime', async () => {
  const report = await inspectRuntime({ runtimeProfile: 'local-agent-v1', cwd, platform: 'win32', nodeVersion: '24.1.0' });
  assert.equal(report.state, 'unsupported');
  assert.match(report.detail, /Linux Dev Container or WSL2/);
});

test('WSL2 and Linux Dev Container share the same prerequisite contract', async () => {
  const wsl = await inspectRuntime({ runtimeProfile: 'local-agent-v1', cwd: repositoryCwd, platform: 'linux', environment: { WSL_DISTRO_NAME: 'Ubuntu' }, nodeVersion: '24.1.0', hasAzCli: false });
  const container = await inspectRuntime({ runtimeProfile: 'local-agent-v1', cwd: repositoryCwd, platform: 'linux', environment: { DEVCONTAINER: '1' }, nodeVersion: '24.1.0', hasAzCli: false });
  assert.equal(wsl.state, 'ready');
  assert.equal(container.state, 'ready');
  assert.equal(wsl.checks.find((check) => check.name === 'runtime.azure-cli')?.outcome, 'not-run');
  assert.deepEqual(wsl.checks.map((check) => check.name), container.checks.map((check) => check.name));
});

test('a missing required prerequisite blocks local-agent-v1', async () => {
  const report = await inspectRuntime({ runtimeProfile: 'local-agent-v1', cwd: 'C:/does-not-exist', platform: 'linux', environment: { DEVCONTAINER: '1' }, nodeVersion: '23.0.0', hasCodexDesktop: false });
  assert.equal(report.state, 'blocked');
  assert.ok(report.checks.some((check) => check.outcome === 'failed'));
});
