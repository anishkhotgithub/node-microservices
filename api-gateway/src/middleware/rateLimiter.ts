import { Request, Response, NextFunction } from "express";
import { redis } from "../redis/redisClient";

/**
 * Sliding window rate limiter
 * @param maxRequests number of requests
 * @param windowSeconds time window in seconds
 */
export const rateLimiter = (maxRequests: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier =
        req.ip || req.headers["x-forwarded-for"] || "anonymous";

      const key = `rate:${identifier}:${req.path}`;
      const now = Date.now();

      // Use sorted set
      await redis.zadd(key, now, now.toString());

      // Remove old requests
      await redis.zremrangebyscore(key, 0, now - windowSeconds * 1000);

      // Count current requests
      const requestCount = await redis.zcard(key);
      // Set TTL (important)
      await redis.expire(key, windowSeconds);

      if (requestCount > maxRequests) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next(); // Fail-open
    }
  };
};
