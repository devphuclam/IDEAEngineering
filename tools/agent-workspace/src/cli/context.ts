// Provider-selected CLI wiring. The legacy feature-001 fields remain as a
// compatibility shell for existing commands/tests; new provider operations
// use the optional provider-neutral ports below and never infer a provider
// from the Git remote.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { loadProviderConfig, type ProviderConfig } from '../config/provider.ts';
import { SerializedGh, classifyGhError } from '../adapters/github/gh.ts';
import { GitHubClaimStore } from '../adapters/github/claims.ts';
import { GitHubEvidenceStore } from '../adapters/github/evidence.ts';
import { GitHubSourceHostAdapter } from '../adapters/github/source-host.ts';
import { GitHubWorkItemAdapter } from '../adapters/github/work-items.ts';
import { GithubCanonicalQueueStore, type GithubIssueStore } from '../adapters/github/queue.ts';
import { GithubPreparationAdapter } from '../adapters/github/preparation.ts';
import {
  GithubProviderClaimStore,
  GithubProviderEvidenceStore,
  GithubProviderPolicyAdapter,
  GithubProviderSourceHostAdapter,
  GithubProviderWorkItemAdapter,
} from '../adapters/github/provider.ts';
import { LocalRunnerAdapter } from '../adapters/local/runner.ts';
import { LocalRuntimeReadinessAdapter } from '../adapters/local/runtime-readiness.ts';
import { LocalVerificationRunnerImpl } from '../adapters/local/verification.ts';
import { CodexDesktopDriver } from '../adapters/local/codex-driver.ts';
import { AzureAuthenticator, EnvironmentPatSource, type AuthSelection } from '../adapters/azure/auth.ts';
import { AzureHttpClient, FetchHttpTransport } from '../adapters/azure/http.ts';
import { AzureWorkItemAdapter } from '../adapters/azure/boards.ts';
import { AzureClaimStore } from '../adapters/azure/claims.ts';
import { AzureEvidenceStore } from '../adapters/azure/evidence.ts';
import { AzureCanonicalQueueStore } from '../adapters/azure/queue.ts';
import { AzureSourceHostAdapter } from '../adapters/azure/repos.ts';
import { AzurePolicyAdapter } from '../adapters/azure/policies.ts';
import { AzurePreparationAdapter } from '../adapters/azure/bootstrap.ts';
import { AzureNamespaceReader, AzurePermissionBatchReader } from '../adapters/azure/permissions.ts';
import { canonicalQueueKey } from '../adapters/azure/target.ts';
import { azureStateMap, createAzureLegacyAdapters } from './azure-legacy.ts';
import { capabilityError, credentialError, normalizeError, WorkspaceError } from '../errors.ts';
import type { AgentDriver, CanonicalQueueStore, ClaimStore, EvidenceStore, LegacyClaimStore, LegacyEvidenceStore, LegacySourceHostAdapter, LegacyWorkItemAdapter, LocalVerificationRunner, PolicyAdapter, ProviderPreparationAdapter, RuntimeReadinessAdapter, RunnerAdapter, SourceHostAdapter, WorkItemAdapter } from '../adapters/ports.ts';

const execFileAsync = promisify(execFile);

export interface CliContext {
  cwd: string;
  provider?: 'github' | 'azure-devops';
  gh: SerializedGh;
  repo: string;
  owner: string;
  repoError?: WorkspaceError;
  ownerError?: WorkspaceError;
  // Feature-001 compatibility surface.
  claims: LegacyClaimStore;
  workItems: LegacyWorkItemAdapter;
  runner: RunnerAdapter;
  driver: AgentDriver & CodexDesktopDriver;
  evidence: LegacyEvidenceStore;
  sourceHost: LegacySourceHostAdapter;
  // Provider-neutral surface used by new commands/adapters.
  providerPorts?: {
    workItems: WorkItemAdapter;
    claims: ClaimStore;
    evidence: EvidenceStore;
    queue: CanonicalQueueStore;
    sourceHost: SourceHostAdapter;
    policies: PolicyAdapter;
    verification: LocalVerificationRunner;
    preparation: ProviderPreparationAdapter;
    runtime: RuntimeReadinessAdapter;
  };
  config?: ProviderConfig;
}

async function detectRepo(cwd: string, remoteName: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', ['remote', 'get-url', remoteName], { cwd, encoding: 'utf8' });
    const url = stdout.trim();
    const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) throw capabilityError(`remote ${remoteName} is not a GitHub repository: ${url}`);
    return `${match[1]}/${match[2]}`;
  } catch (error) {
    if (error instanceof WorkspaceError) throw error;
    const detail = `${(error as { stderr?: string }).stderr ?? ''}`;
    if (detail.toLowerCase().includes('no such remote')) throw capabilityError(`no git remote \`${remoteName}\` configured; doctor reports this as missing`);
    throw normalizeError(error, 'REMOTE_UNAVAILABLE', 'capability');
  }
}

function unavailableLegacy(message: string): { claims: LegacyClaimStore; workItems: LegacyWorkItemAdapter; evidence: LegacyEvidenceStore; sourceHost: LegacySourceHostAdapter } {
  const fail = async (): Promise<never> => { throw capabilityError(message); };
  return {
    claims: { acquire: fail, renew: fail, handoff: fail, release: fail, expire: fail, active: fail, records: fail },
    workItems: { read: fail, appendEvidence: fail, setState: fail, listOpen: fail },
    evidence: { persist: fail, read: fail, list: fail },
    sourceHost: { createBranch: fail, pushCheckpoint: fail, openPullRequest: fail, requiredChecks: fail, readCheckpoints: fail, recordCheckpoint: fail, remoteCommit: fail, mergePullRequest: fail },
  };
}

class GhIssueStore implements GithubIssueStore {
  private readonly gh: SerializedGh;
  private readonly repo: string;
  constructor(gh: SerializedGh, repo: string) { this.gh = gh; this.repo = repo; }
  async readIssue(issueNumber: number) { return JSON.parse(await this.gh.run(['api', `repos/${this.repo}/issues/${issueNumber}`, '--jq', '{number,labels:[.labels[].name],title,body}'])) as { number: number; labels: string[]; title: string; body: string }; }
  async listComments(issueNumber: number) { const raw = await this.gh.run(['api', `repos/${this.repo}/issues/${issueNumber}/comments`, '--jq', '.[] | {id,body,created_at}']); return raw.split(/\r?\n/).filter(Boolean).map((line) => { const item = JSON.parse(line) as { id: number; body: string; created_at: string }; return { id: item.id, body: item.body, createdAt: item.created_at }; }); }
  async addComment(issueNumber: number, body: string) { const raw = await this.gh.run(['api', `repos/${this.repo}/issues/${issueNumber}/comments`, '--method', 'POST', '--field', `body=${body}`]); const item = JSON.parse(raw) as { id: number; body: string; created_at: string }; return { id: item.id, body: item.body, createdAt: item.created_at }; }
  async createIssue(input: { title: string; body: string; labels: string[] }) { const raw = await this.gh.run(['issue', 'create', '--title', input.title, '--body', input.body, ...input.labels.flatMap((label) => ['--label', label]), '-R', this.repo, '--json', 'number']); return JSON.parse(raw) as { number: number }; }
  async findIssues(labels: string[]) { const raw = await this.gh.run(['issue', 'list', '--state', 'all', '--label', labels.join(','), '--json', 'number,labels', '-R', this.repo]); return JSON.parse(raw) as Array<{ number: number; labels: string[] }>; }
}

export interface CreateContextOptions {
  configPath?: string;
  githubGh?: SerializedGh;
  azureTransport?: import('../adapters/azure/http.ts').HttpTransport;
  azureAuth?: AuthSelection;
}

export async function createContext(cwd: string, options: CreateContextOptions = {}): Promise<CliContext> {
  let config: ProviderConfig;
  try {
    config = loadProviderConfig(options.configPath ?? resolve(cwd, 'agent-workspace.config.json'));
  } catch (error) {
    throw normalizeError(error, 'CONFIGURATION_INVALID', 'usage');
  }
  const runner = new LocalRunnerAdapter(cwd);
  const driver = new CodexDesktopDriver();
  const verification = new LocalVerificationRunnerImpl();
  const runtime = new LocalRuntimeReadinessAdapter({ runtimeProfile: config.runtimeProfile, cwd });

  if (config.provider === 'github') {
    const gh = options.githubGh ?? new SerializedGh();
    let repo = '';
    let repoError: WorkspaceError | undefined;
    try { repo = await detectRepo(cwd, config.github?.remote ?? 'origin'); } catch (error) { repoError = normalizeError(error, 'REMOTE_UNAVAILABLE', 'capability'); }
    const owner = process.env.AGENT_WORKSPACE_ACTOR ?? '';
    const ownerError: WorkspaceError | undefined = owner ? undefined : credentialError('GitHub identity is resolved on the first provider operation');
    const legacy = { claims: new GitHubClaimStore(gh, repo), workItems: new GitHubWorkItemAdapter(gh, repo), evidence: new GitHubEvidenceStore(gh, repo, cwd), sourceHost: new GitHubSourceHostAdapter(gh, repo, cwd) };
    const issueStore = new GhIssueStore(gh, repo);
    const queue = new GithubCanonicalQueueStore(issueStore, { repositoryId: repo || 'unresolved-github-repository', targetRef: 'refs/heads/main', repositoryName: repo.split('/')[1] ?? 'repository' });
    const githubOptions = {
      gh,
      repository: repo,
      cwd,
      remoteName: config.github?.remote ?? 'origin',
      targetRef: 'refs/heads/main',
      reviewIntent: config.reviewIntent,
    };
    const modernWorkItems = new GithubProviderWorkItemAdapter(githubOptions);
    const modernClaims = new GithubProviderClaimStore(githubOptions, modernWorkItems);
    const modernEvidence = new GithubProviderEvidenceStore(githubOptions, modernWorkItems);
    const modernSourceHost = new GithubProviderSourceHostAdapter(githubOptions);
    const modernPolicies = new GithubProviderPolicyAdapter(githubOptions);
    return { cwd, provider: 'github', gh, repo, owner, repoError, ownerError, claims: legacy.claims, workItems: legacy.workItems, runner, driver, evidence: legacy.evidence, sourceHost: legacy.sourceHost, config, providerPorts: { workItems: modernWorkItems, claims: modernClaims, evidence: modernEvidence, queue, sourceHost: modernSourceHost, policies: modernPolicies, verification, preparation: new GithubPreparationAdapter(), runtime } };
  }

  const azureConfig = config.azureDevOps;
  if (!azureConfig) throw capabilityError('azure-devops provider requires azureDevOps configuration');
  const gh = new SerializedGh(async () => { throw new Error('GitHub is not selected; Azure provider commands must not invoke gh'); });
  const authenticator = new AzureAuthenticator({ tenantId: azureConfig.authentication.tenantId, patFallback: { mode: azureConfig.authentication.patFallback.mode, source: new EnvironmentPatSource(azureConfig.authentication.patFallback.secretEnvironmentVariable) } });
  const runtimeInspection = await runtime.inspect();
  const currentAuth = options.azureAuth ?? (runtimeInspection.state === 'ready'
    ? await authenticator.select()
    : { source: 'none' as const, detail: `Azure authentication is not-run because runtime is ${runtimeInspection.state}` });
  const authRef = { current: currentAuth };
  const client = new AzureHttpClient(options.azureTransport ?? new FetchHttpTransport(), () => authRef.current.credential, azureConfig.organizationUrl, '7.1', () => authRef.current.source);
  const projectId = azureConfig.project.expectedId ?? 'unresolved-project-id';
  const repositoryId = azureConfig.repository.expectedId ?? 'unresolved-repository-id';
  const target = { repositoryId, targetRef: azureConfig.integrationTarget };
  const boardsOptions = { client, projectName: azureConfig.project.name, integrationTarget: azureConfig.integrationTarget, stateMap: azureStateMap(azureConfig), clock: () => new Date().toISOString() };
  const boards = new AzureWorkItemAdapter(boardsOptions);
  const claims = new AzureClaimStore(boardsOptions);
  const evidence = new AzureEvidenceStore(boardsOptions, boards);
  const queue = new AzureCanonicalQueueStore({ ...boardsOptions, organizationUrl: azureConfig.organizationUrl, projectId, repositoryId, targetRef: target.targetRef, queueKey: canonicalQueueKey(azureConfig.organizationUrl, projectId, repositoryId, target.targetRef) });
  const companyOriginUrl = `${azureConfig.organizationUrl.replace(/\/+$/, '')}/${encodeURIComponent(azureConfig.project.name)}/_git/${encodeURIComponent(azureConfig.repository.name)}`;
  const sourceHost = new AzureSourceHostAdapter({ client, projectName: azureConfig.project.name, repositoryId, targetRef: target.targetRef, cwd, companyOriginUrl, authProvider: () => authRef.current });
  const policies = new AzurePolicyAdapter({ client, projectName: azureConfig.project.name, repositoryId });
  const preparation = new AzurePreparationAdapter({
    client,
    config: azureConfig,
    authenticator,
    authSelection: currentAuth,
    sourceHost,
    policyAdapter: policies,
    namespaceDiscovery: new AzureNamespaceReader(client),
    permissionBatchReader: new AzurePermissionBatchReader(client),
    identity: process.env.AGENT_WORKSPACE_ACTOR ?? 'current-user',
    runtimeOutcome: runtimeInspection.state === 'ready' ? 'passed' : runtimeInspection.state === 'unsupported' ? 'unsupported' : runtimeInspection.state === 'not-selected' ? 'not-selected' : 'unavailable',
  });
  const legacy = createAzureLegacyAdapters({ boards, claims, evidence, sourceHost, cwd, verificationCommands: config.verification.commands });
  return { cwd, provider: 'azure-devops', gh, repo: '', owner: process.env.AGENT_WORKSPACE_ACTOR ?? 'azure-user', claims: legacy.claims, workItems: legacy.workItems, runner, driver, evidence: legacy.evidence, sourceHost: legacy.sourceHost, config, providerPorts: { workItems: boards, claims, evidence, queue, sourceHost, policies, verification, preparation, runtime } };
}

function unavailableModern<T extends object>(message: string): T {
  return new Proxy({} as T, {
    get: () => async () => { throw capabilityError(message); },
  });
}

export function requireGitHubContext(ctx: CliContext, requireOwner = true): void {
  if (ctx.provider === 'azure-devops') {
    if (!ctx.providerPorts) throw capabilityError('Azure provider ports are unavailable');
    if (requireOwner && !ctx.owner) throw credentialError('Azure identity is unavailable');
    return;
  }
  if (ctx.provider && ctx.provider !== 'github') throw capabilityError(`GitHub command is unavailable because provider '${ctx.provider}' is selected`);
  if (ctx.repoError || !ctx.repo) throw ctx.repoError ?? capabilityError('no GitHub repository remote is available');
  if (ctx.providerPorts && ctx.provider === 'github') return;
  if (requireOwner && (ctx.ownerError || !ctx.owner)) throw ctx.ownerError ?? credentialError('gh identity is unavailable; run `gh auth login`');
}

export function ghStatus(cwd: string): Promise<string> { return execFileAsync('gh', ['auth', 'status'], { cwd, encoding: 'utf8' }).then((r) => r.stdout); }

export { classifyGhError };
