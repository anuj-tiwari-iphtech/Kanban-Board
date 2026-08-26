import { useAuthContext } from "../auth/AuthContext";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import ReportPage from "../components/Report/ReportPage";

export default function ReportPageContainer() {
  const { currentUser } = useAuthContext();
  const userId = currentUser?.id;

  const { data: tasks, loading: tasksLoading } = useFirestoreCollection("tasks", userId);
  const { data: columns, loading: columnsLoading } = useFirestoreCollection("columns", userId);
  const { data: sprints, loading: sprintsLoading } = useFirestoreCollection("sprints", userId);

  if (tasksLoading || columnsLoading || sprintsLoading) {
    return <div className="report-loader">Loading live analytics from Firebase...</div>;
  }

  return (
    <ReportPage 
      tasks={tasks} 
      columns={columns} 
      sprints={sprints} 
    />
  );
}