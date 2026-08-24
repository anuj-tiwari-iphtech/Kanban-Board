import ProfileCard from "../components/Profile/ProfileCard"


export default function Setting({currentUser, setCurrentUser}) {
  return (
    <div className="setting-page">
      <h1 className="main-heading">Settings</h1>
      <ProfileCard currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  )
}