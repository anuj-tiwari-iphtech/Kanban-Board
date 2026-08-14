import "./KanbanBoard.css";
import TaskCard from "./TaskCard";
export default function KanbanBoard({tasks}) {
  const columns = [
    {title: "TO DO",count: 1,color: "blue",},
    {title: "IN PROGRESS",count: 2,color: "yellow",},
    {title: "REVIEW",count: 3,color: "blue",},
    {title: "DONE",count: 4,color: "green",},
  ];

  return (
    <div className="kanban-board">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.title);

        return (
          <div className="kanban-column" key={column.title}>
            <div className="column-header">
              <span className={`column-count ${column.color}`}>
                {columnTasks.length}
              </span>
              <span className={`column-title ${column.color}`}>
                {column.title}
              </span>
            </div>

            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        );
      })}
    </div>
  );
}