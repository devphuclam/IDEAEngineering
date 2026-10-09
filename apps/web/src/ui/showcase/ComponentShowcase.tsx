import React, { useState } from 'react';
import './showcase.css';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Badge } from '../primitives/Badge';
import { Tooltip } from '../primitives/Tooltip';
import { Alert, Spinner, RecoverySurface, EmptyState } from '../primitives/Feedback';
import { Dialog } from '../primitives/Dialog';
import { Drawer } from '../primitives/Drawer';
import { DataTable, Column } from '../table/DataTable';
import { InspectorLayout } from '../layout/InspectorLayout';
import { applyThemeConfig, ThemeConfig } from '../tokens/tokens';

interface DemoUser {
  id: string;
  name: string;
  role: string;
  tier: 'highest' | 'admin' | 'business' | 'neutral';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  email: string;
}

const DEMO_USERS: DemoUser[] = [
  { id: 'usr-001', name: 'Nguyễn Văn An', role: 'Security Admin', tier: 'highest', status: 'ACTIVE', email: 'an.nguyen@idea.internal' },
  { id: 'usr-002', name: 'Trần Thị Bình', role: 'Vault Officer', tier: 'admin', status: 'ACTIVE', email: 'binh.tran@idea.internal' },
  { id: 'usr-003', name: 'Lê Hoàng Cường', role: 'CAD Designer', tier: 'business', status: 'ACTIVE', email: 'cuong.le@idea.internal' },
  { id: 'usr-004', name: 'Phạm Minh Đức', role: 'Reviewer', tier: 'neutral', status: 'PENDING', email: 'duc.pham@idea.internal' },
  { id: 'usr-005', name: 'Đặng Thu Hà', role: 'Release Manager', tier: 'business', status: 'ACTIVE', email: 'ha.dang@idea.internal' },
];

export const ComponentShowcase: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(DEMO_USERS[0]);
  const [inputValue, setInputValue] = useState('');

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    applyThemeConfig({ theme: newTheme });
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'compact') => {
    setDensity(newDensity);
    applyThemeConfig({ density: newDensity });
  };

  const columns: Column<DemoUser>[] = [
    { key: 'id', header: 'Mã người dùng', sortable: true, width: '120px' },
    { key: 'name', header: 'Họ và tên', sortable: true },
    {
      key: 'role',
      header: 'Vai trò',
      sortable: true,
      render: (u) => (
        <Badge variant={u.tier}>{u.role}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : u.status === 'PENDING' ? 'warning' : 'neutral'}>
          {u.status}
        </Badge>
      ),
    },
    { key: 'email', header: 'Email liên hệ', sortable: true },
  ];

  return (
    <div className="idea-showcase">
      <div className="idea-showcase__header">
        <div>
          <h1 className="idea-showcase__title">IDEA Engineering UI Kit — Increment 1 Showcase</h1>
          <div className="idea-showcase__subtitle">
            Nordic Functionalist + Technical Precision Design System & Primitives
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>Chủ đề:</span>
            <Button
              variant={theme === 'light' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleThemeChange('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </Button>
          </div>

          {/* Density switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>Mật độ:</span>
            <Button
              variant={density === 'comfortable' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleDensityChange('comfortable')}
            >
              Comfortable (40px)
            </Button>
            <Button
              variant={density === 'compact' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleDensityChange('compact')}
            >
              Compact (32px)
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Design Tokens */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">1. Design Tokens & Color Swatches</h2>
        <div className="idea-showcase__swatch-grid">
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-bg)' }} />
            <div className="idea-showcase__swatch-label">Background</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-surface)' }} />
            <div className="idea-showcase__swatch-label">Surface</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-border)' }} />
            <div className="idea-showcase__swatch-label">Border</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-primary)' }} />
            <div className="idea-showcase__swatch-label">Primary (#0284C7)</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-success)' }} />
            <div className="idea-showcase__swatch-label">Success (#16A34A)</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-warning)' }} />
            <div className="idea-showcase__swatch-label">Warning (#D97706)</div>
          </div>
          <div className="idea-showcase__swatch">
            <div className="idea-showcase__swatch-color" style={{ backgroundColor: 'var(--idea-color-danger)' }} />
            <div className="idea-showcase__swatch-label">Danger (#DC2626)</div>
          </div>
        </div>
      </section>

      {/* 2. Buttons */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">2. Buttons (Variants & Sizes)</h2>
        <div className="idea-showcase__row">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline Action</Button>
          <Button variant="ghost">Ghost Action</Button>
          <Button variant="danger">Danger Action</Button>
          <Button variant="primary" disabled>Disabled State</Button>
        </div>
        <div className="idea-showcase__row">
          <Button variant="primary" size="sm">Primary Small</Button>
          <Button variant="secondary" size="sm">Secondary Small</Button>
          <Button variant="outline" size="sm">Outline Small</Button>
          <Button variant="danger" size="sm">Danger Small</Button>
        </div>
      </section>

      {/* 3. Inputs */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">3. Inputs & Search Fields</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '640px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
              Standard Text Input
            </label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập mã hoặc tên..."
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
              Search Input with Icon
            </label>
            <Input
              icon="🔍"
              placeholder="Tìm kiếm tài nguyên..."
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
              Input with Error
            </label>
            <Input
              value="invalid code!"
              errorMessage="Mã role chỉ được chứa ký tự ascii thường và gạch nối (-)"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 500 }}>
              Disabled Input
            </label>
            <Input
              disabled
              value="Giá trị chỉ đọc không thể sửa"
            />
          </div>
        </div>
      </section>

      {/* 4. Badges & Tooltips */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">4. Badges & Tooltips</h2>
        <div className="idea-showcase__row">
          <Badge variant="highest">Highest Privilege</Badge>
          <Badge variant="admin">Security Admin</Badge>
          <Badge variant="business">Vault Contributor</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Draft Candidate</Badge>
          <Badge variant="danger">Revoked</Badge>
          <Badge variant="neutral">Read Only</Badge>
        </div>
        <div className="idea-showcase__row">
          <Tooltip content="Tooltip hỗ trợ bàn phím (Tab/Focus) và chuột (Hover)">
            <Button variant="secondary" size="sm">Rê chuột hoặc Focus vào tôi</Button>
          </Tooltip>
          <Tooltip content="Quyền quản trị viên cao nhất được bảo vệ">
            <Badge variant="highest">Hover để xem giải thích quyền</Badge>
          </Tooltip>
        </div>
      </section>

      {/* 5. Feedback, Alerts & Spinners */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">5. Feedback, Alerts & Spinners</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <Alert variant="success" title="Cập nhật thành công">
            Candidate đã được Validate hợp lệ và sẵn sàng kích hoạt vào hệ thống.
          </Alert>
          <Alert variant="warning" title="Cảnh báo thay đổi">
            Phiên làm việc sẽ hết hạn sau 10 phút nếu không có thao tác.
          </Alert>
          <Alert variant="danger" title="Lỗi nghiêm trọng">
            Không thể kích hoạt vai trò vì thiếu phân bổ quyền hợp lệ.
          </Alert>
          <Alert variant="neutral">
            Thông tin hệ thống: Phiên bản UI Kit Increment 1 đang hoạt động.
          </Alert>
        </div>
        <div className="idea-showcase__row">
          <span style={{ fontSize: '12px' }}>Spinners:</span>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
        <div style={{ marginTop: '16px' }}>
          <RecoverySurface
            title="Lỗi kết nối phiên làm việc"
            description="Không thể đồng bộ dữ liệu vai trò với máy chủ IAM authoritative. Vui lòng kiểm tra kết nối mạng."
            error="NET_TIMEOUT: 504 Gateway Timeout on /api/v1/roles"
            onRetry={() => alert('Thử lại kết nối')}
          />
        </div>
      </section>

      {/* 6. Overlays: Dialog & Drawer */}
      <section className="idea-showcase__section">
        <h2 className="idea-showcase__section-title">6. Accessible Overlays (Dialog & Drawer)</h2>
        <p style={{ fontSize: '13px', color: 'var(--idea-color-text-muted)', marginBottom: '12px' }}>
          Tất cả overlay đều áp dụng Focus Trapping (Tab / Shift+Tab), phím Escape đóng, hoàn trả Focus ban đầu,
          và thiết lập <code>inert</code> trên phần nền để cô lập hoàn toàn phím tắt toàn cục.
        </p>
        <div className="idea-showcase__row">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Mở Dialog Xác nhận
          </Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Mở Drawer Tạo vai trò
          </Button>
        </div>

        {/* Modal Dialog */}
        <Dialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Xác nhận hủy thay đổi chưa lưu"
          description="Cảnh báo khi rời khỏi form chưa hoàn thành"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Giữ lại
              </Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>
                Hủy thay đổi
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Bạn đang có các thay đổi chưa được Validate hoặc Kích hoạt. Nếu đóng lại, các thay đổi này sẽ bị hủy bỏ.
            Bạn có chắc chắn muốn tiếp tục không?
          </p>
        </Dialog>

        {/* Slide-over Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Tạo vai trò tùy chỉnh mới"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                Đóng
              </Button>
              <Button variant="primary" onClick={() => setDrawerOpen(false)}>
                Chuẩn bị Candidate
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Mã vai trò (Role Code):</label>
              <Input placeholder="vi-du: vault-reviewer" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Tên hiển thị:</label>
              <Input placeholder="Người đánh giá hồ sơ icVault" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Phạm vi áp dụng:</label>
              <select className="idea-input" style={{ width: '100%' }}>
                <option value="ORGANIZATION">Tổ chức (ORGANIZATION)</option>
                <option value="PROJECT">Dự án (PROJECT)</option>
                <option value="WORKSPACE">Không gian làm việc (WORKSPACE)</option>
              </select>
            </div>
          </div>
        </Drawer>
      </section>

      {/* 7. Semantic DataTable & Inspector */}
      <section className="idea-showcase__section" style={{ height: '480px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 className="idea-showcase__section-title" style={{ margin: 0, border: 'none' }}>
            7. Semantic DataTable & InspectorLayout (Master-Detail)
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInspectorOpen(!inspectorOpen)}
          >
            {inspectorOpen ? 'Ẩn Inspector (Alt+I)' : 'Hiện Inspector (Alt+I)'}
          </Button>
        </div>

        <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--idea-color-border)', borderRadius: '6px', overflow: 'hidden' }}>
          <InspectorLayout
            isOpen={inspectorOpen}
            onToggle={setInspectorOpen}
            title="Chi tiết đối tượng"
            width={340}
            inspectorContent={
              selectedUser ? (
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{selectedUser.name}</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--idea-color-text-muted)' }}>
                    Mã: <code>{selectedUser.id}</code>
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>Vai trò: </span>
                      <Badge variant={selectedUser.tier}>{selectedUser.role}</Badge>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>Trạng thái: </span>
                      <Badge variant={selectedUser.status === 'ACTIVE' ? 'success' : 'warning'}>{selectedUser.status}</Badge>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--idea-color-text-muted)' }}>Email: </span>
                      <div style={{ fontSize: '12px' }}>{selectedUser.email}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState title="Chưa chọn đối tượng" description="Nhấp vào một dòng trong bảng để xem chi tiết." />
              )
            }
          >
            <DataTable
              data={DEMO_USERS}
              columns={columns}
              getRowId={(u) => u.id}
              selectedId={selectedUser?.id}
              onSelectRow={(u) => setSelectedUser(u)}
              ariaLabel="Bảng danh sách người dùng mẫu"
            />
          </InspectorLayout>
        </div>
      </section>
    </div>
  );
};
