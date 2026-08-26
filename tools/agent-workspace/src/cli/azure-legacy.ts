// Compatibility bridge for the original workspace commands.
//
// The command shell still exposes the feature-001 method names, but Azure
// state is always read and mutated through the provider-neutral ports. This
// keeps `claim`, `start`, `checkpoint`, `handoff`, `retry`, `status`, and the
// legacy integration path usable while the provider-neutral CLI is adopted.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { payloadHash } from '../domain/mutations.ts';
import { redactEvidence } from '../domain/redaction.ts';
import { evidencePath, readJson, writeJsonAtomic } from '../adapters/local/state-files.ts';
import { conflictError, WorkspaceError } from '../errors.ts';
import type {
  AgentCheckpoint,
  ClaimRecord,
  ClaimState,
  HandoffRecord,
  RunEvidence,
  WorkItem,
  WorkItemId,
  WorkItemState,
} from '../domain/types.ts';
import type {
  LegacyClaimStore,
  LegacyEvidenceStore,
  LegacySourceHostAdapter,
  LegacyWorkItemAdapter,
} from '../adapters/ports.ts';
import type { AzureDevOpsConfig } from '../config/provider.ts';
import { BUILTIN_PROCESS_PROFILES } from '../adapters/azure/process-mapping.ts';
import type { AzureWorkItemAdapter } from '../adapters/azure/boards.ts';
import type { AzureEvidenceStore } from '../adapters/azure/evidence.ts';
import type { AzureClaimStore } from '../adapters/azure/claims.ts';
import type { AzureSourceHostAdapter } from '../adapters/azure/repos.ts';

const execFileAsync = promisify(execFile);

export function azureStateMap(config: AzureDevOpsConfig): Partial<Record<WorkItemState, string>> {
  if (config.process.override) return { ...config.process.override };
  const builtin = BUILTIN_PROCESS_PROFILES[config.process.profile as keyof typeof BUILTIN_PROCESS_PROFILES];
  return builtin ? { ...builtin.states } : {};
}

export class AzureLegacyWorkItemAdapter implements LegacyWorkItemAdapter {
  private readonly boards: AzureWorkItemAdapter;
  private readonly evidence: LegacyEvidenceStore;

  constructor(boards: AzureWorkItemAdapter, evidence: LegacyEvidenceStore) {
    this.boards = boards;
    this.evidence = evidence;
  }

  async read(workItemId: WorkItemId): Promise<WorkItem> {
    return (await this.boards.read(workItemId)).value.item;
  }

  async appendEvidence(workItemId: WorkItemId, evidence: RunEvidence): Promise<void> {
    if (evidence.workItemId !== workItemId) throw conflictError('evidence Work Item does not match the requested Work Item');
    await this.evidence.persist(evidence);
  }

  async setState(workItemId: WorkItemId, state: WorkItemState): Promise<void> {
    const current = await this.boards.read(workItemId);
    const result = await this.boards.projectState({
      operationId: 'legacy:state:' + workItemId + ':' + state,
      expectedRevision: current.revision,
      actor: 'legacy-command-shell',
      requestedAt: new Date().toISOString(),
      input: {
        workItemId,
        from: await this.neutralState(current, workItemId),
        to: state,
      },
    });
    if (result.disposition === 'conflict') {
      throw new WorkspaceError('WORK_ITEM_STATE_CONFLICT', 'conflict', result.reason ?? 'Work Item state changed before projection');
    }
  }

  async listOpen(): Promise<WorkItem[]> {
    return (await this.boards.listOpen()).map((item) => item.value.item);
  }

  private async neutralState(_current: Awaited<ReturnType<AzureWorkItemAdapter['read']>>, workItemId: string): Promise<WorkItemState> {
    const raw = await this.boards.raw(workItemId);
    const providerState = String(raw.wire.fields['System.State'] ?? '');
    const candidates: WorkItemState[] = ['open', 'claimed', 'in-progress', 'ready-for-integration', 'integrated', 'blocked'];
    const map = (this.boards.options as { stateMap?: Partial<Record<WorkItemState, string>> }).stateMap ?? {};
    const found = candidates.find((candidate) => map[candidate] === providerState);
    if (found) return found;
    if (providerState === '') return 'open';
    throw new WorkspaceError('PROCESS_MAPPING_UNAVAILABLE', 'capability', 'Azure Work Item state is not covered by the selected process mapping');
  }
}

export class AzureLegacyClaimStore implements LegacyClaimStore {
  private readonly claims: AzureClaimStore;

  constructor(claims: AzureClaimStore) {
    this.claims = claims;
  }

  async acquire(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const current = await this.claims.active(claim.workItemId);
    const result = await this.claims.acquire({
      operationId: 'legacy:claim:' + claim.claimToken,
      expectedRevision: current.revision,
      actor: claim.claimant,
      requestedAt: claim.acquiredAt,
      input: claim,
    });
    return this.outcome(result.disposition, result.reason);
  }

  async renew(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const current = await this.claims.active(claim.workItemId);
    const result = await this.claims.renew({
      operationId: 'legacy:renew:' + claim.claimToken + ':' + claim.leaseExpiresAt,
      expectedRevision: current.revision,
      actor: claim.claimant,
      requestedAt: claim.acquiredAt,
      input: claim,
    });
    return this.outcome(result.disposition, result.reason);
  }

  async handoff(claim: ClaimRecord): Promise<{ winner: boolean; reason?: string }> {
    const current = await this.claims.active(claim.workItemId);
    if (!current.value) return { winner: false, reason: 'claim is not active' };
    const checkpoint: AgentCheckpoint = {
      checkpointId: 'handoff-' + claim.runId,
      runId: claim.runId,
      branch: '',
      commit: '',
      verification: [],
      unresolvedWork: [],
      nextAction: 'continue from the durable checkpoint',
      createdAt: claim.acquiredAt,
    };
    const input: HandoffRecord = {
      previousOwner: claim.previousOwner ?? current.value.claimant,
      replacementOwner: claim.claimant,
      checkpoint,
      unresolvedRisks: [],
      nextAction: checkpoint.nextAction,
      recordedAt: new Date().toISOString(),
    };
    const result = await this.claims.handoff({
      operationId: 'legacy:handoff:' + claim.runId + ':' + claim.claimant,
      expectedRevision: current.revision,
      actor: claim.previousOwner ?? current.value.claimant,
      requestedAt: input.recordedAt,
      input,
    });
    return this.outcome(result.disposition, result.reason);
  }

  async release(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const current = await this.claims.active(workItemId);
    if (!current.value || (claimToken && current.value.claimToken !== claimToken)) return;
    const result = await this.claims.release({
      operationId: 'legacy:release:' + current.value.claimToken,
      expectedRevision: current.revision,
      actor: current.value.claimant,
      requestedAt: new Date().toISOString(),
      input: { workItemId, claimToken: current.value.claimToken },
    });
    if (result.disposition === 'conflict') throw conflictError(result.reason ?? 'claim release was rejected');
  }

  async expire(workItemId: WorkItemId, claimToken?: string): Promise<void> {
    const current = await this.claims.active(workItemId);
    if (!current.value || (claimToken && current.value.claimToken !== claimToken)) return;
    const result = await this.claims.expire({
      operationId: 'legacy:expire:' + current.value.claimToken,
      expectedRevision: current.revision,
      actor: current.value.claimant,
      requestedAt: new Date().toISOString(),
      input: { workItemId, claimToken: current.value.claimToken },
    });
    if (result.disposition === 'conflict') throw conflictError(result.reason ?? 'claim expiry was rejected');
  }

  async active(workItemId: WorkItemId): Promise<ClaimState | undefined> {
    return (await this.claims.active(workItemId)).value;
  }

  async records(workItemId: WorkItemId): Promise<ClaimRecord[]> {
    const active = await this.active(workItemId);
    return active ? [{ ...active, kind: 'acquire' }] : [];
  }

  private outcome(disposition: 'applied' | 'duplicate' | 'conflict', reason?: string): { winner: boolean; reason?: string } {
    return disposition === 'conflict' ? { winner: false, reason } : { winner: true, reason };
  }
}

export class AzureLegacyEvidenceStore implements LegacyEvidenceStore {
  private readonly evidence: AzureEvidenceStore;
  private readonly boards: AzureWorkItemAdapter;
  private readonly cwd: string;

  constructor(evidence: AzureEvidenceStore, boards: AzureWorkItemAdapter, cwd: string) {
    this.evidence = evidence;
    this.boards = boards;
    this.cwd = cwd;
  }

  async persist(evidence: RunEvidence): Promise<void> {
    const current = await this.boards.read(evidence.workItemId);
    const operationId = 'legacy:evidence:' + evidence.runId + ':' + payloadHash(evidence);
    const result = await this.evidence.publish({
      operationId,
      expectedRevision: current.revision,
      actor: evidence.owner,
      requestedAt: evidence.timestamps.at(-1) ?? new Date().toISOString(),
      input: evidence,
    });
    if (result.disposition === 'conflict') throw conflictError(result.reason ?? 'evidence publication was rejected');
    await writeJsonAtomic(evidencePath(evidence.runId, this.cwd), redactEvidence(evidence));
  }

  async read(runId: string): Promise<RunEvidence> {
    try {
      const provider = await this.evidence.read(runId);
      await writeJsonAtomic(evidencePath(runId, this.cwd), provider);
      return provider;
    } catch (providerError) {
      const local = await readJson<RunEvidence>(evidencePath(runId, this.cwd));
      if (local) return local;
      throw providerError;
    }
  }

  async list(workItemId: WorkItemId): Promise<RunEvidence[]> {
    return this.evidence.list(workItemId);
  }
}

export class AzureLegacySourceHostAdapter implements LegacySourceHostAdapter {
  private readonly sourceHost: AzureSourceHostAdapter;
  private readonly cwd: string;
  private readonly verificationCommands: string[];

  constructor(sourceHost: AzureSourceHostAdapter, cwd: string, verificationCommands: string[]) {
    this.sourceHost = sourceHost;
    this.cwd = cwd;
    this.verificationCommands = verificationCommands;
  }

  async createBranch(name: string, from: string): Promise<void> {
    await execFileAsync('git', ['fetch', 'origin', from], { cwd: this.cwd, encoding: 'utf8' });
    await execFileAsync('git', ['checkout', '-b', name, 'origin/' + from], { cwd: this.cwd, encoding: 'utf8' });
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath?: string): Promise<void> {
    await this.sourceHost.pushCheckpoint(checkpoint, worktreePath ?? this.cwd);
  }

  async openPullRequest(workItemId: WorkItemId, branch: string, integrationTarget = 'refs/heads/main'): Promise<string> {
    const ref = await this.sourceHost.ensurePullRequest({
      repositoryId: this.repositoryId(),
      sourceRef: toHeadRef(branch),
      targetRef: toHeadRef(integrationTarget),
      title: 'Integration: work item ' + workItemId,
      description: 'Checkpointed change incorporated through the provider-canonical integration queue.',
      workItemId,
    });
    return ref.url;
  }

  async requiredChecks(_integrationTarget: string): Promise<string[]> {
    return [...this.verificationCommands];
  }

  async recordCheckpoint(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void> {
    await this.sourceHost.recordCheckpoint(workItemId, checkpoint);
  }

  async readCheckpoints(workItemId: WorkItemId): Promise<AgentCheckpoint[]> {
    return this.sourceHost.readCheckpoints(workItemId);
  }

  async remoteCommit(checkpoint: AgentCheckpoint): Promise<boolean> {
    return this.sourceHost.remoteCommit(checkpoint);
  }

  async mergePullRequest(branch: string, integrationTarget: string): Promise<void> {
    const ref = await this.sourceHost.ensurePullRequest({
      repositoryId: this.repositoryId(),
      sourceRef: toHeadRef(branch),
      targetRef: toHeadRef(integrationTarget),
      title: 'Integration: ' + branch,
    });
    const targetCommit = await this.sourceHost.targetHead(toHeadRef(integrationTarget));
    await this.sourceHost.completePullRequest(ref, targetCommit);
  }

  private repositoryId(): string {
    return this.sourceHost.repositoryId;
  }
}

export function createAzureLegacyAdapters(options: {
  boards: AzureWorkItemAdapter;
  claims: AzureClaimStore;
  evidence: AzureEvidenceStore;
  sourceHost: AzureSourceHostAdapter;
  cwd: string;
  verificationCommands: string[];
}): {
  claims: LegacyClaimStore;
  workItems: LegacyWorkItemAdapter;
  evidence: LegacyEvidenceStore;
  sourceHost: LegacySourceHostAdapter;
} {
  const evidence = new AzureLegacyEvidenceStore(options.evidence, options.boards, options.cwd);
  return {
    claims: new AzureLegacyClaimStore(options.claims),
    workItems: new AzureLegacyWorkItemAdapter(options.boards, evidence),
    evidence,
    sourceHost: new AzureLegacySourceHostAdapter(options.sourceHost, options.cwd, options.verificationCommands),
  };
}

function toHeadRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : 'refs/heads/' + ref;
}
