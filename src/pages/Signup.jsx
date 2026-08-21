import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useLocalStorage from "../customHooks/useLocalStorage";
import "./Login.css";

const generateAvatarUrl = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const [users, setUsers] = useLocalStorage("kanban-users", []);
  const [currentUser, setCurrentUser] = useLocalStorage("kanban-current-user", null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = signUpSchema.safeParse({ name, email, password });

    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    const { name: validName, email: validEmail, password: validPassword } = result.data;

    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === validEmail.toLowerCase()
    );
    if (alreadyExists) {
      setError("An account with this email already exists");
      return;
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: validName,
      email: validEmail,
      password: validPassword,
      avatar: generateAvatarUrl(validEmail),
      role : "admin",
    };

    setUsers((prev) => [...prev, newUser]);
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon" />
        </div>

        <h1 className="login-title">Create your account</h1>
        <p className="login-subtitle">Start organizing your work today</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label className="login-label">Name</label>
          <input
            type="text"
            className="login-input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldErrors.name && (
            <p className="login-field-error">{fieldErrors.name}</p>
          )}

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="login-field-error">{fieldErrors.password}</p>
          )}

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn">
            Sign Up
          </button>
        </form>

        <p className="login-footer-text">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <button className="login-google-btn">
          <FcGoogle /> Google account
        </button>
      </div>

      <p className="login-terms">
        By clicking "Sign Up", you agree to TaskFlow's{" "}
        <span className="login-link">User Agreement</span>, and{" "}
        <span className="login-link">Privacy Policy</span>, we prioritize your
        privacy and trust, guiding you through innovative interactions while
        safeguarding your personal information
      </p>
    </div>
  );
}