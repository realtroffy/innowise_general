import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as commentService from "../../services/commentService.js";
import {
  extractErrorMessage,
  handleThunkError,
} from "../../utils/sliceHelpers.js";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (
    { imageId, page = 0, size = 3, userId = null },
    { rejectWithValue }
  ) => {
    try {
      const data = await commentService.fetchComments(
        imageId,
        page,
        size,
        userId
      );
      return { ...data, imageId, page, size };
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to load comments")
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ imageId, userId, content }, { rejectWithValue }) => {
    try {
      const comment = await commentService.addComment(imageId, userId, content);
      return comment;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Failed to add comment"));
    }
  }
);

export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ imageId, commentId, userId, content }, { rejectWithValue }) => {
    try {
      const comment = await commentService.editComment(
        imageId,
        commentId,
        userId,
        content
      );
      return comment;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Failed to edit comment"));
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ imageId, commentId, userId }, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(imageId, commentId, userId);
      return { imageId, commentId };
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to delete comment")
      );
    }
  }
);

const initialState = {
  comments: {},
  loading: {},
  error: {},
  pagination: {},
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearError: (state, { payload }) => {
      if (payload?.imageId) {
        state.error[payload.imageId] = null;
      } else {
        state.error = {};
      }
    },
    clearComments: (state, { payload }) => {
      if (payload?.imageId) {
        delete state.comments[payload.imageId];
        delete state.loading[payload.imageId];
        delete state.error[payload.imageId];
        delete state.pagination[payload.imageId];
      } else {
        state.comments = {};
        state.loading = {};
        state.error = {};
        state.pagination = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, { meta }) => {
        const imageId = meta.arg.imageId;
        state.loading[imageId] = true;
        state.error[imageId] = null;
      })
      .addCase(fetchComments.fulfilled, (state, { payload }) => {
        const imageId = payload.imageId;
        state.loading[imageId] = false;
        if (payload.page === 0) {
          state.comments[imageId] = payload.content || [];
        } else {
          const existing = state.comments[imageId] || [];
          state.comments[imageId] = [...existing, ...(payload.content || [])];
        }
        state.pagination[imageId] = {
          page: payload.page,
          size: payload.size,
          hasNext: Boolean(payload.hasNext),
        };
      })
      .addCase(fetchComments.rejected, (state, { payload, meta }) => {
        const imageId = meta.arg.imageId;
        state.loading[imageId] = false;
        state.error[imageId] = extractErrorMessage(payload || {});
      })

      .addCase(addComment.fulfilled, (state, { payload, meta }) => {
        const imageId = meta.arg.imageId;
        const comments = state.comments[imageId] || [];
        state.comments[imageId] = [payload, ...comments];
      })

      .addCase(editComment.fulfilled, (state, { payload, meta }) => {
        const imageId = meta.arg.imageId;
        const comments = state.comments[imageId] || [];
        const index = comments.findIndex((c) => c.id === payload.id);
        if (index !== -1) {
          state.comments[imageId][index] = payload;
        }
      })

      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        const imageId = payload.imageId;
        const comments = state.comments[imageId] || [];
        state.comments[imageId] = comments.filter(
          (c) => c.id !== payload.commentId
        );
      });
  },
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
