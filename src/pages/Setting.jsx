import ProfileCard from "../components/Profile/ProfileCard"
import { useAuthContext } from "../auth/AuthContext"

export default function Setting() {
  const {currentUser, setCurrentUser} = useAuthContext()
  return (
    <div className="setting-page">
      <h1 className="main-heading">Settings</h1>
      <ProfileCard currentUser={currentUser} setCurrentUser={setCurrentUser}/>

      <p className="contact-heading">For Any Queries</p>
      <div className="contact-details">
        <span className="contact-title">Contact Us : </span>
        <span className="contact-number">+91 7555755525</span>
      </div>
    </div>
  )
}