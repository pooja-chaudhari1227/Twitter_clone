import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError('User is not logged in');
      setLoadingUser(false);
      setLoadingPosts(false);
      return;
    }

    fetch(`http://13.202.22.78:3000/api/users/${userId}`)
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

    fetch(`http://13.202.22.78:3000/api/posts?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoadingPosts(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingPosts(false);
      });
  }, [userId]);

  const deletePost = (postId) => {
    fetch(`http://13.202.22.78:3000/api/posts/${postId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete post');
        setPosts((prevPosts) => prevPosts.filter((post) => post.POST_ID !== postId));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loadingUser || loadingPosts) return <p>Loading profile...</p>;

  if (error) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button
          onClick={() => navigate('/home')}
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
          Back to Home
        </button>
      </div>
    );
  }

  if (!user) return <p>User not found</p>;

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      maxWidth: '100vw',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    }}>
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
      <h2>Your Profile</h2>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '1rem 2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
      }}>
        <p><strong>Username:</strong> {user.USER_USERNAME}</p>
        <p><strong>Email:</strong> {user.USER_EMAIL}</p>
      </div>

      <h2>Your Posts</h2>

      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.POST_ID} style={{
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
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
                  backgroundColor: 'rgb(76, 175, 80)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'white',
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span role="img" aria-label="home">🏠</span>
        Back to Home
      </button>
    </div>
  );
}

export default ProfilePage;
