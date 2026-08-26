// Untrusted Azure wire DTO validation and decoding (contracts/azure-adapter.md).
// Decoders fail closed on malformed, missing, or unexpected fields; decoders
// never interpret values beyond structural validation.

import type { ProviderRevision } from '../../domain/types.ts';

export class AzureWireError extends Error {
  constructor(message: string) {
    super(`azure wire: ${message}`);
    this.name = 'AzureWireError';
  }
}

export function assertRecord(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new AzureWireError(`${what} must be an object`);
  }
  return value as Record<string, unknown>;
}

export function assertString(value: unknown, what: string): string {
  if (typeof value !== 'string') throw new AzureWireError(`${what} must be a string`);
  return value;
}

export function assertNonEmptyString(value: unknown, what: string): string {
  const text = assertString(value, what);
  if (text.length === 0) throw new AzureWireError(`${what} must not be empty`);
  return text;
}

export function assertNumber(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new AzureWireError(`${what} must be a finite number`);
  }
  return value;
}

export function assertBoolean(value: unknown, what: string): boolean {
  if (typeof value !== 'boolean') throw new AzureWireError(`${what} must be a boolean`);
  return value;
}

export function assertIsoDate(value: unknown, what: string): string {
  const text = assertString(value, what);
  if (Number.isNaN(Date.parse(text))) throw new AzureWireError(`${what} must be an ISO-8601 date`);
  return text;
}

export function assertUuid(value: unknown, what: string): string {
  const text = assertString(value, what);
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(text)) {
    throw new AzureWireError(`${what} must be a UUID`);
  }
  return text;
}

export interface WireIdentity {
  displayName: string;
  uniqueName: string;
}

export interface WireProject {
  id: string;
  name: string;
}

export interface WireOrganization {
  id: string;
  name: string;
}

export interface WireRepository {
  id: string;
  name: string;
  remoteUrl: string;
  defaultBranch: string;
  isDisabled: boolean;
  project: WireProject;
}

export interface WireProcess {
  id: string;
  name: string;
}

export interface WireWorkItemTypeMetadata {
  name: string;
  states: Array<{ name: string; category: string }>;
}

export interface WireAreaNode {
  id: string;
  path: string;
}

export interface WireWorkItem {
  id: number;
  rev: number;
  fields: Record<string, string>;
  relations?: Array<{ rel: string; url: string }>;
}

export interface WireComment {
  id: number;
  text: string;
  version: number;
  createdDate: string;
  createdBy: WireIdentity;
}

export interface WireCommentsPage {
  totalCount: number;
  comments: WireComment[];
  continuationToken: string | null;
}

export interface WireSecurityNamespace {
  namespaceId: string;
  name: string;
  actions: Array<{ bit: number; name: string }>;
}

export interface WirePermissionBatchEntry {
  token: string;
  effectivePermissions: number;
}

export interface WirePolicyConfiguration {
  id: number;
  isEnabled: boolean;
  isBlocking: boolean;
  type: { id: string; displayName: string };
  settings: Record<string, unknown>;
  revision: number;
}

export interface WirePolicyEvaluation {
  configurationId: number;
  status: string;
}

export interface WireGitRef {
  name: string;
  objectId: string;
}

export interface WirePullRequest {
  pullRequestId: number;
  status: string;
  sourceRefName: string;
  targetRefName: string;
  mergeStatus: string;
  url: string;
  title: string;
  description?: string;
  sourceCommit?: string;
  targetCommit?: string;
  mergeCommit?: string;
  workItemIds: string[];
}

export const decodeOrganization = (raw: unknown): WireOrganization => {
  const record = assertRecord(raw, 'organization');
  return {
    id: assertNonEmptyString(record.id, 'organization.id'),
    name: assertNonEmptyString(record.name, 'organization.name'),
  };
};

export const decodeProject = (raw: unknown): WireProject => {
  const record = assertRecord(raw, 'project');
  return {
    id: assertUuid(record.id, 'project.id'),
    name: assertNonEmptyString(record.name, 'project.name'),
  };
};

export const decodeRepository = (raw: unknown): WireRepository => {
  const record = assertRecord(raw, 'repository');
  const project = decodeProject(record.project);
  return {
    id: assertUuid(record.id, 'repository.id'),
    name: assertNonEmptyString(record.name, 'repository.name'),
    remoteUrl: assertString(record.remoteUrl, 'repository.remoteUrl'),
    defaultBranch: assertNonEmptyString(record.defaultBranch, 'repository.defaultBranch'),
    isDisabled: assertBoolean(record.isDisabled, 'repository.isDisabled'),
    project,
  };
};

export const decodeProcess = (raw: unknown): WireProcess => {
  const record = assertRecord(raw, 'process');
  return {
    id: assertUuid(record.id, 'process.id'),
    name: assertNonEmptyString(record.name, 'process.name'),
  };
};

export const decodeWorkItemTypeMetadata = (raw: unknown): WireWorkItemTypeMetadata => {
  const record = assertRecord(raw, 'work item type');
  const states = record.states;
  if (!Array.isArray(states)) throw new AzureWireError('work item type states must be an array');
  return {
    name: assertNonEmptyString(record.name, 'work item type name'),
    states: states.map((state) => {
      const entry = assertRecord(state, 'work item type state');
      return {
        name: assertNonEmptyString(entry.name, 'state.name'),
        category: assertNonEmptyString(entry.category, 'state.category'),
      };
    }),
  };
};

export const decodeAreaNode = (raw: unknown): WireAreaNode => {
  const record = assertRecord(raw, 'area node');
  return {
    id: assertUuid(record.id, 'area node id'),
    path: assertNonEmptyString(record.path, 'area node path'),
  };
};

export const decodeWorkItem = (raw: unknown): WireWorkItem => {
  const record = assertRecord(raw, 'work item');
  const fields = record.fields;
  if (typeof fields !== 'object' || fields === null) {
    throw new AzureWireError('work item fields must be an object');
  }
  const relations = record.relations;
  if (relations !== undefined) {
    if (!Array.isArray(relations)) throw new AzureWireError('work item relations must be an array');
    for (const relation of relations) {
      const entry = assertRecord(relation, 'relation');
      assertString(entry.rel, 'relation.rel');
      assertString(entry.url, 'relation.url');
    }
  }
  return {
    id: assertNumber(record.id, 'work item id'),
    rev: assertNumber(record.rev, 'work item rev'),
    fields: fields as Record<string, string>,
    relations: relations as Array<{ rel: string; url: string }> | undefined,
  };
};

export const decodeComment = (raw: unknown): WireComment => {
  const record = assertRecord(raw, 'comment');
  return {
    id: assertNumber(record.id, 'comment.id'),
    text: assertString(record.text, 'comment.text'),
    version: assertNumber(record.version, 'comment.version'),
    createdDate: assertIsoDate(record.createdDate, 'comment.createdDate'),
    createdBy: {
      displayName: assertString(record.createdBy && assertRecord(record.createdBy, 'comment.createdBy').displayName, 'comment.createdBy.displayName'),
      uniqueName: assertString(record.createdBy && assertRecord(record.createdBy, 'comment.createdBy').uniqueName, 'comment.createdBy.uniqueName'),
    },
  };
};

export const decodeCommentsPage = (raw: unknown): WireCommentsPage => {
  const record = assertRecord(raw, 'comments page');
  const comments = record.comments;
  if (!Array.isArray(comments)) throw new AzureWireError('comments must be an array');
  return {
    totalCount: assertNumber(record.totalCount ?? comments.length, 'comments totalCount'),
    comments: comments.map(decodeComment),
    continuationToken:
      record.continuationToken === null || record.continuationToken === undefined
        ? null
        : assertNonEmptyString(record.continuationToken, 'comments continuationToken'),
  };
};

export const decodeSecurityNamespace = (raw: unknown): WireSecurityNamespace => {
  const record = assertRecord(raw, 'security namespace');
  const actions = record.actions;
  if (!Array.isArray(actions)) throw new AzureWireError('security namespace actions must be an array');
  return {
    namespaceId: assertUuid(record.namespaceId, 'namespace.namespaceId'),
    name: assertNonEmptyString(record.name, 'namespace.name'),
    actions: actions.map((action) => {
      const entry = assertRecord(action, 'namespace action');
      return { bit: assertNumber(entry.bit, 'action.bit'), name: assertNonEmptyString(entry.name, 'action.name') };
    }),
  };
};

export const decodePermissionBatch = (raw: unknown): WirePermissionBatchEntry[] => {
  const record = assertRecord(raw, 'permission batch');
  const value = record.value;
  if (!Array.isArray(value)) throw new AzureWireError('permission batch value must be an array');
  return value.map((entry) => {
    const item = assertRecord(entry, 'permission batch entry');
    return {
      token: assertNonEmptyString(item.token, 'permission token'),
      effectivePermissions: assertNumber(item.effectivePermissions, 'effectivePermissions'),
    };
  });
};

export const decodePolicyConfiguration = (raw: unknown): WirePolicyConfiguration => {
  const record = assertRecord(raw, 'policy configuration');
  const type = assertRecord(record.type, 'policy type');
  return {
    id: assertNumber(record.id, 'policy id'),
    isEnabled: assertBoolean(record.isEnabled, 'policy isEnabled'),
    isBlocking: assertBoolean(record.isBlocking, 'policy isBlocking'),
    type: { id: assertString(type.id, 'policy type id'), displayName: assertNonEmptyString(type.displayName, 'policy type displayName') },
    settings: assertRecord(record.settings, 'policy settings'),
    revision: assertNumber(record.revision, 'policy revision'),
  };
};

export const decodePolicyEvaluation = (raw: unknown): WirePolicyEvaluation => {
  const record = assertRecord(raw, 'policy evaluation');
  return {
    configurationId: assertNumber(record.configurationId, 'evaluation configurationId'),
    status: assertNonEmptyString(record.status, 'evaluation status'),
  };
};

export const decodeGitRef = (raw: unknown): WireGitRef => {
  const record = assertRecord(raw, 'git ref');
  return {
    name: assertNonEmptyString(record.name, 'ref name'),
    objectId: assertNonEmptyString(record.objectId, 'ref objectId'),
  };
};

export const decodePullRequest = (raw: unknown): WirePullRequest => {
  const record = assertRecord(raw, 'pull request');
  const workItemRefs = record.workItemRefs;
  if (workItemRefs !== undefined && !Array.isArray(workItemRefs)) throw new AzureWireError('pull request workItemRefs must be an array');
  return {
    pullRequestId: assertNumber(record.pullRequestId, 'pull request id'),
    status: assertNonEmptyString(record.status, 'pull request status'),
    sourceRefName: assertNonEmptyString(record.sourceRefName, 'pull request sourceRefName'),
    targetRefName: assertNonEmptyString(record.targetRefName, 'pull request targetRefName'),
    mergeStatus: assertString(record.mergeStatus, 'pull request mergeStatus'),
    url: assertString(record.url, 'pull request url'),
    title: assertNonEmptyString(record.title, 'pull request title'),
    description: typeof record.description === 'string' ? record.description : undefined,
    sourceCommit:
      typeof (record.lastMergeSourceCommit as Record<string, unknown> | undefined)?.commitId === 'string'
        ? (record.lastMergeSourceCommit as { commitId: string }).commitId
        : typeof record.sourceCommit === 'string'
          ? record.sourceCommit
          : undefined,
    targetCommit:
      typeof (record.lastMergeTargetCommit as Record<string, unknown> | undefined)?.commitId === 'string'
        ? (record.lastMergeTargetCommit as { commitId: string }).commitId
        : typeof record.targetCommit === 'string'
          ? record.targetCommit
          : undefined,
    mergeCommit:
      typeof (record.lastMergeCommit as Record<string, unknown> | undefined)?.commitId === 'string'
        ? (record.lastMergeCommit as { commitId: string }).commitId
        : typeof record.mergeCommit === 'string'
          ? record.mergeCommit
          : undefined,
    workItemIds: (workItemRefs ?? []).map((reference) => {
      const candidate = assertRecord(reference, 'pull request workItemRef');
      return assertNonEmptyString(candidate.id, 'pull request workItemRef.id');
    }),
  };
};

/** Opaque provider revision for a work item: the numeric rev as decimal string. */
export function revisionOf(rev: number): ProviderRevision {
  return String(rev);
}
