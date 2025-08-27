import { Router } from "express";
import { dashboard } from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

router.get("/dashboard", auth, requireRole("admin"), dashboard);

export default router;
