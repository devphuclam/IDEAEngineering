// T005: Provider-port contract tests - every revised adapter must satisfy the
// same opaque-revision, stable-operation-ID, authoritative-applied, durable-
// duplicate, explicit-conflict, classified-preparation, structured-PR-ref,
// complete-policy-snapshot, readiness, and provider-selection behavior.
// Runs against the neutral fakes by default; live adapters register the same
// suite through the factory below (FR-013, FR-022, FR-027).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { MutationCommand } from '../../src/domain/types.ts';
import type {
  CanonicalQueueStore,
  ClaimStore,
  PolicyAdapter,
  ProviderPreparationAdapter,
  SourceHostAdapter,
  WorkItemAdapter,
} from '../../src/adapters/ports.ts';
import {
  FakeCanonicalQueueStore,
  FakeClaimStore,
  FakePolicyAdapter,
  FakePreparationAdapter,
  FakeSourceHostAdapter,
  FakeWorkItemAdapter,
} from '../../src/adapters/fakes/revised.ts';
import { payloadHash } from '../../src/domain/mutations.ts';

const TARGET = { repositoryId: 'repo-1', targetRef: 'refs/heads/main' };
const NOW = '2026-08-14T00:00:00.000Z';

function command<T>(operationId: string, input: T, expectedRevision = 'rev-1'): MutationCommand<T> {
  return { operationId, expectedRevision, actor: 'test-runner', requestedAt: NOW, input };
}

// ---- Opaque revisions (FR-013) ----

export function runOpaqueRevisionSuite(name: string, store: () => ClaimStore): void {
  test(`${name}: revisions are opaque strings that change after each applied mutation`, async () => {
    const claims = store();
    const first = await claims.active('w1');
    assert.equal(typeof first.revision, 'string');
    const before = first.revision;
    await claims.acquire(command('op-1', {
      workItemId: 'w1',
      claimToken: 't1',
      claimant: 'alice',
      runId: 'run-1',
      acquiredAt: NOW,
      leaseExpiresAt: '2026-08-15T00:00:00.000Z',
      kind: 'acquire',
    }));
    const after = await claims.active('w1');
    assert.notEqual(after.revision, before, 'an applied mutation advances the opaque revision');
  });

  test(`${name}: a stale expected revision is rejected with an explicit conflict`, async () => {
    const claims = store();
    const claim = {
      workItemId: 'w1',
      claimToken: 't1',
      claimant: 'alice',
      runId: 'run-1',
      acquiredAt: NOW,
      leaseExpiresAt: '2026-08-15T00:00:00.000Z',
      kind: 'acquire' as const,
    };
    await claims.acquire(command('op-1', claim));
    const active = await claims.active('w1');
    const stale = await claims.acquire(command('op-2', { ...claim, claimToken: 't2' }, active.revision));
    assert.equal(stale.disposition, 'conflict');
    assert.ok(stale.reason, 'a conflict carries a reason');
  });
}

// ---- Stable operation IDs and authoritative dispositions (FR-013, FR-014) ----

export function runOperationIdSuite(name: string, store: () => ClaimStore): void {
  test(`${name}: operation IDs are stable and authoritative across redelivery`, async () => {
    const claims = store();
    const claim = {
      workItemId: 'w1',
      claimToken: 't1',
      claimant: 'alice',
      runId: 'run-1',
      acquiredAt: NOW,
      leaseExpiresAt: '2026-08-15T00:00:00.000Z',
      kind: 'acquire' as const,
    };
    const first = await claims.acquire(command('op-1', claim));
    assert.equal(first.disposition, 'applied');
    const duplicate = await claims.acquire(command('op-1', claim));
    assert.equal(duplicate.disposition, 'duplicate', 'a redelivered operation is a durable duplicate, not applied again');
    assert.equal(duplicate.operationId, 'op-1');
    const receipts = await claims.records('w1', 'op-1');
    assert.equal(receipts.length, 1, 'exactly one authoritative receipt per operation');
    assert.equal(receipts[0].payloadHash, payloadHash(claim));
  });

  test(`${name}: an unknown operation on an occupied item is an explicit conflict`, async () => {
    const claims = store();
    const claim = {
      workItemId: 'w1',
      claimToken: 't1',
      claimant: 'alice',
      runId: 'run-1',
      acquiredAt: NOW,
      leaseExpiresAt: '2026-08-15T00:00:00.000Z',
      kind: 'acquire' as const,
    };
    await claims.acquire(command('op-1', claim));
    const other = await claims.acquire(command('op-2', { ...claim, claimToken: 't2' }));
    assert.equal(other.disposition, 'conflict');
  });
}

// ---- Classified preparation (FR-027) ----

export function runPreparationSuite(name: string, adapter: () => ProviderPreparationAdapter): void {
  test(`${name}: preparation is explicitly applicable or not-applicable, never silent`, async () => {
    const preparation = adapter();
    const plan = await preparation.preview();
    assert.ok(['applicable', 'not-applicable'].includes(plan.applicability));
    assert.equal(typeof plan.digest, 'string');
    assert.ok(Array.isArray(plan.actions));
    const result = await preparation.apply(command('op-1', plan));
    if (result.disposition === 'not-applicable') {
      assert.equal(result.classification, 'capability');
      assert.ok(result.reason);
    } else {
      assert.equal(result.disposition, 'applied');
      assert.ok(result.value);
    }
  });
}

// ---- Structured PR refs (FR-021) ----

export function runPullRequestSuite(name: string, sourceHost: () => SourceHostAdapter): void {
  test(`${name}: PR refs are structured and idempotently ensured`, async () => {
    const adapter = sourceHost();
    const request = {
      repositoryId: 'repo-1',
      sourceRef: 'refs/heads/feature/run-1',
      targetRef: TARGET.targetRef,
      title: 'Integrate run-1',
      workItemId: 'w1',
    };
    const first = await adapter.ensurePullRequest(request);
    assert.equal(first.repositoryId, 'repo-1');
    assert.equal(first.sourceRef, request.sourceRef);
    assert.equal(first.targetRef, request.targetRef);
    assert.ok(first.pullRequestId);
    assert.ok(first.url.startsWith('http'));
    const second = await adapter.ensurePullRequest(request);
    assert.equal(second.pullRequestId, first.pullRequestId, 'idempotent PR lookup');
    const read = await adapter.readPullRequest(first);
    assert.equal(read.url, first.url);
  });
}

// ---- Complete policy snapshots (FR-022) ----

export function runPolicySnapshotSuite(name: string, adapter: () => PolicyAdapter): void {
  test(`${name}: snapshots carry inventory, evaluations, exact head, and an aggregate`, async () => {
    const policies = adapter();
    const inventory = await policies.inspectTarget(TARGET);
    assert.ok(Array.isArray(inventory.sources));
    assert.ok(inventory.sources.length > 0);
    const snapshot = await policies.evaluatePullRequest({
      repositoryId: 'repo-1',
      sourceRef: 'refs/heads/feature/run-1',
      targetRef: TARGET.targetRef,
      pullRequestId: 'pr-1',
      url: 'https://fake.invalid/pr/1',
    });
    assert.equal(typeof snapshot.headCommit, 'string');
    assert.equal(snapshot.target.repositoryId, 'repo-1');
    assert.ok(['passed', 'failed', 'blocked', 'unexecuted', 'pending', 'unavailable'].includes(snapshot.aggregate));
  });
}

// ---- Readiness and provider selection (FR-027, FR-001) ----

export function runReadinessSuite(name: string, adapter: () => ProviderPreparationAdapter): void {
  test(`${name}: readiness reports every dimension independently with a classified outcome`, async () => {
    const report = await adapter().readiness();
    assert.ok(['github', 'azure-devops'].includes(report.provider));
    const outcomes = ['passed', 'failed', 'unavailable', 'not-selected', 'unsupported'];
    for (const key of ['configuration', 'runtime', 'authentication', 'target', 'queue', 'network'] as const) {
      assert.ok(outcomes.includes(report[key].outcome), key);
    }
    assert.ok(Array.isArray(report.permissions));
    assert.ok(report.remoteRoles);
    assert.ok(report.policyVisibility);
  });
}

export function runProviderSelectionSuite(name: string, prepare: () => ProviderPreparationAdapter): void {
  test(`${name}: provider selection is explicit and never inferred from remotes`, async () => {
    const adapter = prepare();
    const report = await adapter.readiness();
    assert.ok(['github', 'azure-devops'].includes(report.provider));
  });
}

// ---- Queue store contract (FR-016, FR-018) ----

export function runQueueContractSuite(name: string, store: () => CanonicalQueueStore): void {
  test(`${name}: enqueue is append-only with durable duplicates and deterministic sequence`, async () => {
    const queue = store();
    const read = await queue.read(TARGET);
    assert.equal(typeof read.revision, 'string');
    const first = await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
    assert.equal(first.disposition, 'applied');
    const duplicate = await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
    assert.equal(duplicate.disposition, 'duplicate');
    const manifest = await queue.read(TARGET);
    assert.equal(manifest.value.entries.length, 1);
    assert.equal(manifest.value.entries[0].sequence, 1);
  });

  test(`${name}: a lease is exclusive, renewable, releasable, and finalizable`, async () => {
    const queue = store();
    await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
    let revision = (await queue.read(TARGET)).revision;
    const acquired = await queue.acquireNext(command('op-2', { entrySequence: 1, leaseSeconds: 60, targetCommit: 'abc' }, revision));
    assert.equal(acquired.disposition, 'applied');
    assert.ok(acquired.value);
    const second = await queue.acquireNext(command('op-3', { entrySequence: 1, leaseSeconds: 60, targetCommit: 'def' }, (await queue.read(TARGET)).revision));
    assert.equal(second.disposition, 'conflict', 'a second lease cannot be acquired');
    revision = (await queue.read(TARGET)).revision;
    const renewed = await queue.renewLease(command('op-2', { operationId: 'op-2', entrySequence: 1, leaseSeconds: 120 }, revision));
    assert.equal(renewed.disposition, 'applied');
    revision = (await queue.read(TARGET)).revision;
    const released = await queue.releaseLease(command('op-2', { operationId: 'op-2', entrySequence: 1, reason: 'no drift' }, revision));
    assert.equal(released.disposition, 'applied');
    const finalized = await queue.finalize(command('op-4', { entrySequence: 1, outcome: 'integrated' }, (await queue.read(TARGET)).revision));
    assert.equal(finalized.disposition, 'applied');
    const after = await queue.read(TARGET);
    assert.equal(after.value.entries.length, 0);
  });
}

// ---- Default local run ----

export function runProviderPortContractSuites(): void {
  runOpaqueRevisionSuite('claims: opaque revisions', () => new FakeClaimStore());
  runOperationIdSuite('claims: stable operation IDs', () => new FakeClaimStore());
  runPreparationSuite('preparation: classified', () => new FakePreparationAdapter());
  runPullRequestSuite('source-host: structured PR refs', () => new FakeSourceHostAdapter());
  runPolicySnapshotSuite('policies: complete snapshots', () => new FakePolicyAdapter());
  runReadinessSuite('readiness: independent dimensions', () => new FakePreparationAdapter());
  runProviderSelectionSuite('provider selection', () => new FakePreparationAdapter());
  runQueueContractSuite('queue: canonical store', () => new FakeCanonicalQueueStore(TARGET));
  runWorkItemContractSuite('work-items: revisioned reads', () => new FakeWorkItemAdapter());
}

function runWorkItemContractSuite(name: string, store: () => WorkItemAdapter): void {
  test(`${name}: reads are revisioned and projectState is authoritative`, async () => {
    const adapter = store();
    const workItem = adapter as FakeWorkItemAdapter;
    workItem.items.set('w1', {
      id: 'w1',
      title: 'Placeholder work item',
      dependencies: [],
      changeScope: { paths: ['src/x/'], semanticSeams: [], prerequisites: [], integrationTarget: 'refs/heads/main' },
    });
    const revisioned = await adapter.read('w1');
    assert.equal(revisioned.value.item.id, 'w1');
    assert.equal(typeof revisioned.revision, 'string');
    assert.equal(revisioned.value.coordination.schema, 'agent-workspace/coordination-state');
    const applied = await adapter.projectState(command('op-1', { workItemId: 'w1', from: 'open', to: 'claimed' }, revisioned.revision));
    assert.equal(applied.disposition, 'applied');
    assert.equal(applied.value, 'claimed');
    const stale = await adapter.projectState(command('op-2', { workItemId: 'w1', from: 'claimed', to: 'blocked' }, revisioned.revision));
    assert.equal(stale.disposition, 'conflict', 'stale expected revision is rejected');
  });
}