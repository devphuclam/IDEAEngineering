// Shared behavior suite for LegacyIntegrationQueue (T012): every adapter must
// satisfy the same incorporation semantics.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AgentCheckpoint } from '../../src/domain/types.ts';
import type { LegacyIntegrationQueue } from '../../src/adapters/ports.ts';

export function makeCheckpoint(runId: string): AgentCheckpoint {
  return {
    checkpointId: `cp-${runId}`,
    runId,
    branch: `feature/${runId}`,
    commit: 'abc1234',
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: [],
    nextAction: 'integrate',
    createdAt: new Date().toISOString(),
  };
}

export function runQueueBehaviorSuite(name: string, queue: () => LegacyIntegrationQueue): void {
  test(`${name}: candidates incorporate one at a time with verification rerun`, async () => {
    const q = queue();
    const pos = await q.enqueue('run-1', makeCheckpoint('run-1'));
    assert.equal(pos.position, 1);
    const result = await q.incorporateNext();
    assert.equal(result.state, 'incorporated');
    assert.ok(result.verification.length > 0, 'verification reruns after each incorporation (FR-011)');
  });

  test(`${name}: empty queue is rejected without claiming success`, async () => {
    const q = queue();
    const result = await q.incorporateNext();
    assert.equal(result.state, 'rejected');
  });

  test(`${name}: a semantic conflict requires a decision, never automatic side selection (FR-012)`, async () => {
    const q = queue();
    await q.enqueue('run-1', makeCheckpoint('run-1'));
    const decision = await q.semanticConflict('run-1');
    assert.ok(decision.decision === 'human' || decision.decision === 'rejected');
  });
}