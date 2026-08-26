import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeOfflineAzureAdapters, offlineConfig } from '../fixtures/azure/harness.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { canonicalQueueKey, QUEUE_DISCOVERY_TAG, queueKeyTag } from '../../src/adapters/azure/target.ts';
import type { MutationCommand, QueueManifest } from '../../src/domain/types.ts';

function seedQueue(state: ReturnType<typeof makeOfflineAzureAdapters>['state']): void {
  const queueKey = canonicalQueueKey(offlineConfig.organizationUrl, offlineConfig.project.expectedId!, offlineConfig.repository.expectedId!, offlineConfig.integrationTarget);
  const manifest: QueueManifest = {
    schema: 'agent-workspace/queue-manifest',
    version: 1,
    queueKey,
    organizationUrl: offlineConfig.organizationUrl,
    projectId: offlineConfig.project.expectedId!,
    repositoryId: offlineConfig.repository.expectedId!,
    targetRef: offlineConfig.integrationTarget,
    nextEnqueueSequence: 1,
    entries: [],
    lease: null,
    lastOperation: null,
    pendingPublication: null,
  };
  state.seed({ 'System.Title': 'Offline integration queue', 'System.Description': replaceManagedBlock('', 'queue-manifest', manifest).description, 'System.State': 'New', 'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(queueKey)}` }, 2000);
}

function command<T>(expectedRevision: string, operationId: string, input: T): MutationCommand<T> {
  return { operationId, expectedRevision, actor: 'offline-user', requestedAt: '2026-08-14T00:00:00.000Z', input };
}

test('Azure queue preserves 100 stale enqueue operations without duplicate sequences', async () => {
  const adapters = makeOfflineAzureAdapters();
  seedQueue(adapters.state);
  const results = [];
  for (let index = 0; index < 100; index += 1) {
    results.push(await adapters.queue.enqueue(command('1', `stale-enqueue-${index}`, {
      candidateWorkItemId: `candidate-${index}`,
      runId: `run-${index}`,
      dependencies: [],
      decisions: [],
    })));
  }
  assert.equal(results.every((result) => result.disposition === 'applied'), true);
  const manifest = (await adapters.queue.read(adapters.target)).value;
  assert.equal(manifest.entries.length, 100);
  assert.equal(new Set(manifest.entries.map((entry) => entry.sequence)).size, 100);
  assert.deepEqual(manifest.entries.map((entry) => entry.sequence), Array.from({ length: 100 }, (_, index) => index + 1));
});

test('Azure queue duplicate operation is durable and payload reuse conflicts', async () => {
  const adapters = makeOfflineAzureAdapters();
  seedQueue(adapters.state);
  const input = { candidateWorkItemId: 'candidate-duplicate', runId: 'run-duplicate', dependencies: [], decisions: [] };
  const first = await adapters.queue.enqueue(command('1', 'queue-duplicate-op', input));
  assert.equal(first.disposition, 'applied');
  const duplicate = await adapters.queue.enqueue(command('1', 'queue-duplicate-op', input));
  assert.equal(duplicate.disposition, 'duplicate');
  const changed = await adapters.queue.enqueue(command('1', 'queue-duplicate-op', { ...input, runId: 'run-changed' }));
  assert.equal(changed.disposition, 'conflict');
  assert.equal((await adapters.queue.read(adapters.target)).value.entries.length, 1);
});
