import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluateLiveGate, ValidationLedger, validationMarker, type ValidationTarget } from '../../src/validation/ledger.ts';

const target: ValidationTarget = {
  organizationUrl: 'https://dev.azure.com/placeholder-organization',
  projectId: '00000000-0000-0000-0000-000000000001',
  repositoryId: '00000000-0000-0000-0000-000000000002',
  targetRef: 'refs/heads/validation-only',
};

test('ledger writes intent before provider acceptance and reconstructs marker ownership', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-1', target, () => '2026-08-14T00:00:00.000Z');
    const intent = await ledger.recordIntent({
      artifactKey: 'queue-entry-1',
      operation: 'queue-entry.create',
      expectedRevisionOrHead: null,
      cleanupOperation: 'queue-entry.remove',
    });
    assert.equal(intent.state, 'intent-recorded');
    await assert.rejects(() => ledger.acknowledge('queue-entry-1'), /before provider acceptance/);
    const onDisk = JSON.parse(await readFile(ledger.filePath, 'utf8')) as { entries: Array<{ state: string }> };
    assert.equal(onDisk.entries[0].state, 'intent-recorded');
    await ledger.recordProviderAcceptance('queue-entry-1', 'work-item:123', 'rev-2');
    await ledger.recordProviderObservation('queue-entry-1', 'rev-3');
    await ledger.acknowledge('queue-entry-1');
    assert.equal(ledger.snapshot().entries[0].state, 'acknowledged');
    const recovered = await ValidationLedger.open(root, 'validation-1', target, () => '2026-08-14T00:01:00.000Z');
    const result = await recovered.recover(async (marker) => marker === validationMarker('validation-1', 'queue-entry-1') ? [{ providerRef: 'work-item:123', observedRevisionOrHead: 'rev-3' }] : [], true);
    assert.deepEqual(result.repaired, []);
    assert.deepEqual(result.blocked, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('provider revision drift blocks recovery instead of adopting the current artifact', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-drift', target);
    await ledger.recordIntent({ artifactKey: 'boards-roundtrip', operation: 'work-item.create', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close' });
    await ledger.recordProviderAcceptance('boards-roundtrip', 'work-item:789', 'rev-1');
    const result = await ledger.recover(async () => [{ providerRef: 'work-item:789', observedRevisionOrHead: 'rev-2' }], true);
    assert.deepEqual(result.repaired, []);
    assert.match(result.blocked[0], /drifted/);
    assert.equal(ledger.snapshot().entries[0].state, 'blocked');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('cleanup ownership drift blocks recovery and records the manual recovery boundary', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-cleanup-drift', target);
    await ledger.recordIntent({
      artifactKey: 'cleanup-target',
      operation: 'work-item.create',
      expectedRevisionOrHead: null,
      cleanupOperation: 'work-item.close',
      cleanupPrerequisites: ['exact marker and provider revision required'],
    });
    await ledger.recordProviderAcceptance('cleanup-target', 'work-item:1000', 'rev-1');
    const recovered = await ledger.recover(async () => [{ providerRef: 'work-item:2000', observedRevisionOrHead: 'rev-1' }], true);
    assert.deepEqual(recovered.repaired, []);
    assert.match(recovered.blocked[0], /provider reference/);
    const blocked = await ledger.markCleanup('cleanup-target', 'blocked', 'cleanup ownership marker drifted');
    assert.equal(blocked.state, 'blocked');
    assert.equal(blocked.cleanupOutcome, 'blocked');
    assert.ok(blocked.cleanupPrerequisites.includes('cleanup ownership marker drifted'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ambiguous marker recovery blocks instead of adopting an artifact', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-2', target);
    await ledger.recordIntent({ artifactKey: 'pr-1', operation: 'pull-request.create', expectedRevisionOrHead: 'head-1', cleanupOperation: 'pull-request.abandon' });
    const result = await ledger.recover(async () => ['pr:1', 'pr:2'], true);
    assert.deepEqual(result.repaired, []);
    assert.match(result.blocked[0], /ambiguous/);
    assert.equal(ledger.snapshot().entries[0].state, 'blocked');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('pending provider acceptance recovery preserves the owned provider reference for cleanup', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-pending', target);
    const intent = await ledger.recordIntent({ artifactKey: 'boards-roundtrip', operation: 'work-item.create', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close' });
    const result = await ledger.recover(async (marker) => marker === intent.marker ? [{ providerRef: 'work-item:456', observedRevisionOrHead: 'rev-1' }] : [], true);
    assert.deepEqual(result.repaired, ['boards-roundtrip']);
    assert.equal(ledger.snapshot().entries[0].state, 'provider-accepted');
    assert.equal(ledger.snapshot().entries[0].providerRef, 'work-item:456');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('exact marker recovery accepts a revision-changing mutation while preserving its pre-mutation CAS input', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-revision-change', target);
    await ledger.recordIntent({
      artifactKey: 'work-item-close',
      operation: 'work-item.close',
      expectedRevisionOrHead: 'rev-1',
      cleanupOperation: 'work-item.close',
    });
    const result = await ledger.recover(async () => [{ providerRef: 'work-item:456', observedRevisionOrHead: 'rev-2' }], true);
    assert.deepEqual(result.repaired, ['work-item-close']);
    assert.deepEqual(result.blocked, []);
    const recovered = ledger.snapshot().entries[0];
    assert.equal(recovered.expectedRevisionOrHead, 'rev-1', 'the original CAS input remains immutable');
    assert.equal(recovered.observedRevisionOrHead, 'rev-2', 'provider result revision is recorded separately');
    assert.equal(recovered.state, 'provider-accepted');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('accepted revision-changing mutation recovers against its observed result rather than its expected precondition', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-accepted-revision-change', target);
    await ledger.recordIntent({
      artifactKey: 'work-item-close',
      operation: 'work-item.close',
      expectedRevisionOrHead: 'rev-1',
      cleanupOperation: 'work-item.close',
    });
    await ledger.recordProviderAcceptance('work-item-close', 'work-item:456', 'rev-2');
    const result = await ledger.recover(async () => [{ providerRef: 'work-item:456', observedRevisionOrHead: 'rev-2' }], true);
    assert.deepEqual(result.repaired, []);
    assert.deepEqual(result.blocked, []);
    assert.equal(ledger.snapshot().entries[0].state, 'provider-accepted');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Work Item close recovery explains the parent revision advance only through the journaled CAS chain', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-close-chain', target);
    await ledger.recordIntent({ artifactKey: 'boards-roundtrip', operation: 'work-item.create', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close' });
    await ledger.recordProviderAcceptance('boards-roundtrip', 'work-item:456', 'rev-1');
    await ledger.acknowledge('boards-roundtrip');
    await ledger.recordIntent({ artifactKey: 'work-item-close', operation: 'work-item.close', expectedRevisionOrHead: 'rev-1', cleanupOperation: 'work-item.close' });

    const recovered = await ledger.recover(async () => [{ providerRef: 'work-item:456', observedRevisionOrHead: 'rev-2' }], true);
    assert.deepEqual(recovered.blocked, []);
    assert.deepEqual(new Set(recovered.repaired), new Set(['work-item-close', 'boards-roundtrip']));
    const entries = ledger.snapshot().entries;
    assert.equal(entries.find((entry) => entry.artifactKey === 'work-item-close')?.expectedRevisionOrHead, 'rev-1');
    assert.equal(entries.find((entry) => entry.artifactKey === 'work-item-close')?.observedRevisionOrHead, 'rev-2');
    assert.equal(entries.find((entry) => entry.artifactKey === 'boards-roundtrip')?.observedRevisionOrHead, 'rev-2');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('crash after Work Item close acceptance but before acknowledgement remains recoverable', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-close-ack-crash', target);
    await ledger.recordIntent({ artifactKey: 'boards-roundtrip', operation: 'work-item.create', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close' });
    await ledger.recordProviderAcceptance('boards-roundtrip', 'work-item:456', 'rev-1');
    await ledger.acknowledge('boards-roundtrip');
    await ledger.recordIntent({ artifactKey: 'work-item-close', operation: 'work-item.close', expectedRevisionOrHead: 'rev-1', cleanupOperation: 'work-item.close' });
    await ledger.recordProviderAcceptance('work-item-close', 'work-item:456', 'rev-2');

    const reopened = await ValidationLedger.open(root, 'validation-close-ack-crash', target);
    const recovered = await reopened.recover(async () => [{ providerRef: 'work-item:456', observedRevisionOrHead: 'rev-2' }], true);
    assert.deepEqual(recovered.blocked, []);
    assert.equal(reopened.snapshot().entries.find((entry) => entry.artifactKey === 'work-item-close')?.state, 'provider-accepted');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('crash immediately before provider contact leaves only an intent and fails closed without a marker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    const ledger = await ValidationLedger.open(root, 'validation-before-contact', target);
    await ledger.recordIntent({ artifactKey: 'work-item-close', operation: 'work-item.close', expectedRevisionOrHead: 'rev-1', cleanupOperation: 'work-item.close' });
    const recovered = await ledger.recover(async () => [], true);
    assert.deepEqual(recovered.repaired, []);
    assert.match(recovered.blocked[0], /marker not found/);
    assert.equal(ledger.snapshot().entries[0].providerRef, null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ledger run IDs stay inside the workspace validation directory and recovery does not create a missing run', async () => {
  const root = await mkdtemp(join(tmpdir(), 'azure-ledger-'));
  try {
    await assert.rejects(() => ValidationLedger.open(root, '../escape', target), /path-safe/);
    assert.equal(await ValidationLedger.openExisting(root, 'missing-run', target), undefined);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('live gates are exact and missing gates remain not-run', () => {
  const missing = evaluateLiveGate({ runtimeReady: true, configReady: true, identityReady: true, permissionsReady: true, capabilityReady: true, networkReady: true, policyReady: true, target, environment: {} });
  assert.equal(missing.outcome, 'not-run');
  assert.ok(missing.missing.length > 0);
  const environment = {
    AGENT_WORKSPACE_AZURE_LIVE: '1',
    AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL: target.organizationUrl,
    AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID: target.projectId,
    AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID: target.repositoryId,
    AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF: target.targetRef,
  };
  const passed = evaluateLiveGate({ runtimeReady: true, configReady: true, identityReady: true, permissionsReady: true, capabilityReady: true, networkReady: true, policyReady: true, target, environment });
  assert.equal(passed.outcome, 'passed');
});
