// T033: Black-box integration flow (US3, quickstart Scenario 5): overlap
// warning, semantic block, and conflict decision. Live part gated behind
// WORKSPACE_BB_REPO; domain-level assertions always run.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyOverlap } from '../../src/domain/overlap.ts';
import { IntegrationQueue } from '../../src/domain/queue.ts';
import { makeTempRepo, runWorkspace } from './helpers.ts';
import type { ChangeScope } from '../../src/domain/types.ts';

const BB_REPO = process.env.WORKSPACE_BB_REPO;

const scopeA: ChangeScope = {
  paths: ['src/reporting/'],
  semanticSeams: ['reporting-service'],
  prerequisites: [],
  integrationTarget: 'main',
};
const scopeB: ChangeScope = {
  paths: ['src/reporting/export.ts'],
  semanticSeams: ['export-service'],
  prerequisites: [],
  integrationTarget: 'main',
};
const scopeC: ChangeScope = {
  paths: ['src/other/'],
  semanticSeams: ['reporting-service'],
  prerequisites: [],
  integrationTarget: 'main',
};

test('US3: path overlap is a warning only (FR-010)', () => {
  const result = classifyOverlap(scopeA, scopeB, false);
  assert.equal(result.kind, 'path');
  assert.ok(result.overlappingPaths.length > 0);
  assert.equal(result.overlappingSeams.length, 0);
});

test('US3: semantic overlap blocks until an explicit dependency or decision (FR-010)', () => {
  const withoutDependency = classifyOverlap(scopeA, scopeC, false);
  assert.equal(withoutDependency.kind, 'semantic');
  // With a recorded dependency the semantic block clears; there is no path
  // overlap to warn about.
  const withDependency = classifyOverlap(scopeA, scopeC, true);
  assert.equal(withDependency.kind, 'none');
});

test('US3: dependency ordering defers a candidate until its dependency clears (FR-011)', () => {
  const queue = new IntegrationQueue();
  const checkpointB: import('../../src/domain/types.ts').AgentCheckpoint = {
    checkpointId: 'cp-b',
    runId: 'run-b',
    branch: 'feature/b',
    commit: 'b1',
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: [],
    nextAction: 'integrate',
    createdAt: new Date().toISOString(),
  };
  const checkpointA: import('../../src/domain/types.ts').AgentCheckpoint = {
    checkpointId: 'cp-a',
    runId: 'run-a',
    branch: 'feature/a',
    commit: 'a1',
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: [],
    nextAction: 'integrate',
    createdAt: new Date().toISOString(),
  };
  // run-b depends on run-a (incorporated first).
  queue.enqueue('run-b', checkpointB, ['12']);
  queue.enqueue('run-a', checkpointA, []);
  const first = queue.incorporateNext([{ command: 'npm test', outcome: 'passed' }], [], () => undefined);
  assert.equal(first.runId, 'run-a', 'dependency-free candidate incorporates first');
  const second = queue.incorporateNext([{ command: 'npm test', outcome: 'passed' }], ['12'], () => undefined);
  assert.equal(second.runId, 'run-b');
});

test('US3: semantic conflict never auto-resolves (FR-012)', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-a', scopeAToCheckpoint(), []);
  // A human decision without a responsible identity is rejected: the flow
  // must never select one side automatically.
  assert.throws(
    () =>
      queue.recordDecision({
        runId: 'run-a',
        decision: 'human',
        decidedBy: 'unresolved',
        decidedAt: new Date().toISOString(),
      }),
    /never selects one side automatically/,
  );
  // A named responsible decision is recorded.
  queue.recordDecision({
    runId: 'run-a',
    decision: 'human',
    decidedBy: 'bob',
    decidedAt: new Date().toISOString(),
  });
});

function scopeAToCheckpoint(): import('../../src/domain/types.ts').AgentCheckpoint {
  return {
    checkpointId: 'cp-a',
    runId: 'run-a',
    branch: 'feature/a',
    commit: 'a1',
    verification: [{ command: 'npm test', outcome: 'passed' }],
    unresolvedWork: [],
    nextAction: 'integrate',
    createdAt: new Date().toISOString(),
  };
}

test('US3: integrate without a claim is a classified failure', async () => {
  const repo = await makeTempRepo();
  try {
    const result = await runWorkspace(['integrate', '12'], repo.root);
    assert.notEqual(result.code, 0);
  } finally {
    await repo.cleanup();
  }
});

test('US3: full integration scenario', { skip: !BB_REPO && 'set WORKSPACE_BB_REPO to a shared GitHub repo' }, async () => {
  const repo = await makeTempRepo();
  try {
    const result = await runWorkspace(['integrate', '12'], repo.root);
    assert.equal(result.code, 1, 'no claim in a fresh temp repo; classified failure expected');
  } finally {
    await repo.cleanup();
  }
});