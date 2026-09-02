import { useMemo, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import TaskTable from "../components/TaskTable/TaskTable";
import TaskModal from "../components/AddTaskModal/Modal";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import { useAlert } from "../components/AlertModal/AlertContext";
import "./scheduledPages.css"

export default function TodayScheduled() {
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

  const scheduledTasks = useMemo(() => {
    return tasks.filter((t) => t.isScheduled)
  },[tasks])

  const handleTaskClick =(task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }

  const handleSaveTask = async (updatedTask) => {
    console.log("click on Save")
    try{
      await updateTask(editingTask.id, updatedTask);
      showAlert("Task updated successfully", "success");
      setIsTaskModalOpen(false)
      setEditingTask(null)
    }catch(error){
      console.error("Failed to update task:", error);
      showAlert("Failed to update Task", "error")
    }
    
  } 

  if(tasksLoading){
    return <div className="scheduled-page">Loading scheduled tasks.....</div>
  }

  return (
    <div className="scheduled-page">
        <h1 className="main-heading">Today's Scheduled</h1>
        <TaskTable tasks={scheduledTasks} onEditTask={handleTaskClick}/>

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