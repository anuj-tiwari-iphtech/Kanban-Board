import { HiOutlineSearch, HiOutlineCog, HiOutlineBell } from "react-icons/hi";
import profile from '../../assets/navbar.png'
import './navbar.css'
export default function Navbar() {
  return (
    <>
    <nav className="navbar">
        <div className="navbar-search">
        <HiOutlineSearch/>
        <input
            type="text"
            placeholder="Search"
        />
        </div>

        <div className="navbar-actions">
            <div className="navbar-icon">
                <HiOutlineCog/>
            </div>

            <div className="navbar-icon">
                <HiOutlineBell/>
            </div>

            <div className="navbar-profile">
                <img
                    src={profile}
                    alt = 'profile'
                />
            </div>
        </div>
    </nav>
    </>
  )
}