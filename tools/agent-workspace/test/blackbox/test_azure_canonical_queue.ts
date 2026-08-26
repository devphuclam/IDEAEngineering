// US3 black-box journey: the Azure Work Item manifest is canonical across
// clones, local cache loss is harmless, semantic decisions remain visible, and
// only one lease/finalization can advance the queue at a time.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { canonicalQueueKey, QUEUE_DISCOVERY_TAG, queueKeyTag } from '../../src/adapters/azure/target.ts';
import { makeOfflineAzureAdapters, offlineConfig } from '../fixtures/azure/harness.ts';
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
    'System.Title': 'Offline canonical integration queue',
    'System.Description': replaceManagedBlock('<p>Queue owner note</p>', 'queue-manifest', manifest).description,
    'System.State': 'New',
    'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(queueKey)}`,
  });
}

function command<T>(expectedRevision: string, operationId: string, input: T): MutationCommand<T> {
  return { operationId, expectedRevision, actor: 'offline-agent', requestedAt: '2026-08-14T00:00:00.000Z', input };
}

test('two queue clones refresh from the provider after cache loss and preserve semantic decisions', async () => {
  const first = makeOfflineAzureAdapters();
  const queueId = seedQueue(first.state);
  const second = makeOfflineAzureAdapters(first.state);
  const empty = await first.queue.read(first.target);
  const firstEnqueue = await first.queue.enqueue(command(empty.revision, 'queue-blackbox-enqueue-1', {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(firstEnqueue.disposition, 'applied');
  const secondView = await second.queue.read(second.target);
  assert.equal(secondView.value.entries[0]?.sequence, 1);
  assert.equal(secondView.value.entries[0]?.candidateWorkItemId, '1000');
  assert.equal(Number(queueId), 1001);

  const secondEnqueue = await second.queue.enqueue(command(secondView.revision, 'queue-blackbox-enqueue-2', {
    candidateWorkItemId: '1001',
    runId: 'run-1001',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(secondEnqueue.disposition, 'applied');
  const withBoth = await first.queue.read(first.target);
  const decision = await first.queue.recordDecision(command(withBoth.revision, 'queue-blackbox-decision', {
    entrySequence: 2,
    candidateWorkItemId: '1001',
    decision: {
      runId: 'run-1001',
      decision: 'human',
      decidedBy: 'responsible-reviewer',
      decidedAt: '2026-08-14T00:00:00.000Z',
      note: 'serialize after the first candidate',
    },
  }));
  assert.equal(decision.disposition, 'applied');

  // Simulate a deleted local cache: only a fresh adapter is allowed to decide.
  const recovered = makeOfflineAzureAdapters(first.state);
  const recoveredQueue = await recovered.queue.read(recovered.target);
  assert.equal(recoveredQueue.value.entries.length, 2);
  assert.equal(recoveredQueue.value.entries[1]?.decisions[0]?.decidedBy, 'responsible-reviewer');
});

test('canonical queue leases one candidate, records latest target, and removes final entries', async () => {
  const first = makeOfflineAzureAdapters();
  seedQueue(first.state);
  const second = makeOfflineAzureAdapters(first.state);
  const enqueue = await first.queue.enqueue(command('1', 'queue-blackbox-enqueue', {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(enqueue.disposition, 'applied');
  const lease = await first.queue.acquireNext(command(enqueue.revision, 'queue-blackbox-lease-1', {
    entrySequence: 1,
    targetCommit: 'target-commit-1',
    leaseSeconds: 300,
  }));
  assert.equal(lease.disposition, 'applied');
  assert.equal(lease.value?.targetCommit, 'target-commit-1');
  const otherAttempt = await second.queue.acquireNext(command(lease.revision, 'queue-blackbox-lease-2', {
    entrySequence: 1,
    targetCommit: 'target-commit-1',
    leaseSeconds: 300,
  }));
  assert.equal(otherAttempt.disposition, 'conflict');
  assert.match(otherAttempt.reason ?? '', /lease/i);

  const finalized = await first.queue.finalize(command(lease.revision, 'queue-blackbox-finalize-1', {
    entrySequence: 1,
    outcome: 'integrated',
    pullRequestRef: 'pr:1',
    evidenceRef: 'run:run-1000',
  }));
  assert.equal(finalized.disposition, 'applied');
  const after = await second.queue.read(second.target);
  assert.equal(after.value.entries.length, 0);
  const history = await second.queue.completionHistory(second.target);
  assert.equal(history.length, 1);
  assert.equal(history[0]?.candidateWorkItemId, '1000');
  assert.equal(history[0]?.evidenceRef, 'run:run-1000');
});
