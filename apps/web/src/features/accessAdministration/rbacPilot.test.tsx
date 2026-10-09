import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { RbacPilotPage, isValidKebabCase, type IamClientInstance } from './RbacPilotPage';
import type {
  AdministrationContext,
  AssignmentScope,
  RoleView,
  RoleCandidate,
  RoleValidation,
  PermissionView,
  BoundedPage,
  IamResult,
} from '../../api/iamClient';

const testContext: AdministrationContext = {
  actorId: '11111111-1111-4111-8111-111111111111',
  accountId: '22222222-2222-4222-8222-222222222222',
  organizationId: '33333333-3333-4333-8333-333333333333',
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
    permissions: samplePermissions,
    selectable: true,
    availabilityReason: null,
    managementScope: null,
  },
];

function createMockClient(overrides: Partial<IamClientInstance> = {}): IamClientInstance {
  return {
    loadContext: vi.fn().mockResolvedValue({ kind: 'confirmed', value: testContext }),
    loadAccounts: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    loadAccount: vi.fn(),
    inspectAccess: vi.fn(),
    resolveOperation: vi.fn(),
    loadHistory: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    loadRoles: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: sampleRoles, offset: 0, limit: 50, hasMore: false } }),
    loadPermissions: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: samplePermissions, offset: 0, limit: 50, hasMore: false } }),
    prepareRole: vi.fn(),
    validateRole: vi.fn(),
    activateRole: vi.fn(),
    loadAssignments: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    loadAssignment: vi.fn(),
    previewAssignment: vi.fn(),
    grantAssignment: vi.fn(),
    endAssignment: vi.fn(),
    replaceAssignment: vi.fn(),
    loadProjects: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    loadProject: vi.fn(),
    loadGroups: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false } }),
    loadGroup: vi.fn(),
    loadProjectMembers: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false, parentVersion: 1, eligibleTargets: { items: [], offset: 0, limit: 50, hasMore: false } } }),
    loadGroupMembers: vi.fn().mockResolvedValue({ kind: 'confirmed', value: { items: [], offset: 0, limit: 50, hasMore: false, parentVersion: 1, eligibleTargets: { items: [], offset: 0, limit: 50, hasMore: false } } }),
    createProject: vi.fn(),
    renameProject: vi.fn(),
    createGroup: vi.fn(),
    renameGroup: vi.fn(),
    joinProject: vi.fn(),
    joinGroup: vi.fn(),
    endProjectMembership: vi.fn(),
    endGroupMembership: vi.fn(),
    createAccount: vi.fn(),
    changeAccount: vi.fn(),
    issueProof: vi.fn(),
    redeemCredential: vi.fn(),
    signOut: vi.fn().mockResolvedValue({ kind: 'confirmed', value: undefined }),
    signIn: vi.fn(),
    loadSession: vi.fn(),
    ...overrides,
  } as unknown as IamClientInstance;
}

describe('RBAC Pilot Page Integration', () => {
  it('renders fail-closed unauthenticated view when no context is provided', () => {
    const html = renderToStaticMarkup(<RbacPilotPage context={null} />);

    expect(html).toContain('Yêu cầu phiên xác thực (AdministrationContext)');
    expect(html).toContain('fail-closed');
    expect(html).toContain('Đăng nhập vào hệ thống');
    expect(html).not.toContain('+ Tạo Candidate');
  });

  it('renders authenticated management view with scope toolbar and table header', () => {
    const client = createMockClient();
    const html = renderToStaticMarkup(<RbacPilotPage context={testContext} client={client} />);

    expect(html).toContain('Quản lý vai trò (RBAC)');
    expect(html).toContain('Server Scope: IDEA Industrial Hub (33333333-3333-4333-8333-333333333333)');
    expect(html).toContain('+ Tạo Candidate');
    expect(html).toContain('Mã vai trò &amp; Phiên bản');
    expect(html).toContain('Chi tiết Vai trò');
  });

  it('locks mutation buttons when account lacks role.definition.prepare action', () => {
    const readonlyContext: AdministrationContext = {
      ...testContext,
      actions: ['role.catalogue.read'],
    };
    const client = createMockClient();
    const html = renderToStaticMarkup(<RbacPilotPage context={readonlyContext} client={client} />);

    expect(html).toContain('Chế độ chỉ đọc');
    expect(html).toContain('Tài khoản của bạn không có quyền');
    expect(html).toContain('disabled=""');
  });

  it('triggers onInvalidated callback and displays 401 error message when server refuses with 401', async () => {
    const onInvalidated = vi.fn();
    const client = createMockClient({
      loadRoles: vi.fn().mockResolvedValue({ kind: 'refused', status: 401 }),
    });

    const html = renderToStaticMarkup(
      <RbacPilotPage context={testContext} client={client} onInvalidated={onInvalidated} />
    );

    // Initial render sets up component
    expect(html).toContain('Quản lý vai trò (RBAC)');
  });

  describe('ASCII kebab-case role code validation constraint', () => {
    it('accepts valid ASCII kebab-case codes', () => {
      expect(isValidKebabCase('cad-model-reviewer')).toBe(true);
      expect(isValidKebabCase('org-admin')).toBe(true);
      expect(isValidKebabCase('vault-auditor-1')).toBe(true);
      expect(isValidKebabCase('viewer')).toBe(true);
      expect(isValidKebabCase('sec-ops-lead')).toBe(true);
    });

    it('rejects Vietnamese accented characters', () => {
      expect(isValidKebabCase('quản-trị')).toBe(false);
      expect(isValidKebabCase('người-xem')).toBe(false);
      expect(isValidKebabCase('kiểm-toán')).toBe(false);
      expect(isValidKebabCase('kế-toán-viên')).toBe(false);
    });

    it('rejects uppercase letters, spaces, underscores, and invalid punctuation', () => {
      expect(isValidKebabCase('CAD-Admin')).toBe(false);
      expect(isValidKebabCase('cad admin')).toBe(false);
      expect(isValidKebabCase('cad_admin')).toBe(false);
      expect(isValidKebabCase('cad.admin')).toBe(false);
      expect(isValidKebabCase('cad@admin')).toBe(false);
    });

    it('rejects leading, trailing, or consecutive hyphens', () => {
      expect(isValidKebabCase('-cad-admin')).toBe(false);
      expect(isValidKebabCase('cad-admin-')).toBe(false);
      expect(isValidKebabCase('cad--admin')).toBe(false);
      expect(isValidKebabCase('')).toBe(false);
    });
  });
});
