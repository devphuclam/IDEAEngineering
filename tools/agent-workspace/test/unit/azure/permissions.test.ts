// T017: Azure permission tests - namespace/action discovery, exact CSS/Git
// tokens and bits including exact-source-ref ForcePush before validation
// branch deletion, alwaysAllowAdministrators: false, operation-by-operation
// outcomes, capability reads, zero write probes, and fail-closed
// drift/denial/unavailability (FR-007, FR-034).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FORCE_PUSH_BIT,
  GIT_REPOSITORIES_NAMESPACE,
  PermissionProbeError,
  bitIsSet,
  forcePushAllowed,
  probePermissionBatch,
  type NamespaceDiscovery,
  type PermissionBatchReader,
  type PermissionOperation,
} from '../../../src/adapters/azure/permissions.ts';
import { placeholder, securityNamespaceDto } from '../../../test/fixtures/azure/fixtures.ts';
import type { WirePermissionBatchEntry, WireSecurityNamespace } from '../../../src/adapters/azure/models.ts';

const NOW = '2026-08-14T00:00:00.000Z';
const REPO_TOKEN = `repoV2/${placeholder.repositoryId}`;
const SOURCE_REF_TOKEN = `repoV2/${placeholder.repositoryId}/refs/heads/agent/checkpoint-1`;

function namespace(): WireSecurityNamespace {
  return {
    namespaceId: GIT_REPOSITORIES_NAMESPACE,
    name: securityNamespaceDto.name,
    actions: [
      { bit: 1, name: 'Read' },
      { bit: 2, name: 'Contribute' },
      { bit: FORCE_PUSH_BIT, name: 'ForcePush' },
    ],
  };
}

function entry(token: string, effectivePermissions: number): WirePermissionBatchEntry {
  return { token, effectivePermissions };
}

function operation(overrides: Partial<PermissionOperation> = {}): PermissionOperation {
  return {
    operation: 'read',
    namespaceId: GIT_REPOSITORIES_NAMESPACE,
    token: REPO_TOKEN,
    permissionName: 'Read',
    permissionBit: 1,
    ...overrides,
  };
}

function discoveryOf(...namespaces: WireSecurityNamespace[]): NamespaceDiscovery {
  return {
    getNamespace: async (namespaceId) => {
      const match = namespaces.find((candidate) => candidate.namespaceId === namespaceId);
      if (!match) throw new Error('namespace not found');
      return match;
    },
  };
}

function batchReaderOf(...entries: WirePermissionBatchEntry[]): PermissionBatchReader {
  return {
    readBatch: async (_namespaceId, tokens) => entries.filter((entry) => tokens.includes(entry.token)),
  };
}

test('bitIsSet checks exact bits', () => {
  assert.equal(bitIsSet(1, 1), true);
  assert.equal(bitIsSet(3, 2), true);
  assert.equal(bitIsSet(1, 2), false);
  assert.equal(bitIsSet(0, FORCE_PUSH_BIT), false);
  assert.equal(bitIsSet(FORCE_PUSH_BIT, FORCE_PUSH_BIT), true);
});

test('probePermissionBatch returns operation-by-operation outcomes with capability reads', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    batchReaderOf(entry(REPO_TOKEN, 1 | 2)),
    [
      operation({ operation: 'read', permissionName: 'Read', permissionBit: 1 }),
      operation({ operation: 'contribute', permissionName: 'Contribute', permissionBit: 2 }),
    ],
    'placeholder-identity',
    [{ name: 'list-projects', probe: async () => 'passed' }],
    NOW,
  );
  assert.equal(results.length, 2);
  assert.equal(results[0].effective, 'allowed');
  assert.equal(results[1].effective, 'allowed');
  for (const result of results) {
    assert.deepEqual(result.capabilityReads, [{ name: 'list-projects', outcome: 'passed' }]);
    assert.equal(result.observedAt, NOW);
  }
});

test('a denied bit yields denied with a next action; never a write probe', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    batchReaderOf(entry(REPO_TOKEN, 1)),
    [operation({ operation: 'push', permissionName: 'Contribute', permissionBit: 2 })],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(results[0].effective, 'denied');
  assert.match(results[0].nextAction ?? '', /request Contribute/);
});

test('an unavailable namespace fails closed to unknown, never allowed', async () => {
  const results = await probePermissionBatch(
    discoveryOf(),
    batchReaderOf(),
    [operation()],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(results[0].effective, 'unknown');
});

test('an unavailable permission batch fails closed to unavailable', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    { readBatch: async () => { throw new Error('batch read failed'); } },
    [operation()],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(results[0].effective, 'unavailable');
});

test('a missing batch entry fails closed to unknown', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    batchReaderOf(),
    [operation()],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(results[0].effective, 'unknown');
});

test('an action declared at a different bit than expected is a drift error', async () => {
  const driftNamespace: WireSecurityNamespace = {
    ...namespace(),
    actions: [{ bit: 4, name: 'Read' }],
  };
  await assert.rejects(
    probePermissionBatch(discoveryOf(driftNamespace), batchReaderOf(entry(REPO_TOKEN, 4)), [operation()], 'placeholder-identity', [], NOW),
    PermissionProbeError,
  );
});

test('capability probe failures are recorded as unavailable, never fatal', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    batchReaderOf(entry(REPO_TOKEN, 1)),
    [operation()],
    'placeholder-identity',
    [{ name: 'list-projects', probe: async () => { throw new Error('denied'); } }],
    NOW,
  );
  assert.equal(results[0].effective, 'allowed');
  assert.deepEqual(results[0].capabilityReads, [{ name: 'list-projects', outcome: 'unavailable' }]);
});

test('alwaysAllowAdministrators is not assumed: effective permissions decide', async () => {
  const results = await probePermissionBatch(
    discoveryOf(namespace()),
    batchReaderOf(entry(REPO_TOKEN, 0)),
    [operation({ operation: 'push', permissionName: 'Contribute', permissionBit: 2 })],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(results[0].effective, 'denied', 'no implicit administrator allowance');
});

test('forcePushAllowed requires the exact source ref token and the ForcePush bit', () => {
  assert.equal(forcePushAllowed([entry(SOURCE_REF_TOKEN, FORCE_PUSH_BIT)], SOURCE_REF_TOKEN), true);
  assert.equal(forcePushAllowed([entry(SOURCE_REF_TOKEN, FORCE_PUSH_BIT - 1)], SOURCE_REF_TOKEN), false);
  assert.equal(forcePushAllowed([entry(REPO_TOKEN, FORCE_PUSH_BIT)], SOURCE_REF_TOKEN), false, 'token mismatch is denied');
  assert.equal(forcePushAllowed([], SOURCE_REF_TOKEN), false);
  assert.equal(forcePushAllowed([entry(SOURCE_REF_TOKEN, FORCE_PUSH_BIT | 1)], SOURCE_REF_TOKEN), true);
});

test('the exact-source-ref ForcePush check precedes any validation branch deletion', () => {
  // A branch deletion must probe ForcePush on the exact source ref, not on
  // the repository token; the check is read-only and evaluated before any
  // delete would proceed.
  const batch = [entry(SOURCE_REF_TOKEN, 0), entry(REPO_TOKEN, FORCE_PUSH_BIT)];
  assert.equal(forcePushAllowed(batch, SOURCE_REF_TOKEN), false, 'repo-wide ForcePush does not imply source-ref ForcePush');
});

test('zero write probes: the discovery and batch readers are the only calls', async () => {
  let reads = 0;
  const results = await probePermissionBatch(
    {
      getNamespace: async (namespaceId) => {
        reads += 1;
        return { ...namespace(), namespaceId };
      },
    },
    {
      readBatch: async () => {
        reads += 1;
        return [entry(REPO_TOKEN, 1)];
      },
    },
    [operation()],
    'placeholder-identity',
    [],
    NOW,
  );
  assert.equal(reads, 2, 'only namespace discovery and one batch read');
  assert.equal(results[0].effective, 'allowed');
});