import { useAuthContext } from "../auth/AuthContext";
import TaskTable from "../components/TaskTable/TaskTable";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import "./scheduledPages.css"

export default function TodayScheduled() {
  const {currentUser} = useAuthContext();

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }

  
  const {
    data: tasks,
    loading: taskLoading,
    add : addTask,
    update : updateTask,
    remove : deleteTask,
  } = useFirestoreCollection("tasks",currentUser?.id)
  
  const scheduledTasks = tasks.filter((t) => t.isScheduled)

  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Today's Scheduled</h1>
        <TaskTable tasks={scheduledTasks}/>
    </div>
  )
}