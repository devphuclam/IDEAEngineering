// US1 black-box journey: preparation is read-only until the explicit
// allowlisted apply, repeats are idempotent, and adoption removes personal
// GitHub push paths without turning the template upstream into a push target.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AzureAuthenticator, SecretString } from '../../src/adapters/azure/auth.ts';
import { AzurePreparationAdapter } from '../../src/adapters/azure/bootstrap.ts';
import { AzureHttpClient } from '../../src/adapters/azure/http.ts';
import { AzureSourceHostAdapter, type GitExecutor } from '../../src/adapters/azure/repos.ts';
import { AzureNamespaceReader, AzurePermissionBatchReader } from '../../src/adapters/azure/permissions.ts';
import { FakeAzureState } from '../../src/adapters/fakes/azure.ts';
import { parseQueueManifest, replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { queueKeyTag, QUEUE_DISCOVERY_TAG } from '../../src/adapters/azure/target.ts';
import { offlineConfig } from '../fixtures/azure/harness.ts';

class GitRemotes implements GitExecutor {
  readonly remotes = new Map<string, { fetch: string; push: string }>([
    ['origin', { fetch: 'https://github.com/personal/project.git', push: 'https://github.com/personal/project.git' }],
    ['template-upstream', { fetch: 'https://github.com/devphuclam/CodespaceTemplate.git', push: 'https://github.com/devphuclam/CodespaceTemplate.git' }],
  ]);

  async run(args: string[]): Promise<{ stdout: string; stderr: string }> {
    if (args[0] !== 'remote') return { stdout: '', stderr: '' };
    if (args.length === 1) return { stdout: `${[...this.remotes.keys()].join('\n')}\n`, stderr: '' };
    if (args[1] === 'get-url') {
      const push = args[2] === '--push';
      const name = args.at(-1)!;
      return { stdout: `${push ? this.remotes.get(name)?.push : this.remotes.get(name)?.fetch ?? ''}\n`, stderr: '' };
    }
    if (args[1] === 'set-url') {
      const push = args[2] === '--push';
      const name = push ? args[3] : args[2];
      const url = push ? args[4] : args[3];
      const remote = this.remotes.get(name!);
      if (!remote) throw new Error(`missing remote ${name}`);
      if (push) remote.push = url!;
      else remote.fetch = url!;
    }
    return { stdout: '', stderr: '' };
  }
}

function preparation(state: FakeAzureState): { adapter: AzurePreparationAdapter; requests: ReturnType<FakeAzureState['transport']>['requests'] } {
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const authenticator = new AzureAuthenticator({
    azCli: { accountGetAccessToken: async () => ({ token: 'offline-only-token' }) },
    patFallback: { mode: 'disabled', source: { read: async () => undefined } },
  });
  return {
    adapter: new AzurePreparationAdapter({
      client,
      config: offlineConfig,
      authenticator,
      authSelection: { source: 'entra', credential: SecretString.from('offline-only-token'), detail: 'offline simulated identity' },
      namespaceDiscovery: new AzureNamespaceReader(client),
      permissionBatchReader: new AzurePermissionBatchReader(client),
      identity: 'offline-maintainer',
      clock: () => '2026-08-14T00:00:00.000Z',
    }),
    requests: transport.requests,
  };
}

test('prepare/adopt journey keeps administrator gaps visible and mutates only named artifacts', async () => {
  const state = new FakeAzureState();
  const beforeCandidate = structuredClone(state.workItems.get(1000));
  const { adapter, requests } = preparation(state);
  const readiness = await adapter.readiness();
  assert.equal(readiness.provider, 'azure-devops');
  assert.equal(readiness.permissions.length, 6);

  const plan = await adapter.preview();
  assert.equal(
    requests.some((request) => request.method === 'PATCH' || (request.method === 'POST' && !/_apis\/(wit\/wiql|security\/permissionevaluationbatch)/i.test(request.url))),
    false,
    'preview/readiness never probes permissions by mutating a resource',
  );
  const applied = await adapter.apply({
    operationId: 'prepare-blackbox-1',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(applied.disposition, 'applied');
  const queueId = String(applied.value?.queueWorkItemId);
  const repeated = await adapter.apply({
    operationId: 'prepare-blackbox-2',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(repeated.disposition, 'applied');
  assert.equal(String(repeated.value?.queueWorkItemId), queueId);
  assert.deepEqual(state.workItems.get(1000), beforeCandidate, 'candidate Work Item is outside the bootstrap allowlist');
  assert.equal(requests.filter((request) => request.method === 'PATCH' && /workitems\/1000$/i.test(request.url)).length, 0);
  const queue = state.workItems.get(Number(queueId));
  assert.ok(queue?.fields['System.Tags'].includes(QUEUE_DISCOVERY_TAG));
  assert.ok(queue?.fields['System.Tags'].includes(queueKeyTag(plan.queue?.queueKey ?? '')));

  const duplicateState = new FakeAzureState();
  const duplicatePrep = preparation(duplicateState).adapter;
  const duplicatePlan = await duplicatePrep.preview();
  const firstDuplicate = await duplicatePrep.apply({
    operationId: 'prepare-blackbox-duplicate-seed',
    expectedRevision: duplicatePlan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: duplicatePlan,
  });
  const duplicateQueueId = 'value' in firstDuplicate ? firstDuplicate.value?.queueWorkItemId : undefined;
  const canonical = duplicateState.workItems.get(Number(duplicateQueueId));
  assert.ok(canonical);
  duplicateState.seed({
    'System.Title': canonical.fields['System.Title'],
    'System.Description': replaceManagedBlock('', 'queue-manifest', parseQueueManifest(canonical.fields['System.Description']).value).description,
    'System.State': 'New',
    'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(duplicatePlan.queue?.queueKey ?? '')}`,
  });
  const duplicate = await duplicatePrep.apply({
    operationId: 'prepare-blackbox-duplicate',
    expectedRevision: duplicatePlan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: duplicatePlan,
  });
  assert.equal(duplicate.disposition, 'conflict');
  assert.match(duplicate.reason ?? '', /administrator/i);
});

test('adoption converts GitHub origin to Azure and rejects every second push path', async () => {
  const state = new FakeAzureState();
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-token'), offlineConfig.organizationUrl);
  const git = new GitRemotes();
  const source = new AzureSourceHostAdapter({
    client,
    projectName: offlineConfig.project.name,
    repositoryId: offlineConfig.repository.expectedId!,
    targetRef: offlineConfig.integrationTarget,
    cwd: process.cwd(),
    git,
    companyOriginUrl: 'https://dev.azure.com/company/offline/_git/repository',
  });
  const request = {
    repositoryId: offlineConfig.repository.expectedId!,
    originRoleName: 'origin',
    templateUpstreamRoleName: 'template-upstream',
    templateUpstreamUrl: 'https://github.com/devphuclam/CodespaceTemplate.git',
    companyOriginUrl: 'https://dev.azure.com/company/offline/_git/repository',
  };
  const plan = await source.previewAdoption(request);
  const result = await source.applyAdoption({
    operationId: 'adopt-blackbox-1',
    expectedRevision: plan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: plan,
  });
  assert.equal(result.disposition, 'applied');
  assert.equal(git.remotes.get('origin')?.push, request.companyOriginUrl);
  assert.equal(git.remotes.get('template-upstream')?.push, 'disabled:template-upstream');
  assert.deepEqual((await source.remoteRoles()).roles.filter((role) => role.push).map((role) => role.name), ['origin']);

  const secondPushPath = new GitRemotes();
  secondPushPath.remotes.set('personal-backup', { fetch: 'https://github.com/personal/backup.git', push: 'https://github.com/personal/backup.git' });
  const guarded = new AzureSourceHostAdapter({
    client,
    projectName: offlineConfig.project.name,
    repositoryId: offlineConfig.repository.expectedId!,
    targetRef: offlineConfig.integrationTarget,
    cwd: process.cwd(),
    git: secondPushPath,
    companyOriginUrl: request.companyOriginUrl,
  });
  const guardedPlan = await guarded.previewAdoption(request);
  const rejected = await guarded.applyAdoption({
    operationId: 'adopt-blackbox-2',
    expectedRevision: guardedPlan.digest,
    actor: 'offline-maintainer',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: guardedPlan,
  });
  assert.equal(rejected.disposition, 'conflict');
  assert.match(rejected.reason ?? '', /push path/i);
});
