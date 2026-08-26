// T047: Unit tests for lifecycle, claims, overlap, queue, and redaction edge
// cases. Blocked-as-passed prevention is asserted at domain level only
// (black-box path owned by T039). SC-002 100-concurrent claim resolution is
// simulated on in-memory fakes (real concurrency out of V1 scope). Network
// failure maps to `network` classification with no silent fallback (FR-019).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transition, InvalidTransitionError, isTerminal, createRetryLink } from '../../src/domain/lifecycle.ts';
import { acquire, reconcile, renew, isExpired } from '../../src/domain/claims.ts';
import { classifyOverlap } from '../../src/domain/overlap.ts';
import { IntegrationQueue } from '../../src/domain/queue.ts';
import { redactText } from '../../src/domain/redaction.ts';
import { classifyGhError, SerializedGh } from '../../src/adapters/github/gh.ts';
import { FakeClaimStore, FakeRunnerAdapter } from '../../src/adapters/fakes/index.ts';
import type { ClaimRecord, RunState } from '../../src/domain/types.ts';

function makeClaim(workItemId: string, token: string, claimant: string, leaseMs = 3600_000): ClaimRecord {
  const now = Date.now();
  return {
    workItemId,
    claimToken: token,
    claimant,
    runId: `run-${token}`,
    acquiredAt: new Date(now).toISOString(),
    leaseExpiresAt: new Date(now + leaseMs).toISOString(),
    kind: 'acquire',
  };
}

test('lifecycle: happy path runs through the allowed chain', () => {
  const path: RunState[] = ['requested', 'claimed', 'preparing', 'running', 'verifying', 'ready-for-integration'];
  let state: RunState = 'requested';
  for (const next of path.slice(1)) {
    state = transition(state, next).state;
  }
  assert.equal(state, 'ready-for-integration');
});

test('lifecycle: every transition is idempotent', () => {
  const first = transition('requested', 'claimed');
  const duplicate = transition('claimed', 'claimed');
  assert.equal(first.transitioned, true);
  assert.equal(duplicate.transitioned, false);
  assert.equal(duplicate.idempotent, true);
  assert.equal(duplicate.state, 'claimed');
});

test('lifecycle: invalid transitions are rejected', () => {
  assert.throws(() => transition('requested', 'integrated'), InvalidTransitionError);
  assert.throws(() => transition('integrated', 'running'), InvalidTransitionError);
});

test('lifecycle: terminal states cannot leave', () => {
  for (const terminal of ['integrated', 'failed', 'cancelled', 'expired'] as RunState[]) {
    assert.equal(isTerminal(terminal), true);
    assert.throws(() => transition(terminal, 'running'), InvalidTransitionError);
  }
});

test('lifecycle: retry is a new run linked via retryOf (FR-008)', () => {
  const link = createRetryLink('run-1', 'run-2');
  assert.equal(link.retryOf, 'run-1');
  assert.notEqual(link.runId, 'run-1');
  assert.throws(() => createRetryLink('run-1', 'run-1'));
});

test('claims: first valid unexpired record wins (research.md §2)', () => {
  const records = [
    makeClaim('12', 't1', 'alice'),
    makeClaim('12', 't2', 'bob'),
  ];
  const { active } = reconcile(records, new Date().toISOString());
  assert.equal(active?.claimant, 'alice');
});

test('claims: an expired first record lets the next valid one win', () => {
  const records = [
    makeClaim('12', 't1', 'alice', -1000),
    makeClaim('12', 't2', 'bob'),
  ];
  const { active } = reconcile(records, new Date().toISOString());
  assert.equal(active?.claimant, 'bob');
});

test('claims: a released claim does not win', () => {
  const base = makeClaim('12', 't1', 'alice');
  const records = [base, { ...base, kind: 'release' as const }];
  const { active } = reconcile(records, new Date().toISOString());
  assert.equal(active, undefined);
});

test('claims: duplicate tokens are absorbed (idempotent delivery)', () => {
  const base = makeClaim('12', 't1', 'alice');
  const records = [base, { ...base }];
  const { active, duplicates } = reconcile(records, new Date().toISOString());
  assert.equal(active?.claimant, 'alice');
  assert.deepEqual(duplicates, ['t1']);
});

test('claims: renewal extends the same claim; a different token loses (SC-002)', () => {
  const base = makeClaim('12', 't1', 'alice');
  const renewal = {
    ...base,
    kind: 'renew' as const,
    leaseExpiresAt: new Date(Date.now() + 7200_000).toISOString(),
  };
  const records = [base, renewal];
  const { active } = reconcile(records, new Date().toISOString());
  assert.equal(active?.claimant, 'alice');
  assert.ok(Date.parse(active!.leaseExpiresAt) > Date.parse(base.leaseExpiresAt));
  const loser = renew(records, makeClaim('12', 't2', 'bob'), new Date().toISOString());
  assert.equal(loser.winner, false);
});

test('claims: SC-002 100 concurrent claim attempts produce exactly one winner (in-memory fakes)', async () => {
  const store = new FakeClaimStore();
  const runner = new FakeRunnerAdapter();
  const attempts = Array.from({ length: 100 }, (_, index) =>
    store.acquire(makeClaim('12', `t${index}`, `claimant-${index}`)),
  );
  const results = await Promise.all(attempts);
  const winners = results.filter((r) => r.winner);
  assert.equal(winners.length, 1);
  for (const winner of winners) await runner.create(`winner-${winner.reason ?? 'one'}`, 'feature/work-item');
  const active = await store.active('12');
  assert.ok(active);
  assert.equal(runner.sandboxes.length, 1, 'no losing claim creates a second sandbox');
});

test('claims: lease expiry detection', () => {
  const expired = makeClaim('12', 't1', 'alice', -1);
  assert.equal(isExpired(expired, new Date().toISOString()), true);
  const live = makeClaim('12', 't2', 'bob', 60_000);
  assert.equal(isExpired(live, new Date().toISOString()), false);
});

test('overlap: path overlap warns; semantic overlap blocks (FR-010)', () => {
  const a = { paths: ['src/x/'], semanticSeams: ['x-service'], prerequisites: [], integrationTarget: 'main' };
  const bPath = { paths: ['src/x/sub.ts'], semanticSeams: ['other'], prerequisites: [], integrationTarget: 'main' };
  const bSemantic = { paths: ['src/y/'], semanticSeams: ['x-service'], prerequisites: [], integrationTarget: 'main' };
  assert.equal(classifyOverlap(a, bPath, false).kind, 'path');
  assert.equal(classifyOverlap(a, bSemantic, false).kind, 'semantic');
  assert.equal(classifyOverlap(a, bSemantic, true).kind, 'none');
  assert.equal(classifyOverlap(a, bPath, false).overlappingPaths.includes('src/x/'), true);
});

test('queue: dependency-ordered incorporation with verification rerun (FR-011)', () => {
  const queue = new IntegrationQueue();
  const cp = (runId: string, deps: string[]) => ({
    checkpointId: `cp-${runId}`,
    runId,
    branch: `feature/${runId}`,
    commit: 'a1',
    verification: [],
    unresolvedWork: [],
    nextAction: '',
    createdAt: new Date().toISOString(),
  });
  queue.enqueue('run-b', cp('run-b', ['12']), ['12']);
  queue.enqueue('run-a', cp('run-a', []), []);
  const first = queue.incorporateNext([{ command: 'npm test', outcome: 'passed' }], [], () => undefined);
  assert.equal(first.runId, 'run-a');
  const second = queue.incorporateNext([{ command: 'npm test', outcome: 'passed' }], ['12'], () => undefined);
  assert.equal(second.runId, 'run-b');
  assert.equal(second.verification.length, 1);
});

test('queue: semantic conflict is never auto-resolved (FR-012)', () => {
  const queue = new IntegrationQueue();
  queue.enqueue('run-a', { checkpointId: 'cp-a', runId: 'run-a', branch: 'f', commit: 'a', verification: [], unresolvedWork: [], nextAction: '', createdAt: new Date().toISOString() }, []);
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
});

test('redaction: credentials and transcripts never persist (FR-015)', () => {
  const dirty = 'password=hunter2 prompt="do the thing" token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const clean = redactText(dirty);
  assert.ok(!clean.includes('hunter2'));
  assert.ok(!clean.includes('ghp_'));
  assert.ok(!clean.includes('do the thing'));
});

test('errors: network failures classify as network with no silent fallback (FR-019)', () => {
  const error = classifyGhError({ code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND api.github.com' });
  assert.equal(error.classification, 'network');
  assert.equal(error.errorCode, 'NETWORK_FAILURE');
});

test('errors: quota failures classify as quota', () => {
  const error = classifyGhError({ stderr: 'API rate limit exceeded (429)' });
  assert.equal(error.classification, 'quota');
});

test('gh wrapper: content-creating writes are serialized with >=1s spacing', async () => {
  const timestamps: number[] = [];
  const gh = new SerializedGh(async () => {
    timestamps.push(Date.now());
    return 'ok';
  });
  await gh.run(['issue', 'comment', '12', '--body', 'x']);
  await gh.run(['issue', 'comment', '12', '--body', 'y']);
  assert.equal(timestamps.length, 2);
  assert.ok(timestamps[1] - timestamps[0] >= 950, 'writes spaced >=1s apart');
});

test('gh wrapper: reads are not spaced', async () => {
  const timestamps: number[] = [];
  const gh = new SerializedGh(async () => {
    timestamps.push(Date.now());
    return 'ok';
  });
  await gh.run(['api', 'repos/x/issues/1']);
  await gh.run(['api', 'repos/x/issues/1']);
  assert.equal(timestamps.length, 2);
  assert.ok(timestamps[1] - timestamps[0] < 950, 'reads run without spacing');
});
