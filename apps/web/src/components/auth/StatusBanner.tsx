export type BannerType = "neutral" | "warning" | "danger" | "success";

export interface StatusBannerProps {
  type: BannerType;
  message: string;
}

export function StatusBanner({ type, message }: StatusBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`status-banner status-${type}`}
      data-testid="status-banner"
    >
      <svg
        style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
