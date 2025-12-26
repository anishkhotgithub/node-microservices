import { Request, Response, NextFunction } from "express";
import { redis } from "../redis/redisClient";

export const cacheMiddleware = (ttlSeconds = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const cacheKey = `cache:${req.originalUrl}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Monkey patch res.json to store response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redis.setex(cacheKey, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
};
