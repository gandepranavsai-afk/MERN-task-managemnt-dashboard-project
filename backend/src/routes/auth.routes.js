import express from "express";
import { register, login, me, updateProfile, forgotPassword, resetPassword, changePassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

export default router;
