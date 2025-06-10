function NewPostModal({ newPost, onChange, onSubmit, onClose, error }) {
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '480px',
          color: 'white',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Create New Post</h2>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={newPost.title}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: '#333',
            border: 'none',
            color: 'white',
          }}
        />
        <textarea
          name="content"
          placeholder="Post Content"
          value={newPost.content}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '10px',
            height: '100px',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: '#333',
            border: 'none',
            color: 'white',
            resize: 'vertical',
          }}
        />
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#555',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            style={{
              backgroundColor: '#007bff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPostModal;
