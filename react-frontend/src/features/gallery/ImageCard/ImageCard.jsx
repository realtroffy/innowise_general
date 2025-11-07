import React from "react";
import "./ImageCard.css";

const MAX_DESC_LEN = 300;

export default function ImageCard({
  image,
  onClick,
  showDetails = true,
  showLike = false,
  onLike,
}) {
  if (!image) {
    return null;
  }

  const shortDesc =
    image.description?.length > MAX_DESC_LEN
      ? image.description.slice(0, MAX_DESC_LEN) + "…"
      : image.description;

  return (
    <div
      className="gallery-image-card image-card-clickable"
      onClick={() => onClick?.(image)}
    >
      <img src={image.url} alt={shortDesc || "img"} className="img-view" />

      {showDetails && (
        <div className="image-info">
          <div className="image-author">
            Author: {image.userName || "Anonymous"}
          </div>

          <div className="image-desc">{shortDesc}</div>
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
