import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    startDate: { type: Date, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ["PENDING_PAYMENT", "CONFIRMED", "CANCELLED"], default: "PENDING_PAYMENT" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
