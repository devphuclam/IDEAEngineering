import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IntegrationCoordinator } from '../../src/domain/integration.ts';
import { FakeCanonicalQueueStore, FakePolicyAdapter, FakeSourceHostAdapter } from '../../src/adapters/fakes/revised.ts';
import type { PolicyRequirement, VerificationResult } from '../../src/domain/types.ts';

const target = { repositoryId: 'repo-1', targetRef: 'refs/heads/main' };

function request() {
  return {
    candidateWorkItemId: '1000',
    runId: 'run-1000',
    checkpoint: {
      checkpointId: 'checkpoint-1',
      runId: 'run-1000',
      branch: 'feature/work-item',
      commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      verification: [],
      unresolvedWork: [],
      nextAction: 'integrate',
      createdAt: '2026-08-14T00:00:00.000Z',
    },
    dependencies: [],
    decisions: [],
    worktreePath: process.cwd(),
    verificationCommands: ['verify'],
    title: 'Integration: work item 1000',
  };
}

class Verification {
  private readonly outcome: VerificationResult['outcome'];

  constructor(outcome: VerificationResult['outcome'] = 'passed') {
    this.outcome = outcome;
  }
  async run(commands: string[], _cwd: string): Promise<VerificationResult[]> {
    return commands.map((command) => ({ command, outcome: this.outcome }));
  }
}

test('Integration Coordinator normalizes refs and finalizes only after local and provider gates pass', async () => {
  const queue = new FakeCanonicalQueueStore(target);
  const source = new FakeSourceHostAdapter();
  const coordinator = new IntegrationCoordinator({
    queue,
    sourceHost: source,
    policies: new FakePolicyAdapter(),
    verification: new Verification(),
  });

  const result = await coordinator.integrate(request(), target);
  assert.equal(result.state, 'integrated');
  assert.equal(source.pullRequests[0]?.sourceRef, 'refs/heads/feature/work-item');
  assert.equal(source.pullRequests[0]?.targetRef, 'refs/heads/main');
  assert.equal((await queue.read(target)).value.entries.length, 0);
  assert.equal(result.policy?.aggregate, 'passed');
});

test('Integration Coordinator releases the lease when local verification fails', async () => {
  const queue = new FakeCanonicalQueueStore(target);
  const coordinator = new IntegrationCoordinator({
    queue,
    sourceHost: new FakeSourceHostAdapter(),
    policies: new FakePolicyAdapter(),
    verification: new Verification('failed'),
  });

  const result = await coordinator.integrate(request(), target);
  assert.equal(result.state, 'rejected');
  assert.equal((await queue.read(target)).value.entries[0]?.state, 'queued');
  assert.equal((await queue.read(target)).value.lease, null);
});

test('Integration Coordinator blocks a stricter provider policy without completing the PR', async () => {
  const queue = new FakeCanonicalQueueStore(target);
  const blocking: PolicyRequirement = {
    id: 'required-review',
    name: 'company review',
    source: 'company',
    kind: 'provider',
    verdict: 'blocked',
  };
  const policy = {
    inspectTarget: async () => ({ target, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'company', outcome: 'read' as const }], effectiveBlocking: [blocking] }),
    evaluatePullRequest: async (ref: Parameters<FakePolicyAdapter['evaluatePullRequest']>[0]) => ({
      target,
      pullRequestRef: ref,
      headCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      observedAt: '2026-08-14T00:00:00.000Z',
      inventory: { target, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'company', outcome: 'read' as const }], effectiveBlocking: [blocking] },
      evaluations: [blocking],
      aggregate: 'blocked' as const,
    }),
  };
  const source = new FakeSourceHostAdapter();
  const coordinator = new IntegrationCoordinator({
    queue,
    sourceHost: source,
    policies: policy,
    verification: new Verification(),
  });

  const result = await coordinator.integrate(request(), target);
  assert.equal(result.state, 'blocked');
  assert.equal(source.pullRequests.length, 1, 'the PR may be inspected, but completion is not attempted');
  assert.equal((await queue.read(target)).value.entries[0]?.state, 'blocked');
  assert.equal((await queue.read(target)).value.lease, null);
});
