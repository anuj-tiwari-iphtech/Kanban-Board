import useLocalStorage from "../customHooks/useLocalStorage"
import TaskTable from "../components/TaskTable/TaskTable"


export default function Published() {
    const [tasks] = useLocalStorage("Kanban-tasks", []);
    const publishedTasks = tasks.filter((t) => t.status === "DONE")
  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Published Tasks</h1>
        <TaskTable tasks={publishedTasks}/>
    </div>
  )
}