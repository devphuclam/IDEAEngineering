// US4 black-box matrix: Azure Repos policies are evaluated for the exact PR
// head, every non-passing outcome stays visible, stricter provider policy wins,
// and only a complete passing snapshot is integration-passable.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureHttpClient, type HttpRequest, type HttpResponse, type HttpTransport } from '../../src/adapters/azure/http.ts';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { AzurePolicyAdapter } from '../../src/adapters/azure/policies.ts';
import { AzureSourceHostAdapter, type GitExecutor } from '../../src/adapters/azure/repos.ts';
import { FakeAzureState } from '../../src/adapters/fakes/azure.ts';
import { aggregateOutcome, snapshotIsPassable, stricterWins } from '../../src/domain/policy.ts';
import type { PolicyRequirement, PolicySnapshot, PullRequestRef } from '../../src/domain/types.ts';
import { policyConfigurationListDto, policyEvaluationListDto } from '../fixtures/azure/fixtures.ts';

const targetRef = 'refs/heads/main';
const repositoryId = '00000000-0000-0000-0000-000000000002';
const pullRequest: PullRequestRef = {
  repositoryId,
  pullRequestId: '42',
  url: 'https://offline.invalid/pr/42',
  sourceRef: 'refs/heads/feature/policy',
  targetRef,
  sourceCommit: 'offline-source-commit',
};

class PolicyTransport implements HttpTransport {
  private readonly fallback: HttpTransport;
  private readonly evaluations: unknown;

  constructor(fallback: HttpTransport, evaluations: unknown) {
    this.fallback = fallback;
    this.evaluations = evaluations;
  }

  async request(request: HttpRequest): Promise<HttpResponse> {
    const path = new URL(request.url).pathname;
    if (request.method === 'GET' && path.includes('/_apis/git/policy/configurations')) return { status: 200, headers: {}, body: JSON.stringify(policyConfigurationListDto) };
    if (request.method === 'GET' && path.includes('/_apis/policy/evaluations')) return { status: 200, headers: {}, body: JSON.stringify(this.evaluations) };
    return this.fallback.request(request);
  }
}

function policy(status: string | undefined): AzurePolicyAdapter {
  const state = new FakeAzureState();
  const evaluations = status === undefined ? { count: 0, value: [] } : { ...policyEvaluationListDto, value: [{ ...policyEvaluationListDto.value[0], status }] };
  const client = new AzureHttpClient(new PolicyTransport(state.transport(), evaluations), () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  return new AzurePolicyAdapter({ client, projectName: 'offline-project', repositoryId, clock: () => '2026-08-14T00:00:00.000Z' });
}

class GitSpy implements GitExecutor {
  readonly calls: string[][] = [];
  async run(args: string[]): Promise<{ stdout: string; stderr: string }> {
    this.calls.push(args);
    if (args[0] === 'remote' && args.length === 1) return { stdout: 'origin\n', stderr: '' };
    if (args[0] === 'remote' && args[1] === 'get-url') return { stdout: 'https://dev.azure.com/company/project/_git/repository\n', stderr: '' };
    return { stdout: '', stderr: '' };
  }
}

function synthetic(verdict: PolicyRequirement['verdict'], detail: string): PolicySnapshot {
  const requirement: PolicyRequirement = { id: 'synthetic', name: 'synthetic company gate', source: 'test', kind: 'provider', verdict, detail, appliedToCommit: 'offline-source-commit' };
  return {
    target: { repositoryId, targetRef },
    pullRequestRef: pullRequest,
    headCommit: 'offline-source-commit',
    observedAt: '2026-08-14T00:00:00.000Z',
    inventory: { target: { repositoryId, targetRef }, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'synthetic', outcome: 'read' }], effectiveBlocking: [requirement] },
    evaluations: [requirement],
    aggregate: aggregateOutcome([requirement]),
  };
}

test('Azure policy matrix preserves failed, pending, blocked, unavailable, and not-applicable outcomes', async () => {
  const statuses: Array<[string, string]> = [
    ['approved', 'passed'],
    ['queued', 'pending'],
    ['rejected', 'failed'],
    ['broken', 'blocked'],
  ];
  for (const [wireStatus, expected] of statuses) {
    const snapshot = await policy(wireStatus).evaluatePullRequest(pullRequest);
    assert.equal(snapshot.evaluations[0]?.verdict, expected, wireStatus);
    assert.equal(snapshotIsPassable(snapshot), expected === 'passed');
    assert.equal(snapshot.headCommit, pullRequest.sourceCommit);
  }
  const missing = await policy(undefined).evaluatePullRequest(pullRequest);
  assert.equal(missing.aggregate, 'unavailable');
  assert.equal(snapshotIsPassable(missing), false);
  const notApplicable = await policy('notApplicable').evaluatePullRequest(pullRequest);
  assert.equal(notApplicable.aggregate, 'passed');
  assert.equal(notApplicable.inventory.effectiveBlocking.length, 0);
});

test('unexecuted and stale evidence never becomes passable; stricter provider policy overrides local zero', () => {
  const passing = synthetic('passed', 'approved');
  assert.equal(snapshotIsPassable(passing), true);
  for (const [verdict, detail] of [
    ['unexecuted', 'required check was not run'],
    ['unavailable', 'policy inventory unavailable'],
    ['blocked', 'stale target head requires re-evaluation'],
  ] as const) {
    const snapshot = synthetic(verdict, detail);
    assert.equal(snapshotIsPassable(snapshot), false, detail);
    assert.equal(snapshot.evaluations[0]?.detail, detail);
  }
  assert.equal(stricterWins('passed', 'failed'), 'failed', 'minimum_human_approvals: 0 cannot weaken company policy');
});

test('Azure Repos black-box path enforces source branches, exact target head, idempotent PRs, and no bypass', async () => {
  const state = new FakeAzureState();
  const git = new GitSpy();
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  const source = new AzureSourceHostAdapter({ client, projectName: 'offline-project', repositoryId, targetRef, cwd: process.cwd(), git });
  assert.equal(await source.targetHead(targetRef), 'offline-target-commit');
  await assert.rejects(() => source.pushCheckpoint({
    checkpointId: 'protected',
    runId: 'run-protected',
    branch: targetRef,
    commit: '0123456789abcdef0123456789abcdef01234567',
    verification: [],
    unresolvedWork: [],
    nextAction: 'stop',
    createdAt: '2026-08-14T00:00:00.000Z',
  }, '.workspace/protected'), /source ref/i);
  state.refs.set('refs/heads/feature/policy', 'offline-source-commit');
  const request = { repositoryId, sourceRef: 'refs/heads/feature/policy', targetRef, title: 'Policy candidate', workItemId: '1000' };
  const first = await source.ensurePullRequest(request);
  const second = await source.ensurePullRequest(request);
  assert.equal(first.pullRequestId, second.pullRequestId);
  const completed = await source.completePullRequest(first, 'offline-target-commit');
  assert.equal(completed.merged, true);
  const completion = git.calls.find((args) => args.includes('bypassPolicy'));
  assert.equal(completion, undefined);
});
