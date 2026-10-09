import { useEffect, useRef, type ReactNode } from "react";
import "./primitives.css";

export interface DrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  backgroundSelector?: string;
}

export function Drawer({
  open,
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  footer,
  backgroundSelector = "#appRoot",
}: DrawerProps) {
  const isActualOpen = open ?? isOpen ?? false;
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActualOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Apply inert to background
    const bgElements = backgroundSelector ? document.querySelectorAll<HTMLElement>(backgroundSelector) : [];
    bgElements.forEach((el) => {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    });

    // Auto-focus first interactive element
    const timer = setTimeout(() => {
      if (!drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        drawerRef.current.focus();
      }
    }, 20);

    // Keydown handler: Escape & Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      // If a modal dialog is stacked on top of this drawer, let the dialog handle the event!
      const activeDialog = document.querySelector('.idea-modal-backdrop');
      if (activeDialog) return;

      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown, true);

      // Restore background
      bgElements.forEach((el) => {
        el.inert = false;
        el.removeAttribute("aria-hidden");
      });

      // Restore focus
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === "function") {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActualOpen, onClose, backgroundSelector]);

  if (!isActualOpen) return null;

  const titleId = "idea-drawer-title";

  return (
    <>
      <div className="idea-drawer-backdrop" role="presentation" onClick={onClose} />
      <aside
        ref={drawerRef}
        className="idea-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="idea-drawer-header">
          <div>
            <h2 id={titleId} className="idea-drawer-title">
              {title}
            </h2>
            {subtitle && (
              <div style={{ fontSize: "11px", color: "var(--idea-color-text-muted)", marginTop: "2px" }}>
                {subtitle}
              </div>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              className="idea-btn idea-btn--ghost idea-btn--sm"
              onClick={onClose}
              aria-label="Đóng Drawer"
            >
              ✕
            </button>
          )}
        </div>
        <div className="idea-drawer-body">{children}</div>
        {footer && <div className="idea-drawer-footer">{footer}</div>}
      </aside>
    </>
  );
}
