import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./ReportPage.css";

const STATUS_COLORS = {
  "TO DO": "#0ea5e9",
  "IN PROGRESS": "#f59e0b",
  REVIEW: "#8b5cf6",
  DONE: "#22c55e",
};

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};

export default function ReportPage({ tasks = [], columns = [] }) {
  // 1. Calculate Status Breakdown
  const statusData = useMemo(() => {
    const counts = {};

    // Initialize counts for configured columns
    columns.forEach((col) => {
      const title = col.title || col;
      counts[title] = 0;
    });

    tasks.forEach((task) => {
      const status = task.status || "TO DO";
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
      color: STATUS_COLORS[key] || "#64748b",
    }));
  }, [tasks, columns]);

  // 2. Calculate Priority Breakdown
  const priorityData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };

    tasks.forEach((task) => {
      const priority = task.priority || "Low";
      if (counts[priority] !== undefined) {
        counts[priority] += 1;
      }
    });

    return Object.keys(counts).map((key) => ({
      priority: key,
      count: counts[key],
      color: PRIORITY_COLORS[key],
    }));
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="report-page">
      <div className="report-header">
        <h2>Task Analytics & Reports</h2>
        <p>Real-time overview of task status and priority distribution</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Tasks</h4>
          <p className="kpi-value">{totalTasks}</p>
        </div>
        <div className="kpi-card">
          <h4>Completed</h4>
          <p className="kpi-value green">{completedTasks}</p>
        </div>
        <div className="kpi-card">
          <h4>Pending</h4>
          <p className="kpi-value orange">{pendingTasks}</p>
        </div>
        <div className="kpi-card">
          <h4>Completion Rate</h4>
          <p className="kpi-value blue">{completionRate}%</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tasks by Status</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="priority" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}