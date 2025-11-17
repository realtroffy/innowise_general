import React from "react";
import "./ImageCard.css";

const DEFAULT_MAX_DESC_LEN = 300;

export default function ImageCard({
  image,
  onClick,
  showDetails = true,
  showLike = false,
  onLike,
  maxDescLength = DEFAULT_MAX_DESC_LEN,
}) {
  if (!image) {
    return null;
  }

  const displayDesc =
    maxDescLength === null || maxDescLength === Infinity
      ? image.description
      : image.description?.length > maxDescLength
        ? image.description.slice(0, maxDescLength) + "…"
        : image.description;

  return (
    <div
      className="gallery-image-card image-card-clickable"
      onClick={() => onClick?.(image)}
    >
      <img src={image.url} alt={displayDesc || "img"} className="img-view" />

      {showDetails && (
        <div className="image-info">
          <div className="image-author">
            Author: {image.userName || "Anonymous"}
          </div>
          <div className="image-desc">{displayDesc}</div>
        </div>
      )}

      {showLike && (
        <button
          className={`btn-like ${image.likedByCurrentUser ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(image);
          }}
        >
          <span role="img" aria-label="like">
            {image.likedByCurrentUser ? "❤️" : "🤍"}
          </span>
          <span className="like-count">{image.likes || 0}</span>
        </button>
      )}
    </div>
  );
}
