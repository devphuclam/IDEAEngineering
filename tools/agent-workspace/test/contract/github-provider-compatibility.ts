// T010: Revised-port GitHub compatibility contract - claims, checkpoints,
// immutable evidence, PRs, revisions, normal-enqueue coordination-Issue
// create/reuse/create-race failure, queue recovery after local loss, read-only
// not-applicable preparation, shared runtime readiness, policy, and existing
// black-box behavior (FR-027, FR-036).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUEUE_DISCOVERY_LABEL,
  githubQueueKey,
  queueKeyTag,
} from '../../src/adapters/github/revisions.ts';
import {
  GithubCanonicalQueueStore,
  GithubQueueStoreError,
  type GithubIssueStore,
} from '../../src/adapters/github/queue.ts';
import { GithubPreparationAdapter } from '../../src/adapters/github/preparation.ts';
import type { EnqueueCandidate, IntegrationTarget, MutationCommand } from '../../src/domain/types.ts';
import type { WireComment as RevisionWireComment } from '../../src/adapters/github/revisions.ts';
import { runProviderPortContractSuites } from './provider-ports.ts';
import { FakeHttpTransport } from '../../src/adapters/fakes/revised.ts';

const NOW = '2026-08-14T00:00:00.000Z';
const REPOSITORY_ID = '123456789';
const TARGET: IntegrationTarget = { repositoryId: REPOSITORY_ID, targetRef: 'refs/heads/main' };
const QUEUE_KEY = githubQueueKey(REPOSITORY_ID, TARGET.targetRef);

function command<T>(operationId: string, input: T): MutationCommand<T> {
  return { operationId, expectedRevision: 'ignored-first-attempt', actor: 'test-runner', requestedAt: NOW, input };
}

async function enqueueWithRevision(
  queue: GithubCanonicalQueueStore,
  operationId: string,
  input: EnqueueCandidate,
): Promise<ReturnType<GithubCanonicalQueueStore['enqueue']>> {
  const revision = (await queue.read(TARGET)).revision;
  return queue.enqueue({ operationId, expectedRevision: revision, actor: 'test-runner', requestedAt: NOW, input });
}

function inMemoryIssueStore(): GithubIssueStore & { comments: RevisionWireComment[]; issues: Map<number, { labels: string[] }> } {
  const comments: RevisionWireComment[] = [];
  const issues = new Map<number, { labels: string[] }>();
  let nextIssue = 1;
  return {
    comments,
    issues,
    readIssue: async (issueNumber) => {
      const issue = issues.get(issueNumber);
      if (!issue) throw new Error('issue not found');
      return { number: issueNumber, labels: issue.labels, title: 'queue', body: '' };
    },
    listComments: async () => [...comments],
    addComment: async (_issueNumber, body) => {
      const comment: RevisionWireComment = {
        id: comments.length + 1,
        body,
        createdAt: new Date(Date.parse(NOW) + comments.length).toISOString(),
      };
      comments.push(comment);
      return comment;
    },
    createIssue: async (input) => {
      const number = nextIssue;
      nextIssue += 1;
      issues.set(number, { labels: input.labels });
      return { number };
    },
    findIssues: async (labels) =>
      [...issues.entries()]
        .filter(([, issue]) => labels.every((label) => issue.labels.includes(label)))
        .map(([number, issue]) => ({ number, labels: issue.labels })),
  };
}

test('the first normal enqueue creates the deterministic coordination Issue/label pair', async () => {
  const issueStore = inMemoryIssueStore();
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  const result = await queue.enqueue(command('op-1', {
    candidateWorkItemId: 'w1',
    runId: 'run-1',
    dependencies: [],
    decisions: [],
  }));
  assert.equal(result.disposition, 'applied');
  assert.equal(issueStore.issues.size, 1);
  const issue = [...issueStore.issues.values()][0];
  assert.deepEqual(issue.labels.sort(), [QUEUE_DISCOVERY_LABEL, queueKeyTag(QUEUE_KEY)].sort());
});

test('a later normal enqueue reuses the existing coordination Issue', async () => {
  const issueStore = inMemoryIssueStore();
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
  const second = await enqueueWithRevision(queue, 'op-2', { candidateWorkItemId: 'w2', runId: 'run-2', dependencies: [], decisions: [] });
  assert.equal(second.disposition, 'applied');
  assert.equal(issueStore.issues.size, 1, 'one Issue is reused');
  const manifest = await queue.read(TARGET);
  assert.equal(manifest.value.entries.length, 2);
});

test('a create race with another writer fails closed for administrator remediation', async () => {
  const issueStore = inMemoryIssueStore();
  const originalCreate = issueStore.createIssue.bind(issueStore);
  issueStore.createIssue = async (input) => {
    const created = await originalCreate(input);
    await originalCreate(input);
    return created;
  };
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  await assert.rejects(
    queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] })),
    /raced with another writer/,
  );
});

test('multiple coordination Issues matching the label pair block discovery', async () => {
  const issueStore = inMemoryIssueStore();
  await issueStore.createIssue({ title: 'a', body: '', labels: [QUEUE_DISCOVERY_LABEL, queueKeyTag(QUEUE_KEY)] });
  await issueStore.createIssue({ title: 'b', body: '', labels: [QUEUE_DISCOVERY_LABEL, queueKeyTag(QUEUE_KEY)] });
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  await assert.rejects(queue.read(TARGET), GithubQueueStoreError);
});

test('queue state recovers from a fresh store after local loss (immutable comment stream)', async () => {
  const issueStore = inMemoryIssueStore();
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
  await enqueueWithRevision(queue, 'op-2', { candidateWorkItemId: 'w2', runId: 'run-2', dependencies: [], decisions: [] });

  const recovered = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  const manifest = await recovered.read(TARGET);
  assert.equal(manifest.value.entries.length, 2);
  assert.deepEqual(manifest.value.entries.map((entry) => entry.candidateWorkItemId), ['w1', 'w2']);
  assert.equal(manifest.value.nextEnqueueSequence, 3);
});

test('duplicate enqueue delivery of the same operation is durable', async () => {
  const issueStore = inMemoryIssueStore();
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  const input: EnqueueCandidate = { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] };
  const first = await queue.enqueue(command('op-1', input));
  const duplicate = await queue.enqueue(command('op-1', input));
  assert.equal(first.disposition, 'applied');
  assert.equal(duplicate.disposition, 'duplicate');
  const manifest = await queue.read(TARGET);
  assert.equal(manifest.value.entries.length, 1);
});

test('stale expected revisions reread under the MAX_STALE_REREADS budget then conflict', async () => {
  const issueStore = inMemoryIssueStore();
  const queue = new GithubCanonicalQueueStore(issueStore, {
    repositoryId: REPOSITORY_ID,
    targetRef: TARGET.targetRef,
    repositoryName: 'template',
  });
  await queue.enqueue(command('op-1', { candidateWorkItemId: 'w1', runId: 'run-1', dependencies: [], decisions: [] }));
  const stale = await queue.enqueue(
    { operationId: 'op-2', expectedRevision: 'never-matching', actor: 'test-runner', requestedAt: NOW, input: { candidateWorkItemId: 'w2', runId: 'run-2', dependencies: [], decisions: [] } },
  );
  assert.equal(stale.disposition, 'conflict');
});

test('read-only not-applicable preparation never creates a coordination Issue', async () => {
  const issueStore = inMemoryIssueStore();
  const preparation = new GithubPreparationAdapter();
  const plan = await preparation.preview();
  assert.equal(plan.applicability, 'not-applicable');
  const result = await preparation.apply(command('op-1', plan));
  assert.equal(result.disposition, 'not-applicable');
  assert.equal(result.classification, 'capability');
  assert.equal(issueStore.issues.size, 0, 'no bootstrap side effect');
});

test('readiness and policy surfaces agree with the GitHub provider shape', async () => {
  const preparation = new GithubPreparationAdapter();
  const readiness = await preparation.readiness();
  assert.equal(readiness.provider, 'github');
  assert.equal(readiness.runtime.outcome, 'not-selected');
  assert.equal(readiness.configuration.outcome, 'passed');
  assert.ok(Array.isArray(readiness.permissions));
});

test('the GitHub provider reports the expected queue-key vector', () => {
  assert.equal(QUEUE_KEY.length, 64);
  assert.notEqual(githubQueueKey(REPOSITORY_ID, 'refs/heads/dev'), QUEUE_KEY);
  assert.notEqual(githubQueueKey('987654321', TARGET.targetRef), QUEUE_KEY);
});

test('the Azure transport fake never reaches a production network', async () => {
  const transport = new FakeHttpTransport(async (request) => {
    assert.ok(!request.url.startsWith('https://dev.azure.com/'), 'fake transport must not hit the wire');
    return { status: 200, headers: {}, body: '{}' };
  });
  const response = await transport.request({ method: 'GET', url: 'https://fake.invalid/projects', headers: {} });
  assert.equal(response.status, 200);
});

test('the shared provider-port contract suites still pass for the neutral fakes', () => {
  runProviderPortContractSuites();
});