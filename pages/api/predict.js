import { getWastePredictionData } from "../../lib/db";
import { generateWastePrediction } from "../../lib/gemini";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  try {
    const data = getWastePredictionData();
    const prediction = await generateWastePrediction(data);
    return res.status(200).json({ success: true, data: prediction, platformData: data });
  } catch (err) {
    console.error("Prediction error:", err.message);
    // Return fallback mock data if Gemini API key not set or fails
    if (err.message.includes("GEMINI_API_KEY") || err.message.includes("API key")) {
      return res.status(200).json({
        success: true,
        fallback: true,
        data: {
          wastePredictions: [
            { category: "Cooked Meals", riskLevel: "High", predictedWasteKg: 12.5, reason: "Hot food has a short shelf life; unclaimed portions spoil within 4 hours.", recommendation: "Notify shelters 2 hours before closing time for faster claims." },
            { category: "Bakery", riskLevel: "Medium", predictedWasteKg: 7.2, reason: "Bread and pastries degrade in texture overnight.", recommendation: "List bakery items early morning for same-day pickup." },
            { category: "Fresh Produce", riskLevel: "Low", predictedWasteKg: 3.0, reason: "Vegetables have longer shelf life but high volume surplus.", recommendation: "Bundle produce with meal listings to increase claim rate." },
          ],
          topRiskRestaurants: [
            { name: "The Green Table", riskLevel: "High", issue: "Multiple listings near expiry with no claims", suggestion: "Send push notifications to nearby shelters immediately." },
            { name: "Urban Bakehouse", riskLevel: "Medium", issue: "Bakery items listed too late in the day", suggestion: "List items by 8 AM for maximum exposure." },
          ],
          weeklyForecast: { expectedSurplusKg: 87.5, expectedRescueRate: 72, carbonAtRisk: 55.8, waterAtRisk: 22300 },
          insights: [
            "Hot food listings have a 68% higher claim rate when posted with photos.",
            "Shelters claim items 3x faster during weekday lunch hours.",
            "Produce bundles are claimed 40% more often than individual items.",
          ],
          urgentActions: [
            { action: "Reach out to City Hope Shelter for 25 unclaimed meal portions at The Green Table", impact: "Saves 31.25 kg CO2 and prevents 12,500L water waste", priority: "High" },
            { action: "Bundle Urban Bakehouse items into family packs", impact: "Increases claim rate by estimated 35%", priority: "Medium" },
          ],
          positiveHighlights: [
            "Platform has rescued over 47 kg of food this week!",
            "Community Kitchen has claimed every listing within 2 hours — exemplary partner!",
          ],
        },
      });
    }
    return res.status(500).json({ success: false, error: "Failed to generate prediction: " + err.message });
  }
}
