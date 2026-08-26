// T011: Provider configuration tests - the committed explicit GitHub default,
// omitted/null versus local-agent-v1 runtime behavior, exact refs/IDs,
// built-in/custom process profiles, secret-bearing rejection, PAT approval
// syntax, live gates, and no implicit remote-derived fallback (FR-001, FR-002,
// FR-009, FR-012, FR-028, FR-037).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ProviderConfigError,
  loadProviderConfig,
  parseProviderConfig,
  validateAzureDevOpsConfig,
  validateProviderConfig,
} from '../../../src/config/provider.ts';
import { placeholder } from '../../../test/fixtures/azure/fixtures.ts';

const GITHUB_DEFAULT = JSON.stringify({
  schemaVersion: 1,
  provider: 'github',
  runtimeProfile: null,
  github: { remote: 'origin' },
  verification: { commands: ['npm test'] },
  reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
});

test('the committed root default explicitly selects github with runtimeProfile null', () => {
  const config = loadProviderConfig(resolve('../../agent-workspace.config.json'));
  assert.equal(config.provider, 'github');
  assert.equal(config.runtimeProfile, null);
  assert.equal(config.github?.remote, 'origin');
  assert.deepEqual(config.reviewIntent, { minimumHumanApprovals: 0, authorSelfReview: true });
});

test('an omitted or null runtimeProfile selects no local runtime', () => {
  for (const runtimeProfile of [undefined, null]) {
    const config = parseProviderConfig(
      JSON.stringify({
        schemaVersion: 1,
        provider: 'github',
        runtimeProfile,
        github: { remote: 'origin' },
        verification: { commands: ['npm test'] },
        reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
      }),
    );
    assert.equal(config.runtimeProfile, null);
  }
});

test('local-agent-v1 is the only supported runtime profile', () => {
  const config = parseProviderConfig(
    JSON.stringify({
      schemaVersion: 1,
      provider: 'github',
      runtimeProfile: 'local-agent-v1',
      github: { remote: 'origin' },
      verification: { commands: ['npm test'] },
      reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
    }),
  );
  assert.equal(config.runtimeProfile, 'local-agent-v1');
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({
          schemaVersion: 1,
          provider: 'github',
          runtimeProfile: 'docker-v1',
          github: { remote: 'origin' },
          verification: { commands: ['npm test'] },
          reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
        }),
      ),
    ProviderConfigError,
  );
});

test('exactly one supported provider is required; no implicit fallback', () => {
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({
          schemaVersion: 1,
          provider: 'gitlab',
          github: { remote: 'origin' },
          verification: { commands: ['npm test'] },
          reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
        }),
      ),
    /no implicit fallback/,
  );
  assert.throws(() => parseProviderConfig('{"schemaVersion": 1}'), ProviderConfigError);
  assert.throws(() => parseProviderConfig('not json'), ProviderConfigError);
});

test('verification commands must be a non-empty array of plain commands', () => {
  const base = {
    schemaVersion: 1,
    provider: 'github',
    runtimeProfile: null,
    github: { remote: 'origin' },
    reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
  };
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, verification: { commands: [] } })), ProviderConfigError);
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, verification: { commands: ['a\nb'] } })), ProviderConfigError);
  const ok = parseProviderConfig(JSON.stringify({ ...base, verification: { commands: ['npm test'] } }));
  assert.deepEqual(ok.verification.commands, ['npm test']);
});

test('reviewIntent template values must be exactly 0 and true', () => {
  const base = {
    schemaVersion: 1,
    provider: 'github',
    runtimeProfile: null,
    github: { remote: 'origin' },
    verification: { commands: ['npm test'] },
  };
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({ ...base, reviewIntent: { minimumHumanApprovals: 1, authorSelfReview: true } }),
      ),
    /exactly 0 and true/,
  );
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({ ...base, reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: false } }),
      ),
    /exactly 0 and true/,
  );
});

test('live gates require environment variable names, never values', () => {
  const config = parseProviderConfig(
    JSON.stringify({
      ...JSON.parse(GITHUB_DEFAULT),
      liveValidation: {
        modeFlagEnvironmentVariable: 'AGENT_WORKSPACE_LIVE_VALIDATION',
        allowlistEnvironmentPrefix: 'AGENT_WORKSPACE_LIVE_ALLOWED_',
      },
    }),
  );
  assert.equal(config.liveValidation?.modeFlagEnvironmentVariable, 'AGENT_WORKSPACE_LIVE_VALIDATION');
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({
          ...JSON.parse(GITHUB_DEFAULT),
          liveValidation: { modeFlagEnvironmentVariable: '1', allowlistEnvironmentPrefix: 'X_' },
        }),
      ),
    /environment variable names/,
  );
});

test('secret-bearing configuration values are rejected (only names allowed)', () => {
  assert.throws(
    () =>
      parseProviderConfig(
        JSON.stringify({
          schemaVersion: 1,
          provider: 'azure-devops',
          runtimeProfile: null,
          verification: { commands: ['npm test'] },
          reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
          azureDevOps: {
            organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
            project: { name: placeholder.project },
            repository: { name: placeholder.repository },
            integrationTarget: placeholder.targetRef,
            process: { profile: 'agile@1', workItemType: 'User Story' },
            authentication: {
              preferred: 'entra-user',
              patFallback: { mode: 'disabled', secretEnvironmentVariable: 'pat-0123456789abcdef0123456789abcdef' },
            },
            remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
          },
        }),
      ),
    /carry a secret value/,
  );
});

test('PAT approval syntax: mode must be disabled or company-approved with a secret variable name', () => {
  const base = {
    schemaVersion: 1,
    provider: 'azure-devops',
    runtimeProfile: null,
    verification: { commands: ['npm test'] },
    reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
  };
  const azure = (patFallback: unknown) => ({
    organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
    project: { name: placeholder.project },
    repository: { name: placeholder.repository },
    integrationTarget: placeholder.targetRef,
    process: { profile: 'agile@1', workItemType: 'User Story' },
    authentication: { preferred: 'entra-user', patFallback },
    remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
  });
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, azureDevOps: azure({ mode: 'always', secretEnvironmentVariable: 'P' }) })), ProviderConfigError);
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, azureDevOps: azure({ mode: 'company-approved', secretEnvironmentVariable: '' }) })), ProviderConfigError);
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, azureDevOps: azure({ mode: 'company-approved' }) })), ProviderConfigError);
  const ok = parseProviderConfig(
    JSON.stringify({ ...base, azureDevOps: azure({ mode: 'company-approved', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' }) }),
  );
  assert.equal(ok.azureDevOps?.authentication.patFallback.mode, 'company-approved');
});

test('exact refs and IDs: integrationTarget must be a fully qualified refs/heads/... ref', () => {
  const base = {
    schemaVersion: 1,
    provider: 'azure-devops',
    runtimeProfile: null,
    verification: { commands: ['npm test'] },
    reviewIntent: { minimumHumanApprovals: 0, authorSelfReview: true },
  };
  const azure = (integrationTarget: string) => ({
    organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
    project: { name: placeholder.project },
    repository: { name: placeholder.repository },
    integrationTarget,
    process: { profile: 'agile@1', workItemType: 'User Story' },
    authentication: { preferred: 'entra-user', patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
    remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
  });
  assert.throws(() => parseProviderConfig(JSON.stringify({ ...base, azureDevOps: azure('main') })), /fully qualified/);
  const ok = parseProviderConfig(JSON.stringify({ ...base, azureDevOps: azure(placeholder.targetRef) }));
  assert.equal(ok.azureDevOps?.integrationTarget, placeholder.targetRef);
});

test('built-in process profiles are accepted; complete custom overrides validated', () => {
  const validated = validateAzureDevOpsConfig(
    {
      organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
      project: { name: placeholder.project, expectedId: placeholder.projectId },
      repository: { name: placeholder.repository, expectedId: placeholder.repositoryId },
      integrationTarget: placeholder.targetRef,
      process: {
        profile: 'agile@1',
        workItemType: 'User Story',
        expectedFingerprint: null,
        override: {
          open: 'New',
          claimed: 'Active',
          'in-progress': 'Active',
          'ready-for-integration': 'Resolved',
          integrated: 'Closed',
          blocked: 'Removed',
        },
      },
      authentication: {
        preferred: 'entra-user',
        patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' },
      },
      remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
    },
    'test',
  );
  assert.equal(validated.process.profile, 'agile@1');
  assert.equal(validated.process.override?.blocked, 'Removed');
  assert.throws(
    () =>
      validateAzureDevOpsConfig(
        {
          organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
          project: { name: placeholder.project },
          repository: { name: placeholder.repository },
          integrationTarget: placeholder.targetRef,
          process: { profile: 'agile@1', workItemType: 'User Story', override: { open: 'New' } },
          authentication: { preferred: 'entra-user', patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
          remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
        },
        'test',
      ),
    /all six neutral states/,
  );
});

test('organizationUrl must be an HTTPS dev.azure.com URL with one organization segment', () => {
  assert.throws(
    () =>
      validateAzureDevOpsConfig(
        {
          organizationUrl: 'http://dev.azure.com/org',
          project: { name: 'p' },
          repository: { name: 'r' },
          integrationTarget: placeholder.targetRef,
          process: { profile: 'agile@1', workItemType: 'User Story' },
          authentication: { preferred: 'entra-user', patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
          remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
        },
        'test',
      ),
    /HTTPS dev\.azure\.com/,
  );
  assert.throws(
    () =>
      validateAzureDevOpsConfig(
        {
          organizationUrl: 'https://dev.azure.com/org/project',
          project: { name: 'p' },
          repository: { name: 'r' },
          integrationTarget: placeholder.targetRef,
          process: { profile: 'agile@1', workItemType: 'User Story' },
          authentication: { preferred: 'entra-user', patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
          remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
        },
        'test',
      ),
    /exactly one organization segment/,
  );
});

test('remoteRoles require distinct companyOrigin and templateUpstream names', () => {
  const base = {
    organizationUrl: `https://dev.azure.com/${placeholder.organization}`,
    project: { name: placeholder.project },
    repository: { name: placeholder.repository },
    integrationTarget: placeholder.targetRef,
    process: { profile: 'agile@1', workItemType: 'User Story' },
    authentication: { preferred: 'entra-user', patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' } },
  };
  assert.throws(() => validateAzureDevOpsConfig({ ...base, remoteRoles: { companyOrigin: 'origin', templateUpstream: 'origin' } }, 'test'), /distinct/);
  const ok = validateAzureDevOpsConfig({ ...base, remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' } }, 'test');
  assert.equal(ok.remoteRoles.templateUpstream, 'template-upstream');
});

test('validateProviderConfig surfaces the source in errors', () => {
  assert.throws(() => validateProviderConfig({ schemaVersion: 2 }, 'custom-file.json'), /custom-file\.json/);
});

test('the Azure example file parses and is non-secret', () => {
  const example = readFileSync(resolve('../../config/agent-workspace.azure.example.json'), 'utf8');
  const config = parseProviderConfig(example);
  assert.equal(config.provider, 'azure-devops');
  assert.equal(config.azureDevOps?.authentication.preferred, 'entra-user');
  assert.equal(config.azureDevOps?.authentication.patFallback.mode, 'disabled');
  assert.equal(config.reviewIntent.minimumHumanApprovals, 0);
});