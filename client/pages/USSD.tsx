import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function USSDPage() {
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("Press Dial to start");

  const send = async (payload: string) => {
    const res = await fetch("/api/ussd", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: payload }) });
    const msg = await res.text();
    setScreen(msg);
  };

  const dial = () => {
    setText("");
    send("");
  };

  const type = async (ch: string) => {
    const newText = text ? `${text}*${ch}` : ch;
    setText(newText);
    await send(newText);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">USSD</h1>
      <div className="mt-4 grid max-w-sm gap-3">
        <div className="rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap">{screen}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={dial}>Dial</Button>
          <Button onClick={() => type("1")}>1</Button>
          <Button onClick={() => type("2")}>2</Button>
          <Button onClick={() => type("3")}>3</Button>
          <Button onClick={() => type("0")}>0</Button>
        </div>
        <div>
          <label className="text-xs">Raw text</label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
