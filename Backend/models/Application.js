import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    department: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    semester: { type: String, required: true, trim: true, maxlength: 60 },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    skills: { type: String, default: "", trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ email: 1, semester: 1 });

export default mongoose.model("Application", applicationSchema);
