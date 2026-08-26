import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeOfflineAzureAdapters, offlineConfig } from '../fixtures/azure/harness.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { canonicalQueueKey, QUEUE_DISCOVERY_TAG, queueKeyTag } from '../../src/adapters/azure/target.ts';
import type { MutationCommand, QueueManifest } from '../../src/domain/types.ts';

function seedQueue(state: ReturnType<typeof makeOfflineAzureAdapters>['state']): number {
  const queueKey = canonicalQueueKey(
    offlineConfig.organizationUrl,
    offlineConfig.project.expectedId!,
    offlineConfig.repository.expectedId!,
    offlineConfig.integrationTarget,
  );
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
  return state.seed({
    'System.Title': 'Offline integration queue',
    'System.Description': replaceManagedBlock('human queue note', 'queue-manifest', manifest).description,
    'System.State': 'New',
    'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(queueKey)}`,
  });
}

function command<T>(expectedRevision: string, operationId: string, input: T): MutationCommand<T> {
  return { operationId, expectedRevision, actor: 'offline-user', requestedAt: '2026-08-14T00:00:00.000Z', input };
}

test('Azure canonical queue preserves immutable sequence and reconstructs after local loss', async () => {
  const adapters = makeOfflineAzureAdapters();
  const queueId = seedQueue(adapters.state);
  const first = await adapters.queue.read(adapters.target);
  assert.equal(first.value.entries.length, 0);
  const enqueued = await adapters.queue.enqueue(command(first.revision, 'queue-enqueue-1', {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(enqueued.disposition, 'applied');
  assert.equal(enqueued.value?.entries[0].sequence, 1);
  assert.equal(Number(queueId), 1001);
  const duplicate = await adapters.queue.enqueue(command(enqueued.revision, 'queue-enqueue-2', {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(duplicate.disposition, 'duplicate');
  const fresh = makeOfflineAzureAdapters(adapters.state);
  const recovered = await fresh.queue.read(fresh.target);
  assert.equal(recovered.value.entries[0].runId, 'run-1000');
  assert.equal((await fresh.queue.completionHistory(fresh.target)).length, 0);
});

test('queue lease is exclusive and finalization publishes bounded completion history', async () => {
  const adapters = makeOfflineAzureAdapters();
  seedQueue(adapters.state);
  const enqueued = await adapters.queue.enqueue(command('1', 'queue-enqueue-1', {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    dependencies: [],
    decisions: [],
  }));
  const lease = await adapters.queue.acquireNext(command(enqueued.revision, 'queue-lease-1', {
    entrySequence: 1,
    targetCommit: 'offline-target-commit',
    leaseSeconds: 300,
  }));
  assert.equal(lease.disposition, 'applied');
  const blocked = await adapters.queue.acquireNext(command(lease.revision, 'queue-lease-2', {
    entrySequence: 1,
    targetCommit: 'offline-target-commit',
    leaseSeconds: 300,
  }));
  assert.equal(blocked.disposition, 'conflict');
  const finalized = await adapters.queue.finalize(command(lease.revision, 'queue-finalize-1', {
    entrySequence: 1,
    outcome: 'integrated',
    evidenceRef: 'comment:1',
  }));
  assert.equal(finalized.disposition, 'applied');
  assert.equal((await adapters.queue.read(adapters.target)).value.entries.length, 0);
  assert.equal((await adapters.queue.completionHistory(adapters.target)).length, 1);
});

test('dependency entries stay queued until the dependency leaves canonical state', async () => {
  const adapters = makeOfflineAzureAdapters();
  seedQueue(adapters.state);
  const first = await adapters.queue.enqueue(command('1', 'queue-enqueue-dependency', {
    candidateWorkItemId: 'dependency',
    runId: 'run-dependency',
    dependencies: [],
    decisions: [],
  }));
  const second = await adapters.queue.enqueue(command(first.revision, 'queue-enqueue-dependent', {
    candidateWorkItemId: 'dependent',
    runId: 'run-dependent',
    dependencies: ['dependency'],
    decisions: [],
  }));
  const noLease = await adapters.queue.acquireNext(command(second.revision, 'queue-lease-dependent', {
    entrySequence: 2,
    targetCommit: 'offline-target-commit',
  }));
  assert.equal(noLease.disposition, 'applied');
  assert.equal(noLease.value?.candidateWorkItemId, 'dependency');
});

test('pending finalization recovery publishes exactly one completion summary before clearing the outbox', async () => {
  const adapters = makeOfflineAzureAdapters();
  const queueId = seedQueue(adapters.state);
  const snapshot = await adapters.queue.read(adapters.target);
  const item = adapters.state.workItems.get(Number(queueId))!;
  const completion = {
    operationId: 'queue-finalize-recovery',
    sequence: 7,
    candidateWorkItemId: '1000',
    runId: 'run-recovery',
    outcome: 'integrated' as const,
    at: '2026-08-14T00:00:00.000Z',
    evidenceRef: 'run:run-recovery',
  };
  const manifest = structuredClone(snapshot.value) as QueueManifest;
  manifest.lastOperation = { operationId: completion.operationId, kind: 'finalize', outcome: 'applied', at: completion.at };
  manifest.pendingPublication = {
    receipt: {
      operationId: completion.operationId,
      kind: 'finalize',
      payloadHash: 'sha256:recovery',
      outcome: 'applied',
      actor: 'offline-user',
      occurredAt: completion.at,
    },
    completion,
  };
  item.fields['System.Description'] = replaceManagedBlock(item.fields['System.Description'], 'queue-manifest', manifest).description;
  item.rev += 1;

  const repaired = await adapters.queue.reconcilePending(adapters.target);
  assert.equal(repaired.published, true);
  assert.equal((await adapters.queue.read(adapters.target)).value.pendingPublication, null);
  assert.equal((await adapters.queue.completionHistory(adapters.target)).filter((entry) => entry.operationId === completion.operationId).length, 1);
  const second = await adapters.queue.reconcilePending(adapters.target);
  assert.equal(second.published, true);
  assert.equal((await adapters.queue.completionHistory(adapters.target)).filter((entry) => entry.operationId === completion.operationId).length, 1);
});
