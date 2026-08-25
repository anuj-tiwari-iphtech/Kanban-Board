import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase";
import { useAlert } from "../components/AlertModal/AlertContext";
import { signOut } from "firebase/auth";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const {showAlert} = useAlert();

  const handleSubmit = async (e) => {
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

    setIsSubmitting(true);

   try {
    const userCredential = await createUserWithEmailAndPassword(auth, validEmail, validPassword)
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      name : validName,
      email: validEmail,
      avatar : generateAvatarUrl(validEmail),
      role : "admin",
    })

      await signOut(auth);
    showAlert("Account created successfully! Please Login", "success");
    navigate('/login')
   } catch (err) {
    console.error("SIGNUP ERROR:", err);
    console.error("ERROR CODE:", err.code);
    console.error("ERROR MESSAGE:", err.message);
  
    if (err.code === "auth/email-already-in-use") {
      setError("An account with this email already exists");
    } else if (err.code === "auth/weak-password") {
      setError("Password is too weak");
    } else if (err.code === "auth/invalid-email") {
      setError("Invalid email address");
    } else if (err.code === "permission-denied") {
      setError("Firestore permission denied. Check your Firestore rules.");
    } else {
      setError(err.message || "Something went wrong. Please try again");
    }
  } finally {
    setIsSubmitting(false);
  }

  }
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