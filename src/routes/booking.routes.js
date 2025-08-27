import { Router } from "express";
import { createBooking, myBookings, updateBooking, cancelBooking, listAllBookingsAdmin } from "../controllers/bookingController.js";
import validate from "../middleware/validate.js";
import { createBookingSchema } from "../validators/booking.schema.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

router.post("/", auth, validate(createBookingSchema), createBooking);
router.get("/", auth, myBookings);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, cancelBooking);

// admin
router.get("/admin/all", auth, requireRole("admin"), listAllBookingsAdmin);

export default router;
