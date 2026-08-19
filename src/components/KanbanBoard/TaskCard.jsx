import { HiOutlinePaperClip, HiOutlineChatAlt } from "react-icons/hi";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";

export const priorityConfig = {
    High: { color: "#e5484d", icon: <HiArrowUp /> },
    Medium: { color: "#e99c00", icon: <HiArrowUp /> },
    Low: { color: "#16a34a", icon: <HiArrowDown /> },
};

export default function TaskCard({task,isOverlay}) {
    const priority = priorityConfig[task.priority] || [];

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id : task.id, disabled: isOverlay})

    const style = {
        transfrom: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,

    }
  return (
    <div className={`task-card ${isOverlay ? "overlay" : ""} ${isDragging ? "dragging" : ""}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
    >
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
                <img src={task.image} alt={task.name} className="task-image"/>
            </div>
        )}

        {task.labels?.length > 0 && (
            <div className="task-labels">
                {task.labels.map((label, i) => (
                    <span
                        key={i}
                        className="task-label-pill"
                        style={{ color: label.color, backgroundColor: label.bg }}
                    >
                        {label.name}
                    </span>
                ))}
            </div>
        )}

        {task.description && (
            <p className="task-description">{task.description}</p>
        ) }

        {task.dueDate && (
            <p className="task-due-date">Due Date : {task.dueDate}</p>
        )}

        <div className="task-card-footer">
            <div className="task-meta">
                <span className="task-meta-item">
                    <HiOutlinePaperClip/>{task.attachmentsCount}
                </span>
                <span className="task-meta-item">
                    <HiOutlineChatAlt/>{task.commentsCount}
                </span>
            </div>

            {task.assignee && (
                <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="task-avatar"
                />
            )}
        </div>
    </div>
  )
}