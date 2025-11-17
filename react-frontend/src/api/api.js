import axios from "axios";
import { AUTH_ENDPOINTS } from "./endpoints.js";
import { logout, setTokens } from "../store/slices/authSlice.js";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise = null;

function getTokenFromStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Storage read error for "${key}":`, error);
    return null;
  }
}

async function requestNewToken() {
  const refreshToken = getTokenFromStorage("refreshToken");
  if (!refreshToken) {
    console.warn("No refresh token found");
    return null;
  }

  try {
    const response = await axios.post(
      AUTH_ENDPOINTS.REFRESH,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Token refresh failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

function startTokenRefresh(store) {
  isRefreshing = true;
  refreshPromise = requestNewToken()
    .then((responseData) => {
      isRefreshing = false;
      refreshPromise = null;
      if (!responseData || !responseData.accessToken) {
        throw new Error("Empty token received");
      }
      const { accessToken, refreshToken } = responseData;
      store.dispatch(setTokens({ accessToken, refreshToken }));
      return accessToken;
    })
    .catch((refreshError) => {
      isRefreshing = false;
      refreshPromise = null;
      store.dispatch(logout());
      return Promise.reject(refreshError);
    });
}

function handleRequestInterceptor(config) {
  const token = getTokenFromStorage("accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

async function handleResponseError(store, error) {
  const originalRequest = error.config || {};

  if (error.response?.status !== 401) {
    return Promise.reject(error);
  }

  if (originalRequest._retry === true) {
    console.error("Auth retry failed, logging out");
    store.dispatch(logout());
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  if (!isRefreshing) {
    startTokenRefresh(store);
  }

  try {
    const newAccessToken = await refreshPromise;
    originalRequest.headers = {
      ...originalRequest.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };
    return api(originalRequest);
  } catch (refreshError) {
    return Promise.reject(refreshError);
  }
}

export function initApi(store) {
  api.interceptors.request.use(handleRequestInterceptor, (error) =>
    Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => handleResponseError(store, error)
  );
}

export default api;
