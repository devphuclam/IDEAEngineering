import React, { useState } from 'react';
import './layout.css';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export interface AppShellProps {
  mode?: 'hub' | 'workbench';
  brandTitle?: string;
  brandSubtitle?: string;
  navItems?: NavItem[];
  headerActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  mode = 'workbench',
  brandTitle = 'IDEA Engineering',
  brandSubtitle = 'v0.1',
  navItems = [],
  headerActions,
  sidebarFooter,
  children,
  className = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`idea-shell idea-shell--${mode} ${className}`} id="appRoot">
      <header className="idea-shell-header">
        <div className="idea-shell-header__brand">
          <button
            type="button"
            className="idea-btn idea-btn--ghost idea-btn--sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            style={{ padding: '0 4px', marginRight: '4px' }}
          >
            ☰
          </button>
          <div className="idea-shell-header__logo">IE</div>
          <span>{brandTitle}</span>
          {brandSubtitle && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--idea-color-text-muted)',
                fontWeight: 'normal',
                backgroundColor: 'var(--idea-color-surface-subtle)',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid var(--idea-color-border)',
              }}
            >
              {brandSubtitle}
            </span>
          )}
        </div>
        <div className="idea-shell-header__actions">
          {headerActions}
        </div>
      </header>

      <div className="idea-shell-body">
        <aside
          className={`idea-shell-sidebar ${sidebarCollapsed ? 'idea-shell-sidebar--collapsed' : ''}`}
          aria-label="Điều hướng chính"
        >
          <nav className="idea-shell-sidebar__nav">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href || '#'}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className={`idea-shell-nav-item ${item.active ? 'idea-shell-nav-item--active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.icon && <span className="idea-shell-nav-item__icon">{item.icon}</span>}
                {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!sidebarCollapsed && item.badge}
              </a>
            ))}
          </nav>
          {sidebarFooter && !sidebarCollapsed && (
            <div style={{ padding: '8px', borderTop: '1px solid var(--idea-color-border-subtle)' }}>
              {sidebarFooter}
            </div>
          )}
        </aside>

        <main className="idea-shell-main" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};
