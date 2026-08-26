import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createContext } from '../../src/cli/context.ts';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { SerializedGh } from '../../src/adapters/github/gh.ts';

const azureConfig = {
  schemaVersion: 1,
  provider: 'azure-devops',
  runtimeProfile: null,
  azureDevOps: {
    organizationUrl: 'https://dev.azure.com/placeholder-organization',
    project: { name: 'placeholder-project', expectedId: null },
    repository: { name: 'placeholder-repository', expectedId: null },
    integrationTarget: 'refs/heads/main',
    process: { profile: 'agile@1', workItemType: 'User Story', expectedFingerprint: null, override: null },
    authentication: { preferred: 'entra-user', tenantId: null, patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
    remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
  },
  verification: { commands: ['node --version'] },
  reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
};

test('context selects Azure only from configuration and never derives it from a GitHub remote', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-azure-'));
  try {
    const configPath = join(root, 'agent-workspace.config.json');
    await writeFile(configPath, JSON.stringify(azureConfig), 'utf8');
    const context = await createContext(root, {
      configPath,
      azureAuth: { source: 'entra', credential: SecretString.from('offline-context-token'), detail: 'test identity' },
    });
    assert.equal(context.provider, 'azure-devops');
    assert.equal(context.repo, '');
    assert.equal(context.providerPorts?.runtime !== undefined, true);
    assert.equal((await context.providerPorts!.runtime.inspect()).state, 'not-selected');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('explicit GitHub configuration remains selectable with a null runtime profile', async () => {
  const root = await mkdtemp(join(tmpdir(), 'context-github-'));
  try {
    const configPath = join(root, 'agent-workspace.config.json');
    await writeFile(configPath, JSON.stringify({
      schemaVersion: 1,
      provider: 'github',
      runtimeProfile: null,
      github: { remote: 'origin' },
      verification: { commands: ['node --version'] },
      reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
    }), 'utf8');
    let ghCalls = 0;
    const context = await createContext(root, { configPath, githubGh: new SerializedGh(async () => { ghCalls += 1; throw new Error('context construction must not call gh'); }) });
    assert.equal(context.provider, 'github');
    assert.equal((await context.providerPorts!.runtime.inspect()).state, 'not-selected');
    assert.equal(context.providerPorts!.workItems.constructor.name, 'GithubProviderWorkItemAdapter');
    assert.equal(context.providerPorts!.claims.constructor.name, 'GithubProviderClaimStore');
    assert.equal(context.providerPorts!.evidence.constructor.name, 'GithubProviderEvidenceStore');
    assert.equal(context.providerPorts!.sourceHost.constructor.name, 'GithubProviderSourceHostAdapter');
    assert.equal(context.providerPorts!.policies.constructor.name, 'GithubProviderPolicyAdapter');
    assert.equal(ghCalls, 0, 'provider construction is lazy and performs no gh read or mutation');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
