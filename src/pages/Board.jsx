import { useState } from "react"
import { HiPlus, HiOutlineCalendar, HiOutlineTrash } from "react-icons/hi"
import { useAlert } from "../components/AlertModal/AlertContext"
import CreateSprintModal from "../Sprints/CreateSprintModal"
import AddTaskToSprintModal from "../Sprints/AddTaskToSprintModal"
import TaskModal from "../components/AddTaskModal/Modal"
import TaskTable from "../components/TaskTable/TaskTable"
import { useAuthContext } from "../auth/AuthContext"
import useFirestoreCollection from "../Firebase/useFirestoreCollection"
import './board.css'

export default function Board() {

  const {currentUser} = useAuthContext();

  const {
    data: tasks,
    loading: taskLoading,
    add : addTask,
    update : updateTask,
    remove : deleteTask,
  } = useFirestoreCollection("tasks",currentUser?.id)
  
  const {
    data:columns,
    loading: columnLoading,
    add: addColumn,
    update: updateColumn,
    remove: deleteColumn,
  } = useFirestoreCollection("columns", currentUser?.id)

  const {
    data : sprints,
    loading : sprintsLoading,
    add : addSprint,
    update : updateSprint,
    remove : deleteSprint,
  } = useFirestoreCollection("sprints", currentUser?.id)

  const [activeTab , setActiveTab] = useState("backlog")
  const [showCreateSprint, setShowCreateSprint] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const {showAlert} = useAlert();

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }

  const assignTaskIds = sprints.flatMap((s) => s.taskIds)
  const backlogTasks = tasks.filter((t) => !assignTaskIds.includes(t.id))

  const activeSprint = sprints.find((s) => s.id === activeTab);
  const activeSprintTasks = activeSprint ? tasks.filter((t) => activeSprint.taskIds?.includes(t.id)) : [];

  const handleCreateSprint = async (name, startDate, endDate) => {
    try{
      const docRef = await addSprint({ name, startDate, endDate, taskIds:[]});
      setActiveTab(docRef.id);
      setShowCreateSprint(false);
      showAlert(`${name} created successfully`, "success");
    }catch(error){
      showAlert( "Failes to create sprint","error")
      console.error(error);
    }
  }

  const formatDate = (date) => {
    if (!date) return "";
  
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleTaskClick = (task) => {
    console.log("Task Clicked", task);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }

  const handleSaveTask = async(updatedTask) => {
      try {
        await updateTask(editingTask.id, updatedTask);
        showAlert("Updated successfully")
      } catch (error) {
        console.error(" Update FAILED:", error);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
  }

  const handleDeleteSprint = async (sprintId) => {
    try{
      await deleteSprint(sprintId);
      setActiveTab("backlog")
      showAlert("Spring deleted. Task moved back to backlog.", "warning");
    }catch(error){
      showAlert("Failed to delete sprint", "error");
      console.error(error);
    }
  }

  const handleAddTasksToSprint = async (taskIds) => {
    try{
      const currentSprint = sprints.find((s) => s.id === activeTab);
      const updatedTaskIds = [...(currentSprint.taskIds || []), ...taskIds];
      await updateSprint(activeTab, {taskIds: updatedTaskIds});
      setShowAddTaskModal(false);
    }catch(error){
      showAlert("Failed to add tasks", "error");
      console.error(error);
    }
  }

  const handleRemoveTaskFromSprint = async (taskId) => {
    try{
      const currentSprint = sprints.find((d) => d.id === activeTab);
      const updateTaskIds = currentSprint.taskIds.filter((id) => id !== taskId)
      await updateSprint(activeTab, {taskIds : updateTaskIds});
    }catch(error){
      showAlert("Failed to remove Task", "error");
      console.log(error);
    }
  }
  return (
    <>
      <div className="board-page">
        <div className="board-header">
          <h1 className="main-heading">Sprints</h1>
          <button className="action-btn" onClick={() => setShowCreateSprint(true)}>
            <HiPlus/> Create Sprint
          </button>
        </div>

        {showCreateSprint && (
          <CreateSprintModal
            onClose={() => setShowCreateSprint(false)}
            onCreate={handleCreateSprint}
          />
        )}

        <div className="sprint-tabs">
          {sprints.map((sprint) => (
            <button
              key={sprint.id}
              className={`sprint-tab ${activeTab === sprint.id ? "active" : ""}`}
              onClick={() => setActiveTab(sprint.id)}
            >
              {sprint.name}
            </button>
          ))}

          <button className={`sprint-tab ${activeTab === "backlog" ? "active" : ""}`}
            onClick={() => setActiveTab("backlog")}
          >
            Backlog
          </button>
        </div>


        {activeSprint && (
          <div className="sprint-info-bar">
            <span className="sprint-dates">
              <HiOutlineCalendar/> {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
            </span>
            <div className="buttons">
              <button className="sprint-add-task-btn" onClick={() => setShowAddTaskModal(true)}> 
                <HiPlus/> Add Task
              </button>
              <button className="sprint-delete-btn" onClick={() => handleDeleteSprint(activeSprint.id)}>
                <HiOutlineTrash/> Delete Sprint
              </button>
            </div>
          </div>
        )}

        <div className="sprint-task-list">
          <TaskTable 
            tasks={activeTab === "backlog" ? backlogTasks : activeSprintTasks}
            onEditTask={handleTaskClick}
            showRemove={activeTab !== "backlog"}          
            onRemove={handleRemoveTaskFromSprint}          
          />
        </div>

        
        {isTaskModalOpen && (
          <TaskModal
            onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
            onSave={handleSaveTask}
            editingTask={editingTask}
            columns={columns}
          />
        )}

        {showAddTaskModal && (
          <AddTaskToSprintModal
            availableTasks={backlogTasks}
            onClose={() => setShowAddTaskModal(false)}
            onAdd={handleAddTasksToSprint}
          />
        )}
      </div>
    </>
  )
}