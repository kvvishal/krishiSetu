import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { putRecord, getRecordsByType, clearType } from "@/lib/localdb";
import SpeechButton from "@/components/common/SpeechButton";
import { toast } from "sonner";

export default function RecordPage() {
  const [crop, setCrop] = useState("Wheat");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  const load = async () => {
    const items = await getRecordsByType("crop");
    setRecords(items);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await putRecord({
      id: crypto.randomUUID(),
      type: "crop",
      payload: { crop, notes },
      updatedAt: Date.now(),
    });
    toast.success("Saved offline");
    setNotes("");
    await load();
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Record Farm</h1>
      <div className="mt-4 grid max-w-xl gap-3">
        <div>
          <label className="flex items-center justify-between text-sm">
            <span>Crop</span>
            <SpeechButton
              onText={(t) => setCrop((p) => (p ? p + " " : "") + t)}
            />
          </label>
          <Input value={crop} onChange={(e) => setCrop(e.target.value)} />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm">
            <span>Notes</span>
            <SpeechButton
              onText={(t) => setNotes((p) => (p ? p + " " : "") + t)}
            />
          </label>
          <Textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button onClick={save}>Save</Button>
      </div>
      {/* Saved records */}
      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Saved Records</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await clearType("crop");
              await load();
            }}
          >
            Clear
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-xl border p-4 text-sm">
              <div className="font-medium">{r.payload?.crop}</div>
              {r.payload?.notes && (
                <div className="text-muted-foreground">{r.payload.notes}</div>
              )}
              <div className="text-xs text-muted-foreground">
                {new Date(r.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-sm text-muted-foreground">No records yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
