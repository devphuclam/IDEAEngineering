import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureEvidenceStore } from '../../../src/adapters/azure/evidence.ts';
import { AzureHttpClient } from '../../../src/adapters/azure/http.ts';
import { SecretString } from '../../../src/adapters/azure/auth.ts';
import { FakeAzureState } from '../../../src/adapters/fakes/azure.ts';
import { replaceManagedBlock } from '../../../src/adapters/azure/blocks.ts';
import { evidenceForRun } from '../../../src/domain/evidence.ts';
import { EVIDENCE_MARKER, OPERATION_RECEIPT_MARKER } from '../../../src/domain/records.ts';

test('Azure evidence is redacted, attributed, immutable, and recoverable after local index loss', async () => {
  const state = new FakeAzureState();
  const item = state.workItems.get(1000)!;
  item.fields['System.Description'] = replaceManagedBlock('', 'coordination-state', {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1000',
    claim: null,
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  }).description;
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  const store = new AzureEvidenceStore({ client, projectName: 'offline-project', clock: () => '2026-08-14T00:00:00.000Z', publisherId: 'offline-evidence' });
  const input = {
    ...evidenceForRun('run-evidence-1', '1000', 'alice'),
    providerMarker: 'agent-workspace:validation:run-evidence-1:run-evidence-policy',
    verification: [{ command: 'gh auth token', outcome: 'passed' as const, evidenceRef: 'token=ghp_123456789012345678901234567890' }],
    nextAction: 'prompt: transcript=do not persist',
  };
  const published = await store.publish({
    operationId: 'evidence-1',
    expectedRevision: '1',
    actor: 'alice',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input,
  });
  assert.equal(published.disposition, 'applied');
  assert.equal(published.value?.verification[0].command, '[REDACTED]');
  assert.equal(published.value?.verification[0].evidenceRef, '[REDACTED]');
  const comments = state.comments.get(1000)!;
  assert.equal(comments.filter((comment) => String(comment.text).startsWith(EVIDENCE_MARKER)).length, 1);
  assert.equal(comments.filter((comment) => String(comment.text).includes(OPERATION_RECEIPT_MARKER)).length, 1);
  assert.ok(!JSON.stringify(comments).includes('ghp_123456789012345678901234567890'));
  const duplicate = await store.publish({
    operationId: 'evidence-1',
    expectedRevision: '1',
    actor: 'alice',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input,
  });
  assert.equal(duplicate.disposition, 'duplicate');
  assert.equal(duplicate.revision, published.revision, 'post-acceptance retry reports the observed provider revision, not its stale pre-mutation CAS input');
  const recovered = new AzureEvidenceStore({ client, projectName: 'offline-project', clock: () => '2026-08-14T00:00:00.000Z', publisherId: 'new-process' });
  assert.equal((await recovered.read('run-evidence-1')).runId, 'run-evidence-1');
  const publications = await recovered.findPublications('1000', input.providerMarker);
  assert.equal(publications.length, 1);
  assert.equal(publications[0].operationId, 'evidence-1');
  assert.equal(publications[0].providerRef, published.receiptRef);
  assert.match(publications[0].observedRevisionOrHead, /^comment:1:version:1$/);
});

test('Azure evidence outbox recovery republishes payload after a crash between Work Item PATCH and comment', async () => {
  const state = new FakeAzureState();
  const item = state.workItems.get(1000)!;
  const pendingEvidence = evidenceForRun('run-pending-evidence', '1000', 'alice');
  item.fields['System.Description'] = replaceManagedBlock('', 'coordination-state', {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1000',
    claim: null,
    run: null,
    lastAppliedOperation: {
      operationId: 'evidence-pending',
      kind: 'run-evidence',
      outcome: 'pending',
      at: '2026-08-14T00:00:00.000Z',
    },
    pendingPublication: {
      receipt: {
        operationId: 'evidence-pending',
        kind: 'run-evidence',
        payloadHash: 'hash-pending-evidence',
        outcome: 'pending',
        actor: 'alice',
        occurredAt: '2026-08-14T00:00:00.000Z',
      },
      publisher: { publisherId: 'old-process', leaseExpiresAt: '2026-08-14T00:01:00.000Z' },
      evidence: pendingEvidence,
    },
  }).description;
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  const store = new AzureEvidenceStore({ client, projectName: 'offline-project', clock: () => '2026-08-14T00:00:01.000Z', publisherId: 'new-process' });

  const recovered = await store.reconcilePending('1000');
  assert.equal(recovered.published, true);
  assert.equal(recovered.operationId, 'evidence-pending');
  assert.equal((await store.read('run-pending-evidence')).runId, 'run-pending-evidence');

  const comments = state.comments.get(1000)!;
  assert.equal(comments.length, 1);
  assert.ok(String(comments[0].text).includes(`${EVIDENCE_MARKER} evidence-pending`));
  assert.ok(String(comments[0].text).includes(`${OPERATION_RECEIPT_MARKER} evidence-pending`));
  await store.reconcilePending('1000');
  assert.equal(state.comments.get(1000)!.length, 1);
});
