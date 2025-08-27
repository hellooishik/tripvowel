import { getRedis } from "../config/redis.js";

export const cacheMiddleware = (ttlSeconds = 60) => async (req, res, next) => {
  const client = getRedis();
  if (!client) return next();
  const key = `cache:${req.originalUrl}`;
  const cached = await client.get(key);
  if (cached) return res.json(JSON.parse(cached));
  const json = res.json.bind(res);
  res.json = async (body) => {
    await client.setEx(key, ttlSeconds, JSON.stringify(body));
    return json(body);
  };
  next();
};
