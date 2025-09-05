import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSync } from "./routes/sync";
import { handleAdvice } from "./routes/advice";
import { getBuyers, createListing, listListings } from "./routes/market";
import { handleUssd } from "./routes/ussd";
import { sendSMS, startIVR, inboundSMS, inboundIVR } from "./routes/telephony";

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

  // Telephony + USSD
  app.post("/api/ussd", handleUssd);
  app.post("/api/sms/send", sendSMS);
  app.post("/api/ivr/call", startIVR);
  app.post("/api/webhooks/sms", inboundSMS);
  app.post("/api/webhooks/ivr", inboundIVR);

  return app;
}
