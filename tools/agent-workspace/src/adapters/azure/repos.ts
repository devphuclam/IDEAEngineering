import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import type {
  AdoptionPlan,
  AdoptionRequest,
  AgentCheckpoint,
  MutationCommand,
  MutationResult,
  PullRequestCompletion,
  PullRequestRef,
  PullRequestRequest,
  RemoteBranchRef,
  RemoteCheckpoint,
  RemoteRoleSnapshot,
} from '../../domain/types.ts';
import type { SourceHostAdapter } from '../ports.ts';
import { payloadHash } from '../../domain/mutations.ts';
import { gitAuthEnv, type AuthSelection } from './auth.ts';
import { decodeGitRef, decodePullRequest, type WirePullRequest } from './models.ts';
import type { AzureHttpClient } from './http.ts';
import { appendComment, listComments } from './api.ts';
import { checkpointBody, parseCheckpoint, CHECKPOINT_MARKER } from '../../domain/records.ts';

const execFileAsync = promisify(execFile);

export interface GitExecutor {
  run(args: string[], cwd: string, env?: NodeJS.ProcessEnv): Promise<{ stdout: string; stderr: string }>;
}

export class SpawnedGit implements GitExecutor {
  async run(args: string[], cwd: string, env?: NodeJS.ProcessEnv): Promise<{ stdout: string; stderr: string }> {
    const result = await execFileAsync('git', args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
    return { stdout: result.stdout, stderr: result.stderr };
  }
}

export interface AzureReposOptions {
  client: AzureHttpClient;
  projectName: string;
  repositoryId: string;
  targetRef: string;
  cwd: string;
  companyOriginUrl?: string;
  auth?: AuthSelection;
  authProvider?: () => AuthSelection;
  git?: GitExecutor;
  clock?: () => string;
}

export class AzureReposError extends Error {
  constructor(message: string) {
    super(`azure repos: ${message}`);
    this.name = 'AzureReposError';
  }
}

export class AzureSourceHostAdapter implements SourceHostAdapter {
  private readonly client: AzureHttpClient;
  private readonly options: AzureReposOptions;
  private readonly git: GitExecutor;
  private readonly clock: () => string;

  constructor(options: AzureReposOptions) {
    this.client = options.client;
    this.options = options;
    this.git = options.git ?? new SpawnedGit();
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  get repositoryId(): string {
    return this.options.repositoryId;
  }

  async targetHead(targetRef: string): Promise<string> {
    this.assertTargetRef(targetRef);
    const short = targetRef.replace(/^refs\/heads\//, '');
    const raw = await this.client.get(this.refsPath(), { filter: `heads/${short}`, includeStatuses: 'false' }, '7.1');
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) throw new AzureReposError('refs response is malformed');
    const refs = (raw as { value: unknown[] }).value.map(decodeGitRef);
    const found = refs.find((ref) => ref.name === targetRef);
    if (!found) throw new AzureReposError(`target ref ${targetRef} was not found`);
    return found.objectId;
  }

  async createSourceBranch(sourceRef: string, fromCommit: string): Promise<RemoteBranchRef> {
    this.assertSourceRef(sourceRef);
    const current = await this.sourceHead(sourceRef);
    if (current !== undefined) {
      throw new AzureReposError(`source ref ${sourceRef} already exists and cannot be adopted by a new validation run`);
    }
    const zero = zeroObjectId();
    const raw = await this.client.post(this.refsPath(), [{ name: sourceRef, oldObjectId: zero, newObjectId: fromCommit }], {}, '7.1');
    this.assertRefUpdateSucceeded(raw, sourceRef, zero, fromCommit);
    const head = await this.sourceHead(sourceRef);
    if (head !== fromCommit) throw new AzureReposError(`source ref ${sourceRef} did not reach the requested head`);
    return { sourceRef, headCommit: head };
  }

  async sourceHead(sourceRef: string): Promise<string | undefined> {
    this.assertSourceRef(sourceRef);
    const short = sourceRef.replace(/^refs\/heads\//, '');
    const raw = await this.client.get(this.refsPath(), { filter: `heads/${short}`, includeStatuses: 'false' }, '7.1');
    return this.decodeGitRefList(raw).find((ref) => ref.name === sourceRef)?.objectId;
  }

  async listSourceBranches(prefix: string): Promise<RemoteBranchRef[]> {
    const normalized = toHeadRef(prefix);
    this.assertSourceRef(normalized);
    const short = normalized.replace(/^refs\/heads\//, '');
    const raw = await this.client.get(this.refsPath(), { filter: `heads/${short}`, includeStatuses: 'false' }, '7.1');
    return this.decodeGitRefList(raw)
      .filter((ref) => ref.name.startsWith(normalized))
      .map((ref) => ({ sourceRef: ref.name, headCommit: ref.objectId }));
  }

  async deleteSourceBranch(sourceRef: string, expectedHead: string): Promise<void> {
    this.assertSourceRef(sourceRef);
    const current = await this.sourceHead(sourceRef);
    if (current === undefined) return;
    if (current !== expectedHead) throw new AzureReposError(`source ref ${sourceRef} head drifted before deletion`);
    const zero = zeroObjectId();
    const raw = await this.client.post(this.refsPath(), [{ name: sourceRef, oldObjectId: expectedHead, newObjectId: zero }], {}, '7.1');
    this.assertRefUpdateSucceeded(raw, sourceRef, expectedHead, zero);
    if (await this.sourceHead(sourceRef) !== undefined) throw new AzureReposError(`source ref ${sourceRef} still exists after deletion`);
  }

  async pushCheckpoint(checkpoint: AgentCheckpoint, worktreePath: string): Promise<RemoteCheckpoint> {
    const sourceRef = toHeadRef(checkpoint.branch);
    this.assertSourceRef(sourceRef);
    const env = gitAuthEnv(this.options.authProvider?.() ?? this.options.auth ?? { source: 'none', detail: 'no auth' });
    await this.git.run(['push', 'origin', `${sourceRef}:${sourceRef}`], resolve(this.options.cwd, worktreePath), env);
    const roles = await this.remoteRoles();
    const origin = roles.roles.find((role) => role.name === 'origin');
    if (!origin?.push) throw new AzureReposError('origin is not push-capable after checkpoint push');
    return { branch: checkpoint.branch, commit: checkpoint.commit, pushUrl: origin.url };
  }

  async recordCheckpoint(workItemId: string, checkpoint: AgentCheckpoint): Promise<void> {
    await appendComment(this.client, { projectName: this.options.projectName, clock: this.clock }, workItemId, checkpointBody(checkpoint));
  }

  async readCheckpoints(workItemId: string): Promise<AgentCheckpoint[]> {
    const comments = await listComments(this.client, { projectName: this.options.projectName, clock: this.clock }, workItemId);
    const checkpoints: AgentCheckpoint[] = [];
    for (const comment of comments.comments) {
      if (!comment.text.includes(CHECKPOINT_MARKER)) continue;
      try { checkpoints.push(parseCheckpoint(comment.text)); } catch { /* malformed history is not recovery evidence */ }
    }
    return checkpoints.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  }

  async remoteCommit(checkpoint: AgentCheckpoint): Promise<boolean> {
    const sourceRef = toHeadRef(checkpoint.branch);
    const result = await this.git.run(['ls-remote', 'origin', sourceRef], resolve(this.options.cwd));
    return result.stdout.split(/\s+/).includes(checkpoint.commit);
  }

  async ensurePullRequest(request: PullRequestRequest): Promise<PullRequestRef> {
    if (request.repositoryId !== this.options.repositoryId) throw new AzureReposError('pull request repository does not match the configured Repository');
    const sourceRef = toHeadRef(request.sourceRef);
    const targetRef = toHeadRef(request.targetRef);
    this.assertTargetRef(targetRef);
    this.assertSourceRef(sourceRef);
    const existingRaw = await this.client.get(this.pullRequestsPath(), { 'searchCriteria.status': 'active', 'searchCriteria.sourceRefName': sourceRef, 'searchCriteria.targetRefName': targetRef }, '7.1');
    const sameRefs = this.decodePullRequestList(existingRaw).filter((pr) => pr.sourceRefName === sourceRef && pr.targetRefName === targetRef);
    const exact = request.workItemId
      ? sameRefs.filter((pr) => pr.workItemIds.includes(request.workItemId!))
      : sameRefs;
    if (exact.length > 1) throw new AzureReposError('multiple active pull requests match the Repository, source, target, and candidate Work Item');
    if (exact.length === 1) return this.toPullRequestRef(exact[0]);
    if (sameRefs.length > 0) throw new AzureReposError('an active pull request has the same refs but a different candidate Work Item');
    const createdRaw = await this.client.post(this.pullRequestsPath(), { sourceRefName: sourceRef, targetRefName: targetRef, title: request.title, description: request.description ?? '', workItemRefs: request.workItemId ? [{ id: request.workItemId }] : undefined }, {}, '7.1');
    const created = this.toPullRequestRef(decodePullRequest(createdRaw));
    if (created.repositoryId !== request.repositoryId || created.sourceRef !== sourceRef || created.targetRef !== targetRef || (request.workItemId && !created.workItemIds?.includes(request.workItemId))) {
      throw new AzureReposError('created pull request did not preserve the exact Repository, refs, and candidate Work Item identity');
    }
    return created;
  }

  async listPullRequests(sourceRef?: string): Promise<PullRequestRef[]> {
    const query: Record<string, string> = { 'searchCriteria.status': 'all' };
    if (sourceRef) query['searchCriteria.sourceRefName'] = toHeadRef(sourceRef);
    const raw = await this.client.get(this.pullRequestsPath(), query, '7.1');
    return this.decodePullRequestList(raw)
      .filter((pr) => !sourceRef || pr.sourceRefName === toHeadRef(sourceRef))
      .map((pr) => this.toPullRequestRef(pr));
  }

  async readPullRequest(ref: PullRequestRef): Promise<PullRequestRef> {
    const raw = await this.client.get(`${this.pullRequestsPath()}/${encodeURIComponent(ref.pullRequestId)}`, {}, '7.1');
    return this.toPullRequestRef(decodePullRequest(raw));
  }

  async abandonPullRequest(ref: PullRequestRef, expectedSourceCommit = ref.sourceCommit): Promise<PullRequestRef> {
    if (!expectedSourceCommit) throw new AzureReposError('pull request source commit is required for abandonment CAS');
    const current = await this.readPullRequest(ref);
    if (current.sourceRef !== ref.sourceRef || current.targetRef !== ref.targetRef) throw new AzureReposError('pull request refs changed before abandonment');
    if (current.status?.toLowerCase() === 'abandoned') return current;
    if (current.status && current.status.toLowerCase() !== 'active') throw new AzureReposError('pull request is not active and cannot be abandoned');
    if (current.sourceCommit !== expectedSourceCommit) throw new AzureReposError('pull request source commit drifted before abandonment');
    const currentSource = await this.sourceHead(current.sourceRef);
    if (currentSource !== expectedSourceCommit) throw new AzureReposError('source head drifted before abandonment');
    // Azure's PR update endpoint has no source-head compare-and-set field for
    // an abandonment mutation. Keep the provider-side guard inside this seam,
    // then verify the source head again after the status mutation. A race in
    // that window is reported as uncertain/manual recovery rather than a
    // successful cleanup claim.
    const raw = await this.client.patch(`${this.pullRequestsPath()}/${encodeURIComponent(ref.pullRequestId)}`, { status: 'abandoned' }, {}, '7.1');
    const abandoned = this.toPullRequestRef(decodePullRequest(raw));
    if (abandoned.status?.toLowerCase() !== 'abandoned') throw new AzureReposError('Azure did not report an abandoned pull request');
    const postAbandonSource = await this.sourceHead(current.sourceRef);
    if (postAbandonSource !== expectedSourceCommit) throw new AzureReposError('source head changed during abandonment; cleanup requires manual recovery');
    return abandoned;
  }

  async completePullRequest(ref: PullRequestRef, expectedTargetCommit: string): Promise<PullRequestCompletion> {
    if (ref.repositoryId !== this.options.repositoryId) throw new AzureReposError('pull request repository does not match the configured Repository');
    const current = await this.readPullRequest(ref);
    if (current.sourceRef !== ref.sourceRef || current.targetRef !== ref.targetRef) throw new AzureReposError('pull request refs drifted before completion');
    if (current.status?.toLowerCase() !== 'active') throw new AzureReposError('pull request is not active and cannot be completed');
    if (!ref.sourceCommit || current.sourceCommit !== ref.sourceCommit) throw new AzureReposError('pull request source commit drifted before completion');
    if (ref.workItemIds && !sameStringSet(ref.workItemIds, current.workItemIds ?? [])) throw new AzureReposError('pull request candidate Work Item association drifted before completion');
    const currentSource = await this.sourceHead(current.sourceRef);
    if (currentSource !== ref.sourceCommit) throw new AzureReposError('source head drifted before completion');
    const currentTarget = await this.targetHead(toHeadRef(ref.targetRef));
    if (currentTarget !== expectedTargetCommit) throw new AzureReposError('target commit drifted before completion');
    const raw = await this.client.patch(`${this.pullRequestsPath()}/${encodeURIComponent(ref.pullRequestId)}`, {
      status: 'completed',
      lastMergeSourceCommit: { commitId: current.sourceCommit },
      lastMergeTargetCommit: { commitId: expectedTargetCommit },
      completionOptions: { deleteSourceBranch: false, transitionWorkItems: false },
    }, {}, '7.1');
    const response = this.toPullRequestRef(decodePullRequest(raw));
    const completed = await this.readPullRequest(response);
    if (completed.status?.toLowerCase() !== 'completed') throw new AzureReposError('Azure did not report a completed pull request');
    if (completed.mergeStatus?.toLowerCase() !== 'succeeded') throw new AzureReposError('Azure did not report a successful pull request merge');
    if (completed.sourceCommit !== ref.sourceCommit || completed.targetCommit !== expectedTargetCommit) throw new AzureReposError('completed pull request source or target compare-and-set identity drifted');
    if (!completed.mergeCommit) throw new AzureReposError('completed pull request did not expose the merge commit');
    const observedTarget = await this.targetHead(toHeadRef(ref.targetRef));
    if (observedTarget !== completed.mergeCommit) throw new AzureReposError('post-merge target head does not match the completed pull request merge commit');
    return { pullRequestRef: completed, merged: true, targetCommit: observedTarget };
  }

  async remoteRoles(): Promise<RemoteRoleSnapshot> {
    const remotes = await this.git.run(['remote'], this.options.cwd);
    const roles: Array<{ name: string; push: boolean; fetch: boolean; url: string }> = [];
    for (const name of remotes.stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean)) {
      const fetch = (await this.git.run(['remote', 'get-url', name], this.options.cwd)).stdout.trim();
      let push = fetch;
      try { push = (await this.git.run(['remote', 'get-url', '--push', name], this.options.cwd)).stdout.trim() || fetch; } catch { push = fetch; }
      roles.push({ name, fetch: Boolean(fetch), push: Boolean(push) && !/^disabled:/i.test(push) && !/^no_push:/i.test(push), url: push || fetch });
    }
    return { roles };
  }

  async previewAdoption(request: AdoptionRequest): Promise<AdoptionPlan> {
    const current = await this.remoteRoles();
    const actions = [
      { kind: 'origin-fetch', detail: `set ${request.originRoleName} fetch URL to the configured Azure Repository` },
      { kind: 'origin-push', detail: `set ${request.originRoleName} as the only push-capable company remote` },
      { kind: 'template-upstream', detail: `set ${request.templateUpstreamRoleName} fetch-only and install a locally failing push URL` },
    ];
    return { request, actions: [...actions, { kind: 'audit', detail: `current remotes: ${current.roles.map((role) => `${role.name}:${role.push ? 'push' : 'fetch'}`).join(', ')}` }], digest: payloadHash({ request, actions }) };
  }

  async applyAdoption(command: MutationCommand<AdoptionPlan>): Promise<MutationResult<RemoteRoleSnapshot>> {
    const request = command.input.request;
    const currentPlan = await this.previewAdoption(request);
    if (command.input.digest !== currentPlan.digest || command.expectedRevision !== currentPlan.digest) {
      return { operationId: command.operationId, disposition: 'conflict', revision: currentPlan.digest, reason: 'adoption preview digest no longer matches current remotes' };
    }
    const roles = await this.remoteRoles();
    const origin = roles.roles.find((role) => role.name === request.originRoleName);
    if (!origin) return { operationId: command.operationId, disposition: 'conflict', revision: 'unknown', reason: `remote ${request.originRoleName} does not exist` };
    const companyOriginUrl = request.companyOriginUrl ?? this.options.companyOriginUrl;
    if (!companyOriginUrl || /github\.com/i.test(companyOriginUrl)) {
      return { operationId: command.operationId, disposition: 'conflict', revision: 'remote-plan', reason: 'the company origin URL must be an explicit non-GitHub Azure Repository URL' };
    }
    await this.git.run(['remote', 'set-url', request.originRoleName, companyOriginUrl], this.options.cwd);
    await this.git.run(['remote', 'set-url', '--push', request.originRoleName, companyOriginUrl], this.options.cwd);
    const upstream = roles.roles.find((role) => role.name === request.templateUpstreamRoleName);
    if (upstream) {
      await this.git.run(['remote', 'set-url', request.templateUpstreamRoleName, request.templateUpstreamUrl], this.options.cwd);
      await this.git.run(['remote', 'set-url', '--push', request.templateUpstreamRoleName, `disabled:${request.templateUpstreamRoleName}`], this.options.cwd);
    }
    const after = await this.remoteRoles();
    const forbidden = after.roles.filter((role) => role.name !== request.originRoleName && role.push);
    if (forbidden.length > 0) return { operationId: command.operationId, disposition: 'conflict', revision: payloadHash(after), value: after, reason: 'a personal GitHub push path remains after adoption' };
    return { operationId: command.operationId, disposition: 'applied', revision: payloadHash(after), value: after };
  }

  private decodePullRequestList(raw: unknown): WirePullRequest[] {
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) return [];
    return (raw as { value: unknown[] }).value.map(decodePullRequest);
  }

  private toPullRequestRef(pr: WirePullRequest): PullRequestRef {
    return { repositoryId: this.options.repositoryId, pullRequestId: String(pr.pullRequestId), url: pr.url, sourceRef: pr.sourceRefName, targetRef: pr.targetRefName, sourceCommit: pr.sourceCommit, targetCommit: pr.targetCommit, mergeCommit: pr.mergeCommit, mergeStatus: pr.mergeStatus, workItemIds: [...pr.workItemIds], title: pr.title, description: pr.description, status: pr.status };
  }

  private refsPath(): string {
    return `/${encodeURIComponent(this.options.projectName)}/_apis/git/repositories/${encodeURIComponent(this.options.repositoryId)}/refs`;
  }

  private pullRequestsPath(): string {
    return `/${encodeURIComponent(this.options.projectName)}/_apis/git/repositories/${encodeURIComponent(this.options.repositoryId)}/pullrequests`;
  }

  private decodeGitRefList(raw: unknown): ReturnType<typeof decodeGitRef>[] {
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) throw new AzureReposError('refs response is malformed');
    return (raw as { value: unknown[] }).value.map(decodeGitRef);
  }

  private assertRefUpdateSucceeded(raw: unknown, sourceRef: string, oldObjectId: string, newObjectId: string): void {
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) throw new AzureReposError('ref update response is malformed');
    const update = (raw as { value: unknown[] }).value.find((candidate) => typeof candidate === 'object' && candidate !== null && (candidate as { name?: unknown }).name === sourceRef) as Record<string, unknown> | undefined;
    if (!update || update.success !== true || update.updateStatus !== 'succeeded' || update.oldObjectId !== oldObjectId || update.newObjectId !== newObjectId) throw new AzureReposError(`Azure did not confirm the source ref update for ${sourceRef}`);
  }

  private assertTargetRef(ref: string): void {
    if (ref !== this.options.targetRef) throw new AzureReposError(`target ref ${ref} is not the configured protected target`);
  }

  private assertSourceRef(ref: string): void {
    if (!ref.startsWith('refs/heads/') || ref === this.options.targetRef) throw new AzureReposError('source ref must be a descriptive branch and cannot equal the protected target');
  }
}

function zeroObjectId(): string {
  return '0000000000000000000000000000000000000000';
}

function toHeadRef(ref: string): string {
  return ref.startsWith('refs/heads/') ? ref : `refs/heads/${ref}`;
}

function sameStringSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();
  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}
