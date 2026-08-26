// T049/T050/T054/T059/T060: deterministic convergence coverage for the
// provider boundary and durable evidence rules.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SerializedGh } from '../../src/adapters/github/gh.ts';
import { GitHubClaimStore } from '../../src/adapters/github/claims.ts';
import { parseCheckpointComments, parseProtectionPolicy, readProtectionPolicy } from '../../src/adapters/github/source-host.ts';
import { FakeClaimStore } from '../../src/adapters/fakes/index.ts';
import { redactEvidence } from '../../src/domain/redaction.ts';
import { sanitizeBranch } from '../../src/adapters/local/runner.ts';
import type { ClaimRecord, RunEvidence } from '../../src/domain/types.ts';

function claim(token: string, claimant: string): ClaimRecord {
  const now = Date.now();
  return {
    workItemId: '12',
    claimToken: token,
    claimant,
    runId: `run-${token}`,
    acquiredAt: new Date(now).toISOString(),
    leaseExpiresAt: new Date(now + 60_000).toISOString(),
    kind: 'acquire',
  };
}

test('T049: GitHub claim adapter reconciles concurrent appenders before success', async () => {
  const comments: Array<{ created_at: string; body: string }> = [];
  let sequence = 0;
  const gh = new SerializedGh(async (args) => {
    if (args[0] === 'api') {
      return comments.map((comment) => JSON.stringify({ id: ++sequence, ...comment })).join('\n');
    }
    const body = args[args.indexOf('--body') + 1];
    comments.push({ created_at: new Date(Date.now() + comments.length).toISOString(), body });
    return 'created';
  });
  const store = new GitHubClaimStore(gh, 'example/repo');
  const results = await Promise.all([
    store.acquire(claim('claim-a', 'alice')),
    store.acquire(claim('claim-b', 'bob')),
  ]);
  assert.equal(results.filter((result) => result.winner).length, 1);
  assert.equal((await store.active('12'))?.claimant, 'alice');
});

test('T050: handoff changes authoritative owner while stale owner loses control', async () => {
  const store = new FakeClaimStore();
  const alice = claim('claim-a', 'alice');
  assert.equal((await store.acquire(alice)).winner, true);
  assert.equal(
    (await store.handoff({ ...alice, claimant: 'bob', previousOwner: 'alice', kind: 'handoff' })).winner,
    true,
  );
  assert.equal((await store.active('12'))?.claimant, 'bob');
  assert.equal((await store.renew({ ...alice, kind: 'renew' })).winner, false);
  await store.release('12', 'claim-a');
  assert.equal(await store.active('12'), undefined);
});

test('T054: protection parsing keeps review policy separate from required checks', () => {
  assert.deepEqual(parseProtectionPolicy('{"reviews":0,"checks":[{"context":"npm test"}]}'), {
    requiredApprovingReviews: 0,
    requiredChecks: ['npm test'],
  });
  assert.deepEqual(parseProtectionPolicy('{"reviews":0,"checks":null}').requiredChecks, []);
  const comments = JSON.stringify({
    body: '<!-- checkpoint -->\n```json\n{"checkpointId":"cp-1","runId":"run-1","branch":"feature/x","commit":"abc1234","verification":[],"unresolvedWork":[],"nextAction":"resume","createdAt":"2026-08-13T00:00:00.000Z"}\n```\n<!-- /checkpoint -->',
  });
  assert.equal(parseCheckpointComments(comments)[0].checkpointId, 'cp-1');
});

test('T054: unavailable GitHub branch protection is classified explicitly', async () => {
  const gh = new SerializedGh(async () => {
    throw { stderr: 'gh: Validation Failed (HTTP 422)' };
  });
  await assert.rejects(
    () => readProtectionPolicy(gh, 'example/repo', 'main'),
    (error: unknown) => error instanceof Error && 'errorCode' in error && error.errorCode === 'PROTECTION_UNAVAILABLE',
  );
});

test('T059: redaction covers commands, references, and retention metadata', () => {
  const evidence: RunEvidence = {
    runId: 'run-1',
    workItemId: '12',
    owner: 'alice',
    timestamps: [new Date().toISOString()],
    stateTransitions: [],
    checkpointRefs: [],
    verification: [{ command: 'npm test --token=secret-value', outcome: 'failed', evidenceRef: 'password=hunter2' }],
    actions: [{ action: 'prompt=show transcript', actor: 'alice', at: new Date().toISOString(), outcome: 'succeeded' }],
  };
  const clean = redactEvidence(evidence);
  assert.doesNotMatch(JSON.stringify(clean), /secret-value|hunter2|show transcript/);
  assert.equal(clean.retention?.days, 30);
});

test('T060: branch identity is descriptive and collision-safe without Agent markers', () => {
  const first = sanitizeBranch('Reporting foundation', '12', 'run-aaa');
  const second = sanitizeBranch('Reporting foundation', '12', 'run-bbb');
  assert.notEqual(first, second);
  assert.match(first, /^feature\/reporting-foundation-wi-12-run-/);
  assert.throws(() => sanitizeBranch('Codex helper', '12', 'run-aaa'), /Agent\/AI\/Codex/);
});
