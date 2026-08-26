import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureSourceHostAdapter, type GitExecutor } from '../../../src/adapters/azure/repos.ts';
import { AzureHttpClient } from '../../../src/adapters/azure/http.ts';
import { SecretString } from '../../../src/adapters/azure/auth.ts';
import { FakeAzureState } from '../../../src/adapters/fakes/azure.ts';

class FakeGit implements GitExecutor {
  readonly remotes = new Map<string, { fetch: string; push: string }>([
    ['origin', { fetch: 'https://github.com/personal/project.git', push: 'https://github.com/personal/project.git' }],
    ['template-upstream', { fetch: 'https://github.com/devphuclam/CodespaceTemplate.git', push: 'https://github.com/devphuclam/CodespaceTemplate.git' }],
  ]);

  async run(args: string[]): Promise<{ stdout: string; stderr: string }> {
    if (args[0] !== 'remote') return { stdout: '', stderr: '' };
    if (args[1] === undefined) return { stdout: [...this.remotes.keys()].join('\n') + '\n', stderr: '' };
    if (args[1] === 'get-url') {
      const push = args[2] === '--push';
      const name = args.at(-1)!;
      return { stdout: ((push ? this.remotes.get(name)?.push : this.remotes.get(name)?.fetch) ?? '') + '\n', stderr: '' };
    }
    if (args[1] === 'set-url') {
      const push = args[2] === '--push';
      const name = push ? args[3] : args[2];
      const url = push ? args[4] : args[3];
      const remote = this.remotes.get(name!);
      if (!remote) throw new Error('remote not found');
      if (push) remote.push = url!;
      else remote.fetch = url!;
      return { stdout: '', stderr: '' };
    }
    return { stdout: '', stderr: '' };
  }
}

function makeAdapter(git: FakeGit): AzureSourceHostAdapter {
  const state = new FakeAzureState();
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-token'), 'https://offline.invalid/offline-organization');
  return new AzureSourceHostAdapter({
    client,
    projectName: 'offline-project',
    repositoryId: '00000000-0000-0000-0000-000000000002',
    targetRef: 'refs/heads/main',
    cwd: process.cwd(),
    git,
    companyOriginUrl: 'https://dev.azure.com/company/project/_git/repository',
  });
}

function adoptionPlanInput() {
  return {
    repositoryId: '00000000-0000-0000-0000-000000000002',
    originRoleName: 'origin',
    templateUpstreamRoleName: 'template-upstream',
    templateUpstreamUrl: 'https://github.com/devphuclam/CodespaceTemplate.git',
    companyOriginUrl: 'https://dev.azure.com/company/project/_git/repository',
  };
}

test('adoption preview is a digestable, non-mutating plan', async () => {
  const git = new FakeGit();
  const adapter = makeAdapter(git);
  const before = structuredClone([...git.remotes]);
  const plan = await adapter.previewAdoption(adoptionPlanInput());
  assert.match(plan.digest, /^sha256:/);
  assert.deepEqual([...git.remotes], before);
});

test('adoption makes Azure origin the only push-capable remote', async () => {
  const git = new FakeGit();
  const adapter = makeAdapter(git);
  const plan = await adapter.previewAdoption(adoptionPlanInput());
  const result = await adapter.applyAdoption({
    operationId: 'adopt-1',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(result.disposition, 'applied');
  assert.equal(git.remotes.get('origin')?.fetch, 'https://dev.azure.com/company/project/_git/repository');
  assert.equal(git.remotes.get('origin')?.push, 'https://dev.azure.com/company/project/_git/repository');
  assert.equal(git.remotes.get('template-upstream')?.fetch, 'https://github.com/devphuclam/CodespaceTemplate.git');
  assert.equal(git.remotes.get('template-upstream')?.push, 'disabled:template-upstream');
  assert.deepEqual((await adapter.remoteRoles()).roles.filter((role) => role.push).map((role) => role.name), ['origin']);
});

test('adoption rejects a second push-capable remote', async () => {
  const git = new FakeGit();
  git.remotes.set('other', { fetch: 'https://git.example.invalid/other.git', push: 'https://git.example.invalid/other.git' });
  const adapter = makeAdapter(git);
  const plan = await adapter.previewAdoption(adoptionPlanInput());
  const result = await adapter.applyAdoption({
    operationId: 'adopt-2',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(result.disposition, 'conflict');
  assert.match(result.reason ?? '', /push path/i);
});
