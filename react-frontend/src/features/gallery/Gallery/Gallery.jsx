import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  logout,
  validateToken,
  getAccessToken,
} from "../../../store/slices/authSlice.js";
import {
  fetchGallery,
  fetchUserGallery,
  toggleLike,
  clearImages,
  clearError,
} from "../../../store/slices/gallerySlice.js";
import ImageCard from "../ImageCard/ImageCard.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import Button from "../../../components/Button/Button.jsx";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import UploadImage from "../UploadImage/UploadImage.jsx";
import "./Gallery.css";

const PAGE_SIZE = 10;

export default function Gallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { images, loading, error, pagination } = useSelector(
    (state) => state.gallery
  );

  const [mode, setMode] = useState("all");

  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    dispatch(clearImages());
    dispatch(clearError());

    if (mode === "mine" && !user?.id) {
      const accessToken = getAccessToken();
      if (accessToken) {
        dispatch(validateToken());
      }
      return;
    }

    if (mode === "mine" && user?.id) {
      dispatch(fetchUserGallery({ userId: user.id, page: 0, size: PAGE_SIZE }));
    } else {
      dispatch(
        fetchGallery({ page: 0, size: PAGE_SIZE, userId: user?.id || null })
      );
    }
  }, [mode, user?.id, dispatch]);

  const handleLoadMore = async () => {
    if (loading || !pagination.hasNext) {
      return;
    }

    const nextPage = pagination.page;

    if (mode === "mine" && user?.id) {
      dispatch(
        fetchUserGallery({ userId: user.id, page: nextPage, size: PAGE_SIZE })
      );
    } else {
      dispatch(
        fetchGallery({
          page: nextPage,
          size: PAGE_SIZE,
          userId: user?.id || null,
        })
      );
    }
  };

  const handleLike = async (img) => {
    if (!user?.id) {
      return;
    }
    try {
      await dispatch(toggleLike({ imageId: img.id, userId: user.id })).unwrap();
    } catch (error) {
      console.error("Toggle like error:", error);
    }
  };

  const showUpload = user && mode === "mine";

  return (
    <div className="auth-container">
      <div className="gallery-main-card">
        <header className="gallery-header">
          <h1 className="gallery-title">Image Gallery</h1>
          {user && <p className="auth-subtitle">Hello, {currentUsername}</p>}

          <div className="gallery-mode-buttons">
            <Button
              variant="primary"
              className="mode-button"
              onClick={() => setMode("all")}
              disabled={mode === "all"}
            >
              All
            </Button>
            <Button
              variant="primary"
              className="mode-button"
              onClick={() => setMode("mine")}
              disabled={mode === "mine"}
            >
              My gallery
            </Button>
          </div>
        </header>

        {showUpload && <UploadImage />}

        <main className="gallery-body">
          <ErrorBanner>{error}</ErrorBanner>
          {loading && images.length === 0 && <LoadingSpinner />}
          {!loading && !error && images.length === 0 && (
            <div className="gallery-empty-state">No images found</div>
          )}
          {images.length > 0 && (
            <div className="gallery-list">
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  onClick={() => navigate(`/gallery/${img.id}`)}
                  showDetails={true}
                  showLike={true}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
          {pagination.hasNext && (
            <div className="gallery-load-more">
              <Button
                variant="primary"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </main>

        <footer className="gallery-footer">
          <Button
            variant="logout"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </footer>
      </div>
    </div>
  );
}
