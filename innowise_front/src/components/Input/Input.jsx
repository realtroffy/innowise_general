import React from "react";

let inputCounter = 0;

export default function Input({ label, error, id, className = "", ...props }) {
  const inputId = id || props.name || `input-${++inputCounter}`;
  const inputClasses = [error ? "error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}
