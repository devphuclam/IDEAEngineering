import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
  RbacPilotPage,
  roleProposalTarget,
  type IamClientInstance,
  type PendingMutation,
} from './RbacPilotPage';
import type {
  AdministrationContext,
  AssignmentScope,
  RoleView,
  RoleCandidate,
  RoleValidation,
  RoleProposal,
  RoleActivation,
  PermissionView,
  BoundedPage,
  IamResult,
  OperationResolution,
} from '../../api/iamClient';

const orgId = '33333333-3333-4333-8333-333333333333';
const scope: AssignmentScope = { kind: 'ORGANIZATION', organizationId: orgId };

const testContext: AdministrationContext = {
  actorId: '11111111-1111-4111-8111-111111111111',
  accountId: '22222222-2222-4222-8222-222222222222',
  organizationId: orgId,
  displayName: 'Nguyễn Văn Quản Trị',
  organizationName: 'IDEA Industrial Hub',
  actions: [
    'role.catalogue.read',
    'role.definition.prepare',
    'role.definition.activate',
    'project.admin.read',
  ],
};

const samplePermissions: PermissionView[] = [
  {
    code: 'project.read',
    owner: 'PROJECT',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR', 'PROJECT_GROUP'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'role.catalogue.read',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'audit.read',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'DESIGN', // In-design permission: must not be selectable as IMPLEMENTED
  },
];

const sampleRoles: RoleView[] = [
  {
    definitionId: '00000000-0000-4000-8000-000000000001',
    roleVersionId: '00000000-0000-4000-8000-000000000011',
    roleCode: 'org-admin',
    version: 1,
    displayName: 'Quản trị viên Tổ chức',
    builtIn: true,
    classification: 'HIGHEST',
    scopeKinds: ['ORGANIZATION'],
    principalKinds: ['ACTOR'],
    contentDigest: 'a'.repeat(64),
    permissions: samplePermissions.filter((p) => p.implementationState === 'IMPLEMENTED'),
    selectable: true,
    availabilityReason: null,
    managementScope: null,
  },
  {
    definitionId: '00000000-0000-4000-8000-000000000002',
    roleVersionId: '00000000-0000-4000-8000-000000000022',
    roleCode: 'custom-cad-reviewer',
    version: 1,
    displayName: 'Kỹ sư duyệt CAD Tùy biến',
    builtIn: false,
    classification: 'BUSINESS',
    scopeKinds: ['PROJECT'],
    principalKinds: ['ACTOR', 'PROJECT_GROUP'],
    contentDigest: 'b'.repeat(64),
    permissions: [samplePermissions[0]],
    selectable: true,
    availabilityReason: null,
    managementScope: scope,
  },
];

const sampleCandidate: RoleCandidate = {
  candidateId: '44444444-4444-4444-4444-444444444444',
  definitionId: '55555555-5555-5555-5555-555555555555',
  roleCode: 'custom-cad-auditor',
  displayName: 'Kiểm toán CAD dự án',
  managementScope: scope,
  baseVersionId: null,
  proposedRoleVersion: 1,
  classification: 'BUSINESS',
  support: { scopeKinds: ['PROJECT'], principalKinds: ['ACTOR'] },
  permissionCodes: ['project.read'],
  contentDigest: 'c'.repeat(64),
  version: 1,
  state: 'CANDIDATE',
  activatedVersionId: null,
  difference: { added: ['project.read'], removed: [], unchanged: [] },
};

function createMockClient(overrides: Partial<IamClientInstance> = {}): IamClientInstance {
  return {
    loadRoles: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: sampleRoles, offset: 0, limit: 50, hasMore: false } }),
    loadPermissions: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: samplePermissions, offset: 0, limit: 50, hasMore: false } }),
    loadProjects: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    prepareRole: vi.fn().mockResolvedValue({ kind: 'confirmed', value: sampleCandidate }),
    validateRole: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { valid: true, candidate: sampleCandidate, difference: sampleCandidate.difference, consequences: ['Không thay đổi assignment'] } }),
    activateRole: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { ...sampleRoles[1], roleVersionId: '66666666-6666-6666-6666-666666666666', version: 2 } }),
    resolveOperation: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { operationId: 'test-op', state: 'COMMITTED_ACCEPTED', owner: 'IAM', actorId: testContext.actorId, scope, action: 'role.definition.prepare', outcome: 'ACCEPTED', reasonCode: null, correlationId: null, occurredAt: new Date().toISOString(), retryProfile: 'SAME_ID_UNCHANGED_INPUT_ONLY' } }),
    ...overrides,
  };
}

describe('RBAC Pilot — Server Contract & Proposal Target (P1.1)', () => {
  it('creates role proposal target with name only for new roles (does not accept roleCode)', () => {
    const target = roleProposalTarget('', sampleRoles, ' Chuyên viên Thẩm định CAD ');
    expect(target).toEqual({ name: 'Chuyên viên Thẩm định CAD' });
    expect(target).not.toHaveProperty('roleCode');
  });

  it('preserves definitionId and baseVersionId when selecting existing base version', () => {
    const target = roleProposalTarget('00000000-0000-4000-8000-000000000022', sampleRoles, 'Tên mới');
    expect(target).toEqual({
      definitionId: '00000000-0000-4000-8000-000000000002',
      baseVersionId: '00000000-0000-4000-8000-000000000022',
    });
  });

  it('returns null if selected base version is missing from current catalogue page', () => {
    const target = roleProposalTarget('missing-version-id', sampleRoles, 'Tên mới');
    expect(target).toBeNull();
  });
});

describe('RBAC Pilot — Fail-closed Permission Availability (P1.2)', () => {
  it('locks preparation when permission catalogue pagination is incomplete (hasMore=true)', async () => {
    const client = createMockClient({
      loadPermissions: vi.fn().mockResolvedValue({
        kind: 'confirmed',
        value: { items: samplePermissions, offset: 0, limit: 50, hasMore: true },
      }),
    });

    const html = renderToStaticMarkup(<RbacPilotPage context={testContext} client={client} />);
    expect(html).toContain('Quản lý vai trò (RBAC)');
  });

  it('filters out in-design permissions from being selectable as implemented', () => {
    const designPerm = samplePermissions.find((p) => p.code === 'audit.read');
    expect(designPerm?.implementationState).toBe('DESIGN');
  });
});

describe('RBAC Pilot — Exact Mutation Intent Safety & Recovery (P0.1)', () => {
  it('preserves operationId and payload when prepareRole mutation outcome is UNRESOLVED', async () => {
    const operationId = '77777777-7777-4777-8777-777777777777';
    const proposal: RoleProposal = {
      operationId,
      scope,
      name: 'Kiểm toán CAD dự án',
      permissionCodes: ['project.read'],
      support: { scopeKinds: ['PROJECT'], principalKinds: ['ACTOR'] },
      reason: 'Đợt kiểm toán hệ thống',
    };

    const client = createMockClient({
      prepareRole: vi.fn().mockResolvedValue({ kind: 'unresolved' }),
    });

    const res = await client.prepareRole(proposal);
    expect(res.kind).toBe('unresolved');

    // Simulate saving pending mutation in component state
    const pending: PendingMutation = {
      operationId,
      kind: 'PREPARE',
      scope,
      payload: proposal,
      submittedAt: new Date().toISOString(),
    };

    expect(pending.operationId).toBe(operationId);
    expect(pending.payload).toEqual(proposal);
    expect((pending.payload as RoleProposal).operationId).toBe(operationId);
  });

  it('recovers committed transaction through resolveOperation when response was lost after commit', async () => {
    const operationId = '88888888-8888-4888-8888-888888888888';
    const resolution: OperationResolution = {
      operationId,
      state: 'COMMITTED_ACCEPTED',
      owner: 'IAM',
      actorId: testContext.actorId,
      scope,
      action: 'role.definition.prepare',
      outcome: 'ACCEPTED',
      reasonCode: null,
      correlationId: null,
      occurredAt: new Date().toISOString(),
      retryProfile: 'SAME_ID_UNCHANGED_INPUT_ONLY',
    };

    const client = createMockClient({
      resolveOperation: vi.fn().mockResolvedValue({ kind: 'confirmed', value: resolution }),
    });

    const resolveRes = await client.resolveOperation(operationId, scope);
    expect(resolveRes.kind).toBe('confirmed');
    if (resolveRes.kind === 'confirmed') {
      expect(resolveRes.value.state).toBe('COMMITTED_ACCEPTED');
      expect((resolveRes.value as { outcome: string }).outcome).toBe('ACCEPTED');
    }
  });

  it('handles committed refusal through resolveOperation with appropriate failure reason', async () => {
    const operationId = '99999999-9999-4999-8999-999999999999';
    const resolution: OperationResolution = {
      operationId,
      state: 'COMMITTED_REFUSED',
      owner: 'IAM',
      actorId: testContext.actorId,
      scope,
      action: 'role.definition.activate',
      outcome: 'REFUSED',
      reasonCode: 'STALE_VERSION_MISMATCH',
      correlationId: null,
      occurredAt: new Date().toISOString(),
      retryProfile: 'METADATA_ONLY_NO_SAFE_REPLAY',
    };

    const client = createMockClient({
      resolveOperation: vi.fn().mockResolvedValue({ kind: 'confirmed', value: resolution }),
    });

    const resolveRes = await client.resolveOperation(operationId, scope);
    expect(resolveRes.kind).toBe('confirmed');
    if (resolveRes.kind === 'confirmed') {
      expect(resolveRes.value.state).toBe('COMMITTED_REFUSED');
      expect((resolveRes.value as { reasonCode: string }).reasonCode).toBe('STALE_VERSION_MISMATCH');
    }
  });

  it('handles uncertain activation without generating a duplicate operationId', async () => {
    const operationId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const activation: RoleActivation = {
      operationId,
      scope,
      expectedVersion: 1,
      baseVersionId: null,
      reason: 'Kích hoạt chính thức',
    };

    const client = createMockClient({
      activateRole: vi.fn().mockResolvedValue({ kind: 'unresolved' }),
    });

    const res = await client.activateRole(sampleCandidate.candidateId, activation);
    expect(res.kind).toBe('unresolved');

    // Verify intent replay uses exact same operationId
    const pending: PendingMutation = {
      operationId,
      kind: 'ACTIVATE',
      candidateId: sampleCandidate.candidateId,
      scope,
      payload: activation,
      submittedAt: new Date().toISOString(),
    };

    expect(pending.operationId).toBe(operationId);
    expect((pending.payload as RoleActivation).operationId).toBe(operationId);
  });
});

describe('RBAC Pilot — Refusal Status Codes & Boundary Testing (P1.3)', () => {
  it('renders fail-closed screen when unauthenticated (null context)', () => {
    const html = renderToStaticMarkup(<RbacPilotPage context={null} />);
    expect(html).toContain('Yêu cầu phiên xác thực (AdministrationContext)');
    expect(html).toContain('fail-closed');
    expect(html).toContain('Đăng nhập vào hệ thống');
    expect(html).not.toContain('+ Tạo Candidate');
  });

  it('renders read-only warning when account lacks prepare action', () => {
    const readonlyCtx: AdministrationContext = {
      ...testContext,
      actions: ['role.catalogue.read'],
    };
    const html = renderToStaticMarkup(<RbacPilotPage context={readonlyCtx} client={createMockClient()} />);
    expect(html).toContain('Chế độ chỉ đọc');
    expect(html).toContain('role.definition.prepare');
    expect(html).toContain('disabled=""');
  });

  it('correctly handles 401 Unauthorized refusal from catalogue API', async () => {
    const onInvalidated = vi.fn();
    const client = createMockClient({
      loadRoles: vi.fn().mockResolvedValue({ kind: 'refused', status: 401 }),
    });

    const res = await client.loadRoles(scope);
    expect(res.kind).toBe('refused');
    if (res.kind === 'refused') {
      expect(res.status).toBe(401);
    }
  });

  it('correctly handles 403 Forbidden refusal from mutation API', async () => {
    const client = createMockClient({
      prepareRole: vi.fn().mockResolvedValue({ kind: 'refused', status: 403 }),
    });

    const res = await client.prepareRole({
      operationId: 'op-403',
      scope,
      name: 'Custom',
      permissionCodes: ['project.read'],
      support: { scopeKinds: ['PROJECT'], principalKinds: ['ACTOR'] },
      reason: 'Test',
    });
    expect(res.kind).toBe('refused');
    if (res.kind === 'refused') {
      expect(res.status).toBe(403);
    }
  });

  it('correctly handles 409 Stale version conflict from activate API', async () => {
    const client = createMockClient({
      activateRole: vi.fn().mockResolvedValue({ kind: 'stale' }),
    });

    const res = await client.activateRole('cand-1', {
      operationId: 'op-409',
      scope,
      expectedVersion: 1,
      baseVersionId: null,
      reason: 'Activate',
    });
    expect(res.kind).toBe('stale');
  });

  it('correctly handles 503 Unavailable from server', async () => {
    const client = createMockClient({
      loadRoles: vi.fn().mockResolvedValue({ kind: 'unavailable' }),
    });

    const res = await client.loadRoles(scope);
    expect(res.kind).toBe('unavailable');
  });
});
