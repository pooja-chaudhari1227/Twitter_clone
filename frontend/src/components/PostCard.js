import { motion } from 'framer-motion';
import CommentSection from './CommentSection';
import CommentInput from './CommentInput';


function PostCard({ post, commentValue, commentLoading, onCommentChange, onCommentSubmit,fetchPosts,toggleDeleted }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: '#1a1a1a',
        padding: '0.75rem 0.85rem',
        borderRadius: '10px',
        boxShadow: '0 0 8px rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
      }}
    >
      <p style={{ fontSize: '0.7rem', color: '#aaa', margin: 0 }}>
        <strong>Posted by:</strong> {post.User?.USER_USERNAME || 'Unknown User'}
      </p>
      <h3 style={{ fontSize: '1.25rem', margin: '0.1rem 0' }}>{post.POST_TITLE}</h3>
      <p style={{ fontSize: '0.95rem', margin: 0 }}>{post.POST_CONTENT}</p>
      <p style={{ fontSize: '0.65rem', color: '#aaa', margin: '0.2rem 0 0.1rem' }}>
        {new Date(post.POST_UPDATED_AT).toLocaleString()}
      </p>
      <CommentSection 
      comments={post.Comments}
      fetchPosts={fetchPosts}
      toggleDeleted={toggleDeleted} />
      <CommentInput
        postId={post.POST_ID}
        value={commentValue}
        loading={commentLoading}
        onChange={onCommentChange}
        onSubmit={onCommentSubmit}
      />
    </motion.div>
  );
}

export default PostCard;
