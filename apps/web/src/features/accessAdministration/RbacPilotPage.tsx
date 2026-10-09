import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  type AdministrationContext,
  type AssignmentScope,
  type RoleView,
  type RoleCandidate,
  type RoleValidation,
  type PermissionView,
  customRoleCeiling,
} from '../../api/iamClient';
import { Button } from '../../ui/primitives/Button';
import { Input } from '../../ui/primitives/Input';
import { Badge } from '../../ui/primitives/Badge';
import { Dialog } from '../../ui/primitives/Dialog';
import { Drawer } from '../../ui/primitives/Drawer';
import { Alert, Spinner, EmptyState } from '../../ui/primitives/Feedback';
import { DataTable, Column } from '../../ui/table/DataTable';
import { InspectorLayout } from '../../ui/layout/InspectorLayout';

export interface RbacPilotPageProps {
  context?: AdministrationContext;
  onNavigateBack?: () => void;
}

const DEFAULT_CONTEXT: AdministrationContext = {
  actorId: '11111111-1111-4111-8111-111111111111',
  accountId: '22222222-2222-4222-8222-222222222222',
  organizationId: '33333333-3333-4333-8333-333333333333',
  displayName: 'Nguyễn Văn Quản Trị',
  organizationName: 'IDEA Industrial Hub',
  actions: [
    'role.catalogue.read',
    'role.definition.prepare',
    'role.definition.activate',
    'access.inspect',
    'audit.read',
    'project.admin.read',
  ],
};

const SAMPLE_PERMISSIONS: PermissionView[] = [
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
    code: 'access.inspect',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
  {
    code: 'audit.read',
    owner: 'IAM',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR'],
    participantMembershipRequired: false,
    implementationState: 'IMPLEMENTED',
  },
];

const INITIAL_ROLES: RoleView[] = [
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
    contentDigest: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    permissions: SAMPLE_PERMISSIONS,
    selectable: true,
    availabilityReason: null,
    managementScope: null,
  },
  {
    definitionId: '00000000-0000-4000-8000-000000000002',
    roleVersionId: '00000000-0000-4000-8000-000000000012',
    roleCode: 'project-viewer',
    version: 1,
    displayName: 'Người xem Dự án',
    builtIn: false,
    classification: 'BUSINESS',
    scopeKinds: ['ORGANIZATION', 'PROJECT'],
    principalKinds: ['ACTOR', 'PROJECT_GROUP'],
    contentDigest: 'b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01',
    permissions: [SAMPLE_PERMISSIONS[0], SAMPLE_PERMISSIONS[1]],
    selectable: true,
    availabilityReason: null,
    managementScope: { kind: 'ORGANIZATION', organizationId: '33333333-3333-4333-8333-333333333333' },
  },
  {
    definitionId: '00000000-0000-4000-8000-000000000003',
    roleVersionId: '00000000-0000-4000-8000-000000000013',
    roleCode: 'compliance-auditor',
    version: 1,
    displayName: 'Kiểm toán viên Tuân thủ',
    builtIn: false,
    classification: 'ADMINISTRATION',
    scopeKinds: ['ORGANIZATION'],
    principalKinds: ['ACTOR'],
    contentDigest: 'c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012',
    permissions: [SAMPLE_PERMISSIONS[1], SAMPLE_PERMISSIONS[2], SAMPLE_PERMISSIONS[3]],
    selectable: true,
    availabilityReason: null,
    managementScope: { kind: 'ORGANIZATION', organizationId: '33333333-3333-4333-8333-333333333333' },
  },
];

export function isValidKebabCase(code: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code);
}

export const RbacPilotPage: React.FC<RbacPilotPageProps> = ({
  context = DEFAULT_CONTEXT,
  onNavigateBack,
}) => {
  const [roles, setRoles] = useState<RoleView[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleView | null>(INITIAL_ROLES[1]);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Drawer Create State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  // Candidate creation form inputs
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formRoleCode, setFormRoleCode] = useState('');
  const [formSelectedPermissions, setFormSelectedPermissions] = useState<string[]>(['project.read']);
  const [formScopeKinds, setFormScopeKinds] = useState<string[]>(['ORGANIZATION', 'PROJECT']);
  const [formPrincipalKinds, setFormPrincipalKinds] = useState<string[]>(['ACTOR']);
  const [formReason, setFormReason] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Candidate Lifecycle State
  const [candidate, setCandidate] = useState<RoleCandidate | null>(null);
  const [validation, setValidation] = useState<RoleValidation | null>(null);
  const [activationReason, setActivationReason] = useState('');
  const [activationConfirmed, setActivationConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const roleCodeError = useMemo(() => {
    if (!formRoleCode) return null;
    if (!isValidKebabCase(formRoleCode)) {
      return 'Mã vai trò phải là ASCII kebab-case (chỉ chữ thường a-z, số 0-9 và dấu gạch nối, không dấu tiếng Việt).';
    }
    if (formRoleCode.length < 3 || formRoleCode.length > 50) {
      return 'Độ dài mã vai trò phải từ 3 đến 50 ký tự.';
    }
    return null;
  }, [formRoleCode, isValidKebabCase]);

  const canSubmitProposal = useMemo(() => {
    return (
      formDisplayName.trim().length >= 3 &&
      formRoleCode.trim().length >= 3 &&
      roleCodeError === null &&
      formSelectedPermissions.length > 0 &&
      formScopeKinds.length > 0 &&
      formPrincipalKinds.length > 0 &&
      formReason.trim().length >= 5 &&
      !isBusy
    );
  }, [
    formDisplayName,
    formRoleCode,
    roleCodeError,
    formSelectedPermissions,
    formScopeKinds,
    formPrincipalKinds,
    formReason,
    isBusy,
  ]);

  const handleOpenDrawer = () => {
    setFormDisplayName('');
    setFormRoleCode('');
    setFormSelectedPermissions(['project.read']);
    setFormScopeKinds(['ORGANIZATION', 'PROJECT']);
    setFormPrincipalKinds(['ACTOR']);
    setFormReason('');
    setIsFormDirty(false);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (isFormDirty) {
      setIsDiscardDialogOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false);
    setIsDrawerOpen(false);
    setIsFormDirty(false);
  };

  const handlePrepareCandidate = () => {
    if (!canSubmitProposal) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Đang chuẩn bị candidate trên hệ thống...');

    setTimeout(() => {
      const newCandidateId = `cnd-${Date.now().toString(36)}`;
      const newDefId = `def-${Date.now().toString(36)}`;
      const digest = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const newCandidate: RoleCandidate = {
        candidateId: newCandidateId,
        definitionId: newDefId,
        roleCode: formRoleCode.trim(),
        displayName: formDisplayName.trim(),
        managementScope: { kind: 'ORGANIZATION', organizationId: context.organizationId },
        baseVersionId: null,
        proposedRoleVersion: 1,
        classification: 'BUSINESS',
        support: {
          scopeKinds: [...formScopeKinds],
          principalKinds: [...formPrincipalKinds],
        },
        permissionCodes: [...formSelectedPermissions],
        contentDigest: digest,
        version: 1,
        state: 'CANDIDATE',
        activatedVersionId: null,
        difference: {
          added: [...formSelectedPermissions],
          removed: [],
          unchanged: [],
        },
      };

      setCandidate(newCandidate);
      setValidation(null);
      setActivationReason('');
      setActivationConfirmed(false);
      setIsDrawerOpen(false);
      setIsBusy(false);
      setStatusMessage(`Candidate [${newCandidate.roleCode}] đã được tạo thành công.`);
      setInspectorOpen(true);
    }, 300);
  };

  const handleValidateCandidate = () => {
    if (!candidate) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Đang kiểm tra tính hợp lệ của candidate (Validate)...');

    setTimeout(() => {
      // Validate constraints: project.read allows PROJECT_GROUP, administrative permissions only ACTOR
      const hasAdminPerm = candidate.permissionCodes.some((p) => p !== 'project.read');
      const hasGroupPrincipal = candidate.support.principalKinds.includes('PROJECT_GROUP');

      if (hasAdminPerm && hasGroupPrincipal) {
        setErrorMessage(
          'Từ chối hợp lệ: Quyền quản trị và kiểm toán (audit/role.catalogue) chỉ cho phép gán cho ACTOR cá nhân, không thể hỗ trợ PROJECT_GROUP.'
        );
        setIsBusy(false);
        return;
      }

      const valResult: RoleValidation = {
        valid: true,
        candidate,
        difference: candidate.difference,
        consequences: [
          `Tạo bản ghi Role Definition mới với mã ${candidate.roleCode}.`,
          `Phiên bản khởi tạo ban đầu là v1 (Immutable).`,
          `Các quyền được gắn: ${candidate.permissionCodes.join(', ')}.`,
          `Phạm vi quản lý: ORGANIZATION (${candidate.managementScope.organizationId}).`,
        ],
      };

      setValidation(valResult);
      setIsBusy(false);
      setStatusMessage('Candidate đã được Validate thành công. Sẵn sàng kích hoạt.');
    }, 300);
  };

  const handleActivateRole = () => {
    if (!candidate || !validation || !activationConfirmed || !activationReason.trim()) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Đang kích hoạt Role Version mới vào hệ thống...');

    setTimeout(() => {
      const activeRoleVersionId = `ver-${Date.now().toString(36)}`;
      const activePerms: PermissionView[] = candidate.permissionCodes.map((code) => {
        const found = SAMPLE_PERMISSIONS.find((p) => p.code === code);
        return (
          found || {
            code,
            owner: 'IAM',
            scopeKinds: candidate.support.scopeKinds,
            principalKinds: candidate.support.principalKinds,
            participantMembershipRequired: false,
            implementationState: 'IMPLEMENTED',
          }
        );
      });

      const newRole: RoleView = {
        definitionId: candidate.definitionId,
        roleVersionId: activeRoleVersionId,
        roleCode: candidate.roleCode,
        version: candidate.proposedRoleVersion,
        displayName: candidate.displayName,
        builtIn: false,
        classification: candidate.classification,
        scopeKinds: candidate.support.scopeKinds,
        principalKinds: candidate.support.principalKinds,
        contentDigest: candidate.contentDigest,
        permissions: activePerms,
        selectable: true,
        availabilityReason: null,
        managementScope: candidate.managementScope,
      };

      setRoles((prev) => [newRole, ...prev]);
      setSelectedRole(newRole);
      setCandidate(null);
      setValidation(null);
      setIsBusy(false);
      setStatusMessage(
        `Kích hoạt thành công! Role [${newRole.roleCode}@${newRole.version}] đã có hiệu lực (Immutable).`
      );
    }, 300);
  };

  const tableColumns: Column<RoleView>[] = [
    {
      key: 'roleCode',
      header: 'Mã vai trò & Phiên bản',
      sortable: true,
      width: '200px',
      render: (r) => (
        <div>
          <span style={{ fontWeight: 600 }}>{r.roleCode}</span>
          <span style={{ color: 'var(--idea-color-text-muted)', fontSize: '11px', marginLeft: '4px' }}>
            @{r.version}
          </span>
          {r.builtIn && (
            <span
              style={{
                marginLeft: '6px',
                fontSize: '10px',
                backgroundColor: 'var(--idea-color-surface-subtle)',
                padding: '1px 4px',
                borderRadius: '3px',
                border: '1px solid var(--idea-color-border)',
              }}
            >
              Built-in
            </span>
          )}
        </div>
      ),
    },
    { key: 'displayName', header: 'Tên hiển thị', sortable: true },
    {
      key: 'classification',
      header: 'Phân loại',
      sortable: true,
      width: '140px',
      render: (r) => {
        const variant =
          r.classification === 'HIGHEST'
            ? 'highest'
            : r.classification === 'ADMINISTRATION'
            ? 'admin'
            : 'business';
        return <Badge variant={variant}>{r.classification}</Badge>;
      },
    },
    {
      key: 'permissions',
      header: 'Số quyền',
      sortable: true,
      width: '100px',
      render: (r) => (
        <span>{r.permissions.length} quyền</span>
      ),
    },
    {
      key: 'scopeKinds',
      header: 'Phạm vi hỗ trợ',
      render: (r) => (
        <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
          {r.scopeKinds.join(' / ')}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Banner / Breadcrumb */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--idea-color-border)',
          backgroundColor: 'var(--idea-color-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginBottom: '2px' }}>
            Quản trị hệ thống &gt; Kiểm soát quyền truy cập &gt; Custom Role Pilot
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Quản lý vai trò (RBAC Pilot)</h2>
            <Badge variant="admin">AUTHORITATIVE SERVER SCOPE</Badge>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onNavigateBack && (
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              ← Quay lại
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleOpenDrawer}>
            + Tạo Custom Role mới
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div style={{ padding: '8px 16px 0 16px' }}>
          <Alert variant="success" onClose={() => setStatusMessage(null)}>
            {statusMessage}
          </Alert>
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: '8px 16px 0 16px' }}>
          <Alert variant="danger" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        </div>
      )}

      {/* Master-Detail with InspectorLayout */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <InspectorLayout
          isOpen={inspectorOpen}
          onToggle={setInspectorOpen}
          title={candidate ? 'Candidate Lifecycle' : 'Chi tiết vai trò'}
          width={380}
          inspectorContent={
            <div>
              {candidate ? (
                /* Candidate Lifecycle Inspector */
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <Badge variant={validation ? 'success' : 'warning'}>
                      {validation ? 'VALIDATED CANDIDATE' : 'PREPARED CANDIDATE'}
                    </Badge>
                  </div>

                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{candidate.displayName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '12px' }}>
                    Mã dự kiến: <code>{candidate.roleCode}@{candidate.proposedRoleVersion}</code>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Mã Candidate ID: </span>
                      <code>{candidate.candidateId}</code>
                    </div>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Phân loại: </span>
                      <Badge variant="business">{candidate.classification}</Badge>
                    </div>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Quyền được cấp: </span>
                      <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {candidate.permissionCodes.map((p) => (
                          <span
                            key={p}
                            style={{
                              backgroundColor: 'var(--idea-color-surface-subtle)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid var(--idea-color-border)',
                              fontFamily: 'var(--idea-font-family-mono)',
                              fontSize: '11px',
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Digest SHA-256: </span>
                      <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{candidate.contentDigest}</code>
                    </div>
                  </div>

                  {/* Actions based on state */}
                  {!validation ? (
                    <div style={{ marginTop: '16px' }}>
                      <Button
                        variant="primary"
                        style={{ width: '100%' }}
                        onClick={handleValidateCandidate}
                        disabled={isBusy}
                      >
                        {isBusy ? <Spinner size="sm" /> : 'Xác thực Candidate (Validate)'}
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        border: '1px solid var(--idea-color-border)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--idea-color-surface-subtle)',
                      }}
                    >
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>Hệ quả kích hoạt (Consequences):</h4>
                      <ul style={{ margin: '0 0 12px 0', paddingLeft: '18px', fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
                        {validation.consequences.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                          Lý do kích hoạt (Bắt buộc):
                        </label>
                        <Input
                          placeholder="Nhập lý do phê duyệt kích hoạt..."
                          value={activationReason}
                          onChange={(e) => setActivationReason(e.target.value)}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={activationConfirmed}
                            onChange={(e) => setActivationConfirmed(e.target.checked)}
                          />
                          <span>Tôi xác nhận kích hoạt phiên bản bất biến (Immutable).</span>
                        </label>
                      </div>

                      <Button
                        variant="primary"
                        style={{ width: '100%' }}
                        disabled={!activationConfirmed || !activationReason.trim() || isBusy}
                        onClick={handleActivateRole}
                      >
                        {isBusy ? <Spinner size="sm" /> : 'Kích hoạt phiên bản (Activate)'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : selectedRole ? (
                /* Selected Role Details */
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <Badge
                      variant={
                        selectedRole.classification === 'HIGHEST'
                          ? 'highest'
                          : selectedRole.classification === 'ADMINISTRATION'
                          ? 'admin'
                          : 'business'
                      }
                    >
                      {selectedRole.classification}
                    </Badge>
                  </div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{selectedRole.displayName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '14px' }}>
                    Mã hệ thống: <code>{selectedRole.roleCode}@{selectedRole.version}</code>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>Mã định danh Version:</div>
                      <code style={{ fontSize: '11px' }}>{selectedRole.roleVersionId}</code>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>Phạm vi áp dụng (Scopes):</div>
                      <div>{selectedRole.scopeKinds.join(', ')}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>Đối tượng áp dụng (Principals):</div>
                      <div>{selectedRole.principalKinds.join(', ')}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>Danh sách quyền ({selectedRole.permissions.length}):</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {selectedRole.permissions.map((p) => (
                          <div
                            key={p.code}
                            style={{
                              padding: '6px 8px',
                              backgroundColor: 'var(--idea-color-surface-subtle)',
                              borderRadius: '4px',
                              border: '1px solid var(--idea-color-border)',
                            }}
                          >
                            <div style={{ fontFamily: 'var(--idea-font-family-mono)', fontWeight: 600 }}>{p.code}</div>
                            <div style={{ fontSize: '10px', color: 'var(--idea-color-text-muted)' }}>
                              Owner: {p.owner} · Trạng thái: {p.implementationState}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Chưa chọn vai trò"
                  description="Nhấp vào một vai trò trong bảng bên trái để kiểm tra chi tiết hoặc kích hoạt."
                />
              )}
            </div>
          }
        >
          {/* Master View: DataTable */}
          <div style={{ padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            <DataTable
              data={roles}
              columns={tableColumns}
              getRowId={(r) => r.roleVersionId}
              selectedId={selectedRole?.roleVersionId}
              onSelectRow={(r) => {
                setSelectedRole(r);
                setCandidate(null);
                setValidation(null);
              }}
              filterPlaceholder="Lọc vai trò theo mã hoặc tên..."
              ariaLabel="Bảng danh sách vai trò phân quyền"
            />
          </div>
        </InspectorLayout>
      </div>

      {/* Slide-over Drawer for Role Creation */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Tạo Custom Role Candidate mới"
        description="Nordic Functionalist Candidate Lifecycle Flow"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDrawer} disabled={isBusy}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={handlePrepareCandidate}
              disabled={!canSubmitProposal || isBusy}
            >
              {isBusy ? <Spinner size="sm" /> : 'Chuẩn bị Candidate (Prepare)'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Tên hiển thị vai trò (Display Name) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="Ví dụ: Người đánh giá mô hình CAD"
              value={formDisplayName}
              onChange={(e) => {
                setFormDisplayName(e.target.value);
                setIsFormDirty(true);
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Mã vai trò (Role Code - Bắt buộc ASCII kebab-case) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="vi-du: cad-model-reviewer"
              value={formRoleCode}
              onChange={(e) => {
                setFormRoleCode(e.target.value);
                setIsFormDirty(true);
              }}
              errorMessage={roleCodeError || undefined}
            />
            <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px', display: 'block' }}>
              Chỉ chấp nhận chữ cái thường ASCII a-z, số 0-9 và dấu gạch nối (-). Không tự sinh từ tiếng Việt.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Danh mục quyền được phép (Custom Role Ceiling) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {customRoleCeiling.map((permCode) => {
                const checked = formSelectedPermissions.includes(permCode);
                return (
                  <label
                    key={permCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: checked ? 'var(--idea-color-primary-subtle)' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setIsFormDirty(true);
                        setFormSelectedPermissions((prev) =>
                          prev.includes(permCode)
                            ? prev.filter((p) => p !== permCode)
                            : [...prev, permCode]
                        );
                      }}
                    />
                    <code>{permCode}</code>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Phạm vi hỗ trợ (Scope Support)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['ORGANIZATION', 'PROJECT'].map((sc) => (
                <label key={sc} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formScopeKinds.includes(sc)}
                    onChange={() => {
                      setIsFormDirty(true);
                      setFormScopeKinds((prev) =>
                        prev.includes(sc) ? prev.filter((s) => s !== sc) : [...prev, sc]
                      );
                    }}
                  />
                  <span>{sc}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Chủ thể hỗ trợ (Principal Support)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['ACTOR', 'PROJECT_GROUP'].map((pr) => (
                <label key={pr} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formPrincipalKinds.includes(pr)}
                    onChange={() => {
                      setIsFormDirty(true);
                      setFormPrincipalKinds((prev) =>
                        prev.includes(pr) ? prev.filter((p) => p !== pr) : [...prev, pr]
                      );
                    }}
                  />
                  <span>{pr}</span>
                </label>
              ))}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '4px', display: 'block' }}>
              Lưu ý: Chỉ quyền <code>project.read</code> mới có thể gán cho PROJECT_GROUP.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Lý do chuẩn bị Candidate <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="Nhập lý do tạo vai trò mới..."
              value={formReason}
              onChange={(e) => {
                setFormReason(e.target.value);
                setIsFormDirty(true);
              }}
            />
          </div>
        </div>
      </Drawer>

      {/* Dirty Discard Dialog */}
      <Dialog
        isOpen={isDiscardDialogOpen}
        onClose={() => setIsDiscardDialogOpen(false)}
        title="Hủy bỏ thay đổi chưa lưu?"
        description="Cảnh báo khi rời khỏi form tạo Custom Role"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDiscardDialogOpen(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="danger" onClick={handleConfirmDiscard}>
              Hủy bỏ thay đổi
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          Các thông tin vai trò bạn vừa nhập chưa được chuẩn bị thành Candidate.
          Nếu rời đi bây giờ, các thông tin này sẽ bị mất. Bạn có chắc chắn muốn hủy không?
        </p>
      </Dialog>
    </div>
  );
};
