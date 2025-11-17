import * as galleryAPI from "../api/galleryAPI.js";
import { IMAGE_CONFIG } from "../utils/imageProcessing.js";
import { handleApiError } from "../utils/errorHandler.js";

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_IMAGE_SIZE = IMAGE_CONFIG.MAX_SIZE;

export const IMAGE_QUALITY = IMAGE_CONFIG.QUALITY;

export async function resizeImageFile(file, maxSize, quality) {
  const { resizeImageFile } = await import("../utils/imageProcessing.js");
  return resizeImageFile(
    file,
    maxSize ?? MAX_IMAGE_SIZE,
    quality ?? IMAGE_QUALITY
  );
}

export async function fetchGallery(
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  userId = null
) {
  try {
    const data = await galleryAPI.fetchGallery(page, size, userId);
    if (!data || !Array.isArray(data.content)) {
      throw new Error("Invalid data format received from server");
    }
    return {
      content: data.content || [],
      hasNext: Boolean(data.hasNext),
    };
  } catch (error) {
    throw handleApiError(error, "Failed to load gallery");
  }
}

export async function fetchUserGallery(
  userId,
  page = 0,
  size = DEFAULT_PAGE_SIZE
) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const data = await galleryAPI.fetchUserGallery(userId, page, size);
    if (!data || !Array.isArray(data.content)) {
      throw new Error("Invalid data format received from server");
    }
    return {
      content: data.content || [],
      hasNext: Boolean(data.hasNext),
    };
  } catch (error) {
    throw handleApiError(error, "Failed to load your gallery");
  }
}

export async function fetchImageById(imageId, userId = null) {
  if (!imageId) {
    throw new Error("Image ID is required");
  }
  try {
    const image = await galleryAPI.fetchImage(imageId, userId);
    if (!image) {
      throw new Error("Image not found");
    }
    return image;
  } catch (error) {
    throw handleApiError(error, "Failed to load image");
  }
}

export async function toggleLike(imageId, userId) {
  if (!imageId || !userId) {
    throw new Error("Image ID and User ID are required");
  }
  try {
    await galleryAPI.likeImage(imageId, userId);
  } catch (error) {
    throw handleApiError(error, "Failed to toggle like");
  }
}

export async function uploadImage(userId, file, description) {
  try {
    const image = await galleryAPI.uploadImage(
      userId,
      file,
      description.trim()
    );
    return image;
  } catch (error) {
    throw handleApiError(error, "Upload failed");
  }
}

export function updateImageLikeState(image) {
  return {
    ...image,
    likes: image.likedByCurrentUser ? image.likes - 1 : image.likes + 1,
    likedByCurrentUser: !image.likedByCurrentUser,
  };
}
