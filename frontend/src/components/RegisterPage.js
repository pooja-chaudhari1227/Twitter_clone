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
    console.log("Sending payload:", payload);

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          backgroundColor: "#1e1e1e",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Added image at the top */}
        <img
          src="/image/_X_.jpg"
          alt="Register"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            alignSelf: "center",
            marginBottom: "1rem",
            borderRadius: "50%", // Circular image
          }}
        />

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Create Your Account
        </h2>

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

        {error && <p style={{ color: "tomato" }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          Register
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4facfe", textDecoration: "underline" }}
          >
            Login
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  background: "#2c2c2c",
  color: "white",
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
