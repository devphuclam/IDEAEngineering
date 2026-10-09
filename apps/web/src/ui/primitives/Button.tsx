import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./primitives.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", icon, children, className = "", disabled, ...props },
  ref
) {
  const classes = [
    "idea-btn",
    `idea-btn--${variant}`,
    size === "sm" ? "idea-btn--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classes} disabled={disabled} {...props}>
      {icon && <span className="idea-btn-icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
});
