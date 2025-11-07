import React from "react";

export default function Button({
  variant = "primary",
  size,
  disabled = false,
  children,
  className = "",
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, size && `btn-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
