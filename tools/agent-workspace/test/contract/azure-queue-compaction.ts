import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeOfflineAzureAdapters, offlineConfig } from '../fixtures/azure/harness.ts';
import { replaceManagedBlock } from '../../src/adapters/azure/blocks.ts';
import { canonicalQueueKey, QUEUE_DISCOVERY_TAG, queueKeyTag } from '../../src/adapters/azure/target.ts';
import { queueCompletionBody } from '../../src/domain/records.ts';
import type { QueueCompletionSummary, QueueManifest } from '../../src/domain/types.ts';

test('Azure queue recovery keeps 10,000 compact completion summaries outside the active manifest', async () => {
  const adapters = makeOfflineAzureAdapters();
  const queueKey = canonicalQueueKey(offlineConfig.organizationUrl, offlineConfig.project.expectedId!, offlineConfig.repository.expectedId!, offlineConfig.integrationTarget);
  const manifest: QueueManifest = {
    schema: 'agent-workspace/queue-manifest',
    version: 1,
    queueKey,
    organizationUrl: offlineConfig.organizationUrl,
    projectId: offlineConfig.project.expectedId!,
    repositoryId: offlineConfig.repository.expectedId!,
    targetRef: offlineConfig.integrationTarget,
    nextEnqueueSequence: 10_001,
    entries: [],
    lease: null,
    lastOperation: null,
    pendingPublication: null,
  };
  const queueId = adapters.state.seed({ 'System.Title': 'Offline integration queue', 'System.Description': replaceManagedBlock('', 'queue-manifest', manifest).description, 'System.State': 'New', 'System.Tags': `${QUEUE_DISCOVERY_TAG}; ${queueKeyTag(queueKey)}` }, 3000);
  const comments = adapters.state.comments.get(queueId)!;
  for (let index = 1; index <= 10_000; index += 1) {
    const summary: QueueCompletionSummary = {
      operationId: `completion-${index}`,
      sequence: index,
      candidateWorkItemId: `candidate-${index}`,
      runId: `run-${index}`,
      outcome: 'integrated',
      at: '2026-08-14T00:00:00.000Z',
      evidenceRef: `run:run-${index}`,
    };
    comments.push({ id: index, rev: 1, text: queueCompletionBody(summary), createdBy: { displayName: 'offline-user', uniqueName: 'offline@example.invalid' }, createdDate: '2026-08-14T00:00:00.000Z', version: 1 });
  }
  const fresh = makeOfflineAzureAdapters(adapters.state);
  const recovered = await fresh.queue.read(fresh.target);
  const history = await fresh.queue.completionHistory(fresh.target);
  assert.equal(recovered.value.entries.length, 0);
  assert.equal(history.length, 10_000);
  assert.equal(new Set(history.map((entry) => entry.operationId)).size, 10_000);
});
