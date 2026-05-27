import { Project } from "../models/Project.js";

export const getProjects = async (req, res) => {
  let projects = await Project.find({
    archived: false,
    $or: [{ owner: req.user._id }, { members: req.user._id }]
  })
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  if (projects.length === 0) {
    const defaultProject = await Project.create({
      name: `${req.user.name.split(" ")[0]}'s Workspace`,
      description: "Your default project workspace",
      owner: req.user._id,
      members: [req.user._id]
    });
    projects = [defaultProject];
  }

  res.json({ projects });
};

export const createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, owner: req.user._id, members: [req.user._id, ...(req.body.members || [])] });
  res.status(201).json({ project });
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ project });
};

export const archiveProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
  res.json({ project });
};
