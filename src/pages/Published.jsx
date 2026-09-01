import { useState, useMemo } from "react"
import TaskTable from "../components/TaskTable/TaskTable"
import TaskModal from "../components/AddTaskModal/Modal"
import useFirestoreCollection from "../Firebase/useFirestoreCollection"
import { useAlert } from "../components/AlertModal/AlertContext"
import { useAuthContext } from "../auth/AuthContext"
import "./scheduledPages.css"

export default function Published() {
  const { currentUser } = useAuthContext();
  const { showAlert } = useAlert();

  const {
    data: tasks,
    loading: tasksLoading,
    update: updateTask,
  } = useFirestoreCollection("tasks", currentUser?.id, true);
  const { data: columns } = useFirestoreCollection("columns", currentUser?.id, true);
  const { data: sprints, loading: sprintsLoading } = useFirestoreCollection("sprints", currentUser?.id, true);

  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const completedSprints = useMemo(() => {
    return sprints.filter((sprint) => {
      const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
      return sprintTasks.length > 0 && sprintTasks.every((t) => t.status === "DONE");
    });
  }, [tasks, sprints]);

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      await updateTask(editingTask.id, updatedTask);
      showAlert("Task updated successfully", "success");
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);   // FIXED — pehle '.' tha ',' ki jagah, syntax error deta
      showAlert("Failed to update Task", "error");
    }
  };

  if (tasksLoading || sprintsLoading) {
    return <div className="scheduled-page">Loading published sprints.....</div>;
  }

  return (
    <div className="scheduled-page">
      <h1 className="main-heading">Published</h1>

      {completedSprints.length === 0 ? (
        <p className="scheduled-empty-text">No completed sprints yet.</p>
      ) : (
        completedSprints.map((sprint) => {
          const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);

          return (
            <div key={sprint.id} className="published-sprint-block">
              <h3 className="published-sprint-title">{sprint.name}</h3>
              <TaskTable tasks={sprintTasks} onEditTask={handleTaskClick} />
            </div>
          );
        })
      )}

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
  );
}