// T025: Black-box handoff control transfer + non-owner rejection (US2,
// quickstart Scenario 4). Live part gated behind WORKSPACE_BB_REPO.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTempRepo, runWorkspace } from './helpers.ts';
import { createHandoff, assertOwner } from '../../src/domain/handoff.ts';
import type { AgentCheckpoint } from '../../src/domain/types.ts';

const BB_REPO = process.env.WORKSPACE_BB_REPO;

test('US2: handoff records previous owner, replacement, checkpoint, risks, next action (FR-006)', () => {
  const checkpoint: AgentCheckpoint = {
    checkpointId: 'cp-1',
    runId: 'run-1',
    branch: 'feature/x',
    commit: 'abc1234',
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: ['review export path'],
    nextAction: 'push and integrate',
    createdAt: new Date().toISOString(),
  };
  const handoff = createHandoff({
    previousOwner: 'alice',
    replacementOwner: 'bob',
    checkpoint,
    unresolvedRisks: ['flake in export test'],
    nextAction: 'push and integrate',
  });
  assert.equal(handoff.previousOwner, 'alice');
  assert.equal(handoff.replacementOwner, 'bob');
  assert.equal(handoff.checkpoint.checkpointId, 'cp-1');
  assert.ok(handoff.unresolvedRisks.length > 0);
  assert.ok(handoff.nextAction.length > 0);
});

test('US2: non-owner control instructions are rejected; owner unchanged (FR-005)', () => {
  assert.throws(() => assertOwner('alice', 'bob'), /not the active Run Owner/);
  // Active owner remains alice after the rejection.
  assertOwner('alice', 'alice');
});

test('US2: handoff requires a different replacement owner', () => {
  const checkpoint: AgentCheckpoint = {
    checkpointId: 'cp-1',
    runId: 'run-1',
    branch: 'feature/x',
    commit: 'abc1234',
    verification: [],
    unresolvedWork: [],
    nextAction: '',
    createdAt: new Date().toISOString(),
  };
  assert.throws(
    () =>
      createHandoff({
        previousOwner: 'alice',
        replacementOwner: 'alice',
        checkpoint,
        unresolvedRisks: [],
        nextAction: '',
      }),
    /different named replacement owner/,
  );
});

test('US2: full handoff scenario', { skip: !BB_REPO && 'set WORKSPACE_BB_REPO to a shared GitHub repo' }, async () => {
  const repo = await makeTempRepo();
  try {
    const handoffResult = await runWorkspace(['handoff', '12', '--to', 'bob'], repo.root);
    assert.equal(handoffResult.code, 2, 'handoff without a claim is a usage/conflict error');
  } finally {
    await repo.cleanup();
  }
});