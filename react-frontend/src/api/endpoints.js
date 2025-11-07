export const AUTH_ENDPOINTS = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  VALIDATE: "/auth/validate",
  REFRESH: "/api/auth/refresh",
};

export const IMAGES_ENDPOINTS = {
  BASE: "/images",
  BY_ID: (id) => `/images/${id}`,
  LIKES: (id) => `/images/${id}/likes`,
  COMMENTS: (id) => `/images/${id}/comments`,
  COMMENT_BY_ID: (imageId, commentId) =>
    `/images/${imageId}/comments/${commentId}`,
};

export const USERS_ENDPOINTS = {
  IMAGES: "/users/images",
};
