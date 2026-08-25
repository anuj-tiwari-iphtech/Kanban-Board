import { useDroppable } from "@dnd-kit/core";
import { HiOutlineTrash } from "react-icons/hi";

export default function DroppableColumn({ column, count, children, onAddTask, onDeleteColumn }) {
    const { setNodeRef, isOver } = useDroppable({ 
        id: column.title 
    });

    return(
        <div className={`kanban-column ${isOver ? "drag-over" : ""}`} ref={setNodeRef}>
            <div className="column-header">
                <span className={`column-count ${column.color}`}>{count}</span>
                <span className={`column-title ${column.color}`}>{column.title}</span>
                <button className="column-delete-btn" onClick={onDeleteColumn}>
                    <HiOutlineTrash/>
                </button>
            </div>

            {children}
            <button className="board-add-button" onClick={onAddTask}>Add Task</button>
        </div>
    );
}