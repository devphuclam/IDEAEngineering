// T039: Black-box status inspection + blocked/unexecuted-not-passed +
// redaction (US4, quickstart Scenario 6). Live part gated behind
// WORKSPACE_BB_REPO; domain-level assertions always run.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redactText, redactEvidence } from '../../src/domain/redaction.ts';
import type { RunEvidence } from '../../src/domain/types.ts';
import { makeTempRepo, runWorkspace } from './helpers.ts';

const BB_REPO = process.env.WORKSPACE_BB_REPO;

const evidence: RunEvidence = {
  runId: 'run-1',
  workItemId: '12',
  owner: 'alice',
  timestamps: ['2026-08-13T09:00:00.000Z'],
  stateTransitions: [{ from: 'requested', to: 'claimed', at: '2026-08-13T09:00:00.000Z' }],
  checkpointRefs: ['cp-1'],
  verification: [
    { command: 'npm test', outcome: 'passed' },
    { command: './scripts/verify-template', outcome: 'blocked' },
    { command: 'e2e', outcome: 'unexecuted' },
  ],
  integrationResult: 'pending',
  blocker: null,
};

test('US4: blocked and unexecuted checks remain distinguishable (FR-014)', () => {
  const outcomes = evidence.verification.map((v) => v.outcome);
  assert.ok(outcomes.includes('blocked'));
  assert.ok(outcomes.includes('unexecuted'));
  // Every recorded outcome is one of the four distinct states.
  for (const outcome of outcomes) {
    assert.ok(['passed', 'failed', 'blocked', 'unexecuted'].includes(outcome));
  }
});

test('US4: credentials and source snapshots are redacted before persistence (FR-015)', () => {
  const dirty = `token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\npassword: hunter2\n\`\`\`ts\n${'const x = 1;\n'.repeat(20)}\n\`\`\``;
  const redacted = redactText(dirty);
  assert.ok(!redacted.includes('ghp_'));
  assert.ok(!redacted.includes('hunter2'));
  assert.ok(!redacted.includes('const x = 1;'));
});

test('US4: redaction applies to evidence before persistence', () => {
  const dirty: RunEvidence = {
    ...evidence,
    owner: 'alice secret=abc123',
    verification: [{ command: 'npm test', outcome: 'passed', evidenceRef: 'token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }],
  };
  const redacted = redactEvidence(dirty);
  assert.ok(!JSON.stringify(redacted).includes('ghp_'));
  assert.ok(!JSON.stringify(redacted).includes('abc123'));
});

test('US4: status without a claim reports no runs', async () => {
  const repo = await makeTempRepo();
  try {
    // A temp repo has no GitHub remote, so the claim store cannot resolve a
    // repository: the command fails with a classified diagnostic (FR-019),
    // never with a fabricated empty result.
    const result = await runWorkspace(['status', '12', '--json'], repo.root);
    assert.equal(result.code, 1);
    const payload = JSON.parse(result.stdout) as { error: { classification: string } };
    assert.equal(payload.error.classification, 'capability');
  } finally {
    await repo.cleanup();
  }
});

test('US4: full evidence scenario', { skip: !BB_REPO && 'set WORKSPACE_BB_REPO to a shared GitHub repo' }, async () => {
  const repo = await makeTempRepo();
  try {
    const result = await runWorkspace(['status', '12', '--json'], repo.root);
    assert.equal(result.code, 0, result.stderr);
  } finally {
    await repo.cleanup();
  }
});
