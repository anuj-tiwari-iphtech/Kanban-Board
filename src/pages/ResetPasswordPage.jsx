import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { HiOutlineKey, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineLockClosed } from "react-icons/hi";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const oobCode = searchParams.get("oobCode");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("verifying"); 
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isVerifiedRef = useRef(false)

  useEffect(() => {
    if(isVerifiedRef.current) return;
    isVerifiedRef.current = true;

    if (!oobCode) {
      setStatus("invalid");
      setErrorMessage("Invalid or missing reset token.");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((userEmail) => {
        setEmail(userEmail);
        setStatus("valid");
      })
      .catch((error) => {
        console.error("Link verification failed:", error);
        setStatus("invalid");
        setErrorMessage("This link has expired or has already been used.");
      });
  }, [auth, oobCode]);

  // 2. Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        
        {/* State 1: Verifying Link Token */}
        {status === "verifying" && (
          <div className="status-box">
            <div className="spinner"></div>
            <h3>Verifying setup link...</h3>
            <p>Please wait while we validate your invitation link.</p>
          </div>
        )}

        {/* State 2: Invalid or Expired Link */}
        {status === "invalid" && (
          <div className="status-box error">
            <div className="icon-wrapper error-icon">
              <HiOutlineExclamationCircle />
            </div>
            <h2>Invalid or Expired Link</h2>
            <p>{errorMessage}</p>
            <Link to="/login" className="reset-btn">
              Back to Login
            </Link>
          </div>
        )}

        {/* State 3: Password Reset Successful */}
        {status === "success" && (
          <div className="status-box success">
            <div className="icon-wrapper success-icon">
              <HiOutlineCheckCircle />
            </div>
            <h2>Password Set Successfully!</h2>
            <p>Your password has been set. Redirecting to login in a few seconds...</p>
            <Link to="/login" className="reset-btn">
              Go to Login Now
            </Link>
          </div>
        )}

        {/* State 4: Valid Token — Show Form */}
        {status === "valid" && (
          <>
            <div className="reset-header">
              <div className="icon-wrapper header-icon">
                <HiOutlineKey />
              </div>
              <h2>Set Your Password</h2>
              <p>
                Setting up password for: <strong>{email}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="error-alert">
                <HiOutlineExclamationCircle />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="reset-form">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <HiOutlineLockClosed className="field-icon" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <HiOutlineLockClosed className="field-icon" />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? "Saving Password..." : "Set Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}