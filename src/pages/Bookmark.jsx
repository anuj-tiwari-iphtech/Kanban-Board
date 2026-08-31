import TaskTable from "../components/TaskTable/TaskTable"
import "./scheduledPages.css"
import { useAuthContext } from "../auth/AuthContext"
import useFirestoreCollection from "../Firebase/useFirestoreCollection"

export default function Bookmark() {
  const {currentUser} = useAuthContext()

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }


  const {data: tasks} = useFirestoreCollection("tasks",currentUser?.id)
    
  const bookmarkedTasks = tasks.filter((t) => t.isBookmarked)
   return (
    <div className="scheduled-page">
        <h1 className="main-heading">Bookmarked</h1>
        <TaskTable tasks={bookmarkedTasks}/>
    </div>
  )
}