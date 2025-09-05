import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Buyer {
  id: string;
  name: string;
  commodity: string;
  minPrice: number;
  maxPrice: number;
  distanceKm: number;
}

export default function Buyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [commodity, setCommodity] = useState("Wheat");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6,
    lng: 77.2,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      );
    }
  }, []);

  const search = async () => {
    const params = new URLSearchParams({
      lat: String(coords.lat),
      lng: String(coords.lng),
      commodity,
    });
    const res = await fetch(`/api/market/buyers?${params}`);
    const data = await res.json();
    setBuyers(data.buyers);
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lng]);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold">Find Buyer</h1>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm">Commodity</label>
          <Input
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-40"
          />
        </div>
        <Button onClick={search}>Search</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {buyers.map((b) => (
          <div key={b.id} className="rounded-xl border p-4">
            <div className="font-semibold">{b.name}</div>
            <div className="text-sm text-muted-foreground">{b.commodity}</div>
            <div className="mt-2 text-sm">
              ₹{b.minPrice.toFixed(1)}–₹{b.maxPrice.toFixed(1)} / kg
            </div>
            <div className="text-xs text-muted-foreground">
              {b.distanceKm.toFixed(1)} km away
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
