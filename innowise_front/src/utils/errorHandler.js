export function handleApiError(error, defaultMessage) {
  if (error.response) {
    const errorMessage =
      error.response?.data?.detail || error.message || defaultMessage;
    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    return enhancedError;
  } else if (error.request) {
    const networkError = new Error(
      error.message || "Network error. Please check if the server is running."
    );
    return networkError;
  } else {
    return error;
  }
}
