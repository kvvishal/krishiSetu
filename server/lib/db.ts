import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export type Buyer = {
  id: string;
  name: string;
  commodity: string;
  minPrice: number;
  maxPrice: number;
  lat: number;
  lng: number;
};

export type MarketListing = {
  id: string;
  farmer: string;
  commodity: string;
  qtyKg: number;
  lat: number;
  lng: number;
  createdAt: number;
};

export interface DBShape {
  buyers: Buyer[];
  listings: MarketListing[];
}

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    const seed: DBShape = {
      buyers: [
        {
          id: "b1",
          name: "Mandi Co-Op",
          commodity: "Wheat",
          minPrice: 18.0,
          maxPrice: 22.0,
          lat: 28.6139,
          lng: 77.209,
        },
        {
          id: "b2",
          name: "Local Wholesaler",
          commodity: "Paddy",
          minPrice: 16.5,
          maxPrice: 20.2,
          lat: 26.8467,
          lng: 80.9462,
        },
      ],
      listings: [],
    };
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readDB(): Promise<DBShape> {
  await ensure();
  const raw = await fs.readFile(DB_FILE, "utf8");
  return JSON.parse(raw) as DBShape;
}

export async function writeDB(data: DBShape): Promise<void> {
  await ensure();
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}
