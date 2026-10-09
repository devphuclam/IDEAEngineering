import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  type AdministrationContext,
  type AssignmentScope,
  type RoleView,
  type RoleCandidate,
  type RoleValidation,
  type RoleProposal,
  type RoleActivation,
  type PermissionView,
  type ProjectView,
  type BoundedPage,
  type IamResult,
  type OperationResolution,
  createIamClient,
  customRoleCeiling,
} from '../../api/iamClient';
import { roleProposalTarget } from './CustomRoleEditor';
import { Button } from '../../ui/primitives/Button';
import { Input } from '../../ui/primitives/Input';
import { Badge } from '../../ui/primitives/Badge';
import { Alert, Spinner, EmptyState } from '../../ui/primitives/Feedback';
import { Dialog } from '../../ui/primitives/Dialog';
import { Drawer } from '../../ui/primitives/Drawer';
import { DataTable, Column } from '../../ui/table/DataTable';
import { InspectorLayout } from '../../ui/layout/InspectorLayout';
import { outcomeMessage } from '../iamIntegration/IamStatus';

export { roleProposalTarget };

export type IamClientInstance = {
  loadRoles: (scope: AssignmentScope, offset?: number) => Promise<IamResult<BoundedPage<RoleView>>>;
  loadPermissions: (scope: AssignmentScope, offset?: number) => Promise<IamResult<BoundedPage<PermissionView>>>;
  loadProjects: (filter?: string, offset?: number) => Promise<IamResult<BoundedPage<ProjectView>>>;
  prepareRole: (input: RoleProposal) => Promise<IamResult<RoleCandidate>>;
  validateRole: (id: string, input: { scope: AssignmentScope; expectedVersion: number }) => Promise<IamResult<RoleValidation>>;
  activateRole: (id: string, input: RoleActivation) => Promise<IamResult<RoleView>>;
  resolveOperation: (id: string, scope: AssignmentScope) => Promise<IamResult<OperationResolution>>;
};

export interface PendingMutation {
  operationId: string;
  kind: 'PREPARE' | 'ACTIVATE';
  scope: AssignmentScope;
  payload: RoleProposal | RoleActivation;
  candidateId?: string;
  submittedAt: string;
}

export interface RbacPilotPageProps {
  context: AdministrationContext | null;
  client?: IamClientInstance;
  onInvalidated?: () => void;
  onNavigateBack?: () => void;
}

const defaultClient: IamClientInstance = createIamClient();

// SVG Icons
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// Permission Explanations
export const PERMISSION_METADATA: Record<string, { title: string; description: string }> = {
  'project.read': {
    title: 'Xem dữ liệu & tài liệu dự án',
    description: 'Cho phép truy cập danh mục hồ sơ kỹ thuật, bản vẽ CAD và trạng thái thẩm định dự án.',
  },
  'role.catalogue.read': {
    title: 'Tra cứu danh mục vai trò',
    description: 'Đọc thông tin các vai trò hệ thống, phiên bản hiệu lực và giới hạn trần quyền hạn.',
  },
  'access.inspect': {
    title: 'Đối soát quyền truy cập thực tế',
    description: 'Kiểm tra đường dẫn phân quyền (grant paths) và lý do hợp lệ của từng tài khoản.',
  },
  'audit.read': {
    title: 'Xem nhật ký kiểm toán hệ thống',
    description: 'Truy vết toàn bộ nhật ký thay đổi vai trò, các phiên kích hoạt và định danh phê duyệt.',
  },
};

// Lifecycle Stepper
const LifecycleStepper: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '6px', border: '1px solid var(--idea-color-border-subtle)' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--idea-color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      Tiến trình cấu hình vai trò
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: step >= 1 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 1 ? '#ffffff' : 'var(--idea-color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid var(--idea-color-border)',
          }}
        >
          1
        </span>
        <span style={{ fontSize: '11px', fontWeight: step === 1 ? 600 : 400, color: step >= 1 ? 'var(--idea-color-text)' : 'var(--idea-color-text-muted)' }}>
          Soạn bản thảo
        </span>
      </div>

      <span style={{ height: '1px', flex: 1, margin: '0 8px', backgroundColor: step >= 2 ? 'var(--idea-color-primary)' : 'var(--idea-color-border)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: step >= 2 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 2 ? '#ffffff' : 'var(--idea-color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid var(--idea-color-border)',
          }}
        >
          2
        </span>
        <span style={{ fontSize: '11px', fontWeight: step === 2 ? 600 : 400, color: step >= 2 ? 'var(--idea-color-text)' : 'var(--idea-color-text-muted)' }}>
          Kiểm tra hợp lệ
        </span>
      </div>

      <span style={{ height: '1px', flex: 1, margin: '0 8px', backgroundColor: step >= 3 ? 'var(--idea-color-primary)' : 'var(--idea-color-border)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: step >= 3 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 3 ? '#ffffff' : 'var(--idea-color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid var(--idea-color-border)',
          }}
        >
          3
        </span>
        <span style={{ fontSize: '11px', fontWeight: step === 3 ? 600 : 400, color: step >= 3 ? 'var(--idea-color-text)' : 'var(--idea-color-text-muted)' }}>
          Kích hoạt chính thức
        </span>
      </div>
    </div>
  </div>
);

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
  const [permissions, setPermissions] = useState<PermissionView[] | null>(null);
  const [permissionsIncomplete, setPermissionsIncomplete] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleView | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Candidate Lifecycle State
  const [candidate, setCandidate] = useState<RoleCandidate | null>(null);
  const [validation, setValidation] = useState<RoleValidation | null>(null);
  const [activeRole, setActiveRole] = useState<RoleView | null>(null);
  const [activationReason, setActivationReason] = useState('');
  const [activationConfirmed, setActivationConfirmed] = useState(false);

  // Exact Mutation Intent & Recovery State (P0.1)
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);
  const [lastOperationId, setLastOperationId] = useState<string | null>(null);

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Conflicting actions lock
  const isLocked = isBusy || Boolean(pendingMutation);

  // Drawer Create State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [formBaseVersion, setFormBaseVersion] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
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
        setPermissions(null);
        setPendingMutation(null);
        setErrorMessage('Phiên làm việc đã hết hạn hoặc không hợp lệ (401 Unauthorized). Vui lòng đăng nhập lại.');
        onInvalidated?.();
        return;
      }
      if (res.kind === 'unresolved') {
        setErrorMessage('Giao dịch chưa xác định kết quả (UNRESOLVED). Intent gốc được giữ nguyên trong RAM; không tạo OperationId mới. Vui lòng đối soát trạng thái giao dịch.');
        return;
      }
      if (res.kind === 'stale') {
        setErrorMessage('Dữ liệu vai trò đã có người cập nhật (409 Conflict). Vui lòng nhấn "Tải lại" để xem phiên bản mới nhất.');
        return;
      }
      if (res.kind === 'unavailable') {
        setErrorMessage('Máy chủ IDEA Server tạm thời không phản hồi (503 Service Unavailable). Hệ thống đã tự động khóa các thao tác ghi để bảo vệ dữ liệu.');
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
          if (permsRes.value.hasMore) {
            // Fail-closed: incomplete permission catalogue pagination prevents preparation
            setPermissions(null);
            setPermissionsIncomplete(true);
            setErrorMessage('Danh mục quyền hạn (Permissions) trên máy chủ chưa tải đầy đủ qua phân trang (hasMore=true). Hệ thống khóa chuẩn bị vai trò để đảm bảo an toàn fail-closed.');
          } else {
            setPermissions(permsRes.value.items);
            setPermissionsIncomplete(false);
          }
        } else {
          setPermissions(null);
          setPermissionsIncomplete(true);
          handleClientFailure(permsRes);
        }
      } catch {
        if (alive.current) {
          setErrorMessage('Không thể kết nối đến máy chủ IDEA Server. Vui lòng kiểm tra kết nối mạng.');
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
    if (!context || isLocked) return;
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

  // Valid proposal submission check
  const canSubmitProposal = useMemo(() => {
    const isNameValid = formDisplayName.trim().length >= 3;
    const isPermissionsAvailable = permissions !== null && !permissionsIncomplete;
    return (
      isNameValid &&
      isPermissionsAvailable &&
      formSelectedPermissions.length > 0 &&
      formScopeKinds.length > 0 &&
      formPrincipalKinds.length > 0 &&
      formReason.trim().length >= 5 &&
      canPrepare &&
      !isLocked
    );
  }, [
    formDisplayName,
    permissions,
    permissionsIncomplete,
    formSelectedPermissions,
    formScopeKinds,
    formPrincipalKinds,
    formReason,
    canPrepare,
    isLocked,
  ]);

  const handleOpenDrawer = () => {
    if (isLocked) return;
    setFormBaseVersion('');
    setFormDisplayName('');
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
      const implementedCodes = selected.permissions
        .filter((p) => p.implementationState === 'IMPLEMENTED')
        .map((p) => p.code);
      setFormSelectedPermissions(implementedCodes.length > 0 ? implementedCodes : ['project.read']);
      setFormScopeKinds(selected.scopeKinds);
      setFormPrincipalKinds(selected.principalKinds);
    } else {
      setFormDisplayName('');
      setFormSelectedPermissions(['project.read']);
    }
  };

  // Prepare candidate with exact mutation intent safety (P0.1 & P1.1)
  const handlePrepareCandidate = async () => {
    if (!canSubmitProposal || !context || isLocked) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Máy chủ đang kiểm tra quyền và lưu bản thảo vai trò (Candidate)...');

    try {
      const target = roleProposalTarget(formBaseVersion, roles, formDisplayName);
      if (!target) {
        setErrorMessage('Vai trò gốc đã chọn không còn trong danh mục hiện tại. Vui lòng chọn lại.');
        setIsBusy(false);
        return;
      }

      // Generate operationId only for fresh intent
      const operationId = crypto.randomUUID();
      setLastOperationId(operationId);

      const proposal: RoleProposal = {
        operationId,
        scope,
        ...target,
        permissionCodes: [...formSelectedPermissions],
        support: {
          scopeKinds: [...formScopeKinds],
          principalKinds: [...formPrincipalKinds],
        },
        reason: formReason.trim(),
      };

      const res = await activeClient.prepareRole(proposal);
      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        setPendingMutation(null);
        setCandidate(res.value);
        setValidation(null);
        setActiveRole(null);
        setActivationReason('');
        setActivationConfirmed(false);
        setIsDrawerOpen(false);
        setIsFormDirty(false);
        setStatusMessage(
          `Máy chủ đã lưu bản thảo vai trò [${res.value.roleCode}] thành công. Bản thảo này chưa có hiệu lực cho tới khi bạn hoàn tất bước Kích hoạt.`
        );
        setInspectorOpen(true);
      } else if (res.kind === 'unresolved') {
        // UNRESOLVED: Preserve operationId and exact immutable payload in RAM; lock conflicting mutations
        setPendingMutation({
          operationId,
          kind: 'PREPARE',
          scope,
          payload: proposal,
          submittedAt: new Date().toISOString(),
        });
        setValidation(null);
        setActivationConfirmed(false);
        setErrorMessage('Giao dịch lưu bản thảo chưa rõ kết quả (UNRESOLVED). Intent giao dịch gốc được bảo lưu nguyên vẹn; không sinh OperationId mới. Vui lòng đối soát trạng thái giao dịch.');
      } else {
        setPendingMutation(null);
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể kết nối đến máy chủ trong quá trình lưu bản thảo vai trò.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  // Validate candidate
  const handleValidateCandidate = async () => {
    if (!candidate || isLocked) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Máy chủ đang đối soát tính hợp lệ và tương thích của vai trò...');

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
          setStatusMessage('Máy chủ xác nhận vai trò hợp lệ, không có xung đột bảo mật. Bạn có thể tiến hành kích hoạt.');
        } else {
          setErrorMessage('Mã băm kiểm tra (Digest) không trùng khớp với bản ghi trên máy chủ. Vui lòng lưu lại bản thảo.');
        }
      } else {
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể xác thực bản thảo do lỗi đường truyền kết nối máy chủ.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  // Activate role with exact mutation intent safety (P0.1)
  const handleActivateRole = async () => {
    if (!candidate || !validation || !canActivate || !activationConfirmed || !activationReason.trim() || isLocked) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Máy chủ đang lưu và kích hoạt phiên bản vai trò chính thức...');

    try {
      const operationId = crypto.randomUUID();
      setLastOperationId(operationId);

      const activationPayload: RoleActivation = {
        operationId,
        scope: validation.candidate.managementScope,
        expectedVersion: validation.candidate.version,
        baseVersionId: validation.candidate.baseVersionId,
        reason: activationReason.trim(),
      };

      const res = await activeClient.activateRole(validation.candidate.candidateId, activationPayload);
      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        const activated = res.value;
        setPendingMutation(null);
        setActiveRole(activated);
        setCandidate(null);
        setValidation(null);
        setActivationReason('');
        setActivationConfirmed(false);
        setStatusMessage(
          `Kích hoạt thành công! Phiên bản chính thức [${activated.roleCode}@${activated.version}] đã có hiệu lực trên hệ thống. Các tài khoản đang dùng vai trò cũ vẫn được bảo lưu an toàn.`
        );
        await loadCatalogue(scope);
        setSelectedRole(activated);
      } else if (res.kind === 'unresolved') {
        // UNRESOLVED: Preserve operationId and exact immutable payload in RAM; lock conflicting mutations
        setPendingMutation({
          operationId,
          kind: 'ACTIVATE',
          candidateId: validation.candidate.candidateId,
          scope: validation.candidate.managementScope,
          payload: activationPayload,
          submittedAt: new Date().toISOString(),
        });
        setErrorMessage('Giao dịch kích hoạt chưa rõ kết quả (UNRESOLVED). Intent giao dịch gốc và OperationId được giữ nguyên trong RAM; không tạo OperationId mới. Vui lòng đối soát trạng thái giao dịch.');
      } else {
        setPendingMutation(null);
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Không thể kích hoạt vai trò do lỗi kết nối máy chủ.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  // Authoritative Operation Resolution (P0.1)
  const handleResolveOperation = async () => {
    if (!pendingMutation || isBusy) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage(`Đang đối soát trạng thái giao dịch [${pendingMutation.operationId}] trên máy chủ...`);

    try {
      const res = await activeClient.resolveOperation(pendingMutation.operationId, pendingMutation.scope);
      if (!alive.current) return;

      if (res.kind === 'confirmed') {
        const resolution = res.value;
        if (resolution.state === 'COMMITTED_ACCEPTED') {
          // Mutation committed successfully on server
          setStatusMessage(`Máy chủ xác nhận giao dịch đã commit thành công (COMMITTED_ACCEPTED)! Đang cập nhật dữ liệu...`);
          setPendingMutation(null);
          await loadCatalogue(pendingMutation.scope);
        } else if (resolution.state === 'COMMITTED_REFUSED') {
          // Mutation was definitively refused
          setErrorMessage(`Máy chủ đã từ chối giao dịch: ${resolution.reasonCode || resolution.outcome || 'COMMITTED_REFUSED'}.`);
          setPendingMutation(null);
        } else {
          // Still UNRESOLVED
          setStatusMessage(`Giao dịch vẫn chưa có kết quả cuối cùng trên máy chủ (state: UNRESOLVED).`);
        }
      } else if (res.kind === 'unresolved' || res.kind === 'unavailable') {
        setErrorMessage('Chưa thể kết nối tới dịch vụ đối soát giao dịch trên máy chủ. Vui lòng thử lại.');
      } else {
        handleClientFailure(res);
      }
    } catch {
      if (alive.current) {
        setErrorMessage('Lỗi kết nối trong quá trình đối soát giao dịch.');
      }
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  // Replay exact intent with same operationId (P0.1)
  const handleReplayPendingMutation = async () => {
    if (!pendingMutation || isBusy) return;
    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage(`Đang gửi lại đúng intent gốc cùng OperationId [${pendingMutation.operationId}]...`);

    try {
      if (pendingMutation.kind === 'PREPARE') {
        const res = await activeClient.prepareRole(pendingMutation.payload as RoleProposal);
        if (!alive.current) return;
        if (res.kind === 'confirmed') {
          setPendingMutation(null);
          setCandidate(res.value);
          setValidation(null);
          setStatusMessage(`Máy chủ đã xác nhận lưu bản thảo vai trò [${res.value.roleCode}] thành công.`);
        } else if (res.kind === 'unresolved') {
          setErrorMessage('Giao dịch vẫn chưa rõ kết quả sau khi gửi lại. Vui lòng nhấn "Đối soát trên máy chủ".');
        } else {
          setPendingMutation(null);
          handleClientFailure(res);
        }
      } else if (pendingMutation.kind === 'ACTIVATE') {
        const res = await activeClient.activateRole(
          pendingMutation.candidateId || '',
          pendingMutation.payload as RoleActivation
        );
        if (!alive.current) return;
        if (res.kind === 'confirmed') {
          setPendingMutation(null);
          setActiveRole(res.value);
          setCandidate(null);
          setValidation(null);
          setStatusMessage(`Kích hoạt thành công phiên bản chính thức [${res.value.roleCode}@${res.value.version}].`);
          await loadCatalogue(scope);
          setSelectedRole(res.value);
        } else if (res.kind === 'unresolved') {
          setErrorMessage('Giao dịch kích hoạt vẫn chưa rõ kết quả sau khi gửi lại.');
        } else {
          setPendingMutation(null);
          handleClientFailure(res);
        }
      }
    } catch {
      if (alive.current) setErrorMessage('Lỗi kết nối khi gửi lại intent.');
    } finally {
      if (alive.current) setIsBusy(false);
    }
  };

  const tableColumns: Column<RoleView>[] = [
    {
      key: 'roleCode',
      header: 'Mã vai trò & Phiên bản',
      sortable: true,
      width: '220px',
      render: (r) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--idea-color-text)' }}>{r.roleCode}</span>
            <span style={{ color: 'var(--idea-color-text-muted)', fontSize: '11px', fontFamily: 'var(--idea-font-family-mono)' }}>
              v{r.version}
            </span>
          </div>
          <div style={{ marginTop: '2px' }}>
            {r.builtIn ? (
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--idea-color-surface-subtle)',
                  color: 'var(--idea-color-text-muted)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid var(--idea-color-border-subtle)',
                }}
              >
                Mặc định hệ thống
              </span>
            ) : (
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--idea-color-primary-subtle)',
                  color: 'var(--idea-color-primary)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid var(--idea-color-primary)',
                }}
              >
                Tùy biến tổ chức
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'displayName',
      header: 'Tên hiển thị vai trò',
      sortable: true,
      render: (r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.displayName}</div>
          <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px' }}>
            {r.permissions.length} quyền hạn được gán
          </div>
        </div>
      ),
    },
    {
      key: 'classification',
      header: 'Phân loại',
      sortable: true,
      width: '150px',
      render: (r) => {
        const variant =
          r.classification === 'HIGHEST'
            ? 'highest'
            : r.classification === 'ADMINISTRATION'
            ? 'admin'
            : 'business';
        const label =
          r.classification === 'HIGHEST'
            ? 'Tối cao (HIGHEST)'
            : r.classification === 'ADMINISTRATION'
            ? 'Quản trị (ADMIN)'
            : 'Nghiệp vụ (BUSINESS)';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'scopeKinds',
      header: 'Phạm vi',
      render: (r) => (
        <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
          {r.scopeKinds.map((s) => (s === 'ORGANIZATION' ? 'Tổ chức' : 'Dự án')).join(', ')}
        </span>
      ),
    },
    {
      key: 'principalKinds',
      header: 'Chủ thể',
      render: (r) => (
        <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
          {r.principalKinds.map((p) => (p === 'ACTOR' ? 'Cá nhân' : 'Nhóm dự án')).join(', ')}
        </span>
      ),
    },
  ];

  // Render unauthenticated state (Fail-closed boundary)
  if (!isAuthenticated || !context) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--idea-color-surface-subtle)', color: 'var(--idea-color-warning)', border: '1px solid var(--idea-color-border)' }}>
            <ShieldIcon />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Quản lý vai trò &amp; Phân quyền (RBAC)</h2>
            <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
              Khu vực quản trị cấu hình vai trò của hệ thống IDEA Engineering
            </div>
          </div>
        </div>

        <Alert variant="warning" title="Yêu cầu phiên xác thực (AdministrationContext)">
          Chưa có phiên làm việc được Server xác thực. Theo nguyên tắc bảo mật fail-closed,
          các chức năng quản trị vai trò RBAC bị khóa hoàn toàn cho tới khi đăng nhập hợp lệ.
        </Alert>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          {onNavigateBack && (
            <Button variant="secondary" onClick={onNavigateBack}>
              <ArrowLeftIcon /> Quay lại
            </Button>
          )}
          <a
            href="#session"
            className="idea-btn idea-btn--primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            Đăng nhập vào hệ thống
          </a>
        </div>
      </div>
    );
  }

  const selectedBaseRole = formBaseVersion ? roles.find((r) => r.roleVersionId === formBaseVersion) : null;

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
              <ArrowLeftIcon />
            </Button>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Quản lý vai trò (RBAC)</h2>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--idea-color-surface-subtle)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid var(--idea-color-border-subtle)',
                  color: 'var(--idea-color-text-muted)',
                }}
              >
                {roles.length} vai trò
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '1px' }}>
              Server Scope: {context.organizationName} ({context.organizationId})
            </div>
          </div>

          <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>Phạm vi xem:</label>
            <select
              aria-label="Management scope"
              disabled={isLocked || isLoading}
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
              <option value="ORGANIZATION">Tổ chức · {context.organizationName}</option>
              {projects?.items.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  Dự án · {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading || isLocked}
            onClick={() => void loadCatalogue(scope)}
            title="Tải lại danh sách vai trò từ máy chủ"
          >
            {isLoading ? <Spinner size="sm" /> : <><RefreshIcon /> Tải lại</>}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenDrawer}
            disabled={!canPrepare || isLocked || isLoading || permissionsIncomplete}
            title={canPrepare ? 'Soạn thảo bản thảo vai trò tùy biến mới' : 'Tài khoản thiếu quyền role.definition.prepare'}
          >
            + Tạo Candidate
          </Button>
        </div>
      </div>

      {/* Global Alerts / Status Feedbacks */}
      <div style={{ padding: '8px 16px 0 16px' }}>
        {/* Pending Mutation Recovery Banner (P0.1) */}
        {pendingMutation && (
          <div style={{ marginBottom: '12px', padding: '12px', border: '1px solid var(--idea-color-warning)', backgroundColor: 'var(--idea-color-warning-subtle, rgba(234, 179, 8, 0.1))', borderRadius: '6px' }} role="alert">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--idea-color-text)' }}>
                Cảnh báo an toàn đột biến: Giao dịch [{pendingMutation.kind}] chưa xác định kết quả (UNRESOLVED)
              </span>
              <Badge variant="highest">LOCKED</Badge>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
              Intent gốc được giữ nguyên trong bộ nhớ với mã giao dịch: <code style={{ fontWeight: 600 }}>{pendingMutation.operationId}</code>.
              Hệ thống đã khóa các thao tác đột biến khác để tránh gửi trùng lặp hoặc vi phạm tính bất biến.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button size="sm" variant="primary" disabled={isBusy} onClick={() => void handleResolveOperation()}>
                {isBusy ? <Spinner size="sm" /> : 'Đối soát trên máy chủ (resolveOperation)'}
              </Button>
              <Button size="sm" variant="secondary" disabled={isBusy} onClick={() => void handleReplayPendingMutation()}>
                Gửi lại đúng Intent gốc (Cùng OperationId)
              </Button>
            </div>
          </div>
        )}

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
        {lastOperationId && !pendingMutation && (
          <div style={{ marginBottom: '4px', fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
            Giao dịch gần nhất: <code>{lastOperationId}</code>
          </div>
        )}
        {!canPrepare && (
          <div style={{ marginBottom: '8px' }}>
            <Alert variant="neutral">
              Chế độ chỉ đọc: Tài khoản của bạn không có quyền <code>role.definition.prepare</code>.
              Chức năng tạo và kích hoạt vai trò tùy biến bị khóa để đảm bảo an toàn chính sách.
            </Alert>
          </div>
        )}
      </div>

      {/* Main Split Layout: Table on Left, Inspector on Right */}
      <div style={{ flex: 1, position: 'relative' }}>
        <InspectorLayout
          isOpen={inspectorOpen}
          onToggle={setInspectorOpen}
          title={candidate ? 'Quy trình vai trò đang soạn' : 'Chi tiết Vai trò'}
          width={400}
          inspectorContent={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Candidate Flow in Inspector */}
              {candidate ? (
                <div>
                  <LifecycleStepper step={validation ? 3 : 2} />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <Badge variant={validation ? 'admin' : 'business'}>
                      {validation ? 'ĐÃ XÁC THỰC HỢP LỆ' : 'BẢN THẢO (CANDIDATE)'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCandidate(null);
                        setValidation(null);
                      }}
                    >
                      Đóng xem
                    </Button>
                  </div>

                  <h3 style={{ margin: '0 0 2px 0', fontSize: '15px' }}>{candidate.displayName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '12px' }}>
                    Mã hệ thống: <code style={{ color: 'var(--idea-color-primary)', fontWeight: 600 }}>{candidate.roleCode}@v{candidate.proposedRoleVersion}</code>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    <div style={{ padding: '8px 10px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '4px', border: '1px solid var(--idea-color-border-subtle)' }}>
                      <span style={{ color: 'var(--idea-color-text-muted)', display: 'block', marginBottom: '2px', fontSize: '11px' }}>
                        Mã định danh bản thảo (Candidate ID):
                      </span>
                      <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{candidate.candidateId}</code>
                    </div>

                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)' }}>Phạm vi áp dụng: </span>
                      <span style={{ fontWeight: 500 }}>
                        {candidate.managementScope.kind === 'ORGANIZATION' ? 'Toàn tổ chức' : 'Trong dự án'}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Các quyền được chọn ({candidate.permissionCodes.length}):
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {candidate.permissionCodes.map((p) => {
                          const meta = PERMISSION_METADATA[p];
                          return (
                            <div
                              key={p}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: 'var(--idea-color-surface-subtle)',
                                borderRadius: '4px',
                                border: '1px solid var(--idea-color-border-subtle)',
                              }}
                            >
                              <div style={{ fontWeight: 500, fontSize: '12px' }}>{meta?.title || p}</div>
                              <div style={{ fontFamily: 'var(--idea-font-family-mono)', fontSize: '10px', color: 'var(--idea-color-text-muted)' }}>
                                {p}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--idea-color-text-muted)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>
                        Mã băm kiểm tra tính toàn vẹn (SHA-256 Digest):
                      </span>
                      <code style={{ fontSize: '10px', wordBreak: 'break-all', display: 'block', padding: '4px 6px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '3px' }}>
                        {candidate.contentDigest}
                      </code>
                    </div>
                  </div>

                  {/* Candidate Actions */}
                  {!validation ? (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '8px' }}>
                        Bước tiếp theo: Gửi bản thảo để máy chủ đối soát tương thích chính sách quyền hạn.
                      </div>
                      <Button
                        variant="primary"
                        style={{ width: '100%' }}
                        onClick={() => void handleValidateCandidate()}
                        disabled={isLocked}
                      >
                        {isBusy ? <Spinner size="sm" /> : <><CheckCircleIcon /> Kiểm tra tính hợp lệ (Validate)</>}
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
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircleIcon /> Kết quả xác thực từ máy chủ:
                      </h4>
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
                          Lý do phê duyệt kích hoạt <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
                        </label>
                        <Input
                          placeholder="Ví dụ: Phê duyệt cho đợt phân quyền Quý 4..."
                          value={activationReason}
                          disabled={isLocked}
                          onChange={(e) => setActivationReason(e.target.value)}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            color: 'var(--idea-color-text)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={activationConfirmed}
                            disabled={isLocked}
                            style={{ marginTop: '2px' }}
                            onChange={(e) => setActivationConfirmed(e.target.checked)}
                          />
                          <span>
                            Tôi xác nhận kích hoạt phiên bản chính thức (Immutable). Các phân quyền đang áp dụng trước đó cho người dùng sẽ được bảo lưu an toàn.
                          </span>
                        </label>
                      </div>

                      <Button
                        variant="primary"
                        style={{ width: '100%' }}
                        disabled={!activationConfirmed || !activationReason.trim() || isLocked || !canActivate}
                        onClick={() => void handleActivateRole()}
                      >
                        {isBusy ? <Spinner size="sm" /> : 'Kích hoạt phiên bản chính thức'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : selectedRole ? (
                /* Selected Role Details */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Badge
                      variant={
                        selectedRole.classification === 'HIGHEST'
                          ? 'highest'
                          : selectedRole.classification === 'ADMINISTRATION'
                          ? 'admin'
                          : 'business'
                      }
                    >
                      {selectedRole.classification === 'HIGHEST'
                        ? 'Tối cao (HIGHEST)'
                        : selectedRole.classification === 'ADMINISTRATION'
                        ? 'Quản trị (ADMIN)'
                        : 'Nghiệp vụ (BUSINESS)'}
                    </Badge>
                    {selectedRole.builtIn && (
                      <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
                        · Mặc định hệ thống
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 600 }}>{selectedRole.displayName}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)', marginBottom: '14px' }}>
                    Mã hệ thống: <code>{selectedRole.roleCode}@v{selectedRole.version}</code>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                    <div style={{ padding: '8px 10px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '4px', border: '1px solid var(--idea-color-border-subtle)' }}>
                      <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--idea-color-text-muted)', marginBottom: '2px' }}>
                        Mã định danh Version ID:
                      </div>
                      <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{selectedRole.roleVersionId}</code>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>Phạm vi có thể cấp quyền:</div>
                      <div style={{ color: 'var(--idea-color-text-muted)' }}>
                        {selectedRole.scopeKinds.map((s) => (s === 'ORGANIZATION' ? 'Toàn tổ chức' : 'Trong từng dự án')).join(', ')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>Đối tượng được áp dụng:</div>
                      <div style={{ color: 'var(--idea-color-text-muted)' }}>
                        {selectedRole.principalKinds.map((p) => (p === 'ACTOR' ? 'Cá nhân cán bộ / người dùng' : 'Nhóm làm việc dự án')).join(', ')}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                        Danh sách quyền được cấp ({selectedRole.permissions.length}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedRole.permissions.map((p) => {
                          const meta = PERMISSION_METADATA[p.code];
                          return (
                            <div
                              key={p.code}
                              style={{
                                padding: '6px 8px',
                                backgroundColor: 'var(--idea-color-surface-subtle)',
                                borderRadius: '4px',
                                border: '1px solid var(--idea-color-border)',
                              }}
                            >
                              <div style={{ fontWeight: 600, fontSize: '12px' }}>{meta?.title || p.code}</div>
                              {meta?.description && (
                                <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px' }}>
                                  {meta.description}
                                </div>
                              )}
                              <div style={{ fontFamily: 'var(--idea-font-family-mono)', fontSize: '10px', color: 'var(--idea-color-text-subtle)', marginTop: '3px' }}>
                                Mã: {p.code} · Chủ quản: {p.owner}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Chưa chọn vai trò"
                  description="Nhấp vào một dòng trong bảng danh sách bên trái để xem chi tiết quyền hạn hoặc các thông tin liên quan."
                />
              )}
            </div>
          }
        >
          {/* Master View: DataTable */}
          <div style={{ padding: '16px', height: '100%', boxSizing: 'border-box' }}>
            {isLoading && roles.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: '12px' }}>
                <Spinner size="lg" />
                <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
                  Đang tải danh mục vai trò từ máy chủ...
                </span>
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
                filterPlaceholder="Lọc vai trò theo mã, tên hoặc phân loại..."
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
        title="Tạo vai trò tùy biến mới"
        subtitle="Thiết lập quyền hạn chuyên biệt cho vị trí công việc trong tổ chức hoặc dự án"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDrawer} disabled={isBusy}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={() => void handlePrepareCandidate()}
              disabled={!canSubmitProposal || isLocked}
            >
              {isBusy ? <Spinner size="sm" /> : 'Lưu bản thảo (Prepare Candidate)'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Thông tin chung */}
          <div style={{ padding: '12px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '6px', border: '1px solid var(--idea-color-border-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
              1. Thông tin định danh vai trò
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>
                Kế thừa từ vai trò có sẵn (Tùy chọn)
              </label>
              <select
                aria-label="Kế thừa từ vai trò có sẵn"
                value={formBaseVersion}
                onChange={(e) => handleSelectBaseRole(e.target.value)}
                disabled={isLocked}
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
                <option value="">Tạo vai trò hoàn toàn mới (Không kế thừa)</option>
                {roles
                  .filter((r) => !r.builtIn)
                  .map((r) => (
                    <option key={r.roleVersionId} value={r.roleVersionId} disabled={!r.selectable}>
                      {r.roleCode}@v{r.version} — {r.displayName}
                    </option>
                  ))}
              </select>
              <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px', display: 'block' }}>
                Chọn một vai trò tùy biến để tự động sao chép các quyền hạn đã thiết lập trước đó.
              </span>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>
                Tên hiển thị vai trò <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
              </label>
              <Input
                placeholder="Ví dụ: Kỹ sư đánh giá thiết kế CAD"
                value={formDisplayName}
                disabled={Boolean(formBaseVersion) || isLocked}
                onChange={(e) => {
                  setFormDisplayName(e.target.value);
                  setIsFormDirty(true);
                }}
              />
            </div>

            {/* Role Code Assignment Information (P1.1 Align with Server Contract) */}
            {formBaseVersion && selectedBaseRole ? (
              <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: 'var(--idea-color-surface)', borderRadius: '4px', border: '1px solid var(--idea-color-border-subtle)', fontSize: '11px' }}>
                <span style={{ color: 'var(--idea-color-text-muted)' }}>Mã vai trò kế thừa từ phiên bản trước: </span>
                <code style={{ fontWeight: 600 }}>{selectedBaseRole.roleCode}</code> (phiên bản tiếp theo dự kiến: <code>v{selectedBaseRole.version + 1}</code>)
              </div>
            ) : (
              <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--idea-color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <InfoCircleIcon />
                <span>Mã vai trò (Role Code) được Server tự động sinh từ tên hiển thị theo đúng hợp đồng RoleProposal.</span>
              </div>
            )}
          </div>

          {/* Section 2: Quyền hạn (P1.2 Fail-closed Permission Availability) */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              2. Danh mục quyền hạn được phép cấp <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginBottom: '8px' }}>
              Giới hạn trần quyền hạn tùy biến (Custom Role Ceiling). Chỉ cấp các quyền thực sự cần thiết.
            </div>

            {permissions === null ? (
              <Alert variant="warning">
                {permissionsIncomplete
                  ? 'Danh mục quyền hạn trên máy chủ chưa hoàn tất qua phân trang (hasMore=true); chức năng gán quyền bị khóa fail-closed.'
                  : 'Đang tải danh mục quyền hạn từ máy chủ...'}
              </Alert>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {customRoleCeiling.map((permCode) => {
                  const checked = formSelectedPermissions.includes(permCode);
                  const permObj = permissions.find((p) => p.code === permCode);
                  const isImplemented = Boolean(permObj && permObj.implementationState === 'IMPLEMENTED');
                  const meta = PERMISSION_METADATA[permCode];

                  return (
                    <label
                      key={permCode}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '12px',
                        cursor: isImplemented && !isLocked ? 'pointer' : 'not-allowed',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        backgroundColor: checked ? 'var(--idea-color-primary-subtle)' : 'var(--idea-color-surface)',
                        border: '1px solid',
                        borderColor: checked ? 'var(--idea-color-primary)' : 'var(--idea-color-border-subtle)',
                        opacity: isImplemented ? 1 : 0.6,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!isImplemented || isLocked}
                        style={{ marginTop: '2px' }}
                        onChange={() => {
                          setIsFormDirty(true);
                          setFormSelectedPermissions((prev) =>
                            prev.includes(permCode)
                              ? prev.filter((p) => p !== permCode)
                              : [...prev, permCode]
                          );
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600 }}>{meta?.title || permCode}</span>
                          <span style={{ fontFamily: 'var(--idea-font-family-mono)', fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>
                            ({permCode})
                          </span>
                          {!isImplemented && (
                            <Badge variant="neutral">
                              {permObj ? permObj.implementationState : 'CHƯA KHẢ DỤNG'}
                            </Badge>
                          )}
                        </div>
                        {meta?.description && (
                          <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px' }}>
                            {meta.description}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Phạm vi & Chủ thể */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                3. Phạm vi áp dụng <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {[
                  { id: 'ORGANIZATION', label: 'Toàn tổ chức' },
                  { id: 'PROJECT', label: 'Trong dự án' },
                ].map((sc) => (
                  <label key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formScopeKinds.includes(sc.id)}
                      disabled={isLocked || (scope.kind === 'PROJECT' && sc.id === 'ORGANIZATION')}
                      onChange={() => {
                        setIsFormDirty(true);
                        setFormScopeKinds((prev) =>
                          prev.includes(sc.id) ? prev.filter((s) => s !== sc.id) : [...prev, sc.id]
                        );
                      }}
                    />
                    <span>{sc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                4. Chủ thể áp dụng <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {[
                  { id: 'ACTOR', label: 'Cá nhân (Người dùng)' },
                  { id: 'PROJECT_GROUP', label: 'Nhóm làm việc dự án' },
                ].map((pr) => (
                  <label key={pr.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formPrincipalKinds.includes(pr.id)}
                      disabled={isLocked}
                      onChange={() => {
                        setIsFormDirty(true);
                        setFormPrincipalKinds((prev) =>
                          prev.includes(pr.id) ? prev.filter((p) => p !== pr.id) : [...prev, pr.id]
                        );
                      }}
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '4px', display: 'block' }}>
                Lưu ý: Chỉ quyền <code>project.read</code> mới được hỗ trợ gán cho Nhóm dự án. Các quyền quản trị chỉ gán cho Cá nhân.
              </span>
            </div>
          </div>

          {/* Section 4: Lý do */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              5. Lý do tạo vai trò (Kiểm toán hệ thống) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <Input
              placeholder="Ví dụ: Phục vụ đợt tuyển dụng nhân sự dự án DDM..."
              value={formReason}
              disabled={isLocked}
              onChange={(e) => {
                setFormReason(e.target.value);
                setIsFormDirty(true);
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px', display: 'block' }}>
              Lý do này sẽ được ghi nhận vào nhật ký kiểm toán quản trị để truy vết khi cần.
            </span>
          </div>
        </div>
      </Drawer>

      {/* Discard Confirmation Dialog */}
      <Dialog
        isOpen={isDiscardDialogOpen}
        onClose={() => setIsDiscardDialogOpen(false)}
        title="Hủy bỏ thay đổi chưa lưu?"
        description="Bạn có các thông tin vừa nhập chưa được gửi lên máy chủ"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDiscardDialogOpen(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="danger" onClick={handleConfirmDiscard}>
              Xác nhận hủy
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
          Các thông tin vai trò bạn vừa điền chưa được lưu thành bản thảo trên máy chủ.
          Nếu rời đi bây giờ, các nội dung này sẽ bị mất. Bạn có chắc chắn muốn hủy không?
        </p>
      </Dialog>
    </div>
  );
};
