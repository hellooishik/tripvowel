import { Router } from "express";
import { getFlights, getHotels, getCabs } from "../controllers/externalController.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

// Admin-only since you’ll curate trips from these APIs
const router = Router();
router.get("/flights", auth, requireRole("admin"), getFlights);
router.get("/hotels", auth, requireRole("admin"), getHotels);
router.get("/cabs", auth, requireRole("admin"), getCabs);

export default router;
