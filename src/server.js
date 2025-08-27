import { createServer } from "http";
import app from "./app.js";
import { PORT } from "./config/env.js";
import logger from "./utils/logger.js";
import { connectRedis } from "./config/redis.js";

const start = async () => {
  try {
    await connectRedis(); // will no-op if REDIS_URL not set
  } catch (e) {
    logger.warn("Redis not available:", e.message || e);
  }

  const server = createServer(app);
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
