import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { fetchTasks } from "./features/tasks/taskSlice";
import { fetchNotifications } from "./features/notifications/notificationSlice";
import { fetchProjects } from "./features/projects/projectSlice";
import { useBootstrap } from "./hooks/useBootstrap";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import toast from "react-hot-toast";

export const AppLayout = () => {
  const [dark, setDark] = useState(false);
  const dispatch = useDispatch();
  useBootstrap();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) return undefined;

    const socket = io(socketUrl, {
      auth: { token: localStorage.getItem("taskflow_token") }
    });

    socket.on("task:created", () => {
      dispatch(fetchTasks());
      dispatch(fetchProjects());
      dispatch(fetchNotifications());
      toast("New task created in workspace");
    });

    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen p-4 bg-slate-100 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[16rem_1fr] gap-4">
          <Sidebar />
          <main>
            <Header onToggleTheme={() => setDark((s) => !s)} />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
