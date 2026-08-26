import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertSafeValidationRunId, evaluateLiveGate, ValidationLedger, validationMarker, type LiveGateResult, type ValidationTarget, type ValidationOutcome } from '../../src/validation/ledger.ts';
import { loadProviderConfig, type AzureDevOpsConfig } from '../../src/config/provider.ts';
import { AzureAuthenticator, EnvironmentPatSource, type AuthSelection } from '../../src/adapters/azure/auth.ts';
import { AzureHttpClient, FetchHttpTransport, RedactedAzureError } from '../../src/adapters/azure/http.ts';
import { AzureWorkItemAdapter } from '../../src/adapters/azure/boards.ts';
import { AzureClaimStore } from '../../src/adapters/azure/claims.ts';
import { AzureEvidenceStore } from '../../src/adapters/azure/evidence.ts';
import { AzureSourceHostAdapter } from '../../src/adapters/azure/repos.ts';
import { AzurePolicyAdapter } from '../../src/adapters/azure/policies.ts';
import { AzureCanonicalQueueStore } from '../../src/adapters/azure/queue.ts';
import { AzurePreparationAdapter } from '../../src/adapters/azure/bootstrap.ts';
import { AzureNamespaceReader, AzurePermissionBatchReader, GIT_REPOSITORIES_NAMESPACE, FORCE_PUSH_BIT, forcePushAllowed } from '../../src/adapters/azure/permissions.ts';
import { appendComment, createWorkItem, queryWorkItems, readWorkItem } from '../../src/adapters/azure/api.ts';
import { resolveTarget, type ResolvedTarget } from '../../src/adapters/azure/target.ts';
import { canonicalQueueKey } from '../../src/adapters/azure/target.ts';
import { azureStateMap } from '../../src/cli/azure-legacy.ts';
import { inspectRuntime } from '../../src/adapters/local/runtime-readiness.ts';
import type { ReadinessReport } from '../../src/domain/types.ts';
import { readinessOutcome } from '../../src/validation/live-readiness.ts';
import { cleanupLivePilot, runLivePilot, validationCheckpointId, validationSourceRef, validationTargetFingerprint, type LivePilotArtifacts } from '../../src/validation/live-pilot.ts';

type LivePhaseName = 'readiness' | 'boards' | 'reposPolicy' | 'reposPilot' | 'twoIdentity' | 'cleanup' | 'recovery';
type LivePhase = {
  outcome: ValidationOutcome;
  prerequisites: string[];
  nextAction: string;
  evidence?: string[];
};
type LiveResult = {
  mode: 'live';
  evidence: 'executed' | 'not-run';
  recovery: boolean;
  gate: LiveGateResult;
  phases: Record<LivePhaseName, LivePhase>;
  nextAction: string;
};
type MarkerMatch = { providerRef: string; observedRevisionOrHead: string | null };

const environment = process.env;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const configPath = environment.AGENT_WORKSPACE_AZURE_CONFIG_PATH ?? resolve(repoRoot, 'agent-workspace.config.json');
const target: ValidationTarget = {
  organizationUrl: environment.AGENT_WORKSPACE_AZURE_LIVE_ALLOW_ORGANIZATION_URL ?? 'https://dev.azure.com/not-configured',
  projectId: environment.AGENT_WORKSPACE_AZURE_LIVE_ALLOW_PROJECT_ID ?? 'not-configured',
  repositoryId: environment.AGENT_WORKSPACE_AZURE_LIVE_ALLOW_REPOSITORY_ID ?? 'not-configured',
  targetRef: environment.AGENT_WORKSPACE_AZURE_LIVE_ALLOW_TARGET_REF ?? 'refs/heads/not-configured',
};
const recovery = process.argv.includes('--recover');

function phase(name: LivePhaseName, prerequisites: string[], nextAction: string, outcome: ValidationOutcome = 'not-run', evidence?: string[]): LivePhase {
  return { outcome, prerequisites, nextAction: nextAction || `satisfy the live prerequisites before running ${name}`, ...(evidence ? { evidence } : {}) };
}

function emptyPhases(prerequisites: string[], nextAction: string): Record<LivePhaseName, LivePhase> {
  return {
    readiness: phase('readiness', prerequisites, nextAction),
    boards: phase('boards', prerequisites, nextAction),
    reposPolicy: phase('reposPolicy', prerequisites, nextAction),
    reposPilot: phase('reposPilot', prerequisites, nextAction),
    twoIdentity: phase('twoIdentity', prerequisites, nextAction),
    cleanup: phase('cleanup', prerequisites, nextAction),
    recovery: phase('recovery', prerequisites, nextAction),
  };
}

function normalizedOrganization(value: string): string {
  return value.replace(/\/+$/, '');
}

function safeFailure(error: unknown): string {
  if (error instanceof RedactedAzureError) return `provider ${error.classification} response`;
  if (error instanceof Error && /permission|credential|auth/i.test(error.message)) return 'provider authorization or permission response';
  return 'provider operation failed; inspect redacted provider evidence';
}

function configInspection(): { config?: AzureDevOpsConfig; runtimeProfile?: 'local-agent-v1' | null; missing: string[] } {
  try {
    const loaded = loadProviderConfig(configPath);
    if (loaded.provider !== 'azure-devops' || !loaded.azureDevOps) return { runtimeProfile: loaded.runtimeProfile, missing: ['azure-devops provider selected in the exact runtime configuration'] };
    const config = loaded.azureDevOps;
    const missing: string[] = [];
    if (normalizedOrganization(config.organizationUrl) !== normalizedOrganization(target.organizationUrl)) missing.push('configuration organization matches the exact allowlist');
    if (config.project.expectedId !== null && config.project.expectedId.toLowerCase() !== target.projectId.toLowerCase()) missing.push('configured project ID matches the exact allowlist');
    if (config.repository.expectedId !== null && config.repository.expectedId.toLowerCase() !== target.repositoryId.toLowerCase()) missing.push('configured repository ID matches the exact allowlist');
    if (config.integrationTarget !== target.targetRef) missing.push('configured target ref matches the exact allowlist');
    return { config, runtimeProfile: loaded.runtimeProfile, missing };
  } catch {
    return { missing: ['a valid non-secret Azure provider configuration at the approved config path'] };
  }
}

function gateFor(configReady: boolean, runtimeReady: boolean): LiveGateResult {
  return evaluateLiveGate({
    environment,
    runtimeReady,
    configReady,
    identityReady: Boolean(environment.AGENT_WORKSPACE_AZURE_ACTOR),
    permissionsReady: environment.AGENT_WORKSPACE_AZURE_LIVE_PERMISSIONS_READY === '1',
    capabilityReady: environment.AGENT_WORKSPACE_AZURE_LIVE_CAPABILITIES_READY === '1',
    networkReady: environment.AGENT_WORKSPACE_AZURE_LIVE_NETWORK_READY === '1',
    policyReady: environment.AGENT_WORKSPACE_AZURE_LIVE_POLICY_READY === '1',
    target,
  });
}

function gatedResult(gate: LiveGateResult, missing: string[] = gate.missing): LiveResult {
  const effectiveMissing = [...new Set(missing)];
  const nextAction = 'satisfy the approved runtime, exact target, identity, permission, capability, network, policy, and credential gates before live validation';
  return {
    mode: 'live',
    evidence: 'not-run',
    recovery,
    gate: { ...gate, outcome: 'not-run', missing: effectiveMissing },
    phases: emptyPhases(effectiveMissing, nextAction),
    nextAction,
  };
}

async function providerIdentityMatches(client: AzureHttpClient, expectedActor: string): Promise<boolean> {
  const raw = await client.get('/_apis/profile/profiles/me', {}, '7.1-preview.3');
  if (typeof raw !== 'object' || raw === null) return false;
  const values = ['id', 'displayName', 'emailAddress', 'publicAlias', 'descriptor']
    .map((key) => (raw as Record<string, unknown>)[key])
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  return values.some((value) => value.toLowerCase() === expectedActor.toLowerCase());
}

async function main(): Promise<LiveResult> {
  const inspected = configInspection();
  let runtime: Awaited<ReturnType<typeof inspectRuntime>>;
  try {
    runtime = await inspectRuntime({ runtimeProfile: inspected.runtimeProfile, cwd: repoRoot, environment });
  } catch {
    return gatedResult(gateFor(Boolean(inspected.config) && inspected.missing.length === 0, false), ['runtime readiness inspection completed without an unclassified bootstrap error']);
  }
  const runtimeReady = environment.AGENT_WORKSPACE_AZURE_LIVE_RUNTIME_READY === '1' && runtime.state === 'ready';
  const gate = gateFor(Boolean(inspected.config) && inspected.missing.length === 0, runtimeReady);
  if (gate.outcome !== 'passed' || !inspected.config) return gatedResult(gate, [...gate.missing, ...inspected.missing]);

  const azureConfig = inspected.config;
  const authenticator = new AzureAuthenticator({
    tenantId: azureConfig.authentication.tenantId,
    patFallback: {
      mode: azureConfig.authentication.patFallback.mode,
      source: new EnvironmentPatSource(azureConfig.authentication.patFallback.secretEnvironmentVariable),
    },
    environment,
  });
  let auth: AuthSelection;
  try {
    auth = await authenticator.select();
  } catch {
    return gatedResult(gate, [...gate.missing, 'approved credential selection completed without an unclassified bootstrap error']);
  }
  if (!auth.credential) return gatedResult(gate, [...gate.missing, 'approved Azure credential available to this process']);

  const client = new AzureHttpClient(new FetchHttpTransport(), () => auth.credential, azureConfig.organizationUrl, '7.1', () => auth.source);
  const actor = environment.AGENT_WORKSPACE_AZURE_ACTOR ?? 'approved-live-actor';
  try {
    if (!await providerIdentityMatches(client, actor)) return gatedResult(gate, ['read-only provider identity profile matches AGENT_WORKSPACE_AZURE_ACTOR']);
  } catch {
    return gatedResult(gate, ['read-only provider identity profile is available for the approved actor']);
  }
  let resolved: ResolvedTarget;
  try {
    resolved = await resolveTarget(client, azureConfig);
  } catch {
    return gatedResult(gate, ['read-only target resolution completed for the exact allowlisted Organization, Project, Repository, and target ref']);
  }
  if (
    normalizedOrganization(resolved.organizationUrl) !== normalizedOrganization(target.organizationUrl)
    || resolved.project.id.toLowerCase() !== target.projectId.toLowerCase()
    || resolved.repository.id.toLowerCase() !== target.repositoryId.toLowerCase()
    || resolved.integrationTarget !== target.targetRef
  ) {
    return gatedResult(gate, ['read-only resolved target exactly matches the live allowlist']);
  }

  const clock = () => new Date().toISOString();
  const boardsOptions = {
    client,
    projectName: azureConfig.project.name,
    projectId: resolved.project.id,
    organizationUrl: resolved.organizationUrl,
    integrationTarget: resolved.integrationTarget,
    stateMap: azureStateMap(azureConfig),
    clock,
  };
  const boards = new AzureWorkItemAdapter(boardsOptions);
  const evidenceStore = new AzureEvidenceStore({ ...boardsOptions, publisherId: actor }, boards);
  const sourceHost = new AzureSourceHostAdapter({
    client,
    projectName: azureConfig.project.name,
    repositoryId: resolved.repository.id,
    targetRef: resolved.integrationTarget,
    cwd: repoRoot,
    companyOriginUrl: `${resolved.organizationUrl}/${encodeURIComponent(azureConfig.project.name)}/_git/${encodeURIComponent(azureConfig.repository.name)}`,
    authProvider: () => auth,
    clock,
  });
  const policies = new AzurePolicyAdapter({ client, projectName: azureConfig.project.name, repositoryId: resolved.repository.id, clock });
  const queue = new AzureCanonicalQueueStore({
    client,
    projectName: azureConfig.project.name,
    projectId: resolved.project.id,
    organizationUrl: resolved.organizationUrl,
    integrationTarget: resolved.integrationTarget,
    repositoryId: resolved.repository.id,
    targetRef: resolved.integrationTarget,
    queueKey: canonicalQueueKey(resolved.organizationUrl, resolved.project.id, resolved.repository.id, resolved.integrationTarget),
    stateMap: azureStateMap(azureConfig),
    clock,
  });
  const capabilities = [
    {
      name: 'integration-target-read',
      probe: async (): Promise<'passed' | 'denied' | 'unavailable'> => {
        try {
          await sourceHost.targetHead(resolved.integrationTarget);
          return 'passed';
        } catch {
          return 'unavailable';
        }
      },
    },
    {
      name: 'policy-configuration-read',
      probe: async (): Promise<'passed' | 'denied' | 'unavailable'> => {
        try {
          await policies.inspectTarget({ repositoryId: resolved.repository.id, targetRef: resolved.integrationTarget });
          return 'passed';
        } catch {
          return 'unavailable';
        }
      },
    },
  ];
  const preparation = new AzurePreparationAdapter({
    client,
    config: azureConfig,
    authenticator,
    authSelection: auth,
    sourceHost,
    policyAdapter: policies,
    namespaceDiscovery: new AzureNamespaceReader(client),
    permissionBatchReader: new AzurePermissionBatchReader(client),
    capabilities,
    identity: actor,
    runtimeOutcome: runtime.state === 'ready' ? 'passed' : 'unavailable',
    clock,
  });
  const allowSourceBranchDelete = async (sourceRef: string): Promise<boolean> => {
    if (!sourceHost.sourceHead) return false;
    try {
      const namespace = await new AzureNamespaceReader(client).getNamespace(GIT_REPOSITORIES_NAMESPACE);
      const action = namespace.actions.find((candidate) => candidate.name === 'ForcePush');
      if (!action || action.bit !== FORCE_PUSH_BIT) return false;
      const batch = await new AzurePermissionBatchReader(client).readBatch(GIT_REPOSITORIES_NAMESPACE, [sourceRef], [actor]);
      if (!forcePushAllowed(batch, sourceRef)) return false;
      await sourceHost.sourceHead(sourceRef);
      return true;
    } catch {
      return false;
    }
  };
  const scanWorkItems = async (marker: string, exactTarget: ValidationTarget): Promise<MarkerMatch[]> => {
    const ids = await queryWorkItems(client, { projectName: azureConfig.project.name, clock }, `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = @project`);
    const matches: MarkerMatch[] = [];
    for (const id of ids) {
      const snapshot = await readWorkItem(client, { projectName: azureConfig.project.name, clock }, id);
      const content = Object.values(snapshot.wire.fields).join('\n');
      if (content.includes(marker) && content.includes(validationTargetFingerprint(exactTarget))) {
        matches.push({ providerRef: `work-item:${id}`, observedRevisionOrHead: snapshot.revision });
      }
    }
    return matches;
  };
  const scanProviderArtifacts = async (marker: string, exactTarget: ValidationTarget): Promise<MarkerMatch[]> => {
    const artifactKey = marker.split(':').at(-1) ?? '';
    if (artifactKey === 'boards-roundtrip') return scanWorkItems(marker, exactTarget);
    if (artifactKey === 'work-item-close') {
      if (!createdWorkItemId) return [];
      const snapshot = await boards.read(createdWorkItemId);
      const description = snapshot.value.item.description ?? '';
      if (!description.includes(validationMarker(runId, 'boards-roundtrip')) || !description.includes(validationTargetFingerprint(exactTarget))) return [];
      const operation = snapshot.value.coordination.lastAppliedOperation;
      if (operation?.operationId !== `${runId}:work-item.close` || operation.kind !== 'work-item-state' || operation.outcome !== 'integrated') return [];
      return [{ providerRef: `work-item:${createdWorkItemId}`, observedRevisionOrHead: snapshot.revision }];
    }
    if (artifactKey === 'agent-checkpoint') {
      if (!createdWorkItemId || !sourceHost.readCheckpoints) return [];
      const checkpointId = validationCheckpointId(runId);
      return (await sourceHost.readCheckpoints(createdWorkItemId))
        .filter((checkpoint) => checkpoint.checkpointId === checkpointId && checkpoint.runId === runId && checkpoint.branch === validationSourceRef(runId))
        .map((checkpoint) => ({ providerRef: 'checkpoint:' + checkpoint.checkpointId, observedRevisionOrHead: checkpoint.commit }));
    }
    if (artifactKey.startsWith('run-evidence-')) {
      if (!createdWorkItemId || !evidenceStore.findPublications) return [];
      return (await evidenceStore.findPublications(createdWorkItemId, marker)).map((publication) => ({
        providerRef: publication.providerRef,
        observedRevisionOrHead: publication.observedRevisionOrHead,
      }));
    }
    if (artifactKey.startsWith('source-branch')) {
      if (!sourceHost.listSourceBranches) return [];
      const branches = await sourceHost.listSourceBranches(validationSourceRef(runId));
      return branches
        .filter((branch) => branch.sourceRef === validationSourceRef(runId))
        .map((branch) => ({ providerRef: branch.sourceRef, observedRevisionOrHead: branch.headCommit }));
    }
    if (artifactKey.startsWith('pull-request')) {
      if (!sourceHost.listPullRequests) return [];
      const sourceRef = validationSourceRef(runId);
      const markerText = validationMarker(runId, 'pull-request');
      const tupleMatches = (await sourceHost.listPullRequests(sourceRef)).filter((candidate) =>
        candidate.sourceRef === sourceRef
        && candidate.targetRef === exactTarget.targetRef
        && (!createdWorkItemId || candidate.workItemIds?.includes(createdWorkItemId))
        && candidate.description?.includes(markerText)
        && candidate.description?.includes(validationTargetFingerprint(exactTarget)),
      );
      const matches = artifactKey === 'pull-request-complete'
        ? tupleMatches.filter((candidate) => candidate.status?.toLowerCase() === 'completed' && candidate.mergeStatus?.toLowerCase() === 'succeeded' && Boolean(candidate.mergeCommit))
        : tupleMatches;
      return matches.map((candidate) => ({
        providerRef: 'pull-request:' + candidate.pullRequestId,
        observedRevisionOrHead: artifactKey === 'pull-request-complete' ? candidate.mergeCommit ?? null : candidate.sourceCommit ?? null,
      }));
    }
    if (artifactKey === 'queue-finalize') {
      try {
        const workItemId = createdWorkItemId;
        if (!workItemId || !evidenceStore.findPublications) return [];
        const finalizations = [
          { operationId: `${runId}:queue.finalize`, evidenceArtifact: 'run-evidence-pre-finalize' },
          { operationId: `${runId}:queue.reject`, evidenceArtifact: 'run-evidence-policy-blocked' },
        ];
        const evidenceRefs = new Set((await Promise.all(finalizations.map((finalization) =>
          evidenceStore.findPublications!(workItemId, validationMarker(runId, finalization.evidenceArtifact)),
        ))).flat().map((publication) => publication.providerRef));
        const summaries = (await queue.completionHistory({ repositoryId: exactTarget.repositoryId, targetRef: exactTarget.targetRef }))
          .filter((summary) =>
            finalizations.some((finalization) => finalization.operationId === summary.operationId)
            && summary.runId === runId
            && summary.candidateWorkItemId === workItemId
            && typeof summary.evidenceRef === 'string'
            && evidenceRefs.has(summary.evidenceRef));
        return summaries.map((summary) => ({
          providerRef: 'queue:' + summary.sequence,
          observedRevisionOrHead: `completion:${summary.operationId}:${summary.evidenceRef}`,
        }));
      } catch {
        return [];
      }
    }
    if (artifactKey.startsWith('queue-')) {
      try {
        const current = await queue.read({ repositoryId: exactTarget.repositoryId, targetRef: exactTarget.targetRef });
        const matches = current.value.entries.filter((entry) => entry.runId === runId);
        return matches.map((entry) => ({ providerRef: 'queue:' + entry.sequence, observedRevisionOrHead: current.revision }));
      } catch {
        return [];
      }
    }
    return [];
  };

  const requestedRunId = environment.AGENT_WORKSPACE_AZURE_VALIDATION_RUN_ID;
  if (recovery && !requestedRunId) return gatedResult(gate, ['AGENT_WORKSPACE_AZURE_VALIDATION_RUN_ID naming an existing validation run for recovery']);
  const runId = requestedRunId ?? `live-${Date.now()}`;
  try {
    assertSafeValidationRunId(runId);
  } catch {
    return gatedResult(gate, ['a path-safe AGENT_WORKSPACE_AZURE_VALIDATION_RUN_ID']);
  }

  let ledger: ValidationLedger;
  let createdWorkItemId: string | undefined;
  let pilotArtifacts: LivePilotArtifacts | undefined;
  try {
    if (recovery) {
      const existing = await ValidationLedger.openExisting(repoRoot, runId, target, clock);
      if (existing) {
        ledger = existing;
      } else {
        const matches = await scanWorkItems(validationMarker(runId, 'boards-roundtrip'), target);
        if (matches.length !== 1) return gatedResult(gate, ['one unique run-owned marker is discoverable before reconstructing a lost validation ledger']);
        ledger = await ValidationLedger.open(repoRoot, runId, target, clock);
        const reconstructed = await ledger.recordIntent({ artifactKey: 'boards-roundtrip', operation: 'work-item.create', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close', cleanupPrerequisites: ['reconstructed from an exact target marker after local ledger loss'] });
        await ledger.recordProviderAcceptance(reconstructed.artifactKey, matches[0].providerRef, matches[0].observedRevisionOrHead);
        await ledger.acknowledge(reconstructed.artifactKey);
        createdWorkItemId = matches[0].providerRef.replace(/^work-item:/, '');
        const sourceMatches = await scanProviderArtifacts(validationMarker(runId, 'source-branch'), target);
        if (sourceMatches.length > 1) return gatedResult(gate, ['at most one run-owned validation source branch is discoverable after local-ledger loss']);
        if (sourceMatches.length === 1) {
          const source = await ledger.recordIntent({ artifactKey: 'source-branch', operation: 'source-branch.create', expectedRevisionOrHead: null, cleanupOperation: 'source-branch.delete', cleanupPrerequisites: ['reconstructed from the exact deterministic validation source ref after local ledger loss'] });
          await ledger.recordProviderAcceptance(source.artifactKey, sourceMatches[0].providerRef, sourceMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(source.artifactKey);
        }
        const pullRequestMatches = await scanProviderArtifacts(validationMarker(runId, 'pull-request'), target);
        if (pullRequestMatches.length > 1) return gatedResult(gate, ['at most one run-owned validation pull request is discoverable after local-ledger loss']);
        if (pullRequestMatches.length === 1) {
          const pullRequest = await ledger.recordIntent({ artifactKey: 'pull-request', operation: 'pull-request.create', expectedRevisionOrHead: null, cleanupOperation: 'pull-request.abandon', cleanupPrerequisites: ['reconstructed from the exact PR marker, source ref, target ref, and target fingerprint'] });
          await ledger.recordProviderAcceptance(pullRequest.artifactKey, pullRequestMatches[0].providerRef, pullRequestMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(pullRequest.artifactKey);
        }
        const completedPullRequestMatches = await scanProviderArtifacts(validationMarker(runId, 'pull-request-complete'), target);
        if (completedPullRequestMatches.length > 1) return gatedResult(gate, ['at most one completed run-owned validation pull request is discoverable after local-ledger loss']);
        if (completedPullRequestMatches.length === 1) {
          const completedPullRequest = await ledger.recordIntent({ artifactKey: 'pull-request-complete', operation: 'pull-request.complete', expectedRevisionOrHead: null, cleanupOperation: 'pull-request.abandon', cleanupPrerequisites: ['reconstructed from the completed PR tuple and immutable merge commit after local-ledger loss'] });
          await ledger.recordProviderAcceptance(completedPullRequest.artifactKey, completedPullRequestMatches[0].providerRef, completedPullRequestMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(completedPullRequest.artifactKey);
        }
        const queueMatches = await scanProviderArtifacts(validationMarker(runId, 'queue-entry'), target);
        if (queueMatches.length > 1) return gatedResult(gate, ['at most one active run-owned canonical queue entry is discoverable after local-ledger loss']);
        if (queueMatches.length === 1) {
          const queueEntry = await ledger.recordIntent({ artifactKey: 'queue-entry', operation: 'queue.entry.enqueue', expectedRevisionOrHead: null, cleanupOperation: 'queue-entry.remove', cleanupPrerequisites: ['reconstructed from the canonical queue run ID after local-ledger loss'] });
          await ledger.recordProviderAcceptance(queueEntry.artifactKey, queueMatches[0].providerRef, queueMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(queueEntry.artifactKey);
        }
        const checkpointMatches = await scanProviderArtifacts(validationMarker(runId, 'agent-checkpoint'), target);
        if (checkpointMatches.length > 1) return gatedResult(gate, ['at most one run-owned Agent Checkpoint is discoverable after local-ledger loss']);
        if (checkpointMatches.length === 1) {
          const checkpoint = await ledger.recordIntent({ artifactKey: 'agent-checkpoint', operation: 'checkpoint.publish', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close', cleanupPrerequisites: ['reconstructed from the immutable checkpoint identity after local ledger loss'] });
          await ledger.recordProviderAcceptance(checkpoint.artifactKey, checkpointMatches[0].providerRef, checkpointMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(checkpoint.artifactKey);
        }
        for (const artifactKey of ['run-evidence-policy-blocked', 'run-evidence-pre-finalize', 'run-evidence-queue-rejected', 'run-evidence-queue-finalized']) {
          const evidenceMatches = await scanProviderArtifacts(validationMarker(runId, artifactKey), target);
          if (evidenceMatches.length > 1) return gatedResult(gate, [`at most one ${artifactKey} provider publication is discoverable after local-ledger loss`]);
          if (evidenceMatches.length === 1) {
            const evidence = await ledger.recordIntent({ artifactKey, operation: 'run-evidence.publish', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close', cleanupPrerequisites: ['reconstructed from the immutable Run Evidence provider marker after local ledger loss'] });
            await ledger.recordProviderAcceptance(evidence.artifactKey, evidenceMatches[0].providerRef, evidenceMatches[0].observedRevisionOrHead);
            await ledger.acknowledge(evidence.artifactKey);
          }
        }
        const queueFinalizationMatches = await scanProviderArtifacts(validationMarker(runId, 'queue-finalize'), target);
        if (queueFinalizationMatches.length > 1) return gatedResult(gate, ['at most one canonical queue completion linked to exact candidate evidence is discoverable after local-ledger loss']);
        if (queueFinalizationMatches.length === 1) {
          const queueFinalization = await ledger.recordIntent({ artifactKey: 'queue-finalize', operation: 'queue.entry.finalize', expectedRevisionOrHead: null, cleanupOperation: 'queue-entry.remove', cleanupPrerequisites: ['reconstructed from the canonical completion tuple and exact provider evidence link after local-ledger loss'] });
          await ledger.recordProviderAcceptance(queueFinalization.artifactKey, queueFinalizationMatches[0].providerRef, queueFinalizationMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(queueFinalization.artifactKey);
        }
        const closeMatches = await scanProviderArtifacts(validationMarker(runId, 'work-item-close'), target);
        if (closeMatches.length > 1) return gatedResult(gate, ['at most one run-owned Work Item closure receipt is discoverable after local-ledger loss']);
        if (closeMatches.length === 1) {
          const close = await ledger.recordIntent({ artifactKey: 'work-item-close', operation: 'work-item.close', expectedRevisionOrHead: null, cleanupOperation: 'work-item.close', cleanupPrerequisites: ['reconstructed from the exact immutable Work Item closure receipt after local ledger loss'] });
          await ledger.recordProviderAcceptance(close.artifactKey, closeMatches[0].providerRef, closeMatches[0].observedRevisionOrHead);
          await ledger.acknowledge(close.artifactKey);
        }
      }
    } else {
      ledger = await ValidationLedger.open(repoRoot, runId, target, clock);
    }
  } catch {
    return gatedResult(gate, ['validation ledger bootstrap/recovery completed without a credential-bearing or path-escaping error']);
  }

  const preRecoveryBoardsEntry = ledger.snapshot().entries.find((entry) => entry.artifactKey === 'boards-roundtrip');
  if (preRecoveryBoardsEntry?.providerRef?.startsWith('work-item:') && preRecoveryBoardsEntry.cleanupOutcome !== 'passed') {
    createdWorkItemId = preRecoveryBoardsEntry.providerRef.slice('work-item:'.length);
  }

  const readiness = await (async (): Promise<LivePhase> => {
    try {
      const report = await preparation.readiness();
      const evaluated = readinessOutcome(report);
      return phase('readiness', [], evaluated.outcome === 'passed' ? 'continue to the gated live phases' : 'resolve the failed readiness capability before allowing a mutation', evaluated.outcome, evaluated.evidence);
    } catch (error) {
      return phase('readiness', [], safeFailure(error), 'failed');
    }
  })();

  const reposPolicy = await (async (): Promise<LivePhase> => {
    try {
      const head = await sourceHost.targetHead(resolved.integrationTarget);
      const inventory = await policies.inspectTarget({ repositoryId: resolved.repository.id, targetRef: resolved.integrationTarget });
      if (inventory.sources.some((source) => source.outcome !== 'read')) {
        return phase('reposPolicy', ['readable Azure Repos policy inventory'], 'stop; policy visibility was not established', 'failed', [`target-head:${head}`]);
      }
      return phase('reposPolicy', ['allowlisted validation PR and exact head for policy evaluation'], 'read-only target-head and policy configuration evidence is available; create the separately approved validation PR before claiming policy evaluation PASS', 'not-run', [`target-head:${head}`, `blocking-policy-count:${inventory.effectiveBlocking.length}`]);
    } catch (error) {
      return phase('reposPolicy', [], safeFailure(error), 'failed');
    }
  })();

  const recoveryPhase = await (async (): Promise<LivePhase> => {
    if (!recovery) return phase('recovery', ['--recover'], 'rerun `npm run test:azure:live -- --recover` after a crash or local-ledger loss');
    try {
      const recovered = await ledger.recover(scanProviderArtifacts, true);
      if (recovered.blocked.length > 0) return phase('recovery', [], 'stop and perform the reported manual recovery; ownership was not proven', 'blocked', recovered.blocked);
      return phase('recovery', [], 'continue with the recovered ledger state; recovery completed before any new mutation', 'passed', recovered.repaired);
    } catch (error) {
      return phase('recovery', [], safeFailure(error), 'failed');
    }
  })();

  const recoveredBoardsEntry = ledger.snapshot().entries.find((entry) => entry.artifactKey === 'boards-roundtrip');
  if (recovery && !createdWorkItemId && recoveredBoardsEntry?.providerRef?.startsWith('work-item:') && recoveredBoardsEntry.cleanupOutcome !== 'passed') {
    createdWorkItemId = recoveredBoardsEntry.providerRef.slice('work-item:'.length);
  }

  const boardsPhase = await (async (): Promise<LivePhase> => {
    if (recovery) return phase('boards', ['normal live mode'], 'recovery mode never creates a new validation Work Item');
    if (readiness.outcome !== 'passed') return phase('boards', ['readiness phase passed'], 'resolve readiness before creating a validation Work Item');
    if (reposPolicy.outcome === 'failed') return phase('boards', ['Repos/policy read phase did not fail'], 'resolve the failed provider policy read before creating a validation Work Item');
    const artifactKey = 'boards-roundtrip';
    const intent = await ledger.recordIntent({
      artifactKey,
      operation: 'work-item.create',
      expectedRevisionOrHead: null,
      cleanupOperation: 'work-item.close',
      cleanupPrerequisites: ['ownership marker and expected Work Item revision must remain attributable'],
    });
    const marker = intent.marker;
    const description = [
      `Agent Workspace live validation marker: ${marker}`,
      `Agent Workspace live validation target: ${validationTargetFingerprint(target)}`,
      'This Work Item is created only by the gated validation run and is closed during cleanup.',
    ].join('\n');
    try {
      const created = await createWorkItem(client, { projectName: azureConfig.project.name, clock }, azureConfig.process.workItemType, [
        { op: 'add', path: '/fields/System.Title', value: `Agent Workspace live validation ${marker}` },
        { op: 'add', path: '/fields/System.Description', value: description },
      ]);
      createdWorkItemId = String(created.wire.id);
      await ledger.recordProviderAcceptance(artifactKey, `work-item:${createdWorkItemId}`, created.revision);
      const observed = await boards.read(createdWorkItemId);
      const stale = await boards.projectState({
        operationId: `${ledger.snapshot().validationRunId}:work-item.stale-read`,
        expectedRevision: `stale:${created.revision}`,
        actor,
        requestedAt: clock(),
        input: { workItemId: createdWorkItemId, from: 'open', to: 'claimed' },
      });
      if (stale.disposition !== 'conflict') throw new Error('stale Work Item revision was not rejected');
      const claimStore = new AzureClaimStore(boardsOptions);
      const claimAt = clock();
      const claimCommand = {
        operationId: `${ledger.snapshot().validationRunId}:boards-claim.acquire`,
        expectedRevision: observed.revision,
        actor,
        requestedAt: claimAt,
        input: { workItemId: createdWorkItemId, claimToken: `${ledger.snapshot().validationRunId}:boards-claim`, claimant: actor, runId: ledger.snapshot().validationRunId, acquiredAt: claimAt, leaseExpiresAt: new Date(Date.parse(claimAt) + 60_000).toISOString(), kind: 'acquire' as const },
      };
      const claim = await claimStore.acquire(claimCommand);
      if (claim.disposition !== 'applied') throw new Error('Boards claim round-trip did not apply');
      await ledger.recordProviderObservation(artifactKey, claim.revision);
      const duplicateClaim = await claimStore.acquire(claimCommand);
      if (duplicateClaim.disposition !== 'duplicate') throw new Error('Boards claim receipt was not idempotent');
      const releasedClaim = await claimStore.release({ operationId: `${claimCommand.operationId}:release`, expectedRevision: duplicateClaim.revision, actor, requestedAt: clock(), input: { workItemId: createdWorkItemId, claimToken: claimCommand.input.claimToken, reason: 'live validation round-trip' } });
      if (releasedClaim.disposition !== 'applied') throw new Error('Boards claim release did not apply');
      await ledger.recordProviderObservation(artifactKey, releasedClaim.revision);
      await appendComment(client, { projectName: azureConfig.project.name, clock }, createdWorkItemId, `Agent Workspace live validation evidence: ${marker}`);
      const reread = await boards.read(createdWorkItemId);
      if (reread.value.item.id !== createdWorkItemId || observed.value.item.id !== createdWorkItemId) throw new Error('created Work Item could not be read back');
      await ledger.recordProviderObservation(artifactKey, reread.revision);
      await ledger.acknowledge(artifactKey);
      return phase('boards', [], 'continue to cleanup; immutable marker comment is retained', 'passed', [`work-item:${createdWorkItemId}`, `revision:${reread.revision}`]);
    } catch (error) {
      return phase('boards', [], safeFailure(error), 'failed');
    }
  })();

  const reposPilot = await (async (): Promise<LivePhase> => {
    if (recovery) return phase('reposPilot', ['normal live mode'], 'recovery mode never creates a new validation branch, pull request, or queue entry');
    if (!createdWorkItemId) return phase('reposPilot', ['validation Work Item created'], 'create the run-owned Work Item before the Repos/queue pilot');
    if (readiness.outcome !== 'passed') return phase('reposPilot', ['readiness phase passed'], 'resolve readiness before creating a validation branch or pull request');
    if (reposPolicy.outcome === 'failed') return phase('reposPilot', ['Repos/policy read phase did not fail'], 'resolve policy visibility before creating a validation branch or pull request');
    try {
      const pilot = await runLivePilot({
        runId,
        actor,
        candidateWorkItemId: createdWorkItemId,
        target,
        sourceHost,
        policyAdapter: policies,
        queue,
        workItems: boards,
        evidenceStore,
        ledger,
        clock,
        allowSourceBranchDelete,
      });
      pilotArtifacts = pilot.artifacts;
      return phase('reposPilot', [], pilot.nextAction, pilot.outcome, pilot.evidence);
    } catch (error) {
      return phase('reposPilot', [], safeFailure(error), 'failed');
    }
  })();

  const twoIdentity = await (async (): Promise<LivePhase> => {
    if (recovery) return phase('twoIdentity', ['normal live mode'], 'recovery mode does not create concurrent claims');
    if (!createdWorkItemId) return phase('twoIdentity', ['validation Work Item created'], 'create the run-owned Work Item before testing two identities');
    const secondActor = environment.AGENT_WORKSPACE_AZURE_SECOND_ACTOR;
    const secondPatEnvironment = environment.AGENT_WORKSPACE_AZURE_SECOND_PAT_ENV;
    if (!secondActor || !secondPatEnvironment || environment.AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_READY !== '1' || environment.AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_APPROVED !== '1' || environment.AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_VERIFIED !== '1') {
      return phase('twoIdentity', ['AGENT_WORKSPACE_AZURE_SECOND_ACTOR', 'AGENT_WORKSPACE_AZURE_SECOND_PAT_ENV', 'AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_READY=1', 'AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_APPROVED=1', 'AGENT_WORKSPACE_AZURE_SECOND_IDENTITY_VERIFIED=1'], 'provide a separately authenticated, company-approved second Azure identity and record an independent provider identity verification; one process credential is never presented as two identities');
    }
    if (!/^[A-Z][A-Z0-9_]*$/.test(secondPatEnvironment) || secondActor === actor || azureConfig.authentication.patFallback.mode !== 'company-approved') {
      return phase('twoIdentity', ['distinct approved second identity configuration'], 'use a distinct actor and an uppercase environment variable name for the second credential');
    }
    try {
      const secondCredential = await new EnvironmentPatSource(secondPatEnvironment).read();
      if (!secondCredential) return phase('twoIdentity', ['second credential source is populated'], 'populate only the approved second credential environment variable and rerun');
      if (auth.credential && secondCredential.hash() === auth.credential.hash()) return phase('twoIdentity', ['second credential differs from the primary credential'], 'provide a separately issued second identity credential; a duplicated secret is not a two-identity test');
      const secondAuth: AuthSelection = { source: 'pat-fallback', credential: secondCredential, detail: 'approved second identity' };
      const secondClient = new AzureHttpClient(new FetchHttpTransport(), () => secondAuth.credential, azureConfig.organizationUrl, '7.1', () => secondAuth.source);
      if (!await providerIdentityMatches(secondClient, secondActor)) return phase('twoIdentity', ['provider identity profile matches AGENT_WORKSPACE_AZURE_SECOND_ACTOR'], 'the second credential did not resolve to the independently approved provider identity', 'not-run');
      const firstClaims = new AzureClaimStore(boardsOptions);
      const secondClaims = new AzureClaimStore({ ...boardsOptions, client: secondClient });
      const acquiredAt = clock();
      const leaseExpiresAt = new Date(Date.parse(acquiredAt) + 60_000).toISOString();
      const raceSnapshot = await boards.read(createdWorkItemId);
      const firstCommand = {
        operationId: `${ledger.snapshot().validationRunId}:identity-a.acquire`,
        expectedRevision: raceSnapshot.revision,
        actor,
        requestedAt: acquiredAt,
        input: { workItemId: createdWorkItemId, claimToken: `${ledger.snapshot().validationRunId}:identity-a`, claimant: actor, runId: `${ledger.snapshot().validationRunId}:identity-a`, acquiredAt, leaseExpiresAt, kind: 'acquire' as const },
      };
      const secondCommand = {
        operationId: `${ledger.snapshot().validationRunId}:identity-b.acquire`,
        expectedRevision: raceSnapshot.revision,
        actor: secondActor,
        requestedAt: acquiredAt,
        input: { workItemId: createdWorkItemId, claimToken: `${ledger.snapshot().validationRunId}:identity-b`, claimant: secondActor, runId: `${ledger.snapshot().validationRunId}:identity-b`, acquiredAt, leaseExpiresAt, kind: 'acquire' as const },
      };
      const [first, second] = await Promise.all([firstClaims.acquire(firstCommand), secondClaims.acquire(secondCommand)]);
      const applied = [first, second].filter((result) => result.disposition === 'applied');
      const conflicts = [first, second].filter((result) => result.disposition === 'conflict');
      if (applied.length !== 1 || conflicts.length !== 1) return phase('twoIdentity', [], 'two-identity claim race did not produce exactly one winner and one conflict', 'failed');
      const winnerStore = first.disposition === 'applied' ? firstClaims : secondClaims;
      const winnerCommand = first.disposition === 'applied' ? firstCommand : secondCommand;
      const duplicate = await winnerStore.acquire(winnerCommand);
      if (duplicate.disposition !== 'duplicate') return phase('twoIdentity', [], 'the winning claim was not idempotent on redelivery', 'failed');
      const released = await winnerStore.release({ operationId: `${winnerCommand.operationId}:release`, expectedRevision: duplicate.revision, actor: winnerCommand.actor, requestedAt: clock(), input: { workItemId: createdWorkItemId, claimToken: winnerCommand.input.claimToken, reason: 'live validation cleanup' } });
      if (released.disposition !== 'applied') return phase('twoIdentity', [], 'the winning claim could not be released with its provider revision', 'failed');
      await ledger.recordProviderObservation('boards-roundtrip', released.revision);
      return phase('twoIdentity', [], 'retain redacted evidence of exactly one concurrent winner, one conflict, duplicate absorption, and release', 'passed', [`winner:${winnerCommand.actor}`, `loser:${first.disposition === 'conflict' ? actor : secondActor}`]);
    } catch (error) {
      return phase('twoIdentity', [], safeFailure(error), 'failed');
    }
  })();

  const cleanup = await (async (): Promise<LivePhase> => {
   if (recovery && recoveryPhase.outcome !== 'passed') return phase('cleanup', ['recovery phase passed'], 'do not mutate any provider artifact until recovery proves exact marker ownership', recoveryPhase.outcome === 'failed' ? 'failed' : 'blocked');
    const pilotEntries = ledger.snapshot().entries.filter((entry) => ['source-branch', 'pull-request', 'queue-entry', 'queue-lease', 'pull-request-complete', 'queue-finalize'].includes(entry.artifactKey));
    const pilotEvidence: string[] = [];
    if (pilotEntries.length > 0) {
      try {
        const pilotCleanup = await cleanupLivePilot({
          runId,
          actor,
          candidateWorkItemId: createdWorkItemId ?? 'recovered-candidate',
          target,
          sourceHost,
          policyAdapter: policies,
          queue,
          workItems: boards,
          evidenceStore,
          ledger,
          clock,
          allowSourceBranchDelete,
        }, pilotArtifacts);
        pilotEvidence.push(...pilotCleanup.evidence);
        if (pilotCleanup.outcome !== 'passed') return phase('cleanup', [], pilotCleanup.nextAction, pilotCleanup.outcome, pilotCleanup.evidence);
      } catch (error) {
        return phase('cleanup', [], safeFailure(error), 'failed', pilotEvidence);
      }
    }
    if (recovery && recoveredBoardsEntry?.cleanupOutcome === 'passed' && pilotEntries.length === 0) return phase('cleanup', [], 'cleanup was already recorded for the recovered Work Item; no provider mutation was needed', 'passed', recoveredBoardsEntry.providerRef ? [recoveredBoardsEntry.providerRef] : undefined);
    if (!createdWorkItemId) return phase('cleanup', ['a validation-created Work Item with a matching ledger intent'], 'there is no run-owned Work Item to clean up', 'not-run', pilotEvidence);
    try {
      const current = await boards.read(createdWorkItemId);
      const entry = ledger.snapshot().entries.find((candidate) => candidate.artifactKey === 'boards-roundtrip');
      if (!entry || entry.providerRef !== `work-item:${createdWorkItemId}`) {
        await ledger.markCleanup('boards-roundtrip', 'blocked', 'ledger provider reference does not exactly identify the cleanup target');
        return phase('cleanup', [], 'stop; the ledger does not prove that this Work Item belongs to the validation run', 'blocked', [`work-item:${createdWorkItemId}`]);
      }
      const description = String(current.value.item.description ?? '');
      if (!description.includes(entry.marker) || !description.includes(validationTargetFingerprint(target))) {
        await ledger.markCleanup('boards-roundtrip', 'blocked', 'Work Item marker or exact target fingerprint drifted');
        return phase('cleanup', [], 'stop; Work Item ownership marker or exact target fingerprint drifted', 'blocked', [`work-item:${createdWorkItemId}`, `revision:${current.revision}`]);
      }
      if (!entry.observedRevisionOrHead) {
        await ledger.markCleanup('boards-roundtrip', 'blocked', 'ledger has no observed Work Item revision after provider acceptance');
        return phase('cleanup', [], 'stop; a recorded provider revision is required before cleanup', 'blocked', [`work-item:${createdWorkItemId}`, `revision:${current.revision}`]);
      }
      if (current.revision !== entry.observedRevisionOrHead) {
        await ledger.markCleanup('boards-roundtrip', 'blocked', `Work Item revision drifted from ${entry.observedRevisionOrHead} to ${current.revision}`);
        return phase('cleanup', [], 'stop; Work Item revision drift requires manual recovery', 'blocked', [`work-item:${createdWorkItemId}`, `expected-revision:${entry.observedRevisionOrHead}`, `actual-revision:${current.revision}`]);
      }
      const retainedEntries = ledger.snapshot().entries.filter((candidate) => candidate.artifactKey === 'agent-checkpoint' || candidate.artifactKey.startsWith('run-evidence-'));
      for (const retained of retainedEntries) {
        if (!retained.providerRef || !retained.observedRevisionOrHead || !['provider-accepted', 'acknowledged', 'cleaned'].includes(retained.state)) {
          await ledger.markCleanup('boards-roundtrip', 'blocked', `${retained.artifactKey} has no provider-accepted immutable record`);
          return phase('cleanup', [], 'stop; retained checkpoint/evidence was not accepted by the provider', 'blocked', [retained.artifactKey]);
        }
        const retainedMatches = await scanProviderArtifacts(retained.marker, target);
        if (retainedMatches.length !== 1 || retainedMatches[0].providerRef !== retained.providerRef || retainedMatches[0].observedRevisionOrHead !== retained.observedRevisionOrHead) {
          await ledger.markCleanup('boards-roundtrip', 'blocked', `${retained.artifactKey} provider record is missing, ambiguous, or drifted`);
          return phase('cleanup', [], 'stop; retained checkpoint/evidence provider acceptance could not be re-proven', 'blocked', [retained.artifactKey]);
        }
      }
      const priorClose = ledger.snapshot().entries.find((candidate) => candidate.artifactKey === 'work-item-close');
      if (priorClose?.providerRef === `work-item:${createdWorkItemId}` && priorClose.observedRevisionOrHead === current.revision) {
        await ledger.markCleanup('work-item-close', 'passed', 'the immutable closure receipt and post-mutation revision are provider-visible');
        await ledger.markCleanup('boards-roundtrip', 'passed');
        for (const retained of retainedEntries) await ledger.markCleanup(retained.artifactKey, 'passed', 'the Work Item was already closed while its immutable provider record was retained');
        return phase('cleanup', [], 'the run-owned Work Item closure was recovered from its provider receipt; no duplicate close mutation was sent', 'passed', [...pilotEvidence, `work-item:${createdWorkItemId}`, `revision:${current.revision}`]);
      }
      if (priorClose && (priorClose.state === 'blocked' || priorClose.expectedRevisionOrHead !== current.revision)) {
        await ledger.markCleanup('boards-roundtrip', 'blocked', 'the existing Work Item closure intent no longer matches the provider revision');
        return phase('cleanup', [], 'stop; the prior Work Item closure intent requires recovery before any retry', 'blocked', [`work-item:${createdWorkItemId}`, `revision:${current.revision}`]);
      }
      const closeIntent = priorClose ?? await ledger.recordIntent({
          artifactKey: 'work-item-close',
          operation: 'work-item.close',
          expectedRevisionOrHead: current.revision,
          cleanupOperation: 'work-item.close',
          cleanupPrerequisites: ['the run-owned marker, exact target fingerprint, provider-accepted retained evidence, Work Item state, and revision were re-read immediately before closure'],
        });
      const result = await boards.projectState({
        operationId: `${ledger.snapshot().validationRunId}:work-item.close`,
        expectedRevision: current.revision,
        actor,
        requestedAt: clock(),
        input: { workItemId: createdWorkItemId, from: 'open', to: 'integrated' },
      });
      if (result.disposition !== 'applied') throw new Error('run-owned Work Item cleanup revision or state precondition failed');
      await ledger.recordProviderAcceptance(closeIntent.artifactKey, `work-item:${createdWorkItemId}`, result.revision);
      await ledger.recordProviderObservation('boards-roundtrip', result.revision);
      await ledger.acknowledge(closeIntent.artifactKey);
      await ledger.markCleanup(closeIntent.artifactKey, 'passed');
      await ledger.markCleanup('boards-roundtrip', 'passed');
      for (const retained of retainedEntries) await ledger.markCleanup(retained.artifactKey, 'passed', 'the Work Item was closed while its immutable provider record was retained');
      return phase('cleanup', [], 'all run-owned validation artifacts passed marker/revision/head checks; the Work Item was closed and the completed PR remains as redacted pilot evidence', 'passed', [...pilotEvidence, `work-item:${createdWorkItemId}`]);
    } catch (error) {
      await ledger.markCleanup('boards-roundtrip', 'failed', 'manual cleanup required; ownership or revision was not proven');
      return phase('cleanup', [], safeFailure(error), 'failed');
    }
  })();

  const phases = { readiness, boards: boardsPhase, reposPolicy, reposPilot, twoIdentity, cleanup, recovery: recoveryPhase };
  const executed = Object.values(phases).some((item) => item.outcome !== 'not-run');
  return {
    mode: 'live',
    evidence: executed ? 'executed' : 'not-run',
    recovery,
    gate,
    phases,
    nextAction: 'review each phase outcome and retain only redacted provider evidence; never treat offline or not-run evidence as live PASS',
  };
}

const result = await main();
process.stdout.write(JSON.stringify(result) + '\n');

test('gated live path never misreports missing prerequisites as PASS', () => {
  if (result.gate.outcome !== 'passed') {
    assert.equal(result.evidence, 'not-run');
    assert.ok(Object.values(result.phases).every((item) => item.outcome === 'not-run'));
    assert.ok(result.gate.missing.length > 0);
    return;
  }
  assert.ok(Object.values(result.phases).every((item) => item.outcome !== 'passed' || item.evidence !== undefined));
});
