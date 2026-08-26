import type { CanonicalQueueStore, EvidenceStore, PolicyAdapter, SourceHostAdapter, WorkItemAdapter } from '../adapters/ports.ts';
import type { AgentCheckpoint, BlockerClassification, CheckOutcome, IntegrationTarget, PolicySnapshot, PolicyVerdict, PullRequestRef, RunEvidence, RunId, RunState } from '../domain/types.ts';
import { createEvidence } from '../domain/evidence.ts';
import { ValidationLedger, validationMarker, type ValidationOutcome, type ValidationTarget } from './ledger.ts';

export interface LivePilotContext {
  runId: RunId;
  actor: string;
  candidateWorkItemId: string;
  target: ValidationTarget;
  sourceHost: SourceHostAdapter;
  policyAdapter: PolicyAdapter;
  queue: CanonicalQueueStore;
  workItems: WorkItemAdapter;
  evidenceStore: EvidenceStore;
  ledger: ValidationLedger;
  clock: () => string;
  allowSourceBranchDelete: (sourceRef: string) => Promise<boolean>;
}

export interface LivePilotArtifacts {
  evaluatedTargetCommit: string;
  targetCommit: string;
  sourceRef: string;
  sourceHead: string;
  checkpointId: string;
  pullRequest: PullRequestRef;
  policy?: PolicySnapshot;
  queueEntrySequence?: number;
  evidenceRef?: string;
  completed: boolean;
}

export interface LivePilotResult {
  outcome: ValidationOutcome;
  nextAction: string;
  evidence: string[];
  artifacts: LivePilotArtifacts;
}

export interface LivePilotCleanupResult {
  outcome: ValidationOutcome;
  nextAction: string;
  evidence: string[];
}

interface PilotEvidenceInput {
  targetCommit: string;
  sourceRef: string;
  sourceHead: string;
  checkpointId: string;
  pullRequest: PullRequestRef;
  policy: PolicySnapshot;
  queueEntrySequence: number;
  publication: 'policy-blocked' | 'pre-finalize' | 'queue-rejected' | 'queue-finalized';
  queueDecision: 'queued' | 'blocked' | 'rejected' | 'integrated';
  integrationResult: 'integrated' | 'rejected' | 'pending';
  blocker: BlockerClassification | null;
}

export function validationSourceRef(runId: RunId): string {
  return 'refs/heads/agent-workspace-validation/' + runId + '/source-branch';
}

export function validationCheckpointId(runId: RunId): string {
  return `${runId}:validation-source`;
}

export function validationTarget(target: ValidationTarget): IntegrationTarget {
  return { repositoryId: target.repositoryId, targetRef: target.targetRef };
}

export function validationTargetFingerprint(target: ValidationTarget): string {
  return [target.organizationUrl, target.projectId, target.repositoryId, target.targetRef].join('|');
}

function policyCheckOutcome(verdict: PolicyVerdict): CheckOutcome {
  if (verdict === 'passed') return 'passed';
  if (verdict === 'failed') return 'failed';
  if (verdict === 'unexecuted') return 'unexecuted';
  return 'blocked';
}

function blockerForPolicy(verdict: PolicyVerdict): BlockerClassification {
  return verdict === 'unavailable' || verdict === 'unexecuted' ? 'capability' : 'conflict';
}

function evidenceTransitions(input: PilotEvidenceInput, at: string): RunEvidence['stateTransitions'] {
  const states: RunState[] = ['requested', 'claimed', 'preparing', 'running', 'verifying'];
  if (input.policy.aggregate === 'passed') states.push('ready-for-integration');
  if (input.integrationResult === 'integrated') states.push('integrated');
  if (input.integrationResult === 'rejected') states.push('failed');
  return states.slice(1).map((to, index) => {
    const from = states[index];
    return { from, to, at };
  });
}

function queueCheckOutcome(decision: PilotEvidenceInput['queueDecision']): CheckOutcome {
  if (decision === 'integrated') return 'passed';
  if (decision === 'blocked' || decision === 'rejected') return 'blocked';
  return 'unexecuted';
}

function actionOutcome(outcome: CheckOutcome): 'succeeded' | 'failed' | 'blocked' | 'unexecuted' {
  if (outcome === 'passed') return 'succeeded';
  return outcome;
}

async function publishPilotEvidence(context: LivePilotContext, input: PilotEvidenceInput): Promise<string> {
  const candidate = await context.workItems.read(context.candidateWorkItemId);
  const at = context.clock();
  const artifactKey = `run-evidence-${input.publication}`;
  const providerMarker = validationMarker(context.runId, artifactKey);
  const policyOutcome = policyCheckOutcome(input.policy.aggregate);
  const queueOutcome = queueCheckOutcome(input.queueDecision);
  const evidence: RunEvidence = createEvidence({
    runId: context.runId,
    workItemId: context.candidateWorkItemId,
    owner: context.actor,
    timestamps: [at],
    stateTransitions: evidenceTransitions(input, at),
    checkpointRefs: [input.checkpointId],
    verification: [
      { command: 'azure-live target-head', outcome: 'passed', evidenceRef: input.targetCommit },
      { command: 'azure-live source-head', outcome: 'passed', evidenceRef: input.sourceHead },
      { command: 'azure-live pull-request', outcome: 'passed', evidenceRef: input.pullRequest.url },
      { command: 'azure-live provider-policy', outcome: policyOutcome, evidenceRef: input.policy.headCommit },
      { command: 'azure-live canonical-queue', outcome: queueOutcome, evidenceRef: 'queue:' + input.queueEntrySequence },
    ],
    providerMarker,
    providerRevision: candidate.revision,
    branch: input.sourceRef,
    pullRequestRef: input.pullRequest.url,
    targetCommit: input.targetCommit,
    policyOutcome: input.policy.aggregate,
    queueDecision: input.queueDecision,
    integrationResult: input.integrationResult,
    blocker: input.blocker,
    nextAction: input.integrationResult === 'integrated'
      ? 'run the closed cleanup rechecks after the canonical queue finalization'
      : input.queueDecision === 'queued'
        ? 'finalize the exact canonical queue entry before reporting queue PASS'
        : 'resolve the exact provider policy outcome before retrying integration',
    actions: [
      { action: 'validation branch ' + input.sourceRef, actor: context.actor, at, outcome: 'succeeded' },
      { action: 'validation pull request ' + input.pullRequest.url, actor: context.actor, at, outcome: 'succeeded' },
      { action: 'provider policy ' + input.policy.aggregate, actor: context.actor, at, outcome: actionOutcome(policyOutcome) },
      { action: 'canonical queue decision ' + input.queueDecision, actor: context.actor, at, outcome: actionOutcome(queueOutcome) },
    ],
    retention: { days: 30, expiresAt: new Date(Date.parse(at) + 30 * 86_400_000).toISOString() },
  });
  await context.ledger.recordIntent({
    artifactKey,
    operation: 'run-evidence.publish',
    expectedRevisionOrHead: candidate.revision,
    cleanupOperation: 'work-item.close',
    cleanupPrerequisites: ['close the run-created candidate Work Item while retaining its immutable Run Evidence'],
  });
  const operationId = `${context.runId}:evidence.${input.publication}`;
  const published = await context.evidenceStore.publish({
    operationId,
    expectedRevision: candidate.revision,
    actor: context.actor,
    requestedAt: at,
    input: evidence,
  });
  if ((published.disposition !== 'applied' && published.disposition !== 'duplicate') || !published.value) {
    throw new Error('candidate Run Evidence publication did not apply: ' + (published.reason ?? published.disposition));
  }
  if (!context.evidenceStore.findPublications) throw new Error('evidence store does not expose deterministic provider publication recovery');
  const matches = (await context.evidenceStore.findPublications(context.candidateWorkItemId, providerMarker))
    .filter((publication) => publication.operationId === operationId && publication.runId === context.runId);
  if (matches.length !== 1) throw new Error('candidate Run Evidence provider publication was not uniquely recoverable');
  const evidenceRef = matches[0].providerRef;
  await context.ledger.recordProviderAcceptance(artifactKey, evidenceRef, matches[0].observedRevisionOrHead);
  await context.ledger.acknowledge(artifactKey);
  if (context.ledger.snapshot().entries.some((entry) => entry.artifactKey === 'boards-roundtrip')) {
    await context.ledger.recordProviderObservation('boards-roundtrip', published.revision);
  }
  return evidenceRef;
}

export async function runLivePilot(context: LivePilotContext): Promise<LivePilotResult> {
  const { ledger, sourceHost, queue, policyAdapter, target } = context;
  const integrationTarget = validationTarget(target);
  if (!sourceHost.createSourceBranch || !sourceHost.sourceHead || !sourceHost.recordCheckpoint || !sourceHost.readCheckpoints || !sourceHost.ensurePullRequest || !sourceHost.readPullRequest || !sourceHost.completePullRequest) {
    throw new Error('source-host adapter does not expose the gated validation lifecycle');
  }

  const targetCommit = await sourceHost.targetHead(target.targetRef);
  const sourceRef = validationSourceRef(context.runId);
  await ledger.recordIntent({
    artifactKey: 'source-branch',
    operation: 'source-branch.create',
    expectedRevisionOrHead: targetCommit,
    cleanupOperation: 'source-branch.delete',
    cleanupPrerequisites: ['exact source ref, marker-derived run name, and source head must be re-read before deletion'],
  });
  const createdBranch = await sourceHost.createSourceBranch(sourceRef, targetCommit);
  await ledger.recordProviderAcceptance('source-branch', createdBranch.sourceRef, createdBranch.headCommit);
  await ledger.acknowledge('source-branch');

  const checkpointAt = context.clock();
  const checkpoint: AgentCheckpoint = {
    checkpointId: validationCheckpointId(context.runId),
    runId: context.runId,
    branch: sourceRef,
    commit: createdBranch.headCommit,
    verification: [
      { command: 'azure-live validation-source-head', outcome: 'passed', evidenceRef: createdBranch.headCommit },
    ],
    unresolvedWork: [],
    nextAction: 'create and evaluate the marker-bearing validation pull request',
    createdAt: checkpointAt,
  };
  const checkpointCandidate = await context.workItems.read(context.candidateWorkItemId);
  await ledger.recordIntent({
    artifactKey: 'agent-checkpoint',
    operation: 'checkpoint.publish',
    expectedRevisionOrHead: checkpointCandidate.revision,
    cleanupOperation: 'work-item.close',
    cleanupPrerequisites: ['retain the immutable Agent Checkpoint while closing only the run-created candidate Work Item'],
  });
  await sourceHost.recordCheckpoint(context.candidateWorkItemId, checkpoint);
  const checkpointMatches = (await sourceHost.readCheckpoints(context.candidateWorkItemId)).filter((candidate) =>
    candidate.checkpointId === checkpoint.checkpointId
    && candidate.runId === checkpoint.runId
    && candidate.branch === checkpoint.branch
    && candidate.commit === checkpoint.commit,
  );
  if (checkpointMatches.length !== 1) throw new Error('validation Agent Checkpoint was not uniquely recoverable from the provider');
  await ledger.recordProviderAcceptance('agent-checkpoint', 'checkpoint:' + checkpoint.checkpointId, checkpoint.commit);
  await ledger.acknowledge('agent-checkpoint');

  const pullRequestMarker = validationMarker(context.runId, 'pull-request');
  const pullRequestDescription = [
    'Agent Workspace live validation marker: ' + pullRequestMarker,
    'Agent Workspace live validation target: ' + validationTargetFingerprint(target),
    'This pull request is created only by the gated validation run.',
  ].join('\n');
  await ledger.recordIntent({
    artifactKey: 'pull-request',
    operation: 'pull-request.create',
    expectedRevisionOrHead: createdBranch.headCommit,
    cleanupOperation: 'pull-request.abandon',
    cleanupPrerequisites: ['source/target refs, PR marker, and source head must remain exact'],
  });
  const ensured = await sourceHost.ensurePullRequest({
    repositoryId: target.repositoryId,
    sourceRef,
    targetRef: target.targetRef,
    title: 'Agent Workspace validation ' + context.runId,
    description: pullRequestDescription,
    workItemId: context.candidateWorkItemId,
  });
  const pullRequest = await sourceHost.readPullRequest(ensured);
  if (
    pullRequest.sourceRef !== sourceRef
    || pullRequest.targetRef !== target.targetRef
    || pullRequest.description?.includes(pullRequestMarker) !== true
    || pullRequest.description?.includes(validationTargetFingerprint(target)) !== true
    || pullRequest.sourceCommit !== createdBranch.headCommit
    || !pullRequest.workItemIds?.includes(context.candidateWorkItemId)
  ) throw new Error('validation pull request marker, refs, target fingerprint, or source head was not exact');
  await ledger.recordProviderAcceptance('pull-request', 'pull-request:' + pullRequest.pullRequestId, pullRequest.sourceCommit ?? null);
  await ledger.acknowledge('pull-request');

  const queueBefore = await queue.read(integrationTarget);
  await ledger.recordIntent({
    artifactKey: 'queue-entry',
    operation: 'queue.entry.enqueue',
    expectedRevisionOrHead: queueBefore.revision,
    cleanupOperation: 'queue-entry.remove',
    cleanupPrerequisites: ['the queue entry must still identify this run and candidate Work Item'],
  });
  const enqueued = await queue.enqueue({
    operationId: context.runId + ':queue.enqueue',
    expectedRevision: queueBefore.revision,
    actor: context.actor,
    requestedAt: context.clock(),
    input: { candidateWorkItemId: context.candidateWorkItemId, runId: context.runId, dependencies: [], decisions: [] },
  });
  if (enqueued.disposition !== 'applied' && enqueued.disposition !== 'duplicate') throw new Error('canonical queue enqueue did not apply: ' + (enqueued.reason ?? enqueued.disposition));
  const queueEntry = enqueued.value?.entries.find((entry) => entry.candidateWorkItemId === context.candidateWorkItemId && entry.runId === context.runId);
  if (!queueEntry) throw new Error('canonical queue did not expose the run-owned entry after enqueue');
  await ledger.recordProviderAcceptance('queue-entry', 'queue:' + queueEntry.sequence, enqueued.revision);
  await ledger.acknowledge('queue-entry');

  await ledger.recordIntent({
    artifactKey: 'queue-lease',
    operation: 'queue.lease.acquire',
    expectedRevisionOrHead: enqueued.revision,
    cleanupOperation: 'queue-entry.remove',
    cleanupPrerequisites: ['the lease must remain attributable to this run before removal'],
  });
  const leased = await queue.acquireNext({
    operationId: context.runId + ':queue.acquire',
    expectedRevision: enqueued.revision,
    actor: context.actor,
    requestedAt: context.clock(),
    input: { entrySequence: queueEntry.sequence, targetCommit },
  });
  if (leased.disposition !== 'applied' || !leased.value || leased.value.runId !== context.runId || leased.value.entrySequence !== queueEntry.sequence) {
    throw new Error('canonical queue lease did not identify the run-owned entry: ' + (leased.reason ?? leased.disposition));
  }
  await ledger.recordProviderAcceptance('queue-lease', 'queue:' + queueEntry.sequence, leased.revision);
  await ledger.acknowledge('queue-lease');

  const policy = await policyAdapter.evaluatePullRequest(pullRequest);
  if (policy.target.targetRef !== target.targetRef || policy.target.repositoryId !== target.repositoryId || policy.headCommit !== pullRequest.sourceCommit) {
    throw new Error('policy snapshot did not carry the exact validation target and PR head');
  }
  const artifacts: LivePilotArtifacts = {
    evaluatedTargetCommit: targetCommit,
    targetCommit,
    sourceRef,
    sourceHead: createdBranch.headCommit,
    checkpointId: checkpoint.checkpointId,
    pullRequest,
    policy,
    queueEntrySequence: queueEntry.sequence,
    completed: false,
  };
  if (policy.aggregate !== 'passed') {
    const pendingEvidenceRef = await publishPilotEvidence(context, {
      targetCommit,
      sourceRef,
      sourceHead: createdBranch.headCommit,
      checkpointId: checkpoint.checkpointId,
      pullRequest,
      policy,
      queueEntrySequence: queueEntry.sequence,
      publication: 'policy-blocked',
      queueDecision: 'queued',
      integrationResult: 'pending',
      blocker: blockerForPolicy(policy.aggregate),
    });
    const queueAfterPolicy = await queue.read(integrationTarget);
    const policyQueueLease = queueAfterPolicy.value.lease;
    if (!policyQueueLease || policyQueueLease.runId !== context.runId || policyQueueLease.entrySequence !== queueEntry.sequence) {
      throw new Error('canonical queue lease changed before policy rejection');
    }
    await ledger.recordIntent({
      artifactKey: 'queue-finalize',
      operation: 'queue.entry.finalize',
      expectedRevisionOrHead: queueAfterPolicy.revision,
      cleanupOperation: 'queue-entry.remove',
      cleanupPrerequisites: ['the policy-rejected queue lease and sequence must still identify this run'],
    });
    const rejected = await queue.finalize({
      operationId: context.runId + ':queue.reject',
      expectedRevision: queueAfterPolicy.revision,
      actor: context.actor,
      requestedAt: context.clock(),
      input: { entrySequence: queueEntry.sequence, outcome: 'rejected', pullRequestRef: pullRequest.url, evidenceRef: pendingEvidenceRef, blocker: blockerForPolicy(policy.aggregate) },
    });
    if (rejected.disposition !== 'applied') throw new Error('canonical queue policy rejection did not apply: ' + (rejected.reason ?? rejected.disposition));
    const rejectionMatches = (await queue.completionHistory(integrationTarget)).filter((summary) =>
      summary.operationId === context.runId + ':queue.reject'
      && summary.sequence === queueEntry.sequence
      && summary.candidateWorkItemId === context.candidateWorkItemId
      && summary.runId === context.runId
      && summary.outcome === 'rejected'
      && summary.evidenceRef === pendingEvidenceRef,
    );
    if (rejectionMatches.length !== 1) throw new Error('canonical queue rejection was not uniquely recoverable with the exact candidate evidence link');
    await ledger.recordProviderAcceptance('queue-finalize', 'queue:' + queueEntry.sequence, `completion:${context.runId}:queue.reject:${pendingEvidenceRef}`);
    await ledger.acknowledge('queue-finalize');
    await ledger.markCleanup('queue-entry', 'passed', 'canonical queue entry was removed by conditional policy rejection');
    await ledger.markCleanup('queue-lease', 'passed', 'canonical queue lease was released by policy rejection');
    await ledger.markCleanup('queue-finalize', 'passed');

    const evidenceRef = await publishPilotEvidence(context, {
      targetCommit,
      sourceRef,
      sourceHead: createdBranch.headCommit,
      checkpointId: checkpoint.checkpointId,
      pullRequest,
      policy,
      queueEntrySequence: queueEntry.sequence,
      publication: 'queue-rejected',
      queueDecision: 'rejected',
      integrationResult: 'rejected',
      blocker: blockerForPolicy(policy.aggregate),
    });
    artifacts.evidenceRef = evidenceRef;
    return {
      outcome: 'blocked',
      nextAction: 'resolve the exact provider policy result before completing the validation pull request; cleanup may abandon the run-owned PR',
      evidence: ['target-head:' + targetCommit, 'source-head:' + createdBranch.headCommit, 'pull-request:' + pullRequest.pullRequestId, 'policy:' + policy.aggregate, 'queue-sequence:' + queueEntry.sequence, 'queue:rejected', 'run-evidence:' + evidenceRef],
      artifacts,
    };
  }

  const completionPullRequest = await sourceHost.readPullRequest(pullRequest);
  const completionSourceHead = await sourceHost.sourceHead(sourceRef);
  const completionTargetHead = await sourceHost.targetHead(target.targetRef);
  if (
    completionPullRequest.sourceRef !== sourceRef
    || completionPullRequest.targetRef !== target.targetRef
    || completionPullRequest.sourceCommit !== policy.headCommit
    || completionPullRequest.sourceCommit !== createdBranch.headCommit
    || !completionPullRequest.workItemIds?.includes(context.candidateWorkItemId)
    || (completionPullRequest.targetCommit !== undefined && completionPullRequest.targetCommit !== targetCommit)
    || completionPullRequest.status?.toLowerCase() !== 'active'
    || completionSourceHead !== createdBranch.headCommit
    || completionTargetHead !== targetCommit
  ) throw new Error('validation pull request or source/target head drifted after policy evaluation');

  await ledger.recordIntent({
    artifactKey: 'pull-request-complete',
    operation: 'pull-request.complete',
    expectedRevisionOrHead: `${createdBranch.headCommit}|${targetCommit}`,
    cleanupOperation: 'pull-request.abandon',
    cleanupPrerequisites: ['target head and evaluated PR head must still be exact; completion must not bypass policy'],
  });
  const completed = await sourceHost.completePullRequest(completionPullRequest, targetCommit);
  if (!completed.merged) throw new Error('validation pull request completion did not report an integrated result');
  const completedPullRequest = await sourceHost.readPullRequest(completed.pullRequestRef);
  const postMergeTarget = await sourceHost.targetHead(target.targetRef);
  if (
    completedPullRequest.repositoryId !== target.repositoryId
    || completedPullRequest.sourceRef !== sourceRef
    || completedPullRequest.targetRef !== target.targetRef
    || completedPullRequest.sourceCommit !== createdBranch.headCommit
    || completedPullRequest.targetCommit !== targetCommit
    || completedPullRequest.status?.toLowerCase() !== 'completed'
    || completedPullRequest.mergeStatus?.toLowerCase() !== 'succeeded'
    || !completedPullRequest.mergeCommit
    || completedPullRequest.mergeCommit !== completed.targetCommit
    || postMergeTarget !== completed.targetCommit
    || !completedPullRequest.workItemIds?.includes(context.candidateWorkItemId)
  ) throw new Error('completed validation pull request or observed post-merge target did not match the evaluated source/target commits');
  await ledger.recordProviderAcceptance('pull-request-complete', 'pull-request:' + completedPullRequest.pullRequestId, postMergeTarget);
  await ledger.acknowledge('pull-request-complete');
  artifacts.pullRequest = completedPullRequest;
  artifacts.targetCommit = postMergeTarget;
  artifacts.completed = completed.merged;

  const preFinalizeEvidenceRef = await publishPilotEvidence(context, {
    targetCommit: postMergeTarget,
    sourceRef,
    sourceHead: createdBranch.headCommit,
    checkpointId: checkpoint.checkpointId,
    pullRequest: completedPullRequest,
    policy,
    queueEntrySequence: queueEntry.sequence,
    publication: 'pre-finalize',
    queueDecision: 'queued',
    integrationResult: 'pending',
    blocker: null,
  });
  artifacts.evidenceRef = preFinalizeEvidenceRef;

  const queueAfterComplete = await queue.read(integrationTarget);
  await ledger.recordIntent({
    artifactKey: 'queue-finalize',
    operation: 'queue.entry.finalize',
    expectedRevisionOrHead: queueAfterComplete.revision,
    cleanupOperation: 'queue-entry.remove',
    cleanupPrerequisites: ['the lease and sequence must still identify this run'],
  });
  const finalizeOperationId = context.runId + ':queue.finalize';
  const finalized = await queue.finalize({
    operationId: finalizeOperationId,
    expectedRevision: queueAfterComplete.revision,
    actor: context.actor,
    requestedAt: context.clock(),
    input: { entrySequence: queueEntry.sequence, outcome: 'integrated', pullRequestRef: completedPullRequest.url, evidenceRef: preFinalizeEvidenceRef, blocker: null },
  });
  if (finalized.disposition !== 'applied') throw new Error('canonical queue finalization did not apply: ' + (finalized.reason ?? finalized.disposition));
  const completionMatches = (await queue.completionHistory(integrationTarget)).filter((summary) =>
    summary.operationId === finalizeOperationId
    && summary.sequence === queueEntry.sequence
    && summary.candidateWorkItemId === context.candidateWorkItemId
    && summary.runId === context.runId
    && summary.evidenceRef === preFinalizeEvidenceRef,
  );
  if (completionMatches.length !== 1) throw new Error('canonical queue completion summary was not uniquely recoverable with the exact candidate evidence link');
  const completionObservation = `completion:${finalizeOperationId}:${preFinalizeEvidenceRef}`;
  await ledger.recordProviderAcceptance('queue-finalize', 'queue:' + queueEntry.sequence, completionObservation);
  await ledger.acknowledge('queue-finalize');

  const finalEvidenceRef = await publishPilotEvidence(context, {
    targetCommit: postMergeTarget,
    sourceRef,
    sourceHead: createdBranch.headCommit,
    checkpointId: checkpoint.checkpointId,
    pullRequest: completedPullRequest,
    policy,
    queueEntrySequence: queueEntry.sequence,
    publication: 'queue-finalized',
    queueDecision: 'integrated',
    integrationResult: 'integrated',
    blocker: null,
  });
  artifacts.evidenceRef = finalEvidenceRef;
  await ledger.markCleanup('queue-entry', 'passed', 'canonical queue entry was removed by conditional integrated finalization');
  await ledger.markCleanup('queue-lease', 'passed', 'canonical queue lease was released by finalization');
  await ledger.markCleanup('queue-finalize', 'passed');

  return {
    outcome: 'passed',
    nextAction: 'run the closed cleanup rechecks for the validation Work Item and source branch; a completed PR is retained as the pilot evidence',
    evidence: ['evaluated-target-head:' + targetCommit, 'post-merge-target-head:' + postMergeTarget, 'source-head:' + createdBranch.headCommit, 'checkpoint:' + checkpoint.checkpointId, 'pull-request:' + completedPullRequest.pullRequestId, 'policy:' + policy.aggregate, 'queue-sequence:' + queueEntry.sequence, 'run-evidence-pre-finalize:' + preFinalizeEvidenceRef, 'run-evidence-final:' + finalEvidenceRef, 'queue:finalized'],
    artifacts,
  };
}

export async function cleanupLivePilot(context: LivePilotContext, artifacts?: LivePilotArtifacts): Promise<LivePilotCleanupResult> {
  const entries = context.ledger.snapshot().entries;
  const evidence: string[] = [];
  const blocked: string[] = [];
  const sourceEntry = entries.find((entry) => entry.artifactKey === 'source-branch');
  const pullRequestEntry = entries.find((entry) => entry.artifactKey === 'pull-request');
  const acceptedEvidenceEntry = [...entries].reverse().find((entry) =>
    entry.artifactKey.startsWith('run-evidence-')
    && entry.providerRef !== null
    && ['provider-accepted', 'acknowledged', 'cleaned'].includes(entry.state),
  );
  const acceptedEvidenceRefs = new Set(entries
    .filter((entry) => entry.artifactKey.startsWith('run-evidence-') && entry.providerRef !== null && ['provider-accepted', 'acknowledged', 'cleaned'].includes(entry.state))
    .map((entry) => entry.providerRef as string));
  const durableEvidenceRef = artifacts?.evidenceRef ?? acceptedEvidenceEntry?.providerRef ?? undefined;
  const sourceRef = artifacts?.sourceRef ?? sourceEntry?.providerRef ?? validationSourceRef(context.runId);
  const pullRequest = artifacts?.pullRequest ?? await findMarkedPullRequest(context, sourceRef);
  if (sourceEntry && sourceEntry.cleanupOutcome !== 'passed' && !sourceEntry.providerRef) blocked.push('source branch provider acceptance was not recorded; manual recovery is required');

  if (pullRequestEntry && pullRequestEntry.cleanupOutcome !== 'passed' && !pullRequest) blocked.push('the run-owned marked pull request was not uniquely discoverable for cleanup');
  if (pullRequestEntry && pullRequestEntry.cleanupOutcome !== 'passed' && pullRequest) {
    if (!context.sourceHost.abandonPullRequest) blocked.push('source-host adapter does not expose pull-request abandonment');
    else {
      const current = await context.sourceHost.readPullRequest(pullRequest);
      const marker = validationMarker(context.runId, 'pull-request');
      if (current.sourceRef !== sourceRef || current.targetRef !== context.target.targetRef || current.description?.includes(marker) !== true || current.description?.includes(validationTargetFingerprint(context.target)) !== true) {
        blocked.push('pull-request marker or exact refs drifted before cleanup');
      } else if (current.status?.toLowerCase() === 'completed' || current.status?.toLowerCase() === 'abandoned') {
        await context.ledger.markCleanup('pull-request', 'passed', 'pull request is already ' + current.status);
        evidence.push('pull-request:' + current.pullRequestId + ':' + current.status);
      } else if (current.status?.toLowerCase() !== 'active') {
        blocked.push('pull request is neither active, completed, nor abandoned');
      } else if (!pullRequestEntry.observedRevisionOrHead || current.sourceCommit !== pullRequestEntry.observedRevisionOrHead) {
        blocked.push('pull-request source commit drifted from the ledger-accepted head before abandonment');
      } else {
        const intent = await context.ledger.recordIntent({
          artifactKey: 'pull-request-abandon',
          operation: 'pull-request.abandon',
          expectedRevisionOrHead: current.sourceCommit ?? null,
          cleanupOperation: 'pull-request.abandon',
          cleanupPrerequisites: ['marker, source/target refs, and active status were re-read immediately before abandonment'],
        });
        const abandoned = await context.sourceHost.abandonPullRequest(current, pullRequestEntry.observedRevisionOrHead);
        await context.ledger.recordProviderAcceptance(intent.artifactKey, 'pull-request:' + abandoned.pullRequestId, abandoned.status ?? 'abandoned');
        await context.ledger.acknowledge(intent.artifactKey);
        await context.ledger.markCleanup(intent.artifactKey, 'passed');
        await context.ledger.markCleanup('pull-request', 'passed');
        evidence.push('pull-request:' + abandoned.pullRequestId + ':abandoned');
      }
    }
  }

  const queueKeys = entries.filter((entry) => (entry.artifactKey === 'queue-entry' || entry.artifactKey === 'queue-lease') && entry.cleanupOutcome !== 'passed');
  if (queueKeys.length > 0) {
    if (!durableEvidenceRef) blocked.push('run-owned queue cleanup requires one provider-accepted candidate Run Evidence reference');
    const target = validationTarget(context.target);
    const current = await context.queue.read(target);
    const sequence = queueKeys.map((entry) => Number(entry.providerRef?.replace(/^queue:/, ''))).find(Number.isSafeInteger);
    const active = current.value.entries.find((entry) => entry.runId === context.runId && (sequence === undefined || entry.sequence === sequence));
    if (!active) {
      const history = await context.queue.completionHistory(target);
      if (!history.some((summary) =>
        summary.runId === context.runId
        && summary.candidateWorkItemId === context.candidateWorkItemId
        && typeof summary.evidenceRef === 'string'
        && acceptedEvidenceRefs.has(summary.evidenceRef))) blocked.push('run-owned queue entry is absent without a matching canonical completion summary linked to provider-accepted candidate evidence');
      else {
        for (const entry of queueKeys) await context.ledger.markCleanup(entry.artifactKey, 'passed', 'canonical completion summary is provider-visible');
        evidence.push('queue:' + (sequence ?? 'run') + ':absent-after-completion');
      }
    } else {
      let lease = current.value.lease;
      let revision = current.revision;
      if (blocked.length === 0 && (!lease || lease.entrySequence !== active.sequence || lease.runId !== context.runId)) {
        const cleanupTargetCommit = await context.sourceHost.targetHead(context.target.targetRef);
        const acquireIntent = await context.ledger.recordIntent({
          artifactKey: 'queue-cleanup-lease',
          operation: 'queue.lease.acquire.cleanup',
          expectedRevisionOrHead: revision,
          cleanupOperation: 'queue-entry.remove',
          cleanupPrerequisites: ['only the run-owned queue entry may be acquired for rejection'],
        });
        const acquired = await context.queue.acquireNext({
          operationId: context.runId + ':queue.cleanup.acquire',
          expectedRevision: revision,
          actor: context.actor,
          requestedAt: context.clock(),
          input: { entrySequence: active.sequence, targetCommit: cleanupTargetCommit },
        });
        if (acquired.disposition !== 'applied' || !acquired.value || acquired.value.runId !== context.runId) blocked.push('queue entry could not be conditionally acquired for cleanup');
        else {
          lease = acquired.value;
          revision = acquired.revision;
          await context.ledger.recordProviderAcceptance(acquireIntent.artifactKey, 'queue:' + active.sequence, revision);
          await context.ledger.acknowledge(acquireIntent.artifactKey);
        }
      }
      if (lease?.runId === context.runId && blocked.length === 0) {
        const rejectIntent = await context.ledger.recordIntent({
          artifactKey: 'queue-cleanup-remove',
          operation: 'queue.entry.remove',
          expectedRevisionOrHead: revision,
          cleanupOperation: 'queue-entry.remove',
          cleanupPrerequisites: ['run ID, candidate, sequence, and active lease must remain exact'],
        });
        const removed = await context.queue.finalize({
          operationId: context.runId + ':queue.cleanup.remove',
          expectedRevision: revision,
          actor: context.actor,
          requestedAt: context.clock(),
          input: { entrySequence: active.sequence, outcome: 'rejected', evidenceRef: durableEvidenceRef!, blocker: 'other' },
        });
        if (removed.disposition !== 'applied') blocked.push('queue entry changed before conditional removal');
        else {
          await context.ledger.recordProviderAcceptance(rejectIntent.artifactKey, 'queue:' + active.sequence, removed.revision);
          await context.ledger.acknowledge(rejectIntent.artifactKey);
          await context.ledger.markCleanup(rejectIntent.artifactKey, 'passed');
          for (const entry of queueKeys) await context.ledger.markCleanup(entry.artifactKey, 'passed', 'canonical queue entry was conditionally removed');
          evidence.push('queue:' + active.sequence + ':removed');
        }
      }
    }
  }

  if (sourceEntry && sourceEntry.cleanupOutcome !== 'passed' && (!context.sourceHost.sourceHead || !context.sourceHost.deleteSourceBranch)) blocked.push('source-host adapter does not expose exact source-head and conditional branch-delete cleanup');
  if (sourceEntry && sourceEntry.cleanupOutcome !== 'passed' && sourceEntry.providerRef && context.sourceHost.sourceHead && context.sourceHost.deleteSourceBranch) {
    const currentHead = await context.sourceHost.sourceHead(sourceRef);
    if (currentHead === undefined) {
      await context.ledger.markCleanup('source-branch', 'passed', 'source branch is already absent after attributable cleanup');
      evidence.push('source-branch:' + sourceRef + ':absent');
    } else if (sourceEntry.observedRevisionOrHead !== currentHead) {
      blocked.push('source branch head drifted from ' + (sourceEntry.observedRevisionOrHead ?? 'unrecorded') + ' to ' + currentHead);
    } else if (!await context.allowSourceBranchDelete(sourceRef)) {
      blocked.push('exact-source-ref ForcePush permission and read capability did not pass; source branch was not deleted');
    } else {
      const intent = await context.ledger.recordIntent({
        artifactKey: 'source-branch-delete',
        operation: 'source-branch.delete',
        expectedRevisionOrHead: currentHead,
        cleanupOperation: 'source-branch.delete',
        cleanupPrerequisites: ['exact-source-ref ForcePush and read capability passed immediately before deletion'],
      });
      await context.sourceHost.deleteSourceBranch(sourceRef, currentHead);
      await context.ledger.recordProviderAcceptance(intent.artifactKey, sourceRef, currentHead);
      await context.ledger.acknowledge(intent.artifactKey);
      await context.ledger.markCleanup(intent.artifactKey, 'passed');
      await context.ledger.markCleanup('source-branch', 'passed');
      evidence.push('source-branch:' + sourceRef + ':deleted');
    }
  }

  if (blocked.length > 0) return { outcome: 'blocked', nextAction: 'stop cleanup and perform the listed manual recovery; no unproven artifact was mutated', evidence: blocked };
  return { outcome: 'passed', nextAction: 'retain the ledger and redacted evidence until the Work Item cleanup also completes', evidence };
}

async function findMarkedPullRequest(context: LivePilotContext, sourceRef: string): Promise<PullRequestRef | undefined> {
  if (!context.sourceHost.listPullRequests) return undefined;
  const marker = validationMarker(context.runId, 'pull-request');
  const matches = (await context.sourceHost.listPullRequests(sourceRef)).filter((candidate) =>
    candidate.sourceRef === sourceRef
    && candidate.targetRef === context.target.targetRef
    && candidate.description?.includes(marker)
    && candidate.description?.includes(validationTargetFingerprint(context.target))
    && candidate.workItemIds?.includes(context.candidateWorkItemId),
  );
  return matches.length === 1 ? matches[0] : undefined;
}
