import { useState } from "react";
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX, HiOutlineLockClosed } from "react-icons/hi";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { useAlert } from "../AlertModal/AlertContext";
import "./ProfileCard.css";

const avatarOptions = [
  "warrior", "felix", "aneka", "midnight", "shadow", "luna",
];

export default function ProfileCard({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useLocalStorage("kanban-users", []);
  const { showAlert } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || "");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!currentUser) {
    return (
      <div className="profile-card">
        <p className="profile-empty-text">You're not logged in.</p>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!name.trim()) {
      showAlert("Name cannot be empty.", "warning");
      return;
    }

    const updatedUser = { ...currentUser, name: name.trim(), avatar: selectedAvatar };

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setIsEditing(false);
    showAlert("Profile updated successfully!", "success");
  };

  const handleCancelEdit = () => {
    setName(currentUser.name);
    setSelectedAvatar(currentUser.avatar);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (currentPassword !== currentUser.password) {
      showAlert("Current password is incorrect.", "error");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      showAlert("New password must be at least 4 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirm password do not match.", "warning");
      return;
    }

    const updatedUser = { ...currentUser, password: newPassword };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    showAlert("Password changed successfully!", "success");
  };

  return (
    <div className="profile-card-center">
        
    
    <div className="profile-card">
      <div className="profile-card-header">
        <h3>My Profile</h3>
        {!isEditing && (
          <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
            <HiOutlinePencil /> Edit
          </button>
        )}
      </div>

      <div className="profile-avatar-section">
        <img src={isEditing ? selectedAvatar : currentUser.avatar} alt={currentUser.name} className="profile-avatar-large" />
        {isEditing && (
          <div className="avatar-options">
            {avatarOptions.map((seed) => {
              const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
              return (
                <img
                  key={seed}
                  src={url}
                  alt={seed}
                  className={`avatar-option ${selectedAvatar === url ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(url)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="profile-field">
        <label>Name</label>
        {isEditing ? (
          <input
            type="text"
            className="profile-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p>{currentUser.name}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Email</label>
        <p>{currentUser.email}</p>
        <span className="profile-field-hint">Email cannot be changed</span>
      </div>

      <div className="profile-field">
        <label>Role</label>
        <p className="profile-role-badge">{currentUser.role || "member"}</p>
      </div>

      {isEditing && (
        <div className="profile-edit-actions">
          <button className="profile-cancel-btn" onClick={handleCancelEdit}>
            <HiOutlineX /> Cancel
          </button>
          <button className="profile-save-btn" onClick={handleSaveProfile}>
            <HiOutlineCheck /> Save Changes
          </button>
        </div>
      )}

      <div className="profile-divider" />

      {!isChangingPassword ? (
        <button className="profile-password-toggle" onClick={() => setIsChangingPassword(true)}>
          <HiOutlineLockClosed /> Change Password
        </button>
      ) : (
        <div className="profile-password-section">
          <label>Current Password</label>
          <input
            type="password"
            className="profile-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label>New Password</label>
          <input
            type="password"
            className="profile-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            className="profile-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="profile-edit-actions">
            <button
              className="profile-cancel-btn"
              onClick={() => {
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              <HiOutlineX /> Cancel
            </button>
            <button className="profile-save-btn" onClick={handleChangePassword}>
              <HiOutlineCheck /> Update Password
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}