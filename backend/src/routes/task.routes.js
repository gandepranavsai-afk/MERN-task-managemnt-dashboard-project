import express from "express";
import { createTask, deleteTask, exportTasksCsv, getTasks, updateTask } from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate, taskSchema } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getTasks);
router.get("/export/csv", exportTasksCsv);
router.post("/", validate(taskSchema), createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
