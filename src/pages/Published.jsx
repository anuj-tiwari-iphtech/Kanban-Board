import { useState, useMemo } from "react"
import TaskTable from "../components/TaskTable/TaskTable"
import TaskModal from "../components/AddTaskModal/Modal"
import useFirestoreCollection from "../Firebase/useFirestoreCollection"
import { useAlert } from "../components/AlertModal/AlertContext"
import { useAuthContext } from "../auth/AuthContext"

export default function Published() {
  const {currentUser} = useAuthContext();
  const {showAlert} = useAlert()

  const {
    data: tasks,
    loading: tasksLoading,
    update: updateTask,
  } = useFirestoreCollection("tasks",currentUser?.id, true)
  const {data: columns} = useFirestoreCollection("columns", currentUser?.id,true);
  const {data: sprints} = useFirestoreCollection("sprints", currentUser?.id, true);

  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const publishedTasks = useMemo(() => {
   return tasks.filter((t) => t.status === "DONE")
  },[tasks])

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }

  const handleTaskClick =(task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }

  const handleSaveTask = async (updatedTask) => {
    try{
      await updateTask(editingTask.id, updatedTask);
      showAlert("Task updated successfully", "success");
      setIsTaskModalOpen(false)
      setEditingTask(null)
    }catch(error){
      console.error("Failed to update task:". error);
      showAlert("Failed to update Task", "error")
    }
  } 

  if(tasksLoading){
    return <div className="scheduled-page">Loading scheduled tasks.....</div>
  }

  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Published Tasks</h1>
        <TaskTable tasks={publishedTasks} onEditTask={handleTaskClick}/>

        {isTaskModalOpen && (
          <TaskModal
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            onSave={handleSaveTask}
            editingTask={editingTask}
            columns={columns}
            sprints={sprints}
          />
        )}
    </div>
  )
}