import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    error: true,
    message: err.message || "Internal server error",
  });
};
