import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Use named hook
import "../styles/components.css";
import "../index.css";

const Login = () => {
  const { login } = useAuth(); // access login from context
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form.email, form.password);
      if (res?.token) {
        navigate("/home");
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">SyncHub</h1>
        <p className="subtitle">Connect. Collaborate. Create.</p>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="link text-sky-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="login-background">
        <div className="overlay"></div>
        <h2 className="slogan">Find the right tech talent. Anywhere.</h2>
      </div>
    </div>
  );
};

export default Login;
