import express from "express";
import { createComment, getComments } from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });
router.use(protect);

router.get("/", getComments);
router.post("/", createComment);

export default router;
