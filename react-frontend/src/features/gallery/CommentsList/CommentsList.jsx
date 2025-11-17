import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DEFAULT_PAGE_SIZE,
  MAX_COMMENT_LENGTH,
} from "../../../services/commentService.js";
import {
  fetchComments,
  addComment,
  editComment,
  deleteComment,
  clearComments,
} from "../../../store/slices/commentSlice.js";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import Button from "../../../components/Button/Button.jsx";
import Textarea from "../../../components/Textarea/Textarea.jsx";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import Comment from "./Comment/Comment.jsx";

export default function CommentsList({ imageId, imageOwnerId = null }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const commentsState = useSelector((s) => s.comments);

  const comments = commentsState.comments[imageId] || [];
  const loading = commentsState.loading[imageId] || false;
  const error = commentsState.error[imageId] || null;
  const pagination = React.useMemo(
    () =>
      commentsState.pagination[imageId] || {
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        hasNext: false,
      },
    [commentsState.pagination, imageId]
  );

  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const PAGE_SIZE = DEFAULT_PAGE_SIZE;
  const MAX_COMMENT_LEN = MAX_COMMENT_LENGTH;

  useEffect(() => {
    dispatch(clearComments({ imageId }));
  }, [imageId, dispatch]);

  useEffect(() => {
    if (imageId) {
      dispatch(
        fetchComments({
          imageId,
          page: 0,
          size: PAGE_SIZE,
          userId: user?.id || null,
        })
      );
    }
  }, [imageId, PAGE_SIZE, user?.id, dispatch]);

  const loadMoreComments = useCallback(() => {
    if (loading || !pagination.hasNext || !imageId) {
      return;
    }
    dispatch(
      fetchComments({
        imageId,
        page: pagination.page,
        size: PAGE_SIZE,
        userId: user?.id || null,
      })
    );
  }, [imageId, pagination, PAGE_SIZE, user?.id, loading, dispatch]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!user || !text) {
      return;
    }
    setCommentError(null);
    try {
      await dispatch(
        addComment({ imageId, userId: user.id, content: text })
      ).unwrap();
      setCommentText("");
    } catch (err) {
      setCommentError(err.message || "Failed to add comment");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (commentId, text) => {
    try {
      setActionLoadingId(commentId);
      await dispatch(
        editComment({
          imageId,
          commentId,
          userId: user.id,
          content: text,
        })
      ).unwrap();
      handleCancelEdit();
    } catch (error) {
      console.error("Edit comment error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setActionLoadingId(commentId);
      await dispatch(
        deleteComment({ imageId, commentId, userId: user.id })
      ).unwrap();
    } catch (error) {
      console.error("Delete comment error:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="gallery-comments">
      <h3 className="comments-title-h3">Comments</h3>
      {user && (
        <form className="auth-form" onSubmit={handleAddComment}>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            maxLength={MAX_COMMENT_LEN}
            rows={2}
            className="comment-create-input"
          />
          <ErrorBanner>{commentError}</ErrorBanner>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </form>
      )}

      {loading && comments.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          {error && <ErrorBanner>{error}</ErrorBanner>}
          {comments.length === 0 && !loading && (
            <div className="gallery-empty-title">No comments yet</div>
          )}
          {comments.length > 0 && (
            <ul className="comments-list">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUser={user}
                  imageOwnerId={imageOwnerId}
                  isEditing={editingId === comment.id}
                  isLoading={actionLoadingId === comment.id}
                  onStartEdit={handleStartEdit}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}

          {pagination.hasNext && comments.length > 0 && (
            <Button
              variant="primary"
              onClick={loadMoreComments}
              disabled={loading}
            >
              {loading ? "Loading..." : "Show more"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
