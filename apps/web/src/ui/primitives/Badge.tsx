import { type HTMLAttributes, type ReactNode } from "react";
import "./primitives.css";

export type BadgeVariant =
  | "highest"
  | "admin"
  | "business"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = "neutral", children, className = "", ...props }: BadgeProps) {
  const classes = ["idea-badge", `idea-badge--${variant}`, className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
