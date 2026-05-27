import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "manager", "member"], default: "member" },
    avatar: String,
    bio: String,
    online: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
