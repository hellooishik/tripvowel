import asyncHandler from "../utils/asyncHandler.js";
import { fetchFlights, fetchHotels, fetchCabs } from "../services/externalApiService.js";

export const getFlights = asyncHandler(async (req, res) => {
  const data = await fetchFlights(req.query);
  res.json({ items: data });
});

export const getHotels = asyncHandler(async (req, res) => {
  const data = await fetchHotels(req.query);
  res.json({ items: data });
});

export const getCabs = asyncHandler(async (req, res) => {
  const data = await fetchCabs(req.query);
  res.json({ items: data });
});
