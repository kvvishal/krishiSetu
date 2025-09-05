import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSync } from "./routes/sync";
import { handleAdvice } from "./routes/advice";
import { getBuyers, createListing, listListings } from "./routes/market";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/sync", handleSync);

  // Advisory & Market APIs
  app.post("/api/advice", handleAdvice);
  app.get("/api/market/buyers", getBuyers);
  app.get("/api/market/listings", listListings);
  app.post("/api/market/list", createListing);

  return app;
}
