import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { putRecord } from "@/lib/localdb";
import { toast } from "sonner";

export default function RecordPage() {
  const [crop, setCrop] = useState("Wheat");
  const [notes, setNotes] = useState("");

  const save = async () => {
    await putRecord({ id: crypto.randomUUID(), type: "crop", payload: { crop, notes }, updatedAt: Date.now() });
    toast.success("Saved offline");
    setNotes("");
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Record Farm</h1>
      <div className="mt-4 grid max-w-xl gap-3">
        <div>
          <label className="text-sm">Crop</label>
          <Input value={crop} onChange={(e) => setCrop(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Notes</label>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
