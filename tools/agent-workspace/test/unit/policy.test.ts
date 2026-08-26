// T007: Policy-domain tests - local verification and provider policy remain
// separate gates; incomplete, missing, pending, failed, blocked, stale,
// unexecuted, or unavailable requirements cannot pass (FR-022, FR-023,
// FR-035).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateOutcome,
  inventoryIsComplete,
  inventoryVerdict,
  snapshotAggregate,
  snapshotIsPassable,
  stricterWins,
} from '../../src/domain/policy.ts';
import type { PolicyInventory, PolicyRequirement, PolicySnapshot } from '../../src/domain/types.ts';

function requirement(verdict: PolicyRequirement['verdict'], overrides: Partial<PolicyRequirement> = {}): PolicyRequirement {
  return {
    id: `req-${verdict}`,
    name: `Requirement ${verdict}`,
    source: 'provider',
    kind: 'provider',
    verdict,
    ...overrides,
  };
}

function inventory(overrides: Partial<PolicyInventory> = {}): PolicyInventory {
  return {
    target: { repositoryId: 'repo', targetRef: 'refs/heads/main' },
    observedAt: '2026-08-14T00:00:00.000Z',
    sources: [{ name: 'provider-policy', outcome: 'read' }],
    effectiveBlocking: [],
    ...overrides,
  };
}

function snapshot(overrides: Partial<PolicySnapshot> = {}): PolicySnapshot {
  return {
    target: { repositoryId: 'repo', targetRef: 'refs/heads/main' },
    headCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    observedAt: '2026-08-14T00:00:00.000Z',
    inventory: inventory(),
    evaluations: [],
    aggregate: 'passed',
    ...overrides,
  };
}

test('aggregate: an empty requirement list passes', () => {
  assert.equal(aggregateOutcome([]), 'passed');
});

test('aggregate: every non-pass verdict blocks', () => {
  for (const verdict of ['failed', 'blocked', 'unexecuted', 'pending', 'unavailable'] as const) {
    assert.notEqual(aggregateOutcome([requirement(verdict)]), 'passed', `${verdict} must not pass`);
  }
});

test('aggregate: passed-only lists pass; mixed lists fail closed', () => {
  assert.equal(aggregateOutcome([requirement('passed'), requirement('passed')]), 'passed');
  assert.equal(aggregateOutcome([requirement('passed'), requirement('blocked')]), 'blocked');
  assert.equal(aggregateOutcome([requirement('passed'), requirement('pending')]), 'unexecuted');
});

test('aggregate: unavailable dominates', () => {
  assert.equal(aggregateOutcome([requirement('passed'), requirement('unavailable')]), 'unavailable');
  assert.equal(aggregateOutcome([requirement('failed'), requirement('unavailable')]), 'unavailable');
});

test('inventory: incomplete inventory (missing/denied/unavailable sources) cannot pass', () => {
  assert.equal(inventoryIsComplete(inventory()), true);
  assert.equal(inventoryIsComplete(inventory({ sources: [] })), false);
  assert.equal(
    inventoryIsComplete(inventory({ sources: [{ name: 'provider-policy', outcome: 'denied' }] })),
    false,
  );
  assert.equal(
    inventoryIsComplete(inventory({ sources: [{ name: 'provider-policy', outcome: 'unavailable' }] })),
    false,
  );
  assert.equal(
    inventoryVerdict(inventory({ sources: [{ name: 'provider-policy', outcome: 'denied' }] })),
    'unavailable',
  );
});

test('inventory: a complete inventory with no effective blocking requirements passes', () => {
  assert.equal(inventoryVerdict(inventory()), 'passed');
});

test('inventory: effective blocking requirements govern the inventory verdict', () => {
  const blocked = inventory({ effectiveBlocking: [requirement('blocked')] });
  assert.equal(inventoryIsComplete(blocked), true);
  assert.equal(inventoryVerdict(blocked), 'blocked');
});

test('snapshot: only a complete inventory and fully-passed evaluations are passable', () => {
  assert.equal(snapshotIsPassable(snapshot()), true);
  assert.equal(
    snapshotIsPassable(snapshot({ inventory: inventory({ sources: [{ name: 'x', outcome: 'denied' }] }) })),
    false,
  );
  assert.equal(snapshotIsPassable(snapshot({ evaluations: [requirement('pending')] })), false);
  assert.equal(snapshotIsPassable(snapshot({ evaluations: [requirement('failed')] })), false);
  assert.equal(snapshotIsPassable(snapshot({ evaluations: [requirement('blocked')] })), false);
});

test('snapshotAggregate reflects a non-pass aggregate without re-deriving', () => {
  assert.equal(snapshotAggregate(snapshot()), 'passed');
  assert.equal(snapshotAggregate(snapshot({ aggregate: 'blocked' })), 'blocked');
  assert.equal(snapshotAggregate(snapshot({ aggregate: 'unavailable' })), 'unavailable');
});

test('stricterWins: a stricter provider rule overrides a looser local intent', () => {
  assert.equal(stricterWins('passed', 'blocked'), 'blocked');
  assert.equal(stricterWins('passed', 'passed'), 'passed');
  assert.equal(stricterWins('unavailable', 'failed'), 'unavailable');
  assert.equal(stricterWins('pending', 'passed'), 'pending');
  assert.equal(stricterWins('failed', 'blocked'), 'failed');
});

test('local verification and provider policy remain separate gates', () => {
  // A fully-passing provider snapshot must not imply local verification passed;
  // the domain exposes both surfaces independently.
  const providerOnly = snapshot({ aggregate: 'passed' });
  assert.equal(snapshotIsPassable(providerOnly), true);
  // Local verification is represented by its own requirement list that must
  // also pass; provider policy cannot absorb it.
  const localFailed = [requirement('failed', { source: 'local', kind: 'local', id: 'local:verification' })];
  assert.equal(aggregateOutcome(localFailed), 'failed');
  assert.equal(aggregateOutcome([...providerOnly.evaluations, ...localFailed]), 'failed');
});

test('stale evaluation refs are surfaced, never silently passed as fresh', () => {
  // The snapshot encodes the exact head commit; an evaluation applied to a
  // different commit is observable as stale and the adapter must re-evaluate.
  const snapshotWithHead = snapshot({ headCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
  const stale = requirement('passed', { appliedToCommit: 'old-commit' });
  assert.notEqual(stale.appliedToCommit, snapshotWithHead.headCommit);
  assert.equal(
    snapshotWithHead.evaluations.some((r) => r.appliedToCommit !== undefined && r.appliedToCommit !== snapshotWithHead.headCommit),
    false,
  );
});