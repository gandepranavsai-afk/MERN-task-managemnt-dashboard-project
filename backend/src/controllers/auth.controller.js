import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { signToken } from "../utils/jwt.js";

const createDefaultProject = async (user) =>
  Project.create({
    name: `${user.name.split(" ")[0]}'s Workspace`,
    description: "Your default project workspace",
    owner: user._id,
    members: [user._id]
  });

const pickUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio
});

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: role || "member" });
  await createDefaultProject(user);
  const token = signToken(user._id);
  res.status(201).json({ token, user: pickUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user._id);
  res.json({ token, user: pickUser(user) });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user: pickUser(user) });
};

export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, bio, avatar }, { new: true });
  res.json({ user: pickUser(user) });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: "Current password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If account exists, reset link sent" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
  await user.save();

  res.json({ message: "Use this demo reset token", token });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
