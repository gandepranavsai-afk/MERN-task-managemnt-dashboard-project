import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "Dashboard"],
  ["/tasks", "Tasks"],
  ["/kanban", "Kanban"],
  ["/projects", "Projects"],
  ["/settings", "Settings"]
];

export const Sidebar = () => (
  <aside className="w-full md:w-64 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg">
    <h1 className="text-xl font-bold text-primary mb-6">TaskFlow</h1>
    <nav className="space-y-2">
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
