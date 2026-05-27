import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: Date,
    labels: [String],
    attachments: [{ url: String, publicId: String, resourceType: String }],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subtasks: [{ title: String, completed: { type: Boolean, default: false } }],
    progress: { type: Number, default: 0 },
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    archived: { type: Boolean, default: false },
    aiSuggestion: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
