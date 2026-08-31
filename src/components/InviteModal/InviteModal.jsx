import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { inviteUser } from "../../Firebase/userServices";
import { useAlert } from "../AlertModal/AlertContext";
import "./InviteModal.css";

export default function InviteModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("restricted");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await inviteUser(email, role);
      showAlert("Invite sent successfully! The user will receive a setup email.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      showAlert(error.message || "Failed to invite user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Invite New User</h3>
          <HiOutlineX onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <form onSubmit={handleInvite}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>User Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="restricted">Restricted Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending Invite..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}