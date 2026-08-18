import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");   

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon" />
        </div>

        <h1 className="login-title">Welcome to TaskFlow</h1>
        <p className="login-subtitle">Your Gateway to Intelligent Interaction</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-submit-btn">
            Submit
          </button>
        </form>

        <p className="login-footer-text">
          Don't have an account? <Link to="/sign-up" className="login-link">Sign up</Link>
        </p>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <button className="login-google-btn">
          <FcGoogle /> Google account
        </button>
      </div>

      <p className="login-terms">
        By clicking "Submit", you agree to TaskFlow's{" "}
        <span className="login-link">User Agreement</span>, and{" "}
        <span className="login-link">Privacy Policy</span>, we prioritize your
        privacy and trust, guiding you through innovative interactions while
        safeguarding your personal information
      </p>
    </div>
  );
}