import express from "express";
import { createProject, getProjects, updateProject, archiveProject } from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.patch("/:id/archive", archiveProject);

export default router;
