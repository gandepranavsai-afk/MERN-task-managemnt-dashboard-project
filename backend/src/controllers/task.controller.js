import { Task } from "../models/Task.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { createNotification } from "../services/notification.service.js";

const suggestionFromText = (text = "") => {
  if (/urgent|blocker|critical/i.test(text)) return "high";
  if (/later|someday/i.test(text)) return "low";
  return "medium";
};

export const getTasks = async (req, res) => {
  const { status, priority, search, assignee, project, sortBy = "createdAt" } = req.query;
  const q = { archived: false };
  if (status) q.status = status;
  if (priority) q.priority = priority;
  if (project) q.project = project;
  if (assignee) q.assignees = assignee;
  if (search) q.title = { $regex: search, $options: "i" };

  const tasks = await Task.find(q)
    .populate("assignees", "name email")
    .populate("project", "name")
    .sort({ [sortBy]: -1 });

  res.json({ tasks });
};

export const createTask = async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    aiSuggestion: suggestionFromText(req.body.description)
  };

  if (!payload.priority || payload.priority === "medium") {
    payload.priority = payload.aiSuggestion;
  }

  let task = await Task.create(payload);
  task = await task.populate("project", "name");
  await ActivityLog.create({
    actor: req.user._id,
    action: "created task",
    entity: "task",
    entityId: task._id,
    metadata: { title: task.title }
  });

  if (task.assignees?.length) {
    await Promise.all(
      task.assignees.map((userId) =>
        createNotification(userId, "assignment", `You were assigned task: ${task.title}`, `/tasks/${task._id}`)
      )
    );
  }

  const io = req.app.get("io");
  io.emit("task:created", task);

  res.status(201).json({ task });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  let task = await Task.findByIdAndUpdate(id, req.body, { new: true })
    .populate("project", "name")
    .populate("assignees", "name email");
  if (!task) return res.status(404).json({ message: "Task not found" });

  const io = req.app.get("io");
  io.emit("task:updated", task);

  res.json({ task });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  req.app.get("io").emit("task:deleted", { id });
  res.json({ message: "Task deleted" });
};

export const exportTasksCsv = async (_req, res) => {
  const tasks = await Task.find().select("title status priority dueDate progress");
  const header = "Title,Status,Priority,DueDate,Progress\n";
  const rows = tasks
    .map((t) => `${t.title},${t.status},${t.priority},${t.dueDate?.toISOString() || ""},${t.progress}`)
    .join("\n");

  res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
  res.type("text/csv").send(header + rows);
};
