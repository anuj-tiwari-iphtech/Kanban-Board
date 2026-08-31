import TaskTable from "../components/TaskTable/TaskTable"
import useFirestoreCollection from "../Firebase/useFirestoreCollection"
import { useAuthContext } from "../auth/AuthContext"

export default function Published() {
  const {currentUser} = useAuthContext()

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
    const publishedTasks = tasks.filter((t) => t.status === "DONE")
  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Published Tasks</h1>
        <TaskTable tasks={publishedTasks}/>
    </div>
  )
}