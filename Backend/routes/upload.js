import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3.js";
import { upload } from "../middleware/upload.js";
import Image from "../models/Image.js";

const router = Router();

function buildPublicUrl(key) {
  if (process.env.S3_ENDPOINT) {
    // Custom S3-compatible endpoint (R2, MinIO, etc.)
    return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// POST /api/uploads  (field name: "image")
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Expected field name 'image'." });
    }

    const category = req.body.category || "general";
    const extension = req.file.originalname.split(".").pop();
    const key = `${category}/${uuidv4()}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const url = buildPublicUrl(key);

    const image = await Image.create({
      key,
      url,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      category,
    });

    res.status(201).json({ id: image._id, url: image.url, category: image.category });
  } catch (error) {
    console.error("[upload] failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// GET /api/uploads?category=gallery
router.get("/", async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const images = await Image.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch uploads", error: error.message });
  }
});

// DELETE /api/uploads/:id
router.delete("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: image.key }));
    await image.deleteOne();

    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

export default router;
