import { RequestHandler } from "express";
import { readDB, writeDB, MarketListing, Buyer } from "../lib/db";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getBuyers: RequestHandler = async (req, res) => {
  const { lat = 28.6, lng = 77.2, commodity } = req.query as any;
  const db = await readDB();
  let buyers = db.buyers as Buyer[];
  if (commodity) buyers = buyers.filter((b) => b.commodity.toLowerCase() === String(commodity).toLowerCase());
  const withDist = buyers
    .map((b) => ({ ...b, distanceKm: haversine(Number(lat), Number(lng), b.lat, b.lng) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);
  res.json({ buyers: withDist });
};

export const createListing: RequestHandler = async (req, res) => {
  const { farmer = "Farmer", commodity = "Wheat", qtyKg = 100, lat = 28.6, lng = 77.2 } = req.body || {};
  const db = await readDB();
  const listing: MarketListing = {
    id: `l_${Date.now()}`,
    farmer,
    commodity,
    qtyKg: Number(qtyKg),
    lat: Number(lat),
    lng: Number(lng),
    createdAt: Date.now(),
  };
  db.listings.push(listing);
  await writeDB(db);
  res.status(201).json({ listing });
};

export const listListings: RequestHandler = async (_req, res) => {
  const db = await readDB();
  res.json({ listings: db.listings.slice(-50).reverse() });
};
