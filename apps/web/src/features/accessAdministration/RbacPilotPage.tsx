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

/** Human-friendly explanations for technical permission codes */
export const PERMISSION_METADATA: Record<string, { title: string; description: string }> = {
  'project.read': {
    title: 'Xem dữ liệu & tài liệu dự án',
    description: 'Cho phép truy cập, duyệt danh sách và đọc thông tin kỹ thuật trong các dự án được phân quyền.',
  },
  'role.catalogue.read': {
    title: 'Tra cứu danh mục vai trò',
    description: 'Cho phép xem danh sách các vai trò hệ thống, chính sách phân quyền và quyền hạn của tổ chức.',
  },
  'access.inspect': {
    title: 'Đối soát quyền truy cập thực tế',
    description: 'Cho phép kiểm tra đường dẫn phân quyền thực tế của cán bộ hoặc nhóm làm việc mà không thay đổi quyền.',
  },
  'audit.read': {
    title: 'Xem nhật ký kiểm toán hệ thống',
    description: 'Theo dõi lịch sử các thao tác quản trị, kích hoạt vai trò và phân bổ quyền hạn để bảo đảm tính minh bạch.',
  },
};

/** SVGs for refined visual craft (Anti-slop / No raw emojis) */
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/** Step indicator for Candidate Lifecycle Flow */
const LifecycleStepper: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => (
  <div style={{ padding: '12px 14px', backgroundColor: 'var(--idea-color-surface-subtle)', borderRadius: '6px', border: '1px solid var(--idea-color-border-subtle)', marginBottom: '14px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--idea-color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      Quy trình kích hoạt vai trò an toàn
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            backgroundColor: step >= 1 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 1 ? '#FFFFFF' : 'var(--idea-color-text-muted)',
            border: '1px solid var(--idea-color-border)',
          }}
        >
          1
        </span>
        <span style={{ fontSize: '11px', fontWeight: step === 1 ? 600 : 400, color: step >= 1 ? 'var(--idea-color-text)' : 'var(--idea-color-text-muted)' }}>
          Soạn bản thảo
        </span>
      </div>
      <div style={{ flex: 1, height: '1px', backgroundColor: step >= 2 ? 'var(--idea-color-primary)' : 'var(--idea-color-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            backgroundColor: step >= 2 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 2 ? '#FFFFFF' : 'var(--idea-color-text-muted)',
            border: '1px solid var(--idea-color-border)',
          }}
        >
          2
        </span>
        <span style={{ fontSize: '11px', fontWeight: step === 2 ? 600 : 400, color: step >= 2 ? 'var(--idea-color-text)' : 'var(--idea-color-text-muted)' }}>
          Kiểm tra hợp lệ
        </span>
      </div>
      <div style={{ flex: 1, height: '1px', backgroundColor: step >= 3 ? 'var(--idea-color-primary)' : 'var(--idea-color-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            backgroundColor: step >= 3 ? 'var(--idea-color-primary)' : 'var(--idea-color-surface)',
            color: step >= 3 ? '#FFFFFF' : 'var(--idea-color-text-muted)',
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
        setErrorMessage('Phiên làm việc đã hết hạn hoặc không hợp lệ (401 Unauthorized). Vui lòng đăng nhập lại.');
        onInvalidated?.();
        return;
      }
      if (res.kind === 'unresolved') {
        setErrorMessage('Máy chủ chưa phản hồi kết quả dứt khoát. Yêu cầu đã được lưu lại để kiểm tra đối soát, không gửi lại trùng lặp.');
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
          setPermissions(permsRes.value.items);
        } else {
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
      return 'Mã vai trò chỉ chấp nhận chữ thường không dấu (a-z), chữ số (0-9) và dấu gạch nối (-), ví dụ: ky-su-duyet-cad.';
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
    setStatusMessage('Máy chủ đang kiểm tra quyền và lưu bản thảo vai trò (Candidate)...');

    try {
      const target = roleProposalTarget(formBaseVersion, roles, formDisplayName);
      if (!target) {
        setErrorMessage('Vai trò gốc đã chọn không còn trong danh mục hiện tại. Vui lòng chọn lại.');
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
          `Máy chủ đã lưu bản thảo vai trò [${res.value.roleCode}] thành công. Bản thảo này chưa có hiệu lực cho tới khi bạn hoàn tất bước Kích hoạt.`
        );
        setInspectorOpen(true);
      } else {
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

  const handleValidateCandidate = async () => {
    if (!candidate || isBusy) return;
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

  const handleActivateRole = async () => {
    if (!candidate || !validation || !canActivate || !activationConfirmed || !activationReason.trim() || isBusy) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);
    setStatusMessage('Máy chủ đang lưu và kích hoạt phiên bản vai trò chính thức...');

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
          `Kích hoạt thành công! Phiên bản chính thức [${activated.roleCode}@${activated.version}] đã có hiệu lực trên hệ thống. Các tài khoản đang dùng vai trò cũ vẫn được bảo lưu an toàn.`
        );
        await loadCatalogue(scope);
        setSelectedRole(activated);
      } else {
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
                  border: '1px solid var(--idea-color-primary-subtle)',
                  fontWeight: 500,
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
      header: 'Tên hiển thị',
      sortable: true,
      render: (r) => (
        <div style={{ fontWeight: 500, color: 'var(--idea-color-text)' }}>
          {r.displayName}
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
            disabled={isLoading || isBusy}
            onClick={() => void loadCatalogue(scope)}
            title="Tải lại danh sách vai trò từ máy chủ"
          >
            {isLoading ? <Spinner size="sm" /> : <><RefreshIcon /> Tải lại</>}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenDrawer}
            disabled={!canPrepare || isBusy || isLoading}
            title={canPrepare ? 'Soạn thảo bản thảo vai trò tùy biến mới' : 'Tài khoản thiếu quyền role.definition.prepare'}
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
                    Mã dự kiến: <code style={{ color: 'var(--idea-color-primary)', fontWeight: 600 }}>{candidate.roleCode}@v{candidate.proposedRoleVersion}</code>
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
                        disabled={isBusy}
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
                        disabled={!activationConfirmed || !activationReason.trim() || isBusy || !canActivate}
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
              disabled={!canSubmitProposal || isBusy}
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

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>
                Tên hiển thị vai trò <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
              </label>
              <Input
                placeholder="Ví dụ: Kỹ sư đánh giá thiết kế CAD"
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>
                  Mã hệ thống (Role Code) <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
                </label>
                <Input
                  placeholder="vi-du: ky-su-duyet-cad"
                  value={formRoleCode}
                  disabled={isBusy}
                  onChange={(e) => {
                    setFormRoleCode(e.target.value);
                    setIsFormDirty(true);
                  }}
                  errorMessage={roleCodeError || undefined}
                />
                <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px', display: 'block' }}>
                  Quy chuẩn: Chỉ dùng chữ cái thường không dấu a-z, chữ số 0-9 và dấu gạch nối (-).
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Quyền hạn */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              2. Danh mục quyền hạn được phép cấp <span style={{ color: 'var(--idea-color-danger)' }}>*</span>
            </label>
            <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginBottom: '8px' }}>
              Giới hạn trần quyền hạn tùy biến (Custom Role Ceiling). Chỉ cấp các quyền thực sự cần thiết.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {customRoleCeiling.map((permCode) => {
                const checked = formSelectedPermissions.includes(permCode);
                const permObj = permissions.find((p) => p.code === permCode);
                const isImplemented = permObj ? permObj.implementationState === 'IMPLEMENTED' : true;
                const meta = PERMISSION_METADATA[permCode];

                return (
                  <label
                    key={permCode}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      cursor: isImplemented ? 'pointer' : 'not-allowed',
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
                      disabled={!isImplemented || isBusy}
                      style={{ marginTop: '2px' }}
                      onChange={() => {
                        setIsFormDirty(true);
                        setFormSelectedPermissions((prev) =>
                          prev.includes(permCode) ? prev.filter((p) => p !== permCode) : [...prev, permCode]
                        );
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--idea-color-text)' }}>
                        {meta?.title || permCode}
                      </div>
                      {meta?.description && (
                        <div style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)', marginTop: '2px' }}>
                          {meta.description}
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--idea-font-family-mono)', fontSize: '10px', color: 'var(--idea-color-text-subtle)', marginTop: '2px' }}>
                        <code>{permCode}</code>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Phạm vi và Chủ thể */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                3. Phạm vi có thể áp dụng (Scopes)
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { id: 'ORGANIZATION', label: 'Toàn tổ chức' },
                  { id: 'PROJECT', label: 'Trong từng dự án' },
                ].map((sc) => (
                  <label key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formScopeKinds.includes(sc.id)}
                      disabled={scope.kind === 'PROJECT' && sc.id === 'ORGANIZATION'}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                4. Đối tượng được phép gán (Principals)
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { id: 'ACTOR', label: 'Cá nhân cán bộ' },
                  { id: 'PROJECT_GROUP', label: 'Nhóm làm việc dự án' },
                ].map((pr) => (
                  <label key={pr.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formPrincipalKinds.includes(pr.id)}
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
              disabled={isBusy}
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

      {/* Dirty Discard Dialog */}
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
              Hủy bỏ thay đổi
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
