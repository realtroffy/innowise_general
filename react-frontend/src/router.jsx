import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import App from "./App.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

const Login = lazy(() => import("./features/auth/Login/Login.jsx"));
const Register = lazy(() => import("./features/auth/Register/Register.jsx"));
const Gallery = lazy(() => import("./features/gallery/Gallery/Gallery.jsx"));
const ImageDetail = lazy(
  () => import("./features/gallery/ImageDetail/ImageDetail.jsx")
);

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "gallery",
          element: (
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          ),
        },
        {
          path: "gallery/:id",
          element: (
            <ProtectedRoute>
              <ImageDetail />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    future: { v7_startTransition: true },
  }
);
