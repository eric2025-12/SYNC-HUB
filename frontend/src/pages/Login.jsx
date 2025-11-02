import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/components.css";
import "../index.css";

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (success) navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">SyncHub</h1>
        <p className="subtitle">Connect. Collaborate. Create.</p>

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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/register" className="link">
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
