import React, { useEffect, useRef, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getOverlayRoot, pushOverlay } from "./overlayStack";
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
  const overlayId = useId();
  const titleId = `${overlayId}-title`;
  const defaultDescId = `${overlayId}-desc`;
  const effectiveDescId = ariaDescribedBy ?? (description ? defaultDescId : undefined);

  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isActualOpen || !backdropRef.current) return;

    // Register with stack manager to handle nested inert states and focus restoration
    const cleanupStack = pushOverlay(overlayId, backdropRef.current, backgroundSelector);

    // Auto-focus first interactive element inside dialog
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCloseRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
          )
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

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
      cleanupStack();
    };
  }, [isActualOpen, backgroundSelector, overlayId]); // Stable dependencies without callback identity

  if (!isActualOpen) return null;

  const content = (
    <div
      ref={backdropRef}
      className="idea-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === backdropRef.current && onCloseRef.current) {
          onCloseRef.current();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="idea-dialog"
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={effectiveDescId}
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
              onClick={() => onCloseRef.current?.()}
              aria-label="Đóng hộp thoại"
            >
              ✕
            </button>
          )}
        </div>
        <div className="idea-dialog-body">
          {description && (
            <p id={defaultDescId} style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--idea-color-text-muted)" }}>
              {description}
            </p>
          )}
          {children}
        </div>
        {footer && <div className="idea-dialog-footer">{footer}</div>}
      </div>
    </div>
  );

  // When in browser environment, portal outside #appRoot
  if (typeof document !== "undefined") {
    const portalRoot = getOverlayRoot();
    return createPortal(content, portalRoot);
  }

  // SSR fallback
  return content;
}
