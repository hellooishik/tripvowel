import { createClient } from "redis";
import { REDIS_URL } from "./env.js";
import logger from "../utils/logger.js";

let client = null;

export const getRedis = () => client;

export const connectRedis = async () => {
  if (!REDIS_URL) {
    logger.info("REDIS_URL not set — skipping Redis connection");
    return null;
  }
  client = createClient({ url: REDIS_URL });
  client.on("error", (e) => logger.warn("Redis error:", e.message));
  await client.connect();
  logger.info("✅ Redis connected");
  return client;
};
