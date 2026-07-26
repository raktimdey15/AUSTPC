import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import Image from "../models/Image.js";
import { s3Client, BUCKET_NAME } from "../config/s3.js";

function buildPublicUrl(key) {
  if (process.env.S3_ENDPOINT) {
    return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
  }

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function createUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Expected field name 'image'." });
    }

    const category = req.body.category || "general";
    const webpBuffer = await sharp(req.file.buffer).webp({ quality: 82 }).toBuffer();
    const key = `${category}/${uuidv4()}.webp`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: webpBuffer,
        ContentType: "image/webp",
      })
    );

    const url = buildPublicUrl(key);

    const image = await Image.create({
      key,
      url,
      originalName: req.file.originalname,
      mimeType: "image/webp",
      size: webpBuffer.length,
      category,
    });

    return res.status(201).json({ id: image._id, url: image.url, category: image.category });
  } catch (error) {
    console.error("[upload] failed:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
}

export async function listUploads(req, res) {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const images = await Image.find(filter).sort({ createdAt: -1 });
    return res.json(images);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch uploads", error: error.message });
  }
}

export async function deleteUpload(req, res) {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: image.key }));
    await image.deleteOne();

    return res.json({ message: "Image deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed", error: error.message });
  }
}