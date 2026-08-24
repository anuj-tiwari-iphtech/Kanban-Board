import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineCog, HiOutlineBell, HiOutlineUser, HiOutlineLogin, HiOutlineLogout, HiOutlineUserAdd, HiMenu } from "react-icons/hi";
import profile from '../../assets/avatar2.png';
import useClickOutside from "../../customHooks/useClickOutside";
import './navbar.css';

export default function Navbar({ currentUser, setCurrentUser, toggleSidebar, searchTerm, setSearchTerm }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useClickOutside(profileRef, () => setShowProfileMenu(false));

  const handleLogout = () => {
    setCurrentUser(null);
    // setShowProfileMenu(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={toggleSidebar} type="button">
          <HiMenu />
        </button>
        <div className="navbar-search">
          <HiOutlineSearch className="search-icon" />
          <input 
          type="text" 
          placeholder="Search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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