import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createProject, fetchProjects } from "../features/projects/projectSlice";

export const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((state) => state.projects);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Project name is required");

    await dispatch(createProject(form)).unwrap();
    toast.success("Project created");
    setForm({ name: "", description: "" });
    setShowForm(false);
  };

  const refresh = () => dispatch(fetchProjects());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-slate-500">Organize tasks into workspaces</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm"
        >
          {showForm ? "Cancel" : "New Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2 dark:bg-slate-800 dark:border-slate-700"
            placeholder="Project name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full border rounded-xl px-3 py-2 dark:bg-slate-800 dark:border-slate-700"
            placeholder="Description (optional)"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm">
            Create Project
          </button>
        </form>
      )}

      {loading && <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />}

      {!loading && projects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-md">
          <p className="text-slate-500 mb-3">No projects yet. Create your first workspace.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-primary text-white text-sm">
            Create Project
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{project.description || "No description"}</p>
            <p className="text-xs text-slate-400 mt-3">
              {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      <button onClick={refresh} className="text-sm text-primary hover:underline">
        Refresh projects
      </button>
    </div>
  );
};
