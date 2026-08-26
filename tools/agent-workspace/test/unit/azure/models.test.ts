// T014: Strict Azure wire decoder tests - Project, Repository, process, Work
// Item, comments, security namespaces, permission batches, Git refs/PRs,
// policy inventories, and policy evaluations (FR-007, FR-035).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AzureWireError,
  decodeAreaNode,
  decodeComment,
  decodeCommentsPage,
  decodeGitRef,
  decodeOrganization,
  decodePermissionBatch,
  decodePolicyConfiguration,
  decodePolicyEvaluation,
  decodeProcess,
  decodeProject,
  decodePullRequest,
  decodeRepository,
  decodeSecurityNamespace,
  decodeWorkItem,
  decodeWorkItemTypeMetadata,
  revisionOf,
} from '../../../src/adapters/azure/models.ts';
import {
  areaNodeDto,
  clone,
  commentDto,
  commentsDto,
  gitRefDto,
  organizationDto,
  permissionBatchDto,
  policyConfigurationDto,
  policyEvaluationDto,
  processDto,
  projectDto,
  pullRequestDto,
  repositoryDto,
  securityNamespaceDto,
  workItemDto,
  workItemTypeMetadataDto,
} from '../../../test/fixtures/azure/fixtures.ts';

test('decodeProject accepts a well-formed placeholder project', () => {
  const project = decodeProject(projectDto);
  assert.equal(project.id, projectDto.id);
  assert.equal(project.name, projectDto.name);
});

test('decodeProject rejects a missing or malformed id/name', () => {
  assert.throws(() => decodeProject({ ...projectDto, id: undefined }), AzureWireError);
  assert.throws(() => decodeProject({ ...projectDto, name: '' }), AzureWireError);
  assert.throws(() => decodeProject(null), AzureWireError);
  assert.throws(() => decodeProject([1]), AzureWireError);
});

test('decodeOrganization accepts the placeholder organization', () => {
  assert.equal(decodeOrganization(organizationDto).name, organizationDto.name);
});

test('decodeRepository decodes and validates project, remoteUrl, defaultBranch, isDisabled', () => {
  const repository = decodeRepository(repositoryDto);
  assert.equal(repository.id, repositoryDto.id);
  assert.equal(repository.project.id, projectDto.id);
  assert.equal(repository.isDisabled, false);
  assert.throws(() => decodeRepository({ ...repositoryDto, isDisabled: 'false' }), AzureWireError);
  assert.throws(() => decodeRepository({ ...repositoryDto, remoteUrl: 42 }), AzureWireError);
  assert.throws(() => decodeRepository({ ...repositoryDto, project: null }), AzureWireError);
});

test('decodeProcess requires a UUID id and a non-empty name', () => {
  assert.equal(decodeProcess(processDto).name, processDto.name);
  assert.throws(() => decodeProcess({ ...processDto, id: 'not-a-uuid' }), /UUID/);
});

test('decodeWorkItemTypeMetadata validates the states array', () => {
  const metadata = decodeWorkItemTypeMetadata(workItemTypeMetadataDto);
  assert.equal(metadata.name, workItemTypeMetadataDto.name);
  assert.ok(metadata.states.some((state) => state.name === 'New' && state.category === 'Proposed'));
  assert.throws(() => decodeWorkItemTypeMetadata({ ...workItemTypeMetadataDto, states: { value: 'not-array' } }), AzureWireError);
  assert.throws(() => decodeWorkItemTypeMetadata({ ...workItemTypeMetadataDto, states: { value: [{ name: 'New' }] } }), AzureWireError);
});

test('decodeAreaNode accepts the placeholder area node', () => {
  const node = decodeAreaNode(areaNodeDto);
  assert.equal(node.id, areaNodeDto.id);
  assert.equal(node.path, areaNodeDto.path);
});

test('decodeWorkItem validates fields and relations strictly', () => {
  const workItem = decodeWorkItem(workItemDto);
  assert.equal(workItem.id, workItemDto.id);
  assert.equal(workItem.fields['System.Title'], 'Placeholder candidate');
  assert.throws(() => decodeWorkItem({ ...workItemDto, fields: null }), /fields must be an object/);
  assert.throws(() => decodeWorkItem({ ...workItemDto, relations: [{ rel: 'x' }] }), /relation\.url/);
  assert.throws(() => decodeWorkItem({ ...workItemDto, rev: 'three' }), AzureWireError);
});

test('decodeComment validates the comment identity and dates', () => {
  const comment = decodeComment(commentDto);
  assert.equal(comment.id, commentDto.id);
  assert.equal(comment.createdBy.displayName, commentDto.createdBy.displayName);
  assert.throws(() => decodeComment({ ...commentDto, createdDate: 'not-a-date' }), /ISO-8601/);
  assert.throws(() => decodeComment({ ...commentDto, createdBy: { displayName: 'x' } }), AzureWireError);
});

test('decodeCommentsPage walks the value array and optional continuation token', () => {
  const page = decodeCommentsPage(commentsDto);
  assert.equal(page.comments.length, 1);
  assert.equal(page.continuationToken, null);
  assert.throws(() => decodeCommentsPage({ ...commentsDto, comments: { value: 'nope' } }), AzureWireError);
});

test('decodeSecurityNamespace validates actions bits and names', () => {
  const namespace = decodeSecurityNamespace(securityNamespaceDto);
  assert.equal(namespace.actions.length, 3);
  assert.ok(namespace.actions.some((action) => action.name === 'ForcePush' && action.bit === 32768));
  assert.throws(() => decodeSecurityNamespace({ ...securityNamespaceDto, actions: 'nope' }), /actions must be an array/);
  assert.throws(() => decodeSecurityNamespace({ ...securityNamespaceDto, actions: [{ bit: 1 }] }), AzureWireError);
});

test('decodePermissionBatch requires token and effectivePermissions', () => {
  const batch = decodePermissionBatch(permissionBatchDto);
  assert.equal(batch.length, 1);
  assert.equal(batch[0].token, `repoV2/${permissionBatchDto.value[0].token.split('/').at(-1)}`);
  assert.throws(() => decodePermissionBatch({ value: [{ token: 'x' }] }), AzureWireError);
});

test('decodePolicyConfiguration validates blocking/enabled and settings', () => {
  const policy = decodePolicyConfiguration(policyConfigurationDto);
  assert.equal(policy.isBlocking, true);
  assert.equal(policy.type.displayName, 'Minimum number of reviewers');
  assert.throws(() => decodePolicyConfiguration({ ...policyConfigurationDto, isEnabled: 'yes' }), AzureWireError);
  assert.throws(() => decodePolicyConfiguration({ ...policyConfigurationDto, settings: 'none' }), /settings/);
});

test('decodePolicyEvaluation validates configurationId and status', () => {
  const evaluation = decodePolicyEvaluation(policyEvaluationDto);
  assert.equal(evaluation.configurationId, 9001);
  assert.equal(evaluation.status, 'approved');
  assert.throws(() => decodePolicyEvaluation({ ...policyEvaluationDto, status: '' }), AzureWireError);
});

test('decodeGitRef and decodePullRequest validate refs', () => {
  const ref = decodeGitRef(gitRefDto);
  assert.equal(ref.objectId, gitRefDto.objectId);
  assert.throws(() => decodeGitRef({ ...gitRefDto, objectId: '' }), AzureWireError);

  const pullRequest = decodePullRequest(pullRequestDto);
  assert.equal(pullRequest.pullRequestId, 42);
  assert.equal(pullRequest.targetRefName, pullRequestDto.targetRefName);
  assert.throws(() => decodePullRequest({ ...pullRequestDto, sourceRefName: '' }), AzureWireError);
});

test('clone() produces an independent copy for mutation-based rejection tests', () => {
  const copied = clone(workItemDto);
  copied.fields['System.Title'] = 'mutated';
  assert.equal(workItemDto.fields['System.Title'], 'Placeholder candidate');
});

test('revisionOf maps the numeric work item rev to an opaque revision', () => {
  assert.equal(revisionOf(3), '3');
  assert.equal(revisionOf(0), '0');
  assert.notEqual(revisionOf(3), revisionOf(4));
});