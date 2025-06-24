import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://13.202.22.78:3000/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch post data');
        return res.json();
      })
      .then((data) => {
        const postUserId = data.userId || data.POST_USER_ID;
        if (parseInt(userId, 10) !== postUserId) {
          throw new Error('Unauthorized to edit this post');
        }
        setPost(data);
        setFormData({ title: data.POST_TITLE || data.title, content: data.POST_CONTENT || data.content });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const savePost = (e) => {
    e.preventDefault();
    fetch(`http://13.202.22.78:3000/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        content: formData.content,
        userId: parseInt(userId, 10),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update post');
        return res.json();
      })
      .then(() => {
        navigate('/profile');
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <p>Loading post data...</p>;

  if (error)
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <p>Error: {error}</p>
        <button onClick={() => navigate('/profile')}>Back to Profile</button>
      </div>
    );

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
            required
            style={{ padding: '8px', width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
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
          onClick={() => navigate('/profile')}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditPostPage;
