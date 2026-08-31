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

export default function ReportPage({
  tasks = [],
  columns = [],
  sprints = [],
  tasksBySprint = {},
  backlogTasks = [],
}) {
  // 1. Calculate Status Breakdown
  const statusData = useMemo(() => {
    const counts = {};

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

  // 3. Calculate Sprint Completion Analysis Data
  const sprintChartData = useMemo(() => {
    const data = sprints.map((sprint) => {
      const sprintTasksList = tasksBySprint[sprint.id] || [];
      const total = sprintTasksList.length;
      const completed = sprintTasksList.filter(
        (t) => t.status?.toUpperCase() === "DONE"
      ).length;
      const remaining = total - completed;
      const rate = total ? Math.round((completed / total) * 100) : 0;

      return {
        name: sprint.name || "Unnamed Sprint",
        completed,
        remaining,
        total,
        rate: `${rate}%`,
      };
    });

    // Add Backlog metrics if backlog tasks exist
    if (backlogTasks.length > 0) {
      const completedBacklog = backlogTasks.filter(
        (t) => t.status?.toUpperCase() === "DONE"
      ).length;
      const totalBacklog = backlogTasks.length;
      const rate = totalBacklog
        ? Math.round((completedBacklog / totalBacklog) * 100)
        : 0;

      data.push({
        name: "Backlog",
        completed: completedBacklog,
        remaining: totalBacklog - completedBacklog,
        total: totalBacklog,
        rate: `${rate}%`,
      });
    }

    return data;
  }, [sprints, tasksBySprint, backlogTasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="report-page">
      <div className="report-header">
        <h2>Task Analytics & Reports</h2>
        {/* <p>Real-time overview of sprint progress, task status, and priority distribution</p> */}
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
        {/* Sprint Completion Analysis Chart */}
        <div className="chart-card full-width">
          <h3>Sprint Completion Analysis</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sprintChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<SprintTooltip />} />
                <Legend />
                <Bar
                  dataKey="completed"
                  name="Completed Tasks"
                  fill="#22c55e"
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="remaining"
                  name="Remaining Tasks"
                  fill="#ef4444"
                  stackId="a"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Status Chart */}
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

        {/* Tasks by Priority Chart */}
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

// Custom Tooltip for Sprint Completion Chart
function SprintTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="sprint-tooltip">
        <p className="sprint-tooltip-title">{label}</p>
        <p style={{ color: "#22c55e" }}>
          Completed: <strong>{data.completed}</strong>
        </p>
        <p style={{ color: "#ef4444" }}>
          Remaining: <strong>{data.remaining}</strong>
        </p>
        <p>
          Total Tasks: <strong>{data.total}</strong>
        </p>
        <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "6px 0" }} />
        <p style={{ color: "#2563eb" }}>
          Completion Rate: <strong>{data.rate}</strong>
        </p>
      </div>
    );
  }
  return null;
}