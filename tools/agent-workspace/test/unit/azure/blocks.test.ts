import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseChangeScope,
  parseCoordinationState,
  replaceManagedBlock,
} from '../../../src/adapters/azure/blocks.ts';
import type { ChangeScopeBlock, CoordinationState } from '../../../src/domain/types.ts';

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
  semanticSeams: ['shared-model'],
  prerequisites: ['999'],
  integrationTarget: 'refs/heads/main',
};

test('Coordination State and Change Scope round-trip while preserving human bytes', () => {
  const original = '<p>Human-authored note &amp; punctuation.</p>';
  const withCoordination = replaceManagedBlock(original, 'coordination-state', coordination).description;
  const description = replaceManagedBlock(withCoordination, 'change-scope', scope).description;
  assert.match(description, /Human-authored note &amp; punctuation/);
  assert.deepEqual(parseCoordinationState(description).value, coordination);
  assert.deepEqual(parseChangeScope(description).value, scope);
});

test('managed blocks reject duplicate, reversed, and mixed-version records', () => {
  const description = replaceManagedBlock('human', 'coordination-state', coordination).description;
  assert.throws(() => parseCoordinationState(description + description), /duplicate|multiple|exactly one/i);
  assert.throws(
    () => parseCoordinationState(description.replace('COORDINATION-STATE:V1:END', 'COORDINATION-STATE:V2:END')),
    /missing|reversed|partial|exactly one/i,
  );
  assert.throws(
    () => parseCoordinationState(description.replace('"version":1', '"version":2')),
    /version|schema/i,
  );
});
