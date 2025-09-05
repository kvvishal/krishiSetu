import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdvicePage() {
  const [form, setForm] = useState({ crop: "Wheat", soil: "Loam", moisture: 35, rainfall3d: 12 });
  const [result, setResult] = useState<any>(null);

  const submit = async () => {
    const res = await fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.advice);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Get Advice</h1>
      <div className="mt-4 grid max-w-xl grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-sm">Crop</label>
          <Input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
        </div>
        <div>
          <label className="text-sm">Soil</label>
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
    </div>
  );
}
