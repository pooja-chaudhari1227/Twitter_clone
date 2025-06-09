import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/users');
      const users = await res.json();

      const matchedUser = users.find(user =>
        user.USER_USERNAME === formData.username &&
        user.USER_PASSWORD === formData.password
      );

      if (matchedUser) {
        // ✅ Store user info in localStorage
        localStorage.setItem('userId', matchedUser.USER_ID);
        localStorage.setItem('username', matchedUser.USER_USERNAME);

        // alert('Login successful!');
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        background: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px'
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: '#1e1e1e',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 0 10px rgba(255,255,255,0.1)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '6px',
            border: 'none',
            background: '#2c2c2c',
            color: 'white'
          }}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '6px',
            border: 'none',
            background: '#2c2c2c',
            color: 'white'
          }}
        />

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'white',
            color: '#4facfe',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </motion.form>
    </motion.div>
  );
}

export default LoginPage;
