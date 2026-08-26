import type { IntegrationTarget, PolicyInventory, PolicyRequirement, PolicySnapshot, PullRequestRef, PolicyVerdict } from '../../domain/types.ts';
import type { PolicyAdapter } from '../ports.ts';
import { decodePolicyConfiguration, decodePolicyEvaluation } from './models.ts';
import type { AzureHttpClient } from './http.ts';

export interface AzurePolicyOptions {
  client: AzureHttpClient;
  projectName: string;
  repositoryId: string;
  clock?: () => string;
}

export class AzurePolicyError extends Error {
  constructor(message: string) {
    super(`azure policy: ${message}`);
    this.name = 'AzurePolicyError';
  }
}

export function mapPolicyStatus(status: string): PolicyVerdict {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'succeeded':
      return 'passed';
    case 'queued':
    case 'running':
      return 'pending';
    case 'rejected':
      return 'failed';
    case 'broken':
      return 'blocked';
    case 'notapplicable':
    case 'not-applicable':
      return 'passed';
    default:
      return 'unavailable';
  }
}

export function aggregatePolicy(outcomes: PolicyVerdict[]): PolicyVerdict {
  if (outcomes.some((outcome) => outcome === 'unavailable')) return 'unavailable';
  if (outcomes.some((outcome) => outcome === 'blocked')) return 'blocked';
  if (outcomes.some((outcome) => outcome === 'failed')) return 'failed';
  if (outcomes.some((outcome) => outcome === 'pending')) return 'pending';
  if (outcomes.some((outcome) => outcome === 'unexecuted')) return 'unexecuted';
  return 'passed';
}

export class AzurePolicyAdapter implements PolicyAdapter {
  private readonly client: AzureHttpClient;
  private readonly options: AzurePolicyOptions;
  private readonly clock: () => string;

  constructor(options: AzurePolicyOptions) {
    this.client = options.client;
    this.options = options;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  async inspectTarget(target: IntegrationTarget): Promise<PolicyInventory> {
    this.assertRepository(target);
    const raw = await this.client.get(`/${encodeURIComponent(this.options.projectName)}/_apis/git/policy/configurations`, { repositoryId: this.options.repositoryId, refName: target.targetRef }, '7.1');
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) throw new AzurePolicyError('policy configuration inventory is malformed');
    const configurations = (raw as { value: unknown[] }).value.map(decodePolicyConfiguration);
    const effectiveBlocking: PolicyRequirement[] = configurations.filter((configuration) => configuration.isEnabled && configuration.isBlocking).map((configuration) => ({ id: String(configuration.id), name: configuration.type.displayName, source: 'azure-repos-policy', kind: 'provider', verdict: 'unavailable', detail: 'policy evaluation has not been read', appliedToCommit: undefined }));
    return { target, observedAt: this.clock(), sources: [{ name: 'azure-repos-policy-configurations', outcome: 'read' }], effectiveBlocking };
  }

  async evaluatePullRequest(ref: PullRequestRef): Promise<PolicySnapshot> {
    const inventory = await this.inspectTarget({ repositoryId: ref.repositoryId, targetRef: ref.targetRef });
    const artifactId = `vstfs:///CodeReview/CodeReviewId/${encodeURIComponent(ref.repositoryId)}/${encodeURIComponent(ref.pullRequestId)}`;
    const raw = await this.client.get(`/${encodeURIComponent(this.options.projectName)}/_apis/policy/evaluations`, { artifactId, includeNotApplicable: 'true' }, '7.1-preview.1');
    if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { value?: unknown }).value)) throw new AzurePolicyError('policy evaluation inventory is malformed');
    const evaluations = (raw as { value: unknown[] }).value.map(decodePolicyEvaluation);
    const mapped = inventory.effectiveBlocking.map((requirement) => {
      const evaluation = evaluations.find((candidate) => candidate.configurationId === Number(requirement.id));
      return { ...requirement, verdict: evaluation ? mapPolicyStatus(evaluation.status) : 'unavailable', detail: evaluation?.status ?? 'missing policy evaluation' };
    });
    const applicable = mapped.filter((item) => item.verdict !== 'passed' || !/not.?applicable/i.test(item.detail ?? ''));
    return { target: inventory.target, pullRequestRef: ref, headCommit: ref.sourceCommit ?? '', observedAt: this.clock(), inventory: { ...inventory, effectiveBlocking: applicable }, evaluations: applicable, aggregate: aggregatePolicy(applicable.map((item) => item.verdict)) };
  }

  private assertRepository(target: IntegrationTarget): void {
    if (target.repositoryId !== this.options.repositoryId) throw new AzurePolicyError('policy adapter is bound to another repository');
  }
}
