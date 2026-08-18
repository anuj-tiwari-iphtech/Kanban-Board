import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineCog, HiOutlineBell, HiOutlineUser, HiOutlineLogin, HiOutlineLogout, HiOutlineUserAdd } from "react-icons/hi";
import profile from '../../assets/navbar.png';
import useClickOutside from "../customHooks/useClickOutside";
import './navbar.css';

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useClickOutside(profileRef, () => setShowProfileMenu(false));

  return (
    <nav className="navbar">
      <div className="navbar-search">
        <HiOutlineSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" type="button">
          <HiOutlineCog />
        </button>

        <button className="navbar-icon" type="button">
          <HiOutlineBell />
        </button>

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <div className="navbar-profile" onClick={() => setShowProfileMenu((prev) => !prev)}>
            <img src={profile} alt="profile" />
          </div>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <img src={profile} alt="profile" className="profile-menu-avatar" />
                <div>
                  <p className="profile-menu-name">John Doe</p>
                  <p className="profile-menu-email">john@example.com</p>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <Link className="profile-menu-item">
                <HiOutlineUser /> Profile
              </Link>
              <Link to="/login"className="profile-menu-item">
                <HiOutlineLogin /> Login
              </Link>
              <Link to="/sign-up" className="profile-menu-item">
                <HiOutlineUserAdd /> Sign Up
              </Link>

              <div className="profile-menu-divider" />

              <button className="profile-menu-item logout">
                <HiOutlineLogout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}