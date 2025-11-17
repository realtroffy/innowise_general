import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService.js";
import {
  extractErrorMessage,
  handleThunkError,
} from "../../utils/sliceHelpers.js";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Login failed"));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Registration failed"));
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validate",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.validateToken();
      return data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Invalid token"));
    }
  }
);

export const getAccessToken = () => localStorage.getItem("accessToken") || null;
export const getRefreshToken = () =>
  localStorage.getItem("refreshToken") || null;
export const getUsername = () => localStorage.getItem("username") || null;
export const isAuthenticated = () => !!getAccessToken();

const initialState = {
  user: getUsername() ? { id: null } : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      ["accessToken", "refreshToken", "username"].forEach((k) =>
        localStorage.removeItem(k)
      );
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, { payload }) => {
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        const { username } = meta.arg;
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
        localStorage.setItem("username", username);
        state.user = { id: null };
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload, meta }) => {
        state.loading = false;
        state.error = null;
        if (payload.accessToken) {
          localStorage.setItem("accessToken", payload.accessToken);
          localStorage.setItem("refreshToken", payload.refreshToken);
          localStorage.setItem("username", meta.arg.username);
          state.user = { id: null };
        }
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
      })

      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        const userId = payload.id ?? payload.userId ?? null;
        state.user = { id: userId };
      })
      .addCase(validateToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        ["accessToken", "refreshToken", "username"].forEach((k) =>
          localStorage.removeItem(k)
        );
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
