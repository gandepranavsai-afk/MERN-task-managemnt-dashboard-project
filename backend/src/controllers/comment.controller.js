import { Comment } from "../models/Comment.js";

export const getComments = async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId }).populate("author", "name avatar").sort({ createdAt: 1 });
  res.json({ comments });
};

export const createComment = async (req, res) => {
  const comment = await Comment.create({ task: req.params.taskId, author: req.user._id, content: req.body.content, mentions: req.body.mentions || [] });
  const populated = await comment.populate("author", "name avatar");
  req.app.get("io").to(`task:${req.params.taskId}`).emit("comment:created", populated);
  res.status(201).json({ comment: populated });
};
