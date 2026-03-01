import { getShelters } from "../../lib/db";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: getShelters() });
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
