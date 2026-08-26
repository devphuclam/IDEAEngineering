// T008: GitHub canonical revision projection and reconciliation tests:
// canonical Issue/comment hashes, the immutable Repository-ID/target queue-key
// vector, exact normalized/sorted queue-label projection, malformed/duplicate/
// mismatched recognized labels, unknown-label exclusion, append-reread-reconcile
// races, deterministic earliest valid winner, operation-ID/hash mismatch, and
// non-authoritative losing receipts (FR-013, SC-003).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHECKPOINT_MARKER,
  GithubRevisionError,
  OPERATION_RECEIPT_MARKER,
  QUEUE_COMPLETION_MARKER,
  QUEUE_DISCOVERY_LABEL,
  QUEUE_PROPOSAL_MARKER,
  githubQueueKey,
  operationReceiptBody,
  parseOperationReceipt,
  parseProposal,
  projectQueueLabels,
  queueKeyTag,
  reconcileAppendStream,
  serializeProposal,
  streamRevision,
} from '../../../src/adapters/github/revisions.ts';
import { payloadHash } from '../../../src/domain/mutations.ts';
import type { WireComment } from '../../../src/adapters/github/revisions.ts';
import type { OperationReceipt, RunEvidence } from '../../../src/domain/types.ts';

const REPOSITORY_ID = '123456789';
const TARGET = 'refs/heads/main';

test('streamRevision hashes ordered comment ids and canonical bodies', () => {
  const comments: WireComment[] = [
    { id: 1, body: 'a', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, body: 'b', createdAt: '2026-01-02T00:00:00.000Z' },
  ];
  const first = streamRevision(comments);
  const reordered: WireComment[] = [...comments].reverse();
  const third: WireComment[] = [...comments, { id: 3, body: 'c', createdAt: '2026-01-03T00:00:00.000Z' }];
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(streamRevision(comments), first, 'same stream hashes identically');
  assert.notEqual(streamRevision(reordered), first, 'comment order changes the revision');
  assert.notEqual(streamRevision(third), first, 'appending a comment changes the revision');
});

test('githubQueueKey is an immutable Repository-ID/target vector; order matters', () => {
  const first = githubQueueKey(REPOSITORY_ID, TARGET);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(githubQueueKey(REPOSITORY_ID, TARGET), first);
  assert.notEqual(githubQueueKey('987654321', TARGET), first, 'repository id changes the key');
  assert.notEqual(githubQueueKey(REPOSITORY_ID, 'refs/heads/dev'), first, 'target ref changes the key');
  assert.notEqual(githubQueueKey(TARGET, REPOSITORY_ID), first, 'the vector is ordered');
});

test('queueKeyTag embeds the full digest of the queue key', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  assert.equal(queueKeyTag(key), `agent-workspace:queue-key:sha256:${key}`);
});

test('projectQueueLabels returns exactly one discovery label and one key label, normalized and sorted', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  const projected = projectQueueLabels([QUEUE_DISCOVERY_LABEL, queueKeyTag(key), 'team-label'], key);
  assert.deepEqual(projected, [QUEUE_DISCOVERY_LABEL, queueKeyTag(key)].sort());
  const withCase = projectQueueLabels([` ${QUEUE_DISCOVERY_LABEL.toUpperCase()} `, queueKeyTag(key).toUpperCase()], key);
  assert.deepEqual(withCase, [QUEUE_DISCOVERY_LABEL, queueKeyTag(key)].sort(), 'labels are trimmed and lowercased');
});

test('projectQueueLabels excludes unknown labels entirely', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  const projected = projectQueueLabels([QUEUE_DISCOVERY_LABEL, queueKeyTag(key), 'random-1', 'random-2'], key);
  assert.equal(projected.length, 2);
  assert.ok(!projected.includes('random-1'));
});

test('projectQueueLabels fails closed on missing labels', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  assert.throws(() => projectQueueLabels([queueKeyTag(key)], key), /exactly one/);
  assert.throws(() => projectQueueLabels([QUEUE_DISCOVERY_LABEL], key), /exactly one/);
  assert.throws(() => projectQueueLabels([], key), /exactly one/);
});

test('projectQueueLabels fails closed on duplicate labels', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  assert.throws(
    () => projectQueueLabels([QUEUE_DISCOVERY_LABEL, QUEUE_DISCOVERY_LABEL, queueKeyTag(key)], key),
    /exactly one/,
  );
  assert.throws(
    () => projectQueueLabels([QUEUE_DISCOVERY_LABEL, queueKeyTag(key), queueKeyTag(key)], key),
    /exactly one/,
  );
});

test('projectQueueLabels fails closed on a mismatched queue-key label', () => {
  const key = githubQueueKey(REPOSITORY_ID, TARGET);
  const other = queueKeyTag(githubQueueKey('000000000', TARGET));
  assert.throws(() => projectQueueLabels([QUEUE_DISCOVERY_LABEL, other], key), /exactly one/);
});

test('serializeProposal/parseProposal round-trip canonical JSON in a fenced block', () => {
  const payload = { kind: 'enqueue', workItemId: '12', nested: { a: 1, b: [true, null] } };
  const body = serializeProposal(QUEUE_PROPOSAL_MARKER, 'op-1', payload);
  assert.ok(body.startsWith(`${QUEUE_PROPOSAL_MARKER} op-1`));
  const parsed = parseProposal(QUEUE_PROPOSAL_MARKER, body);
  assert.equal(parsed.operationId, 'op-1');
  assert.deepEqual(parsed.payload, payload);
  assert.equal(parsed.payloadHash, payloadHash(payload));
});

test('parseProposal rejects malformed comments', () => {
  assert.throws(() => parseProposal(QUEUE_PROPOSAL_MARKER, 'not a proposal'), GithubRevisionError);
assert.throws(
      () => parseProposal(QUEUE_PROPOSAL_MARKER, `${QUEUE_PROPOSAL_MARKER} op-1\nnot fenced`),
      /fenced JSON/,
    );
  assert.throws(
    () =>
      parseProposal(QUEUE_PROPOSAL_MARKER, `${QUEUE_PROPOSAL_MARKER} op-1\n\n\`\`\`json\n{broken\n\`\`\``),
    /not valid JSON/,
  );
});

test('reconcileAppendStream: durable matching receipt returns duplicate', () => {
  const receipt: OperationReceipt = {
    operationId: 'op-1',
    kind: 'enqueue',
    payloadHash: payloadHash({ runId: 'run-1' }),
    disposition: 'applied',
    outcome: 'applied',
    actor: 'alice',
    occurredAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
    references: [],
  };
  const comments: WireComment[] = [
    { id: 1, body: operationReceiptBody(receipt), createdAt: '2026-01-01T00:00:00.000Z' },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: receipt.payloadHash,
  });
  assert.equal(outcome.disposition, 'duplicate');
  assert.ok(outcome.receipt);
});

test('reconcileAppendStream: receipt hash mismatch is conflict, never duplicate', () => {
  const receipt: OperationReceipt = {
    operationId: 'op-1',
    kind: 'enqueue',
    payloadHash: payloadHash({ runId: 'run-1' }),
    disposition: 'applied',
    outcome: 'applied',
    actor: 'alice',
    occurredAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
    references: [],
  };
  const comments: WireComment[] = [
    { id: 1, body: operationReceiptBody(receipt), createdAt: '2026-01-01T00:00:00.000Z' },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash({ runId: 'run-2' }),
  });
  assert.equal(outcome.disposition, 'conflict');
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('payload hash mismatch')));
});

test('reconcileAppendStream: deterministic earliest valid proposal wins', () => {
  const payload = { runId: 'run-1' };
  const body = serializeProposal(QUEUE_PROPOSAL_MARKER, 'op-1', payload);
  const comments: WireComment[] = [
    { id: 1, body, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, body, createdAt: '2026-01-01T00:00:00.001Z' },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash(payload),
  });
  assert.equal(outcome.disposition, 'applied');
  assert.equal(outcome.winner?.operationId, 'op-1');
  assert.deepEqual(outcome.winner?.payload, payload);
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('earliest is authoritative')));
});

test('reconcileAppendStream: operation-ID/hash mismatch is conflict', () => {
  const comments: WireComment[] = [
    {
      id: 1,
      body: serializeProposal(QUEUE_PROPOSAL_MARKER, 'op-1', { runId: 'run-1' }),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      body: serializeProposal(QUEUE_PROPOSAL_MARKER, 'op-1', { runId: 'run-2' }),
      createdAt: '2026-01-01T00:00:00.001Z',
    },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash({ runId: 'run-1' }),
  });
  assert.equal(outcome.disposition, 'conflict');
  assert.equal(outcome.winner, undefined);
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('mismatch')));
});

test('reconcileAppendStream: no proposal for the operation is conflict (append lost history)', () => {
  const comments: WireComment[] = [];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash({ runId: 'run-1' }),
  });
  assert.equal(outcome.disposition, 'conflict');
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('no proposal found')));
});

test('reconcileAppendStream: non-matching operations are ignored (unknown-label exclusion analogue)', () => {
  const comments: WireComment[] = [
    {
      id: 1,
      body: serializeProposal(QUEUE_PROPOSAL_MARKER, 'op-other', { runId: 'run-other' }),
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash({ runId: 'run-1' }),
  });
  assert.equal(outcome.disposition, 'conflict');
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('no proposal found')));
});

test('reconcileAppendStream: corrupt comments are reported, not authoritative', () => {
  const comments: WireComment[] = [
    { id: 1, body: `${QUEUE_PROPOSAL_MARKER} op-1\n\nno fence`, createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, body: `${OPERATION_RECEIPT_MARKER} op-1\n\nno fence`, createdAt: '2026-01-01T00:00:00.001Z' },
  ];
  const outcome = reconcileAppendStream({
    comments,
    proposalMarker: QUEUE_PROPOSAL_MARKER,
    expectedOperationId: 'op-1',
    expectedPayloadHash: payloadHash({ runId: 'run-1' }),
  });
  assert.equal(outcome.disposition, 'conflict');
  assert.equal(outcome.winner, undefined);
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('corrupt proposal')));
  assert.ok(outcome.reasons.some((reason: string) => reason.includes('corrupt receipt')));
});

test('operationReceiptBody/parseOperationReceipt round-trip an immutable receipt', () => {
  const receipt: OperationReceipt = {
    operationId: 'op-1',
    kind: 'enqueue',
    payloadHash: payloadHash({ runId: 'run-1' }),
    disposition: 'applied',
    outcome: 'applied',
    actor: 'alice',
    occurredAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
    workItemId: '12',
    references: ['comment://12/1'],
  };
  const parsed = parseOperationReceipt(operationReceiptBody(receipt));
  assert.deepEqual(parsed, { ...receipt, blocker: undefined, nextAction: undefined });
});

test('parseOperationReceipt rejects schema/version mismatch and missing fields', () => {
  const badSchema = serializeProposal(OPERATION_RECEIPT_MARKER, 'op-1', { schema: 'other', version: 1, kind: 'x' });
  assert.throws(() => parseOperationReceipt(badSchema), /schema\/version/);
  const missingFields = serializeProposal(OPERATION_RECEIPT_MARKER, 'op-1', {
    schema: 'agent-workspace/operation-receipt',
    version: 1,
    kind: 'x',
  });
  assert.throws(() => parseOperationReceipt(missingFields), /missing required fields/);
});

test('recognized markers are distinct and stable', () => {
  const markers = [OPERATION_RECEIPT_MARKER, QUEUE_PROPOSAL_MARKER, QUEUE_COMPLETION_MARKER, CHECKPOINT_MARKER];
  assert.equal(new Set(markers).size, markers.length);
  for (const marker of markers) {
    assert.ok(marker.startsWith('AGENT-WORKSPACE:'), marker);
    assert.ok(marker.endsWith(':V1'), marker);
  }
});

test('evidence-shaped proposals reconcile identically (immutable payload)', () => {
  const evidence: Partial<RunEvidence> = { runId: 'run-1', workItemId: '12', owner: 'alice', timestamps: [] };
  const body = serializeProposal(CHECKPOINT_MARKER, 'op-1', evidence);
  const parsed = parseProposal(CHECKPOINT_MARKER, body);
  assert.deepEqual(parsed.payload, evidence);
  assert.equal(parsed.payloadHash, payloadHash(evidence));
});
