import useLocalStorage from "../customHooks/useLocalStorage"
import TaskTable from "../components/TaskTable/TaskTable";
import "./scheduledPages.css"

export default function TodayScheduled() {
    const [tasks] = useLocalStorage("Kanban-tasks", []);
    const scheduledTasks = tasks.filter((t) => t.isScheduled)

  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Today's Scheduled</h1>
        <TaskTable tasks={scheduledTasks}/>
    </div>
  )
}