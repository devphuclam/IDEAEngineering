// Revised-port in-memory fake adapters for unit and contract tests
// (contracts/provider-ports.md). Deterministic clock, ID, HTTP, Git, token,
// revision, and policy seams. These fakes implement the NEW ports; the
// feature-001 fakes in index.ts remain for the legacy suite.

import type {
  AcquireIntegration,
  AdoptionPlan,
  AdoptionRequest,
  AgentCheckpoint,
  ClaimRelease,
  ClaimState,
  ClaimRecord,
  EnqueueCandidate,
  EvidencePublicationRef,
  FinalizeCandidate,
  HandoffRecord,
  IntegrationLease,
  IntegrationTarget,
  MutationCommand,
  MutationResult,
  OperationId,
  OperationReceipt,
  PendingPublication,
  PolicyInventory,
  PolicySnapshot,
  PreparationApplyResult,
  PreparationPlan,
  ProviderRevision,
  PublicationResult,
  PullRequestCompletion,
  PullRequestRef,
  PullRequestRequest,
  QueueCompletionSummary,
  QueueDecision,
  QueueManifest,
  ReadinessReport,
  RemoteCheckpoint,
  RemoteRoleSnapshot,
  RenewIntegrationLease,
  ReleaseIntegrationLease,
  Revisioned,
  RevisionedWorkItem,
  RunEvidence,
  RunId,
  RuntimeReadinessReport,
  WorkItem,
  WorkItemId,
  WorkItemState,
  WorkItemStateTransition,
} from '../../domain/types.ts';
import type { EvidenceStore } from '../ports.ts';
import { canonicalJson, payloadHash } from '../../domain/mutations.ts';
import { redactEvidence } from '../../domain/redaction.ts';
import type {
  CanonicalQueueStore,
  ClaimStore,
  PolicyAdapter,
  ProviderPreparationAdapter,
  RuntimeReadinessAdapter,
  SourceHostAdapter,
  WorkItemAdapter,
} from '../ports.ts';
import type { HttpRequest, HttpResponse, HttpTransport } from '../azure/http.ts';

export class DeterministicClock {
  private current = Date.parse('2026-08-14T00:00:00.000Z');
  advance(ms: number): void {
    this.current += ms;
  }
  now(): string {
    return new Date(this.current).toISOString();
  }
}

let idCounter = 0;
export function nextId(prefix = 'id'): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}

// ---- Revisioned Work Item adapter ----

export class FakeWorkItemAdapter implements WorkItemAdapter {
  readonly items = new Map<WorkItemId, WorkItem>();
  readonly revisions = new Map<WorkItemId, ProviderRevision>();
  readonly coordinationBlocks = new Map<WorkItemId, Record<string, unknown>>();
  readonly receipts: OperationReceipt[] = [];
  clock: () => string = () => new Date().toISOString();

  readonly revisionOf?: (item: WorkItem) => ProviderRevision;

  constructor(revisionOf?: (item: WorkItem) => ProviderRevision) {
    this.revisionOf = revisionOf;
  }

  async read(workItemId: WorkItemId): Promise<Revisioned<RevisionedWorkItem>> {
    const item = this.items.get(workItemId);
    if (!item) throw new Error(`work item ${workItemId} not found`);
    const revision = this.revisionOf?.(item) ?? this.revisions.get(workItemId) ?? 'rev-1';
    return {
      value: {
        item,
        coordination: {
          schema: 'agent-workspace/coordination-state',
          version: 1,
          workItemId,
          claim: null,
          run: null,
          lastAppliedOperation: null,
          pendingPublication: null,
        },
        changeScope: {
          schema: 'agent-workspace/change-scope',
          version: 1,
          paths: item.changeScope.paths,
          semanticSeams: item.changeScope.semanticSeams,
          prerequisites: item.changeScope.prerequisites,
          integrationTarget: item.changeScope.integrationTarget,
        },
      },
      revision,
      observedAt: this.clock(),
    };
  }

  async listOpen(): Promise<Array<Revisioned<RevisionedWorkItem>>> {
    return Promise.all([...this.items.keys()].map((id) => this.read(id)));
  }

  async projectState(command: MutationCommand<WorkItemStateTransition>): Promise<MutationResult<WorkItemState>> {
    const current = await this.read(command.input.workItemId);
    if (current.revision !== command.expectedRevision) {
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision };
    }
    const nextRevision = bumpRevision(current.revision);
    this.revisions.set(command.input.workItemId, nextRevision);
    const receipt: OperationReceipt = {
      operationId: command.operationId,
      kind: 'projectState',
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome: 'applied',
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: command.requestedAt,
      workItemId: command.input.workItemId,
      references: [],
    };
    this.receipts.push(receipt);
    return { operationId: command.operationId, disposition: 'applied', revision: nextRevision, value: command.input.to };
  }
}

function bumpRevision(revision: ProviderRevision): ProviderRevision {
  const match = revision.match(/^rev-(\d+)$/);
  return match ? `rev-${Number(match[1]) + 1}` : `rev-2`;
}

// ---- Claim store ----

export class FakeClaimStore implements ClaimStore {
  readonly recordsByItem = new Map<WorkItemId, ClaimRecord[]>();
  readonly runToWorkItem = new Map<RunId, WorkItemId>();
  readonly receipts: OperationReceipt[] = [];
  readonly serialized = new Map<string, Promise<unknown>>();
  clock: () => string = () => '2026-08-14T00:00:00.000Z';

  private list(workItemId: WorkItemId): ClaimRecord[] {
    let list = this.recordsByItem.get(workItemId);
    if (!list) {
      list = [];
      this.recordsByItem.set(workItemId, list);
    }
    return list;
  }

  private revisionOf(workItemId: WorkItemId): ProviderRevision {
    return `rev-${this.list(workItemId).length}`;
  }

  private activeState(records: ClaimRecord[], now: string): ClaimState | undefined {
    const valid = records.filter(
      (record) => record.kind !== 'release' && record.kind !== 'expire' && Date.parse(record.leaseExpiresAt) > Date.parse(now),
    );
    const winner = valid[0];
    return winner
      ? {
          workItemId: winner.workItemId,
          claimToken: winner.claimToken,
          claimant: winner.claimant,
          runId: winner.runId,
          acquiredAt: winner.acquiredAt,
          leaseExpiresAt: winner.leaseExpiresAt,
        }
      : undefined;
  }

  private keyed<T>(key: string, task: () => Promise<T>): Promise<T> {
    const previous = this.serialized.get(key) ?? Promise.resolve();
    const next = previous.then(task, task);
    this.serialized.set(key, next.catch(() => undefined));
    return next;
  }

  async acquire(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    return this.keyed(command.input.workItemId, async () => {
      const records = this.list(command.input.workItemId);
      if (records.some((record) => record.claimToken === command.input.claimToken)) {
        return this.receiptResult(command, 'duplicate', 'claim already recorded');
      }
      const active = this.activeState(records, this.clock());
      if (active) {
        return this.receiptResult(command, 'conflict', `work item already claimed by ${active.claimant}`);
      }
      records.push({ ...command.input });
      this.runToWorkItem.set(command.input.runId, command.input.workItemId);
      this.recordReceipt(command, 'acquire');
      return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(command.input.workItemId), value: this.activeState(records, this.clock()) };
    });
  }

  async renew(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    const records = this.list(command.input.workItemId);
    const active = this.activeState(records, this.clock());
    if (!active || active.claimToken !== command.input.claimToken || active.claimant !== command.input.claimant) {
      return this.receiptResult(command, 'conflict', 'claim is not owned by this operation');
    }
    records.push({ ...command.input });
    this.recordReceipt(command, 'renew');
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(command.input.workItemId), value: this.activeState(records, this.clock()) };
  }

  async handoff(command: MutationCommand<HandoffRecord>): Promise<MutationResult<ClaimState>> {
    const workItemId = this.runToWorkItem.get(command.input.checkpoint.runId);
    if (!workItemId) {
      return this.receiptResult(command, 'conflict', 'run has no known work item');
    }
    const records = this.list(workItemId);
    const active = this.activeState(records, this.clock());
    if (!active || active.claimant !== command.input.previousOwner) {
      return this.receiptResult(command, 'conflict', 'active claim is not owned by the previous owner');
    }
    records.push({
      workItemId,
      claimToken: active.claimToken,
      claimant: command.input.replacementOwner,
      runId: active.runId,
      acquiredAt: command.input.recordedAt,
      leaseExpiresAt: active.leaseExpiresAt,
      kind: 'handoff',
      previousOwner: command.input.previousOwner,
    });
    this.recordReceipt(command, 'handoff');
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(workItemId), value: this.activeState(records, this.clock()) };
  }

  async release(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    const records = this.list(command.input.workItemId);
    const active = this.activeState(records, this.clock());
    if (!active || active.claimToken !== command.input.claimToken) {
      return this.receiptResult(command, 'conflict', 'no active claim for this token');
    }
    records.push({ ...active, kind: 'release' });
    this.recordReceipt(command, 'release');
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(command.input.workItemId), value: undefined };
  }

  async expire(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    const records = this.list(command.input.workItemId);
    const active = this.activeState(records, this.clock());
    if (!active || active.claimToken !== command.input.claimToken) {
      return this.receiptResult(command, 'conflict', 'no active claim for this token');
    }
    records.push({ ...active, kind: 'expire' });
    this.recordReceipt(command, 'expire');
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(command.input.workItemId), value: undefined };
  }

  async active(workItemId: WorkItemId): Promise<Revisioned<ClaimState | undefined>> {
    return { value: this.activeState(this.list(workItemId), this.clock()), revision: this.revisionOf(workItemId), observedAt: this.clock() };
  }

  async records(workItemId: WorkItemId, operationId?: OperationId): Promise<OperationReceipt[]> {
    void workItemId;
    return operationId ? this.receipts.filter((receipt) => receipt.operationId === operationId) : [...this.receipts];
  }

  async reconcilePending(workItemId: WorkItemId): Promise<PublicationResult> {
    void workItemId;
    return { operationId: 'none', published: true };
  }

  private receiptResult<T>(command: MutationCommand<unknown>, disposition: 'duplicate' | 'conflict', reason: string): MutationResult<T> {
    return { operationId: command.operationId, disposition, revision: 'rev-0', reason };
  }

  private recordReceipt(command: MutationCommand<unknown>, kind: string): void {
    this.receipts.push({
      operationId: command.operationId,
      kind,
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome: 'applied',
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      references: [],
    });
  }
}

// ---- Evidence store ----

export class FakeEvidenceStore implements EvidenceStore {
  readonly evidence = new Map<RunId, RunEvidence[]>();
  readonly receipts: OperationReceipt[] = [];
  readonly publications: PublicationResult[] = [];
  readonly publicationRefs: EvidencePublicationRef[] = [];
  clock: () => string = () => new Date().toISOString();

  async reconcilePending(workItemId: WorkItemId): Promise<PublicationResult> {
    void workItemId;
    return { operationId: 'none', published: true };
  }

  async publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>> {
    const priorReceipt = this.receipts.find((receipt) => receipt.operationId === command.operationId);
    if (priorReceipt) {
      if (priorReceipt.payloadHash !== payloadHash(command.input)) {
        return { operationId: command.operationId, disposition: 'conflict', revision: 'rev-' + this.publicationRefs.length, reason: 'operation ID payload hash mismatch' };
      }
      const prior = this.publicationRefs.find((publication) => publication.operationId === command.operationId);
      return { operationId: command.operationId, disposition: 'duplicate', revision: 'rev-' + this.publicationRefs.length, receiptRef: prior?.providerRef, value: prior?.evidence };
    }
    const redacted = redactEvidence(command.input);
    const entries = this.evidence.get(redacted.runId) ?? [];
    entries.push(redacted);
    this.evidence.set(redacted.runId, entries);
    this.receipts.push({
      operationId: command.operationId,
      kind: 'evidence',
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome: 'applied',
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      workItemId: redacted.workItemId,
      references: [],
    });
    const providerRef = `comment:${this.publicationRefs.length + 1}`;
    this.publications.push({ operationId: command.operationId, published: true, receiptRef: providerRef });
    this.publicationRefs.push({
      operationId: command.operationId,
      workItemId: redacted.workItemId,
      runId: redacted.runId,
      providerRef,
      observedRevisionOrHead: `${providerRef}:version:1`,
      evidence: redacted,
    });
    return { operationId: command.operationId, disposition: 'applied', revision: 'rev-' + this.publicationRefs.length, receiptRef: providerRef, value: redacted };
  }

  async read(runId: RunId): Promise<RunEvidence> {
    const record = this.evidence.get(runId)?.at(-1);
    if (!record) throw new Error(`no evidence for run ${runId}`);
    return record;
  }

  async list(workItemId: WorkItemId): Promise<RunEvidence[]> {
    return [...this.evidence.values()].flat().filter((record) => record.workItemId === workItemId);
  }

  async findPublications(workItemId: WorkItemId, providerMarker: string): Promise<EvidencePublicationRef[]> {
    return this.publicationRefs
      .filter((publication) => publication.workItemId === workItemId && publication.evidence.providerMarker === providerMarker)
      .map((publication) => structuredClone(publication));
  }
}

// ---- Canonical queue store ----

export class FakeCanonicalQueueStore implements CanonicalQueueStore {
  readonly manifests = new Map<string, QueueManifest>();
  readonly completions = new Map<string, QueueCompletionSummary[]>();
  readonly receipts: OperationReceipt[] = [];
  readonly serialized = new Map<string, Promise<unknown>>();
  readonly target: IntegrationTarget;
  clock: () => string = () => new Date().toISOString();

  constructor(target: IntegrationTarget) {
    this.target = target;
  }

  private keyOf(target: IntegrationTarget): string {
    return `${target.repositoryId}/${target.targetRef}`;
  }

  private manifest(): QueueManifest {
    const key = this.keyOf(this.target);
    let manifest = this.manifests.get(key);
    if (!manifest) {
      manifest = {
        schema: 'agent-workspace/queue-manifest',
        version: 1,
        queueKey: `fake-${key}`,
        organizationUrl: 'fake',
        projectId: 'fake',
        repositoryId: this.target.repositoryId,
        targetRef: this.target.targetRef,
        nextEnqueueSequence: 1,
        entries: [],
        lease: null,
        lastOperation: null,
        pendingPublication: null,
      };
      this.manifests.set(key, manifest);
    }
    return manifest;
  }

  private revisionOf(): ProviderRevision {
    const manifest = this.manifest();
    return `rev-${manifest.entries.length + (manifest.lease ? 1 : 0)}`;
  }

private readSnapshot(): Revisioned<QueueManifest> {
      return { value: this.manifest(), revision: this.revisionOf(), observedAt: this.clock() };
    }

    private staleConflict<T>(command: MutationCommand<unknown>): MutationResult<T> | undefined {
      const manifest = this.manifest();
      const fresh =
        manifest.entries.length === 0 &&
        manifest.lease === null &&
        manifest.lastOperation === null &&
        manifest.pendingPublication === null;
      if (!fresh && command.expectedRevision !== this.revisionOf()) {
        return {
          operationId: command.operationId,
          disposition: 'conflict',
          revision: this.revisionOf(),
          reason: 'stale expected revision',
        };
      }
      return undefined;
    }

  async read(target: IntegrationTarget): Promise<Revisioned<QueueManifest>> {
    if (target.repositoryId !== this.target.repositoryId || target.targetRef !== this.target.targetRef) {
      throw new Error('queue store is bound to a different integration target');
    }
    return this.readSnapshot();
  }

async enqueue(command: MutationCommand<EnqueueCandidate>): Promise<MutationResult<QueueManifest>> {
      return this.keyed(command.operationId, async () => {
        const manifest = this.manifest();
        if (manifest.lastOperation?.operationId === command.operationId) {
          return { operationId: command.operationId, disposition: 'duplicate', revision: this.revisionOf(), reason: 'operation already applied' };
        }
        const stale = this.staleConflict<QueueManifest>(command);
        if (stale) return stale;
        const existing = manifest.entries.find(
        (entry) => entry.candidateWorkItemId === command.input.candidateWorkItemId && entry.runId === command.input.runId,
      );
      if (existing) {
        return { operationId: command.operationId, disposition: 'duplicate', revision: this.revisionOf(), reason: 'candidate tuple already queued' };
      }
      manifest.entries.push({
        sequence: manifest.nextEnqueueSequence,
        candidateWorkItemId: command.input.candidateWorkItemId,
        runId: command.input.runId,
        state: 'queued',
        enqueuedAt: command.requestedAt,
        dependencies: [...command.input.dependencies],
        decisions: [...command.input.decisions],
      });
      manifest.nextEnqueueSequence += 1;
      manifest.lastOperation = { operationId: command.operationId, kind: 'enqueue', outcome: 'applied', at: command.requestedAt };
      this.recordReceipt(command, 'enqueue');
      return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: manifest };
    });
  }

async recordDecision(command: MutationCommand<QueueDecision>): Promise<MutationResult<QueueManifest>> {
      const stale = this.staleConflict<QueueManifest>(command);
      if (stale) return stale;
      const manifest = this.manifest();
    const entry = manifest.entries.find((candidate) => candidate.sequence === command.input.entrySequence);
    if (!entry) return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'entry no longer active' };
    if (entry.decisions.some((decision) => decision.runId === command.input.decision.runId)) {
      return { operationId: command.operationId, disposition: 'duplicate', revision: this.revisionOf(), reason: 'decision already recorded' };
    }
    entry.decisions.push(command.input.decision);
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: manifest };
  }

async acquireNext(command: MutationCommand<AcquireIntegration>): Promise<MutationResult<IntegrationLease>> {
      const stale = this.staleConflict<IntegrationLease>(command);
      if (stale) return stale;
      const manifest = this.manifest();
    if (manifest.lease && Date.parse(manifest.lease.expiresAt) > Date.parse(this.clock())) {
      return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'another integration lease is active' };
    }
    const candidate = manifest.entries.filter((entry) => entry.state === 'queued').sort((a, b) => a.sequence - b.sequence)[0];
    if (!candidate) return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'no eligible queue entry' };
    const acquiredAt = this.clock();
    const lease: IntegrationLease = {
      operationId: command.operationId,
      entrySequence: candidate.sequence,
      candidateWorkItemId: candidate.candidateWorkItemId,
      runId: candidate.runId,
      acquiredAt,
      expiresAt: new Date(Date.parse(acquiredAt) + (command.input.leaseSeconds ?? 300) * 1000).toISOString(),
      targetCommit: command.input.targetCommit,
    };
    candidate.state = 'preparing';
    manifest.lease = lease;
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: lease };
  }

async renewLease(command: MutationCommand<RenewIntegrationLease>): Promise<MutationResult<IntegrationLease>> {
      const stale = this.staleConflict<IntegrationLease>(command);
      if (stale) return stale;
      const manifest = this.manifest();
    if (!manifest.lease || manifest.lease.operationId !== command.operationId) {
      return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'lease is not owned by this operation' };
    }
    manifest.lease = { ...manifest.lease, expiresAt: new Date(Date.parse(this.clock()) + (command.input.leaseSeconds ?? 300) * 1000).toISOString() };
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: manifest.lease };
  }

async releaseLease(command: MutationCommand<ReleaseIntegrationLease>): Promise<MutationResult<QueueManifest>> {
      const stale = this.staleConflict<QueueManifest>(command);
      if (stale) return stale;
      const manifest = this.manifest();
    if (!manifest.lease || manifest.lease.operationId !== command.operationId) {
      return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'lease is not owned by this operation' };
    }
    const entry = manifest.entries.find((candidate) => candidate.sequence === command.input.entrySequence);
    if (entry && entry.state === 'preparing') entry.state = command.input.reason === 'drift' || command.input.reason === 'policy' ? 'blocked' : 'queued';
    manifest.lease = null;
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: manifest };
  }

async finalize(command: MutationCommand<FinalizeCandidate>): Promise<MutationResult<QueueManifest>> {
      const stale = this.staleConflict<QueueManifest>(command);
      if (stale) return stale;
    const manifest = this.manifest();
    const index = manifest.entries.findIndex((entry) => entry.sequence === command.input.entrySequence);
    if (index < 0) return { operationId: command.operationId, disposition: 'conflict', revision: this.revisionOf(), reason: 'entry no longer active' };
    const completedEntry = manifest.entries[index]!;
    manifest.entries.splice(index, 1);
    manifest.lease = null;
    const key = this.keyOf(this.target);
    const completions = this.completions.get(key) ?? [];
    completions.push({
      operationId: command.operationId,
      sequence: command.input.entrySequence,
      candidateWorkItemId: completedEntry.candidateWorkItemId,
      runId: completedEntry.runId,
      outcome: command.input.outcome,
      at: this.clock(),
      pullRequestRef: command.input.pullRequestRef,
      evidenceRef: command.input.evidenceRef,
      blocker: command.input.blocker,
    });
    this.completions.set(key, completions);
    return { operationId: command.operationId, disposition: 'applied', revision: this.revisionOf(), value: manifest };
  }

  async reconcilePending(target: IntegrationTarget): Promise<PublicationResult> {
    void target;
    return { operationId: 'none', published: true };
  }

  async completionHistory(target: IntegrationTarget): Promise<QueueCompletionSummary[]> {
    return [...(this.completions.get(this.keyOf(target)) ?? [])];
  }

  private keyed<T>(key: string, task: () => Promise<T>): Promise<T> {
    const previous = this.serialized.get(key) ?? Promise.resolve();
    const next = previous.then(task, task);
    this.serialized.set(key, next.catch(() => undefined));
    return next;
  }

  private recordReceipt(command: MutationCommand<unknown>, kind: string): void {
    this.receipts.push({
      operationId: command.operationId,
      kind,
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome: 'applied',
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      references: [],
    });
  }
}

// ---- Source host ----

export class FakeSourceHostAdapter implements SourceHostAdapter {
  readonly checkpoints: RemoteCheckpoint[] = [];
  readonly checkpointRecords = new Map<WorkItemId, AgentCheckpoint[]>();
  readonly pullRequests: PullRequestRef[] = [];
  readonly roles: RemoteRoleSnapshot = { roles: [{ name: 'origin', push: true, fetch: true, url: 'https://fake.invalid/origin' }] };
  targetHeadValue = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  readonly adoptionPlans: AdoptionPlan[] = [];
  clock: () => string = () => new Date().toISOString();

  async targetHead(targetRef: string): Promise<string> {
    void targetRef;
    return this.targetHeadValue;
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath: string): Promise<RemoteCheckpoint> {
    void worktreePath;
    const remote: RemoteCheckpoint = { branch: checkpoint.branch, commit: checkpoint.commit, pushUrl: 'https://fake.invalid/origin' };
    this.checkpoints.push(remote);
    return remote;
  }

  async recordCheckpoint(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void> {
    const records = this.checkpointRecords.get(workItemId) ?? [];
    if (!records.some((record) => record.checkpointId === checkpoint.checkpointId)) records.push(structuredClone(checkpoint));
    this.checkpointRecords.set(workItemId, records);
  }

  async readCheckpoints(workItemId: WorkItemId): Promise<AgentCheckpoint[]> {
    return (this.checkpointRecords.get(workItemId) ?? []).map((checkpoint) => structuredClone(checkpoint));
  }

  async ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef> {
    const existing = this.pullRequests.find(
      (ref) => ref.sourceRef === request.sourceRef
        && ref.targetRef === request.targetRef
        && ref.repositoryId === request.repositoryId
        && (request.workItemId === undefined || ref.workItemIds?.includes(request.workItemId)),
    );
    if (existing) return existing;
    const ref: PullRequestRef = {
      repositoryId: request.repositoryId,
      sourceRef: request.sourceRef,
      targetRef: request.targetRef,
      pullRequestId: nextId('pr'),
      url: `https://fake.invalid/pull/${this.pullRequests.length + 1}`,
      sourceCommit: this.checkpoints.find((checkpoint) => toHeadRef(checkpoint.branch) === request.sourceRef)?.commit ?? this.targetHeadValue,
      targetCommit: this.targetHeadValue,
      workItemIds: request.workItemId ? [request.workItemId] : [],
      status: 'active',
      mergeStatus: 'succeeded',
    };
    this.pullRequests.push(ref);
    return ref;
  }

  async readPullRequest(ref: PullRequestRef): Promise<PullRequestRef> {
    const existing = this.pullRequests.find((candidate) => candidate.pullRequestId === ref.pullRequestId);
    if (!existing) throw new Error(`pull request ${ref.pullRequestId} not found`);
    return existing;
  }

  async completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion> {
    if (expectedTargetCommit !== this.targetHeadValue) {
      throw new Error('target commit no longer matches the evaluated attempt');
    }
    const mergeCommit = `merged-${ref.pullRequestId}`;
    const completed = { ...ref, status: 'completed', mergeStatus: 'succeeded', mergeCommit, targetCommit: expectedTargetCommit };
    const index = this.pullRequests.findIndex((candidate) => candidate.pullRequestId === ref.pullRequestId);
    if (index >= 0) this.pullRequests[index] = completed;
    this.targetHeadValue = mergeCommit;
    return { pullRequestRef: completed, merged: true, targetCommit: mergeCommit };
  }

  async remoteRoles(): Promise<RemoteRoleSnapshot> {
    return this.roles;
  }

  async previewAdoption(request: AdoptionRequest): Promise<AdoptionPlan> {
    const actions = [
      { kind: 'remote-role', detail: `make ${request.originRoleName} the sole push remote` },
      { kind: 'remote-role', detail: `make ${request.templateUpstreamRoleName} fetch-only` },
    ];
    const plan: AdoptionPlan = { request, actions, digest: payloadHash(actions) };
    this.adoptionPlans.push(plan);
    return plan;
  }

  async applyAdoption(command: MutationCommand<AdoptionPlan>): Promise<MutationResult<RemoteRoleSnapshot>> {
    this.roles.roles = [
      { name: command.input.request.originRoleName, push: true, fetch: true, url: 'https://fake.invalid/origin' },
      { name: command.input.request.templateUpstreamRoleName, push: false, fetch: true, url: command.input.request.templateUpstreamUrl },
    ];
    return { operationId: command.operationId, disposition: 'applied', revision: 'rev-1', value: this.roles };
  }
}

// ---- Policy adapter ----

export class FakePolicyAdapter implements PolicyAdapter {
  inventory: PolicyInventory = {
    target: { repositoryId: 'fake', targetRef: 'refs/heads/main' },
    observedAt: '2026-08-14T00:00:00.000Z',
    sources: [{ name: 'fake-provider-policy', outcome: 'read' }],
    effectiveBlocking: [],
  };
  evaluations: PolicySnapshot['evaluations'] = [];

  async inspectTarget(target: IntegrationTarget): Promise<PolicyInventory> {
    return { ...this.inventory, target };
  }

async evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot> {
      return {
        target: { repositoryId: ref.repositoryId, targetRef: ref.targetRef },
      pullRequestRef: ref,
      headCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      observedAt: this.clock(),
      inventory: this.inventory,
      evaluations: this.evaluations,
      aggregate: 'passed',
    };
  }

  clock: () => string = () => new Date().toISOString();
}

// ---- Preparation and runtime ----

export class FakePreparationAdapter implements ProviderPreparationAdapter {
  plans: PreparationPlan[] = [];

  async readiness(): Promise<ReadinessReport> {
    return {
      provider: 'azure-devops',
      observedAt: this.clock(),
      configuration: { outcome: 'passed' },
      runtime: { outcome: 'not-selected' },
      authentication: { outcome: 'passed' },
      target: { outcome: 'passed' },
      permissions: [],
      remoteRoles: { roles: [] },
      policyVisibility: { inventorySources: [], effectiveBlockingCount: 0 },
      queue: { outcome: 'passed' },
      network: { outcome: 'passed' },
    };
  }

  async preview(): Promise<PreparationPlan> {
    const plan: PreparationPlan = {
      applicability: 'applicable',
      digest: payloadHash({ queueOnly: true }),
      actions: [{ kind: 'queue-work-item', detail: 'create or reuse one queue coordination Work Item' }],
    };
    this.plans.push(plan);
    return plan;
  }

  async apply(command: MutationCommand<PreparationPlan>): Promise<PreparationApplyResult> {
    return { operationId: command.operationId, disposition: 'applied', revision: 'rev-1', value: { queueWorkItemId: '1001', queueKey: 'fake-queue', appliedAt: this.clock() } };
  }

  clock: () => string = () => new Date().toISOString();
}

export class FakeRuntimeReadinessAdapter implements RuntimeReadinessAdapter {
  report: RuntimeReadinessReport = { state: 'not-selected', detail: 'runtimeProfile is null', checks: [] };

  async inspect(): Promise<RuntimeReadinessReport> {
    return this.report;
  }
}

// ---- Fake Azure HTTP transport (production-network denied) ----

export class FakeHttpTransport implements HttpTransport {
  readonly requests: HttpRequest[] = [];
  responses: Array<HttpResponse | Error> = [];
  handler?: (request: HttpRequest) => Promise<HttpResponse>;

  constructor(handler?: (request: HttpRequest) => Promise<HttpResponse>) {
    this.handler = handler;
  }

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request);
    if (this.handler) return this.handler(request);
    const next = this.responses.shift();
    if (next instanceof Error) throw next;
    if (!next) throw new Error('fake transport has no queued response');
    return next;
  }

  jsonResponse(status: number, value: unknown, headers: Record<string, string> = {}): HttpResponse {
    return { status, headers, body: JSON.stringify(value) };
  }

  assertNoAuthorizationLeak(): void {
    for (const request of this.requests) {
      const auth = request.headers.Authorization ?? request.headers.authorization;
      if (auth && auth !== '<redacted>') {
        // Authorization must never appear in request URLs or bodies.
        if (request.url.includes(encodeURIComponent(auth)) || request.body?.includes(auth)) {
          throw new Error('credential leaked into URL or body');
        }
      }
    }
  }
}

export function canonicalOf(value: unknown): string {
  return canonicalJson(value);
}

function toHeadRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : `refs/heads/${ref}`;
}

export type { PendingPublication, PublicationResult };
