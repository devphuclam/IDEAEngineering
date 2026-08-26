import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IntegrationQueue } from '../../src/domain/queue.ts';
import type { AgentCheckpoint } from '../../src/domain/types.ts';

function checkpoint(runId: string): AgentCheckpoint {
  return {
    checkpointId: `checkpoint-${runId}`,
    runId,
    branch: `feature/${runId}`,
    commit: `commit-${runId}`,
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: [],
    nextAction: 'integrate',
    createdAt: '2026-08-14T00:00:00.000Z',
  };
}

test('queue keeps immutable enqueue sequences and selects the lowest eligible candidate', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-dependent', checkpoint('run-dependent'), ['work-parent'], 'work-dependent');
  queue.enqueue('run-independent', checkpoint('run-independent'), [], 'work-independent');

  assert.deepEqual(queue.snapshot().map((entry) => entry.enqueueSequence), [1, 2]);
  assert.equal(queue.nextIncorporable([])?.runId, 'run-independent');
  assert.deepEqual(queue.queuePositions(), [
    { runId: 'run-dependent', position: 1 },
    { runId: 'run-independent', position: 2 },
  ]);
});

test('queue treats unresolved semantic decisions as blocked and accepts explicit serialization', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-a', checkpoint('run-a'), []);
  queue.recordDecision({ runId: 'run-a', decision: 'human', decidedBy: 'alice', decidedAt: '2026-08-14T00:00:00.000Z' });
  assert.equal(queue.nextIncorporable([])?.runId, 'run-a');

  const unresolved = new IntegrationQueue();
  unresolved.enqueue('run-a', checkpoint('run-a'), []);
  assert.throws(() => unresolved.recordDecision({ runId: 'run-a', decision: 'human', decidedBy: 'unresolved', decidedAt: '2026-08-14T00:00:00.000Z' }), /never selects one side automatically/);
  assert.equal(unresolved.nextIncorporable([])?.runId, 'run-a');
});

test('queue lease is exclusive, renewable, and records target drift as blocked', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-a', checkpoint('run-a'), [], 'work-a');
  queue.enqueue('run-b', checkpoint('run-b'), [], 'work-b');
  const lease = queue.acquireLease('run-a', 'op-a', 'target-a', '2026-08-14T00:00:00.000Z', 60);
  assert.equal(lease.runId, 'run-a');
  assert.throws(() => queue.acquireLease('run-b', 'op-b', 'target-b', '2026-08-14T00:00:01.000Z'), /lease is already held/);
  const renewed = queue.renewLease('op-a', '2026-08-14T00:00:10.000Z', 60);
  assert.equal(renewed.targetCommit, 'target-a');
  queue.releaseLease('op-a', 'drift');
  assert.equal(queue.snapshot()[0].state, 'blocked');
  assert.equal(queue.snapshot()[0].driftReason, 'drift');
});

test('queue invalidation prevents a drifted candidate from becoming eligible', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-a', checkpoint('run-a'), []);
  queue.invalidate('run-a', 'target-head-changed');
  assert.equal(queue.nextIncorporable([]), undefined);
});

test('queue restore preserves sequences and allocates a new sequence after the restored maximum', () => {
  const first = new IntegrationQueue();
  first.enqueue('run-a', checkpoint('run-a'), []);
  first.enqueue('run-b', checkpoint('run-b'), []);
  const restored = new IntegrationQueue();
  restored.restore(first.snapshot());
  restored.enqueue('run-c', checkpoint('run-c'), []);
  assert.deepEqual(restored.snapshot().map((entry) => entry.enqueueSequence), [1, 2, 3]);
});
