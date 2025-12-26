import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product";
import Container from "typedi";
import { Logger } from "winston";

class productController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get("logger");
    try {
      const productServiceInstance = Container.get(ProductService);
      const students = await productServiceInstance.createProduct(req.body);
      res.status(200).json({
        code: 200,
        message: "success",
        data: students,
      });
    } catch (error) {
      logger.error("🔥 error: %o", JSON.stringify(error));
      res.status(200).json({
        code: 200,
        message: "success",
        error: error,
      });
    }
  };
}
export default new productController();
