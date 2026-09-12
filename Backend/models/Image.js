import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // storage object key
    url: { type: String, required: true }, // public URL
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    // Optional tag so the admin panel can filter (e.g. "event", "member", "gallery", "hero")
    category: { type: String, default: "general", trim: true, maxlength: 60 },
    // Which driver holds the file, so deletes keep working after a driver switch.
    storage: { type: String, enum: ["s3", "local"], default: "local" },
  },
  { timestamps: true }
);

imageSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model("Image", imageSchema);
