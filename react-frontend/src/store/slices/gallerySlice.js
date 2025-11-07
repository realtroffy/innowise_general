import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as galleryService from "../../services/galleryService.js";
import {
  extractErrorMessage,
  handleThunkError,
} from "../../utils/sliceHelpers.js";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async ({ page = 0, size = 10, userId = null }, { rejectWithValue }) => {
    try {
      const data = await galleryService.fetchGallery(page, size, userId);
      return { ...data, page, size, userId };
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Failed to load gallery"));
    }
  }
);

export const fetchUserGallery = createAsyncThunk(
  "gallery/fetchUserGallery",
  async ({ userId, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const data = await galleryService.fetchUserGallery(userId, page, size);
      return { ...data, page, size, userId };
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to load your gallery")
      );
    }
  }
);

export const fetchImageById = createAsyncThunk(
  "gallery/fetchImageById",
  async ({ imageId, userId = null }, { rejectWithValue }) => {
    try {
      const image = await galleryService.fetchImageById(imageId, userId);
      return image;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Failed to load image"));
    }
  }
);

export const toggleLike = createAsyncThunk(
  "gallery/toggleLike",
  async ({ imageId, userId }, { rejectWithValue }) => {
    try {
      await galleryService.toggleLike(imageId, userId);
      return { imageId, userId };
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Failed to toggle like"));
    }
  }
);

export const uploadImage = createAsyncThunk(
  "gallery/uploadImage",
  async ({ userId, file, description }, { rejectWithValue }) => {
    try {
      const image = await galleryService.uploadImage(userId, file, description);
      return image;
    } catch (error) {
      return rejectWithValue(handleThunkError(error, "Upload failed"));
    }
  }
);

const initialState = {
  images: [],
  currentImage: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    hasNext: false,
  },
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearImages: (state) => {
      state.images = [];
      state.pagination = { page: 0, size: 10, hasNext: false };
    },
    updateImageLikeState: (state, { payload }) => {
      const image = payload;
      if (state.currentImage?.id === image.id) {
        state.currentImage = galleryService.updateImageLikeState(image);
      }
      const index = state.images.findIndex((img) => img.id === image.id);
      if (index !== -1) {
        state.images[index] = galleryService.updateImageLikeState(
          state.images[index]
        );
      }
    },
    addImage: (state, { payload }) => {
      state.images.unshift(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.page === 0) {
          state.images = payload.content || [];
        } else {
          state.images = [...state.images, ...(payload.content || [])];
        }
        state.pagination = {
          page: payload.page + 1,
          size: payload.size,
          hasNext: Boolean(payload.hasNext),
        };
      })
      .addCase(fetchGallery.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
      })

      .addCase(fetchUserGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGallery.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.page === 0) {
          state.images = payload.content || [];
        } else {
          state.images = [...state.images, ...(payload.content || [])];
        }
        state.pagination = {
          page: payload.page + 1,
          size: payload.size,
          hasNext: Boolean(payload.hasNext),
        };
      })
      .addCase(fetchUserGallery.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
      })

      .addCase(fetchImageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImageById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentImage = payload;
      })
      .addCase(fetchImageById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
        state.currentImage = null;
      })

      .addCase(toggleLike.fulfilled, (state, { payload }) => {
        const { imageId } = payload;
        if (state.currentImage?.id === imageId) {
          state.currentImage = galleryService.updateImageLikeState(
            state.currentImage
          );
        }
        const index = state.images.findIndex((img) => img.id === imageId);
        if (index !== -1) {
          state.images[index] = galleryService.updateImageLikeState(
            state.images[index]
          );
        }
      })

      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, { payload }) => {
        state.loading = false;
        const username = localStorage.getItem("username");
        const newImage = { ...payload };
        if (username) {
          newImage.userName = username;
        }
        state.images.unshift(newImage);
      })
      .addCase(uploadImage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = extractErrorMessage(payload || {});
      });
  },
});

export const { clearError, clearImages, updateImageLikeState, addImage } =
  gallerySlice.actions;
export default gallerySlice.reducer;
