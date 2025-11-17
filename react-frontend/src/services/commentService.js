import * as galleryAPI from "../api/galleryAPI.js";
import { handleApiError } from "../utils/errorHandler.js";

export const DEFAULT_PAGE_SIZE = 3;

export const MAX_COMMENT_LENGTH = 300;

export async function fetchComments(
  imageId,
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  userId = null
) {
  if (!imageId) {
    throw new Error("Image ID is required");
  }
  try {
    const data = await galleryAPI.fetchComments(imageId, page, size, userId);
    if (!data || !Array.isArray(data.content)) {
      throw new Error("Invalid data format received from server");
    }
    return {
      content: data.content || [],
      hasNext: Boolean(data.hasNext),
    };
  } catch (error) {
    throw handleApiError(error, "Failed to load comments");
  }
}

export async function addComment(imageId, userId, content) {
  if (!imageId || !userId) {
    throw new Error("Image ID and User ID are required");
  }
  const validationResult = validateCommentContent(content);
  if (!validationResult.isValid) {
    throw new Error(validationResult.error);
  }
  try {
    const comment = await galleryAPI.addComment(
      imageId,
      userId,
      content.trim()
    );
    return comment;
  } catch (error) {
    throw handleApiError(error, "Failed to add comment");
  }
}

export async function editComment(imageId, commentId, userId, content) {
  if (!imageId || !commentId || !userId) {
    throw new Error("Image ID, Comment ID and User ID are required");
  }
  const validationResult = validateCommentContent(content);
  if (!validationResult.isValid) {
    throw new Error(validationResult.error);
  }
  try {
    const comment = await galleryAPI.editComment(
      imageId,
      commentId,
      userId,
      content.trim()
    );
    return comment;
  } catch (error) {
    throw handleApiError(error, "Failed to edit comment");
  }
}

export async function deleteComment(imageId, commentId, userId) {
  if (!imageId || !commentId || !userId) {
    throw new Error("Image ID, Comment ID and User ID are required");
  }
  try {
    await galleryAPI.deleteComment(imageId, commentId, userId);
  } catch (error) {
    throw handleApiError(error, "Failed to delete comment");
  }
}

export function validateCommentContent(content) {
  const trimmed = content?.trim();
  if (!trimmed) {
    return { isValid: false, error: "Comment cannot be empty" };
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return {
      isValid: false,
      error: `Maximum ${MAX_COMMENT_LENGTH} characters`,
    };
  }
  return { isValid: true };
}

export function canUserEditComment(comment, currentUser) {
  if (!currentUser || !comment) {
    return false;
  }
  return (
    comment.isCurrentUserOwner ||
    Number(comment.userId) === Number(currentUser.id)
  );
}

export function canUserDeleteComment(
  comment,
  currentUser,
  imageOwnerId = null
) {
  if (!currentUser || !comment) {
    return false;
  }
  const isCommentOwner =
    comment.isCurrentUserOwner ||
    Number(comment.userId) === Number(currentUser.id);
  const isImageOwner =
    imageOwnerId !== null &&
    imageOwnerId !== undefined &&
    Number(imageOwnerId) === Number(currentUser.id);
  return isCommentOwner || isImageOwner;
}

export function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
