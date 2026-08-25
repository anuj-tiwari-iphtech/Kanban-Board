import { useState } from "react"
import { HiPlus, HiOutlineCalendar, HiOutlineTrash } from "react-icons/hi"
import useLocalStorage from "../customHooks/useLocalStorage"
import { useAlert } from "../components/AlertModal/AlertContext"
import CreateSprintModal from "../Sprints/CreateSprintModal"
import AddTaskToSprintModal from "../Sprints/AddTaskToSprintModal"
import TaskModal from "../components/AddTaskModal/Modal"
import TaskTable from "../components/TaskTable/TaskTable"
import './board.css'

export default function Board({currentUser}) {

  const [sprints, setSprints] = useLocalStorage("kanban-sprints", []);
  const [tasks] = useLocalStorage("Kanban-tasks", [])
  const [columns] = useLocalStorage("kanban-columns", []);
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

  const handleCreateSprint = (name, startDate, endDate) => {
    const newSprint = {
      id : `sprint_${Date.now()}`,
      name,
      startDate,
      endDate,
      taskIds: [],
    }
    setSprints((prev) => [...prev, newSprint])
    setActiveTab(newSprint.id);
    setShowCreateSprint(false);
    showAlert(`${name} create Successfully`, "success")
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
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }

  const handleSaveTask = (updatedTask) => {
    setTasks((prev) => 
    prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    )
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteSprint = (sprintId) => {
    setSprints((prev) => prev.filter((s) => s.id !== sprintId))
    setActiveTab("backlog");
    showAlert("Sprint deleted. Tasks moved back to backlog.", "warning")
  }

  const handleAddTasksToSprint = (taskIds) => {
    setSprints((prev) => 
      prev.map((s) => 
        s.id === activeTab ? {...s, taskIds : [...s.taskIds || [], ...taskIds]} : s
      )
    )
    setShowAddTaskModal(false)
  }

  const handleRemoveTaskFromSprint =(taskId) => {
    setSprints((prev) => 
      prev.map((s) => 
        s.id === activeTab ? {...s, taskIds : s.taskIds.filter((id) => id !== taskId)} : s
      )
    )
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