import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TelephonyPage() {
  const [phone, setPhone] = useState("+91");
  const [message, setMessage] = useState("Hello from KrishiSetu");
  const [status, setStatus] = useState<string>("");

  const sendSMS = async () => {
    const res = await fetch("/api/sms/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: phone, message }) });
    const data = await res.json();
    setStatus(res.status === 200 ? "SMS sent (via webhook)" : data.error || "Failed");
  };

  const startIVR = async () => {
    const res = await fetch("/api/ivr/call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: phone, prompt: "Play advisory" }) });
    const data = await res.json();
    setStatus(res.status === 200 ? "IVR call started (via webhook)" : data.error || "Failed");
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">SMS & IVR</h1>
      <p className="mt-1 text-sm text-muted-foreground">Configure provider via environment variables SMS_WEBHOOK_URL and IVR_WEBHOOK_URL. We recommend connecting Zapier MCP and wiring to Twilio/Exotel.</p>
      <div className="mt-4 grid max-w-xl gap-3">
        <div>
          <label className="text-sm">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Message</label>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button onClick={sendSMS}>Send SMS</Button>
          <Button variant="secondary" onClick={startIVR}>Start IVR</Button>
        </div>
        {status && <div className="text-sm">{status}</div>}
      </div>
    </div>
  );
}
