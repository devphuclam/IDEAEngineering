// Provider-neutral GitHub ports used by the provider-selected CLI context.
//
// The original feature-001 GitHub classes remain available for compatibility
// with generated projects that construct a legacy context by hand.  This
// module is the revised-port seam: every mutation carries an opaque revision
// and operation identity, comments are the durable evidence/receipt stream,
// and no command has to infer the selected provider from a remote URL.

import type {
  AdoptionPlan,
  AdoptionRequest,
  AgentCheckpoint,
  ClaimRecord,
  ClaimRelease,
  ClaimState,
  ChangeScopeBlock,
  CoordinationState,
  HandoffRecord,
  IntegrationTarget,
  MutationCommand,
  MutationResult,
  OperationReceipt,
  PolicyInventory,
  PolicyRequirement,
  PolicySnapshot,
  PublicationResult,
  PullRequestCompletion,
  PullRequestRef,
  PullRequestRequest,
  ReadinessReport,
  RemoteCheckpoint,
  RemoteRoleSnapshot,
  Revisioned,
  RevisionedWorkItem,
  RunEvidence,
  RunId,
  WorkItem,
  WorkItemId,
  WorkItemState,
  WorkItemStateTransition,
} from '../../domain/types.ts';
import { resolve } from 'node:path';
import type {
  ClaimStore,
  EvidenceStore,
  PolicyAdapter,
  SourceHostAdapter,
  WorkItemAdapter,
} from '../ports.ts';
import { canonicalJson, payloadHash } from '../../domain/mutations.ts';
import { aggregateOutcome } from '../../domain/policy.ts';
import {
  CHECKPOINT_MARKER,
  EVIDENCE_MARKER,
  evidenceBody,
  operationReceiptBody,
  parseCheckpoint,
  parseMarker,
  parseOperationReceipt,
} from '../../domain/records.ts';
import { parseChangeScope } from './work-items.ts';
import { GitHubClaimStore } from './claims.ts';
import { SerializedGh } from './gh.ts';
import {
  buildGithubPolicySnapshot,
  type CheckRunState,
  type ClassicProtection,
  type CommitStatus,
  type ReviewState,
  type RulesetRule,
} from './policies.ts';
import { redactEvidence } from '../../domain/redaction.ts';
import { capabilityError, conflictError, normalizeError, WorkspaceError } from '../../errors.ts';

type GithubIssue = {
  number: number;
  title: string;
  body?: string;
  state: string;
  labels?: string[];
};

type GithubComment = { id: number; body: string; created_at?: string; createdAt?: string };

const STATUS_LABELS = [
  'status: claimed',
  'status: in-progress',
  'status: ready-for-integration',
  'status: integrated',
  'status: blocked',
];

const STATUS_BY_STATE: Record<WorkItemState, string> = {
  open: '',
  claimed: 'status: claimed',
  'in-progress': 'status: in-progress',
  'ready-for-integration': 'status: ready-for-integration',
  integrated: 'status: integrated',
  blocked: 'status: blocked',
};

const RUN_STATE_BY_WORK_ITEM: Record<WorkItemState, RunEvidence['stateTransitions'][number]['to']> = {
  open: 'requested',
  claimed: 'claimed',
  'in-progress': 'running',
  'ready-for-integration': 'ready-for-integration',
  integrated: 'integrated',
  blocked: 'failed',
};

function now(): string {
  return new Date().toISOString();
}

function parseJson<T>(raw: string, what: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw capabilityError(`GitHub ${what} response was not valid JSON`);
  }
}

function parseJsonLines<T>(raw: string, what: string): T[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseJson<T>(line, what));
}

function shortRef(ref: string): string {
  return ref.replace(/^refs\/heads\//, '');
}

function fullRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : `refs/heads/${ref}`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeHtml(value: string): string {
  return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

const BLOCKS = {
  'coordination-state': ['AGENT-WORKSPACE:COORDINATION-STATE:V1:BEGIN', 'AGENT-WORKSPACE:COORDINATION-STATE:V1:END'],
  'change-scope': ['AGENT-WORKSPACE:CHANGE-SCOPE:V1:BEGIN', 'AGENT-WORKSPACE:CHANGE-SCOPE:V1:END'],
} as const;

function readBlock<T>(body: string, kind: keyof typeof BLOCKS): T | undefined {
  const [begin, end] = BLOCKS[kind];
  const beginCount = body.split(begin).length - 1;
  const endCount = body.split(end).length - 1;
  if (beginCount === 0 && endCount === 0) return undefined;
  if (beginCount !== 1 || endCount !== 1) throw capabilityError(`GitHub Work Item has an invalid ${kind} managed block`);
  const start = body.indexOf(begin);
  const finish = body.indexOf(end);
  if (finish <= start) throw capabilityError(`GitHub Work Item has reversed ${kind} managed block markers`);
  const inner = body.slice(start + begin.length, finish).match(/^\n?<pre>([\s\S]*?)<\/pre>\n?$/);
  if (!inner) throw capabilityError(`GitHub Work Item has malformed ${kind} managed block`);
  try {
    return JSON.parse(unescapeHtml(inner[1])) as T;
  } catch {
    throw capabilityError(`GitHub Work Item ${kind} managed block is not valid JSON`);
  }
}

function replaceBlock<T>(body: string, kind: keyof typeof BLOCKS, value: T): string {
  const [begin, end] = BLOCKS[kind];
  const canonical = canonicalJson(value);
  const block = `${begin}\n<pre>${escapeHtml(canonical)}</pre>\n${end}`;
  const start = body.indexOf(begin);
  const finish = body.indexOf(end);
  if (start >= 0 && finish > start) return `${body.slice(0, start)}${block}${body.slice(finish + end.length)}`;
  if (start >= 0 || finish >= 0) throw capabilityError(`GitHub Work Item has a partial ${kind} managed block`);
  return `${body}${body.length > 0 && !body.endsWith('\n') ? '\n' : ''}${block}`;
}

function emptyCoordination(workItemId: string): CoordinationState {
  return {
    schema: 'agent-workspace/coordination-state',
    version: 1,
    workItemId,
    claim: null,
    run: null,
    lastAppliedOperation: null,
    pendingPublication: null,
  };
}

function scopeFromBody(body: string | undefined, workItemId: string, target = 'refs/heads/main'): ChangeScopeBlock {
  const managed = readBlock<ChangeScopeBlock>(body ?? '', 'change-scope');
  if (managed) {
    if (managed.schema !== 'agent-workspace/change-scope' || managed.version !== 1) throw capabilityError(`Work Item ${workItemId} has an unsupported Change Scope block`);
    return {
      schema: 'agent-workspace/change-scope',
      version: 1,
      paths: [...managed.paths],
      semanticSeams: [...managed.semanticSeams],
      prerequisites: [...managed.prerequisites],
      integrationTarget: managed.integrationTarget,
    };
  }
  const legacy = parseChangeScope(body, workItemId);
  return {
    schema: 'agent-workspace/change-scope',
    version: 1,
    paths: [...legacy.paths],
    semanticSeams: [...legacy.semanticSeams],
    prerequisites: [...legacy.prerequisites],
    integrationTarget: legacy.integrationTarget === 'main' ? target : legacy.integrationTarget,
  };
}

function stateFromLabels(labels: string[]): WorkItemState {
  const status = labels.find((label) => STATUS_LABELS.includes(label));
  if (status === 'status: claimed') return 'claimed';
  if (status === 'status: in-progress') return 'in-progress';
  if (status === 'status: ready-for-integration') return 'ready-for-integration';
  if (status === 'status: integrated') return 'integrated';
  if (status === 'status: blocked') return 'blocked';
  return 'open';
}

function issueLabels(issue: GithubIssue): string[] {
  return (issue.labels ?? []).map(String);
}

function commentCreatedAt(comment: GithubComment): string {
  return comment.createdAt ?? comment.created_at ?? now();
}

export class GithubProviderError extends Error {
  constructor(message: string) {
    super(`github provider: ${message}`);
    this.name = 'GithubProviderError';
  }
}

export interface GithubProviderOptions {
  gh: SerializedGh;
  repository: string;
  cwd: string;
  remoteName?: string;
  targetRef?: string;
  reviewIntent?: { minimumHumanApprovals: number; authorSelfReview: boolean };
  clock?: () => string;
}

class GithubApiBase {
  protected readonly options: GithubProviderOptions;
  protected readonly gh: SerializedGh;
  protected readonly repository: string;
  protected readonly clock: () => string;

  constructor(options: GithubProviderOptions) {
    this.options = options;
    this.gh = options.gh;
    this.repository = options.repository;
    this.clock = options.clock ?? now;
  }

  protected async issue(issueId: string): Promise<GithubIssue> {
    const raw = await this.gh.run([
      'api',
      `repos/${this.repository}/issues/${encodeURIComponent(issueId)}`,
      '--jq',
      '{number,title,body,state,labels:[.labels[].name]}',
    ]);
    return parseJson<GithubIssue>(raw, 'Issue');
  }

  protected async comments(issueId: string): Promise<GithubComment[]> {
    const raw = await this.gh.run([
      'api',
      `repos/${this.repository}/issues/${encodeURIComponent(issueId)}/comments`,
      '--paginate',
      '--jq',
      '.[] | {id,body,created_at}',
    ]);
    return parseJsonLines<GithubComment>(raw, 'Issue comments');
  }

  protected async appendComment(issueId: string, body: string): Promise<GithubComment> {
    const raw = await this.gh.run([
      'api',
      `repos/${this.repository}/issues/${encodeURIComponent(issueId)}/comments`,
      '--method',
      'POST',
      '--field',
      `body=${body}`,
    ]);
    return parseJson<GithubComment>(raw, 'comment mutation');
  }

  protected async issueRevision(issueId: string): Promise<string> {
    const issue = await this.issue(issueId);
    const comments = await this.comments(issueId);
    return payloadHash({
      issue: { number: issue.number, title: issue.title, body: issue.body ?? '', state: issue.state, labels: issueLabels(issue).sort() },
      comments: comments.map((comment) => ({ id: comment.id, body: comment.body, createdAt: commentCreatedAt(comment) })),
    });
  }

  protected async receipts(issueId: string, operationId?: string): Promise<OperationReceipt[]> {
    const result: OperationReceipt[] = [];
    for (const comment of await this.comments(issueId)) {
      if (!comment.body.includes('AGENT-WORKSPACE:OPERATION-RECEIPT:V1')) continue;
      try {
        const receipt = parseOperationReceipt(comment.body);
        if (!operationId || receipt.operationId === operationId) result.push(receipt);
      } catch {
        // Malformed receipt comments remain inspectable but never become authority.
      }
    }
    return result;
  }

  protected async appendReceipt(command: MutationCommand<unknown>, kind: string, workItemId: string, outcome = 'applied'): Promise<OperationReceipt> {
    const receipt: OperationReceipt = {
      operationId: command.operationId,
      kind,
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome,
      actor: command.actor,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      workItemId,
      references: [],
    };
    await this.appendComment(workItemId, operationReceiptBody(receipt));
    return receipt;
  }

  protected async existingReceipt(command: MutationCommand<unknown>, workItemId: string): Promise<MutationResult<never> | undefined> {
    const receipt = (await this.receipts(workItemId, command.operationId))[0];
    if (!receipt) return undefined;
    const expected = payloadHash(command.input);
    return receipt.payloadHash === expected
      ? { operationId: command.operationId, disposition: 'duplicate', revision: await this.issueRevision(workItemId), receiptRef: `operation:${receipt.operationId}`, reason: 'durable matching receipt' }
      : { operationId: command.operationId, disposition: 'conflict', revision: await this.issueRevision(workItemId), reason: 'operation ID payload hash mismatch' };
  }
}

export class GithubProviderWorkItemAdapter extends GithubApiBase implements WorkItemAdapter {
  constructor(options: GithubProviderOptions) {
    super(options);
  }

  async snapshot(workItemId: WorkItemId): Promise<{ issue: GithubIssue; comments: GithubComment[]; revision: string; observedAt: string }> {
    const issue = await this.issue(workItemId);
    const comments = await this.comments(workItemId);
    const revision = payloadHash({
      issue: { number: issue.number, title: issue.title, body: issue.body ?? '', state: issue.state, labels: issueLabels(issue).sort() },
      comments: comments.map((comment) => ({ id: comment.id, body: comment.body, createdAt: commentCreatedAt(comment) })),
    });
    return { issue, comments, revision, observedAt: this.clock() };
  }

  async read(workItemId: WorkItemId): Promise<Revisioned<RevisionedWorkItem>> {
    const snapshot = await this.snapshot(workItemId);
    const body = snapshot.issue.body ?? '';
    const changeScope = scopeFromBody(body, workItemId, this.options.targetRef ?? 'refs/heads/main');
    const coordination = readBlock<CoordinationState>(body, 'coordination-state') ?? emptyCoordination(workItemId);
    if (coordination.schema !== 'agent-workspace/coordination-state' || coordination.version !== 1 || coordination.workItemId !== workItemId) {
      throw new GithubProviderError(`Work Item ${workItemId} has an invalid Coordination State block`);
    }
    const item: WorkItem = {
      id: workItemId,
      title: snapshot.issue.title,
      description: body,
      dependencies: [...changeScope.prerequisites],
      changeScope,
    };
    return { value: { item, coordination, changeScope }, revision: snapshot.revision, observedAt: snapshot.observedAt };
  }

  async listOpen(): Promise<Array<Revisioned<RevisionedWorkItem>>> {
    const raw = await this.gh.run([
      'api',
      `repos/${this.repository}/issues`,
      '--method',
      'GET',
      '--field',
      'state=open',
      '--field',
      'per_page=100',
      '--paginate',
      '--jq',
      '.[] | select(.pull_request == null) | {number}',
    ]);
    const issues = parseJsonLines<{ number: number }>(raw, 'open Issue list');
    return Promise.all(issues.map((issue) => this.read(String(issue.number))));
  }

  async allIssueIds(): Promise<string[]> {
    const raw = await this.gh.run([
      'api',
      `repos/${this.repository}/issues`,
      '--method',
      'GET',
      '--field',
      'state=all',
      '--field',
      'per_page=100',
      '--paginate',
      '--jq',
      '.[] | select(.pull_request == null) | .number',
    ]);
    return raw.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  }

  async projectState(command: MutationCommand<WorkItemStateTransition>): Promise<MutationResult<WorkItemState>> {
    const duplicate = await this.existingReceipt(command, command.input.workItemId);
    if (duplicate) return duplicate as MutationResult<WorkItemState>;
    const current = await this.snapshot(command.input.workItemId);
    if (current.revision !== command.expectedRevision) {
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale GitHub Work Item revision' };
    }
    const currentState = stateFromLabels(issueLabels(current.issue));
    if (currentState !== command.input.from) {
      return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: `Work Item state is ${currentState}, expected ${command.input.from}` };
    }
    const body = current.issue.body ?? '';
    const coordination = readBlock<CoordinationState>(body, 'coordination-state') ?? emptyCoordination(command.input.workItemId);
    if (coordination.run) coordination.run = { ...coordination.run, state: RUN_STATE_BY_WORK_ITEM[command.input.to] };
    const nextBody = replaceBlock(body, 'coordination-state', coordination);
    const labels = issueLabels(current.issue).filter((label) => !STATUS_LABELS.includes(label));
    const nextLabel = STATUS_BY_STATE[command.input.to];
    if (nextLabel) labels.push(nextLabel);
    const args = [
      'api',
      `repos/${this.repository}/issues/${encodeURIComponent(command.input.workItemId)}`,
      '--method',
      'PATCH',
      '--field',
      `body=${nextBody}`,
      ...(labels.length > 0
        ? labels.flatMap((label) => ['--field', `labels[]=${label}`])
        : ['--field', 'labels[]']),
    ];
    await this.gh.run(args);
    const receipt = await this.appendReceipt(command, 'work-item-state', command.input.workItemId, command.input.to);
    const after = await this.issueRevision(command.input.workItemId);
    return { operationId: command.operationId, disposition: 'applied', revision: after, value: command.input.to, receiptRef: `operation:${receipt.operationId}` };
  }
}

export class GithubProviderClaimStore extends GithubApiBase implements ClaimStore {
  private readonly legacy: GitHubClaimStore;
  private readonly workItems: GithubProviderWorkItemAdapter;

  constructor(options: GithubProviderOptions, workItems = new GithubProviderWorkItemAdapter(options)) {
    super(options);
    this.legacy = new GitHubClaimStore(options.gh, options.repository);
    this.workItems = workItems;
  }

  async acquire(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    return this.mutateClaim(command, 'acquire', async () => this.legacy.acquire(command.input));
  }

  async renew(command: MutationCommand<ClaimRecord>): Promise<MutationResult<ClaimState>> {
    return this.mutateClaim(command, 'renew', async () => this.legacy.renew(command.input));
  }

  async handoff(command: MutationCommand<HandoffRecord>): Promise<MutationResult<ClaimState>> {
    const workItemId = await this.findWorkItemForRun(command.input.checkpoint.runId);
    if (!workItemId) return { operationId: command.operationId, disposition: 'conflict', revision: 'unknown', reason: 'handoff Work Item could not be recovered from canonical comments' };
    const current = await this.legacy.active(workItemId);
    if (!current) return { operationId: command.operationId, disposition: 'conflict', revision: await this.issueRevision(workItemId), reason: 'no active claim to hand off' };
    const record: ClaimRecord = { ...current, claimant: command.input.replacementOwner, kind: 'handoff', previousOwner: command.input.previousOwner };
    return this.mutateClaim(command, 'handoff', async () => this.legacy.handoff(record), workItemId);
  }

  async release(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    return this.mutateRelease(command, 'release', (input) => this.legacy.release(input.workItemId, input.claimToken));
  }

  async expire(command: MutationCommand<ClaimRelease>): Promise<MutationResult<ClaimState | undefined>> {
    return this.mutateRelease(command, 'expire', (input) => this.legacy.expire(input.workItemId, input.claimToken));
  }

  async active(workItemId: WorkItemId): Promise<Revisioned<ClaimState | undefined>> {
    const value = await this.legacy.active(workItemId);
    return { value, revision: await this.issueRevision(workItemId), observedAt: this.clock() };
  }

  async records(workItemId: WorkItemId, operationId?: string): Promise<OperationReceipt[]> {
    return this.receipts(workItemId, operationId);
  }

  async claimRecords(workItemId: WorkItemId): Promise<ClaimRecord[]> {
    const comments = await this.comments(workItemId);
    const result: ClaimRecord[] = [];
    for (const comment of comments) {
      try {
        const body = comment.body;
        const start = body.indexOf('<!-- claim-record -->');
        const end = body.indexOf('<!-- /claim-record -->', start + 1);
        const fence = body.indexOf('```json', start + 1);
        const close = body.indexOf('```', fence + 7);
        if (start < 0 || end < 0 || fence < 0 || close < 0 || close > end) continue;
        result.push(JSON.parse(body.slice(fence + 7, close).trim()) as ClaimRecord);
      } catch {
        // Corrupt claim comments are not authority.
      }
    }
    return result;
  }

  async reconcilePending(_workItemId: WorkItemId): Promise<PublicationResult> {
    return { operationId: 'none', published: true };
  }

  private async mutateClaim<T>(
    command: MutationCommand<T>,
    kind: string,
    apply: () => Promise<{ winner: boolean; reason?: string }>,
    workItemId?: string,
  ): Promise<MutationResult<ClaimState>> {
    const itemId = workItemId ?? (command.input as ClaimRecord).workItemId;
    const duplicate = await this.existingReceipt(command, itemId);
    if (duplicate) return duplicate as MutationResult<ClaimState>;
    const current = await this.workItems.read(itemId);
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale GitHub Work Item revision' };
    const outcome = await apply();
    if (!outcome.winner) return { operationId: command.operationId, disposition: 'conflict', revision: await this.issueRevision(itemId), reason: outcome.reason ?? 'claim lost deterministic reconciliation' };
    const receipt = await this.appendReceipt(command, `claim-${kind}`, itemId);
    const value = await this.legacy.active(itemId);
    return { operationId: command.operationId, disposition: 'applied', revision: await this.issueRevision(itemId), value: value ?? (command.input as unknown as ClaimState), receiptRef: `operation:${receipt.operationId}` };
  }

  private async mutateRelease(
    command: MutationCommand<ClaimRelease>,
    kind: string,
    apply: (input: ClaimRelease) => Promise<void>,
  ): Promise<MutationResult<ClaimState | undefined>> {
    const duplicate = await this.existingReceipt(command, command.input.workItemId);
    if (duplicate) return duplicate as MutationResult<ClaimState | undefined>;
    const current = await this.workItems.read(command.input.workItemId);
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale GitHub Work Item revision' };
    const active = await this.legacy.active(command.input.workItemId);
    if (!active || active.claimToken !== command.input.claimToken) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'claim token is not active' };
    await apply(command.input);
    const after = await this.legacy.active(command.input.workItemId);
    if (after) return { operationId: command.operationId, disposition: 'conflict', revision: await this.issueRevision(command.input.workItemId), reason: 'claim release raced with another active claim' };
    const receipt = await this.appendReceipt(command, `claim-${kind}`, command.input.workItemId);
    return { operationId: command.operationId, disposition: 'applied', revision: await this.issueRevision(command.input.workItemId), value: undefined, receiptRef: `operation:${receipt.operationId}` };
  }

  private async findWorkItemForRun(runId: string): Promise<string | undefined> {
    for (const workItemId of await this.workItems.allIssueIds()) {
      const claims = await this.claimRecords(workItemId);
      if (claims.some((claim) => claim.runId === runId)) return workItemId;
    }
    return undefined;
  }
}

export class GithubProviderEvidenceStore extends GithubApiBase implements EvidenceStore {
  private readonly workItems: GithubProviderWorkItemAdapter;

  constructor(options: GithubProviderOptions, workItems = new GithubProviderWorkItemAdapter(options)) {
    super(options);
    this.workItems = workItems;
  }

  async reconcilePending(_workItemId: WorkItemId): Promise<PublicationResult> {
    return { operationId: 'none', published: true };
  }

  async publish(command: MutationCommand<RunEvidence>): Promise<MutationResult<RunEvidence>> {
    const duplicate = await this.existingReceipt(command, command.input.workItemId);
    if (duplicate) return { ...(duplicate as MutationResult<RunEvidence>), value: redactEvidence(command.input) };
    const current = await this.workItems.read(command.input.workItemId);
    if (current.revision !== command.expectedRevision) return { operationId: command.operationId, disposition: 'conflict', revision: current.revision, reason: 'stale GitHub Work Item revision' };
    const redacted = redactEvidence(command.input);
    const receipt: OperationReceipt = {
      operationId: command.operationId,
      kind: 'run-evidence',
      payloadHash: payloadHash(command.input),
      disposition: 'applied',
      outcome: redacted.integrationResult ?? 'pending',
      actor: redacted.owner,
      occurredAt: command.requestedAt,
      publishedAt: this.clock(),
      workItemId: redacted.workItemId,
      references: redacted.checkpointRefs,
      blocker: redacted.blocker,
      nextAction: redacted.nextAction,
    };
    await this.appendComment(command.input.workItemId, `${evidenceBody(redacted, command.operationId)}\n\n${operationReceiptBody(receipt)}`);
    return { operationId: command.operationId, disposition: 'applied', revision: await this.issueRevision(command.input.workItemId), value: redacted, receiptRef: `operation:${receipt.operationId}` };
  }

  async read(runId: RunId): Promise<RunEvidence> {
    const records = await this.find(runId);
    const last = records.at(-1);
    if (!last) throw new WorkspaceError('EVIDENCE_NOT_FOUND', 'capability', `no canonical GitHub evidence for run ${runId}`);
    return last;
  }

  async list(workItemId: WorkItemId): Promise<RunEvidence[]> {
    const result: RunEvidence[] = [];
    for (const comment of await this.comments(workItemId)) {
      if (!comment.body.includes(EVIDENCE_MARKER)) continue;
      try {
        const parsed = parseMarker<{ evidence?: RunEvidence }>(EVIDENCE_MARKER, comment.body);
        if (parsed.payload.evidence) result.push(parsed.payload.evidence);
      } catch {
        // Malformed evidence is visible in the provider but never authoritative.
      }
    }
    return result;
  }

  private async find(runId: RunId): Promise<RunEvidence[]> {
    const result: RunEvidence[] = [];
    for (const workItemId of await this.workItems.allIssueIds()) {
      result.push(...(await this.list(workItemId)).filter((record) => record.runId === runId));
    }
    return result.sort((left, right) => Date.parse(left.timestamps.at(-1) ?? '') - Date.parse(right.timestamps.at(-1) ?? ''));
  }
}

export class GithubProviderPolicyAdapter extends GithubApiBase implements PolicyAdapter {
  private readonly reviewIntent: { minimumHumanApprovals: number; authorSelfReview: boolean };

  constructor(options: GithubProviderOptions) {
    super(options);
    this.reviewIntent = options.reviewIntent ?? { minimumHumanApprovals: 0, authorSelfReview: true };
  }

  async inspectTarget(target: IntegrationTarget): Promise<PolicyInventory> {
    let head = 'unavailable';
    let headRead = false;
    try { head = await this.targetHead(target.targetRef); headRead = true; } catch { /* represented as unavailable below */ }
    let rulesets: RulesetRule[] = [];
    let rulesetsRead = false;
    try { rulesets = await this.readRulesets(); rulesetsRead = true; } catch { /* represented as unavailable below */ }
    let protection: ClassicProtection = { requiredApprovingReviews: 0, requiredChecks: [] };
    let protectionRead = false;
    try { protection = await this.readClassicProtection(target.targetRef); protectionRead = true; } catch { /* represented as unavailable below */ }
    const requirements = this.requirements(target, head, rulesets, protection);
    if (!headRead) requirements.push({ id: 'github:target-head', name: 'Exact target head', source: 'github-target', kind: 'provider', verdict: 'unavailable', detail: 'target head could not be read', appliedToCommit: head });
    if (!rulesetsRead) requirements.push({ id: 'github:rulesets', name: 'Effective rulesets', source: 'github-rulesets', kind: 'provider', verdict: 'unavailable', detail: 'rulesets could not be read', appliedToCommit: head });
    if (!protectionRead) requirements.push({ id: 'github:classic-protection', name: 'Classic branch protection', source: 'github-classic-protection', kind: 'provider', verdict: 'unavailable', detail: 'classic branch protection could not be read', appliedToCommit: head });
    return {
      target,
      observedAt: this.clock(),
      sources: [
        { name: 'github-target-head', outcome: headRead ? 'read' : 'unavailable' },
        { name: 'github-rulesets', outcome: rulesetsRead ? 'read' : 'unavailable' },
        { name: 'github-classic-protection', outcome: protectionRead ? 'read' : 'unavailable' },
      ],
      effectiveBlocking: requirements,
    };
  }

  async evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot> {
    const target: IntegrationTarget = { repositoryId: ref.repositoryId, targetRef: ref.targetRef };
    try {
      const pr = await this.readPullRequest(ref.pullRequestId);
      const headCommit = pr.sourceCommit;
      if (!headCommit) throw capabilityError('GitHub pull request did not expose an exact head SHA');
      const [rulesets, classicProtection, reviews, checkRuns, commitStatuses] = await Promise.all([
        this.readRulesets(),
        this.readClassicProtection(ref.targetRef),
        this.readReviews(ref.pullRequestId),
        this.readCheckRuns(headCommit),
        this.readCommitStatuses(headCommit),
      ]);
      const authorLogin = await this.readPullRequestAuthor(ref.pullRequestId);
      return buildGithubPolicySnapshot({
        target,
        rulesets,
        classicProtection,
        reviews,
        checkRuns,
        commitStatuses,
        headCommit,
        observedAt: this.clock(),
        reviewIntent: this.reviewIntent,
        authorLogin,
      }, { ...ref, sourceCommit: headCommit });
    } catch (error) {
      const normalized = normalizeError(error, 'GITHUB_POLICY_UNAVAILABLE', 'capability');
      return {
        target,
        pullRequestRef: ref,
        headCommit: ref.sourceCommit ?? 'unavailable',
        observedAt: this.clock(),
        inventory: {
          target,
          observedAt: this.clock(),
          sources: [{ name: 'github-policy', outcome: 'unavailable', detail: normalized.message }],
          effectiveBlocking: [{ id: 'github-policy', name: 'GitHub effective policy', source: 'github', kind: 'provider', verdict: 'unavailable', detail: normalized.message, appliedToCommit: ref.sourceCommit }],
        },
        evaluations: [{ id: 'github-policy', name: 'GitHub effective policy', source: 'github', kind: 'provider', verdict: 'unavailable', detail: normalized.message, appliedToCommit: ref.sourceCommit }],
        aggregate: 'unavailable',
      };
    }
  }

  private requirements(target: IntegrationTarget, headCommit: string, rulesets: RulesetRule[], classic: ClassicProtection): PolicyRequirement[] {
    const data = { target, rulesets, classicProtection: classic, reviews: [], checkRuns: [], commitStatuses: [], headCommit, observedAt: this.clock(), reviewIntent: this.reviewIntent, authorLogin: '' };
    return buildGithubPolicySnapshot(data).inventory.effectiveBlocking;
  }

  private async targetHead(targetRef: string): Promise<string> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/git/ref/heads/${encodeURIComponent(shortRef(targetRef))}`, '--jq', '.object.sha']);
    if (!raw) throw capabilityError(`GitHub target ${targetRef} has no head SHA`);
    return raw.trim();
  }

  private async readRulesets(): Promise<RulesetRule[]> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/rulesets`, '--method', 'GET', '--paginate', '--jq', '.[] | {id,name,enforcement,target}']);
    return parseJsonLines<RulesetRule>(raw, 'ruleset').map((rule) => ({ id: String(rule.id), name: rule.name, enforcement: rule.enforcement, target: rule.target }));
  }

  private async readClassicProtection(targetRef: string): Promise<ClassicProtection> {
    const branch = shortRef(targetRef);
    const raw = await this.gh.run(['api', `repos/${this.repository}/branches/${encodeURIComponent(branch)}/protection`, '--jq', '{reviews:(.required_pull_request_reviews.required_approving_review_count // 0),checks:[(.required_status_checks.checks // [])[] | (.context // .name // "")] }']);
    const parsed = parseJson<{ reviews?: number; checks?: string[] }>(raw, 'classic protection');
    return { requiredApprovingReviews: Number(parsed.reviews ?? 0), requiredChecks: [...new Set((parsed.checks ?? []).map(String).filter(Boolean))] };
  }

  private async readPullRequest(id: string): Promise<PullRequestRef> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/pulls/${encodeURIComponent(id)}`, '--jq', '{number,html_url,head:{ref,sha},base:{ref,sha}}']);
    const parsed = parseJson<{ number: number; html_url: string; head: { ref: string; sha: string }; base: { ref: string; sha: string } }>(raw, 'pull request');
    return { repositoryId: this.repository, pullRequestId: String(parsed.number), url: parsed.html_url, sourceRef: fullRef(parsed.head.ref), targetRef: fullRef(parsed.base.ref), sourceCommit: parsed.head.sha, targetCommit: parsed.base.sha };
  }

  private async readPullRequestAuthor(id: string): Promise<string> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/pulls/${encodeURIComponent(id)}`, '--jq', '.user.login']);
    return raw.trim();
  }

  private async readReviews(id: string): Promise<ReviewState[]> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/pulls/${encodeURIComponent(id)}/reviews`, '--paginate', '--jq', '.[] | {state,user:.user.login}']);
    return parseJsonLines<ReviewState>(raw, 'pull request reviews');
  }

  private async readCheckRuns(commit: string): Promise<CheckRunState[]> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/commits/${encodeURIComponent(commit)}/check-runs`, '--jq', '.check_runs[] | {name,conclusion,status}']);
    return parseJsonLines<CheckRunState>(raw, 'check runs');
  }

  private async readCommitStatuses(commit: string): Promise<CommitStatus[]> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/commits/${encodeURIComponent(commit)}/statuses`, '--jq', '.[] | {context,state}']);
    return parseJsonLines<CommitStatus>(raw, 'commit statuses');
  }
}

export interface GithubGitExecutor {
  run(args: string[], cwd: string): Promise<{ stdout: string; stderr: string }>;
}

class SpawnedGithubGit implements GithubGitExecutor {
  async run(args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);
    const result = await execFileAsync('git', args, { cwd, encoding: 'utf8' });
    return { stdout: result.stdout, stderr: result.stderr };
  }
}

export class GithubProviderSourceHostAdapter extends GithubApiBase implements SourceHostAdapter {
  private readonly git: GithubGitExecutor;
  private readonly remoteName: string;

  constructor(options: GithubProviderOptions, git: GithubGitExecutor = new SpawnedGithubGit()) {
    super(options);
    this.git = git;
    this.remoteName = options.remoteName ?? 'origin';
  }

  async targetHead(targetRef: string): Promise<string> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/git/ref/heads/${encodeURIComponent(shortRef(targetRef))}`, '--jq', '.object.sha']);
    if (!raw.trim()) throw new GithubProviderError(`target ref ${targetRef} was not found`);
    return raw.trim();
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath: string): Promise<RemoteCheckpoint> {
    const source = fullRef(checkpoint.branch);
    if (source === fullRef(this.options.targetRef ?? 'refs/heads/main')) throw new GithubProviderError('checkpoint source ref cannot be the protected target');
    const sandbox = resolve(this.options.cwd, worktreePath);
    const localHead = (await this.git.run(['rev-parse', 'HEAD'], sandbox)).stdout.trim();
    if (localHead !== checkpoint.commit) throw conflictError(`sandbox HEAD ${localHead || 'unavailable'} does not match checkpoint ${checkpoint.commit}`);
    await this.git.run(['push', this.remoteName, `HEAD:${source}`], sandbox);
    if (!(await this.remoteCommit(checkpoint))) throw new GithubProviderError(`remote did not confirm checkpoint ${checkpoint.commit}`);
    const roles = await this.remoteRoles();
    const origin = roles.roles.find((role) => role.name === this.remoteName);
    return { branch: checkpoint.branch, commit: checkpoint.commit, pushUrl: origin?.url ?? `https://github.com/${this.repository}.git` };
  }

  async recordCheckpoint(workItemId: WorkItemId, checkpoint: AgentCheckpoint): Promise<void> {
    await this.appendComment(workItemId, `${CHECKPOINT_MARKER} ${checkpoint.checkpointId}\n\n\`\`\`json\n${JSON.stringify({ schema: 'agent-workspace/checkpoint', version: 1, checkpoint })}\n\`\`\``);
  }

  async readCheckpoints(workItemId: WorkItemId): Promise<AgentCheckpoint[]> {
    const checkpoints: AgentCheckpoint[] = [];
    for (const comment of await this.comments(workItemId)) {
      if (!comment.body.includes(CHECKPOINT_MARKER)) continue;
      try { checkpoints.push(parseCheckpoint(comment.body)); } catch { /* malformed history is not recovery evidence */ }
    }
    return checkpoints.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  }

  async remoteCommit(checkpoint: AgentCheckpoint): Promise<boolean> {
    const result = await this.git.run(['ls-remote', this.remoteName, fullRef(checkpoint.branch)], this.options.cwd);
    return result.stdout.split(/\s+/).includes(checkpoint.commit);
  }

  async ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef> {
    const source = shortRef(request.sourceRef);
    const target = shortRef(request.targetRef);
    if (fullRef(request.sourceRef) === fullRef(request.targetRef)) throw new GithubProviderError('source ref cannot equal protected target');
    const existingRaw = await this.gh.run(['api', `repos/${this.repository}/pulls`, '--method', 'GET', '--field', 'state=open', '--field', `head=${this.repository.split('/')[0]}:${source}`, '--field', `base=${target}`, '--jq', '.[0] // empty']);
    if (existingRaw.trim()) return this.toPullRequest(parseJson<Record<string, unknown>>(existingRaw, 'pull request lookup'));
    const createdRaw = await this.gh.run(['api', `repos/${this.repository}/pulls`, '--method', 'POST', '--field', `title=${request.title}`, '--field', `head=${source}`, '--field', `base=${target}`, '--field', `body=${request.description ?? `Checkpointed change for Work Item ${request.workItemId ?? 'unknown'}.`}`]);
    return this.toPullRequest(parseJson<Record<string, unknown>>(createdRaw, 'pull request creation'));
  }

  async readPullRequest(ref: PullRequestRef): Promise<PullRequestRef> {
    const raw = await this.gh.run(['api', `repos/${this.repository}/pulls/${encodeURIComponent(ref.pullRequestId)}`, '--jq', '{number,html_url,head:{ref,sha},base:{ref,sha}}']);
    return this.toPullRequest(parseJson<Record<string, unknown>>(raw, 'pull request read'));
  }

  async completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion> {
    const target = await this.targetHead(ref.targetRef);
    if (target !== expectedTargetCommit) throw conflictError('GitHub target commit drifted before completion');
    const raw = await this.gh.run(['api', `repos/${this.repository}/pulls/${encodeURIComponent(ref.pullRequestId)}/merge`, '--method', 'PUT', '--field', 'merge_method=squash', '--field', `sha=${ref.sourceCommit ?? ''}`]);
    const merged = parseJson<{ merged?: boolean; sha?: string }>(raw, 'pull request completion');
    if (merged.merged !== true) throw new GithubProviderError('GitHub did not report a completed pull request');
    return { pullRequestRef: await this.readPullRequest(ref), merged: true, targetCommit: merged.sha ?? expectedTargetCommit };
  }

  async remoteRoles(): Promise<RemoteRoleSnapshot> {
    const remotes = await this.git.run(['remote'], this.options.cwd);
    const roles: RemoteRoleSnapshot['roles'] = [];
    for (const name of remotes.stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean)) {
      const fetch = (await this.git.run(['remote', 'get-url', name], this.options.cwd)).stdout.trim();
      let push = fetch;
      try { push = (await this.git.run(['remote', 'get-url', '--push', name], this.options.cwd)).stdout.trim() || fetch; } catch { push = fetch; }
      roles.push({ name, fetch: Boolean(fetch), push: Boolean(push) && !/^disabled:|^no_push:/i.test(push), url: push || fetch });
    }
    return { roles };
  }

  async previewAdoption(request: AdoptionRequest): Promise<AdoptionPlan> {
    const roles = await this.remoteRoles();
    const actions = [{ kind: 'remote-role', detail: `inspect GitHub remote roles; selected provider remains GitHub` }, { kind: 'audit', detail: `current remotes: ${roles.roles.map((role) => `${role.name}:${role.push ? 'push' : 'fetch'}`).join(', ')}` }];
    return { request, actions, digest: payloadHash({ request, actions }) };
  }

  async applyAdoption(command: MutationCommand<AdoptionPlan>): Promise<MutationResult<RemoteRoleSnapshot>> {
    return { operationId: command.operationId, disposition: 'conflict', revision: command.expectedRevision, reason: 'remote adoption is an Azure Repos operation; GitHub provider selection cannot be mutated by this command' };
  }

  private toPullRequest(raw: Record<string, unknown>): PullRequestRef {
    const head = (raw.head ?? {}) as { ref?: string; sha?: string };
    const base = (raw.base ?? {}) as { ref?: string; sha?: string };
    return { repositoryId: this.repository, pullRequestId: String(raw.number), url: String(raw.html_url ?? raw.url ?? ''), sourceRef: fullRef(String(head.ref ?? '')), targetRef: fullRef(String(base.ref ?? '')), sourceCommit: head.sha, targetCommit: base.sha };
  }
}

export function githubTarget(repository: string, targetRef = 'refs/heads/main'): IntegrationTarget {
  return { repositoryId: repository, targetRef: fullRef(targetRef) };
}

export function githubReadiness(provider: 'github' = 'github'): ReadinessReport {
  return {
    provider,
    observedAt: now(),
    configuration: { outcome: 'passed', detail: 'GitHub provider selected explicitly by configuration' },
    runtime: { outcome: 'not-selected', detail: 'runtimeProfile is null or omitted' },
    authentication: { outcome: 'passed', detail: 'gh authentication is checked by the selected provider context' },
    target: { outcome: 'passed', detail: 'GitHub target is selected from configuration and repository metadata' },
    permissions: [],
    remoteRoles: { roles: [] },
    policyVisibility: { inventorySources: [], effectiveBlockingCount: 0 },
    queue: { outcome: 'passed', detail: 'coordination-Issue queue available' },
    network: { outcome: 'passed', detail: 'GitHub reachability is checked on the first provider operation' },
  };
}
