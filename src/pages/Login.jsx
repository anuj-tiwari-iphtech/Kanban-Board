import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase";
import { useAlert } from "../components/AlertModal/AlertContext";
import useLocalStorage from "../customHooks/useLocalStorage";
import "./Login.css";
import { useAuthContext } from "../auth/AuthContext";

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

export default function Login() {
  // const [users] = useLocalStorage("kanban-users", []);

  const {currentUser} = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const {showAlert} = useAlert()

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    
    if(currentUser){
      showAlert("You are already logged in." , "info")
      return;
    }

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

    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        validEmail,
        validPassword
      );

      const firebaseUser = userCredential.user;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setError("User profile not found.");
        return;
      }

      const userData = userDoc.data();

      const loggedInUser = {uid: firebaseUser.uid,...userData,};

      showAlert("Login successful!", "success");
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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