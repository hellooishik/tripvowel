import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    provider: { type: String, enum: ["Stripe", "PayPal", "Razorpay"], default: "Stripe" },
    providerSessionId: String,
    providerPaymentId: String,
    status: { type: String, enum: ["INITIATED", "SUCCESS", "FAILED", "REFUNDED"], default: "INITIATED" },
    amount: Number,
    currency: { type: String, default: "USD" },
    raw: Object
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
