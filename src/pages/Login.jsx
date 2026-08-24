import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useLocalStorage from "../customHooks/useLocalStorage";
import "./Login.css";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Login({currentUser, setCurrentUser}) {
  const [users] = useLocalStorage("kanban-users", []);
  // const [currentUser, setCurrentUser] = useLocalStorage("kanban-current-user", null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if(currentUser){
      alert("User already Exists")
      return;
    }
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    const { email: validEmail, password: validPassword } = result.data;

    const matchedUser = users.find(
      (u) => u.email === validEmail && u.password === validPassword
    );

    if (!matchedUser) {
      setError("Invalid email & password");
      return;
    }

    setCurrentUser(matchedUser);
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon" />
        </div>

        <h1 className="login-title">Welcome to TaskFlow</h1>
        <p className="login-subtitle">Your Gateway to Intelligent Interaction</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="login-field-error">{fieldErrors.email}</p>
          )}

          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="login-field-error">{fieldErrors.password}</p>
          )}

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn">
            Submit
          </button>
        </form>

        <p className="login-footer-text">
          Don't have an account? <Link to="/sign-up" className="login-link">Sign up</Link>
        </p>

        <p className="login-demo-hint">
          Demo login: marilyn@demo.com / demo123
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