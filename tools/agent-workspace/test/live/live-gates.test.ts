import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLiveGate } from '../../src/validation/ledger.ts';
import { readinessOutcome } from '../../src/validation/live-readiness.ts';
import type { ReadinessReport } from '../../src/domain/types.ts';

const target = {
  organizationUrl: 'https://dev.azure.com/placeholder-organization',
  projectId: 'placeholder-project-id',
  repositoryId: 'placeholder-repository-id',
  targetRef: 'refs/heads/validation-only',
};

test('live gates produce not-run for every missing prerequisite', () => {
  const result = evaluateLiveGate({
    environment: {},
    runtimeReady: false,
    configReady: false,
    identityReady: false,
    permissionsReady: false,
    capabilityReady: false,
    networkReady: false,
    policyReady: false,
    target,
  });
  assert.equal(result.outcome, 'not-run');
  assert.ok(result.missing.length >= 9);
});

test('live gate exact canonical target comparison is required before mutation', () => {
  const result = evaluateLiveGate({
    environment: {
      AGENT_WORKSPACE_AZURE_LIVE: '1',
      AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL: target.organizationUrl,
      AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID: target.projectId,
      AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID: target.repositoryId,
      AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF: 'refs/heads/wrong-target',
    },
    runtimeReady: true,
    configReady: true,
    identityReady: true,
    permissionsReady: true,
    capabilityReady: true,
    networkReady: true,
    policyReady: true,
    target,
  });
  assert.equal(result.outcome, 'not-run');
  assert.ok(result.missing.includes('exact target ref allowlist'));
});

const readinessFixture = (): ReadinessReport => ({
  provider: 'azure-devops',
  observedAt: '2026-08-14T00:00:00.000Z',
  configuration: { outcome: 'passed' },
  runtime: { outcome: 'passed' },
  authentication: { outcome: 'passed' },
  target: { outcome: 'passed' },
  permissions: [{
    operation: 'work-item.read',
    namespaceId: 'work-item-namespace',
    token: 'area-token',
    permissionName: 'WORK_ITEM_READ',
    permissionBit: 1,
    effective: 'allowed',
    capabilityReads: [{ name: 'work-item.read', outcome: 'passed' }],
    observedAt: '2026-08-14T00:00:00.000Z',
  }],
  processMapping: { profile: 'agile@1', workItemType: 'User Story', observedProcessFingerprint: 'sha256:fingerprint', stateMap: {} },
  remoteRoles: { roles: [] },
  policyVisibility: { inventorySources: [{ name: 'azure-policy', outcome: 'read' }], effectiveBlockingCount: 0 },
  queue: { outcome: 'passed' },
  network: { outcome: 'passed' },
});

test('readiness requires non-empty passing capability probes and visible policy inventory', () => {
  const complete = readinessFixture();
  assert.equal(readinessOutcome(complete).outcome, 'passed');

  const withoutCapabilityEvidence: ReadinessReport = {
    ...complete,
    permissions: complete.permissions.map((permission) => ({ ...permission, capabilityReads: [] })),
  };
  assert.equal(readinessOutcome(withoutCapabilityEvidence).outcome, 'failed');

  const withoutPolicyVisibility: ReadinessReport = {
    ...complete,
    policyVisibility: { inventorySources: [], effectiveBlockingCount: 0 },
  };
  assert.equal(readinessOutcome(withoutPolicyVisibility).outcome, 'failed');

  const unavailablePolicy: ReadinessReport = {
    ...complete,
    policyVisibility: { inventorySources: [{ name: 'azure-policy', outcome: 'unavailable' }], effectiveBlockingCount: 0 },
  };
  assert.equal(readinessOutcome(unavailablePolicy).outcome, 'failed');
});
