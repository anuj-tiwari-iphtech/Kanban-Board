import { useState } from "react";
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX, HiOutlineLockClosed } from "react-icons/hi";
import { useAlert } from "../AlertModal/AlertContext";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { db, auth } from "../../Firebase/firebase";
import "./ProfileCard.css";

const avatarOptions = [
  "warrior", "felix", "aneka", "midnight", "shadow", "luna",
];

export default function ProfileCard({ currentUser, setCurrentUser}) {

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

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showAlert("Name cannot be empty.", "warning");
      return;
    }

    try{
      const updates = {name : name.trim()}

      if(selectedAvatar){
        updates.avatar = selectedAvatar;
      }

      const updatedUser = { ...currentUser, ...updates };

      await updateDoc(doc(db, "users", currentUser.id), updates)

      setCurrentUser(updatedUser);
      setIsEditing(false);
      showAlert("Profile updated successfully!", "success")
    }catch(error){
      showAlert("Failed to update profile.", "error");
      console.error(error);
    }
      
  };

  const handleCancelEdit = () => {
    setName(currentUser.name);
    setSelectedAvatar(currentUser.avatar);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {

    if (!currentPassword.trim()) {   
      showAlert("Please enter your current password.", "warning");
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      showAlert("New password must be at least 6 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert("New password and confirm password do not match.", "warning");
      return;
    }

    try{
      const credentail = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credentail);
      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      showAlert("Password changed successfully!", "success");
    }catch(error){
      if(error.code === "auth/wrong-password" || error.code === "auth/invalid-credential"){
        showAlert("Current password is incorrect.", "error");
      }else{
        showAlert("Failed to change Password","error");
      }
      console.error(error);
    }
    
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