import mongoose from "mongoose";

const { Schema } = mongoose;

const priceSchema = new Schema(
  {
    currency: { type: String, default: "USD" },
    base: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }
  },
  { _id: false }
);

const itineraryItemSchema = new Schema(
  {
    day: Number,
    title: String,
    description: String,
    activities: [String]
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true, index: true },
    packageType: { type: String, enum: ["Basic", "Medium", "Luxury"], required: true },
    images: [String],
    price: priceSchema,
    availability: { type: Number, default: 0 }, // total seats
    sold: { type: Number, default: 0 }, // booked seats
    startDates: [Date],
    durationDays: Number,
    itinerary: [itineraryItemSchema],
    inclusions: [String],
    exclusions: [String],
    meta: { type: Schema.Types.Mixed }, // flexible: hotel/flight/cab info blobs
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// text index for $text search on title/location (used in listTrips)
tripSchema.index({ title: "text", location: "text" });

export default mongoose.model("Trip", tripSchema);
