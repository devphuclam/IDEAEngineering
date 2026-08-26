// Read-only Azure target resolution (contracts/azure-adapter.md): resolves
// the Organization, Project, Repository, Area Node, and process metadata for
// the canonical queue key. Never mutates; bootstrapping and queue mutations
// build on these read-only inputs.

import { createHash } from 'node:crypto';
import type { AzureDevOpsConfig } from '../../config/provider.ts';
import type { IntegrationTarget } from '../../domain/types.ts';
import { decodeAreaNode, decodeProject, decodeProcess, decodeRepository, decodeWorkItemTypeMetadata, revisionOf, type WireAreaNode, type WireProcess, type WireRepository, type WireWorkItemTypeMetadata } from './models.ts';
import type { AzureHttpClient } from './http.ts';
import type { ProcessObservation } from './process-mapping.ts';

export class TargetResolutionError extends Error {
  constructor(message: string) {
    super(`target resolution: ${message}`);
    this.name = 'TargetResolutionError';
  }
}

export interface ResolvedTarget {
  organizationUrl: string;
  organizationName: string;
  project: { id: string; name: string };
  repository: WireRepository;
  areaNode: WireAreaNode;
  process: WireProcess;
  workItemTypeMetadata: WireWorkItemTypeMetadata;
  integrationTarget: string;
  queueKey: string;
}

export function canonicalQueueKey(
  organizationUrl: string,
  projectId: string,
  repositoryId: string,
  targetRef: string,
): string {
  return createHash('sha256')
    .update(`${organizationUrl}\n${projectId}\n${repositoryId}\n${targetRef}`, 'utf8')
    .digest('hex');
}

export async function resolveTarget(client: AzureHttpClient, config: AzureDevOpsConfig): Promise<ResolvedTarget> {
  const organizationUrl = config.organizationUrl.replace(/\/+$/, '');
  const organizationName = organizationUrl.split('/').filter(Boolean).at(-1);
  if (!organizationName) {
    throw new TargetResolutionError('organization URL has no organization segment');
  }

  const projectRaw = await client.get(`/_apis/projects/${encodeURIComponent(config.project.name)}`);
  const project = decodeProject(projectRaw);
  if (config.project.expectedId !== null && project.id.toLowerCase() !== config.project.expectedId.toLowerCase()) {
    throw new TargetResolutionError(
      `project id ${project.id} does not match expected id ${config.project.expectedId}`,
    );
  }

  const repositoryRaw = await client.get(
    `/${encodeURIComponent(config.project.name)}/_apis/git/repositories/${encodeURIComponent(config.repository.name)}`,
  );
  const repository = decodeRepository(repositoryRaw);
  if (config.repository.expectedId !== null && repository.id.toLowerCase() !== config.repository.expectedId.toLowerCase()) {
    throw new TargetResolutionError(
      `repository id ${repository.id} does not match expected id ${config.repository.expectedId}`,
    );
  }
  if (repository.isDisabled) {
    throw new TargetResolutionError(`repository ${repository.name} is disabled`);
  }

  const areaRaw = await client.get(
    `/${encodeURIComponent(config.project.name)}/_apis/wit/classificationnodes/areas`,
  );
  const areaNode = decodeAreaNode(areaRaw);

  const processRaw = await client.get(
    `/${encodeURIComponent(config.project.name)}/_apis/work/processconfiguration?$type=system`,
  );
  const process = decodeProcess(processRaw);

  const typeMetadataRaw = await client.get(
    `/${encodeURIComponent(config.project.name)}/_apis/wit/workitemtypes/${encodeURIComponent(config.process.workItemType)}`,
  );
  const workItemTypeMetadata = decodeWorkItemTypeMetadata(typeMetadataRaw);

  return {
    organizationUrl,
    organizationName,
    project: { id: project.id, name: project.name },
    repository,
    areaNode,
    process,
    workItemTypeMetadata,
    integrationTarget: config.integrationTarget,
    queueKey: canonicalQueueKey(organizationUrl, project.id, repository.id, config.integrationTarget),
  };
}

export function integrationTargetOf(resolved: ResolvedTarget): IntegrationTarget {
  return { repositoryId: resolved.repository.id, targetRef: resolved.integrationTarget };
}

export function observationOf(resolved: ResolvedTarget, observedAt: string): ProcessObservation {
  return {
    process: resolved.process,
    workItemType: resolved.workItemTypeMetadata,
    observedAt,
  };
}

export function revisionOfRev(rev: number): string {
  return revisionOf(rev);
}

export function queueTitle(repositoryName: string, targetRef: string): string {
  return `Agent Workspace Integration Queue - ${repositoryName}/${targetRef}`;
}

export const QUEUE_DISCOVERY_TAG = 'agent-workspace:integration-queue';

export function queueKeyTag(queueKey: string): string {
  return `agent-workspace:queue-key:sha256:${queueKey}`;
}