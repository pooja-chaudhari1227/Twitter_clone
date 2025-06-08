import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { username, email, password };
    console.log("Sending payload:", payload); // Debug: Log payload before sending

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", data); // Debug: Log server response

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Fetch error:", err); // Debug: Log fetch error
      setError("Could not connect to server.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: "20px", fontSize: "2rem" }}
      >
        Create Your Account
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
        />
        <button type="submit" style={buttonStyle}>
          Register
        </button>

        {error && <p style={{ color: "tomato" }}>{error}</p>}
      </motion.form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#4facfe", textDecoration: "underline" }}>
          Login
        </Link>
      </p>
    </motion.div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "white",
  color: "#4facfe",
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
};

export default RegisterPage;