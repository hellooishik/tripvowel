import asyncHandler from "../utils/asyncHandler.js";
import { getKPIs } from "../services/metricsService.js";

export const dashboard = asyncHandler(async (req, res) => {
  const kpis = await getKPIs();
  res.json(kpis);
});
