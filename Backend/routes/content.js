import { Router } from "express";
import { getSiteContent, saveSiteContent, submitApplication } from "../controllers/contentController.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { applicationLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", getSiteContent);
router.put("/", requireAdminAuth, saveSiteContent);
// Legacy path used by the current frontend; same handler as POST /api/applications.
router.post("/applications", applicationLimiter, submitApplication);

export default router;
