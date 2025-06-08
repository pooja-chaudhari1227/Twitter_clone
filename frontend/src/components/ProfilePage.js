import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null); // Track post being edited
  const [formData, setFormData] = useState({ title: '', content: '' }); // Form state

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL for editing

  useEffect(() => {
    if (!userId) {
      setError('User is not logged in');
      setLoadingUser(false);
      setLoadingPosts(false);
      return;
    }

    // Fetch user info
    fetch(`http://localhost:3000/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingUser(false);
      });

    // Fetch user's posts
    fetch(`http://localhost:3000/api/posts?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoadingPosts(false);
        // If editing, find the post to edit
        if (id) {
          const postToEdit = data.find((post) => post.POST_ID === parseInt(id));
          if (postToEdit) {
            setEditingPost(postToEdit);
            setFormData({ title: postToEdit.POST_TITLE, content: postToEdit.POST_CONTENT });
          } else {
            setError('Post not found');
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoadingPosts(false);
      });
  }, [userId, id]);

  // Delete post
  const deletePost = (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete post');
        setPosts((prevPosts) => prevPosts.filter((post) => post.POST_ID !== postId));
        if (editingPost && editingPost.POST_ID === postId) {
          setEditingPost(null); // Clear edit mode if deleted
          navigate('/profile'); // Redirect to profile
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited post
  const savePost = (e) => {
    e.preventDefault();
    if (!editingPost) {
      setError('No post selected for editing');
      return;
    }

    fetch(`http://localhost:3000/api/posts/${editingPost.POST_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        POST_TITLE: formData.title,
        POST_CONTENT: formData.content,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update post');
        return res.json();
      })
      .then((updatedPost) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.POST_ID === updatedPost.POST_ID ? updatedPost : post
          )
        );
        setEditingPost(null); // Exit edit mode
        navigate('/profile'); // Redirect to profile
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loadingUser || loadingPosts) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#000',
          color: '#fff',
          minHeight: '100vh',
          maxWidth: '900px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Back to Profile
        </button>
      </div>
    );
  }

  if (!user) {
    return <p>User not found</p>;
  }

  // If editing a post, show the edit form
  if (id && !editingPost) {
    return (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#000',
          color: '#fff',
          minHeight: '100vh',
          maxWidth: '900px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p>Post not found</p>
        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Back to Profile
        </button>
      </div>
    );
  }

  if (editingPost) {
    return (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#000',
          color: '#fff',
          minHeight: '100vh',
          maxWidth: '900px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h1>Edit Post</h1>
        <form onSubmit={savePost}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%', marginBottom: '1rem' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              navigate('/profile');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  // Default profile view
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Your Profile</h1>

      <div
        style={{
          backgroundColor: '#1a1a1a',
          padding: '1rem 2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        <p><strong>Username:</strong> {user.USER_USERNAME}</p>
        <p><strong>Email:</strong> {user.USER_EMAIL}</p>
        <p><strong>Password:</strong> {'*'.repeat(8)}</p>
      </div>

      <h2>Your Posts</h2>

      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.POST_ID}
            style={{
              backgroundColor: '#222',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h3>{post.POST_TITLE}</h3>
            <p>{post.POST_CONTENT}</p>
            <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
              Updated at: {new Date(post.POST_UPDATED_AT).toLocaleString()}
            </p>

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => navigate(`/edit-post/${post.POST_ID}`)}
                style={{
                  marginRight: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#000',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.POST_ID)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate('/home')}
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default ProfilePage;