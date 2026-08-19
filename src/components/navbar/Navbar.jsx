import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineCog, HiOutlineBell, HiOutlineUser, HiOutlineLogin, HiOutlineLogout, HiOutlineUserAdd } from "react-icons/hi";
import profile from '../../assets/avatar2.png';
import useClickOutside from "../../customHooks/useClickOutside";
import useLocalStorage from "../../customHooks/useLocalStorage";
import './navbar.css';

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useLocalStorage("kanban-current-user", null)
  const profileRef = useRef(null);

  useClickOutside(profileRef, () => setShowProfileMenu(false));

  const handleLogout = () => {
    setCurrentUser(null);
  }

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <HiOutlineSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="navbar-actions">
        <Link to="/setting" className="navbar-icon" type="button">
          <HiOutlineCog />
        </Link>

        <Link to="/indox" className="navbar-icon" type="button">
          <HiOutlineBell />
        </Link>

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <div className="navbar-profile" onClick={() => setShowProfileMenu((prev) => !prev)}>
            <img src={currentUser?.avatar || profile} alt="profile" />
          </div>

          {showProfileMenu && (
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
                  <button className="profile-menu-item logout" onClick={handleLogout}>
                      <HiOutlineLogout/> Logout
                  </button>
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
  );
}