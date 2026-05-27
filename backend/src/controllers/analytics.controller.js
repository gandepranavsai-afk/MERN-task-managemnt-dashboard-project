import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { ActivityLog } from "../models/ActivityLog.js";

export const getAnalytics = async (_req, res) => {
  const [total, completed, pending, overdue, users, activities] = await Promise.all([
    Task.countDocuments({ archived: false }),
    Task.countDocuments({ status: "completed", archived: false }),
    Task.countDocuments({ status: { $ne: "completed" }, archived: false }),
    Task.countDocuments({ status: { $ne: "completed" }, dueDate: { $lt: new Date() }, archived: false }),
    User.countDocuments(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(8).populate("actor", "name")
  ]);

  const byPriority = await Task.aggregate([
    { $match: { archived: false } },
    { $group: { _id: "$priority", value: { $sum: 1 } } }
  ]);

  res.json({
    metrics: { total, completed, pending, overdue, users },
    byPriority,
    productivityScore: total ? Math.round((completed / total) * 100) : 0,
    recentActivities: activities
  });
};
