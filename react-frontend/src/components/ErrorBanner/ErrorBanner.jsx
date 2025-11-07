import React from "react";

export default function ErrorBanner({ children, className = "" }) {
  if (!children) {
    return null;
  }

  const classes = ["error-banner", className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
