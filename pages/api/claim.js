import { claimFood, getShelters } from "../../lib/db";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { foodId, shelterId } = req.body;
    if (!foodId || !shelterId) {
      return res.status(400).json({ success: false, error: "foodId and shelterId are required" });
    }
    const shelters = getShelters();
    const shelter = shelters.find((s) => s.id === shelterId);
    if (!shelter) return res.status(404).json({ success: false, error: "Shelter not found" });

    const result = claimFood(foodId, shelterId);
    if (result.error) return res.status(400).json({ success: false, error: result.error });
    return res.status(200).json({ success: true, data: result, shelter });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
