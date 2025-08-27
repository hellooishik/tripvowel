import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/Booking.js";
import { checkAvailability, reserveSeats, releaseSeats, computeAmount } from "../services/bookingService.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { tripId, startDate, quantity = 1 } = req.body;
  const check = await checkAvailability(tripId, startDate, quantity);
  if (!check.ok) return res.status(400).json({ message: check.reason });

  const amount = computeAmount(check.trip, quantity);
  const booking = await Booking.create({
    user: req.user._id,
    trip: tripId,
    startDate,
    quantity,
    status: "PENDING_PAYMENT",
    amount,
    currency: check.trip.price?.currency || "USD",
  });

  // soft reserve seats before payment
  const reserved = await reserveSeats(tripId, quantity);
  if (!reserved) {
    await booking.deleteOne();
    return res.status(409).json({ message: "Could not reserve seats" });
  }

  res.status(201).json(booking);
});

export const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("trip");
  res.json(bookings);
});

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "PENDING_PAYMENT") return res.status(400).json({ message: "Cannot update confirmed booking" });
  if (req.body.quantity) booking.quantity = req.body.quantity;
  if (req.body.startDate) booking.startDate = req.body.startDate;
  await booking.save();
  res.json(booking);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate("trip");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "CONFIRMED") return res.status(400).json({ message: "Use refund policy for confirmed bookings" });

  await releaseSeats(booking.trip._id, booking.quantity);
  booking.status = "CANCELLED";
  await booking.save();
  res.json({ message: "Booking cancelled" });
});

export const listAllBookingsAdmin = asyncHandler(async (req, res) => {
  const items = await Booking.find().populate("trip user");
  res.json(items);
});
