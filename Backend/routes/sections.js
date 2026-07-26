import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { getSection, updateSection } from "../controllers/sectionController.js";

const router = Router();

router.get("/:section", getSection);
router.put("/:section", requireAdminAuth, updateSection);

export default router;