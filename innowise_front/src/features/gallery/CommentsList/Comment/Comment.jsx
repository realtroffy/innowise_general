import React, { useState, useEffect } from "react";
import {
  MAX_COMMENT_LENGTH,
  validateCommentContent,
  canUserEditComment,
  canUserDeleteComment,
  formatDate,
} from "../../../../services/commentService.js";
import Button from "../../../../components/Button/Button.jsx";
import Textarea from "../../../../components/Textarea/Textarea.jsx";
import ErrorBanner from "../../../../components/ErrorBanner/ErrorBanner.jsx";

export default function Comment({
  comment,
  currentUser,
  imageOwnerId = null,
  isEditing,
  isLoading,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  const [editingText, setEditingText] = useState(comment.content || "");
  const [editingError, setEditingError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setEditingText(comment.content || "");
      setEditingError(null);
    }
  }, [isEditing, comment.content]);

  const handleSave = () => {
    const text = editingText.trim();
    const validationResult = validateCommentContent(text);
    if (!validationResult.isValid) {
      setEditingError(validationResult.error);
      return;
    }
    setEditingError(null);
    onSave(comment.id, text);
  };

  const handleCancel = () => {
    setEditingText(comment.content || "");
    setEditingError(null);
    onCancel();
  };

  const canEdit = canUserEditComment(comment, currentUser);
  const canDelete = canUserDeleteComment(comment, currentUser, imageOwnerId);

  return (
    <li className="comment-list-item-li">
      <div className="comment-header">
        <span className="comment-author">
          {comment.ownerName || "Anonymous"}
        </span>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>

      {isEditing ? (
        <div className="comment-edit-row">
          <Textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            rows={2}
            className="comment-edit-input"
            placeholder="Edit your comment"
          />
          <ErrorBanner>{editingError}</ErrorBanner>
          <div className="comment-actions">
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="logout"
              size="small"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="comment-text comment-text-content">
            {comment.content}
          </div>
          {(canEdit || canDelete) && (
            <div className="comment-actions">
              {canEdit && (
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  onClick={() => onStartEdit(comment)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => onDelete(comment.id)}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting…" : "Delete"}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
}
