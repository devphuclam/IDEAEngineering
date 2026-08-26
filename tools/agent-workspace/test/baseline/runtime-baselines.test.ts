import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspectRuntime } from '../../src/adapters/local/runtime-readiness.ts';
import { evaluateLiveGate } from '../../src/validation/ledger.ts';

test('clean baseline is provider-neutral and reports optional runner honestly', async () => {
  const runtime = await inspectRuntime({ runtimeProfile: null, cwd: process.cwd() });
  assert.equal(runtime.state, 'not-selected');
  assert.ok(runtime.checks.every((check) => check.detail === undefined || !/token|bearer|password|pat/i.test(check.detail)));
  const live = evaluateLiveGate({
    environment: {},
    runtimeReady: false,
    configReady: true,
    identityReady: false,
    permissionsReady: false,
    capabilityReady: false,
    networkReady: false,
    policyReady: false,
    target: {
      organizationUrl: 'https://dev.azure.com/placeholder-organization',
      projectId: 'placeholder-project-id',
      repositoryId: 'placeholder-repository-id',
      targetRef: 'refs/heads/test-only',
    },
  });
  assert.equal(live.outcome, 'not-run');
  assert.equal(live.mode, 'live');
});
