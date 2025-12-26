import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { CreateAuthSchema } from "../types/auth";
import Helper from "../../helper";
import mongoose from "mongoose";
import * as z from "zod";
import { redis } from "../../redis/redisClient";

@Service()
export default class AuthService {
  constructor(
    @Inject("throwError")
    private throwError: (code?: number, message?: string) => never,
    @Inject("logger") private logger: Logger,
    @Inject("authModel") private authModel: mongoose.Model<any>
  ) {}

  async createAuth(req: any): Promise<{ user: any }> {
    let doc = {};
    try {
      const zod = CreateAuthSchema.parse(req);
      doc = await this.authModel.create(zod);
      console.log("Created doc:", doc);
      if (doc) {
        await this.clearAuthEmailCache("auth:user:email:*");
        await redis.del(`auth:user:email:${req.email}`);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw err.issues;
      }
      this.logger.error(err);
      this.throwError(Helper.StatusCode.InternalError, "Something went wrong");
    }
    return { user: doc };
  }
  async getAuth(req: any): Promise<{ user: any }> {
    let doc = {};
    try {
      const cacheKey = `auth:user:email:${req.email}`;
      console.log("Userr get");
      // 1️⃣ Check cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      // const zod = CreateAuthSchema.parse(req);
      doc = await this.authModel.find({});
      if (doc) {
        await redis.setex(cacheKey, 60, JSON.stringify(doc));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw err.issues;
      }
      this.logger.error(err);
      this.throwError(Helper.StatusCode.InternalError, "Something went wrong");
    }
    return { user: doc };
  }
  async clearAuthEmailCache(patternVal: string) {
    const pattern = patternVal;
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  }
}
