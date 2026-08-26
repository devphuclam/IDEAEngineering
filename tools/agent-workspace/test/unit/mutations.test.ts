// T006: Mutation foundation tests - canonical payload hashing, keyed
// same-process serialization, atomic-provider stale rejection, append-provider
// losing history, duplicate receipts, and the shared MAX_STALE_REREADS = 4
// retry budget (FR-013, FR-014, FR-018).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_STALE_REREADS,
  canonicalJson,
  classifyAppendOutcome,
  createKeyedSerializer,
  isStaleRevision,
  newOperationId,
  payloadHash,
  retryBudget,
} from '../../src/domain/mutations.ts';

test('MAX_STALE_REREADS is exactly 4 (5 total attempts)', () => {
  assert.equal(MAX_STALE_REREADS, 4);
});

test('canonicalJson sorts object keys and removes whitespace', () => {
  const first = canonicalJson({ b: 1, a: { y: 'x', z: 2 }, c: [3, { n: 1, m: 2 }] });
  const second = canonicalJson({ c: [3, { m: 2, n: 1 }], a: { z: 2, y: 'x' }, b: 1 });
  assert.equal(first, second);
  assert.ok(!first.includes(' '));
  assert.ok(!first.includes('\n'));
  assert.ok(first.indexOf('"a"') < first.indexOf('"b"'));
  assert.ok(first.indexOf('"b"') < first.indexOf('"c"'));
});

test('canonicalJson is deterministic across calls and ignores key order', () => {
  const a = canonicalJson({ x: 1, y: 'v' });
  const b = canonicalJson({ y: 'v', x: 1 });
  assert.equal(a, b);
  const c = canonicalJson({ x: 1, y: 'v' });
  assert.equal(a, c);
});

test('payloadHash is a sha256: prefixed hash of canonical JSON', () => {
  const hash = payloadHash({ kind: 'claim', workItemId: '12' });
  assert.match(hash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(payloadHash({ kind: 'claim', workItemId: '12' }), hash);
  assert.notEqual(payloadHash({ kind: 'claim', workItemId: '13' }), hash);
  assert.notEqual(payloadHash({ kind: 'claim', workItemId: '12', extra: true }), hash);
});

test('newOperationId is stable for the same instant and counter', () => {
  const now = '2026-08-14T00:00:00.000Z';
  const first = newOperationId(now);
  const second = newOperationId(now);
  assert.equal(first, second);
  assert.notEqual(newOperationId(now, 1), newOperationId(now, 2));
  assert.match(first, /^op-[0-9]+T[0-9]+Z-[0-9a-z]+$/, 'id is a compact deterministic string');
  assert.ok(!first.includes(' '), 'id contains no whitespace');
});

test('isStaleRevision detects expected/actual mismatch', () => {
  assert.equal(isStaleRevision('rev-1', 'rev-1'), false);
  assert.equal(isStaleRevision('rev-1', 'rev-2'), true);
});

test('retryBudget consumes down to exhaustion', () => {
  const budget = retryBudget(MAX_STALE_REREADS);
  assert.equal(budget.remaining, 4);
  assert.equal(budget.exhausted(), false);
  budget.consume();
  budget.consume();
  budget.consume();
  budget.consume();
  assert.equal(budget.exhausted(), true);
  assert.equal(budget.remaining, 0);
});

test('keyed serializer runs same-key tasks strictly in order', async () => {
  const serialize = createKeyedSerializer();
  const order: string[] = [];
  const first = serialize('a', async () => {
    order.push('a1-start');
    await new Promise((resolve) => setTimeout(resolve, 20));
    order.push('a1-end');
    return 1;
  });
  const second = serialize('a', async () => {
    order.push('a2');
    return 2;
  });
  const third = serialize('b', async () => {
    order.push('b1');
    return 3;
  });
  await Promise.all([first, second, third]);
  assert.equal(order[0], 'a1-start');
  assert.equal(order[1], 'b1', 'an independent key runs in parallel with the first key');
  assert.equal(order[2], 'a1-end');
  assert.equal(order[3], 'a2');
  assert.equal(await first, 1);
  assert.equal(await second, 2);
});

test('keyed serializer failure does not poison later tasks on the same key', async () => {
  const serialize = createKeyedSerializer();
  await assert.rejects(serialize('a', async () => {
    throw new Error('boom');
  }), /boom/);
  const later = await serialize('a', async () => 'ok');
  assert.equal(later, 'ok');
});

test('classifyAppendOutcome: receipt found returns duplicate', () => {
  assert.equal(
    classifyAppendOutcome({
      operationId: 'op-1',
      expectedRevision: 'rev-1',
      readRevision: 'rev-1',
      proposalFound: false,
      proposalAuthoritative: false,
      receiptFound: true,
    }),
    'duplicate',
  );
});

test('classifyAppendOutcome: missing proposal is conflict (append lost history)', () => {
  assert.equal(
    classifyAppendOutcome({
      operationId: 'op-1',
      expectedRevision: 'rev-1',
      readRevision: 'rev-2',
      proposalFound: false,
      proposalAuthoritative: false,
      receiptFound: false,
    }),
    'conflict',
  );
});

test('classifyAppendOutcome: stale revision is conflict even when the proposal is present', () => {
  assert.equal(
    classifyAppendOutcome({
      operationId: 'op-1',
      expectedRevision: 'rev-1',
      readRevision: 'rev-2',
      proposalFound: true,
      proposalAuthoritative: true,
      receiptFound: false,
    }),
    'conflict',
  );
});

test('classifyAppendOutcome: non-authoritative proposal is conflict', () => {
  assert.equal(
    classifyAppendOutcome({
      operationId: 'op-1',
      expectedRevision: 'rev-1',
      readRevision: 'rev-1',
      proposalFound: true,
      proposalAuthoritative: false,
      receiptFound: false,
    }),
    'conflict',
  );
});

test('classifyAppendOutcome: authoritative proposal on the expected revision is applied', () => {
  assert.equal(
    classifyAppendOutcome({
      operationId: 'op-1',
      expectedRevision: 'rev-1',
      readRevision: 'rev-1',
      proposalFound: true,
      proposalAuthoritative: true,
      receiptFound: false,
    }),
    'applied',
  );
});
