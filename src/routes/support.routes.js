import { Router } from "express";
import { createTicket, myTickets, listAllTickets, replyTicket, updateTicketStatus } from "../controllers/supportController.js";
import validate from "../middleware/validate.js";
import { createTicketSchema, replyTicketSchema } from "../validators/support.schema.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();

router.post("/", auth, validate(createTicketSchema), createTicket);
router.get("/", auth, myTickets);

// admin
router.get("/admin/all", auth, requireRole("admin"), listAllTickets);
router.post("/:id/reply", auth, validate(replyTicketSchema), replyTicket);
router.put("/:id/status", auth, requireRole("admin"), updateTicketStatus);

export default router;
