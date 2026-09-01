import ProfileCard from "../components/Profile/ProfileCard"
import { useAuthContext } from "../auth/AuthContext"

export default function Setting() {
  const {currentUser, setCurrentUser} = useAuthContext()
  return (
    <div>
      <ProfileCard currentUser={currentUser} setCurrentUser={setCurrentUser}/>
    </div>
  )
}