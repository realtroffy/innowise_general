import React, { forwardRef } from "react";

let fileInputCounter = 0;

const FileInput = forwardRef(function FileInput(
  { label = "Choose file", accept, id, className = "", ...props },
  ref
) {
  const inputId = id || `file-input-${++fileInputCounter}`;

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        type="file"
        accept={accept}
        className={className}
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default FileInput;
