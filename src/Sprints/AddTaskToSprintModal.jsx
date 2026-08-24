import { useState } from "react";
import { HiX } from "react-icons/hi";

export default function AddTaskToSprintModal({availableTasks, onClose, onAdd}) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (taskId) => {
        setSelectedIds((prev) => 
            prev.includes(taskId) ? prev.filter((id) => id!== taskId) :[...prev, taskId]
        )
    }

    const handleSubmit = () => {
        if (selectedIds.length === 0) return;
        onAdd(selectedIds)
    }

  return (
    <>
        <div className="column-modal-overlay" onClick={onClose}>
            <div className="column-modal" onClick={(e)=> e.stopPropagation()}>
                <div className="column-modal-header">
                    <h3>Add Tasks To Sprint</h3>
                    <HiX className="column-modal-close" onClick={onClose}/>
                </div>

                {availableTasks.length === 0 ? (
                    <p className="sprint-empty-text">No Tasks is available in backlog</p>
                ):(
                    <div className="task-picker-list">
                        {availableTasks.map((task) => (
                            <label key={task.id} className="task-pricker-item">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(task.id)}
                                    onChange={() => toggleSelect(task.id)}
                                />
                                <span>{task.name}</span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="column-modal-actions">
                    <button className="column-modal-cancel" onClick={onClose}>Cancel</button>
                    <button className="column-modal-confirm" onClick={handleSubmit}>Add {selectedIds.length > 0 ? `(${selectedIds.length})`: ""}</button>
                </div>
            </div>
        </div>
    </>
  )
}