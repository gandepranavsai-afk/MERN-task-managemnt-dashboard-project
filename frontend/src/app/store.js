import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/auth/authSlice";
import tasks from "../features/tasks/taskSlice";
import projects from "../features/projects/projectSlice";
import notifications from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: { auth, tasks, projects, notifications }
});
