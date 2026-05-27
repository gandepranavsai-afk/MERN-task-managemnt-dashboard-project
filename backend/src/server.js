import "dotenv/config";
import express from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { initSocket } from "./sockets/index.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.set("io", io);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(apiLimiter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/tasks/:taskId/comments", commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
