import React from "react";

let textareaCounter = 0;

export default function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}) {
  const textareaId = id || props.name || `textarea-${++textareaCounter}`;
  const textareaClasses = [error ? "error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-group">
      {label && <label htmlFor={textareaId}>{label}</label>}
      <textarea
        id={textareaId}
        className={textareaClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}
