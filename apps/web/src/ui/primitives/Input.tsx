import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import "./primitives.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, error, errorMessage, className = "", ...props },
  ref
) {
  const effectiveError = errorMessage || error;
  const inputClasses = [
    "idea-input",
    icon ? "idea-input--has-icon" : "",
    effectiveError ? "idea-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputElement = (
    <input
      ref={ref}
      className={inputClasses}
      aria-invalid={Boolean(effectiveError)}
      {...props}
    />
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", width: "100%" }}>
      {icon ? (
        <div className="idea-input-wrapper">
          <span className="idea-input-icon" aria-hidden="true">{icon}</span>
          {inputElement}
        </div>
      ) : (
        inputElement
      )}
      {effectiveError && (
        <div className="idea-input-error" role="alert" style={{ fontSize: "11px", color: "var(--idea-color-danger)", marginTop: "4px" }}>
          {effectiveError}
        </div>
      )}
    </div>
  );
});
