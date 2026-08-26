import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzurePolicyAdapter, aggregatePolicy, mapPolicyStatus } from '../../../src/adapters/azure/policies.ts';
import { AzureHttpClient, type HttpRequest, type HttpResponse, type HttpTransport } from '../../../src/adapters/azure/http.ts';
import { SecretString } from '../../../src/adapters/azure/auth.ts';
import { FakeAzureState } from '../../../src/adapters/fakes/azure.ts';
import { policyConfigurationListDto, policyEvaluationListDto } from '../../fixtures/azure/fixtures.ts';

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

function make(evaluations: unknown) {
  const state = new FakeAzureState();
  const client = new AzureHttpClient(new PolicyTransport(state.transport(), evaluations), () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  return new AzurePolicyAdapter({ client, projectName: 'offline-project', repositoryId: '00000000-0000-0000-0000-000000000002', clock: () => '2026-08-14T00:00:00.000Z' });
}

const ref = {
  repositoryId: '00000000-0000-0000-0000-000000000002',
  pullRequestId: '42',
  url: 'https://offline.invalid/pr/42',
  sourceRef: 'refs/heads/feature/shared',
  targetRef: 'refs/heads/main',
  sourceCommit: 'offline-source-commit',
};

test('Azure policy status mapping is strict and aggregate never passes unknown requirements', () => {
  assert.equal(mapPolicyStatus('approved'), 'passed');
  assert.equal(mapPolicyStatus('queued'), 'pending');
  assert.equal(mapPolicyStatus('rejected'), 'failed');
  assert.equal(mapPolicyStatus('broken'), 'blocked');
  assert.equal(mapPolicyStatus('mystery'), 'unavailable');
  assert.equal(aggregatePolicy(['passed', 'unavailable']), 'unavailable');
  assert.equal(aggregatePolicy([]), 'passed');
});

test('Azure policy evaluation is target-specific and stricter provider policy remains visible', async () => {
  const adapter = make(policyEvaluationListDto);
  const inventory = await adapter.inspectTarget({ repositoryId: ref.repositoryId, targetRef: ref.targetRef });
  assert.equal(inventory.effectiveBlocking.length, 1);
  const snapshot = await adapter.evaluatePullRequest(ref);
  assert.equal(snapshot.headCommit, ref.sourceCommit);
  assert.equal(snapshot.evaluations[0].verdict, 'passed');
  assert.equal(snapshot.aggregate, 'passed');
});

test('missing or not-applicable policy evaluations fail closed or are excluded', async () => {
  const missing = await make({ count: 0, value: [] }).evaluatePullRequest(ref);
  assert.equal(missing.aggregate, 'unavailable');
  const notApplicable = await make({ count: 1, value: [{ configurationId: 9001, status: 'notApplicable' }] }).evaluatePullRequest(ref);
  assert.equal(notApplicable.aggregate, 'passed');
  assert.equal(notApplicable.inventory.effectiveBlocking.length, 0);
});
