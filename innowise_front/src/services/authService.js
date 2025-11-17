import * as authAPI from "../api/authAPI.js";
import { handleApiError } from "../utils/errorHandler.js";

export async function login(credentials) {
  try {
    const { data } = await authAPI.login(credentials);

    if (!data || !data.accessToken || !data.refreshToken) {
      throw new Error("Invalid response from server");
    }

    return data;
  } catch (error) {
    throw handleApiError(error, "Login failed");
  }
}

export async function register(userData) {
  try {
    const { data } = await authAPI.register(userData);

    if (data && data.accessToken && !data.refreshToken) {
      throw new Error("Invalid response from server");
    }

    return data || {};
  } catch (error) {
    throw handleApiError(error, "Registration failed");
  }
}

export async function validateToken() {
  try {
    const { data } = await authAPI.validateToken();

    if (!data || (data.id === undefined && data.userId === undefined)) {
      throw new Error("Invalid token response");
    }

    return data;
  } catch (error) {
    throw handleApiError(error, "Token validation failed");
  }
}
