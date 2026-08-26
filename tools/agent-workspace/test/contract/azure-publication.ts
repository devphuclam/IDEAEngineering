import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureEvidenceStore } from '../../src/adapters/azure/evidence.ts';
import { AzureHttpClient, type HttpRequest, type HttpResponse, type HttpTransport } from '../../src/adapters/azure/http.ts';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { FakeAzureState, FakeAzureTransport } from '../../src/adapters/fakes/azure.ts';
import { parseCoordinationState, replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { evidenceForRun } from '../../src/domain/evidence.ts';
import type { RunEvidence } from '../../src/domain/types.ts';

type CrashPoint = 'before-patch' | 'after-patch' | 'after-comment' | 'before-clear';

class CrashTransport implements HttpTransport {
  private readonly inner: FakeAzureTransport;
  private patchCount = 0;
  private commentCount = 0;
  private crashed = false;
  private readonly point: CrashPoint;

  constructor(state: FakeAzureState, point: CrashPoint) {
    this.point = point;
    this.inner = state.transport();
  }

  async request(request: HttpRequest): Promise<HttpResponse> {
    const isComment = /\/comments(?:\?|$)/i.test(request.url);
    const isCommentPost = isComment && request.method === 'POST';
    const isPatch = request.method === 'PATCH' && /\/wit\/workitems\//i.test(request.url);
    if (this.point === 'before-patch' && isPatch && !this.crashed) {
      this.crashed = true;
      throw new Error('simulated crash before PATCH');
    }
    if (this.point === 'after-patch' && isPatch && this.patchCount === 0) {
      const response = await this.inner.request(request);
      this.patchCount += 1;
      return response;
    }
    if (this.point === 'after-patch' && isCommentPost && !this.crashed) {
      this.crashed = true;
      throw new Error('simulated crash after PATCH');
    }
    if (this.point === 'after-comment' && isCommentPost && this.commentCount === 0) {
      const response = await this.inner.request(request);
      this.commentCount += 1;
      this.crashed = true;
      throw new Error('simulated crash after comment POST');
    }
    if (this.point === 'before-clear' && isPatch && this.patchCount >= 1 && !this.crashed) {
      this.crashed = true;
      throw new Error('simulated crash before clear');
    }
    const response = await this.inner.request(request);
    if (isPatch) this.patchCount += 1;
    if (isCommentPost) this.commentCount += 1;
    return response;
  }
}

function evidence(): RunEvidence {
  return evidenceForRun('run-publication', '1000', 'alice');
}

function prepareState(state: FakeAzureState): void {
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
}

function store(state: FakeAzureState, transport: HttpTransport): AzureEvidenceStore {
  return new AzureEvidenceStore({
    client: new AzureHttpClient(transport, () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization'),
    projectName: 'offline-project',
    integrationTarget: 'refs/heads/main',
    clock: () => '2026-08-14T00:00:00.000Z',
  });
}

for (const point of ['after-patch', 'after-comment', 'before-clear'] as const) {
  test(`T049: pending publication recovers exactly once when a crash occurs ${point}`, async () => {
    const state = new FakeAzureState();
    prepareState(state);
    const crashing = store(state, new CrashTransport(state, point));
    await assert.rejects(() => crashing.publish({ operationId: `publication-${point}`, expectedRevision: '1', actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: evidence() }));
    const recovering = store(state, state.transport());
    const repaired = await recovering.reconcilePending('1000');
    assert.equal(repaired.published, true);
    const recoveredEvidence = await recovering.list('1000');
    assert.equal(recoveredEvidence.filter((entry) => entry.runId === 'run-publication').length, 1);
    assert.equal((await recovering.reconcilePending('1000')).published, true);
    const item = state.workItems.get(1000)!;
    const description = item.fields['System.Description'];
    assert.match(description, /COORDINATION-STATE:V1:BEGIN/);
    assert.equal(parseCoordinationState(description).value.pendingPublication, null);
  });
}

test('T049: a crash before PATCH leaves no provider mutation and a retry can publish once', async () => {
  const state = new FakeAzureState();
  prepareState(state);
  const crashing = store(state, new CrashTransport(state, 'before-patch'));
  await assert.rejects(() => crashing.publish({ operationId: 'publication-before-patch', expectedRevision: '1', actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: evidence() }));
  assert.equal(state.workItems.get(1000)!.rev, 1);
  assert.equal(state.comments.get(1000)!.length, 0);
  const retry = store(state, state.transport());
  const result = await retry.publish({ operationId: 'publication-before-patch', expectedRevision: '1', actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: evidence() });
  assert.equal(result.disposition, 'applied');
  assert.equal((await retry.list('1000')).length, 1);
});
