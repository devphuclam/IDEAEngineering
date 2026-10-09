import React, { useEffect, useRef, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getOverlayRoot, pushOverlay, popOverlay } from "./overlayStack";
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
  const overlayId = useId();
  const titleId = `${overlayId}-title`;
  const subId = `${overlayId}-sub`;

  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActualOpen || !containerRef.current) return;

    // Register with stack manager to handle nested inert states and focus restoration
    const cleanupStack = pushOverlay(overlayId, containerRef.current, backgroundSelector);

    // Auto-focus first interactive element inside drawer
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
          )
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

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
      cleanupStack();
    };
  }, [isActualOpen, onClose, backgroundSelector, overlayId]);

  if (!isActualOpen) return null;

  const content = (
    <div ref={containerRef} className="idea-drawer-wrapper">
      <div className="idea-drawer-backdrop" role="presentation" onClick={onClose} />
      <aside
        ref={drawerRef}
        className="idea-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle || description ? subId : undefined}
        tabIndex={-1}
      >
        <div className="idea-drawer-header">
          <div>
            <h2 id={titleId} className="idea-drawer-title">
              {title}
            </h2>
            {(subtitle || description) && (
              <div id={subId} style={{ fontSize: "12px", color: "var(--idea-color-text-muted)", marginTop: "2px" }}>
                {subtitle || description}
              </div>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              className="idea-btn idea-btn--ghost idea-btn--sm"
              onClick={onClose}
              aria-label="Đóng bảng trượt"
            >
              ✕
            </button>
          )}
        </div>
        <div className="idea-drawer-body">{children}</div>
        {footer && <div className="idea-drawer-footer">{footer}</div>}
      </aside>
    </div>
  );

  if (typeof document !== "undefined") {
    const portalRoot = getOverlayRoot();
    return createPortal(content, portalRoot);
  }

  return content;
}
