import useLocalStorage from "../customHooks/useLocalStorage"
import TaskTable from "../components/TaskTable/TaskTable"
import "./scheduledPages.css"

export default function Bookmark() {
    const [tasks] = useLocalStorage("Kanban-tasks",[])
    const bookmarkedTasks = tasks.filter((t) => t.isBookmarked)
   return (
    <div className="scheduled-page">
        <h1 className="main-heading">Bookmarked</h1>
        <TaskTable tasks={bookmarkedTasks}/>
    </div>
  )
}