import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({column, count, children, onAddTask}){
    const {setNodeRef} = useDroppable({id: column.title})

    return(
        <div className="kanban-column" ref={setNodeRef}>
            <div className="column-header">
                <span className={`column-count ${column.color}`}>{count}</span>
                <span className={`column-title ${column.color}`}>{column.title}</span>
            </div>

            {children}
            <button className="board-add-button" onClick={onAddTask}> Add Task</button>
        </div>
    )
}