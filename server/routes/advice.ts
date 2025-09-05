import { RequestHandler } from "express";

type AdviceReq = {
  crop?: string;
  soil?: "Sandy" | "Loam" | "Clay";
  moisture?: number; // %
  rainfall3d?: number; // mm next 3 days
  region?: string;
};

export const handleAdvice: RequestHandler = (req, res) => {
  const { crop = "Wheat", soil = "Loam", moisture = 35, rainfall3d = 10, region = "IN-UP" } =
    (req.body as AdviceReq) || {};

  const soilFactor = soil === "Sandy" ? 1.3 : soil === "Clay" ? 0.8 : 1.0;
  let irrigationMmWeek = Math.max(0, Math.round((25 - rainfall3d * 0.8) * soilFactor));
  if (moisture > 45) irrigationMmWeek = 0;

  const pestRisk = moisture > 50 || rainfall3d > 40 ? "High" : rainfall3d > 20 ? "Medium" : "Low";

  const nextBestCrops = soil === "Sandy" ? ["Millet", "Groundnut"] : soil === "Clay" ? ["Paddy", "Sugarcane"] : ["Wheat", "Mustard"];

  const advice = {
    crop,
    region,
    irrigationMmWeek,
    pestRisk,
    tips: [
      irrigationMmWeek === 0 ? "Skip irrigation this week" : `Irrigate ${irrigationMmWeek}mm this week`,
      pestRisk === "High" ? "Scout daily for aphids and rust; use traps" : "Monitor weekly for pests",
      soil === "Sandy" ? "Add organic matter to improve water holding" : soil === "Clay" ? "Ensure drainage to avoid waterlogging" : "Maintain balanced NPK",
    ],
    nextBestCrops,
  };

  res.json({ advice });
};
