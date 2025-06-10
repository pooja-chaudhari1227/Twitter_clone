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
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
  }, []);

  const toggleDeleted = () => {
    setDeleted((prev) => !prev);
  };

  useEffect(() => {
    fetchPosts();
  }, [deleted]);

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
    setError('');
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
    setPostError('');
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

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
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
      {/* Top Bar with Profile and Logout Buttons */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 1001,
        }}
      >
        {/* Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          style={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Go to profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="white"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      {/* Centered Logo or Image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

      {/* Error Message */}
      {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}

      {/* Posts */}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        [...posts]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((post) => (
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

      {/* New Post Button */}
      <NewPostButton onClick={() => setShowModal(true)} />

      {/* New Post Modal */}
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
