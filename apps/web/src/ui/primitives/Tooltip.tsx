import React, { useState, useId, cloneElement, isValidElement } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  if (!content) {
    return children;
  }

  const childProps = (children.props || {}) as Record<string, unknown>;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (typeof childProps.onMouseEnter === 'function') {
      (childProps.onMouseEnter as (event: React.MouseEvent) => void)(e);
    }
    setVisible(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (typeof childProps.onMouseLeave === 'function') {
      (childProps.onMouseLeave as (event: React.MouseEvent) => void)(e);
    }
    setVisible(false);
  };

  const handleFocus = (e: React.FocusEvent) => {
    if (typeof childProps.onFocus === 'function') {
      (childProps.onFocus as (event: React.FocusEvent) => void)(e);
    }
    setVisible(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (typeof childProps.onBlur === 'function') {
      (childProps.onBlur as (event: React.FocusEvent) => void)(e);
    }
    setVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (typeof childProps.onKeyDown === 'function') {
      (childProps.onKeyDown as (event: React.KeyboardEvent) => void)(e);
    }
    if (e.key === 'Escape') {
      setVisible(false);
    }
  };

  const injectedProps = {
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };

  const clonedChild = isValidElement(children)
    ? cloneElement(children, injectedProps)
    : children;

  return (
    <span className={`idea-tooltip-container ${className}`} style={{ display: 'inline-flex' }}>
      {clonedChild}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`idea-tooltip idea-tooltip--${position}`}
        >
          {content}
        </span>
      )}
    </span>
  );
};
