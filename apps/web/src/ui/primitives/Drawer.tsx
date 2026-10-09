import React, { useEffect, useRef, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getOverlayRoot, pushOverlay, isTopOverlay } from "./overlayStack";
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
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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
      // Only the topmost active overlay may handle keyboard events
      if (!isTopOverlay(overlayId)) return;

      if (e.key === "Escape" && onCloseRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
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
  }, [isActualOpen, backgroundSelector, overlayId]); // Stable dependencies without callback identity

  if (!isActualOpen) return null;

  const content = (
    <div
      ref={containerRef}
      className="idea-drawer-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === containerRef.current && onCloseRef.current) {
          onCloseRef.current();
        }
      }}
    >
      <div
        ref={drawerRef}
        className="idea-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subId : undefined}
        tabIndex={-1}
      >
        <div className="idea-drawer-header">
          <div className="idea-drawer-title-group">
            <h2 id={titleId} className="idea-drawer-title">
              {title}
            </h2>
            {subtitle && (
              <span id={subId} className="idea-drawer-subtitle">
                {subtitle}
              </span>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              className="idea-btn idea-btn--ghost idea-btn--sm"
              onClick={() => onCloseRef.current?.()}
              aria-label="Đóng bảng trượt"
            >
              ✕
            </button>
          )}
        </div>
        {description && (
          <div style={{ padding: "0 24px", marginBottom: "12px", fontSize: "13px", color: "var(--idea-color-text-muted)" }}>
            {description}
          </div>
        )}
        <div className="idea-drawer-body">{children}</div>
        {footer && <div className="idea-drawer-footer">{footer}</div>}
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
