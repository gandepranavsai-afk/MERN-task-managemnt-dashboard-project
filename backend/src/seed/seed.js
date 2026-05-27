import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  const [admin, manager, member] = await Promise.all([
    User.create({ name: "Admin User", email: "admin@taskflow.com", password: await bcrypt.hash("Password123!", 10), role: "admin" }),
    User.create({ name: "Manager User", email: "manager@taskflow.com", password: await bcrypt.hash("Password123!", 10), role: "manager" }),
    User.create({ name: "Member User", email: "member@taskflow.com", password: await bcrypt.hash("Password123!", 10), role: "member" })
  ]);

  const project = await Project.create({
    name: "TaskFlow Launch",
    description: "Initial SaaS launch workspace",
    owner: admin._id,
    members: [admin._id, manager._id, member._id],
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
  });

  await Task.create([
    { title: "Design dashboard", project: project._id, createdBy: admin._id, assignees: [manager._id], priority: "high" },
    { title: "Build auth module", project: project._id, createdBy: manager._id, assignees: [member._id], status: "in-progress" },
    { title: "Deploy staging", project: project._id, createdBy: admin._id, assignees: [admin._id], status: "completed", priority: "medium" }
  ]);

  console.log("Seed complete");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
