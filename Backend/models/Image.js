import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // S3 object key
    url: { type: String, required: true }, // public URL
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    // Optional tag so the admin panel can filter (e.g. "event", "member", "gallery", "hero")
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
