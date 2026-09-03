import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineCog, HiOutlineLogin, HiOutlineLogout, HiOutlineUserAdd, HiMenu, HiOutlineMail } from "react-icons/hi";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useAuthContext } from "../../auth/AuthContext";
import profile from '../../assets/avatar2.png';
import useClickOutside from "../../customHooks/useClickOutside";
import InviteModal from "../InviteModal/InviteModal";
import './navbar.css';

export default function Navbar({ toggleSidebar, searchTerm, setSearchTerm, onSearchSubmit, matchingTasks, showSuggestion, setShowSuggestion, onSelectSuggestion }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false)

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const {currentUser, loading} = useAuthContext();

  useClickOutside(profileRef, () => setShowProfileMenu(false));
  useClickOutside(searchRef, () => setShowSuggestion(false))

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
    } catch (error){
      console.error("Logout error:", error);
    }
  }

  return (
    <>
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar} type="button">
          <HiMenu />
        </button>
        <div className="navbar-search">
          <HiOutlineSearch className="search-icon" />
          <input 
          type="text" 
          placeholder="Search tasks or task ID (e.g. Task-011)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowSuggestion(true);
          }}
          // onFocus={()=>setShowSuggestion(true)}
          onKeyDown={(e) => {
            if(e.key == "Enter"){
              onSearchSubmit();
              setShowSuggestion(false);
            }
          }}
          />

          {showSuggestion && matchingTasks.length>0 && (
            <div className="search-suggestions">
              {matchingTasks.map((task) => (
                <button
                  key={task.id}
                  className="search-suggestion-item"
                  onClick={() => onSelectSuggestion(task)}
                >
                  <sapn className="suggestion-task-id">{task.id}</sapn>
                  <sapn className="suggestion-task-name">{task.name}</sapn>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-actions">

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <div className="navbar-profile" onClick={() => setShowProfileMenu((prev) => !prev)}>
            <img src={currentUser?.avatar || profile} alt="profile" />
          </div>

          {currentUser && showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                  <img src={currentUser?.avatar || profile} alt="profile" className="profile-menu-avatar"/>
                  <div>
                      <p className="profile-menu-name">{currentUser?.name || "Guest"}</p>
                      <p className="profile-menu-email">{currentUser?.email || "Not logged in"}</p>
                  </div>
              </div>

              <div className="profile-menu-divider" />

              {currentUser ? (
                  <>
                    <button className="profile-menu-item"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowInviteModal(true);
                      }}
                    >
                      <HiOutlineMail/> Invite User
                    </button>
                    <button className="profile-menu-item logout" onClick={handleLogout}>
                        <HiOutlineLogout/> Logout
                    </button>
                  </>
              ) : (
                  <>
                      <Link to="/login" className="profile-menu-item">
                          <HiOutlineLogin/> Login
                      </Link>
                      <Link to="sign-up" className="profile-menu-item">
                          <HiOutlineUserAdd/> Sign Up
                      </Link>
                  </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>

    {showInviteModal && (
      <InviteModal onClose={() => setShowInviteModal(false)}/>
    )}
    </>
  );
}