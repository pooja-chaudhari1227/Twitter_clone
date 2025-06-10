import React from 'react';
import CommentEdit from './CommentEdit'; 

function CommentSection({ comments, fetchPosts, postId }) {
  const [deletedComments, setDeletedComments] = React.useState(new Set());

  const toggleDeleted = () => {
    setDeletedComments(new Set()); 
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