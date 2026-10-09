import React from 'react';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'neutral';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  role?: 'alert' | 'status';
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'neutral',
  title,
  children,
  onClose,
  className = '',
  role = variant === 'danger' ? 'alert' : 'status',
}) => {
  return (
    <div
      role={role}
      className={`idea-alert idea-alert--${variant} ${className}`}
    >
      <div className="idea-alert-content">
        {title && <div className="idea-alert-title">{title}</div>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="idea-alert-close"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={`idea-spinner idea-spinner--${size} ${className}`}
    >
      <span style={{ display: 'none' }}>{label}</span>
    </span>
  );
};

export interface RecoverySurfaceProps {
  title: string;
  description?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const RecoverySurface: React.FC<RecoverySurfaceProps> = ({
  title,
  description,
  error,
  onRetry,
  retryLabel = 'Thử lại',
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Recovery Surface"
      className={`idea-recovery-surface idea-recovery-surface--error ${className}`}
    >
      <div className="idea-recovery-surface-icon" aria-hidden="true">⚠️</div>
      <div className="idea-recovery-surface-title">{title}</div>
      {description && <div className="idea-recovery-surface-desc">{description}</div>}
      {error && (
        <pre className="idea-recovery-details">
          {typeof error === 'string' ? error : error.message || String(error)}
        </pre>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="idea-btn idea-btn--secondary idea-btn--sm"
          style={{ marginTop: '12px' }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

const DefaultFolderIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.6 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <DefaultFolderIcon />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`idea-empty-state ${className}`}>
      <div className="idea-empty-state-icon" aria-hidden="true">{icon}</div>
      <div className="idea-empty-state-title">{title}</div>
      {description && <div className="idea-empty-state-desc">{description}</div>}
      {action && <div>{action}</div>}
    </div>
  );
};
