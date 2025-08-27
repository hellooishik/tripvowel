import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { MONGO_URI } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
};
