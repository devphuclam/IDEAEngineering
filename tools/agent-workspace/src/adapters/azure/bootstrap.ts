import type {
  MutationCommand,
  MutationResult,
  PreparationApplyResult,
  PreparationPlan,
  PreparationResult,
  ReadinessReport,
} from '../../domain/types.ts';
import type { ProviderPreparationAdapter } from '../ports.ts';
import type { AzureDevOpsConfig } from '../../config/provider.ts';
import { payloadHash } from '../../domain/mutations.ts';
import { replaceManagedBlock } from './blocks.ts';
import { createWorkItem, patchWorkItem, queryWorkItems, readWorkItem, testRevision } from './api.ts';
import { queueKeyTag, queueTitle, resolveTarget, type ResolvedTarget, QUEUE_DISCOVERY_TAG } from './target.ts';
import type { AzureHttpClient } from './http.ts';
import { AzureAuthenticator, type AuthSelection } from './auth.ts';
import { resolveProcessMapping } from './process-mapping.ts';
import { GIT_REPOSITORIES_NAMESPACE, WORK_ITEM_NAMESPACE, probePermissionBatch, type CapabilityProbe, type NamespaceDiscovery, type PermissionBatchReader, type PermissionOperation } from './permissions.ts';
import type { AzureSourceHostAdapter } from './repos.ts';
import type { AzurePolicyAdapter } from './policies.ts';
import { parseQueueManifest } from './blocks.ts';
import type { QueueManifest } from '../../domain/types.ts';

export interface AzureBootstrapOptions {
  client: AzureHttpClient;
  config: AzureDevOpsConfig;
  authenticator?: AzureAuthenticator;
  authSelection?: AuthSelection;
  sourceHost?: AzureSourceHostAdapter;
  policyAdapter?: AzurePolicyAdapter;
  namespaceDiscovery?: NamespaceDiscovery;
  permissionBatchReader?: PermissionBatchReader;
  capabilities?: CapabilityProbe[];
  identity?: string;
  runtimeOutcome?: ReadinessReport['runtime']['outcome'];
  clock?: () => string;
}

export class AzureBootstrapError extends Error {
  constructor(message: string) {
    super(`azure bootstrap: ${message}`);
    this.name = 'AzureBootstrapError';
  }
}

function initialManifest(resolved: ResolvedTarget): QueueManifest {
  return {
    schema: 'agent-workspace/queue-manifest',
    version: 1,
    queueKey: resolved.queueKey,
    organizationUrl: resolved.organizationUrl,
    projectId: resolved.project.id,
    repositoryId: resolved.repository.id,
    targetRef: resolved.integrationTarget,
    nextEnqueueSequence: 1,
    entries: [],
    lease: null,
    lastOperation: null,
    pendingPublication: null,
  };
}

export class AzurePreparationAdapter implements ProviderPreparationAdapter {
  private readonly options: AzureBootstrapOptions;
  private readonly clock: () => string;
  private auth: AuthSelection | undefined;
  private resolved: ResolvedTarget | undefined;

  constructor(options: AzureBootstrapOptions) {
    this.options = options;
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  async readiness(): Promise<ReadinessReport> {
    const observedAt = this.clock();
    let auth: AuthSelection | undefined;
    try {
      auth = this.options.authSelection ?? (this.options.authenticator ? await this.options.authenticator.select() : { source: 'none', detail: 'authenticator not configured' });
      this.auth = auth;
    } catch {
      auth = { source: 'none', detail: 'credential selection unavailable' };
    }
    let target: ResolvedTarget | undefined;
    let targetOutcome: ReadinessReport['target'] = { outcome: 'unavailable', detail: 'target has not been resolved' };
    try {
      target = await this.resolve();
      targetOutcome = { outcome: 'passed', detail: `${target.project.id}/${target.repository.id}/${target.integrationTarget}` };
    } catch (error) {
      targetOutcome = { outcome: 'unavailable', detail: error instanceof Error ? error.message : String(error) };
    }
    let permissions: ReadinessReport['permissions'] = [];
    try {
      permissions = await this.permissionResults(target, observedAt);
    } catch (error) {
      permissions = [{
        operation: 'permission-matrix',
        namespaceId: 'unavailable',
        token: 'unavailable',
        permissionName: 'unavailable',
        permissionBit: 0,
        effective: 'unknown',
        capabilityReads: [],
        observedAt,
        nextAction: error instanceof Error ? error.message : 'permission namespace/action drift requires administrator review',
      }];
    }
    let processMapping: ReadinessReport['processMapping'];
    try {
      if (target) processMapping = resolveProcessMapping(this.options.config.process.profile, this.options.config.process.workItemType, { process: target.process, workItemType: target.workItemTypeMetadata, observedAt }, this.options.config.process.override, this.options.config.process.expectedFingerprint, observedAt);
    } catch (error) {
      processMapping = { profile: this.options.config.process.profile, workItemType: this.options.config.process.workItemType, observedProcessFingerprint: 'unavailable', stateMap: {}, drift: error instanceof Error ? error.message : String(error) };
    }
    let remoteRoles: ReadinessReport['remoteRoles'] = { roles: [] };
    try { if (this.options.sourceHost) remoteRoles = await this.options.sourceHost.remoteRoles(); } catch { remoteRoles = { roles: [] }; }
    let policyVisibility: ReadinessReport['policyVisibility'] = { inventorySources: [{ name: 'azure-policy', outcome: 'unavailable' }], effectiveBlockingCount: 0 };
    try { if (this.options.policyAdapter && target) { const inventory = await this.options.policyAdapter.inspectTarget({ repositoryId: target.repository.id, targetRef: target.integrationTarget }); policyVisibility = { inventorySources: inventory.sources, effectiveBlockingCount: inventory.effectiveBlocking.length }; } } catch { /* retain unavailable */ }
    let queueOutcome: ReadinessReport['queue'] = { outcome: 'unavailable', detail: 'canonical queue discovery has not completed' };
    try {
      if (target) {
        const records = await this.findQueueRecords(target);
        queueOutcome = { outcome: 'passed', detail: records.length === 0 ? 'canonical queue read completed; no coordination Work Item exists yet' : `canonical queue read completed; ${records.length} matching coordination Work Item${records.length === 1 ? '' : 's'} found` };
      }
    } catch (error) {
      queueOutcome = { outcome: 'unavailable', detail: error instanceof Error ? error.message : 'canonical queue discovery failed' };
    }
    return {
      provider: 'azure-devops',
      observedAt,
      configuration: { outcome: 'passed' },
      runtime: { outcome: this.options.runtimeOutcome ?? 'not-selected', detail: this.options.runtimeOutcome === 'unsupported' ? 'native Windows is not supported for local-agent-v1' : 'runtime is optional' },
      authentication: { outcome: auth?.credential ? 'passed' : 'unavailable', detail: auth?.detail },
      target: targetOutcome,
      permissions,
      processMapping,
      remoteRoles,
      policyVisibility,
      queue: queueOutcome,
      network: target && queueOutcome.outcome === 'passed' ? { outcome: 'passed', detail: 'read-only target and canonical queue transport completed' } : { outcome: 'unavailable', detail: 'network/readiness calls did not complete' },
    };
  }

  async preview(): Promise<PreparationPlan> {
    const resolved = await this.resolve();
    const title = queueTitle(resolved.repository.name, resolved.integrationTarget);
    const tags = [QUEUE_DISCOVERY_TAG, queueKeyTag(resolved.queueKey)].sort();
    const plan: PreparationPlan = {
      applicability: 'applicable',
      digest: payloadHash({ queueKey: resolved.queueKey, organizationUrl: resolved.organizationUrl, projectId: resolved.project.id, repositoryId: resolved.repository.id, targetRef: resolved.integrationTarget, title, tags }),
      actions: [
        { kind: 'queue-work-item', detail: `create or reuse exactly one ${title}` },
        { kind: 'queue-fields', detail: 'set System.Title, the Queue Manifest managed Description slice, and the two reserved tags only' },
      ],
      queue: { queueKey: resolved.queueKey, workItemType: this.options.config.process.workItemType, title, fields: ['System.Title', 'System.Description'], tags },
    };
    return plan;
  }

  async apply(command: MutationCommand<PreparationPlan>): Promise<PreparationApplyResult> {
    const plan = await this.preview();
    if (command.input.digest !== plan.digest) return { operationId: command.operationId, disposition: 'conflict', revision: 'plan', reason: 'preview digest no longer matches current target' };
    const resolved = await this.resolve();
    const existing = await this.findQueueRecords(resolved);
    if (existing.length > 1) return { operationId: command.operationId, disposition: 'conflict', revision: 'queue-discovery', reason: `found ${existing.length} valid queue records; administrator remediation is required` };
    let queueId: string;
    if (existing.length === 0) {
      const created = await createWorkItem(this.options.client, { projectName: this.options.config.project.name, clock: this.clock }, this.options.config.process.workItemType, [
        { op: 'add', path: '/fields/System.Title', value: plan.queue?.title },
        { op: 'add', path: '/fields/System.Description', value: replaceManagedBlock('', 'queue-manifest', initialManifest(resolved)).description },
        { op: 'add', path: '/fields/System.Tags', value: plan.queue?.tags.join('; ') },
      ]);
      queueId = String(created.wire.id);
    } else {
      queueId = existing[0];
      const snapshot = await readWorkItem(this.options.client, { projectName: this.options.config.project.name, clock: this.clock }, queueId);
      const description = String(snapshot.wire.fields['System.Description'] ?? '');
      const parsed = parseQueueManifest(description).value;
      const nextDescription = replaceManagedBlock(description, 'queue-manifest', parsed).description;
      const currentTags = String(snapshot.wire.fields['System.Tags'] ?? '').split(';').map((tag) => tag.trim()).filter(Boolean);
      const nextTags = [...new Set([...currentTags, ...(plan.queue?.tags ?? [])])].sort();
      const operations: unknown[] = [testRevision(snapshot.revision)];
      if (snapshot.wire.fields['System.Title'] !== plan.queue?.title) operations.push({ op: 'replace', path: '/fields/System.Title', value: plan.queue?.title });
      if (nextDescription !== description) operations.push({ op: 'replace', path: '/fields/System.Description', value: nextDescription });
      if (nextTags.join('; ') !== currentTags.join('; ')) operations.push({ op: 'replace', path: '/fields/System.Tags', value: nextTags.join('; ') });
      if (operations.length > 1) await patchWorkItem(this.options.client, { projectName: this.options.config.project.name, clock: this.clock }, queueId, operations);
    }
    return { operationId: command.operationId, disposition: 'applied', revision: String(queueId), value: { queueWorkItemId: queueId, queueKey: resolved.queueKey, appliedAt: this.clock() } satisfies PreparationResult };
  }

  private async resolve(): Promise<ResolvedTarget> {
    if (!this.resolved) this.resolved = await resolveTarget(this.options.client, this.options.config);
    return this.resolved;
  }

  private async findQueueRecords(resolved: ResolvedTarget): Promise<string[]> {
    const ids = await queryWorkItems(this.options.client, { projectName: this.options.config.project.name, clock: this.clock }, `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = @project AND [System.Tags] CONTAINS '${QUEUE_DISCOVERY_TAG}'`);
    const matches: string[] = [];
    for (const id of ids) {
      try {
        const snapshot = await readWorkItem(this.options.client, { projectName: this.options.config.project.name, clock: this.clock }, id);
        const tags = String(snapshot.wire.fields['System.Tags'] ?? '').split(';').map((tag) => tag.trim());
        if (!tags.includes(QUEUE_DISCOVERY_TAG) || !tags.includes(queueKeyTag(resolved.queueKey))) continue;
        const manifest = parseQueueManifest(String(snapshot.wire.fields['System.Description'] ?? '')).value;
        if (manifest.queueKey === resolved.queueKey && manifest.repositoryId === resolved.repository.id && manifest.targetRef === resolved.integrationTarget) matches.push(id);
      } catch { /* invalid candidate is not canonical */ }
    }
    return matches;
  }

  private async permissionResults(target: ResolvedTarget | undefined, now: string) {
    if (!target || !this.options.namespaceDiscovery || !this.options.permissionBatchReader) return [];
    const operations: PermissionOperation[] = [
      { operation: 'work-item.read', namespaceId: WORK_ITEM_NAMESPACE, token: `vstfs:///Classification/Node/${target.areaNode.id}`, permissionName: 'WORK_ITEM_READ', permissionBit: 1 },
      { operation: 'queue-work-item.update', namespaceId: WORK_ITEM_NAMESPACE, token: `vstfs:///Classification/Node/${target.areaNode.id}`, permissionName: 'WORK_ITEM_WRITE', permissionBit: 32 },
      { operation: 'git.read', namespaceId: GIT_REPOSITORIES_NAMESPACE, token: `repoV2/${target.project.id}/${target.repository.id}`, permissionName: 'GenericRead', permissionBit: 1 },
      { operation: 'source-branch.push', namespaceId: GIT_REPOSITORIES_NAMESPACE, token: `repoV2/${target.project.id}/${target.repository.id}`, permissionName: 'GenericContribute', permissionBit: 2 },
      { operation: 'pull-request.read', namespaceId: GIT_REPOSITORIES_NAMESPACE, token: `repoV2/${target.project.id}/${target.repository.id}`, permissionName: 'GenericRead', permissionBit: 1 },
      { operation: 'pull-request.complete', namespaceId: GIT_REPOSITORIES_NAMESPACE, token: `repoV2/${target.project.id}/${target.repository.id}`, permissionName: 'PullRequestContribute', permissionBit: 32 },
    ];
    return probePermissionBatch(this.options.namespaceDiscovery, this.options.permissionBatchReader, operations, this.options.identity ?? 'current-user', this.options.capabilities ?? [], now);
  }
}
