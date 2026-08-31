import { useMemo } from "react";
import { useAuthContext } from "../auth/AuthContext";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import ReportPage from "../components/Report/ReportPage";

export default function ReportPageContainer() {
  const { currentUser } = useAuthContext();

  const userId = currentUser?.id;

  const { data: tasks, loading: tasksLoading } = useFirestoreCollection("tasks", userId, true);
  const { data: columns, loading: columnsLoading } = useFirestoreCollection("columns", userId, true);
  const { data: sprints, loading: sprintsLoading } = useFirestoreCollection("sprints", userId, true);

  const processedData = useMemo(() => {
    if (!tasks || !sprints) return { backlogTasks: [], tasksBySprint: {} };

    const backlog = tasks.filter((t) => !t.sprintId);

    const sprintMap = {};
    sprints.forEach((sprint) => {
      sprintMap[sprint.id] = tasks.filter((t) => t.sprintId === sprint.id);
    });

    return {
      backlogTasks: backlog,
      tasksBySprint: sprintMap,
    };
  }, [tasks, sprints]);

  if (!currentUser) {
    return (
      <div className="board-page">
        <p className="board-empty-text">Please log in to view the board.</p>
      </div>
    );
  }

  if (tasksLoading || columnsLoading || sprintsLoading) {
    return <div className="report-loader">Loading live analytics from Firebase...</div>;
  }

  return (
    <ReportPage
      tasks={tasks}
      columns={columns}
      sprints={sprints}
      backlogTasks={processedData.backlogTasks}
      tasksBySprint={processedData.tasksBySprint}
    />
  );
}