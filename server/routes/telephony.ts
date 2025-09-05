import { RequestHandler } from "express";

async function forward(url: string, payload: any) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: r.ok, status: r.status, text: await r.text() };
}

export const sendSMS: RequestHandler = async (req, res) => {
  const url = process.env.SMS_WEBHOOK_URL;
  if (!url) return res.status(501).json({ error: "SMS not configured" });
  const { to, message } = req.body || {};
  const resp = await forward(url, { to, message, channel: "sms" });
  res.status(resp.ok ? 200 : 502).json(resp);
};

export const startIVR: RequestHandler = async (req, res) => {
  const url = process.env.IVR_WEBHOOK_URL;
  if (!url) return res.status(501).json({ error: "IVR not configured" });
  const { to, prompt } = req.body || {};
  const resp = await forward(url, { to, prompt, channel: "ivr" });
  res.status(resp.ok ? 200 : 502).json(resp);
};

// Provider inbound webhooks (optional)
export const inboundSMS: RequestHandler = async (req, res) => {
  // Accept provider payload and ack
  console.log("Inbound SMS", req.body);
  res.status(200).json({ ok: true });
};

export const inboundIVR: RequestHandler = async (req, res) => {
  console.log("Inbound IVR", req.body);
  res.status(200).json({ ok: true });
};
