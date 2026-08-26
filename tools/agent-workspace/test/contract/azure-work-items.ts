import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { AzureHttpClient } from '../../src/adapters/azure/http.ts';
import { AzureWorkItemAdapter } from '../../src/adapters/azure/boards.ts';
import { FakeAzureState } from '../../src/adapters/fakes/azure.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import type { ChangeScopeBlock, CoordinationState } from '../../src/domain/types.ts';

function setup() {
  const state = new FakeAzureState();
  const item = state.workItems.get(1000)!;
  const coordination: CoordinationState = {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1000',
    claim: null,
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  };
  const scope: ChangeScopeBlock = {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: ['src/shared.ts'],
    semanticSeams: ['shared-seam'],
    prerequisites: ['999'],
    integrationTarget: 'refs/heads/main',
  };
  item.fields['System.Description'] = replaceManagedBlock(
    replaceManagedBlock('<p>Human authored notes</p>', 'coordination-state', coordination).description,
    'change-scope',
    scope,
  ).description;
  item.fields['System.Tags'] = 'human-tag; keep-me';
  item.relations = [{ rel: 'System.Dependency', url: 'https://offline.invalid/_apis/wit/workItems/999' }];
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  const adapter = new AzureWorkItemAdapter({
    client,
    projectName: 'offline-project',
    integrationTarget: 'refs/heads/main',
    clock: () => '2026-08-14T00:00:00.000Z',
  });
  return { state, transport, adapter };
}

test('Azure Work Item reads use opaque revisions and decode relations/managed blocks', async () => {
  const { adapter } = setup();
  const snapshot = await adapter.read('1000');
  assert.equal(snapshot.revision, '1');
  assert.deepEqual(snapshot.value.item.dependencies, ['999']);
  assert.deepEqual(snapshot.value.changeScope.paths, ['src/shared.ts']);
  assert.equal(snapshot.value.coordination.workItemId, '1000');
});

test('managed updates preserve human description and unrelated tags', async () => {
  const { state, transport, adapter } = setup();
  const before = await adapter.read('1000');
  const next = structuredClone(before.value.coordination);
  next.run = { runId: 'run-1', state: 'running', startedAt: '2026-08-14T00:00:00.000Z' };
  const result = await adapter.updateManaged({
    operationId: 'work-item-update-1',
    expectedRevision: before.revision,
    actor: 'offline-user',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', coordination: next, state: 'Active' },
  });
  assert.equal(result.disposition, 'applied');
  const after = state.workItems.get(1000)!;
  assert.match(after.fields['System.Description'], /Human authored notes/);
  assert.equal(after.fields['System.Tags'], 'human-tag; keep-me');
  const patch = transport.requests.filter((request) => request.method === 'PATCH').at(-1)!;
  const operations = JSON.parse(patch.body!);
  assert.equal(operations[0].path, '/rev');
  assert.equal(operations[0].op, 'test');
  assert.equal(operations.some((operation: { path: string }) => operation.path === '/fields/System.Tags'), false);
});

test('stale Work Item revisions are explicit conflicts and do not write', async () => {
  const { state, transport, adapter } = setup();
  const before = await adapter.read('1000');
  state.workItems.get(1000)!.rev += 1;
  const writesBefore = transport.requests.filter((request) => request.method === 'PATCH').length;
  const result = await adapter.projectState({
    operationId: 'work-item-stale-1',
    expectedRevision: before.revision,
    actor: 'offline-user',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', from: 'open', to: 'claimed' },
  });
  assert.equal(result.disposition, 'conflict');
  assert.equal(transport.requests.filter((request) => request.method === 'PATCH').length, writesBefore);
});

test('neutral state projections keep the Run state aligned with provider Work Item state', async () => {
  const { adapter } = setup();
  const before = await adapter.read('1000');
  const coordination = structuredClone(before.value.coordination);
  coordination.run = { runId: 'run-state', state: 'claimed', startedAt: '2026-08-14T00:00:00.000Z' };
  const managed = await adapter.updateManaged({
    operationId: 'work-item-run-state-seed',
    expectedRevision: before.revision,
    actor: 'offline-user',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', coordination, state: 'Active' },
  });
  assert.equal(managed.disposition, 'applied');
  const projected = await adapter.projectState({
    operationId: 'work-item-run-state-project',
    expectedRevision: managed.revision,
    actor: 'offline-user',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', from: 'claimed', to: 'in-progress' },
  });
  assert.equal(projected.disposition, 'applied');
  assert.equal((await adapter.read('1000')).value.coordination.run?.state, 'running');
});

test('state projection journals its stable operation marker atomically and absorbs a post-acceptance retry', async () => {
  const { transport, adapter } = setup();
  const before = await adapter.read('1000');
  const command = {
    operationId: 'validation-1:work-item.close',
    expectedRevision: before.revision,
    actor: 'offline-user',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', from: 'open' as const, to: 'integrated' as const },
  };

  const applied = await adapter.projectState(command);
  assert.equal(applied.disposition, 'applied');
  const after = await adapter.read('1000');
  assert.deepEqual(after.value.coordination.lastAppliedOperation, {
    operationId: command.operationId,
    kind: 'work-item-state',
    outcome: 'integrated',
    at: command.requestedAt,
  });
  const statePatch = transport.requests.filter((request) => request.method === 'PATCH').at(-1)!;
  const operations = JSON.parse(statePatch.body!);
  assert.equal(operations.some((operation: { path: string }) => operation.path === '/fields/System.State'), true);
  assert.equal(operations.some((operation: { path: string; value?: string }) =>
    operation.path === '/fields/System.Description'
    && operation.value?.includes(command.operationId)), true, 'state and recovery marker must share one revision-guarded provider PATCH');

  const writesBeforeRetry = transport.requests.filter((request) => request.method === 'PATCH').length;
  const duplicate = await adapter.projectState(command);
  assert.equal(duplicate.disposition, 'duplicate');
  assert.equal(duplicate.revision, after.revision);
  assert.equal(transport.requests.filter((request) => request.method === 'PATCH').length, writesBeforeRetry);
});
