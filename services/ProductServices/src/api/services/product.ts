import { Service, Inject } from "typedi";
import { Logger } from "winston";
import { CreateProductSchema } from "../types/product";
import Helper from "../../helper";
import mongoose from "mongoose";
import * as z from "zod";

@Service()
export default class productService {
  constructor(
    @Inject("throwError")
    private throwError: (code?: number, message?: string) => never,
    @Inject("logger") private logger: Logger,
    @Inject("productModel") private productModel: mongoose.Model<any>
  ) {}

  async createProduct(req: any): Promise<{ user: any }> {
    let doc = {};
    try {
      const zod = CreateProductSchema.parse(req);
      doc = await this.productModel.create(zod);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw err.issues;
      }
      this.logger.error(err);
      this.throwError(Helper.StatusCode.InternalError, "Something went wrong");
    }
    return { user: doc };
  }
}
