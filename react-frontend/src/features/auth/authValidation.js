function authValidateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function authValidateUsername(username) {
  const trimmed = username?.trim() || "";
  if (!trimmed) {
    return { isValid: false, error: "Username is required" };
  }
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters",
    };
  }
  if (trimmed.length > 50) {
    return {
      isValid: false,
      error: "Username must not exceed 50 characters",
    };
  }
  return { isValid: true };
}

export function authValidatePassword(password) {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    };
  }
  return { isValid: true };
}

export function authValidateEmailField(email) {
  const trimmed = email?.trim() || "";
  if (!trimmed) {
    return { isValid: false, error: "Email is required" };
  }
  if (!authValidateEmail(trimmed)) {
    return { isValid: false, error: "Invalid email address" };
  }
  if (trimmed.length > 100) {
    return { isValid: false, error: "Email must not exceed 100 characters" };
  }
  return { isValid: true };
}

export function authValidateLoginForm(formData) {
  const errors = {};
  const usernameResult = authValidateUsername(formData.username);
  if (!usernameResult.isValid) {
    errors.username = usernameResult.error;
  }
  const passwordResult = authValidatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  const errorMessage = Object.values(errors).join(", ");

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    errorMessage: errorMessage || undefined,
  };
}

export function authValidateRegistrationForm(formData) {
  const errors = {};
  const usernameResult = authValidateUsername(formData.username);
  if (!usernameResult.isValid) {
    errors.username = usernameResult.error;
  }
  const emailResult = authValidateEmailField(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  const passwordResult = authValidatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  const errorMessage = Object.values(errors).join(", ");

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    errorMessage: errorMessage || undefined,
  };
}
