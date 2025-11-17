import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImageById,
  toggleLike,
  clearError,
} from "../../../store/slices/gallerySlice.js";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import CommentsList from "../CommentsList/CommentsList.jsx";
import ImageCard from "../ImageCard/ImageCard.jsx";
import Button from "../../../components/Button/Button.jsx";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "./ImageDetail.css";

export default function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { currentImage, loading, error } = useSelector((s) => s.gallery);

  useEffect(() => {
    if (id) {
      dispatch(fetchImageById({ imageId: id, userId: user?.id || null }));
    }
    return () => {
      dispatch(clearError());
    };
  }, [id, user?.id, dispatch]);

  const handleLike = async () => {
    if (!user || !currentImage) {
      return;
    }
    try {
      await dispatch(
        toggleLike({ imageId: currentImage.id, userId: user.id })
      ).unwrap();
    } catch (error) {
      console.error("Toggle like error:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorBanner>{error}</ErrorBanner>;
  }
  if (!currentImage) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="gallery-main-card">
        <Button variant="logout" onClick={() => navigate(-1)}>
          Back
        </Button>

        <ImageCard
          image={currentImage}
          showDetails={true}
          showLike={true}
          onClick={null}
          onLike={handleLike}
        />

        <CommentsList
          imageId={id}
          imageOwnerId={currentImage?.userId || null}
        />
      </div>
    </div>
  );
}
