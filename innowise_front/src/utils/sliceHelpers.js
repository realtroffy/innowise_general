export function extractErrorMessage(payload) {
  return (
    payload?.detail || "Service is not available now. Please try again later."
  );
}

export function handleThunkError(error, defaultMessage) {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  if (status >= 400 && status < 500) {
    return {
      detail: detail || error.message || defaultMessage,
      status: status,
    };
  }

  return {
    detail: "Service is not available now. Please try again later.",
    status: status || 500,
  };
}
