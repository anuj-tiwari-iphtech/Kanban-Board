import { HiOutlinePaperClip, HiOutlineChatAlt } from "react-icons/hi";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import "./TaskCard.css";

const priorityConfig = {
    High: { color: "#e5484d", icon: <HiArrowUp /> },
    Medium: { color: "#e99c00", icon: <HiArrowUp /> },
    Low: { color: "#16a34a", icon: <HiArrowDown /> },
  };

export default function TaskCard({task}) {
    const priority = priorityConfig[task.priority] || []
  return (
    <div className="task-card">
        <div className="task-card-header">
            <h4 className="task-name">{task.name}</h4>
            {task.priority && (
                <span className="task-priority" style={{color : priority.color}}>
                    {priority.icon}{task.priority}
                </span>
            )}
        </div>

        {task.image && (
            <div className="task-image-wrapper">
                <img src={task.image} alt={task.name}/>
            </div>
        )}

        {task.labels?.length > 0 && (
            <div className="task-labels">
                {task.labels.map((label, i) => (
                    <span key={i} className="task-label-pill">
                        {label}
                    </span>
                ))}
            </div>
        )}

        {task.dueDate && (
            <p className="task-due-date">Due Date : {task.dueDate}</p>
        )}

        <div className="task-card-footer">
            <div className="task-meta">
                <span className="task-meta-item">
                    <HiOutlinePaperClip/>{task.attachmentsCount}
                </span>
                <span>
                    <HiOutlineChatAlt/>{task.commentsCount}
                </span>
            </div>

            {task.assignee && (
                <img
                    src={task.assignee}
                    alt="assignee"
                    className="task-avatar"
                />
            )}
        </div>
    </div>
  )
}