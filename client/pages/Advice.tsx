import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpeechButton from "@/components/common/SpeechButton";
import { putRecord, getRecordsByType, clearType } from "@/lib/localdb";

export default function AdvicePage() {
  const [form, setForm] = useState({ crop: "Wheat", soil: "Loam", moisture: 35, rainfall3d: 12 });
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    const items = await getRecordsByType("advisory");
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const submit = async () => {
    const res = await fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.advice);
    await putRecord({ id: crypto.randomUUID(), type: "advisory", payload: { request: form, response: data.advice }, updatedAt: Date.now() }, false);
    await loadHistory();
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Get Advice</h1>
      <div className="mt-4 grid max-w-xl grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="flex items-center justify-between text-sm">
            <span>Crop</span>
            <SpeechButton onText={(t) => setForm((f) => ({ ...f, crop: f.crop ? f.crop + " " + t : t }))} />
          </label>
          <Input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span>Soil</span>
            <SpeechButton onText={(t) => setForm((f) => ({ ...f, soil: (f.soil as any) ? (f.soil as any) + " " + t : (t as any) }))} />
          </label>
          <Input value={form.soil} onChange={(e) => setForm({ ...form, soil: e.target.value as any })} />
        </div>
        <div>
          <label className="text-sm">Moisture %</label>
          <Input type="number" value={form.moisture} onChange={(e) => setForm({ ...form, moisture: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-sm">Rainfall next 3d (mm)</label>
          <Input type="number" value={form.rainfall3d} onChange={(e) => setForm({ ...form, rainfall3d: Number(e.target.value) })} />
        </div>
        <div className="col-span-2">
          <Button onClick={submit}>Get Advice</Button>
        </div>
      </div>

      {result && (
        <div className="mt-6 rounded-xl border p-4">
          <div className="font-semibold">{result.crop}</div>
          <div className="text-sm">Irrigation this week: {result.irrigationMmWeek}mm</div>
          <div className="text-sm">Pest Risk: {result.pestRisk}</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {result.tips.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* History */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">History</h2>
          <Button variant="outline" size="sm" onClick={async () => { await clearType("advisory"); await loadHistory(); }}>Clear</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((h) => (
            <div key={h.id} className="rounded-xl border p-4 text-sm">
              <div className="font-medium">{h.payload?.response?.crop ?? h.payload?.request?.crop}</div>
              <div>Irrigation: {h.payload?.response?.irrigationMmWeek}mm</div>
              <div>Pest: {h.payload?.response?.pestRisk}</div>
              <div className="text-xs text-muted-foreground">{new Date(h.updatedAt).toLocaleString()}</div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-sm text-muted-foreground">No history yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
