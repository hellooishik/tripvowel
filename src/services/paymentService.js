import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/env.js";
import Payment from "../models/Payment.js";

if (!STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe payments will fail if attempted");
}

const stripe = new Stripe(STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });
export { stripe };

/**
 * Create a Checkout Session for a booking. booking must contain populated trip (for name)
 */
export const createStripeSession = async ({ booking, successUrl, cancelUrl }) => {
  const productName = booking?.trip?.title ? `Trip: ${booking.trip.title}` : `Trip booking ${booking._id}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price_data: {
          currency: booking.currency || "USD",
          product_data: { name: productName },
          unit_amount: Math.round(Number(booking.amount || 0) * 100)
        },
        quantity: 1
      }
    ],
    metadata: { bookingId: booking._id.toString() }
  });

  const payment = await Payment.create({
    booking: booking._id,
    provider: "Stripe",
    providerSessionId: session.id,
    status: "INITIATED",
    amount: booking.amount,
    currency: booking.currency,
    raw: { session }
  });

  return { session, payment };
};

export const markPaymentSuccess = async (booking, providerPaymentId, raw) => {
  const payment = await Payment.findOneAndUpdate(
    { booking: booking._id },
    { status: "SUCCESS", providerPaymentId, raw },
    { new: true }
  );
  return payment;
};
