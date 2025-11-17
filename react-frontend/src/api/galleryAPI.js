import api from "./api.js";
import { IMAGES_ENDPOINTS, USERS_ENDPOINTS } from "./endpoints.js";
import { resizeImageFile, IMAGE_CONFIG } from "../utils/imageProcessing.js";

function createUserHeaders(userId) {
  return { "X-User-Id": userId };
}

function normalizeComment(comment) {
  if (!comment) {
    return comment;
  }
  return {
    ...comment,
    ownerName: comment.ownerName ?? comment.userName ?? null,
  };
}

export const fetchGallery = async (page = 0, size = 20, userId = null) => {
  const res = await api.get(IMAGES_ENDPOINTS.BASE, {
    params: { page, size },
    headers: userId ? createUserHeaders(userId) : {},
  });
  return res.data;
};

export const likeImage = async (imageId, userId) => {
  const res = await api.put(
    IMAGES_ENDPOINTS.LIKES(imageId),
    {},
    {
      headers: createUserHeaders(userId),
    }
  );
  return res.data;
};

export const fetchComments = async (
  imageId,
  page = 0,
  size = 20,
  userId = null
) => {
  const res = await api.get(IMAGES_ENDPOINTS.COMMENTS(imageId), {
    params: { page, size },
    headers: userId ? createUserHeaders(userId) : {},
  });
  const data = res.data || {};
  const content = (data.content || []).map(normalizeComment);
  return { ...data, content };
};

export const addComment = async (imageId, userId, content) => {
  const res = await api.post(
    IMAGES_ENDPOINTS.COMMENTS(imageId),
    { content },
    {
      headers: createUserHeaders(userId),
    }
  );
  return normalizeComment(res.data);
};

export const editComment = async (imageId, commentId, userId, content) => {
  const res = await api.put(
    IMAGES_ENDPOINTS.COMMENT_BY_ID(imageId, commentId),
    { content },
    {
      headers: createUserHeaders(userId),
    }
  );
  return normalizeComment(res.data);
};

export const deleteComment = async (imageId, commentId, userId) => {
  await api.delete(IMAGES_ENDPOINTS.COMMENT_BY_ID(imageId, commentId), {
    headers: createUserHeaders(userId),
  });
};

export const uploadImage = async (userId, file, description) => {
  const formData = new FormData();
  const imageRequestBlob = new Blob([JSON.stringify({ description })], {
    type: "application/json",
  });

  const compressed = await resizeImageFile(
    file,
    IMAGE_CONFIG.MAX_SIZE,
    IMAGE_CONFIG.QUALITY
  );

  formData.append("imageRequest", imageRequestBlob, "request.json");
  formData.append(
    "file",
    compressed,
    compressed?.name || file?.name || "image.jpg"
  );

  try {
    const res = await api.post(IMAGES_ENDPOINTS.BASE, formData, {
      headers: {
        ...createUserHeaders(userId),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw err;
  }
};

export const fetchImage = async (imageId, userId = null) => {
  const res = await api.get(IMAGES_ENDPOINTS.BY_ID(imageId), {
    headers: userId ? createUserHeaders(userId) : {},
  });
  return res.data;
};

export const fetchUserGallery = async (userId, page = 0, size = 20) => {
  const res = await api.get(USERS_ENDPOINTS.IMAGES, {
    params: { page, size },
    headers: createUserHeaders(userId),
  });
  return res.data;
};
