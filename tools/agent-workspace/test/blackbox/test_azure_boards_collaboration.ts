// US2 black-box journey: two independent contexts collaborate through Azure
// Boards state, while scope/owner/checkpoint/handoff and stale discrepancies
// remain provider-visible.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureSourceHostAdapter, type GitExecutor } from '../../src/adapters/azure/repos.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { makeOfflineAzureAdapters } from '../fixtures/azure/harness.ts';
import type { ChangeScopeBlock, CoordinationState, MutationCommand, ClaimRecord, HandoffRecord } from '../../src/domain/types.ts';

const NOW = '2026-08-14T00:00:00.000Z';

class OfflineGit implements GitExecutor {
  async run(args: string[]): Promise<{ stdout: string; stderr: string }> {
    if (args[0] === 'remote' && args.length === 1) return { stdout: 'origin\n', stderr: '' };
    if (args[0] === 'remote' && args[1] === 'get-url') return { stdout: 'https://offline.invalid/company-repository.git\n', stderr: '' };
    return { stdout: '', stderr: '' };
  }
}

function scope(workItemId: string): ChangeScopeBlock {
  return {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: [`src/${workItemId}.ts`],
    semanticSeams: [`seam-${workItemId}`],
    prerequisites: [],
    integrationTarget: 'refs/heads/main',
  };
}

function coordination(workItemId: string): CoordinationState {
  return {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId,
    claim: null,
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  };
}

function seedCandidate(state: ReturnType<typeof makeOfflineAzureAdapters>['state'], id: number, workItemId = String(id)): void {
  const item = state.workItems.get(id)!;
  item.fields['System.Description'] = replaceManagedBlock(
    replaceManagedBlock('<p>Human-owned note</p>', 'coordination-state', coordination(workItemId)).description,
    'change-scope',
    scope(workItemId),
  ).description;
  item.fields['System.Tags'] = 'candidate; retain-me';
}

function command<T>(expectedRevision: string, operationId: string, input: T): MutationCommand<T> {
  return { operationId, expectedRevision, actor: 'offline-agent', requestedAt: NOW, input };
}

function claim(workItemId: string, claimant: string, runId: string, token: string): ClaimRecord {
  return {
    workItemId,
    claimToken: token,
    claimant,
    runId,
    acquiredAt: NOW,
    leaseExpiresAt: '2026-08-14T01:00:00.000Z',
    kind: 'acquire',
  };
}

test('two Boards contexts coordinate distinct items, one winner, scope, checkpoint, and handoff', async () => {
  const first = makeOfflineAzureAdapters();
  seedCandidate(first.state, 1000);
  const secondId = first.state.seed({
    'System.Title': 'Second candidate',
    'System.Description': '<p>Human-owned note</p>',
    'System.State': 'New',
    'System.Tags': 'candidate',
  });
  seedCandidate(first.state, secondId);

  const alice = first;
  const bob = makeOfflineAzureAdapters(first.state);
  const aliceClaim = await alice.claims.acquire(command('1', 'boards-claim-alice', claim('1000', 'alice', 'run-alice', 'token-alice')));
  assert.equal(aliceClaim.disposition, 'applied');
  const bobLoser = await bob.claims.acquire(command('1', 'boards-claim-bob', claim('1000', 'bob', 'run-bob', 'token-bob')));
  assert.equal(bobLoser.disposition, 'conflict');
  const bobOther = await bob.claims.acquire(command('1', 'boards-claim-bob-other', claim(String(secondId), 'bob', 'run-bob-other', 'token-bob-other')));
  assert.equal(bobOther.disposition, 'applied');

  const visible = await bob.boards.read('1000');
  assert.equal(visible.value.coordination.claim?.claimant, 'alice');
  assert.deepEqual(visible.value.changeScope.paths, ['src/1000.ts']);
  assert.deepEqual(visible.value.item.dependencies, []);

  const source = new AzureSourceHostAdapter({
    client: alice.client,
    projectName: 'offline-project',
    repositoryId: '00000000-0000-0000-0000-000000000002',
    targetRef: 'refs/heads/main',
    cwd: process.cwd(),
    git: new OfflineGit(),
  });
  const checkpoint = {
    checkpointId: 'checkpoint-alice',
    runId: 'run-alice',
    branch: 'feature/1000',
    commit: '0123456789abcdef0123456789abcdef01234567',
    verification: [{ command: 'npm test', outcome: 'passed' as const }],
    unresolvedWork: [],
    nextAction: 'handoff',
    createdAt: NOW,
  };
  await source.recordCheckpoint('1000', checkpoint);
  assert.equal((await source.readCheckpoints('1000'))[0]?.checkpointId, checkpoint.checkpointId);

  const active = await alice.claims.active('1000');
  const handedOff = await alice.claims.handoff(command(active.revision, 'boards-handoff', {
    previousOwner: 'alice',
    replacementOwner: 'carol',
    checkpoint,
    unresolvedRisks: ['reviewer policy is still provider-owned'],
    nextAction: 'continue',
    recordedAt: NOW,
  } satisfies HandoffRecord));
  assert.equal(handedOff.disposition, 'applied');
  const afterHandoff = await makeOfflineAzureAdapters(first.state);
  assert.equal((await afterHandoff.claims.active('1000')).value?.claimant, 'carol');
  assert.deepEqual((await afterHandoff.boards.read('1000')).value.changeScope.semanticSeams, ['seam-1000']);
});

test('Boards reports stale discrepancy and rejects protected-target checkpoint mutation', async () => {
  const adapters = makeOfflineAzureAdapters();
  seedCandidate(adapters.state, 1000);
  const before = await adapters.boards.read('1000');
  adapters.state.workItems.get(1000)!.rev += 1;
  const stale = await adapters.boards.projectState(command(before.revision, 'boards-stale-state', {
    workItemId: '1000',
    from: 'open',
    to: 'claimed',
  }));
  assert.equal(stale.disposition, 'conflict');
  assert.match(stale.reason ?? '', /stale|revision/i);
  assert.equal((await adapters.boards.read('1000')).revision, '2');

  const source = new AzureSourceHostAdapter({
    client: adapters.client,
    projectName: 'offline-project',
    repositoryId: '00000000-0000-0000-0000-000000000002',
    targetRef: 'refs/heads/main',
    cwd: process.cwd(),
    git: new OfflineGit(),
  });
  await assert.rejects(
    () => source.pushCheckpoint({
      checkpointId: 'checkpoint-protected',
      runId: 'run-protected',
      branch: 'refs/heads/main',
      commit: '0123456789abcdef0123456789abcdef01234567',
      verification: [],
      unresolvedWork: [],
      nextAction: 'stop',
      createdAt: NOW,
    }, '.workspace/protected'),
    /source ref/i,
  );
});
