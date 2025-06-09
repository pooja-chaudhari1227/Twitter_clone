import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import PostCard from './PostCard';
import NewPostButton from './NewPostButton';
import NewPostModal from './NewPostModal';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [postError, setPostError] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(''); // For general errors

  const navigate = useNavigate();

  const toggleDeleted = () => {
    setDeleted((prev) => !prev); // Toggle deleted state to trigger re-render
  };

  useEffect(() => {
    fetchPosts();
  }, [deleted]); // Re-fetch posts when a comment is deleted

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:3000/api/posts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err.message);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
    setError(''); // Clear error on change
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) {
      setError('Comment cannot be empty!');
      return;
    }
    const userId = parseInt(localStorage.getItem('userId'), 10);
    if (!userId) {
      setError('You must be logged in to post a comment.');
      return;
    }

    const requestBody = { content, userId, postId };
    setCommentLoading((prev) => ({ ...prev, [postId]: true }));
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Comment submission failed');
      }

      await fetchPosts();
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Comment error:', err.message);
      setError(err.message || 'Failed to submit comment');
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleNewPostChange = (e) => {
    setNewPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPostError(''); // Clear error on change
  };

  const handlePostSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setPostError('Both title and content are required.');
      return;
    }

    const userId = parseInt(localStorage.getItem('userId'), 10);
    if (!userId) {
      setPostError('You must be logged in to create a post.');
      return;
    }

    const requestBody = { ...newPost, userId };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Post creation failed');
      }

      setShowModal(false);
      setNewPost({ title: '', content: '' });
      setPostError('');
      await fetchPosts();
    } catch (err) {
      console.error('Post error:', err.message);
      setPostError(err.message || 'Failed to create post');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        padding: '2rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
      }}
    >
      <button
        onClick={() => navigate('/profile')}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1001,
        }}
      >
        Profile
      </button>

      <div style={{
         display: 'flex',
         justifyContent: 'center',
        alignItems: 'center',
        }}>
        <img
          src="/image/_X_.jpg"
          alt="Small Image"
          style={{
          width: '50px', 
          height: '50px', 
          objectFit: 'cover',
          borderRadius: '8px', 
        }}
        />
      </div>

      {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.POST_ID}
            post={post}
            commentValue={newComments[post.POST_ID] || ''}
            commentLoading={commentLoading[post.POST_ID]}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
            fetchPosts={fetchPosts}
            toggleDeleted={toggleDeleted}
          />
        ))
      )}

      <NewPostButton onClick={() => setShowModal(true)} />

      {showModal && (
        <NewPostModal
          newPost={newPost}
          onChange={handleNewPostChange}
          onSubmit={handlePostSubmit}
          onClose={() => setShowModal(false)}
          error={postError}
        />
      )}
    </motion.div>
  );
}

export default HomePage;
