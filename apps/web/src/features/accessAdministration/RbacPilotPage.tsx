import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  createIamClient,
  type AdministrationContext,
  type AssignmentScope,
  type RoleView,
  type RoleCandidate,
  type RoleValidation,
  type PermissionView,
  type ProjectView,
  type BoundedPage,
  type IamResult,
  customRoleCeiling,
} from '../../api/iamClient';
import { roleProposalTarget } from './CustomRoleEditor';
import { outcomeMessage } from '../iamIntegration/IamStatus';
import { Button } from '../../ui/primitives/Button';
import { Input } from '../../ui/primitives/Input';
import { Badge } from '../../ui/primitives/Badge';
import { Dialog } from '../../ui/primitives/Dialog';
import { Drawer } from '../../ui/primitives/Drawer';
import { Alert, Spinner, EmptyState } from '../../ui/primitives/Feedback';
import { DataTable, Column } from '../../ui/table/DataTable';
import { InspectorLayout } from '../../ui/layout/InspectorLayout';

export type IamClientInstance = ReturnType<typeof createIamClient>;

export interface RbacPilotPageProps {
  context?: AdministrationContext | null;
  client?: IamClientInstance;
  onInvalidated?: () => void;
  onNavigateBack?: () => void;
}

const defaultClient = createIamClient();

export function isValidKebabCase(code: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code);
}

export const RbacPilotPage: React.FC<RbacPilotPageProps> = ({
  context,
  client = defaultClient,
  onInvalidated,
  onNavigateBack,
}) => {
  const activeClient = client;
  const alive = useRef(true);
  const epoch = useRef(0);

  // Authority & Session checks
  const isAuthenticated = Boolean(context && context.actorId);
  const canPrepare = Boolean(context?.actions.includes('role.definition.prepare'));
  const canActivate = Boolean(context?.actions.includes('role.definition.activate'));
  const canReadProjects = Boolean(context?.actions.includes('project.admin.read'));

  // Scope & Data state
  const [scope, setScope] = useState<AssignmentScope>(() =>
    context
      ? { kind: 'ORGANIZATION', organizationId: context.organizationId }
      : { kind: 'ORGANIZATION', organizationId: '' }
  );
  const [projects, setProjects] = useState<BoundedPage<ProjectView> | null>(null);
  const [roles, setRoles] = useState<RoleView[]>([]);
  const [permissions, setPermissions] = useState<PermissionView[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleView | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Candidate Lifecycle State
  const [candidate, setCandidate] = useState<RoleCandidate | null>(null);
  const [validation, setValidation] = useState<RoleValidation | null>(null);
  const [activeRole, setActiveRole] = useState<RoleView | null>(null);
  const [activationReason, setActivationReason] = useState('');
  const [activationConfirmed, setActivationConfirmed] = useState(false);

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Drawer Create State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [formBaseVersion, setFormBaseVersion] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formRoleCode, setFormRoleCode] = useState('');
  const [formSelectedPermissions, setFormSelectedPermissions] = useState<string[]>(['project.read']);
  const [formScopeKinds, setFormScopeKinds] = useState<string[]>(['PROJECT']);
  const [formPrincipalKinds, setFormPrincipalKinds] = useState<string[]>(['ACTOR']);
  const [formReason, setFormReason] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleClientFailure = useCallback(
    (res: IamResult<unknown>) => {
      if (res.kind === 'refused' && res.status === 401) {
        setCandidate(null);
        setValidation(null);
        setRoles([]);
        setErrorMessage('Phiên làm việc đã hết hạn hoặc không hợp lệ (401 Unauthorized).');
        onInvalidated?.();
        return;
      }
      if (res.kind === 'unresolved') {
        setErrorMessage('Chưa xác định kết quả từ Server. Giữ nguyên OperationId để kiểm tra lại intent.');
        return;
      }
      if (res.kind === 'stale') {
        setErrorMessage('Phiên bản dữ liệu đã cũ (409 Conflict). Vui lòng tải lại danh mục vai trò.');
        return;
      }
      if (res.kind === 'unavailable') {
        setErrorMessage('Dịch vụ IDEA Server tạm thời không khả dụng (503 Service Unavailable). Khóa thao tác theo fail-closed.');
        return;
      }
      setErrorMessage(outcomeMessage(res));
    },
    [onInvalidated]
  );

  const loadCatalogue = useCallback(
    async (targetScope: AssignmentScope) => {
      if (!context) return;
      const currentRequest = ++epoch.current;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [rolesRes, permsRes] = await Promise.all([
          activeClient.loadRoles(targetScope, 0),
          activeClient.loadPermissions(targetScope, 0),
        ]);

        if (!alive.current || currentRequest !== epoch.current) return;

        if (rolesRes.kind === 'confirmed') {
          setRoles(rolesRes.value.items);
          if (rolesRes.value.items.length > 0) {
            setSelectedRole((prev) =>
              prev ? rolesRes.value.items.find((r) => r.roleVersionId === prev.roleVersionId) || rolesRes.value.items[0] : rolesRes.value.items[0]
            );
          } else {
            setSelectedRole(null);
          }
        } else {
          handleClientFailure(rolesRes);
        }

        if (permsRes.kind === 'confirmed') {
          setPermissions(permsRes.value.items);
        } else {
          handleClientFailure(permsRes);
        }
      } catch {
        if (alive.current) {
          setErrorMessage('Không thể kết nối đến máy chủ IDEA Server.');
        }
      } finally {
        if (alive.current && currentRequest === epoch.current) {
          setIsLoading(false);
        }
      }
    },
    [context, activeClient, handleClientFailure]
  );

  // Load initial catalogue and projects
  useEffect(() => {
    alive.current = true;
    if (context) {
      const initialScope: AssignmentScope = {
        kind: 'ORGANIZATION',
        organizationId: context.organizationId,
      };
      setScope(initialScope);
      void loadCatalogue(initialScope);

      if (canReadProjects) {
        void activeClient.loadProjects().then((projRes) => {
          if (alive.current && projRes.kind === 'confirmed') {
            setProjects(projRes.value);
          }
        });
      }
    }

    return () => {
      alive.current = false;
      epoch.current++;
    };
  }, [context, activeClient, loadCatalogue, canReadProjects]);

  // Handle scope change
  const handleChangeScope = async (scopeValue: string) => {
    if (!context || isBusy) return;
    const newScope: AssignmentScope =
      scopeValue === 'ORGANIZATION'
        ? { kind: 'ORGANIZATION', organizationId: context.organizationId }
        : { kind: 'PROJECT', organizationId: context.organizationId, projectId: scopeValue };

    setScope(newScope);
    setCandidate(null);
    setValidation(null);
    setActiveRole(null);
    setFormBaseVersion('');
    await loadCatalogue(newScope);
  };

  const roleCodeError = useMemo(() => {
    if (!formRoleCode) return null;
    if (!isValidKebabCase(formRoleCode)) {
      return 'Mã vai trò phải là ASCII kebab-case (chỉ chữ thường a-z, số 0-9 và dấu gạch nối, không dấu tiếng Việt).';
    }
    if (formRoleCode.length < 3 || formRoleCode.length > 50) {
      return 'Độ dài mã vai trò phải từ 3 đến 50 ký tự.';
    }
    return null;
  }, [formRoleCode]);

  const canSubmitProposal = useMemo(() => {
    const isNameValid = formDisplayName.trim().length >= 3;
    const isBaseOrNewValid = formBaseVersion ? true : formRoleCode.trim().length >= 3 && roleCodeError === null;
    return (
      isNameValid &&
      isBaseOrNewValid &&
      formSelectedPermissions.length > 0 &&
      formScopeKinds.length > 0 &&
      formPrincipalKinds.length > 0 &&
      formReason.trim().length >= 5 &&
      canPrepare &&
      !isBusy
    );
  }, [
    formDisplayName,
    formBaseVersion,
    formRoleCode,
    roleCodeError,
    formSelectedPermissions,
    formScopeKinds,
    formPrincipalKinds,
    formReason,
    canPrepare,
    isBusy,
  ]);

  const handleOpenDrawer = () => {
    setFormBaseVersion('');
    setFormDisplayName('');
    setFormRoleCode('');
    setFormSelectedPermissions(['project.read']);
    setFormScopeKinds(['PROJECT']);
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

  const handleSelectBaseRole = (baseVersionId: string) => {
    setFormBaseVersion(baseVersionId);
    setIsFormDirty(true);
    const selected = roles.find((r) => r.roleVersionId === baseVersionId);
    if (selected) {
      setFormDisplayName(selected.displayName);
      setFormRoleCode(selected.roleCode);
      setFormSelectedPermissions(selected.permissions.map((p) => p.code));
      setFormScopeKinds(selected.scopeKinds);
      setFormPrincipalKinds(selected.principalKinds);
    } else {
      setFormDisplayName('');
      setFormRoleCode('');
      setFormSelectedPermissions(['project.read']);
    }
  };

  const handlePrepareCandidate = async () => {
    if (!canSubmitProposal || !context) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Server đang kiểm tra authority, scope và chuẩn bị candidate...');

    try {
      const target = roleProposalTarget(formBaseVersion, roles, formDisplayName);
      if (!target) {
        setErrorMessage('Exact base version không còn trong danh mục vai trò. Vui lòng chọn lại.');
        setIsBusy(false);
        return;
      }

      const operationId = crypto.randomUUID();
      const res = await activeClient.prepareRole({
        operationId,
        scope,
        ...target,
        permissionCodes: [...formSelectedPermissions],
        support: {
          scopeKinds: [...formScopeKinds],
          principalKinds: [...formPrincipalKinds],
        },
        reason: formReason.trim(),
      });

      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        setCandidate(res.value);
        setValidation(null);
        setActiveRole(null);
        setActivationReason('');
        setActivationConfirmed(false);
        setIsDrawerOpen(false);
        setIsFormDirty(false);
        setStatusMessage(
          `Server đã tạo và lưu candidate [${res.value.roleCode}] (Candidate ID: ${res.value.candidateId}). Trạng thái: CANDIDATE, chưa active và chưa cấp assignment.`
        );
        setInspectorOpen(true);
      } else {
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể kết nối đến máy chủ trong quá trình chuẩn bị candidate.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  const handleValidateCandidate = async () => {
    if (!candidate || isBusy) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Server đang xác thực snapshot candidate (Validate)...');

    try {
      const res = await activeClient.validateRole(candidate.candidateId, {
        scope: candidate.managementScope,
        expectedVersion: candidate.version,
      });

      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        if (
          res.value.candidate.candidateId === candidate.candidateId &&
          res.value.candidate.contentDigest === candidate.contentDigest
        ) {
          setValidation(res.value);
          setCandidate(res.value.candidate);
          setStatusMessage('Validation đạt tại thời điểm đọc. Server sẽ tiếp tục kiểm tra lại authority và version tại commit activation.');
        } else {
          setErrorMessage('Candidate digest hoặc ID không khớp với bản ghi xác thực từ Server.');
        }
      } else {
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể xác thực candidate do lỗi kết nối Server.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  const handleActivateRole = async () => {
    if (!candidate || !validation || !canActivate || !activationConfirmed || !activationReason.trim() || isBusy) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Server đang commit kích hoạt phiên bản role immutable mới...');

    try {
      const operationId = crypto.randomUUID();
      const res = await activeClient.activateRole(validation.candidate.candidateId, {
        operationId,
        scope: validation.candidate.managementScope,
        expectedVersion: validation.candidate.version,
        baseVersionId: validation.candidate.baseVersionId,
        reason: activationReason.trim(),
      });

      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        const activated = res.value;
        setActiveRole(activated);
        setCandidate(null);
        setValidation(null);
        setActivationReason('');
        setActivationConfirmed(false);
        setStatusMessage(
          `Server đã xác nhận kích hoạt thành công phiên bản immutable mới: ${activated.roleCode}@${activated.version}. Assignment cũ không đổi; version mới cần được cấp riêng.`
        );
        await loadCatalogue(scope);
        setSelectedRole(activated);
      } else {
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể kích hoạt vai trò do lỗi kết nối Server.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
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
      key: 'scopeKinds',
      header: 'Phạm vi',
      render: (r) => (
        <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
          {r.scopeKinds.join(', ')}
        </span>
      ),
    },
    {
      key: 'principalKinds',
      header: 'Chủ thể',
      render: (r) => (
        <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
          {r.principalKinds.join(', ')}
        </span>
      ),
    },
  ];

  // Render unauthenticated state (Fail-closed boundary)
  if (!isAuthenticated || !context) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <Alert variant="warning" title="Yêu cầu phiên xác thực (AdministrationContext)">
          Chưa có phiên làm việc được Server xác thực. Theo nguyên tắc bảo mật fail-closed,
          các chức năng quản trị vai trò RBAC bị khóa hoàn toàn cho tới khi đăng nhập hợp lệ.
        </Alert>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          {onNavigateBack && (
            <Button variant="secondary" onClick={onNavigateBack}>
              ← Quay lại
            </Button>
          )}
          <a
            href="#session"
            className="idea-btn idea-btn--primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Đăng nhập vào hệ thống
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 120px)' }}>
      {/* Scope Toolbar & Action Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--idea-color-border)',
          backgroundColor: 'var(--idea-color-surface)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onNavigateBack && (
            <Button variant="ghost" size="sm" onClick={onNavigateBack} title="Quay lại">
              ←
            </Button>
          )}
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Quản lý vai trò (RBAC)</h2>
            <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
              Server Scope: {context.organizationName} ({context.organizationId})
            </div>
          </div>
          <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>Scope:</label>
            <select
              aria-label="Management scope"
              disabled={isBusy || isLoading}
              value={scope.kind === 'ORGANIZATION' ? 'ORGANIZATION' : scope.projectId}
              onChange={(e) => void handleChangeScope(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid var(--idea-color-border)',
                backgroundColor: 'var(--idea-color-surface)',
                color: 'var(--idea-color-text)',
              }}
            >
              <option value="ORGANIZATION">Organization · {context.organizationName}</option>
              {projects?.items.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  Project · {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading || isBusy}
            onClick={() => void loadCatalogue(scope)}
          >
            {isLoading ? <Spinner size="sm" /> : '↻ Tải lại'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenDrawer}
            disabled={!canPrepare || isBusy || isLoading}
            title={canPrepare ? 'Chuẩn bị Custom Role Candidate mới' : 'Tài khoản thiếu quyền role.definition.prepare'}
          >
            + Tạo Candidate
          </Button>
        </div>
      </div>

      {/* Global Alerts / Status Feedbacks */}
      <div style={{ padding: '8px 16px 0 16px' }}>
        {statusMessage && (
          <div style={{ marginBottom: '8px' }}>
            <Alert variant="neutral" onClose={() => setStatusMessage(null)}>
              {statusMessage}
            </Alert>
          </div>
        )}
        {errorMessage && (
          <div style={{ marginBottom: '8px' }}>
            <Alert variant="danger" onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          </div>
        )}
        {!canPrepare && (
          <div style={{ marginBottom: '8px' }}>
            <Alert variant="neutral">
              Chế độ chỉ đọc: Tài khoản của bạn không có quyền <code>role.definition.prepare</code>.
              Chức năng tạo và kích hoạt vai trò tùy biến bị khóa.
            </Alert>
          </div>
        )}
      </div>

      {/* Main Split Layout: Table on Left, Inspector on Right */}
      <div style={{ flex: 1, position: 'relative' }}>
        <InspectorLayout
          isOpen={inspectorOpen}
          onToggle={setInspectorOpen}
          title={candidate ? 'Candidate Lifecycle' : 'Chi tiết Vai trò'}
          width={380}
          inspectorContent={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Candidate Flow in Inspector */}
              {candidate ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <Badge variant={validation ? 'admin' : 'business'}>
                      {validation ? 'VALIDATED CANDIDATE' : 'PREPARED CANDIDATE'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCandidate(null);
                        setValidation(null);
                      }}
                    >
                      Bỏ qua
                    </Button>
                  </div>

                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{candidate.displayName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '12px' }}>
                    Mã dự kiến: <code>{candidate.roleCode}@{candidate.proposedRoleVersion}</code>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Candidate ID: </span>
                      <code style={{ fontSize: '11px' }}>{candidate.candidateId}</code>
                    </div>
                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Phạm vi quản lý: </span>
                      <span>
                        {candidate.managementScope.kind} ·{' '}
                        <code>
                          {candidate.managementScope.kind === 'PROJECT'
                            ? candidate.managementScope.projectId
                            : candidate.managementScope.organizationId}
                        </code>
                      </span>
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
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Content Digest (Server SHA-256): </span>
                      <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{candidate.contentDigest}</code>
                    </div>
                  </div>

                  {/* Candidate Actions */}
                  {!validation ? (
                    <div style={{ marginTop: '16px' }}>
                      <Button
                        variant="primary"
                        style={{ width: '100%' }}
                        onClick={() => void handleValidateCandidate()}
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
                      <ul
                        style={{
                          margin: '0 0 12px 0',
                          paddingLeft: '18px',
                          fontSize: '11px',
                          color: 'var(--idea-color-text-muted)',
                        }}
                      >
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
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
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
                        disabled={!activationConfirmed || !activationReason.trim() || isBusy || !canActivate}
                        onClick={() => void handleActivateRole()}
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
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                        Danh sách quyền ({selectedRole.permissions.length}):
                      </div>
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
            {isLoading && roles.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <Spinner size="lg" />
              </div>
            ) : (
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
            )}
          </div>
        </InspectorLayout>
      </div>

      {/* Slide-over Drawer for Role Candidate Creation */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Tạo Custom Role Candidate mới"
        description="Nordic Functionalist Candidate Lifecycle Flow (Authoritative Server API)"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDrawer} disabled={isBusy}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={() => void handlePrepareCandidate()}
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
              Kế thừa từ vai trò gốc (Base Version)
            </label>
            <select
              aria-label="Kế thừa từ vai trò gốc"
              value={formBaseVersion}
              onChange={(e) => handleSelectBaseRole(e.target.value)}
              disabled={isBusy}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                border: '1px solid var(--idea-color-border)',
                backgroundColor: 'var(--idea-color-surface)',
                color: 'var(--idea-color-text)',
              }}
            >
              <option value="">Tạo Custom Role hoàn toàn mới</option>
              {roles
                .filter((r) => !r.builtIn)
                .map((r) => (
                  <option key={r.roleVersionId} value={r.roleVersionId} disabled={!r.selectable}>
                    {r.roleCode}@{r.version} — {r.displayName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Tên hiển thị vai trò (Display Name) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="Ví dụ: Người đánh giá mô hình CAD"
              value={formDisplayName}
              disabled={Boolean(formBaseVersion) || isBusy}
              onChange={(e) => {
                setFormDisplayName(e.target.value);
                setIsFormDirty(true);
              }}
            />
          </div>

          {!formBaseVersion && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Mã vai trò (Role Code - Bắt buộc ASCII kebab-case) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
              </label>
              <Input
                placeholder="vi-du: cad-model-reviewer"
                value={formRoleCode}
                disabled={isBusy}
                onChange={(e) => {
                  setFormRoleCode(e.target.value);
                  setIsFormDirty(true);
                }}
                errorMessage={roleCodeError || undefined}
              />
              <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px', display: 'block' }}>
                Chỉ chấp nhận chữ cái thường ASCII a-z, số 0-9 và dấu gạch nối (-).
              </span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Danh mục quyền được phép (Custom Role Ceiling) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {customRoleCeiling.map((permCode) => {
                const checked = formSelectedPermissions.includes(permCode);
                const permObj = permissions.find((p) => p.code === permCode);
                const isImplemented = permObj ? permObj.implementationState === 'IMPLEMENTED' : true;
                return (
                  <label
                    key={permCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      cursor: isImplemented ? 'pointer' : 'not-allowed',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: checked ? 'var(--idea-color-primary-subtle)' : 'transparent',
                      opacity: isImplemented ? 1 : 0.6,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!isImplemented || isBusy}
                      onChange={() => {
                        setIsFormDirty(true);
                        setFormSelectedPermissions((prev) =>
                          prev.includes(permCode) ? prev.filter((p) => p !== permCode) : [...prev, permCode]
                        );
                      }}
                    />
                    <code>{permCode}</code>
                    <small style={{ color: 'var(--idea-color-text-muted)' }}>
                      {permObj?.scopeKinds?.join('/')}
                    </small>
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
                    disabled={scope.kind === 'PROJECT' && sc === 'ORGANIZATION'}
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
              Lưu ý: Quyền quản trị chỉ hỗ trợ ACTOR cá nhân; chỉ <code>project.read</code> mới có thể hỗ trợ PROJECT_GROUP.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Lý do chuẩn bị Candidate <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="Nhập lý do tạo vai trò mới..."
              value={formReason}
              disabled={isBusy}
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
          Các thông tin vai trò bạn vừa nhập chưa được gửi lên Server để tạo Candidate.
          Nếu rời đi bây giờ, các thông tin này sẽ bị mất. Bạn có chắc chắn muốn hủy không?
        </p>
      </Dialog>
    </div>
  );
};
