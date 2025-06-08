import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function CommentEdit({ comments, fetchPosts, toggleDeleted, postId }) {
  const [deleting, setDeleting] = useState({});
  const [editing, setEditing] = useState({});
  const [editContent, setEditContent] = useState({});
  const [error, setError] = useState(null);
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    console.log("Comments:", comments); // Debug
  }, [comments]);

  const handleEditComment = async (commentId) => {
    if (!currentUser) {
      setError("You must be logged in to edit a comment.");
      return;
    }

    const content = editContent[commentId]?.trim();
    if (!content) {
      setError("Comment content cannot be empty.");
      return;
    }

    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, userId: currentUser, postId: postId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          response.status === 404
            ? "Comment not found"
            : response.status === 403
            ? "You are not authorized to edit this comment"
            : errorData.error || "Failed to edit comment"
        );
      }

      await fetchPosts(); // Refresh posts/comments after edit
      setEditing((prev) => ({ ...prev, [commentId]: false }));
      setEditContent((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Edit error:", err.message);
      setError(err.message || "Failed to edit comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) {
      setError("You must be logged in to delete a comment.");
      return;
    }

    setDeleting((prev) => ({ ...prev, [commentId]: true }));
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: currentUser }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          response.status === 404
            ? "Comment not found"
            : response.status === 403
            ? "You are not authorized to delete this comment"
            : errorData.error || "Failed to delete comment"
        );
      }

      await fetchPosts(); // Refresh posts/comments after delete
      toggleDeleted(); // Call toggleDeleted to notify parent
      setDeleting((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.error("Delete error:", err.message);
      setError(err.message || "Failed to delete comment.");
      setDeleting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const startEditing = (commentId, currentContent) => {
    setError(null);
    setEditContent((prev) => ({ ...prev, [commentId]: currentContent }));
    setEditing((prev) => ({ ...prev, [commentId]: true }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: "0.5rem",
      }}
    >
      {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => {
          const username = comment.User?.USER_USERNAME || "Anonymous";
          const createdAt =
            comment.createdAt && !isNaN(new Date(comment.createdAt))
              ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown Date";
          const canEdit = currentUser && currentUser === username;

          return (
            <motion.div
              key={comment.COMMENT_ID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "#2a2a2a",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#aaa",
                  margin: "0 0 0.2rem 0",
                }}
              >
                <strong>Posted by:</strong> {username}
              </p>
              {editing[comment.COMMENT_ID] ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <textarea
                    value={
                      editContent[comment.COMMENT_ID] || comment.COMMENT_CONTENT
                    }
                    onChange={(e) =>
                      setEditContent((prev) => ({
                        ...prev,
                        [comment.COMMENT_ID]: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      minHeight: "60px",
                      padding: "0.5rem",
                      borderRadius: "5px",
                      border: "1px solid #444",
                      backgroundColor: "#333",
                      color: "white",
                      fontSize: "0.9rem",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditComment(comment.COMMENT_ID)}
                      disabled={deleting[comment.COMMENT_ID]}
                      style={{
                        backgroundColor: "#4CAF50",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.3rem 0.6rem",
                        color: "white",
                        cursor: deleting[comment.COMMENT_ID]
                          ? "not-allowed"
                          : "pointer",
                        fontSize: "0.7rem",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditing((prev) => ({
                          ...prev,
                          [comment.COMMENT_ID]: false,
                        }))
                      }
                      style={{
                        backgroundColor: "#888",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.3rem 0.6rem",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "0.9rem", margin: "0 0 0.2rem 0" }}>
                    {comment.COMMENT_CONTENT}
                  </p>
                  <p style={{ fontSize: "0.6rem", color: "#aaa", margin: "0" }}>
                    <strong>Date:</strong> {createdAt}
                  </p>
                  {canEdit && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          startEditing(
                            comment.COMMENT_ID,
                            comment.COMMENT_CONTENT
                          )
                        }
                        disabled={deleting[comment.COMMENT_ID]}
                        style={{
                          backgroundColor: "#4CAF50",
                          border: "none",
                          borderRadius: "5px",
                          padding: "0.3rem 0.6rem",
                          color: "white",
                          cursor: deleting[comment.COMMENT_ID]
                            ? "not-allowed"
                            : "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.COMMENT_ID)}
                        disabled={deleting[comment.COMMENT_ID]}
                        style={{
                          backgroundColor: "#ff4d4d",
                          border: "none",
                          borderRadius: "5px",
                          padding: "0.3rem 0.6rem",
                          color: "white",
                          cursor: deleting[comment.COMMENT_ID]
                            ? "not-allowed"
                            : "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        {deleting[comment.COMMENT_ID]
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })
      ) : (
        <p style={{ fontSize: "0.8rem", color: "#aaa", margin: 0 }}>
          No comments yet
        </p>
      )}
    </div>
  );
}

export default CommentEdit;
