export function galleryValidateImageFile(file) {
  if (!file) {
    return { isValid: false, error: "Please select an image file" };
  }
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "File must be an image" };
  }
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "Image size must not exceed 10MB" };
  }
  return { isValid: true };
}

export function galleryValidateImageDescription(description) {
  const trimmed = description?.trim() || "";
  if (!trimmed) {
    return { isValid: false, error: "Description is required" };
  }
  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: "Description must not exceed 500 characters",
    };
  }
  return { isValid: true };
}

export function galleryValidateUploadForm(formData) {
  const errors = {};
  const fileResult = galleryValidateImageFile(formData.file);
  if (!fileResult.isValid) {
    errors.file = fileResult.error;
  }
  const descriptionResult = galleryValidateImageDescription(
    formData.description
  );
  if (!descriptionResult.isValid) {
    errors.description = descriptionResult.error;
  }

  const errorMessage = Object.values(errors).join(", ");

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    errorMessage: errorMessage || undefined,
  };
}
