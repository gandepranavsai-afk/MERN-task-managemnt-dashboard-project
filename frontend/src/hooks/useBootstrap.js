import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../features/tasks/taskSlice";
import { fetchProjects } from "../features/projects/projectSlice";
import { fetchNotifications } from "../features/notifications/notificationSlice";

export const useBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchNotifications());
  }, [dispatch]);
};
