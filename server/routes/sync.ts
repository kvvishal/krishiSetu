import { RequestHandler } from "express";

export const handleSync: RequestHandler = (req, res) => {
  const { changes } = req.body as { changes: Array<{ id: string }> };
  // In a real app, persist changes to DB and publish updates.
  res.status(200).json({ received: changes?.length ?? 0 });
};
