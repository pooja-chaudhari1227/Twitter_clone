function NewPostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        fontSize: '2rem',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,123,255,0.6)',
        zIndex: 1000,
      }}
      aria-label="Create new post"
    >
      +
    </button>
  );
}

export default NewPostButton;
