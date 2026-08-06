import { Router } from "express";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { applicationLimiter } from "../middleware/rateLimit.js";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = Router();

// Public: join-form submissions.
router.post("/", applicationLimiter, createApplication);

// Admin-only: review pipeline.
router.get("/", requireAdminAuth, listApplications);
router.patch("/:id/status", requireAdminAuth, updateApplicationStatus);
router.delete("/:id", requireAdminAuth, deleteApplication);

export default router;
