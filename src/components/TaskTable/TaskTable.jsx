import { HiOutlineChevronRight } from "react-icons/hi";
import { priorityConfig } from "../KanbanBoard/TaskCard";
import "./TaskTable.css";

const statusColorMap = {
  "TO DO": { bg: "#eceef1", color: "#565e6c" },
  "IN PROGRESS": { bg: "#fff4d6", color: "#e99c00" },
  "REVIEW": { bg: "#e6f5fc", color: "#159bd7" },
  "DONE": { bg: "#e8f8ed", color: "#16a34a" },
};

export default function TaskTable({ 
  tasks = [], 
  onEditTask, 
  onRemove, 
  showRemove,
  selectable = false,        
  selectedIds = [],           
  onToggleSelect,             
}) {
  if (!tasks || tasks.length === 0) {
    return <p className="task-table-empty">No tasks to show.</p>;
  }

  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));

  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
          {selectable && (
            <th className="task-table-checkbox-col"></th> )}  
            <th>Summary</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Due date</th>
            <th>Priority</th>
            {showRemove && <th></th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const statusStyle = statusColorMap[task.status] || { bg: "#eceef1", color: "#565e6c" };
            const priorityStyle = priorityConfig[task.priority] || {};
            const isChecked = selectedIds.includes(task.id);

            return (
              <tr 
                key={task.id} 
                className={`task-table-row ${isChecked ? "row-selected" : ""}`}
                onClick={() => onEditTask(task)}
              >
                {selectable && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelect(task.id)}
                    />
                  </td>
                )}
                <td className="task-table-summary">
                  <HiOutlineChevronRight className="row-chevron" />
                  {task.name}
                </td>
                <td>
                  <span
                    className="task-table-status-pill"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  {task.assignee ? (
                    <div className="task-table-assignee">
                      <img src={task.assignee.avatar} alt={task.assignee.name} />
                      <span>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="task-table-empty-cell">—</span>
                  )}
                </td>
                <td className="task-table-duedate">{task.dueDate || "—"}</td>
                <td>
                  {task.priority ? (
                    <span className="task-table-priority" style={{ color: priorityStyle.color }}>
                      {priorityStyle.icon} {task.priority}
                    </span>
                  ) : (
                    <span className="task-table-empty-cell">—</span>
                  )}
                </td>
                {showRemove && (
                  <td>
                    <button
                      className="task-table-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(task.id);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}