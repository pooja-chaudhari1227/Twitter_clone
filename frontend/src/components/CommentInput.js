import { motion } from 'framer-motion';

function CommentInput({ postId, value, loading, onChange, onSubmit }) {

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        marginTop: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(postId, e.target.value)}
        placeholder="Add a comment..."
        style={{
          backgroundColor: '#333',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: '4px',
          padding: '0.5rem',
          resize: 'vertical',
          fontSize: '0.9rem',
        }}
        disabled={loading}
      />
      <button
        onClick={() => onSubmit(postId)}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#555' : '#007bff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </motion.div>
  );
}

export default CommentInput;