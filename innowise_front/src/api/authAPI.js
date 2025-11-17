import axios from "axios";
import api from "./api.js";
import { AUTH_ENDPOINTS } from "./endpoints.js";

export const register = async (userData) => {
  return axios.post(AUTH_ENDPOINTS.REGISTER, {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });
};

export const login = async (credentials) => {
  return axios.post(AUTH_ENDPOINTS.LOGIN, {
    username: credentials.username,
    password: credentials.password,
  });
};

export const validateToken = async () => {
  return api.post(AUTH_ENDPOINTS.VALIDATE);
};

export const refreshToken = async (refreshToken) => {
  return axios.post(
    AUTH_ENDPOINTS.REFRESH,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
};
