import { Router } from "express";
import { createPayment, stripeWebhook } from "../controllers/paymentController.js";
import { auth } from "../middleware/auth.js";
import express from "express";

const router = Router();

router.post("/create", auth, createPayment);

// Stripe webhook must use raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
