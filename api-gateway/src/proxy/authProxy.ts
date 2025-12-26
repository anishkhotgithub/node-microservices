import proxy from "express-http-proxy";
import { cacheMiddleware } from "../middleware/redisMiddleware";
import config from "../config/config";

export const authProxy = [
  cacheMiddleware(120), // cache for 2 minutes
  proxy(config.authServices ?? "", {
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace("/auth", "/api/auth"),
  }),
];
export const productProxy = [
  cacheMiddleware(120), // cache for 2 minutes
  proxy(config.productServices ?? "", {
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace("/product", "/api/product"),
  }),
];
