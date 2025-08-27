import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/Booking.js";
import { createStripeSession, markPaymentSuccess, stripe } from "../services/paymentService.js";
import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import { releaseSeats } from "../services/bookingService.js";

/**
 * Create a payment (returns Stripe checkout URL)
 * Body: { bookingId, successUrl, cancelUrl }
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, successUrl, cancelUrl } = req.body;
  const booking = await Booking.findById(bookingId).populate("trip");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "PENDING_PAYMENT") return res.status(400).json({ message: "Invalid booking status" });

  const { session } = await createStripeSession({ booking, successUrl, cancelUrl });
  res.json({ checkoutUrl: session.url, sessionId: session.id });
});

/**
 * Stripe webhook handler
 * Note: this endpoint must use express.raw() middleware (it's done in the route file)
 */
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    // req.body is a Buffer when express.raw is used for this route
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const booking = await Booking.findById(bookingId).populate("trip");
    if (booking) {
      await markPaymentSuccess(booking, session.payment_intent || session.id, session);
      booking.status = "CONFIRMED";
      await booking.save();
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    const booking = await Booking.findById(bookingId).populate("trip");
    if (booking && booking.status === "PENDING_PAYMENT") {
      await releaseSeats(booking.trip._id, booking.quantity);
      booking.status = "CANCELLED";
      await booking.save();
    }
  }

  res.json({ received: true });
});
