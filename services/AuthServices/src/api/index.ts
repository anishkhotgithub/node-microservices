import { Router } from "express";

import auth from "./router/auth";
export default () => {
  const router = Router();
  auth(router);
  return router;
};
