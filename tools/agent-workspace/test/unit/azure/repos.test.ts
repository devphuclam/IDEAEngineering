import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureSourceHostAdapter, type GitExecutor } from '../../../src/adapters/azure/repos.ts';
import { AzureHttpClient } from '../../../src/adapters/azure/http.ts';
import { SecretString } from '../../../src/adapters/azure/auth.ts';
import { FakeAzureState } from '../../../src/adapters/fakes/azure.ts';

class GitSpy implements GitExecutor {
  readonly calls: Array<{ args: string[]; env?: NodeJS.ProcessEnv }> = [];
  async run(args: string[], _cwd: string, env?: NodeJS.ProcessEnv): Promise<{ stdout: string; stderr: string }> {
    this.calls.push({ args, env });
    if (args[0] === 'remote') {
      if (args.length === 1) return { stdout: 'origin\n', stderr: '' };
      if (args[1] === 'get-url') return { stdout: 'https://dev.azure.com/company/project/_git/repository\n', stderr: '' };
    }
    return { stdout: '', stderr: '' };
  }
}

function adapter() {
  const state = new FakeAzureState();
  const git = new GitSpy();
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  const source = new AzureSourceHostAdapter({
    client,
    projectName: 'offline-project',
    repositoryId: '00000000-0000-0000-0000-000000000002',
    targetRef: 'refs/heads/main',
    cwd: process.cwd(),
    git,
    auth: { source: 'pat-fallback', credential: SecretString.from('secret-token'), detail: 'test only' },
  });
  return { state, git, source, transport };
}

test('Azure Repos target and PR operations use structured refs and exact target heads', async () => {
  const { source, state, transport } = adapter();
  assert.equal(await source.targetHead('refs/heads/main'), 'offline-target-commit');
  await assert.rejects(() => source.targetHead('main'), /target ref/);
  state.refs.set('refs/heads/feature/shared', 'offline-source-commit');
  const request = {
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef: 'refs/heads/feature/shared',
    targetRef: 'refs/heads/main',
    title: 'Integrate shared',
    workItemId: '1000',
  };
  const first = await source.ensurePullRequest(request);
  const second = await source.ensurePullRequest(request);
  assert.equal(first.pullRequestId, second.pullRequestId);
  assert.deepEqual(first.workItemIds, ['1000']);
  assert.equal(state.pullRequests.length, 1);
  const completed = await source.completePullRequest(first, 'offline-target-commit');
  assert.equal(completed.merged, true);
  assert.notEqual(completed.targetCommit, 'offline-target-commit');
  assert.equal(await source.targetHead('refs/heads/main'), completed.targetCommit);
  assert.equal(completed.pullRequestRef.mergeCommit, completed.targetCommit);
  assert.equal(completed.pullRequestRef.mergeStatus, 'succeeded');
  const patch = transport.requests.find((item) => item.method === 'PATCH' && item.url.includes('pullrequests'));
  assert.ok(patch);
  assert.equal(patch.body?.includes('bypassPolicy'), false);
  const patchBody = JSON.parse(patch.body ?? '{}') as Record<string, { commitId?: string }>;
  assert.equal(patchBody.lastMergeSourceCommit?.commitId, 'offline-source-commit');
  assert.equal(patchBody.lastMergeTargetCommit?.commitId, 'offline-target-commit');
});

test('Azure Repos PR idempotency includes repository, source, target, and candidate Work Item', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/feature/work-item-identity';
  state.refs.set(sourceRef, 'offline-source-commit');
  const request = {
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Candidate 1000',
    workItemId: '1000',
  };
  await source.ensurePullRequest(request);
  await assert.rejects(
    () => source.ensurePullRequest({ ...request, title: 'Candidate 2000', workItemId: '2000' }),
    /candidate Work Item/i,
  );
  await assert.rejects(
    () => source.ensurePullRequest({ ...request, repositoryId: '00000000-0000-0000-0000-000000000099' }),
    /repository/i,
  );
  assert.equal(state.pullRequests.length, 1);
});

test('checkpoint push rejects the protected target and keeps credentials out of git arguments', async () => {
  const { source, git } = adapter();
  await assert.rejects(() => source.pushCheckpoint({
    checkpointId: 'checkpoint-1',
    runId: 'run-1',
    branch: 'refs/heads/main',
    commit: '0123456789abcdef0123456789abcdef01234567',
    verification: [],
    unresolvedWork: [],
    nextAction: 'continue',
    createdAt: '2026-08-14T00:00:00.000Z',
  }, '.worktrees/run-1'), /source ref/);
  await source.pushCheckpoint({
    checkpointId: 'checkpoint-2',
    runId: 'run-1',
    branch: 'refs/heads/feature/shared',
    commit: '0123456789abcdef0123456789abcdef01234567',
    verification: [],
    unresolvedWork: [],
    nextAction: 'continue',
    createdAt: '2026-08-14T00:00:00.000Z',
  }, '.worktrees/run-1');
  const push = git.calls.find((call) => call.args[0] === 'push');
  assert.ok(push);
  assert.equal(push.args.includes('secret-token'), false);
  assert.match(push.env?.GIT_CONFIG_VALUE_0 ?? '', /Authorization:/);
});

test('Azure Repos validation artifacts create, read, abandon, and delete only at the expected source head', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-1/source-branch';
  const created = await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  assert.deepEqual(created, { sourceRef, headCommit: 'offline-target-commit' });
  assert.equal(await source.sourceHead!(sourceRef), 'offline-target-commit');
  await assert.rejects(
    () => source.createSourceBranch!(sourceRef, 'offline-target-commit'),
    /already exists/,
    'normal validation must not adopt a pre-existing branch even when its head happens to match',
  );

  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-1',
    description: 'Agent Workspace live validation marker: run-1',
    workItemId: '1000',
  });
  const reread = await source.readPullRequest(pullRequest);
  assert.equal(reread.description, 'Agent Workspace live validation marker: run-1');
  assert.equal(state.pullRequests[0].status, 'active');
  await source.abandonPullRequest!(reread, 'offline-target-commit');
  assert.equal(state.pullRequests[0].status, 'abandoned');

  await assert.rejects(() => source.deleteSourceBranch!(sourceRef, 'drifted-head'), /head drifted/);
  await source.deleteSourceBranch!(sourceRef, 'offline-target-commit');
  assert.equal(await source.sourceHead!(sourceRef), undefined);
  await assert.rejects(() => source.deleteSourceBranch!('refs/heads/main', 'offline-target-commit'), /source ref/);
});

test('Azure Repos abandonment guards source-head drift and reports a race after the adapter reads it', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-abandon-race/source-branch';
  await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-abandon-race',
    description: 'Agent Workspace validation marker: run-abandon-race',
    workItemId: '1000',
  });
  let injected = false;
  state.beforeRequest = (request, provider) => {
    if (!injected && request.method === 'PATCH' && request.url.includes('/pullrequests/')) {
      injected = true;
      provider.refs.set(sourceRef, 'racing-source-commit');
    }
  };

  await assert.rejects(
    () => source.abandonPullRequest!(pullRequest, 'offline-target-commit'),
    /source head changed during abandonment|manual recovery/i,
  );
  assert.equal(injected, true);
  assert.equal(state.pullRequests[0].status, 'abandoned');
});

test('Azure Repos completion fails closed when the pull-request source head drifts', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-drift/source-branch';
  await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-drift',
    description: 'Agent Workspace live validation marker: run-drift',
    workItemId: '1000',
  });

  state.refs.set(sourceRef, 'drifted-source-commit');

  await assert.rejects(
    () => source.completePullRequest(pullRequest, 'offline-target-commit'),
    /source (?:commit|head) drifted/,
  );
  assert.equal(state.pullRequests[0].status, 'active');
});

test('Azure Repos completion fails closed when the target head drifts', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-target-drift/source-branch';
  await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-target-drift',
    description: 'Agent Workspace live validation marker: run-target-drift',
    workItemId: '1000',
  });
  state.refs.set('refs/heads/main', 'drifted-target-commit');
  await assert.rejects(() => source.completePullRequest(pullRequest, 'offline-target-commit'), /target commit drifted/);
  assert.equal(state.pullRequests[0].status, 'active');
});

test('Azure Repos server-side source and target CAS rejects a race after adapter head reads', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-cas-race/source-branch';
  await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-cas-race',
    description: 'Agent Workspace live validation marker: run-cas-race',
    workItemId: '1000',
  });
  let injected = false;
  state.beforeRequest = (request, provider) => {
    if (!injected && request.method === 'PATCH' && request.url.includes('/pullrequests/')) {
      injected = true;
      provider.refs.set(sourceRef, 'racing-source-commit');
    }
  };

  await assert.rejects(() => source.completePullRequest(pullRequest, 'offline-target-commit'));
  assert.equal(injected, true);
  assert.equal(state.pullRequests[0].status, 'active');
  assert.equal(state.refs.get('refs/heads/main'), 'offline-target-commit');
});

test('Azure Repos blocks when the target changes after merge acceptance but before post-merge verification', async () => {
  const { source, state } = adapter();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-post-merge-race/source-branch';
  await source.createSourceBranch!(sourceRef, 'offline-target-commit');
  const pullRequest = await source.ensurePullRequest({
    repositoryId: '00000000-0000-0000-0000-000000000002',
    sourceRef,
    targetRef: 'refs/heads/main',
    title: 'Agent Workspace validation run-post-merge-race',
    description: 'Agent Workspace live validation marker: run-post-merge-race',
    workItemId: '1000',
  });
  let completionAccepted = false;
  let driftInjected = false;
  state.beforeRequest = (request, provider) => {
    if (request.method === 'PATCH' && request.url.includes('/pullrequests/')) completionAccepted = true;
    if (completionAccepted && !driftInjected && request.method === 'GET' && request.url.includes('/refs?')) {
      driftInjected = true;
      provider.refs.set('refs/heads/main', 'unexpected-post-merge-target');
    }
  };

  await assert.rejects(
    () => source.completePullRequest(pullRequest, 'offline-target-commit'),
    /post-merge target head/,
  );
  assert.equal(completionAccepted, true);
  assert.equal(driftInjected, true);
  assert.equal(state.pullRequests[0].status, 'completed');
  assert.equal(state.refs.get('refs/heads/main'), 'unexpected-post-merge-target');
});
