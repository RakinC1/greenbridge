import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateWastePrediction(data) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are GreenBridge AI, an expert in food waste reduction and supply chain optimization.

Analyze the following food rescue platform data and provide actionable predictions and insights:

Platform Data:
${JSON.stringify(data, null, 2)}

Please provide a comprehensive analysis in the following JSON format (respond with ONLY valid JSON, no markdown):
{
  "wastePredictions": [
    {
      "category": "food category name",
      "riskLevel": "High|Medium|Low",
      "predictedWasteKg": number,
      "reason": "brief explanation",
      "recommendation": "actionable recommendation"
    }
  ],
  "topRiskRestaurants": [
    {
      "name": "restaurant name",
      "riskLevel": "High|Medium|Low",
      "issue": "main issue",
      "suggestion": "specific suggestion"
    }
  ],
  "weeklyForecast": {
    "expectedSurplusKg": number,
    "expectedRescueRate": number,
    "carbonAtRisk": number,
    "waterAtRisk": number
  },
  "insights": [
    "key insight 1",
    "key insight 2",
    "key insight 3"
  ],
  "urgentActions": [
    {
      "action": "action description",
      "impact": "expected impact",
      "priority": "High|Medium|Low"
    }
  ],
  "positiveHighlights": [
    "positive achievement 1",
    "positive achievement 2"
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code fences if present
  const clean = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(clean);
}

export async function generateImpactReport(stats) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are GreenBridge AI. Generate an inspiring and factual environmental impact summary based on this data:

${JSON.stringify(stats, null, 2)}

Respond in this exact JSON format (no markdown, only JSON):
{
  "headline": "one compelling headline sentence about the impact",
  "carbonEquivalents": [
    { "label": "equivalent action", "value": "X units", "icon": "emoji" }
  ],
  "waterEquivalents": [
    { "label": "equivalent action", "value": "X units", "icon": "emoji" }
  ],
  "communityImpact": "2-3 sentence paragraph about community benefit",
  "environmentalNarrative": "2-3 sentence paragraph about environmental benefit",
  "motivationalMessage": "short inspiring closing message (1 sentence)"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(clean);
}
