import { Router } from "express";

import auth from "./router/product";
export default () => {
  const router = Router();
  auth(router);
  return router;
};
