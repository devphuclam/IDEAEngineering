import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureClaimStore } from '../../src/adapters/azure/claims.ts';
import { AzureHttpClient } from '../../src/adapters/azure/http.ts';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { FakeAzureState } from '../../src/adapters/fakes/azure.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { OPERATION_RECEIPT_MARKER } from '../../src/domain/records.ts';

function makeStore(state: FakeAzureState, publisherId: string, now = '2026-08-14T00:00:00.000Z') {
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  return new AzureClaimStore({
    client,
    projectName: 'offline-project',
    integrationTarget: 'refs/heads/main',
    publisherId,
    clock: () => now,
  });
}

function command<T>(expectedRevision: string, operationId: string, input: T) {
  return { operationId, expectedRevision, actor: 'offline-user', requestedAt: '2026-08-14T00:00:00.000Z', input };
}

test('Azure claims have one authoritative winner and durable duplicate receipts', async () => {
  const state = new FakeAzureState();
  const alice = makeStore(state, 'alice-publisher');
  const bob = makeStore(state, 'bob-publisher');
  const claimInput = (claimant: string, runId: string) => ({
    workItemId: '1000',
    claimToken: `token-${claimant}`,
    claimant,
    runId,
    acquiredAt: '2026-08-14T00:00:00.000Z',
    leaseExpiresAt: '2026-08-14T01:00:00.000Z',
    kind: 'acquire' as const,
  });
  const first = await alice.acquire(command('1', 'claim-alice', claimInput('alice', 'run-alice')));
  assert.equal(first.disposition, 'applied');
  const duplicate = await alice.acquire(command(first.revision, 'claim-alice', claimInput('alice', 'run-alice')));
  assert.equal(duplicate.disposition, 'duplicate');
  const loser = await bob.acquire(command('1', 'claim-bob', claimInput('bob', 'run-bob')));
  assert.equal(loser.disposition, 'conflict');
  const active = await bob.active('1000');
  assert.equal(active.value?.claimant, 'alice');
});

test('Azure claims allow exactly one winner across 100 concurrent identities', async () => {
  const state = new FakeAzureState();
  const attempts = Array.from({ length: 100 }, (_, index) => {
    const store = makeStore(state, `publisher-${index}`);
    return store.acquire(command('1', 'claim-concurrent-' + index, {
      workItemId: '1000',
      claimToken: 'token-concurrent-' + index,
      claimant: 'agent-' + index,
      runId: 'run-concurrent-' + index,
      acquiredAt: '2026-08-14T00:00:00.000Z',
      leaseExpiresAt: '2026-08-14T01:00:00.000Z',
      kind: 'acquire' as const,
    }));
  });
  const results = await Promise.all(attempts);
  assert.equal(results.filter((result) => result.disposition === 'applied').length, 1);
  assert.equal(results.filter((result) => result.disposition === 'conflict').length, 99);
  assert.equal((await makeStore(state, 'observer').active('1000')).value?.claimant.startsWith('agent-'), true);
});

test('Azure claim handoff and release keep ownership provider-visible', async () => {
  const state = new FakeAzureState();
  const store = makeStore(state, 'publisher');
  const acquired = await store.acquire(command('1', 'claim-1', {
    workItemId: '1000',
    claimToken: 'token-1',
    claimant: 'alice',
    runId: 'run-1',
    acquiredAt: '2026-08-14T00:00:00.000Z',
    leaseExpiresAt: '2026-08-14T01:00:00.000Z',
    kind: 'acquire',
  }));
  assert.equal(acquired.disposition, 'applied');
  const handedOff = await store.handoff(command(acquired.revision, 'handoff-1', {
    previousOwner: 'alice',
    replacementOwner: 'bob',
    checkpoint: {
      checkpointId: 'checkpoint-1',
      runId: 'run-1',
      branch: 'feature/shared',
      commit: '0123456789abcdef0123456789abcdef01234567',
      verification: [],
      unresolvedWork: [],
      nextAction: 'continue',
      createdAt: '2026-08-14T00:00:00.000Z',
    },
    unresolvedRisks: [],
    nextAction: 'continue',
    recordedAt: '2026-08-14T00:00:00.000Z',
  }));
  assert.equal(handedOff.disposition, 'applied');
  assert.equal((await store.active('1000')).value?.claimant, 'bob');
  const released = await store.release(command(handedOff.revision, 'release-1', { workItemId: '1000', claimToken: 'token-1', reason: 'handoff complete' }));
  assert.equal(released.disposition, 'applied');
  assert.equal((await store.active('1000')).value, undefined);
});

test('Azure claim publication recovery restores the receipt before allowing a retry', async () => {
  const state = new FakeAzureState();
  const item = state.workItems.get(1000)!;
  item.fields['System.Description'] = replaceManagedBlock('', 'coordination-state', {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1000',
    claim: null,
    run: null,
    lastAppliedOperation: {
      operationId: 'claim-pending',
      kind: 'acquire',
      outcome: 'applied',
      at: '2026-08-14T00:00:00.000Z',
    },
    pendingPublication: {
      receipt: {
        operationId: 'claim-pending',
        kind: 'acquire',
        payloadHash: 'hash-claim-pending',
        outcome: 'applied',
        actor: 'alice',
        occurredAt: '2026-08-14T00:00:00.000Z',
      },
      publisher: { publisherId: 'old-process', leaseExpiresAt: '2026-08-14T00:01:00.000Z' },
    },
  }).description;
  const store = makeStore(state, 'new-process');

  const repaired = await store.reconcilePending('1000');
  assert.equal(repaired.published, true);
  assert.equal(state.comments.get(1000)!.length, 1);
  assert.ok(String(state.comments.get(1000)![0].text).startsWith(`${OPERATION_RECEIPT_MARKER} claim-pending`));
  const retry = await store.acquire(command('2', 'claim-retry', {
    workItemId: '1000',
    claimToken: 'token-retry',
    claimant: 'alice',
    runId: 'run-retry',
    acquiredAt: '2026-08-14T00:00:00.000Z',
    leaseExpiresAt: '2026-08-14T01:00:00.000Z',
    kind: 'acquire',
  }));
  assert.equal(retry.disposition, 'applied');
  await store.reconcilePending('1000');
  assert.equal(state.comments.get(1000)!.length, 2);
});
