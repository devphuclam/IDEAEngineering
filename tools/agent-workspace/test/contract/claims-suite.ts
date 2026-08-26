// Shared behavior suite for LegacyClaimStore (T012): every adapter must satisfy
// the same claim semantics. Runs against fakes by default; live adapters can
// register through the same factory.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ClaimRecord } from '../../src/domain/types.ts';
import type { LegacyClaimStore } from '../../src/adapters/ports.ts';

export function makeClaim(workItemId: string, claimToken: string, claimant: string, leaseMs = 3600_000): ClaimRecord {
  const now = Date.now();
  return {
    workItemId,
    claimToken,
    claimant,
    runId: `run-${claimToken}`,
    acquiredAt: new Date(now).toISOString(),
    leaseExpiresAt: new Date(now + leaseMs).toISOString(),
    kind: 'acquire',
  };
}

export function runClaimBehaviorSuite(name: string, store: () => LegacyClaimStore): void {
  test(`${name}: first claim wins`, async () => {
    const s = store();
    const alice = makeClaim('12', 'claim-a', 'alice');
    const bob = makeClaim('12', 'claim-b', 'bob');

    const first = await s.acquire(alice);
    assert.equal(first.winner, true);
    const second = await s.acquire(bob);
    assert.equal(second.winner, false);
    assert.match(second.reason ?? '', /already claimed/);
  });

  test(`${name}: exactly one active claim; no second sandbox for the loser`, async () => {
    const s = store();
    const alice = makeClaim('12', 'claim-a', 'alice');
    const bob = makeClaim('12', 'claim-b', 'bob');
    await s.acquire(alice);
    await s.acquire(bob);
    const active = await s.active('12');
    assert.equal(active?.claimant, 'alice');
  });

  test(`${name}: duplicate delivery for the same token is absorbed`, async () => {
    const s = store();
    const claim = makeClaim('12', 'claim-a', 'alice');
    const first = await s.acquire(claim);
    const duplicate = await s.acquire({ ...claim });
    assert.equal(first.winner, true);
    assert.equal(duplicate.winner, true);
  });

  test(`${name}: renewal heartbeat extends the same claim`, async () => {
    const s = store();
    const claim = makeClaim('12', 'claim-a', 'alice');
    await s.acquire(claim);
    const renewal = {
      ...claim,
      kind: 'renew' as const,
      leaseExpiresAt: new Date(Date.now() + 7200_000).toISOString(),
    };
    const result = await s.renew(renewal);
    assert.equal(result.winner, true);
    const active = await s.active('12');
    assert.equal(active?.claimant, 'alice');
  });

  test(`${name}: renewal by a non-owner is rejected`, async () => {
    const s = store();
    const alice = makeClaim('12', 'claim-a', 'alice');
    await s.acquire(alice);
    const bobRenewal = {
      ...alice,
      claimToken: 'claim-b',
      claimant: 'bob',
      kind: 'renew' as const,
    };
    const result = await s.renew(bobRenewal);
    assert.equal(result.winner, false);
  });

  test(`${name}: release frees the work item while records stay`, async () => {
    const s = store();
    const claim = makeClaim('12', 'claim-a', 'alice');
    await s.acquire(claim);
    await s.release('12');
    const active = await s.active('12');
    assert.equal(active, undefined);
    const records = await s.records('12');
    assert.ok(records.length >= 2);
  });

  test(`${name}: expiry frees the work item`, async () => {
    const s = store();
    const claim = makeClaim('12', 'claim-a', 'alice');
    await s.acquire(claim);
    await s.expire('12');
    const active = await s.active('12');
    assert.equal(active, undefined);
  });

  test(`${name}: expired lease does not block a new claim`, async () => {
    const s = store();
    const claim = makeClaim('12', 'claim-a', 'alice', -1000);
    await s.acquire(claim);
    const active = await s.active('12');
    assert.equal(active, undefined);
    const bob = makeClaim('12', 'claim-b', 'bob');
    const result = await s.acquire(bob);
    assert.equal(result.winner, true);
  });
}

export function runAdapterContractSuites(store: () => LegacyClaimStore): void {
  runClaimBehaviorSuite('fake-claim-store', store);
}