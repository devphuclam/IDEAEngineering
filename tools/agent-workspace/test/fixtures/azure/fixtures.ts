// Deterministic placeholder-only Azure DevOps wire fixtures.
// Every value is a synthetic placeholder: no real organization, tenant, token,
// repository, or identity data. Tests exercise strict decoders with these
// untrusted DTO shapes and may clone + mutate them.

export const placeholder = {
  organization: 'placeholder-organization',
  project: 'placeholder-project',
  projectId: '00000000-0000-0000-0000-000000000001',
  repository: 'placeholder-repository',
  repositoryId: '00000000-0000-0000-0000-000000000002',
  areaNodeId: '00000000-0000-0000-0000-000000000003',
  processTypeId: '00000000-0000-0000-0000-000000000004',
  workItemType: 'User Story',
  workItemId: 1001,
  targetRef: 'refs/heads/main',
  branchRef: 'refs/heads/agent/checkpoint-00000000-0000-0000-0000-000000000005',
  runId: '00000000-0000-0000-0000-000000000006',
  owner: 'placeholder-maintainer',
  patVariable: 'AGENT_WORKSPACE_AZURE_PAT',
  tenantId: '00000000-0000-0000-0000-000000000007',
} as const;

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// ---- Organization / project / repository / process / Area Node ----

export const organizationDto = {
  id: placeholder.organization,
  name: placeholder.organization,
  url: `https://dev.azure.com/${placeholder.organization}`,
};

export const projectDto = {
  id: placeholder.projectId,
  name: placeholder.project,
  description: 'Placeholder project for offline fixture tests',
  state: 'wellFormed',
  visibility: 'private',
  revision: 1,
  lastUpdateTime: '2026-01-01T00:00:00.000Z',
};

export const repositoryDto = {
  id: placeholder.repositoryId,
  name: placeholder.repository,
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/git/repositories/${placeholder.repositoryId}`,
  remoteUrl: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_git/${placeholder.repository}`,
  sshUrl: `git@ssh.dev.azure.com:v3/${placeholder.organization}/${placeholder.project}/${placeholder.repository}`,
  webUrl: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_git/${placeholder.repository}`,
  size: 0,
  defaultBranch: placeholder.targetRef,
  isDisabled: false,
  project: { id: placeholder.projectId, name: placeholder.project },
};

export const processDto = {
  id: placeholder.processTypeId,
  name: 'Agile',
  description: 'Placeholder Agile process',
  isDefault: false,
  type: 'system',
  url: `https://dev.azure.com/${placeholder.organization}/_apis/process/processes/${placeholder.processTypeId}`,
};

export const workItemTypeMetadataDto = {
  id: 'ac8c25c5-b72b-45ff-a5e2-6a25b7a6a6b0',
  name: placeholder.workItemType,
  referenceName: 'System.UserStory',
  description: 'Placeholder User Story type',
  color: '009BCD',
  icon: 'icon_work_item',
  isDisabled: false,
  url: `https://dev.azure.com/${placeholder.organization}/_apis/wit/workitemtypes/User%20Story`,
  states: [
    { name: 'New', color: '009BCD', category: 'Proposed' },
    { name: 'Active', color: '007ACC', category: 'InProgress' },
    { name: 'Resolved', color: '7B7B7B', category: 'Resolved' },
    { name: 'Closed', color: '4D9B48', category: 'Completed' },
    { name: 'Removed', color: '9A9A9A', category: 'Removed' },
  ],
};

export const areaNodeDto = {
  id: placeholder.areaNodeId,
  identifier: placeholder.areaNodeId,
  name: placeholder.project,
  structureType: 'area',
  hasChildren: false,
  path: `\\${placeholder.project}`,
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/wit/classificationnodes/areas`,
};

export const processFingerprintDto = {
  process: processDto,
  workItemType: workItemTypeMetadataDto,
  states: workItemTypeMetadataDto.states,
};

// ---- Work Items and comments ----

export const workItemDto = {
  id: placeholder.workItemId,
  rev: 3,
  fields: {
    'System.Title': 'Placeholder candidate',
    'System.Description':
      '<div>managed blocks go here in adapter tests</div>',
    'System.State': 'New',
    'System.Tags': 'queue; placeholder',
    'System.AreaPath': placeholder.project,
    'System.CreatedDate': '2026-01-01T00:00:00.000Z',
    'System.ChangedDate': '2026-01-02T00:00:00.000Z',
  },
  relations: [
    {
      rel: 'System.Dependency',
      url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/wit/workItems/1000`,
      attributes: { name: 'placeholder dependency' },
    },
  ],
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/wit/workItems/${placeholder.workItemId}`,
};

export const workItemFieldsDto = {
  count: 1,
  value: [workItemDto],
};

export const commentDto = {
  id: 7,
  rev: 1,
  text: 'placeholder evidence comment',
  createdBy: { displayName: placeholder.owner, uniqueName: `${placeholder.owner}@placeholder.test` },
  createdDate: '2026-01-02T00:00:00.000Z',
  modifiedBy: { displayName: placeholder.owner, uniqueName: `${placeholder.owner}@placeholder.test` },
  modifiedDate: '2026-01-02T00:00:00.000Z',
  format: 'markdown',
  version: 1,
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/wit/workItems/${placeholder.workItemId}/comments/7`,
};

export const commentsDto = {
  totalCount: 1,
  count: 1,
  comments: [commentDto],
  continuationToken: null,
};

// ---- Security namespaces and permission batches ----

export const securityNamespaceDto = {
  namespaceId: '00000000-0000-0000-0000-000000000100',
  name: 'Git Repositories',
  displayName: 'Git Repositories',
  separatorValue: '/',
  elementLength: -1,
  structureValue: '1',
  isRemovable: false,
  tokenPrefix: 'repoV2',
  actions: [
    { bit: 1, name: 'Read', displayName: 'Read', namespaceId: '00000000-0000-0000-0000-000000000100' },
    { bit: 2, name: 'Contribute', displayName: 'Contribute', namespaceId: '00000000-0000-0000-0000-000000000100' },
    { bit: 32768, name: 'ForcePush', displayName: 'Force push', namespaceId: '00000000-0000-0000-0000-000000000100' },
  ],
};

export const permissionBatchDto = {
  count: 1,
  value: [
    {
      secureNamespaceId: '00000000-0000-0000-0000-000000000100',
      token: `repoV2/${placeholder.repositoryId}`,
      descriptorIdentityType: 'Microsoft.IdentityModel.Claims.ClaimsIdentity',
      descriptorIdentifier: 'placeholder-identity',
      permissions: 1,
      effectivePermissions: 1,
    },
  ],
};

export const identityDto = {
  id: '00000000-0000-0000-0000-000000000200',
  descriptor: 'Microsoft.IdentityModel.Claims.ClaimsIdentity;placeholder-identity',
  displayName: placeholder.owner,
  uniqueName: `${placeholder.owner}@placeholder.test`,
  isActive: true,
  subjectDescriptor: 'aad.placeholder-identity',
};

// ---- Policy configuration and evaluation ----

export const policyConfigurationDto = {
  id: 9001,
  isEnabled: true,
  isBlocking: true,
  isDeleted: false,
  type: {
    id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
    displayName: 'Minimum number of reviewers',
    url: 'https://placeholder.invalid/_apis/policy/types/fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
  },
  revision: 1,
  settings: { minimumApproverCount: 1 },
  url: 'https://placeholder.invalid/_apis/policy/configurations/9001',
};

export const policyConfigurationListDto = {
  count: 1,
  value: [policyConfigurationDto],
};

export const policyEvaluationDto = {
  configurationId: 9001,
  status: 'approved',
  context: {
    configurationId: 9001,
    isActive: true,
    isExpired: false,
    settings: { minimumApproverCount: 1 },
    policyType: {
      id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd',
      displayName: 'Minimum number of reviewers',
    },
  },
  _links: {},
};

export const policyEvaluationListDto = {
  count: 1,
  value: [policyEvaluationDto],
};

// ---- Git refs and pull requests ----

export const gitRefDto = {
  name: placeholder.branchRef,
  objectId: '00000000000000000000000000000000000000aa',
  creator: { displayName: placeholder.owner },
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/git/repositories/${placeholder.repositoryId}/refs?filter=heads%2Fagent`,
};

export const gitRefListDto = {
  count: 1,
  value: [gitRefDto],
};

export const pullRequestDto = {
  repository: { id: placeholder.repositoryId, name: placeholder.repository },
  pullRequestId: 42,
  codeReviewId: 4242,
  status: 'active',
  createdBy: { displayName: placeholder.owner },
  creationDate: '2026-01-02T00:00:00.000Z',
  title: 'Placeholder integration pull request',
  description: 'placeholder description',
  sourceRefName: placeholder.branchRef,
  targetRefName: placeholder.targetRef,
  mergeStatus: 'succeeded',
  isDraft: false,
  isAutoComplete: false,
  url: `https://dev.azure.com/${placeholder.organization}/${placeholder.project}/_apis/git/repositories/${placeholder.repositoryId}/pullRequests/42`,
  supportsIterations: true,
};

export const pullRequestListDto = {
  count: 1,
  value: [pullRequestDto],
};

// ---- Pagination and throttling ----

export function pagedDto<T>(items: T[], totalCount = items.length): {
  count: number;
  value: T[];
  totalCount?: number;
  continuationToken?: string | null;
} {
  return { count: items.length, value: items, totalCount, continuationToken: null };
}

export const throttlingHeaders = {
  'x-ratelimit-limit': '1000',
  'x-ratelimit-remaining': '999',
  'retry-after': '2',
};

export const paginationContinuationToken = 'placeholder-continuation-token-1';
