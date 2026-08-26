import { SecretString } from '../../../src/adapters/azure/auth.ts';
import { AzureHttpClient } from '../../../src/adapters/azure/http.ts';
import { AzureWorkItemAdapter, type AzureBoardsOptions } from '../../../src/adapters/azure/boards.ts';
import { AzureClaimStore } from '../../../src/adapters/azure/claims.ts';
import { AzureEvidenceStore } from '../../../src/adapters/azure/evidence.ts';
import { AzureCanonicalQueueStore } from '../../../src/adapters/azure/queue.ts';
import { AzurePolicyAdapter } from '../../../src/adapters/azure/policies.ts';
import { canonicalQueueKey } from '../../../src/adapters/azure/target.ts';
import type { AzureDevOpsConfig } from '../../../src/config/provider.ts';
import type { IntegrationTarget } from '../../../src/domain/types.ts';
import { FakeAzureState } from '../../../src/adapters/fakes/azure.ts';

export const offlineConfig: AzureDevOpsConfig = {
  organizationUrl: 'https://offline.invalid/offline-organization',
  project: { name: 'offline-project', expectedId: '00000000-0000-0000-0000-000000000001' },
  repository: { name: 'offline-repository', expectedId: '00000000-0000-0000-0000-000000000002' },
  integrationTarget: 'refs/heads/main',
  process: { profile: 'agile@1', workItemType: 'User Story', expectedFingerprint: null, override: null },
  authentication: {
    preferred: 'entra-user',
    tenantId: null,
    patFallback: { mode: 'disabled', secretEnvironmentVariable: 'AGENT_WORKSPACE_AZURE_PAT' },
  },
  remoteRoles: { companyOrigin: 'origin', templateUpstream: 'template-upstream' },
};

export interface OfflineAzureAdapters {
  state: FakeAzureState;
  client: AzureHttpClient;
  target: IntegrationTarget;
  boardsOptions: AzureBoardsOptions;
  boards: AzureWorkItemAdapter;
  claims: AzureClaimStore;
  evidence: AzureEvidenceStore;
  queue: AzureCanonicalQueueStore;
  policies: AzurePolicyAdapter;
}

export function makeOfflineAzureAdapters(state = new FakeAzureState()): OfflineAzureAdapters {
  const client = new AzureHttpClient(state.transport(), () => SecretString.from('offline-only-token'), offlineConfig.organizationUrl);
  const target: IntegrationTarget = { repositoryId: offlineConfig.repository.expectedId!, targetRef: offlineConfig.integrationTarget };
  const boardsOptions: AzureBoardsOptions = {
    client,
    projectName: offlineConfig.project.name,
    projectId: offlineConfig.project.expectedId!,
    organizationUrl: offlineConfig.organizationUrl,
    integrationTarget: offlineConfig.integrationTarget,
    clock: () => '2026-08-14T00:00:00.000Z',
  };
  const boards = new AzureWorkItemAdapter(boardsOptions);
  const claims = new AzureClaimStore({ ...boardsOptions, publisherId: 'offline-claims' });
  const evidence = new AzureEvidenceStore({ ...boardsOptions, publisherId: 'offline-evidence' }, boards);
  const queue = new AzureCanonicalQueueStore({
    ...boardsOptions,
    organizationUrl: offlineConfig.organizationUrl,
    projectId: offlineConfig.project.expectedId!,
    repositoryId: target.repositoryId,
    targetRef: target.targetRef,
    queueKey: canonicalQueueKey(offlineConfig.organizationUrl, offlineConfig.project.expectedId!, target.repositoryId, target.targetRef),
  });
  const policies = new AzurePolicyAdapter({
    client,
    projectName: offlineConfig.project.name,
    repositoryId: target.repositoryId,
    clock: () => '2026-08-14T00:00:00.000Z',
  });
  return { state, client, target, boardsOptions, boards, claims, evidence, queue, policies };
}
