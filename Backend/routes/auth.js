import { Router } from "express";
import { loginAdmin, getAdminSession } from "../controllers/authController.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/login", loginLimiter, loginAdmin);
router.get("/me", requireAdminAuth, getAdminSession);

export default router;
