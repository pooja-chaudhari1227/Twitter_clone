import React from 'react';
import CommentEdit from './CommentEdit'; // Adjust path if needed

function CommentSection({ comments, fetchPosts, postId }) {
  const [deletedComments, setDeletedComments] = React.useState(new Set());

  const toggleDeleted = () => {
    setDeletedComments(new Set()); // Reset or manage deleted state if needed
  };

  return (
    <CommentEdit
      comments={comments}
      fetchPosts={fetchPosts}
      toggleDeleted={toggleDeleted}
      postId={postId}
    />
  );
}

export default CommentSection;