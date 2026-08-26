import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  FakeCanonicalQueueStore,
  FakeEvidenceStore,
  FakePolicyAdapter,
  FakeSourceHostAdapter,
  FakeWorkItemAdapter,
} from '../../src/adapters/fakes/revised.ts';
import type { FinalizeCandidate, MutationCommand, MutationResult, QueueManifest, RunEvidence } from '../../src/domain/types.ts';
import type { AgentCheckpoint, IntegrationTarget, PolicySnapshot, PullRequestCompletion, PullRequestRef, PullRequestRequest, RemoteBranchRef } from '../../src/domain/types.ts';
import { evidenceForRun } from '../../src/domain/evidence.ts';
import { cleanupLivePilot, runLivePilot, validationCheckpointId } from '../../src/validation/live-pilot.ts';
import { ValidationLedger, validationMarker } from '../../src/validation/ledger.ts';

class PilotSourceHost extends FakeSourceHostAdapter {
  branch?: RemoteBranchRef;
  pullRequest?: PullRequestRef;
  readonly recordedCheckpoints: AgentCheckpoint[] = [];

  async createSourceBranch(sourceRef: string, fromCommit: string): Promise<RemoteBranchRef> {
    if (this.branch) throw new Error('validation branch already exists');
    this.branch = { sourceRef, headCommit: fromCommit };
    return this.branch;
  }

  async sourceHead(sourceRef: string): Promise<string | undefined> {
    return this.branch?.sourceRef === sourceRef ? this.branch.headCommit : undefined;
  }

  override async ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef> {
    this.pullRequest = {
      repositoryId: request.repositoryId,
      sourceRef: request.sourceRef,
      targetRef: request.targetRef,
      pullRequestId: 'pilot-pr',
      url: 'https://fake.invalid/pull/pilot-pr',
      sourceCommit: this.branch?.headCommit,
      targetCommit: this.targetHeadValue,
      workItemIds: request.workItemId ? [request.workItemId] : [],
      title: request.title,
      description: request.description,
      status: 'active',
    };
    return this.pullRequest;
  }

  override async readPullRequest(ref: PullRequestRef): Promise<PullRequestRef> {
    if (!this.pullRequest || ref.pullRequestId !== this.pullRequest.pullRequestId) throw new Error('pull request not found');
    return { ...this.pullRequest };
  }

  override async recordCheckpoint(_workItemId: string, checkpoint: AgentCheckpoint): Promise<void> {
    this.recordedCheckpoints.push(structuredClone(checkpoint));
  }

  override async readCheckpoints(_workItemId: string): Promise<AgentCheckpoint[]> {
    return this.recordedCheckpoints.map((checkpoint) => structuredClone(checkpoint));
  }

  override async completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion> {
    const mergeCommit = 'dddddddddddddddddddddddddddddddddddddddd';
    const completedRef: PullRequestRef = { ...ref, status: 'completed', targetCommit: expectedTargetCommit, mergeCommit, mergeStatus: 'succeeded' };
    this.pullRequest = completedRef;
    this.targetHeadValue = mergeCommit;
    return { pullRequestRef: { ...completedRef }, merged: true, targetCommit: mergeCommit };
  }

  async abandonPullRequest(ref: PullRequestRef, expectedSourceCommit = ref.sourceCommit): Promise<PullRequestRef> {
    if (expectedSourceCommit && this.branch?.headCommit !== expectedSourceCommit) throw new Error('source commit drifted before abandonment');
    const abandoned = { ...ref, status: 'abandoned' };
    this.pullRequest = abandoned;
    return abandoned;
  }
}

class FailingFinalizationQueueStore extends FakeCanonicalQueueStore {
  failFinalization = false;

  override async finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>> {
    if (this.failFinalization) {
      const current = await this.read(this.target);
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'injected queue finalization race' };
    }
    return super.finalize(command);
  }
}

class CrashAfterEvidenceAcceptanceStore extends FakeEvidenceStore {
  crashed = false;

  override async publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>> {
    const accepted = await super.publish(command);
    if (!this.crashed && command.input.providerMarker?.endsWith(':run-evidence-policy-blocked')) {
      this.crashed = true;
      throw new Error('injected crash after evidence provider acceptance');
    }
    return accepted;
  }
}

class DriftingPolicyAdapter extends FakePolicyAdapter {
  private readonly sourceHost: PilotSourceHost;
  private readonly drift: 'source' | 'target';

  constructor(sourceHost: PilotSourceHost, drift: 'source' | 'target') {
    super();
    this.sourceHost = sourceHost;
    this.drift = drift;
  }

  override async evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot> {
    if (this.drift === 'source' && this.sourceHost.branch) {
      this.sourceHost.branch = { ...this.sourceHost.branch, headCommit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' };
    } else if (this.drift === 'target') {
      this.sourceHost.targetHeadValue = 'cccccccccccccccccccccccccccccccccccccccc';
    }
    const target = { repositoryId: ref.repositoryId, targetRef: ref.targetRef };
    return {
      target,
      pullRequestRef: ref,
      headCommit: ref.sourceCommit ?? '',
      observedAt: '2026-08-14T00:00:00.000Z',
      inventory: { target, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'fake-policy', outcome: 'read' }], effectiveBlocking: [] },
      evaluations: [{ id: 'fake-policy', name: 'Fake policy', source: 'fake', kind: 'provider', verdict: 'passed', appliedToCommit: ref.sourceCommit }],
      aggregate: 'passed',
    };
  }
}

class BlockedPolicyAdapter extends FakePolicyAdapter {
  override async evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot> {
    const target = { repositoryId: ref.repositoryId, targetRef: ref.targetRef };
    return {
      target,
      pullRequestRef: ref,
      headCommit: ref.sourceCommit ?? '',
      observedAt: '2026-08-14T00:00:00.000Z',
      inventory: { target, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'fake-policy', outcome: 'read' }], effectiveBlocking: [] },
      evaluations: [{ id: 'fake-policy', name: 'Fake policy', source: 'fake', kind: 'provider', verdict: 'blocked', detail: 'approval is still pending', appliedToCommit: ref.sourceCommit }],
      aggregate: 'blocked',
    };
  }
}

test('live pilot cleanup removes the run-owned queue entry only after an attributable evidence check', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const integrationTarget = { repositoryId: target.repositoryId, targetRef: target.targetRef };
  const queue = new FakeCanonicalQueueStore(integrationTarget);
  queue.clock = () => '2026-08-14T00:00:00.000Z';
  const empty = await queue.read(integrationTarget);
  const enqueued = await queue.enqueue({
    operationId: 'run-cleanup:queue.enqueue',
    expectedRevision: empty.revision,
    actor: 'alice',
    requestedAt: queue.clock(),
    input: { candidateWorkItemId: '1000', runId: 'run-cleanup', dependencies: [], decisions: [] },
  });
  assert.equal(enqueued.disposition, 'applied');

  const root = await mkdtemp(join(tmpdir(), 'live-pilot-cleanup-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-cleanup', target, queue.clock);
    await ledger.recordIntent({
      artifactKey: 'queue-entry',
      operation: 'queue.entry.enqueue',
      expectedRevisionOrHead: empty.revision,
      cleanupOperation: 'queue-entry.remove',
      cleanupPrerequisites: ['run-owned queue tuple remains exact'],
    });
    await ledger.recordProviderAcceptance('queue-entry', 'queue:1', enqueued.revision);
    await ledger.acknowledge('queue-entry');
    const evidenceStore = new FakeEvidenceStore();
    const evidenceArtifactKey = 'run-evidence-policy-blocked';
    const providerMarker = validationMarker('run-cleanup', evidenceArtifactKey);
    await ledger.recordIntent({
      artifactKey: evidenceArtifactKey,
      operation: 'run-evidence.publish',
      expectedRevisionOrHead: 'rev-0',
      cleanupOperation: 'work-item.close',
    });
    const evidencePublication = await evidenceStore.publish({
      operationId: 'run-cleanup:evidence.policy-blocked',
      expectedRevision: 'rev-0',
      actor: 'alice',
      requestedAt: queue.clock(),
      input: { ...evidenceForRun('run-cleanup', '1000', 'alice'), providerMarker },
    });
    const recoveredEvidence = await evidenceStore.findPublications('1000', providerMarker);
    assert.equal(evidencePublication.disposition, 'applied');
    assert.equal(recoveredEvidence.length, 1);
    await ledger.recordProviderAcceptance(evidenceArtifactKey, recoveredEvidence[0].providerRef, recoveredEvidence[0].observedRevisionOrHead);
    await ledger.acknowledge(evidenceArtifactKey);

    const sourceHost = new FakeSourceHostAdapter();
    sourceHost.targetHeadValue = '0123456789abcdef0123456789abcdef01234567';
    const workItems = new FakeWorkItemAdapter();
    const result = await cleanupLivePilot({
      runId: 'run-cleanup',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new FakePolicyAdapter(),
      queue,
      workItems,
      evidenceStore,
      ledger,
      clock: queue.clock,
      allowSourceBranchDelete: async () => false,
    });

    assert.equal(result.outcome, 'passed');
    const [completion] = await queue.completionHistory(integrationTarget);
    assert.equal(completion?.outcome, 'rejected');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('live pilot rechecks both source and target heads after policy evaluation and before completion', async (t) => {
  for (const drift of ['source', 'target'] as const) {
    await t.test(drift + ' drift', async () => {
      const target = {
        organizationUrl: 'https://offline.invalid/organization',
        projectId: 'project-id',
        repositoryId: 'repository-id',
        targetRef: 'refs/heads/main',
      };
      const queue = new FakeCanonicalQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef });
      queue.clock = () => '2026-08-14T00:00:00.000Z';
      const sourceHost = new PilotSourceHost();
      const workItems = new FakeWorkItemAdapter();
      workItems.items.set('1000', {
        id: '1000',
        title: 'Validation candidate',
        dependencies: [],
        changeScope: { paths: [], semanticSeams: [], prerequisites: [], integrationTarget: target.targetRef },
      });
      const root = await mkdtemp(join(tmpdir(), 'live-pilot-drift-'));
      try {
        const ledger = await ValidationLedger.open(root, 'run-' + drift, target, queue.clock);
        await assert.rejects(
          () => runLivePilot({
            runId: 'run-' + drift,
            actor: 'alice',
            candidateWorkItemId: '1000',
            target,
            sourceHost,
            policyAdapter: new DriftingPolicyAdapter(sourceHost, drift),
            queue,
            workItems,
            evidenceStore: new FakeEvidenceStore(),
            ledger,
            clock: queue.clock,
            allowSourceBranchDelete: async () => false,
          }),
          /source\/target head drifted/,
        );
        assert.equal((await sourceHost.readPullRequest(sourceHost.pullRequest!)).status, 'active');
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    });
  }
});

test('blocked live pilot publishes attributable blocker evidence before returning', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const queue = new FakeCanonicalQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef });
  queue.clock = () => '2026-08-14T00:00:00.000Z';
  const sourceHost = new PilotSourceHost();
  const workItems = new FakeWorkItemAdapter();
  workItems.items.set('1000', {
    id: '1000',
    title: 'Validation candidate',
    dependencies: [],
    changeScope: { paths: [], semanticSeams: [], prerequisites: [], integrationTarget: target.targetRef },
  });
  const evidenceStore = new FakeEvidenceStore();
  const root = await mkdtemp(join(tmpdir(), 'live-pilot-blocked-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-blocked', target, queue.clock);
    const result = await runLivePilot({
      runId: 'run-blocked',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new BlockedPolicyAdapter(),
      queue,
      workItems,
      evidenceStore,
      ledger,
      clock: queue.clock,
      allowSourceBranchDelete: async () => false,
    });

    assert.equal(result.outcome, 'blocked');
    assert.equal((await sourceHost.readPullRequest(sourceHost.pullRequest!)).status, 'active');
    const evidence = await evidenceStore.read('run-blocked');
    assert.equal(evidence.workItemId, '1000');
    assert.equal(evidence.owner, 'alice');
    assert.equal(evidence.branch, result.artifacts.sourceRef);
    assert.equal(evidence.pullRequestRef, result.artifacts.pullRequest.url);
    assert.equal(evidence.policyOutcome, 'blocked');
    assert.equal(evidence.queueDecision, 'rejected');
    assert.equal(evidence.integrationResult, 'rejected');
    assert.equal(evidence.blocker, 'conflict');
    assert.equal(evidence.verification.find((item) => item.command === 'azure-live provider-policy')?.outcome, 'blocked');
    assert.deepEqual(evidence.checkpointRefs, [validationCheckpointId('run-blocked')]);
    assert.equal((await sourceHost.readCheckpoints('1000'))[0]?.checkpointId, validationCheckpointId('run-blocked'));
    assert.deepEqual(evidence.stateTransitions.map(({ from, to }) => [from, to]), [
      ['requested', 'claimed'],
      ['claimed', 'preparing'],
      ['preparing', 'running'],
      ['running', 'verifying'],
      ['verifying', 'failed'],
    ]);
    const queueState = await queue.read({ repositoryId: target.repositoryId, targetRef: target.targetRef });
    assert.deepEqual(queueState.value.entries, []);
    assert.equal(queueState.value.lease, null);
    const [completion] = await queue.completionHistory({ repositoryId: target.repositoryId, targetRef: target.targetRef });
    assert.equal(completion?.outcome, 'rejected');
    const policyEvidence = await evidenceStore.findPublications('1000', validationMarker('run-blocked', 'run-evidence-policy-blocked'));
    assert.equal(completion?.evidenceRef, policyEvidence[0]?.providerRef);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('live pilot reports canonical queue PASS only after finalization succeeds', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const evidenceStore = new FakeEvidenceStore();
  const queue = new FakeCanonicalQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef });
  queue.clock = () => '2026-08-14T00:00:00.000Z';
  const sourceHost = new PilotSourceHost();
  const workItems = new FakeWorkItemAdapter();
  workItems.items.set('1000', {
    id: '1000',
    title: 'Validation candidate',
    dependencies: [],
    changeScope: { paths: [], semanticSeams: [], prerequisites: [], integrationTarget: target.targetRef },
  });
  const root = await mkdtemp(join(tmpdir(), 'live-pilot-sequence-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-success', target, queue.clock);
    const result = await runLivePilot({
      runId: 'run-success',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new FakePolicyAdapter(),
      queue,
      workItems,
      evidenceStore,
      ledger,
      clock: queue.clock,
      allowSourceBranchDelete: async () => false,
    });

    assert.equal(result.outcome, 'passed');
    const preFinalize = (await evidenceStore.findPublications('1000', validationMarker('run-success', 'run-evidence-pre-finalize')))[0]?.evidence;
    assert.equal(preFinalize?.integrationResult, 'pending');
    assert.equal(preFinalize?.queueDecision, 'queued');
    assert.equal(preFinalize?.verification.find((item) => item.command === 'azure-live canonical-queue')?.outcome, 'unexecuted');
    const finalEvidence = await evidenceStore.read('run-success');
    assert.equal(finalEvidence.integrationResult, 'integrated');
    assert.equal(finalEvidence.queueDecision, 'integrated');
    assert.equal(finalEvidence.verification.find((item) => item.command === 'azure-live canonical-queue')?.outcome, 'passed');
    assert.deepEqual(finalEvidence.checkpointRefs, [result.artifacts.checkpointId]);
    const [completion] = await queue.completionHistory({ repositoryId: target.repositoryId, targetRef: target.targetRef });
    assert.equal(completion?.candidateWorkItemId, '1000');
    assert.equal(completion?.runId, 'run-success');
    assert.match(completion?.evidenceRef ?? '', /^comment:\d+$/);
    assert.deepEqual(finalEvidence.stateTransitions.map(({ from, to }) => [from, to]), [
      ['requested', 'claimed'],
      ['claimed', 'preparing'],
      ['preparing', 'running'],
      ['running', 'verifying'],
      ['verifying', 'ready-for-integration'],
      ['ready-for-integration', 'integrated'],
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('live pilot cleanup blocks PR abandonment when the provider source commit differs from the ledger-accepted head', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const sourceHost = new PilotSourceHost();
  const sourceRef = 'refs/heads/agent-workspace-validation/run-pr-cleanup-drift/source-branch';
  sourceHost.branch = { sourceRef, headCommit: 'original-source-commit' };
  sourceHost.pullRequest = {
    repositoryId: target.repositoryId,
    sourceRef,
    targetRef: target.targetRef,
    pullRequestId: 'pilot-pr',
    url: 'https://fake.invalid/pull/pilot-pr',
    sourceCommit: 'drifted-source-commit',
    targetCommit: sourceHost.targetHeadValue,
    workItemIds: ['1000'],
    title: 'Agent Workspace validation run-pr-cleanup-drift',
    description: [
      'agent-workspace:validation:run-pr-cleanup-drift:pull-request',
      [target.organizationUrl, target.projectId, target.repositoryId, target.targetRef].join('|'),
    ].join('\n'),
    status: 'active',
  };
  const root = await mkdtemp(join(tmpdir(), 'live-pilot-pr-cleanup-drift-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-pr-cleanup-drift', target);
    await ledger.recordIntent({
      artifactKey: 'pull-request',
      operation: 'pull-request.create',
      expectedRevisionOrHead: 'original-source-commit',
      cleanupOperation: 'pull-request.abandon',
    });
    await ledger.recordProviderAcceptance('pull-request', 'pull-request:pilot-pr', 'original-source-commit');
    await ledger.acknowledge('pull-request');
    const result = await cleanupLivePilot({
      runId: 'run-pr-cleanup-drift',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new FakePolicyAdapter(),
      queue: new FakeCanonicalQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef }),
      workItems: new FakeWorkItemAdapter(),
      evidenceStore: new FakeEvidenceStore(),
      ledger,
      clock: () => '2026-08-14T00:00:00.000Z',
      allowSourceBranchDelete: async () => true,
    }, {
      evaluatedTargetCommit: sourceHost.targetHeadValue,
      targetCommit: sourceHost.targetHeadValue,
      sourceRef,
      sourceHead: 'original-source-commit',
      checkpointId: validationCheckpointId('run-pr-cleanup-drift'),
      pullRequest: sourceHost.pullRequest,
      completed: false,
    });

    assert.equal(result.outcome, 'blocked');
    assert.match(result.evidence.join('\n'), /source commit.*drifted/i);
    assert.equal((await sourceHost.readPullRequest(sourceHost.pullRequest)).status, 'active');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('crash after evidence provider acceptance is recovered from the deterministic provider marker', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const queue = new FakeCanonicalQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef });
  queue.clock = () => '2026-08-14T00:00:00.000Z';
  const sourceHost = new PilotSourceHost();
  const workItems = new FakeWorkItemAdapter();
  workItems.items.set('1000', {
    id: '1000',
    title: 'Validation candidate',
    dependencies: [],
    changeScope: { paths: [], semanticSeams: [], prerequisites: [], integrationTarget: target.targetRef },
  });
  const evidenceStore = new CrashAfterEvidenceAcceptanceStore();
  const root = await mkdtemp(join(tmpdir(), 'live-pilot-evidence-crash-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-evidence-crash', target, queue.clock);
    await assert.rejects(() => runLivePilot({
      runId: 'run-evidence-crash',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new BlockedPolicyAdapter(),
      queue,
      workItems,
      evidenceStore,
      ledger,
      clock: queue.clock,
      allowSourceBranchDelete: async () => false,
    }), /after evidence provider acceptance/);

    const evidenceEntry = ledger.snapshot().entries.find((entry) => entry.artifactKey === 'run-evidence-policy-blocked');
    assert.equal(evidenceEntry?.state, 'intent-recorded');
    for (const entry of ledger.snapshot().entries.filter((candidate) => candidate.artifactKey !== 'run-evidence-policy-blocked')) {
      await ledger.markCleanup(entry.artifactKey, 'passed', 'isolated crash-recovery test fixture');
    }
    const recovered = await ledger.recover(async (marker) => (await evidenceStore.findPublications('1000', marker)).map((publication) => ({
      providerRef: publication.providerRef,
      observedRevisionOrHead: publication.observedRevisionOrHead,
    })), true);
    assert.deepEqual(recovered.blocked, []);
    assert.deepEqual(recovered.repaired, ['run-evidence-policy-blocked']);
    assert.equal(ledger.snapshot().entries.find((entry) => entry.artifactKey === 'run-evidence-policy-blocked')?.providerRef, 'comment:1');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('queue finalization race leaves only pending evidence and never records canonical queue PASS', async () => {
  const target = {
    organizationUrl: 'https://offline.invalid/organization',
    projectId: 'project-id',
    repositoryId: 'repository-id',
    targetRef: 'refs/heads/main',
  };
  const evidenceStore = new FakeEvidenceStore();
  const queue = new FailingFinalizationQueueStore({ repositoryId: target.repositoryId, targetRef: target.targetRef });
  queue.clock = () => '2026-08-14T00:00:00.000Z';
  queue.failFinalization = true;
  const sourceHost = new PilotSourceHost();
  const workItems = new FakeWorkItemAdapter();
  workItems.items.set('1000', {
    id: '1000',
    title: 'Validation candidate',
    dependencies: [],
    changeScope: { paths: [], semanticSeams: [], prerequisites: [], integrationTarget: target.targetRef },
  });
  const root = await mkdtemp(join(tmpdir(), 'live-pilot-finalize-race-'));
  try {
    const ledger = await ValidationLedger.open(root, 'run-finalize-race', target, queue.clock);
    await assert.rejects(() => runLivePilot({
      runId: 'run-finalize-race',
      actor: 'alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: new FakePolicyAdapter(),
      queue,
      workItems,
      evidenceStore,
      ledger,
      clock: queue.clock,
      allowSourceBranchDelete: async () => false,
    }), /queue finalization did not apply/);

    const allEvidence = await evidenceStore.list('1000');
    assert.equal(allEvidence.some((record) => record.queueDecision === 'integrated' || record.verification.some((item) => item.command === 'azure-live canonical-queue' && item.outcome === 'passed')), false);
    assert.equal(allEvidence.at(-1)?.queueDecision, 'queued');
    assert.equal(allEvidence.at(-1)?.integrationResult, 'pending');
    assert.equal((await queue.completionHistory({ repositoryId: target.repositoryId, targetRef: target.targetRef })).length, 0);
    assert.equal(ledger.snapshot().entries.find((entry) => entry.artifactKey === 'queue-finalize')?.state, 'intent-recorded');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
