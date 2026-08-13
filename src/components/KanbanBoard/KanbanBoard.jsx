import "./KanbanBoard.css";

export default function KanbanBoard() {
  const columns = [
    {
      title: "TO DO",
      count: 2,
      color: "blue",
    },
    {
      title: "IN PROGRESS",
      count: 3,
      color: "yellow",
    },
    {
      title: "REVIEW",
      count: 2,
      color: "blue",
    },
    {
      title: "DONE",
      count: 1,
      color: "green",
    },
  ];

  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <div className="kanban-column" key={column.title}>

          <div className="column-header">
            <span className={`column-count ${column.color}`}>
              {column.count}
            </span>

            <span className={`column-title ${column.color}`}>
              {column.title}
            </span>
          </div>

        </div>
      ))}
    </div>
  );
}