import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import Image from "../models/Image.js";
import { saveObject, deleteObject, activeStorageDriver } from "../services/storageService.js";

// Category becomes a storage prefix — keep it path-safe.
function sanitizeCategory(rawCategory) {
  const category = (rawCategory || "general").toString().trim().toLowerCase();
  const safe = category.replace(/[^a-z0-9_-]/g, "");
  return safe || "general";
}

export async function createUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Expected field name 'image'." });
    }

    const category = sanitizeCategory(req.body.category);
    const webpBuffer = await sharp(req.file.buffer).rotate().webp({ quality: 82 }).toBuffer();
    const key = `${category}/${uuidv4()}.webp`;

    const url = await saveObject(key, webpBuffer, "image/webp");

    const image = await Image.create({
      key,
      url,
      originalName: req.file.originalname,
      mimeType: "image/webp",
      size: webpBuffer.length,
      category,
      storage: activeStorageDriver(),
    });

    return res.status(201).json({ id: image._id, url: image.url, category: image.category });
  } catch (error) {
    console.error("[upload] failed:", error);
    return next(error);
  }
}

export async function listUploads(req, res, next) {
  try {
    const filter = req.query.category ? { category: sanitizeCategory(req.query.category) } : {};
    const images = await Image.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json(images);
  } catch (error) {
    return next(error);
  }
}

export async function deleteUpload(req, res, next) {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await deleteObject(image.key, image.storage);
    await image.deleteOne();

    return res.json({ message: "Image deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid image id" });
    }
    return next(error);
  }
}
