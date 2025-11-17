export const IMAGE_CONFIG = {
  MAX_SIZE: 1280,
  QUALITY: 0.8,
};

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    image.src = objectUrl;
  });
}

function calculateResizedDimensions(width, height, maxSize) {
  const larger = Math.max(width, height);
  if (larger <= maxSize) {
    return { width, height };
  }

  const scale = maxSize / larger;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function compressImageToBlob(image, width, height, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

function createFileFromBlob(blob, originalFileName) {
  const fileName = originalFileName.replace(/\.[^.]+$/, ".jpg");
  return new File([blob], fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function resizeImageFile(
  file,
  maxSize = IMAGE_CONFIG.MAX_SIZE,
  quality = IMAGE_CONFIG.QUALITY
) {
  try {
    const image = await loadImageFromFile(file);
    const { width, height } = image;

    const { width: newWidth, height: newHeight } = calculateResizedDimensions(
      width,
      height,
      maxSize
    );

    if (newWidth === width && newHeight === height) {
      return file;
    }

    const blob = await compressImageToBlob(image, newWidth, newHeight, quality);
    return createFileFromBlob(blob, file.name);
  } catch (error) {
    console.error("Image processing error:", error);
    return file;
  }
}
