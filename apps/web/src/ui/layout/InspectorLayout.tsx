import React, { useEffect, useCallback } from 'react';
import './layout.css';

export interface InspectorLayoutProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  title?: string;
  headerActions?: React.ReactNode;
  inspectorContent: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  className?: string;
}

export const InspectorLayout: React.FC<InspectorLayoutProps> = ({
  isOpen,
  onToggle,
  title = 'Inspector',
  headerActions,
  inspectorContent,
  children,
  width = 360,
  className = '',
}) => {
  const isOverlayActive = useCallback((): boolean => {
    // Check if any modal dialog or drawer is currently mounted and active
    const modalBackdrop = document.querySelector('.idea-modal-backdrop, .idea-drawer-backdrop');
    if (modalBackdrop) return true;

    const dialog = document.querySelector('[role="dialog"], [role="alertdialog"]');
    if (dialog) return true;

    const appRoot = document.getElementById('appRoot');
    if (appRoot && (appRoot.hasAttribute('inert') || appRoot.getAttribute('aria-hidden') === 'true')) {
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcut Alt+I (or Option+I on Mac)
      if (e.altKey && (e.key === 'i' || e.key === 'I')) {
        // MANDATORY: If modal/drawer overlay is active, do NOT allow background shortcut
        if (isOverlayActive()) {
          return;
        }
        e.preventDefault();
        onToggle(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onToggle, isOverlayActive]);

  const styleWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className={`idea-inspector-container ${className}`}>
      <div className="idea-inspector-master">
        {children}
      </div>

      <aside
        className={`idea-inspector-panel ${!isOpen ? 'idea-inspector-panel--closed' : ''}`}
        style={isOpen ? { width: styleWidth } : undefined}
        aria-label={title}
        aria-hidden={!isOpen}
      >
        {isOpen && (
          <>
            <div className="idea-inspector-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="idea-inspector-title">{title}</h3>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--idea-color-text-muted)',
                    fontFamily: 'var(--idea-font-family-mono)',
                  }}
                >
                  Alt+I
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {headerActions}
                <button
                  type="button"
                  className="idea-btn idea-btn--ghost idea-btn--sm"
                  onClick={() => onToggle(false)}
                  aria-label="Đóng bảng chi tiết"
                  style={{ padding: '0 6px', fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="idea-inspector-body">
              {inspectorContent}
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
