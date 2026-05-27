import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/client";
import { StatCard } from "../components/common/StatCard";
import { PriorityChart } from "../components/charts/PriorityChart";
import { fetchTasks } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";

const buildFallbackAnalytics = (tasks) => {
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status !== "completed").length;
  const overdue = tasks.filter(
    (t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;
  const total = tasks.length;

  const priorityMap = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});

  return {
    metrics: { total, completed, pending, overdue, users: 0 },
    byPriority: Object.entries(priorityMap).map(([_id, value]) => ({ _id, value })),
    productivityScore: total ? Math.round((completed / total) * 100) : 0,
    recentActivities: []
  };
};

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const tasks = useSelector((state) => state.tasks.items);
  const projects = useSelector((state) => state.projects.items);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError("");
      let taskList = [];

      try {
        const [loadedTasks] = await Promise.all([
          dispatch(fetchTasks()).unwrap(),
          dispatch(fetchProjects()).unwrap()
        ]);
        taskList = loadedTasks;
        const { data } = await api.get("/analytics");
        setAnalytics(data);
      } catch {
        setApiError("Could not reach the API. Showing data from your workspace cache.");
        setAnalytics(buildFallbackAnalytics(taskList));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const display = useMemo(
    () => analytics || buildFallbackAnalytics(tasks),
    [analytics, tasks]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const m = display.metrics;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name || "there"}</h2>
        <p className="text-violet-100 mt-1 text-sm">
          {projects.length} project{projects.length !== 1 ? "s" : ""} · {m.total} task{m.total !== 1 ? "s" : ""} in workspace
        </p>
      </div>

      {apiError && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          {apiError} Start the backend with <code className="font-mono">cd backend && npm run dev</code> and run{" "}
          <code className="font-mono">npm run seed</code> if the database is empty.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={m.total} />
        <StatCard title="Completed" value={m.completed} />
        <StatCard title="Pending" value={m.pending} />
        <StatCard title="Overdue" value={m.overdue} />
        <StatCard title="Productivity" value={`${display.productivityScore}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <PriorityChart data={display.byPriority?.length ? display.byPriority : [{ _id: "none", value: 1 }]} />
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-3">Recent Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks yet. Go to Tasks and click Add, or run the seed script.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.slice(0, 6).map((task) => (
                <li key={task._id} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>{task.title}</span>
                  <span className="text-slate-500 capitalize">{task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
