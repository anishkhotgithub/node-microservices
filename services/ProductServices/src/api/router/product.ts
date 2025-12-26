import { Router } from "express";
import productController from "../controller/product";
const router = Router();
export default (app: Router) => {
  app.use("/product", router);
  router.post("/createProduct", productController.createProduct);
};
