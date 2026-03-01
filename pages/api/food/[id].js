import { getFoodById } from "../../../lib/db";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const food = getFoodById(id);
    if (!food) return res.status(404).json({ success: false, error: "Food listing not found" });
    return res.status(200).json({ success: true, data: food });
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
