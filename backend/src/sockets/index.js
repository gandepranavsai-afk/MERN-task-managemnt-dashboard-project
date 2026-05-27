import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      return next();
    } catch {
      return next(new Error("Unauthorized socket"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.userId) io.emit("presence:update", { userId: socket.userId, online: true });

    socket.on("task:join", (taskId) => socket.join(`task:${taskId}`));
    socket.on("disconnect", () => {
      if (socket.userId) io.emit("presence:update", { userId: socket.userId, online: false });
    });
  });

  return io;
};
