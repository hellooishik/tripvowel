import { Router } from "express";
import { listTrips, getTrip, createTrip, updateTrip, deleteTrip } from "../controllers/tripController.js";
import validate from "../middleware/validate.js";
import { createTripSchema, listTripsSchema } from "../validators/trip.schema.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { cacheMiddleware } from "../utils/apiCache.js";

const router = Router();

router.get("/", cacheMiddleware(30), validate(listTripsSchema), listTrips);
router.get("/:id", cacheMiddleware(60), getTrip);

// Admin only
router.post("/", auth, requireRole("admin"), validate(createTripSchema), createTrip);
router.put("/:id", auth, requireRole("admin"), updateTrip);
router.delete("/:id", auth, requireRole("admin"), deleteTrip);

export default router;
