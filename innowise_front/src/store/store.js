import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import galleryReducer from "./slices/gallerySlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
    comments: commentReducer,
  },
});
