// T016: Azure process-mapping tests - complete Agile/Scrum/Basic mappings,
// deterministic observedProcessFingerprint, complete custom overrides, and
// fail-closed drift/unmapped states (FR-012, SC-014).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BUILTIN_PROCESS_PROFILES,
  ProcessMappingError,
  observedProcessFingerprint,
  resolveProcessMapping,
} from '../../../src/adapters/azure/process-mapping.ts';
import { placeholder } from '../../../test/fixtures/azure/fixtures.ts';
import type { WireProcess, WireWorkItemTypeMetadata } from '../../../src/adapters/azure/models.ts';

const NOW = '2026-08-14T00:00:00.000Z';

function agileObservation(): { process: WireProcess; workItemType: WireWorkItemTypeMetadata; observedAt: string } {
  return {
    process: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Agile',
    },
    workItemType: {
      name: 'User Story',
      states: [
        { name: 'New', category: 'Proposed' },
        { name: 'Active', category: 'InProgress' },
        { name: 'Resolved', category: 'Resolved' },
        { name: 'Closed', category: 'Completed' },
        { name: 'Removed', category: 'Removed' },
      ],
    },
    observedAt: NOW,
  };
}

test('built-in profiles are complete across all six neutral states', () => {
  for (const profile of Object.values(BUILTIN_PROCESS_PROFILES)) {
    assert.equal(Object.keys(profile.states).length, 6);
    assert.ok(profile.workItemType.length > 0);
  }
});

test('agile@1 resolves the complete neutral state map from an Agile observation', () => {
  const report = resolveProcessMapping('agile@1', 'User Story', agileObservation(), null, null, NOW);
  assert.equal(report.profile, 'agile@1');
  assert.equal(report.workItemType, 'User Story');
  assert.deepEqual(report.stateMap, {
    open: 'New',
    claimed: 'Active',
    'in-progress': 'Active',
    'ready-for-integration': 'Resolved',
    integrated: 'Closed',
    blocked: 'Removed',
  });
  assert.equal(report.drift, undefined);
});

test('scrum@1 and basic@1 resolve their own mappings', () => {
  const scrum = resolveProcessMapping(
    'scrum@1',
    'Product Backlog Item',
    {
      ...agileObservation(),
      process: { id: '00000000-0000-0000-0000-000000000004', name: 'Scrum' },
      workItemType: {
        name: 'Product Backlog Item',
        states: [
          { name: 'New', category: 'Proposed' },
          { name: 'Committed', category: 'InProgress' },
          { name: 'Done', category: 'Completed' },
          { name: 'Removed', category: 'Removed' },
        ],
      },
    },
    null,
    null,
    NOW,
  );
  assert.equal(scrum.stateMap['ready-for-integration'], 'Done');

  const basic = resolveProcessMapping(
    'basic@1',
    'Issue',
    {
      ...agileObservation(),
      process: { id: '00000000-0000-0000-0000-000000000004', name: 'Basic' },
      workItemType: {
        name: 'Issue',
        states: [
          { name: 'New', category: 'Proposed' },
          { name: 'Active', category: 'InProgress' },
          { name: 'Resolved', category: 'Resolved' },
          { name: 'Closed', category: 'Completed' },
          { name: 'Removed', category: 'Removed' },
        ],
      },
    },
    null,
    null,
    NOW,
  );
  assert.equal(basic.stateMap.open, 'New');
});

test('observedProcessFingerprint is deterministic and order-sensitive', () => {
  const first = observedProcessFingerprint(agileObservation());
  const second = observedProcessFingerprint(agileObservation());
  assert.equal(first, second);
  assert.match(first, /^sha256:[0-9a-f]{64}$/);
  const withExtraState = observedProcessFingerprint({
    ...agileObservation(),
    workItemType: { ...agileObservation().workItemType, states: [...agileObservation().workItemType.states, { name: 'Extra', category: 'Removed' }] },
  });
  assert.notEqual(withExtraState, first);
});

test('a complete custom override is accepted and validated against observed states', () => {
  const override = {
    open: 'New',
    claimed: 'Active',
    'in-progress': 'Active',
    'ready-for-integration': 'Resolved',
    integrated: 'Closed',
    blocked: 'Removed',
  };
  const report = resolveProcessMapping('custom@1', 'User Story', agileObservation(), override, null, NOW);
  assert.equal(report.profile, 'custom@1');
  assert.deepEqual(report.stateMap, override);
});

test('an override referencing an unobserved state fails closed', () => {
  const override = {
    open: 'New',
    claimed: 'Active',
    'in-progress': 'Active',
    'ready-for-integration': 'Resolved',
    integrated: 'Closed',
    blocked: 'DoesNotExist',
  };
  assert.throws(
    () => resolveProcessMapping('custom@1', 'User Story', agileObservation(), override, null, NOW),
    ProcessMappingError,
  );
});

test('a configured expectedFingerprint mismatch fails closed', () => {
  const observed = observedProcessFingerprint(agileObservation());
  assert.doesNotThrow(() => resolveProcessMapping('agile@1', 'User Story', agileObservation(), null, observed, NOW));
  assert.throws(
    () => resolveProcessMapping('agile@1', 'User Story', agileObservation(), null, 'sha256:0000000000000000000000000000000000000000000000000000000000000000', NOW),
    /does not match expected/,
  );
});

test('unmapped profiles without an override fail closed', () => {
  assert.throws(
    () => resolveProcessMapping('unknown@9', 'User Story', agileObservation(), null, null, NOW),
    /not a built-in profile/,
  );
});

test('a configured Work Item Type mismatch fails closed', () => {
  assert.throws(
    () => resolveProcessMapping('agile@1', 'Bug', agileObservation(), null, null, NOW),
    /does not match profile/,
  );
});

test('a built-in mapping whose state is absent from the observation fails closed', () => {
  assert.throws(
    () =>
      resolveProcessMapping(
        'scrum@1',
        'Product Backlog Item',
        {
          ...agileObservation(),
          process: { id: '00000000-0000-0000-0000-000000000004', name: 'Scrum' },
          workItemType: {
            name: 'Product Backlog Item',
            states: [{ name: 'New', category: 'Proposed' }],
          },
        },
        null,
        null,
        NOW,
      ),
    /not observed/,
  );
});

test('placeholder values stay off the wire: no real process is referenced', () => {
  const observation = agileObservation();
  assert.ok(observation.process.id.startsWith('00000000'));
  assert.equal(observation.process.name, 'Agile');
  assert.equal(placeholder.processTypeId, '00000000-0000-0000-0000-000000000004');
});