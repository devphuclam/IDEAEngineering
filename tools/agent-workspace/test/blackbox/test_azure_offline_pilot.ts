import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { SecretString } from '../../src/adapters/azure/auth.ts';
import { AzureHttpClient } from '../../src/adapters/azure/http.ts';
import { AzurePreparationAdapter } from '../../src/adapters/azure/bootstrap.ts';
import { AzureWorkItemAdapter } from '../../src/adapters/azure/boards.ts';
import { AzureClaimStore } from '../../src/adapters/azure/claims.ts';
import { AzureEvidenceStore } from '../../src/adapters/azure/evidence.ts';
import { AzureCanonicalQueueStore } from '../../src/adapters/azure/queue.ts';
import { AzurePolicyAdapter } from '../../src/adapters/azure/policies.ts';
import { AzureSourceHostAdapter } from '../../src/adapters/azure/repos.ts';
import { FakeAzureState, fakeAzureCanonicalState } from '../../src/adapters/fakes/azure.ts';
import { LocalVerificationRunnerImpl } from '../../src/adapters/local/verification.ts';
import { evaluateLiveGate, ValidationLedger, validationMarker } from '../../src/validation/ledger.ts';
import { cleanupLivePilot, runLivePilot, validationCheckpointId, validationTarget } from '../../src/validation/live-pilot.ts';
import { evidenceForRun } from '../../src/domain/evidence.ts';
import { canonicalQueueKey } from '../../src/adapters/azure/target.ts';
import { offlineConfig } from '../fixtures/azure/harness.ts';
import type { PolicySnapshot, PullRequestRef } from '../../src/domain/types.ts';

test('offline Azure pilot uses real adapters, two identities, recovery, queue, policy, and no production network', async () => {
  const state = new FakeAzureState();
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const authSelection = { source: 'entra' as const, credential: SecretString.from('offline-only-token'), detail: 'offline simulated identity' };
  const prep = new AzurePreparationAdapter({ client, config: offlineConfig, authSelection, clock: () => '2026-08-14T00:00:00.000Z' });
  const plan = await prep.preview();
  const prepared = await prep.apply({ operationId: 'offline-prepare', expectedRevision: plan.digest, actor: 'offline-alice', requestedAt: '2026-08-14T00:00:00.000Z', input: plan });
  assert.equal(prepared.disposition, 'applied');

  const options = { client, projectName: offlineConfig.project.name, integrationTarget: offlineConfig.integrationTarget, organizationUrl: offlineConfig.organizationUrl, projectId: offlineConfig.project.expectedId!, clock: () => '2026-08-14T00:00:00.000Z' };
  const boards = new AzureWorkItemAdapter(options);
  const alice = new AzureClaimStore({ ...options, publisherId: 'offline-alice' });
  const bob = new AzureClaimStore({ ...options, publisherId: 'offline-bob' });
  const evidence = new AzureEvidenceStore({ ...options, publisherId: 'offline-evidence' }, boards);
  const queue = new AzureCanonicalQueueStore({ ...options, repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget, queueKey: canonicalQueueKey(offlineConfig.organizationUrl, offlineConfig.project.expectedId!, offlineConfig.repository.expectedId!, offlineConfig.integrationTarget) });
  const policies = new AzurePolicyAdapter({ client, projectName: offlineConfig.project.name, repositoryId: offlineConfig.repository.expectedId!, clock: () => '2026-08-14T00:00:00.000Z' });

  const claimInput = (claimant: string, runId: string) => ({ workItemId: '1000', claimToken: 'offline-' + claimant, claimant, runId, acquiredAt: '2026-08-14T00:00:00.000Z', leaseExpiresAt: '2026-08-14T01:00:00.000Z', kind: 'acquire' as const });
  const aliceClaim = { operationId: 'offline-claim-alice', expectedRevision: '1', actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: claimInput('alice', 'run-alice') };
  const firstClaim = await alice.acquire(aliceClaim);
  assert.equal(firstClaim.disposition, 'applied');
  const recoveredAlice = new AzureClaimStore({ ...options, publisherId: 'offline-alice-recovered' });
  const duplicateClaim = await recoveredAlice.acquire(aliceClaim);
  assert.equal(duplicateClaim.disposition, 'duplicate');
  assert.match(duplicateClaim.receiptRef ?? '', /operation:offline-claim-alice/);
  const secondClaim = await bob.acquire({ operationId: 'offline-claim-bob', expectedRevision: '1', actor: 'bob', requestedAt: '2026-08-14T00:00:00.000Z', input: claimInput('bob', 'run-bob') });
  assert.equal(secondClaim.disposition, 'conflict');
  assert.equal((await bob.active('1000')).value?.claimant, 'alice');

  const staleRead = await boards.read('1000');
  state.workItems.get(1000)!.rev += 1;
  const staleUpdate = await boards.updateManaged({
    operationId: 'offline-stale-work-item-update',
    expectedRevision: staleRead.revision,
    actor: 'alice',
    requestedAt: '2026-08-14T00:00:00.000Z',
    input: { workItemId: '1000', state: 'Active' },
  });
  assert.equal(staleUpdate.disposition, 'conflict');
  assert.equal(staleUpdate.reason, 'stale Work Item revision');
  assert.equal(state.workItems.get(1000)!.fields['System.State'], 'New');

  const currentItem = await boards.read('1000');
  const published = await evidence.publish({ operationId: 'offline-evidence', expectedRevision: currentItem.revision, actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: evidenceForRun('run-alice', '1000', 'alice') });
  assert.equal(published.disposition, 'applied');
  const freshEvidence = new AzureEvidenceStore({ ...options, publisherId: 'offline-recovery' });
  assert.equal((await freshEvidence.read('run-alice')).runId, 'run-alice');

  const emptyQueue = await queue.read({ repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget });
  const enqueued = await queue.enqueue({ operationId: 'offline-enqueue', expectedRevision: emptyQueue.revision, actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: { candidateWorkItemId: '1000', runId: 'run-alice', dependencies: [], decisions: [] } });
  assert.equal(enqueued.disposition, 'applied');
  const lease = await queue.acquireNext({ operationId: 'offline-lease', expectedRevision: enqueued.revision, actor: 'alice', requestedAt: '2026-08-14T00:00:00.000Z', input: { entrySequence: 1, targetCommit: 'offline-target-commit' } });
  assert.equal(lease.disposition, 'applied');
  const policy = await policies.evaluatePullRequest({ repositoryId: offlineConfig.repository.expectedId!, pullRequestId: 'offline-pr', url: 'https://offline.invalid/pr/offline-pr', sourceRef: 'refs/heads/feature/shared', targetRef: offlineConfig.integrationTarget, sourceCommit: 'offline-source-commit' });
  assert.equal(policy.aggregate, 'passed');
  const verification = await new LocalVerificationRunnerImpl().run([process.execPath], process.cwd());
  assert.equal(verification[0].outcome, 'passed');

  const live = evaluateLiveGate({ environment: {}, runtimeReady: false, configReady: true, identityReady: false, permissionsReady: false, capabilityReady: false, networkReady: false, policyReady: false, target: { organizationUrl: offlineConfig.organizationUrl, projectId: offlineConfig.project.expectedId!, repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget } });
  assert.equal(live.outcome, 'not-run');
  assert.ok(transport.requests.every((request) => !request.url.includes('dev.azure.com')));
  assert.ok(!fakeAzureCanonicalState(state).includes('offline-only-token'));
});

test('offline live pilot exercises Azure Repos PR, canonical queue finalization, ledger intents, and owned branch cleanup', async () => {
  const state = new FakeAzureState();
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const authSelection = { source: 'entra' as const, credential: SecretString.from('offline-only-token'), detail: 'offline simulated identity' };
  const prep = new AzurePreparationAdapter({ client, config: offlineConfig, authSelection, clock: () => '2026-08-14T00:00:00.000Z' });
  const plan = await prep.preview();
  assert.equal((await prep.apply({ operationId: 'offline-pilot-prepare', expectedRevision: plan.digest, actor: 'offline-alice', requestedAt: '2026-08-14T00:00:00.000Z', input: plan })).disposition, 'applied');
  const target = { organizationUrl: offlineConfig.organizationUrl, projectId: offlineConfig.project.expectedId!, repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget };
  const options = { client, projectName: offlineConfig.project.name, integrationTarget: offlineConfig.integrationTarget, organizationUrl: offlineConfig.organizationUrl, projectId: target.projectId, clock: () => '2026-08-14T00:00:00.000Z' };
  const boards = new AzureWorkItemAdapter(options);
  const claims = new AzureClaimStore({ ...options, publisherId: 'offline-pilot-claim' });
  const evidenceStore = new AzureEvidenceStore({ ...options, publisherId: 'offline-pilot-evidence' }, boards);
  const queue = new AzureCanonicalQueueStore({ ...options, repositoryId: target.repositoryId, targetRef: target.targetRef, queueKey: canonicalQueueKey(target.organizationUrl, target.projectId, target.repositoryId, target.targetRef) });
  const sourceHost = new AzureSourceHostAdapter({ client, projectName: offlineConfig.project.name, repositoryId: target.repositoryId, targetRef: target.targetRef, cwd: process.cwd(), auth: authSelection });
  const policies = new AzurePolicyAdapter({ client, projectName: offlineConfig.project.name, repositoryId: target.repositoryId, clock: options.clock });
  const root = await mkdtemp(join(tmpdir(), 'azure-live-pilot-'));
  try {
    const candidate = await boards.read('1000');
    const acquired = await claims.acquire({
      operationId: 'offline-pilot-claim',
      expectedRevision: candidate.revision,
      actor: 'offline-alice',
      requestedAt: options.clock(),
      input: { workItemId: '1000', claimToken: 'offline-pilot-claim', claimant: 'offline-alice', runId: 'offline-pilot-1', acquiredAt: options.clock(), leaseExpiresAt: '2026-08-14T01:00:00.000Z', kind: 'acquire' },
    });
    assert.equal(acquired.disposition, 'applied');
    const released = await claims.release({
      operationId: 'offline-pilot-claim-release',
      expectedRevision: acquired.revision,
      actor: 'offline-alice',
      requestedAt: options.clock(),
      input: { workItemId: '1000', claimToken: 'offline-pilot-claim', reason: 'validation setup complete' },
    });
    assert.equal(released.disposition, 'applied');
    const ledger = await ValidationLedger.open(root, 'offline-pilot-1', target, options.clock);
    const context = {
      runId: 'offline-pilot-1',
      actor: 'offline-alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter: policies,
      queue,
      workItems: boards,
      evidenceStore,
      ledger,
      clock: options.clock,
      allowSourceBranchDelete: async () => true,
    };
    const pilot = await runLivePilot(context);
    assert.equal(pilot.outcome, 'passed');
    assert.equal(pilot.artifacts.completed, true);
    assert.equal(pilot.artifacts.sourceRef, 'refs/heads/agent-workspace-validation/offline-pilot-1/source-branch');
    const published = await evidenceStore.read(context.runId);
    assert.equal(published.branch, pilot.artifacts.sourceRef);
    assert.deepEqual(published.checkpointRefs, [validationCheckpointId(context.runId)]);
    assert.equal(published.pullRequestRef, pilot.artifacts.pullRequest.url);
    assert.equal(published.policyOutcome, 'passed');
    assert.equal(published.queueDecision, 'integrated');
    assert.equal(published.integrationResult, 'integrated');
    assert.equal(published.targetCommit, pilot.artifacts.targetCommit);
    const completionHistory = await queue.completionHistory(validationTarget(target));
    assert.match(completionHistory[0]?.evidenceRef ?? '', /^comment:/, 'queue completion must link to the already-published candidate Run Evidence');
    const preFinalizeEvidence = await evidenceStore.findPublications('1000', validationMarker(context.runId, 'run-evidence-pre-finalize'));
    assert.equal(preFinalizeEvidence.length, 1);
    assert.equal(completionHistory[0]?.evidenceRef, preFinalizeEvidence[0].providerRef);
    assert.equal(preFinalizeEvidence[0].evidence.verification.find((item) => item.command === 'azure-live canonical-queue')?.outcome, 'unexecuted');
    assert.equal(ledger.snapshot().entries.some((entry) => entry.artifactKey === 'source-branch'), true);
    assert.equal(ledger.snapshot().entries.some((entry) => entry.artifactKey === 'pull-request-complete'), true);
    const cleaned = await cleanupLivePilot(context, pilot.artifacts);
    assert.equal(cleaned.outcome, 'passed');
    assert.equal(await sourceHost.sourceHead!(pilot.artifacts.sourceRef), undefined);
    assert.equal((await sourceHost.readPullRequest(pilot.artifacts.pullRequest)).status, 'completed');
    assert.equal((await queue.read(validationTarget(target))).value.entries.some((entry) => entry.runId === context.runId), false);

    const lostLedgerRoot = await mkdtemp(join(tmpdir(), 'azure-evidence-lost-ledger-'));
    try {
      const reconstructed = await ValidationLedger.open(lostLedgerRoot, context.runId, target, options.clock);
      await reconstructed.recordIntent({
        artifactKey: 'run-evidence-queue-finalized',
        operation: 'run-evidence.publish',
        expectedRevisionOrHead: null,
        cleanupOperation: 'work-item.close',
      });
      const recovered = await reconstructed.recover(async (marker) =>
        (await evidenceStore.findPublications('1000', marker)).map((publication) => ({
          providerRef: publication.providerRef,
          observedRevisionOrHead: publication.observedRevisionOrHead,
        })), true);
      assert.deepEqual(recovered.blocked, []);
      assert.deepEqual(recovered.repaired, ['run-evidence-queue-finalized']);
      const evidenceEntry = reconstructed.snapshot().entries[0]!;
      assert.match(evidenceEntry.providerRef ?? '', /^comment:\d+$/);
      assert.match(evidenceEntry.observedRevisionOrHead ?? '', /^comment:\d+:version:\d+$/, 'recovery must use immutable provider comment identity rather than mutable Work Item revision');
    } finally {
      await rm(lostLedgerRoot, { recursive: true, force: true });
    }
    assert.ok(state.requests.every((request) => !request.url.includes('dev.azure.com')));
    assert.ok(!fakeAzureCanonicalState(state).includes('offline-only-token'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('offline Azure pilot rejects a blocked policy through the canonical queue and retains linked evidence', async () => {
  const state = new FakeAzureState();
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const authSelection = { source: 'entra' as const, credential: SecretString.from('offline-only-token'), detail: 'offline simulated identity' };
  const prep = new AzurePreparationAdapter({ client, config: offlineConfig, authSelection, clock: () => '2026-08-14T00:00:00.000Z' });
  const plan = await prep.preview();
  assert.equal((await prep.apply({ operationId: 'offline-blocked-prepare', expectedRevision: plan.digest, actor: 'offline-alice', requestedAt: '2026-08-14T00:00:00.000Z', input: plan })).disposition, 'applied');
  const target = { organizationUrl: offlineConfig.organizationUrl, projectId: offlineConfig.project.expectedId!, repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget };
  const options = { client, projectName: offlineConfig.project.name, integrationTarget: offlineConfig.integrationTarget, organizationUrl: offlineConfig.organizationUrl, projectId: target.projectId, clock: () => '2026-08-14T00:00:00.000Z' };
  const boards = new AzureWorkItemAdapter(options);
  const claims = new AzureClaimStore({ ...options, publisherId: 'offline-blocked-claim' });
  const evidenceStore = new AzureEvidenceStore({ ...options, publisherId: 'offline-blocked-evidence' }, boards);
  const queue = new AzureCanonicalQueueStore({ ...options, repositoryId: target.repositoryId, targetRef: target.targetRef, queueKey: canonicalQueueKey(target.organizationUrl, target.projectId, target.repositoryId, target.targetRef) });
  const sourceHost = new AzureSourceHostAdapter({ client, projectName: offlineConfig.project.name, repositoryId: target.repositoryId, targetRef: target.targetRef, cwd: process.cwd(), auth: authSelection });
  const policyAdapter = {
    inspectTarget: async (integrationTarget: { repositoryId: string; targetRef: string }) => ({ target: integrationTarget, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'offline-blocked-policy', outcome: 'read' as const }], effectiveBlocking: [] }),
    evaluatePullRequest: async (ref: PullRequestRef): Promise<PolicySnapshot> => {
      const policyTarget = { repositoryId: ref.repositoryId, targetRef: ref.targetRef };
      return {
        target: policyTarget,
        pullRequestRef: ref,
        headCommit: ref.sourceCommit ?? '',
        observedAt: '2026-08-14T00:00:00.000Z',
        inventory: { target: policyTarget, observedAt: '2026-08-14T00:00:00.000Z', sources: [{ name: 'offline-blocked-policy', outcome: 'read' }], effectiveBlocking: [] },
        evaluations: [{ id: 'offline-blocked-policy', name: 'Offline blocked policy', source: 'fake', kind: 'provider', verdict: 'blocked', detail: 'approval is still pending', appliedToCommit: ref.sourceCommit }],
        aggregate: 'blocked',
      };
    },
  };
  const root = await mkdtemp(join(tmpdir(), 'azure-blocked-pilot-'));
  try {
    const candidate = await boards.read('1000');
    const claim = await claims.acquire({
      operationId: 'offline-blocked-claim',
      expectedRevision: candidate.revision,
      actor: 'offline-alice',
      requestedAt: options.clock(),
      input: { workItemId: '1000', claimToken: 'offline-blocked-claim', claimant: 'offline-alice', runId: 'offline-blocked-pilot', acquiredAt: options.clock(), leaseExpiresAt: '2026-08-14T01:00:00.000Z', kind: 'acquire' },
    });
    assert.equal(claim.disposition, 'applied');
    const released = await claims.release({
      operationId: 'offline-blocked-claim-release',
      expectedRevision: claim.revision,
      actor: 'offline-alice',
      requestedAt: options.clock(),
      input: { workItemId: '1000', claimToken: 'offline-blocked-claim', reason: 'validation setup complete' },
    });
    assert.equal(released.disposition, 'applied');
    const ledger = await ValidationLedger.open(root, 'offline-blocked-pilot', target, options.clock);
    const context = {
      runId: 'offline-blocked-pilot',
      actor: 'offline-alice',
      candidateWorkItemId: '1000',
      target,
      sourceHost,
      policyAdapter,
      queue,
      workItems: boards,
      evidenceStore,
      ledger,
      clock: options.clock,
      allowSourceBranchDelete: async () => true,
    };

    const pilot = await runLivePilot(context);
    assert.equal(pilot.outcome, 'blocked');
    const published = await evidenceStore.read(context.runId);
    assert.equal(published.policyOutcome, 'blocked');
    assert.equal(published.queueDecision, 'rejected');
    assert.equal(published.integrationResult, 'rejected');
    assert.equal(published.verification.find((item) => item.command === 'azure-live canonical-queue')?.outcome, 'blocked');
    const completionHistory = await queue.completionHistory(validationTarget(target));
    assert.equal(completionHistory.length, 1);
    assert.equal(completionHistory[0]?.outcome, 'rejected');
    const prePolicy = await evidenceStore.findPublications('1000', validationMarker(context.runId, 'run-evidence-policy-blocked'));
    assert.equal(completionHistory[0]?.evidenceRef, prePolicy[0]?.providerRef);
    assert.equal((await queue.read(validationTarget(target))).value.entries.length, 0);

    const cleaned = await cleanupLivePilot(context, pilot.artifacts);
    assert.equal(cleaned.outcome, 'passed');
    assert.equal((await sourceHost.readPullRequest(pilot.artifacts.pullRequest)).status, 'abandoned');
    assert.equal(await sourceHost.sourceHead!(pilot.artifacts.sourceRef), undefined);
    assert.ok(state.requests.every((request) => !request.url.includes('dev.azure.com')));
    assert.ok(!fakeAzureCanonicalState(state).includes('offline-only-token'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Work Item close write-ahead intent recovers across pre-contact and post-acceptance crash windows', async () => {
  const state = new FakeAzureState();
  const transport = state.transport();
  const client = new AzureHttpClient(transport, () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const boards = new AzureWorkItemAdapter({
    client,
    projectName: offlineConfig.project.name,
    integrationTarget: offlineConfig.integrationTarget,
    clock: () => '2026-08-14T00:00:00.000Z',
  });
  const target = {
    organizationUrl: offlineConfig.organizationUrl,
    projectId: offlineConfig.project.expectedId!,
    repositoryId: offlineConfig.repository.expectedId!,
    targetRef: offlineConfig.integrationTarget,
  };
  const runId = 'offline-work-item-close-crash';
  const operationId = `${runId}:work-item.close`;
  const root = await mkdtemp(join(tmpdir(), 'azure-close-crash-'));
  try {
    const before = await boards.read('1000');
    const ledger = await ValidationLedger.open(root, runId, target, () => '2026-08-14T00:00:00.000Z');
    await ledger.recordIntent({
      artifactKey: 'work-item-close',
      operation: 'work-item.close',
      expectedRevisionOrHead: before.revision,
      cleanupOperation: 'work-item.close',
    });
    const command = {
      operationId,
      expectedRevision: before.revision,
      actor: 'offline-alice',
      requestedAt: '2026-08-14T00:00:00.000Z',
      input: { workItemId: '1000', from: 'open' as const, to: 'integrated' as const },
    };

    state.beforeRequest = (request) => {
      if (request.method === 'PATCH' && /_apis\/wit\/workitems\/1000/i.test(request.url)) {
        throw new Error('injected network denial before provider contact');
      }
    };
    await assert.rejects(boards.projectState(command), /transport failure|network/i);
    assert.equal(state.workItems.get(1000)?.rev, 1, 'pre-contact failure must not mutate provider state');
    assert.equal(ledger.snapshot().entries[0]?.state, 'intent-recorded');

    state.beforeRequest = undefined;
    const accepted = await boards.projectState(command);
    assert.equal(accepted.disposition, 'applied');
    assert.equal(accepted.revision, '2');
    // Simulate process death here: provider accepted the mutation, but the local
    // ledger never received recordProviderAcceptance or acknowledge.
    const reopened = await ValidationLedger.open(root, runId, target, () => '2026-08-14T00:01:00.000Z');
    const recovered = await reopened.recover(async (marker) => {
      if (marker !== validationMarker(runId, 'work-item-close')) return [];
      const provider = await boards.read('1000');
      const operation = provider.value.coordination.lastAppliedOperation;
      if (operation?.operationId !== operationId || operation.kind !== 'work-item-state' || operation.outcome !== 'integrated') return [];
      return [{ providerRef: 'work-item:1000', observedRevisionOrHead: provider.revision }];
    }, true);
    assert.deepEqual(recovered.blocked, []);
    assert.deepEqual(recovered.repaired, ['work-item-close']);
    const repaired = reopened.snapshot().entries[0]!;
    assert.equal(repaired.expectedRevisionOrHead, '1', 'write-ahead CAS input remains immutable');
    assert.equal(repaired.observedRevisionOrHead, '2', 'provider result is recovered separately');
    assert.equal(repaired.providerRef, 'work-item:1000');

    const writesBeforeRetry = transport.requests.filter((request) => request.method === 'PATCH').length;
    const duplicate = await boards.projectState(command);
    assert.equal(duplicate.disposition, 'duplicate');
    assert.equal(duplicate.revision, '2');
    assert.equal(transport.requests.filter((request) => request.method === 'PATCH').length, writesBeforeRetry);
    assert.ok(state.requests.every((request) => !request.url.includes('dev.azure.com')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
