import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authProxy, productProxy } from "./proxy/authProxy";
import { leakyBucketRateLimiter } from "./middleware/rateLimiter";
import os from "os";
dotenv.config();

const app = express();
const PORT = 3000;

async function startServer() {
  // Middlewares
  app.use(cors());
  app.use(express.json());
  console.log("Starting API Gateway");
  app.use("/auth", leakyBucketRateLimiter(20, 60), authProxy);
  app.use("/product", leakyBucketRateLimiter(20, 60), productProxy);
  app.get("/health", (req, res) => {
    res.json({
      service: "api-gateway",
      hostname: os.hostname(),
      pid: process.pid,
    });
  });
  app.listen(PORT, () => {
    console.log(`
        ##########################################
        🛡️  API Gateway listening on port: ${PORT} 🛡️
        ##########################################
    `);
  });
}

startServer();
