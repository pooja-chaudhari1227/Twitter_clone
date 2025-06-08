import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'black',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}
      >
        It's X, Welcome to the World!
      </motion.h1>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ fontSize: '1.2rem', marginBottom: '2rem' }}
      >
        See what's happening in the world right now.
      </motion.p>

      <motion.img
        src="/image/_X_.jpg"
        alt="Welcome Image"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{
          width: '200px',
          height: '100px',
          borderRadius: '8px',
          marginBottom: '2rem',
          objectFit: 'cover'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <Link
          to="/login"
          style={{
            backgroundColor: 'white',
            color: '#4facfe',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            backgroundColor: 'white',
            color: '#4facfe',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
        >
          Register
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;
