import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createTask, fetchTasks, updateTask } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";

export const TasksPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects.items);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    dispatch(fetchProjects()).then((res) => {
      const list = res.payload || [];
      if (list[0] && !projectId) setProjectId(list[0]._id);
    });
  }, [dispatch, projectId]);

  const filtered = useMemo(
    () => items.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const onCreate = async () => {
    if (!title.trim()) return toast.error("Enter a task title");
    if (!projectId) return toast.error("Select a project first");

    await dispatch(
      createTask({ title: title.trim(), project: projectId, priority: "medium" })
    ).unwrap();

    toast.success("Task created");
    setTitle("");
    dispatch(fetchTasks());
  };

  const projectLabel = (task) =>
    typeof task.project === "object" ? task.project?.name : "Unassigned project";

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="font-semibold">Create Task</h3>
        <div className="grid md:grid-cols-3 gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="px-3 py-2 rounded-xl border dark:bg-slate-800 dark:border-slate-700 md:col-span-1"
          />
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <button onClick={onCreate} className="px-4 py-2 rounded-xl bg-primary text-white">
            Add Task
          </button>
        </div>
        {projects.length === 0 && (
          <p className="text-sm text-amber-600">
            No projects found. Open the Projects page to create one, or refresh — a default workspace is created automatically.
          </p>
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks"
        className="px-3 py-2 rounded-xl border w-full dark:bg-slate-900 dark:border-slate-700"
      />

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="text-slate-500">No tasks found</p>
        ) : (
          filtered.map((task) => (
            <div key={task._id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-slate-500">
                    {task.status} • {task.priority} • {projectLabel(task)}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(updateTask({ id: task._id, payload: { status: "completed" } }))}
                  className="text-sm px-3 py-1 rounded-lg bg-emerald-500 text-white shrink-0"
                >
                  Done
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
