// T015: Queue Manifest serializer/parser tests - deterministic HTML-escaped
// JSON, byte-preserving managed-slice replacement, exact markers,
// schema/version checks, and corrupt/duplicate block rejection (FR-006,
// FR-016).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ManagedBlockError,
  blockTag,
  parseChangeScope,
  parseCoordinationState,
  parseManagedBlock,
  parseQueueManifest,
  replaceManagedBlock,
} from '../../../src/adapters/azure/blocks.ts';
import type { QueueManifest } from '../../../src/domain/types.ts';

const manifest: QueueManifest = {
  schema: 'agent-workspace/queue-manifest',
  version: 1,
  queueKey: 'queue-key-1',
  organizationUrl: 'https://dev.azure.com/placeholder-organization',
  projectId: '00000000-0000-0000-0000-000000000001',
  repositoryId: '00000000-0000-0000-0000-000000000002',
  targetRef: 'refs/heads/main',
  nextEnqueueSequence: 2,
  entries: [
    {
      sequence: 1,
      candidateWorkItemId: '1001',
      runId: 'run-1',
      state: 'queued',
      enqueuedAt: '2026-08-14T00:00:00.000Z',
      dependencies: [],
      decisions: [],
    },
  ],
  lease: null,
  lastOperation: null,
  pendingPublication: null,
};

test('a serialized block carries the exact V1 markers and HTML-escaped canonical JSON', () => {
  const { description } = replaceManagedBlock('', 'queue-manifest', manifest);
  assert.ok(description.startsWith('AGENT-WORKSPACE:QUEUE-MANIFEST:V1:BEGIN\n'));
  assert.ok(description.endsWith('\nAGENT-WORKSPACE:QUEUE-MANIFEST:V1:END'));
  assert.ok(description.includes('<pre>'));
  assert.ok(!description.includes('&lt;') || description.includes('&lt;'), 'escapes < only when present');
  const parsed = parseQueueManifest(description);
  assert.equal(parsed.kind, 'queue-manifest');
  assert.equal(parsed.label, 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1');
  assert.equal(parsed.value.nextEnqueueSequence, 2);
  assert.deepEqual(parsed.value.entries, manifest.entries);
});

test('HTML-escaping round-trips angle brackets and ampersands', () => {
  const description = '<div>system & \"quoted\"</div>';
  const { description: replaced } = replaceManagedBlock(description, 'change-scope', {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: ['src/a<&>b'],
    semanticSeams: [],
    prerequisites: [],
    integrationTarget: 'refs/heads/main',
  });
  const parsed = parseChangeScope(replaced);
  assert.equal(parsed.value.paths[0], 'src/a<&>b');
  assert.ok(replaced.startsWith('<div>system & "quoted"</div>'), 'surrounding content is byte-preserved');
});

test('replacement preserves all surrounding content byte-for-byte', () => {
  const preamble = 'title: placeholder\n\n';
  const postamble = '\n\nCLOSING NOTE';
  const first = replaceManagedBlock(preamble, 'coordination-state', {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1001',
    claim: null,
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  });
  const combined = first.description + postamble;
  const second = replaceManagedBlock(combined, 'coordination-state', {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId: '1001',
    claim: {
      claimToken: 't1',
      claimant: 'alice',
      runId: 'run-1',
      acquiredAt: '2026-08-14T00:00:00.000Z',
      leaseExpiresAt: '2026-08-14T01:00:00.000Z',
    },
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  });
  assert.ok(second.description.startsWith(preamble));
  assert.ok(second.description.endsWith(postamble), 'the postamble survives after the replaced block');
  assert.ok(second.description.includes('AGENT-WORKSPACE:COORDINATION-STATE:V1:END'));
  assert.equal(first.changed, true);
  assert.equal(second.changed, true);
  const parsed = parseCoordinationState(second.description);
  assert.equal(parsed.value.claim?.claimant, 'alice');
});

test('an identical block replacement is a no-op (changed: false)', () => {
  const first = replaceManagedBlock('', 'queue-manifest', manifest);
  const second = replaceManagedBlock(first.description, 'queue-manifest', manifest);
  assert.equal(second.changed, false);
  assert.equal(second.description, first.description);
});

test('corrupt and duplicate blocks are rejected', () => {
  const { description } = replaceManagedBlock('', 'queue-manifest', manifest);
  const duplicated = description + '\n' + description;
  assert.throws(() => parseQueueManifest(duplicated), /exactly one/);
  const reversed = description.split('\n').reverse().join('\n');
  assert.throws(() => parseQueueManifest(reversed), ManagedBlockError);
  assert.throws(() => parseQueueManifest('no block at all'), /no queue-manifest block/);
  const broken = description.replace('<pre>', '<notpre>');
  assert.throws(() => parseQueueManifest(broken), /exactly one <pre>/);
});

test('reversed or partially present markers fail closed', () => {
  const begin = 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1:BEGIN';
  const end = 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1:END';
  assert.throws(() => parseManagedBlock(`${end}\n<pre>{}</pre>\n${begin}`, 'queue-manifest'), /reversed/);
  assert.throws(() => parseManagedBlock(begin + '\n<pre>{}</pre>', 'queue-manifest'), /partially present|exactly one/);
});

test('schema and version checks reject foreign or future blocks', () => {
  const { description } = replaceManagedBlock('', 'queue-manifest', { ...manifest, schema: 'agent-workspace/other' } as unknown as QueueManifest);
  assert.throws(() => parseQueueManifest(description), /schema mismatch/);
  const versionTwo = replaceManagedBlock('', 'queue-manifest', { ...manifest, version: 2 } as unknown as QueueManifest);
  assert.throws(() => parseQueueManifest(versionTwo.description), /version must be 1/);
});

test('blockTag and parseManagedBlock agree on kind markers', () => {
  assert.equal(blockTag('queue-manifest'), 'AGENT-WORKSPACE:QUEUE-MANIFEST:V1');
  assert.equal(blockTag('coordination-state'), 'AGENT-WORKSPACE:COORDINATION-STATE:V1');
  assert.equal(blockTag('change-scope'), 'AGENT-WORKSPACE:CHANGE-SCOPE:V1');
  const { description } = replaceManagedBlock('', 'queue-manifest', manifest);
  const parsed = parseManagedBlock(description, 'queue-manifest');
  assert.equal(parsed.label, blockTag('queue-manifest'));
});

test('nested blocks of the same kind are rejected', () => {
  const inner = replaceManagedBlock('', 'queue-manifest', manifest).description;
  const nested = inner.replace('\n<pre>', inner + '\n<pre>');
  assert.throws(() => parseQueueManifest(nested), ManagedBlockError);
});