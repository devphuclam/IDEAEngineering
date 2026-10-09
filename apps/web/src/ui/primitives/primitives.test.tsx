import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { Dialog } from './Dialog';
import { Drawer } from './Drawer';
import { Tooltip } from './Tooltip';
import { Alert, Spinner, RecoverySurface, EmptyState } from './Feedback';

describe('UI Kit Primitives', () => {
  describe('Button', () => {
    it('renders with default secondary variant', () => {
      const html = renderToStaticMarkup(<Button>Click me</Button>);
      expect(html).toContain('idea-btn');
      expect(html).toContain('idea-btn--secondary');
      expect(html).toContain('Click me');
    });

    it('renders primary variant and small size', () => {
      const html = renderToStaticMarkup(<Button variant="primary" size="sm">Submit</Button>);
      expect(html).toContain('idea-btn--primary');
      expect(html).toContain('idea-btn--sm');
    });

    it('renders danger variant with disabled attribute', () => {
      const html = renderToStaticMarkup(<Button variant="danger" disabled>Delete</Button>);
      expect(html).toContain('idea-btn--danger');
      expect(html).toContain('disabled=""');
    });
  });

  describe('Input', () => {
    it('renders standard text input', () => {
      const html = renderToStaticMarkup(<Input placeholder="Search..." value="test" onChange={() => {}} />);
      expect(html).toContain('idea-input');
      expect(html).toContain('placeholder="Search..."');
      expect(html).toContain('value="test"');
    });

    it('renders search input with icon', () => {
      const html = renderToStaticMarkup(<Input icon="🔍" placeholder="Find..." />);
      expect(html).toContain('idea-input--has-icon');
      expect(html).toContain('idea-input-icon');
      expect(html).toContain('🔍');
    });

    it('renders error message and aria-invalid', () => {
      const html = renderToStaticMarkup(<Input errorMessage="Mã không hợp lệ" />);
      expect(html).toContain('aria-invalid="true"');
      expect(html).toContain('idea-input-error');
      expect(html).toContain('Mã không hợp lệ');
    });
  });

  describe('Badge', () => {
    it('renders semantic variants', () => {
      const highest = renderToStaticMarkup(<Badge variant="highest">HIGHEST</Badge>);
      expect(highest).toContain('idea-badge--highest');

      const admin = renderToStaticMarkup(<Badge variant="admin">ADMIN</Badge>);
      expect(admin).toContain('idea-badge--admin');

      const business = renderToStaticMarkup(<Badge variant="business">BUSINESS</Badge>);
      expect(business).toContain('idea-badge--business');

      const success = renderToStaticMarkup(<Badge variant="success">ACTIVE</Badge>);
      expect(success).toContain('idea-badge--success');

      const danger = renderToStaticMarkup(<Badge variant="danger">REVOKED</Badge>);
      expect(danger).toContain('idea-badge--danger');
    });
  });

  describe('Dialog', () => {
    it('renders null when not open', () => {
      const html = renderToStaticMarkup(
        <Dialog isOpen={false} onClose={() => {}} title="Test Dialog">
          Dialog Content
        </Dialog>
      );
      expect(html).toBe('');
    });

    it('renders modal with role="dialog", title, and accessible attributes', () => {
      const html = renderToStaticMarkup(
        <Dialog isOpen={true} onClose={() => {}} title="Xác nhận" description="Mô tả modal">
          <div>Nội dung modal</div>
        </Dialog>
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('idea-modal-backdrop');
      expect(html).toContain('Xác nhận');
      expect(html).toContain('Nội dung modal');
    });
  });

  describe('Drawer', () => {
    it('renders null when not open', () => {
      const html = renderToStaticMarkup(
        <Drawer isOpen={false} onClose={() => {}} title="Test Drawer">
          Drawer Content
        </Drawer>
      );
      expect(html).toBe('');
    });

    it('renders slide-over with role="dialog" and backdrop', () => {
      const html = renderToStaticMarkup(
        <Drawer isOpen={true} onClose={() => {}} title="Tạo Custom Role">
          <div>Form Drawer</div>
        </Drawer>
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('idea-drawer-backdrop');
      expect(html).toContain('idea-drawer');
      expect(html).toContain('Tạo Custom Role');
    });
  });

  describe('Tooltip', () => {
    it('renders container with child element', () => {
      const html = renderToStaticMarkup(
        <Tooltip content="Tooltip explanation">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(html).toContain('idea-tooltip-container');
      expect(html).toContain('Hover me');
    });
  });

  describe('Feedback Primitives', () => {
    it('renders Alert variants and close button', () => {
      const html = renderToStaticMarkup(
        <Alert variant="danger" title="Lỗi hệ thống" onClose={() => {}}>
          Không thể kết nối máy chủ
        </Alert>
      );
      expect(html).toContain('idea-alert--danger');
      expect(html).toContain('role="alert"');
      expect(html).toContain('Lỗi hệ thống');
      expect(html).toContain('Không thể kết nối máy chủ');
      expect(html).toContain('Close alert');
    });

    it('renders Spinner with accessible status role', () => {
      const html = renderToStaticMarkup(<Spinner size="sm" label="Đang tải..." />);
      expect(html).toContain('role="status"');
      expect(html).toContain('idea-spinner--sm');
      expect(html).toContain('aria-label="Đang tải..."');
    });

    it('renders RecoverySurface with error details and retry button', () => {
      const html = renderToStaticMarkup(
        <RecoverySurface
          title="Lỗi tải dữ liệu"
          description="Vui lòng thử lại sau"
          error="ERR_CONNECTION_REFUSED"
          onRetry={() => {}}
        />
      );
      expect(html).toContain('idea-recovery-surface--error');
      expect(html).toContain('Lỗi tải dữ liệu');
      expect(html).toContain('ERR_CONNECTION_REFUSED');
      expect(html).toContain('Thử lại');
    });

    it('renders EmptyState with icon and title', () => {
      const html = renderToStaticMarkup(
        <EmptyState icon="📁" title="Không có tệp" description="Thư mục trống" />
      );
      expect(html).toContain('idea-empty-state');
      expect(html).toContain('📁');
      expect(html).toContain('Không có tệp');
    });
  });
});
