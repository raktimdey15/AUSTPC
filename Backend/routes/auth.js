import { Router } from "express";
import { loginAdmin, getAdminSession } from "../controllers/authController.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", requireAdminAuth, getAdminSession);

export default router;