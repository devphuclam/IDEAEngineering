import { useEffect, useRef, type ReactNode } from "react";
import "./primitives.css";

export interface DialogProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  role?: "dialog" | "alertdialog";
  ariaDescribedBy?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  backgroundSelector?: string;
}

export function Dialog({
  open,
  isOpen,
  onClose,
  title,
  role = "dialog",
  ariaDescribedBy,
  description,
  children,
  footer,
  backgroundSelector = "#appRoot",
}: DialogProps) {
  const isActualOpen = open ?? isOpen ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActualOpen) return;

    // Capture currently focused element to restore upon close
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Apply inert to background
    const bgElements = backgroundSelector ? document.querySelectorAll<HTMLElement>(backgroundSelector) : [];
    bgElements.forEach((el) => {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    });

    // Auto-focus first interactive element or dialog itself
    const timer = setTimeout(() => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current.focus();
      }
    }, 20);

    // Keydown handler: Escape & Tab Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
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

      // Restore focus to previous trigger
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === "function") {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActualOpen, onClose, backgroundSelector]);

  if (!isActualOpen) return null;

  const titleId = "idea-dialog-title";

  return (
    <div className="idea-modal-backdrop" role="presentation">
      <div
        ref={dialogRef}
        className="idea-dialog"
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        <div className="idea-dialog-header">
          <h2 id={titleId} className="idea-dialog-title">
            {title}
          </h2>
          {onClose && (
            <button
              type="button"
              className="idea-btn idea-btn--ghost idea-btn--sm"
              onClick={onClose}
              aria-label="Đóng hộp thoại"
            >
              ✕
            </button>
          )}
        </div>
        <div className="idea-dialog-body" id={ariaDescribedBy}>
          {children}
        </div>
        {footer && <div className="idea-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}
