import Trip from "../models/Trip.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listTrips = asyncHandler(async (req, res) => {
  const { q, location, packageType, minPrice, maxPrice } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (location) filter.location = new RegExp(location, "i");
  if (packageType) filter.packageType = packageType;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter["price.base"] = {};
    if (minPrice !== undefined) filter["price.base"].$gte = Number(minPrice);
    if (maxPrice !== undefined) filter["price.base"].$lte = Number(maxPrice);
  }

  const [items, total] = await Promise.all([
    Trip.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    Trip.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
});

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create(req.body);
  res.status(201).json(trip);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json({ message: "Trip deleted" });
});
