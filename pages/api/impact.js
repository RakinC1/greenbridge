import { getGlobalStats, getRestaurants, getShelters } from "../../lib/db";
import { generateImpactReport } from "../../lib/gemini";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  const stats = getGlobalStats();
  const restaurants = getRestaurants();
  const shelters = getShelters();

  let aiReport = null;
  let fallback = false;

  try {
    aiReport = await generateImpactReport({ stats, topRestaurants: restaurants.slice(0, 3), topShelters: shelters.slice(0, 3) });
  } catch (err) {
    fallback = true;
    aiReport = {
      headline: `GreenBridge has rescued ${stats.totalKgRescued} kg of food, preventing ${stats.totalCarbonSaved} kg of CO₂ emissions!`,
      carbonEquivalents: [
        { label: "Car miles not driven", value: `${Math.round(stats.totalCarbonSaved * 2.5)} miles`, icon: "🚗" },
        { label: "Trees worth of CO₂ absorbed", value: `${Math.round(stats.totalCarbonSaved / 22)} trees/year`, icon: "🌳" },
        { label: "Smartphone charges equivalent", value: `${Math.round(stats.totalCarbonSaved * 121)} charges`, icon: "📱" },
      ],
      waterEquivalents: [
        { label: "Shower minutes saved", value: `${Math.round(stats.totalWaterSaved / 9)} minutes`, icon: "🚿" },
        { label: "Glasses of water", value: `${Math.round(stats.totalWaterSaved / 0.25).toLocaleString()} glasses`, icon: "💧" },
        { label: "Bathtubs filled", value: `${Math.round(stats.totalWaterSaved / 150)} bathtubs`, icon: "🛁" },
      ],
      communityImpact: `GreenBridge has connected ${restaurants.length} restaurants with ${shelters.length} shelters and food banks, providing ${stats.mealsProvided} meals to those in need. Every rescued portion represents dignity and nourishment for a community member.`,
      environmentalNarrative: `By rescuing ${stats.totalKgRescued} kg of food from landfills, GreenBridge has prevented ${stats.totalCarbonSaved} kg of greenhouse gas emissions and saved ${stats.totalWaterSaved.toLocaleString()} liters of water. Food waste is one of the largest contributors to climate change, and every rescue counts.`,
      motivationalMessage: "Together, one rescued meal at a time, we're building a more sustainable and equitable food system.",
    };
  }

  return res.status(200).json({ success: true, stats, restaurants, shelters, aiReport, fallback });
}
