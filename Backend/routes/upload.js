import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { createUpload, listUploads, deleteUpload } from "../controllers/uploadController.js";

const router = Router();

// POST /api/uploads  (field name: "image")
router.post("/", requireAdminAuth, upload.single("image"), createUpload);

// GET /api/uploads?category=gallery
router.get("/", listUploads);

// DELETE /api/uploads/:id
router.delete("/:id", requireAdminAuth, deleteUpload);

export default router;
