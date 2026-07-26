import { Router } from "express";
import { getSiteContent, saveSiteContent, submitApplication } from "../controllers/contentController.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", getSiteContent);
router.put("/", requireAdminAuth, saveSiteContent);
router.post("/applications", submitApplication);

export default router;