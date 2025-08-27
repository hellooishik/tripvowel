import Trip from "../models/Trip.js";

/**
 * Check availability for a given trip and startDate (date normalized)
 * Returns { ok: boolean, reason?, trip? }
 */
export const checkAvailability = async (tripId, startDate, quantity) => {
  const trip = await Trip.findById(tripId);
  if (!trip || !trip.isActive) return { ok: false, reason: "Trip not found or inactive" };

  // Normalize to midnight to avoid timezone/time-of-day mismatches
  const requestedTs = new Date(startDate).setHours(0, 0, 0, 0);
  const availableDates = (trip.startDates || []).map((d) => new Date(d).setHours(0, 0, 0, 0));
  if (!availableDates.includes(requestedTs)) {
    return { ok: false, reason: "Invalid start date" };
  }

  const remaining = Number(trip.availability || 0) - Number(trip.sold || 0);
  if (remaining < quantity) return { ok: false, reason: "Not enough availability" };

  return { ok: true, trip };
};

/**
 * Atomically reserve seats (will only succeed if availability - sold >= quantity)
 * Returns true if reserved, false otherwise
 */
export const reserveSeats = async (tripId, quantity) => {
  // Use $expr to ensure availability - sold >= quantity
  const trip = await Trip.findOneAndUpdate(
    {
      _id: tripId,
      $expr: { $gte: [{ $subtract: ["$availability", "$sold"] }, quantity] }
    },
    { $inc: { sold: quantity } },
    { new: true }
  );
  return !!trip;
};

export const releaseSeats = async (tripId, quantity) => {
  // Decrement sold; no negative check here (assume admin/scripts handle anomalies)
  await Trip.findByIdAndUpdate(tripId, { $inc: { sold: -Math.abs(quantity) } });
};

export const computeAmount = (trip, quantity) => {
  const base = Number((trip && trip.price && trip.price.base) || 0);
  const taxes = Number((trip && trip.price && trip.price.taxes) || 0);
  const discount = Number((trip && trip.price && trip.price.discount) || 0);
  const gross = Math.max(base + taxes - discount, 0);
  return gross * Number(quantity || 1);
};
