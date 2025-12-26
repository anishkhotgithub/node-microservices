import dotenv from "dotenv";

// process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export default {
  port: process.env.PORT,
  authServices: process.env.AUTH_SERVICE_URL,
  productServices: process.env.PRODUCT_SERVICE_URL,
};
