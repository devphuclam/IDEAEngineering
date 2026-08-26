import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureAuthenticator, SecretString } from '../../src/adapters/azure/auth.ts';
import { AzurePreparationAdapter } from '../../src/adapters/azure/bootstrap.ts';
import { FakeAzureState } from '../../src/adapters/fakes/azure.ts';
import { AzureHttpClient } from '../../src/adapters/azure/http.ts';
import { AzureNamespaceReader, AzurePermissionBatchReader } from '../../src/adapters/azure/permissions.ts';
import { parseQueueManifest, replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { queueKeyTag, QUEUE_DISCOVERY_TAG } from '../../src/adapters/azure/target.ts';
import { offlineConfig } from '../fixtures/azure/harness.ts';

function makePreparation(state: FakeAzureState): { preparation: AzurePreparationAdapter; transport: ReturnType<FakeAzureState['transport']> } {
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const authenticator = new AzureAuthenticator({
    azCli: { accountGetAccessToken: async () => ({ token: 'offline-only-token' }) },
    patFallback: { mode: 'disabled', source: { read: async () => undefined } },
  });
  const preparation = new AzurePreparationAdapter({
    client,
    config: offlineConfig,
    authenticator,
    authSelection: { source: 'entra', credential: SecretString.from('offline-only-token'), detail: 'offline simulated identity' },
    namespaceDiscovery: new AzureNamespaceReader(client),
    permissionBatchReader: new AzurePermissionBatchReader(client),
    identity: 'offline-identity',
    clock: () => '2026-08-14T00:00:00.000Z',
  });
  return { preparation, transport };
}

test('Azure readiness reports the exact read-only permission operation matrix', async () => {
  const { preparation } = makePreparation(new FakeAzureState());
  const readiness = await preparation.readiness();
  assert.equal(readiness.permissions.length, 6);
  assert.ok(readiness.permissions.every((permission) => permission.effective === 'allowed'));
});

test('Azure preparation preview is read-only and has a stable exact digest', async () => {
  const { preparation, transport } = makePreparation(new FakeAzureState());
  const first = await preparation.preview();
  const second = await preparation.preview();
  assert.equal(first.digest, second.digest);
  assert.equal(first.applicability, 'applicable');
  assert.deepEqual(first.queue?.fields, ['System.Title', 'System.Description']);
  assert.equal(transport.requests.some((request) => request.method !== 'GET'), false);
});

test('Azure preparation applies only the queue allowlist and repeats idempotently', async () => {
  const state = new FakeAzureState();
  const candidateBefore = structuredClone(state.workItems.get(1000));
  const { preparation, transport } = makePreparation(state);
  const plan = await preparation.preview();
  const command = {
    operationId: 'offline-prepare-1',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  };
  const first = await preparation.apply(command);
  assert.equal(first.disposition, 'applied');
  const queueId = String(first.value?.queueWorkItemId);
  const createdPatchCount = transport.requests.filter((request) => request.method === 'PATCH').length;
  const second = await preparation.apply({ ...command, operationId: 'offline-prepare-2' });
  assert.equal(second.disposition, 'applied');
  assert.equal(String(second.value?.queueWorkItemId), queueId);
  const third = await preparation.apply({ ...command, operationId: 'offline-prepare-3' });
  assert.equal(third.disposition, 'applied');
  assert.equal(String(third.value?.queueWorkItemId), queueId);
  assert.equal(transport.requests.filter((request) => request.method === 'PATCH').length, createdPatchCount);
  assert.deepEqual(state.workItems.get(1000), candidateBefore, 'candidate Work Item is never mutated by bootstrap');
  const queue = state.workItems.get(Number(queueId));
  assert.ok(queue);
  assert.ok(queue.fields['System.Tags'].includes(QUEUE_DISCOVERY_TAG));
  assert.equal(parseQueueManifest(queue.fields['System.Description']).value.queueKey, plan.queue?.queueKey);
});

test('multiple valid queue records fail closed for administrator repair', async () => {
  const state = new FakeAzureState();
  const { preparation } = makePreparation(state);
  const plan = await preparation.preview();
  const first = await preparation.apply({
    operationId: 'offline-prepare-1',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(first.disposition, 'applied');
  const queue = state.workItems.get(Number(first.value?.queueWorkItemId));
  assert.ok(queue);
  const duplicateDescription = replaceManagedBlock('', 'queue-manifest', parseQueueManifest(queue.fields['System.Description']).value).description;
  state.seed({
    'System.Title': queue.fields['System.Title'],
    'System.Description': duplicateDescription,
    'System.State': 'New',
    'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(plan.queue?.queueKey ?? '')}`,
  });
  const result = await preparation.apply({
    operationId: 'offline-prepare-duplicate',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(result.disposition, 'conflict');
  assert.match(result.reason ?? '', /administrator/i);
});
