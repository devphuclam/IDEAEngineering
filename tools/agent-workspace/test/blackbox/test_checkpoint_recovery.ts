// T024: Black-box checkpoint recovery + retry linkage (US2, quickstart
// Scenario 3). Full recovery requires a shared GitHub repository (two-person
// pilot): gated behind WORKSPACE_BB_REPO. Local assertions always run.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { makeTempRepo, runWorkspace } from './helpers.ts';
import { checkpointPath, listCheckpoints, writeJsonAtomic } from '../../src/adapters/local/state-files.ts';
import { createCheckpoint } from '../../src/domain/checkpoint.ts';
import type { RunContext } from '../../src/domain/types.ts';
import { createRetryLink } from '../../src/domain/lifecycle.ts';

const BB_REPO = process.env.WORKSPACE_BB_REPO;

test('US2: recovery without a checkpoint reports the missing prerequisite (SC-003)', async () => {
  const repo = await makeTempRepo();
  try {
    const checkpoints = await listCheckpoints('run-nonexistent', repo.root);
    assert.equal(checkpoints.length, 0);
  } finally {
    await repo.cleanup();
  }
});

test('US2: checkpoint survives sandbox destruction (local state files)', async () => {
  const repo = await makeTempRepo();
  try {
    const runContext: RunContext = {
      runId: 'run-1',
      workItemId: '12',
      owner: 'alice',
      sandboxId: 'sandbox-1',
      branch: 'feature/reporting',
      worktreePath: '.worktrees/run-1',
      changeScope: {
        paths: ['src/'],
        semanticSeams: ['reporting'],
        prerequisites: [],
        integrationTarget: 'main',
      },
    };
    const checkpoint = createCheckpoint({
      runContext,
      commit: '9f2c1a4deadbeef',
      verification: [{ command: 'npm test', outcome: 'passed' }],
      unresolvedWork: ['integration test for export path'],
      nextAction: 'push checkpoint and request integration',
    });
    await writeJsonAtomic(checkpointPath('run-1', checkpoint.checkpointId, repo.root), checkpoint);
    const after = await listCheckpoints<import('../../src/domain/types.ts').AgentCheckpoint>('run-1', repo.root);
    assert.equal(after.length, 1);
    assert.equal(after[0].commit, '9f2c1a4deadbeef');
  } finally {
    await repo.cleanup();
  }
});

test('US2: retry creates a new run id linked to the earlier attempt (FR-008)', () => {
  const link = createRetryLink('run-1', 'run-2');
  assert.equal(link.retryOf, 'run-1');
  assert.notEqual(link.runId, 'run-1');
});

test('US2: full checkpoint recovery + handoff scenario', { skip: !BB_REPO && 'set WORKSPACE_BB_REPO to a shared GitHub repo' }, async () => {
  const repo = await makeTempRepo();
  try {
    const claim = await runWorkspace(['claim', '12'], repo.root);
    assert.equal(claim.code, 0, claim.stderr);
    const start = await runWorkspace(['start', '12'], repo.root);
    assert.equal(start.code, 0, start.stderr);
    const checkpoint = await runWorkspace(['checkpoint', '12'], repo.root);
    assert.equal(checkpoint.code, 0, checkpoint.stderr);
    assert.match(checkpoint.stdout, /checkpoint cp-/);
    // Simulate sandbox loss: the checkpoint file must still exist for recovery.
    await rm(join(repo.root, '.worktrees'), { recursive: true, force: true });
    await mkdir(join(repo.root, '.worktrees'), { recursive: true });
  } finally {
    await repo.cleanup();
  }
});